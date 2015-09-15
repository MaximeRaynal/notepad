var del = require('del'),
    gulp = require('gulp'),
    less = require('gulp-less'),
    notify = require('gulp-notify'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    cssMinify = require('gulp-minify-css'),
    runSequence = require('run-sequence');


/**
 * Build task
 */

gulp.task('less-notepad', function () {
    return gulp.src('less/notepad.less')
               .pipe(less())
               .pipe(cssMinify())
               .pipe(gulp.dest('assets/css'))
               .pipe(notify('build less-notepad done'));
});

gulp.task('js-notepad', function () {
  return gulp.src(['js/notepad/*.js',
                   'js/lib/noname-js/template-rendering.js',
                   'js/lib/noname-js/tools.js'])
             //.pipe(uglify())
             .pipe(concat('notepad.js'))
             .pipe(gulp.dest('assets/js'))
             .pipe(notify('build js-notepad done'));
});


// -- Font deploying
gulp.task('copy-fonts-roboto', function () {
    return gulp.src('less/lib/material/fonts/roboto/**/*')
               .pipe(gulp.dest('assets/fonts/roboto/'));
});

gulp.task('copy-fonts-material-icons', function () {
    return gulp.src('less/lib/material/fonts/material-icons/**/*')
               .pipe(gulp.dest('assets/fonts/material-icons/'));
});

/**
 * Tools Tasks
 */

gulp.task('clean', function (cb) {
    del(['assets/js/*',
         'assets/css/*',
         'assets/img/*'], cb);
});

gulp.task('connect', function() {
    connect.server({
        port: 81
    });
});

gulp.task('server', ['connect'/*, 'livereload'*/]);


/**
 * Main task
 */

// Compile all Less files, for all pages
gulp.task('less', ['less-notepad']);

// Create unique compacted scripting file, for all page
gulp.task('js', ['js-notepad']);

gulp.task('copy-fonts', ['copy-fonts-roboto', 'copy-fonts-material-icons']);


gulp.task('build', ['js', 'less', 'copy-fonts']);

// La tache de build de prod
gulp.task('prod', function () {
    // Assure que clean soit terminé avant de lancer build
    runSequence('clean', 'build');
});

gulp.task('watch', ['prod', 'server'], function() {
    gulp.watch('less/**/*.less', ['less']);
    gulp.watch('js/**/*.js', ['js']);
    //gulp.watch('images', ['images']);
});

// Le watcher en default pour le dev
gulp.task('default', ['watch']);
