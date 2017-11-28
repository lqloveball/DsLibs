
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