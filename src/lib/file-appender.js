function arrayRemove (arr, item) {
  var idx = arr.indexOf(item)
  if (~idx) arr.splice(idx, 1)
}

export default class FileAppender {
  /**
   * @param {string} strategy
   * @param {http.IncomingMessage} req
   */
  constructor(strategy, req) {
    this.strategy = strategy
    this.req = req

    switch (strategy) {
    case 'NONE': break
    case 'VALUE': break
    case 'ARRAY': req.files = []; break
    case 'OBJECT': req.files = {}; break
    default: throw new Error('Unknown file strategy: ' + strategy)
    }
  }
  /**
   * @param {_idio.MulterFile} placeholder The information about each file.
   * @param {string} placeholder.fieldname The field name specified in the form.
   * @param {string} placeholder.originalname The name of the file on the user's computer.
   * @param {string} placeholder.encoding The encoding type of the file.
   * @param {string} placeholder.mimetype The mime type of the file.
   * @param {number} placeholder.size The size of the file in bytes.
   * @param {string} placeholder.destination The folder to which the file has been saved.
   * @param {string} placeholder.filename The name of the file within the `destination`.
   * @param {string} placeholder.path The full path to the uploaded file.
   * @param {Buffer} placeholder.buffer The `Buffer` of the entire file.
   */
  insertPlaceholder({ fieldname }) {
    const placeholder = {
      fieldname,
    }

    switch (this.strategy) {
    case 'NONE': break
    case 'VALUE': break
    case 'ARRAY': this.req.files.push(placeholder); break
    case 'OBJECT':
      if (this.req.files[fieldname]) {
        this.req.files[fieldname].push(placeholder)
      } else {
        this.req.files[fieldname] = [placeholder]
      }
      break
    }

    return placeholder
  }
  /**
   * @param {_idio.MulterFile} placeholder The information about each file.
   * @param {string} placeholder.fieldname The field name specified in the form.
   * @param {string} placeholder.originalname The name of the file on the user's computer.
   * @param {string} placeholder.encoding The encoding type of the file.
   * @param {string} placeholder.mimetype The mime type of the file.
   * @param {number} placeholder.size The size of the file in bytes.
   * @param {string} placeholder.destination The folder to which the file has been saved.
   * @param {string} placeholder.filename The name of the file within the `destination`.
   * @param {string} placeholder.path The full path to the uploaded file.
   * @param {Buffer} placeholder.buffer The `Buffer` of the entire file.
   */
  removePlaceholder(placeholder) {
    switch (this.strategy) {
    case 'NONE': break
    case 'VALUE': break
    case 'ARRAY': arrayRemove(this.req.files, placeholder); break
    case 'OBJECT':
      if (this.req.files[placeholder.fieldname].length == 1) {
        delete this.req.files[placeholder.fieldname]
      } else {
        arrayRemove(this.req.files[placeholder.fieldname], placeholder)
      }
      break
    }
  }
  /**
   * @param {_idio.MulterFile} placeholder The information about each file.
   * @param {string} placeholder.fieldname The field name specified in the form.
   * @param {string} placeholder.originalname The name of the file on the user's computer.
   * @param {string} placeholder.encoding The encoding type of the file.
   * @param {string} placeholder.mimetype The mime type of the file.
   * @param {number} placeholder.size The size of the file in bytes.
   * @param {string} placeholder.destination The folder to which the file has been saved.
   * @param {string} placeholder.filename The name of the file within the `destination`.
   * @param {string} placeholder.path The full path to the uploaded file.
   * @param {Buffer} placeholder.buffer The `Buffer` of the entire file.
   * @param {_idio.MulterFile} file The information about each file.
   * @param {string} file.fieldname The field name specified in the form.
   * @param {string} file.originalname The name of the file on the user's computer.
   * @param {string} file.encoding The encoding type of the file.
   * @param {string} file.mimetype The mime type of the file.
   * @param {number} file.size The size of the file in bytes.
   * @param {string} file.destination The folder to which the file has been saved.
   * @param {string} file.filename The name of the file within the `destination`.
   * @param {string} file.path The full path to the uploaded file.
   * @param {Buffer} file.buffer The `Buffer` of the entire file.
   */
  replacePlaceholder(placeholder, file) {
    if (this.strategy == 'VALUE') {
      this.req.file = file
      return
    }

    delete placeholder.fieldname
    Object.assign(placeholder, file)
  }
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../types').MulterFile} _idio.MulterFile
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('http').IncomingMessage} http.IncomingMessage
 */