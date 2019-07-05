const {
  _MultipartFormData, _diskStorage, _memoryStorage, _FormDataError,
} = require('./depack')

class MultipartFormData extends _MultipartFormData {
  /**
   * @param {_multipart.FormDataConfig} options
   * @param {string} [options.dest] The directory where to store the files using the `DiskStorage`.
   * @param {_multipart.FormDataStorageEngine} [options.storage] An _instance_ of a custom storage engine.
   * @param {_multipart.FormDataFileFilter} [options.fileFilter] The file filter.
   * @param {_goa.BusBoyLimits} [options.limits] The limits of the uploaded data.
   * @param {boolean} [options.preservePath=false] Whether to keep the full path of files instead of just the base name. Default `false`.
   */
  constructor(options) {
    super(options)
  }
  single(name) {
    return super.single(name)
  }
  array(name, maxCount) {
    return super.array(name, maxCount)
  }
  /**
   * @param {!Array<_multipart.FormDataField>} fields The fields to accept.
   */
  fields(fields) {
    return super.fields(fields)
  }
  /**
   * Do not accept files, only fields.
   * @returns {goa.Middleware}
   */
  none() {
    return super.none()
  }
  /**
   *
   */
  any() {
    return super.any()
  }
}

/**
 * Creates a new disk storage.
 * @param {_multipart.FormDataDiskStorageOptions} [opt] Options for the disk storage.
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
 * @typedef {_multipart.FormDataConfig} FormDataConfig
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} _multipart.FormDataConfig
 * @prop {string} [dest] The directory where to store the files using the `DiskStorage`.
 * @prop {_multipart.FormDataStorageEngine} [storage] An _instance_ of a custom storage engine.
 * @prop {_multipart.FormDataFileFilter} [fileFilter] The file filter.
 * @prop {_goa.BusBoyLimits} [limits] The limits of the uploaded data.
 * @prop {boolean} [preservePath=false] Whether to keep the full path of files instead of just the base name. Default `false`.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_multipart.FormData} FormData
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} _multipart.FormData
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
 * @typedef {_multipart.FormDataFile} FormDataFile `＠record` The information about each file.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} _multipart.FormDataFile `＠record` The information about each file.
 * @prop {string} fieldname The field name specified in the form.
 * @prop {string} originalname The name of the file on the user's computer.
 * @prop {string} encoding The encoding type of the file.
 * @prop {string} mimetype The mime type of the file.
 * @prop {number} size The size of the file in bytes.
 * @prop {string} destination The folder to which the file has been saved. Set by _DiskStorage_.
 * @prop {string} filename The name of the file within the `destination`. Set by _DiskStorage_.
 * @prop {string} path The full path to the uploaded file. Set by _DiskStorage_.
 * @prop {Buffer} buffer The `Buffer` of the entire file. Set by _MemoryStorage_.
 * @prop {stream.Readable} stream The _Readable_ stream with the file data. This stream should not be read other than by a storage engine.
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
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('fs').Stats} fs.Stats
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('stream').Readable} stream.Readable
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