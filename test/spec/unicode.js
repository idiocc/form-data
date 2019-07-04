import Context from '../context'
import MultipartFormData from '../../src'
import TempContext from 'temp-context'

/** @type {Object.<string, (c: Context, t: TempContext)>} */
const T = {
  context: [Context, TempContext],
  async 'handles unicode filenames'({ getApp, startApp, fixture, normalise }, { TEMP }) {
    const upload = new MultipartFormData({ dest: TEMP })
    const mw = upload.single('small0')
    const app = getApp(mw)
    let file
    app.use((ctx) => { ctx.body = 200; file = ctx.req.file })
    await startApp()
      .postForm('/', async (form) => {
        await form.addFile(fixture`small0.dat`, 'small0', {
          filename: '\uD83E\uDD95.dat',
        })
      })
      .assert(200)
    return normalise(file)
  },
}

export default T