/**
 * 快速例子
 *
 * //方法1
 *

 * //方法2 标签里面配置
 * ``` html
 * <div id="screen" data-example="js/app/index.js">
 *
 * ```
 */
require('ds/core/SiteModelByMobile');

//网站构建逻辑开始执行
window.SiteModelStart = function (cf) {
    var _default_config = {
        //需要createjs框架
        hasCJS: _getDefault(cf.hasCJS, true),
        //需要创建createjs模块
        hasCJSModel: _getDefault(cf.hasCJSModel, true),
        //不需要createjs loading界面
        hasCJSLoad: _getDefault(cf.hasCJSLoad, false),
        //webgl 双canvas版本 createjs 模块
        hasCJSWebGL: _getDefault(cf.hasCJSWebGL, false),
        hasThreeJs: _getDefault(cf.hasThreeJs, false),
        hasThreeJsModel: _getDefault(cf.hasThreeJsModel, false),
        hasPixiJs: _getDefault(cf.hasPixiJs, false),
        hasPixiJsModel: _getDefault(cf.hasPixiJsModel, false),
        initLoadPanel: cf.initLoadPanel,
        audioConfig: cf.audioConfig,
        otherjs: cf.otherjs,
    };
    var _base = _getDefault(cf.base, '');
    var _type = _getDefault(cf.type, 'v');
    console.log(_default_config);
    //传入的对象是最为整个SiteModel配置使用
    if(cf.isAllConfig)  window.SiteModel = new ds.core.SiteModelByMobile(_base + cf.url, _type, cf);
    //只是部分配置使用
    else  window.SiteModel = new ds.core.SiteModelByMobile(_base + cf.url, _type, _default_config);
    //开启网站
    window.SiteModel.start();

};

//默认有SPA配置对象，就立即执行
if (window['SiteConfig'] !== undefined) window.SiteModelStart(window['SiteConfig']);
else {

    var _screen = document.getElementById('screen');
    var _cf = {};
    if (_screen && _screen.getAttribute('data-example')) {
        _cf.url = _screen.getAttribute('data-example');
        _cf.hasCJS = _getDefault(_screen.getAttribute('data-hasCJS'), true);
        _cf.hasCJSModel = _getDefault(_screen.getAttribute('data-hasCJSModel'), true);
        _cf.hasCJSLoad = _getDefault(_screen.getAttribute('data-hasCJSLoad'), false);
        _cf.hasCJSWebGL = _getDefault(_screen.getAttribute('data-hasCJSWebGL'), false);
        _cf.hasThreeJs = _getDefault(_screen.getAttribute('data-hasThreeJs'), false);
        _cf.hasThreeJsModel = _getDefault(_screen.getAttribute('data-hasThreeJsModel'), false);
        _cf.hasPixiJs = _getDefault(_screen.getAttribute('data-hasPixiJs'), false);
        _cf.hasPixiJsModel = _getDefault(_screen.getAttribute('data-hasPixiJsModel'), false);
        if(_cf.hasThreeJs||_cf.hasThreeJsModel){
            if(!_cf.otherjs)_cf.otherjs=[];
            _cf.otherjs.push('./js/edslibs/extend_threejs.js');
        }
        if(_cf.hasPixiJs||_cf.hasPixiJsModel){
            if(!_cf.otherjs)_cf.otherjs=[];
            _cf.otherjs.push('./js/edslibs/extend_pixijs.js');
        }
        window.SiteModelStart(_cf);
    }
    else if (_screen && _screen.getAttribute('data-config')) {
        var _mode = _getDefault(_screen.getAttribute('data-mode'), 'default');
        var _url = _getAbsoluteUrl(_screen.getAttribute('data-config'));
        ds.core.SiteModelByMobile.getScript(_url, function () {
            if (!window['SiteConfig']) {
                console.warn('请配置简易单页');
                return;
            }
            _mode = _getDefault(SiteConfig.mode, _mode);
            SiteConfig.mode = _mode;

            if (_mode === 'default') SiteConfig.url = 'js/edslibs/DefaultMain.js';
            else SiteConfig.url = 'js/edslibs/DefaultMain.js';

            SiteModelStart(SiteConfig);
        });
    }
    else {
        console.warn('请在页面上配置你的单页面逻辑代码');
    }

}

function _getDefault(obj, defaultValue) {
    if(obj === undefined|| obj === null)return defaultValue;
    if(obj==='true')return true;
    else if(obj==='false')return false;
    return obj;
}

function _getAbsoluteUrl(url) {
    if (url.indexOf("http:") >= 0 || url.indexOf("https:") >= 0) return url;
    var _a = document.createElement('a');
    _a.href = url;
    url = _a.href;
    return url;
}




