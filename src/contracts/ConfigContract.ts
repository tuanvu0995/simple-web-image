import { FitEnum, FormatEnum } from 'sharp'

export interface ITransform {
  size: number
  fit: keyof FitEnum
  format: keyof FormatEnum
  width?: number
  height?: number
}

export interface IImageTransform {
  name: string
  transform: ITransform
}

export interface LocalDriveConfig {
  rootDir?: string
}

export interface S3DriveConfig {
  accessKeyId: string
  secretAccessKey: string
  bucket: string
  region: string
}

export interface IDrives {
  local: LocalDriveConfig
  s3?: S3DriveConfig
}

export interface ConfigContract {
  drives?: IDrives
  transforms?: IImageTransform[]
  format?: keyof FormatEnum
}
