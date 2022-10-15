import { WriteStream } from 'fs'
import { PassThrough } from 'stream'

export default abstract class DriveContract {
  config: any

  constructor(config: any) {
    this.config = config

    this.init()
  }

  /**
   * @summary Initialize the drive instance
   */
  abstract init(): void

  /**
   * @summary Put a file on the drive
   * @param filePath - The path to the file
   */
  abstract put(filePath: string): WriteStream | PassThrough

  /**
   * @summary Rollback completed files when an error occurs
   * @param filePath - The file path to be deleted
   */
  abstract rollback(filePath: string): Promise<void>
}
