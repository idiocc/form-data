import { equal, deepEqual, ok } from '@zoroaster/assert'
import TempContext from 'temp-context'
import Context from '../context'
import MultipartFormData, { diskStorage } from '../../src'
import { join } from 'path'
import { readFileSync } from 'fs'

/** @type {Object.<string, (c: Context, t: TempContext)>} */
const T = {
  context: [Context, TempContext],
  'is a function'() {
    equal(typeof MultipartFormData, 'function')
  },
  async 'processes parser/form-data POST request'(
    { getApp, startApp, fixture, normalise }, { TEMP, read }) {
    const upload = new MultipartFormData({ dest: TEMP })
    const mw = upload.single('file')
    const app = getApp(mw)
    app.use((ctx) => {
      ok(ctx.req.file, 'Expected file in the request.')
      ctx.body = ctx.req.file
    })
    let fn
    await startApp()
      .postForm('/', async (form) => {
        await form.addFile(fixture`tiny0.dat`, 'file')
      })
      .assert(200)
      .assert(({ body }) => {
        fn = body.filename
        deepEqual(normalise(body), {
          fieldname: 'file',
          originalname: 'tiny0.dat',
          encoding: '7bit',
          mimetype: 'application/octet-stream',
          destination: 'test/temp',
          size: 122,
        })
      })
    return read(fn)
  },
  async 'processes empty fields and an empty file'(
    { getApp, startApp, fixture, normalise }, { TEMP, read }) {
    const upload = new MultipartFormData({ dest: TEMP })
    const mw = upload.single('empty')
    const app = getApp(mw)
    app.use((ctx) => {
      ctx.body = { file: ctx.req.file, body: ctx.req.body }
    })
    let fn
    await startApp()
      .postForm('/', async (form) => {
        await form.addFile(fixture`empty.dat`, 'empty')
        form.addSection('name', '@multipart/form-data')
        form.addSection('version', '')
        form.addSection('year', '')
        form.addSection('checkboxfull', 'cb1')
        form.addSection('checkboxfull', 'cb2')
        form.addSection('checkboxhalfempty', 'cb1')
        form.addSection('checkboxhalfempty', '')
        form.addSection('checkboxempty', '')
        form.addSection('checkboxempty', '')
      })
      .assert(({ body: { body, file } }) => {
        fn = file.filename
        deepEqual(body, {
          checkboxempty: ['', ''],
          checkboxfull: ['cb1', 'cb2'],
          checkboxhalfempty: ['cb1', ''],
          name: '@multipart/form-data',
          version: '',
          year: '',
        })
        deepEqual(normalise(file), {
          destination: 'test/temp',
          encoding: '7bit',
          fieldname: 'empty',
          mimetype: 'application/octet-stream',
          originalname: 'empty.dat',
          size: 0,
        })
      })
    const { length } = await read(fn)
    equal(length, 0, 'File should be empty.')
  },
  async 'processes multiple files'(
    { getApp, startApp, fixture, normalise }, { TEMP, read, resolve }) {
    const upload = new MultipartFormData({ dest: TEMP })
    const mw = upload.fields([
      { name: 'empty', maxCount: 1 },
      { name: 'tiny0', maxCount: 1 },
      { name: 'tiny1', maxCount: 1 },
      { name: 'small0', maxCount: 1 },
      { name: 'small1', maxCount: 1 },
      { name: 'medium', maxCount: 1 },
      { name: 'large', maxCount: 1 },
    ])
    const app = getApp(mw)
    app.use((ctx) => {
      ctx.body = ctx.req.files
    })
    const result = {}
    await startApp()
      .postForm('/', async (form) => {
        await form.addFile(fixture`empty.dat`, 'empty')
        await form.addFile(fixture`tiny0.dat`, 'tiny0')
        await form.addFile(fixture`tiny1.dat`, 'tiny1')
        await form.addFile(fixture`small0.dat`, 'small0')
        await form.addFile(fixture`small1.dat`, 'small1')
        await form.addFile(fixture`medium.dat`, 'medium')
        await form.addFile(fixture`large.jpg`, 'large')
      })
      .assert(({ body }) => {
        const files = Object.entries(body).reduce((acc, [key, val]) => {
          acc[key] = val.map(normalise)
          const [{ filename }] = val
          result[key] = filename
          return acc
        }, {})
        deepEqual(files, { empty:
        [ { fieldname: 'empty',
          originalname: 'empty.dat',
          encoding: '7bit',
          mimetype: 'application/octet-stream',
          destination: 'test/temp',
          size: 0 } ],
        tiny0:
        [ { fieldname: 'tiny0',
          originalname: 'tiny0.dat',
          encoding: '7bit',
          mimetype: 'application/octet-stream',
          destination: 'test/temp',
          size: 122 } ],
        tiny1:
        [ { fieldname: 'tiny1',
          originalname: 'tiny1.dat',
          encoding: '7bit',
          mimetype: 'application/octet-stream',
          destination: 'test/temp',
          size: 7 } ],
        small0:
        [ { fieldname: 'small0',
          originalname: 'small0.dat',
          encoding: '7bit',
          mimetype: 'application/octet-stream',
          destination: 'test/temp',
          size: 1777 } ],
        small1:
        [ { fieldname: 'small1',
          originalname: 'small1.dat',
          encoding: '7bit',
          mimetype: 'application/octet-stream',
          destination: 'test/temp',
          size: 315 } ],
        medium:
        [ { fieldname: 'medium',
          originalname: 'medium.dat',
          encoding: '7bit',
          mimetype: 'application/octet-stream',
          destination: 'test/temp',
          size: 13196 } ],
        large:
        [ { fieldname: 'large',
          originalname: 'large.jpg',
          encoding: '7bit',
          mimetype: 'application/octet-stream',
          destination: 'test/temp',
          size: 1592548 } ] })
      })
    const s = await Object.entries(result).reduce(async (acc, [key, filename]) => {
      let accRes = await acc
      let val
      if (key == 'large') {
        val = readFileSync(resolve(filename))
      } else val = await read(filename)
      if (key == 'large') val = `<<${val.length} bytes>>`
      accRes += `## ${key}\n\n${val}\n\n`
      return accRes
    }, '')
    return s
  },
  async 'removes uploaded files on error'(
    { getApp, startApp, fixture }, { TEMP, snapshot }) {
    const upload = new MultipartFormData({ dest: TEMP })
    const mw = upload.single('tiny0')
    const app = getApp(mw)
    app.silent = true
    await startApp()
      .postForm('/', async (form) => {
        await form.addFile(fixture`tiny0.dat`, 'tiny0')
        await form.addFile(fixture`small0.dat`, 'small0')
      })
      .assert(500)
    const { length } = await snapshot()
    equal(length, 0, 'No files are expected.')
  },
  async 'reports error when directory doesn\'t exist'(
    { getApp, startApp, fixture }, { TEMP }) {
    const dir = join(TEMP, 'ghost')
    const storage = diskStorage({ destination() {
      return dir
    } })
    const upload = new MultipartFormData({ storage })
    const mw = upload.single('tiny0')
    const app = getApp(mw)
    const p = new Promise((r) => app.on('error', r))
    app.silent = true
    await startApp()
      .postForm('/', async (form) => {
        await form.addFile(fixture`tiny0.dat`, 'tiny0')
      })
      .assert(404)
    await p
  },
}

export default T