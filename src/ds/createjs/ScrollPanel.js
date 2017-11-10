import EventDispatcher from '../core/EventDispatcher';
import AlloyTouch from 'libs/alloyTeam/alloy_touch.js';

/**
 * 实现一个createjs内一个滚动面板
 * @class
 * @memberof ds.createjs
 * @requires module:libs/createjs/createjs0.8.2.min.js
 * @requires module:ds/core/EventDispatcher.js
 * @requires module:libs/alloyTeam/AlloyTouch.js
 */
class ScrollPanel extends EventDispatcher {


    /**
     * 构造函数
     * @param {createjs.Container} display
     * @param {number} contentHeight 设置内容高度
     * @param {number} width  容器宽 自动创建反馈触摸的dom时候需要
     * @param {number} height 容器高 计算容器
     * @param {object} opts  设置配置
     * @param {boolean} opts.autoDom=true 是否自动创建反馈触摸的dom，如果自动创建dom会覆盖在canvas元素上，内容无法点击
     * @param {number} opts.maxSpeed=5 触摸反馈的最大速度限制
     */
    constructor(display, contentHeight, width, height, opts) {
        super();
        opts = opts || {};

        var _self=this;

        this._width = width;
        this._height = height;


        let _panel = display;
        this._panel = _panel;

        this._contentHeight=contentHeight;
        this._scroll = -(this._contentHeight - this._height);

        let _target;
        if (_panel.content) _target = _panel.content;
        else if (_panel.box) _target = _panel.box;
        else {

            console.warn('ScrollPanel no Has Child Name: "content" "box" ');
            return;

        }

        this._target = _target;


        let _autoDom = opts.autoDom != undefined ? opts.autoDom : true;
        this._autoDom=_autoDom;
        /**
         * 是否自动创建反馈触摸的dom
         * @type {boolean}
         * @private
         */
        this._isAutoDom=false;

        //反馈触摸的dom
        let _touchDom;
        if (opts.dom !== undefined) {

            _touchDom = $(opts.dom)[0];

        }
        else if (_autoDom && width && height) {

            this._isAutoDom=true;
            _touchDom = document.createElement("div");
            $(_touchDom).css({width: width, height: height});
            ds.createjs.addDOM(display, _touchDom);
        }
        else {

            _touchDom = $('#cjsBox')[0];

        }

        this._touchDom = _touchDom;

        this._alloyTouch = new AlloyTouch({
            //反馈触摸的dom
            touch: _touchDom,
            //不必需，默认是true代表监听竖直方向touch
            vertical: true,
            target: _target, //运动的对象
            property: "y",  //被运动的属性
            min: this._scroll, //不必需,运动属性的最小值
            max: 0, //不必需,滚动属性的最大值
            sensitivity: 1,//不必需,触摸区域的灵敏度，默认值为1，可以为负数
            factor: 1,//不必需,表示触摸位移与被运动属性映射关系，默认值是1
            step: 45,//用于校正到step的整数倍
            bindSelf: false,
            //不必需，触摸反馈的最大速度限制
            maxSpeed: opts.maxSpeed||5,
            initialValue: 0,
            //
            change: function (value) {
                if(!_self._target.stage)return;
            },
            touchStart: function (evt, value) {
                if(!_self._target.stage)return;
            },
            touchMove: function (evt, value) {
                if(!_self._target.stage)return;
            },
            touchEnd: function (evt, value) {
                if(!_self._target.stage)return;
            },
            tap: function (evt, value) {
                if(!_self._target.stage)return;
            },
            pressMove: function (evt, value) {
                if(!_self._target.stage)return;
            },
            //运动结束
            animationEnd: function (value) {
                if(!_self._target.stage)return;
            }
        })

    }

    /**
     * 设置滚动容器的宽高
     * @param width
     * @param height
     */
    resizeBox(width,height){

        this._width = width;
        this._height = height;
        this._scroll = -(this._contentHeight - this._height);
        this._alloyTouch.min=this._scroll;

        if(this._isAutoDom)$(this._touchDom).css({width: width, height: height});

    }

    /**
     * 容器宽
     * @return {*}
     */
    get height(){
        return this._height;
    }

    /**
     * 容器高
     * @return {*}
     */
    get width(){
        return this._width;
    }


    /**
     * 设置或获取容器内容高度
     * @return {number|*}
     */
    get contentHeight(){
        return this._contentHeight;
    }

    set contentHeight(value){

        this._contentHeight=value;
        this._scroll = -(this._contentHeight - this._height);
        this._alloyTouch.min=this._scroll;

    }

    /**
     * 滚动到指定位置
     * @param value
     * @param time
     */
    to(value, time,){
        time=time||600;
        this._alloyTouch.to(value,time);
    }

    /**
     * 停止滚动
     */
    stop(){
        this._alloyTouch.stop();
    }

}

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
ds.createjs = ds.createjs || {};
ds.createjs.ScrollPanel = ScrollPanel;

export default ScrollPanel;