/**
 * @class 设备判断
 * @classdesc:类说明:
 * @extends
 * @example: 举例
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
(function(factory) {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);

    if (typeof define === 'function' && define.amd) {
        define(['exports'], function(exports) {
            module.exports = factory(root, exports);
        });
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(root, exports);
    } else {
        factory(root, {});
    }

}(function(root, modelObj) {
    root.Ds = root.Ds || {};
    root.Ds.gemo = root.Ds.gemo || {};

    var Devicer = {};
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
    if (_isAndroid || _isIOS || _isIpad || _isMidp || _isUc7 || _isUc || _isCE || _isWM) {
        _isMobile = true;
    } else {
        _isMobile = false;
    }
    //是否微信
    Devicer.IsWeixin = _isWeixin;
    //是否安卓
    Devicer.IsAndroid = _isAndroid;
    //是否IOS
    Devicer.IsIOS = _isIOS;
    Devicer.IsIpad = _isIpad;
    Devicer.IsMidp = _isMidp;
    Devicer.IsUc7 = _isUc7;
    Devicer.IsUc = _isUc;
    Devicer.IsCE = _isCE;
    Devicer.IsWM = _isWM;
    //是否手机
    Devicer.IsMobile = _isMobile;
    //是否PC
    Devicer.IsPc = !_isMobile;

    root.Ds.gemo.Devicer = Devicer;
    return root.Ds.gemo.Devicer;
}));
