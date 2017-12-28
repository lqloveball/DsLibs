import EventDispatcher from '../core/EventDispatcher';
import PageSlider from  './PageSlider';

const _upDateFrame = Symbol("_upDateFrame");

/**
 * 平滑滑动改变距离
 * @class
 * @classdesc
 * @memberof ds.gemo
 * @author: maksim email:maksim.lin@foxmail.com
 */
class SliderDistance extends EventDispatcher {

    /**
     * 构造函数
     * @param {*} target 目标变化对象
     * @param {string} key 目标变化对象 滑动影响的参数值
     * @param {object} opts 参数
     * @param {number} [opts.type='v'] touch触发 是横向 还是纵向
     * - 'v' 纵向
     * - 'h' 横向
     * @param {number} [opts.interval=2000] 间隔值,滑动变化元素与元素之间距离间隔值
     * @param {number} [opts.max=10000] 最大距离值
     * @param {number} [opts.min=0] 最小距离值
     * @param {number} [opts.distance=opts.min] 默认初始化距离值
     * @param {number} [opts.minSpeed=0] 最小运动速度
     * @param {number} [opts.maxSpeed=10] 最大运动速度
     * @param {number} [opts.speed=2] 运动速度
     * @param {number} [opts.failure=0] 运动衰竭因子，设置成自运动过程中加速度会慢慢衰竭(speed-failure*speed)。 衰竭值设置在0-1之间 0是不衰竭 大于0才会衰竭。
     * @param {boolean} [opts.touchDirection=true] 设置touch方向触发值`递增`还是`递减`
     * @param {boolean} [opts.hasAutoMovie=true] 是否自动运动动画
     * @param {boolean} [opts.autoMovieing=true] 是否激活自动运动动画
     * @param {boolean} [opts.loop=true] 是否循环计算
     * @param {boolean} [opts.reverse=false] 是否反向赋值
     * @param {boolean} [opts.lock=false] 是否锁定
     * @param {HTMLElement} [opts.touchDom=$('body')] 是否反向赋值
     */
    constructor(target, key, opts) {

        super();

        opts = opts || {};

        /**
         * 目标变化对象
         */
        this.target = target;

        /**
         * 目标变化对象 滑动影响的参数值
         */
        this.key = key;

        /**
         * 间隔值,滑动变化元素与元素之间距离间隔值
         * @type {number}
         */
        this.interval = opts.interval !== undefined ? opts.interval : 2000;

        //记录开始时候的距离值
        this._touchStartDistance = 0;

        //记录触摸开始时间
        this._touchStartTime = 0;

        /**
         * 设置touch方向触发值`递增`还是`递减`
         * @type {boolean}
         * @default true
         */
        this.touchDirection = opts.touchDirection !== undefined ? opts.touchDirection : true;


        /**
         * 最大距离
         * @type {number}
         * @default 10000
         */
        this.max = opts.max !== undefined ? opts.max : 10000;

        /**
         * 最小距离
         * @type {number}
         * @default 0
         */
        this.min = opts.min !== undefined ? opts.min : 0;

        //初始化距离值
        this._distance = opts.distance !== undefined ? opts.distance : this.min;

        /**
         * 最大运动速度
         * @type {number}
         * @default 80
         */
        this.maxSpeed = opts.maxSpeed !== undefined ? opts.maxSpeed : 10;
        /**
         * 最小运动速度
         * @type {number}
         * @default 0
         */
        this.minSpeed = opts.minSpeed !== undefined ? opts.minSpeed : 0;
        /**
         * 当前运动加速度
         * @type {number}
         * @default 2
         */
        this.speed = opts.speed !== undefined ? opts.speed : 2;

        /**
         * 是否自动运动动画
         * @type {boolean}
         * @default true
         */
        this.hasAutoMovie = opts.hasAutoSpeed !== undefined ? opts.hasAutoSpeed : true;

        //是否自动运动动画中
        this._autoMovieing = opts.autoMovieing !== undefined ? opts.autoMovieing : false;

        /**
         * 运动衰竭因数，设置成自运动过程中加速度会慢慢衰竭(speed-failure*speed)。 衰竭值设置在0-1之间 0是不衰竭 大于0才会衰竭。
         * @type {number}
         * @default 0
         */
        this.failure = opts.failure !== undefined ? opts.failure : 0;

        /**
         * touch触发 是横向 还是纵向
         * - 'v' 纵向
         * - 'h' 横向
         * @type {string}
         * @default 'v'
         */
        this.type = opts.type !== undefined ? opts.type : 'v';
        /**
         * 循环计算 在360 galley 这样类型应用中会用到
         * @type {boolean}
         * @default true
         */
        this.loop = opts.loop !== undefined ? opts.loop : false;

        /**
         * 是否反向赋值
         * @type {boolean}
         */
        this.reverse = opts.reverse !== undefined ? opts.reverse : false;

        //计算拖拽计算距离 一般使用window宽或者高
        if (opts.touchDistance) this._touchDistance = opts.touchDistance;
        else this._touchDistance = (this.type == 'v') ? window.innerHeight : window.innerWidth;

        //进行拖拽用dom元素
        this._touchDom = opts.touchDom !== undefined ? $(opts.touchDom) : $('body');

        //是否在运动中
        this._tweening = false;

        this._lock = opts.lock !== undefined ? opts.lock : false;

        /**
         * 平滑拖动处理对象
         * @type {ds.gemo.PageSlider}
         */
        this.slider = new PageSlider(this._touchDom);

        // this[_sliderTouchStart] = sliderTouchStart.bind(this);
        // this[_sliderTouchMovie] = sliderTouchMovie.bind(this);
        // this[_sliderTouchEnd] = sliderTouchEnd.bind(this);

        this.slider.on('start', this._sliderTouchStart,this);
        this.slider.on('move', this._sliderTouchMovie,this);
        this.slider.on('end', this._sliderTouchEnd,this);

        this[_upDateFrame] = updateFrame.bind(this);
        this[_upDateFrame]();

    }

    get lock() {
        return this._lock;
    }

    set lock(value) {

        this._lock = value;
        this._autoMovieing = false;

        this[_upDateFrame]();

    }

    set minSpeed(value) {

        if (value <= 0) value = 0;
        this._minSpeed = value;

    }

    get minSpeed() {

        return this._minSpeed;

    }

    set failure(value) {

        if (value <= 0) value = 0;
        if (value >= 1) value = 1;
        this._failure = value;

    }

    get failure() {

        return this._failure;

    }

    _sliderTouchStart(e) {

        this._touchStartDistance = this.target[this.key];

        if (this.reverse) this._touchStartDistance = -this._touchStartDistance;
        this._distance = this._touchStartDistance;
        // console.log('sliderTouchStart touchStartDistance:',this._touchStartDistance);
        //运动中不做
        if (this._tweening) return;
        //锁住不做更改
        if (this.lock) return;

        /**
         * 开始touch
         * @event ds.gemo.SliderDistance#start
         *
         */
        this.ds('start');

        //设置不自运动
        this._autoMovieing = false;
        this._touchStartTime = new Date().getTime();

    }

    _sliderTouchMovie(e) {

        // console.log('_sliderTouchMovie');
        //运动中不做
        if (this._tweening) return;
        //锁住不做更改
        if (this.lock) return;

        if (this.type == 'v') {
            //只计算纵向滚动 不是上下滑动忽略
            if (!e.upright) return;
        } else {
            //只计算横向滚动 不是横向滚动忽略
            if (!e.level) return;
        }

        if (this._touchStartDistance === null) this._touchStartDistance = this.target[this.key];

        this._autoMovieing = false;

        //偏移量
        let _diff;
        _diff = this.touchDirection ? e.diff : -e.diff;

        // console.log(_diff);


        //计算偏移的百分比
        let _diffPercent = _diff / this._touchDistance; //滑动方向偏移量
        //偏移的百分比正数
        let _percent = Math.abs(_diffPercent);

        //计算距离
        let _distance = this._touchStartDistance + this.interval * _diffPercent;

        // console.log(_diff,_diffPercent,_distance);

        this._distance = _distance;

        if (this.loop) {
            if (this._distance < this.min) this._distance = this.max - (this.min - this._distance);
            if (this._distance > this.max) this._distance = this.min + (this._distance - this.max);
        } else {
            if (this._distance <= this.min) this._distance = this.min;
            if (this._distance > this.max) this._distance = this.max;
        }

        /**
         * 拖动中
         * @event ds.gemo.SliderDistance#move
         */
        this.ds('move');

        this.distanceUpdate();

    }

    _sliderTouchEnd(e) {

        if (this.lock) {

            this._touchStartDistance = null;
            return;

        }

        if (this.hasAutoMovie) this.sliderEndAutoMove();

        /**
         * 拖动完成
         * @event ds.gemo.SliderDistance#end
         */
        this.ds('end');
    }


    distanceUpdate() {

        if (!this.loop) {
            /**
             * 到最小距离
             * @event ds.gemo.SliderDistance#toMin
             * @property {number} value - 当前距离值
             */
            if (this._distance <= this.min) this.ds({type: 'toMin', value: this._distance});
            /**
             * 到最大距离
             * @event ds.gemo.SliderDistance#toMax
             * property {number} value - 当前距离值
             */
            if (this._distance >= this.max) this.ds({type: 'toMax', value: this._distance});
        }

        // console.log(this.target[this.key]);
        if (this.target && this.target[this.key]!==undefined) {

            if (this.reverse) this.target[this.key] = -this._distance;
            else this.target[this.key] = this._distance;

        }

        /**
         * 距离更新
         * @event ds.gemo.SliderDistance#update
         * @property {number} value - 当前距离值
         */
        this.ds({type: 'update', value: this._distance});

    }

    sliderEndAutoMove() {

        let _time = new Date().getTime() - this._touchStartTime;
        let _dc = this._touchStartDistance - this._distance;
        //判断方向
        let _bool = this._touchStartDistance < this._distance ? true : false;

        if (this.loop) {

            if (this._touchStartDistance <= this.min + this.interval && this._distance >= this.max - this.interval) _bool = !_bool;
            if (this._touchStartDistance >= this.max - this.interval && this._distance <= this.min + this.interval) _bool = !_bool;

        }

        //判断拖动距离百分比
        let _pr = Math.abs(_dc / (this.touchDirection * 0.4));
        //百分比不能超过1
        if (_pr >= 1) _pr = 1;
        //计算速度
        let _speed = this.minSpeed + _pr * (this.maxSpeed - this.minSpeed);
        //最大速度判断
        _speed = Math.min(_speed, this.maxSpeed);
        //最小速度判断
        _speed = Math.max(_speed, this.minSpeed);

        if (_pr === 0) _speed = 0;

        // console.log('方向',_bool,_dc,_pr,_speed,_time);

        if (_time >= 600) {
            if (_bool) this.speed = this.minSpeed;
            else this.speed = -this.minSpeed;

        } else {
            if (_bool) this.speed = _speed;
            else this.speed = -_speed;
        }

        // console.log('sliderEndAutoMove:',this.speed);

        this._autoMovieing = true;
        this[_upDateFrame]();
        this._touchStartDistance = null;

        /**
         * 开始自动播放
         * @event ds.gemo.SliderDistance#autoMovie
         */
        this.ds('autoMovie');

    }

    /**
     * 控制距离运动
     * 有TweenMax会优先使用TweenMax引擎
     * @param {number} value 运动的距离值
     * @param {number} time 运动使用时间
     * @param {object} tweenData JT或者TweenMax引擎配置参数
     * @param {function} tweenData.end 运动完成后执行function
     *
     */
    tweenMovie(value, time, tweenData) {

        if (this._tweening) return;
        let _obj = {value: this._distance};
        let _oldLock = this.lock;

        this._autoMovieing = false;

        tweenData = tweenData || {};

        let _end = tweenData.end;
        tweenData.end = null;

        let _self=this;

        if (window['TweenMax']) {

            this._tweening = true;
            this.lock = true;
            tweenData.value = value;
            tweenData.onUpdate = function () {
                _self._distance = _obj.value;
                _self.distanceUpdate();
            };

            tweenData.onComplete = function () {
                _self._distance = _obj.value;
                _self.distanceUpdate();
                _self._tweening = false;
                _self.lock = _oldLock;
                if (_end) _end();
            };

            TweenMax.to(_obj, time, tweenData);

        }else  if (window['JT']){

            this._tweening = true;
            this.lock = true;

            tweenData.value = value;
            tweenData.onUpdate = function () {
                _self._distance = _obj.value;
                _self.distanceUpdate();
            };
            tweenData.onEnd = function () {
                _self._distance = _obj.value;
                _self.distanceUpdate();
                _self._tweening = false;
                _self.lock = _oldLock;
                if (_end) _end();
            };

            JT.to(_obj, time, tweenData);

        }

    }


}



function updateFrame() {
    //运动中不做
    if (this._tweening) return;
    //锁住 跳过
    if (this.lock) return;
    //没有自运动中
    if (!this._autoMovieing) return;

    if (this.failure > 0) {

        if (Math.abs(this.speed) >= this.failure) this.speed = this.speed - this.failure * this.speed;
        else this.speed = 0;

    }

    if (this.speed === 0) {

        this._autoMovieing = false;
        return;

    }

    this._distance += this.speed;

    if (!this.loop) {

        if (this._distance <= this.min) {

            this._distance = this.min;
            this._autoMovieing = false;

        }
        if (this._distance >= this.max) {

            this._distance = this.max;
            this._autoMovieing = false;

        }

    } else {

        if (this._distance < this.min) this._distance = this.max - (this.min - this._distance);
        if (this._distance > this.max) this._distance = this.min + (this._distance - this.max);

    }

    this.distanceUpdate();

    requestAnimationFrame(this[_upDateFrame]);

}

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
ds.gemo = ds.gemo || {};
ds.gemo.SliderDistance = SliderDistance;

export default SliderDistance;