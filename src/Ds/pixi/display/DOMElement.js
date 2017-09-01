!(function (factory) {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);
    if (typeof define === 'function' && define.amd) {
        define(['exports'], function (exports) {
            module.exports= factory(root, exports);
        });
    } else if (typeof exports !== 'undefined') {
        module.exports=factory(root, exports);
    } else {
        factory(root, {});
    }
}(function (root, DOMElement) {
  root.Ds = root.Ds || {};
  root.Ds.DsPixi=Ds.DsPixi||{};
  root.DsPixi=root.Ds.DsPixi;
  var DsPixi=root.Ds.DsPixi;
  DsPixi.DOMElement=DOMElement;



  //创建一个给dom容器用的
  var _DomContainer=$("<div id='DsPIXIDefaultDomContainer'><div/>");
  _DomContainer.css({position: 'absolute',left:0, top:0});
  DsPixi.DomContainer=_DomContainer;

  var _prefix = '';
  var _d = document.createElement('div');
  var _prefixes = ['Webkit', 'Moz', 'Ms', 'O'];
  for (var i in _prefixes) {
      if ((_prefixes[i] + 'Transform') in _d.style)_prefix = _prefixes[i];break;
  }

  var _DomTicker=new PIXI.ticker.Ticker();
  _DomTicker.start();
  DsPixi.DOMElement.DomTicker=_DomTicker;

  /**
   * 创建一个关联pixi容器的dom对象
   * @param       {[type]} dom  [dom对象]
   * @param       {[type]} opts [参数]
   * opts.domBox   dom元素添加到的父级节点
   * opts.domRoot  dom元素父级dom添加到节点位置
   * opts.parent   父级pixi元素
   * opts.ticker   进行触发的帧计算对象
   * opts.app   进行触发的帧计算对象
   * @constructor
   */
  function DOMElement(dom,opts){
    opts=opts||{};
    var _self=this;
    var _dom;
    if (dom instanceof HTMLElement) {_dom=$(dom);}
    else if (dom[0] instanceof HTMLElement){ dom=dom[0];_dom=$(dom);}
    else {console.warn('DOMElement dom 参数非法');return;}
    dom.pixiDOMElement=this;
    _dom.css({position: 'absolute',left:0,top:0});
    var _dc=opts.domBox!==undefined?$(opts.domBox):DsPixi.DomContainer;
    _dc.append(_dom);
    dom.style.display='none';

    if(opts.domRoot)$(opts.domRoot).appendTo(_dc);

    dom.style[_prefix+'TransformOrigin']='0 0';
    var _parent;
    Object.defineProperty(this, "parent", {
        get: function() {return _parent;},
        set: function(value) {
          if(!(value instanceof PIXI.DisplayObject))return;
          _parent=value;
        }
    });
    if(opts.parent)  this.parent=opts.parent;


    var _app;
    if(opts.app)_app=opts.app;


    var _ticker;
    if(opts.ticker)_ticker=opts.ticker;
    else  {
      if(_app)_ticker=_app.ticker;
      else _ticker=DsPixi.DOMElement.DomTicker;
    }

    /**
     * 更新dom样式
     * @type {[type]}
     */
    this.update=update;
    function update(){
        // console.log('_parent in stage',_app.stage.contains(_parent));
        if(!_parent){dom.style.display='none';return;}
        if(!_parent.parent)dom.style.display='none';
        else if(_app){
          if(_app.stage.contains(_parent))dom.style.display='block';
          else {
            dom.style.display='none';
            return;
          }
        }
        else dom.style.display='block';
        // console.log('_app:',_app);
        var _alpha=_parent.worldAlpha;
        var _wt=_parent.worldTransform;
        dom.style[_prefix+'Transform']= 'matrix('+_wt.a+','+_wt.b+','+_wt.c+','+_wt.d+','+_wt.tx+','+_wt.ty+')';
        dom.style.opacity=_alpha;
    }
    this.destroy=function(){
      _parent=null;
      if(_ticker)_ticker.remove(update,this);
      _ticker=null;
      _dom.remove();
      _dom=null;
      dom=null;
      dom.pixiDOMElement=null;
      _app=null;
    };
    if(_ticker)_ticker.add(update,this);
  }

  return DOMElement;

}));
