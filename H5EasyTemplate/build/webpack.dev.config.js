var path = require('path');
var fs = require('fs'); //文件系统
var glob = require('glob');
var webpack = require('webpack');
var merge = require('webpack-merge');
var webpackBaseConfig = require('./webpack.base.config.js');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

function resolveBowerPath(dir) {
  return path.join(__dirname, '..',  dir);
}
var webpackEntry={};
//获取指定路径下的入口文件
function getEntries(dir,ext) {
    var files = glob.sync(dir + '/*.' + ext);
    // console.log('getEntries------>');
    files.forEach(function(file) {
        var relativePath = path.relative(dir, file),
            relativeName = relativePath.slice(0, relativePath.lastIndexOf('.'));

        console.log('relativePath:',relativePath,"relativeName:",relativeName);
        webpackEntry[relativeName] = dir+'/' + relativePath;
    });
    return webpackEntry;
}
//获取简易框架下代码开发文件
function getEDSLibs(dir,ext) {
    var files = glob.sync(dir + '/*.' + ext);
    // console.log('getEDSLibs------>');
    files.forEach(function(file) {
        var relativePath = path.relative(dir, file),
            relativeName = relativePath.slice(0, relativePath.lastIndexOf('.'));
        // console.log('relativePath:',relativePath,"relativeName:",relativeName);
        webpackEntry['../edslibs/'+relativeName]=dir+'/' + relativePath;
    });
}

//根据src目录下js来确定有多少入口文件
getEntries('./src','js');

module.exports = merge(webpackBaseConfig, {
  //入口文件
  entry: webpackEntry,
  //生成文件
  output: {
      //输出路径
      path: resolveBowerPath('./js/app/'),
      //输出程序入口  输出名称或名称 pattern
      filename: "[name].js?[hash]",
      //指定静态资源的位置
      publicPath: './js/app/', // 设置require.ensure路径
      //输出第三方支持库压缩
      chunkFilename: "[name].js?[hash]",
  },
  //设置外部加载，这个不会做打包
  externals: {},
  //测试debug server
  devServer: {
      // host:'0.0.0.0',
      historyApiFallback: true,
      noInfo: true,
      contentBase: "../",
      port:8001,
      inline: true //实时刷新
  },
  // 生产
  // devtool: '#cheap-module-source-map',
  // 生产
  devtool: '#eval',
  //是否观察者模式
  watch: true,
  //插件，比loader更强大，能使用更多webpack的api
  plugins: [
    //提供全局的变量，在模块中使用无需用require引入 注意js类的写法需要指出AMD CMD 模式
    //如 new webpack.ProvidePlugin({$: 'jquery'}) 使jquery变成全局变量，不用在自己文件require('jquery')了
    //调用模块的别名ProvidePlugin，例如想在js中用$，如果通过webpack加载，需要将$与jQuery对应起来
    new webpack.ProvidePlugin({}),
    //css 代码补全插件
    new webpack.LoaderOptionsPlugin({minimize: true}),
    //代码压缩 webpack 自带了一个压缩插件 UglifyJsPlugin，只需要在配置文件中引入即可。
    new webpack.optimize.UglifyJsPlugin({
      comments: false, //去掉注释
      compress: {
        warnings: false//去警告
      }
    }),
    //new webpack.optimize.CommonsChunkPlugin('common', 'common.js'),
  ],
});
