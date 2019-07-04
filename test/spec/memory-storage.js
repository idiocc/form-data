import { equal } from '@zoroaster/assert'
import Context from '../context'
import Multer from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: [Context],
  async 'processes multipart/form-data POST request'(
    { getApp, startApp, fixture, normalise }) {
    const upload = new Multer()
    const mw = upload.single('file')
    const app = getApp(mw)
    let file
    app.use((ctx) => { ctx.body = ctx.req.body; file = ctx.req.file })
    await startApp()
      .postForm('/', async (form) => {
        form.addSection('name', '@multipart/form-data')
        await form.addFile(fixture`tiny1.dat`, 'file')
      })
      .assert(200, {
        name: '@multipart/form-data',
      })
    const { buffer, ...data } = file
    equal(buffer.length, 7)
    return normalise(data)
  },
  async 'processes empty fields and an empty file'(
    { getApp, startApp, fixture, normalise }) {
    const upload = new Multer()
    const mw = upload.single('empty')
    const app = getApp(mw)
    let file
    app.use((ctx) => { ctx.body = ctx.req.body; file = ctx.req.file })
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
      .assert(200, {
        checkboxempty: ['', ''],
        checkboxfull: ['cb1', 'cb2'],
        checkboxhalfempty: ['cb1', ''],
        name: '@multipart/form-data',
        version: '',
        year: '',
      })
    const { buffer, ...data } = file
    equal(buffer.length, 0)
    return normalise(data)
  },
  async 'processes multiple files'({ getApp, startApp, fixture, updateFiles }) {
    const upload = new Multer()
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
    let files
    app.use((ctx) => { ctx.body = 200; files = ctx.req.files })
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
      .assert(200)
    return updateFiles(files)
  },
}

export default T