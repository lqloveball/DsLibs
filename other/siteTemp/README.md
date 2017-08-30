# 快速建站模板

为了更好进行配置开发环境，使用 node 与 npm 来进行配置开发环境。

`webpack`进行模块打包，`gulp`负责 less编译、运行web环境、调试刷新。

### 无配置过本地开发环境，需要进行npm安装下环境。

`运行环境分两种，如下：`

1. `项目环境` 当前项目目录下直接运行 `npm install` ,命令会根据`package.json` 这种是会把 `webpack` `gulp`环境安装到当前这个项目下

2. `推荐:工作开发环境` 拷贝`package.json` 到你的工作环境目录，运行`npm install`。这种是会把 `webpack` `gulp`环境安装到整个开发工作环境中

### 运行开发环境

`弃用gulp启动开发环境命令` gulp webpack-dev

`推荐使用新的 npm 方式来运行项目`

- `npm run webpack-dev`  运行 webpack 编译打包，开发使用，代码不压缩
- `npm run webpack-bin ` 运行 webpack 编译打包，正式发布，代码压缩
- `npm run dev`   webpack 运行开发编译，gulp 运行 less编译、运行web环境、调试刷新
- `npm run bin`   webpack 正式发布编译，gulp 运行 less编译、运行web环境、调试刷新
- `npm run server` gulp 运行 less编译、运行web环境、调试刷新
