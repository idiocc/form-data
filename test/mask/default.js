import makeTestSuite from '@zoroaster/mask'
import Context from '../context'
import MultipartFormData from '../../src'

export default makeTestSuite('node_modules/@multipart/test-form-data/default.md', {
  /** @param {Context} p */
  async getResults({ getApp, startApp, updateStore }) {
    const upload = new MultipartFormData()
    const mw = upload.fields([])
    const app = getApp(mw)
    app.use((ctx) => { ctx.body = ctx.req.body })
    let res
    await startApp()
      .postForm('/', (form) => {
        const data = JSON.parse(this.input)
        data.forEach(({ key, value }) => {
          form.addSection(key, value)
        })
      })
      .assert(({ body }) => {
        res = body
      })
    updateStore(res)
    return res
  },
  jsonProps: ['expected'],
  context: Context,
})