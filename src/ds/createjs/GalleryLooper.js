import EventDispatcher from '../core/EventDispatcher';
import GalleryAnnularLoopManager from '../gemo/GalleryAnnularLoopManager';
import Touch from 'libs/touch/touch.min.js';

/**
 * 环形作品画廊
 * @memberof ds.createjs
 * @requires module:ds/core/EventDispatcher.js
 * @requires module:ds/gemo/GalleryAnnularLoopManager.js
 * @requires module:libs/touch/touch.min.js
 */
class GalleryLooper extends EventDispatcher {

    /**
     * 构造函数
     * @param {createjs.Container} display 显示容器，同时也作为运动显示动画皮肤使用
     * 显示容器的皮肤资源结构制作参考
     * ```js
     *                                     ----------
     *                         ------     |          |     ------
     *    [  beforeOut ]      | mc0  |    |    mc1   |    | mc2  |       [  afterOut ]
     *                         ------      ----------      ------
     * ```
     * @param {array} list=undefined 显示对象列表
     * @param {number} showNum=3 显示个数
     * @param {object} opts={}  配置参数
     * @param {boolean} opts.filters=false 是否支持滤镜效果附加
     * @param {HTMLElement} opts.dom 滑动触摸的dom元素，默认是$('body')[0]
     * @param {boolean} opts.vertical=false 滑动触摸反馈是 垂直 或者 横向。
     * @param {boolean} opts.autoInit=true 是否马上自动构建
     * @param {number} opts.time=0.5 运动时间
     * @param {boolean} opts.isSkin=false 是否只是作为参考皮肤，实际显示对象元素重新创建
     */
    constructor(display, list, showNum, opts) {
        super();
        let _self = this;
        opts = opts || {};
        let _showNum = showNum || 3;
        this._showNum = _showNum;

        let _box = display;

        let _isSkin = opts.isSkin !== undefined ? opts.isSkin : false;
        if (!_isSkin) {
            this._box = _box;
        } else {
            this._box = new createjs.Container();
            let _parent = _box.parent;
            if (_box.parent) _box.parent.removeChild(_box);
            _parent.addChild(this._box);
            this._box.x = _box.x;
            this._box.y = _box.y;
            this._box.scaleX = _box.scaleX;
            this._box.scaleY = _box.scaleY;

        }


        this._filters = opts.filters !== undefined ? opts.filters : true;

        this._list = list || [];


        //触摸事件的dom元素
        let _touchDom = opts.dom !== undefined ? $(opts.dom)[0] : $('body')[0];
        this._time = opts.time !== undefined ? opts.time : 0.5;

        /**
         * 是否锁定
         * @type {boolean}
         */
        this.lock = false;

        //是否运动中
        this._movieing = false;

        //左消失
        let _beforeOut = _box.beforeOut;
        this._beforeOut = _beforeOut;
        //右消失
        let _afterOut = _box.afterOut;
        this._afterOut = _afterOut;

        if (!_afterOut || !_beforeOut) {

            console.warn('消失参考容器不能为空');
            return;

        }

        //参考排列
        let _referenceArr = [];
        this._referenceArr = _referenceArr;

        for (let i = 0; i < _showNum; i++) {

            let _rf = _box['mc' + i];

            if (!_rf) {

                console.warn('显示对象参考皮肤错误 mc:', i);
                return;

            }
            _rf.parent.removeChild(_rf);
            _rf.visible = false;

            _referenceArr.push(_rf);

        }

        this._vertical = opts.vertical !== undefined ? opts.vertical : false;
        //触摸
        touch.on(_touchDom, 'swipeleft', function () {

            if (!_self._vertical) _self.next();

        });
        touch.on(_touchDom, 'swiperight', function () {

            if (!_self._vertical) _self.previous();

        });
        touch.on(_touchDom, 'swipedown', function () {

            if (_self._vertical) _self.previous();

        });
        touch.on(_touchDom, 'swipeup', function () {

            if (_self._vertical) _self.next();

        });

        this._galleryAnnularLoopManager = new GalleryAnnularLoopManager(null, _showNum);

        this._initBool = false;
        this._autoInit = opts.autoInit !== undefined ? opts.autoInit : true;
        if (this._autoInit) this._init();

    }

    /**
     * 初始化
     */
    _init() {

        if (this._initBool) return;
        this._initBool = true;

        var _self = this;

        // console.log('_init');
        //清空显示容器
        this._box.removeAllChildren();

        //监听事件
        this._galleryAnnularLoopManager.on('update', this._updata, this);
        //初始化数据
        this._galleryAnnularLoopManager.initData(this._list);
    }

    /**
     * 初始化数据
     * @param {array} list 初始化显示对象列表
     */
    initList(list) {

        this._list = list;
        this._box.removeAllChildren();
        this._galleryAnnularLoopManager.initData(this._list);

    }

    /**
     * 设置选择显示对象
     * @param {number|*} value
     */
    select(value) {
        if (this.lock) return;
        if (this._movieing) return;
        console.log('select:', value);
        this._galleryAnnularLoopManager.select(value);
    }

    _updata(e) {

        if (!e) return;
        if (this._movieing) return;
        this._movieing = true;
        let i, _mc, _rf, _nows, _olds;
        let _box = this._box;
        let _self = this;
        let _spaceNum = this._galleryAnnularLoopManager.spaceNum;

        // console.log('_updata:',_spaceNum, e);

        if (e.isInit) {

            _box.removeAllChildren();
            _nows = e.now;
            for (i = 0; i < _nows.length; i++) {
                _mc = _nows[i];
                if (_mc) {
                    _rf = this._referenceArr[i];
                    if (_rf.parent) _rf.parent.removeChild(_rf);
                    _mc.scaleX = _rf.scaleX;
                    _mc.scaleY = _rf.scaleY;
                    _mc.x = _rf.x;
                    _mc.y = _rf.y;

                    //是否更新滤镜
                    if (this._filters) this._upFilters(_mc, _rf);
                    _box.addChild(_mc);
                    if (i < _spaceNum) _mc._swapIndex = i;
                    else if (i == _spaceNum) _mc._swapIndex = _spaceNum + 2;
                    else _mc._swapIndex = _spaceNum + (_spaceNum - i);
                    // console.log(_mc._swapIndex);
                }
            }
            //显示层级排列
            _box.sortChildren(this._sortSwapIndexFunction);
            this._movieing = false;

        } else {

            _nows = e.now;
            _olds = e.old;
            let _time = this._time;
            let _outMc = e.direction ? this._beforeOut : this._afterOut;
            let _inMc = e.direction ? this._afterOut : this._beforeOut;

            //对原显示对象做运动
            for (i = 0; i < _olds.length; i++) {
                _mc = _olds[i];

                _mc._swapIndex = -_spaceNum * 5;
                if (_nows.indexOf(_mc) === -1 && _mc) {
                    JT.to(_mc, _time, {
                        x: _outMc.x,
                        y: _outMc.y,
                        alpha: _outMc.alpha,
                        scaleX: _outMc.scaleX,
                        scaleY: _outMc.scaleY,
                        onEnd: function (temp) {
                            if (temp.parent) temp.parent.removeChild(temp);
                        },
                        onEndParams: [_mc],
                    });
                }
            }

            for (i = 0; i < _nows.length; i++) {
                _mc = _nows[i];
                _rf = this._referenceArr[i];
                if (_rf.parent) _rf.parent.removeChild(_rf);
                //是否更新滤镜
                if (this._filters) this._upFilters(_mc, _rf);

                if (_olds.indexOf(_mc) === -1) {

                    JT.set(_mc, {
                        x: _inMc.x,
                        y: _inMc.y,
                        alpha: _inMc.alpha,
                        scaleX: _inMc.scaleX,
                        scaleY: _inMc.scaleY
                    });
                    _box.addChild(_mc);

                }

                JT.to(_mc, _time, {
                    x: _rf.x,
                    y: _rf.y,
                    alpha: _rf.alpha,
                    scaleX: _rf.scaleX,
                    scaleY: _rf.scaleY,
                    onEnd: function (value) {
                        _self._movieEnd(value);
                    },
                    onEndParams: [i],
                });

                if (i < _spaceNum){
                    _mc._swapIndex = i;
                    _box.addChildAt(_mc,i)
                }
                else if (i == _spaceNum) {
                    _mc._swapIndex = _spaceNum + 2;
                    _box.addChildAt(_mc,_box.children.length-1)
                }
                else{
                    _mc._swapIndex = _spaceNum + (_spaceNum - i);
                    _box.addChildAt(_mc,_mc._swapIndex);
                }

                console.log(_mc._swapIndex);

            }

            //显示层级排列
            _box.sortChildren(this._sortSwapIndexFunction);

        }

        this.ds(e);
    }

    //根据层级进行排列算法
    _sortSwapIndexFunction(obj1, obj2, options) {
        if (obj1._swapIndex > obj2._swapIndex) {
            return 1;
        }
        if (obj1._swapIndex < obj2._swapIndex) {
            return -1;
        }
        return 0;
    }

    //动画播放完成
    _movieEnd(value) {
        //动画是否播放完成
        if (value === 1) {
            this._movieing = false;
            this.ds('movieEnd');
        }
    }

    _upFilters(mc, rf) {
        if (rf.filters && rf.filters.length >= 1) {
            mc.filters = rf.filters;
            if (mc.cacheCanvas) {
                mc.updateCache();
            } else {

                let _rect = rf.getBounds();
                _rect.width = _rect.width || rf.cacheCanvas.width;
                _rect.height = _rect.height || rf.cacheCanvas.height;
                mc.cache(_rect.x, _rect.y, _rect.width, _rect.height);
            }
        } else {
            mc.filters = [];
            mc.uncache();
        }
    }

    /**
     * 下一个
     */
    next() {
        if (this.lock) return;
        if (this._movieing) return;
        this._galleryAnnularLoopManager.next();
    }

    /**
     * 上一个
     */
    previous() {
        if (this.lock) return;
        if (this._movieing) return;
        this._galleryAnnularLoopManager.previous();
    }

    /**
     * 显示数据列表
     * @return {array}
     */
    get list() {
        return this._list;
    }

    /**
     * 当前显示的对象
     * @return {number}
     */
    get selectObj() {
        return this._galleryAnnularLoopManager.selectObj;
    }

    /**
     * 当前数据索引
     * @return {number}
     */
    get index() {
        return this._galleryAnnularLoopManager.index;
    }

    /**
     * 逻辑管理器
     * @return {ds.gemo.GalleryAnnularLoopManager}
     */
    get manager() {
        return this._galleryAnnularLoopManager;
    }

    /**
     * 是否运动中
     * @return {boolean}
     */
    get movieing() {
        return this._movieing
    }

    /**
     * 显示多个内容
     * @return {number}
     */
    get showNum() {
        return this._showNum;
    }

}

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
ds.createjs = ds.createjs || {};
ds.createjs.GalleryLooper = GalleryLooper;

export default GalleryLooper;