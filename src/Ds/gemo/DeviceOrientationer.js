/**
 * @class Ds.gemo.DeviceOrientationer
 * @classdesc:陀螺仪简易使用方式
 *  AddShake 添加一个摇一摇
 * @extends
 * @example: 举例
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
(function(factory) {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);

    if (typeof define === 'function' && define.amd) {
        define(['exports'], function(exports) {
            module.exports = factory(root, exports);
        });
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(root, exports);
    } else {
        factory(root, {});
    }
}(function(root, modelObj) {
    root.Ds = root.Ds || {};
    root.Ds.gemo = root.Ds.gemo || {};
    root.Ds.gemo.DeviceOrientationer = DeviceOrientationer;

    function DeviceOrientationer() {
        if (!window.DeviceMotionEvent) {
            console.warn('no window.DeviceMotionEvent');
            return;
        }
        var _Self = this;
        Ds.Extend(this, new Ds.EventDispatcher());

        //手机的方向 0竖屏 正负90表示横屏
        var _Direction = root.orientation || 0;
        Object.defineProperty(this, "Direction", {
            get: function() {
                return _Direction;
            },
        });
        InitEvent();
        /**
         * 初始化事件
         */
        this.InitEvent = InitEvent;

        function InitEvent() {
            window.addEventListener('deviceorientation', OrientationUpDate, false);
            window.addEventListener('orientationchange', DirectionUpDate, false);
        }
        /**
         * 摧毁
         */
        this.Destroy = function() {
            window.removeEventListener('deviceorientation', OrientationUpDate, false);
            window.removeEventListener('orientationchange', DirectionUpDate, false);
        };
        /**
         * 陀螺仪判断
         * @param {[type]} e [description]
         * event.alpha
         * event.beta
         * event.gamma
         *  |     /z轴 e.alpha   值范围(0 to 360)
         *  |    /
         *  |  /
         *  | /
         *  /------------- x轴 e.beta  值范围(-180 to 180)
         *  |
         *  |
         *  |
         *  |y轴  e.gamma  值范围(-90 to 90)
         */
        function OrientationUpDate(e) {
            // console.log(e.alpha + ' : ' + e.beta + ' : ' + e.gamma);
            _Self.ds({
                type: 'orient',
                x: e.beta,
                y: e.gamma,
                z: e.alpha,
            });
        }
        /**
         * 手机方向判断
         * @param {[type]} e [description]
         */
        function DirectionUpDate(e) {
            _Direction = window.orientation;
        }
        /**
         * 添加摇一摇
         * @param {[type]} callBack [description]
         */
        this.AddShake = function(callBack,speed) {
            callBack.__deviceMotionHandler = deviceMotionHandler;

            window.addEventListener('devicemotion', deviceMotionHandler, false);
            var _speed = speed||30; //speed
            var _x, _y, _z, _lastX, _lastY, _lastZ;
            _x = _y = _z = _lastX = _lastY = _lastZ = 0;

            function deviceMotionHandler(eventData) {
                var _acceleration = eventData.accelerationIncludingGravity;
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
        };
        /**
         * 删除摇一摇
         * @param {[type]} callBack [description]
         */
        this.RemoveShake = function(callBack) {
            var _deviceMotionHandler = callBack.__deviceMotionHandler;
            if (_deviceMotionHandler) {
                window.removeEventListener('devicemotion', _deviceMotionHandler, false);
            }
        };

    }

    return Ds.gemo.DeviceOrientationer;
}));
