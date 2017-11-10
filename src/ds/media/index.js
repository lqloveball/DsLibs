var root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);


var ds = root.ds = root.ds || {};
/**
 * 多媒体：声音、视频等
 * @namespace ds.media
 */
ds.core = ds.media || {};