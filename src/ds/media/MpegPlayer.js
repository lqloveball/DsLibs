import EventDispatcher from '../core/EventDispatcher';
import jsmpeg from 'libs/media/jsmpg.js';

/**
 *  视频交互类
 *
 *  #### [安卓版本对video标签支持不好，但又支持webgl的项目可以使用这个视频解码播放器做替代方案]
 *
 *  这个播放器需要 mp3（声音） 与 mpg （视频画面） 2个文件来进行播放
 *
 *  ##### 音频抽取
 *
 *   使用Adobe Media Encoder 对视频进行转换导出mp3资源
 *
 *  ##### 视频转码  [ffmpeg donw](http://www.ffmpeg.org/)
 *
 *  命令：
 *  ```
 *  ffmpeg -i xxxx.mp4 -f mpeg1video -vf "crop=iw-mod(iw\,1):ih-mod(ih\,1)" -qscale 10 -b 0 xxxx.mpg
 *  ```
 *  - xxxx.mp4：原视频文件名；xxxx.mpg：导出的视频文件
 *  - (iw\,2)和(ih\,2)为视频的宽高，设置为1则代表为原视频宽高
 *  - -qscale 1 ：视频的清晰度，1代表最清晰，数值越大越模糊
 *
 *  @class
 *  @memberof ds.media
 *
 */
class MpegPlayer extends EventDispatcher {

    /**
     *
     * @param {string} url 视频url地址
     * @param {object} opts
     * @param {boolean} opts.progressive
     * @param {CanvasElement} opts.el
     * @param {boolean} opts.autoplay
     * @param {boolean} opts.autoload
     * @param {boolean} opts.progressShow
     * @param {boolean} opts.loop
     * @param {boolean} opts.seekable
     * @param {number} opts.duration
     * @param {HTMLElement|string} opts.append
     * @param {object} opts.css
     * @param {function} opts.onstartload
     * @param {function} opts.onload
     * @param {function} opts.update
     * @param {function} opts.onprogress
     * @param {function} opts.onplayend
     * @param {function} opts.onplay
     * @param {function} opts.onpause
     * @param {function} opts.oncanPlay
     * @param {function} opts.oncanPlayProgress
     */
    constructor(url, opts) {

        super();

        let _self = this;

        opts = opts || {};

        this._opts = opts;

        //记录加载路径
        this._url = url;
        //是否缓存加载
        let _progressive = (opts.progressive !== undefined) ? opts.progressive : true;
        //是否在声音允许播放就开始进行加载准备解码播放
        let _loadByAudioCanplay = true;

        let _canvas;
        if (opts.el != undefined) _canvas = $(opts.el)[0];
        else _canvas = document.createElement('canvas');


        let _autoplay = opts.autoplay !== undefined ? opts.autoplay : false;
        let _autoload = opts.autoload !== undefined ? opts.autoload : true;
        this._autoload = _autoload;

        this._canPlayBool = false;

        let _player = new jsmpeg(url, {
            canvas: _canvas,
            //是否自动播放
            autoplay: _autoplay,
            //是否自动加载  如果是设置自动播放 肯定是要自动加载
            autoload: _autoload,
            //默认加载进度
            progressShow: !!opts.progressShow,
            //是否循环
            loop: !!opts.loop,
            //是否计算头文件 计算出时间
            seekable: opts.seekable !== undefined ? opts.seekable : false,
            //避免头文件未计算完成，得不到总时间
            duration: opts.duration || 60,
            //是否缓冲加载播放
            progressive: _progressive,
            //缓冲加载播放
            progressiveThrottled: _progressive,
            //加载完成
            onstartload: _startLoad,
            //加载完成
            onload: _loadEnd,
            //帧触发
            ondecodeframe: _frameUpDate,
            //加载进度
            onprogress: _progress,
            //播放完成
            onfinished: _playEnd,
            //触发播放
            onplay: _onPlay,
            //触发播放
            onpause: _onPause,
            //触发可以播放
            canPlay: _onCanPlay,
            //第一个加载完成可以播放进度
            oncanPlayProgress: _canPlayProgress,
            //进跳帧后 声音控制
            upAudioTime: _playerUpAudioTime
        });

        this._player = _player;
        _canvas = _player.canvas;
        this._canvas = _canvas;

        if (opts.append) $(opts.append).append(_canvas);

        let _css;

        if (opts.css) _css = opts.css;
        else {

            _css = {
                position: 'absolute',
                left: 0,
                top: 0,
                width: 640,
                height: 1040,
            }

        }

        $(_canvas).css(opts.css);
        if (_css.width && _css.height) this._resizeCavans(_css.width, _css.height);

        //开始加载
        function _startLoad() {
            if (opts.onstartload) opts.onstartload();
            /**
             * 开始加载
             * @event ds.media.MpegPlayer#startLoad
             */
            _self.ds('startLoad');
        }

        //加载完成
        function _loadEnd() {
            // console.log('加载完成');
            if (opts.onload) opts.onload();
            /**
             * 加载完成
             * @event ds.media.MpegPlayer#loadEnd
             */
            _self.ds('loadEnd');
        }

        //帧渲染
        function _frameUpDate() {
            if (opts.update) opts.update();
            /**
             * 刷新事件
             * @event ds.media.MpegPlayer#update
             */
            _self.ds('update');
            // console.log('frame:' + (_Player.currentTime >> 0) + '/' + _Player.duration);
        }


        //加载进度
        function _progress(progress) {
            // console.log('加载进度:' + progress);
            if (opts.onprogress) opts.onprogress(progress);
            /**
             * 视频加载进度
             * @event ds.media.MpegPlayer#progress
             * @property {number} progress - 加载进度
             */
            _self.ds({
                type: 'progress',
                progress: progress
            });

        }

        function _playEnd() {

            if (opts.onplayend) opts.onplayend();
            /**
             * 播放结束
             * @event ds.media.MpegPlayer#playEnd
             */
            _self.ds('playEnd');

        }

        function _onPlay() {

            if (opts.onplay) opts.onplay();
            if (_self._audio) {

                if (_self._player && _self._player.currentTime) _self._audio.currentTime = _self._player.currentTime;

                _self._audio.play();

            }
            /**
             * 播放
             * @event ds.media.MpegPlayer#play
             */
            _self.ds('play');
        }

        function _onPause() {
            if (opts.onpause) opts.onpause();
            if (_self._audio) _self._audio.pause();
            /**
             * 暂停
             * @event ds.media.MpegPlayer#pause
             */
            _self.ds('pause');
        }

        function _onCanPlay() {
            if (_self._canPlayBool) return;
            _self._canPlayBool = true;
            if (opts.oncanPlay) opts.oncanPlay();
            /**
             * 可以开始播放
             * @event ds.media.MpegPlayer#canplay
             */
            _self.ds('canplay');
        }

        //第一次触发可以播放进度
        function _canPlayProgress(progress) {
            if (opts.oncanPlayProgress) opts.oncanPlayProgress(progress);
            /**
             * 第一次触发可以播放进度
             * @event ds.media.MpegPlayer#canPlayprogress
             * @property {number} progress - 加载进度
             */
            _self.ds({
                type: 'canPlayprogress',
                progress: progress
            });
        }

        //进行跳帧后 声音播放位置更新
        function _playerUpAudioTime(time) {

            if (_self._audio) _self._audio.currentTime = time;

        }

        //音频对象
        var _audio = null;
        var _audioUrl = opts.audio || '';
        if (_audioUrl === '') {

            if (_autoload) this.load();

        } else {

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
            });
            //pause()触发
            _audio.addEventListener('pause', function () {
            });
            //可以播放
            _audio.addEventListener('canplaythrough', function () {
                _self._audioCanplay();
            });
            _audio.addEventListener('error', function () {
                _self._audioError();
            });

            //更加配置判断是否通过touch触发声音播放
            if (opts.hasTouchstart) {
                document.body.addEventListener('touchstart', _audioInBrowserHandler);
            }

        }

        function _audioInBrowserHandler() {
            document.body.removeEventListener('touchstart', _audioInBrowserHandler);
            _self._audioOnDocumentTouchstart();
        }

    }

    _audioCanplay() {
        if (this._autoload) this.load();
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
     * 开始加载
     */
    load() {

        var _url = this._url;
        if (this._player.progressive) this._player.beginProgressiveLoad(_url);
        else this._player.load(_url);

    };

    /**
     * 播放
     */
    play() {
        if (!this._canPlayBool) return;
        console.log('Play', this._player.playing);
        // _Playing = true;
        this._player.play();
        if (this._audio) {
            this._audio.currentTime = this._player.currentTime;
            this._audio.play();
        }

    }

    /**
     * 暂停
     */
    pause() {
        if (!this._canPlayBool) return;
        this._player.pause();
        if (this._audio) this._audio.pause();
    }

    /**
     * 跳转到制定时间
     * @param {number} value 跳转到指定时间
     */
    seekToTime(value) {
        this._player.seekToTime(value, true);
        // this._player.currentTime = value;
    }

    /**
     * 跳转到制定帧
     * @param {number} frame [帧数]
     */
    seekToFrame(frame) {
        this._player.seekToFrame(frame, true);
    };

    /**
     * 当前时间
     */
    get currentTime() {
        return this._player.currentTime;
    }

    /**
     * 时间长度
     */
    get duration() {
        return this._player.duration;
    }


    get volume() {
        return this._audio ? this._audio.volume : 0;
    }

    /**
     * 设置获取声音大小
     * @param {number} value
     */
    set volume(value) {
        if (this._audio) this._audio.volume = value;
    }


    get muted() {
        return this._audio ? this._audio.muted : true;
    }

    /**
     * 设置获取是否禁音
     * @param {boolean} value
     */
    set muted(value) {
        this._audio.muted = value;
    }

    /**
     * 总帧数
     */
    get frameCount() {
        return this._player.frameCount;
    }

    /**
     * 当前帧
     */
    get currentFrame() {
        return this._player.currentFrame;
    }

    /**
     * 设置获取播放器播放状态
     */
    get playing() {
        return this._player.playing;
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
     * 视频播放器 jsmpeg实现的渲染器
     * @return {jsmpeg}
     */
    get player() {
        return this._player;
    }

    /**
     * 视频播放器呈现dom元素，cavnas
     * @return {CavansElement}
     */
    get el() {
        return this._canvas;
    }
}

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
ds.media = ds.media || {};
ds.media.MpegPlayer = MpegPlayer;

export default MpegPlayer;