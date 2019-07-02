import makeMiddleware from './lib/make-middleware'

import diskStorage from './storage/disk'
import memoryStorage from './storage/memory'
import MulterError from './lib/multer-error'

function allowAll(req, file, cb) {
  cb(null, true)
}

export default class Multer {
  /**
   * @param {_goa.MulterConfig} options
   * @param {string} [options.dest] Where to store the files.
   * @param {StorageEngine} [options.storage] Where to store the files.
   * @param {function(http.IncomingMessage, _goa.MulterFile, function(Error, boolean)): void} [options.fileFilter] [Function](https://github.com/expressjs/multer#filefilter) to control which files are accepted.
   * @param {_goa.BusBoyLimits} [options.limits] Limits of the uploaded data.
   * @param {boolean} [options.preservePath=false] Keep the full path of files instead of just the base name. Default `false`.
   */
  constructor (options = {}) {
    const { storage, dest, limits, preservePath, fileFilter = allowAll } = options
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
  _makeMiddleware(fields, fileStrategy) {
    function setup () {
      var fileFilter = this.fileFilter
      var filesLeft = Object.create(null)

      fields.forEach((field) => {
        if (typeof field.maxCount === 'number') {
          filesLeft[field.name] = field.maxCount
        } else {
          filesLeft[field.name] = Infinity
        }
      })

      function wrappedFileFilter (req, file, cb) {
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

    return makeMiddleware(setup.bind(this))
  }
  single(name) {
    return this._makeMiddleware([{ name: name, maxCount: 1 }], 'VALUE')
  }
  array(name, maxCount) {
    return this._makeMiddleware([{ name: name, maxCount: maxCount }], 'ARRAY')
  }
  fields(fields) {
    return this._makeMiddleware(fields, 'OBJECT')
  }
  none() {
    return this._makeMiddleware([], 'NONE')
  }
  any() {
    function setup () {
      return {
        limits: this.limits,
        preservePath: this.preservePath,
        storage: this.storage,
        fileFilter: this.fileFilter,
        fileStrategy: 'ARRAY',
      }
    }

    return makeMiddleware(setup.bind(this))
  }
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../types').MulterConfig} _goa.MulterConfig
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@goa/busboy').BusBoyLimits} _goa.BusBoyLimits
 */

// module.exports.diskStorage = diskStorage
// module.exports.memoryStorage = memoryStorage
// module.exports.MulterError = MulterError
