# 快速建站模板

项目开发用到`webpack` 、`gulp` 来进行前端脚手架开发环境搭建

`webpack`进行模块打包，`gulp`负责 less编译、运行web环境、调试刷新。


### 开发启动命令

`npm run 方式来运行项目` 

（Mac下推荐使用）
- `npm run dev`   webpack 编译打包（代码不压缩），gulp 运行 less编译、运行web环境、调试刷新
- `npm run bin`   webpack 编译打包（代码压缩），gulp 运行 less编译、运行web环境、调试刷新
- `npm run server` gulp 运行 less编译、运行web环境、调试刷新

（`window`下推荐使用以下命令）`window` 对npm run 并行运行任务存在问题。

- `npm run gulpDev`  通过gulp 运行 webpack 编译打包（代码不压缩），gulp 运行 less编译、运行web环境、调试刷新 等同`npm run dev` 
- `npm run gulpBin`  通过gulp 运行 webpack 编译打包（代码压缩），gulp 运行 less编译、运行web环境、调试刷新  等同`npm run bin` 


### 测试开发启动命令

进行开发测试模板使用，只是使用项目模板可以忽略

- `npm run debug`  运行 webpack 编译打包，进行开发测试模板使用，检测代码源src下修改更新同步到项目模板的src下
- `npm run webpack-dev`  运行 webpack 编译打包，开发使用，代码不压缩
- `npm run webpack-bin ` 运行 webpack 编译打包，正式发布，代码压缩


### 配置开发环境

开发环境需要安装`node`与`npm`。然后通过 `npm`进行全局安装`webpack` 、`gulp`；

我们每人平均每个月都需要开发3-4个 H5活动网站，不可能每个项目都去配置工作环境。

`项目目录` 统一放在一个 `工作目录`下。

所以我们分`工作目录环境`与`项目目录环境`。我们前端脚手架模块只要安装配置在`工作目录环境`下

```
--/Works/(工作目录环境)
   |
   |———/projectsA/(项目A目录环境)
   |———/projectsA/(项目B目录环境)
   |———/XXX汽车活动/
   		|———/projectsC/(项目C目录环境)

```

我们一般把项目开发时候需要的node模块安装到`工作目录环境`下。

> 通过拷贝`other/package.json`文件到你的`工作目录环境`下。运行 `npm install`可以进行安装开发所需前端脚手架模块。

> 项目只需要copy 项目模板到对应项目目录下，直接运行开发相关命令。可以开心愉快开始进行项目开发了。


