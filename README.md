# @multipart/form-data

[![npm version](https://badge.fury.io/js/%40multipart%2Fform-data.svg)](https://npmjs.org/package/@multipart/form-data)

`@multipart/form-data` is Multipart/Form-Data And File Upload Middleware For Koa Written In ES6 And Optimised With [JavaScript Compiler](https://compiler.page).

Originally, this is a [Multer](https://github.com/expressjs/multer) fork, however it was rewritten specifically for Koa2, and the interfaces were updated to be async rather than callbacks.

```sh
yarn add @multipart/form-data
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`class MultipartFormData`](#class-multipartformdata)
  * [`constructor(options: FormDataConfig?)`](#constructoroptions-formdataconfig-void)
    * [`_multipart.FormDataFileFilter`](#type-_multipartformdatafilefilter)
    * [`_multipart.FormData`](#type-_multipartformdata)
    * [`_multipart.FormDataStorageEngine`](#type-_multipartformdatastorageengine)
    * [`_multipart.FormDataFile`](#type-_multipartformdatafile)
    * [`_multipart.FormDataField`](#type-_multipartformdatafield)
    * [`_multipart.FormDataError`](#type-_multipartformdataerror)
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

### `constructor(`<br/>&nbsp;&nbsp;`options: FormDataConfig?,`<br/>`): void`

Creates a new instance according to the config. It is later used to access the middleware functions described below.

[`import('@goa/busboy').BusBoyLimits`](https://github.com/idiocc/busboy#type-_goabusboylimits) __<a name="type-_goabusboylimits">`_goa.BusBoyLimits`</a>__: Various limits on incoming data.

[`import('http').IncomingMessage`](https://nodejs.org/api/http.html#http_class_http_incomingmessage) __<a name="type-httpincomingmessage">`http.IncomingMessage`</a>__

[`import('fs').Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) __<a name="type-fsstats">`fs.Stats`</a>__

`import('stream').Readable` __<a name="type-streamreadable">`stream.Readable`</a>__

`function(http.IncomingMessage, _multipart.FormDataFile): !Promise<boolean>` __<a name="type-_multipartformdatafilefilter">`_multipart.FormDataFileFilter`</a>__: The function to control which files are accepted.

__<a name="type-_multipartformdataconfig">`_multipart.FormDataConfig`</a>__

|     Name     |                                                                       Type                                                                        |                              Description                              | Default |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------- |
| dest         | <em>string</em>                                                                                                                                   | The directory where to store the files using the `DiskStorage`.       | -       |
| storage      | <em>[_multipart.FormDataStorageEngine](#type-_multipartformdatastorageengine)</em>                                                                | An _instance_ of a custom storage engine.                             | -       |
| fileFilter   | <em><a href="#type-_multipartformdatafilefilter" title="The function to control which files are accepted.">_multipart.FormDataFileFilter</a></em> | The file filter.                                                      | -       |
| limits       | <em><a href="#type-_goabusboylimits" title="Various limits on incoming data.">_goa.BusBoyLimits</a></em>                                          | The limits of the uploaded data.                                      | -       |
| preservePath | <em>boolean</em>                                                                                                                                  | Whether to keep the full path of files instead of just the base name. | `false` |

__<a name="type-_multipartformdata">`_multipart.FormData`</a>__

|    Name     |                                                                                 Type                                                                                  |                                                       Description                                                       |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| __single*__ | <em>function(string): _goa.Middleware</em>                                                                                                                            | Accept a single file. The first argument is the name of the field.                                                      |
| __array*__  | <em>function(string, number): _goa.Middleware</em>                                                                                                                    | Accept multiple files. The first argument is the name of the field, and the second argument is the max number of files. |
| __fields*__ | <em>function(!Array&lt;<a href="#type-_multipartformdatafield" title="The item to use in the .fields method.">_multipart.FormDataField</a>&gt;): _goa.Middleware</em> | Accept files according to the configured fields.                                                                        |
| __none*__   | <em>function(): _goa.Middleware</em>                                                                                                                                  | Do not accept files, only fields.                                                                                       |
| __any*__    | <em>function(): _goa.Middleware</em>                                                                                                                                  | Accept any fields and files.                                                                                            |

__<a name="type-_multipartformdatastorageengine">`_multipart.FormDataStorageEngine`</a>__

|       Name       |                                                                                             Type                                                                                             |           Description            |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| ___handleFile*__ | <em>function([!http.IncomingMessage](#type-httpincomingmessage), <a href="#type-_multipartformdatafile" title="The information about each file.">_multipart.FormDataFile</a>): !Promise</em> | Saves the file asynchronously.   |
| ___removeFile*__ | <em>function([!http.IncomingMessage](#type-httpincomingmessage), <a href="#type-_multipartformdatafile" title="The information about each file.">_multipart.FormDataFile</a>): !Promise</em> | Removes the file asynchronously. |

__<a name="type-_multipartformdatafile">`_multipart.FormDataFile`</a>__: The information about each file.

|       Name        |                       Type                       |                                               Description                                                |
| ----------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| __fieldname*__    | <em>string</em>                                  | The field name specified in the form.                                                                    |
| __originalname*__ | <em>string</em>                                  | The name of the file on the user's computer.                                                             |
| __encoding*__     | <em>string</em>                                  | The encoding type of the file.                                                                           |
| __mimetype*__     | <em>string</em>                                  | The mime type of the file.                                                                               |
| __size*__         | <em>number</em>                                  | The size of the file in bytes.                                                                           |
| __destination*__  | <em>string</em>                                  | The folder to which the file has been saved. Set by _DiskStorage_.                                       |
| __filename*__     | <em>string</em>                                  | The name of the file within the `destination`. Set by _DiskStorage_.                                     |
| __path*__         | <em>string</em>                                  | The full path to the uploaded file. Set by _DiskStorage_.                                                |
| __buffer*__       | <em>Buffer</em>                                  | The `Buffer` of the entire file. Set by _MemoryStorage_.                                                 |
| __stream*__       | <em>[stream.Readable](#type-streamreadable)</em> | The _Readable_ stream with the file data. This stream should not be read other than by a storage engine. |

__<a name="type-_multipartformdatafield">`_multipart.FormDataField`</a>__: The item to use in the .fields method.

|   Name    |      Type       |           Description           |
| --------- | --------------- | ------------------------------- |
| __name*__ | <em>string</em> | The name of the field.          |
| maxCount  | <em>number</em> | The maximum count of the field. |

__<a name="type-_multipartformdataerror">`_multipart.FormDataError`</a>__: An error object which extends Error.

|   Name    |      Type       |            Description             |
| --------- | --------------- | ---------------------------------- |
| __code*__ | <em>string</em> | The error code.                    |
| field     | <em>string</em> | The field which resulted in error. |

<p align="center"><a href="#table-of-contents"><img src="/.documentary/section-breaks/2.svg?sanitize=true"></a></p>

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