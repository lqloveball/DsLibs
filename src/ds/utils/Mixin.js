let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};

ds.utils = ds.utils || {};

/**
 * 嵌套，常用操作
 * @module module:ds/utils/mixin
 */
ds.utils.mixin = ds.utils.mixin || {};


function getDefault(obj, defaultValue) {
    if (obj === undefined || obj === null) return defaultValue;
    if (obj === 'true') return true;
    else if (obj === 'false') return false;
    return obj;
}

/**
 * 返回默认值方法
 * @memberof module:ds/utils/mixin
 * @param  {*} obj  一个对象
 * @param  {*} defaultValue 转换后默认值
 * @return {*}
 */
ds.utils.mixin.getDefault = getDefault;

let _getAbsoluteATag = document.createElement('a');

function getAbsoluteUrl(url) {

    if (url.indexOf("http:") >= 0 || url.indexOf("https:") >= 0) return url;
    _getAbsoluteATag.href = url;
    url = _getAbsoluteATag.href;
    return url;

}

/**
 * 返回绝对地址
 * @memberof module:ds/utils/mixin
 * @param  {*} url  一个连接
 * @return {*}
 */
ds.utils.mixin.getAbsoluteUrl = getAbsoluteUrl;


function getLayout(w, h, tw, th, type = 'inSide') {
    let _s = 1;
    let _sw = w / tw, _sh = h / th;
    if (type === 'inSide') _s = Math.min(_sw, _sh);
    else _s = Math.max(_sw, _sh);


    let _w = tw * _s;
    let _h = th * _s;

    let _layoutDate = {
        scale: _s,
        x: (w - _w) / 2,
        y: (h - _h) / 2,
    };
    return _layoutDate;
}

/**
 * 获取layout布局
 * @memberof module:ds/utils/mixin
 * @param w
 * @param h
 * @param tw
 * @param th
 * @param type='inSide' 默认缩放在宽内，其他就撑满 'outSide'
 */
ds.utils.mixin.getLayout = getLayout;


function getHTMLElement(dom) {
    if(typeof (dom)==='string')dom=$(dom);
    if (dom instanceof HTMLElement) return dom;
    else if (!(dom instanceof HTMLElement) && (dom[0] instanceof HTMLElement)) return dom[0];
    else return null;
}

/**
 * $对象转换成HTMLElement对象
 * @memberof module:ds/utils/mixin
 * @param  {$ | HTMLElement | String} dom 一个dom对象
 * @return {HTMLElement}     dom对象
 */
ds.utils.mixin.getHTMLElement = getHTMLElement;


export {
    getDefault,
    getAbsoluteUrl,
    getHTMLElement,
    getLayout
};

export default ds.utils.mixin;