const {
  _MultipartFormData, _diskStorage, _memoryStorage, _FormDataError,
} = require('./form-data')

/**
 * @constructor {_multipart.FormData}
 */
class MultipartFormData extends _MultipartFormData {}

/**
 * @methodType {_multipart.diskStorage}
 */
function diskStorage(opt) {
  return _diskStorage(opt)
}
/**
 * @methodType {_multipart.memoryStorage}
 */
function memoryStorage() {
  return _memoryStorage()
}

/**
 * @constructor {_multipart.FormDataError}
 */
class FormDataError extends _FormDataError {}

module.exports = MultipartFormData
module.exports.diskStorage = diskStorage
module.exports.memoryStorage = memoryStorage
module.exports.FormDataError = FormDataError

/* typal types/index.xml namespace */

/* typal types/disk-storage.xml namespace */
