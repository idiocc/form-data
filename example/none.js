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
const middleware = multipart.none()
app.use(middleware)
app.use((ctx) => {
  log('Fields', ctx.req.body)
  log('Files', ctx.req.files)
})
/* end example */

function log(label, data) {
  console.log('%s: %O', label, data)
}

(async () => {
  temp._TEMP = 'temp'
  try { await temp._init() } catch (err) { /** */ }
  await http.startPlain(app.callback())
    .postForm('/', async (form) => {
      form.addSection('hello', 'world')
      form.addSection('name', 'multipart')
    })
  await http._destroy()
  // try { await temp._destroy() } catch (err) { /** */}
})()

/* end example */