gulp-slm [![version-i] ![download-i]][npm]
========

Let's use [Slm] with [Gulp]!

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

##### Result *(whitespace included for readability)*

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

<br>

### Developer manuel

[![buildstat-i]][travis]
[![coverage-i]][coveralls]
[![depstat-i]][david]
[![devdepstat-i]][david]

```bash
# Install dependencies
yarn

# Install dependencies
yarn test
```

<br>

--------

*gulp-slm* is primarily distributed under the terms of both the [MIT license]
and the [Apache License (Version 2.0)]. See [COPYRIGHT] for details.

[Slm]:          https://github.com/slm-lang/slm
[Gulp]:         https://gulpjs.com/
[npm]:          https://npmjs.org/package/gulp-slm
[travis]:       https://travis-ci.org/simnalamburt/gulp-slm
[coveralls]:    https://coveralls.io/r/simnalamburt/gulp-slm
[david]:        https://david-dm.org/simnalamburt/gulp-slm

[version-i]:    https://img.shields.io/npm/v/gulp-slm.svg?style=flat
[download-i]:   https://img.shields.io/npm/dm/gulp-slm.svg?style=flat
[buildstat-i]:  https://img.shields.io/travis/simnalamburt/gulp-slm/master.svg?style=flat
[coverage-i]:   https://img.shields.io/coveralls/simnalamburt/gulp-slm.svg?style=flat
[depstat-i]:    https://david-dm.org/simnalamburt/gulp-slm.svg?style=flat
[devdepstat-i]: https://david-dm.org/simnalamburt/gulp-slm/dev-status.svg?style=flat

[MIT license]: LICENSE-MIT
[Apache License (Version 2.0)]: LICENSE-APACHE
[COPYRIGHT]: COPYRIGHT
