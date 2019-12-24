const errorMessages = {
  'LIMIT_PART_COUNT': 'Too many parts',
  'LIMIT_FILE_SIZE': 'File too large',
  'LIMIT_FILE_COUNT': 'Too many files',
  'LIMIT_FIELD_KEY': 'Field name too long',
  'LIMIT_FIELD_VALUE': 'Field value too long',
  'LIMIT_FIELD_COUNT': 'Too many fields',
  'LIMIT_UNEXPECTED_FILE': 'Unexpected field',
}

/**
 * @implements {_multipart.FormDataError}
 */
export default class FormDataError extends Error {
  constructor(message) {
    super(message)
    this.code = ''
    this.field = undefined
  }
  /**
   * @param {string} code
   * @param {string} [field]
   */
  static create(code, field) {
    const message = errorMessages[code]
    const err = new FormDataError(message)
    err.code = code
    if (field) err.field = field
    return err
  }
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../..').FormDataError} _multipart.FormDataError
 */