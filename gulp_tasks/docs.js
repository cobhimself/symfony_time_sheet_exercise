"use strict"

var gulp = require('gulp'),
    markdown = require('gulp-markdown');

gulp.task('docs', function () {
  gulp.src(['README.md'])
    .pipe(markdown())
    .pipe(gulp.dest('docs'));
});
