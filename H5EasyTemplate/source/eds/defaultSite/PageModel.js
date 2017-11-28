let [_AppMain, _CreateJsModel, _PixiJsModel, _ThreeJsModel] = [SiteModel.appMain, SiteModel.createJsModel, SiteModel.pixiJsModel, SiteModel.threeJsModel];
let _Root, _Stage;
if (_PixiJsModel) {
    _Root = _PixiJsModel.root;
    _Stage = _PixiJsModel.stage;
}
else if (_CreateJsModel) {
    _Root = _CreateJsModel.root;
    _Stage = _CreateJsModel.stage;
}


class PageModel extends ds.core.EventDispatcher {
    constructor(opts) {

        super();

        var _self = this;


        //字符串的配置
        if (typeof opts === 'string') {
            let _temp = opts;
            opts = {};
            if (_temp.indexOf('.') > 0) {
                let _arr = _temp.split('.');
                opts.name = _arr[1];
                opts.cs = _temp;
                opts.touchSwipe = _getDefault(opts.touchSwipe, true);
            }
            else if (_temp.indexOf('#') === 0) {
                opts.name = _temp;
                opts.cs = 'html';
                opts.touchSwipe = _getDefault(opts.touchSwipe, true);
            }
            else{
                console.error('页面配置错误：'+_temp);
                return;
            }
        }

        //对象配置 判断是否html页面
        if (opts.name.indexOf('#') === 0) {
            let _temp = opts.name;
            opts.name = _temp.slice(1).split(' ')[0];
            opts.$dom = _temp;
            opts.cs = 'html';
            opts.touchSwipe = _getDefault(opts.touchSwipe, true);
        }


        //是否能滑动翻页
        opts.touchSwipe = _getDefault(opts.touchSwipe, false);
        //上下滑动
        opts.touchVertical = _getDefault(opts.touchVertical, true);
        //运动中是锁住
        opts.movieLock = _getDefault(opts.movieLock, true);
        //页面切换是否可以循环,到最后一页是否能切到上一页
        opts.touchSwipeLoop = _getDefault(opts.touchSwipeLoop, true);
        //是否可以切下一页
        opts.touchNext = _getDefault(opts.touchNext, true);
        //是否能切上一页
        opts.touchPrevious = _getDefault(opts.touchPrevious, true);

        this._name = opts.name;
        this._cs = opts.cs;

        //页面类型 html createjs videoPage
        this._type = 'html';
        this._screenType = _getDefault(opts.screenType, 'v');


        this._movieIning = true;
        this._movieOuting = true;
        this._isCreatejsView = false;
        this._view = null;
        this._domInHtml = false;
        this._config = opts;

        if (opts.cs === 'html') {

            this._isCreatejsView = false;
            this._name = opts.name;
            this._cs = opts.cs;
            let _temp;
            if (opts.$dom) _temp = $(opts.$dom);
            else _temp = $('#' + this._name);
            //判断是否非原dom结构内拥有
            if (_temp.length <= 0) {
                _temp = $(document.createElement("div"));
                _temp[0].id = this._name;
                let _css = {position: 'absolute', left: 0, top: 0,};
                if (opts.css) _css = opts.css;
                _temp.css(_css);
            } else {
                this._domInHtml = true;
            }
            this._view = _temp;
            this._type = 'html';

        }
        else if (window['createjs'] && opts.cs !== 'html') {

            this._type = 'createjs';
            if (this._name.indexOf('.') !== -1) {
                let _temp = this._name;
                let _arr = _temp.split('.');
                this._name = _arr[1];
                if (!this._cs) this._cs = _temp;
            }

            let _ns = this._cs.split('.')[0];
            let _class = this._cs.split('.')[1];

            try {

                this._view = new window[_ns][_class]();

            } catch (e) {

                console.error('你的页面设置配置有误：' + _ns + '.' + _class);
                return;

            }

            this._isCreatejsView = true;
            // console.log(this._view.labels,this._view.currentLabel);
            this._view.movieInEndFrame = this._view.totalFrames - 1;
            this._view.movieOutFrame = null;
            this._view.movieOutEndFrame = null;
            if (this._view.labels) {
                let _labels = this._view.labels;
                let _movieInEnd = getFrameLabelData('movieInEnd', _labels);
                let _movieOut = getFrameLabelData('movieOut', _labels);
                let _movieOutEnd = getFrameLabelData('movieOutEnd', _labels);
                if (_movieInEnd) this._view.movieInEndFrame = _movieInEnd.position;
                if (_movieOutEnd) {
                    this._view.movieOutEndFrame = _movieOutEnd.position;
                    if (_movieOut) this._view.movieOutFrame = _movieOut.position;
                    else this._view.movieOutFrame = this._view.movieInEndFrame + 1;
                }
                // console.log(this._view.labels,_movieInEnd,_movieOut,_movieOutEnd);
            }

            this._view.on('tick', function () {
                if (SiteModel.pager.pageLabel !== this.name) return;
                if (!this._movieIning) return;
                if (this._movieOuting) return;
                if (this._view.currentFrame >= this._view.movieInEndFrame) {
                    this.movieInEnd();
                }
            }, this);

            function getFrameLabelData(value, labels) {
                for (let i = 0; i < labels.length; i++) {
                    if (labels[i].label === value) return labels[i];
                }
                return null;
            }

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

        touch.on($('#screen')[0], 'swipeleft', () => {
            if (SiteModel.pager.pageLabel !== this.name) return;
            if (!opts.touchSwipe) return;
            if (opts.touchVertical) return;
            this._nextPage();
        });
        touch.on($('#screen')[0], 'swiperight', () => {
            if (SiteModel.pager.pageLabel !== this.name) return;
            if (!opts.touchSwipe) return;
            if (opts.touchVertical) return;
            this._previousPage();
        });
        touch.on($('#screen')[0], 'swipeup', () => {
            if (SiteModel.pager.pageLabel !== this.name) return;
            if (!opts.touchSwipe) return;
            if (!opts.touchVertical) return;
            this._nextPage();
        });
        touch.on($('#screen')[0], 'swipedown', () => {
            if (SiteModel.pager.pageLabel !== this.name) return;
            if (!opts.touchSwipe) return;
            if (!opts.touchVertical) return;
            this._previousPage();
        });

        SiteModel.resizeModel.on('resize', function () {
            this._resize();
            if(opts.resize)opts.resize();
        }, this);

    }

    _nextPage() {
        console.log(this.name, this._config.touchSwipe);
        if (SiteModel.pager.pageLabel !== this.name) return;
        let _config = this._config;
        if (_config.movieLock && (this._movieIning || this._movieOuting)) return;
        if (!_config.touchNext) return;
        let _pager = SiteModel.pager;
        let _index = _pager.pageList.indexOf(_pager.pageModel);
        let _num = _index + 1;
        if (_num >= _pager.pageList.length) {
            if (t_config.touchSwipeLoop) _num = 0;
            else _num = _pager.pageList.length - 1;
        }
        let _page = _pager.pageList[_num];
        if (_page.type === 'videoPage') return;
        SiteModel.gotoPage(_page.name);

    }

    _previousPage() {

        if (SiteModel.pager.pageLabel !== this.name) return;
        let _config = this._config;
        if (_config.movieLock && (this._movieIning || this._movieOuting)) return;
        if (!_config.touchPrevious) return;
        let _pager = SiteModel.pager;
        let _index = _pager.pageList.indexOf(_pager.pageModel);
        let _num = _index - 1;
        if (_num < 0) {
            _num = _pager.pageList.length - 1;
            if (_config.touchSwipeLoop) _num = _pager.pageList.length - 1;
            else _num = 0;
        }
        let _page = _pager.pageList[_num];
        if (_page.type === 'videoPage') return;
        SiteModel.gotoPage(_page.name);

    }

    movieIn() {

        this._movieOuting = false;
        this._movieIning = true;
        this.ds('movieIn');
        // console.log(this.name + ':movieIn', this._movieIning);
        if (this._isCreatejsView) {
            _Root.addChildAt(this._view);
            this._view.gotoAndStop(0);
            this._view.gotoAndPlay(0);
        } else {

            if (this._domInHtml) {
                this._view.show();

            } else {
                let _domBox = $('#domBox');
                if (_domBox.length > 0) $('#domBox').append(this._view);
                else $('#screen').append(this._view);
                this._view.show();
            }
            setTimeout(() => {
                this.movieInEnd();
            }, 500);
        }
        if (this._config.movieIn) this._config.movieIn();
        this._resize();
    }

    movieInEnd() {


        this._movieIning = false;
        this.ds('movieInEnd');
        if (this._config.movieInEnd) this._config.movieInEnd();

    }

    movieOut() {

        // console.log(this.name + ':movieOut');
        this._movieOuting = true;
        this._movieIning = false;
        this.ds('movieOut');

        if (this._isCreatejsView && this._view.movieOutEndFrame && this._view.movieOutFrame) {

            this._view.mouseEnabled = false;
            this._view.gotoAndPlay(this._view.movieOutFrame);
            this._view.on('tick', function () {
                if (SiteModel.pager.pageLabel !== this.name) return;
                if (!this._movieOuting) return;
                if (this._movieIning) return;
                if (this._view.currentFrame >= this._view.movieOutEndFrame) {
                    this.movieOutEnd();
                }
            }, this);

        }
        else if (this._isCreatejsView) {
            this.movieOutEnd();
        }
        else {

            if (this._domInHtml) {
                this._view.hide();
            } else {
                this._view.remove();
            }
            this.movieOutEnd();
        }

        if (this._config.movieOut) this._config.movieOut();
    }

    movieOutEnd() {
        this._movieOuting = false;
        if (this._isCreatejsView) {
            if (this._view.parent) this._view.parent.removeChild(this._view);
            this._view.mouseEnabled = true;
        }
        this.ds('movieOutEnd');
        // console.log(this.name + ':movieOutEnd');
        if (this._config.movieOutEnd) this._config.movieOutEnd();
    }

    set name(value) {
        if (this._name !== '') return;
        this._name = value;
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

        // console.log(this.name,'_resize',this._screenType,_horizontal);
        if(_screenType==='v'){
            if(_horizontal)SiteModel.resizeModel.showOrientationTip(true);
            else SiteModel.resizeModel.hideOrientationTip();
        }
        else if(_screenType==='h'){
            if(!_horizontal)SiteModel.resizeModel.showOrientationTip(false);
            else SiteModel.resizeModel.hideOrientationTip();
        }else{
            SiteModel.resizeModel.hideOrientationTip();
        }

    }
}

function _getDefault(obj, defaultValue) {
    if (obj === undefined || obj === null) return defaultValue;
    if (obj === 'true') return true;
    else if (obj === 'false') return false;
    return obj;
}

export default PageModel;