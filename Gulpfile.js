'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('default', ['jshint']);

gulp.task('jshint', function(){
  gulp.src(['src/**/*.js', 'test/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});
