[![npm version](https://badge.fury.io/js/simple-web-image.svg)](https://badge.fury.io/js/simple-web-image)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# simple-web-image

> A simple library to process the image to many sizes for the website.

# Features
* Optimize the image size and quality of the website.
* Resize images to different sizes to use for desktop and mobile. It works better for the lazy load.
* Store the output locally or in the cloud storage (ext: s3, minio, ...).

## Prerequisites

This project requires NodeJS (version 14 or later) and NPM. Node and NPM are really easy to install. To make sure you have them available on your machine, try running the following command.

```sh
$ npm -v && node -v
6.4.1
v14.15.0
```

## Getting Started


```sh
npm install simple-web-image
```

### Import
```typescript

// Commonjs
const SimpleWebImage = require('simple-web-image')

// ES module
import SimpleWebImage from 'simple-web-image'
```

### Basic usage:
```typescript

import SimpleWebImage from 'simple-web-image'

const config = {
    drives: {
        local: { rootDir: './tmp/output/simple-web-image' },
        s3: {
            accessKeyId: "THE AWS ACCESS KEY ID",
            secretAccessKey: "THE AWS SECRET ACCESS KEY",
            bucket: "simple-web-image"
            region: "us-east-1"
        }
    }
}

const simple = SimpleWebImage(config)

try {
    await simple.drive('local').put(req, './tmp/output/simple-web-image/image-name')
    await simple.drive('s3').put(req, './tmp/output/simple-web-image/image-name')
} catch (error) {
    // code here
}
```


### Using with `expressjs`:
```typescript

import express from "express"
import SimpleWebImage from "simple-web-image"
const app = express()
const port = 3000

const config = {}

const simple = SimpleWebImage(config)

// should upload with binary body
app.post("/upload", async (req, res) => {
  try {
    await simple.drive('local').put(req, './tmp/output/simple-web-image/image-name')
    res.send("upload success")
  } catch (err) {
    res.send("upload fail")
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

## Options

```javascript
{
    // The input source. This option can be a path (string) or ReadStream.
    input: './image.png',

    // The output directory. This path should be unique for each image.
    output: './output/unique-image-id',

    // Optional - The input format. This field is required for correct image processing. If undefined, "jpg" will be used, but that may be risky.
    format = 'jpg',

    // Optional - The custom transforms
    transform: [
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
        }
    ]
}

```

## Contributing

Any contributions from the community are welcome.

Find a bug, a typo, or something that’s not documented well? We’d love for you to open an issue telling us what we can improve! Follow the [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

We love your pull requests! Check out our Good First Issue and Help Wanted tags for good issues to tackle. Check out our contributors guide for more information.

If you like what you see, star us on GitHub

## Roadmap

See the [ROADMAP.md](ROADMAP.md) file

## License

[MIT License](LICENSE) © Vu Lai
