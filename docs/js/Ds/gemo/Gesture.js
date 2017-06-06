/**
 * @class Ds.gemo.Gesture
 * @classdesc:手势控制
 * @extends 翻译至Shrek.wang, shrekshrek@gmail.com的的熊猫TV项目
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
    root.Ds.gemo.Gesture = Gesture;

    function Gesture() {
        Ds.Extend(this, new Ds.EventDispatcher());
        var _Self = this;

        var START = 'start';
        var END = 'end';
        var MOVE = 'move';
        //点位置
        this.OriginTouchPos = {
            x: 0,
            y: 0
        };
        //原来点位置
        this.OldTouchPos = {
            x: 0,
            y: 0
        };
        //新的点位置
        this.NewTouchPos = {
            x: 0,
            y: 0
        };
        //变化的方向
        this.FirstDir = '';

        this.OriginTime = 0;
        this.OldTime = 0;
        this.NewTime = 0;

        this.dx = 0;
        this.dy = 0;
        this.ax = 0;
        this.ay = 0;
        this.time = 0;
        //触发的场景
        this.Stage = null;

        this.Init = function(stageDom) {
            this.Stage = stageDom;
            this.Stage.on('touchstart', _Self.OnTouchStart);
        };

        this.clear = function() {
            this.Stage.off('touchstart', _Self.OnTouchStart);
            this.Stage.off('touchmove', _Self.OnTouchMove);
            this.Stage.off('touchend', _Self.OnTouchEnd);
        };

        this.OnTouchStart = function(evt) {
            _Self.FirstDir = '';
            evt = evt.changedTouches[0];

            _Self.OriginTouchPos.x = _Self.OldTouchPos.x = _Self.NewTouchPos.x = evt.clientX;
            _Self.OriginTouchPos.y = _Self.OldTouchPos.y = _Self.NewTouchPos.y = evt.clientY;
            _Self.OriginTime = _Self.OldTime = _Self.NewTime = Date.now();
            _Self.dx = _Self.dy = _Self.ax = _Self.ay = 0;

            _Self.Stage.on('touchmove', _Self.OnTouchMove);
            _Self.Stage.on('touchend', _Self.OnTouchEnd);

            _Self.ds({
                type: START
            });
        };

        this.OnTouchMove = function(evt) {
            evt = evt.changedTouches[0];
            _Self.NewTouchPos.x = evt.clientX;
            _Self.NewTouchPos.y = evt.clientY;
            _Self.NewTime = Date.now();
            _Self.CheckGesture();

            _Self.OldTouchPos.x = _Self.NewTouchPos.x;
            _Self.OldTouchPos.y = _Self.NewTouchPos.y;

            _Self.OldTime = _Self.NewTime;
            return false;
        };

        this.OnTouchEnd = function() {
            _Self.NewTime = Date.now();
            var _time = (_Self.NewTime - _Self.OldTime) / 1000;
            _Self.ds({
                type: END,
                dx: _Self.dx,
                dy: _Self.dy,
                ax: _Self.time * 2 > _time ? _Self.ax : 0,
                ay: _Self.time * 2 > _time ? _Self.ay : 0,
                dir: _Self.FirstDir
            });
            _Self.Stage.off('touchmove', _Self.OnTouchMove);
            _Self.Stage.off('touchend', _Self.OnTouchEnd);
            return false;
        };
        this.CheckGesture = function() {
            _Self.dx = fixed2(_Self.NewTouchPos.x - _Self.OriginTouchPos.x);
            _Self.dy = fixed2(_Self.NewTouchPos.y - _Self.OriginTouchPos.y);
            _Self.ax = fixed2(_Self.NewTouchPos.x - _Self.OldTouchPos.x);
            _Self.ay = fixed2(_Self.NewTouchPos.y - _Self.OldTouchPos.y);
            _Self.time = (_Self.NewTime - _Self.OldTime) / 1000;

            if (_Self.FirstDir === '') {
                if (Math.abs(_Self.ax) > Math.abs(_Self.ay)) {
                    _Self.FirstDir = 'x';
                } else if (Math.abs(_Self.ax) < Math.abs(_Self.ay)) {
                    _Self.FirstDir = 'y';
                }
            }
            //log('OnTouchEnd:',_Self.ax,_Self.ay);
            _Self.ds({
                type: MOVE,
                dx: _Self.dx,
                dy: _Self.dy,
                ax: _Self.ax,
                ay: _Self.ay,
                dir: _Self.FirstDir,
                time: _Self.time,
            });
        };

        function fixed2(num) {
            return Math.floor(num * 100) / 100;
        }
    }
    return Gesture;
}));
