var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify');

gulp.task('scripts', function(cb) {
    'use strict';

    /**
     * Put together the top level JS in our JS folder.
     */
    gulp.src(['./web/assets/js/PE.util.js', './web/assets/js/PE.*.js'])
        .pipe(sourcemaps.init())
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('web/assets/dist/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify({
            'drop_debugger': true,
            'dead_code': true,
            'drop_console': true,
        }))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('web/assets/dist/js'))
        .pipe(notify({ message: 'Main JS Compiled' }));

    // Add already minified vendor JS
    gulp.src([
        'bootstrap-sass/assets/javascripts/bootstrap.min.js',
        'jquery/dist/jquery.min.js',
        'jquery-validation/dist/jquery.validate.min.js'
        //    'modernizr/bin/modernizr'
    ], {cwd: './bower_components/'})
        .pipe(gulp.dest('./web/assets/dist/js/vendor/'))
        .pipe(notify({ message: 'Vendor JS copied.' }));

    return cb();
});

