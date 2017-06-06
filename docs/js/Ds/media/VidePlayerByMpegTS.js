/**
 * @class Ds.media.VidePlayerByMpegTS
 * @classdesc:视频播放器 基于对mpeg视频格式解码 渲染到canvas上
 * 基于对mpeg视频格式解码 ，需要引用 src/libs/media/jsmpeg.js
 * [安卓版本对video标签支持不好，但又支持webgl的项目可以使用这个视频解码播放器做替代方案]
 * 因为需要同时对视频与音频进行解析，在性能上不如 Ds.media.VidePlayerByMpeg来实现的好，特别是大视频文件情况下。如果项目视频只是10-30秒的，这个类相对更方便使用。
 *
 * 视频压缩工具命令：
 * 默认压缩
    ffmpeg -i in.mp4 -f mpegts -codec:v mpeg1video -codec:a mp2 -b 0 out.ts
  压缩细节
    ffmpeg -i in.mp4 -f mpegts \
	           -codec:v mpeg1video -s 960x540 -b:v 1500k -r 30 -bf 0 \
	           -codec:a mp2 -ar 44100 -ac 1 -b:a 128k \
	           out.ts
  -s 视频大小 -r每秒帧数 -b 码率
  -ar 赫兹 -ac通道 -b 码率
 * [down http://www.ffmpeg.org/]
 * @param {[String]} url  [description]
 * @param {[Object]} opts [description]
    canvas: _Canvas, //渲染用的canvas对象  默认会创建
    loop: opts.loop !== undefined ? opts.loop : true, //是否循环
    autoplay: opts.autoplay !== undefined ? opts.autoplay : false, //是否自动播放
    audio: opts.audio !== undefined ? opts.autoplay : true, //是否编译了声音
    video: opts.video !== undefined ? opts.autoplay : true, //是否编译了视频
    poster: opts.poster !== undefined ? opts.poster : '', //海报页面 默认没有 这个待研究
    pauseWhenHidden: opts.pauseWhenHidden !== undefined ? opts.pauseWhenHidden : true, //浏览器不激活的时候不播放
    disableGl: opts.disableGl !== undefined ? opts.disableGl : false, //禁止使用webgl
    preserveDrawingBuffer: opts.preserveDrawingBuffer !== undefined ? opts.preserveDrawingBuffer : false, //canvas.toDataURL()创建缓存
    progressive: opts.progressive !== undefined ? opts.progressive : true, //启用的可以渐进加载
    throttled: opts.throttled !== undefined ? opts.throttled : true, //使用分段渐进加载，比如切分6段，加载2段，先不播放，那剩下就不做加载了。原来是默认是true，但我觉的渐进加载还是用false比较合适
    chunkSize: opts.chunkSize !== undefined ? opts.chunkSize : 1024 * 1024, //切割渐进加载数据大小 默认1024*1024 (1mb)
    decodeFirstFrame: opts.decodeFirstFrame !== undefined ? opts.decodeFirstFrame : true, //默认显示第一帧
    maxAudioLag: opts.maxAudioLag !== undefined ? opts.maxAudioLag :0.25, //???未知
    videoBufferSize: opts.videoBufferSize !== undefined ? opts.videoBufferSize : (512 * 1024), //视频缓存区Default 512*1024 (512kb)
    audioBufferSize: opts.audioBufferSize !== undefined ? opts.audioBufferSize : (128 * 1024), //视频缓存区Default 512*1024 (512kb)
    duration: opts.duration || 60, //视频总时间长度
    autoLoad：false //是否自动加载


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
(function(factory) {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);

    if (typeof define === 'function' && define.amd) {
        define(['exports'], function(exports) {
            module.exports = factory(root, exports);
        });
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(root, exports);
    } else {
        factory(root, {});
    }

}(function(root, modelObj) {

    root.Ds = root.Ds || {};
    root.Ds.media = root.Ds.media || {};
    root.Ds.media.VidePlayerByMpegTS = VidePlayerByMpegTS;

    function VidePlayerByMpegTS(url, opts) {
        var _Self = this;

        //继承事件类
        Ds.Extend(_Self, new Ds.EventDispatcher());

        //获取Canvas渲染对象
        var _Canvas = opts.canvas || document.createElement('canvas');
        Object.defineProperty(this, "Canvas", {
            get: function() {
                return _Canvas;
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
        //MPEG 解码播放器
        var _Player;
        Object.defineProperty(this, "Player", {
            get: function() {
                return _Player;
            }
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
        var _Duration = opts.duration || 60; //最大声音长度
        /**
         * 时间长度
         * @type {[Number]}
         */
        Object.defineProperty(this, "Duration", {
            get: function() {
                return _Duration;
            }
        });
        /**
         * 声音
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
         * 是否播放中 Playing
         * @type {Boolean}
         */

        Object.defineProperty(this, "Playing", {
            get: function() {
                return (_Player.isPlaying !== undefined ? _Player.isPlaying : false) && (_Player.wantsToPlay !== undefined ? _Player.wantsToPlay : false);
            }
        });

        //初始化解码器
        _Player = new JSMpeg.Player(url, {
            canvas: _Canvas, //渲染用的canvas对象  默认会创建
            loop: opts.loop !== undefined ? opts.loop : true, //是否循环
            autoplay: opts.autoplay !== undefined ? opts.autoplay : false, //是否自动播放
            audio: opts.audio !== undefined ? opts.autoplay : true, //是否编译了声音
            video: opts.video !== undefined ? opts.autoplay : true, //是否编译了视频
            poster: opts.poster !== undefined ? opts.poster : '', //海报页面 默认没有 这个待研究
            pauseWhenHidden: opts.pauseWhenHidden !== undefined ? opts.pauseWhenHidden : true, //浏览器不激活的时候不播放
            disableGl: opts.disableGl !== undefined ? opts.disableGl : false, //禁止使用webgl
            preserveDrawingBuffer: opts.preserveDrawingBuffer !== undefined ? opts.preserveDrawingBuffer : false, //canvas.toDataURL()创建缓存
            progressive: opts.progressive !== undefined ? opts.progressive : true, //启用的可以渐进加载
            throttled: opts.throttled !== undefined ? opts.throttled : true, //使用分段渐进加载，比如切分6段，加载2段，先不播放，那剩下就不做加载了。原来是默认是true，但我觉的渐进加载还是用false比较合适
            chunkSize: opts.chunkSize !== undefined ? opts.chunkSize : 1024 * 1024, //切割渐进加载数据大小 默认1024*1024 (1mb)
            decodeFirstFrame: opts.decodeFirstFrame !== undefined ? opts.decodeFirstFrame : true, //默认显示第一帧
            maxAudioLag: opts.maxAudioLag !== undefined ? opts.maxAudioLag : 0.25, //???未知
            videoBufferSize: opts.videoBufferSize !== undefined ? opts.videoBufferSize : (512 * 1024), //视频缓存区Default 512*1024 (512kb)
            audioBufferSize: opts.audioBufferSize !== undefined ? opts.audioBufferSize : (128 * 1024), //视频缓存区Default 512*1024 (512kb)
            duration: opts.duration || 60, //视频总时间长度
            autoLoad: opts.autoLoad !== undefined ? opts.autoLoad : false,

            onstartload: StartLoad, //加载完成
            onprogress: Progress, //加载进度
            onload: LoadEnd, //加载完成
            onframe: FrameUpDate, //帧触发
            onplayend: PlayEnd, //播放完成
            onplay: OnPlay, //触发播放
            onpause: OnPause, //触发播放
            oncanPlay: OnCanPlay, //触发可以播放
            oncanPlayProgress: OnCanPlayProgress, //触发可以播放
        });

        /**
         * 开始加载
         * @return {[type]} [description]
         */
        this.Load = function() {
            _Player.load();
        };
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
            // console.log('加载进度:' + progress);
            if (opts.progress) opts.progress(progress);
            _Self.ds({
                type: 'progress',
                progress: progress
            });
        }
        /**
         * 加载完成
         */
        function LoadEnd() {
            if (opts.LoadEnd) opts.LoadEnd();
            _Self.ds('loadEnd');
            // console.log('加载完成');
            // console.log('Duration: ' +_Player.currentTime+'/'+ _Player.duration+ ' seconds (' +_Player.currentFrame+'/'+ _Player.frameCount + ' frames)')
        }
        var _CanPlayBool = false;
        /**
         * 触发可以播放
         */
        function OnCanPlay() {
            // console.log('OnCanPlay');
            if (_CanPlayBool) return;
            _CanPlayBool = true;
            if (opts.oncanPlay) opts.oncanPlay();
            _Self.ds('canplay');
        }

        function OnCanPlayProgress(progress) {
            // console.log('OnCanPlayProgress:',progress);
            if (opts.oncanPlayProgress) opts.oncanPlayProgress(progress);
            _Self.ds({
                type: 'canPlayprogress',
                progress: progress
            });
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
            console.log('PlayEnd');
            if (opts.onplayend) opts.onplayend();
            _Self.ds('playEnd');
        }

        /**
         * 触发播放
         */
        function OnPlay() {
          if (opts.onplay) opts.onplay();
          // console.log('OnPlay');
          _Self.ds('play');
        }
        /**
         * 触发暂停
         */
        function OnPause() {
            if (opts.onpause) opts.onpause();
            // console.log('OnPause');
            _Self.ds('pause');
        }
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
         * @param {[Number]} seconds [跳转到自定秒]
         * @param {[Boolean]} playBool [需要开始播放]
         */
        this.SeekToTime = function(seconds, playBool) {
            // _Player.seek(seconds);
            _Player.currentTime = seconds;
            // _Player.update();
            // if(!this.isPlaying&&playBool)_Player.play();
            // if(this.isPlaying&&playBool===false)_Player.pause();
        };
    }

    return VidePlayerByMpegTS;
}));
