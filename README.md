gulp-slm [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url]
========

## Information

<table>
<tr>
<td>Package</td><td>gulp-slm</td>
</tr>
<tr>
<td>Description</td>
<td>Compile Slm templates</td>
</tr>
<tr>
<td>Node Version</td>
<td>≥ 0.10</td>
</tr>
</table>

## Usage

Compile to HTML

```javascript
var slm = require('gulp-slm');

gulp.task('templates', function() {
  var YOUR_LOCALS = {};

  gulp.src('./lib/*.slm')
    .pipe(slm({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./dist/'))
});
```

## LICENSE

(MIT License)

Copyright (c) 2014 Hyeon Kim

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[npm-url]: https://npmjs.org/package/gulp-slm
[npm-image]: https://badge.fury.io/js/gulp-slm.svg
[travis-url]: https://travis-ci.org/simnalamburt/gulp-slm
[travis-image]: https://travis-ci.org/simnalamburt/gulp-slm.svg?branch=master
[coveralls-url]: https://coveralls.io/r/simnalamburt/gulp-slm
[coveralls-image]: https://img.shields.io/coveralls/simnalamburt/gulp-slm.svg
[depstat-url]: https://david-dm.org/simnalamburt/gulp-slm
[depstat-image]: https://david-dm.org/simnalamburt/gulp-slm.svg
