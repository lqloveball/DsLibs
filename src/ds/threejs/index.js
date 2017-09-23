var root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);


var ds = root.ds || {};
/** @namespace ds.threejs */
ds.core = ds.threejs || {};