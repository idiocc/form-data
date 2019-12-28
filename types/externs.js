/**
 * @fileoverview
 * @externs
 */

/* typal types/index.xml externs */
/** @const */
var _multipart = {}
/**
 * The configuration for the instance.
 * @typedef {{ dest: (string|undefined), storage: (_multipart.FormDataStorageEngine|undefined), fileFilter: (_multipart.FormDataFileFilter|undefined), limits: (_goa.BusBoyLimits|undefined), preservePath: (boolean|undefined) }}
 */
_multipart.FormDataConfig

/* typal types/misc.xml externs */
/**
 * The function to control which files are accepted.
 * @typedef {function(!http.IncomingMessage,!_multipart.FormDataFile)}
 */
_multipart.FormDataFileFilter
/**
 * An instance to create middleware.
 * Creates a new form-data instance.
 * @param {!_multipart.FormDataConfig=} [options] The options for the instance.
 * @interface
 */
_multipart.FormData = function(options) {}
/**
 * Accept a single file.
 * @param {string} name The name of the field.
 * @return {!_goa.Middleware}
 */
_multipart.FormData.prototype.single = function(name) {}
/**
 * Accept multiple files.
 * @param {string} name The name of the field.
 * @param {number} maxFiles The maximum number of files.
 * @return {!_goa.Middleware}
 */
_multipart.FormData.prototype.array = function(name, maxFiles) {}
/**
 * Accept files according to the configured fields.
 * @param {!Array<_multipart.FormDataField>} fields The fields to accept.
 * @return {!_goa.Middleware}
 */
_multipart.FormData.prototype.fields = function(fields) {}
/**
 * Do not accept files, only fields.
 * @return {!_goa.Middleware}
 */
_multipart.FormData.prototype.none = function() {}
/**
 * Accept any fields and files.
 * @return {!_goa.Middleware}
 */
_multipart.FormData.prototype.any = function() {}
/**
 * Constructor method.
 * @interface
 */
_multipart.FormDataStorageEngine = function() {}
/**
 * Saves the file asynchronously.
 * @param {!http.IncomingMessage} req The request.
 * @param {!_multipart.FormDataFile} file The file instance.
 */
_multipart.FormDataStorageEngine.prototype._handleFile = function(req, file) {}
/**
 * Removes the file asynchronously.
 * @param {!http.IncomingMessage} req The request.
 * @param {!_multipart.FormDataFile} file The file instance.
 */
_multipart.FormDataStorageEngine.prototype._removeFile = function(req, file) {}
/**
 * The item to use in the `.fields` method.
 * @typedef {{ name: string, maxCount: (number|undefined) }}
 */
_multipart.FormDataField
/**
 * An error object which extends Error.
 * Constructor method.
 * @interface
 */
_multipart.FormDataError = function() {}
/**
 * The error code.
 * @type {string}
 */
_multipart.FormDataError.prototype.code
/**
 * The field which resulted in error.
 * @type {string|undefined}
 */
_multipart.FormDataError.prototype.field

/* typal types/disk-storage.xml externs */
/**
 * @record
 */
_multipart.FormDataDiskStorageOptions
/**
 * Used to determine within which folder the uploaded files should be stored. If given as a string, the location will be ensured prior at the start. Default is `tmpdir()`.
 * @type {(string|function(http.IncomingMessage, _multipart.FormDataFile): !Promise<string>)|undefined}
 */
_multipart.FormDataDiskStorageOptions.prototype.destination
/**
 * Used to determine what the file should be named inside the folder. If no filename is given, each file will be given a random name that doesn't include any file extension.
 * @type {(function(!http.IncomingMessage,!_multipart.FormDataFile): !Promise<string>)|undefined}
 */
_multipart.FormDataDiskStorageOptions.prototype.filename = function(req, file) {}

/* typal types/file.xml externs */
/**
 * The information about each file.
 * @record
 */
_multipart.FormDataFile
/**
 * The field name specified in the form.
 * @type {string}
 */
_multipart.FormDataFile.prototype.fieldname
/**
 * The name of the file on the user's computer.
 * @type {string}
 */
_multipart.FormDataFile.prototype.originalname
/**
 * The encoding type of the file.
 * @type {string}
 */
_multipart.FormDataFile.prototype.encoding
/**
 * The mime type of the file.
 * @type {string}
 */
_multipart.FormDataFile.prototype.mimetype
/**
 * The size of the file in bytes.
 * @type {number}
 */
_multipart.FormDataFile.prototype.size
/**
 * The folder to which the file has been saved. Set by _DiskStorage_.
 * @type {string}
 */
_multipart.FormDataFile.prototype.destination
/**
 * The name of the file within the `destination`. Set by _DiskStorage_.
 * @type {string}
 */
_multipart.FormDataFile.prototype.filename
/**
 * The full path to the uploaded file. Set by _DiskStorage_.
 * @type {string}
 */
_multipart.FormDataFile.prototype.path
/**
 * The `Buffer` of the entire file. Set by _MemoryStorage_.
 * @type {Buffer}
 */
_multipart.FormDataFile.prototype.buffer
/**
 * The _Readable_ stream with the file data. This stream should not be read other than by a storage engine.
 * @type {stream.Readable}
 */
_multipart.FormDataFile.prototype.stream

/**
 * @type {!Object}
 */
http.IncomingMessage.prototype.body
/**
 * @type {!Array<_multipart.FormDataFile>|!Object<string, !Array<_multipart.FormDataFile>>|_multipart.FormDataFile}
 */
http.IncomingMessage.prototype.files
/**
 * @type {_multipart.FormDataFile}
 */
http.IncomingMessage.prototype.file