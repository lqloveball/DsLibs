let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
ds.createjs = ds.createjs || {};
/**
 * 关于createjs的ui相关
 * @namespace ds.createjs.ui
 */
ds.createjs.ui = ds.createjs.ui || {};