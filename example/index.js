/* alanode example/ */
import multer from '../src'

(async () => {
  const res = await multer({
    text: 'example',
  })
  console.log(res)
})()