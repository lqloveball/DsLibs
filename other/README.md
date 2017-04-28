

# 项目模板
###  SiteTemp [通用项目模板]
- 这个模板适合绝大部分项目
- 输出结构
``` javaScript
/* 
极小10k内内置实现
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
###  SimpleSiteTemp [最简化项目模板]
- 这个模板适合对初始化项目k数有要求，或者需要控制打包
内容更灵活情况下使用
- 输出结构
```
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

###  IndexBaseSiteTemp [最简化项目模板,base支持库打包进入口文件]
- 这个模板适合自己对项目打包k更深入理解，base的库直接打包在入口文件内。入口文件会变大，自己要控制好首屏画面大小
内容更灵活情况下使用
- 输出结构
```
//自己控制main功能实现
js/app/index.js 
//项目代码
js/app/AppMain.js  
```
# 其他
-  SocektServer.zip [node双屏互动服务器] 
- 开发环境配置 [详细描述项目开发环境配置与模板使用方式]