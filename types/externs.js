/* typal types/index.xml externs */
/** @const */
var _idio = {}
/**
 * The function to control which files are accepted.
 * @typedef {function(http.IncomingMessage, _idio.MulterFile): !Promise<boolean>}
 */
_idio.MulterFileFilter
/**
 * @typedef {{ dest: (string|undefined), storage: (_idio.MulterStorageEngine|undefined), fileFilter: (_idio.MulterFileFilter|undefined), limits: (_goa.BusBoyLimits|undefined), preservePath: (boolean|undefined) }}
 */
_idio.MulterConfig
/**
 * @interface
 */
_idio.MulterStorageEngine
/**
 * Saves the file asynchronously.
 * @type {function(http.IncomingMessage, _idio.MulterFile): !Promise}
 */
_idio.MulterStorageEngine.prototype._handleFile
/**
 * Removes the file asynchronously.
 * @type {function(http.IncomingMessage, _idio.MulterFile): !Promise}
 */
_idio.MulterStorageEngine.prototype._removeFile
/**
 * The information about each file.
 * @record
 */
_idio.MulterFile
/**
 * The field name specified in the form.
 * @type {string}
 */
_idio.MulterFile.prototype.fieldname
/**
 * The name of the file on the user's computer.
 * @type {string}
 */
_idio.MulterFile.prototype.originalname
/**
 * The encoding type of the file.
 * @type {string}
 */
_idio.MulterFile.prototype.encoding
/**
 * The mime type of the file.
 * @type {string}
 */
_idio.MulterFile.prototype.mimetype
/**
 * The size of the file in bytes.
 * @type {number}
 */
_idio.MulterFile.prototype.size
/**
 * The folder to which the file has been saved.
 * @type {string}
 */
_idio.MulterFile.prototype.destination
/**
 * The name of the file within the `destination`.
 * @type {string}
 */
_idio.MulterFile.prototype.filename
/**
 * The full path to the uploaded file.
 * @type {string}
 */
_idio.MulterFile.prototype.path
/**
 * The `Buffer` of the entire file.
 * @type {Buffer}
 */
_idio.MulterFile.prototype.buffer
/**
 * The _Readable_ stream with the file data.
 * @type {stream.Readable}
 */
_idio.MulterFile.prototype.stream
/**
 * The item to use in the .fields method.
 * @typedef {{ name: string, maxCount: (number|undefined) }}
 */
_idio.MulterField

/* typal types/disk-storage.xml externs */
/**
 * @record
 */
_idio.MulterDiskStorageOptions
/**
 * Used to determine within which folder the uploaded files should be stored. If given as a string, the location will be ensured prior at the start. Default is `tmpdir()`.
 * @type {(string|function(http.IncomingRequest, _idio.MulterFile): !Promise<string>)|undefined}
 */
_idio.MulterDiskStorageOptions.prototype.destination
/**
 * Used to determine what the file should be named inside the folder. If no filename is given, each file will be given a random name that doesn't include any file extension.
 * @type {(function(http.IncomingRequest, _idio.MulterFile): !Promise<string>)|undefined}
 */
_idio.MulterDiskStorageOptions.prototype.filename

/**
 * @type {!Object}
 */
http.IncomingMessage.prototype.body
/**
 * @type {!Array<_idio.MulterFile>|!Object<string, !Array<_idio.MulterFile>>|_idio.MulterFile}
 */
http.IncomingMessage.prototype.files