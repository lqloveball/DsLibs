import {getDefault} from 'ds/utils/Mixin';

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
const _onResize = Symbol("_onResize");

class PanelBase extends ds.core.EventDispatcher {

    constructor(opts) {
        super();
        let _self = this;
        opts = opts || {};
        this._name = '';
        if (typeof opts === 'string') {
            let _temp = opts;
            if (_temp.indexOf('.') > 0) {
                let _arr = _temp.split('.');
                this._name = _arr[1];
            }
            else if (_temp.indexOf('#') === 0) {
                this._name = _temp.slice(1).split(' ')[0];
            }
        }
        else if (opts && opts.name && opts.name.indexOf('#') === 0) {
            let _temp = opts.name;
            this._name = _temp.slice(1).split(' ')[0];
        }

        this._config = opts;
        this._view = undefined;
        this._isCreatejsView = false;
        this._type = '';
        this._screenType = 'v';

        this._showBool = false;
        this._showRoot = null;

        if (opts.root) this._showRoot =opts.root;
        if (opts.ok) opts.ok = opts.ok.bind(this);
        if (opts.no) opts.no = opts.no.bind(this);
        if (opts.show) opts.show = opts.show.bind(this);
        if (opts.hide) opts.hide = opts.hide.bind(this);
        if (opts.movieInEnd) opts.movieInEnd = opts.movieInEnd.bind(this);
        if (opts.movieOutEnd) opts.movieOutEnd = opts.movieOutEnd.bind(this);
        if (opts.resize) opts.resize = opts.resize.bind(this);
        if (opts.initUI) {
            opts.initUI = opts.initUI.bind(this);
            opts.initUI();
        }

        this.addResize();
    }

    /**
     * 显示
     * @param opts
     * @param opts.cb
     * @param opts.ok
     * @param opts.no
     * @param opts.show
     * @param opts.hide
     * @param opts.movieInEnd
     * @param opts.movieOutEnd
     * @param opts.root 显示容器
     */
    show(opts) {
        if (this._showBool) return;

        opts = opts || {};

        let _config = this._config;
        if (opts.ok) _config.ok = opts.ok.bind(this);
        if (opts.no) _config.no = opts.no.bind(this);
        if (opts.show) _config.show = opts.show.bind(this);
        if (opts.hide) _config.hide = opts.hide.bind(this);
        if (opts.movieInEnd) _config.movieInEnd = opts.movieInEnd.bind(this);
        if (opts.movieOutEnd) _config.movieOutEnd = opts.movieOutEnd.bind(this);
        if (opts.root) this._showRoot =opts.root;

        this._showBool = true;
        let _showRoot = this._showRoot;
        if (!_showRoot && this.isCreatejsView) _showRoot = PanelBase.showRoot;
        if (this.isCreatejsView) {
            _showRoot.addChild(this.view);

            if (this.view instanceof createjs.MovieClip) {
                this.view.gotoAndStop(0);
                this.view.gotoAndPlay(0);
            }
        }
        else if (this.type === 'html') {

        } else {
            this.movieInEnd();
        }
        this.ds('show');

        this._resize();

        if (_config.show) _config.show();
        if (opts.cb) opts.cb();
    }

    /**
     * 隐藏
     * @param opts
     * @param opts.yes
     * @param opts.cb
     * @param opts.ok
     * @param opts.no
     * @param opts.hide
     * @param opts.movieOutEnd
     */
    hide(opts) {

        if (!this._showBool) return;
        opts = opts || {};
        let _config = this._config;

        if (opts.ok) _config.ok = opts.ok.bind(this);
        if (opts.no) _config.no = opts.no.bind(this);
        if (opts.hide) _config.hide = opts.hide.bind(this);
        if (opts.movieOutEnd) _config.movieOutEnd = opts.movieOutEnd.bind(this);

        this._showBool = false;

        if (this.isCreatejsView) {
            if (this._view.movieOutEndFrame && this._view.movieOutFrame) {
                console.log('走播放退场逻辑');
                this._view.mouseEnabled = false;
                this._view.gotoAndPlay(this._view.movieOutFrame);
            } else {
                this.movieOutEnd();
            }
        }
        else if (this.type === 'html') {
            this.movieOutEnd();
        }
        else {
            this.movieOutEnd();
        }
        this.ds('hide');

        if (opts.yes !== undefined) {
            if (typeof(opts.yes) === 'function') {
                opts.yes();
            }
            else if (opts.yes) {
                if(_config.ok)_config.ok();
            }
            else {
                if(_config.no)_config.no();
            }
        }

        if (_config.hide) _config.hide();
        if (opts.cb) opts.cb();
    }

    /**
     * 显示完成
     */
    movieInEnd() {

        if (this._config.movieInEnd) this._config.movieInEnd();
        this.ds('movieInEnd');
    }

    /**
     * 隐藏完成
     */
    movieOutEnd() {
        if (this._config.movieOutEnd) this._config.movieOutEnd();
        if (this._isCreatejsView) {
            if (this._view.parent) this._view.parent.removeChild(this._view);
            this._view.mouseEnabled = true;
        }
        this.ds('movieOutEnd');
    }

    /**
     * 是否浮层显示状态
     * @return {boolean}
     */
    get showBool() {
        return this._showBool;
    }

    /**
     * 添加resize监听
     */
    addResize() {
        if (this[_onResize]) SiteModel.resizeModel.off('resize', this[_onResize]);
        this[_onResize] = this._resize.bind(this);
        SiteModel.resizeModel.on('resize', this[_onResize], this);
    }

    /**
     * 清空基类的自适应监听
     */
    removeReSize() {
        SiteModel.resizeModel.off('resize', this[_onResize]);
    }

    /**
     * 设置浮层显示对象
     * @param value
     */
    set view(value) {

        if (this._view) return;
        this._view = value;

        if (this._view instanceof createjs.DisplayObject) {

            this._isCreatejsView = true;
            this._type = 'createjs';
            let _view = this.view;

            let _bg = _view.bg;
            if (_bg) {
                _bg.on('click', function () {
                    console.log('bg click');
                });
            }

            let _closeBtn = _view.closeBtn;
            if (_closeBtn) {
                _closeBtn.on('click', function () {
                    this.hide();
                }, this);
            }

            let _btn = _view.btn;
            if (_btn) {
                _btn.on('click', function () {
                    this.hide({yes:true});
                }, this);
            }

            let _btn_ok = _view.btn_ok;
            if (_btn_ok) {
                _btn_ok.on('click', function () {
                    this.hide({yes:true});
                }, this);
            }

            let _btn_no = _view.btn_no;
            if (_btn_no) {
                _btn_no.on('click', function () {
                    this.hide({yes:false});
                }, this);
            }



            //进出场动画逻辑控制
            _view.movieInEndFrame = _view.totalFrames - 1;
            _view.movieOutFrame = null;
            _view.movieOutEndFrame = null;
            if (_view.labels) {
                let _labels = _view.labels;
                let _movieInEnd = getFrameLabelData('movieInEnd', _labels);
                let _movieOut = getFrameLabelData('movieOut', _labels);
                let _movieOutEnd = getFrameLabelData('movieOutEnd', _labels);
                if (_movieOut) {
                    _view.movieOutFrame = _movieOut.position;
                    _view.movieInEndFrame = _view.movieOutFrame = _view.movieOutFrame - 1;
                }
                if (_movieInEnd) _view.movieInEndFrame = _movieInEnd.position;
                if (_view.movieInEndFrame !== _view.totalFrames - 1) {
                    if (_movieOut) _view.movieOutFrame = _movieOut.position;
                    else _view.movieOutFrame = _view.movieInEndFrame + 1;
                    if (_movieOutEnd) _view.movieOutEndFrame = _movieOutEnd.position;
                    else _view.movieOutEndFrame = _view.totalFrames - 1
                }

                // console.log(_view.labels,_movieInEnd,_movieOut,_movieOutEnd);
            }
            //自动测试是否时间轴播放完成
            //监听进场
            _view.on('tick', function () {
                if (!this.showBool) return;
                if (_view.currentFrame >= _view.movieInEndFrame) {
                    this.movieInEnd();
                }
            }, this);
            //监听退场
            if (_view.movieOutEndFrame && _view.movieOutFrame) {
                _view.on('tick', function () {
                    if (this.showBool) return;
                    if (_view.currentFrame >= _view.movieOutEndFrame) {
                        this.movieOutEnd();
                    }
                }, this);
            }

        }
        else {
            this._type = 'html';
        }
    }

    /**
     * 浮动层显示对象
     * @return {*}
     */
    get view() {
        return this._view;
    }

    /**
     * 浮动层类型
     * @return {string}
     */
    get type() {
        return this._type;
    }

    /**
     * 浮动层自适应方式 默认'v'竖屏 'h'横屏 'auto' 横竖屏皆可以
     * @return {string}
     */
    get screenType() {
        return this._screenType;
    }

    /**
     * 是否是creatjs的页面显示对象
     * @return {boolean}
     */
    get isCreatejsView() {
        return this._isCreatejsView;
    }

    /**
     * 浮动层名称（全站唯一）
     * @param value
     */
    set name(value) {
        if (this._name !== '') return;
        this._name = value;
    }

    get name() {
        return this._name;
    }

    /**
     * 配置
     * @return {*|{}}
     */
    get config(){
        return this._config;
    }
    /**
     * 场景自适应
     * @private
     */
    _resize() {

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

        if (!this._showBool) return;

        if (this._config && this._config.resize) this._config.resize();
        this.ds('resize');

    }

}

/**
 * 显示浮动层默认容器
 */
PanelBase.showRoot = _Stage;

//获取抓帧数据信息
function getFrameLabelData(value, labels) {
    for (let i = 0; i < labels.length; i++) {
        if (labels[i].label === value) return labels[i];
    }
    return null;
}

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let eds = root.eds = root.eds || {};

eds.PanelBase = PanelBase;

export default PanelBase;