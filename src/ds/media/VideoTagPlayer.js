import EventDispatcher from '../core/EventDispatcher';

// weboack打包有问题 所以对iphone-inline-video.min.js做了些修改
// window.enableInlineVideo = require('libs/media/iphone-inline-video.min.js');
import enableInlineVideo from 'libs/media/iphone-inline-video.min.js';


/**
 *  视频标签交互播放器
 *
 *  需要用到
 *  https://github.com/bfred-it/iphone-inline-video
 *
 *  #### HTML标签
 *  ```html
 *  <!-- 放视频的容器  -->
 <div id="MyVideoPanel">
 <!-- 进行需要控制的视频 -->
 <video class='MyVideo'
 width="640" height="1140"
 playsinline="true"
 webkit-playsinline="true"
 x-webkit-airplay="true"
 x5-video-player-type="h5"
 x5-video-orientation="portrait"
 x5-video-player-fullscreen="true"
 preload="meta"
 poster=""
 volume='0'
 style="position: absolute; left: 3000px; top: 0; object-fit: fill"
 src="。/media/test.mp4" >
 </video>
 </div>
 *  ```
 *   注意对 preload的设置
 preload="auto" 当页面加载后载入整个视频
 preload="meta" 当页面加载后只载入元数据
 preload="none" 当页面加载后只载入元数据
 视频不能进行diplay:none;但可以设置left: 3000px;
 `关于x5内的video标签还可以查看`[腾讯X5同层播放器](https://x5.tencent.com/tbs/guide/tech.html)

 #### CSS样式设置

 * ```css
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
 * ```
 *  @class
 *  @memberof ds.media
 *  @requires module:libs/media/iphone-inline-video.browser.js
 */
class VideoTagPlayer extends EventDispatcher {

    /**
     *
     * @param {string} url 视频源
     * @param {object} opts 播放器配置
     * @param {HTMLElement} opts.el=undefined  捆绑dom元素
     * @param {HTMLElement|string} opts.append=undefined  添加到dom容器节点
     * @param {object} opts.css=undefined  播放器样式
     * @param {boolean} opts.hasFPS=false 是否加入序列帧播放器判断
     * @param {function} opts.onupdate  播放刷新
     * @param {function} opts.onplay  开始播放
     * @param {function} opts.onpause 播放暂停
     * @param {function} opts.onplayend  播放完成
     */
    constructor(url, opts) {

        super();

        let _self = this;

        opts = opts || {};

        this._opts = opts;
        /**
         * 如果使用动态创建的video标签 的动态class 名，"VideoTagPlayer"+this.dynamicID
         * @type {number}
         */
        this.dynamicID=new Date().getTime();

        let _html = [" <video class=\'"+"VideoTagPlayer"+this.dynamicID+"\'",
            "               width=\"640\" height=\"1040\"",
            "               playsinline",
            "               webkit-playsinline=\"true\"",
            "               x-webkit-airplay=\"true\"",
            "               x5-video-player-type=\"h5\"",
            "               x5-video-orientation=\"portrait\"",
            "               x5-video-player-fullscreen=\"true\"",
            "               preload=\"meta\"",
            "               poster=\"\"",
            "               volume=\'0\'",
            "               style=\"position: absolute; left: 3000px; top: 0; object-fit: fill\"",
            "               src=\"\" >",
            "        </video>"].join("");

        let _el;
        if (opts.el) _el = $(opts.el);
        if (!_el) _el = $(_html);

        this._video = _el[0];
        let _video = this._video;

        if (opts.append) $(opts.append).append(_video);

        if (opts.css)$(_el).css(opts.css);


        if (url !== undefined && url !== null) {
            _video.autoplay = opts.autoplay!=undefined?opts.autoplay:false;
            _video.loop = opts.loop!=undefined?opts.loop:false;
            _video.src = url;
            _video.load();
        }

        //解决ios下全屏播放问题

        enableInlineVideo(this._video);

        //视频事件参考 http://www.w3school.com.cn/tags/html_ref_audio_video_dom.asp
        this._videoEvents = [
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


        _video.addEventListener("timeupdate", function (e) {
            _self._updateEvent();
        });
        _video.addEventListener("play", function (e) {
            _self._playEvent();
        });
        _video.addEventListener("pause", function (e) {
            _self._pauseEvent();
        });
        _video.addEventListener("ended", function (e) {
            _self._playEndEvent();
        });


    }

    _updateEvent() {
        if (this._opts.onupdate) this._opts.onupdate();

        /**
         * 刷新事件
         * @event ds.media.VideoTagPlayer#update
         */
        this.ds('update');
    }

    _playEvent() {
        if (this._opts.onplay) this._opts.onplay();
        this._video.play();
        /**
         * 播放
         * @event ds.media.VideoTagPlayer#play
         */
        this.ds('play');
    }

    _pauseEvent() {
        if (this._opts.onpause) this._opts.onpause();
        this._video.pause();
        /**
         * 暂停
         * @event ds.media.VideoTagPlayer#pause
         */
        this.ds('pause');
    }

    _playEndEvent() {
        if (this._opts.onplayend) this._opts.onplayend();
        /**
         * 播放结束
         * @event ds.media.VideoTagPlayer#playEnd
         */
        this.ds('playEnd');
    }

    /**
     * 播放
     */
    play() {
        this._video.play();
    }

    /**
     * 暂停
     */
    pause() {
        this._video.pause();
    }

    /**
     * 跳转到制定时间
     * @param {number} value 跳转到指定时间
     */
    seekToTime(value) {
        this._video.currentTime = value;
    }

    /**
     * 是否播放中
     * @return {boolean}
     */
    get playing() {
        return !this._video.paused;
    }

    /**
     * 当前时间
     */
    get currentTime() {
        return this._video.currentTime;
    }

    /**
     * 时间长度
     */
    get duration() {
        return this._video.duration;
    }

    /**
     * 设置获取声音大小
     */
    get volume() {
        return this._video.volume;
    }

    set volume(value) {
        this._video.volume = value;
    }

    /**
     * 设置获取是否禁音
     * @param {boolean} value
     */
    get muted() {
        return this._video.muted;
    }

    set muted(value) {
        this._video.volume = value;
    }

    /**
     * 视频播放器呈现dom元素，视频标签
     * @return {VideoElement}
     */
    get video() {
        return this._video;
    }

    /**
     * 视频播放器呈现dom元素，视频标签
     * @return {VideoElement}
     */
    get el(){
        return this._video;
    }

}

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
ds.media = ds.media || {};
ds.media.VideoTagPlayer = VideoTagPlayer;

export default VideoTagPlayer;