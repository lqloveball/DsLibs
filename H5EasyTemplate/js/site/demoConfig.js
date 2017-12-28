var SiteConfig = {
    //【必填】 分享设置
    shareData: {
        shareTitle: "速速提供分享标题",
        shareInfo: "速速提供分享内容",
        shareUrl: "/index.html",
        shareWorkUrl: "/index.html?WorkID=",
        shareImageUrl: 'images/ShareImg.jpg',
    },
    //【非必填】页面开始加载图片有动画资源前 框架的加载占比，默认20
    loadAssetsStartProgress: 30,
    //【必填】加载资源设置
    loadAssets: [
        //【加载配置方式1】加载Animate导出资源，默认在assets目录下
        'main.js',
        //【加载配置方式2】加载Animate导出资源，可修改js命名空间
        {url: 'otherPage.js', jsNS: "other"},
        //【加载配置方式3】加载图片队列
        [
            './images/ShareImg.jpg',
            './images/BGMICON.png',
        ],
        //【加载配置方式4】加载图片队列,使用对象方式 必须设置type是images,basePath设置路径
        {
            type: 'images',
            basePath: './images/',
            list: [
                'ShareImg.jpg',
                'BGMICON.png',
            ]
        }
    ],
    //【必填】页面配置
    pages: [

        //【页面配置方式1】可以配置页面动画进度情况 initUI：页面构建时 movieIn：开始进场时   movieInEnd：进场完成时  movieOut：退场时 movieOutEnd：退场完成时
        {
            //【name】页面简易配置：main.IntroPage  main：代表这个页面是通过main.js这个文件里面库文件创建的，   IntroPage是这个页面名称也是这个页面对应库里面页面类
            name: 'main.IntroPage',
            //【movieInEnd】代表进场完成后会调用的方法
            movieInEnd: function () {
                //SiteModel.gotoPage 可以帮忙快速实现页面跳转
                SiteModel.gotoPage('HomePage');
            }
        },

        //【页面配置方式2】
        {
            name: 'main.HomePage',
            initUI: function () {
                //这些配置方法 this指向 会是这个页面逻辑模型
                //view是这个页面具体呈现对象, btn是这个页面下有的一个按钮
                this.view.btn.on('click', function () {
                    // SiteModel.gotoPage('MovieInPage');
                    var _page = SiteModel.getPage('VideoPage');
                    _page.play();
                });
            }
        },

        //【页面配置方式3】 只需要填写页面名。这样配置会指定添加上滑与下滑切换到上一页与下页面功能
        // 页面动画资源只有进场
        'other.MovieInPage',
        // 页面动画有进场 有退场
        'other.MovieInOutPage',
        //【页面配置方式4】配置简单HTML页面 在HTML上有这个dom结构
        '#HtmlPage',
        //【页面配置方式4】配置简单HTML页面 在HTML上有没有dom结构 自动创建添加到#domBox内 如果没这个节点会添加到#screen
        '#AutoCreateDom',

        //【页面配置方式4】配置简单HTML页面 在HTML上有没有dom结构 自动创建添加到#domBox内 如果没这个节点会添加到#screen
        {
            name: '#AutoCreateDom2',
            initUI: function () {
                var _image = new Image();
                _image.src = './images/ShareImg.jpg';
                this.view.append(_image);
                $(_image).on('click',function () {
                    var _page = SiteModel.getPage('FramesPage');
                    _page.play();
                })
            },
        },

        //【页面配置方式5】配置视频页面
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
            hasFPS:true,
            autoload:false,
            end:133,
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

        },

        {
            name: '#FramesPage',
            //标记这个页面类型是视频播放页面 注意在plugins 里面需要添加视频播放插件 'videoPage'
            type: 'frames',
            // 视频页面地址 不需要填写 .mp4，因为会根据系统自动判断播放类型
            // url: 'images/video/f1',
            // prefixes:'1_',
            // start:6,
            // end:127,
            url: 'media/intro',
            prefixes:'v',
            start:0,
            end:133,
            //设置视频宽
            width: 1138,
            //设置视频高
            height: 640,
            localSave:true,
            autoload:false,
            autoplay:false,
            // hasAudio:true,
            loop:true,
            // mp3:'images/video/intro.mp3',
            initUI: function () {
                ds.media.FramesPlayer.setlocalStorageVersion('1512122998191');
                var _self = this;
                this.view.find('.uiPanel .btn1').on('click', function () {
                    if(_self.videoPlayer.playing)_self.videoPlayer.pause();
                    else _self.videoPlayer.play();
                });

                this.view.find('.uiPanel .btn2').on('click', function () {

                    SiteModel.gotoPage('NoMoviePage');
                });
            },
            //视频准备可以播放时候
            readyPlay: function () {

            },
            //视频播放完成时候
            playEnd: function () {
                console.log(this.name, 'playEnd');
                // SiteModel.gotoPage('MovieInPage');

            }

        },
        // 页面动画没有进场与退场
        'other.NoMoviePage',
        'other.DynamicFontPage',
    ],

    //【非必填】可以设置默认第一个页面 .默认是pages里面的第一个页面
    firstPage: 'DynamicFontPage',
    //【非必填】可以设置本地debug 默认第一个页面
    // debugFirstPage: 'MovieInOutPage',
    //【非必填】设置作品回流页面
    workPage: {
        //回流页面名称
        name: "WorkPage",
        // 设置这个参数，会中断页面跳转，会等获取到作品数据后，自己进行手动进行控制回流页面的跳转
        getWorkData: function (workid) {

        }
    },
    //【非必填】插件。
    plugins: [
        'videoPage','framesPage'
    ],
    //【非必填】扩展逻辑代码。
    extend: [
        './js/app/SiteExtend.js'
    ],
    //=================如需要更多自定义 查看ds.core.SiteModelByMobile配置=================

    //【非必填】背景声音配置
    audioConfig: {
        //声音队列
        list: [
            // src、id 必须，其他选填 loop是否循环默认true，volume音量大小
            {src: './media/BGM.mp3', id: 'BGM', loop: true, volume: 0.01},
        ],
        //默认播放指定ID声音作为背景音
        id: 'BGM1',
        //默认背景音绑定的Dom对象
        button: '#BGMBtn'
    },

    //【非必填】是否使用createjs做loading的动画资源
    hasCJSLoad: true,
    //【非必填】框架SiteModel创建完成（构建完成 $选择器、SiteModel拥有事件功能、自适应框架执行、声音对象构建完成）
    baseEnd: loadBaseEnd,
    //【非必填】默认'v'竖屏 'h'横屏 'auto' 横竖屏皆可以
    type: 'auto',
    resizeDelay: 300,
};


//执行
function loadBaseEnd() {
    console.log('基础框架加载完成');
}