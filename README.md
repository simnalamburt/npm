gulp-slm [![NPM version][npm-i]][npm-u] [![Build Status][travis-i]][travis-u] [![Coveralls Status][coveralls-i]][coveralls-u] [![Dependency Status][depstat-i]][depstat-u]
========

Compile Slm to HTML for Gulp

```slim
doctype html
html
  head
    meta charset="utf-8"
    title = this.title
  body
    h1 = this.title
    p = this.text
```

```javascript
var slm = require('gulp-slm');

gulp.task('slm', function() {
  var data = {
    title: 'Hello, world!',
    text: 'Hello world example for slm template.',
  };

  return gulp.src('./src/*.slm')
    .pipe(slm({ locals: data }))
    .pipe(gulp.dest('./build/'));
});
```

Result: (whitespace included for readability)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Hello, world!</title>
  </head>
  <body>
    <h1>Hello, world!</h1>
    <p>Hello world example for slm template.</p>
  </body>
</html>
```

### Information

<table><tbody>
<tr><td>  Package       </td><td>  gulp-slm      </td></tr>
<tr><td>  Node Version  </td><td>  ≥ 0.10        </td></tr>
<tr><td>  Gulp Version  </td><td>  ≥ 3.8.7       </td></tr>
<tr><td>  LICENSE       </td><td>  BSD 3-Clause  </td></tr>
</tbody></table>

[npm-u]: https://npmjs.org/package/gulp-slm
[npm-i]: https://badge.fury.io/js/gulp-slm.svg
[travis-u]: https://travis-ci.org/simnalamburt/gulp-slm
[travis-i]: https://travis-ci.org/simnalamburt/gulp-slm.svg?branch=master
[coveralls-u]: https://coveralls.io/r/simnalamburt/gulp-slm
[coveralls-i]: https://img.shields.io/coveralls/simnalamburt/gulp-slm.svg
[depstat-u]: https://david-dm.org/simnalamburt/gulp-slm
[depstat-i]: https://david-dm.org/simnalamburt/gulp-slm.svg
