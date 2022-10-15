import { createWriteStream, readdir, unlink, WriteStream } from 'fs'
import { join, dirname } from 'path'
import DriveContract from '../contracts/DriveContract'
import createDirIfNotExists from '../utils/createDirIfNotExists'

export default class LocalDrive extends DriveContract {
  public rootDir: string

  init(): void {
    this.rootDir = this.config.rootDir
  }

  put(filePath: string): WriteStream {
    const path = join(this.rootDir, filePath)
    createDirIfNotExists(dirname(path))
    return createWriteStream(path)
  }

  async rollback(filePath: string): Promise<void> {
    const path = join(this.rootDir, filePath)
    readdir(path, (err: NodeJS.ErrnoException, files: string[]) => {
      if (err) throw err

      for (const file of files) {
        unlink(join(path, file), (err: NodeJS.ErrnoException) => {
          if (err) throw err
        })
      }
    })
  }
}
