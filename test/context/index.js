import Http from '@contexts/http'
import Goa from '@goa/koa'
import { join } from 'path'
import { createReadStream, statSync } from 'fs'
import { updateStore } from '@multipart/test-form-data'

/**
 * A testing context for the package.
 */
export default class Context extends Http {
  /**
   * A tagged template that returns the relative path to the fixture.
   * @param {string} file
   * @example
   * fixture`input.txt` // -> test/fixture/input.txt
   */
  fixture(file) {
    const f = file.raw[0]
    return join('test/fixture', f)
  }
  /**
   * @param {Middleware} middleware
   */
  getApp(middleware) {
    const app = new Goa()
    app.use(middleware)
    this._app = app
    return app
  }
  /**
   * @param {Middleware} middleware
   */
  error(middleware) {
    if (!this._app) {
      this.getApp(middleware)
    }
    const p = new Promise((r) => this._app.on('error', r))
    return p
  }
  startApp(plain = true) {
    const cb = this._app.callback()
    if (plain)
      return this.startPlain(cb)
    return this.start(cb)
  }
  file(name) {
    return createReadStream(this.fixture`${name}`)
  }
  fileSize(path) {
    return statSync(path).size
  }
  get updateStore() {
    return updateStore
  }
  /**
   * Removes random data not suitable for testing.
   */
  normalise({ buffer, stream, filename, path, ...data }) {
    return data
  }
}
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@goa/koa').Middleware} Middleware
 */