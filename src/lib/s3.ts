import aws from 'aws-sdk'
import stream, { PassThrough } from 'stream'

import DriveContract from '../contracts/DriveContract'

export default class S3Drive extends DriveContract {
  s3: aws.S3

  init(): void {
    this.s3 = new aws.S3({
      apiVersion: '2006-03-01',
      accessKeyId: this.config.accessKeyId,
      secretAccessKey: this.config.secretAccessKey,
    })
  }

  put(fileName: string): PassThrough {
    return this.upload(fileName)
  }

  async rollback(filePath: string): Promise<void> {
    console.log('s3 rollback: ', filePath)
  }

  upload(fileName: string): PassThrough {
    const pass = new stream.PassThrough()

    const params = {
      Bucket: this.config.bucket,
      Key: fileName,
      Body: pass,
      CreateBucketConfiguration: {
        LocationConstraint: this.config.region,
      },
    }

    this.s3.upload(params, (error, data) => {
      if (error) {
        throw error
      }
      console.info(data)
    })

    return pass
  }
}
