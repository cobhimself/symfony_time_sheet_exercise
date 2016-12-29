var gulp = require('gulp'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  autoprefixer = require('gulp-autoprefixer'),
  cleancss = require('gulp-clean-css'),
  notify = require('gulp-notify'),
  rename = require('gulp-rename');

gulp.task('styles', function(cb) {
  'use strict';

  //Local styles
  gulp.src('./web/assets/sass/styles.sass')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('./web/assets/dist/css/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cleancss())
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('./web/assets/dist/css'))
    .pipe(notify({message: 'Styles task complete'}));

  //Make sure bootstrap fonts are loaded
  gulp.src(['bootstrap-sass/assets/fonts/**'], {cwd: 'bower_components/'})
    .pipe(gulp.dest('web/assets/dist/fonts/'));

  gulp.src(['normalize-css/normalize.css'], {cwd: 'bower_components/'})
    .pipe(gulp.dest('web/assets/dist/css/vendor/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cleancss())
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('web/assets/dist/css/vendor/'));

  cb();
});

