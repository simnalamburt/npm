/*global describe, it */

'use strict';

var assert = require('chai').assert;

var task = require('../');
var path = require('path');
var fs = require('fs');
var File = require('gulp-util').File;
var PluginError = require('gulp-util').PluginError;

var filePath = path.join(__dirname, 'fixtures', 'helloworld.slm');
var base = path.join(__dirname, 'fixtures');
var cwd = __dirname;

var file = new File({
  path: filePath,
  base: base,
  cwd: cwd,
  contents: fs.createReadStream(filePath)
});

describe('gulp-slm', function() {
  it('should error if contents is a stream', function() {
    var stream = task();
    stream.on('error', function(err){
      assert.ok(err instanceof PluginError, 'not an instance of PluginError');
    });
    stream.write(file);
    stream.end();
  });
});
