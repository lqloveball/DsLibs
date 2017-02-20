/**
 * @class Ds.media.VidePlayerByMpeg
 * @classdesc:视频播放器 基于对mpeg视频格式解码 渲染到canvas上
 * 基于对mpeg视频格式解码 ，需要引用 src/libs/media/jsmpg.js
 * 视频压缩工具
 * ffmpeg -i in.mp4 -f mpeg1video -vf "crop=iw-mod(iw\,2):ih-mod(ih\,2)" -b 0 out.mpg
 * [down http://www.ffmpeg.org/]
 * @param {[type]} url  [description]
 * @param {[type]} opts [description]
     audio://声音地址
     loadByAudioCanplay://是否在声音允许播放就开始进行加载准备解码播放
     progressShow: //默认加载进度表现
     seekable: //是否计算头文件 计算出时间 并且可以进行跳帧控制
     duration:  //避免头文件未计算完成，得不到总时间
     progressive: //缓冲加载播放
     progressiveThrottled: //缓冲加载播放


     append://需要添加到div
     autoplay://是否自动播放
     loop: //是否循环
     onload://加载完成 function
     upDate://帧触发 function
     progress: //加载进度 function
     playEnd://播放完成 function
     onplay:  //触发播放 function
     onpause: //触发暂停 function
     canplay://触发可以开始播放
 *  @extends
 * @example: 举例
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  我发起Ds库目的，简化方便工作项目开发。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里代码很多也都来源至或参考网络开源开放代码，所以这个库也开源开放。更多希望团队成员把积累工作中常用的代码，加快自己开发效率。
 * @constructor
 **/

!(function() {

    window.Ds = window.Ds || {};
    window.Ds.media = window.Ds.media || {};
    window.Ds.media.VidePlayerByMpeg = VidePlayerByMpeg;

    function VidePlayerByMpeg(url, opts) {
        var _Self = this;

        //继承事件类
        Ds.Extend(_Self, new Ds.EventDispatcher());
        //是否缓存加载
        var _Progressive = (opts.progressive!==undefined)?opts.progressive:true;
        // console.log(opts.progressive,_Progressive);
        //是否在声音允许播放就开始进行加载准备解码播放
        var _LoadByAudioCanplay = true;//opts.loadByAudioCanplay == undefined ? true : false;
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
            autoload: true,
            autoplay: !!opts.autoplay, //是否自动播放
            progressShow: !!opts.progressShow, //默认加载进度
            loop: !!opts.loop, //是否循环
            seekable: opts.seekable === undefined ? true : false, //是否计算头文件 计算出时间
            duration: opts.duration || 60, //避免头文件未计算完成，得不到总时间
            progressive: _Progressive, //缓冲加载播放
            progressiveThrottled: _Progressive, //缓冲加载播放
            onload: LoaeEnd, //加载完成
            ondecodeframe: FrameUpDate, //帧触发
            onprogress: Progress, //加载进度
            onfinished: PlayEnd, //播放完成
            onplay: OnPlay, //触发播放
            onpause: OnPause, //触发播放
            canPlay: OnCanPlay, //触发可以播放
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
        } else {
            _Audio = new Audio();
            _Audio.autoplay = false;
            _Audio.src = _AudioUrl;
            _Audio.load();
            //客户端开始请求数据
            _Audio.addEventListener('loadstart', function() {
                console.log('loadstart');
            });
            //客户端开始请求数据
            _Audio.addEventListener('abort', function() {
                console.log('abort');
            });
            _Audio.addEventListener('waiting', function() {}); //等待数据，并非错误
            _Audio.addEventListener('ended', function() {}); //播放结束
            _Audio.addEventListener('loadedmetadata', function() {
            }); //加载完成 其实不是
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
        }
        var _LoadBool = false;
        //可以播放
        function AudioCanplay() {
            console.log('AudioCanplay',_Player.progressive);
            if (_LoadBool) return;
            _LoadBool = true;
            if (_Player.progressive) {
                _Player.beginProgressiveLoad(url);
            } else {
                _Player.load(url);
            }
        }

        //声音错误
        function AudioError() {
            console.warn('声音加载错误');
        }

        //没有声音情况直接创建视频播放器
        if (!_Audio) {
            if (_Player.progressive) {
                _Player.beginProgressiveLoad(url);
            } else {
                _Player.load(url);
            }
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
         * 当前帧数
         * @type {[Number]}
         */
        Object.defineProperty(this, "CurrentFrame", {
            get: function() {
                return _Player.currentFrame;
            }
        });

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
        function LoaeEnd() {
            if (opts.loaeEnd) opts.loaeEnd();
            _Self.ds('loadEnd');
            console.log('加载完成');
            // console.log('Duration: ' +_Player.currentTime+'/'+ _Player.duration+ ' seconds (' +_Player.currentFrame+'/'+ _Player.frameCount + ' frames)')
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
            if (opts.playEnd) opts.playEnd();
            _Playing = false;
            if (_Audio) _Audio.pause();
            _Self.ds('playEnd');
        }

        /**
         * 触发播放
         */
        function OnPlay() {
            // _Playing = true;
            if (_Audio) {
                // if(!_Player.canPlayThrough)return;
                if (_Player && _Player.currentTime) _Audio.currentTime = _Player.currentTime;
                _Audio.play();
            }
            _Self.ds('play');
        }
        /**
         * 触发暂停
         */
        function OnPause() {
            // _Playing = false;
            if (_Audio) _Audio.pause();
            _Self.ds('pause');
        }
        var _CanPlayBool=false;
        function OnCanPlay(){
          if(_CanPlayBool)return;
          _CanPlayBool=true;
          if (opts.canplay) opts.canplay();
          _Self.ds('canplay');
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
            if(!_CanPlayBool)return;
            // _Playing = true;
            _Player.play();
            // if (_Audio) {
            //     _Audio.currentTime = _Player.currentTime
            //     _Audio.play();
            // }
        };

        /**
         * 暂停
         */
        this.Pause = function() {
            if(!_CanPlayBool)return;
            // _Playing = false;
            _Player.pause();
            // if (_Audio) _Audio.pause();
        };
        /**
         * 跳转到制定时间
         * @param {[type]} seconds [description]
         */
        this.SeekToTime = function(seconds) {
            _Player.seekToTime(seconds);
        };

        /**
         * 跳转到制定帧
         * @param {[type]} frame [description]
         */
        this.SeekToFrame = function(frame) {
            _Player.seekToFrame(frame)
        };



    }

})()
