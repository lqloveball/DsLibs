import 'ds/media/FramesPlayer';
import {getDefault} from 'ds/utils/Mixin';
// import PageBase from './base/PageBase';

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let eds = root.eds = root.eds || {};


/**
 * 序列帧播放页面
 */
class FramesPageModel extends eds.PageBase {

    constructor(opts) {
        super(opts);
        var _self = this;
        if (opts.name.indexOf('#') === 0) {
            let _temp = opts.name;
            opts.name = _temp.slice(1).split(' ')[0];
            opts.$dom = _temp;
            opts.cs = 'html';
        }
        this._name = opts.name;
        this._cs = opts.cs;
        this._movieIning = true;
        this._movieOuting = true;
        this._isCreatejsView = false;
        this._view = null;
        this._domInHtml = false;
        this._config = opts;

        this._type = 'framePage';
        this._screenType = getDefault(opts.screenType, 'v');

        let _css = {
            position: 'absolute',
            width: opts.width || 640,
            height: opts.height || 1235,
            left: opts.left || -3000,
            top: 0,
        };
        if (opts.css) _css = opts.css;

        //是否强制横屏
        let _isHorizontal = false;
        if (_css.width > _css.height) _isHorizontal = true;
        if (_isHorizontal) this._screenType = 'auto';

        //开始构建html部分
        let _temp;
        if (opts.$dom) _temp = $(opts.$dom);
        else _temp = $('#' + this._name);


        if (_temp.length <= 0) {
            _temp = $(document.createElement("div"));
            _temp[0].id = this._name;
            let _css = {position: 'absolute', left: 0, top: 0,};
            if (opts.css) _css = opts.css;
            _temp.css(_css);

            let _videoPanel = $(document.createElement("div"));
            _videoPanel.css('.videoPanel');

        } else {
            this._domInHtml = true;
        }
        this._view = _temp;


        this._videoPanel = this._view.find('.videoPanel');
        this._videoUrl = opts.url;

        if (!opts.end) {
            console.error(this.name + ':没设置序列帧结束帧数');
        }
        //处理序列帧播放器
        let _videoPlayer = new ds.media.FramesPlayer(this._videoUrl, {
            append: this._videoPanel[0],
            css: _css,
            fps: getDefault(opts.fps, 12),
            prefixes: getDefault(opts.prefixes, 'v'),
            suffix: getDefault(opts.suffix, '.jpg'),
            start: getDefault(opts.start, 0),
            end: getDefault(opts.end, 0),
            formatLength: getDefault(opts.formatLength, 3),
            loop: getDefault(opts.loop, false),
            bufferedime: getDefault(opts.bufferedime, 2),
            autoload: getDefault(opts.autoload, false),
            autoplay: getDefault(opts.autoplay, false),
            mp3: getDefault(opts.mp3, ''),
            audio: getDefault(opts.audio, ''),
            hasAudio: getDefault(opts.hasAudio, false),
            localSave: getDefault(opts.localSave, false),
            name: this._name,
        });

        this._videoPlayer = _videoPlayer;
        this._videoElement = $(_videoPlayer.el);

        //自动计算横屏情况，强制横屏
        this._isHorizontal = _isHorizontal;
        this.autoHorizontaler = null;
        if (_isHorizontal) {
            this.autoHorizontaler = new ds.ui.AutoHorizontalScreenContainer(this._view);
            this._videoElement.css({
                '-webkit-transform': 'translateZ(-1px)',
                '-moz-transform': 'translateZ(-1px)',
                '-ms-transform': 'translateZ(-1px)',
                '-o-transform': 'translateZ(-1px)',
                'transform': 'translateZ(-1px)',
            });
            this.view.css({left: -3000});
        }

        let _uiPanel = this.view.find('.uiPanel');
        if (_uiPanel && _uiPanel.length > 0) {
            this._uiPanel = _uiPanel;
            _uiPanel.hide();
        }

        if (opts.movieIn) opts.movieIn = opts.movieIn.bind(this);
        if (opts.movieInEnd) opts.movieInEnd = opts.movieInEnd.bind(this);
        if (opts.movieOut) opts.movieOut = opts.movieOut.bind(this);
        if (opts.movieOutEnd) opts.movieOutEnd = opts.movieOutEnd.bind(this);
        if (opts.resize) opts.resize = opts.resize.bind(this);
        if (opts.progress) opts.progress = opts.progress.bind(this);
        if (opts.initUI) {
            opts.initUI = opts.initUI.bind(this);
            opts.initUI();
        }
        if (opts.playEnd) opts.playEnd = opts.playEnd.bind(this);
        if (opts.readyPlay) opts.readyPlay = opts.readyPlay.bind(this);

        //播放完成
        _videoPlayer.on('playEnd', function () {
            if (opts.playEnd) opts.playEnd();
        }, this);
        //加载进度
        _videoPlayer.on('progress', function (progress) {
            if (opts.progress) opts.progress(progress);
        }, this);
        //准备开始可以播放
        _videoPlayer.addCuePoint({
            name: 'isReadyPlay',
            time: 0.1,
            fun: function (e) {
                if (_self.name !== SiteModel.pager.pageLabel) {
                    SiteModel.gotoPage(_self.name);
                    if (opts.readyPlay) opts.readyPlay();
                }
            }
        });
        this._removeReSize();
        SiteModel.resizeModel.on('resize', function () {
            this._resize();
            if (opts.resize) opts.resize();
        }, this);

    }

    movieIn() {


        this._movieOuting = false;
        this._movieIning = true;
        if (this._config.movieIn) this._config.movieIn();
        this.ds('movieIn');
        if (!this.isStarload) this._videoPlayer.load();
        this._videoElement.css({left: 0});
        this._videoPlayer.play();

        if (this._isHorizontal) this.view.css({left: 0});
        if (this._uiPanel) this._uiPanel.show();

        if (this._domInHtml) {
            this._view.show();
        } else {
            $('#domBox').append(this._view);
            this._view.show();
            this.movieInEnd();
        }

    }

    movieInEnd() {

        this._movieIning = false;
        if (this._config.movieInEnd) this._config.movieInEnd();
        this.ds('movieInEnd');

    }

    movieOut() {

        this._movieOuting = true;
        this._movieIning = false;
        if (this._config.movieOut) this._config.movieOut();
        this.ds('movieOut');

        if (this._domInHtml) this._view.hide();
        else this._view.remove();

        this._videoPlayer.pause();

        if (this._isHorizontal) this.view.css({left: -3000});
        if (this._uiPanel) this._uiPanel.hide();

        this.movieOutEnd();


    }

    movieOutEnd() {

        this._movieOuting = false;
        if (this._config.movieOutEnd) this._config.movieOutEnd();
        this.ds('movieOutEnd');


    }

    play() {
        if (!this.isStarload) this._videoPlayer.load();
        this._videoPlayer.resetCuePoints();
        this._videoPlayer.seekToTime(0);
        this._videoPlayer.play();
    }

    /**
     * 是否执行开始加载
     * @return {boolean}
     */
    get isStarload() {
        return this._videoPlayer.isStarload;
    }

    /**
     * 是否加载完成
     * @return {boolean}
     */
    get isLoadEnd() {
        return this._videoPlayer.isLoadEnd;
    }

    /**
     * 是否横屏
     * @return {boolean|*}
     */
    get isHorizontal() {
        return this._isHorizontal;
    }

    /**
     * 是否播放器
     * @return {ds.media.FramesPlayer|*}
     */
    get videoPlayer() {
        return this._videoPlayer;
    }

    /**
     * 视频地址
     * @return {string}
     */
    get videoUrl() {
        return this._videoUrl;
    }

    /**
     * 场景自适应
     * @private
     */
    _resize() {

        if (this.name !== SiteModel.pager.pageLabel) return;

        let _resizeModel = SiteModel.resizeModel;
        let _width = _resizeModel.width;
        let _height = _resizeModel.height;
        let _actualH = _resizeModel.actualH;
        let _pageScale = _resizeModel.pageScale;
        let _isInputState = _resizeModel.isInputState;
        let _horizontal = _resizeModel.horizontal;
        let _screenWidth = _resizeModel.screenWidth;
        let _densityDpi = _resizeModel.densityDpi;
        let _screenType = this._screenType;

        // console.log(this.name,'_resize',this._screenType,_horizontal,this._videoPlayerOriginalPlay);
        if (_screenType === 'v') {

            if (_horizontal) {
                if (this._videoPlayerOriginalPlay === undefined) this._videoPlayerOriginalPlay = this._videoPlayer.playing;
                this._videoPlayer.pause();
                SiteModel.resizeModel.showOrientationTip(true);
            }
            else {
                if (this._videoPlayerOriginalPlay) {
                    this._videoPlayer.play();
                    this._videoPlayerOriginalPlay = undefined;
                }
                SiteModel.resizeModel.hideOrientationTip();
            }
        }
        else if (_screenType === 'h') {

            if (!_horizontal) {
                this._videoPlayerOriginalPlay = this._videoPlayer.playing;
                this._videoPlayer.pause();
                SiteModel.resizeModel.showOrientationTip(false);
            }
            else {
                if (this._videoPlayerOriginalPlay) this._videoPlayer.play();
                SiteModel.resizeModel.hideOrientationTip();
            }

        } else {
            SiteModel.resizeModel.hideOrientationTip();
        }

    }


}


// console.log('VideoPageModel');


eds.FramesPageModel = FramesPageModel;

export default FramesPageModel;