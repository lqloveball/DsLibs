---

## 关于工作流

活动H5项目要快速、高效、动画效果好。从开发的工作流上我们需要先武装起来。这里会进行介绍Ds的工作开发流程

>项目开发指南 主要如下内容

- 开发环境配置
- 如何使用代码模板进行快速开发
- 通用项目模块代码说明文档

?> *TODO* 简易代码模块说明<br/>
*TODO* 如何实时输入显示动态字体

---



## 项目模板简介

####  SiteTemp [通用项目模板]
[详解](/Workflow/SiteTempDoc.md)

- 这个模板适合绝大部分项目
- 发布后项目结构

``` javascript
/*
极小20k内置实现
1、通用loading[dom or createjs]
2、背景声音自动播放与绑定设置
3、SiteModel创建
4、createjs模块创建
5、分包加载流程
*/
js/app/main.js
/*
js/app/base.js  打包内容
    jquery  dom选择器  jquery 或者 zepto
    eventdispatcher 基础事件类
    QuickTrack  监测代码
    MobileAudioAutoPlayLister  背景声音播放控制器
    sitemoblieresizemodel    自适应
*/
js/app/base.js
/*
js/app/vendors1.js  打包内容
    jstween  运动引擎
    touchjs 百度touch
*/
js/app/vendors1.js
/*
js/app/vendors2.js  打包内容
    jstween  运动引擎
    touchjs 百度touch
    createjs  canvas框架
    dscreatejs createjs扩展
*/
js/app/vendors2.js
//项目代码
js/app/AppMain.js   
```
####  SimpleSiteTemp [最简化项目模板]
- 这个模板适合对初始化项目k数有要求，或者需要控制打包
内容更灵活情况下使用
- 输出结构
``` javascript
//自己控制main功能实现
js/app/index.js
/*
js/app/base.js  打包内容
    jquery  dom选择器  jquery 或者 zepto
    eventdispatcher 基础事件类
    sitemoblieresizemodel    自适应框架
*/
js/app/base.js
//项目代码
js/app/AppMain.js   
```

####  IndexBaseSiteTemp [入口压缩化项目模板,base支持库打包进入口文件]
- 这个模板适合自己对项目打包k更深入理解，base的库直接打包在入口文件内。入口文件会变大，自己要控制好首屏画面大小
内容更灵活情况下使用
- 输出结构
``` javascript
//自己控制main功能实现
js/app/index.js
//项目代码
js/app/AppMain.js  
```
