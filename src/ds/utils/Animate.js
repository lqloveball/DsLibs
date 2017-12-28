let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};

ds.utils = ds.utils || {};


/**
 * @member ds.utils.Animate
 * @type {module:ds/utils/Animate}
 */
const Animate = {};

/**
 * Animate 简易常用动画实现
 * @module module:ds/utils/Animate
 */
ds.utils.Animate = Animate;
/**
 * 通过淡入的方式显示匹配元素。
 * @memberof module:ds/utils/Animate
 * @param  {string|HTMLElement} dom 一个dom元素
 * @param  {number} duration=0.8 秒数
 * @param  {function} complete   显示结束后
 */
ds.utils.Animate.fadeIn = function (dom, duration, complete) {
    let _dom = $(dom);
    _dom = _dom[0];
    if (!_dom) return;
    JT.set(_dom, {opacity: 0});
    $(_dom).show();
    let _time = duration !== undefined ? duration : 0.8;
    JT.to(_dom, _time, {
        opacity: 1, onEnd: function () {
            if (complete) complete(_dom);
        }
    });
};
/**
 * 通过淡入的方式显示匹配元素。
 * @method  ds.fadeIn
 * @see ds.fadeIn 实际等同于 {@link module:ds/utils/Animate}
 */
ds.fadeIn = ds.utils.Animate.fadeIn;

/**
 * 通过淡入的方式显示匹配元素。
 * @memberof module:ds/utils/Animate
 * @param  {string|HTMLElement} dom 一个dom元素
 * @param  {number} duration=0.8 秒数
 * @param  {function} complete   显示结束后
 */
ds.utils.Animate.fadeOut = function (dom, duration, complete) {
    let _dom = $(dom);
    _dom = _dom[0];
    if (!_dom) return;
    JT.set(_dom, {opacity: 1});
    $(_dom).show();
    let _time = duration !== undefined ? duration : 0.8;
    JT.to(_dom, _time, {
        opacity: 0, onEnd: function () {
            $(_dom).hide();
            if (complete) complete(_dom);
        }
    });
};

/**
 * 通过淡出的方式隐藏匹配元素。
 * @method  ds.fadeOut
 * @see ds.fadeIn 实际等同于 {@link module:ds/utils/Animate}
 */
ds.fadeOut = ds.utils.Animate.fadeOut;


export default ds.utils.Animate;