import { existsSync, mkdirSync } from 'fs'

/**
 * @summary Creates a directory if it does not exist
 * @param path - The path to the directory
 */
export default function createDirIfNotExists(path: string): void {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true })
  }
}
