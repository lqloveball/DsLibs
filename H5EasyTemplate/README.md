# 快速简易建站模板

 快速开发H5网站为目的的建站模板，目标使用人群分三类：


- 新人与简单网站开发
  
  - 会使用Animate做动画就会做网站，轻松简单配置
  - 可以通过简单配置编写控制流程

- 进阶使用
  
  - I阶 可以通过配置进行编写扩展代码 
  - II阶 可以通过工作环境配置 进行webpack打包开发更复杂的项目应用（可以基于Dslibs库进行开发）
  
- 高级自定义
  
  - 不在使用`data-config` 而是使用 `data-example` 进行更高级的自定义开发（最接原项目组网站模板开发方式）
     

### 目录结构说明

- js 编译后代码
    - js/app 通过src根目录js进行webpack编译打包发布出来的代码。
    - js/edslibs 简易框架代码
    - js/libs 预先打包好第三方代码
    - js/site 编写网站配置js
- css 网站的样式文件
- less 需要通过less进行编写css目录
- media  多媒体资源，视频 声音
- images 图片目录
- assets 资源目录
- build 编译命令配置目录
- source ds源码、第三方代码库、edslibs简易框架源码等（这个目录新手可以忽略用不到）
    - ds   Dslibs库
    - edslibs 简易建站模板框架代码
    - libs  第三方代码库
    - threejs 需要进行threejs功能开发， threejs上的扩展功能源码
- src 需要进行webpack编译源代码目录
   - 提供初级简易模板扩展功能源码开发
   - 案例代码开发编译
