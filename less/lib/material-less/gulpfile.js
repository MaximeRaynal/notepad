var gulp = require('gulp'),
    less = require('gulp-less'),
    minify = require('gulp-minify-css');

gulp.task('less', function () {
    return gulp.src('material.less')
        .pipe(less())
        .pipe(minify())
        .pipe(gulp.dest('.'));
});

gulp.task('default', ['less'], function() {
  gulp.watch('*.less', ['less']);
})