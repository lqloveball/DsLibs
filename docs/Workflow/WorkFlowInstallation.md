---
#### 安装 nodejs 与 npm 环境
在前端开发需求越来越多、工作流也越来越完善。node 是每个前端工程师 不可缺少工作环境。

- node官方网站下载安装环境 [安装程序下载](https://nodejs.org/en/)
- npm 默认是与node安装程序共同安装
- **cnpm**必要性,由于npm服务器在国外，国内拉npm的代码包会比较慢。cnpm是淘宝提供 NPM 镜像
与npm上代码同步率目前为 10分钟一次。

```
//cnpm 安装命令，node与npm环境安装后执行
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

!> 建议node 7.0 与 npm 4.2.0以上工作环境

---
#### 选择工作环境的目录
选择你的工作环境目录,因为你需要在这个工作目录下安装gulp与webpack这样工作流所依赖的模块。</br>
互动H5项目开发周期短，我们通常会选择一个工作环境目录如 **/Works/**</br>
我们会把项目目录放在**工作环境目录**下，如项目**myProject** 我们可以放在**工作环境目录**下**/Works/myProject**</br>

当我们进行项目开发的时候会运行**/Works/myProject**下面配置的gulp与webpack任务。这个任务会依赖的模块会先在**/Works/myProject**目录下查有**/Works/myProject/node_modules/**目录与目录内有是否有需要的模块。没有会一级级去找父级目录有没有**/node_modules/**目录，目录下是否有需要的模块。

>所以我们可以

- gulp webpack 我们可以选择全局安装
- 其他工作流依赖模块我们可以选择工作环境目录下安装

---

#### 安装 gulp 工作环境
通过代码配置制定**自动化构建工具**,增强我们的工作流程！通过gulp可以来帮我们完成很多重复工作。
- 全局安装 gulp
```
npm install --global gulp
```
- 工作环境目录下安装 gulp
```
npm install --save gulp
```
---
#### 安装 webpack 工作环境
-  全局安装 webpack 与 webpack-dev-server

>webpack

```
npm install webpack -g
```

>webpack-dev-server 是一个小型的Node.js Express服务器

```
npm install webpack-dev-server -g
```
- 工作目录下安装 webpack 与 webpack-dev-server

```
npm install webpack --save
npm install webpack-dev-server --save
```

---

#### 安装工作流环境依赖模块

- 快速安装所有webpack需要的依赖

下载 package.json [下载](https://raw.githubusercontent.com/lqloveball/DsLibs/master/other/%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E9%85%8D%E7%BD%AE/package.json)放到你的工作目录下<br/>
比如你的工作环境的目录是在**D:\Works**,请把**package.json**放到这目录下，然后执行

```
npm install
```
工作环境的目录会按package.json内容进行安装所依赖的模块

!> package.json 不一定是最新，如果运行项目工作流（gulp）任务时候报错，按错误提示进行安装所有缺的模块


----

#### npm 常用命令指南

>npm是什么

NPM的全称是Node Package Manager，是随同NodeJS一起安装的包管理和分发工具，它很方便让JavaScript开发者下载、安装、上传以及管理已经安装的包。

>npm install

我们最常用就是安装模块命令

```
//根据当前目录下package.json进行安装模块
npm install
//安装指定模块到全局
npm install gulp -g
//安装指定模块 gulp
npm install gulp
//安装指定版本的模块 gulp
npm install gulp@3.9.1
//安装指定模块到本地 gulp
npm install gulp --save
//安装指定模块到devDependencies（开发阶段的依赖）
npm install gulp --save-dev
```
