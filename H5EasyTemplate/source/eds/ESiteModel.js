import SiteModelByMobile from 'ds/core/SiteModelByMobile';
import {getAbsoluteUrl, getDefault, getScript, getScriptList} from 'ds/utils/Mixin';

//网站构建逻辑开始执行
function SiteModelStart(cf) {

    if (window.SiteModel) return;

    let _config = {};

    for (let _key in cf) {

        _config[_key] = cf[_key];

    }

    _config.resizeDelay = getDefault(_config.resizeDelay, 100);
    _config.hasCJS = getDefault(_config.hasCJS, true);
    _config.hasCJSModel = getDefault(_config.hasCJSModel, true);
    _config.hasCJSWebGL = getDefault(_config.hasCJSWebGL, false);

    _config.baseUrl = getDefault(_config.baseUrl, './js/edslibs/base.js');
    _config.cjsUrl = getDefault(_config.cjsUrl, './js/edslibs/createjsFrameWork.js');
    _config.threeUrl = getDefault(_config.threeUrl, './js/libs/three.min.js');
    _config.pixiUrl = getDefault(_config.pixiUrl, './js/libs/pixijs.min.js');
    _config.otherjs = getDefault(_config.otherjs, []);
    _config.type = getDefault(_config.type, 'v');

    console.log('cf.isExamples', cf.isExamples);
    if (cf.isExamples) {
        _config.baseUrl = '../../js/exs/edslibs/base.js';
        _config.cjsUrl = '../../js/exs/edslibs/createjsFrameWork.js';
        _config.threeUrl = '../../js/exs/libs/three.min.js';
        _config.pixiUrl = '../../js/exs/libs/pixijs.min.js';
    }


    let _base = getDefault(cf.base, '');

    window.SiteModel = new SiteModelByMobile(_base + cf.url, _config);

    window.SiteModel.start();

}


function esiteModelCreate(configUrl, appUrl = 'default') {

    getScript(getAbsoluteUrl(configUrl), function () {

        if (window['SiteConfig'] === undefined) {
            alert('请配置简易单页');
            return;
        }

        if (appUrl === 'default'  ) {

            SiteConfig.url = './js/edslibs/DefaultMain.js';



        }
        else if (appUrl === 'examples') {

            SiteConfig.isExamples = true;
            SiteConfig.url = '../../js/exs/edslibs/DefaultMain.js';

        }
        else {

            SiteConfig.url = appUrl;

        }

        SiteModelStart(SiteConfig);

    });
}


if (window['SiteConfig'] !== undefined) {

    window.SiteModelStart(window['SiteConfig']);

}
else {

    let _screen = document.getElementById('screen');

    if (window['esiteConfig'] !== undefined) {

        esiteModelCreate(window['esiteConfig'], 'default');

    }

    else if (window['exsConfig'] !== undefined) {

        esiteModelCreate(window['exsConfig'], 'examples');

    }
    else if (_screen && _screen.getAttribute('data-config')) {

        let _mode = getDefault(_screen.getAttribute('data-mode'), 'default');
        let _url = _screen.getAttribute('data-config');

        esiteModelCreate(_url, _mode);
    }
    else {
        alert('请在页面上配置你的单页面逻辑代码');
    }

}


let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

/**
 * 快速开发H5库
 * @namespace ds
 */
let eds = root.eds = root.eds || {};



