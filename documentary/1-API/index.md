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

```### constructor
[
  ["options", "FormDataConfig?"]
]
```

Creates a new instance according to the config. It is later used to access the middleware functions described below.

%TYPEDEF types/index.xml%

%~%