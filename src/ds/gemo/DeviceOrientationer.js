import EventDispatcher from '../core/EventDispatcher';


const _orientationUpDate = Symbol("_orientationUpDate");
const _directionUpDate = Symbol("_directionUpDate");


/**
 * 设备角度事件与摇一摇功能添加
 * @class
 * @memberof ds.gemo
 */
class DeviceOrientationer extends EventDispatcher {

    constructor()
    {

        super();

        if (!window.DeviceMotionEvent) {
            console.warn('no window.DeviceMotionEvent');
            return;
        }

        this[_orientationUpDate]=orientationUpDate.bind(this);
        this[_directionUpDate]=directionUpDate.bind(this);


        window.addEventListener('deviceorientation', this[_orientationUpDate], false);
        window.addEventListener('orientationchange', this[_directionUpDate], false);

    }

    /**
     * 摧毁这个对象
     */
    destroy() {

        window.removeEventListener('deviceorientation', this[_orientationUpDate], false);
        window.removeEventListener('orientationchange', this[_directionUpDate], false);

    }

    /**
     * 手机方向判断
     * @return {number}
     */
    get orientation() {
        return window.orientation;
    }

    /**
     *
     * @param {function} callBack
     * @param {number} speed
     */
    addShake(callBack, speed){

        var _speed = speed || 10; //speed

        let _x, _y, _z, _lastX, _lastY, _lastZ;
        _x = _y = _z = _lastX = _lastY = _lastZ = 0;

        function deviceMotionHandler(e) {

            let _acceleration = e.accelerationIncludingGravity;
            _x = _acceleration.x;
            _y = _acceleration.y;
            _z = _acceleration.z;

            if (Math.abs(_x - _lastX) > _speed || Math.abs(_y - _lastY) > _speed || Math.abs(_z - _lastZ) > _speed) {

                //简单的摇一摇触发代码
                if (callBack) callBack();

            }

            _lastX = _x;
            _lastY = _y;
            _lastZ = _z;

        }

        callBack.__deviceMotionHandler = deviceMotionHandler;
        window.addEventListener('devicemotion', deviceMotionHandler, false);

    }

    /**
     * 删除摇一摇
     * @param {function} callBack
     */
    removeShake(callBack){

        let _deviceMotionHandler = callBack.__deviceMotionHandler;

        if (_deviceMotionHandler) window.removeEventListener('devicemotion', _deviceMotionHandler);

    }

}

function orientationUpDate(e) {

    /**
     * 陀螺仪
     * @event ds.gemo.DeviceOrientationer#orient
     * @property {number} x - x轴
     * @property {number} y - y轴
     * @property {number} z - z轴
     */
    this.ds({
        type: 'orient',
        x: e.beta,
        y: e.gamma,
        z: e.alpha,
    });

}

function directionUpDate() {

    /**
     * 屏幕方向改变
     * @event ds.gemo.DeviceOrientationer#direction
     */
    this.ds({type: 'direction'});

}

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
ds.gemo = ds.gemo || {};
ds.gemo.DeviceOrientationer = DeviceOrientationer;

export default DeviceOrientationer;