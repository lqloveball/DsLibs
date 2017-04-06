/**
 * @class Ds.media.VidePlayerByMpeg
 * @classdesc:视频播放器 基于对mpeg视频格式解码 渲染到canvas上
 * 基于对mpeg视频格式解码 ，需要引用 src/libs/media/jsmpg.js
 * [安卓版本对video标签支持不好，但又支持webgl的项目可以使用这个视频解码播放器做替代方案]
 * Audio转换：
 * Adobe Media Encoder 对视频进行转换导出mp3资源
 * Video转换：
 * 视频压缩工具命令
 * ffmpeg -i in.mp4 -f mpeg1video -vf "crop=iw-mod(iw\,1):ih-mod(ih\,1)" -qscale 10 -b 0 out.mpg
    （in.mp4：原视频文件名；out.mpg：导出的视频文件名）
    （(iw\,2)和(ih\,2)为视频的宽高，设置为1则代表为原视频宽高）
    （ -qscale 1 ：视频的清晰度，1代表最清晰，数值越大越模糊）
 * [down http://www.ffmpeg.org/]
 * @param {[String]} url  [description]
 * @param {[Object]} opts [description]
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

    onstartload:                      //开始加载 function
    onprogress:                       //加载进度 function
    onload:                           //加载完成 function
    upDate:                           //帧触发 function
    onplayend                         //播放完成 function
    onplay:                           //触发播放 function
    onpause:                          //触发播放 function
    oncanPlay:                        //是否可以播放 function
    oncanPlayProgress:                //是否可以播放 function
 *  @extends
 * @example: 举例
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
  root.Ds.media.VidePlayerByMpeg = VidePlayerByMpeg;

  function VidePlayerByMpeg(url, opts) {
      var _Self = this;

      //继承事件类
      Ds.Extend(_Self, new Ds.EventDispatcher());
      //是否缓存加载
      var _Progressive = (opts.progressive !== undefined) ? opts.progressive : true;
      // console.log(opts.progressive,_Progressive);
      //是否在声音允许播放就开始进行加载准备解码播放
      var _LoadByAudioCanplay = true; //opts.loadByAudioCanplay == undefined ? true : false;
      //获取Canvas渲染对象
      var _Canvas = opts.canvas || document.createElement('canvas');
      Object.defineProperty(this, "Canvas", {
          get: function() {
              return _Canvas;
          }
      });
      //MPEG 解码播放器
      var _Player = new jsmpeg(url, {
          canvas: _Canvas,
          autoload: opts.autoplay !== undefined ? opts.autoplay : true,
          autoplay: !!opts.autoplay, //是否自动播放
          progressShow: !!opts.progressShow, //默认加载进度
          loop: !!opts.loop, //是否循环
          seekable: opts.seekable !== undefined ? opts.seekable : false, //是否计算头文件 计算出时间
          duration: opts.duration || 60, //避免头文件未计算完成，得不到总时间
          progressive: _Progressive, //是否缓冲加载播放
          progressiveThrottled: _Progressive, //缓冲加载播放

          onstartload: StartLoad, //加载完成
          onload: LoaeEnd, //加载完成
          ondecodeframe: FrameUpDate, //帧触发
          onprogress: Progress, //加载进度
          onfinished: PlayEnd, //播放完成
          onplay: OnPlay, //触发播放
          onpause: OnPause, //触发播放
          canPlay: OnCanPlay, //触发可以播放
          oncanPlayProgress: CanPlayProgress, //第一个加载完成可以播放进度
          upAudioTime: PlayerUpAudioTime //进跳帧后 声音控制
      });
      Object.defineProperty(this, "Player", {
          get: function() {
              return _Player;
          }
      });
      //宽
      var _Width = opts.width || 640;
      Object.defineProperty(this, "Width", {
          get: function() {
              return _Width;
          },
          set: function(widht) {
              _Width = widht;
              UpCavansScale();
          }
      });
      //高
      var _Height = opts.height || 1040;
      Object.defineProperty(this, "Height", {
          get: function() {
              return _Height;
          },
          set: function(height) {
              _Height = height;
              UpCavansScale();
          }
      });
      /**
       * 画布大小
       */
      function UpCavansScale() {
          $(_Canvas).css({
              "width": _Width + 'px',
              "height": _Height + 'px'
          });
      }
      UpCavansScale();

      //添加到制定容器
      if (opts.append) $(opts.append).append(_Canvas);

      //音频对象
      var _Audio = null;
      Object.defineProperty(this, "Audio", {
          get: function() {
              return _Audio;
          }
      });

      //判断是否有音频
      var _AudioUrl = opts.audio || '';
      if (_AudioUrl === '') {
          _Audio = null;
          if (opts.autoload === true) {
              _Self.Load(url);
          }
      } else {
          _Audio = new Audio();
          _Audio.autoplay = false;
          _Audio.src = _AudioUrl;
          _Audio.load();
          //客户端开始请求数据
          _Audio.addEventListener('loadstart', function() {
              console.log('_Audio loadstart');
          });
          //客户端开始请求数据
          _Audio.addEventListener('abort', function() {
              console.log('abort');
          });
          _Audio.addEventListener('waiting', function() {}); //等待数据，并非错误
          _Audio.addEventListener('ended', function() {}); //播放结束
          _Audio.addEventListener('loadedmetadata', function() {}); //加载完成 其实不是
          _Audio.addEventListener('progress', function() {}); //客户端正在请求数据
          _Audio.addEventListener('suspend', function() {}); //延迟下载
          _Audio.addEventListener('play', function() {}); //play()和autoplay开始播放时触发
          _Audio.addEventListener('pause', function() {}); //pause()触发
          _Audio.addEventListener('canplaythrough', function() {
              AudioCanplay();
          }); //可以播放
          _Audio.addEventListener('error', function() {
              AudioError();
          }); //可以播放
          document.body.addEventListener('touchstart', audioInBrowserHandler);

      }

      function audioInBrowserHandler() {
          document.body.removeEventListener('touchstart', audioInBrowserHandler);
          if (_Audio) {
              _Audio.play();
              _Audio.pause();
          }
      }
      //声音可以播放
      function AudioCanplay() {
          console.log('AudioCanplay', _Player.progressive);
          if (opts.autoload === true) {
              _Self.Load(url);
          }
      }
      //声音错误
      function AudioError() {
          console.warn('声音加载错误');
      }
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
       * 声音
       * @type {[type]}
       */
      Object.defineProperty(this, "Volume", {
          get: function() {
              return _Audio ? _Audio.volume : 0;
          },
          set: function(value) {
              if (_Audio) {
                  _Audio.volume = value;
              }
          }
      });
      /**
       * 是否禁音
       * @type {[type]}
       */
      Object.defineProperty(this, "Muted", {
          get: function() {
              return _Audio ? _Audio.muted : true;
          },
          set: function(value) {
              if (_Audio) {
                  _Audio.muted = value;
              }
          }
      });
      /**
       * 当前帧数
       * @type {[Number]}
       */
      Object.defineProperty(this, "CurrentFrame", {
          get: function() {
              return _Player.currentFrame;
          }
      });

      /**
       * 开始加载
       */
      this.Load = function() {
          if (_Player.progressive) {
              _Player.beginProgressiveLoad(url);
          } else {
              _Player.load(url);
          }
      };
      /**
       * 总帧数
       * @type {[Number]}
       */
      Object.defineProperty(this, "FrameCount", {
          get: function() {
              return _Player.frameCount;
          }
      });
      /**
       * 开始加载
       */
      function StartLoad() {
          _Self.ds({
              type: 'startLoad'
          });
          if (opts.onstartload) opts.onstartload();
      }
      /**
       * 加载完成
       * @param {[Number]} progress [0-1加载进度]
       */
      function Progress(progress) {
          console.log('加载进度:' + progress);
          if (opts.onprogress) opts.onprogress(progress);
          _Self.ds({
              type: 'progress',
              progress: progress
          });

      }

      /**
       * 加载完成
       */
      function LoaeEnd() {
          console.log('加载完成');
          if (opts.onload) opts.onload();
          _Self.ds('loadEnd');
      }

      /**
       * 帧渲染
       */
      function FrameUpDate() {
          if (opts.upDate) opts.upDate();
          _Self.ds('upDate');
          // console.log('frame:' + (_Player.currentTime >> 0) + '/' + _Player.duration);
      }
      /**
       * 播放完成
       */
      function PlayEnd() {
          if (opts.onplayend) opts.onplayend();
          _Playing = false;
          if (_Audio) _Audio.pause();
          _Self.ds('playEnd');
      }

      /**
       * 触发播放
       */
      function OnPlay() {
          if (opts.onplay) opts.onplay();
          if (_Audio) {
              if (_Player && _Player.currentTime) _Audio.currentTime = _Player.currentTime;
              _Audio.play();
          }
          _Self.ds('play');
      }
      /**
       * 触发暂停
       */
      function OnPause() {
            if (opts.onpause) opts.onpause();
          if (_Audio) _Audio.pause();
          _Self.ds('pause');
      }

      var _CanPlayBool = false;
      function OnCanPlay() {
          console.log(url + ' >>OnCanPlay');
          if (_CanPlayBool) return;
          _CanPlayBool = true;
          if (opts.oncanPlay) opts.oncanPlay();
          _Self.ds('canplay');
      }
      /**
       * 第一个触发可以播放进度
       * @param {[type]} progress [description]
       */
      function CanPlayProgress(progress) {
          if (opts.oncanPlayProgress) opts.oncanPlayProgress(progress);
          _Self.ds({
              type: 'canPlayprogress',
              progress: progress
          });
      }


      /**
       * 是否播放中 Playing Get Set 实现
       * @type {Boolean}
       */
      // var _Playing = false;
      Object.defineProperty(this, "Playing", {
          get: function() {
              return _Player.playing;
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
          if (!_CanPlayBool) return;
          // _Playing = true;
          _Player.play();
          if (_Audio) {
              _Audio.currentTime = _Player.currentTime;
              _Audio.play();
          }
      };

      /**
       * 暂停
       */
      this.Pause = function() {
          if (!_CanPlayBool) return;
          // _Playing = false;
          _Player.pause();
          if (_Audio) _Audio.pause();
      };
      /**
       * 跳转到制定时间
       * @param {[type]} seconds [description]
       */
      this.SeekToTime = function(seconds) {
          _Player.seekToTime(seconds, true);
      };

      /**
       * 跳转到制定帧
       * @param {[type]} frame [description]
       */
      this.SeekToFrame = function(frame) {
          _Player.seekToFrame(frame, true);
      };

      //进行跳帧后 声音播放位置更新
      function PlayerUpAudioTime(time) {
          if (_Audio) {
              _Audio.currentTime = time;
          }
      }

  }

  return VidePlayerByMpeg;
}));
