import Http from '@contexts/http'
import Goa from '@goa/koa'
import { join } from 'path'
import { createReadStream, statSync } from 'fs'

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
}
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@goa/koa').Middleware} Middleware
 */