/*global describe, it */
'use strict';

var slm = require('../');
var compile = require('slm').compile;

var through = require('through2');
var path = require('path');
var fs = require('fs');
var extname = require('path').extname;
var gulp = require('gulp');
var File = require('gulp-util').File;
var PluginError = require('gulp-util').PluginError;

var expect = require('chai').expect;

//
// Absolute path of fixtures/helloworld.slm
//
var filename = path.join(__dirname, 'fixtures', 'helloworld.slm');

//
// Mockup plugin to set the file.data property
// Not testing the gulp-data plugin options, just that gulp-slm can get its data
//   from file.data
//
function setData() {
  return through.obj(function(file, enc, cb) {
    file.data = {
      title: 'Greetings!'
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
  var compiled = compile(fs.readFileSync(filename, 'UTF-8'), options);
  var expected = compiled(options.data || options.locals);
  var ext = '.html';

  return through.obj(function(file, enc, cb) {
    expect(expected)              .to.be.eql(String(file.contents));
    expect(extname(file.path))    .to.be.eql(ext);
    expect(extname(file.relative)).to.be.eql(file.relative ? ext : '');

    return cb();
  });
}

//
// Tests
//
describe('gulp-slm', function() {
  it('should compile my slm files into HTML', function() {
    gulp.src(filename)
      .pipe(slm())
      .pipe(expectStream());
  });

  it('should compile my slm files into HTML with locals passed in', function() {
    gulp.src(filename)
      .pipe(slm({
        locals: {
          title: 'Yellow Curled'
        }
      }))
      .pipe(expectStream({
        locals: {
          title: 'Yellow Curled'
        }
      }));
  });

  it('should compile my slm files into HTML with data passed in', function() {
    gulp.src(filename)
      .pipe(slm({
        data: {
          title: 'Yellow Curled'
        }
      }))
      .pipe(expectStream({
        data: {
          title: 'Yellow Curled'
        }
      }));
  });

  it('should compile my slm files into HTML with data property', function() {
    gulp.src(filename)
      .pipe(setData())
      .pipe(slm())
      .pipe(expectStream({
        data: {
          title: 'Greetings!'
        }
      }));
  });

  it('should always return contents as a buffer', function() {
    gulp.src(filename)
      .pipe(slm())
      .pipe(through.obj(function(file, enc, cb) {
        expect(file.contents).to.be.an.instanceOf(Buffer);
        return cb();
      }));
  });

  it('should throw an error if given contents is a stream', function() {
    var stream = slm();

    stream.on('error', function(err) {
      expect(err).to.be.an.instanceOf(PluginError);
    });
    stream.write(new File({
      path: filename,
      base: path.join(__dirname, 'fixtures'),
      cwd: __dirname,
      contents: fs.createReadStream(filename)
    }));
    stream.end();
  });
});
