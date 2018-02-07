import EventDispatcher from '../../core/EventDispatcher';
import {getDefault, getHTMLElement} from '../../utils/Mixin';

class DateLabel extends EventDispatcher {

    constructor(skin, opts) {
        super();
        opts = opts || {};
        this._skin = skin;
        this._tip = skin.tip;
        this._label = skin.label;

        this._el = $('<input type="date" value=""/>');
        this._domElement = ds.createjs.addDOM(skin, this._el);

        let _lineHeight = 25;
        if (opts.lineHeight) _lineHeight = opts.lineHeight;
        else if (opts.size) _lineHeight = opts.size;

        this._el.css({
            position: 'absolute',
            top: 0,
            left: 0,
            'border-style': ' none',
            'outline': 'none',
            '-webkit-outline': 'none',
            'transform': 'translate(-1000px,-1000px)',
            '-webkit-transform': 'translate(-1000px,-1000px)',
            'background-color': 'transparent',
            width: getDefault(opts.width, 200),
            height: _lineHeight,
            color: getDefault(opts.color, '#000'),
            resize: 'none',
            'font-size': getDefault(opts.size, 25),
            'line-height': _lineHeight + 'px',

        });

        this._el[0].addEventListener('change', () => {
            this._change();
        });

        //是否隐藏原dom的显示
        if (opts.hideLabel) {
            this._el.css({
                color: 'rgba(0,0,0,0)'
            })
        }


    }

    _change() {

        let _value = this._el[0].value;
        if (_value === '') {
            if (this._tip) this._tip.visible = true
        } else {
            if (this._tip) this._tip.visible = false
        }
        if (this._label) {
            this._label.text = _value;
        }
    }

    reset() {
        this._el[0].value = '';
        this._change();
    }

    /**
     * 是否输入
     * @return {boolean}
     */
    get isInput() {
        let _value = this._el[0].value;
        if (_value === '' || !_value) return false;
        return true;
    }

    /**
     * 值
     */
    get value() {
        return this._el[0].value;
    }

    /**
     * 值
     */
    set value(value) {
        this._el[0].value = value;
        this._change();
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

    get el() {
        return this._el;
    }

    /**
     * 皮肤
     * @return {*}
     */
    get skin() {
        return this._skin;
    }
}

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds ? root.ds : {};
ds.createjs = ds.createjs ? ds.createjs : {};
ds.createjs.ui = ds.createjs.ui ? ds.createjs.ui : {};
ds.createjs.ui.DateLabel = DateLabel;

export default DateLabel;