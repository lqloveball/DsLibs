var root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);


var ds = root.ds = root.ds || {};
/**
 * 这是一个项目开发常用的逻辑处理类的宝库
 * @namespace ds.gemo
 */
ds.core = ds.gemo || {};