### 分享配置

`SiteConfig.shareData` 用来配置网站在微信下分享配置

#### 配置参数

```js
shareData: {
    shareTitle: "速速提供分享标题",
    shareInfo: "速速提供分享内容",
    //【可以不设置】默认"/index.html"
    shareUrl: "/index.html",
    //【可以不设置】默认"/index.html?WorkID="
    shareWorkUrl: "/index.html?WorkID=",
    //【可以不设置】默认  "./images/ShareImg.jpg"
    shareImageUrl:"./images/ShareImg.jpg",
    //【可以不设置】 默认  "./js/libs/cagoeShare.js"
    wxJsUrl:"./js/libs/cagoeShare.js",
    //【可以不设置】默认使用站点下sApiWXConfig.aspx
    apiUrl:"http://pingan.revive-sh.com/JsApiWXConfig.php",
    //分享后回call 方法配置  type: appmessage  timeline  weibo  qq  facebook
    shareCallBack:function(type) {
        ds.alert('分享成功：'+type);
    }
}
```

   - `shareTitle`  微信分享标题
   - `shareInfo`  微信分享内容
   - `shareUrl`  微信分享链接地址
   - `shareWorkUrl`  微信分享作品回流页面地址
   - `shareImageUrl`  分享图片地址
   - `wxJsUrl`  分享sdk js
   - `apiUrl`  分享接口


#### 分享回流处理

进入页面后会获取页面上是否带 `WorkID` 参数，这时候就会走分享回流流程。

`SiteConfig.workPage` 用来配置分享回流的页面

##### `string`简单设置

会进入到 `SiteConfig.workPage`对应的页面。作品数据内容可以在这个页面内实现（`自定义开发扩展页面才可以`）。

##### `object`更多设置

- `name` 设置回流页面地址
- `getWorkData` 设置分享回流的`function` 。如果有设置这个属性。那会阻断回流页面进入。回流流程`function` 内需要带参数 `workid`。可以编写获取数据交互并且跳转指定页面。

