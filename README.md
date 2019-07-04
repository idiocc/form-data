# @multipart/form-data

[![npm version](https://badge.fury.io/js/@multipart/form-data.svg)](https://npmjs.org/package/@multipart/form-data)

`@multipart/form-data` is [fork] The Multer Middleware For Handling Multipart/Form-Data Written For Koa In ES6 And Optimised With JavaScript Compiler.

```sh
yarn add @multipart/form-data
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`multer(arg1: string, arg2?: boolean)`](#mynewpackagearg1-stringarg2-boolean-void)
  * [`_@multipart/form-data.Config`](#type-_@multipart/form-dataconfig)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default function:

```js
import multer from '@multipart/form-data'
```

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `multer(`<br/>&nbsp;&nbsp;`arg1: string,`<br/>&nbsp;&nbsp;`arg2?: boolean,`<br/>`): void`

Call this function to get the result you want.

__<a name="type-_@multipart/form-dataconfig">`_@multipart/form-data.Config`</a>__: Options for the program.

|   Name    |       Type       |    Description    | Default |
| --------- | ---------------- | ----------------- | ------- |
| shouldRun | <em>boolean</em> | A boolean option. | `true`  |
| __text*__ | <em>string</em>  | A text to return. | -       |

```js
/* alanode example/ */
import multer from '@multipart/form-data'

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