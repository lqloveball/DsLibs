var path = require('path');
var glob = require('glob');
var gulp = require('gulp');
var del = require('del');//删除功能
var newer = require('gulp-newer'); //快速创建copy
var copy = require('gulp-copy'); //拷贝
var watch = require('gulp-watch'); //观察者
var browserSync = require('browser-sync').create(); //自动刷新调试
var jsdoc = require('gulp-jsdoc3');//jsdoc

//jsdoc 配置
var JSDOC_CONFIG = {
    "tags": {
        "allowUnknownTags": true,
        "dictionaries": ["jsdoc", "closure"]
    },
    "source": {
        "include": [
            // "../src/"
        ],
        "exclude": [
            // "../src/libs/"
        ],
        "includePattern": ".+\\.js(doc)?$",
        "excludePattern": "(^|\\/|\\\\)_"
    },
    "plugins": [
        "plugins/markdown"
    ],
    "markdown": {
        "parser": "gfm",
        "hardwrap": true
    },
    "templates": {
        "name": "Dslibs Doc",
        "footerText": "Maksim Frontend Development Lab",
        "logo": {
            "url": "../images/logo.svg",
            "width": "58px",
            "height": "20px",
            "link": "https://github.com/lqloveball/DsLibs"
        }
    },
    "opts": {
        "encoding": "utf8",
        "recurse": true,
        "private": false,
        "lenient": true,
        "destination": "../docs/dsDocs",
        "template": "../docsBuild/tui-jsdoc-template",
        "tutorials": "../docsBuild/tutorials",
        "readme": "../docsBuild/README.md"
    }
};

//观察需要jsdoc编译生产的资源
var WATCH_PATH = [
    "../src/**/*.js",
    "../docsBuild/README.md",
    "../docsBuild/tutorials",
    "!../src/libs/**/*.js"
];

/*
删除api docs
*/
gulp.task('del', function () {
    console.log('del api docs');
    return del([
        '../docs/dsDocs/'
    ], {
        force: true
    });
});
/*
创建api docs
 */
gulp.task('docs',function (cb) {
    console.log('start jsdoc export docs');
    gulp.src(WATCH_PATH)
        .pipe(jsdoc(JSDOC_CONFIG,cb));
});
/*
刷新任务
 */
gulp.task('refresh',function (cb) {
    console.log('refresh api docs');
    browserSync.reload();
});
/*
 * 监听刷新更新
 */
gulp.task('watch',['docs'],function () {
    // gulp.src(WATCH_PATH)
    //     .pipe(jsdoc(JSDOC_CONFIG));
    //监听文件变化进行打包更新

    // watch(WATCH_PATH, {
    //     verbose: true
    // }, function (e) {
    //     gulp.src(WATCH_PATH)
    //         .pipe(jsdoc(JSDOC_CONFIG));
    // });

    gulp.watch(WATCH_PATH, ['del','docs']);

});
/*
启动文档编辑调试服务器
*/
gulp.task('docsServer',function() {
    // 启动browserSync服务
    browserSync.init({
        server: '../docs/',
        port: 3001,
        open: "external"
    });
    // 文档更新
    // watch(['../docs/**/*.*','!../docs/dsDocs/'],{verbose: true},function(e){
    watch(['../docs/**/*.*'],{verbose: true},function(e){
        browserSync.reload();
    });
});

gulp.task('default', ['docsServer','watch']);