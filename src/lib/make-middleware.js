import is from '@goa/type-is'
import Busboy from '@goa/busboy'
import appendField from '@goa/append-field'
import FileAppender from './file-appender'
import MulterError from './multer-error'
import Counter from './counter'

// var onFinished = require('on-finished')

// var removeUploadedFiles = require('./remove-uploaded-files')

function drainStream(stream) {
  stream.on('readable', stream.read.bind(stream))
}

/**
 * @param {{ limits: _goa.BusBoyLimits,
 *           preservePath: boolean,
 *           storage,
 *           fileFilter: _idio.MulterFileFilter,
 *           fileStrategy: string }} options
 * @returns {_goa.Middleware}
 */
export default function makeMiddleware(options) {
  return async function multerMiddleware(ctx, next) {
    const { req } = ctx
    if (!is(ctx.req, ['multipart'])) return next()

    const { limits, storage, fileFilter, fileStrategy, preservePath } = options

    const body = {}
    req.body = body

    const busboy = new Busboy({
      limits,
      preservePath,
      headers: req.headers,
    })

    const appender = new FileAppender(fileStrategy, req)
    // var isDone = false
    // var readFinished = false
    // var errorOccured = false
    const pendingWrites = new Counter()
    const uploadedFiles = []

    // function done(err) {
    //   if (isDone) return
    //   isDone = true

    //   req.unpipe(busboy)
    //   drainStream(req)
    //   busboy.removeAllListeners()

    //   onFinished(req, () => { next(err) })
    // }

    // function indicateDone () {
    //   if (readFinished && pendingWrites.isZero() && !errorOccured) done()
    // }

    // function abortWithError(uploadError) {
    //   if (errorOccured) return
    //   errorOccured = true

    //   pendingWrites.onceZero(() => {
    //     function remove (file, cb) {
    //       storage._removeFile(req, file, cb)
    //     }

    //     removeUploadedFiles(uploadedFiles, remove, (err, storageErrors) => {
    //       if (err) return done(err)

    //       uploadError.storageErrors = storageErrors
    //       done(uploadError)
    //     })
    //   })
    // }

    busboy.on('field', (fieldname, value, fieldnameTruncated, valueTruncated) => {
      // if (fieldnameTruncated) return abortWithCode('LIMIT_FIELD_KEY')
      if (valueTruncated)
        return busboy.emit('error', new MulterError('LIMIT_FIELD_VALUE', fieldname))

      // Work around bug in Busboy (https://github.com/mscdex/busboy/issues/6)
      if (limits.fieldNameSize && fieldname.length > limits.fieldNameSize) {
        return busboy.emit('error', new MulterError('LIMIT_FIELD_KEY'))
      }

      appendField(body, fieldname, value)
    })

    // handle files
    busboy.on('file', (fieldname, fileStream, filename, encoding, mimetype) => {
      // don't attach to the files object, if there is no file
      if (!filename) return fileStream.resume()

      // Work around bug in Busboy (https://github.com/mscdex/busboy/issues/6)
      if (limits.fieldNameSize && fieldname.length > limits.fieldNameSize) {
        return busboy.emit('error', new MulterError('LIMIT_FIELD_KEY'))
      }

      /**
       * @suppress {checkTypes}
       * @type {_idio.MulterFile}
       */
      const file = {
        fieldname,
        originalname: filename,
        encoding,
        mimetype,
      }

      const placeholder = appender.insertPlaceholder(file)

      fileFilter(req, file, async (err, includeFile) => {
        if (err) {
          appender.removePlaceholder(placeholder)
          return busboy.emit('error', err)
        }

        if (!includeFile) {
          appender.removePlaceholder(placeholder)
          return fileStream.resume()
        }

        let aborting = false
        pendingWrites.increment()

        file['stream'] = fileStream

        fileStream.on('error', () => {
          pendingWrites.decrement()
          busboy.emit('error', err)
        })

        fileStream.on('limit', function () {
          aborting = true
          busboy.emit('error', new MulterError('LIMIT_FILE_SIZE', fieldname))
        })

        try {
          const info = await storage._handleFile()
          const fileInfo = { ...file, ...info }

          if (aborting) {
            appender.removePlaceholder(placeholder)
            uploadedFiles.push(fileInfo)
            return
          }

          appender.replacePlaceholder(placeholder, fileInfo)
          uploadedFiles.push(fileInfo)
        } catch (error) {
          appender.removePlaceholder(placeholder)
          busboy.emit('error', error)
        } finally {
          pendingWrites.decrement()
        }
      })
    })

    const remove = file => storage._removeFile(req, file)

    req.pipe(busboy)

    try {
      await new Promise((r, j) => {
        busboy.on('error', j)
          .on('partsLimit', () => {
            j(new MulterError('LIMIT_PART_COUNT'))
          })
          .on('filesLimit', () => {
            j(new MulterError('LIMIT_FILE_COUNT'))
          })
          .on('fieldsLimit', () => {
            j(new MulterError('LIMIT_FIELD_COUNT'))
          })
          .on('finish', r)
      })
    } catch(err) {
      await pendingWrites.awaitZero()
      const errors = await removeUploadedFiles(uploadedFiles, remove)
      err['storageErrors'] = errors

      throw err
    } finally {
      drainStream(req)
      req.unpipe(busboy)
      busboy.removeAllListeners()
    }

    await pendingWrites.awaitZero()
  }
}

/**
 * @param {Array<_idio.MulterFile>} uploadedFiles
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
 * @typedef {import('../../types').MulterFileFilter} _idio.MulterFileFilter
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../types').MulterFile} _idio.MulterFile
 */