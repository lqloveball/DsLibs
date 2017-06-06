/**
 * @class root.Ds.Object369ByFrames
 * @classdesc: 物件360度进行旋转
 * @param {[MovieClip]} movieClip [进行旋转的3d序列]
 * @param {[Object]} opts [参数]
 * opts.touchDom touch拖拽dom对象
 * opts.touchWidth touch拖拽距离
 * opts.TweenType  使用的运动引擎，不添加会自动判断
 * @extends
 * @example:
 * require('ds/createjs/display/Object369ByFrames');
 * _Object369ByFrames=new Ds.createjs.display.Object369ByFrames(_Tree,{touchWidth:(window.innerWidth/2)});
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright: Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
(function (factory) {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);

    if (typeof define === 'function' && define.amd) {
        define(['exports'], function (exports) {
          require('ds/EventDispatcher');
          require('ds/gemo/PageSlider');
          module.exports= factory(root, exports);
        });
    } else if (typeof exports !== 'undefined') {
        module.exports=factory(root, exports);
    } else {
         factory(root, {});
    }

}(function (root, modelObj) {
  root.Ds = root.Ds || {};
  root.Ds.createjs=root.Ds.createjs ||{};
  root.Ds.createjs.display = root.Ds.createjs.display || {};
  root.Ds.createjs.display.Object369ByFrames=Object369ByFrames;

  function Object369ByFrames(movieClip,opts){
    var _Self=this;
    Ds.Extend(this, new Ds.EventDispatcher());
    opts=opts||{};
    //3d序列帧对象
    var _Skin=movieClip;
    //拖拽dom
    var _TouchDom=opts.touchDom||null;
    if(!_TouchDom){
      if(movieClip.stage&&movieClip.stage.canvas){
        _TouchDom=movieClip.stage.canvas;
        InitSlider(_TouchDom);
      }
    }
    //拖拽范围宽
    var _TouchWidth=opts.touchWidth||window.innerWidth;
    var _TweenType='';
    if(opts.TweenType!==undefined){
      _TweenType=opts.TweenType;
    }else{
      if(TweenMax)_TweenType='TweenMax';
      else if(JT)_TweenType='JT';
    }
    //平滑滚动计算类
    var _Slider;
    Object.defineProperty(this, "Slider", {
        get: function() {
            return _Slider;
        }
    });
    //是否锁定不进行拖动
    var _Lock;
    Object.defineProperty(this, "Lock", {
        get: function() {
            return _Lock;
        },
        set: function(value) {
          _Lock=value;
        }
    });
    //总帧数
    Object.defineProperty(this, "TotalFrames", {
        get: function() {return _Skin.totalFrames;},
    });
    //当前帧
    Object.defineProperty(this, "CurrentFrame", {
        get: function() {return _Skin.currentFrame;},
    });
    /**
     * 初始化平滑移动
     * @param  {[Dom]} touchDom [进行拖拽touch用dom]
     * @return {[type]}          [description]
     */
    this.InitSlider=InitSlider;
    function InitSlider(touchDom){
      _TouchDom=touchDom;
      if(_Slider){
        _Slider.off('start', SliderStart);
        _Slider.off('move', SliderMove);
        _Slider.off('end', SliderEnd);
      }
      if(_TouchDom){
        _Slider= new Ds.gemo.PageSlider(_TouchDom);
        _Slider.on('start', SliderStart);
        _Slider.on('move', SliderMove);
        _Slider.on('end', SliderEnd);
      }
    }
    var _OldCurrentFrame;
    var _MovieObj={num:0};
    /**
     * 开始拖拽
     */
    function SliderStart(e){
      //锁住不做更改
      if (_Self.Lock) return;
      if(_TweenType=='TweenMax'){

      }
      else if(_TweenType=='JT'){
        JT.kill(_MovieObj);
      }
      else{

      }
      console.log('SliderStart:',_Skin.currentFrame);
      _OldCurrentFrame=_Skin.currentFrame;
      _MovieObj.num=_OldCurrentFrame;
    }

    /**
     * 拖拽移动
     */
    function SliderMove(e){
      // console.log(e);
      //锁住不做更改
      if (_Self.Lock) return;
      if (e.level) {
          var _diffX = e.diffX;
          //计算偏移帧
          var _num = _diffX / _TouchWidth;
          var _frames =_OldCurrentFrame+_Skin.totalFrames * _num >> 0;
          // var _num2 = _num < 0 ? (_num + Math.abs(Math.floor(_num))) : _num - Math.abs(Math.floor(_num));
          // var _frames = _Skin.totalFrames * _num2 >> 0;
          // console.log(_OldCurrentFrame,_num+'<>'+_frames);
          MovieTween(_frames);
      }
    }
    /**
     * 拖动进行Tween
     * @param {[type]} frames [description]
     */
    function MovieTween(frames){
      console.log('MovieTween:',_TweenType);
      if(_TweenType=='TweenMax'){
        // console.log('TweenMax');
        TweenMax.to(_MovieObj,0.5,{num:frames,
            onUpdate:function(){
            var _current=_MovieObj.num>>0;
            if(_current<0){
              _current=_current%_Skin.totalFrames;
              _current=_Skin.totalFrames+_current;
            }
            if(_current>=_Skin.totalFrames){
              current=_current%_Skin.totalFrames;
              _current=_current-_Skin.totalFrames;
            }
            Update(_current);
          }
        });
      }
      else if(_TweenType=='JT'){
        JT.kill(_MovieObj);
        JT.to(_MovieObj,0.5,{num:frames,
            onUpdate:function(){
            var _current=_MovieObj.num>>0;
            if(_current<0){
              _current=_current%_Skin.totalFrames;
              _current=_Skin.totalFrames+_current;
            }
            if(_current>=_Skin.totalFrames){
              current=_current%_Skin.totalFrames;
              _current=_current-_Skin.totalFrames;
            }
            Update(_current);
          }
        });
      }else{
        createjs.Tween.get(_MovieObj).to({num:frames},500).addEventListener("change",handleChange);
        function handleChange(e){
          var _current=_MovieObj.num>>0;
          if(_current<0){
            _current=_current%_Skin.totalFrames;
            _current=_Skin.totalFrames+_current;
          }
          if(_current>=_Skin.totalFrames){
            current=_current%_Skin.totalFrames;
            _current=_current-_Skin.totalFrames;
          }
          Update(_current);
        }
      }
    }
    /**
     * 拖拽完成
     */
    function SliderEnd(e){
      //锁住不做更改
      if (_Self.Lock) return;
      _Slider.closeSliding();
    }

    /**
     * 更新
     */
    function Update(value){
      _Skin.gotoAndStop(value);
    }
  }

  return Object369ByFrames;
}));
