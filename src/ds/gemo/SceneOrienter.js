import EventDispatcher from '../core/EventDispatcher';
import {getDefault} from '../utils/Mixin';
import Orienter from './Orienter';


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
     * 构造函数
     * @param touchDom
     * @param opts
     */
    constructor(touchDom, opts) {

        super();

        opts = opts || {};


        this._lock = false;


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

        //touch对象
        this._touchDom = $(touchDom);

        this._touchDom[0].addEventListener('touchstart', (e) => {
            this._scenesTouchstart(e);
        }, false);

        this._touchDom[0].addEventListener('touchmove', (e) => {
            this._scenesTouchmove(e);
        }, false);

        this._touchDom[0].addEventListener('touchend', (e) => {
            this._scenesTouchend(e);
        }, false);

        this._touchDom[0].addEventListener('touchcancel', (e) => {
            this._scenesTouchend(e);
        }, false);

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
        this._direction = getDefault(opts.direction, true);


        this._debugDom = $('#debug');

        this.lock = false;

    }

    /**
     * 锁定
     * @type {boolean}
     */
    get lock() {
        return this._lock;
    }

    set lock(value) {
        this._lock = value;
    }

    _scenesTouchstart(e) {

        if (this.lock) return;
        let _targetTouches = e.targetTouches || e.originalEvent.targetTouches;
        let _touch = _targetTouches[0];
        if (this._touchid === null) this._touchid = _touch.identifier;
        if (this._touchid !== _touch.identifier) return;

        this._startPt = {
            x: _touch.pageX, y: _touch.pageY,
            lon: this._lon,
            lat: this._lat,
        };


        this._isTouch = true;

        // let _val = '';
        // _val += '_scenesTouchstart:' + this._touchid + '<br>';
        // this._debugDom.html(_val);

    }

    _scenesTouchmove(e) {

        if (this.lock) return;
        let _targetTouches = e.targetTouches || e.originalEvent.targetTouches;
        let _touch = _targetTouches[0];
        if (this._touchid === null) this._touchid = _touch.identifier;
        if (this._touchid !== _touch.identifier) return;

        let _endPt = {x: _touch.pageX, y: _touch.pageY};

        let _diffX = _endPt.x - this._startPt.x;
        let _diffY = _endPt.y - this._startPt.y;

        let _refW = window.innerWidth;
        let _refH = window.innerWidth;

        let _prsX = _diffX / _refW;
        let _prsY = _diffY / _refH;


        let _angle = this._angle;
        //处理Y轴
        let _diffLon = Math.round((_angle) * _prsX);
        let _lon = this._startPt.lon + _diffLon;
        this._lon = Math.min(_angle, Math.max(-_angle, _lon));
        let _lonPrs = this._lon / this._angle;

        //TODO 处理X轴

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

        // let _val = '';
        // _val += '_scenesTouchmove:' + this._touchid + '<br>';
        // _val += '_startPt.x:' + this._startPt.x + '<br>';
        // _val += '_endPt.x:' + _endPt.x + '<br>';
        // _val += '_diffX:' + _diffX + '<br>';
        // _val += '_prsX:' + _prsX + '<br>';
        // _val += '_lonPrs:' + _lonPrs + '<br>';
        // _val += 'this._lon:' + this._lon + '<br>';
        // this._debugDom.html(_val);

    }

    _scenesTouchend(e) {

        if (this.lock) return;
        this._debugDom.html('_scenesTouchend');
        let _targetTouches = e.targetTouches || e.originalEvent.targetTouches;
        let _touch = _targetTouches[0];

        if (_touch && _touch.identifier && this._touchid !== _touch.identifier) return;

        this._startPt = null;
        this._touchid = null;
        this._isTouch = false;

        // let _val = '';
        // _val += '_scenesTouchend:' + this._touchid + '<br>';
        // this._debugDom.html(_val);

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
ds.gemo = ds.gemo || {};
ds.gemo.SceneOrienter = SceneOrienter;

export default SceneOrienter;