var root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);


var ds = root.ds = root.ds || {};
/**
 * 与网络相关的处理类
 * @namespace ds.net
 */
ds.core = ds.net || {};