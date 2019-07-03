import { equal, deepEqual } from '@zoroaster/assert'
import TempContext from 'temp-context'
import Context from '../context'
import Multer, { } from '../../src'

/** @type {Object.<string, (c: Context, t: TempContext)>} */
const T = {
  context: [Context, TempContext],
  'is a function'() {
    equal(typeof multer, 'function')
  },
  async 'processes parser/form-data POST request'({ getApp, startApp, fixture }, { TEMP, read }) {
    const upload = new Multer({ dest: TEMP })
    const mw = upload.single('file')
    const app = getApp(mw)
    app.use((ctx) => {
      ctx.body = ctx.req.file
    })
    let fn
    await startApp()
      .postForm('/', async (form) => {
        await form.addFile(fixture`tiny0.dat`, 'file')
      })
      .assert(({ body: { stream, filename, path, ...data } }) => {
        fn = filename
        deepEqual(data, {
          fieldname: 'file',
          originalname: 'tiny0.dat',
          encoding: '7bit',
          mimetype: 'application/octet-stream',
          destination: 'test/temp',
          size: 122,
        })
      })
    return read(fn)
  },
}

export default T