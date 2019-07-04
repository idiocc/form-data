import Context from '../context'
import MultipartFormData from '../../src'

async function fillForm(form, fixture) {
  await form.addFile(fixture`empty.dat`, 'CA$|-|')
  await form.addFile(fixture`tiny0.dat`, 'set-1')
  await form.addFile(fixture`empty.dat`, 'set-1')
  await form.addFile(fixture`tiny1.dat`, 'set-1')
  await form.addFile(fixture`tiny1.dat`, 'set-2')
  await form.addFile(fixture`tiny0.dat`, 'set-2')
  await form.addFile(fixture`empty.dat`, 'set-2')
}

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'selects all files with fieldname'({ getApp, startApp, fixture, updateFiles }) {
    const upload = new MultipartFormData()
    const mw = upload.fields([
      { name: 'CA$|-|', maxCount: 1 },
      { name: 'set-1', maxCount: 3 },
      { name: 'set-2', maxCount: 3 },
    ])
    const app = getApp(mw)
    let files
    app.use((ctx) => { ctx.body = 200; files = ctx.req.files })
    await startApp()
      .postForm('/', async (form) => {
        await fillForm(form, fixture)
      })
      .assert(200)
    return updateFiles(files)
  },
}

export default T