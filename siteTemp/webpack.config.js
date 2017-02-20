var path = require('path');
var webpack = require('webpack');

var resolveBowerPath = function (componentPath) {
    return path.join(__dirname, componentPath);
};

module.exports = {
    //js入口源文件 项目的入口模块 [String | Array | Object]
    //入口
    entry:{
        //基础支持库（html页面首要加载）
        // base: [
        //   'jquery',
        //   'eventDispatcher',
        //   'log',
        //   'siteMoblieTemplate',
        // ],
        // vendors:[
        //   'createjs',
        //   'cagoeCreatejs',
        //   'jstween',
        //   'jstimeline',
        //   'touchjs',
        // ],
        main: "./src/main.js",
    },
    //输出生成文件
    output: {
        //输出路径
        path: './js/app/',
        //输出程序入口  输出名称或名称 pattern
        filename: "[name].js?[hash]",
        //指定静态资源的位置
        publicPath: './js/app/',// 设置require.ensure路径
        //publicPath: 'http://s6.pdim.gs/static/',
        //输出第三方支持库压缩
        chunkFilename: "[name].js?[hash]",
        // chunkFilename: "chunk.js?[hash]",// 设置require.ensure 文件名
    },
    //文件路径的指向
    resolve: {
        alias: {
          //一些主要目录路径设置
          images: resolveBowerPath('./images'),
          libs: resolveBowerPath('./src/libs'),
          app: resolveBowerPath('./src/app'),
          ds: resolveBowerPath('./src/Ds'),
          //进场用到的库抽成全局
          //jquery: 'libs/base/jquery-2.1.3.min.js',
          //jquery: 'libs/base/jquery-1.9.1.min.js',
          jquery: 'libs/base/zepto.min.js',
          //shrek
          jstween: 'libs/shrek/jstween.min.js',
          jstimeline: 'libs/shrek/jstimeline.min.js',
          css3d: 'libs/shrek/css3d.min.js',
          orienter: 'libs/shrek/orienter.js',
          //常用第三方库
          tweenmax: 'libs/greensock/TweenMax.min.js',
          hammer: 'libs/touch/hammer.min.js',
          touchjs: 'libs/touch/touch.min.js',
          iscrolllite: 'libs/iscroll-lite.min.js',
          uaparser: 'libs/parser/ua-parser.min.js',
          socketio: 'libs/socket.io/socket.io.js',
          //视频媒体
          iphoneinlinevideo: 'libs/media/iphone-inline-video.browser.js',
          jsmpg: 'libs/media/jsmpg.js',
          //createjs库
          createjs: 'libs/createjs/createjs0.8.2.min.js',
          easeljs: 'libs/createjs/easeljs-0.8.2.min.js',
          tweenjs: 'libs/createjs/tweenjs-0.6.2.min.js',
          preloadjs: 'libs/createjs/preloadjs-0.6.2.min.js',
          soundjs: 'libs/createjs/soundjs-0.6.2.min.js',
          //高端项目组核心库  事件  log  与网站模块SiteMoblieTemplate
          eventdispatcher:'ds/EventDispatcher.js',
          log:'ds/Log.js',
          sitemoblieresizemodel:'ds/SiteMoblieResizeModel.js',
          //高端项目组 Createjs 项目开发需求
          dscreatejs:'ds/createjs/DsCreatejs.js',
        }
    },
    //设置外部加载，这个不会做打包
    externals: {
        // TianWei: 'app/TianWei.js',
    },
    //模块loader进行字符串的处理
    module: {
        loaders: [
            {test: /\.js$/, loader: "jsx-loader?harmony"},
            //处理ES6
            //{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
            //处理样式，转成css，如：less-loader, sass-loader
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},
            //{ test: /\.(png|jpg)$/, loader: 'url-loader?limit=1024'},
            //图片处理
            {test: /\.(png|jpg)$/, loader: 'url-loader?name=images/[hash].[ext]&limit=2048000'},
            //html处理
            {test: /\.html$/, loader: 'html-loader'},
        ]
    },
    //插件，比loader更强大，能使用更多webpack的api
    plugins: [
        //提供全局的变量，在模块中使用无需用require引入 注意js类的写法需要指出AMD CMD 模式
        //调用模块的别名ProvidePlugin，例如想在js中用$，如果通过webpack加载，需要将$与jQuery对应起来
        new webpack.ProvidePlugin({
            // $: 'jquery',
        }),
        //代码压缩 webpack 自带了一个压缩插件 UglifyJsPlugin，只需要在配置文件中引入即可。
        // new webpack.optimize.UglifyJsPlugin({
        //   compress: {
        //     warnings: false
        //   }
        // }),
        //
        // 这是第三方库打包生成的文
        // new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
        //提供公共代码
        // new webpack.optimize.CommonsChunkPlugin('base.js',['base']), // 默认会把所有入口节点的公共代码提取出来,生成一个common.js
        // new webpack.optimize.CommonsChunkPlugin('vendors.js',['vendors']), // 默认会把所有入口节点的公共代码提取出来,生成一个common.js

        // new webpack.optimize.CommonsChunkPlugin({
        //     name: "base",
        //     filename: "base.js",
        //     chunks:[
        //       [
        //         'jquery',
        //         'eventDispatcher',
        //         'log',
        //         'siteMoblieTemplate',
        //       ]
        //     ]
        // }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: "vendors",
        //     filename: "vendors.js",
        //     chunks:[
        //       'createjs',
        //       'cagoeCreatejs',
        //       'jstween',
        //       'jstimeline',
        //       'touchjs',
        //     ]
        // }),


    ]
};
