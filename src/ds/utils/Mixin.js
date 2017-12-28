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
ds.utils.mixin.getDefault=getDefault;

export {getDefault};

export default ds.utils.mixin;