### Dslibs

为了更高效开发手机微信H5互动

[Demo](https://lqloveball.github.io/DsLibsDemo/)

#### 目录说明

- `src` DsLibs 源代码
- `build`   webpack gulp jsdocs 命令配置
- `docs`   文档目录
- `docsbuild`   jsdocs文档教程资源目录
- `examples`  案例编写目录
- `H5EasyTemplate`  简单快速开发网站，可以不需要webpack与gulp
- `H5Template`  使用Dslibs进行项目开发模板
- `othre`   其他相关文件，我们的工作环境package.json，socket通用server



- 源码开发环境
    - `npm run docs_dev` 编写文档开发环境
    - `npm run doc_server` 运行本地文档浏览
    - `npm run docs jsdocs` 进行api文档打包

- `H5Template` 使用Dslibs进行项目开发模板
    - `npm run dev` 项目代码不压缩 开发时候使用
    - `npm run bin`  项目代码压缩 项目部署使用
    - `npm run gulpDev`  等同 dev  因为window下npm run并行命令执行支持不好,所以提供结合gulp方式来启动
    - `npm run gulpBin`  等同 bin  因为window下npm run并行命令执行支持不好,所以提供结合gulp方式来启动
    - `其他测试使用命令`
        - `npm run server` 只启动http服务
        - `npm run webpack-dev` webpack开发编译模式不带 http服务
        - `npm run webpack-bin` webpack部署编译模式不带 http服务
        - `npm run debug` 开发模板测试使用。
        
- `H5EasyTemplate` 简易开发模板，通过简单配置可以进行项目的开发
    - `npm run server` 只运行服务器环境
    - `npm run dev` 只对src根目录下js进行做入口文件进行编译
    - `npm run dev2` 会编译source相关框架代码 `熟悉项目模板开发`人员进行测试开发使用
    - `npm run basebin` 编译压缩项目模板框架 `熟悉项目模板开发`人员进行测试开发使用
    - `npm run debug` 在`DsLibs`库开发环境下使用 `熟悉项目模板开发`人员进行测试开发使用