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

A [guide for contributors](GUIDE)
covers reporting bugs, requesting features and submitting code changes.

## License

[MIT](LICENSE)
