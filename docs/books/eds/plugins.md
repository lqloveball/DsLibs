### 插件配置

`SiteConfig.plugins` 使用到简易模板插件时候请配置引用那些插件

如需要视频播放页面：

```js
plugins: [
    'videoPage'
]
```
页面配置
```js
{
    name: '#VideoPage',
    //标记这个页面类型是视频播放页面 注意在plugins 里面需要添加视频播放插件 'videoPage'
    type: 'video',
    // 视频页面地址 不需要填写 .mp4，因为会根据系统自动判断播放类型
    url: 'media/intro',
    //设置视频宽
    width: 640,
    //设置视频高
    height: 1235,
}
```

### 目前拥有的插件

#### 视频页面插件 `videoPage`

会加载`js/edslibs/plugins_videoPage.js`。这个是视频页面插件

#### 视频页面插件 `framesPage` 

会加载`js/edslibs/plugins_framesPage.js`。这个是序列帧播放器页面插件