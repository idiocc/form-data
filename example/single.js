import Http from '@contexts/http'
import Temp from 'temp-context'
const http = new Http()
const temp = new Temp()
/* start example */
import Multipart from '../src'
import Goa from '@goa/koa'

const app = new Goa()
const multipart = new Multipart({
  dest: 'temp',
})
const middleware = multipart.single('file')
app.use(middleware)
app.use((ctx) => {
  console.log('Fields: %O', ctx.req.body)
  delete ctx.req.file.stream
  console.log('File: %O', ctx.req.file)
})
/* end example */

;(async () => {
  temp._TEMP = 'temp'
  try { await temp._init() } catch (err) { /** */ }
  await http.startPlain(app.callback())
    .postForm('/', async (form) => {
      form.addSection('hello', 'world')
      form.addSection('name', 'multipart')
      await form.addFile('test/fixture/test.txt', 'file')
    })
  await http._destroy()
  // try { await temp._destroy() } catch (err) { /** */}
})()

/* end example */