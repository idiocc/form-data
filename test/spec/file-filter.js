import Context from '../context'
import MultipartFormData from '../../src'
import { strictEqual } from 'assert'

/** @type {Object.<string, (c: Context, t: TempContext)>} */
const T = {
  context: Context,
  async 'skips some files'({ getApp, startApp, fixture, updateFiles }) {
    const upload = new MultipartFormData({
      async fileFilter(req, file) {
        return file.fieldname != 'skip'
      },
    })
    const mw = upload.fields([
      { name: 'skip', maxCount: 1 },
      { name: 'test', maxCount: 1 },
    ])
    const app = getApp(mw)
    app.use((ctx) => { res = ctx.req.files; ctx.body = ctx.req.body })
    let res
    await startApp()
      .postForm('/', async (form) => {
        await form.addFile(fixture`tiny0.dat`, 'skip')
        await form.addFile(fixture`tiny0.dat`, 'test')
      })
      .assert(200, {})
    return updateFiles(res)
  },

  async 'reports errors from fileFilter'({ error, startApp, fixture }) {
    const err = new Error('test')
    const upload = new MultipartFormData({
      fileFilter() { throw err },
    })
    const mw = upload.fields([
      { name: 'test', maxCount: 1 },
    ])
    const p = error(mw)
    await startApp()
      .postForm('/', async (form) => {
        await form.addFile(fixture`tiny0.dat`, 'test')
      })
      .assert(500)
    const e = await p
    strictEqual(e, err)
  },
}

export default T