export {}

/* typal types/index.xml closure noSuppress */
/**
 * @typedef {_goa.MulterConfig} MulterConfig
 */
/**
 * @typedef {Object} _goa.MulterConfig
 * @prop {string} [dest] Where to store the files.
 * @prop {StorageEngine} [storage] Where to store the files.
 * @prop {function(http.IncomingMessage, _goa.MulterFile, function(Error, boolean)): void} [fileFilter] [Function](https://github.com/expressjs/multer#filefilter) to control which files are accepted.
 * @prop {_goa.BusBoyLimits} [limits] Limits of the uploaded data.
 * @prop {boolean} [preservePath=false] Keep the full path of files instead of just the base name. Default `false`.
 */
/**
 * @typedef {_goa.MulterFile} MulterFile `＠record` The information about each file.
 */
/**
 * @typedef {Object} _goa.MulterFile `＠record` The information about each file.
 * @prop {string} fieldname The field name specified in the form.
 * @prop {string} fieldname The name of the file on the user's computer.
 * @prop {string} encoding The encoding type of the file.
 * @prop {string} mimetype The mime type of the file.
 * @prop {number} size The size of the file in bytes.
 * @prop {string} destination The folder to which the file has been saved.
 * @prop {string} filename The name of the file within the `destination`.
 * @prop {string} path The full path to the uploaded file.
 * @prop {Buffer} buffer The `Buffer` of the entire file.
 */
/**
 * @typedef {import('@goa/busboy').BusBoyLimits} _goa.BusBoyLimits
 */
/**
 * @typedef {import('http').IncomingMessage} http.IncomingMessage
 */
/**
 * @typedef {import('fs').Stats} fs.Stats
 */
/**
 * @typedef {import('koa-multer').StorageEngine} koa-multer.StorageEngine
 */
