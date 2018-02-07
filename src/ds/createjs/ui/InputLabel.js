import EventDispatcher from '../../core/EventDispatcher';
import InputText from '../InputText';

/**
 * 输入框封装
 * @class
 * @memberof ds.createjs.ui
 */
class InputLabel extends EventDispatcher {

    constructor(skin, type = 'text', opts) {
        super();
        opts = opts || {};
        opts.type = type;
        this._skin = skin;
        this._tip = skin.tip;
        this.input = new InputText(this._skin, opts);
        this._el = this.input.el;

        if (this._skin instanceof createjs.MovieClip) this._skin.gotoAndStop(0);

        /**
         * 是否移入焦点
         * @type {boolean}
         */
        this.isFocus = false;

        this._el.on('blur', () => {
            this.isFocus = false;
            this.upShow();


        });

        this._el.on('focus', () => {
            this.isFocus = true;
            this.upShow();
        });

    }

    /**
     * 更新显示状态
     */
    upShow() {
        if (this.isFocus) {
            if (this._tip) {
                this._tip.visible = false;
            }
            if (this._skin instanceof createjs.MovieClip) this._skin.gotoAndStop(1);
        } else {
            if (this._tip) {
                if (!this.isInput) {
                    this._tip.visible = true;
                } else {
                    this._tip.visible = false;
                }
            }
            if (this._skin instanceof createjs.MovieClip) this._skin.gotoAndStop(0);
        }
    }

    get isInput() {
        return this.input.isInput;
    }

    /**
     * 文本输入框的值
     * @readonly
     */
    get value() {
        return this.input.value;
    }

    set value(value) {
        this.input.value = value;
        this.upShow();
    }

    get el() {
        return this.input.el;
    }

    get skin() {
        return this._skin;
    }

    reset() {
        this.value = '';
    }

    /**
     * 是否可见
     * @return {boolean}
     */
    get visible() {
        return this._skin.visible;
    }

    set visible(value) {
        this._skin.visible = value;
    }

}


let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds ? root.ds : {};
ds.createjs = ds.createjs ? ds.createjs : {};
ds.createjs.ui = ds.createjs.ui ? ds.createjs.ui : {};
ds.createjs.ui.InputLabel = InputLabel;

export default InputLabel;