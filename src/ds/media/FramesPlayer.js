import EventDispatcher from '../core/EventDispatcher';
import {getDefault} from '../utils/Mixin';

/**
 *  序列帧播放器，带交互触发器
 *  @class
 *  @memberof ds.media
 */
class FramesPlayer extends EventDispatcher {

    /**
     *
     * @param url
     * @param opts
     * @param {number} opts.fps=12  刷新率
     * @param {number} opts.start=0  序列帧开始值
     * @param {number} opts.end=0  序列帧结束值
     * @param {number} opts.formatLength=3  格式化补0位，默认是3位。
     * @param {string} opts.prefixes=''  图像序列前缀
     * @param {string} opts.suffix='.jpg'  图像序列后缀
     * @param {boolean} opts.drawType=true 是否帧触发渲染
     * @param {number} opts.bufferedTime=2 缓冲加载播放  默认2秒才能播放
     * @param {boolean} opts.loop=false 是否可以循环播放
     * @param {boolean} opts.autoload=false 是否自动加载
     * @param {boolean} opts.autoplay=false 是否自动播放
     * @param {number} opts.width=640 渲染器宽
     * @param {number} opts.height=1040 渲染器高
     * @param {boolean} opts.hasAudio `mpg` `fs`类型播放器是否需要音频
     * @param {string} opts.audio 对应音频地址 等同opts.mp3
     * @param {string} opts.mp3 对应音频地址 等同opts.audio
     * @param {array} opts.images 已经加载完成图片序列帧 如果使用已经加载完成图片序列，那就会直接显示加载完成
     *
     * @param {HTMLElement} opts.el=undefined  捆绑dom元素
     * @param {HTMLElement|string} opts.append=undefined  添加到dom容器节点
     * @param {object} opts.css=undefined  播放器样式
     *
     * @param {function} opts.onload  加载完成
     * @param {function} opts.onprogress  加载进度
     * @param {function} opts.oncanPlay  第一个画面可见 可以播放时候
     * @param {function} opts.onupdate  播放刷新
     * @param {function} opts.onplay  开始播放
     * @param {function} opts.onpause 播放暂停
     * @param {function} opts.onplayend  播放完成
     */
    constructor(url, opts) {
        super();

        opts = opts || {};

        let _self = this;

        var _url = url;
        if (_url.lastIndexOf('/') !== _url.length - 1) _url = _url + '/';
        //加载图片路径
        this._path = _url;

        let _hasAudio = getDefault(opts.hasAudio, false);
        if (_hasAudio) {
            if (!opts.mp3 && !opts.audio) {
                let _mp3Url = _url.slice(0, _url.lastIndexOf('/')) + '.mp3';
                opts.mp3 = _mp3Url;
            }
        }

        //声音是否暂停
        this._audioPause = true;
        //是否暂停
        this._pause = true;
        //是否可以开始播放
        this._canPlayBool = false;

        //刷新率
        this._fps = getDefault(opts.fps, 12);
        //记录刷新时间
        this._fpsTime = 1000 / this._fps;

        //前缀
        this._prefixes = getDefault(opts.prefixes, '');
        //后缀
        this._suffix = getDefault(opts.suffix, '.jpg');
        //是否缓冲中
        // this._buffered = true;
        //图片是否加载完成
        this._imagesLoadEnd = false;
        //当前缓冲到时间点
        this._bufferTime = 0;
        //全部缓冲完成总时间
        this._bufferAllTime = 0;
        //缓冲暂停时间
        this._pauseTime;
        //缓冲播放时间
        this._playTime;
        //渲染方式 是否依靠帧渲染
        this._drawByFrame = getDefault(opts.drawType, true);

        //是否已经开始加载
        this._isStarload = false;

        //图片列表
        this._imagesList = [];
        //加载第几帧
        this._imagesLoadIndex = 0;
        //当前帧
        this._currentFrame = 0;
        //当前时间 提供时间渲染时候使用
        this._currentTime = 0;
        //总时间  提供时间渲染时候使用
        this._totalTime = 0;

        //判断是否是在目前是缓冲状态
        this._isBufferPlay = true;
        //缓冲多少秒才开始播放
        this._bufferedSpeedTime = getDefault(opts.bufferedTime, 2);
        //缓冲完成
        this._bufferedEndToPlay = false;

        //是否循环
        this._loop = getDefault(opts.loop, false);

        //记录视频是否播放完成
        this._videoPlayEnd = false;

        this._videoCuePointList = []

        //是否自动加载
        this._autoload = getDefault(opts.autoload, false);
        //是否自动播放
        let _autoplay = getDefault(opts.autoplay, false);
        this._autoplay = _autoplay;

        let _canvas;
        if (opts.el !== undefined) _canvas = $(opts.el)[0];
        else _canvas = document.createElement('canvas');
        this._canvas = _canvas;

        if (opts.append) $(opts.append).append(_canvas);

        let _css;
        if (opts.css) _css = opts.css;
        else {
            _css = {
                position: 'absolute',
                left: 0,
                top: 0,
                width: opts.width || 640,
                height: opts.height || 1040,
            }
        }
        $(_canvas).css(opts.css);

        if (opts.width && opts.height) this._resizeCavans(opts.width, opts.height);
        else if (_css.width && _css.height) this._resizeCavans(_css.width, _css.height);
        else this._resizeCavans(640, 1040);

        this._cxt = _canvas.getContext("2d");

        //音频对象
        this._audio = null;

        let _audio = null;
        let _audioUrl = getDefault(opts.audio, '');
        _audioUrl = getDefault(opts.mp3, _audioUrl);

        if (_audioUrl !== '') {

            console.log('_audioUrl:', _audioUrl);
            _audio = new Audio();
            this._audio = _audio;
            _audio.autoplay = false;
            _audio.src = _audioUrl;
            _audio.load();
            //客户端开始请求数据
            _audio.addEventListener('loadstart', function () {
                console.log('_audio loadstart');
            });
            //客户端开始请求数据
            _audio.addEventListener('abort', function () {
                console.log('_audio abort');
            });
            //等待数据，并非错误
            _audio.addEventListener('waiting', function () {
            });
            //播放结束
            _audio.addEventListener('ended', function () {
                _self._audioPause = true;
                _self._pause = true;
            });
            //加载完成 其实不是
            _audio.addEventListener('loadedmetadata', function () {
            });
            //客户端正在请求数据
            _audio.addEventListener('progress', function () {
            });
            //延迟下载
            _audio.addEventListener('suspend', function () {
            });
            //play()和autoplay开始播放时触发
            _audio.addEventListener('play', function () {
                _self._audioPause = false;
                _self._pause = false;
                _self._videoPlayEvent();
                _self.ds('play');

            });
            //pause()触发
            _audio.addEventListener('pause', function () {
                _self._audioPause = true;
                _self._pause = true;
                _self._videoPauseEvent();
                _self.ds('pause');

            });
            //可以播放
            _audio.addEventListener('canplaythrough', function () {
                _self._audioCanplay();
            });
            _audio.addEventListener('error', function () {
                _self._audioError();
            });

            //更加配置判断是否通过touch触发声音播放
            if (opts.hasTouchstart) document.body.addEventListener('touchstart', _audioInBrowserHandler);


        }

        function _audioInBrowserHandler() {
            // console.log('_audioInBrowserHandler');
            document.body.removeEventListener('touchstart', _audioInBrowserHandler);
            _self._audioOnDocumentTouchstart();
        }

        this._config = opts;


        this.on('play', function () {
            if (this._config.onplay) this._config.onplay();
        }, this);

        this.on('pause', function () {
            if (this._config.onpause) this._config.onpause();
        }, this);

        this._fpsTimer = setTimeout(() => {
            this._update();
        }, this._fpsTime);


        this._listStart = getDefault(opts.start, 0);
        this._listEnd = getDefault(opts.end, 0);
        this._formatLength = getDefault(opts.formatLength, 3);
        if (!opts.images && this._listEnd <= 0) {
            console.error('序列帧播放器没设置结束帧数');
        }

        if (opts.images) {

        }
        else {
            this.initImageList();
        }

    }

    initImageList() {
        console.log('initImageList:', this._listStart, this._listEnd);
        let _self = this;
        this._imagesList = [];
        let _img;
        for (let i = this._listStart; i <= this._listEnd; i++) {
            _img = new Image();
            _img.loaded = false;
            _img.url = _getAbsoluteUrl(this._formatUrl(i));
            // console.log('img.url:',_img.url);
            this._imagesList.push(_img);
        }
        _img = new Image();
        _img.src = this._imagesList[0].url;

        this._bufferAllTime = this._imagesList.length / this._fps;

        this._totalTime = this._imagesList.length / this._fps;

        this._imagesLoadIndex = -1;


        _img.onload = function () {
            _self._cxt.drawImage(_img, 0, 0, _self._canvas.width, _self._canvas.height);
            if (_self._config.oncanPlay) _self._config.oncanPlay();
        };

        if (this._autoload && !this._audio) {
            this.load();
            if (this._autoplay) this.play();
        }


    }

    /**
     * 格式
     * @param value
     * @return {string}
     * @private
     */
    _formatUrl(value) {
        let _path = this._path;
        var _url = '' + value;
        let _fill = this._formatLength - _url.length;
        if (_fill === 4) _url = '0000' + _url;
        if (_fill === 3) _url = '000' + _url;
        if (_fill === 2) _url = '00' + _url;
        if (_fill === 1) _url = '0' + _url;
        _url = _path + this._prefixes + _url + this._suffix;
        return _url;
    }

    /**
     * 开始加载
     */
    load() {
        if (this._isStarload) return;
        this._isStarload = true;
        console.warn('序列帧开始加载');
        this._loadImages();
    };

    _loadImages() {

        let _self = this;

        this._imagesLoadIndex += 1;
        let _index = this._imagesLoadIndex;
        let _imagesList = this._imagesList;

        // console.log(_index, _imagesList);
        let _progress = _index / _imagesList.length;
        if (this._config.onprogress) this._config.onprogress(_progress);
        /**
         * 加载进度
         * @event ds.media.FramesPlayer#progress
         */
        this.ds({type: 'progress', progress: _progress});
        // console.log('progress:', _progress);

        if (_index >= _imagesList.length) {
            this._imagesLoadIndex = _imagesList.length - 1;
            this._videoLoadEndEvent();
            // console.log('complete');
            this._imagesLoadEnd = true;
            if (this._config.onload) this._config.onload();
            /**
             * 加载完成
             * @event ds.media.FramesPlayer#loadEnd
             */
            _self.ds('loadEnd');
            return;
        }

        let _img = _imagesList[_index];
        _img.src = _img.url;
        _img.onload = function () {
            _self._videoBuffereEvent();
            _self._loadImages();
            _img.loaded = true;
        };
        _img.onerror = function () {
            _self._videoBuffereEvent();
            _self._loadImages();
        };

    }

    _update() {
        // console.log('_update');
        clearTimeout(this._fpsTimer);

        this._drawUpdate();

        this._fpsTimer = setTimeout(() => {
            this._update();
        }, this._fpsTime);

    }

    _drawUpdate() {

        if (this._audio) {

            //缓冲状态
            if (this._isBufferPlay) {
                //0
                if (this._audio.currentTime < this._bufferTime - this._bufferedSpeedTime) {
                    //缓冲时间已经有余退出缓冲
                    console.log('缓冲时间已经有余退出缓冲1');
                    this._videoBuffereOutEvent();
                }
                else if (this._bufferTime >= this.duration || this._bufferTime >= this._bufferAllTime) {
                    console.log('缓冲时间已经有余退出缓冲2');
                    this._videoBuffereOutEvent();
                }
            }
            if (!this._isBufferPlay) {
                //非缓存状态下 播放视频的帧不足，需要进入到缓冲部分
                if (this._bufferTime >= this._bufferAllTime) {

                } else if (this._audio.currentTime >= this._bufferTime) {
                    this._videoBuffereInEvent();
                    //缓冲时候声音暂停，
                    this._audio.pause();
                    //同时视频也要暂停
                    this._pause = true;
                    this._bufferedEndToPlay = true;
                    this.ds('pause');
                }
            }
            this._currentFrame = this._audio.currentTime * this._fps >> 0;
            if (this._currentFrame >= this.totalFrames - 1) this._currentFrame = this.totalFrames - 1;
            if (this._currentFrame <= 0) this._currentFrame = 0;
            this._currentTime = this._audio.currentTime;

        }
        else {

            if (!this._pause) {
                //使用帧渲染
                if (this._drawByFrame) {
                    this._currentFrame += 1;
                    if (this._currentFrame >= this.totalFrames - 1) this._currentFrame = this.totalFrames - 1;
                    this._currentTime = this._currentFrame / this._fps;
                    if (this._currentTime >= this._totalTime) this._currentTime = this._totalTime;
                }
                //使用时间进行渲染
                else {
                    let _time = (new Date().getTime() - this._playTime) / 1000;
                    this._currentTime = this._currentTime + _time;
                    if (this._currentTime >= this._totalTime) {
                        this._currentTime = this._totalTime;
                        this._currentFrame = this.totalFrames - 1;
                    } else {
                        this._currentFrame = this._currentTime * fps >> 0;
                    }
                }
            }

            //缓冲状态
            if (this._isBufferPlay) {
                //0
                if (this._currentTime < this._bufferTime - this._bufferedSpeedTime) {
                    //缓冲时间已经有余退出缓冲
                    this._videoBuffereOutEvent();
                }
                else if (this._bufferTime >= this._bufferAllTime) {
                    this._videoBuffereOutEvent();
                }
            }
            if (!this._isBufferPlay) {
                //非缓存状态下 播放视频的帧不足，需要进入到缓冲部分
                if (this._bufferTime >= this._bufferedSpeedTime) {

                } else if (this._currentTime >= this._bufferTime) {
                    this._videoBuffereInEvent();
                    //同时视频也要暂停
                    this._pause = true;
                    this._bufferedEndToPlay = true;
                    this.ds('pause');
                }
            }


        }
        //渲染
        if (!this._pause) {
            // console.log(drawNum);
            if (this._currentFrame >= this.totalFrames - 1) {
                this._currentFrame = this.totalFrames - 1;
                this.pause();
            }
            if (this._currentFrame <= 0) this._currentFrame = 0;
            let _img = this._imagesList[this._currentFrame];
            if (_img && _img.loaded) {
                this._cxt.clearRect(0, 0, this._canvas.width, this._canvas.height);
                this._cxt.drawImage(_img, 0, 0, this._canvas.width, this._canvas.height);
            }

            if (this._config.update) this._config.update();
            /**
             * 刷新事件
             * @event ds.media.FramesPlayer#update
             */
            this.ds('update');

            this._timeUpDate();

            // console.log(drawNum,imagesList.length)
            if (this._currentFrame >= this._imagesList.length - 1) {
                if (this._videoPlayEnd) return;
                this._videoPlayEnd = true;
                if (this._config.onplayend) this._config.onplayend();
                this.ds('playEnd');
                if (this._loop) this.seekToTime(0, true);
            }
        }


    }


    /**
     * 视频播放
     * @private
     */
    _videoPlayEvent() {

    }

    /**
     * 视频暂停
     * @private
     */
    _videoPauseEvent() {

    }

    /**
     * 视频加载完成
     * @private
     */
    _videoLoadEndEvent() {
        this._bufferTime = this._bufferAllTime;
        this._imagesLoadEnd = true;
    }

    /**
     * 加载缓存
     * @private
     */
    _videoBuffereEvent() {
        this._bufferTime = (this._imagesLoadIndex) / this._fps;
        this._imagesLoadEnd = false;
    }

    _videoBuffereInEvent() {
        this._pauseTime = new Date().getTime();
        this._pause = true;
        this._isBufferPlay = true;
    }

    _videoBuffereOutEvent() {
        this._isBufferPlay = false;
        if (this._bufferedEndToPlay) {
            this._bufferedEndToPlay = false;
            this._pause = false;
            if (this._audio && this._audio.paused) this._audio.play();
            this._playTime = new Date().getTime();

            this.ds('play');
        }
        this.ds('canplaythrough');
    }

    _audioCanplay() {
        // console.log('_audioCanplay _autoplay:', this._autoplay);
        if (this._autoload) this.load();
        if (this._autoplay) this.play();
    }

    _audioError() {
        console.warn('声音加载错误');
    }

    _audioOnDocumentTouchstart() {
        if (this._audio) {
            this._audio.play();
            this._audio.pause();
        }
    }

    /**
     * 设置画布大小
     * @param width
     * @param height
     * @private
     */
    _resizeCavans(width, height) {

        this._canvas.setAttribute('width', width);
        this._canvas.setAttribute('height', height);
        $(this._canvas).css({
            "width": width + 'px',
            "height": height + 'px'
        });
    }

    /**
     * 互动时间点监听
     * @private
     */
    _timeUpDate() {

        let _currentTime = 0;
        _currentTime = this.currentTime;
        let _videoCuePointList = this._videoCuePointList;

        for (let i = 0; i < _videoCuePointList.length; i++) {

            let _td = _videoCuePointList[i];

            if (_td.time && _currentTime >= _td.time && !_td.bool) {

                _td.bool = true;
                _td.runNum += 1;
                let _eventData = {
                    type: 'cuePoint',
                    data: _td,
                    time: _currentTime
                };

                if (_td.fun) _td.fun(_eventData);
                /**
                 * 交互提示点
                 * @event ds.media.VideoInteractivePlayer#cuePoint
                 * @property {object} data - 交互时间点数据
                 * @property {number} time - 当前触发时间
                 */
                this.ds(_eventData);
            }

        }

    }

    /**
     * 添加交互的时间节点
     * @param {object} cd 时间节点事件数据设置
     * @param {string} cd.name 这个时间点的名称
     * @param {number} cd.time 时间,秒数
     * @param {function} cd.fun  时间点执行的时间函数
     * @return {object} cd 设置时间节点数据 cd.runNum执行多少次 cd.bool是否被执行过
     *
     */
    addCuePoint(cd) {
        cd = cd || {};
        if (!cd.time) return;
        if (!cd.name) cd.name = 'time_' + cd.time;
        cd.runNum = 0;
        cd.bool = false;
        this._videoCuePointList.push(cd);
    }

    /**
     * 重置所有时间交互点
     */
    resetCuePoints() {

        let _videoCuePointList = this._videoCuePointList;
        for (let i = 0; i < _videoCuePointList.length; i++) {
            let _pd = _videoCuePointList[i];
            _pd.runNum = 0;
            _pd.bool = false;
        }

    }

    /**
     * 重置制定时间交互点
     * @param {string} name 需要重置指定时间点名称
     */
    resetCuePointByName(name) {

        let _videoCuePointList = this._videoCuePointList;
        for (let i = 0; i < _videoCuePointList.length; i++) {
            let _pd = _videoCuePointList[i];
            if (_pd.name === name) {
                _pd.bool = false;
                _pd.runNum = 0;
            }
        }
    }

    /**
     * 清空清除所有的交互节点
     */
    clearCuePoints() {
        this._videoCuePointList = [];
    }

    /**
     * 播放
     */
    play() {
        if (!this._isStarload) {
            console.error('序列图片还未开始执行加载');
            return;
        }
        this._totalTime = this._imagesList.length / this._fps;
        //设置当前是播放状态
        this._pause = false;
        //退出缓冲判断
        this._bufferedEndToPlay = false;
        this._videoBuffereOutEvent();
        if (this._audio) this._audio.play();
        this._playTime = new Date().getTime();
        /**
         * 视频播放
         * @event ds.media.FramesPlayer#play
         */
        this.ds('play');
    }

    /**
     * 暂停
     */
    pause() {

        this._totalTime = this._imagesList.length / this._fps;
        //设置当前是播放状态
        this._pause = true;
        //退出缓冲判断
        this._bufferedEndToPlay = false;
        this._videoBuffereOutEvent();
        if (this._audio) this._audio.pause();
        this._pauseTime = new Date().getTime();
        /**
         * 视频暂停
         * @event ds.media.FramesPlayer#pause
         */
        this.ds('pause');
    }

    /**
     * 跳转到制定帧,如果有音频会转换成时间跳转
     * @param {number} value 帧数
     * @param {boolean} bool 设置是否播放true播放  false暂停  不设置按当前状态
     */
    seekToFrame(value, bool) {

        this._totalTime = this._imagesList.length / this._fps;

        if (value >= this.totalFrames - 1) value = this.totalFrames - 1;
        if (value <= 0) value = 0;

        let _time = value / this._fps;
        if (this._audio) {
            this.seekToTime(_time, bool)
        }
        else {

            if (bool !== undefined) {
                if (bool) this.play();
                else this.pause();
            }

            if (this._drawByFrame) {
                this._currentFrame = value - 1;
            } else {
                this._playTime = new Date().getTime();
                this._currentTime = _time;
            }
            this._update();
        }

    };

    /**
     * 设置播放时间
     * @param {number} value  时间 秒数
     * @param {boolean} bool 设置是否播放true播放  false暂停  不设置按当前状态
     */
    seekToTime(value, bool) {
        if (bool !== undefined) {
            if (bool) this.play();
            else this.pause();
        }
        this.currentTime = value;
    }

    /**
     * 设置获取是否循环播放
     * @param {boolean} value
     */
    set loop(value) {
        this._loop = value;
    }

    get loop() {
        return this._loop;
    }

    /**
     * 设置获取当前时间
     *  @param {number} value
     */
    set currentTime(value) {
        this._totalTime = this._imagesList.length / this._fps;
        if (value >= this._totalTime) {
            value = this._totalTime;
        } else {
            this._videoPlayEnd = false;
        }
        this._playTime = new Date().getTime();
        this._currentTime = value;
        if (this._audio) this._audio.currentTime = value;
        if (this._drawByFrame) {
            this._currentFrame = ((this._currentTime * this._fps) >> 0) - 1;
            // log(currentTime,drawNum);
            if (this._currentFrame >= this.totalFrames - 1) this._currentFrame = this.totalFrames - 1;
            if (this._currentFrame <= -1) this._currentFrame = -1;
        }
        this._update();
    }

    get currentTime() {
        return this._currentFrame / this._fps;
    }

    /**
     * 时间长度
     */
    get duration() {
        return this._imagesList.length / this._fps;
    }

    /**
     * 设置获取是否循环播放
     * @param {boolean} value
     */
    set loop(value) {
        if (this._loop === value) return;
        this._loop = value
    }

    get loop() {
        return this._loop;
    }

    /**
     * 设置获取声音大小
     * @param {number} value
     */
    set volume(value) {
        if (this._audio) this._audio.volume = value;
    }

    get volume() {
        return this._audio ? this._audio.volume : 0;
    }


    /**
     * 设置获取是否禁音
     * @param {boolean} value
     */
    set muted(value) {
        this._audio.muted = value;
    }

    get muted() {
        return this._audio ? this._audio.muted : true;
    }

    /**
     * 总帧数
     */
    get totalFrames() {
        return this._imagesList.length;
    }

    /**
     * 当前帧
     */
    get currentFrame() {
        return this._currentFrame;
    }

    /**
     * 设置获取播放器播放状态
     */
    get playing() {
        return !this._pause;
    }

    set playing(bool) {
        if (bool) this.play();
        else this.pause();
    }

    /**
     * 播放声音对象
     * @return {AudioElement}
     */
    get audio() {
        return this._audio;
    }

    /**
     * 视频播放器呈现dom元素，cavnas
     * @return {CavansElement}
     */
    get el() {
        return this._canvas;
    }

    /**
     * 帧刷新率
     * @return {Number}
     */
    get fps() {
        return this._fps;
    }

    /**
     * 是否加载完成所有序列帧
     * @return {boolean}
     */
    get isLoadEnd() {
        return this._imagesLoadEnd;
    }

    /**
     * 是否执行开始加载
     * @return {boolean}
     */
    get isStarload() {
        return this._isStarload;
    }

    /**
     * 缓存进度
     * @return {number}
     */
    get bufferProgress() {
        return this._bufferTime / this._bufferAllTime;
    }

    /**
     * 视频交互提示点列表
     * @return {array}
     */
    get videoCuePointList() {
        return this._videoCuePointList.concat();
    }
}

let _urldom = document.createElement('a');

function _getAbsoluteUrl(url) {
    if (url.indexOf("http:") >= 0 || url.indexOf("https:") >= 0) return url;
    _urldom.href = url;
    url = _urldom.href;
    return url;
}

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
ds.media = ds.media || {};
ds.media.FramesPlayer = FramesPlayer;

export default FramesPlayer;