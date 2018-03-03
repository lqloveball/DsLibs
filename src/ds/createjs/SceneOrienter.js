import EventDispatcher from '../core/EventDispatcher';
import {getDefault} from '../utils/Mixin';
import Orienter from '../gemo/Orienter';

/**
 * 空间陀螺仪运动与拖动结合控制
 * 适合需要控制两侧角度值限制的
 * |----------------------|
 * |          |           |
 * |          |           |
 * |   lonPrs |           |
 * |   -1-0   |       0-1 |
 * |----------------------|
 * \          |          /
 *   \        |        /
 *     \      |      /
 *       \    |    /  angle 0-60°
 *
 */
class SceneOrienter extends EventDispatcher {

    /**
     *
     * @param target 目标控制对象
     * @param moveWidth 平移距离
     * @param opts
     * @param opts.angle=60  角度
     * @param opts.direction=true  方向
     * @param opts.regPt={x: 0, y: 0}  注册点
     * @param opts.stage=null  舞台stage对象
     * @param opts.touchRect={
            width: window.innerWidth,
            height: window.innerHeight,
        }  拖拽计算宽高
     */
    constructor(target, moveWidth, opts) {

        super();

        opts = opts || {};


        /**
         * 记录设备陀螺仪变量
         * @type {{lon: number, lat: number}}
         */
        this.devicer = {
            lon: 0,
            lat: 0,
        };

        this._lon = 0;
        this._lat = 0;

        this._isTouch = false;
        this._touchid = null;
        this._startPt = null;

        //陀螺仪控制器
        this._orienter = new Orienter();
        this._orienter.on('orient', (e) => {
            this._orient(e);
        });

        this._orienter.init();

        //陀螺仪偏移的角度
        this._angle = getDefault(opts.angle, 60);
        //方向
        this._direction = getDefault(opts.direction, true);
        //注册点
        this._regPt = getDefault(opts.regPt, {x: 0, y: 0});
        //舞台
        this._stage = getDefault(opts.stage, null);
        //移动距离
        this.moveWidth = moveWidth;

        this.touchRect = getDefault(opts.touchRect, {
            width: window.innerWidth,
            height: window.innerHeight,
        });

        /**
         * 进行运动的场景
         */
        this.scene = target;

        this.scene.on('mousedown', (e) => {
            if (!this.hasTouch) return;
            this._mousedown(e);
        });

        /**
         * 是否锁定
         * @type {boolean}
         */
        this.lock = false;

        this._hasTouch = true;
    }

    /**
     * 是否拥有touch拖拽
     * @type {boolean}
     */
    set hasTouch(bool) {
        this._hasTouch=bool;
        if(!this._hasTouch){
            this._startPt = null;
            this._touchid = null;
            this._isTouch = false;
        }
    }

    get hasTouch() {
        return this._hasTouch;
    }

    /**
     * 点击按下时候
     * @param e
     * @private
     */
    _mousedown(e) {

        if (this.lock) return;
        if (this._touchid && this._touchid !== e.pointerID) return;
        this._touchid = e.pointerID;
        this._isTouch = true;
        if (!this._stage) {
            this._stage = e.target.stage;
        }
        let _stage = this._stage;
        _stage.on('stagemousemove', this._stagemousemove, this);
        _stage.on('stagemouseup', this._stagemouseup, this);
        let _scene = this.scene;

        let _pt = _scene.globalToLocal(_stage.mouseX, _stage.mouseY);

        //倒推出当前角度值
        let _lon = ((_scene.x - this._regPt.x) / this.moveWidth) * this._angle;

        _pt.lon = _lon;
        _pt.lat = this._lat;
        this._startPt = _pt;

        JT.killAll(_scene);

    }

    /**
     * 拖动
     * @param e
     * @private
     */
    _stagemousemove(e) {

        if (this.lock) return;
        if (this._touchid && this._touchid !== e.pointerID) return;

        let _stage = this._stage;
        let _scene = this.scene;

        let _endPt = _scene.globalToLocal(_stage.mouseX, _stage.mouseY);

        let _diffX = _endPt.x - this._startPt.x;
        let _diffY = _endPt.y - this._startPt.y;

        let _refW = this.touchRect.width / 2;
        let _refH = this.touchRect.height / 2;

        let _prsX = _diffX / _refW;
        let _prsY = _diffY / _refH;

        let _angle = this._angle;

        //处理Y轴
        let _diffLon = Math.round((_angle) * _prsX);
        let _lon = this._startPt.lon + _diffLon;
        this._lon = Math.min(_angle, Math.max(-_angle, _lon));
        let _lonPrs = this._lon / this._angle;

        // console.log('_lonPrs:',_lonPrs);

        JT.to(_scene, 0.3, {x: this._regPt.x + (this.moveWidth * _lonPrs)});

        /**
         * 更新状态
         * @event ds.gemo.SceneOrienter#update
         * @property {number} progress - 角度偏移百分比
         * @property {number} angle - 角度偏移百分比
         */
        this.ds({
            type: 'update',
            lonPrs: _lonPrs,
            lon: this._lon,
        });

    }


    /**
     * 结束拖动
     * @param e
     * @private
     */
    _stagemouseup(e) {
        if (this._touchid && this._touchid !== e.pointerID) return;
        this._startPt = null;
        this._touchid = null;
        this._isTouch = false;
    }

    /**
     * 陀螺仪事件
     * @param e
     * @private
     */
    _orient(e) {

        let _olon = this.devicer.lon;
        let _olat = this.devicer.lat;

        let _lat = this.devicer.lat = e.lat;
        let _lon = this.devicer.lon = e.lon;

        if (this.lock) return;
        if (this._isTouch) return;

        //处理Y轴
        let _diffLon;
        if (_olon >= 270 && _lon <= 90) {
            _diffLon = 360 - _olon + _lon;
        }
        else if (_olon <= 90 && _lon >= 270) {
            _diffLon = _lon - 360 - _olon;
        } else {
            _diffLon = _lon - _olon;
        }
        let _angle = this._angle;
        _lon = this._lon + _diffLon;
        this._lon = Math.min(_angle, Math.max(-_angle, _lon));
        let _lonPrs = this._lon / this._angle;

        //TODO 处理X轴


        let _scene = this.scene;
        JT.to(_scene, 0.2, {x: this._regPt.x + (this.moveWidth * _lonPrs)});
        /**
         * 更新状态
         * @event ds.gemo.SceneOrienter#update
         * @property {number} progress - 角度偏移百分比
         * @property {number} angle - 角度偏移百分比
         */
        this.ds({
            type: 'update',
            lonPrs: _lonPrs,
            lon: this._lon,
        });

    }
}

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
ds.createjs = ds.createjs || {};
ds.createjs.SceneOrienter = SceneOrienter;

export default SceneOrienter;