gulp-slm [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url]
========

Compile Slm to HTML for Gulp

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

### Information

<table><tbody>
<tr><td>  Package       </td><td>  gulp-slm      </td></tr>
<tr><td>  Node Version  </td><td>  ≥ 0.10        </td></tr>
<tr><td>  Gulp Version  </td><td>  ≥ 3.8.7       </td></tr>
<tr><td>  LICENSE       </td><td>  BSD 3-Clause  </td></tr>
</tbody></table>

[npm-url]: https://npmjs.org/package/gulp-slm
[npm-image]: https://badge.fury.io/js/gulp-slm.svg
[travis-url]: https://travis-ci.org/simnalamburt/gulp-slm
[travis-image]: https://travis-ci.org/simnalamburt/gulp-slm.svg?branch=master
[coveralls-url]: https://coveralls.io/r/simnalamburt/gulp-slm
[coveralls-image]: https://img.shields.io/coveralls/simnalamburt/gulp-slm.svg
[depstat-url]: https://david-dm.org/simnalamburt/gulp-slm
[depstat-image]: https://david-dm.org/simnalamburt/gulp-slm.svg
