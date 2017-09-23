//这个类使用老js方法，有可能直接插入html标签内使用
!(function (factory) {

    var root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

    if (typeof define === 'function' && define.amd) {

        define(['exports'], function (exports) {

            module.exports = factory(root, exports);

        });
    } else if (typeof exports !== 'undefined') {

        module.exports = factory(root, exports);

    } else {

        factory(root);

    }

}(function (root, model) {

    /**
     * 手机端屏幕自适应模块
     * @class ds.core.MoblieResizeModel
     * @classdesc:一个适合制作自适应、横屏、竖屏、横竖屏混合互动H5的屏幕尺寸算法模块。
     * @param {object} [opts] - 设置自适应模块初始化参数
     * @param {HTMLElement} [opts.screen='#screen'] - 屏幕自适应进行缩放的 html元素
     * @param {string} [opts.type='v'] - 屏幕自适应方式,默认竖屏幕 'v' 'h' 'auto'
     * @param {array} [opts.widths=[640,1138]] - 屏幕设定固定宽自适应计算设置，默认值 [640,1138]。 自适应框架是以屏幕设定固定宽进行等比换算高
     * @extends ds.core.EventDispatcher
     */
    function MoblieResizeModel(opts) {

        opts = opts || {};

        var _self = this;

        ds.EventDispatcher.extend(this);

    }


    var ds = root.ds || {};
    ds.core = ds.core || {};
    ds.core.MoblieResizeModel = MoblieResizeModel;

    return ds.core.MoblieResizeModel;
}));