var path = require('path');
var glob = require('glob');
var gulp = require('gulp');
var del = require('del');
var newer = require('gulp-newer'); //快速创建copy
var copy = require('gulp-copy'); //拷贝
var watch = require('gulp-watch'); //观察者
var browserSync = require('browser-sync').create(); //自动刷新调试

//启动文档编辑调试服务器
gulp.task('server',function() {
    // 启动browserSync服务
    browserSync.init({
        server: '../docs/',
        port: 3001,
        open: "external"
    });
    // 文档更新
    watch(['../docs/**/*.*'],{verbose: true},function(e){
        browserSync.reload();
    });
});
gulp.task('default', ['server']);