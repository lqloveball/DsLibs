import CreatejsModel from './CreatejsModel.js';
import InputText from './InputText.js';

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
/**
 * @namespace ds.createjs
 * @requires module:libs/createjs/createjs0.8.2.min.js
 */
ds.createjs = ds.createjs || {};

/**
 * 获取一个显示对象的BitmapData
 * @requires module:libs/createjs/BitmapData.js
 * @param {createjs.DisplayObject} display
 * @param {createjs.Rectangle} rect
 * @return {createjs.BitmapData}
 */
ds.createjs.getDisplayObjectBitmapData = function (display, rect) {

    if (!createjs.BitmapData) {

        console.warn('需要引用libs/createjs/BitmapData.js');
        return null;

    }

    rect = rect || display.getBounds();

    let _bitmapData = new createjs.BitmapData(null, rect.width, rect.height, "rgba(0,0,0,0)");
    _bitmapData.draw(display);
    display.uncache();

    return _bitmapData;

};

/**
 * 判断2个显示对象是否碰撞
 * @requires module:libs/createjs/BitmapData.js
 * @param {createjs.DisplayObject} source    对比源对象
 * @param {createjs.DisplayObject} target    对比目标文件
 * @return {boolean}  是否碰撞
 */
ds.createjs.hitTestByDisplayObject = function (source, target) {

    if (!createjs.BitmapData) {

        console.warn('需要引用libs/createjs/BitmapData.js');
        return false;

    }

    let _bitmapData = ds.createjs.getDisplayObjectBitmapData(source);

    if (_bitmapData) {

        target.cache(0, 0, _bitmapData.width, _bitmapData.height);

        let _hitTest = _bitmapData.hitTest({
            x: 0,
            y: 0
        }, 0xFF, target, {
            x: 0,
            y: 0
        }, 0xff);

        target.uncache();

        return _hitTest;

    }

};

/**
 * 文本进行换行处理
 * @param {create.Text} label 文本框对象
 * @param {string} info  内容字符串
 * @param {number} width  文本框显示最大宽度（多宽换行）
 * @param {boolean} [crop=false]  是否裁切,设置true,不会做换行，超出部分是裁切
 */
ds.createjs.wrapMetrics = function (label, info, width, crop) {

    crop = crop === undefined ? false : crop;

    if (info.length <= 0) {

        label.text = '';
        return;

    }

    let _info = '',
        _oinfo;

    for (let i = 0; i < info.length; i++) {

        _oinfo = _info;
        _info = _oinfo + info[i];
        label.text = _info;

        let _w = label.getMetrics().width;

        if (crop && _w > width) {

            label.text = _oinfo;
            return;

        }

        if (_w > width) {

            label.text = _oinfo + '\n' + info[i];
            _w = label.getMetrics().width;

        }

        _info = label.text;

    }
};

/**
 * 格式化数字显示
 * @param  {number|string} value  数字
 * @param  {array} mcList 格式化显示用的影片剪辑列表 [mc0,mc1] ,影片剪辑是0-9的序列帧
 * @param  {boolean} [hitZero=false] 是否隐藏前面的零
 */
ds.createjs.formatNumberShow = function (value, mcList, hitZero) {

    hitZero = hitZero !== undefined ? hitZero : false;

    let _info = value + '';

    let i;

    if (_info.length < mcList.length) {

        let _l = mcList.length - _info.length;

        for (i = 0; i < _l; i++) _info = '0' + _info;

    }

    let _arr = _info.split('');
    let _starNoZero = false;

    for (i = 0; i < _arr.length; i++) {

        let _mc = mcList[i];
        let _num = Number(_arr[i]);
        _mc.gotoAndStop(_num);
        _mc.visible = true;

        if (hitZero) {

            if (_num !== 0) _starNoZero = true;

            if (!_starNoZero && _num === 0) _mc.visible = false;

        }

    }
};

/**
 * 控制动画MovieClip播放到第几帧或者标签名。可以实现倒播效果
 * @param {createjs.MovieClip} mc 一个需要被控制影片剪辑
 * @param {number | string} value 帧或者轴标签
 * @param {function} [endFun=undefined] 播放完成后执行事件
 * @return {object} 控制影片播放的相关数据
 */
ds.createjs.movieTo = function (mc, value, endFun) {

    //如果是标签的话 转换成帧
    if (typeof(value) === 'string') value = mc.timeline._labels[value];

    if (value < 0) value = mc.totalFrames;

    mc.__mcMovieToData = undefined;

    let mcObj = {};
    mcObj.mc = mc;
    mcObj.time = 1000 / createjs.Ticker.getFPS();
    mcObj.timer = 0;
    mcObj.start = mc.currentFrame;
    mcObj.end = value;

    //console.log(mcObj,mccurrentFrame,mc.totalFrames);

    if (mcObj.end < 0) mcObj.end = 0;
    if (mcObj.end >= mc.totalFrames) mcObj.end = mc.totalFrames - 1;
    if (mcObj.end >= mcObj.start) mcObj.bool = true;
    if (mcObj.end < mcObj.start) mcObj.bool = false;
    mcObj.endFun = endFun;

    createjs.Tween.removeTweens(mc);

    mc.__mcMovieToData = mcObj;

    if (mcObj.end === mcObj.start) {
        createjs.Tween.removeTweens(mc);
        mc.__mcMovieToData = undefined;

        if (mcObj.endFun !== undefined && mcObj.endFun !== null) mcObj.endFun();

    }
    else {

        createjs.Tween.get(mc).wait(mcObj.time).call(_movieToUpFrame);

    }

    return mcObj;

};

//ds.createjs.movieTo 控制动画剪辑播放帧触发
function _movieToUpFrame() {

    let mc = this;
    let mcObj = mc.__mcMovieToData;
    if (mcObj === undefined) return;

    if (mc.currentFrame === mcObj.end) {

        createjs.Tween.removeTweens(mc);
        mc.__mcMovieToData = undefined;

        if (mcObj.endFun !== undefined && mcObj.endFun !== null) mcObj.endFun();

        return;

    }

    let num = 0;
    if (mcObj.bool) {

        num = mc.currentFrame + 1;
        mc.gotoAndStop(num);
        //log(mc.currentFrame,num);

    } else {

        //log('test 2',mc.currentFrame,mc.currentFrame-1);
        num = mc.currentFrame - 1;
        mc.gotoAndStop(num);

    }

    if ((mcObj.bool && mc.currentFrame >= mcObj.end) && (!mcObj.bool && mc.currentFrame <= mcObj.end)) {

        createjs.Tween.removeTweens(mc);
        mc.__mcMovieToData = undefined;

        if (mcObj.endFun !== undefined && mcObj.endFun !== null) mcObj.endFun();

        mc.gotoAndStop(mcObj.end);

    } else {

        //log('进行',mc,mcObj.time);
        //mcObj.timer=setTimeout("this.movieToUpFrame("+mcObj.mc+")",mcObj.time);
        createjs.Tween.get(mc).wait(mcObj.time).call(_movieToUpFrame);

    }

}


/**
 * 删除影片播放控制
 * @param  {createjs.MovieClip} mc 需要删除的MovieClip
 * @return {createjs.MovieClip}    需要删除的MovieClip
 */
ds.createjs.removeMovie = function (mc) {

    createjs.Tween.removeTweens(mc);
    mc.__mcMovieToData = undefined;

    return mc;

};

/**
 * 设置按钮普遍做法是把一个MovieClip转换成一个按钮(pc常用)
 * 鼠标移动上去从0祯播放到最后一个祯,点击会会播放
 * @param {createjs.MovieClip} mc    要转成按钮的影片剪辑
 * @param {createjs.DisplayObject} hitMc 作为这按钮响应区域的显示对象
 */
ds.createjs.setButton = function (mc, hitMc) {

    if (hitMc) {
        setButtonByHitMc(mc, hitMc);
        return;
    }

    if (mc instanceof createjs.MovieClip) ds.createjs.movieTo(mc, 0);

    mc.cursor = 'pointer';
    mc.mouseChildren = false;

    mc.addEventListener('mouseover', function (e) {

        let mc = e.target;
        let stage = mc.getStage();
        if (stage) stage.canvas.style.cursor = 'pointer';
        if (mc instanceof createjs.MovieClip) ds.createjs.movieTo(mc, mc.totalFrames - 1);

    });

    mc.addEventListener('mouseout', function (e) {

        let mc = e.target;
        let stage = mc.getStage();
        if (stage) stage.canvas.style.cursor = 'default';
        if (mc instanceof createjs.MovieClip) ds.createjs.movieTo(mc, 0);

    });

    //手机版本按钮方式判断 通过点击下后判断
    mc.addEventListener('mousedown', function (event) {

        //log('setPhoneButton mousedown',event);
        let mc = event.target;
        let stage = mc.getStage();
        //进行精准判断是否移动出去后再移动进来的点击，当mc.MCSetButtonMouseOut=true 其实click事件可以不执行
        mc.MCSetButtonMouseOut = false;

        if (mc instanceof createjs.MovieClip) ds.createjs.movieTo(mc, mc.totalFrames - 1);

        function stagemousemove(e) {

            let pt = mc.getStage().localToLocal(e.stageX, e.stageY, mc);

            if (!mc.hitTest(pt.x, pt.y)) {

                mc.MCSetButtonMouseOut = true;
                if (mc instanceof MovieClip) ds.createjs.movieTo(mc, 0);
                stage.removeEventListener('stagemousemove', stagemousemove);
                stage.removeEventListener('stagemouseup', stagemouseup);

            }

        };

        function stagemouseup(e) {

            if (mc instanceof createjs.MovieClip) ds.createjs.movieTo(mc, 0);

            stage.removeEventListener('stagemousemove', stagemousemove);
            stage.removeEventListener('stagemouseup', stagemouseup);

        };

        stage.addEventListener('stagemousemove', stagemousemove);
        stage.addEventListener('stagemouseup', stagemouseup);

    });
};

//需要设置其他响应区域的按钮算法
function setButtonByHitMc(mc, hitMc) {

    if (mc instanceof createjs.MovieClip) mc.gotoAndStop(0);

    mc.hitMc = hitMc;
    hitMc.mc = mc;
    hitMc.cursor = 'pointer';

    if (hitMc.mouseChildren !== null) hitMc.mouseChildren = false;

    hitMc.addEventListener('mouseover', function (e) {

        let hitMc = e.target;
        let mc = hitMc.mc;
        let stage = hitMc.getStage();
        if (stage) stage.canvas.style.cursor = 'pointer';
        if (mc instanceof createjs.MovieClip) ds.createjs.movieTo(mc, mc.totalFrames - 1);

    });

    hitMc.addEventListener('mouseout', function (e) {

        let hitMc = e.target;
        let mc = hitMc.mc;
        let stage = hitMc.getStage();
        if (stage) stage.canvas.style.cursor = 'default';
        if (mc instanceof createjs.MovieClip) ds.createjs.movieTo(mc, 0);

    });

    //手机版本按钮方式判断 通过点击下后判断
    hitMc.addEventListener('mousedown', function (event) {

        let hitMc = event.target;
        let mc = hitMc.mc;
        let stage = hitMc.getStage();
        //进行精准判断是否移动出去后再移动进来的点击，当mc.MCSetButtonMouseOut=true 其实click事件可以不执行
        hitMc.MCSetButtonMouseOut = false;
        if (mc instanceof createjs.MovieClip) ds.createjs.movieTo(mc, mc.totalFrames - 1);

        function stagemousemove(e) {

            let pt = hitMc.getStage().localToLocal(e.stageX, e.stageY, hitMc);

            if (!hitMc.hitTest(pt.x, pt.y)) {

                hitMc.MCSetButtonMouseOut = true;
                if (mc instanceof createjs.MovieClip) ds.createjs.movieTo(mc, 0);
                stage.removeEventListener('stagemousemove', stagemousemove);
                stage.removeEventListener('stagemouseup', stagemouseup);

            }
        };

        function stagemouseup(e) {

            if (mc instanceof createjs.MovieClip) ds.createjs.movieTo(mc, 0);
            stage.removeEventListener('stagemousemove', stagemousemove);
            stage.removeEventListener('stagemouseup', stagemouseup);

        };

        stage.addEventListener('stagemousemove', stagemousemove);
        stage.addEventListener('stagemouseup', stagemouseup);

    });

}

/**
 * 加载插入JS资源
 * @param {string} jsUrl    [加载js资源]
 * @param {function} complete [js加载完成后回调函数]
 * @param {function} error    [js加载失败后回调函数]
 */
ds.createjs.loadJS = function (jsUrl, complete, error) {

    let _jsloader = new createjs.JavaScriptLoader({
        src: jsUrl,
        id: jsUrl,
        type: "javascript"
    });

    _jsloader.addEventListener('complete', jsComplete);
    _jsloader.addEventListener('error', jsError);
    _jsloader.load();

    function jsComplete(e) {

        if (complete) complete(e);

    }

    function jsError(e) {

        if (error) error(e);

    }

};

/**
 * 加载动资源资源队列
 * @param {object} opts 加载参数
 * @param {string} opts.jsUrl 加载参数
 * @param {boolean} [opts.judge=true] 是否指定2017以后版本。如果不指定，会进行createjs.TextLoader加载后进行字符判断。但这样会等于加载两次js文件不推荐这么做，开发过程中为了方便可以先不设置
 * @param {string} [opts.id='']  Adobe Animate CC 2017以后版本导出的js有指定id，可以指定id。如果设置等于忽略opts.judge
 * @param {array} [opts.otherList='']  其他资源，如果其他图片
 * @param {string} [opts.jsNS='libs']  加载后动画类资源附加到什么命名空间下
 * @param {string} [opts.imgNS='images']  加载后图片资源附加到什么命名空间下
 * @param {function} [opts.progress=undefined]  加载过程回调
 * @param {function} [opts.complete=undefined]  加载完成回调
 * @param {string} [opts.basePath='']  添加相对路径 默认不输入basePath为'',直接使用默认路径，有设置会basePath+其他路径url
 * @param {boolean} [opts.loadType=false]  资源加载方式，是否使用预加载文件头来获取精准的加载进度
 * @return {createjs.LoadQueue} 加载对象
 */
ds.createjs.loadAssets = function (opts) {

    if (!opts.jsUrl) {

        console.warn('动画资源的js配置是必须!');
        return;

    }

    let basePath = opts.basePath ? opts.basePath : null;
    //是否需要进行判断是否是最新的AnimateCC2017导出的资源
    let _judgeAnimateCC2017 = opts.judge !== undefined ? opts.judge : true;
    //命名空间的id
    let _isCompositionID = opts.id;
    //是否最新AdobeAnimateCC2017以后的版本 如果不进行判断，但有填写id那还默认为是最新的AnimateCC2017导出的资源
    let _isAdobeAnimateCC2017 = (!_judgeAnimateCC2017 && _isCompositionID) ? true : false;

    //获取导出库对象
    let _comp;
    //加载js对象
    let jsUrl = opts.jsUrl;

    //加载spritesheet资源数组，这是比较早起的flash导出资源时候需要传入的参数数据，现在已经没什么用了，留做纪念吧。
    let ssList = opts.ssList ? opts.ssList : null;

    //顺带加载一些其他资源
    let otherList = opts.otherList ? opts.otherList : null;
    //js命名空间
    let jsNS = opts.jsNS ? opts.jsNS : 'lib';
    //图片命名空间
    let imgNS = opts.imgNS ? opts.imgNS : 'images';
    //加载完成回调s
    let complete = opts.complete ? opts.complete : null;
    //加载过程回调
    let progress = opts.progress ? opts.progress : null;
    //加载类型，默认不需要http服务的false
    let loadType = opts.loadType ? opts.loadType : false;

    //创建队列对象
    let queue = new createjs.LoadQueue(loadType);

    if (createjs.Sound) queue.installPlugin(createjs.Sound);

    queue.addEventListener("fileload", queueFileLoad);
    queue.addEventListener("progress", queueProgress);
    queue.addEventListener("error", queueError);
    queue.addEventListener("complete", queueComplete);

    //先开始加载导出的JS
    let _jsUrl = basePath ? basePath + jsUrl : jsUrl;

    let textloader = new createjs.TextLoader({
        src: _jsUrl,
        id: _jsUrl,
    });

    let jsloader = new createjs.JavaScriptLoader({
        src: _jsUrl,
        id: _jsUrl,
        type: "javascript"
    });

    textloader.addEventListener('complete', textComplete);
    jsloader.addEventListener('complete', jsComplete);

    //需要判断并且没指定库对象id的 必须进行判断加载
    if (_judgeAnimateCC2017) textloader.load();
    //不需要判断，有库的id号，说明是AdobeAnimateCC2017以后的版本
    else if (!_judgeAnimateCC2017 && _isCompositionID) {

        console.log('no Judge is AnimateCC 2017');
        jsloader.load();

    }
    //老版本导出
    else {

        jsloader.load();

    }

    //进行判断后执行重新加载js
    function textComplete(e) {

        let jsText = textloader.getResult();
        //判断是否最新AdobeAnimateCC2017以后的版本
        if (jsText.indexOf("an.compositions['") >= 0) _isAdobeAnimateCC2017 = true;

        if (_isAdobeAnimateCC2017) {

            let reg = /an\.compositions\['(\w*)'\]/;
            jsText.replace(reg, function () {
                _isCompositionID = arguments[1];
            });

        }

        jsloader.load();

    }

    function jsComplete(e) {

        queueStartLoad();

    }

    let queueArr, ssMetadata;

    function queueStartLoad() {

        //老版本
        if (!_isAdobeAnimateCC2017) {

            queueArr = window[jsNS].properties.manifest;
            ssMetadata = window[jsNS].ssMetadata;

        }
        //新版本
        else {

            _comp = AdobeAn.getComposition(_isCompositionID);
            var lib = _comp.getLibrary();
            window[jsNS] = lib;
            window[imgNS] = _comp.getImages();
            queueArr = lib.properties.manifest;
            ssMetadata = lib.ssMetadata;

        }


        let i;
        //如果存在basePath设置选择对window[jsNS].properties.manifest进行设置
        if (basePath) {

            for (i = 0; i < queueArr.length; i++) queueArr[i].src = basePath + queueArr[i].src;

        }
        //其他资源的加载
        if (otherList !== null) {

            for (i = 0; i < otherList.length; i++) queueArr.push(otherList[i]);

        }
        if (queueArr.length <= 0) {

            complete();
            return;

        }

        queue.loadManifest(queueArr);

    }

    //文件加载错误
    function queueError(e) {
    }

    //队列加载进度
    function queueProgress(e) {

        if (progress !== null) progress(e);

    }

    //当个文件加载完成
    function queueFileLoad(e) {

        //获取图片命名空间 图片索引字典
        let images = window[imgNS];
        if (images === undefined) window[imgNS] = {};
        images = window[imgNS];
        //加载的图片对象放进图片字典中
        if (e.item.type === createjs.LoadQueue.IMAGE) images[e.item.id] = e.result;

    }

    //队列加载完成
    function queueComplete(e) {

        let ss;
        if (!_isAdobeAnimateCC2017) ss = window.ss = window.ss || {};
        else ss = _comp.getSpriteSheet();


        if (ssMetadata) {

            for (let i = 0; i < ssMetadata.length; i++) ss[ssMetadata[i].name] = new createjs.SpriteSheet({
                "images": [queue.getResult(ssMetadata[i].name)],
                "frames": ssMetadata[i].frames
            });

        }

        if (complete !== null) complete(e);

    }

    //队列对象
    return queue;

};


/**
 * 快速创建一个CreatejsModel基础结构
 * @param {object} opts 创建参数
 * @param {number} [opts.width=640] canvas宽
 * @param {number} [opts.height=1140] canvas宽
 * @param {number} [opts.fps=30] 渲染帧率
 * @param {string} [opts.appendTo=''] 需要添加到什么dom列表内，可以为空不添加
 * @param {object} [opts.css=undefined] 需要对canvas设置什么css,一个object对象。需要jquery或者zepto支持
 * @return {ds.createjs.CreatejsModel}   Createjs的cavnas基础结构
 */
ds.createjs.create = function (opts) {

    let _width = opts.width ? opts.width : 640;
    let _height = opts.height ? opts.height : 1140;
    let _fps = opts.fps ? opts.fps : 30;
    let _appendTo = opts.appendTo ? opts.appendTo : '';

    let _canvas = opts.canvas ? opts.canvas : document.createElement("canvas");

    if (typeof _canvas === 'string') _canvas = document.getElementById(_canvas);

    if (_canvas instanceof HTMLElement) _canvas = _canvas;
    else if (_canvas[0] instanceof HTMLElement) _canvas = _canvas[0];
    else _canvas = document.createElement("canvas");

    // var _cjsModel = new ds.createjs.CreatejsModel(_canvas);
    let _cjsModel = new CreatejsModel(_canvas);

    _cjsModel.setFPS(_fps);



    //如果有css参数，按参数进行设置
    if (opts.css !== undefined) {
        $(_canvas).css(opts.css);
    }

    if (opts.appendTo !== undefined) {

        if (typeof _appendTo === 'string') document.getElementById(_appendTo).appendChild(_canvas);
        else if (_appendTo instanceof HTMLElement) _appendTo.appendChild(_canvas);
        else if (_appendTo[0] instanceof HTMLElement) _appendTo[0].appendChild(_canvas);
        else console.warn('未获取到opts.appendTo相关DOM对象，无法添加到DOM列表内:', opts.appendTo);

    }

    _cjsModel.size(_width, _height);

    return _cjsModel;

};

export default ds.createjs;