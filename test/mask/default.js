import makeTestSuite from '@zoroaster/mask'
import Context from '../context'
import multer from '../../src'

// export default
makeTestSuite('test/result', {
  async getResults() {
    const res = await multer({
      text: this.input,
    })
    return res
  },
  context: Context,
})