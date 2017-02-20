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
  【video类型】 Ds.media.VidePlayerByVideoTag=======================

   element  {[DOM]}         视频video标签
   canplay  {[Function]}    是否可以播放function

   append://需要添加到div
   autoplay://是否自动播放
   loop: //是否循环
   onload://加载完成 function
   upDate://帧触发 function
   progress: //加载进度 function
   playEnd://播放完成 function
   onplay:  //触发播放 function
   onpause: //触发暂停 function

  【canvas类型】 Ds.media.VidePlayerByMpeg==========================
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
 *  @extends
 * @example: 举例
 * [=================HTML===================]
    <div id="videoPanel">
       <video class="videoPlayer" style="position: absolute; width:100%;background-color:#fff;" x-webkit-airplay="false" webkit-playsinline playsinline preload='auto'>
     </video>
   </div>
 * [=================CSS===================]
    .IIV::-webkit-media-controls-play-button,
   .IIV::-webkit-media-controls-start-playback-button {
       opacity: 0;
       pointer-events: none;
       width: 5px;
   }
   #videoPanel video::-webkit-media-controls-start-playback-button {
       display: none;
   }
   #videoPanel canvas {
     position: absolute;
     left:0;top:0;
   }
  * [=================JS===================]
    //解决IOS自动全屏的问题
    //  var video = document.querySelector('video');
    makeVideoPlayableInline(video);
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  我发起Ds库目的，简化方便工作项目开发。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里代码很多也都来源至或参考网络开源开放代码，所以这个库也开源开放。更多希望团队成员把积累工作中常用的代码，加快自己开发效率。
 * @constructor
 **/
!(function() {
    window.Ds = window.Ds || {};
    window.Ds.media = window.Ds.media || {};
    window.Ds.media.VideoInteractivePlayer = VideoInteractivePlayer;

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
        // console.log(type);
        //初始化视频的交互使用播放器方式
        if (type == 'canvas') {
            _VideoPlayer = new Ds.media.VidePlayerByMpeg(url, opts);
            InitVideoEvent();
        } else {
            _VideoPlayer = new Ds.media.VidePlayerByVideoTag(url, opts);
            InitVideoEvent();
        }

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
	      * 例子
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

})();
