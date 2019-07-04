import Context from '../context'
import MultipartFormData from '../../src'

/** @type {Object.<string, (c: Context, t: TempContext)>} */
const T = {
  context: Context,
  async 'presents files in same order as they came'({ getApp, startApp, fixture, normalise }) {
    let files = []
    const upload = new MultipartFormData({
      storage: {
        _handleFile(req, file) {
          files.push(file)
          let d = []
          file.stream.on('data', (data) => {
            d.push(data)
          })
        },
      },
    })
    const mw = upload.array('files', 2)
    const app = getApp(mw)
    app.use((ctx) => {
      ctx.body = 'ok'
    })
    await startApp()
      .postForm('/', async (form) => {
        await form.addFile(fixture`tiny0.dat`, 'files')
        await form.addFile(fixture`tiny1.dat`, 'files')
      })
      .assert(200, 'ok')
    return files.map(normalise)
  },
}

export default T