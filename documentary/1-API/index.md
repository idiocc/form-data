## API

The package is available by importing its default and named functions:

```js
import FormData, {
  diskStorage, memoryStorage, FormDataError,
} from '@multipart/form-data'
```

%~%

## `class FormData`

This class is used to create middleware according to the required file upload strategy.

<typedef narrow slimFunctions name="FormData">types/misc.xml</typedef>

Creates a new instance according to the config. It is later used to access the middleware functions described below.

<include-typedefs>@goa/busboy</include-typedefs>

<typedef>types/index.xml</typedef>

<!-- ### `single` -->

<!-- Accept a single file. -->

<table>
<!-- block-start -->
<!-- <thead> -->
<!-- <tr><th><a href="example">Source</a></th><th>Output</th></tr> -->
<!-- </thead> -->
<tr><td colspan="2"><md2html><h3>[`single(fieldname)`](###): Accept a single file.</h3></md2html></td></tr>
<tr><td>

%EXAMPLE: example/single, ../src => @multipart/form-data%
</td>
<td>

%FORK-js example/single%
</td></tr>
<!-- block-start -->
<tr><td colspan="2"><md2html><h3>[`array(fieldname, maxCount)`](###): Accept multiple files under the same field name.</h3></md2html></td></tr>

<tr><td>

%EXAMPLE: example/array, ../src => @multipart/form-data%
</td>
<td>

%FORK-js example/array%
</td></tr>

<!-- block-start -->
<tr><td colspan="2">
<!-- Show <em>FormDataField</em> Interface -->
<md2html><h3>[`fields(Array&lt;FormDataField&gt;)`](###): Accept files according to the configured fields and place them in a hashmap.</h3> </md2html>
<details>
<summary>
<md2html>Click to show the _FormDataField_ interface.</md2html>
</summary>

%TYPEDEF types/misc.xml FormDataField%
</details>
</td></tr>

<tr><td>

%EXAMPLE: example/fields, ../src => @multipart/form-data%
</td>
<td>

%FORK-js example/fields%
</td></tr>
<!-- block-start -->
<tr><td colspan="2"><md2html><h3>[`none()`](###): Do not accept files, only fields.</h3></md2html></td></tr>

<tr><td>

%EXAMPLE: example/none, ../src => @multipart/form-data%
</td>
<td>

%FORK-js example/none%
</td></tr>

<!-- continued in the next file -->