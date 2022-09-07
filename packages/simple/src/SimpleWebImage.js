const path = require('path')
const sharp = require('sharp')
const { readdir, unlink, createReadStream, createWriteStream } = require('fs')
const { pipeline, PassThrough } = require('stream')

const TRANSFORMS = [
  {
    name: 'image',
    transform: { size: 1600, fit: 'inside', format: 'jpg' },
  },
  {
    name: 'large',
    transform: { size: 1000, fit: 'inside', format: 'jpg' },
  },
  {
    name: 'medium',
    transform: { size: 600, fit: 'inside', format: 'jpg' },
  },
  {
    name: 'small',
    transform: { size: 235, fit: 'cover', format: 'png' },
  },
  {
    name: 'thumbnail',
    transform: { size: 100, fit: 'cover', format: 'png' },
  },
]

/**
 * @summary Create promise pipeline
 * @param  {...any} args Streams
 * @returns {Promise}
 */
function createPromisePipeline(...args) {
  return new Promise((resolve, reject) =>
    pipeline(...args, (err) => {
      if (err) return reject(err)
      resolve()
    })
  )
}

function rollback(outputDir) {
  readdir(outputDir, (err, files) => {
    if (err) throw err

    for (const file of files) {
      unlink(path.join(outputDir, file), (err) => {
        if (err) throw err
      })
    }
  })
}

/**
 * @summary SimpleWebImage
 * @method
 * @param {Object} options
 */
async function SimpleWebImage(options = {}) {
  const { input, output, format = 'jpg', transforms = undefined } = options

  let sourceStream = input
  if (typeof input === 'string') {
    sourceStream = createReadStream(input)
  }

  const originOutputPath = `${output}/origin.${format}`

  try {
    const pass = new PassThrough()
    sourceStream.pipe(pass)
    await createPromisePipeline(pass, createWriteStream(originOutputPath))
  } catch (err) {
    console.log(err)
    throw new Error("Can't copy the origin image")
  }

  const tasks = (transforms || TRANSFORMS).map(({ name, transform }) => {
    const transformer = sharp()
      .resize({
        width: transform.width ? transform.width : transform.size,
        height: transform.height,
        fit: transform.fit,
      })
      .toFormat(transform.format)

    const readStream = createReadStream(originOutputPath)
    const outputPath = `${output}/${name}.${transform.format}`
    const writeStream = createWriteStream(outputPath)

    return createPromisePipeline(readStream, transformer, writeStream)
  })

  try {
    await Promise.all(tasks)
    return true
  } catch (err) {
    console.error('Pipeline failed', err)
    rollback(output)
    throw new Error("Can't process the input image")
  }
}

module.exports = SimpleWebImage
