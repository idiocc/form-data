## API

The package is available by importing its default and named functions:

```js
import MultipartFormData, {
  diskStorage, memoryStorage, FormDataError,
} from '@multipart/form-data'
```

%~%

## `class MultipartFormData`

This class is used to create middleware according to the required file upload strategy.

```### constructor => MultipartFormData
[
  ["options", "FormDataConfig?"]
]
```

Creates a new instance according to the config. It is later used to access the middleware functions described below.

%TYPEDEF types/index.xml FormDataConfig%

<details>
<summary>
The constructor will create an instance with the methods described below.
</summary>

%TYPEDEF types/index.xml FormData%
</details>

<!-- ### `single` -->

<!-- Accept a single file. -->

<table>
<!-- block-start -->
<tr><th><a href="example">Source</a></th><th>Output</th></tr>
<tr><td>

%EXAMPLE: example/single, ../src => @multipart/form-data%
</td>
<td>

%FORK-js example/single%
</td></tr>
<tr><td colspan="2"><md2html>[`single(fieldname)`](###): Accept a single file.</md2html></td></tr>
<!-- block-start -->
<tr><td>

%EXAMPLE: example/array, ../src => @multipart/form-data%
</td>
<td>

%FORK-js example/array%
</td></tr>
<tr><td colspan="2"><md2html>[`array(fieldname, maxCount)`](###): Accept multiple files under the same field name.</md2html></td></tr>
</table>

%~%