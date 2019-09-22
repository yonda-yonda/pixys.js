const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const connect = require('gulp-connect');

gulp.task('js-concat', function () {
    return gulp.src([
            './src/index.js'
        ])
        .pipe(plumber())
        .pipe(concat('pixys.js'))
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(gulp.dest('./dist'));
});


gulp.task('server', function () {
    connect.server({
        root: './',
        livereload: true,
        port: 3000
    });
});

gulp.task('js-compress', function () {
    return gulp.src('./dist/pixys.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(rename('pixys.min.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('js-babel-polyfill', function () {
    return gulp.src(['node_modules/babel-polyfill/dist/polyfill.min.js'])
        .pipe(rename({
            prefix: 'babel-'
        }))
        .pipe(gulp.dest('./dist'));
});


gulp.task('default', gulp.series('js-babel-polyfill', 'js-concat', 'js-compress'));