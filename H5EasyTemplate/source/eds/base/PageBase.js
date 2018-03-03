import {getDefault,isDOM} from 'ds/utils/Mixin';

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

/**
 * 简易框架页面基类
 */
class PageBase extends ds.core.EventDispatcher {
    constructor(opts) {

        super();

        opts = opts || {};
        let _self = this;
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
        this._movieIning = true;
        this._movieOuting = true;

        this.addResize();
        // this[_onResize]=this._resize.bind(this);
        // SiteModel.resizeModel.on('resize', this[_onResize], this);
    }

    /**
     * 添加resize监听
     */
    addResize() {
        if (this[_onResize]) SiteModel.resizeModel.off('resize', this[_onResize]);
        this[_onResize] = this.resize.bind(this);
        SiteModel.resizeModel.on('resize', this[_onResize], this);
    }

    /**
     * 清空基类的自适应监听
     */
    removeReSize() {
        SiteModel.resizeModel.off('resize', this[_onResize]);
    }

    /**
     * 页面进场，在页面进场时候自动调用。请不要直接执行
     */
    movieIn() {
        this._movieOuting = false;
        this._movieIning = true;
        if (this._config.movieIn) this._config.movieIn();
        this.ds('movieIn');
        // console.log(this.name + ':movieIn', this._isCreatejsView);
        if (this._isCreatejsView) {
            _Root.addChildAt(this._view);
            if (this._view instanceof createjs.MovieClip) {
                this._view.gotoAndStop(0);
                this._view.gotoAndPlay(0);
            }
            this.ds('addView');
        }
        else if (this.type === 'html') {

            if (this._domInHtml) {
                this._view.show();

            } else {
                let _domBox = $('#domBox');
                if (_domBox.length > 0) $('#domBox').append(this._view);
                else $('#screen').append(this._view);
                this._view.show();
            }
            this.ds('addView');
            setTimeout(() => {
                this.movieInEnd();
            }, 500);
        } else {
            this.movieInEnd();
        }
        this.resize();
    }

    /**
     * 页面进场完成，在页面进场完成时候自动调用。请不要直接执行
     */
    movieInEnd() {
        this._movieIning = false;
        if (this._config.movieInEnd) this._config.movieInEnd();
        this.ds('movieInEnd');
    }

    /**
     * 页面退场，在页面退场时候自动调用。请不要直接执行
     */
    movieOut() {
        // console.log(this.name + ':movieOut');
        this._movieOuting = true;
        this._movieIning = false;
        if (this._config.movieOut) this._config.movieOut();
        this.ds('movieOut');

        if (this._isCreatejsView && this._view.movieOutEndFrame && this._view.movieOutFrame) {

            this._view.mouseEnabled = false;
            this._view.gotoAndPlay(this._view.movieOutFrame);

        }
        else if (this._isCreatejsView) {
            this.movieOutEnd();
        }
        else if (this.type === 'html') {

            if (this._domInHtml) {
                this._view.hide();
            } else {
                this._view.remove();
            }
            this.movieOutEnd();
        } else {
            this.movieOutEnd();
        }
    }

    /**
     * 页面退场完成，在页面退场完成时候自动调用。请不要直接执行
     */
    movieOutEnd() {
        this._movieOuting = false;
        if (this._config.movieOutEnd) this._config.movieOutEnd();
        if (this._isCreatejsView) {
            if (this._view.parent) this._view.parent.removeChild(this._view);
            this._view.mouseEnabled = true;
        }
        this.ds('movieOutEnd');
    }

    /**
     * 页面名称（全站唯一）
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
     * 是否进场中
     * @return {boolean}
     */
    get movieIning() {
        return this._movieIning;
    }

    /**
     * 页面显示对象
     * @return {*}
     */
    get view() {
        return this._view;
    }

    set view(value) {

        if (this._view) return;
        // console.log('set view:',value);
        this._view = value;
        if (this._view instanceof createjs.DisplayObject) {
            this._isCreatejsView = true;
            this._type = 'createjs';
            let _view = this.view;

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
                if (SiteModel.pager.pageLabel !== this.name) return;
                if (!this._movieIning) return;
                if (this._movieOuting) return;
                if (this._view.currentFrame >= this._view.movieInEndFrame) {
                    this.movieInEnd();
                }
            }, this);
            //监听退场
            if (_view.movieOutEndFrame && _view.movieOutFrame) {
                _view.on('tick', function () {
                    if (SiteModel.pager.pageLabel !== this.name) return;
                    if (!this._movieOuting) return;
                    if (this._movieIning) return;
                    if (this._view.currentFrame >= this._view.movieOutEndFrame) {
                        this.movieOutEnd();
                    }
                }, this);
            }

        } else {
            if(isDOM(this._view)){
                this._type = 'html';
            }
            else{
                this._type = 'othre';
            }
        }


    }

    /**
     * 是否是creatjs的页面显示对象
     * @return {boolean}
     */
    get isCreatejsView() {
        return this._isCreatejsView;
    }

    /**
     * 页面类型
     * @return {string}
     */
    get type() {
        return this._type;
    }

    /**
     * 页面自适应方式 默认'v'竖屏 'h'横屏 'auto' 横竖屏皆可以
     * @return {string}
     */
    get screenType() {
        return this._screenType;
    }

    set screenType(value){
        this._screenType=value;
    }

    /**
     * 配置
     * @return {*|{}}
     */
    get config() {
        return this._config;
    }

    /**
     * 场景自适应
     * @private
     */
    resize() {

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

        // console.log(this.name,SiteModel.pager.pageLabel);
        if (this.name !== SiteModel.pager.pageLabel) return;

        // console.log(this.name,'_resize',this._screenType,_horizontal);

        if (_screenType === 'v') {
            if (_horizontal) _resizeModel.showOrientationTip(true);
            else _resizeModel.hideOrientationTip();
        }
        else if (_screenType === 'h') {
            if (!_horizontal) _resizeModel.showOrientationTip(false);
            else _resizeModel.hideOrientationTip();
        } else {
            _resizeModel.hideOrientationTip();
        }

        if (this._config && this._config.resize) this._config.resize();
        this.ds('resize');

    }

}

//获取抓帧数据信息
function getFrameLabelData(value, labels) {
    for (let i = 0; i < labels.length; i++) {
        if (labels[i].label === value) return labels[i];
    }
    return null;
}

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let eds = root.eds = root.eds ? root.eds : {};

eds.PageBase = PageBase;

export default PageBase;