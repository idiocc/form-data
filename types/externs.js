/* typal types/index.xml externs */
/** @const */
var _goa = {}
/**
 * @typedef {{ dest: (string|undefined), storage: (StorageEngine|undefined), fileFilter: ((function(http.IncomingMessage, _goa.MulterFile, function(Error, boolean)): void)|undefined), limits: (_goa.BusBoyLimits|undefined), preservePath: (boolean|undefined) }}
 */
_goa.MulterConfig
/**
 * The information about each file.
 * @record
 */
_goa.MulterFile
/**
 * The field name specified in the form.
 * @type {string}
 */
_goa.MulterFile.prototype.fieldname
/**
 * The name of the file on the user's computer.
 * @type {string}
 */
_goa.MulterFile.prototype.fieldname
/**
 * The encoding type of the file.
 * @type {string}
 */
_goa.MulterFile.prototype.encoding
/**
 * The mime type of the file.
 * @type {string}
 */
_goa.MulterFile.prototype.mimetype
/**
 * The size of the file in bytes.
 * @type {number}
 */
_goa.MulterFile.prototype.size
/**
 * The folder to which the file has been saved.
 * @type {string}
 */
_goa.MulterFile.prototype.destination
/**
 * The name of the file within the `destination`.
 * @type {string}
 */
_goa.MulterFile.prototype.filename
/**
 * The full path to the uploaded file.
 * @type {string}
 */
_goa.MulterFile.prototype.path
/**
 * The `Buffer` of the entire file.
 * @type {Buffer}
 */
_goa.MulterFile.prototype.buffer
