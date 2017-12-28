let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
ds.createjs = ds.createjs || {};
/**
 * 关于createjs的特效
 * @namespace ds.createjs.effect
 */
ds.createjs.effect = ds.createjs.effect || {};