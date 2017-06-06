/**
 * @class Ds.media.VidePlayerByVideoTag
 * @classdesc:通过原生Video标签视频交互播放器管理
 * @param {[String]} url  [视频地址，也可以设置null，直接使用opts.element元素上视频]
 * @param {[Object]} opts [初始化参数]
   element            // 设置视频video标签，如果设置会自动创建一个video标签
   append:            // 需要添加到div
   autoplay:          // 是否自动播放
   loop:              // 是否循环

 * @todo //准备统一视频播放器事件参数
 * @todo  onstartload:              //开始加载
 * @todo  onprogress:               //加载进度
   onload:                          //加载完成
   upDate:                          //帧触发 function
   onplayend                        //播放完成 function
   onplay:                          //触发播放 function
   onpause:                         //触发播放 function
 * @todo  oncanPlay:               //是否可以播放function【还未测试实现】
 * @todo  oncanPlayProgress:       //是否可以播放function【还未测试实现】
 *  @extends
 *  @example:
 *  Html上标签设置
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

 * @todo 感觉这播放器还有点bug，需要项目实践Play进行修复
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
  root.Ds.media.VidePlayerByVideoTag = VidePlayerByVideoTag;

  function VidePlayerByVideoTag(url, opts) {
      var _Self = this;
      //继承事件类
      Ds.Extend(_Self, new Ds.EventDispatcher());
      /**
       * Video标签元素模板
       */
      var _VideoHtml = ['<video class=\'VidePlayerByVideoTag\' width="640" height="1140"',
          ' playsinline="true" webkit-playsinline="true" x-webkit-airplay="true" x5-video-player-type="h5" x5-video-orientation="h5" x5-video-player-fullscreen="true"',
          ' preload="meta"',
          ' poster=""',
          ' volume=\'0\' ',
          ' style="position: absolute; left: 0; top: 0; object-fit: fill"',
          ' src="" >',
          ' </video> '
      ].join("");

      var _Player;
      //配置里面没有视频标签就创建一个
      var _element = null;
      if (opts.element) {
          _element = opts.element;
      } else if (opts.videoDom) {
          _element = opts.videoDom;
      }
      _Player = _element!==null?_element : $(_VideoHtml)[0];
      /**
       *  Video标签元素
       */
      Object.defineProperty(this, "Player", {
          get: function() {
              return _Player;
          }
      });

      //添加制定容器
      if (opts.append) $(opts.append).append(_Player);

      /**
       * 视频事件参考 http://www.w3school.com.cn/tags/html_ref_audio_video_dom.asp
       */
      var _EventList = [
          'abort', //当音频/视频的加载已放弃时
          // , 'canplay' //当浏览器可以播放音频/视频时
          // , 'canplaythrough' //当浏览器可在不因缓冲而停顿的情况下进行播放时
          'durationchange', //当音频/视频的时长已更改时
          'emptied', //当目前的播放列表为空时
          // , 'ended' //当目前的播放列表已结束时
          'error', //当在音频/视频加载期间发生错误时
          'loadeddata', //当浏览器已加载音频/视频的当前帧时
          'loadedmetadata', //当浏览器已加载音频/视频的元数据时
          'loadstart', //当浏览器开始查找音频/视频时
          // , 'pause' //当音频/视频已暂停时
          // , 'play' //当音频/视频已开始或不再暂停时
          // , 'playing' //当音频/视频在已因缓冲而暂停或停止后已就绪时
          // , 'progress' //当浏览器正在下载音频/视频时
          'ratechange', //当音频/视频的播放速度已更改时
          'seeked', //当用户已移动/跳跃到音频/视频中的新位置时
          'seeking', //当用户开始移动/跳跃到音频/视频中的新位置时
          'stalled', //当浏览器尝试获取媒体数据，但数据不可用时
          'suspend', //当浏览器刻意不获取媒体数据时
          // , 'timeupdate' //当目前的播放位置已更改时
          'volumechange', //当音量已更改时
          'waiting', //当视频由于需要缓冲下一帧而停止
      ];

      if (url !== undefined && url !== null) {
          _Player.autoplay = !!opts.autoplay;
          _Player.loop = !!opts.loop;
          _Player.src = url;
          _Player.load();
      }
      //src/libs/media/iphone-inline-video.browser.js 对视频元素进行全屏播放兼容性处理
      makeVideoPlayableInline(_Player);

      //进行预加载判断
      // _Player.addEventListener("canplaythrough", Canplaythrough);
      // _Player.addEventListener("canplay", Canplay);
      _Player.addEventListener("progress", function(e) {
          Progress(e);
      });
      _Player.addEventListener("timeupdate", function() {
          FrameUpDate();
      });
      _Player.addEventListener("play", function() {
          OnPlay();
      });
      _Player.addEventListener("pause", function() {
          OnPause();
      });
      _Player.addEventListener("ended", function() {
          PlayEnd();
      });

      /**
       * 当前时间
       * @type {[Number]}
       */
      Object.defineProperty(this, "CurrentTime", {
          get: function() {
              return _Player.currentTime;
          }
      });
      /**
       * 时间长度
       * @type {[Number]}
       */
      Object.defineProperty(this, "Duration", {
          get: function() {
              return _Player.duration;
          }
      });

      /**
       * 声音大小
       * @type {[type]}
       */
      Object.defineProperty(this, "Volume", {
          get: function() {
              return _Player.volume;
          },
          set: function(value) {
              _Player.volume = value;
          }
      });

      /**
       * 是否禁音
       * @type {[type]}
       */
      Object.defineProperty(this, "Muted", {
          get: function() {
              return _Player.muted;
          },
          set: function(value) {
              _Player.muted = value;
          }
      });

      /**
       * 加载完成
       * @param {[Number]} progress [0-1加载进度]
       */
      function Progress(e) {
          // console.log('加载进度:', e);
          if (opts.onprogress) opts.onprogress(progress);
          _Self.ds('progress');
      }
      /**
       * 加载完成
       */
      function LoaeEnd() {
          if (opts.onload) opts.onload();
          _Self.ds('loadEnd');
          // console.log('加载完成')
          // console.log('time: ' +_Player.currentTime+'/'+ _Player.duration )
      }
      /**
       * 帧渲染
       */
      function FrameUpDate() {
          if (opts.upDate) opts.upDate();
          _Self.ds('upDate');
          // console.log('time:' + (_Player.currentTime) + '/' + _Player.duration);
      }
      /**
       * 播放完成
       */
      function PlayEnd() {
          if (opts.onplayend) opts.onplayend();
          _Self.ds('playEnd');
      }
      /**
       * 触发播放
       */
      function OnPlay() {
        if (opts.onplay) opts.onplay();
          // console.log('OnPlay',_Self.Playing);
          _Player.play();
          _Self.ds('play');
      }
      /**
       * 触发暂停
       */
      function OnPause() {
          // console.log('OnPause',_Self.Playing);
          if (opts.onpause) opts.onpause(); 
          _Player.pause();
          _Self.ds('pause');
      }
      /**
       * 是否播放中 Playing Get  实现
       * @type {Boolean}
       */
      var _Playing = false;
      Object.defineProperty(this, "Playing", {
          get: function() {
              return !_Player.paused;
          },
          // set: function(bool) {
          //     if (bool) _Self.Play();
          //     else _Self.Pause();
          // }
      });
      /**
       * 播放
       */
      this.Play = function() {
          _Player.play();
      };

      /**
       * 暂停
       */
      this.Pause = function() {
          _Player.pause();
      };
      /**
       * 跳转到制定时间
       * @param {[type]} seconds [description]
       */
      this.SeekToTime = function(seconds) {
          _Player.currentTime = seconds;
          // _Player.play();
      };

  }

  return VidePlayerByVideoTag;
}));
