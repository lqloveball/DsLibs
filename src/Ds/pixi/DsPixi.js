/**
 * PIXI 快速使用实现方法
 *
 *
 */
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

}(function (root, modelObj) {
  root.Ds = root.Ds || {};
  root.DsPixi=root.Ds.DsPixi={};
  root.Ds.DsPixi.Version = 'v0.5';
  var DsPixi=root.Ds.DsPixi;

  //DragonBones 工厂方法
  if(window['dragonBones']!==undefined)DsPixi.DBFactory=dragonBones.PixiFactory.factory;
  /**
   * 加载DragonBones素材给到pixi使用
   * 需要进行加载 pixi dragonBones 支持库
   * https://github.com/DragonBones/DragonBonesJS/tree/master/Pixi
   * require('pixidragonBones');
   * @param  {[type]} opts [description]
   * opts.basePath  素材根目录设置 如：'./assets/'
   * opts.list  素材列表
   *   {name:'Dragon',path:''},
   * opts.progress  加载进度
   * opts.complete  加载完成
   * @return {[type]}      [PIXI.loaders.Loader]
   */
  DsPixi.LoadDragonBones=function(opts){
    if(window['dragonBones']!==undefined)DsPixi.DBFactory=dragonBones.PixiFactory.factory;
    if(!dragonBones)console.warn('请先载入 dragonBones框架');
    opts=opts||{};
    var basePath = opts.basePath ? opts.basePath : '';
    var _list=opts.list;
    if(!_list||_list.length<=0){
      console.warn('加载列表内没有加载对象');
    }

    var _loader = new PIXI.loaders.Loader();
    for (var i = 0; i < _list.length; i++) {
      var _temp=_list[i];
      /**
       * _temp.path 素材子目录名称  没有子目录就空
       * _temp.name 素材输出名
       */
      var _path=_temp.path?_temp.path:'';
      var _name=_temp.name?_temp.name:'';
      _loader.add(_name+'_bonesData', basePath+_path+'/'+_name+'_ske.json');
      _loader.add(_name+'_textureData', basePath+_path+'/'+_name+'_tex.json');
      _loader.add(_name+'_texture', basePath+_path+'/'+_name+'_tex.png');
    }

    _loader.on("progress", function(){
      if(opts.progress)opts.progress(_loader.progress/100);
    });
    _loader.once("complete", function(loader, resources){
      //加载素材完成 DragonBones构建素材
      for (var i = 0; i < _list.length; i++) {
        var _temp=_list[i];
        var _name=_temp.name?_temp.name:'';
        DsPixi.DBFactory.parseDragonBonesData(resources[_name+'_bonesData'].data);
        DsPixi.DBFactory.parseTextureAtlasData(resources[_name+'_textureData'].data, resources[_name+'_texture'].texture);
      }

      if(opts.complete)opts.complete(loader, resources);
    });

    _loader.load();
    return _loader;
  };
  /**
   * 获取tDragonBones动画
   * @param  {[type]} name [description]
   * @return {[type]}      [description]
   * dragonBones.Animation
   * http://developer.egret.com/cn/apidoc/index/name/dragonBones.Animation
   */
  DsPixi.GetDragonBonesMovie=function(name){
    var _movie = DsPixi.DBFactory.buildArmatureDisplay(name);
    return _movie;
  };
  /**
   * Pixi模块
   * @param  {[type]} opts [description]
   * @return {[type]}      [description]
   */
  DsPixi.PixiModel=function(opts){
    var _Self=this;
    opts=opts||{};
    var width = opts.width ? opts.width : 640;
    var height = opts.height ? opts.height : 1140;
    var fps = opts.fps ? opts.fps : 30;
    var transparent = opts.transparent!==undefined ? opts.transparent : true;//是否透明
    var antialias = opts.antialias!==undefined ? opts.antialias : true;//是否抗锯齿 目前chrome支持
    var preserveDrawingBuffer = opts.preserveDrawingBuffer!==undefined ? opts.preserveDrawingBuffer : true;//是否启用绘图缓冲区保存
    var resolution = opts.resolution!==undefined ? opts.resolution : 1;//renderer 时候是否使用device pixel 可以使用如 2
    var forceCanvas = opts.forceCanvas!==undefined ? opts.forceCanvas : false;//是否不使用webgl渲染
    var legacy = opts.legacy!==undefined ? opts.legacy : false;//是否只使用webgl渲染 考虑到旧的/不太先进的设备兼容  可以设置成true
    var backgroundColor = opts.backgroundColor!==undefined ? opts.backgroundColor : 0x000;//默认背景颜色
    var appendTo = opts.appendTo ? opts.appendTo : '';

    var app = new PIXI.Application({
      width:width,
      height:height,
      transparent:transparent,
      antialias:antialias,
      preserveDrawingBuffer:preserveDrawingBuffer,
      resolution:resolution,
      forceCanvas:forceCanvas,
      legacy:legacy,
      backgroundColor : backgroundColor,
    });

    var _canvas=app.view;
    var _stage = app.stage;
    var _root = new PIXI.Container();
    _stage.addChild(_root);
    _Self.app=app;
    _Self.stage=_stage;
    _Self.root=_root;
    _Self.canvas=_canvas;
    _Self.renderer=app.renderer;

    _Self.Stage=_stage;
    _Self.Root=_root;
    _Self.Canvas=_canvas;

    if (appendTo !== '') {
      if (typeof appendTo === 'string') {
        if(appendTo.indexOf('#')===0)appendTo=appendTo.slice(1);
        document.getElementById(appendTo).appendChild(_canvas);
      } else if (appendTo instanceof HTMLElement) {
        appendTo.appendChild(_canvas);
      } else if (appendTo[0] instanceof HTMLElement) {
        appendTo[0].appendChild(_canvas);
      } else {
        console.warn('opts.appendTo 参数非法');
      }
    }else{
      // console.log('添加到body');
      document.body.appendChild(_canvas);
    }
    app.ticker.add(function(delta) {
      _Self.emit('update',delta);
    });
    //进行重设置canvas大小
    this.setSize = function(_w, _h) {
      app.renderer.resize(_w, _h);
    };
  };
  DsPixi.PixiModel.prototype=new PIXI.utils.EventEmitter();
  /**
   * 创建Pixi模块
   * @param  {[type]} opts [description]
   * @return {[type]}      [description]
   */
  DsPixi.Create=function(opts){
    return  new DsPixi.PixiModel(opts);
  };

  return root.Ds.DsPixi;
}));
