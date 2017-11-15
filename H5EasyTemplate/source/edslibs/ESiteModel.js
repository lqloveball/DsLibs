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
        hasCJS: _getValue(cf.hasCJS, true),
        //需要创建createjs模块
        hasCJSModel: _getValue(cf.hasCJSModel, true),
        //不需要createjs loading界面
        hasCJSLoad: _getValue(cf.hasCJSLoad, false),
        //webgl 双canvas版本 createjs 模块
        hasCJSWebGL: _getValue(cf.hasCJSWebGL, false),
        hasThreeJs: _getValue(cf.hasThreeJs, false),
        hasThreeJsModel: _getValue(cf.hasThreeJsModel, false),
        hasPixiJs: _getValue(cf.hasPixiJs, false),
        hasPixiJsModel: _getValue(cf.hasPixiJsModel, false),
        initLoadPanel: cf.initLoadPanel,
        audioConfig: cf.audioConfig,
    };
    var _base = _getValue(cf.base, '');
    var _type = _getValue(cf.type, 'v');
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
    var _config = {};
    if (_screen && _screen.getAttribute('data-example')) {
        _config.url = _screen.getAttribute('data-example');
        _config.hasCJS = _getValue(_screen.getAttribute('data-hasCJS'), true);
        _config.hasCJSModel = _getValue(_screen.getAttribute('data-hasCJSModel'), true);
        _config.hasCJSLoad = _getValue(_screen.getAttribute('data-hasCJSLoad'), false);
        _config.hasCJSWebGL = _getValue(_screen.getAttribute('data-hasCJSWebGL'), false);
        _config.hasThreeJs = _getValue(_screen.getAttribute('data-hasThreeJs'), false);
        _config.hasThreeJsModel = _getValue(_screen.getAttribute('data-hasThreeJsModel'), false);
        _config.hasPixiJs = _getValue(_screen.getAttribute('data-hasPixiJs'), false);
        _config.hasPixiJsModel = _getValue(_screen.getAttribute('data-hasPixiJsModel'), false);
        window.SiteModelStart(_config);
    }
    else if (_screen && _screen.getAttribute('data-config')) {
        var _plugIn = _getValue(_screen.getAttribute('data-plug'), 'default');
        var _url = _getAbsoluteUrl(_screen.getAttribute('data-config'));
        ds.core.SiteModelByMobile.getScript(_url, function () {
            if (!window['SiteConfig']) {
                console.warn('请配置简易单页');
                return;
            }
            _plugIn = _getValue(SiteConfig.plugIn, _plugIn);
            SiteConfig.plugIn = _plugIn;

            if (_plugIn === 'default') SiteConfig.url = 'js/edslibs/DefaultMain.js';
            else SiteConfig.url = 'js/edslibs/DefaultMain.js';

            SiteModelStart(SiteConfig);
        });
    }
    else {
        console.warn('请在页面上配置你的单页面逻辑代码');
    }

}

function _getValue(obj, defaultValue) {
    return obj === void 0 ? defaultValue : obj;
}

function _getAbsoluteUrl(url) {
    if (url.indexOf("http:") >= 0 || url.indexOf("https:") >= 0) return url;
    var _a = document.createElement('a');
    _a.href = url;
    url = _a.href;
    return url;
}




