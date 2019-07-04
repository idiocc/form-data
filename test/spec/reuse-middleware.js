import Context from '../context'
import MultipartFormData from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'reuses middleware'({ getApp, startApp, fixture, normalise }) {
    const upload = new MultipartFormData()
    const mw = upload.array('files')
    const app = getApp(mw)
    app.use((ctx) => { ctx.body = {
      ...ctx.req.body,
      ...ctx.req.files.map(normalise),
    } })
    await startApp()
      .postForm('/', (form) => {
        form.addSection('hello', 'world')
        form.addSection('world', 'hello')
      })
      .assert(200, {
        hello: 'world',
        world: 'hello',
      })
      .postForm('/', async (form) => {
        form.addSection('test', 'jesus')
        form.addSection('whereis', 'mymind')
        await form.addFile(fixture`tiny0.dat`, 'files')
        await form.addFile(fixture`tiny1.dat`, 'files')
      })
      .assert(200, {
        test: 'jesus',
        whereis: 'mymind',
        0: {
          fieldname: 'files',
          originalname: 'tiny0.dat',
          encoding: '7bit',
          mimetype: 'application/octet-stream',
          size: 122,
        },
        1: {
          fieldname: 'files',
          originalname: 'tiny1.dat',
          encoding: '7bit',
          mimetype: 'application/octet-stream',
          size: 7,
        },
      })
      .postForm('/', async (form) => {
        await form.addFile(fixture`tiny1.dat`, 'files')
        await form.addFile(fixture`small0.dat`, 'files')
      })
      .assert(200, {
        0: {
          fieldname: 'files',
          originalname: 'tiny1.dat',
          encoding: '7bit',
          mimetype: 'application/octet-stream',
          size: 7,
        },
        1: {
          fieldname: 'files',
          originalname: 'small0.dat',
          encoding: '7bit',
          mimetype: 'application/octet-stream',
          size: 1777,
        },
      })
  },
}

export default T