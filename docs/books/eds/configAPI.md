### 简易配置说明

- 简易模板设计初衷就是让技术人员简单制作完成页面动画，只要简单编写配置信息就能完成简单站点搭建。
- 简易模板框架会按`SiteConfig`对象内配置信息进行构建整个站点

### 简易配置

- `SiteConfig` 站点配置对象
- `SiteConfig.shareData` 微信分享信息配置
- `SiteConfig.loadAssets` 加载资源配置
    - Adobe Animate制作页面动画资源 main.fla,默认放在`assets`目录下
    - 配置内只需要填写`main.fla`发布出来的`main.js`

- `SiteConfig.pages` 页面配置
   
   - 填写`main.HomePage`
   - `main`代表是`main.fla`发布出来`main。js` 
   - `HomePage`代表`main.fla`库内有一个影片剪辑对象`HomePage`。会以这个库对象进行创建页面
   
```js
var SiteConfig = {
    //【必填】 分享设置
    shareData: {
        shareTitle: "速速提供分享标题",
        shareInfo: "速速提供分享内容",
        shareUrl: "/index.html",
        shareWorkUrl: "/index.html?WorkID=",
    },
    //【必填】加载资源配置
    loadAssets: [
        'main.js',
    ],
    //【必填】页面配置
    pages: [
        'main.HomePage'
    ],

};
```