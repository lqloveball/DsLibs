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

  /**
   * 设置一个对象可以被拖动
   * @param  {[type]} displayObject [一个显示对象]
   * obj.draging  //拖动状态  0不拖动  1准备拖动  2开始拖动
   * obj.dragLock  //是否锁定不拖动
   * obj.dragData  //拖动是的 e.data 不拖动会被置null
   * obj.dragRect  //PIXI. Rectangle  可以拖动的范围
   *
   * 对象会发出拖动事件
   * dragDown  按下准备拖动
   * dragStart  开始拖动
   * draging   拖动中
   * dragEnd   拖动完成
   * @param  {[type]} opts          [description]
   * opts.lock 是否默认锁定不能拖动
   * opts.rect 相对父亲级坐标可以拖动的范围
   * @return {[type]}               [description]
   */
  DsPixi.SetDragObject=function(displayObject,opts){
    opts=opts||{};
    displayObject.interactive=true;
    displayObject.cursor = 'pointer';
    displayObject.draging=0;
    displayObject.dragLock=opts.lock?opts.lock:false;
    displayObject.dragRect=null;
    if(opts.rect&&(opts.rect instanceof PIXI.Rectangle))displayObject.dragRect=opts.rect;
    if(opts.hitArea&&(opts.hitArea instanceof PIXI.Rectangle))displayObject.hitArea=opts.hitArea;
    displayObject.on('pointerdown',onDragStart);
    function onDragStart(e){
      var _obj = e.currentTarget;
      if(_obj.dragLock)return;
      _obj.dragData = e.data;
      _obj.draging = 1;//记录拖动状态
      _obj.dragPointerStart = e.data.getLocalPosition(_obj.parent);//鼠标指针转换成相对父亲内坐标
      _obj.dragGlobalStart = new PIXI.Point();
      _obj.dragGlobalStart.copy(e.data.global);//记录全局坐标坐标
      _obj.dragObjStart = new PIXI.Point();
      _obj.dragObjStart.copy(_obj.position);//记录显示对象相对父亲的坐标
      // console.log(_obj.dragPointerStart,_obj.dragObjStart);
      _obj.emit('dragDown',e);
      _obj.on('pointerup', onDragEnd)
      .on('pointerupoutside', onDragEnd)
      .on('pointermove', onDragMove);
    }
    function onDragEnd(e){
      var _obj = e.currentTarget;
      if(_obj.dragLock)return;
      _obj.draging = 0;
      _obj.dragData = null;
      _obj.emit('dragEnd',e);
      _obj.off('pointerup', onDragEnd)
      .off('pointerupoutside', onDragEnd)
      .off('pointermove', onDragMove);
      e.stopPropagation();
    }
    function onDragMove(e){
      var _obj = e.currentTarget;
      if(_obj.dragLock)return;
      if (!_obj.draging) return;
      var _data = _obj.dragData;
      if (_obj.draging == 1) {
          //开始拖动  判断 x  y偏移和超过3 说明开始拖动
          if (Math.abs(_data.global.x - _obj.dragGlobalStart.x) +Math.abs(_data.global.y - _obj.dragGlobalStart.y) >= 3)_obj.draging = 2;
          _obj.emit('dragStart',e);
      }
      //已经开始拖动
      if (_obj.draging == 2) {
          var _dragPointerEnd = _data.getLocalPosition(_obj.parent);//鼠标指针转换成相对父亲内坐标
          // 开始拖动
          var _x=_obj.dragObjStart.x + (_dragPointerEnd.x - _obj.dragPointerStart.x);
          var _y=_obj.dragObjStart.y + (_dragPointerEnd.y - _obj.dragPointerStart.y);
          if(_obj.dragRect){
            _x=Math.max(_obj.dragRect.x,_x);
            _x=Math.min(_obj.dragRect.x+_obj.dragRect.width,_x);
            _y=Math.max(_obj.dragRect.y,_y);
            _y=Math.min(_obj.dragRect.y+_obj.dragRect.height,_y);
            // console.log(_x,_y);
            _obj.position.set(_x,_y);
          }else{
            _obj.position.set(_x,_y);
          }

          _obj.emit('draging',e);
      }
    }
  };
  /**
   * 设置按钮交互
   * @param  {[type]} displayObject [description]
   * @param  {[type]} clickFun      [description]
   * @param  {[type]} opts       [description]
   * opts.context  事件函数里面的this指向
   * opts.hitArea 这个对象触发区域
   * @return {[type]}               [description]
   */
  DsPixi.SetButton=function(displayObject,clickFun,opts){
    opts=opts||{};
    displayObject.interactive=true;
    displayObject.cursor = 'pointer';
    if(opts.hitArea&&(opts.hitArea instanceof PIXI.Rectangle))displayObject.hitArea=opts.hitArea;
    if(clickFun&&opts.context)displayObject.on('pointerdown',clickFun,opts.context);
    else if(clickFun)displayObject.on('pointerdown',clickFun);
  };
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

    //目前还未解决背景问题
    // if(opts.background){
    //   _SaveImageWebGLRenderer.backgroundColor=opts.background;_SaveImageWebGLRenderer.clear(opts.background);
    // }
    // else _SaveImageWebGLRenderer.clear();

    _SaveImageWebGLRenderer.render(displayObject,null,true,false);

    if(opts.type=='jpg')_base64=_SaveImageWebGLRenderer.view.toDataURL("image/jpeg",opts.encoder!==undefined?opts.encoder:0.8);
    else _base64=_SaveImageWebGLRenderer.view.toDataURL("image/png");
    //这个官方方法不好用
    // _base64=_SaveImageWebGLRenderer.extract.canvas(displayObject).toDataURL("image/jpeg");
    if(opts.debug){
      var w=window.open('about:blank','image from canvas');
      w.document.write("<img src='"+_base64+"' alt='from canvas'/>");
    }
    return _base64;
  };

  /**
   * 获取js 并插入到html内
   * @param  {[type]} src      [description]
   * @param  {[type]} complete [description]
   * @return {[type]}          [description]
   */
  DsPixi.GetScript=function(src,complete,opts){
    var _script = document.createElement("script");
    _script.setAttribute("type","text/javascript");
    //ie下
    if(_script.onreadystatechange){
      _script.onreadystatechange = function() {
        if(this.readyState == "loaded" || this.readyState == "complete"){
          if(complete)complete();
        }
      };
    }else{
    //其他浏览器
      _script.onload = function() {
        if(complete)complete();
      };
    }
    document.getElementsByTagName("head")[0].appendChild(_script);
    if(opts.hash)src=src+'?hs='+opts.hash;
    _script.src = src;
  };
  /**
   * 获取LoadJSAnimateAssets加载过的资源
   * @param  {[type]} jsNS [加载空间名]
   * @param  {[type]} name [加载对象名]
   * @return {[type]}      [description]
   */
  DsPixi.GetJSAnimateAssets=function(jsNS,name,type){
    type=type||'texture';
    var _loader = window[jsNS+'_loader'];
    if(!_loader||!(_loader instanceof PIXI.loaders.Loader)){console.warn('LoadJSAnimateAssets 创建过id为：'+_jsNS+' 的loader');return;}
    if(!name){console.warn('GetJSAnimateAssets 需要传入资源id ');return;}
    var _resources=_loader.resources;
    var _temp=_resources[name];
    if(type==='data')return _temp.data;
    else if(type==='texture') return _temp.texture;
    else return _temp;

  };
  /**
   * 加载flash导出的动画资源
   * @param  {[type]} opts       [description]
   *  opts.basePath './assets/'
   *  opts.jsNS 'lib'
   *  opts.src 'xxxx.js' 或者使用opts.jsUrl做为参数
   *  opts.mainClass 'main'  不传会使用js的名字来作为类名
   *  opts.hash 避免缓存传入hash值
   * @return {[type]} [description]
   */
  DsPixi.LoadJSAnimateAssets=function(opts){
    opts = opts || {};
    var _basePath = opts.basePath || "/";
    if (!opts.jsUrl&&!opts.src) {console.warn('参数jsUrl是必须!');return;}
    // if (!opts.mainClass) {console.warn('必须传入mainClass来获取资源');return;}
    //js命名空间
    var _jsNS = opts.jsNS ? opts.jsNS : 'lib';
    var _src=opts.jsUrl?opts.jsUrl:opts.src;
    if(!opts.mainClass)opts.mainClass=_src.slice(0,_src.indexOf('.js'));

    DsPixi.GetScript(_basePath+_src,function(){
      var lib=window[_jsNS];
      window[_jsNS+'_loader']=DsPixi.LoadAnimateAssets(lib,opts);
    },opts);
  };
  /**
   * 加载flash导出的动画资源
   * @param  {[type]} assetsData [加载的资源库文件]
   * var assetsData = require('assets/main.js');
   * 也或者是 导出js命名空间
   * 如 lib
   * @param  {[type]} opts       [description]
   *  opts.basePath './assets/'
   *  opts.progress  加载进度回调 progress 0-1
   *  opts.complete  加载完成回调 loader, resources
   *  opts.loader  可以不新创建 loader对象使用 已有loader对象
   *  opts.list   加载其他资源对象
   * @return {[type]}            [description]
   */
  DsPixi.LoadAnimateAssets=function(assetsData, opts) {
    opts = opts || {};
    var basePath = opts.basePath || "/";
    var _complete;
    if (opts.complete)
      _complete = opts.complete;
    else if (opts.onEnd)
      _complete = opts.onEnd;

    var _loader;
    if(opts.loader&&(opts.loader instanceof PIXI.loaders.Loader))_loader=opts.loader;
    else  _loader= new PIXI.loaders.Loader();
    var assets;
    //直接通过 require方法 进来的 传入是module.exports
    if(assetsData.stage&&assetsData.stage.assets)assets=assetsData.stage.assets;
    //直接通过 js插入方法 进来的 传入是lib,需要通过lib中找出首文件class ，找出下列加载对象后进行加载处理
    else if(assetsData&&opts.mainClass&&assetsData[opts.mainClass]&&assetsData[opts.mainClass].assets)  assets=assetsData[opts.mainClass].assets;
    else assets={};



    if (assets && Object.keys(assets).length) {
      for (var key in assets) {
        if (assets.hasOwnProperty(key))_loader.add(key, basePath + assets[key]);
      }
    }

    if(opts.list){
      var _list=opts.list;
      for (var i = 0; i < _list.length; i++) {
         var _temp=_list[i];
         if (typeof _temp === 'string')_temp={id:_temp,src:_temp};
         else if(_temp.id===undefined&&_temp.src)_temp.id=_temp.src;
         //添加到显示列表
         if(_temp.id!==undefined&&_temp.src!==undefined)_loader.add(_temp.id,_temp.src);
      }
    }

    function complete(loader, resources) {
      console.log('complete');
      if (_complete)   _complete(loader, resources);
    }
    _loader.on("progress", function() {
      console.log('progress:', _loader.progress / 100);
      if (opts.progress)
        opts.progress(_loader.progress / 100);
      }
    );
    _loader.once("complete", complete);
    _loader.load();
    return _loader;
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
    if(opts.loader&&(opts.loader instanceof PIXI.loaders.Loader))_loader=opts.loader;
    else _loader= new PIXI.loaders.Loader();

    // console.log('LoadAssets',_loader);
    var complete;
    if(opts.complete)complete=opts.complete;
    else if(opts.onEnd)complete=opts.onEnd;

    for (var i = 0; i < _list.length; i++) {
      var _temp=_list[i];
       if (typeof _temp === 'string'){
         _temp={id:_temp,src:_temp};
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
    if(!window.dragonBones)console.warn('请先载入 dragonBones框架');
    opts=opts||{};
    var basePath = opts.basePath ? opts.basePath : '';
    var _list=opts.list;
    if(!_list||_list.length<=0)console.warn('加载列表内没有加载对象');

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
    var autoStart = opts.autoStart!==undefined ? opts.autoStart : true;
    var transparent = opts.transparent!==undefined ? opts.transparent : true;//是否透明
    var antialias = opts.antialias!==undefined ? opts.antialias : false;//是否抗锯齿 目前chrome支持
    var preserveDrawingBuffer = opts.preserveDrawingBuffer!==undefined ? opts.preserveDrawingBuffer : false;//是否启用绘图缓冲区保存
    var resolution = opts.resolution!==undefined ? opts.resolution : 1;//renderer 时候是否使用device pixel 可以使用如 2
    var forceCanvas = opts.forceCanvas!==undefined ? opts.forceCanvas : false;//是否不使用webgl渲染
    var backgroundColor = opts.backgroundColor!==undefined ? opts.backgroundColor : 	0x103322;
    var clearBeforeRender = opts.clearBeforeRender!==undefined ? opts.clearBeforeRender : true;
    var legacy = opts.legacy!==undefined ? opts.legacy : false;//是否只使用webgl渲染 考虑到旧的/不太先进的设备兼容  可以设置成true
    var sharedLoader = opts.sharedLoader!==undefined ? opts.sharedLoader : false;
    var sharedTicker = opts.sharedTicker!==undefined ? opts.sharedTicker : false;
    var appendTo = opts.appendTo ? opts.appendTo : '';


    var app = new PIXI.Application({
      width:width,
      height:height,
      autoStart:autoStart,
      transparent:transparent,
      antialias:antialias,
      preserveDrawingBuffer:preserveDrawingBuffer,
      resolution:resolution,
      forceCanvas:forceCanvas,
      backgroundColor:backgroundColor,
      clearBeforeRender:clearBeforeRender,
      legacy:legacy,
      sharedLoader : sharedLoader,
      sharedTicker : sharedTicker,
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
    _Self.screen=app.screen;
    _Self.loader=app.loader;
    _Self.width=width;
    _Self.height=height;

    _Self.Stage=_stage;
    _Self.Root=_root;
    _Self.Canvas=_canvas;
    _Self.App=app;
    _Self.Screen=app.screen;
    _Self.Loader=app.loader;

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
      _Self.width=_w;
      _Self.height=_h;
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
