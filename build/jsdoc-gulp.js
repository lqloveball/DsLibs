var path = require('path');
var glob = require('glob');
var gulp = require('gulp');
var del = require('del');//删除功能
var newer = require('gulp-newer'); //快速创建copy
var copy = require('gulp-copy'); //拷贝
var watch = require('gulp-watch'); //观察者
var browserSync = require('browser-sync').create(); //自动刷新调试
var jsdoc = require('gulp-jsdoc3');//jsdoc
var uglify = require('gulp-uglify');//代码压缩工具

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
        "tabNames": {
            "api": "API",
            "tutorials": "Tutorials"
        },
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
    "../src/ds/**/*.js",
    "../docsBuild/README.md",
    "../docsBuild/tutorials/**/*.json",
    "../docsBuild/tutorials/**/*.html",
    "../docsBuild/tutorials/**/*.md",
    "../docsBuild/tutorials/**/*.css",
    "../docsBuild/tutorials/**/*.js",
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
//代码剔除注释
gulp.task('delComments', function () {
    gulp.watch(["../src/ds/**/*.js"], function (event) {

        var _path = '..' + event.path.slice(event.path.indexOf("/src/ds/"));
        var _fileName = event.path.slice(event.path.lastIndexOf("/src/ds/") + 8);
        var _file = '../src/dsx/' + _fileName;
        var _outPath =_file.slice(0,_file.lastIndexOf("/"));


        if (event.type === 'deleted')del([_file], {force: true});

        if (event.type === 'added' || event.type === 'changed') {

            gulp.src([_path])
                .pipe(uglify(
                    {
                        warnings: false,//去警告
                        compress: {
                            sequences: false,
                            unsafe: false,
                        },
                        mangle: false,//是否混淆
                        output: {
                            // output options
                            comments: false,
                            // bracketize:true,
                            beautify: true,//是否美化
                        },
                        sourceMap: {
                            // source map options
                        },
                        nameCache: null, // or specify a name cache object
                        toplevel: false,
                        ie8: false,
                    }
                ))
                .pipe(gulp.dest(_outPath));

        }

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
gulp.task('watchDocSource',['docs'],function () {
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

gulp.task('default', ['docsServer','watchDocSource']);