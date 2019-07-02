import { equal, ok } from '@zoroaster/assert'
import Context from '../context'
import multer from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof multer, 'function')
  },
  async 'calls package without error'() {
    await multer()
  },
  async 'gets a link to the fixture'({ fixture }) {
    const text = fixture`text.txt`
    const res = await multer({
      text,
    })
    ok(res, text)
  },
}

export default T