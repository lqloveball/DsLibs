/**
 * @class Ds.createjs.GalleryLooper
 * @classdesc:
 * 环形作品画廊 基于Ds.gemo.GalleryAnnularLoopManager进行逻辑计算
 *  比如作品有 0-15 ，一共显示3个显示第0个时候   呈现的数据是 14  0 1 这样格式
 *
 * @param {[Object]} opts     [初始化参数]
 * opts.box   [容器 createjs.Container]
 * 显示容器 定位显示对象命名规范 mc0-mc3
 * 消失显示对象命名规范 box.leftOut box.rightOut
 * opts.list  [填充数据显示对象 createjs.DisplayObject]
 * opts.showNum [显示个数 Number]
 * opts.autoInit 是否初始化构建，Boolean
 * opts.filters 是否支持滤镜效果附加，Boolean
 * opts.touchDom 滑动触发的dom元素，默认是body
 * opts.touchDirection 滑动触发方向，默认true 是左右滑动
 *
 * flash 内皮肤参考结构
 *                                    [----------]
 *                        [------]    |          |    [------]
 *    [  beforeOut ]      | mc0  |    |    mc1   |    | mc2  |       [  afterOut ]
 *                        [------]    [----------]    [------]
 * 某种情况下需要手动控制开始构建初始化，
 * 如：一开始场景需要提前渲染，然后回执行setTimeout对box进行删除所有的内容，这时候如果自动今天构建，那就会发生先添加元素到box内，然后setTimeout对box进行删除所有的内容错误
 *
 * @event
 * event.type=upDate
 * event.old: _OldShowObjects, //旧数据组
 * event.now: _NowShowObjects, //新数据组
 * event.oldNums: _OldNumArr, //旧编号数据组
 * event.nowNums: _NowNumArr, //新编号数据组
 * event.seletNum: _SelectNum, //当前选择数字
 * event.seletObj: _SelectObj, //当前选择对象
 * event.isInit: (_OldSelectNum == -1) ? true : false, //是否初始化数据
 * event.direction: _Direction, //方向
 *
 * event.type=movieEnd
 * @extends
 * @example: 举例
 *
 //webpack 进行 require
 // require('ds/createjs/display/GalleryLooper');
 var _GalleryLooper = new Ds.createjs.display.GalleryLooper({
     box:_Panel,//动画显示与参考容器
     list:_ItemList,//选项内容
     showNum:3,//显示项目个数
     autoInit:false,//是否自动构建
     filters:true,//是否动画需要做滤镜支持，滤镜是消耗性能的
 });
 //如果创建参数里面autoInit值为false,没有进行自动构建，可以在实例需要构建初始化时候执行
_GalleryLooper.Init();
 //监听事件
 _GalleryLooper.on('upDate', function(e){});
 //上一页
 _GalleryLooper.Previous();
 //下一页
 _GalleryLooper.Next();
 //选择项队列里面的1
 _GalleryLooper.Select(1);
//设置锁  不会拖动
_GalleryLooper.Lock=true;

 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
(function(factory) {
  var root = (typeof self == 'object' && self.self == self && self) ||
    (typeof global == 'object' && global.global == global && global);

  if (typeof define === 'function' && define.amd) {
    define(['exports'], function(exports) {
      require('ds/EventDispatcher');
      require('ds/gemo/GalleryAnnularLoopManager');
      module.exports = factory(root, exports);
    });
  } else if (typeof exports !== 'undefined') {
    module.exports = factory(root, exports);
  } else {
    factory(root, {});
  }
}(function(root, modelObj) {
  root.Ds = root.Ds || {};
  root.Ds.createjs = root.Ds.createjs || {};
  root.Ds.createjs.display = root.Ds.createjs.display || {};
  root.Ds.createjs.display.GalleryLooper = GalleryLooper;

  function GalleryLooper(opts) {
    if (!opts.box) {
      console.warn('显示容器不能为空');
      return;
    }
    Ds.Extend(this, new Ds.EventDispatcher());
    var _Self = this;
    var _Box = opts.box;
    var _showNum = opts.showNum !== undefined ? opts.showNum : 3;
    //是否有滤镜效果
    var _filters = opts.filters !== undefined ? opts.filters : false;
    //数据
    var _DataArr = opts.list;
    //触摸事件的dom元素
    var _touchDom = opts.touchDom !== undefined ? $(opts.touchDom)[0] : $('body')[0];
    //滑动方向
    var _touchDirection = opts.touchDirection !== undefined ? opts.touchDirection : true;

    //是否锁定
    this.Lock = false;
    //是否运动中
    this.MovieIng = false;
    //触摸
    touch.on(_touchDom, 'swipeleft', function() {
      if (_touchDirection) _Self.Next();
    });
    touch.on(_touchDom, 'swiperight', function() {
      if (_touchDirection) _Self.Previous();
    });
    touch.on(_touchDom, 'swipedown', function() {
      if (!_touchDirection) _Self.Previous();
    });
    touch.on(_touchDom, 'swipeup', function() {
      if (!_touchDirection) _Self.Next();
    });
    //Reference参考对象
    //左消失
    var _BeforeOut = _Box.beforeOut;
    //右消失
    var _AfterOut = _Box.afterOut;
    //参考排列
    var _ReferenceArr = [];
    for (var i = 0; i < _showNum; i++) {
      var _rf = _Box['mc' + i];
      _ReferenceArr.push(_rf);
      //if(_rf.parent)_rf.parent.removeChild(_rf);
    }

    //画廊滚动管理对象
    var _GalleryLoopManager = new Ds.gemo.GalleryAnnularLoopManager(null, _showNum);
    this.GalleryLoopManager = _GalleryLoopManager;
    var _AutoInit = opts.autoInit !== undefined ? opts.autoInit : true;
    var _InitBool = false;
    /**
     * 选择索引
     * @type {[type]}
     */
    Object.defineProperty(this, "SelectNum", {
      get: function() {
        return _GalleryLoopManager.SelectNum;
      },
    });
    /**
     * 选择的对象
     * @type {[type]}
     */
    Object.defineProperty(this, "SelectObj", {
      get: function() {
        return _GalleryLoopManager.SelectObj;
      },
    });

    /**
     * 初始化
     */
    this.Init = function() {
      if (_InitBool) return;
      _InitBool = true;

      //监听事件
      _GalleryLoopManager.on(_GalleryLoopManager.event.UP_DATE, UpData);
      setTimeout(function() {
        //清空显示容器
        _Box.removeAllChildren();
        //初始化数据
        _GalleryLoopManager.InitData(_DataArr);
      }, 200);

    };
    /**
     * 数据构建
     * @param  {[type]} list [description]
     * @return {[type]}      [description]
     */
    this.InitData = function(list) {
      _DataArr = list;
      //清空显示容器
      _Box.removeAllChildren();
      //初始化数据
      _GalleryLoopManager.InitData(_DataArr);
    };

    /**
     * 上一个
     */
    this.Previous = function() {
      if (this.Lock) return;
      if (this.MovieIng) return;
      _GalleryLoopManager.Previous();
    };
    /**
     * 下一个
     */
    this.Next = function() {
      if (this.Lock) return;
      if (this.MovieIng) return;
      _GalleryLoopManager.Next();
    };
    /**
     * 选择显示对象
     * @param {[Number]} value []
     */
    this.Select = function(value) {
      if (this.Lock) return;
      if (this.MovieIng) return;
      _GalleryLoopManager.Select(value);
    };
    /**
     * 重置所有数据
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    this.InitData=function(data) {
      _Box.removeAllChildren();
      _GalleryLoopManager.InitData(data);
    }
    /**
     * [UpData 数据更新]
     * @param {[type]} e [事件对象]
     * {
        type:_Self.event.UP_DATE,				//更新数据
        old:_OldShowObjects,    				//旧数据组
        now:_NowShowObjects,    				//新数据组
        oldNums:_OldNumArr,    					//旧编号数据组
        nowNums:_NowNumArr,    					//新编号数据组
        seletNum:_SelectNum,					//当前选择数字
        seletObj:_SelectObj,					//当前选择对象
        isInit:(_OldSelectNum==-1)?true:false,	//是否初始化数据
        direction:_Direction,					//方向
      }
     */
    function UpData(e) {
      if (_Self.MovieIng) return;
      _Self.MovieIng = true;
      var i, _mc, _rf, _nowArr, _oldArr;
      //判断是否初始化
      if (e.isInit) {
        _Box.removeAllChildren();
        _nowArr = e.now;
        console.log('isInit', _nowArr.length);
        for (i = 0; i < _nowArr.length; i++) {
          _mc = _nowArr[i];
          if (_mc) {
            _rf = _ReferenceArr[i];
            _mc.scaleX = _mc.scaleY = _rf.scaleX;
            _mc.x = _rf.x;
            _mc.y = _rf.y;
            //是否更新滤镜
            if (_filters) UpFilters(_mc, _rf);
            _Box.addChild(_mc);
          }
        }
        _Self.MovieIng = false;
      } else {
        _nowArr = e.now;
        _oldArr = e.old;
        var _time = 0.5;
        var _outMc = e.direction ? _BeforeOut : _AfterOut;
        var _inMc = e.direction ? _AfterOut : _BeforeOut;
        for (i = 0; i < _oldArr.length; i++) {
          _mc = _oldArr[i];
          if (_nowArr.indexOf(_mc) == -1 && _mc) {
            JT.to(_mc, _time, {
              x: _outMc.x,
              y: _outMc.y,
              alpha: _outMc.alpha,
              scaleX: _outMc.scaleX,
              scaleY: _outMc.scaleY,
              onEnd: function(temp) {
                if (temp.parent) temp.parent.removeChild(temp);
              },
              onEndParams: [_mc],
            });
          }
        }
        for (i = 0; i < _nowArr.length; i++) {
          _mc = _nowArr[i];
          _rf = _ReferenceArr[i];
          //是否更新滤镜
          if (_filters) UpFilters(_mc, _rf);
          if (_oldArr.indexOf(_mc) == -1) {
            JT.set(_mc, {
              x: _inMc.x,
              y: _inMc.y,
              alpha: _inMc.alpha,
              scaleX: _inMc.scaleX,
              scaleY: _inMc.scaleY
            });
            _Box.addChild(_mc);
          }
          JT.to(_mc, _time, {
            x: _rf.x,
            y: _rf.y,
            alpha: _rf.alpha,
            scaleX: _rf.scaleX,
            scaleY: _rf.scaleY,
            onEnd: MovieEnd,
            onEndParams: [i],
          });
        }
      }
      _Self.ds(e);
    }
    //更新滤镜
    function UpFilters(mc, rf) {
      if (rf.filters && rf.filters.length >= 1) {
        mc.filters = rf.filters;
        if (mc.cacheCanvas) {
          mc.updateCache();
        } else {
          var _rect = rf.getBounds();
          mc.cache(_rect.x, _rect.y, _rect.width, _rect.height);
        }
      } else {
        mc.filters = [];
        mc.uncache();
      }
    }
    //动画播放完成
    function MovieEnd(value) {
      //动画是否播放完成
      if (value == 1) {
        _Self.MovieIng = false;
        _Self.ds('movieEnd');
      }
    }
    if (_AutoInit) _Self.Init();
  }

  return root.Ds.createjs.GalleryLooper;
}));
