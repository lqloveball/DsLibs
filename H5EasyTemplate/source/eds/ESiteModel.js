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

        resizeDelay: _getDefault(cf.resizeDelay, 100),

        hasCJS: _getDefault(cf.hasCJS, true),
        hasCJSModel: _getDefault(cf.hasCJSModel, true),
        hasCJSLoad: _getDefault(cf.hasCJSLoad, false),
        hasCJSWebGL: _getDefault(cf.hasCJSWebGL, false),
        cjsLoadData: _getDefault(cf.cjsLoadData, undefined),
        cjsBox: _getDefault(cf.cjsBox, '#cjsBox'),

        hasPixiJs: _getDefault(cf.hasPixiJs, false),
        hasPixiJsModel: _getDefault(cf.hasPixiJsModel, false),
        pixiBox: _getDefault(cf.pixiBox, '#pixiBox'),

        hasThreeJs: _getDefault(cf.hasThreeJs, false),
        hasThreeJsModel: _getDefault(cf.hasThreeJsModel, false),
        threejsBox: _getDefault(cf.threejsBox, '#threejsBox'),

        initLoadPanel: _getDefault(cf.initLoadPanel, undefined),
        showProgress: _getDefault(cf.showProgress, undefined),
        hitLoadPanel: _getDefault(cf.hitLoadPanel, undefined),


        audioConfig: _getDefault(cf.audioConfig, undefined),

        baseUrl: _getDefault(cf.baseUrl, './js/edslibs/base.js'),
        cjsUrl: _getDefault(cf.cjsUrl, './js/edslibs/createjsFrameWork.js'),
        threeUrl: _getDefault(cf.threeUrl, './js/libs/three.min.js'),
        pixiUrl: _getDefault(cf.threeUrl, './js/libs/pixijs.min.js'),

        otherjs: _getDefault(cf.otherjs, []),

        baseEnd: _getDefault(cf.baseEnd, undefined),

    };

    var _base = _getDefault(cf.base, '');
    var _type = _getDefault(cf.type, 'v');

    window.SiteModel = new ds.core.SiteModelByMobile(_base + cf.url, _type, _default_config);

    window.SiteModel.start();

};


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

        if (_cf.hasThreeJs || _cf.hasThreeJsModel || _cf.hasPixiJs || _cf.hasPixiJsModel) {
            if (!_cf.otherjs) _cf.otherjs = [];
            if (_cf.hasThreeJs || _cf.hasThreeJsModel) _cf.otherjs.push('./js/edslibs/extend_threejs.js');
            if (_cf.hasPixiJs || _cf.hasPixiJsModel) _cf.otherjs.push('./js/edslibs/extend_pixijs.js');
        }

        SiteModelStart(_cf);

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

            if (_mode === 'default') SiteConfig.url = './js/edslibs/DefaultMain.js';
            else SiteConfig.url = 'js/edslibs/DefaultMain.js';

            SiteModelStart(SiteConfig);

        });
    }
    else {
        console.warn('请在页面上配置你的单页面逻辑代码');
    }

}

function _getDefault(obj, defaultValue) {
    if (obj === undefined || obj === null) return defaultValue;
    if (obj === 'true') return true;
    else if (obj === 'false') return false;
    return obj;
}

function _getAbsoluteUrl(url) {
    if (url.indexOf("http:") >= 0 || url.indexOf("https:") >= 0) return url;
    var _a = document.createElement('a');
    _a.href = url;
    url = _a.href;
    return url;
}

var root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

/**
 * 快速开发H5库
 * @namespace ds
 */
var eds = root.eds = root.eds || {};



