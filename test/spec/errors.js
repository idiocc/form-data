import { ok, equal, throws } from '@zoroaster/assert'
import TempContext from 'temp-context'
import Context from '../context'
import MultipartFormData, { diskStorage, FormDataError, memoryStorage } from '../../src'

/** @type {Object.<string, (c: Context, t: TempContext)>} */
const T = {
  context: [Context, TempContext],
  async 'is an instance of both Error and FormDataError classes'(
    { error, startApp, fixture }, { TEMP }) {
    const storage = diskStorage({ destination: TEMP })
    const upload = new MultipartFormData({ storage })
    const mw = upload.fields([
      { name: 'small0', maxCount: 1 },
    ])
    const p = error(mw)
    await startApp()
      .postForm('/', async (form) => {
        await form.addFile(fixture`small0.dat`, 'small0')
        await form.addFile(fixture`small0.dat`, 'small0')
      })
      .assert(500)
    const err = await p
    if (process.env['ALAMODE_ENV'] != 'test-compile')
      ok(err instanceof FormDataError)
    ok(err instanceof Error)
    equal(err.code, 'LIMIT_UNEXPECTED_FILE')
  },
  async 'respects parts limit'({ error, startApp, fixture }) {
    const storage = memoryStorage()
    const upload = new MultipartFormData({ storage, limits: { parts: 1 } })
    const mw = upload.fields([
      { name: 'small0', maxCount: 1 },
    ])
    const p = error(mw)
    await startApp()
      .postForm('/', async (form) => {
        form.addSection('field0', 'BOOM!')
        await form.addFile(fixture`small0.dat`, 'small0')
      })
      .assert(500)
    const err = await p
    equal(err.code, 'LIMIT_PART_COUNT')
  },
  async 'respects file size limit'({ error, startApp, fixture }) {
    const storage = memoryStorage()
    const upload = new MultipartFormData({ storage, limits: { fileSize: 1500 } })
    const mw = upload.fields([
      { name: 'tiny0', maxCount: 1 },
      { name: 'small0', maxCount: 1 },
    ])
    const p = error(mw)
    await startApp()
      .postForm('/', async (form) => {
        await form.addFile(fixture`tiny0.dat`, 'tiny0')
        await form.addFile(fixture`small0.dat`, 'small0')
      })
      .assert(500)
    const err = await p
    equal(err.code, 'LIMIT_FILE_SIZE')
    equal(err.field, 'small0')
  },
  async 'respects file count limit'({ error, startApp, fixture }) {
    const storage = memoryStorage()
    const upload = new MultipartFormData({ storage, limits: { files: 1 } })
    const mw = upload.fields([
      { name: 'tiny0', maxCount: 1 },
      { name: 'small0', maxCount: 1 },
    ])
    const p = error(mw)
    await startApp()
      .postForm('/', async (form) => {
        await form.addFile(fixture`tiny0.dat`, 'tiny0')
        await form.addFile(fixture`small0.dat`, 'small0')
      })
      .assert(500)
    const err = await p
    equal(err.code, 'LIMIT_FILE_COUNT')
  },
  async 'respects file key limit'({ error, startApp, fixture }) {
    const storage = memoryStorage()
    const upload = new MultipartFormData({ storage, limits: { fieldNameSize: 4 } })
    const mw = upload.fields([
      { name: 'small0', maxCount: 1 },
    ])
    const p = error(mw)
    await startApp()
      .postForm('/', async (form) => {
        await form.addFile(fixture`small0.dat`, 'small0')
      })
      .assert(500)
    const err = await p
    equal(err.code, 'LIMIT_FIELD_KEY')
  },
  async 'respects field key limit'({ startApp, error }) {
    const storage = memoryStorage()
    const upload = new MultipartFormData({ storage, limits: { fieldNameSize: 4 } })
    const mw = upload.fields([])
    const p = error(mw)
    await startApp()
      .postForm('/', (form) => {
        form.addSection('ok', 'SMILE')
        form.addSection('blowup', 'BOOM!')
      })
      .assert(500)
    const err = await p
    equal(err.code, 'LIMIT_FIELD_KEY')
  },
  async 'respects field value limit'({ startApp, error }) {
    const storage = memoryStorage()
    const upload = new MultipartFormData({ storage, limits: { fieldSize: 16 } })
    const mw = upload.fields([])
    const p = error(mw)
    await startApp()
      .postForm('/', (form) => {
        form.addSection('field0', 'This is okay')
        form.addSection('field1', 'This will make the parser explode')
      })
      .assert(500)
    const err = await p
    equal(err.code, 'LIMIT_FIELD_VALUE')
    equal(err.field, 'field1')
  },
  async 'respects field count limit'({ startApp, error }) {
    const storage = memoryStorage()
    const upload = new MultipartFormData({ storage, limits: { fields: 1 } })
    const mw = upload.fields([])
    const p = error(mw)
    await startApp()
      .postForm('/', (form) => {
        form.addSection('hello', 'world')
        form.addSection('world', 'hello')
      })
      .assert(500)
    const err = await p
    equal(err.code, 'LIMIT_FIELD_COUNT')
  },
  async 'respects fields given'({ startApp, error, fixture }) {
    const storage = memoryStorage()
    const upload = new MultipartFormData({ storage })
    const mw = upload.fields([
      { name: 'wrongname', maxCount: 1 },
    ])
    const p = error(mw)
    await startApp()
      .postForm('/', async (form) => {
        await form.addFile(fixture`small0.dat`, 'small0')
      })
      .assert(500)
    const err = await p
    equal(err.code, 'LIMIT_UNEXPECTED_FILE')
    equal(err.field, 'small0')
  },
  async 'reports errors from storage engines'({ startApp, error, fixture }) {
    const storage = memoryStorage()
    const e = new Error('Test error')
    e.code = 'TEST'
    storage._removeFile = () => {
      throw e
    }
    const upload = new MultipartFormData({ storage })
    const mw = upload.single('tiny0')
    const p = error(mw)
    await startApp()
      .postForm('/', async (form) => {
        await form.addFile(fixture`tiny0.dat`, 'tiny0')
        await form.addFile(fixture`small0.dat`, 'small0')
      })
      .assert(500)
    const err = await p
    equal(err.code, 'LIMIT_UNEXPECTED_FILE')
    equal(err.field, 'small0')
    equal(err.storageErrors.length, 1)
    await throws({
      fn() {
        throw err.storageErrors[0]
      },
      error: e,
    })
  },
  async 'reports errors from busboy constructor'({ startApp, error }) {
    const storage = memoryStorage()
    const upload = new MultipartFormData({ storage })
    const mw = upload.single('tiny0')
    const p = error(mw)
    await startApp()
      .post('/', 'test', {
        headers: { 'Content-Type': 'multipart/form-data' },
        type: null,
      })
      .assert(500)
    const err = await p
    equal(err.message, 'Multipart: Boundary not found')
  },
  async 'reports errors from busboy parsing'({ startApp, error }) {
    const storage = memoryStorage()
    const upload = new MultipartFormData({ storage })
    const mw = upload.single('tiny0')
    const p = error(mw)
    const boundary = 'AaB03x'
    const body = [
      `--${boundary}`,
      'Content-Disposition: form-data; name="tiny0"; filename="test.txt"',
      'Content-Type: text/plain',
      '',
      'test without end boundary',
    ].join('\r\n')
    await startApp()
      .post('/', body, {
        headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
        type: null,
      })
      .assert(500)
    const err = await p
    equal(err.message, 'Unexpected end of multipart data')
  },
  async 'gracefully handles more than one error at a time'({ startApp, error, fixture }, { TEMP }) {
    const upload = new MultipartFormData({ dest: TEMP, limits: { fileSize: 1, files: 1 } })
    const mw = upload.fields([
      { name: 'small0', maxCount: 1 },
    ])
    const p = error(mw)
    await startApp()
      .postForm('/', async (form) => {
        await form.addFile(fixture`small0.dat`, 'small0')
        await form.addFile(fixture`small0.dat`, 'small0')
      })
      .assert(500)
    const err = await p
    equal(err.code, 'LIMIT_FILE_SIZE')
  },
  async 'reports limit errors'({ startApp, error, fixture }, { TEMP }) {
    const upload = new MultipartFormData({ dest: TEMP, limits: { fileSize: 100 } })
    const mw = upload.single('file')
    const p = error(mw)
    await throws({
      async fn() {
        await startApp()
          .postForm('/', async (form) => {
            await form.addFile(fixture`large.jpg`, 'file')
          })
      },
      code: 'EPIPE',
    })
    const err = await p
    equal(err.code, 'LIMIT_FILE_SIZE')
    equal(err.field, 'file')
  },
}

export default T