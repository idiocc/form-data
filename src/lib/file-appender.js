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
   * @param {_multipart.FormDataFile} placeholder The information about each file.
   */
  insertPlaceholder({ fieldname }) {
    const placeholder = /** @type {!_multipart.FormDataFile} */ ({
      fieldname,
    })

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
   * @param {_multipart.FormDataFile} placeholder The information about each file.
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
   * @param {_multipart.FormDataFile} placeholder The information about each file.
   * @param {_multipart.FormDataFile} file The information about each file.
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
 * @typedef {import('../../types').FormDataFile} _multipart.FormDataFile
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('http').IncomingMessage} http.IncomingMessage
 */