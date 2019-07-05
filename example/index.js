import Http from '@contexts/http'
import Temp from 'temp-context'
const http = new Http()
const temp = new Temp()
/* start example */
import MultipartFormData from '../src'
import Goa from '@goa/koa'

const app = new Goa()
const multipart = new MultipartFormData({
  dest: 'example/temp',
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
  temp._TEMP = 'example/temp'
  await temp._init()
  await http.startPlain(app.callback())
    .postForm('/', async (form) => {
      form.addSection('hello', 'world')
      form.addSection('name', '@multipart/form-data')
      await form.addFile('test/fixture/test.txt', 'file')
    })
  await http._destroy()
  await temp._destroy()
})()

/* end example */