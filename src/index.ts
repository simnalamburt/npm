import through from 'through2'
import slm from 'slm'
import PluginError from 'plugin-error'
import replaceExt from 'replace-ext'

type Options = {
  filename?: string
  extension?: string
  data?: any
  locals?: any
}

export default (opts: Options = {}) =>
  through.obj((file, _enc, cb) => {
    opts.filename = file.path

    if (file.data) {
      opts.data = file.data
    }

    file.path = replaceExt(
      file.path,
      opts.extension !== undefined ? opts.extension : '.html'
    )

    if (file.isStream()) {
      return cb(new PluginError('gulp-slm', 'Streaming not supported'))
    }

    if (file.isBuffer()) {
      try {
        const contents = String(file.contents)
        const compiled = slm.compile(contents, opts)(opts.locals || opts.data)
        file.contents = Buffer.from(compiled)
      } catch (e) {
        return cb(new PluginError('gulp-slm', e))
      }
    }

    cb(null, file)
  })
