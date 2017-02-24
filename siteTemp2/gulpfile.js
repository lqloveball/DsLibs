var gulp = require('gulp'); //gulp
var fs = require('fs'); //文件系统
var path = require('path'); //路径习题
var del = require('del'); //文件删除
var newer = require('gulp-newer'); //快速创建copy
var copy = require('gulp-copy'); //拷贝
var watch = require('gulp-watch'); //观察者
var browserSync = require('browser-sync').create(); //自动刷新调试
var less = require('gulp-less'); //less编译
var lazyImageCSS = require('gulp-lazyimagecss'); // 自动为图片样式添加 宽/高/background-size 属性
var minifyCSS = require('gulp-minify-css'); //压缩css
// var concat = require('gulp-concat');//合并js文件成一个 有webpack后这个没有存在必要【不需要】
var usemin = require('gulp-usemin2'); //剥离html里面开发插入的js，替换成压缩的min
var uglify = require('gulp-uglify'); //js压缩
var rename = require('gulp-rename'); //重新命名
var removeCode = require('gulp-remove-code'); //进行删除指定块的代码
var replace = require('gulp-replace'); //进行字符替换
// var imagemin = require('gulp-imagemin');//jpg图片压缩 使用pp鸭 【不需要】
// var pngquant = require('imagemin-pngquant');//png图片压缩 【不需要】
var webpack = require("webpack");//webpack
var _ = require('lodash'); //webpack配置更改
// 错误处理
var notify = require("gulp-notify");

module.exports = function(errorObject, callback) {
    // 错误通知
    notify.onError(errorObject.toString().split(': ').join(':\n'))
        .apply(this, arguments);

    // Keep gulp from hanging on this task
    if (typeof this.emit === 'function') {
        this.emit('end');
    }
};

/**
 * 刷新浏览器
 * @param  {[type]} value ['*.css']
 * @return {[type]}       [description]
 */
function browserReload(value) {
    if (value) browserSync.reload(value);
    else browserSync.reload();
}
/**
 * 开发目录
 * @type {Object}
 */
var developmentConfig = {
    //监听 html 文件刷新
    html: ['*.html', 'html/**/*.html'],
    //js html css 需要经过webpack编译
    src: ['src/**/*.js', 'src/**/*.html', 'src/**/*.css', 'src/**/*.vue'],
    //编译出来文件目录
    dist: './js/app/',
    //需要监听编译less文件
    lesswatch: ['less/*.less', 'less/**/*.less'],
    //需要编译的less文件
    lessbuild: ['less/*.less'],
    //less to css路径
    cssPath: "./css/",
    //css 变化监听
    css: ['css/*.css'],

};
/**
 * 生成js/css
 * @type {[type]}
 */
gulp.task('init:webpack', function() {
    webpack(require('./webpack.config.js')(), function(err, stats) {
        console.log('init:webpack end');
    });
});
/**
 * 清除webpack编译打包
 * @type {[type]}
 */
gulp.task('clean:webpack', function() {
    return del([
        developmentConfig.dist,
    ], {
        force: true
    });
});

/**
 * 生产环境  webpack
 * @type {[type]}
 */
gulp.task('watch:webpack', ['clean:webpack'], function() {
    webpack(_.merge(
            require('./webpack.config.js')(), {
                watch: true,
                devtool:null,
            }
        ))
        .watch(200, function(err, stats) {
            // console.log('webpack watch',err,stats);
            browserReload();
        });
});
// 开发环境 webpack
gulp.task('dev:webpack', ['clean:webpack'], function() {
      webpack(_.merge(
          require('./webpack.config.js')(), {
              watch: true,
              devtool:'#eval',
          }
      ))
      .watch(200, function(err, stats) {
          // console.log('webpack watch',err,stats);
          browserReload();
      });
});



/*进行生产开发测试*/
gulp.task('webpack', ['watch:webpack'], function() {
    //启动browserSync服务
    browserSync.init({
        server: './',
        port: 8001,
        open: "external"
    });

    //less编译监听
    watch(developmentConfig.lesswatch, {
        verbose: true
    }, function(e) {
        var cb = e.history[0];
        gulp.src(developmentConfig.lessbuild)
            .pipe(less().on('error', function(error) {
                console.log(error.message);
            }))
            .pipe(lazyImageCSS()) //自动为图片样式添加 宽/高/background-size 属性
            // .pipe(minifyCss({compatibility: 'ie8'}))
            .pipe(gulp.dest(developmentConfig.cssPath));
    });

    //html变化监听
    watch(developmentConfig.html, {
        verbose: true
    }, function(event) {
        browserReload('*.html');
    });
    //css 变化监听
    watch(developmentConfig.css, {
        verbose: true
    }, function(e) {
        browserReload('*.css');
    });
});

/*进行开发环境测试*/
gulp.task('webpack-dev', ['dev:webpack'], function() {
    //启动browserSync服务
    browserSync.init({
        server: './',
        port: 8001,
        open: "external"
    });

    //less编译监听
    watch(developmentConfig.lesswatch, {
        verbose: true
    }, function(e) {
        var cb = e.history[0];
        gulp.src(developmentConfig.lessbuild)
            .pipe(less().on('error', function(error) {
                console.log(error.message);
            }))
            .pipe(lazyImageCSS()) //自动为图片样式添加 宽/高/background-size 属性
            // .pipe(minifyCss({compatibility: 'ie8'}))
            .pipe(gulp.dest(developmentConfig.cssPath));
    });

    //html变化监听
    watch(developmentConfig.html, {
        verbose: true
    }, function(event) {
        browserReload('*.html');
    });
    //css 变化监听
    watch(developmentConfig.css, {
        verbose: true
    }, function(e) {
        browserReload('*.css');
    });
});
