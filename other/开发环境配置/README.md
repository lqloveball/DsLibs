安装

-  安装nodejs  7.0以上
```
//国内镜像
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

-  全局安装webpack

webpack
```
npm install webpack -g
```

webpack 开发模式 

```
npm install webpack-dev-server -g
```


- 工作目录下安装webpack


```
npm install webpack --save-dev
npm install webpack-dev-server --save-dev
```



- 安装所有webpack需要的依赖

下载npm模块package.json 参考

放到你的工作目录下 比如你的项目都是在D:\Works

放到目录下后

在命令行内执行


```
npm install
```

这时候就会按package.json内容进行安装需要的模块

- 如果有安装package.json内的部分模块失败，可以参考6  进行单独的模块安装。

- npm命名说明


```
//会按当前目录下package.json 内容安装node模块
npm install    
//会安装模块babel-loader开发版本到当前目录的环境下
npm install  babel-loader --save-dev  
//会安装模块babel-loader到当前目录的环境下
npm install  babel-loader --save  
//会安装模块babel-loader到全局的环境下
npm install  babel-loader --g  
```
一般我们只有gulp  webpack  vue这样模块我们会安装到全局下，一般平时都是本地安装 --save

- 使用快速开发项目模板说明
https://github.com/lqloveball/DsLibs/tree/master/simpleSiteTemp
https://github.com/lqloveball/DsLibs/tree/master/siteTemp

```
--assets/           //资源目录，如flash动画资源
--css/              //less编译后的样式文件
--js/               //webpack编译完成的代码文件
--images/           //项目图片资源
--less/             //less源代码    
|-libs/             //less代码库    
|-main.less         //less首文件
--src/              //项目开发源代码    
|-main.js           //程序入口文件   
|-app/              //项目源文件        
|-AppMain.js        //项目主文件
```
