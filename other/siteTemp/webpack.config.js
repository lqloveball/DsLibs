var path = require('path');
var fs = require('fs'); //文件系统
var glob = require('glob');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

function resolveBowerPath(componentPath) {
    return path.join(__dirname, componentPath);
}
//获取指定路径下的入口文件
function getEntries(dir,ext) {
    var files = glob.sync(dir + '/*.' + ext),
        res = {};

    files.forEach(function(file) {
      var relativePath = path.relative(dir, file),
           relativeName = relativePath.slice(0, relativePath.lastIndexOf('.'));
       res[relativeName] = dir+'/' + relativePath;
    });
    return res;
}
//根据src目录下js文件，来动态判断入口文件
var webpackEntry=getEntries('./src','js');

module.exports = function(env) {
  return {
      //js入口源文件 项目的入口模块 [String | Array | Object]
      //入口
      // entry: {
      //     //基础支持库（html页面首要加载）
      //     main: "./src/main.js",
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
              assets: resolveBowerPath('./assets'),
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
              iscrolllite: 'libs/iscroll/iscroll-lite.min.js',
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
              //rect的jsx加载
              {test: /\.js$/,loader: "jsx-loader?harmony"},
              //html处理
              {test: /\.html$/,loader:'html-loader'},
              //处理ES6
              {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
              },
              //处理样式，转成css，如：less-loader, sass-loader
              {test: /\.css$/,
                use:[
                  'style-loader',
                  'css-loader',
                ]
              },
              {
                test: /\.less$/,
                use:[
                  'style-loader',
                  'css-loader',
                  'less-loader',
                ]
              },
              //图片资源 如果小于limit值（10k）会编译成base64 如果是超过会打包到会打包到./images目录下
              //平时可以考虑不适用
              {
                test: /\.(png|jpg)$/,
                use:[
                  {
                    loader: 'url-loader',
                    options: {
                      name: '../../images/dist/[hash].[ext]', //会打包到./images目录下
                      limit: 10000//10k
                    }
                  },
                ]
              },
          ],
      },
      devServer: {
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
          }),
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
