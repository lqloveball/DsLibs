import 'ds/media/VideoInteractivePlayer';
import 'ds/media/VideoTagPlayer';
import 'ds/media/MpegPlayer';
import 'ds/media/FramesPlayer';
import 'ds/ui/AutoHorizontalScreenContainer';
import 'ds/media/FramesPlayer';
import {getDefault} from 'ds/utils/Mixin';

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let eds = root.eds = root.eds || {};

/**
 * 视频播放页面模型
 * 不能作为首页loading后播放
 * 支持强制横屏
 */
class VideoPageModel extends eds.PageBase {
    constructor(opts) {
        super();
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

        this._type = 'videoPage';
        this._screenType = getDefault(opts.screenType, 'v');


        let _css = {
            position: 'absolute',
            width: opts.width || 640,
            height: opts.height || 1235,
            left: opts.left || -3000,
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

        let _videoPlayer = new ds.media.VideoInteractivePlayer(this._videoUrl, {
            append: this._videoPanel[0],
            css: _css,
            onlyVideo: getDefault(opts.onlyVideo, false),
            inSiteLoad: getDefault(opts.inSiteLoad, false),
            el: getDefault(opts.el, undefined),
            autoload: getDefault(opts.autoload, true),
            autoplay: getDefault(opts.autoplay, false),
            hasAudio: getDefault(opts.hasAudio, true),
            //自动计算的时候是否包含序列帧播放器
            hasFPS: getDefault(opts.hasFPS, false),
            //mpg 通用fps做选择时候，是否优先考虑fps方式播放
            firstFPS: getDefault(opts.firstFPS , false),
            //以下序列帧播放器才可能拥有的初始化属性
            fps: getDefault(opts.fps, 12),
            prefixes: getDefault(opts.prefixes, 'v'),
            suffix: getDefault(opts.suffix, '.jpg'),
            start: getDefault(opts.start, 0),
            end: getDefault(opts.end, 0),
            formatLength: getDefault(opts.formatLength, 3),
            loop: getDefault(opts.loop, false),
            bufferedime: getDefault(opts.bufferedime, 2),
            mp3: getDefault(opts.mp3, null),
            audio: getDefault(opts.audio, null),
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
        //准备开始可以播放
        _videoPlayer.addCuePoint({
            name: 'isReadyPlay',
            time: 0.1,
            fun: function (e) {
                if (_self.name !== SiteModel.pager.pageLabel) {
                    _self._isReadyPlay=true;
                    if (opts.readyPlay) opts.readyPlay();
                    SiteModel.gotoPage(_self.name);

                }
            }
        });

        _videoPlayer.on('loadEnd',function () {
            console.log('视频加载完成----');
            this.ds('loadEnd');
        },this);

        _self._isReadyPlay = false;

        this.removeReSize();

        SiteModel.resizeModel.on('resize', function () {
            this.resize();
            if (opts.resize) opts.resize();
        }, this);

        this._isReadyPlay = false;



    }


    movieIn() {

        console.log('Viedeo');
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

        this.resize();

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
        console.log('video play1');
        // ds.alert('video play');
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

    get isHorizontal() {
        return this._isHorizontal;
    }

    get videoPlayer() {
        return this._videoPlayer;
    }

    get videoUrl() {
        return this._videoUrl;
    }

    get name() {
        return this._name;
    }

    get view() {
        return this._view;
    }

    get movieing() {
        return this._movieIning;
    }

    get isCreatejsView() {
        return this._isCreatejsView;
    }

    get type() {
        return this._type;
    }

    /**
     * 自适应方式 默认'v'竖屏 'h'横屏 'auto' 横竖屏皆可以
     * @return {string}
     */
    get screenType() {
        return this._screenType
    }

    /**
     * 是否准备好可以进入播放页面
     * @return {boolean}
     */
    get isReadyPlay() {
        return this._isReadyPlay;
    }

    get isLoadEnd(){
        return this.videoPlayer.isLoadEnd;
    }

    /**
     * 场景自适应
     * @private
     */
    resize() {

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

        console.log(this.name, '_resize', this._screenType, _horizontal, this._videoPlayerOriginalPlay);
        let _videoElement = this._videoElement;
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
                if (this._config.pageScale) {
                    let _pageScale = _actualH / this._config.height;
                    if (_pageScale >= 1) _pageScale = 1;
                    let _resizeObj = {
                        "-webkit-transform-origin": '0 0',
                        "transform-origin": '0 0',
                        "-webkit-transform": "scale(" + _pageScale + ")",
                        "transform": "scale(" + _pageScale + ")",
                        "left": (this._config.width - this._config.width * _pageScale) / 2,
                    };
                    _videoElement.css(_resizeObj);
                }
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
        this.ds('resize');
    }
}


eds.VideoPageModel = VideoPageModel;

export default VideoPageModel;