# 快速简易建站模板

### 目录结构

 - src 相关相关源码：项目源码 (新人不用)
 - js 编译后代码
    - js/app 当页面应用代码
    - js/edslibs 简易框架代码
    - js/libs 预先打包好第三方代码
 - css 编译后的样式
 - images 图片目录
 - assets 资源目录
 - build 编译命令配置目录
- source ds源码、第三方代码库、edslibs简易框架源码等（这个目录新手可以忽略用不到）
    - ds库
    - edslibs 简易使用代码框架
    - libs  第三方代码库
    - threejs threejs 额外功能代码库

### 代码命令

- basebin 压缩打包建议框架代码
- debug 会自动同步ds库、打包不压缩
- dev 打包不压缩 简易框架与
- bin 打包压缩所有代码

### 简易页面配置

### 使用webpack编译逻辑代码

#### 方法一 灵活性更高能设置东西更多

在HTML内插入 \<script\> 标签 设置一个window.SiteConfig对象
 ``` html 
 <script>
 window.SiteConfig={
            base:'js/app/',
            url:'index.js',
            type:'v',
            hasCJS:true,
            hasCJSModel:false,
        }
 </script>
 ```
 
 
####  方法2 标签内简易配置

如：
``` html
<div id="screen" data-example="js/app/index.js">
```


data-example 设置逻辑js路径
data-hasCJS 是否需要createjs
data-hasCJSModel 是否需要createjs模块
data-hasCJSLoad 是否需要createjs 来实现 loading
data-hasCJSWebGL 是否需要createjs 支持webgl
data-hasThreeJs 是否需要threejs
data-hasThreeJsModel 是否需要threejs模块
data-hasPixiJs 是否需要pixijs
data-hasPixiJsModel 是否需要pixijs模块
