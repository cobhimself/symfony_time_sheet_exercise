var gulp = require('gulp'),
    babel = require("gulp-babel"),
    sourcemaps = require('gulp-sourcemaps'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    commonJS = require('gulp-commonjs');

gulp.task('scripts', function(cb) {
    'use strict';

    gulp.src("./web/assets/js/app.js")
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat("all.js"))
        .pipe(sourcemaps.write("../maps"))
        .pipe(commonJS())
        .pipe(gulp.dest("./web/assets/dist/js"))
        .pipe(notify({message: 'React App Compiled.', onLast: true}));

    // Add already minified vendor JS
    gulp.src([
        'bootstrap-sass/assets/javascripts/bootstrap.min.js',
        'jquery/dist/jquery.min.js',
        'jquery-validation/dist/jquery.validate.min.js'
        //    'modernizr/bin/modernizr'
    ], {cwd: './bower_components/'})
        .pipe(gulp.dest('./web/assets/dist/js/vendor/'))
        .pipe(notify({ message: 'Vendor JS copied.', onLast: true }));

    return cb();
});

