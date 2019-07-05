import { collect } from 'catchment'

/**
 * @implements {_multipart.FormDataStorageEngine}
 */
export default class MemoryStorage {
  /**
   * @param {http.IncomingMessage} req
   * @param {_multipart.FormDataFile} file
   */
  async _handleFile(req, file) {
    const data = await collect(/** @type {stream.Readable } */ (file['stream']), {
      binary: true,
    })
    return {
      'buffer': data,
      'size': data.length,
    }
  }
  async _removeFile(req, file) {
    delete file['buffer']
    return null
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