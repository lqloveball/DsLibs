const path = require('path');
const glob = require('glob');
const os=require('os');
const fs = require('fs');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.base.config.js');


//获取当前相对路径
function resolveBowerPath(dir) {return path.join(__dirname, '..', dir);}
/**
* 处理入口文件
**/
function dealEntry(entry,source,output='',ext='js') {
    let _source=resolveBowerPath(source);
    let _files = glob.sync(_source + '/*.' + ext);
    console.log('files:',_files);
    _files.forEach(function(file) {
        // console.log('file:',file);
        let _name = file.slice(file.lastIndexOf('/')+1, file.lastIndexOf('.'));
        // console.log('name:',_name);
        let _outputName=path.join(output,_name);
        // console.log('outputName:',_outputName);
        let _file=path.resolve(__dirname,'..', file);
        // console.log('绝对 file:',_file);
        entry[_outputName]=_file;
        console.log('entry['+_outputName+'] = '+_file);
    });
}


//创建入口文件
const entry={}

//基础模块./js/edslibs/base.js
// entry['./edslibs/base']=[
//     'jquery',
//     'eventdispatcher',
//     'resizeModel',
//     'ds/media/AutoAudioManager',
// ];

//createjs框架 ./js/edslibs/createjsFrameWork
// entry['./edslibs/createjsFrameWork']=[
//     'createjs',
//     'dscreatejs',
// ];

//框架开发编译
//dealEntry(entry,'./source/eds','./edslibs/');

//开发内容
dealEntry(entry,'./src','./app/');


module.exports = merge(common, {
    mode: 'development',
    // mode: 'production',
    // mode: 'none',
    entry:entry,
   	//是否观察者模式
  	watch: true,
   	optimization:{
   		//开启压缩
   		minimize:false,
   	},
  	plugins: [
      // new UglifyJSPlugin({
      //   uglifyOptions: {
      //     ie8:false,
      //     ecma:8,
      //     mangle:true,
      //     warnings: false,
      //     compress: true,
      //     output: {
      //       comments: false,
      //       beautify: false,
      //     }
      //   }
      // })
   	]
});

