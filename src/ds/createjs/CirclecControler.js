import EventDispatcher from '../core/EventDispatcher';
import Triangle from '../utils/Triangle';
import {getDefault} from '../utils/Mixin';

/**
 * 画圈控制播放进度控制器
 * @class
 * @memberof ds.createjs
 */
class CirclecControler extends EventDispatcher {
    /**
     * 构造函数
     * @param display 显示对象
     * @param opts
     * @param opts.debug
     * @param opts.value
     * @param opts.min
     * @param opts.max
     */
    constructor(display, opts) {
        super();

        opts = opts || {};

        this._debug = getDefault(opts.debug, false);
        this._value = getDefault(opts.value, 0);
        this._min = getDefault(opts.min, 0);
        this._max = getDefault(opts.max, 360);
        this._color = getDefault(opts.color, '#fff');


        this._touchObj = display;
        let _touchObj = this._touchObj;

        this._shape = new createjs.Shape();
        let _g = this._shape.graphics;
        this._shapeLine = new createjs.Shape();

        this._shapeLine.shadow = this._shape.shadow = new createjs.Shadow("#000000", 5, 5, 10);


        //开始点
        this._startPt;

        //判断方向的最小滑动距离
        this._limit = 10;

        this._lock = false;

        this._stage;
        //记录第一次点击下去点与点之间夹角
        this._angleStart = null;
        //记录上一次角
        this._angleOld = null;
        //记录角度变化差值
        this._diffAngle = 0;


        this._pointerID = null;

        _touchObj.on('mousedown', this._mousedown, this);

    }

    /**
     * 控制角度值
     * @return {*}
     */
    get value() {
        return this._value;
    }

    set value(value) {
        if (this._lock) return;
        value = Math.min(this.max, Math.max(this.min, value));
        if (this._value === value) return;
        this._value = value;
    }

    /**
     * 锁定
     * @return {boolean}
     */
    get lock() {
        return this._lock;
    }

    set lock(bool) {
        if (this._lock === bool) return;
        this._lock = bool;
        if (this.lock) {
            let _stage = this._stage;
            let _shape = this._shape;
            let _shapeLine = this._shapeLine;
            if (_shape.parent) _shape.parent.removeChild(_shape);
            if (_shapeLine.parent) _shapeLine.parent.removeChild(_shapeLine);
            if (!_stage) return;
            this._pointerID = null;
            _stage.off('stagemousemove', this._stagemousemove);
            _stage.off('stagemouseup', this._stagemouseup);


        }
    }

    /**
     * 最小值
     * @param value
     */
    set min(value) {
        if (this._min === value) return;
        this._min = value;
        if (this._value <= this._min) this._value = this._min;
    }

    get min() {
        return this._min;
    }

    /**
     * 最大值
     * @param value
     */
    set max(value) {
        if (this._max === value) return;
        this._max = value;
        if (this._value >= this._max) this._value = this._max;
    }

    get max() {
        return this._max;
    }

    _mousedown(e) {

        if (this._lock) return;
        if (this._pointerID && this._pointerID === e.pointerID) return;
        this._pointerID = e.pointerID;
        let _touchObj = this._touchObj;
        let _stage = this._touchObj.stage;
        this._stage = _stage;
        let _shape = this._shape;
        let _g = _shape.graphics;
        _g.clear();
        // _g.beginFill(this._color);
        _g.beginStroke(this._color).setStrokeStyle(1);
        _g.drawCircle(0, 0, 10);
        this._shapeLine.graphics.clear();
        let _shapeLine = this._shapeLine;

        if (!_stage) return;
        _stage.on('stagemousemove', this._stagemousemove, this);
        _stage.on('stagemouseup', this._stagemouseup, this);
        // let _pt=new createjs.Point(_stage.mouseX,_stage.mouseY);
        let _pt = _touchObj.globalToLocal(_stage.mouseX, _stage.mouseY);
        this._startPt = _pt;

        this._angleStart = null;
        this._angleOld = null;
        this._diffAngle = 0;

        if (this._debug) {
            _shapeLine.x = _shape.x = _pt.x;
            _shapeLine.y = _shape.y = _pt.y;
            _touchObj.addChild(_shape);
            _touchObj.addChild(_shapeLine);
        }

        this.ds({type: 'start'});

    }

    _stagemousemove(e) {
        if (this._lock) return;
        let _touchObj = this._touchObj;
        let _stage = this._touchObj.stage;
        let _shape = this._shape;
        let _shapeLine = this._shapeLine;
        let _g = _shapeLine.graphics;
        if (!_stage) return;
        if (this._pointerID && this._pointerID !== e.pointerID) return;

        let _pt = _touchObj.globalToLocal(_stage.mouseX, _stage.mouseY);
        let _lpt = _shapeLine.globalToLocal(_stage.mouseX, _stage.mouseY);

        _g.clear();
        _g.beginStroke(this._color).setStrokeStyle(1).moveTo(0, 0);
        _g.lineTo(_lpt.x, _lpt.y);
        _g.drawCircle(_lpt.x, _lpt.y, 30);


        let _diffX = _pt.x - this._startPt.x;
        let _diffY = _pt.y - this._startPt.y;


        if ((Math.abs(_diffX) >= this._limit) || (Math.abs(_diffY) >= this._limit)) {
            let _angle = Triangle.pointToAngle(this._startPt, _pt);
            _angle = Triangle.fixAngle(_angle);
            if (!this._angleStart) {
                this._angleStart = _angle;
                this._angleOld = _angle;
            } else {
                let _diffA;
                if (this._angleOld >= 270 && _angle <= 90) {
                    _diffA = 360 - this._angleOld + _angle;
                }
                else if (this._angleOld <= 90 && _angle >= 270) {
                    _diffA = _angle - 360 - this._angleOld;
                } else {
                    _diffA = _angle - this._angleOld;
                }

                // console.log(this._angleOld,_angle);
                this._angleOld = _angle;
                // console.log(this._startAngle,_diffA,(this._diffAngle+_diffA));
                this._diffAngle += _diffA;

                let _value = this._value + _diffA;
                this._value = Math.min(this.max, Math.max(this.min, _value));

                this.ds({
                    type: 'update',
                    diff: this._diffAngle,
                    value: this._value,
                });
            }


        }


    }

    _stagemouseup(e) {
        if (this._lock) return;
        let _stage = this._stage;
        let _shape = this._shape;
        let _shapeLine = this._shapeLine;
        if (_shape.parent) _shape.parent.removeChild(_shape);
        if (_shapeLine.parent) _shapeLine.parent.removeChild(_shapeLine);
        if (!_stage) return;
        if (this._pointerID && this._pointerID !== e.pointerID) return;
        this._pointerID = null;
        _stage.off('stagemousemove', this._stagemousemove);
        _stage.off('stagemouseup', this._stagemouseup);


        this.ds({type: 'end'});
    }
}

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
ds.createjs = ds.createjs || {};
ds.createjs.CirclecControler = CirclecControler;

export default CirclecControler;