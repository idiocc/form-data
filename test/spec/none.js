import { equal } from '@zoroaster/assert'
import Context from '../context'
import MultipartFormData from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: [Context],
  async 'does not allow file uploads'({ error, startApp, fixture }) {
    const upload = new MultipartFormData()
    const mw = upload.none()
    const p = error(mw)
    await startApp()
      .postForm('/', async (form) => {
        form.addSection('name', '@multipart/form-data')
        await form.addFile(fixture`tiny1.dat`, 'file')
      })
      .assert(500)
    const err = await p
    equal(err.code, 'LIMIT_UNEXPECTED_FILE')
    equal(err.field, 'file')
  },
  async 'handles text fields'({ getApp, startApp }) {
    const upload = new MultipartFormData()
    const mw = upload.single('empty')
    const app = getApp(mw)
    app.use((ctx) => { ctx.body = ctx.req.body })
    await startApp()
      .postForm('/', async (form) => {
        form.addSection('hello', 'world')
        form.addSection('world', 'hello')
      })
      .assert(200, {
        hello: 'world',
        world: 'hello',
      })
  },
}

export default T