/**
 * @class Ds.gemo.OGerModel
 * @classdesc:陀螺仪与拖动的控制.
 * 陀螺仪在shrekshrek的orienter基础上实现：https://github.com/shrekshrek/orienter
 * 拖动结合使用：Ds.gemo.Gesture也可以考虑使用http://hammerjs.github.io/
 * @extends
 * @example:
  列子参考:一张大图片的模拟星空
     //创建陀螺仪与拖动控制
     var _MaxW=3000;
     var _MaxH=3000;
     var _SW=640;
     var _SH=1000;
     _OGerModel=new Ds.gemo.OGerModel($('body'));
     //开启控制器
     _OGerModel.AnimateOn();
     _OGerModel.on('update',function(e){
         if(_Self.Lock)return;
         var _rotationY=e.rotationY;
         var _rotationX=e.rotationX;
         var _proportionX=e.proportionX;//X轴百分比
         var _proportionY=-e.proportionY;//Y轴百分比 2D无限循环计算方式
         var _proportion2Y=e.proportion2Y;//Y轴百分比 2D有边界计算方式
         //上下移动
         var _y2=((_MaxH-_SH)/2)*-_proportionX-_MaxH/2+_SH/2;
         //左右不衔接 有界限
         var _x2=((_MaxW-_SW)/2)*_proportion2Y-_MaxW/2+_SW/2;
         //左右衔接
         var _x2=(_MaxW/2)*_proportionY-_MaxW/2;
         //对象的移动
         _StarbgPanel.x=_x2;
         _StarbgPanel.y=_y2;
     });
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
(function(factory) {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);

    if (typeof define === 'function' && define.amd) {
        define(['exports'], function(exports) {
            require('ds/gemo/Gesture');
            require('libs/shrek/orienter.min.js');
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
    root.Ds.gemo.OGerModel = OGerModel;

    //刷新场景
    var _requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame;
    /**
     * 陀螺仪与拖动的控制
     * @param {[type]} StageDom     [拖动的DOM对象]
     */
    function OGerModel(stageDom, opts) {
        var _UPDATE = 'update';
        Ds.Extend(this, new Ds.EventDispatcher());
        var _Self = this;
        var _StageDom, //拖拽的场景
            _Orienter, //陀螺仪控制器
            _Gesture; //拖拽类
        //拖动变量
        this.Drag = {
            lon: 0,
            lat: 0
        };
        //陀螺仪变量
        this.Aim = {
            lat: 0,
            lon: 0
        };
        //扣偏差变量
        this.Fix = {
            lon: 0,
            lat: 0
        };
        //是否锁定
        this.Lock = true;

        //是否只锁定陀螺仪
        var _OrienterLook = true;
        Object.defineProperty(this, "OrienterLook", {
            get: function() {
                return _OrienterLook;
            },
            set: function(value) {
                _OrienterLook = value;
                if (value === true) {
                    _Self.Drag.lon = _Self.Drag.lon + _Self.Aim.lon;
                    _Self.Drag.lat = _Self.Drag.lon + _Self.Aim.lat;
                }
            }
        });

        var _TouchLook = true;
        Object.defineProperty(this, "TouchLook", {
            get: function() {
                return _TouchLook;
            },
            set: function(value) {
                _TouchLook = value;
            }
        });

        _Self.Drag.lat = +_Self.Aim.lat;
        _Self.Drag.lon = +_Self.Aim.lon;
        //进行touch拖动系数 默认0.2
        var _TouchSpeed = opts.touchSpeed || 0.2;
        Object.defineProperty(this, "TouchSpeed", {
            get: function() {
                return _TouchSpeed;
            },
            set: function(value) {
                _TouchSpeed = value;
            }
        });

        var _TouchDirection = opts.touchDirectio !== undefined ? opts.touchDirectio : true;
        var _RotationSpeedY = opts.rotationSpeedY || 0.3;
        var _RotationSpeedX = opts.rotationSpeedX || 0.15;

        //_proportionY 旋转计算一周 默认180度 算半圈
        var _WeekY = opts.weekY || 180;


        Init();
        /**
         * 初始化
         */
        function Init() {
            console.log('OGerModel Init');
            _StageDom = stageDom;
            //创建拖拽类
            _Gesture = new Ds.gemo.Gesture();
            //初始化 拖拽的对象
            _Gesture.Init(_StageDom);
            //拖拽的过程
            _Gesture.on('move', function(obj) {
                if (_Self.Lock) return;
                if (_Self.TouchLook) return;
                if (_TouchDirection) {
                    _Self.Drag.lon = (_Self.Drag.lon - obj.ax * _TouchSpeed) % 360;
                } else {
                    _Self.Drag.lon = (_Self.Drag.lon + obj.ax * _TouchSpeed) % 360;
                }
                _Self.Drag.lat = Math.max(-90, Math.min(90, _Self.Drag.lat + obj.ay * _TouchSpeed));

            });
            //陀螺仪
            _Orienter = new Orienter();
            //陀螺仪触发
            _Orienter.onOrient = function(obj) {
                _Self.Aim.lat = obj.lat;
                _Self.Aim.lon = -obj.lon;
                if (_Self.Lock) {
                    _Self.Fix.lat = -_Self.Aim.lat;
                    _Self.Fix.lon = -_Self.Aim.lon;
                }
                if (_Self.OrienterLook) {
                    _Self.Fix.lat = -_Self.Aim.lat;
                    _Self.Fix.lon = -_Self.Aim.lon;
                }
            };
            //初始化
            _Orienter.init();
        }
        /**
         * 陀螺仪与运动开启，关系到手机初始化关系
         */
        this.AnimateOn = function() {
            this.Lock = false;
            this.OrienterLook = false;
            this.TouchLook = false;
            // this.Animate();
            if (window['createjs'] !== undefined) {
                createjs.Ticker.addEventListener("tick", _Self.Animate);
            } else {
                _requestAnimationFrame(go);
            }

            function go() {
                if (_Self.Lock) return;
                _Self.Animate();
                _requestAnimationFrame(go);
            }

        };
        /**
         * 关闭陀螺仪
         */
        this.AnimateOff = function() {
            this.Lock = true;
            this.OrienterLook = _OrienterLook;
            this.TouchLook = _TouchLook;
            if (window['createjs'] !== undefined) {
                createjs.Ticker.removeEventListener("tick", _Self.Animate);
            }
            // if (this.AnimateId) cancelAnimationFrame(this.AnimateId);
            // createjs.Ticker.removeEventListener("tick", _Self.Animate);
        };
        /**
         * 运动ID
         * @type {[type]}
         */
        this.AnimateId = null;
        //Y旋转角度
        // this.RotationY=0;
        //X旋转角度
        // this._RotationX=0;
        //Y旋转角度,X旋转角度
        var _RotationY = 0,
            _RotationX = 0;

        this.Animate = function() {

            var _lon = (_Self.Aim.lon + _Self.Fix.lon + _Self.Drag.lon);
            var _lat = (_Self.Aim.lat + _Self.Fix.lat + _Self.Drag.lat);

            _lon = _lon % 360;
            _lat = _lat * 0.35; ////这个值的90*0.35;

            if (_lon - _RotationY > 180) _RotationY += 360;
            if (_lon - _RotationY < -180) _RotationY -= 360;

            _RotationY += (_lon - _RotationY) * _RotationSpeedY;
            _RotationX += (_lat - _RotationX) * _RotationSpeedX;

            //算百分比
            var _proportionX = -_RotationX / (90 * 0.35);
            if (_proportionX >= 1) _proportionX = 1;
            if (_proportionX <= -1) _proportionX = -1;
            var _ry;
            //2d无限循环计算方式 值是-1到1
            _ry = _RotationY;
            if (_ry < -180) _ry += 360;
            if (_ry > 180) _ry -= 360;
            var _proportionY = _ry / _WeekY;
            if (_proportionY >= 1) _proportionY = 1;
            if (_proportionY <= -1) _proportionY = -1;


            //2d有边界计算方式 _WeekY=90度算一个边界  值是-0.5到0.5  是指-45到正45
            _ry = _RotationY;
            if (_ry < -180) _ry = 360 + _ry;
            if (_ry > 180) _ry -= 360;
            var _proportion2Y = _ry / _WeekY / 2;
            if (_proportion2Y >= 1) _proportion2Y = 1;
            if (_proportion2Y <= -1) _proportion2Y = -1;

            _Self.ds({
                type: _UPDATE,
                rotationY: _RotationY,
                rotationX: _RotationX,
                proportionX: _proportionX, //
                proportionY: _proportionY,
                proportion2Y: _proportion2Y,
                lon: _lon,
                lat: _lat,
            });
        };
    }
    /**
     *  做左右看图辅助计算
     *  对e.proportionY; 进行辅助处理计算0-1之间
     * @param  {[type]} value        [当前值]
     * @param  {[type]} intermediate [中间值，第一次记录下当前值]
     * @param  {[type]} interval     [间隔值 默认0.2 大于72度]
     * @return {[type]}              [旋转百分比]
     */
    OGerModel.GetProportionYAuxiliary=function(value,intermediate,interval){
      // intermediate=0.9;
      // value=0.92
      value=value||1;
      value=Math.max(0,Math.min(value,1));
      intermediate=intermediate||0;
      intermediate=Math.max(0,Math.min(intermediate,1));

      var _gy=interval||0.2;
      // console.log(_gy);
      var _intermediate=intermediate;
      var _x=value;//0.9
      var _sy=_intermediate-_gy;//0.1-0.2=-0.1
      var _ey=_intermediate+_gy;//0.1+0.2=0.3
      //计算出偏差
      var _x2=0;
      //大于等上限
      if(_x>=_intermediate+_gy){
        // console.log('1 _sy:',_sy);
        // console.log('1 _x:',_x);
        //如果下限小于0才需要判断  大于上限，那就要判断下是否超过下限，
        if(_sy<=0){
          var _sy2=1+_sy;//0.9 获取下限取正值
          // console.log('1 _sy2:',_sy2);
          //判断是否超过下限取正后的值
          if(_x>=_sy2){
            // console.log('1 _cc:',(_x-_sy2));
            _x2=(_x-(_sy2+_gy))/_gy*0.5;//(当前值-（下限值+间隔值）)/间隔值*0.5[只是一半所以乘以0.5]
            if(_x2<0)_x2=-_x2;
          }else{
            _x2=1;//正常超出上限
          }
        }else{
          //超出上线 默认是1
          _x2=1;
        }
        // console.log('1 _x2:',_x2);
      }
      else if(_x<_intermediate-_gy){
        // console.log('2 _ey:',_ey);
        // console.log('2 _x:',_x);
        //上限值超过了1
        if(_ey>=1){
          var _ey2=_ey-1;//1.1-->0.1
          // console.log('2 _ey2:',_ey2);
          if(_x<=_ey2){
            _x2=0.5+(_x-(_ey2-_gy))/_gy*0.5;//中间值+(当前值-（上限值-间隔值）)/间隔值*0.5[只是一半所以乘以0.5]
          }else{
            _x2=0;
          }
        }else{
          _x2=0;
        }
        // console.log('2 _x2:',_x2,_x);
      }
      else{
        _x2=(_x-_sy)/(_gy*2);
        // console.log('3 _x2:',_x2);
      }
      return _x2;
    };

    return OGerModel;
}));
