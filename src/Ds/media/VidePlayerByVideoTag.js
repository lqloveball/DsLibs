/**
 * @class Ds.media.VidePlayerByVideoTag
 * @classdesc:IOS下用户视频交互 使用video标签
 * @param {[type]} url  [description]
 * @param {[type]} opts [description]
   element  {[DOM]}         视频video标签
   canplay  {[Function]}    是否可以播放function

   append://需要添加到div
   autoplay://是否自动播放
   loop: //是否循环
   onload://加载完成 function
   upDate://帧触发 function
   onprogress: //加载进度 function
   onplayend://播放完成 function
   onplay:  //触发播放 function
   onpause: //触发播放 function
 *  @extends
 *  @example: 举例
 *  @todo 感觉这播放器还有点bug，需要项目实践Play进行修复
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
(function() {
    window.Ds = window.Ds || {};
    window.Ds.media = window.Ds.media || {};
    window.Ds.media.VidePlayerByVideoTag = VidePlayerByVideoTag;

    function VidePlayerByVideoTag(url, opts) {
        var _Self = this;
        //继承事件类
        Ds.Extend(_Self, new Ds.EventDispatcher());
        //判断微信兼容
        var _isWeixin = false;
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") _isWeixin = true;
        /**
         * Video标签元素
         * <div id="videoPanel">
  	            <video class="videoPlayer"
  	            style="position: absolute; width:100%;background-color:#fff;"
  	             x-webkit-airplay="false"
  	             webkit-playsinline playsinline preload='auto'>
  	            </video>
  	      </div>
         */
         var _VideoHtml = ['<video class="videoPlayer"',
             '  	            style="position: absolute; width:100%;background-color:#fff;"',
             '  	             x-webkit-airplay="false"',
             '  	             webkit-playsinline playsinline preload=\'meta\'>',
             '  	            </video>'
         ].join("");

         /**
          *  Video标签元素
          * @type {[type]}
          */
        var _VideoDOMElement;
        Object.defineProperty(this, "VideoDOMElement", {
            get: function() {
                return _VideoDOMElement;
            }
        });
        //配置里面没有视频标签就创建一个
        var _element=null;
        if(opts.element){
          _element=opts.element;
        }
        else if(opts.videoDom){
          _element=opts.videoDom;
        }
        _VideoDOMElement = _element || $(_VideoHtml)[0];
        // console.log('_VideoDOMElement:',_VideoDOMElement);
        //添加制定容器
        if (opts.append) $(opts.append).append(_VideoDOMElement);

        /**
         * 视频事件参考 http://www.w3school.com.cn/tags/html_ref_audio_video_dom.asp
         * @type {Array}
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
        //进行时间对象绑定
        // _VideoDomEventer = {};
        // for (var i = 0; i < _EventList.length; i++) {
        //     var _etype = _EventList[i];
        //     if (opts[_etype] && typeof(opts[_etype]) == 'function') _VideoDomEventer[_etype] = opts[_etype];
        // }
        // for (var i = 0; i < _EventList.length; i++) {
        //     var _etype = _EventList[i];
        //     _VideoDOMElement.addEventListener(_etype, function(e) {
        //         if (_VideoDomEventer && _VideoDomEventer[e.type]) _VideoDomEventer[e.type]();
        //     });
        // }
        if(url!==undefined&&url!==null){
          _VideoDOMElement.autoplay = !!opts.autoplay;
          _VideoDOMElement.loop = !!opts.loop;
          _VideoDOMElement.src = url;
          _VideoDOMElement.load();
        }else{
          console.log('不创建video标签');
          _CanPlayBool=true;
        }

        /**
        //注意本来这里想解决微信自动播放视频功能，现在发现这功能考虑严重造成bug。
        function InitVideoLoad() {
            // $('#debug').html('InitVideoLoad')
            // if(!_VideoDOMElement.autoplay)
            _VideoDOMElement.play();
            _VideoDOMElement.volume = 0;
            _VideoDOMElement.pause();
        }

        function VideoInBrowserHandler() {
            //如果这个视频在是后创建交互视频对象，那就不能通过WeixinJSBridgeReady来触发视频播放 就不会有canplay，需要通过第一次touchstart；
            InitVideoLoad();
            document.body.removeEventListener('touchstart', VideoInBrowserHandler);
        }
        if (_isWeixin) {
            // $('#debug').html('是微信')
            if (typeof WeixinJSBridge == "undefined") {
                // $('#debug').html('WeixinJSBridge undefined')
                document.addEventListener("WeixinJSBridgeReady", function func() {
                    // $('#debug').html('WeixinJSBridgeReady')
                    // InitVideoLoad();
                    _VideoDOMElement.play();
                    _VideoDOMElement.volume = 0;
                    _VideoDOMElement.pause();
                }, false);
            } else {
                //如果这个视频在是后创建交互视频对象，那就不能通过WeixinJSBridgeReady来触发视频播放 就不会有canplay，需要通过第一次touchstart；
                // $('#debug').html('WeixinJSBridge OK'+WeixinJSBridge)
                document.body.addEventListener('touchstart', VideoInBrowserHandler);
            }
        } else {
            // $('#debug').html('非微信')
            InitVideoLoad();
        }
        */
        //进行预加载判断
        // _VideoDOMElement.addEventListener("canplaythrough", Canplaythrough);
        // _VideoDOMElement.addEventListener("canplay", Canplay);
        _VideoDOMElement.addEventListener("progress", function(e) {
            Progress(e);
        });
        _VideoDOMElement.addEventListener("timeupdate", function() {
            FrameUpDate();
        });
        _VideoDOMElement.addEventListener("play", function() {
            OnPlay();
        });
        _VideoDOMElement.addEventListener("pause", function() {
            OnPause();
        });
        _VideoDOMElement.addEventListener("ended", function() {
            PlayEnd();
        });


        // var _CanPlayBool = false;
        // function Canplay() {
        //     // log('Canplay');
        //     if (_CanPlayBool) return;
        //     //解决IOS自动全屏的问题
        //     //makeVideoPlayableInline(_VideoDOMElement);
        // }

        /**
         * 视频准备就绪可以播放
         */
        // function Canplaythrough() {
        //     if (_CanPlayBool) return;
        //     //解决IOS自动全屏的问题
        //     makeVideoPlayableInline(_VideoDOMElement);
        //     _CanPlayBool = true;
        //     // $('#debug').html('Canplaythrough');
        //     if (_VideoDOMElement.autoplay) {
        //         _VideoDOMElement.currentTime = 0;
        //         _VideoDOMElement.play();
        //     } else {
        //         _VideoDOMElement.currentTime = 0;
        //         _VideoDOMElement.pause();
        //     }
        //     _VideoDOMElement.removeEventListener("canplay", Canplay);
        //     _VideoDOMElement.removeEventListener("canplaythrough", Canplaythrough);
        //     _VideoDOMElement.volume = 1;
        //
        //     if (opts.canplay) opts.canplay();
        //     _Self.ds('canplay');
        // }
        /**
         * 当前时间
         * @type {[Number]}
         */
        Object.defineProperty(this, "CurrentTime", {
            get: function() {
                return _VideoDOMElement.currentTime;
            }
        });
        /**
         * 时间长度
         * @type {[Number]}
         */
        Object.defineProperty(this, "Duration", {
            get: function() {
                return _VideoDOMElement.duration;
            }
        });

        /**
         * 声音大小
         * @type {[type]}
         */
        Object.defineProperty(this, "Volume", {
            get: function() {
                return _VideoDOMElement.volume;
            },
            set: function(value) {
              _VideoDOMElement.volume=value;
            }
        });

        /**
         * 是否禁音
         * @type {[type]}
         */
        Object.defineProperty(this, "Muted", {
            get: function() {
                return _VideoDOMElement.muted;
            },
            set: function(value) {
              _VideoDOMElement.muted=value;
            }
        });


        //添加制定位置
        // if (opts.append) $(opts.append).append(_Canvas);
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

            if (opts.loaeEnd) opts.loaeEnd();
            _Self.ds('loadEnd');
            // console.log('加载完成')
            // console.log('time: ' +_VideoDOMElement.currentTime+'/'+ _VideoDOMElement.duration )
        }
        /**
         * 帧渲染
         */
        function FrameUpDate() {
            if (opts.upDate) opts.upDate();
            _Self.ds('upDate');
            // console.log('time:' + (_VideoDOMElement.currentTime) + '/' + _VideoDOMElement.duration);
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
            // console.log('OnPlay',_Self.Playing);
            _VideoDOMElement.play();
            _Self.ds('play');
        }
        /**
         * 触发暂停
         */
        function OnPause() {
            // console.log('OnPause',_Self.Playing);
            _VideoDOMElement.pause();
            _Self.ds('pause');
        }
        /**
         * 是否播放中 Playing Get Set 实现
         * @type {Boolean}
         */
        var _Playing = false;
        Object.defineProperty(this, "Playing", {
            get: function() {
                return !_VideoDOMElement.paused;
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
            // if (!_CanPlayBool) return;
            // _Playing = true;
            _VideoDOMElement.play();
        };

        /**
         * 暂停
         */
        this.Pause = function() {
            // if (!_CanPlayBool) return;
            // _Playing = false;
            _VideoDOMElement.pause();
        };
        /**
         * 跳转到制定时间
         * @param {[type]} seconds [description]
         */
        this.SeekToTime = function(seconds) {
            _VideoDOMElement.currentTime = seconds;
            // _VideoDOMElement.play();
        };

    }

})();
