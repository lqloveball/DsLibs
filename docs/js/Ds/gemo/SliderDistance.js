/**
 * 这个类基本弃用，因为Ds.gemo.SliderHVDistance 可以更好控制
 * @class Ds.gemo.SliderDistance
 * @classdesc: 平滑滚动
 * @param {[Object]} sliderObject [进行滚动的对象]
 * @param {[String]} valueName    [滚动对象对应的参数名]
 * @param {[Object]} opts         [设置参数]
 * opts.interval              //间隔值
 * opts.touchHeight           //拖拽区域高度
 * opts.distance            //当前数据值
 * opts.maxSpeed            //最大运动速度
 * opts.minSpeed            //最小运动速度
 * opts.speed               //运动速度
 * opts.autoSpeed          //默认是否自运动中
 * opts.touchDirection    //拖动方向
 * opts.max               //最大距离
 * opts.min               //最小距离
 * @todo 目前只做了竖向滚动，之后开始参数可以 横向滑动控制
 * @extends
 * @example:
 require('ds/gemo/SliderDistance');
 var _SliderDistance=new Ds.gemo.SliderDistance(_ThroughSpace,'Value',{
   touchDom:$('#screen'),//拖动的touch用的dom对象
   min:0,//最小距离
   max:_ThroughSpace.MaxLength,//最大距离
   interval:2000,//拖动间隔
   touchHeight:window.innerHeight,//拖动高度
   touchDirection:true,// 方向
 });
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright: Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
(function(factory) {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);

    if (typeof define === 'function' && define.amd) {
        define(['exports'], function(exports) {
            require('./PageSlider');
            require('./requestAnimationFrame');
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
    root.Ds.gemo.SliderDistance = SliderDistance;
    /**
     * [SliderDistance description]
     * @param {[type]} sliderObject [description]
     * @param {[type]} valueName    [description]
     * @param {[type]} opts         [description]
     */
    function SliderDistance(sliderObject, valueName, opts) {
        opts = opts || {};
        var _Self = this;
        Ds.Extend(this, new Ds.EventDispatcher());
        var _Interval = opts.interval !== undefined ? opts.interval : 2000, //间隔值
            _TouchHeight = opts.touchHeight !== undefined ? opts.touchHeight : window.innerHeight, //拖拽区域高度
            _TouchStartDistance = 0, //记录旧的数据值
            _Distance = opts.distance !== undefined ? opts.distance : 0, //记录当前数据值
            _TouchStartTime = 0, //记录触摸开始时间
            _MaxSpeed = opts.maxSpeed !== undefined ? opts.maxSpeed : 80, //最大运动速度
            _MinSpeed = opts.minSpeed !== undefined ? opts.minSpeed : 0, //最小运动速度
            _Speed = opts.speed !== undefined ? opts.speed : 2, //运动速度
            _AutoSpeedMoveBool = opts.autoSpeed !== undefined ? opts.autoSpeed : true, //是否自运动中
            _TouchDirection = opts.touchDirection !== undefined ? opts.touchDirection : true, //偏移量 拖动方向
            _MaxDistance = opts.max !== undefined ? opts.max : 10000, //最大距离
            _MinDistance = opts.min !== undefined ? opts.min : 0; //最小距离
        //最小距离
        Object.defineProperty(this, "MinDistance", {
            get: function() {
                return _MinDistance;
            },
            set: function(value) {
              _MinDistance=value;
            }
        });
        //最大距离
        Object.defineProperty(this, "MaxDistance", {
            get: function() {
                return _MaxDistance;
            },
            set: function(value) {
              _MaxDistance=value;
            }
        });
        //进行拖拽用dom元素
        var _TouchDom = opts.touchDom !== undefined ? opts.touchDom : $('body');
        //运动中
        var _Tweening=false;
        /**
         * 是否锁定
         * @type {Boolean}
         */
        var _Lock = false; //是否锁定拖拽
        Object.defineProperty(this, "Lock", {
            get: function() {
                return _Lock;
            },
            set: function(value) {
                _Lock = value;
                _AutoSpeedMoveBool=false;
                // _TouchStartDistance = sliderObject[valueName];
                // _Distance=sliderObject[valueName];
                UpDateFrame();
            }
        });
        //平滑滚动计算类
        var _Slider = new Ds.gemo.PageSlider(_TouchDom, {
            limitY: 50
        });
        // var _TouchBool=false;
        //开始交互触摸
        _Slider.on('start', function(e) {
            _Self.ds('start');
            // if (_AppMain.PageLabel !== 'ProductPage') {
            //     _Self.Lock = false;
            //     return;
            // }
            // if(_TouchBool)return;
            // _TouchBool=true;
            _TouchStartDistance = sliderObject[valueName];
            _Distance=_TouchStartDistance;
              // console.log('_Slider start TouchStartDistance',_TouchStartDistance);
            //运动中不做
            if (_Tweening) return;
            //锁住不做更改
            if (_Lock) return;


            _AutoSpeedMoveBool = false; //设置不自运动

            _TouchStartTime = new Date().getTime();

        });
        //移动过程
        _Slider.on('move', function(e) {
            _Self.ds('move');
            // if (_AppMain.PageLabel !== 'ProductPage') {
            //     _Self.Lock = false;
            //     return;
            // }
            //运动中不做
            if (_Tweening) return;
            //锁住不做更改
            if (_Lock) return;
            //只计算纵向滚动 不是上下滑动忽略
            if (!e.upright) return;
            if(_TouchStartDistance===null)_TouchStartDistance=sliderObject[valueName];
            _AutoSpeedMoveBool=false;
            //纵向偏移量
            var _diffY = _TouchDirection ? e.diffY : -e.diffY;
            // console.log(_diffY);
            //计算偏移的百分比
            var _diffPercent = _diffY / _TouchHeight; //滑动方向偏移量
            //偏移的百分比正数
            var _percent = Math.abs(_diffPercent);
            //计算距离
            var _distance = _TouchStartDistance + _Interval * _diffPercent;
            // console.log(_diffY,_diffPercent,_distance);
            // $('#debug').html(_diffY);
            _Distance = _distance;
            if (_Distance <= _MinDistance) _Distance = _MinDistance;
            if (_Distance > _MaxDistance) _Distance = _MaxDistance;
            DistanceUpDate();
            // console.log('_Slider move TouchStartDistance',_TouchStartDistance);
        });
        //移动完成
        _Slider.on('end', function(e) {
            _Self.ds('end');
            // if (_AppMain.PageLabel !== 'ProductPage') {
            //     _Self.Lock = false;
            //     return;
            // }

            //运动中不做
            // if (_Tweening) return;
            //锁住不做更改
            if (_Lock) {
              _TouchStartDistance=null;
              return;
            }
            // _TouchBool=false;
            // console.log('_Slider end TouchStartDistance',_TouchStartDistance);
            //
            SliderEndAutoMove();
            _Slider.closeSliding();


        });

        function SliderEndAutoMove() {
            var _time = new Date().getTime() - _TouchStartTime;
            var _dis = _TouchStartDistance - _Distance;
            var _bool = _dis <= 0 ? true : false; //判断方向
            var _pr = Math.abs(_dis / 400); //判断拖动距离百分比
            if (_pr >= 1) _pr = 1; //百分比不能超过1
            var _speed =_MinSpeed+_pr * (_MaxSpeed-_MinSpeed); //计算速度
            _speed = Math.min(_speed, _MaxSpeed); //最大速度判断
            _speed = Math.max(_speed, _MinSpeed); //最小速度判断
            if(_pr===0)_speed=0;
            // console.log('方向',_bool,_dis,_pr,_speed,_time);
            if (_time >= 600) {
                if (_bool) _Speed = _MinSpeed;
                else _Speed = -_MinSpeed;
            } else {
                if (_bool) _Speed = _speed;
                else _Speed = -_speed;
            }
            // console.log('SliderEndAutoMove:',_Speed);
            _AutoSpeedMoveBool = true;
            UpDateFrame();
            _TouchStartDistance=null;
            _Self.ds('autoMove');
        }
        //距离更新
        function DistanceUpDate() {
          if (_Distance <= _MinDistance){
            _Self.ds({type:'MinDistance',value:_Distance});
          }
          if (_Distance >=_MaxDistance) {
            // console.log('-----最大距离-');
            _Self.ds({type:'MaxDistance',value:_Distance});
          }
          sliderObject[valueName] = _Distance;
          _Self.ds({type:'upDate',value:_Distance});
        }
        //自运动额时候
        var _UpDateFramer;
        function UpDateFrame() {
            //运动中不做
            if (_Tweening) return;
            //锁住不做更改
            if (_Lock) return;
            //没有自动运动
            if (!_AutoSpeedMoveBool) return;
            cancelAnimationFrame(_UpDateFramer);
            // console.log('UpDateFrame',_Speed);
            _Distance += _Speed;
            if (_Distance <= _MinDistance) {
              _Distance = _MinDistance;
              _AutoSpeedMoveBool=false;
            }
            if (_Distance >= _MaxDistance) {
              _Distance = _MaxDistance;
              _AutoSpeedMoveBool=false;
            }
            DistanceUpDate();
            _UpDateFramer = requestAnimationFrame(UpDateFrame);
        }
        /**
         * 开启自动滚动
         */
        this.OpenAutoMove=function(value){
          // console.log('OpenAutoMove',_Tweening,_Lock);
          //运动中不做
          if (_Tweening) return;
          //锁住不做更改
          if (_Lock) return;

          _Speed=value||_Speed;
          _AutoSpeedMoveBool = true;
          _TouchStartDistance = null;
          _Distance=sliderObject[valueName];
          UpDateFrame();
        };
        /**
         * 控制运动
         * @param  {[type]} value     [description]
         * @param  {[type]} time      [description]
         * @param  {[type]} tweenData [description]
         * @return {[type]}           [description]
         */
        this.TweenMove = function(value,time,tweenData) {
            if(_Tweening)return;
            var _obj = {value: _Distance};
            var _Olock=_Lock;
            cancelAnimationFrame(_UpDateFramer);
            tweenData=tweenData||{};

            if (TweenMax) {
                _Tweening=true;
                _Lock = true;
                tweenData.value=value;
                tweenData.onUpdate=function() {
                  _Distance=_obj.value;
                  DistanceUpDate();
                };
                tweenData.onComplete=function(){
                  _Distance=_obj.value;
                  DistanceUpDate();
                  _Tweening=false;
                  _Lock=_Olock;
                  if(tweenData.end)tweenData.end();
                };
                TweenMax.to(_obj, time,tweenData);
            } else if (JT) {
                _Tweening=true;
                _Lock = true;
                tweenData.value=value;
                tweenData.onUpdate=function() {
                  _Distance=_obj.value;
                  DistanceUpDate();
                };
                tweenData.onEnd=function(){
                  _Distance=_obj.value;
                  DistanceUpDate();
                  _Tweening=false;
                  _Lock=_Olock;
                  if(tweenData.end)tweenData.end();
                };
                JT.to(_obj, time,tweenData);
            } else {

            }
        };

        UpDateFrame();
    }
    return SliderDistance;
}));
