'use strict';

const through = require('through2');
const slm = require('slm');
const {replaceExtension, PluginError} = require('gulp-util');

module.exports = (opts = {}) =>
  through.obj((file, enc, cb) => {
    opts.filename = file.path;

    if (file.data) {
      opts.data = file.data;
    }

    file.path = replaceExtension(
      file.path,
      opts.extension !== undefined ? opts.extension : '.html',
    );

    if (file.isStream()) {
      return cb(new PluginError('gulp-slm', 'Streaming not supported'));
    }

    if (file.isBuffer()) {
      try {
        const contents = String(file.contents);
        const compiled = slm.compile(contents, opts)(opts.locals || opts.data);
        file.contents = new Buffer(compiled);
      } catch (e) {
        return cb(new PluginError('gulp-slm', e));
      }
    }

    cb(null, file);
  });
