gulp-slm [![version] ![downloads]][npm]
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
import slm from 'gulp-slm'

gulp.task('slm', _ => {
  const data = {
    title: 'Hello, world!',
    text: 'Hello world example for slm template.',
  }

  return gulp
    .src('./src/*.slm')
    .pipe(slm({locals: data}))
    .pipe(gulp.dest('./build/'))
})
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

&nbsp;

--------

*gulp-slm* is primarily distributed under the terms of both the [Apache License
(Version 2.0)] and the [MIT license]. See [COPYRIGHT] for details.

[version]: https://badgen.net/npm/v/gulp-slm
[downloads]: https://badgen.net/npm/dt/gulp-slm
[npm]: https://npmjs.org/package/gulp-slm

[Slm]: https://github.com/slm-lang/slm
[Gulp]: https://gulpjs.com/

[MIT license]: LICENSE-MIT
[Apache License (Version 2.0)]: LICENSE-APACHE
[COPYRIGHT]: COPYRIGHT
