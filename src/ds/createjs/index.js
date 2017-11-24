import CreatejsModel from './CreatejsModel.js';
import CreatejsGLModel from './CreatejsGLModel.js';
import InputText from './InputText.js';

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
/**
 * createjs相关便捷函数，为快速开发createjs项目存在
 * @namespace ds.createjs
 * @requires module:libs/createjs/createjs0.8.2.min.js
 */
ds.createjs = ds.createjs || {};

/**
 * 获取动画标签的开始帧
 * @param {createjs.DisplayObject} mc
 * @param {string} value
 */
ds.createjs.getFrameByLabel=function (mc,value) {
    if(mc instanceof createjs.MovieClip){
        let _labels=mc.labels;
        for (let i = 0; i < _labels.length; i++) {
            if(_labels[i].label===value)return _labels[i].position;
        }
        return -1;
    }
    return -1;
};

/**
 * 获取一个显示对象的BitmapData
 * @requires module:libs/createjs/BitmapData.js
 * @param {createjs.DisplayObject} display  一个需要截图的显示对象
 * @param {createjs.Rectangle} rect  截图区域
 * @return {createjs.BitmapData}  返回可以操作的像素数据
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
 * 添加一个输入框对象
 * @param {createjs.DisplayObject} display 显示输入框对应的显示对象
 * @param {object} opts 输入框配置参数 {@link ds.createjs.InputText}
 * @param {string} defaultText 输入框默认文本
 * @return {ds.createjs.InputText}  输入框对象
 */
ds.createjs.addInput = function (display, opts, defaultText) {

    var _input = new InputText(display, opts, defaultText);
    return _input;

};

//dom元素列表
let _CreatejsDOMList = [];
/**
 * 是否自动刷新判断 dom元素在场景内
 * @type {boolean}
 */
ds.createjs.CreatejsDOMAuto = true;
createjs.Ticker.addEventListener("tick", function () {

    if (!ds.createjs.CreatejsDOMAuto) return;


    for (var i = 0; i < _CreatejsDOMList.length; i++) {

        var _domElement = _CreatejsDOMList[i];
        if (_domElement) _domElement.upInStage();

    }

});

/**
 * 添加一个createjs 绑定的dom元素
 * @param {createjs.Container} display 显示容器
 * @param {HTMlElement} dom  dom对象
 * @param {HTMlElement} domBox 添加到dom容器
 * @return {createjs.DOMElement}
 * @example
 * var _img=new Image();
 * _img.src='./images/ShareImg.jpg';
 * ds.createjs.addDOM(_View.movie.box,_img);
 */
ds.createjs.addDOM = function (display, dom, domBox) {

    let _el = $(dom);
    let _domElement = new createjs.DOMElement(_el[0]);
    let _domBox;

    _el.css({
        position: 'absolute',
        top: 0,
        left: 0,
        'transform': 'translate(-1000px,-1000px)',
        '-webkit-transform': 'translate(-1000px,-1000px)',
    });

    if (domBox) _domBox = $(_domBox);
    else _domBox = $('#cjsBox');

    _domBox.append(_el);
    display.addChild(_domElement);

    _domElement.upInStage = function () {

        if (display && display.stage) _el.show();
        else _el.hide();

    };

    _el[0]._domElement = _domElement;

    _CreatejsDOMList.push(_domElement);

    return _domElement;

};
/**
 * 删除一个createjs 绑定的 dom元素
 * @param {HTMlElement|createjs.DOMElement} domElement
 */
ds.createjs.removeDOM = function (domElement) {

    let _domElement;
    if (domElement instanceof createjs.DOMElement) _domElement = domElement;
    else if (domElement[0] && domElement[0]._domElement) _domElement = domElement[0]._domElement;

    if (_domElement && _CreatejsDOMList.indexOf(_domElement) >= 0) {

        for (var i = 0; i < _CreatejsDOMList.length; i++) {

            if (_CreatejsDOMList[i] == _domElement) _CreatejsDOMList.splice(i, 1);

        }

        $(_domElement.htmlElement).remove();

    }

};

/**
 * 添加一个createjs绑定的dom元素来做click触发
 * @param {createjs.Container} display 显示容器
 * @param {HTMlElement} dom  dom对象
 * @param {HTMlElement} domBox 添加到dom容器
 * @param {function} fun click执行函数
 * @return {createjs.DOMElement}
 * @example
 * var _img=new Image();
 * _img.src='./images/ShareImg.jpg';
 * ds.createjs.addHitDom(_View.movie.box,_img,null,function(){
 *      console.log('点击测试');
 * });
 */
ds.createjs.addHitDom = function (display, dom, domBox, fun) {

    let _domElement = ds.createjs.addDOM(display, dom, domBox);

    if (fun) $(dom).on('click', fun);

    return _domElement;

};
/**
 * 为createjs绑定的dom元素来做click触发
 * @param {createjs.Container} display 显示容器
 * @param width  dom 的宽
 * @param height dom 的高
 * @param {function} fun click执行函数
 * @return {createjs.DOMElement}
 */
ds.createjs.addEventDom = function (display, width, height, fun) {

    let _dom = document.createElement("div");
    $(_dom).css({width: width, height: height});

    let _domElement = ds.createjs.addDOM(display, _dom);

    if (fun) _domElement.on('click', fun);

    return _domElement;
};

/**
 * 添加一个用户头像到指定容器
 * @param {string} url  头像地址
 * @param {number} size  缩放头像大小
 * @param {createjs.Container} box=undefined 添加到容器
 * @param {function} loadend=undefined 头像加载完成方法
 * @return {createjs.Bitmap} 一个位图显示对象
 */
ds.createjs.addAvatar = function (url, size, box, loadend) {

    var _img = new Image();
    _img.crossOrigin = "Anonymous";
    var _bmp = new createjs.Bitmap();
    _bmp.image = _img;
    _img.onload = function () {
        if (box) box.addChild(_bmp);
        var _s = size / _img.width;
        _bmp.scaleX = _bmp.scaleY = _s;
        if (loadend) loadend(_bmp);
    };

    _img.onerror = function () {
        if (loadend) loadend(_bmp);
    };
    _img.src = url;
    return _bmp;

};
/**
 * 缓存获取一个现实对象的base64数据截图
 * @param {createjs.DisplayObject} display 需要进行缓存获取的显示对象
 * @param {object} opts 截图设置参数
 * @param {string} [opts.type='png'] 截图保存图片格式类型
 * ##### 类型：
 * - png --> 设置png导出
 * - jpg --> 设置jpg时候可以设置质量 opts.encoder
 * @param {number} [opts.encoder=0.8] 保存jpg类型时候base64的图片质量
 * @param {number} opts.width 截图宽
 * @param {number} opts.height 截图高
 * @return {string}  base64数据
 */
ds.createjs.getBase64 = function (display, opts) {

    opts = opts || {};
    var _base64;

    var _rect = new createjs.Rectangle();

    if (opts.width) {

        _rect.width = opts.width;
        _rect.height = opts.height || opts.width;

    }
    else {

        var _temp = display.getBounds();
        _rect.width = _temp.width + _temp.x;
        _rect.height = _temp.height + _temp.y;

    }

    display.cache(_rect.x, _rect.y, _rect.width, _rect.height);

    if (opts.type === 'jpg') _base64 = display.cacheCanvas.toDataURL("image/jpeg", opts.encoder !== undefined ? opts.encoder : 0.8);
    else _base64 = display.cacheCanvas.toDataURL("image/png");

    display.uncache();

    if (opts.debug) {

        var _w = window.open('about:blank', 'image from canvas');
        if (_w) _w.document.write("<img src='" + _base64 + "' alt='from canvas'/>");

    }

    return _base64;

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
 * @param {function} eventFun    执行函数
 * @param {createjs.DisplayObject} hitMc 作为这按钮响应区域的显示对象
 */
ds.createjs.setButton = function (mc, eventFun, hitMc) {

    if (hitMc) {
        setButtonByHitMc(mc, eventFun, hitMc);
        return;
    }

    if (eventFun) {

        mc.on('click', function (e) {
            if (eventFun) eventFun(e);
        })

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
function setButtonByHitMc(mc, eventFun, hitMc) {

    if (mc instanceof createjs.MovieClip) mc.gotoAndStop(0);

    mc.hitMc = hitMc;
    hitMc.mc = mc;
    hitMc.cursor = 'pointer';

    if (hitMc.mouseChildren !== null) hitMc.mouseChildren = false;

    if (eventFun) {

        hitMc.on('click', function (e) {
            if (eventFun) eventFun(e);
        })

    }

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

var tempAnchor;

function determineCrossOrigin(url, loc) {

    loc = loc || window.location;

    if (url.indexOf('data:') === 0) return '';

    // default is window.location
    loc = loc || window.location;

    if (!tempAnchor) tempAnchor = document.createElement('a');

    tempAnchor.href = url;
    url = _url.parse(tempAnchor.href);

    var samePort = (!url.port && loc.port === '') || (url.port === loc.port);

    if (url.hostname !== loc.hostname || !samePort || url.protocol !== loc.protocol) return 'anonymous';

    return '';

}


let AdobeAnCompositionsList = [];
/**
 * createjs资源加载后命名空间list
 * @type {Array}
 */
ds.createjs.JSNCS = [];
/**
 * 加载动资源资源队列
 * @param {object} opts 加载参数
 * @param {string} opts.jsUrl 加载参数
 * @param {array} [opts.otherList=[]]  其他资源，如果其他图片
 * @param {string} [opts.jsNS='libs']  加载后动画类资源附加到什么命名空间下
 * > 如果加载多个flash资源，每个flash资源设置命名空间需要不同
 * @param {string} [opts.imgNS='images']  加载后图片资源附加到什么命名空间下
 * > 如果加载多个flash资源，每个flash资源设置命名空间需要不同
 * @param {function} [opts.progress=undefined]  加载过程回调
 * @param {function} [opts.complete=undefined]  加载完成回调
 * @param {string} [opts.basePath='']  添加相对路径 默认不输入basePath为'',直接使用默认路径，有设置会basePath+其他路径url
 * @param {boolean} [opts.loadType=false]  资源加载方式，是否使用预加载文件头来获取精准的加载进度
 * @param {boolean} [opts.crossOrigin=false]  跨域传入值  ''或者'anonymous' 传入true 等同'anonymous'
 * @return {createjs.LoadQueue} 加载对象
 *
 * @example
 * //加载配置对象
 * var _loadData={
 *      basePath: './assets/',
 *      jsUrl: 'main.js',
 *      jsNS: 'lib',
 *      imgNS: 'images',
 *      loadType: true,
 *      crossOrigin: false,//是否使用跨域
 *      complete:function(e){
 *
 *      },
 *      progress:function(e){
 *          var _progress = e.target.progress;
 *          //SiteModel.showProgress(_progress * 100 >> 0);
 *      }
 * }
 * ds.createjs.loadAssets(_loadData);
 *
 */
ds.createjs.loadAssets = function (opts) {

    if (!opts.jsUrl) {

        console.warn('动画资源的js配置是必须!');
        return;

    }

  

    //获取导出库对象  新版发布才需要
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

    //创建队列对象1
    let queue;
    if (!opts.crossOrigin) queue = new createjs.LoadQueue(loadType);
    else {

        let _crossOrigin = typeof opts.crossOrigin === 'string' ? opts.crossOrigin : 'anonymous';
        queue = new createjs.LoadQueue(loadType, '', _crossOrigin);

    }

    if (createjs.Sound) queue.installPlugin(createjs.Sound);

    queue.addEventListener("fileload", queueFileLoad);
    queue.addEventListener("progress", queueProgress);
    queue.addEventListener("error", queueError);
    queue.addEventListener("complete", queueComplete);

    let basePath;
    if(opts.basePath)basePath=opts.basePath;
    else {
        basePath= _getAbsoluteUrl(jsUrl);
        basePath=basePath.slice(0,basePath.lastIndexOf('/'))+'/';
    }
   
    //先开始加载导出的JS
    // let _jsUrl = basePath ? basePath + jsUrl : jsUrl;
    let _jsUrl;
    if(jsUrl.indexOf('/')===-1)_jsUrl=basePath + jsUrl;
    else _jsUrl=jsUrl;

    let jsloader = new createjs.JavaScriptLoader({
        src: _jsUrl,
        id: _jsUrl,
        type: "javascript"
    });

    


    jsloader.addEventListener('complete', jsComplete);

    jsloader.load();

    var _isCC2018Version = false;

    function jsComplete(e) {

        if (!AdobeAn || !AdobeAn.compositions) _isCC2018Version = false;
        else _isCC2018Version = true;

        queueStartLoad();

    }

    let queueArr, ssMetadata;

    function queueStartLoad() {

        // console.log('_isCC2018Version:',_isCC2018Version,AdobeAn);
        //老版本
        if (!_isCC2018Version) {
            queueArr = window[jsNS].properties.manifest;
            ssMetadata = window[jsNS].ssMetadata;
        }
        //新版本 根据获取compositions内最新库的参数值来设置库的命名空间
        else {

            // console.log('queueStartLoad:',AdobeAn.compositions);
            let _currentID;

            for (var key in AdobeAn.compositions) {

                // console.log(key);
                if (AdobeAnCompositionsList.indexOf(key) < 0) {

                    _currentID = key;
                    AdobeAnCompositionsList.push(key);

                }

            }

            if (!_currentID) {

                console.error('ds.createjs.loadAssets No has AdobeAn compositions ID Error');
                return;

            }

            _comp = AdobeAn.getComposition(_currentID);
            let lib = _comp.getLibrary();
            window[jsNS] = lib;
            window[imgNS] = _comp.getImages();
            queueArr = lib.properties.manifest;
            ssMetadata = lib.ssMetadata;

            ds.createjs.JSNCS.push({name: jsNS, id: _currentID});

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
        if (e.item.type === "image") images[e.item.id] = e.result;

    }

    //队列加载完成
    function queueComplete(e) {

        let ss;
        if (!_isCC2018Version) ss = window.ss = window.ss || {};
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
 * @param {boolean} [opts.hasGL=false] 是否需要创建WebGl的stage
 * @param {CanvasElement} [opts.canvas=undefined] canvas对象 只有非WebGl模式可以传，建议不需要
 * @param {number} [opts.width=640] canvas宽
 * @param {number} [opts.height=1140] canvas宽
 * @param {number} [opts.fps=30] 渲染帧率
 * @param {string} [opts.appendTo=''] 需要添加到什么dom列表内，可以为空不添加
 * @param {object} [opts.css=undefined] 需要对canvas设置什么css,一个object对象。需要jquery或者zepto支持
 * @return {ds.createjs.CreatejsModel|ds.createjs.CreatejsGLModel}   Createjs的cavnas基础结构
 * @example
 * var createJsModel = ds.createjs.create({
 *       appendTo: $('#cjsBox')[0],
 *       width: 640,
 *       height: 1140,
 *       fps: 30
 *   });
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


    let _cjsModel;

    let _hasGL = (opts.hasGL && ds.createjs.isWebGLSupported());
    // let _hasGL=false;

    if (_hasGL) {

        _cjsModel = new CreatejsGLModel();

    }
    else {


        _cjsModel = new CreatejsModel(_canvas);

    }


    _cjsModel.setFPS(_fps);


    //如果有css参数，按参数进行设置
    if (opts.css !== undefined) {

        if (_hasGL) {

            $(_cjsModel.canvas2d).css(opts.css);
            $(_cjsModel.canvas3d).css(opts.css);

        } else {

            $(_cjsModel.canvas).css(opts.css);

        }
    }
    else {


        var _css = {
            position: 'absolute',
            left: 0,
            top: 0,
        };

        if (_hasGL) {

            $(_cjsModel.canvas2d).css(_css);
            $(_cjsModel.canvas3d).css(_css);

        } else {

            $(_cjsModel.canvas).css(_css);

        }
    }

    if (opts.appendTo !== undefined) _cjsModel.appendTo(opts.appendTo);

    _cjsModel.isWebGL = _hasGL

    _cjsModel.size(_width, _height);

    return _cjsModel;

};

/**
 * 判断是否支持webgl
 */
ds.createjs.isWebGLSupported = function () {

    const contextOptions = {stencil: true, failIfMajorPerformanceCaveat: true};
    try {
        if (!window.WebGLRenderingContext) {
            return false;
        }
        const canvas = document.createElement('canvas');
        let gl = canvas.getContext('webgl', contextOptions) || canvas.getContext('experimental-webgl', contextOptions);
        const success = !!(gl && gl.getContextAttributes().stencil);
        if (gl) {
            const loseContext = gl.getExtension('WEBGL_lose_context');
            if (loseContext) {
                loseContext.loseContext();
            }
        }
        gl = null;
        return success;
    }
    catch (e) {

        return false;

    }

};
var _getAbsoluteUrlElement
function _getAbsoluteUrl(url) {
    if (url.indexOf("http:") >= 0 || url.indexOf("https:") >= 0) return url;
    _getAbsoluteUrlElement = document.createElement('a');
    _getAbsoluteUrlElement.href = url;
    url = _getAbsoluteUrlElement.href;
    return url;
}

export default ds.createjs;