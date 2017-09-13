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
            require('./display/DOMElement.js');
            require('./utils/AnimateRepair.js');
            module.exports = factory(root, exports);
        });
    } else if (typeof exports !== 'undefined') {
        require('./display/DOMElement.js');
        require('./utils/AnimateRepair.js');
        module.exports = factory(root, exports);
    } else {
        factory(root, {});
    }

}(function (root, modelObj) {
    root.Ds = root.Ds || {};
    root.Ds.DsPixi = Ds.DsPixi || {};
    root.DsPixi = root.Ds.DsPixi;
    var DsPixi = root.Ds.DsPixi;
    root.Ds.DsPixi.Version = root.Ds.DsPixi.Version || 'v0.5';

    /**
     * 让容器支持判断是否包含一个子对象
     * @param  {[type]} child [description]
     * @return {[type]}       [description]
     */
    PIXI.Container.prototype.contains = function (child) {
        while (child) {
            if (child == this) {
                return true;
            }
            child = child.parent;
        }
        return false;
    };
    /**
     * 设置按钮交互
     * @param  {[PIXI.DisplayObject]} displayObject [PIXI.DisplayObject对象]
     * @param  {[Function]} eventFun      [执行代码]
     * @param  {[Object]} opts       [参数配置]
     * opts.context  事件函数里面的this指向
     * opts.hitArea 这个对象触发区域
     * opts.child 子对象是否允许交互
     * opts.event 交互监听的事件
     * @alias DsPixi.setButton
     */
    DsPixi.SetButton = function (displayObject, eventFun, opts) {
        opts = opts || {};
        displayObject.interactive = true;
        displayObject.cursor = 'pointer';
        if(opts.child)displayObject.interactiveChildren=opts.child;
        var _event = opts.event || 'pointerdown';
        if (opts.hitArea && (opts.hitArea instanceof PIXI.Rectangle)) displayObject.hitArea = opts.hitArea;
        if(eventFun){
            if (opts.context) displayObject.on(_event, eventFun, opts.context);
            else displayObject.on(_event, eventFun);
        }

    };
    DsPixi.setButton=DsPixi.SetButton;
    /**
     * 为一个显示对象添加 dom 触发区域
     * @param {[Object]} opts [参数]
     * opts.width   触发区域大小 不设置会取显示对象宽
     * opts.height  触发区域大小 不设置会取显示对象高
     * opts.bg      dom元素颜色 默认'rgba(255, 255, 255, 0)'
     * opts.event   触发事件类型 默认'click'
     * @alias DsPixi.addHitDom
     */
    DsPixi.AddHitDom = function (displayObject, eventFun, opts) {
        opts = opts || {};
        var _div = document.createElement("div");

        var _width = opts.width !== undefined ? opts.width : null;
        var _height = opts.height !== undefined ? opts.height : _width;

        if (_width !== null && _height !== null) $(_div).css({width: _width, height: _height});
        else {
            var _rect = displayObject.getBounds();
            $(_div).css({width: _rect.width, height: _rect.height});
        }

        if (opts.bg) $(_div).css({background: opts.bg});
        else $(_div).css({background: 'rgba(255, 255, 255, 0)'});

        DsPixi.AddDOM(_div, displayObject, opts);
        //绑定触发事件
        if (eventFun) {
            if (opts.event) $(_div).on(opts.event, eventFun);
            else $(_div).on('click', eventFun);
        }

    };
    DsPixi.addHitDom=DsPixi.AddHitDom;
    /**
     * 创建一个关联pixi容器的dom对象
     * @param       {[HTMLElement]} dom  [dom对象]
     * @param       {[PIXI.Container]} parent  [dom对象]
     * @param       {[Object]} opts [参数]
     * opts.domBox   dom元素添加到的父级节点
     * opts.domRoot  dom元素父级dom添加到节点位置
     * opts.parent   父级pixi元素
     * opts.ticker   进行触发的帧计算对象，如果设置opts.app 会以app.ticker为准
     * opts.app   进行触发的计算ticker的app对象。
     * opts.auto   进行触发的帧计算dom对应显示状态
     *
     * @description
     * 是否进行自动更新dom显示状态，这个非常消耗性能。
     * 但普通技术人员怕控制不好这个刷新，所以可以设置成true. 默认是false
     * DsPixi.DOMAuto=true;
     * 建议自己根据逻辑使用DsPixi.UpDOMListState();
     * @return {[DsPixi.DOMElement]}
     * @alias DsPixi.addDOM
     */
    DsPixi.AddDOM = function (dom, parent, opts) {
        opts = opts || {};
        if (DsPixi.DomContainer.parent().length <= 0) {
            if (opts.domRoot) $(opts.domRoot).append(DsPixi.DomContainer);
            else {
                if ($('#pixiBox')[0]) $('#pixiBox').append(DsPixi.DomContainer);
                else $('body').append(DsPixi.DomContainer);
            }
        }

        var _dom;
        if (dom instanceof HTMLElement) {
            _dom = $(dom);
        }
        else if (dom[0] instanceof HTMLElement) {
            dom = dom[0];
            _dom = $(dom);
        }

        if (!opts.app && SiteModel && SiteModel.PIXIModel) opts.app = SiteModel.PIXIModel;
        if (parent) opts.parent = parent;

        var _domElement;
        if (dom.pixiDOMElement) {
            _domElement = dom.pixiDOMElement;
            _domElement.parent = opts.parent;
        }
        else _domElement = new DsPixi.DOMElement(dom, opts);

        return _domElement;
    };
    DsPixi.addDOM=DsPixi.AddDOM;
    /**
     * 设置一个对象可以被拖动
     * @param  {[PIXI.DisplayObject]} displayObject [一个显示对象]
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
     * @param  {[Object]} opts          [参数]
     * opts.lock 是否默认锁定不能拖动
     * opts.rect 相对父亲级坐标可以拖动的范围
     * @alias DsPixi.setDragObject
     */
    DsPixi.SetDragObject = function (displayObject, opts) {
        opts = opts || {};
        displayObject.interactive = true;
        displayObject.cursor = 'pointer';
        displayObject.draging = 0;
        displayObject.dragLock = opts.lock ? opts.lock : false;
        displayObject.dragRect = null;
        if (opts.rect && (opts.rect instanceof PIXI.Rectangle)) displayObject.dragRect = opts.rect;
        if (opts.hitArea && (opts.hitArea instanceof PIXI.Rectangle)) displayObject.hitArea = opts.hitArea;

        displayObject.on('pointerdown', onDragStart);

        function onDragStart(e) {
            var _obj = e.currentTarget;
            if (_obj.dragLock) return;
            _obj.dragData = e.data;
            //记录拖动状态
            _obj.draging = 1;
            //鼠标指针转换成相对父亲内坐标
            _obj.dragPointerStart = e.data.getLocalPosition(_obj.parent);
            _obj.dragGlobalStart = new PIXI.Point();
            //记录全局坐标坐标
            _obj.dragGlobalStart.copy(e.data.global);
            _obj.dragObjStart = new PIXI.Point();
            //记录显示对象相对父亲的坐标
            _obj.dragObjStart.copy(_obj.position);
            // console.log(_obj.dragPointerStart,_obj.dragObjStart);
            _obj.emit('dragDown', e);
            _obj.on('pointerup', onDragEnd)
                .on('pointerupoutside', onDragEnd)
                .on('pointermove', onDragMove);
        }

        function onDragEnd(e) {
            var _obj = e.currentTarget;
            if (_obj.dragLock) return;
            _obj.draging = 0;
            _obj.dragData = null;
            _obj.emit('dragEnd', e);
            _obj.off('pointerup', onDragEnd)
                .off('pointerupoutside', onDragEnd)
                .off('pointermove', onDragMove);
            e.stopPropagation();
        }

        function onDragMove(e) {
            var _obj = e.currentTarget;
            if (_obj.dragLock) return;
            if (!_obj.draging) return;
            var _data = _obj.dragData;
            if (_obj.draging == 1) {
                //开始拖动  判断 x  y偏移和超过3 说明开始拖动
                if (Math.abs(_data.global.x - _obj.dragGlobalStart.x) + Math.abs(_data.global.y - _obj.dragGlobalStart.y) >= 3) _obj.draging = 2;
                _obj.emit('dragStart', e);
            }
            //已经开始拖动
            if (_obj.draging == 2) {
                //鼠标指针转换成相对父亲内坐标
                var _dragPointerEnd = _data.getLocalPosition(_obj.parent);
                // 开始拖动
                var _x = _obj.dragObjStart.x + (_dragPointerEnd.x - _obj.dragPointerStart.x);
                var _y = _obj.dragObjStart.y + (_dragPointerEnd.y - _obj.dragPointerStart.y);
                if (_obj.dragRect) {
                    _x = Math.max(_obj.dragRect.x, _x);
                    _x = Math.min(_obj.dragRect.x + _obj.dragRect.width, _x);
                    _y = Math.max(_obj.dragRect.y, _y);
                    _y = Math.min(_obj.dragRect.y + _obj.dragRect.height, _y);
                    // console.log(_x,_y);
                    _obj.position.set(_x, _y);
                } else {
                    _obj.position.set(_x, _y);
                }

                _obj.emit('draging', e);
            }
        }
    };
    DsPixi.setDragObject=DsPixi.SetDragObject;

    var _SaveImageRenderer;
    /**
     * 截图保存
     * @param  {[PIXI.DisplayObject]} displayObject [description]
     * @param  {[Object]} opts          [参数配置]
     * opts.width
     * opts.height
     * opts.type  png
     * opts.encoder 0.8
     * opts.background 0xffffff; jpg下目前还不能进行draw透明通道图片时候设置颜色值，这个后续会进行解决这个问题
     * @return {[String]}               [Base64字符串]
     * @alias DsPixi.getBase64
     */
    DsPixi.GetSaveImageBase64 = function (displayObject, opts) {
        opts = opts || {};
        var _base64;
        if (!_SaveImageRenderer) {
            _SaveImageRenderer = PIXI.autoDetectRenderer({
                width: opts.width || 640,
                height: opts.height || 1040,
                transparent: true,
                preserveDrawingBuffer: true,
                backgroundColor: opts.background || 0xffffff,
            });
        }

        if (opts.width && opts.height) _SaveImageRenderer.resize(opts.width, opts.height);

        //TODO 目前还未解决背景问题
        // if(opts.background){
        //   _SaveImageRenderer.backgroundColor=opts.background;_SaveImageRenderer.clear(opts.background);
        // }
        // else _SaveImageRenderer.clear();

        //记录原来在父级内transform信息
        var _x=displayObject.x;
        var _y=displayObject.y;
        var _scalex=displayObject.scale.x;
        var _scaley=displayObject.scale.x;
        var _rotation=displayObject.rotation;
        var _skewx=displayObject.skew.x;
        var _skewy=displayObject.skew.x;
        var _pivotx=displayObject.pivot.x;
        var _pivoty=displayObject.pivot.x;
        //transform信息 置换不缩放
        displayObject.setTransform(0,0,1/displayObject.scale.x,1/displayObject.scale.y,0,0,0,0,0);
        _SaveImageRenderer.render(displayObject, null, true);
        //设置回原来在父级内transform信息
        displayObject.setTransform(
            _x,_y,
            _scalex,_scaley,
            _rotation,
            _skewx,_skewy,
            _pivotx,_pivoty);
        //还是直接通过rander对应的 canvas对象来进行截图保存base64靠谱
        if (opts.type == 'jpg') _base64 = _SaveImageRenderer.view.toDataURL("image/jpeg", opts.encoder !== undefined ? opts.encoder : 0.8);
        else _base64 = _SaveImageRenderer.view.toDataURL("image/png");




        if (opts.debug) {
            var _w = window.open('about:blank', 'image from canvas');
            if(_w)_w.document.write("<img src='" + _base64 + "' alt='from canvas'/>");
        }
        return _base64;
    };
    DsPixi.getBase64=DsPixi.GetSaveImageBase64;
    /**
     * 缓存一个显示对象成Sprite
     * @param displayObject
     * @param opts
     * @return {[PIXI.Sprite]}   PIXI.Sprite显示对象
     * @alias DsPixi.getCacheSprite
     */
    DsPixi.GetCacheSprite=function (displayObject,opts) {
        opts=opts||{};
        var _base64=DsPixi.GetSaveImageBase64(displayObject,opts);
        var _img = new Image();
        var _sprite = new PIXI.Sprite(PIXI.Texture.fromLoader(_img));
        var _baseTexture = _sprite.texture.baseTexture;
        if (_baseTexture.isLoading){
            _baseTexture.on('loaded', function () {
                // console.log('_baseTexture loaded:', _baseTexture.width);
                _sprite.width=_baseTexture.width;
                _sprite.height=_baseTexture.height;
                _sprite.emit('loaded');
            });
        }
        _img.src = _base64;
        return _sprite;
    };
    DsPixi.getCacheSprite=DsPixi.GetCacheSprite;

    /**
     * 获取js 并插入到html内
     * @param  {[String]} src       [js文件url地址]
     * @param  {[Funtion]} complete [加载完成事件]
     * @alias DsPixi.getScript
     */
    DsPixi.GetScript = function (src, complete, opts) {
        var _script = document.createElement("script");
        _script.setAttribute("type", "text/javascript");
        //ie下
        if (_script.onreadystatechange) {
            _script.onreadystatechange = function () {
                if (this.readyState == "loaded" || this.readyState == "complete") {
                    if (complete) complete();
                }
            };
        } else {
            //其他浏览器
            _script.onload = function () {
                if (complete) complete();
            };
        }
        document.getElementsByTagName("head")[0].appendChild(_script);
        if (opts.hash) src = src + '?hs=' + opts.hash;
        _script.src = src;
    };
    DsPixi.getScript=DsPixi.GetScript;



    /**
     * 加载flash导出的动画资源
     * @param  {[Object]} opts       [参数]
     *  opts.basePath './assets/'
     *  opts.jsNS 'lib'
     *  opts.src 'xxxx.js' 或者使用opts.jsUrl做为参数
     *  opts.mainClass 'main'  不传会使用js的名字来作为类名
     *  opts.hash 避免缓存传入hash值
     *  @alias DsPixi.loadJSAnimateAssets
     */
    DsPixi.LoadJSAnimateAssets = function (opts) {
        opts = opts || {};
        var _basePath = opts.basePath || "/";
        if (!opts.jsUrl && !opts.src) {
            console.warn('参数jsUrl是必须!');
            return;
        }
        // if (!opts.mainClass) {console.warn('必须传入mainClass来获取资源');return;}
        //js命名空间
        var _jsNS = opts.jsNS ? opts.jsNS : 'lib';
        var _src = opts.jsUrl ? opts.jsUrl : opts.src;
        if (!opts.mainClass) opts.mainClass = _src.slice(0, _src.indexOf('.js'));

        DsPixi.GetScript(_basePath + _src, function () {
            var lib = window[_jsNS];
            window[_jsNS + '_loader'] = DsPixi.LoadAnimateAssets(lib, opts);
        }, opts);
    };
    DsPixi.loadJSAnimateAssets=DsPixi.LoadJSAnimateAssets;


    /**
     * 根据LoadJSAnimateAssets加载资源时候设置命名空间查找loader对象下的相应id的资源。
     * @param  {[String]} jsNS [加载空间名]
     * @param  {[String]} name [加载资源名]
     * @param  {[String]} type [获取加载资源类型]
     * @return {[Object]}      [资源对象]
     * @alias DsPixi.getJSAnimateAssets
     */
    DsPixi.GetJSAnimateAssets = function (jsNS, name, type) {
        type = type || 'texture';
        var _loader = window[jsNS + '_loader'];
        if (!_loader || !(_loader instanceof PIXI.loaders.Loader)) {
            console.warn('LoadJSAnimateAssets 创建过id为：' + _jsNS + ' 的loader');
            return;
        }
        if (!name) {
            console.warn('GetJSAnimateAssets 需要传入资源id ');
            return;
        }
        var _resources = _loader.resources;
        var _temp = _resources[name];
        if (type === 'data') return _temp.data;
        else if (type === 'texture') return _temp.texture;
        else return _temp;
    };
    DsPixi.getJSAnimateAssets=DsPixi.GetJSAnimateAssets;
    /**
     * 加载flash导出的动画资源
     * @param  {[Object]} assetsData [加载的资源库文件]
     * var assetsData = require('assets/main.js');
     * 也或者是 导出js命名空间
     * 如 lib
     * @param  {[Object]} opts       [加载参数]
     *  opts.basePath './assets/'
     *  opts.progress  加载进度回调 progress 0-1
     *  opts.complete  加载完成回调 loader, resources
     *  opts.loader  可以不新创建 loader对象使用 已有loader对象
     *  opts.list   加载其他资源对象
     * @return {[PIXI.loaders.Loader]}            [加载对象]
     * @alias DsPixi.loadAnimateAssets
     */
    DsPixi.LoadAnimateAssets = function (assetsData, opts) {
        opts = opts || {};
        var basePath = opts.basePath || "/";
        var _complete;
        if (opts.complete)
            _complete = opts.complete;
        else if (opts.onEnd)
            _complete = opts.onEnd;

        var _loader;
        if (opts.loader && (opts.loader instanceof PIXI.loaders.Loader)) _loader = opts.loader;
        else _loader = new PIXI.loaders.Loader();
        var assets;
        //直接通过 require方法 进来的 传入是module.exports
        if (assetsData.stage && assetsData.stage.assets) assets = assetsData.stage.assets;
        //直接通过 js插入方法 进来的 传入是lib,需要通过lib中找出首文件class ，找出下列加载对象后进行加载处理
        else if (assetsData && opts.mainClass && assetsData[opts.mainClass] && assetsData[opts.mainClass].assets) assets = assetsData[opts.mainClass].assets;
        else assets = {};


        if (assets && Object.keys(assets).length) {
            for (var key in assets) {
                if (assets.hasOwnProperty(key)) _loader.add(key, basePath + assets[key]);
            }
        }

        if (opts.list) {
            var _list = opts.list;
            for (var i = 0; i < _list.length; i++) {
                var _temp = _list[i];
                if (typeof _temp === 'string') _temp = {id: _temp, src: _temp};
                else if (_temp.id === undefined && _temp.src) _temp.id = _temp.src;
                //添加到显示列表
                if (_temp.id !== undefined && _temp.src !== undefined) _loader.add(_temp.id, _temp.src);
            }
        }

        function complete(loader, resources) {
            console.log('complete');
            if (_complete) _complete(loader, resources);
        }

        _loader.on("progress", function () {
                console.log('progress:', _loader.progress / 100);
                if (opts.progress)
                    opts.progress(_loader.progress / 100);
            }
        );
        _loader.once("complete", complete);
        _loader.load();
        return _loader;
    };
    DsPixi.loadAnimateAssets=DsPixi.LoadAnimateAssets;


    /**
     * 加载资源
     * @param  {[Object]} opts [加载参数]
     * opts.basePath  素材根目录设置 如：'./assets/'
     * opts.list  素材列表
     *   {id:'Dragon',src:''},
     * opts.progress  加载进度
     * opts.complete  加载完成
     * @return {[PIXI.loaders.Loader]}            [加载对象]
     * @alias DsPixi.loadAssets
     */
    DsPixi.LoadAssets = function (opts) {
        opts = opts || {};
        var basePath = opts.basePath ? opts.basePath : '';
        var _list = opts.list;
        if (!_list || _list.length <= 0) {
            console.warn('加载列表内没有加载对象');
        }
        var _loader;
        if (opts.loader && (opts.loader instanceof PIXI.loaders.Loader)) _loader = opts.loader;
        else _loader = new PIXI.loaders.Loader();

        // console.log('LoadAssets',_loader);
        var complete;
        if (opts.complete) complete = opts.complete;
        else if (opts.onEnd) complete = opts.onEnd;

        for (var i = 0; i < _list.length; i++) {
            var _temp = _list[i];
            if (typeof _temp === 'string') {
                _temp = {id: _temp, src: _temp};
            } else if (_temp.id === undefined && _temp.src) {
                _temp.id = _temp.src;
            }
            if (_temp.id !== undefined && _temp.src !== undefined) {
                _loader.add(_temp.id, basePath + '/' + _temp.src);
            }
        }
        _loader.on("progress", function () {
            if (opts.progress) opts.progress(_loader.progress / 100);
        });
        _loader.once("complete", function (loader, resources) {
            if (complete) complete(loader, resources);
        });
        _loader.load();
        return _loader;
    };
    DsPixi.loadAssets=DsPixi.LoadAssets;

    //DragonBones 工厂方法
    //if (window['dragonBones'] !== undefined) DsPixi.DBFactory = dragonBones.PixiFactory.factory;

    /**
     * 加载DragonBones素材给到pixi使用
     * 需要进行加载 pixi dragonBones 支持库
     * https://github.com/DragonBones/DragonBonesJS/tree/master/Pixi
     * require('pixidragonBones');
     * @param  {[Object]} opts [加载参数]
     * opts.basePath  素材根目录设置 如：'./assets/'
     * opts.list  素材列表
     *   {id:'Dragon',path:''},
     * opts.progress  加载进度
     * opts.complete  加载完成
     * @return {[PIXI.loaders.Loader]}            [加载对象]
     * @alias DsPixi.loadDragonBones
     */
    DsPixi.LoadDragonBones = function (opts) {
        if (window['dragonBones'] !== undefined) DsPixi.DBFactory = dragonBones.PixiFactory.factory;
        if (!window.dragonBones) console.warn('请先载入 dragonBones框架');
        opts = opts || {};
        var basePath = opts.basePath ? opts.basePath : '';
        var _list = opts.list;
        if (!_list || _list.length <= 0) console.warn('加载列表内没有加载对象');

        var complete;
        if (opts.complete) complete = opts.complete;
        else if (opts.onEnd) complete = opts.onEnd;

        var _loader = new PIXI.loaders.Loader();
        for (var i = 0; i < _list.length; i++) {
            var _temp = _list[i];
            /**
             * _temp.path 素材子目录名称  没有子目录就空
             * _temp.id 素材输出名
             */
            var _path = _temp.path ? _temp.path : '';
            var _id = _temp.id ? _temp.id : '';
            _loader.add(_id + '_bonesData', basePath + _path + '/' + _id + '_ske.json');
            _loader.add(_id + '_textureData', basePath + _path + '/' + _id + '_tex.json');
            _loader.add(_id + '_texture', basePath + _path + '/' + _id + '_tex.png');
        }

        _loader.on("progress", function () {
            if (opts.progress) opts.progress(_loader.progress / 100);
        });
        _loader.once("complete", function (loader, resources) {
            //加载素材完成 DragonBones构建素材
            for (var i = 0; i < _list.length; i++) {
                var _temp = _list[i];
                var _id = _temp.id ? _temp.id : '';
                DsPixi.DBFactory.parseDragonBonesData(resources[_id + '_bonesData'].data);
                DsPixi.DBFactory.parseTextureAtlasData(resources[_id + '_textureData'].data, resources[_id + '_texture'].texture);
            }
            if (complete) complete(loader, resources);
        });

        _loader.load();
        return _loader;
    };
    DsPixi.loadDragonBones=DsPixi.LoadDragonBones;

    /**
     * 获取tDragonBones动画
     * @param  {[String]} id [动画对象名]
     * @return {[dragonBones.Animation]}      [骨骼动画对象]
     * dragonBones.Animation
     * http://developer.egret.com/cn/apidoc/index/id/dragonBones.Animation
     * @alias DsPixi.getDragonBonesMovie
     */
    DsPixi.GetDragonBonesMovie = function (id) {
        var _movie = DsPixi.DBFactory.buildArmatureDisplay(id);
        return _movie;
    };
    DsPixi.getDragonBonesMovie=DsPixi.GetDragonBonesMovie;

    /**
     * Pixi模块
     * @param  {[Object]} opts [构造参数]
     * @constructor
     */
    DsPixi.PixiModel = function (opts) {
        var _Self = this;
        opts = opts || {};
        var width = opts.width ? opts.width : 640;
        var height = opts.height ? opts.height : 1140;
        var fps = opts.fps ? opts.fps : 30;
        var autoStart = opts.autoStart !== undefined ? opts.autoStart : true;
        var transparent = opts.transparent !== undefined ? opts.transparent : true;//是否透明
        var antialias = opts.antialias !== undefined ? opts.antialias : false;//是否抗锯齿 目前chrome支持
        var preserveDrawingBuffer = opts.preserveDrawingBuffer !== undefined ? opts.preserveDrawingBuffer : false;//是否启用绘图缓冲区保存
        var resolution = opts.resolution !== undefined ? opts.resolution : 1;//renderer 时候是否使用device pixel 可以使用如 2
        var forceCanvas = opts.forceCanvas !== undefined ? opts.forceCanvas : false;//是否不使用webgl渲染
        var backgroundColor = opts.backgroundColor !== undefined ? opts.backgroundColor : 0x0;
        var clearBeforeRender = opts.clearBeforeRender !== undefined ? opts.clearBeforeRender : true;
        var legacy = opts.legacy !== undefined ? opts.legacy : true;//考虑到旧的/不太先进的设备兼容可以设置成true,只需要webgl可以是 false;
        var sharedLoader = opts.sharedLoader !== undefined ? opts.sharedLoader : false;
        var sharedTicker = opts.sharedTicker !== undefined ? opts.sharedTicker : false;
        var appendTo = opts.appendTo ? opts.appendTo : '';


        var app = new PIXI.Application({
            width: width,
            height: height,
            autoStart: autoStart,
            transparent: transparent,
            antialias: antialias,
            preserveDrawingBuffer: preserveDrawingBuffer,
            resolution: resolution,
            forceCanvas: forceCanvas,
            backgroundColor: backgroundColor,
            clearBeforeRender: clearBeforeRender,
            legacy: legacy,
            sharedLoader: sharedLoader,
            sharedTicker: sharedTicker,
        });

        var _canvas = app.view;
        var _stage = app.stage;
        var _root = new PIXI.Container();
        _stage.addChild(_root);
        _Self.app = app;
        _Self.stage = _stage;
        _Self.root = _root;
        _Self.canvas = _canvas;
        _Self.renderer = app.renderer;
        _Self.screen = app.screen;
        _Self.loader = app.loader;
        _Self.ticker = app.ticker;
        _Self.width = width;
        _Self.height = height;

        _Self.Stage = _stage;
        _Self.Root = _root;
        _Self.Canvas = _canvas;
        _Self.App = app;
        _Self.Screen = app.screen;
        _Self.Loader = app.loader;

        if (appendTo !== '') {
            if (typeof appendTo === 'string') {
                if (appendTo.indexOf('#') === 0) appendTo = appendTo.slice(1);
                document.getElementById(appendTo).appendChild(_canvas);
            } else if (appendTo instanceof HTMLElement) {
                appendTo.appendChild(_canvas);
            } else if (appendTo[0] instanceof HTMLElement) {
                appendTo[0].appendChild(_canvas);
            } else {
                console.warn('opts.appendTo 参数非法');
            }
        } else {
            // console.log('添加到body');
            document.body.appendChild(_canvas);
        }
        app.ticker.add(function (delta) {
            _Self.emit('update', delta);
        });
        //进行重设置canvas大小
        this.setSize = function (_w, _h) {
            _Self.width = _w;
            _Self.height = _h;
            app.renderer.resize(_w, _h);
        };
    };
    DsPixi.PixiModel.prototype = new PIXI.utils.EventEmitter();
    /**
     * 创建Pixi模块
     * @param  {[Object]} opts [参数]
     * @return {[DsPixi.PixiModel]}      [pixi模块对象]
     * @alias DsPixi.create
     */
    DsPixi.Create = function (opts) {
        return new DsPixi.PixiModel(opts);
    };
    DsPixi.create=DsPixi.Create;

    return root.Ds.DsPixi;
}));
