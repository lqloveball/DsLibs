/**
 * @class Ds.media.VideoInteractivePlayer
 * @classdesc: 交互视频播放控制器。视频交互类型网站快速实现库，需要以下库的支持
 * iphone-inline-video.browser.js  ios视频全屏播放
 * jsmpg.js mpg解码（改造过）
 * Ds.media.VidePlayerByVideoTag  用来实现Video标签的视频控制
 * Ds.media.VidePlayerByMpeg      用来实现安卓下视频解码Canvas控制播放
 * @param {[String]} url  [视频地址]
 * @param {[String]} type [视频交互实现类型 video  canvas]
 * @param {[Object]} opts [初始化参数]
  [video类] Ds.media.VidePlayerByVideoTag=======================
  element                   //视频video标签
  append:                  //需要添加到div
  autoplay:                //是否自动播放
  loop:                    //是否循环

  [ts类型] Ds.media.VidePlayerByMpegTS==========================
  canvas:                               //渲染用的canvas对象  默认会创建
  loop:                                 //是否循环 默认true
  autoplay:                             //是否自动播放 默认false
  audio:                                //是否编译了声音 默认true
  video:                                //是否编译了视频 默认true
  poster:                               //海报页面url地址 默认没有 这个待研究
  pauseWhenHidden:                      //浏览器不激活的时候不播放 默认true
  disableGl:                            //禁止使用webgl 默认false
  preserveDrawingBuffer:                //canvas.toDataURL()创建缓存  默认false
  progressive:                          //启用的可以渐进加载 默认true
  throttled:                            // 默认true 使用分段渐进加载，比如切分6段，加载2段，先不播放，那剩下就不做加载了。原来是默认是true，但我觉的渐进加载还是用false比较合适
  chunkSize:                            //切割渐进加载数据大小 默认1024*1024 (1mb)
  decodeFirstFrame:                     //默认显示第一帧 默认true
  maxAudioLag:                          //默认值0.25 ???未知
  videoBufferSize:                      //视频缓存区 默认 512*1024 (512kb)
  audioBufferSize:                      //视频缓存区 默认 (128 * 1024) (128kb)
  duration:                             //视频总时间长度 默认60
  autoLoad：                            //是否自动加载 默认false

  [mpg类型] Ds.media.VidePlayerByMpeg==========================
  canvas:                         //渲染用canvas 默认不填写会自动创建
  audio:                          //声音地址
  loadByAudioCanplay:             //是否在声音允许播放就开始进行加载准备解码播放
  progressShow:                   //默认加载进度表现
  seekable:                       //是否计算头文件 计算出时间 并且可以进行跳帧控制
  duration:                       //避免头文件未计算完成，得不到总时间
  progressive:                    //缓冲加载播放
  progressiveThrottled:           //缓冲加载播放
  autoLoad:false                  //自动加载视频
  append:                         //需要添加到div
  autoplay:                       //是否自动播放
  loop:                           //是否循环

  [Events] ==========================
  onstartload:                      //开始加载 function   事件名：startLoad
  onprogress:                       //加载进度 function   事件名：progress
  onload:                           //加载完成 function   事件名：loadEnd

  onplayend                         //播放完成 function   事件名：playEnd
  onplay:                           //触发播放 function   事件名：play
  onpause:                          //触发播放 function   事件名：pause
  oncanPlay:                        //是否可以播放 function 事件名：canPlay
  oncanPlayProgress:                //是否可以播放 function 事件名：canPlayprogress
  upDate:                           //帧触发 function    事件名：upDate
 * @extends
 * @example: 举例
 [=================HTML===================]
  <!-- 放视频的容器  -->
  <div id="MyVideoPanel">
   <!-- 进行需要控制的视频 -->
   <video class='MyVideo' width="640" height="1140"
    playsinline="true" webkit-playsinline="true" x-webkit-airplay="true" x5-video-player-type="h5" x5-video-orientation="h5" x5-video-player-fullscreen="true"
    preload="auto"
    poster=""
    volume='0'
    style="position: absolute; left: 3000px; top: 0; object-fit: fill"
    src="media/myVideo.mp4" >
    </video>
  </div>
  注意对 preload的设置
  preload="auto" 当页面加载后载入整个视频
  preload="meta" 当页面加载后只载入元数据
  preload="none" 当页面加载后只载入元数据
  视频不能进行diplay:none;但可以设置left: 3000px;
  [=================CSS===================]
   .IIV::-webkit-media-controls-play-button,
   .IIV::-webkit-media-controls-start-playback-button {
       opacity: 0;
       pointer-events: none;
       width: 5px;
   }
   #MyVideoPanel video::-webkit-media-controls-start-playback-button {
       display: none;
   }
   #MyVideoPanel canvas {
     position: absolute;
     left:0;top:0;
   }
  [=================JS===================]
  //在HTML页面上插入code解决IOS自动全屏的问题
  var video = document.querySelector('video');
  makeVideoPlayableInline(video);
  [=================项目使用===================]
  //===================如果使用TS模式===================
  _VideoInteractivePlayer = new Ds.media.VideoInteractivePlayer('media/myVideo.ts', 'ts', {
      append: '#MyVideoPanel',
      autoplay: false,
      progressive: true,
      throttled: true,
      duration: 253,
      width: 1138,
      height: 640,
      oncanPlay: function() {
          console.log('myVideo.ts canPlay');
          _VideoInteractivePlayer.Play();
      },
      onload: function() {
          console.log('myVideo.ts onload');
      },
  });
  //ts格式 与mpg格式可以通过 Load方法进行启动加载
  _VideoInteractivePlayer.Load();

  //===================如果使用MPG模式===================
  _VideoInteractivePlayer = new Ds.media.VideoInteractivePlayer('./media/myVideo.mpg', 'mpg', {
      append: '#MyVideoPanel',
      audio:'./media/myVideo.mp3',
      autoplay: false,
      autoload:false,
      progressive: true,
      seekable:true,
      duration: 253,
      width: 1138,
      height: 640,
      oncanPlay: function() {
          console.log('myVideo.mpeg canPlay');
          _VideoInteractivePlayer.Play();
      },
      onload: function() {
          console.log('myVideo.mpeg onload');
      },
  });
  //ts格式 与mpg格式可以通过 Load方法进行启动加载
  _VideoInteractivePlayer.Load();

  //===================如果使用video标签模式===================
  var _videoDom = $("#MyVideoPanel .MyVideo")[0];
  _VideoInteractivePlayer = new Ds.media.VideoInteractivePlayer(null, 'video', {
      element: _videoDom,
      autoplay: false,
  });

  //========================快速添加视频交互的时间点===================
  //播放开始  判断是否开始播放视频，视频进入到时间播放的0.1秒
  _VideoInteractivePlayer.AddCuePoint({
      name: 'play',
      time: 0.1,
      fun: function(e) {
        console.log('这时候的视频可以确保是有画面的);
      }
  });
  //其他时间点交互触发
  _VideoInteractivePlayer.AddCuePoint({
      name: 'end',
      time: 5,
      fun: function(e) {
        console.log(e.data.name, e.time);
        //暂停视频，这时候进行弹出交互提示
        _VideoInteractivePlayer.Pause();
      }
  });
 * @todo 把序列帧播放器Ds.media.VideoPlayerByFrames也添加到这个视频交互类里
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
(function (factory) {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);

    if (typeof define === 'function' && define.amd) {
        define(['exports'], function (exports) {
            module.exports= factory(root, exports);
        });
    } else if (typeof exports !== 'undefined') {
        module.exports=factory(root, exports);
    } else {
         factory(root, {});
    }

}(function (root, modelObj) {

  root.Ds = root.Ds || {};
  root.Ds.media = root.Ds.media || {};
  root.Ds.media.VideoInteractivePlayer = VideoInteractivePlayer;

  function VideoInteractivePlayer(url, type, opts) {
      var _Self = this;
      //这个类支持事件扩展
      Ds.Extend(this, new Ds.EventDispatcher());
      /**
       * 播放器
       */
      var _VideoPlayer;
      Object.defineProperty(this, "VideoPlayer", {
          get: function() {
              return _VideoPlayer;
          }
      });
      /**
       * 是否交互播放器类型
       * @type {String}
       */
      var _VideoType = '';
      Object.defineProperty(this, "VideoType", {
          get: function() {
              return _VideoType;
          },
      });
      // console.log(type);
      //初始化视频的交互使用播放器方式
      //使用版本1的播放器
      if (type === 'canvas' || type === 'mpeg'|| type === 'mpg') {
          _VideoType = 'MPEG';
          console.log('创建mpeg的交互对象');
          _VideoPlayer = new Ds.media.VidePlayerByMpeg(url, opts);
          InitVideoEvent();
      }
      //使用序列帧播放器
      else if (type === 'mpegByts'|| type === 'ts') {
          _VideoType = 'TS';
          console.log('创建mpegByTS的交互对象');
          _VideoPlayer = new Ds.media.VidePlayerByMpegTS(url, opts);
          InitVideoEvent();
      }
      //使用序列帧播放器
      else if (type === 'frames' || type === 'FPS') {
          _VideoType = 'FPS';
      }
      //使用默认video标签
      else {
          _VideoType = 'Video';
          console.log('创建Video标签的交互对象');
          _VideoPlayer = new Ds.media.VidePlayerByVideoTag(url, opts);
          InitVideoEvent();
      }
      /**
       * 开始加载视频，只有非Video标签实现的交互播放器才有这功能
       */
      this.Load=function(){
        // console.log('load Video',_VideoType);
        if(_VideoType!='Video'){
          _VideoPlayer.Load();
        }
      };

      function InitVideoEvent() {
          //事件
          _VideoPlayer.on('canplay', function() {
              _Self.ds('canplay');
          });
          _VideoPlayer.on('progress', function(e) {
              _Self.ds(e);
          });
          _VideoPlayer.on('loadEnd', function(e) {
              _Self.ds(e);
          });
          _VideoPlayer.on('play', function() {
              _Self.ds('play');
          });
          _VideoPlayer.on('pause', function() {
              _Self.ds('pause');
          });
          _VideoPlayer.on('playEnd', function() {
              _Self.ds('playEnd');
          });
          _VideoPlayer.on('upDate', function() {
              _Self.ds('upDate');
          });
      }
      /**
       * 当前时间
       * @type {[Number]}
       */
      Object.defineProperty(this, "CurrentTime", {
          get: function() {
              return _VideoPlayer.CurrentTime;
          }
      });

      /**
       * 时间长度
       * @type {[Number]}
       */
      Object.defineProperty(this, "Duration", {
          get: function() {
              return _VideoPlayer.Duration;
          }
      });

      var _Playing = false;
      Object.defineProperty(this, "Playing", {
          get: function() {
              return _VideoPlayer.Playing;
          },
          set: function(bool) {
              if (bool) _Self.Play();
              else _Self.Pause();
          }
      });

      /**
       * 播放
       */
      this.Play = function() {
          if (_VideoPlayer) _VideoPlayer.Play();
      };

      /**
       * 暂停
       */
      this.Pause = function() {
          if (_VideoPlayer) _VideoPlayer.Pause();
      };
      /**
       * 跳转到制定时间
       * @param {[type]} seconds [秒数]
       */
      this.SeekToTime = function(seconds) {
          _VideoPlayer.SeekToTime(seconds);
      };
      /**
       * 声音大小
       * @type {[type]}
       */
      Object.defineProperty(this, "Volume", {
          get: function() {
              return _VideoPlayer.Volume;
          },
          set: function(value) {
            _VideoPlayer.Volume=value;
          }
      });
      /**
       * 是否禁音
       * @type {[type]}
       */
      Object.defineProperty(this, "Muted", {
          get: function() {
              return _VideoPlayer.Muted;
          },
          set: function(value) {
            _VideoPlayer.Muted=value;
          }
      });



      _VideoPlayer.on('upDate', TimeUpDate);
      /*使用Video标签的TimeUpDate*/
      function TimeUpDate(e) {
          // log('TimeUpDate',_VideoPlayer.CurrentTime)
          if (!_VideoPlayer) return;
          var _currentTime = 0;
          _currentTime = _VideoPlayer.CurrentTime;
          // log('--->',_VideoDom.currentTime)
          for (var i = 0; i < _VideoCuePointList.length; i++) {
              var _pointData = _VideoCuePointList[i];
              if (_pointData.time && _currentTime >= _pointData.time && !_pointData.bool) {
                  _pointData.bool = true;
                  _pointData.runNum += 1;
                  var _eventData = {
                      type: 'cuePoint',
                      data: _pointData,
                      time: _currentTime
                  };
                  if (_pointData.fun) _pointData.fun(_eventData);
                  _Self.ds(_eventData);
              }
          }
      }
      /**
      添加提示点，对应时间与处理方法
      */
      var _VideoCuePointList = [];
      Object.defineProperty(this, "VideoCuePointList", {
          get: function() {
              return _VideoCuePointList.concat();
          }
      });

      /**
      * 添加交互的时间节点
      * @param {[type]} pointData [时间节点事件]
      * pointData.name   	//这个时间点的名称
        pointData.time   	//时间点   必须的
        pointData.fun     //时间节点事件

        pointData.runNum 	//自动创建  这个时间执行多少次 方便用来进行逻辑处理判断
        pointData.bool      //自动创建 是否被执行过
      *
      * @example
      * _VideoInteractivePlayer.AddCuePoint({
        name:'Test 5s',
        time:5,
        fun:function(e){
          console.log(e.data.name,e.time);
        }
      });
      */
      this.AddCuePoint = function(pointData) {
          if (!pointData.time) {
              return;
          }
          if (!pointData.name) pointData.name = 'time_' + pointData.time;
          pointData.runNum = 0;
          pointData.bool = false;
          _VideoCuePointList.push(pointData);
      };
      /**
       * 获取互动节点
       * @param  {[type]} name [description]
       * @return {[type]}      [description]
       */
      this.GetCuePoints = function(name) {
        var _list=[];
        for (var i = 0; i < _VideoCuePointList.length; i++) {
            var _pointData = _VideoCuePointList[i];
            if(_pointData.name.indexOf(name)!=-1){
              _list.push(_pointData);
            }
        }
        return _list;
      };
      /**
       * 重置所有时间交互点
       */
      this.ResetCuePointListData = function() {
          for (var i = 0; i < _VideoCuePointList.length; i++) {
              var _pointData = _VideoCuePointList[i];
              _pointData.runNum = 0;
              _pointData.bool = false;
          }
      };
      /**
       * 重置制定时间交互点
       * @param {[type]} name [description]
       */
      this.ResetCuePointByName = function(name) {
          for (var i = 0; i < _VideoCuePointList.length; i++) {
              var _pointData = _VideoCuePointList[i];
              if (_pointData.name == name) {
                  _pointData.bool = false;
                  _pointData.runNum = 0;
              }
          }
      };
      /**
       * 清空清除所有的交互节点
       */
      this.ClearCuePointList = function() {
          _VideoCuePointList = [];
      };
  }

  return VideoInteractivePlayer;
}));
