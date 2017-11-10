import ThreeJsModel from './ThreeJsModel';

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);


let ds = root.ds = root.ds || {};
/** @namespace ds.threejs */
ds.threejs = ds.threejs || {};

/**
 * 创建一个threejs模块
 * @param {object} opts 创建一个threejs模块配置参数
 */
ds.threejs.create = function (opts) {

    let _threejsModel = new ThreeJsModel(opts);

    return _threejsModel;

};

/**
 * 是否支持canvas
 * @type {boolean}
 */
ds.threejs.canvas = !!window.CanvasRenderingContext2D;

/**
 * 是否支持webgl
 * @type {boolean}
 */
ds.threejs.webgl = (function () {

    try {

        let canvas = document.createElement('canvas');
        return !!( window.WebGLRenderingContext && ( canvas.getContext('webgl') || canvas.getContext('experimental-webgl') ) );

    } catch (e) {

        return false;

    }

})();

/**
 * 是否支持多线程
 * @type {boolean}
 */
ds.threejs.workers = !!window.Worker;

/**
 * 是否支持文件读取api
 * @type {boolean}
 */
ds.threejs.fileapi = window.File && window.FileReader && window.FileList && window.Blob;

export default ds.threejs;

