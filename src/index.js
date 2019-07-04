import makeMiddleware from './lib/make-middleware'
import DiskStorage from './storage/disk'
import MemoryStorage from './storage/memory'
import FormDataError from './lib/error'

function allowAll() {
  return true
}

export default class MultipartFormData {
  /**
   * @param {_multipart.FormDataConfig} options
   * @param {string} [options.dest] The directory where to store the files using the `DiskStorage`.
   * @param {_multipart.FormDataStorageEngine} [options.storage] An _instance_ of a custom storage engine.
   * @param {_multipart.FormDataFileFilter} [options.fileFilter] The file filter.
   * @param {_goa.BusBoyLimits} [options.limits] The limits of the uploaded data.
   * @param {boolean} [options.preservePath=false] Whether to keep the full path of files instead of just the base name. Default `false`.
   */
  constructor (options = {}) {
    const { storage, dest, limits = {}, preservePath, fileFilter = allowAll } = options
    if (storage) {
      this.storage = storage
    } else if (dest) {
      this.storage = new DiskStorage({ destination: dest })
    } else {
      this.storage = new MemoryStorage()
    }

    this.limits = limits
    this.preservePath = preservePath
    this.fileFilter = fileFilter
  }

  /**
   * @param {!Array<_multipart.FormDataField>} fields The fields to accept.
   * @param {string} fileStrategy The strategy.
   */
  setup(fields, fileStrategy) {
    const fileFilter = this.fileFilter
    const filesLeft = {}

    fields.forEach(({ maxCount = Infinity, name }) => {
      filesLeft[name] = maxCount
    })

    /**
     * @type {_multipart.FormDataFileFilter}
     */
    function wrappedFileFilter(req, file) {
      if ((filesLeft[file.fieldname] || 0) <= 0)
        throw FormDataError.create('LIMIT_UNEXPECTED_FILE', file.fieldname)

      filesLeft[file.fieldname] -= 1
      return fileFilter(req, file)
    }

    return {
      limits: this.limits,
      preservePath: this.preservePath,
      storage: this.storage,
      fileFilter: wrappedFileFilter,
      fileStrategy: fileStrategy,
    }
  }

  single(name) {
    const conf = this.setup([{ name: name, maxCount: 1 }], 'VALUE')
    return makeMiddleware(conf)
  }
  array(name, maxCount) {
    const conf = this.setup([{ name: name, maxCount: maxCount }], 'ARRAY')
    return makeMiddleware(conf)
  }
  /**
   * @param {!Array<_multipart.FormDataField>} fields The fields to accept.
   */
  fields(fields) {
    const conf = this.setup(fields, 'OBJECT')
    return makeMiddleware(conf)
  }
  none() {
    const conf = this.setup([], 'NONE')
    return makeMiddleware(conf)
  }
  any() {
    return makeMiddleware({
      limits: this.limits,
      preservePath: this.preservePath,
      storage: this.storage,
      fileFilter: this.fileFilter,
      fileStrategy: 'ARRAY',
    })
  }
}

/**
 * @param {_multipart.FormDataDiskStorageOptions} [opt] Options for the disk storage.
 */
export const diskStorage = (opt = {}) => {
  return new DiskStorage(opt)
}

export const memoryStorage = () => {
  return new MemoryStorage()
}

export { FormDataError }

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../types').FormDataConfig} _multipart.FormDataConfig
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../types').FormDataField} _multipart.FormDataField
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../types').FormDataFileFilter} _multipart.FormDataFileFilter
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../types').FormDataDiskStorageOptions} _multipart.FormDataDiskStorageOptions
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@goa/busboy').BusBoyLimits} _goa.BusBoyLimits
 */