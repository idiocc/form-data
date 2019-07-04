/* typal types/index.xml externs */
/** @const */
var _multipart = {}
/**
 * The function to control which files are accepted.
 * @typedef {function(http.IncomingMessage, _multipart.FormDataFile): !Promise<boolean>}
 */
_multipart.FormDataFileFilter
/**
 * @typedef {{ dest: (string|undefined), storage: (_multipart.FormDataStorageEngine|undefined), fileFilter: (_multipart.FormDataFileFilter|undefined), limits: (_goa.BusBoyLimits|undefined), preservePath: (boolean|undefined) }}
 */
_multipart.FormDataConfig
/**
 * @interface
 */
_multipart.FormDataStorageEngine
/**
 * Saves the file asynchronously.
 * @type {function(!http.IncomingMessage, _multipart.FormDataFile): !Promise}
 */
_multipart.FormDataStorageEngine.prototype._handleFile
/**
 * Removes the file asynchronously.
 * @type {function(!http.IncomingMessage, _multipart.FormDataFile): !Promise}
 */
_multipart.FormDataStorageEngine.prototype._removeFile
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
 * The item to use in the .fields method.
 * @typedef {{ name: string, maxCount: (number|undefined) }}
 */
_multipart.FormDataField
/**
 * An error object which extends Error.
 * @typedef {{ code: string, field: (string|undefined) }}
 */
_multipart.FormDataError

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
 * @type {(function(http.IncomingMessage, _multipart.FormDataFile): !Promise<string>)|undefined}
 */
_multipart.FormDataDiskStorageOptions.prototype.filename

/**
 * @type {!Object}
 */
http.IncomingMessage.prototype.body
/**
 * @type {!Array<_idio.MulterFile>|!Object<string, !Array<_idio.MulterFile>>|_idio.MulterFile}
 */
http.IncomingMessage.prototype.files