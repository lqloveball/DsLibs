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
  /**
   * 是否进行自动更新dom显示状态，这个非常消耗性能。
   * 但普通技术人员怕控制不好这个刷新，所以可以默认设置成true.
   * 但还是建议在页面切换 或者 需要更新状态时候使用 DsPixi.UpDOMListState();来进行更新
   * @type {Boolean}
   */
  DsPixi.DOMAuto=false;




  //创建一个给dom公用的一个容器
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

  var  _DomPIXIList=[];

  /**
   * 更新检查当前关联pixi的dom状态
   * @return {[type]} [description]
   */
  DsPixi.UpDOMListState=function(){
    for (var i = 0; i < _DomPIXIList.length; i++) {
      if(_DomPIXIList[i])_DomPIXIList[i].upInStageState();
    }
  };

  /**
   * 创建一个关联pixi容器的dom对象
   * @param       {[type]} dom  [dom对象]
   * @param       {[type]} opts [参数]
   * opts.domBox   dom元素添加到的父级节点
   * opts.domRoot  dom元素父级dom添加到节点位置
   * opts.parent   父级pixi元素
   * opts.ticker   进行触发的帧计算对象，如果设置opts.app 会以app.ticker为准
   * opts.app   进行触发的计算ticker的app对象。
   * opts.auto   进行触发的帧计算dom对应显示状态
   * @constructor
   */
  function DOMElement(dom,opts){
    opts=opts||{};
    // console.log('create DOMElement opts',opts.parent);
    var _self=this;
    _DomPIXIList.push(_self);
    var _dom;
    if (dom instanceof HTMLElement) {_dom=$(dom);}
    else if (dom[0] instanceof HTMLElement){ dom=dom[0];_dom=$(dom);}
    else {console.warn('DOMElement dom 参数非法');return;}
    dom.pixiDOMElement=this;
    _dom.css({position: 'absolute',left:0,top:0});
    dom.style[_prefix+'TransformOrigin']='0 0';
    var _dc=opts.domBox!==undefined?$(opts.domBox):DsPixi.DomContainer;
    _dc.append(_dom);
    dom.style.display='none';
    if(opts.domRoot)$(opts.domRoot).appendTo(_dc);
    Object.defineProperty(this, "parent", {
        get: function() {return _parent;},
        set: function(value) {
          // console.log('DOMElement parent set ',value);
          if(!(value instanceof PIXI.Container))return;
          if(_parent){
            _parent.off('added',added);
            _parent.off('removed',removed);
          }
          _parent=value;
          _parent.on('added',added);
          _parent.on('removed',removed);
          upInStageState();
        }
    });

    var _parent;
    var _inStage=false;
    var _auto=opts.auto!==undefined?opts.auto:(DsPixi.DOMAuto?true:false);


    var _app;
    if(opts.app)_app=opts.app;

    if(opts.parent) this.parent=opts.parent;
    if(_app&&_app.stage.contains(_parent))_inStage=true;

    var _ticker;
    if(opts.ticker)_ticker=opts.ticker;
    else  {
      if(_app)_ticker=_app.ticker;
      else _ticker=DsPixi.DOMElement.DomTicker;
    }

    function added(){
      // console.log('added');
      upInStageState();
    }
    function removed(){
      // console.log('removed');
      _inStage=false;
    }
    //判断dom对象 是否在场景上需要显示
    this.upInStageState=upInStageState;
    function upInStageState(){
      if(_app&&_app.stage.contains(_parent))_inStage=true;
      else _inStage=false;
    }
    /**
     * 更新dom样式
     * @type {[type]}
     */
    this.update=update;
    function update(){
        //  console.log('update',_parent,_app.stage.contains(_parent));
        if(!_parent){dom.style.display='none';return;}
        if(!_parent.parent)dom.style.display='none';
        else if(_app){
          // console.log('_parent in stage',_app.stage.contains(_parent));
          if(_auto)upInStageState();
          if(_inStage)dom.style.display='block';
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

      for (var i = 0; i < _DomPIXIList.length; i++) {
        var _temp=_DomPIXIList[i];
        if(_temp==this)_DomPIXIList.splice(i,1);
      }
    };
    if(_ticker)_ticker.add(update,this);
  }

  return DOMElement;

}));
