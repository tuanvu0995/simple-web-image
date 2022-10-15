import { createReadStream, existsSync, rmSync } from 'fs'
import path from 'path'

import { ConfigContract } from '../contracts/ConfigContract'
import SimpleWebImage from '../simple'

const testOutput = './tmp/output/test'

const config: ConfigContract = {
  drives: {
    local: {
      rootDir: testOutput,
    },
    s3: {
      bucket: 'simple-web-image',
      region: 'us-east-1',
      accessKeyId: 'test',
      secretAccessKey: 'test/test',
    }
  },
}

const names = ['image.jpg', 'large.jpg', 'medium.jpg', 'small.png', 'thumbnail.png']

describe('Local Drive', () => {
  afterEach(() => {
    rmSync(testOutput, { recursive: true, force: true })
  })

  test('input is file path', async () => {
    const simpleWebImage = SimpleWebImage(config)
    const simple = simpleWebImage.drive('local')

    const uniqueFileName = 'test-path'
    await simple.put('./assets/test-img.png', uniqueFileName)

    names.map((name) => {
      expect(existsSync(path.resolve(__dirname, `../../${testOutput}/${uniqueFileName}-${name}`))).toBe(true)
    })
  })

  test('readStream is file path', async () => {
    const simpleWebImage = SimpleWebImage(config)
    const simple = simpleWebImage.drive('local')

    const readStream = createReadStream('./assets/test-img.png')

    const uniqueFileName = 'test-stream'
    await simple.put(readStream, uniqueFileName)

    names.map((name) => {
      expect(existsSync(path.resolve(__dirname, `../../${testOutput}/${uniqueFileName}-${name}`))).toBe(true)
    })
  })
})

describe('Local Drive', () => {
  afterEach(() => {
    rmSync(testOutput, { recursive: true, force: true })
  })

  test.skip('input is file path', async () => {
    const simpleWebImage = SimpleWebImage(config)
    const simple = simpleWebImage.drive('s3')

    const uniqueFileName = '2022-12-1/test-path'
    await simple.put('./assets/test-img.png', uniqueFileName)

    names.map((name) => {
      expect(existsSync(path.resolve(__dirname, `../../${testOutput}/${uniqueFileName}-${name}`))).toBe(true)
    })

    // todo: check if file exists on s3
  })

})
