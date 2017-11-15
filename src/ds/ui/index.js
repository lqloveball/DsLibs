var root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);


var ds = root.ds = root.ds || {};
/**
 * html dom元素 相关处理类
 * @namespace ds.ui
 */
ds.core = ds.ui || {};