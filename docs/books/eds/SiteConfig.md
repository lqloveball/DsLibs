### 配置详细说明

通过上一篇文档已经知道简易配置站点。这篇文档会详细描述下`SiteConfig`配置对象内能配置参数项

### 必要配置

#### shareData 分享配置

   - shareData.shareTitle  微信分享标题
   - shareData.shareInfo  微信分享内容
   - shareData.shareUrl  微信分享链接地址
   - shareData.shareWorkUrl  微信分享作品回流页面地址

!> TODO:目前只支持cagoeShare.js提供分享接口对接的微信分享功能实现。将来实现其他自定义分享接口。

#### loadAssets 加载资源配置

?> 参数有4种设置格式参考代码如下：

```js
loadAssets:[
   //1. 加载Adobe Animate导出资源，默认在assets目录下
   'main.js',
   //2. 加载Adobe Animate导出资源，默认在assets目录下
   //url：设置是导出js
   //jsNS：设置之后页面识别前缀
   {url: 'otherPage.js', jsNS: "other"},
   //3. 网站可能会用到其他图片队列
   [
       './images/ShareImg.jpg',
       './images/BGMICON.png',
   ],
   //4. 网站可能会用到其他图片队列
   //basePath：图片队列对应相对路径根目录
   //list：图片队列 
    {
       type: 'images',
       basePath: './images/',
       list: [
           'ShareImg.jpg',
           'BGMICON.png',
       ]
    }
]
```

#### pages 页面资源配置


?>[详细配置说明](/books/eds/pagesConfig?id=pages%e9%a1%b5%e9%9d%a2%e9%85%8d%e7%bd%ae%e6%96%b9%e5%bc%8f)

页面配置是一个数组


##### String方式
    
通过`string`简单快速进行页面配置，自动识别内置初始化页面配置

插入`'main.HomePage'` ,带有`.`都会被识别成是Adobe Animate资源页面

```js
pages: [
   'main.HomePage'
]
```
`main`代表是 `loadAssets`加载资源配置内` 'main.js'`。<br>
`HomePage`代表是 ` 'main.js'`资源内`HomePage`页面资源。<br>

---

插入`'#HomePage'` ，`#`开头字符串配置会被识别成是Html Dom类型的页面

 ```js
    pages: [
       '#HomePage'
    ]
 ``` 

---
    
##### Object 方式

通过object可以配置更多复杂逻辑与功能参数

```js
{
    //页面名称
    name:'main.HomePage',
    movieInEnd:function () {
      console.log('页面进场播放完成');
    }
}

```
- `name` 等同直接通过`string`配置
- `cs` 设置页面类型与命名空间。如果`cs=html`说明这个页面是按`Html方式创建页面`，或者

```js
{
    name:'HomePage',
    cs:'main'
}
```
`等同于`

```js
  {name:'main.HomePage'}
  //或者
  'main.HomePage'
```

?>[更多详细配置说明](/books/eds/pagesConfig?id=%e5%a4%8d%e6%9d%82-object-%e9%85%8d%e7%bd%ae)

### 非必要配置

#### loadAssetsStartProgress 
  
  加载页面图片资源前进度值，默认值是 `20`
  
#### firstPage 
    
  设置默认第一个页面名称标识 .默认是`pages`里面的第一个页面

```js
 firstPage: 'Page1'
```
  
#### debugFirstPage 
    
  设置本地debug情况下默认第一个页面名称标识
  
    
#### workPage 
    
  设置作品回流页面
```js
//【非必填】设置作品回流页面
workPage: {
    //回流页面名称
    name: "WorkPage",
    // 设置这个参数，会中断页面跳转，会等获取到作品数据后，自己进行手动进行控制回流页面的跳转
    getWorkData: function (workid) {

    }
}
```
  
#### plugins
  
  设置站点需要的插件（如视频播放页面插件`videoPage`）
  
```js
//【非必填】插件。
plugins: [
    'videoPage'
]
```  
  
#### extend  
  
  设置扩展逻辑代码地址,是一个数组，可以插入多个扩展逻辑js。这个需要对框架有更多了解
  
```js
//【非必填】扩展逻辑代码。
extend: [
    //'./js/app/SiteExtend.js'
]
```
  

#### startSitePage

阻止默认的开始网站页面的方法，会使用配置开始页面方法来执行


  
#### 更多SiteModel初始化构建配置

 <a href="/dsDocs/ds.core.SiteModelByMobile.html" target='_blank'>SiteModelByMobile API文档</a>
 
 #### mode
 
 默认是 `default` ,会使用默认简易的模板框架。


