import { createReadStream, ReadStream } from 'fs'
import sharp from 'sharp'
import { promisify } from 'util'
import { pipeline } from 'stream'
import { ConfigContract } from './contracts/ConfigContract'

import DriveContract from './contracts/DriveContract'
import LocalDrive from './lib/local'
import S3Drive from './lib/s3'

const defaultConfig: ConfigContract = {
  transforms: [
    { name: 'image', transform: { size: 1600, fit: 'inside', format: 'jpg' } },
    { name: 'large', transform: { size: 1000, fit: 'inside', format: 'jpg' } },
    { name: 'medium', transform: { size: 600, fit: 'inside', format: 'jpg' } },
    { name: 'small', transform: { size: 235, fit: 'cover', format: 'png' } },
    { name: 'thumbnail', transform: { size: 100, fit: 'cover', format: 'png' } },
  ],
  drives: {
    local: {
      rootDir: './tmp/simple-web-image',
    },
  },
}

const pipelineAsync = promisify(pipeline)

class SimpleWImg {
  driveInstance: DriveContract
  config: ConfigContract

  constructor(config?: ConfigContract) {
    this.config = { ...defaultConfig, ...config }
  }

  drive(name: string): SimpleWImg {
    switch (name) {
      case 'local':
        this.driveInstance = new LocalDrive(this.config.drives?.local)
        return this
      case 's3':
        this.driveInstance = new S3Drive(this.config.drives?.s3)
        return this
      default:
        throw new Error(`Drive ${name} not found`)
    }
  }

  /**
   * @summary Put image to drive
   * @param input - The file path or ReadStream
   * @param filePath - The file path + name will be saved (not include extension)
   */
  async put(input: string | ReadStream, filePath: string): Promise<void> {
    if (!this.driveInstance) {
      console.log('Using local drive')
      this.driveInstance = new LocalDrive(this.config)
    }

    const sourceStream: ReadStream = typeof input === 'string' ? createReadStream(input) : input

    const { transforms = [] } = this.config

    const tasks = transforms.map(({ name, transform }) => {
      const transformer = sharp()
        .resize(transform.width ? transform.width : transform.size, transform.height, {
          fit: transform.fit,
        })
        .toFormat(transform.format)

      const outputPath = `${filePath}-${name}.${transform.format}`

      return pipelineAsync(sourceStream, transformer, this.driveInstance.put(outputPath))
    })

    try {
      await Promise.all(tasks)
    } catch (err) {
      console.error('Pipeline failed', err)
      await this.driveInstance.rollback(filePath)
      throw new Error("Can't process the input image")
    }
  }
}

export = function SimpleWebImage(config?: ConfigContract): SimpleWImg {
  return new SimpleWImg(config)
}
