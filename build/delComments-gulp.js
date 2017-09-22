var path = require('path');
var glob = require('glob');
var gulp = require('gulp');
var del = require('del');//删除功能
var newer = require('gulp-newer'); //快速创建copy
var copy = require('gulp-copy'); //拷贝
var watch = require('gulp-watch'); //观察者
var uglify = require('gulp-uglify');//代码压缩工具

var WATCH_PATH = [
    "../src/ds/**/*.js",
]
gulp.task('delComments', function () {

    /* watch(WATCH_PATH, {verbose: true}, function (e) {

         gulp.src(WATCH_PATH)
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
             )).pipe(gulp.dest('../src/dsx/'))
     });*/
    /*watch(WATCH_PATH,{verbose: true},function(e){
        var _cb = e.history[0];
        gulp.src(_cb)
            .pipe(
                copy("../src/dsx/",{prefix:3})
            ).pipe(uglify(
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
        ));

    });*/
    gulp.watch(WATCH_PATH, function (event) {

        var _path = '..' + event.path.slice(event.path.indexOf("/src/ds/"));
        var _fileName = event.path.slice(event.path.lastIndexOf("/src/ds/") + 8);
        var _file = '../src/dsx/' + _fileName;
        var _outPath =_file.slice(0,_file.lastIndexOf("/"));


        // console.log('File ' + event.path + ' was ' + event.type + ', running tasks>>', _path, ">>",
        //     _fileName,
        //     '_outPath:',_outPath
        // );
        //
        // console.log('处理：',_file);

        if (event.type === 'deleted') {
            del([_file], {
                force: true
            });

        }
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

gulp.task('default', ['delComments']);
