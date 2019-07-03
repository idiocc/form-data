/* typal types/index.xml externs */
/** @const */
var _idio = {}
/**
 * The function to control which files are accepted.
 * @typedef {function(http.IncomingMessage, _idio.MulterFile, function(Error, boolean)): void}
 */
_idio.MulterFileFilter
/**
 * @typedef {{ dest: (string|undefined), storage: (StorageEngine|undefined), fileFilter: (_idio.MulterFileFilter|undefined), limits: (_goa.BusBoyLimits|undefined), preservePath: (boolean|undefined) }}
 */
_idio.MulterConfig
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
_idio.MulterFile.prototype.fieldname
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
 * The item to use in the .fields method.
 * @typedef {{ name: string, maxCount: (number|undefined) }}
 */
_idio.MulterField

/**
 * @type {!Object}
 */
http.IncomingMessage.prototype.body
/**
 * @type {!Array<_idio.MulterFile>|!Object<string, !Array<_idio.MulterFile>>|_idio.MulterFile}
 */
http.IncomingMessage.prototype.files