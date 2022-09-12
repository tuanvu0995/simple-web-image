import path from 'path'
import sharp, { FitEnum, FormatEnum } from 'sharp'
import { promisify } from 'util'
import {
  ReadStream,
  readdir,
  unlink,
  existsSync,
  mkdirSync,
  createReadStream,
  createWriteStream,
  WriteStream,
} from 'fs'
import { pipeline, PassThrough } from 'stream'

interface ITransform {
  size: number
  fit: keyof FitEnum
  format: keyof FormatEnum
  width?: number
  height?: number
}

interface IImageTransform {
  name: string
  transform: ITransform
}

interface SimpleWebImageOptions {
  input: string | ReadStream
  output: string
  format?: string
  transforms?: [IImageTransform]
}

const TRANSFORMS: IImageTransform[] = [
  { name: 'image', transform: { size: 1600, fit: 'inside', format: 'jpg' } },
  { name: 'large', transform: { size: 1000, fit: 'inside', format: 'jpg' } },
  { name: 'medium', transform: { size: 600, fit: 'inside', format: 'jpg' } },
  { name: 'small', transform: { size: 235, fit: 'cover', format: 'png' } },
  { name: 'thumbnail', transform: { size: 100, fit: 'cover', format: 'png' } },
]

const pipelineAsync = promisify(pipeline)

/**
 * @summary Delete all proccessed images when receive error
 * @param outputDir
 */
function rollback(outputDir: string): void {
  readdir(outputDir, (err: NodeJS.ErrnoException, files: string[]) => {
    if (err) throw err

    for (const file of files) {
      unlink(path.join(outputDir, file), (err: NodeJS.ErrnoException) => {
        if (err) throw err
      })
    }
  })
}

function createDirIfNotExists(path: string): void {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true })
  }
}

export = async function SimpleWebImage(options: SimpleWebImageOptions): Promise<void> {
  const { input, output, format = 'jpg', transforms = undefined } = options

  const sourceStream: ReadStream = typeof input === 'string' ? createReadStream(input) : input

  const originOutputPath = `${output}/origin.${format}`
  createDirIfNotExists(output)

  try {
    const pass = new PassThrough()
    sourceStream.pipe(pass)
    await pipelineAsync(pass, createWriteStream(originOutputPath))
  } catch (err) {
    console.log(err)
    throw new Error("Can't copy the origin image")
  }

  const tasks = (transforms || TRANSFORMS).map(({ name, transform }) => {
    const transformer = sharp()
      .resize(transform.width ? transform.width : transform.size, transform.height, {
        fit: transform.fit,
      })
      .toFormat(transform.format)

    const readStream: ReadStream = createReadStream(originOutputPath)
    const outputPath = `${output}/${name}.${transform.format}`
    const writeStream: WriteStream = createWriteStream(outputPath)

    return pipelineAsync(readStream, transformer, writeStream)
  })

  try {
    await Promise.all(tasks)
  } catch (err) {
    console.error('Pipeline failed', err)
    rollback(output)
    throw new Error("Can't process the input image")
  }
}
