/**
 * @class Ds.gemo.Gesture
 * @classdesc:手势控制
 * @extends 翻译至Shrek.wang, shrekshrek@gmail.com的的熊猫TV项目
 * @example: 举例
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  我发起Ds库目的，简化方便工作项目开发。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里代码很多也都来源至或参考网络开源开放代码，所以这个库也开源开放。更多希望团队成员把积累工作中常用的代码，加快自己开发效率。
 * @constructor
 **/
!(function(){
  window.Ds=window.Ds ||{};
  window.Ds.gemo=window.Ds.gemo ||{};
  window.Ds.gemo.Gesture=Gesture;

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
      this.Stage=null;

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
})();