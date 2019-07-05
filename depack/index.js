const {
  _MultipartFormData, _diskStorage, _memoryStorage, _FormDataError,
} = require('./depack')

class MultipartFormData extends _MultipartFormData {
  /**
   * @param {_multipart.FormDataConfig} options The configuration for the instance.
   * @param {string} [options.dest] The directory where to store the files using the `DiskStorage`. If not specified, files will be saved in the system's temp directory (`os.tmpdir()`).
   * @param {_multipart.FormDataStorageEngine} [options.storage] An _instance_ of a custom storage engine.
   * @param {_multipart.FormDataFileFilter} [options.fileFilter] The file filter.
   * @param {_goa.BusBoyLimits} [options.limits] The limits of the uploaded data.
   * @param {boolean} [options.preservePath=false] Whether to keep the full path of files instead of just the base name. Default `false`.
   */
  constructor(options) {
    super(options)
  }
  /**
   * Accept a single file.
   * @param {string} name The name of the field.
   * @example
   * ```js
   * const middleware = multer.single('file')
   *   // => req.file = FILE
   *   //    req.body = { field: FIELD }
   * ```
   */
  single(name) {
    return super.single(name)
  }
  /**
   * Accept multiple files.
   * @param {string} name The name of the field.
   * @param {string} maxCount The maximum number of files to accept under the specified field name.
   * @example
   * ```js
   * const middleware = multer.array('file', 2)
   *   // => req.files = [FILE1, FILE2]
   *   //    req.body = { field: FIELD }
   * ```
   */
  array(name, maxCount) {
    return super.array(name, maxCount)
  }
  /**
   * Accept files according to the configured fields. The result will be stored in the `req.files` object.
   * @param {!Array<_multipart.FormDataField>} fields The fields to accept.
   * @example
   * ```js
   * const middleware = multer.fields([
   *  { name: 'file', maxCount: 2 },
   *  { name: 'picture', maxCount: 1 },
   * ]) // => req.files = { file: [FILE1, FILE2], picture: [PICTURE] }
   *    //    req.body = { field: FIELD }
   * ```
   */
  fields(fields) {
    return super.fields(fields)
  }
  /**
   * Do not accept files, only fields.
   * @example
   * ```js
   * const middleware = multer.none()
   *   // => req.body = { field: FIELD }
   * ```
   */
  none() {
    return super.none()
  }
  /**
   * Accept any fields and files.
   */
  any() {
    return super.any()
  }
}

/**
 * Creates a new disk storage.
 * @param {_multipart.FormDataDiskStorageOptions} [opt]
 * @param {string|function(http.IncomingMessage, _multipart.FormDataFile): !Promise<string>} [opt.destination] Used to determine within which folder the uploaded files should be stored. If given as a string, the location will be ensured prior at the start. Default is `tmpdir()`.
 * @param {function(http.IncomingMessage, _multipart.FormDataFile): !Promise<string>} [opt.filename] Used to determine what the file should be named inside the folder. If no filename is given, each file will be given a random name that doesn't include any file extension.
 */
function diskStorage(opt) {
  return _diskStorage(opt)
}
/**
 * Creates a new memory storage.
 */
function memoryStorage() {
  return _memoryStorage()
}

/**
 * A class that extends an error.
 */
class FormDataError extends _FormDataError {
}

module.exports = MultipartFormData
module.exports.diskStorage = diskStorage
module.exports.memoryStorage = memoryStorage
module.exports.FormDataError = FormDataError

/* typal types/index.xml */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_multipart.FormDataFileFilter} FormDataFileFilter The function to control which files are accepted.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {function(http.IncomingMessage, _multipart.FormDataFile): !Promise<boolean>} _multipart.FormDataFileFilter The function to control which files are accepted.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_multipart.FormDataConfig} FormDataConfig The configuration for the instance.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} _multipart.FormDataConfig The configuration for the instance.
 * @prop {string} [dest] The directory where to store the files using the `DiskStorage`. If not specified, files will be saved in the system's temp directory (`os.tmpdir()`).
 * @prop {_multipart.FormDataStorageEngine} [storage] An _instance_ of a custom storage engine.
 * @prop {_multipart.FormDataFileFilter} [fileFilter] The file filter.
 * @prop {_goa.BusBoyLimits} [limits] The limits of the uploaded data.
 * @prop {boolean} [preservePath=false] Whether to keep the full path of files instead of just the base name. Default `false`.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_multipart.FormData} FormData An instance to create middleware.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} _multipart.FormData An instance to create middleware.
 * @prop {function(string): _goa.Middleware} single Accept a single file. The first argument is the name of the field.
 * @prop {function(string, number): _goa.Middleware} array Accept multiple files. The first argument is the name of the field, and the second argument is the max number of files.
 * @prop {function(!Array<_multipart.FormDataField>): _goa.Middleware} fields Accept files according to the configured fields.
 * @prop {function(): _goa.Middleware} none Do not accept files, only fields.
 * @prop {function(): _goa.Middleware} any Accept any fields and files.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_multipart.FormDataStorageEngine} FormDataStorageEngine `＠interface`
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} _multipart.FormDataStorageEngine `＠interface`
 * @prop {function(!http.IncomingMessage, _multipart.FormDataFile): !Promise} _handleFile Saves the file asynchronously.
 * @prop {function(!http.IncomingMessage, _multipart.FormDataFile): !Promise} _removeFile Removes the file asynchronously.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_multipart.FormDataField} FormDataField The item to use in the .fields method.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} _multipart.FormDataField The item to use in the .fields method.
 * @prop {string} name The name of the field.
 * @prop {number} [maxCount] The maximum count of the field.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_multipart.FormDataError} FormDataError An error object which extends Error.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} _multipart.FormDataError An error object which extends Error.
 * @prop {string} code The error code.
 * @prop {string} [field] The field which resulted in error.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@goa/busboy').BusBoyLimits} _goa.BusBoyLimits
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('http').IncomingMessage} http.IncomingMessage
 */

/* typal types/disk-storage.xml */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_multipart.FormDataDiskStorageOptions} FormDataDiskStorageOptions `＠record`
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} _multipart.FormDataDiskStorageOptions `＠record`
 * @prop {string|function(http.IncomingMessage, _multipart.FormDataFile): !Promise<string>} [destination] Used to determine within which folder the uploaded files should be stored. If given as a string, the location will be ensured prior at the start. Default is `tmpdir()`.
 * @prop {function(http.IncomingMessage, _multipart.FormDataFile): !Promise<string>} [filename] Used to determine what the file should be named inside the folder. If no filename is given, each file will be given a random name that doesn't include any file extension.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('http').IncomingMessage} http.IncomingMessage
 */
