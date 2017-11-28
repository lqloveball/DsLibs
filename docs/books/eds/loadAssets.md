### 加载资源配置

`SiteConfig.loadAssets` 是模板会读取的动画与图片序列配置数组 

如果使用createjs制作的页面，那你还需要了解<br>
[Adobe Animate 资源发布设置](/books/eds/AnimatePublishSet.md)



#### Adobe Animate资源

Adobe Animate导出资源，默认在assets目录下。直接填写导出资源的`js` 

如：
```js
loadAssets:[
   'main.js', 
]
```

#### Adobe Animate资源【更多配置】

可以改变命名空间`jsNS="other"`，这样之后`pages`里面页面配置来源空间就会以这个命名来获取


<a href="./dsDocs/ds.createjs.html#.loadAssets" target="_blank">更多Adobe Animate资源加载配置参数</a>

如：

```js
 {url: 'otherPage.js', jsNS: "other"}
```

#### 加载图片队列

直接传入一个图片队列数组

```js
[
    './images/ShareImg.jpg',
    './images/BGMICON.png',
]
```

#### 加载图片队列【更多配置】

可以使用对象方式来配置

- `type` 使用对象方式必须设置`type`是`images`,
- `basePath`设置路径

```js
 {
    type: 'images',
    basePath: './images/',
    list: [
        'ShareImg.jpg',
        'BGMICON.png',
    ]
}
```
#### HTML页面上支持懒加载属性设置

在页面上的img标签内有`lazypath`属性，网站模板构建时候会检索所有图片对象进行图片加载处理，`src`建议需要放一张空的图片

```html
<img lazypath="images/BGMICON.png" src="images/lazy.png" />
```
