
### 网站模块

在开始说`EDSSite框架模板`结构前，有必要说下在`Dslibs`做网站时候网站由那些模块构成的。

<img src="./images/eds/1511856709629.jpg" width = "850" alt="" align=center /><br>

`SiteModel` 定义是这个单页面网站对象，那他必须包含以下模块

- `resizeModel` 网站自适应计算模块
- `loadModel` 网站加载模块
- `audioer` 声音管理模块，主要做背景声音使用
- `loadPanel` loading的界面
- `appMain` 网站单页面模块，单页面相关逻辑都会在这个模块构建后开始构建
- `pager` 页面跳转管理模块
- `shareModel` 分享模块
- `createjsModel` 根据单页面应用是否需要`createjs`来实现呈现页面部分
- `threeJsModel` 根据单页面应用是否需要`threejs`来实现

### SiteModel 事件

- `baseEnd`  基础框架加载完成
- `createjsEnd`  createjs框架加载完成
- `otherJsStart`  其他框架或者插件加载开始
- `otherJsEnd`  其他框架或者插件加载完成
- `resize`  站点resize
- `spaEnd`  单页面应用`SiteModel.appMain`构建完成
- `pixiJsModelBuild` pixijs模块构建完成
- `cjsModelBuild` createjs模块构建完成
- `threeJsModelBuild`  threejs模块构建完成
- `backWorkPage`  进入回流页面

### SiteModel.appMain 事件

- `loadAssetsStart`  站点资源加载开始
- `loadAssetsEnd`  站点资源加载完成
- `initPageManager`  开始初始化构建配置内页面模块
- `initExtend`  扩展逻辑js加载完成
- `startSitePage`  开始执行第一个页面显示
- `backWorkPage`  进入回流页面 如果配置内有 `SiteConfig.workPage.getWorkData`方法，会调用执行这个方法同时传入`workid` 

### SiteModel.appMain 属性

- `isWorkBack` 是否作品回流页面
