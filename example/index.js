/* alanode example/ */
import multer from '../src'
import Goa from '@goa/koa'

(async () => {
  const app = new Goa()
  app.use((ctx) => {
    throw new Error('error')
  })
  app.listen(function() {
    console.log('http://localhost:' + this.address().port)
  })
})()