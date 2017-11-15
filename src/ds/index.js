var root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

/**
 * 快速开发H5库
 * @namespace ds
 */
var ds = root.ds = root.ds || {};