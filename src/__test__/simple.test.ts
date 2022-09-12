import { readdirSync, rmSync } from 'fs'

import SimpleWebImage from '..'

describe('Simple Web Image', () => {
  const outputDir = './tmp/output'

  beforeEach(() => {
    rmSync(outputDir, { recursive: true, force: true })
  })

  it('should generate correct images', async () => {
    const expectedOutput = ['image.jpg', 'large.jpg', 'medium.jpg', 'origin.png', 'small.png', 'thumbnail.png']
    await SimpleWebImage({ input: './assets/test-img.png', output: outputDir, format: 'png' })

    const files: string[] = readdirSync(outputDir)
    expect(files.length).toBe(6)
    expect(files).toEqual(expectedOutput)
  })

  it.skip('should throw an error when input file is not correct', async () => {
    const run = async () => {
      try {
        await SimpleWebImage({ input: './assets/test.png', output: outputDir, format: 'png' })
      } catch (err) {
        console.log(err)
      }
    }
    await expect(run).toThrow(Error)
  })
})
