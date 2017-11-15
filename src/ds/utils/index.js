let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
/**
 *  一些操作处理与算法函数包
 *  @namespace ds.utils
 */
ds.createjs = ds.createjs || {};