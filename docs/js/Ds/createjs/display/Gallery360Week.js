/**
 * @class Ds.gemo.Gallery360Week
 * @classdesc:
 * 一周360度浏览画廊 头尾衔接，在茶π项目中使用过
 * 带陀螺仪控制  带拖动控制   横竖屏幕都兼容使用
 * @extends
 * @example: 举例
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
!(function (factory) {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);

    if (typeof define === 'function' && define.amd) {
        define(['exports'], function (exports) {
            require('ds/gemo/OGerModel');
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
  root.Ds.createjs.display.Gallery360Week=Gallery360Week;

  function Gallery360Week(){
    //陀螺仪 拖动控制器
    var _OGerModel;
    //容器
    var _WeekPanel;
    /**
     * 场景列表
     * @type {Array}
     *
     */
    var _SceneArr = [];
    //场景上可以被错位的元素
    var _ProspectArr = [];
    //场景总数
    var _SceneAllNum = 5;
    //单个场景宽
    var _SceneW = 1660;
    //单个场景高
    var _SceneH = 1040;
    //这个大场景宽高
    var _MaxW = _SceneW * _SceneAllNum;
    //间隔值
    var _GI = 1 / _SceneAllNum;
    //补全画面长度
    var _CompletionSceneNum = 2;
    //组件的宽高设定
    var _Width=640,_Height=1040;
    /**
     * 宽
     * @type {[type]}
     */
    Object.defineProperty(this, "Width", {
        get: function() {
            return _Width;
        },
        set: function(value) {
          if(_Width==value)return;
          _Width=value;
          _Self.SetSize(_Width,_Height);
        }
    });
    /**
     * 高
     * @type {[type]}
     */
    Object.defineProperty(this, "Height", {
        get: function() {
            return _Height;
        },
        set: function(value) {
          if(_Height==value)return;
          _Height=value;
          _Self.SetSize(_Width,_Height);
        }
    });
    /**
     * 初始化创建一个画廊
     * @param {[type]} weekPanel [画廊一周显示对象]
     * @param {[type]} sceneArr [场景数组]
     * _Scene=sceneArr[i]
     * _Scene 是一个单个显示对象容器
     * _Scene.prospects 当前场景内需要做偏移的图层对象数组
     * _mc=_Scene.prospects[i]; 图层偏移对象
     * _mc.num    等于这个场景顺序号
     * _mc.speed  等于这个图层错层偏移值
     *
     * @param {[type]} opts     [description]
     * opts.sceneW 单个场景宽
     * opts.sceneH 单个场景高
     */
    this.Create=function(weekPanel,sceneArr,opts){
      console.log('Gallery360Week Create');
      _WeekPanel=weekPanel;
      _SceneArr=sceneArr.concat();
      _SceneAllNum=_SceneArr.length;
      _SceneW=opts.sceneW||1660;
      _SceneH=opts.sceneH||1040;
      _MaxW = _SceneW * _SceneAllNum;
      _GI = 1 / _SceneAllNum;
      this.SetSize(_SceneW,_SceneH);
      _ProspectArr = [];
      for (var i = 0; i < _SceneArr.length; i++) {
          var _scene = _SceneArr[i];
          var _prospects = _scene.prospects;
          for (var j = 0; j < _prospects.length; j++) {
              var _mc = _prospects[j];
              _mc.ox = _mc.x;
              _ProspectArr.push(_mc);
          }
      }
      //创建 陀螺仪 拖动控制器
      _OGerModel = new Ds.gemo.OGerModel($('#cjsBox'), {
          touchSpeed: 0.25, //拖动系数
          rotationSpeedY: 0.1, //陀螺仪运动系数
          touchDirectio: true, //拖动方向 不同操作有不同的拖动方向感觉
          weekY: 360, //Y轴一周度数 建议在90-360之间
      });
      _OGerModel.on('update', OGerModelUpDate);
      //开启控制器
      _OGerModel.AnimateOn();
      createjs.Ticker.addEventListener("tick", UpDate);
    };
    /**
     * 是否锁定陀螺仪
     * @param {[type]} bool [description]
     */
    this.OrienterLook=function(bool){
      // log('OrienterLook:',bool);
      _OGerModel.OrienterLook=bool;
    };
    /**
     * 设置拖拽系数
     * @type {[Number]}
     */
    Object.defineProperty(this, "TouchSpeed", {
        get: function() {
            return _OGerModel.TouchSpeed;
        },
        set: function(value) {
          _OGerModel.TouchSpeed=value;
        }
    });
    var _ProportionY=0;
    function OGerModelUpDate(e){
      _ProportionY = -e.proportionY;
    }
    //用于记录之前屏幕是否需要补全的值
    var _CompletionRY = -1;
    /**
     * 360度 陀螺仪与手指拖动事件
     * @param {[Event Object]} e [陀螺仪与拖动事件]
     */
    function UpDate(e) {
        //Y轴百分比
        var _proportionY = -_ProportionY;
        // 开始进行计算360度场景适应情况
        var _ry = _proportionY < 0 ? 1 + _proportionY : _proportionY;
        var _x = -_ry * _MaxW;
        // log(_ry)
        //场景定位
        _WeekPanel.x = _x;

        //进行判断屏幕是否需要补全
        var _analysisBool = false;
        //初始化那不用想了 直接需要进行补全计算
        if (_CompletionRY < 0) {
            _CompletionRY = _ry;
            _analysisBool = true;
        } else {
            //记录屏幕补全时候分界线值
            var _tempRY = 1 - _GI * _CompletionSceneNum;
            //当前数据与之前数据有差异 需要补全
            if (_CompletionRY >= _tempRY && _ry < _tempRY) {
                _analysisBool = true;
                _CompletionRY = _ry;
            }
            //当前数据与之前数据有差异 需要补全
            if (_CompletionRY < _tempRY && _ry >= _tempRY) {
                _analysisBool = true;
                _CompletionRY = _ry;
            }
        }
        //需要进行屏幕补全
        if (_analysisBool) CompletionScene(_ry);

        //场景错层数据计算
        for (var i = 0; i < _ProspectArr.length; i++) {
            var _mc = _ProspectArr[i];
            var _num = (_ry - _mc.num * _GI) / _GI;
            _num = Math.max(-1, Math.min(1, _num));
            _mc.x = _mc.ox + _mc.speed * _num;
        }
    }
    /**
     * 计算屏幕补全算法
     * //优化性能剔除算法 （目前还未完成）
     * //考虑横竖屏幕做场景补全 使用多少个屏幕进补全_CompletionSceneNum，通过自适应算法计算出补全数
     * //还需要考虑场景补全前后衔接时候内部元素错层的计算，对每个场景内元素都需要做下场景位置变化计算
     * @param {[type]} ry [屏幕定位百分比值]
     */
    function CompletionScene(ry) {
        console.log('CompletionScene');
        var i,j,_scene,_prospects,_mc ;
        if (ry >= 1 - _GI * _CompletionSceneNum) {
            for (i = 0; i < _CompletionSceneNum; i++) {
                _scene = _SceneArr[i];
                _scene.x = _SceneW * (_SceneAllNum + i) - 3 * (i + 1);
                _prospects = _scene.prospects;
                for (j = 0; j < _prospects.length; j++) {
                    _mc = _prospects[j];
                    _mc.num = (_SceneAllNum + i);
                }
            }
        } else {
            for (i = 0; i < _CompletionSceneNum; i++) {
                _scene = _SceneArr[i];
                _scene.x = _SceneW * i;
                _prospects = _scene.prospects;
                for (j = 0; j < _prospects.length; j++) {
                    _mc = _prospects[j];
                    _mc.num = i;
                }
            }
        }
    }
    /**
     * 设置组件大小
     * @param {[type]} width  [description]
     * @param {[type]} height [description]
     */
    this.SetSize=function(width,height){
      if(width!==undefined&&width!==null)_Width=width;
      if(height!==undefined&&height!==null)_Height=height;
      //计算判断需要进行做补全的场景数目
      _CompletionSceneNum = Math.ceil(_Width / (_SceneW / 2));
    };

  }
  return Gallery360Week;
}));
