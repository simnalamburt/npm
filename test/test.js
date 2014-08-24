'use strict';

var test = require('tap').test;

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
var setData = function(){
  return through.obj(function(file, enc, callback) {
    file.data = {
      title: 'Greetings!'
    };
    this.push(file);
    return callback();
  });
};

function expectStream(t, options){
  options = options || {};
  var ext = '.html';
  var compiler = slm.compile;
  return through.obj(function(file, enc, cb){
    options.filename = filename;
    var compiled = compiler(fs.readFileSync(filename, enc), options);
    var expected = compiled(options.data || options.locals);
    t.equal(expected, String(file.contents));
    t.equal(extname(file.path), ext);
    if(file.relative){
      t.equal(extname(file.relative), ext);
    } else {
      t.equal(extname(file.relative), '');
    }
    t.end();
    cb();
  });
}

test('should compile my slm files into HTML', function(t){
  gulp.src(filename)
    .pipe(task())
    .pipe(expectStream(t));
});

test('should compile my slm files into HTML with locals passed in', function(t){
  gulp.src(filename)
    .pipe(task({
      locals: {
        title: 'Yellow Curled'
      }
    }))
    .pipe(expectStream(t, {
      locals: {
        title: 'Yellow Curled'
      }
    }));
});

test('should compile my slm files into HTML with data passed in', function(t){
  gulp.src(filename)
    .pipe(task({
      data: {
        title: 'Yellow Curled'
      }
    }))
    .pipe(expectStream(t, {
      data: {
        title: 'Yellow Curled'
      }
    }));
});

test('should compile my slm files into HTML with data property', function(t){
  gulp.src(filename)
    .pipe(setData())
    .pipe(task())
    .pipe(expectStream(t, {
      data: {
        title: 'Greetings!'
      }
    }));
});

test('should always return contents as buffer', function(t){
  gulp.src(filename)
    .pipe(task())
    .pipe(through.obj(function(file, enc, cb){
      t.ok(file.contents instanceof Buffer);
      t.end();
      cb();
    }));
});
