import { pseudoRandomBytes } from 'crypto'
import { tmpdir } from 'os'
import { join } from 'path'
import { createWriteStream } from 'fs'
import rm from '@wrote/rm'
import { ensurePathSync } from '@wrote/ensure-path'

async function getFilename() {
  return await new Promise((r, j) => {
    pseudoRandomBytes(16, (err, raw) => {
      if (err) return j(err)
      r(raw.toString('hex'))
    })
  })
}

/**
 * @implements {_idio.MulterStorageEngine}
 */
export default class DiskStorage {
  /**
   * @param {_idio.MulterDiskStorageOptions} [opts] The options.
   */
  constructor(opts = {}) {
    const {
      filename = getFilename,
      destination = tmpdir,
    } = opts

    this.getFilename = filename

    if (typeof destination == 'string') {
      ensurePathSync(destination)
      this.getDestination = () => destination
    } else {
      this.getDestination = destination
    }
  }
  async _handleFile(req, file) {
    const destination = await this.getDestination()
    const filename = await this.getFilename()

    const path = join(destination, filename)
    const outStream = createWriteStream(path)

    await new Promise((r, j) => {
      file['stream'].pipe(outStream)
      file['stream'].on('error', j)
      outStream.on('error', j)
      outStream.on('finish', r)
    })
    return {
      'destination': destination,
      'filename': filename,
      'path': path,
      'size': outStream.bytesWritten,
    }
  }

  async _removeFile(req, file) {
    const { 'path': path } = file

    delete file['destination']
    delete file['filename']
    delete file['path']
    await rm(path)
  }
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../types').MulterStorageEngine} _idio.MulterStorageEngine
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../types').MulterDiskStorageOptions} _idio.MulterDiskStorageOptions
 */