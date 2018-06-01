var gulp = require('gulp'); //gulp
var fs = require('fs'); //文件系统
var del = require('del'); //文件删除
var gulpCopy = require('gulp-copy'); //拷贝



var _destPath = '../../Output/';


gulp.task('del', function () {

    if (!fs.existsSync(_destPath)) fs.mkdirSync(_destPath);
});

gulp.task('copy', function () {

    gulp.src([
        '../favicon.ico',
        '../index.html',
    ]).pipe(gulp.dest(_destPath));

    gulp.src([
        '../assets/*.js',
    ]).pipe(gulp.dest(_destPath+'assets/'));

    gulp.src([
        '../assets/images/**',
    ]).pipe(gulp.dest(_destPath+'assets/images/'));

    gulp.src([
        '../js/**',
    ]).pipe(gulp.dest(_destPath+'js/'));

    gulp.src([
        '../css/**',
    ]).pipe(gulp.dest(_destPath+'css/'));

    gulp.src([
        '../images/**',
    ]).pipe(gulp.dest(_destPath+'images/'));

    gulp.src([
        '../media/**',
    ]).pipe(gulp.dest(_destPath+'media/'));



});

gulp.task('default', ['del','copy']);


