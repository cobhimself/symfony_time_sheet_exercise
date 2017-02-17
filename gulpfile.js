"use strict"
var gulp = require('gulp'),
    requireDir = require('require-dir'),
    tasks = requireDir('./gulp_tasks');

gulp.task('default', function() {
    gulp.start('styles');
});
