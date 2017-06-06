/**
 * @class  Pano2vr45Manager
 * @classdesc: 针对45版本的Pano2vr扩展修改,请使用libs/pano2vr下的pano2vr_player_4.5.js与pano2vrgyro4.5.js
 * @extends
    require('libs/pano2vr/pano2vr_player_4.5.js');//使用45版本，并且做了部分修改的
    require('libs/pano2vr/pano2vrgyro4.5.js');//记的需要改造绑定下类 window.pano2vrGyro=pano2vrGyro;
    require('pano2vrAssets/skin.js');//记的需要改造绑定下类 window.pano2vrSkin=pano2vrSkin;
 * @example:
 //require('ds/gemo/Pano2vr45Manager');
 var _Pano2vr45Manager=new Ds.gemo.Pano2vr45Manager("pano2vrContainer",'./pano2vr/assets/');
 var _Pano=_Pano2vr45Manager.Pano;
 window.pano = _Pano;
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright: Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
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
    root.Ds.gemo.Pano2vr45Manager = Pano2vr45Manager;

    function Pano2vr45Manager(domID,path,GyroDomID) {
        var _Self = this;
        Ds.Extend(this, new Ds.EventDispatcher());
        //全景资源路径
        var _PathBase = path||'';
        //创建全景对象
        var _Pano = new pano2vrPlayer(domID);
        Object.defineProperty(this, "Pano", {get: function() {return _Pano;},});
        //绑定到一个window对象上
        // window.pano = _Pano;
        //设置全景加载资源路径
        _Pano.setBasePath(_PathBase);
        //添加全景的皮肤
        _Skin = new pano2vrSkin(_Pano, _PathBase);
        Object.defineProperty(this, "Skin", {get: function() {return _Skin;},});
        //添加控制器
        var _GyroDomID=GyroDomID||domID;
        var _Gyro = new pano2vrGyro(_Pano, _GyroDomID);
        Object.defineProperty(this, "Gyro", {get: function() {return _Gyro;},});
        // window.gyro = _Gyro;
        //对Pano2vr进行扩展
        Pano2VRExtend(_Pano);
        //场景列表
        var _SceneList;
        Object.defineProperty(this, "SceneList", {get: function() {return _SceneList;},});
        /**
         * 开始加载场景
         * @return {[type]} [description]
         */
        this.Load = function(url) {
            _Pano.readConfigUrl(_PathBase + url);
            UpLoadProgress();
        };
        //是否第一次加载
        var _FirstLoad=true;
        //加载进度
        var _InitStartLoad=false;
        var _UpLoadProgressTimer,UpLoadProgressTime=100;
        function UpLoadProgress(){
          clearTimeout(_UpLoadProgressTimer);
          var _progress=_Pano.getPercentLoaded();
          // console.log('progress:',_progress);
          if(_progress<1){
            if(_progress===0&&!_InitStartLoad){
              _Self.ds({
                type:'startLoad'
              });
              _InitStartLoad=true;
              // console.log('startLoad');
            }
            _Self.ds({
              type:'progress',
              progress:_progress,
            });
            _UpLoadProgressTimer=setTimeout(UpLoadProgress,UpLoadProgressTime);
          }else{
            clearTimeout(_UpLoadProgressTimer);
            // console.log('complete');
            _InitStartLoad=false;
            if(_FirstLoad){
              _FirstLoad=false;
              _SceneList = _Pano.getNodeIds();
              _Self.ds({
                  type: 'upScene',
                  hotspots: pano.getPointHotspotIds(),
                  scene:_Pano.getCurrentNode(),
              });
            }
            //加载完成
            _Self.ds({
              type:'complete'
            });
          }
        }
        _Self.on('upScene',function(){
          UpLoadProgress();
        });

        /**
         * 跳转到制定的场景
         * @param  {[type]} value [description]
         * @return {[type]}       [description]
         */
        this.GotoScene = function(value) {
          if(_SceneList.length<=0)return;
          var _nodeName=_SceneList[value];
          if(_nodeName){
            _Pano.openNext('{'+_nodeName+'}');
          }
        };
        /**
         * 跳转到制定节点场景
         * @param  {[type]} value [description]
         * @return {[type]}       [description]
         */
        this.OpenNext=function(value){
          _Pano.openNext(value);
        };
        /**
         * [description]
         * @param  {[type]} value   [description]
         * @param  {[type]} hotspot [description]
         * @return {[type]}         [description]
         */
        this.OpenUrl=function(value,hotspot){
          _Pano.openUrl(value,hotspot.target);
        };
        /**
         * 热点
         * @return {[type]} [description]
         */
        Object.defineProperty(this, "PointHotspots", {get: function() {return _Pano.getPointHotspotIds();},});
        /**
         * 当前场景名称
         * @return {[type]} [description]
         */
        Object.defineProperty(this, "CurrentScene", {get: function() {return _Pano.getCurrentNode();},});
        //是否只允许一次交互方式存在
        var _IsOnleyInteractive=false;
        Object.defineProperty(this, "IsOnleyInteractive", {
            get: function() {
                return _Gyro.IsOnleyInteractive;
            }
        });
        //是否只存在拖拽
      	var _IsOnlyTouch=false;
        Object.defineProperty(this, "IsOnlyTouch", {
            get: function() {
                return _Gyro.IsOnlyTouch;
            }
        });
        this.OnlyDevice=function(){
      		_Gyro.onlyDevice();
      	};
      	//只有touch
      	this.OnlyTouch=function(){
          _Gyro.onlyTouch();
      	};
      	/**
      	 * 两种交互操作兼顾
      	 * @return {[type]} [description]
      	 */
      	this.InteractiveByTouchAndDevice=function(){
      		_Gyro.interactiveByTouchAndDevice();
      	};
        /**
         * 对Pano2vr进行扩展
         * @param {[Pano2vr]} pano [全景的对象]
         */
        function Pano2VRExtend(pano) {
          //添加获取热点方法
          if(!pano.getPointHotspotIds){
            pano.getPointHotspotIds = function() {
                return this._DsHotspots.concat();
            };
          }

            //通过openNext改造切换到下一个场景
            pano._openNext = pano.openNext;
            pano.openNext = function(a, b) {
                this._openNext(a, b);
                _Self.ds({
                    type: 'openNext'
                });
            };
            pano.__upHotspot=function(){
              _Self.ds({
                  type: 'upHotspot'
              });
            };
            //改造帧触发update
            pano._update = pano.update;
            pano.update = function() {
                if (arguments.length == 1) {
                    this._update(arguments[0]);
                    _Self.ds({
                        type: 'update',
                        upScene: true,
                    });
                    _Self.ds({
                        type: 'upScene',
                        hotspots: pano.getPointHotspotIds(),
                        scene:pano.getCurrentNode(),
                    });
                    // console.log('show update 跳转场景时候',pano.getCurrentNode());
                } else {
                    this._update();
                    _Self.ds({
                        type: 'update',
                        upScene: false,
                    });
                    // console.log('show update 场景运动时候');
                }
            };
            //场景切换时候
            pano._Ca_ = pano.Ca;
            pano.Ca = function(a, b) {
                this._Ca_(a, b);
                _Self.ds({
                    type: 'upSceneBefore',
                    hotspots: pano.getPointHotspotIds(),
                    // scene:pano.getCurrentNode(),
                });
                // console.log('upScene', pano.getCurrentNode());
            };
            //热区修改时候
            pano._addHotspotElements = pano.addHotspotElements;
            pano.addHotspotElements = function() {
                this._addHotspotElements();
                _Self.ds({
                    type: 'upHotspot',
                    hotspots: pano.getPointHotspotIds(),
                    // scene: pano.getCurrentNode()
                });
                // console.log('upHotspot', this._DsHotspots);
            };
            pano._changeViewMode = pano.changeViewMode;
            pano.changeViewMode = function() {
                this._changeViewMode();
                _Self.ds({
                    type: 'changeViewMode',
                });
                // console.log('changeViewMode');
            };
            pano._setViewerSize = pano.setViewerSize;
            pano.setViewerSize = function(a, d) {
                this._setViewerSize(a, d);
                _Self.ds({
                    type: 'resize',
                });
                // console.log('resize');
            };
        }
    }

    return Pano2vr45Manager;
}));
