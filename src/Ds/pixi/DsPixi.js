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

  var _SaveImageWebGLRenderer;
  /**
   * 截图保存
   * @param  {[type]} displayObject [description]
   * @param  {[type]} opts          [description]
   * opts.width
   * opts.height
   * opts.type  png
   * opts.encoder 0.8
   * opts.background 0xffffff; jpg下目前还不能进行draw透明通道图片时候设置颜色值，这个后续会进行解决这个问题
   * @return {[type]}               [description]
   */
  DsPixi.GetSaveImageBase64=function(displayObject,opts){
    opts=opts||{};
    var _base64;
    if(!_SaveImageWebGLRenderer)_SaveImageWebGLRenderer=new PIXI.WebGLRenderer({
      width:opts.width||640,
      height:opts.height||1040,
      transparent:true,
      preserveDrawingBuffer:true,
      backgroundColor:opts.background||0xffffff,
    });

    if(opts.width&&opts.height)_SaveImageWebGLRenderer.resize(opts.width,opts.height);

    // if(opts.background){
    //   _SaveImageWebGLRenderer.backgroundColor=opts.background;_SaveImageWebGLRenderer.clear(opts.background);
    // }
    // else _SaveImageWebGLRenderer.clear();

    _SaveImageWebGLRenderer.render(displayObject,null,true,false);

    if(opts.type=='jpg'){


      _base64=_SaveImageWebGLRenderer.view.toDataURL("image/jpeg",opts.encoder!==undefined?opts.encoder:0.8);
    }
    else{

      _base64=_SaveImageWebGLRenderer.view.toDataURL("image/png");
    }
    //这个官方方法不好用
    // _base64=_SaveImageWebGLRenderer.extract.canvas(displayObject).toDataURL("image/jpeg");
    if(opts.debug){
      var w=window.open('about:blank','image from canvas');
      w.document.write("<img src='"+_base64+"' alt='from canvas'/>");
    }
    return _base64;
  };
  /**
   * 加载资源
   * @param  {[type]} opts
   * opts.basePath  素材根目录设置 如：'./assets/'
   * opts.list  素材列表
   *   {id:'Dragon',src:''},
   * opts.progress  加载进度
   * opts.complete  加载完成
   * @return {[type]}      [description]
   */
  DsPixi.LoadAssets=function(opts){
    opts=opts||{};
    var basePath = opts.basePath ? opts.basePath : '';
    var _list=opts.list;
    if(!_list||_list.length<=0){
      console.warn('加载列表内没有加载对象');
    }
    var _loader;
    if(opts.loader&&(opts.loader instanceof PIXI.loaders.Loader)){
      _loader=opts.loader;
    }else{
       _loader= new PIXI.loaders.Loader();
    }
    // console.log('LoadAssets',_loader);
    var complete;
    if(opts.complete)complete=opts.complete;
    else if(opts.onEnd)complete=opts.onEnd;

    for (var i = 0; i < _list.length; i++) {
      var _temp=_list[i];

       if (typeof _temp === 'string'){
         _temp={id:_temp,url:_temp};
       }else if(_temp.id===undefined&&_temp.src){
         _temp.id=_temp.src;
       }
       if(_temp.id!==undefined&&_temp.src!==undefined){
         _loader.add(_temp.id, basePath+'/'+_temp.src);
       }
    }
    _loader.on("progress", function(){
      if(opts.progress)opts.progress(_loader.progress/100);
    });
    _loader.once("complete", function(loader, resources){

      if(complete)complete(loader, resources);
    });
    _loader.load();
    return _loader;
  };
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
   *   {id:'Dragon',path:''},
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
    var complete;
    if(opts.complete)complete=opts.complete;
    else if(opts.onEnd)complete=opts.onEnd;

    var _loader = new PIXI.loaders.Loader();
    for (var i = 0; i < _list.length; i++) {
      var _temp=_list[i];
      /**
       * _temp.path 素材子目录名称  没有子目录就空
       * _temp.id 素材输出名
       */
      var _path=_temp.path?_temp.path:'';
      var _id=_temp.id?_temp.id:'';
      _loader.add(_id+'_bonesData', basePath+_path+'/'+_id+'_ske.json');
      _loader.add(_id+'_textureData', basePath+_path+'/'+_id+'_tex.json');
      _loader.add(_id+'_texture', basePath+_path+'/'+_id+'_tex.png');
    }

    _loader.on("progress", function(){
      if(opts.progress)opts.progress(_loader.progress/100);
    });
    _loader.once("complete", function(loader, resources){
      //加载素材完成 DragonBones构建素材
      for (var i = 0; i < _list.length; i++) {
        var _temp=_list[i];
        var _id=_temp.id?_temp.id:'';
        DsPixi.DBFactory.parseDragonBonesData(resources[_id+'_bonesData'].data);
        DsPixi.DBFactory.parseTextureAtlasData(resources[_id+'_textureData'].data, resources[_id+'_texture'].texture);
      }
      if(complete)complete(loader, resources);
    });

    _loader.load();
    return _loader;
  };
  /**
   * 获取tDragonBones动画
   * @param  {[type]} id [description]
   * @return {[type]}      [description]
   * dragonBones.Animation
   * http://developer.egret.com/cn/apidoc/index/id/dragonBones.Animation
   */
  DsPixi.GetDragonBonesMovie=function(id){
    var _movie = DsPixi.DBFactory.buildArmatureDisplay(id);
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
    _Self.App=app;

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
