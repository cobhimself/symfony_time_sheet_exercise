var gulp = require('gulp'),
    livereload = require('gulp-livereload'),

    sass_files = ['web/assets/sass/**/*sass'],
    js_files = ['web/assets/js/**/*.js'],
    template_files = ['app/Resources/views/**/*.html.twig'];

gulp.task('watch', function() {
    'use strict';

    // Create LiveReload server
    livereload.listen();

    // Watch sass files
    gulp.watch(sass_files, ['styles']).on('change', livereload.changed);

    // Watch .js files
    gulp.watch(js_files, ['scripts', 'jsDocs']).on('change', livereload.changed);

    //Watch template files.
    gulp.watch(template_files).on('change', livereload.changed);

});

