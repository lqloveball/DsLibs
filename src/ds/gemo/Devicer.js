//这个类使用老js方法，有可能直接插入html标签内使用
!(function (factory) {

    var root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);


    if (typeof define === 'function' && define.amd) {

        define(['exports'], function (exports) {

            module.exports = factory(root, exports);

        });
    } else if (typeof exports !== 'undefined') {

        module.exports = factory(root, exports);

    } else {

        factory(root, {});

    }

}(function (root, Devicer) {

    var ds = root.ds = root.ds || {};
    ds.gemo = ds.gemo || {};
    /**
     * 设备判断模块
     * @module ds/gemo/Devicer
     *
     */
    Devicer;

    /**
     * 设备判断对象
     * @member ds.gemo.Devicer
     * @type module:ds/gemo/Devicer
     */
    ds.gemo.Devicer = Devicer;

    var u = navigator.userAgent;
    //微信
    var _isWeixin = false;
    var ua = u.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") _isWeixin = true;

    //判断ios 还是 android
    var _isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var _isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    //其他移动终端

    //判断是否ipad
    var _isIpad = u.match(/ipad/i) == "ipad";
    var _isMidp = u.match(/midp/i) == "midp";
    var _isUc7 = u.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var _isUc = u.match(/ucweb/i) == "ucweb";
    var _isCE = u.match(/windows ce/i) == "windows ce";
    var _isWM = u.match(/windows mobile/i) == "windows mobile";

    //判断是否移动终端还是pc
    var _isMobile = true;
    if (_isAndroid || _isIOS || _isIpad || _isMidp || _isUc7 || _isUc || _isCE || _isWM) _isMobile = true;
    else _isMobile = false;

    /**
     * 是否微信
     * @alias module:ds/gemo/Devicer~isWeixin
     */
    Devicer.isWeixin = _isWeixin;

    /**
     * 是否安卓系统
     * @alias module:ds/gemo/Devicer~isAndroid
     */
    Devicer.isAndroid = _isAndroid;

    /**
     * 是否IOS系统
     * @alias module:ds/gemo/Devicer~isIOS
     */
    Devicer.isIOS = _isIOS;
    /**
     * 是否IPAD
     * @alias module:ds/gemo/Devicer~isIpad
     */
    Devicer.isIpad = _isIpad;
    /**
     * 是否miPAD
     * @alias module:ds/gemo/Devicer~isMidp
     */
    Devicer.isMidp = _isMidp;
    /**
     * 是否UC7浏览器
     * @alias module:ds/gemo/Devicer~isUc7
     */
    Devicer.isUc7 = _isUc7;
    /**
     * 是否Uc浏览器
     * @alias module:ds/gemo/Devicer~isUc
     */
    Devicer.isUc = _isUc;
    /**
     * 是否CE系统
     * @alias module:ds/gemo/Devicer~isCE
     */
    Devicer.isCE = _isCE;
    /**
     * 是否window手机系统
     * @alias module:ds/gemo/Devicer~isWM
     */
    Devicer.isWM = _isWM;
    /**
     * 是否手机端
     * @alias module:ds/gemo/Devicer~isMobile
     */
    Devicer.isMobile = _isMobile;
    /**
     * 是否PC端
     * @alias module:ds/gemo/Devicer~isPc
     */
    Devicer.isPc = !_isMobile;




    return ds.gemo.Devicer;
}));