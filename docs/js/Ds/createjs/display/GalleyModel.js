/**
 * @class Ds.createjs.display.GalleyModel=GalleyModel;
 * @classdesc: [画廊类 Lammer使用过]
 * @param       {[Object]} opts [配置]
 * opts.sceneWidth   场景宽
 * opts.sceneHeight  场景高
 * opts.viewWidth    视觉画布宽，默认开启opts.autoReSize  自动来计算
 * opts.autoReSize  是否自动算自适应
 * opts.loop        是否前后衔接
 * opts.speedCut    是否滑动减速度  默认减速 0.05
 * opts.maxSpeed    最大运动速度
 * opts.progressType    子对象进行运动时候使用百分比计算方式
 * opts.scenes      初始化传入场景列表  也可以之后通过 AddSceneList与AddScene方法来
 * opts.debug      是否进行debug
 * @event
 * e.type='update' 场景进行更新
 * e.sceneID        当前在第几个场景
 * e.inViewScenes  在视图内的场景
 * e.scenes[0].inRect   场景与视图相交的区域大小
 * e.scenes   更新的场景列表
 * e.scenes[0].progress 场景相对画布 进行显示的百分比
 * e.scenes[0].progress2 场景相对画布 进行显示的百分比
 *                   <_SceneWidth progress 30%----------------------------------|
 *                                     |          |           |
 *                                     |<----_ViewWidth------>|
 *                                     |          |           |
 *                                     <_SceneWidth progress  0%----------------------------------|                   |
 *                                     |<----_ViewWidth------>|
 *                                     |          |           |
 * <_SceneWidth progress 30%----------------------------------|
 *                                     |<----_ViewWidth------>|
 *
 *              |  _ViewWidth   |
 *    <-------------------------|_scene.progress 100%
 *                              |  _ViewWidth   |
 *    <-------------------------|_scene.progress2 100%
 *
 * @extends
 * @example: 举例
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright: Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
(function (factory) {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);

    if (typeof define === 'function' && define.amd) {
        define(['exports'], function (exports) {
            require('ds/gemo/SliderHVDistance');
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
  root.Ds.createjs.display.GalleyModel=GalleyModel;
  function GalleyModel(opts){
    var _Self=this;
    //配置
    opts=opts||{};
    //事件继承
    Ds.Extend(this, new Ds.EventDispatcher());
    //场景列表
    var _SceneList=[];
    Object.defineProperty(this, "Scenes", {get: function() {return _SceneList;},});
    //场景宽
    var _SceneWidth = opts.sceneWidth||2969;
    //场景高
    var _SceneHeight = opts.sceneHeight||1140;
    //视觉画布宽
    var _ViewWidth=opts.viewWidth||640;
    //画布区域
    var _ViewRect=new createjs.Rectangle(0, 0,_ViewWidth, _SceneHeight);
    //是否自动计算自适应
    var _AutoReSize=opts.autoReSize!==undefined?opts.autoReSize:true;
    //进行debug测试
    var _Debug=opts.debug!==undefined?opts.debug:true;
    //是否循环
    var _Loop=opts.loop!==undefined?opts.loop:true;
    //ChildUpDate  使用的_ProgressType方式
    var _ProgressType=opts.progressType!==undefined?opts.progressType:1;
    //计算屏幕补差的矩形区域
    var _MovieInViewRect=new createjs.Rectangle(-(_ViewWidth*3-_ViewWidth)/2, 0,_ViewWidth*3, _SceneHeight);
    //当前距离
    var _Distance=0;
    Object.defineProperty(this, "Distance", {
        get: function() {
            return _Distance;
        },
        set: function(value) {
          _Distance=value;
          UpDate();
        }
    });
    //总场景距离  _SceneWidth*(_SceneList.length);
    var _AllDistance=0;
    //var _AllDistance=_SceneWidth*(_SceneList.length);

    //平滑拖动管理对象
    var _SliderDistance = new Ds.gemo.SliderHVDistance(_Self, 'Distance', {
      touchDom:$('#screen'),
      interval:640,
      hasAutoSpeed:true,
      speedCut:opts.speedCut!==undefined?opts.speedCut:0.05,
      isLoop:_Loop,
      isVerticalTouch:false,
      touchDirection:false,
      maxSpeed:opts.maxSpeed!==undefined?opts.maxSpeed:15,
      minSpeed:0,
      min:0,
      max:_AllDistance,
    });

    //是否锁定
    Object.defineProperty(this, "Lock", {
        get: function() {
            return _SliderDistance.Lock;
        },
        set: function(value) {
          _SliderDistance.Lock=value;
        }
    });

    //主要容器
    var _View=new createjs.Container();
    Object.defineProperty(this, "View", {get: function() {return _View;},});
    //抽离背景层
    var _BgBox=new createjs.Container();
    _View.addChild(_BgBox);
    //滚动容器
    var _Box=new createjs.Container();
    _View.addChild(_Box);
    //抽离浮动层
    var _ChildBox=new createjs.Container();
    _View.addChild(_ChildBox);

    //======================测试代码=================
    if(_Debug){
      _View.scaleX=_View.scaleY=0.25;
      _View.x=(640-640*_View.scaleX)/2;
      var shape=new createjs.Shape();
      shape.graphics.beginFill("red").drawRect(0, 0, 640, _MovieInViewRect.height);
      shape.alpha=0.5;
      _View.addChild(shape);
      var _readShape=new createjs.Shape();
      _readShape.graphics.beginFill("greed").drawRect(_MovieInViewRect.x, _MovieInViewRect.y, _MovieInViewRect.width, _MovieInViewRect.height);
      _readShape.alpha=0.5;
      _View.addChild(_readShape);
      window.SceneList=_SceneList;
    }
    //======================测试代码=================

    /**
     * 添加场景列表
     * @param  {[type]} scenes [description]
     * @return {[type]}        [description]
     */
    this.AddSceneList=function(scenes){
      for (var i = 0; i < scenes.length; i++) {
        this.AddScene(scenes[i]);
      }
      ReSize();
    };
    /**
     * 添加一个场景
     * @param  {[type]} scene [description]
     * @return {[type]}       [description]
     */
    this.AddScene=function(scene){
      _SceneList.push(scene);
      scene.x=_SceneWidth*(_SceneList.length-1);
      scene.rect=new createjs.Rectangle(0, 0, _SceneWidth, _SceneHeight);
      _Box.addChild(scene);
      var _childBox=new createjs.Container();
      scene.childBox=_childBox;
      _ChildBox.addChild(_childBox);
      _childBox.x=scene.x;
      if(scene.bg){
        // console.log(_SceneList.length-1,'has Bg:',scene.bg);
        _BgBox.addChild(scene.bg);
        scene.bg.ox=scene.bg.x;
        scene.bg.x=scene.x+scene.bg.ox;
        scene.bg.x=scene.x;
      }
      _AllDistance=_Loop?_SceneWidth*(_SceneList.length):_SceneWidth*(_SceneList.length)-_ViewWidth;
      _SliderDistance.MaxDistance=_AllDistance;
      scene.sceneID=_SceneList.length-1;//记录场景的编号
      scene.upChildList=[];
    };
    //如果有场景列表就进行场景列表的添加
    if(opts.scenes){this.AddSceneList(opts.scenes);}
    /**
     * [添加子对象更新数据]
     * @param  {[type]} child [子对象]
     * @param  {[Object or Number]} opts [子对象配置 可以只是一个数字，代表偏移量]
     * opts 是Number,那么这个参数就是speed值（运动偏移值）
     * opts.type 运动方式 default默认是以原来的位置 左右偏移量计算，  fixed 固定值，以原来位置进行百分百运动差值
     * opts.speed
     * @param  {[type]} scene [对应的场景对象]
     * @return {[type]}       [description]
     */
    this.AddChildUpData=function (child,opts,scene) {
      if(!scene)scene=child.parent;
      var _childs=scene.upChildList;
      var _childBox=scene.childBox;
      // console.log('AddChildUpData:',_childs.length);
      child.ox=child.x;
      child.oy=child.y;
      opts=opts||{};
      var _speed=Math.random()>0.5?_SceneWidth/8:-_SceneWidth/8;
      _speed=_speed/2+(_speed/2)*Math.random();
      child.speedType='default';
      if(typeof(opts)==='number')_speed=opts;
      else{
        if(opts.speed!==undefined)_speed=opts.speed;
        if(opts.type!==undefined)child.speedType=opts.type;//fixed
      }
      child.speed=_speed;
      if(_childs.indexOf(child)===-1)_childs.push(child);
      if(opts.toChildBox)_childBox.addChild(child);
    };
    /**
     * 场景更新
     * @constructor
     */
    function UpDate() {
      //计算场景视觉补差  第一个场景补差
      var _sceneStart=_SceneList[0];
      if(_Distance>=_AllDistance-_ViewWidth*2)_sceneStart.x=_SceneWidth*_SceneList.length;
      else  _sceneStart.x=0;
      _sceneStart.childBox.x=_sceneStart.x;
      if(_sceneStart.bg)_sceneStart.bg.x=_sceneStart.x+_sceneStart.bg.ox;
      // if(_sceneStart.bg)_sceneStart.bg.x=_sceneStart.x;

      //计算场景视觉补差  最后一个场景补差
      var _sceneEnd=_SceneList[_SceneList.length-1];
      if(_Distance>=0&&_Distance<=_SceneWidth)_sceneEnd.x=-_SceneWidth;
      else _sceneEnd.x=_SceneWidth*(_SceneList.length-1);
      _sceneEnd.childBox.x=_sceneEnd.x;
      if(_sceneEnd.bg)_sceneEnd.bg.x=_sceneEnd.x+_sceneEnd.bg.ox;
      // if(_sceneEnd.bg)_sceneEnd.bg.x=_sceneEnd.x;

      _Box.x=-_Distance;
      _BgBox.x=_ChildBox.x=_Box.x;
      //进行显示的列表
      var _upList=[];
      //在场景里面的列表
      var _inViewList=[];
      //进行显示对象剔除算法
      var _scene;
      for (var i = 0; i < _SceneList.length; i++) {
        _scene=_SceneList[i];

        var _pt=_scene.localToLocal(0,0,_View);
        var _rect=_scene.rect;
        _rect.x=_pt.x;
        _rect.y=_pt.y;
        var _bool=_MovieInViewRect.intersects(_rect);
        _scene.visible=_bool;
        _scene.childBox.visible=_scene.visible;
        if(_scene.bg){
          _scene.bg.visible=_scene.visible;
          if(_scene.bg.parent!==_BgBox)_BgBox.addChild(_scene.bg);
          _scene.bg.x=_scene.x+_scene.bg.ox;
        }

        //计算显示的场景的进度百分百
        //_bool=_ViewRect.intersects(_rect)
        if(_bool){
          var _progress=0;
          var _w=_SceneWidth-_ViewWidth;
          _progress=-_pt.x/_w;
          _progress=Math.min(Math.max(_progress,0),1);
           _w=_SceneWidth+_ViewWidth;
          var _progress2=-(_pt.x-_ViewWidth)/_w;
          _progress2=Math.min(Math.max(_progress2,0),1);
          _scene.progress=_progress;
          _scene.progress2=_progress2;
          // if(i===0)console.log('_progress:',_progress);
          // if(i===1)console.log('_progress2:',_progress2);
          _upList.push(_scene);
          //对子对象进行更新处理
          ChildUpDate(_scene);
        }
        //计算在显示视图内的场景
        var _inRect=_ViewRect.intersection(_rect);
        _scene.inRect=_inRect;
        if(_inRect){
          _scene.inRectWidth=_inRect.width;
          _inViewList.push(_scene);
        }
      }
      var _sceneID=0;
      var _inViewList2=_inViewList.concat();
      // console.log('_inViewList2',_inViewList2);
      if(_inViewList2.length>=1){
        ArraySort(_inViewList2,'inRectWidth');
        _scene=_inViewList2[_inViewList2.length-1];
        _sceneID=_scene.sceneID;
      }
      _Self.ds({
        type:'update',
        scenes:_upList,//这里只会放需要显示的元素，相对场景上 当前移动进度比
        inViewScenes:_inViewList,//在视图内的场景
        sceneID:_sceneID,//当前在第几个场景
      });
    }
    /**
     * 对子对象进行更新处理
     * @param       {[type]} scene [description]
     * @constructor
     */
    function ChildUpDate(scene) {
      var _progress=scene.progress;
      // var _progress2=scene.progress2;
      var _childs=scene.upChildList;
      // if(!_Loop&&(scene.sceneID>0&&scene.sceneID<_SceneList.length-1)){
      //   _progress=scene.progress2;
      // }
      if(_ProgressType===2)_progress=scene.progress2;
      // console.log('ChildUpDate:',_childs.length);
      for (var i = 0; i < _childs.length; i++) {
        var _child=_childs[i];
        if(_child.speedType==='fixed'){
          _child.x=_child.ox+_progress*_child.speed;
        }else{
          _child.x=(_child.ox-_child.speed/2)+_progress*_child.speed;
        }
      }
    }
    /**
     * 按数组内指定参数升续排列
     * @param       {[type]} arr   [description]
     * @param       {[type]} value [description]
     * @constructor
     */
    function ArraySort(arr, value) {
      var compare = function(prop) {
        return function(obj1, obj2) {
          var val1 = obj1[prop];
          var val2 = obj2[prop];
          if (val1 < val2) {
            return -1;
          } else if (val1 > val2) {
            return 1;
          } else {
            return 0;
          }
        };
      };
      return arr.sort(compare(value));
    }
    //自适应
    window.addEventListener("resize", function() {
      ReSize();
      setTimeout(function() {ReSize();}, 100);
    });
    //计算自适应 _PopLayerContainer设置宽高
    function ReSize() {
      if(!_AutoReSize)return;
      var _width, _height, _pageScale, _actualH, _horizontal = false,
        _isInputState = false;
      _width = window.innerWidth;
      _height = window.innerHeight;
      //计算是否横屏
      if (_width > _height) _horizontal = true;
      else _horizontal = false;
      if (_width / _height > 3) {
        //算出竖屏幕下输入框状态下比例
        _isInputState = true;
      } else if (_width / _height < 12 / 7 && _width / _height > 1) {
        //算出竖屏幕下输入框状态下比例
        _isInputState = true;
        //说明这时候不会是横屏
        _horizontal = false;
      } else {
        //非输入状态
        _isInputState = false;
      }
      if (_horizontal) _screenWidth = 1138;
      else _screenWidth = 640;
      //计算缩放比例
      _pageScale = _width / _screenWidth;
      //计算实际高度
      _actualH = _height / _pageScale;
      if(_isInputState)return;
      //按高来自动适应
      var _s=_actualH/_SceneHeight;
      _View.scaleX=_View.scaleY=_s;
      //按高自适应后 视觉画布宽重新计算
      _s=_SceneHeight/_actualH;
      var _viewWidth=_screenWidth*_s;
      _ViewRect.width=_viewWidth;
      //视觉画布宽
      _ViewWidth=_viewWidth;
      //计算屏幕补差的矩形区域
      _MovieInViewRect.x=-(_ViewWidth*3-_ViewWidth)/2;
      _MovieInViewRect.y=0;
      _MovieInViewRect.width=_ViewWidth*3;
      _MovieInViewRect.height=_SceneHeight;
      //计算大的距离长度
      _AllDistance=_Loop?_SceneWidth*(_SceneList.length):_SceneWidth*(_SceneList.length)-_ViewWidth;
      _SliderDistance.MaxDistance=_AllDistance;
    }
    ReSize();
  }

  return root.Ds.createjs.display.GalleyModel;
}));
