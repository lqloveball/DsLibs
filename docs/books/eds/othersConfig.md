其实EDSSite是基于Dslibs基础上开发可以进行配置方式还有很多种。而且还能借助webpack gulp来帮忙测试、开发、打包代码



### 开发测试命令

- basebin `source/eds/`框架压缩打包
- dev2 对 `src`项目开发入口 `source/eds/`框架入口  进行编译打包（不压缩）
- dev 只对`src`根目录下`js`作为入口文件进行编译打包（不压缩）
- bin 打包压缩所有代码


### 更多其他配置

以下是提供更灵活自己构建网站逻辑实现可以进行配置。

!> 这些配置都是会越过`EDSSite`框架`默认实现简易模板`实现。属于自己熟悉基于`Dslibs`构建一个网站实现逻辑小伙伴使用。

#### 直接在页面上写配置`SiteConfig`


在HTML内插入 `<script>` 标签 设置一个window.SiteConfig对象

 ``` html 
 <script>
 window.SiteConfig={
    //逻辑代码路径
    base:'js/app/',
    //路径代码
    url:'index.js',
    type:'v',
    hasCJS:true,
    hasCJSModel:false,
}
 </script>
 ```
 
 
#### 案例配置`data-example`  

你可以在`#screen`内设置` data-example`你的单页面逻辑代码地址


``` html
<div id="screen" data-example="js/app/index.js">
```
- `data-example` 设置逻辑js路径
- `data-hasCJS` 是否需要createjs
- `data-hasCJSModel` 是否需要createjs模块
- `data-hasCJSLoad` 是否需要createjs 来实现 loading
- `data-hasCJSWebGL` 是否需要createjs 支持webgl
- `data-hasThreeJs` 是否需要threejs
- `data-hasThreeJsModel` 是否需要threejs模块
- `data-hasPixiJs` 是否需要pixijs
- `data-hasPixiJsModel` 是否需要pixijs模块
