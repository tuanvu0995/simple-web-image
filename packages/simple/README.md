# simple-web-image

A simple library to process the image in many sizes for the website.

## Description

With this library, you can quickly create multiple versions of your uploaded images in different sizes.

Default sizes:

```javascript
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
```

## Examples

```sh
npm install simple-web-image
```

```javascript
const SimpleWebImage = require('simple-web-image')

SimpleWebImage({ input: './image/TEST.JPG', output: './output' }).catch(console.log)

// or await

async function run() {
  try {
    await SimpleWebImage({ input: './image/TEST.JPG', output: './output' })
  } catch (error) {
    console.log(error)
  }
}
```

## Options

```javascript
{
    // The input source. This option can be a path (string) or Readstream.
    input: './image.png',

    // The output directory. This path should be unique for each image.
    output: './output',

    // Optional - The valid image format (jpg, jpeg, png).
    format = 'jpg',

    // Optional - The custom transform
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

If you like what you see, star us on GitHub

Find a bug, a typo, or something that’s not documented well? We’d love for you to open an issue telling us what we can improve! This project uses [changesets](https://github.com/changesets/changesets), please use their commit message format.

We love your pull requests! Check out our Good First Issue and Help Wanted tags for good issues to tackle. Check out our contributors guide for more information

## License

[MIT](packages/simple/LICENSE)
