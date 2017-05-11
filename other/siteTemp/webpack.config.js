var path = require('path');
var fs = require('fs'); //文件系统
var glob = require('glob');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

function resolveBowerPath(componentPath) {
  return path.join(__dirname, componentPath);
}
//获取指定路径下的入口文件
function getEntries(dir, ext) {
  var files = glob.sync(dir + '/*.' + ext),
    res = {};

  files.forEach(function(file) {
    var relativePath = path.relative(dir, file),
      relativeName = relativePath.slice(0, relativePath.lastIndexOf('.'));
    res[relativeName] = dir + '/' + relativePath;
  });
  return res;
}
//根据src目录下js文件，来动态判断入口文件
var webpackEntry = getEntries('./src', 'js');

module.exports = function(env) {
  return {
    //js入口源文件 项目的入口模块 [String | Array | Object]
    //入口
    // entry: {
    //   //基础支持库（html页面首要加载）
    //   main: "./src/index.js",
    // },
    entry: webpackEntry,
    //输出生成文件
    output: {
      //输出路径
      path: resolveBowerPath('./js/app/'),
      //输出程序入口  输出名称或名称 pattern
      filename: "[name].js?[hash]",
      //指定静态资源的位置
      publicPath: './js/app/', // 设置require.ensure路径
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
        //vue需要用到
        'vue$': 'vue/dist/vue.common.js',
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
        eventdispatcher: 'ds/EventDispatcher.js',
        log: 'ds/Log.js',
        sitemoblieresizemodel: 'ds/SiteMoblieResizeModel.js',
        //高端项目组 Createjs 项目开发需求
        dscreatejs: 'ds/createjs/DsCreatejs.js',
      }
    },
    //设置外部加载，这个不会做打包
    externals: {
      // TianWei: 'app/TianWei.js',
    },
    //模块loader进行字符串的处理
    module: {
      // webpack 2.0后的loader方式
      rules: [
        //vue模块加载器
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            //vue里面其他加载器
            loaders: {
              // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
              // the "scss" and "sass" values for the lang attribute to the right configs here.
              // other preprocessors should work out of the box, no loader config like this necessary.
              'scss': 'vue-style-loader!css-loader!sass-loader',
              'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'

            }
          }
        },

        {
          /*
           使用babel编译ES6/ES7/ES8为ES5代码
           使用正则表达式匹配后缀名为.js的文件
           */
          test: /\.js$/,
          // 排除node_modules目录下的文件, npm安装的包不需要编译
          exclude: /node_modules/,
          /*
          use指定该文件的loader, 值可以是字符串或者数组.
          这里先使用eslint-loader处理, 返回的结果交给babel-loader处理. loader的处理顺序是从最后一个到第一个.
          eslint-loader用来检查代码, 如果有错误, 编译的时候会报错.
          babel-loader用来编译js文件.
          */
          use: [
            'babel-loader',
            // 'eslint-loader'
          ],
        },
        /*
        使用html-loader, 将html内容存为js字符串, 比如当遇到
        import htmlString from './template.html'
        template.html的文件内容会被转成一个js字符串, 合并到js文件里.
        */
        {
          // 匹配.html文件
          test: /\.html$/,
          loader: 'html-loader'
        },

        /*
        先使用css-loader处理, 返回的结果交给style-loader处理.
        css-loader将css内容存为js字符串, 并且会把background, @font-face等引用的图片,
        字体文件交给指定的loader打包, 类似上面的html-loader, 用什么loader同样在loaders对象中定义, 等会下面就会看到.
        */
        {
          test: /\.css$/,

          use: ['style-loader', 'css-loader', ]
        },
        {
          test: /\.less$/,
          use: ['style-loader', 'css-loader', 'less-loader', ]
        },

        {
          /*
          匹配各种格式的图片和字体文件
          上面html-loader会把html中<img>标签的图片解析出来, 文件名匹配到这里的test的正则表达式,
          css-loader引用的图片和字体同样会匹配到这里的test条件
          */
          // test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
          test: /\.(png|jpg)$/,
          use: [{
            /*
                   使用url-loader, 它接受一个limit参数, 单位为字节(byte)

                   当文件体积小于limit时, url-loader把文件转为Data URI的格式内联到引用的地方
                   当文件大于limit时, url-loader会调用file-loader, 把文件储存到输出目录, 并把引用的文件路径改写成输出后的路径
                   比如 views/foo/index.html中
                   <img src="smallpic.png">
                   会被编译成
                   <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAA...">

                   而
                   <img src="largepic.png">
                   会被编译成
                   <img src="/f78661bef717cf2cc2c2e5158f196384.png">
                   */
            loader: 'url-loader',
            options: {
              name: '../../images/dist/[hash].[ext]', //会打包到./images目录下
              limit: 10000 //10k
            }
          }, ]
        },
      ],
    },
    devServer: {
      // 配置监听端口, 因为8080很常用, 为了避免和其他程序冲突, 我们配个其他的端口号
      port: 8100,
      /*
       historyApiFallback用来配置页面的重定向
       SPA的入口是一个统一的html文件, 比如
       http://localhost:8010/foo
       我们要返回给它
       http://localhost:8010/index.html
       这个文件
       配置为true, 当访问的文件不存在时, 返回根目录下的index.html文件
       */
      historyApiFallback: true,
      noInfo: true
    },
    performance: {
      hints: false
    },
    //开发工具知道当前打包情况
    //开发
    // devtool: '#cheap-module-eval-source-map',
    // 生产
    // devtool: '#cheap-module-source-map',
    //是否观察者模式
    watch: false,
    //插件，比loader更强大，能使用更多webpack的api
    plugins: [
      //提供全局的变量，在模块中使用无需用require引入 注意js类的写法需要指出AMD CMD 模式
      //调用模块的别名ProvidePlugin，例如想在js中用$，如果通过webpack加载，需要将$与jQuery对应起来
      new webpack.ProvidePlugin({
        // $: 'jquery',
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      })

      // 抽离公共模块
      // new webpack.optimize.CommonsChunkPlugin('common', 'common.js'),
      //代码压缩 webpack 自带了一个压缩插件 UglifyJsPlugin，只需要在配置文件中引入即可。
      // new webpack.optimize.UglifyJsPlugin({
      //   compress: {
      //     warnings: false
      //   }
      // }),

    ]
  };
};
