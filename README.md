# @multipart/form-data

[![npm version](https://badge.fury.io/js/%40multipart%2Fform-data.svg)](https://www.npmjs.com/package/@multipart/form-data)

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
- [`class FormData`](#class-formdata)
  * [`FormData`](#type-formdata)
  * [`FormDataConfig`](#type-formdataconfig)
  * [<code>single(fieldname)</code>](#singlefieldname)
  * [<code>array(fieldname, maxCount)</code>](#arrayfieldname-maxcount)
  * [<code>fields(Array&lt;FormDataField&gt;)</code>](#fieldsarrayltformdatafieldgt)
    * [`FormDataField`](#type-formdatafield)
  * [<code>none()</code>](#none)
  * [<code>any()</code>](#any)
- [`FormDataFile`](#formdatafile)
- [Copyright & License](#copyright--license)

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/0.svg?sanitize=true">
</a></p>

## API

The package is available by importing its default and named functions:

```js
import FormData, {
  diskStorage, memoryStorage, FormDataError,
} from '@multipart/form-data'
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/1.svg?sanitize=true">
</a></p>

## `class FormData`

This class is used to create middleware according to the required file upload strategy.

__<a name="type-formdata">`FormData`</a>__: An instance to create middleware.
<table>
 <thead><tr>
  <th>Name</th>
  <th>Type &amp; Description</th>
 </tr></thead>
 <tr>
  <td rowSpan="3" align="center"><ins>constructor</ins></td>
  <td><em>new (options?: <a href="#type-formdataconfig" title="The configuration for the instance.">!FormDataConfig</a>) => <a href="#type-formdata" title="An instance to create middleware.">FormData</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Creates a new form-data instance.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>single</ins></td>
  <td><em>(name: string) => <a href="#type-_goamiddleware">!_goa.Middleware</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Accept a single file.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>array</ins></td>
  <td><em>(name: string, maxFiles: string) => <a href="#type-_goamiddleware">!_goa.Middleware</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Accept multiple files.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>fields</ins></td>
  <td><em>(fields: !Array&lt;<a href="#type-formdatafield" title="The item to use in the `.fields` method.">FormDataField</a>&gt;) => <a href="#type-_goamiddleware">!_goa.Middleware</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Accept files according to the configured fields.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>none</ins></td>
  <td><em>() => <a href="#type-_goamiddleware">!_goa.Middleware</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Do not accept files, only fields.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>any</ins></td>
  <td><em>() => <a href="#type-_goamiddleware">!_goa.Middleware</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Accept any fields and files.
  </td>
 </tr>
</table>

Creates a new instance according to the config. It is later used to access the middleware functions described below.


__<a name="type-formdataconfig">`FormDataConfig`</a>__: The configuration for the instance.


|     Name     |                                                                 Type                                                                 |                                                                      Description                                                                      | Default |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| dest         | <em>string</em>                                                                                                                      | The directory where to store the files using the `DiskStorage`. If not specified, files will be saved in the system's temp directory (`os.tmpdir()`). | -       |
| storage      | <em>FormDataStorageEngine</em>                                                                                                       | An _instance_ of a custom storage engine.                                                                                                             | -       |
| fileFilter   | <em>FormDataFileFilter</em>                                                                                                          | The file filter.                                                                                                                                      | -       |
| limits       | <em><a href="https://github.com/idiocc/busboy#type-busboylimits" title="Various limits on incoming data.">_goa.BusBoyLimits</a></em> | The limits of the uploaded data.                                                                                                                      | -       |
| preservePath | <em>boolean</em>                                                                                                                     | Whether to keep the full path of files instead of just the base name.                                                                                 | `false` |

<table>
<tr><td colspan="2"><h3><a name="singlefieldname"><code>single(fieldname)</code></a>: Accept a single file.</h3></td></tr>
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
  filename: 'afb49cada5f721d7fa8337f072d03ec5',
  path: 'temp/afb49cada5f721d7fa8337f072d03ec5',
  size: 12 }
```
</td></tr>
<tr><td colspan="2"><h3><a name="arrayfieldname-maxcount"><code>array(fieldname, maxCount)</code></a>: Accept multiple files under the same field name.</h3></td></tr>

<tr><td>

```js
import Multipart from '@multipart/form-data'
import Goa from '@goa/koa'

const app = new Goa()
const multipart = new Multipart({
  dest: 'temp',
  preservePath: true,
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
    originalname: 'test/fixture/test.txt',
    encoding: '7bit',
    mimetype: 'application/octet-stream',
    destination: 'temp',
    filename: '0fa202db40',
    path: 'temp/0fa202db40',
    size: 12 },
  { fieldname: 'file',
    originalname: 'test/fixture/test.txt',
    encoding: '7bit',
    mimetype: 'application/octet-stream',
    destination: 'temp',
    filename: '149e4b08d6',
    path: 'temp/149e4b08d6',
    size: 12 } ]
```
</td></tr>

<tr><td colspan="2">
<h3><a name="fieldsarrayltformdatafieldgt"><code>fields(Array&lt;FormDataField&gt;)</code></a>: Accept files according to the configured fields and place them in a hashmap.</h3>
<details>
<summary>
Click to show the <em>FormDataField</em> interface.
</summary>

__<a name="type-formdatafield">`FormDataField`</a>__: The item to use in the `.fields` method.

|   Name    |      Type       |           Description           |
| --------- | --------------- | ------------------------------- |
| __name*__ | <em>string</em> | The name of the field.          |
| maxCount  | <em>number</em> | The maximum count of the field. |
</details>
</td></tr>

<tr><td>

```js
import Multipart from '@multipart/form-data'
import Goa from '@goa/koa'

const app = new Goa()
const multipart = new Multipart({
  dest: 'temp',
})
const middleware = multipart.fields([
  { name: 'file', maxCount: 2 },
  { name: 'picture', maxCount: 1 },
])
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
Files: { file: 
   [ { fieldname: 'file',
       originalname: 'test.txt',
       encoding: '7bit',
       mimetype: 'application/octet-stream',
       destination: 'temp',
       filename: '13093f0764',
       path: 'temp/13093f0764',
       size: 12 },
     { fieldname: 'file',
       originalname: 'test.txt',
       encoding: '7bit',
       mimetype: 'application/octet-stream',
       destination: 'temp',
       filename: '22e2e6e6f7',
       path: 'temp/22e2e6e6f7',
       size: 12 } ],
  picture: 
   [ { fieldname: 'picture',
       originalname: 'large.jpg',
       encoding: '7bit',
       mimetype: 'application/octet-stream',
       destination: 'temp',
       filename: '352a1aea6a',
       path: 'temp/352a1aea6a',
       size: 1592548 } ] }
```
</td></tr>
<tr><td colspan="2"><h3><a name="none"><code>none()</code></a>: Do not accept files, only fields.</h3></td></tr>

<tr><td>

```js
import Multipart from '@multipart/form-data'
import Goa from '@goa/koa'

const app = new Goa()
const multipart = new Multipart({
  dest: 'temp',
})
const middleware = multipart.none()
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
Files: undefined
```
</td></tr>



<tr><td colspan="2"><h3><a name="any"><code>any()</code></a>: Accept all files and fields.</h3></td></tr>

<tr><td>

```js
import Multipart from '@multipart/form-data'
import Goa from '@goa/koa'

const app = new Goa()
const multipart = new Multipart({
  dest: 'temp',
})
const middleware = multipart.any()
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
    filename: '7218bd891a',
    path: 'temp/7218bd891a',
    size: 12 },
  { fieldname: 'picture',
    originalname: 'large.jpg',
    encoding: '7bit',
    mimetype: 'application/octet-stream',
    destination: 'temp',
    filename: 'e7a8050980',
    path: 'temp/e7a8050980',
    size: 1592548 } ]
```
</td></tr>
</table>

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/2.svg?sanitize=true">
</a></p>

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

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/3.svg?sanitize=true">
</a></p>



## Copyright & License

GNU Affero General Public License v3.0

[Original work](https://github.com/expressjs/multer) by Multer's contributors under MIT license found in [COPYING](COPYING).

<table>
  <tr>
    <th>
      <a href="https://artd.eco">
        <img width="100" src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png"
          alt="Art Deco">
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
        <img width="100" src="https://raw.githubusercontent.com/idiocc/cookies/master/wiki/arch4.jpg"
          alt="Tech Nation Visa">
      </a>
    </th>
    <th><a href="https://www.technation.sucks">Tech Nation Visa Sucks</a></th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/-1.svg?sanitize=true">
</a></p>