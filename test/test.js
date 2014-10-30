/*global describe, it */

'use strict';

var assert = require('chai').assert;

var gulp = require('gulp');
var task = require('../');
var slm = require('slm');
var through = require('through2');
var path = require('path');
var fs = require('fs');
var extname = require('path').extname;

var filename = path.join(__dirname, './fixtures/helloworld.slm');

// Mock Data Plugin
// (not testing the gulp-data plugin options, just that gulp-slm can get its data from file.data)
function setData() {
  return through.obj(function(file, enc, callback) {
    file.data = {
      title: 'Greetings!'
    };
    this.push(file);
    return callback();
  });
}

function expectStream(options) {
  options = options || {};
  var ext = '.html';
  var compiler = slm.compile;
  return through.obj(function(file, enc, cb) {
    options.filename = filename;
    var compiled = compiler(fs.readFileSync(filename, enc), options);
    var expected = compiled(options.data || options.locals);
    assert.equal(expected, String(file.contents));
    assert.equal(extname(file.path), ext);
    if(file.relative){
      assert.equal(extname(file.relative), ext);
    } else {
      assert.equal(extname(file.relative), '');
    }
    cb();
  });
}



describe('gulp-slm', function() {

it('should compile my slm files into HTML', function() {
  gulp.src(filename)
    .pipe(task())
    .pipe(expectStream());
});

it('should compile my slm files into HTML with locals passed in', function() {
  gulp.src(filename)
    .pipe(task({
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
    .pipe(task({
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
    .pipe(task())
    .pipe(expectStream({
      data: {
        title: 'Greetings!'
      }
    }));
});

it('should always return contents as buffer', function() {
  gulp.src(filename)
    .pipe(task())
    .pipe(through.obj(function(file, enc, cb) {
      assert.ok(file.contents instanceof Buffer);
      cb();
    }));
});

});
