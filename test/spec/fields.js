import Context from '../context'
import Multer from '../../src'

/** @type {Object.<string, (c: Context, t: TempContext)>} */
const T = {
  context: Context,
  async 'processes multiple fields'({ getApp, startApp }) {
    const upload = new Multer()
    const mw = upload.fields([])
    const app = getApp(mw)
    app.use((ctx) => { ctx.body = ctx.req.body })
    await startApp()
      .postForm('/', (form) => {
        form.addSection('name', '@multipart/form-data')
        form.addSection('key', 'value')
        form.addSection('hello', 'world')
      })
      .assert(200, {
        name: '@multipart/form-data',
        key: 'value',
        hello: 'world',
      })
  },
  async 'processes empty fields'({ getApp, startApp }) {
    const upload = new Multer()
    const mw = upload.fields([])
    const app = getApp(mw)
    app.use((ctx) => { ctx.body = ctx.req.body })
    await startApp()
      .postForm('/', (form) => {
        form.addSection('name', '@multipart/form-data')
        form.addSection('key', '')
        form.addSection('hello', '')
        form.addSection('cb-full', 'a')
        form.addSection('cb-full', 'b')
        form.addSection('cb-half', 'a')
        form.addSection('cb-half', '')
        form.addSection('cb-empty', '')
        form.addSection('cb-empty', '')
      })
      .assert(200, {
        name: '@multipart/form-data',
        key: '',
        hello: '',
        'cb-full': ['a', 'b'],
        'cb-half': ['a', ''],
        'cb-empty': ['', ''],
      })
  },
  async 'does not process non-multipart POST request'({ getApp, startApp }) {
    const upload = new Multer()
    const mw = upload.fields([])
    const app = getApp(mw)
    app.use((ctx) => ctx.body = {
      body: ctx.req.body || null,
      file: ctx.req.file || null,
      files: ctx.req.files || null,
    })
    await startApp()
      .post('/', { hello: 'world ' })
      .assert(200, {
        body: null,
        file: null,
        files: null,
      })
  },
  async 'does not process non-multipart GET request'({ getApp, startApp }) {
    const upload = new Multer()
    const mw = upload.fields([])
    const app = getApp(mw)
    app.use((ctx) => ctx.body = {
      body: ctx.req.body || null,
      file: ctx.req.file || null,
      files: ctx.req.files || null,
    })
    await startApp()
      .get('/?name=multipart')
      .assert(200, {
        body: null,
        file: null,
        files: null,
      })
  },
  async 'converts arrays into objects'({ getApp, startApp }) {
    const upload = new Multer()
    const mw = upload.fields([])
    const app = getApp(mw)
    app.use((ctx) => ctx.body = ctx.req.body)
    await startApp()
      .postForm('/', (form) => {
        form.addSection('obj[0]', 'a')
        form.addSection('obj[2]', 'c')
        form.addSection('obj[x]', 'yz')
      })
      .assert(200, {
        obj: {
          0: 'a',
          2: 'c',
          'x': 'yz',
        },
      })
  },
}

export default T