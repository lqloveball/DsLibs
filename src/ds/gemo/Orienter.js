import EventDispatcher from '../core/EventDispatcher';


const _orient = Symbol("_orient");
const _change = Symbol("_change");

/**
 * 陀螺仪互动 720度 处理
 * 代码参考来至
 * https://github.com/shrekshrek/orienter
 */
class Orienter extends EventDispatcher {

    /**
     *
     * @param opts  配置
     * @param opts.orient  角度变化事件
     * @param opts.change  绑定屏幕方向变化事件
     * @param opts.initBool 是否初始化
     */
    constructor(opts) {

        super();

        opts = opts || {};

        this._config = opts;


        this[_orient] = this._orient.bind(this);
        this[_change] = this._change.bind(this);

        this.lon = 0;
        this.lat = 0;
        this.fix = 0;
        this.direction = window.orientation || 0;

        switch (this.direction) {
            case 0:
                this.fix = 0;
                break;
            case 90:
                this.fix = -270;
                break;
            case -90:
                this.fix = -90;
                break;
        }

        if (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
            this.os = 'ios';
        } else {
            this.os = (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux')) ? 'android' : '';
        }

        if (opts.initBool) this.init();

    }

    /**
     * 初始化监听
     */
    init() {
        this.lon = 0;
        this.lat = 0;
        this.fix = 0;
        switch (this.direction) {
            case 0:
                this.fix = 0;
                break;
            case 90:
                this.fix = -270;
                break;
            case -90:
                this.fix = -90;
                break;
        }
        this.direction = window.orientation || 0;
        this._ox = undefined;
        this._oy = undefined;
        this._oz = undefined;
        window.addEventListener('deviceorientation', this[_orient], false);
        window.addEventListener('orientationchange', this[_change], false);
    }

    /**
     * 重置值
     */
    reset(){
        this.lon = 0;
        this.lat = 0;
        this.fix = 0;
        this.direction = window.orientation || 0;
        switch (this.direction) {
            case 0:
                this.fix = 0;
                break;
            case 90:
                this.fix = -270;
                break;
            case -90:
                this.fix = -90;
                break;
        }
        this._ox = undefined;
        this._oy = undefined;
        this._oz = undefined;
    }

    /**
     * 摧毁监听
     */
    destroy() {
        window.addEventListener('deviceorientation', this[_orient], false);
        window.addEventListener('orientationchange', this[_change], false);
    }

    /**
     * 屏幕方向变化
     * @param e
     * @private
     */
    _change(e) {

        this.direction = window.orientation;
        let _event = {
            type: 'change',
            dir: this.direction
        };
        /**
         *  轴的变化
         * @event ds.gemo.Orienter#change
         * @property {number} dir - 设备方向
         * @private
         */
        this.ds(_event);

        if (this._config.change) this._config.change(_event);
    }

    /**
     * 经纬变化
     * @param e
     * @private
     */
    _orient(e) {
        switch (this.os) {
            case 'ios':
                switch (this.direction) {
                    case 0:
                        this.lon = e.alpha + e.gamma;
                        if (e.beta > 0) this.lat = e.beta - 90;
                        break;
                    case 90:
                        if (e.gamma < 0) {
                            this.lon = e.alpha - 90;
                        } else {
                            this.lon = e.alpha - 270;
                        }
                        if (e.gamma > 0) {
                            this.lat = 90 - e.gamma;
                        } else {
                            this.lat = -90 - e.gamma;
                        }
                        break;
                    case -90:
                        if (e.gamma < 0) {
                            this.lon = e.alpha - 90;
                        } else {
                            this.lon = e.alpha - 270;
                        }
                        if (e.gamma < 0) {
                            this.lat = 90 + e.gamma;
                        } else {
                            this.lat = -90 + e.gamma;
                        }
                        break;
                }
                break;
            case 'android':
                switch (this.direction) {
                    case 0:
                        this.lon = e.alpha + e.gamma + 30;
                        if (e.gamma > 90) {
                            this.lat = 90 - e.beta;
                        } else {
                            this.lat = e.beta - 90;
                        }
                        break;
                    case 90:
                        this.lon = e.alpha - 230;
                        if (e.gamma > 0) {
                            this.lat = 270 - e.gamma;
                        } else {
                            this.lat = -90 - e.gamma;
                        }
                        break;
                    case -90:
                        this.lon = e.alpha - 180;
                        this.lat = -90 + e.gamma;
                        break;
                }
                break;
        }

        this.lon += this.fix;
        this.lon %= 360;
        if (this.lon < 0) this.lon += 360;

        this.lon = Math.round(this.lon);
        this.lat = Math.round(this.lat);


        /**
         *  轴的变化
         * @event ds.gemo.Orienter#orient
         * @property {number} a - z轴
         * @property {number} b - x轴
         * @property {number} g - y轴
         * @property {number} z - z轴
         * @property {number} x - x轴
         * @property {number} y - y轴
         * @property {number} lon - 经度  地球竖切线 0-360；
         * @property {number} lat - 纬线  地球横切线 上90 中0 下-90
         * @property {number} dir - 设备方向
         * @property {number} ox - 初始化x轴
         * @property {number} oy - 初始化y轴
         * @property {number} oz - 初始化z轴
         * @property {number} nx - 矫正后x轴
         * @property {number} ny - 矫正后y轴
         * @property {number} nz - 矫正后z轴
         * @private
         */
        let _event = {
            type: 'orient',
            a: Math.round(e.alpha),
            b: Math.round(e.beta),
            g: Math.round(e.gamma),
            lon: this.lon,
            lat: this.lat,
            dir: this.direction,

        };

        //使用xyz便于理解
        _event.x = _event.b;
        _event.y = _event.g;
        _event.z = _event.a;

        //记录旧的初始化值
        if (this._ox===undefined) this._ox = _event.x;
        if (this._oy===undefined) this._oy = _event.y;
        if (this._oz===undefined) this._oz = _event.z;

        _event.ox = this._ox;
        _event.oy = this._oy;
        _event.oz = this._oz;


        //矫正初始化xyz后的轴值
        _event.nx = _event.x - _event.ox;
        _event.ny = _event.y - _event.oy;
        _event.nz = _event.z - _event.oz;

        this.ds(_event);

        if (this._config.orient) this._config.orient(_event);

    }
}

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
ds.gemo = ds.gemo || {};
ds.gemo.Orienter = Orienter;

export default Orienter;