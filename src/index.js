import makeMiddleware from './lib/make-middleware'
import diskStorage from './storage/disk'
import memoryStorage from './storage/memory'
import MulterError from './lib/multer-error'

function allowAll(req, file, cb) {
  cb(null, true)
}

export default class Multer {
  /**
   * @param {_idio.MulterConfig} options
   * @param {string} [options.dest] Where to store the files.
   * @param {StorageEngine} [options.storage] Where to store the files.
   * @param {_idio.MulterFileFilter} [options.fileFilter] The file filter.
   * @param {_goa.BusBoyLimits} [options.limits] Limits of the uploaded data.
   * @param {boolean} [options.preservePath=false] Keep the full path of files instead of just the base name. Default `false`.
   */
  constructor (options = {}) {
    const { storage, dest, limits = {}, preservePath, fileFilter = allowAll } = options
    if (storage) {
      this.storage = storage
    } else if (dest) {
      this.storage = diskStorage({ destination: dest })
    } else {
      this.storage = memoryStorage()
    }

    this.limits = limits
    this.preservePath = preservePath
    this.fileFilter = fileFilter
  }

  /**
   * @param {!Array<_idio.MulterField>} fields The fields to accept.
   * @param {string} fileStrategy The strategy.
   */
  setup(fields, fileStrategy) {
    const fileFilter = this.fileFilter
    const filesLeft = {}

    fields.forEach(({ maxCount = Infinity, name }) => {
      filesLeft[name] = maxCount
    })

    /**
     * @type {_idio.MulterFileFilter}
     */
    function wrappedFileFilter(req, file, cb) {
      if ((filesLeft[file.fieldname] || 0) <= 0) {
        return cb(new MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname))
      }

      filesLeft[file.fieldname] -= 1
      fileFilter(req, file, cb)
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
   * @param {Array<_idio.MulterField>} fields The fields to accept.
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
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../types').MulterConfig} _idio.MulterConfig
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../types').MulterField} _idio.MulterField
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../types').MulterFileFilter} _idio.MulterFileFilter
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@goa/busboy').BusBoyLimits} _goa.BusBoyLimits
 */

// module.exports.diskStorage = diskStorage
// module.exports.memoryStorage = memoryStorage
// module.exports.MulterError = MulterError
