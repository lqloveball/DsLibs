var gulp = require('gulp'); //gulp
var fs = require('fs'); //文件系统
var glob = require('glob');
// var path = require('path'); //路径习题
var del = require('del'); //文件删除
// var newer = require('gulp-newer'); //快速创建copy
// var copy = require('gulp-copy'); //拷贝
// var watch = require('gulp-watch'); //观察者
// var browserSync = require('browser-sync').create(); //自动刷新调试
// var less = require('gulp-less'); //less编译
// var lazyImageCSS = require('gulp-lazyimagecss'); // 自动为图片样式添加 宽/高/background-size 属性
// var minifyCSS = require('gulp-minify-css'); //压缩css
// var concat = require('gulp-concat');//合并js文件成一个 有webpack后这个没有存在必要【不需要】
// var usemin = require('gulp-usemin2'); //剥离html里面开发插入的js，替换成压缩的min
// var uglify = require('gulp-uglify'); //js压缩
// var rename = require('gulp-rename'); //重新命名
// var removeCode = require('gulp-remove-code'); //进行删除指定块的代码
// var replace = require('gulp-replace'); //进行字符替换
// var imagemin = require('gulp-imagemin');//jpg图片压缩 使用pp鸭 【不需要】
// var pngquant = require('imagemin-pngquant');//png图片压缩 【不需要】

/**
 * 清除webpack编译打包
 * @type {[type]}
 */
gulp.task('clean:webpack', function() {
    return del([
        '../js/app/',
    ], {
        force: true
    });
});

gulp.task('default', ['clean:webpack']);
