>通用项目模板代码结构剖析，更清楚知道什么样H5活动适合使用这个模板进行开发。

## 项目代码打包结构说明
  - `js/app/main.js`<br/>
    *
    src/Ds/gemo/Devicer.js 设备判断管理<br/>
    src/app/LoadModel.js 加载进度条模块<br/>
    *
  - `js/app/base.js`<br/>
    *
    src/libs/base/zepto.min.js dom选择器<br/>
    src/Ds/EventDispatcher.js 事件实现类<br/>
    src/Ds/SiteMoblieResizeModel.js H5自适应屏幕类<br/>
    src/Ds/gemo/QuickTrack.js 快速添加检测代码类<br/>
    src/Ds/media/MobileAudioAutoPlayLister.js 背景声音管理类<br/>
    *
  - `js/app/vendors1.js`<br/>
    *
    src/libs/shrek/jstween.min.js 运动引擎<br/>
    *
  - `js/app/vendors2.js`<br/>
    *
    src/libs/shrek/jstween.min.js 运动引擎<br/>
    src/libs/createjs/createjs0.8.2.min.js createjs框架<br/>
    src/Ds/createjs/DsCreatejs.js createjs Ds扩展工具集框<br/>
    *
  - `js/app/AppMain.js` <br/>
    *
    src/libs/touch/touchjs.min.js 手势管理<br/>
    src/app/APIManager.js 分享接口 数据提交接口  作品回流接口管理<br/>
    src/Ds/ui/PopLayer.min.js 通用alert提示框<br/>
    src/Ds/gemo/SitePageManager.js 页面跳转管理<br/>
    src/app/**/?.js 其他项目逻辑代码<br/>
    *
