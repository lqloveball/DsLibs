let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
/**
 * 一些特殊效果类的实现
 * @namespace ds.effect
 */
ds.effect = ds.effect || {};