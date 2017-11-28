### Pages页面配置方式

`SiteConfig.pages` 模板会通过读取这个页面配置数组来构建页面 

### 简易配置 String字符串

通过`string`简单快速进行页面配置，自动识别内置初始化页面配置

如：

- `'main.HomePage'` ,带有`.`都会被识别成是Adobe Animate资源页面

- `'#HomePage'` ，`#`开头字符串配置会被识别成是Html Dom类型的页面


### 全部配置 Object对象

通过object可以配置更多复杂逻辑与功能参数

- name 页面名
- cs  `cs='html`是否html，`cs!='html` 作为createjs页面的命名空间
- screenType 页面状态类型 `v`竖屏模式  `h`横屏模型  `auto`竖屏横屏都不提示页面浏览方向提示
- initUI 页面模块构建时候执行
- movieIn 页面进场时执行
- movieInEnd 页面进场完成时执行
- movieOut 页面退场时执行
- movieOutEnd 页面退场完成时执行
- resize 网站自适应时候响应页面自适应执行
- touchSwipe 是否支持滑动翻页 `字符串配置`下默认`true`，`配置对象`下默认`false`
- touchVertical 滑动翻页方向，是否纵向滑动 默认`true`
- movieLock 滑动翻页时候，如果动画未完成是否阻止滑动翻页方向 默认`true`
- touchSwipeLoop 滑动翻页时候是否loop循环，如果当前是最后一页是否下一页是第一个页面。 默认`true`
- touchNext 是否支持滑动到下一页 默认`true`
- touchPrevious 是否支持滑动到上一页 默认`true`
- $dom html类型页面 指定的`dom`对象 `默认为空`有这个参数时候会忽略`name`解析去获取`dom`元素做页面view对象
- type  特殊页面类型 如：`type: 'video'` 时候，页面会按在插件 `plugins:['videoPage']`来实现视频播放器页面

### Createjs 动画页面类型

#### name 解析规则

以下三种设置是相同效果

```js
'main.HomePage'
```
```js
{name:'main.HomePage'}
```
```js
{name:'HomePage',cs:'main'}
```

只要是`name`内带有`.`都会被识别成是Adobe Animate资源页面。最终在页面模块中被创建成view对象。

`name`会被解析成`cs`+`name`两个部分， 页面createjs显示对象是通过 `cs`.`name` 被创建出来（`new window[cs][name]`）

#### 动画时间轴规则

 - 动画资源如果拥有时间轴，默认会以时间轴最后一帧作为动画进场完成计算
 - 动画资源时间轴的`movieInEnd`标识作为动画进场完成，但不影响动画时间轴播放完成暂定，还是会以时间轴上 `this.stop()`代码为准
 - 动画资源时间轴上如果有`movieInEnd`标识，那会以为`movieInEnd`标识帧作为动画进场完成计算
 - 动画只要时间轴上如果有`movieOutEnd`标识,会执行退场动画到`movieOutEnd`标识帧后才会切换到下一个页面。
 - 页面也可以是`单帧`没有时间轴。
 - 


### HTML DOM结构页面类型
     
 简易 `string` 配置       
 ```js
'#HomePage'
 ``` 
 或者 复杂 `object` 配置
```js
{name: '#HomePage'}
``` 
- `#`开头字符串配置会被识别成是Html Dom类型的页面
- 简易模板会查找Html上是否有`$('#HomePage')` 这个dom节点，如果不存在会自动创建一个`'#HomePage'` 的 `<div>`作为这个页面
- 原html上dom节页面，页面切换时候只会进行显示或隐藏操作
- 模板创建出来dom节页面，页面切换时候只会进行添加或与删除操作，拥有`#domBox`节点，会被添加到`#domBox`节点内，没有就会 被添加`#screen`节点内
    

### 其他页面类型

#### 全屏视频页面

配置

```js
{
    //配置页面名称，对应HTML上节点
    name: '#VideoPage',
    //标记这个页面类型是视频播放页面 注意在plugins 里面需要添加视频播放插件 'videoPage'
    type: 'video',
    // 视频页面地址 不需要填写 .mp4，因为会根据系统自动判断播放类型
    url: 'media/intro',
    //设置视频宽
    width: 640,
    //设置视频高
    height: 1235,
    //这个页面初始化构建完成
    initUI: function () {
        var _self = this;
        this.view.find('.uiPanel .btn').on('click', function () {
            SiteModel.gotoPage('NoMoviePage');
            _self.videoPlayer.pause();
        });
    },
    //视频准备可以播放时候
    readyPlay: function () {
    
    },
    //视频播放完成时候
    playEnd: function () {
        console.log(this.name, 'playEnd');
        SiteModel.gotoPage('MovieInPage');
    }
    
}
```

html结构
```html
<!--视频页面-->
<div id="VideoPage">
    <div class="videoPanel"></div>
    <div class="uiPanel">
        <div class="btn">跳过</div>
    </div>
</div>
```
- `<div id="VideoPage">` 是视频页面节点主容器
- `<div class="videoPanel"></div>` 是视频页面反正播放器节点容器
- `<div class="uiPanel"></div>` 是可以用来放浮动在视频播放器上其他ui容器，如跳过按钮等等

样式 `less`

```less
#VideoPage{
    position: absolute; left: 0; top: 0;
    .uiPanel{
        position: absolute; left: 0; top: 0;
        display: none;
        .btn{
            position: absolute; left: 50px; top:50px;
            width: 100px;height: 100px;
            background: #fff;
        }
    }
}
```

!> 视频页面不能作为首页使用，会有手机端不能自动播放媒体问题问题。视频的上一页与下一页的默认滑动是无法调整到视频页面的。

