import Busboy from '@goa/busboy'
import appendField from '@multipart/append-field'
import FileAppender from './file-appender'
import FormDataError from './error'
import Counter from './counter'

const testMultipart = (headers) => {
  const contentType = headers['content-type']
  // https://github.com/google/closure-compiler/issues/3529
  // const { 'content-type': contentType } = headers
  if (!contentType) return false
  return contentType.toLowerCase().startsWith('multipart/form-data')
}

/**
 * @param {{ limits: !_goa.BusBoyLimits,
 *           preservePath: boolean,
 *           storage: !_multipart.FormDataStorageEngine,
 *           fileFilter: !_multipart.FormDataFileFilter,
 *           fileStrategy: string }} options
 */
export default function makeMiddleware(options) {
  /** @type {!_goa.Middleware} */
  async function multerMiddleware(ctx, next) {
    const { req } = ctx
    if (!testMultipart(req.headers)) return next()

    const { limits = {}, storage, fileFilter, fileStrategy, preservePath } = options

    const body = {}
    req.body = body

    const busboy = new Busboy({
      limits,
      preservePath,
      headers: req.headers,
    })

    const appender = new FileAppender(fileStrategy, req)
    const pendingWrites = new Counter()
    const uploadedFiles = []
    let busboyFinished = false

    busboy.on('field', (fieldname, value, fieldnameTruncated, valueTruncated) => {
      // if (fieldnameTruncated) return abortWithCode('LIMIT_FIELD_KEY')
      if (valueTruncated)
        return busboy.emit('error', FormDataError.create('LIMIT_FIELD_VALUE', fieldname))

      // Work around bug in Busboy (https://github.com/mscdex/busboy/issues/6)
      if (limits.fieldNameSize && fieldname.length > limits.fieldNameSize) {
        return busboy.emit('error', FormDataError.create('LIMIT_FIELD_KEY'))
      }

      appendField(body, fieldname, value)
    })

    // handle files
    busboy.on('file', async (fieldname, stream, filename, encoding, mimetype) => {
      // don't attach to the files object, if there is no file
      if (!filename) return stream.resume()

      // Work around bug in Busboy (https://github.com/mscdex/busboy/issues/6)
      if (limits.fieldNameSize && fieldname.length > limits.fieldNameSize) {
        return busboy.emit('error', FormDataError.create('LIMIT_FIELD_KEY'))
      }

      /**
       * @suppress {checkTypes}
       * @type {!_multipart.FormDataFile}
       */
      const file = {
        fieldname,
        originalname: filename,
        encoding,
        mimetype,
        stream,
      }

      const placeholder = appender.insertPlaceholder(file)
      let aborting = false
      const tryCancel = () => {
        if (aborting) {
          appender.removePlaceholder(placeholder)
          return aborting
        }
      }

      stream
        .on('error', (err) => {
          pendingWrites.decrement()
          busboy.emit('error', err)
        })
        .on('limit', () => {
          aborting = true
          busboy.emit('error', FormDataError.create('LIMIT_FILE_SIZE', fieldname))
        })

      let res
      try {
        res = await fileFilter(req, file)
      } catch (err) {
        appender.removePlaceholder(placeholder)
        busboy.emit('error', err)
        return
      }

      if (!res) {
        appender.removePlaceholder(placeholder)
        stream.resume()
        return
      }

      pendingWrites.increment()

      try {
        if (tryCancel()) return

        const info = await storage._handleFile(req, file)
        const fileInfo = /** @type {!_multipart.FormDataFile} */ ({ ...file, ...info })

        if (tryCancel()) {
          return uploadedFiles.push(fileInfo)
        }

        appender.replacePlaceholder(placeholder, fileInfo)
        uploadedFiles.push(fileInfo)
      } catch (error) {
        appender.removePlaceholder(placeholder)
        if (!busboyFinished) {
          busboy.emit('error', error)
        } else pendingWrites.emit('error', error)
      } finally {
        pendingWrites.decrement()
      }
    })

    req.pipe(busboy)
    const remove = file => storage._removeFile(req, file)

    try {
      await new Promise((r, j) => {
        busboy.on('error', j)
          .on('partsLimit', () => {
            j(FormDataError.create('LIMIT_PART_COUNT'))
          })
          .on('filesLimit', () => {
            j(FormDataError.create('LIMIT_FILE_COUNT'))
          })
          .on('fieldsLimit', () => {
            j(FormDataError.create('LIMIT_FIELD_COUNT'))
          })
          .on('finish', r)
      })
    } catch(err) {
      await pendingWrites.awaitZero()
      const errors = await removeUploadedFiles(uploadedFiles, remove)
      err['storageErrors'] = errors

      throw err
    } finally {
      busboyFinished = true
      req.unpipe(busboy)
      busboy.removeAllListeners()
    }
    await pendingWrites.awaitZero()
    await next()
  }
  return multerMiddleware
}

/**
 * @param {!Array<_multipart.FormDataFile>} uploadedFiles The list of uploaded files.
 * @param {!Function} remove The remove function.
 */
async function removeUploadedFiles(uploadedFiles, remove) {
  const errors = await uploadedFiles.reduce(async (acc, file) => {
    const accRes = await acc
    try {
      await remove(file)
    } catch (err) {
      err['file'] = file
      err['field'] = file['fieldname']
      accRes.push(err)
    }
    return accRes
  }, [])

  return errors
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@typedefs/goa').Middleware} _goa.Middleware
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@goa/busboy').BusBoyLimits} _goa.BusBoyLimits
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../types').FormDataFileFilter} _multipart.FormDataFileFilter
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../types').FormDataStorageEngine} _multipart.FormDataStorageEngine
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../types').FormDataFile} _multipart.FormDataFile
 */