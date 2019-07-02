# @goa/multer

[![npm version](https://badge.fury.io/js/@goa/multer.svg)](https://npmjs.org/package/@goa/multer)

`@goa/multer` is [fork] The Multer Middleware For Handling Multipart/Form-Data Written For Koa In ES6 And Optimised With JavaScript Compiler.

```sh
yarn add @goa/multer
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`multer(arg1: string, arg2?: boolean)`](#mynewpackagearg1-stringarg2-boolean-void)
  * [`_@goa/multer.Config`](#type-_@goa/multerconfig)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default function:

```js
import multer from '@goa/multer'
```

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `multer(`<br/>&nbsp;&nbsp;`arg1: string,`<br/>&nbsp;&nbsp;`arg2?: boolean,`<br/>`): void`

Call this function to get the result you want.

__<a name="type-_@goa/multerconfig">`_@goa/multer.Config`</a>__: Options for the program.

|   Name    |       Type       |    Description    | Default |
| --------- | ---------------- | ----------------- | ------- |
| shouldRun | <em>boolean</em> | A boolean option. | `true`  |
| __text*__ | <em>string</em>  | A text to return. | -       |

```js
/* alanode example/ */
import multer from '@goa/multer'

(async () => {
  const res = await multer({
    text: 'example',
  })
  console.log(res)
})()
```
```
example
```

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/2.svg?sanitize=true"></a></p>

## Copyright

(c) [Idio][1] 2019

[1]: https://idio.cc

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/-1.svg?sanitize=true"></a></p>