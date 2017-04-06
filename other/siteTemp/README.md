# 快速建站模板
1. copy 这个目录作为开发目录
2. copy 相关的代码库到src目录下  Ds库与libs库（第三方库）
3. 开发模式下开发 在命令行工具内输入 gulp webpack-dev
4. 发布模式下开发 在命令行工具内输入 gulp webpack

### 项目结构说明

```
--assets/               //资源目录，如flash动画资源
--css/                  //less编译后的样式文件
--js/                   //webpack编译完成的代码文件
--images/               //项目图片资源
--less/                 //less源代码
    |-libs/             //less代码库
    |-main.less         //less首文件
--src/                  //项目开发源代码
    |-main.js           //程序入口文件
    |-app/              //项目源文件
        |-AppMain.js    //项目主文件
```


### 注意点
- src/main.js H5网站开发类型相关设置，这里代码基本无需修改
- src/app/ 项目源文件目录，项目相关代码都在这里创建
- css/  项目是通过less进行编译的所以css下文件都是编译生成的。请不要直接修改这里css
- js/app 项目的js是通过webpack编译的，所以这里代码请不要直接修改
- js/libs 项目中一些js不适合通过webpack编译 请放到这里然后插入到html内

###开发环境配置
[https://github.com/lqloveball/DsLibs/tree/master/other/开发环境配置](https://github.com/lqloveball/DsLibs/tree/master/other/%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E9%85%8D%E7%BD%AE)