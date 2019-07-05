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
 * @implements {_multipart.FormDataStorageEngine}
 */
export default class DiskStorage {
  /**
   * @param {_multipart.FormDataDiskStorageOptions} [opts] The options.
   */
  constructor(opts = {}) {
    const {
      filename = getFilename,
      destination = tmpdir,
    } = opts

    this.getFilename = filename

    if (typeof destination == 'string') {
      ensurePathSync(join(destination, 'file.dat'))
      this.getDestination = () => destination
    } else {
      this.getDestination = destination
    }
  }
  async _handleFile(req, file) {
    const destination = await this.getDestination(req, file)
    const filename = await this.getFilename(req, file)

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
 * @typedef {import('../../types').FormDataStorageEngine} _multipart.FormDataStorageEngine
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../types').FormDataDiskStorageOptions} _multipart.FormDataDiskStorageOptions
 */