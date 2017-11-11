var root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);


var ds = root.ds = root.ds || {};
/**
 * 多媒体相关处理的类
 * @namespace ds.media
 */
ds.core = ds.media || {};