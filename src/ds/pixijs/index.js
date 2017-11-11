import PixiModel from  'PixiModel'

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};

/**
 * pixijs相关便捷函数，为快速开发pixijs项目存在
 * @namespace ds.pixijs
 */
ds.pixijs = ds.pixijs || {};

ds.pixijs.setButton=function () {

};

ds.pixijs.loadAssets=function () {

};

/**
 * 创建一个pixi模块
 * @param {object} opts 模块初始化参数
 * @see 详细请见： {@link ds.pixijs.PixiModel}
 * @return {ds.pixijs.PixiModel}
 */
ds.pixijs.create=function (opts) {

    return new ds.pixijs.PixiModel(opts);

};


export default ds.pixijs;


