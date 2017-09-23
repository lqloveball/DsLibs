var root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);


var ds = root.ds || {};
/** @namespace ds.utils */
ds.core = ds.utils || {};