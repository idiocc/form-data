import { equal } from '@zoroaster/assert'
import TempContext from 'temp-context'
import Context from '../context'
import MultipartFormData, { diskStorage } from '../../src'

/** @type {Object.<string, (c: Context, t: TempContext)>} */
const T = {
  context: [Context, TempContext],
  async 'rejects single unexpected file'({ error, startApp, fixture }) {
    const upload = new MultipartFormData()
    const mw = upload.single('butme')
    const p = error(mw)
    await startApp()
      .postForm('/', async (form) => {
        await form.addFile(fixture`small0.dat`, 'notme')
      })
      .assert(500)
    const err = await p
    equal(err.code, 'LIMIT_UNEXPECTED_FILE')
    equal(err.field, 'notme')
  },
  async 'rejects array of multiple files'({ error, startApp, fixture }) {
    const upload = new MultipartFormData()
    const mw = upload.array('butme', 4)
    const p = error(mw)
    await startApp()
      .postForm('/', async (form) => {
        await form.addFile(fixture`small0.dat`, 'notme')
        await form.addFile(fixture`small1.dat`, 'notme')
      })
      .assert(500)
    const err = await p
    equal(err.code, 'LIMIT_UNEXPECTED_FILE')
    equal(err.field, 'notme')
  },
  async 'rejects overflowing arrays'({ error, startApp, fixture }) {
    const upload = new MultipartFormData()
    const mw = upload.array('file', 1)
    const p = error(mw)
    await startApp()
      .postForm('/', async (form) => {
        await form.addFile(fixture`small0.dat`, 'file')
        await form.addFile(fixture`small1.dat`, 'file')
      })
      .assert(500)
    const err = await p
    equal(err.code, 'LIMIT_UNEXPECTED_FILE')
    equal(err.field, 'file')
  },
  async 'accepts files with expected fieldname'({ getApp, startApp, fixture, normalise }) {
    const upload = new MultipartFormData()
    const mw = upload.fields([
      { name: 'file', maxCount: 2 },
      { name: 'picture', maxCount: 2 },
    ])
    const app = getApp(mw)
    app.use((ctx) => {
      ctx.body = ctx.req.files
    })
    let files
    await startApp()
      .postForm('/', async (form) => {
        await form.addFile(fixture`small0.dat`, 'file')
        await form.addFile(fixture`small1.dat`, 'file')
        await form.addFile(fixture`small1.dat`, 'picture')
      })
      .assert(({ body }) => {
        files = Object.entries(body).reduce((acc, [key, val]) => {
          acc[key] = val.map(normalise)
          return acc
        }, {})
      })
    return files
  },
  async 'rejects files with unexpected fieldname'({ error, startApp, fixture }) {
    const upload = new MultipartFormData()
    const mw = upload.fields([
      { name: 'file', maxCount: 2 },
      { name: 'picture', maxCount: 2 },
    ])
    const p = error(mw)
    await startApp()
      .postForm('/', async (form) => {
        await form.addFile(fixture`small0.dat`, 'file')
        await form.addFile(fixture`small1.dat`, 'file')
        await form.addFile(fixture`tiny0.dat`, 'error')
      })
      .assert(500)
    const err = await p
    equal(err.code, 'LIMIT_UNEXPECTED_FILE')
    equal(err.field, 'error')
  },
  async 'allows any file to come thru'({ getApp, startApp, fixture, normalise }) {
    const upload = new MultipartFormData()
    const mw = upload.any()
    const app = getApp(mw)
    app.use((ctx) => ctx.body = ctx.req.files)
    let files
    await startApp()
      .postForm('/', async (form) => {
        await form.addFile(fixture`small0.dat`, 'file')
        await form.addFile(fixture`small1.dat`, 'picture')
        await form.addFile(fixture`tiny0.dat`, 'ok')
      })
      .assert(({ body }) => {
        files = body.map(normalise)
      })
    return files
  },
  async 'renames files'({ getApp, startApp, fixture }, { snapshot, TEMP }) {
    const upload = new MultipartFormData({
      storage: diskStorage({
        filename(a, { fieldname, originalname }) {
          return `${fieldname}-${originalname}`
        },
        destination() {
          return TEMP
        },
      }),
    })
    const mw = upload.any()
    const app = getApp(mw)
    app.use((ctx) => ctx.body = ctx.req.files)
    await startApp()
      .postForm('/', async (form) => {
        await form.addFile(fixture`tiny1.dat`, 'file')
      })
      .assert(200)
    return snapshot()
  },
}

export default T