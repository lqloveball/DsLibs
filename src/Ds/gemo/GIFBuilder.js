/**
 * @class
 * @classdesc: GIF合成器
 * @extends 使用 https://github.com/jnordberg/gif.js 来做gif合成 ，参数参考
 * @example: 使用范例如下
 *
 var _Gifer=new Ds.gemo.GIFBuilder();
 var _img=new Image();
 _img.src='./images/ShareImg.jpg';
 _img.onload=function(){
   _Gifer.AddFrame(_img);

   var _img2=new Image();
   _img2.src='./images/test.png';
   _img2.onload=function(){


     _Gifer.AddFrame(_img2);
     _Gifer.StartBuild(function(blob,base64){
       var _Temp=new Image();
       _Temp.src=base64;
       $('body').append(_Temp);
     });

   };
 };

 //如果是createjs的显示对象怎么办
 _DarwMc.gotoAndStop(1);
 _DarwMc.cache(0,0,300,300);
 var _canvas=_DarwMc.cacheCanvas;
 _Gifer.AddFrame(_canvas,200);
 _DarwMc.uncache();

 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright: Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
(function(factory) {
  var root = (typeof self == 'object' && self.self == self && self) ||
    (typeof global == 'object' && global.global == global && global);
  if (typeof define === 'function' && define.amd) {

    define(['exports'], function(exports) {
      var _GIF = require('libs/gif/gif.js');
      module.exports = factory(root, exports, _GIF);
    });
  } else if (typeof exports !== 'undefined') {
    module.exports = factory(root, exports);
  } else {
    factory(root, {});
  }

}(function(root, modelObj, _GIF) {
  root.Ds = root.Ds || {};
  root.Ds.gemo = root.Ds.gemo || {};
  root.Ds.gemo.GIFBuilder = GIFBuilder;

  root.GIF = root.GIF || _GIF;
  /**
   * GIF生成器
   * @param {[type]} config [description]
   * config.repeat 默认值 	0	repeat count, -1 = no repeat, 0 = forever
   * config.config.quality	默认值 10	pixel sample interval, lower is better
   * config.workers默认值 	2	number of web workers to spawn
   * config.workerScript 默认值 './js/libs/gif.worker.js' 	注意需要在js/libs目录下放多线程js gif.worker.js	url to load worker script from
   * config.background默认值 	#fff	background color where source image is transparent
   * config.width	默认值300
   * config.height	默认值 300
   * config.transparent默认值 	null	transparent hex color, 0x00FF00 = green
   * config.dither	默认值 false	dithering method, e.g. FloydSteinberg-serpentine
   * config.debug	默认值 false	whether to print debug information to console
   */
  function GIFBuilder(config) {
    var _Self = this;
    Ds.Extend(this, new Ds.EventDispatcher());
    //GIF生成器
    var _GIFer;
    //生成后的GIF的Blob数据
    var _GIFBlob;
    Object.defineProperty(this, "GIFBlob", {
      get: function() {
        return _GIFBlob;
      },
    });
    var _GIFBase64;
    Object.defineProperty(this, "GIFBase64", {
      get: function() {
        return _GIFBase64;
      },
    });
    //是否编译过程中
    var _IsBuild = false;
    //编译后callback方法
    var _BuildCallBack = null;
    //gif参数配置
    var _Config = config || {};
    Object.defineProperty(this, "Config", {
      get: function() {
        return _Config;
      },
    });
    _Config.width = _Config.width || 300;
    _Config.height = _Config.height || 300;
    _Config.workers = _Config.workers || 2;
    _Config.workerScript = _Config.workerScript || './js/libs/gif.worker.js';
    _Config.quality = _Config.quality || 10; //pixel sample interval, lower is better
    _Config.transparent = _Config.transparent || null; //进行扣色透明值 transparent hex color, 0x00FF00 = green
    _Config.background = _Config.background || '#fff'; //背景色
    _Config.repeat = _Config.repeat !== undefined ? _Config.repeat : 0; //repeat count, -1 = no repeat, 0 = forever
    //创建GIF生成器
    CreateGIFer();
    /**
     * 初始化创建GIF合成器
     * @param {[type]} opts [description]
     */
    function CreateGIFer() {
      _IsBuild = false;
      _BuildCallBack = null;
      _Frames = [];
      if (_GIFer && _GIFer.off) {
        _GIFer.off('finished', GIFCompile);
      }
      _GIFer = new GIF(_Config);
      //GIF编译完成
      _GIFer.on('finished', GIFCompile);
    }
    /**
     * GIF生成完成
     * @param {[Blob]} blob [description]
     */
    function GIFCompile(blob) {
      _IsBuild = false;
      _GIFBlob = blob;
      console.log('GIF Blob complete');
      var _file = new FileReader();
      _file.onload = function(e) {
        // if (callback) callback(e.target.result);
        console.log('GIF Base64 complete');
        _GIFBase64 = e.target.result;
        _Self.ds({
          type: 'complete',
          blob: _GIFBlob,
          base64: _GIFBase64,
        });
        if (_BuildCallBack) _BuildCallBack(_GIFBlob, _GIFBase64);
        _BuildCallBack = null;
      };
      _file.readAsDataURL(blob);
    }
    /**
     * 清空GIF
     * @return {[type]} [description]
     */
    this.ClearFrame = function() {
      CreateGIFer();
    };
    var _Frames = [];
    /**
     * 添加GIF的帧
     * @param  {[image or canvas]} img   [图片或者一个canvas对象]
     * @param  {[Number]} delay [延迟时间 默认200毫秒]
     * @return {[type]}       [description]
     */
    this.AddFrame = function(img, delay) {
      if (_IsBuild) return;
      // delay=delay||(_Frames.length<=0?0:200);
      delay = delay || 200;
      _GIFer.addFrame(img, {
        delay: delay
      });
      _Frames.push(img);
    };

    /**
     * 开始编译创建GIF
     *
     */
    this.StartBuild = function(callBack) {
      if (_IsBuild) return;
      _IsBuild = true;
      _BuildCallBack = callBack;
      _GIFer.render();
    };
    /**
     * blob 转 base64的数据
     * @param  {[Blob]}   blob     [description]
     * @param  {Function} callback [数据转换完成后的执行函数]
     * @return {[type]}            [description]
     */
    function BlobToDataURL(blob, callback) {
      var _file = new FileReader();
      _file.onload = function(e) {
        if (callback) callback(e.target.result);
      };
      _file.readAsDataURL(blob);
    }
  }

  return GIFBuilder;
}));
