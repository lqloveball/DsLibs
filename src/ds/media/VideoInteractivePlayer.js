import EventDispatcher from '../core/EventDispatcher';

/**
 *  视频交互类
 *  @class
 *  @memberof ds.media
 */
class VideoInteractivePlayer extends EventDispatcher {
    /**
     * 构建播放器
     * @param {string} url 播放源
     * @param {object} opts
     */
    constructor(url, opts) {


        super();

        let _self = this;

        opts = opts || {};


        let _type;
        if (opts.type != undefined) _type = opts.type;
        else {

            let _playerData = this.getVideoPlayerTypeByExts(url);
            _type = _playerData.type;
            if (_playerData.ext === 'dynamics') {
                if (_type === 'video') url = url + '.mp4';
                if (_type === 'mpg') {

                    if (!opts.audio && !opts.hasAudio) opts.audio = url + '.mp3';
                    url = url + '.mpg';

                }
                if (_type === 'ts') url = url + '.ts';
            }
        }

        this._url = url;

        this._type = _type;
        // console.log('_type:', _type);

        if (_type === 'mpg') {

            this._videoPlayer = new ds.media.MpegPlayer(url, opts);

        }
        else if (_type === 'ts') {

            this._videoPlayer = new ds.media.TSPlayer(url, opts);

        }
        else if (_type === 'fs') {

            this._videoPlayer = new ds.media.FramesPlayer(url, opts);

        }
        else {

            this._videoPlayer = new ds.media.VideoTagPlayer(url, opts);

        }

        let _videoPlayer = this._videoPlayer;

        _videoPlayer.on('canplay', function (e) {
            /**
             * 视频可播放
             * @event ds.media.VideoInteractivePlayer#canplay
             */
            this.ds('canplay');
        }, this);
        _videoPlayer.on('progress', function (e) {
            /**
             * 视频加载进度
             * @event ds.media.VideoInteractivePlayer#progress
             */
            this.ds(e);

        }, this);
        _videoPlayer.on('loadEnd', function (e) {
            /**
             * 视频播放
             * @event ds.media.VideoInteractivePlayer#loadEnd
             */
            this.ds(e);
        }, this);
        _videoPlayer.on('play', function (e) {
            /**
             * 视频播放
             * @event ds.media.VideoInteractivePlayer#play
             */
            this.ds(e);
        }, this);
        _videoPlayer.on('pause', function (e) {
            /**
             * 视频暂停
             * @event ds.media.VideoInteractivePlayer#pause
             */
            this.ds(e);
        }, this);
        _videoPlayer.on('playEnd', function (e) {
            /**
             * 视频播放完成
             * @event ds.media.VideoInteractivePlayer#playEnd
             */
            this.ds(e);
        }, this);
        _videoPlayer.on('update', function (e) {
            /**
             * 视频播放中实时触发事件
             * @event ds.media.VideoInteractivePlayer#update
             */
            this.ds(e);
        }, this);

        _videoPlayer.on('update', this._timeUpDate);

        this._playing = false;

        this._videoCuePointList = [];
    }

    /**
     * 开始加载
     */
    load() {

        if (_type === 'mpg' || _type === 'ts' || _type === 'fs') this._videoPlayer.load();
    }

    /**
     * 根据链接地址获取播放器类型
     * @param {string} url 视频链接地址
     * @return {Object}
     */
    getVideoPlayerTypeByExts(url) {

        let _type;
        let _exts = ['mpg', 'ts', 'fs', 'video'];
        let _fi = url.lastIndexOf(".");
        let _ext;

        //如果不带后缀,根据设备判断播放方式
        if (_fi < 0) {


            let u = navigator.userAgent;
            let ua = u.toLowerCase();
            let wechat = false;
            if (ua.match(/MicroMessenger/i) == "micromessenger") wechat = true;
            //ios终端
            let ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            //android终端
            let android = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;

            if (wechat || (location.href.indexOf(':800') !== -1)) {

                if (ios) _type = 'video';
                else _type = 'mpg';

            } else {

                _type = 'video';

            }
            _ext = 'dynamics';

        }
        //根据后缀名判断播放器类型
        else {

            _ext = url.substr(_fi + 1);
            if (_ext === 'mpg') _type = 'mpg';
            else if (_ext === 'ts') _type = 'ts';
            else if (_ext === 'fs') _type = 'fs';
            else _type = 'video';

        }


        if (_exts.indexOf(_type) < 0) _type = 'video';

        return {type: _type, ext: _ext};
    }

    /**
     * 视频播放器核心对象 帧播放器、mpg播放器、ts播放器、video标签播放器
     * @return {*}
     */
    get videoPlayer() {
        return this._videoPlayer;
    }

    /**
     * 互动时间点监听
     * @param e
     * @private
     */
    _timeUpDate(e) {

        let _videoPlayer = this._videoPlayer;
        if (!_videoPlayer) return;
        let _currentTime = 0;
        _currentTime = _videoPlayer.currentTime;
        let _videoCuePointList = this._videoCuePointList;

        for (let i = 0; i < _videoCuePointList.length; i++) {

            let _td = _videoCuePointList[i];

            if (_td.time && _currentTime >= _td.time && !_td.bool) {

                _td.bool = true;
                _td.runNum += 1;
                var _eventData = {
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
     * 视频交互提示点列表
     * @return {array}
     */
    get videoCuePointList() {
        return this._videoCuePointList.concat();
    }

    /**
     * 添加交互的时间节点
     * @param {object} cd 时间节点事件数据设置
     * @param {string} cd.name 这个时间点的名称
     * @param {number} cd.time 时间,秒数
     * @param {function} cd.fun  时间点执行的时间函数
     * @return {object} cd 设置时间节点数据
     *
     * ```js
     *  cd.runNum  自动创建  这个时间执行多少次 方便用来进行逻辑处理判断
     *  cd.bool  自动创建  这个时间执行多少次 方便用来进行逻辑处理判断
     * ```
     */
    addCuePoint(cd) {

        if (!cd.time) return;
        if (!cd.name) cd.name = 'time_' + cd.time;
        cd.runNum = 0;
        cd.bool = false;
        this._videoCuePointList.push(pointData);
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
     * 播放源
     * @return {string|*}
     */
    get url() {
        return this._url;
    }

    /**
     * 当前视频时间
     */
    get currentTime() {
        return this._videoPlayer.currentTime;
    }

    /**
     * 设置获取播放器播放状态
     */
    get playing() {
        return this._videoPlayer.playing;
    }

    set playing(bool) {
        if (bool) this.play();
        else this.pause();
    }

    /**
     * 播放
     */
    play() {
        this._videoPlayer.play();
    }

    /**
     * 暂停
     */
    pause() {
        this._videoPlayer.pause();
    }

    /**
     * 寻找跳转到指定的时间
     * @param {number} value
     */
    seekToTime(value) {
        this._videoPlayer.seekToTime(value);
    }

    /**
     * 跳转到制定帧
     * `只能mpg fs 播放器可以使用`
     * @param {number} frame [帧数]
     */
    seekToFrame(frame) {
        if (this._videoPlayer.seekToFrame) this._videoPlayer.seekToFrame(frame, true);
    }

    /**
     * 音量
     */
    get volume() {
        return this._videoPlayer.volume;
    }

    set volume(value) {
        this._videoPlayer.volume = value;
    }

    /**
     * 设置获取是否禁音状态
     */
    get muted() {
        return this._videoPlayer.muted;
    }

    set muted(value) {
        this._videoPlayer.muted = value;
    }

    get el() {
        return this._videoPlayer.el;
    }

}

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
ds.media = ds.media || {};
ds.media.VideoInteractivePlayer = VideoInteractivePlayer;

export default VideoInteractivePlayer;
