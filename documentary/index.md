# @multipart/form-data

%NPM: @multipart/form-data%

`@multipart/form-data` is Multipart/Form-Data And File Upload Middleware For Koa Written In ES6 And Optimised With [JavaScript Compiler](https://compiler.page).

Originally, this was a [Multer](https://github.com/expressjs/multer) fork, however it was rewritten specifically for Koa2, and the interfaces were updated to be async rather than callbacks. Differences:

 - When the file size limit is reached, the next middleware is called, rather than waiting to drain the request stream. This can result in the client-side **EPIPE** (connection reset) errors when sending files larger than allowed. But ideally, _Node.JS_ applications should be run behind a proxy such as NginX to limit the upload size.
 - Removes the unnecessary `typeis` dependency that includes the `mime-type` database, just checks the _Content-Type_ to start with `multipart/form-data`.
 - Compiled with _Google Closure Compiler_ and has just 1 dependency (`text-decoding`) to decode non-utf8 fields (e.g., when a form submitted had the [`accept-charset`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#Attributes) attribute).

```sh
yarn add @multipart/form-data
```

## Table Of Contents

%TOC%

%~%