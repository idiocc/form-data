# @multipart/form-data

[![npm version](https://badge.fury.io/js/%40multipart%2Fform-data.svg)](https://npmjs.org/package/@multipart/form-data)

`@multipart/form-data` is Multipart/Form-Data And File Upload Middleware For Koa Written In ES6 And Optimised With [JavaScript Compiler](https://compiler.page).

Originally, this was a [Multer](https://github.com/expressjs/multer) fork, however it was rewritten specifically for Koa2, and the interfaces were updated to be async rather than callbacks. Differences:

 - When the file size limit is reached, the next middleware is called, rather than waiting to drain the request stream. This can result in the client-side **EPIPE** (connection reset) errors when sending files larger than allowed. But ideally, _Node.JS_ applications should be run behind a proxy such as NginX to limit the upload size.
 - Removes the unnecessary `typeis` dependency that includes the `mime-type` database, just checks the _Content-Type_ to start with `multipart/form-data`.
 - Compiled with _Google Closure Compiler_ and has just 1 dependency ([`text-decoding`](https://github.com/idiocc/text-decoding)) to decode non-utf8 fields (e.g., when a form submitted had the [`accept-charset`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#Attributes) attribute).

```sh
yarn add @multipart/form-data
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`class MultipartFormData`](#class-multipartformdata)
  * [`constructor(options: FormDataConfig?): MultipartFormData`](#constructoroptions-formdataconfig-multipartformdata)
    * [`FormDataConfig`](#type-formdataconfig)
  * [<code>single(fieldname)</code>](#singlefieldname)
  * [<code>array(fieldname, maxCount)</code>](#arrayfieldname-maxcount)
- [`FormDataFile`](#formdatafile)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default and named functions:

```js
import MultipartFormData, {
  diskStorage, memoryStorage, FormDataError,
} from '@multipart/form-data'
```

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `class MultipartFormData`

This class is used to create middleware according to the required file upload strategy.

### `constructor(`<br/>&nbsp;&nbsp;`options: FormDataConfig?,`<br/>`): MultipartFormData`

Creates a new instance according to the config. It is later used to access the middleware functions described below.

__<a name="type-formdataconfig">`FormDataConfig`</a>__: The configuration for the instance.

|     Name     |              Type              |                                                                      Description                                                                      | Default |
| ------------ | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| dest         | <em>string</em>                | The directory where to store the files using the `DiskStorage`. If not specified, files will be saved in the system's temp directory (`os.tmpdir()`). | -       |
| storage      | <em>FormDataStorageEngine</em> | An _instance_ of a custom storage engine.                                                                                                             | -       |
| fileFilter   | <em>FormDataFileFilter</em>    | The file filter.                                                                                                                                      | -       |
| limits       | <em>_goa.BusBoyLimits</em>     | The limits of the uploaded data.                                                                                                                      | -       |
| preservePath | <em>boolean</em>               | Whether to keep the full path of files instead of just the base name.                                                                                 | `false` |

<details>
<summary>
The constructor will create an instance with the methods described below.
</summary>

__<a name="type-formdata">`FormData`</a>__: An instance to create middleware.

|    Name     |                              Type                               |                                                       Description                                                       |
| ----------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| __single*__ | <em>function(string): _goa.Middleware</em>                      | Accept a single file. The first argument is the name of the field.                                                      |
| __array*__  | <em>function(string, number): _goa.Middleware</em>              | Accept multiple files. The first argument is the name of the field, and the second argument is the max number of files. |
| __fields*__ | <em>function(!Array&lt;FormDataField&gt;): _goa.Middleware</em> | Accept files according to the configured fields.                                                                        |
| __none*__   | <em>function(): _goa.Middleware</em>                            | Do not accept files, only fields.                                                                                       |
| __any*__    | <em>function(): _goa.Middleware</em>                            | Accept any fields and files.                                                                                            |
</details>

<table>
<tr><th><a href="example">Source</a></th><th>Output</th></tr>
<tr><td>

```js
import Multipart from '@multipart/form-data'
import Goa from '@goa/koa'

const app = new Goa()
const multipart = new Multipart({
  dest: 'temp',
})
const middleware = multipart.single('file')
app.use(middleware)
app.use((ctx) => {
  console.log('Fields: %O', ctx.req.body)
  delete ctx.req.file.stream
  console.log('File: %O', ctx.req.file)
})
```
</td>
<td>

```js
Fields: { hello: 'world', name: 'multipart' }
File: { fieldname: 'file',
  originalname: 'test.txt',
  encoding: '7bit',
  mimetype: 'application/octet-stream',
  destination: 'temp',
  filename: '5c35e781fbb0305f157ea498e8b6e462',
  path: 'temp/5c35e781fbb0305f157ea498e8b6e462',
  size: 12 }
```
</td></tr>
<tr><td colspan="2"><a name="singlefieldname"><code>single(fieldname)</code></a>: Accept a single file.</td></tr>
<tr><td>

```js
import Multipart from '@multipart/form-data'
import Goa from '@goa/koa'

const app = new Goa()
const multipart = new Multipart({
  dest: 'temp',
})
const middleware = multipart.array('file', 2)
app.use(middleware)
app.use((ctx) => {
  log('Fields', ctx.req.body)
  log('Files', ctx.req.files)
})
```
</td>
<td>

```js
Fields: { hello: 'world', name: 'multipart' }
Files: [ { fieldname: 'file',
    originalname: 'test.txt',
    encoding: '7bit',
    mimetype: 'application/octet-stream',
    destination: 'temp',
    filename: '8aa883127f',
    path: 'temp/8aa883127f',
    size: 12 },
  { fieldname: 'file',
    originalname: 'test.txt',
    encoding: '7bit',
    mimetype: 'application/octet-stream',
    destination: 'temp',
    filename: '2a45e32e56',
    path: 'temp/2a45e32e56',
    size: 12 } ]
```
</td></tr>
<tr><td colspan="2"><a name="arrayfieldname-maxcount"><code>array(fieldname, maxCount)</code></a>: Accept multiple files under the same field name.</td></tr>
</table>

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/2.svg?sanitize=true"></a></p>

## `FormDataFile`

_MultipartFormData_ adds a `body` object and a `file` or `files` object to the request object. The `body` hashmap contains the values of the text fields of the form, the `file` or `files` object contains the files uploaded via the form.

[`import('stream').Readable`](https://nodejs.org/api/stream.html#stream_readable_streams) __<a name="type-streamreadable">`stream.Readable`</a>__: A stream that pushes data when it becomes available.

__<a name="type-formdatafile">`FormDataFile`</a>__: The information about each file.

|       Name        |                                                           Type                                                           |                                               Description                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| __fieldname*__    | <em>string</em>                                                                                                          | The field name specified in the form.                                                                    |
| __originalname*__ | <em>string</em>                                                                                                          | The name of the file on the user's computer.                                                             |
| __encoding*__     | <em>string</em>                                                                                                          | The encoding type of the file.                                                                           |
| __mimetype*__     | <em>string</em>                                                                                                          | The mime type of the file.                                                                               |
| __size*__         | <em>number</em>                                                                                                          | The size of the file in bytes.                                                                           |
| __destination*__  | <em>string</em>                                                                                                          | The folder to which the file has been saved. Set by _DiskStorage_.                                       |
| __filename*__     | <em>string</em>                                                                                                          | The name of the file within the `destination`. Set by _DiskStorage_.                                     |
| __path*__         | <em>string</em>                                                                                                          | The full path to the uploaded file. Set by _DiskStorage_.                                                |
| __buffer*__       | <em>Buffer</em>                                                                                                          | The `Buffer` of the entire file. Set by _MemoryStorage_.                                                 |
| __stream*__       | <em><a href="#type-streamreadable" title="A stream that pushes data when it becomes available.">stream.Readable</a></em> | The _Readable_ stream with the file data. This stream should not be read other than by a storage engine. |

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/3.svg?sanitize=true"></a></p>

## Copyright

<table>
  <tr>
    <th>
      <a href="https://artd.eco">
        <img src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png" alt="Art Deco">
      </a>
    </th>
    <th>© <a href="https://artd.eco">Art Deco</a> for <a href="https://idio.cc">Idio</a> 2019</th>
    <th>
      <a href="https://idio.cc">
        <img src="https://avatars3.githubusercontent.com/u/40834161?s=100" width="100" alt="Idio">
      </a>
    </th>
    <th>
      <a href="https://www.technation.sucks" title="Tech Nation Visa">
        <img src="https://raw.githubusercontent.com/artdecoweb/www.technation.sucks/master/anim.gif"
          alt="Tech Nation Visa">
      </a>
    </th>
    <th><a href="https://www.technation.sucks">Tech Nation Visa Sucks</a></th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/-1.svg?sanitize=true"></a></p>