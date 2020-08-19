import assert from 'assert'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

import slm, { Options } from '../'
import { compile } from 'slm'

import through from 'through2'
import { extname } from 'path'
import gulp from 'gulp'
import File from 'vinyl'

const readFile = promisify(fs.readFile)

//
// Absolute path of fixtures/helloworld.slm
//
const filename = path.join(__dirname, 'fixtures', 'helloworld.slm')

//
// Mockup plugin to set the file.data property
// Not testing the gulp-data plugin options, just that gulp-slm can get its data
//   from file.data
//
const setData = () =>
  through.obj(function (file, _enc, cb) {
    file.data = {
      title: 'Greetings!',
    }
    this.push(file)

    return cb()
  })

//
// Mockup plugin to check if the build result with gulp is same with the compile
//   result with require('slm').compile
//
async function expectStream(options: Options) {
  options.filename = filename
  const compiled = compile(await readFile(filename, 'utf8'), options)
  const expected = compiled(options.data || options.locals)
  const ext = '.html'

  return through.obj((file, _enc, cb) => {
    assert.equal(expected, String(file.contents))
    assert.equal(extname(file.path), ext)
    assert.equal(extname(file.relative), file.relative ? ext : '')

    return cb()
  })
}

//
// Tests
//
describe('gulp-slm', () => {
  it('should compile my slm files into HTML', async () => {
    gulp
      .src(filename)
      .pipe(slm())
      .pipe(await expectStream({}))
  })

  it('should compile my slm files into HTML with locals passed in', async () => {
    gulp
      .src(filename)
      .pipe(
        slm({
          locals: {
            title: 'Yellow Curled',
          },
        })
      )
      .pipe(
        await expectStream({
          locals: {
            title: 'Yellow Curled',
          },
        })
      )
  })

  it('should compile my slm files into HTML with data passed in', async () => {
    gulp
      .src(filename)
      .pipe(
        slm({
          data: {
            title: 'Yellow Curled',
          },
        })
      )
      .pipe(
        await expectStream({
          data: {
            title: 'Yellow Curled',
          },
        })
      )
  })

  it('should compile my slm files into HTML with data property', async () => {
    gulp
      .src(filename)
      .pipe(setData())
      .pipe(slm())
      .pipe(
        await expectStream({
          data: {
            title: 'Greetings!',
          },
        })
      )
  })

  it('should always return contents as a buffer', () => {
    gulp
      .src(filename)
      .pipe(slm())
      .pipe(
        through.obj((file, _enc, cb) => {
          assert(file.contents instanceof Buffer)
          return cb()
        })
      )
  })

  it('should throw an error if given contents is a stream', () => {
    const stream = slm()

    stream.on('error', (err) => {
      assert.equal(
        err.toString(),
        `\x1B[31mError\x1B[39m in plugin "\x1B[36mgulp-slm\x1B[39m"
Message:
    Streaming not supported`
      )
    })
    stream.write(
      new File({
        path: filename,
        base: path.join(__dirname, 'fixtures'),
        cwd: __dirname,
        contents: fs.createReadStream(filename),
      })
    )
    stream.end()
  })
})
