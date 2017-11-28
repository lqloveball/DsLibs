### EDSSite框架模板构建过程


- `ESiteModel.js` 代码执行，开始查找 `#screen`内`data-config`模板配置js地址
- 开始加载模板配置`js`。在js内需要定义`SiteConfig`对象，模板逻辑会按`SiteConfig`配置来处理
- 创建`SiteModel` (基于ds.core.SiteModelByMobile)
- 开始加载`base.js`，`SiteModel` 拥有`事件能力`
- 创建`SiteModel.resizeModel`,`SiteModel.audioer`
- 如果使用`createjsModel`,会马上开始加载`createjsFrameWork.js`，然后创建`loadPanel`
- `SiteConfig.mode`默认是`default`.开始加载`DefaultMain.js`来创建`SiteModel.appMain`
- 创建分享模块`SiteModel.shareModel`
- 开始加载`SiteConfig.otherjs`内js文件
- 如果需要`threejs`会加载`extend_threejs.js`
- 如果需要`pixijs`会加载`extend_pixijs.js`
- 如果有`SiteConfig.plugins`会加载`插件相关js`文件
- `SiteModel.appMain`开始加载`SiteConfig.loadAssets`配置资源
- `SiteModel.appMain`开始加载`html标签上 带有懒加载图资源<img>`的图片资源
- 如果`SiteConfig.startSitePage`有配置会执行，并跳过默认的初始化页面逻辑
- `SiteModel.appMain` 会根据配置显示第一个页面
