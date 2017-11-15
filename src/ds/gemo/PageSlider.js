import EventDispatcher from '../core/EventDispatcher';

const _scenesTouchstart = Symbol("_scenesTouchstart");
const _scenesTouchmove = Symbol("_scenesTouchmove");
const _scenesTouchend = Symbol("_scenesTouchend");

/**
 * 平滑touch滑动
 *
 * @class
 * @classdesc 平滑touch基础实现:可以用在很多地方，页面滑动翻页，360画廊浏览等等。
 * - 惯性滑动与滑动后自运动，根据实际需求自行实现
 * - 快速便捷触摸运动方案 还可使用 [AlloyTouch](https://github.com/AlloyTeam/AlloyTouch)
 * @memberof ds.gemo
 * @author: maksim email:maksim.lin@foxmail.com
 *
 */
class PageSlider extends EventDispatcher {


    /**
     *
     * @param {HTMLElement|string} touchDom touch触发的dom对象
     * @param {object} opts  配置
     * @param {number} [opts.limit=10]  touch滑动灵敏度判断
     * @param {boolean} [opts.lock=false]  是否锁定
     */
    constructor(touchDom, opts) {

        super();

        this.scenes = $(touchDom);

        //开始Y
        this._startY = 0;
        //结束Y
        this._endY = 0;
        //开始X
        this._startX = 0;
        //结束X
        this._endX = 0;
        //改变X
        this._diffX = 0;
        //改变Y
        this._diffY = 0;
        //判断方向的最小滑动距离
        this._limit = 10;

        //是否上下滑动
        this._upright = false;
        //是否左右滑动
        this._level = false;
        //是否正在滑动
        this._sliding = false;
        //是否扑捉到touch
        this._capture = false;
        //记录touch的id
        this._touchid = null;

        //开始touch时间
        this._startTime = null;

        /**
         * 是否锁定
         * @type {boolean}
         */
        this.lock = false;


        opts = opts || {};

        if (opts.limit) this._limit = opts.limit;
        if (opts.lock !== undefined) this.lock = opts.lock;

        this[_scenesTouchstart] = scenesTouchstart.bind(this);
        this.scenes.on('touchstart', this[_scenesTouchstart]);

        this[_scenesTouchmove] = scenesTouchmove.bind(this);
        this.scenes.on('touchmove', this[_scenesTouchmove]);



        this[_scenesTouchend] = scenesTouchend.bind(this);
        this.scenes.on('touchend', this[_scenesTouchend]);
        this.scenes.on('touchcancel', this[_scenesTouchend]);


    }

    /**
     * 开启惯性滑动，具体惯性逻辑需要自行实现。这个方法会阻止之后touch，在惯性逻辑完成后需要执行 closeInertialSlider();
     */
    openInertialSlider() {
        this._sliding = true;
        this._capture = false;
    }

    /**
     * 关闭惯性滑动
     */
    closeInertialSlider() {
        this._sliding = true;
        this._capture = false;
    }


}

function scenesTouchstart(e) {



    // console.log('scenesTouchstart');
    if (this.lock) return;

    let _targetTouches = e.targetTouches || e.originalEvent.targetTouches;
    let _touch = _targetTouches[0];
    // console.log(touch.identifier,_touchid);

    if (this._touchid === null) this._touchid = _touch.identifier;
    if (this._touchid !== _touch.identifier) return;

    // let target = $(e.target);

    if (this._capture) return;

    if (!this._sliding) {

        this._capture = true;

        this._startTime = new Date().getTime();

        this._startY = _touch.pageY;
        this._startX = _touch.pageX;
        this._endY = 0;
        this._endX = 0;
        this._diffY = 0;
        this._diffX = 0;
        this._level = false;
        this._upright = false;


        /**
         * 开始touch
         * @event ds.gemo.PageSlider#start
         * @property {number} startX - 开始的touch x点
         * @property {number} startY - 开始的touch y点
         * @property {number} mouseX - 开始的touch x点
         * @property {number} mouseY - 开始的touch y点
         * @property {number} startTime - 开始拖动时间
         */
        this.ds({
            type: 'start',
            startX: this._startX,
            startY: this._startY,
            mouseX: this._startX,
            mouseY: this._startY,
            startTime: this._startTime
        });

    }

}

function scenesTouchmove(e) {

    // console.log('scenesTouchmove:',e);


    if (this.lock) return;


    //console.log(sliding)
    let _targetTouches = e.targetTouches || e.originalEvent.targetTouches;
    let _touch = _targetTouches[0];

    if (this._touchid === null) this._touchid = _touch.identifier;
    if (this._touchid !== _touch.identifier) return;

    if (!this._sliding && this._capture) {

        e.preventDefault();

        this._endX = _touch.pageX;
        this._endY = _touch.pageY;

        this._diffX = this._endX - this._startX;
        this._diffY = this._endY - this._startY;

        if (!this._level && !this._upright) {

            if (Math.abs(this._diffX) >= this._limit && Math.abs(this._diffX) > Math.abs(this._diffY)) {

                this._level = true;
                this._upright = false;

            }
            else if (Math.abs(this._diffY) >= this._limit && Math.abs(this._diffX) < Math.abs(this._diffY)) {

                this._level = false;
                this._upright = true;

            }
            else {

                this._level = false;
                this._upright = false;

            }
        }

        /**
         * 运动中
         * @event ds.gemo.PageSlider#move
         * @property {boolean} level - 横向
         * @property {boolean} upright - 纵向
         * @property {number} diff - 运动偏移值
         */
        //如果是纵向滑动
        if (this._upright) {

            this._diffY = this._diffY > 0 ? (this._diffY - this._limit) : (this._diffY + this._limit);

            this.ds({
                type: 'move',
                level: false,
                upright: true,
                diff: this._diffY,
            });

        }
        //如果是横向滑动
        if (this._level) {

            this._diffX = this._diffX > 0 ? (this._diffX - this._limit) : (this._diffX + this._limit);

            this.ds({
                type: 'move',
                level: true,
                upright: false,
                diff: this._diffX,
            });

        }

    }

    /**
     * touchmove 事件
     * @event ds.gemo.PageSlider#touchmove
     * @property {object} oe - 原时间event对象
     * @property {number} mouseX - touch对象pageX
     * @property {number} mouseY - touch对象pageY
     */
    this.ds({
        type: 'touchmove',
        oe: e,
        mouseX: _touch.pageX,
        mouseY: _touch.pageY
    });

}

function scenesTouchend(e) {

    let _targetTouches = e.targetTouches || e.originalEvent.targetTouches;
    let _touch = _targetTouches[0];

    if (_touch && _touch.identifier && this._touchid !== _touch.identifier) return;

    this._touchid = null;


    let _endTime = new Date().getTime();

    this._capture = false;


    /**
     * 拖动完成
     * @event ds.gemo.PageSlider#end
     * @property {boolean} level - 结束时候拖动方向是否横向
     * @property {boolean} upright - 结束时候拖动方向是否纵向
     * @property {number} endTime - 结束拖动时间
     * @property {number} startTime - 开始拖动时间
     */
    this.ds({
        type: 'end',
        level: this._level,
        upright: this._upright,
        endTime: _endTime,
        startTime: this._startTime,
    });

}


let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
ds.gemo = ds.gemo || {};
ds.gemo.PageSlider = PageSlider;

export default PageSlider;