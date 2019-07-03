import { collect } from 'catchment'

class MemoryStorage {
  /**
   * @param {?} req
   * @param {{ stream }} file
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
  _removeFile(req, file, cb) {
    delete file['buffer']
    cb(null)
  }
}

export default function() {
  return new MemoryStorage()
}
