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
const mw = multipart.array('file', 2)
app.use(mw)
app.use((ctx) => {
  console.log('Fields: %O', ctx.req.body)
  clearStream(ctx.req.files)
  console.log('Files: %O', ctx.req.files)
})
/* end example */

function clearStream(files) {
  files.forEach(file => delete file.stream)
}

(async () => {
  temp._TEMP = 'temp'
  await temp._init()
  await http.startPlain(app.callback())
    .postForm('/', async (form) => {
      form.addSection('hello', 'world')
      form.addSection('name', 'multipart')
      await form.addFile('test/fixture/test.txt', 'file')
      await form.addFile('test/fixture/test.txt', 'file')
    })
  await http._destroy()
  await temp._destroy()
})()

/* end example */