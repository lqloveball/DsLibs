### 视频页面插件

如果你的站点中需要使用视频播放互动的话，那你需要一个视频插件


### 插件配置

```js
 plugins: [
    'videoPage'
]
```
### 页面配置

```js
//视频页面
{
    name: '#VideoPage',
    //必须 告知这个页面是video 视频页面类型
    type: 'video',
    //必须 视频页面播放源地址，系统自动判断播放类型 是.mp4或.mpg
    url: 'media/intro',
    //必须 设置视频宽
    width: 640,
    //必须 设置视频高
    height: 1235,
    
    //=================以下非必须参数可以不做设定=============
    //是否需要加入序列帧播放器判断（非微信浏览器在安卓下会使用，如果不设置默认false，那会使用video标签方式）
    hasFPS:true,
    //是否自动加载 默认true
    autoload:true,
    //是否自动加载播放 默认false
    autoplay:false,
    //是否有声音文件 默认true
    hasAudio:true,
    //非必须  视频准备可以播放时候
    readyPlay: function () {

    },
    //非必须  视频播放完成时候
    playEnd: function () {
    },
    //竖屏情况下按高自适应
    pageScale:true,
    //在一开始就进行加载 video标签视频 一般配合onlyVideo使用
    inSiteLoad:true,
    //只用video标签方式
    onlyVideo:true,
    //=============帧播放器才有参数设置========
    //帧播放器 刷新率
    fps:12,
    //设置开始帧
    start:0,
    //设置结束帧
    end:133,
    //前缀
    prefixes:'v',
    //后缀
    suffix:'.jpg',
    //序列帧格式化索引名称
    formatLength:3,
    //是否循环
    loop:false,
    //缓冲播放描述
    bufferedime:2,
    //是否本地缓存
    localSave:false,
    //声音文件，可以不设置，hasAudio=true 会自动按规则添加
    audio:'media/intro.mp3',
    
}
```

```html
<!--视频页面DOM结构-->
<div id="VideoPage">
    <div class="videoPanel"></div>
    <div class="uiPanel">
       <!--可以放交互ui-->
    </div>
</div>
```

```less

#VideoPage{
    position: absolute; left: 0; top: 0;
    .uiPanel{
        position: absolute; left: 0; top: 0;
        display: none;
    }
}
```