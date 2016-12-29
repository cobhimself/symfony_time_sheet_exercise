var gulp = require('gulp'),
    del = require('del');

gulp.task('clean', function (callback) {
    del([
        'web/assets/dist/css',
        'web/assets/dist/js',
        'web/assets/dist/maps',
        'web/assets/dist/fonts'
    ], callback);
});

