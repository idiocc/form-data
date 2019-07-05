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
const middleware = multipart.any()
app.use(middleware)
app.use((ctx) => {
  log('Fields', ctx.req.body)
  log('Files', ctx.req.files)
})
/* end example */

function log(label, data) {
  if (label == 'Files')
    data.forEach((file) => {
      delete file.stream
      file.filename = file.filename.substring(0, 10)
      file.path = file.path.substring(0, 15)
    })
  console.log('%s: %O', label, data)
}

(async () => {
  temp._TEMP = 'temp'
  try { await temp._init() } catch (err) { /** */ }
  await http.startPlain(app.callback())
    .postForm('/', async (form) => {
      form.addSection('hello', 'world')
      form.addSection('name', 'multipart')
      await form.addFile('test/fixture/test.txt', 'file')
      await form.addFile('test/fixture/large.jpg', 'picture')
    })
  await http._destroy()
  try { await temp._destroy() } catch (err) { /** */}
})()

/* end example */