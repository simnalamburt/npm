/*global describe, it */
'use strict';

const slm = require('../');
const compile = require('slm').compile;

const through = require('through2');
const path = require('path');
const fs = require('fs');
const extname = require('path').extname;
const gulp = require('gulp');
const File = require('gulp-util').File;
const PluginError = require('gulp-util').PluginError;

const expect = require('chai').expect;

//
// Absolute path of fixtures/helloworld.slm
//
const filename = path.join(__dirname, 'fixtures', 'helloworld.slm');

//
// Mockup plugin to set the file.data property
// Not testing the gulp-data plugin options, just that gulp-slm can get its data
//   from file.data
//
function setData() {
  return through.obj(function(file, enc, cb) {
    file.data = {
      title: 'Greetings!',
    };
    this.push(file);

    return cb();
  });
}

//
// Mockup plugin to check if the build result with gulp is same with the compile
//   result with require('slm').compile
//
function expectStream(options) {
  options = options || {};

  options.filename = filename;
  const compiled = compile(fs.readFileSync(filename, 'UTF-8'), options);
  const expected = compiled(options.data || options.locals);
  const ext = '.html';

  return through.obj((file, enc, cb) => {
    expect(expected).to.be.eql(String(file.contents));
    expect(extname(file.path)).to.be.eql(ext);
    expect(extname(file.relative)).to.be.eql(file.relative ? ext : '');

    return cb();
  });
}

//
// Tests
//
describe('gulp-slm', () => {
  it('should compile my slm files into HTML', () => {
    gulp
      .src(filename)
      .pipe(slm())
      .pipe(expectStream());
  });

  it('should compile my slm files into HTML with locals passed in', () => {
    gulp
      .src(filename)
      .pipe(
        slm({
          locals: {
            title: 'Yellow Curled',
          },
        }),
      )
      .pipe(
        expectStream({
          locals: {
            title: 'Yellow Curled',
          },
        }),
      );
  });

  it('should compile my slm files into HTML with data passed in', () => {
    gulp
      .src(filename)
      .pipe(
        slm({
          data: {
            title: 'Yellow Curled',
          },
        }),
      )
      .pipe(
        expectStream({
          data: {
            title: 'Yellow Curled',
          },
        }),
      );
  });

  it('should compile my slm files into HTML with data property', () => {
    gulp
      .src(filename)
      .pipe(setData())
      .pipe(slm())
      .pipe(
        expectStream({
          data: {
            title: 'Greetings!',
          },
        }),
      );
  });

  it('should always return contents as a buffer', () => {
    gulp
      .src(filename)
      .pipe(slm())
      .pipe(
        through.obj((file, enc, cb) => {
          expect(file.contents).to.be.an.instanceOf(Buffer);
          return cb();
        }),
      );
  });

  it('should throw an error if given contents is a stream', () => {
    const stream = slm();

    stream.on('error', err => {
      expect(err).to.be.an.instanceOf(PluginError);
    });
    stream.write(
      new File({
        path: filename,
        base: path.join(__dirname, 'fixtures'),
        cwd: __dirname,
        contents: fs.createReadStream(filename),
      }),
    );
    stream.end();
  });
});
