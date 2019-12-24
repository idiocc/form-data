const {
  _MultipartFormData, _diskStorage, _memoryStorage, _FormDataError,
} = require('./form-data')

/**
 * An instance to create middleware.
 */
class MultipartFormData extends _MultipartFormData {
  /**
   * Creates a new form-data instance.
   * @param {!_multipart.FormDataConfig} options The configuration for the instance.
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
   * @return {!_goa.Middleware}
   */
  single(name) {
    return super.single(name)
  }
  /**
   * Accept multiple files.
   * @param {string} name The name of the field.
   * @param {string} maxFiles The maximum number of files.
   * @return {!_goa.Middleware}
   */
  array(name, maxFiles) {
    return super.array(name, maxFiles)
  }
  /**
   * Accept files according to the configured fields.
   * @param {!Array<_multipart.FormDataField>} fields The fields to accept.
   * @return {!_goa.Middleware}
   */
  fields(fields) {
    return super.fields(fields)
  }
  /**
   * Do not accept files, only fields.
   * @return {!_goa.Middleware}
   */
  none() {
    return super.none()
  }
  /**
   * Accept any fields and files.
   * @return {!_goa.Middleware}
   */
  any() {
    return super.any()
  }
}

/**
 * Creates a new disk storage.
 * @param {_multipart.FormDataDiskStorageOptions} [opt]
 * @param {string|function(http.IncomingMessage, _multipart.FormDataFile): !Promise<string>} [opt.destination] Used to determine within which folder the uploaded files should be stored. If given as a string, the location will be ensured prior at the start. Default is `tmpdir()`.
 * @param {(req: !http.IncomingMessage, file: !_multipart.FormDataFile) => !Promise<string>} [opt.filename] Used to determine what the file should be named inside the folder. If no filename is given, each file will be given a random name that doesn't include any file extension.
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
 * An error object which extends Error.
 */
class FormDataError extends _FormDataError {
  /**
   * Constructor method.
   */
  constructor() {
    super()
  }
}

module.exports = MultipartFormData
module.exports.diskStorage = diskStorage
module.exports.memoryStorage = memoryStorage
module.exports.FormDataError = FormDataError

/* typal types/index.xml namespace */
/**
 * @typedef {import('@goa/busboy').BusBoyLimits} _goa.BusBoyLimits
 * @typedef {_multipart.FormDataConfig} FormDataConfig The configuration for the instance.
 * @typedef {Object} _multipart.FormDataConfig The configuration for the instance.
 * @prop {string} [dest] The directory where to store the files using the `DiskStorage`. If not specified, files will be saved in the system's temp directory (`os.tmpdir()`).
 * @prop {_multipart.FormDataStorageEngine} [storage] An _instance_ of a custom storage engine.
 * @prop {_multipart.FormDataFileFilter} [fileFilter] The file filter.
 * @prop {_goa.BusBoyLimits} [limits] The limits of the uploaded data.
 * @prop {boolean} [preservePath=false] Whether to keep the full path of files instead of just the base name. Default `false`.
 */

/* typal types/disk-storage.xml namespace */
/**
 * @typedef {import('http').IncomingMessage} http.IncomingMessage
 * @typedef {_multipart.FormDataDiskStorageOptions} FormDataDiskStorageOptions `＠record`
 * @typedef {Object} _multipart.FormDataDiskStorageOptions `＠record`
 * @prop {string|function(http.IncomingMessage, _multipart.FormDataFile): !Promise<string>} [destination] Used to determine within which folder the uploaded files should be stored. If given as a string, the location will be ensured prior at the start. Default is `tmpdir()`.
 * @prop {(req: !http.IncomingMessage, file: !_multipart.FormDataFile) => !Promise<string>} [filename] Used to determine what the file should be named inside the folder. If no filename is given, each file will be given a random name that doesn't include any file extension.
 */
