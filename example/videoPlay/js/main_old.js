!(function() {
    //进行判断是否进行debug的判断
    var __debug = false;
    if (window.location.href.indexOf(':8001') != -1) __debug = true;
    //网站主模块
    var Model = function() {
        var _Self = this;
        //继承事件类
        Ds.Extend(_Self, new Ds.EventDispatcher());
        //系统版本判断
        if (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) this.OS = 'ios';
        else this.OS = (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux')) ? 'android' : '';
        if(this.OS === '') this.OS = 'ios';
        //自适应
        var _SiteResizeModel = new Ds.SiteMoblieResizeModel({
          screen:'#screen',
        });
        _SiteResizeModel.on('resize', Resize);
        _SiteResizeModel.InitResize();


        var _VidePlayer;
        var _VideCanvas;
        var _VideoInteractivePlayer;
        Init();
        /**
         * 初始化
         */
        function Init(){
          log('SiteModel Init');

          if(_Self.OS=='ios'){
              $('#videoType').html('IOS 视频播放:点击开始');
            _VideoInteractivePlayer=new Ds.media.VideoInteractivePlayer('media/video1.mp4','video',{
              //append:'#videoPanel',//如果使用 element 说明dom元素上默认有
              element:$('#videoPanel .videoPlayer')[0],
              autoplay:false,
              width:640,
              height:1040,
              canplay:function(){
                console.log('video.mp4 canPlay');
              },
            });
          }else{
              $('#videoType').html('安卓 mpeg视频播放:点击开始');
            _VideoInteractivePlayer=new Ds.media.VideoInteractivePlayer('media/out.mpg','canvas',{
              append:'#videoPanel',
              autoplay:false,
              progressive:true,
              seekable:true,
              audio:'media/out.mp3',
              duration:42,
              width:640,
              height:1040,
              canplay:function(){
                console.log('out.mpg canPlay');
              },
              onload:function(){
                console.log('out.mpg onload');
              },
            });
          }
          window.VideoInteractivePlayer=_VideoInteractivePlayer;

          _VideoInteractivePlayer.AddCuePoint({
            name:'Test 5s',
            time:5,
            fun:function(e){
              console.log(e.data.name,e.time);
            }
          });
          _VideoInteractivePlayer.on('cuePoint',function(e){
            console.log('event:',e.data.name,e.time);
          });

          $('body').on('touchstart',function(){
            _VideoInteractivePlayer.Play();
          });
          $('body').on('touchend',function(){
            _VideoInteractivePlayer.Pause();
          });

        }

        //自适应计算相关参数
        var _Width, _Height, _PageScale, _ActualH, _Horizontal = false,
            _IsInputState = false,
            _ScreenWidth, _DensityDpi;
        /**
         * 自适应
         */
        function Resize() {
          _Width = window.innerWidth; //获取到window宽

          _Height = window.innerHeight; //获取到window高;
          _ActualH = _SiteResizeModel.ActualH; //真实高度
          _PageScale = _SiteResizeModel.PageScale; //页面上场景缩放比例
          _IsInputState = _SiteResizeModel.IsInputState; //是否输入状态下
          _Horizontal = _SiteResizeModel.Horizontal; //是否选择屏幕状态
          _ScreenWidth = _SiteResizeModel.ScreenWidth; //当前屏幕尺寸计算用宽
          _DensityDpi = _SiteResizeModel.DensityDpi; //当前屏幕尺寸计算用宽
          // log(_SiteResizeModel);

          // $('#debug').html(
          //   JSON.stringify(
          //     {
          //       w:_Width,
          //       h:_Height,
          //       scale:_PageScale,
          //     }
          //   )
          // )
          _Self.Width = _Width;
          _Self.Height = _Height;
          _Self.ActualH = _ActualH;
          _Self.PageScale = _PageScale;
          _Self.IsInputState = _IsInputState;
          _Self.Horizontal = _Horizontal;
          _Self.ScreenWidth = _ScreenWidth;
          _Self.DensityDpi = _DensityDpi;
          // 注意这里不使用reize 使用Reize愿意是 zepto 下事件保护名
          _Self.ds('Reize');
        }
    }

    window.siteModel = new Model();
})();
