var root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);


var ds = root.ds = root.ds || {};
/**
 * 一些H5必须的核心处理类
 * @namespace ds.core
 */
ds.core = ds.core || {};