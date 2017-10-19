/**
 * 一个快速实现createjs内输入框对象
 * @class
 * @memberof ds.createjs
 * @requires module:libs/createjs/createjs0.8.2.min.js
 * @requires module:libs/base/zepto.min.js
 */
class InputText {

    /**
     * createjs输入框
     * @param {createjs.DisplayObject} display 输入框对应到的显示对象
     * @param {object} opts 配置参数
     * @param {string} [opts.type='text'] 输入框类型 类型分别有 text、tel、 number、password、 textarea（使用的是textarea标签）
     * @param {number} opts.max 输入最大字符数
     * @param {number} [opts.rows=3] 最大行数，如果是textarea类可以设置这个值
     * @param {number} [opts.width=100] 文本框宽度
     * @param {string} [opts.color='#000'] 文本宽字体颜色
     * @param {number} [opts.size=25] 字体大小
     * @param {number} [opts.lineHeight=25] 字体行高
     * @param {string|HTMLElement} [opts.domBox=undefined] 需要添加到dom的容器，默认不设置 添加到$('#cjsBox')内
     * @param {string} defaultText 默认输入文本，可以不设置
     */
    constructor(display, opts, defaultText) {

        opts = opts || {};

        this.display = display;

        this._el = null;

        if (opts.type == 'tel') this._el = $('<input type="tel" value="" />');
        else if (opts.type == 'number') this._el = $('<input  type="number" value="" />');
        else if (opts.type == 'textarea') this._el = $('<textarea name="" type="text" value="" rows ="3"/>');
        else if (opts.type) this._el = $('<input  type="' + opts.type + '" value="" />');
        else this._el = $('<input  type="text" value="" />');

        if (opts.type == 'textarea'&&opts.rows)this._el[0].rows=opts.rows;

        if (opts.max !== undefined) this._el.attr({maxlength:opts.max+''});

        if (opts.type == 'tel' && opts.max === undefined){

            opts.max=11;
            this._el.attr({maxlength:opts.max+''});

        }

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
            width: opts.width || 100,
            color: opts.color || '#000',
            resize: 'none',
            'font-size': opts.size || 25,
            'line-height': _lineHeight + 'px',
        });

        this._domElement = new createjs.DOMElement(this._el[0]);


        if (opts.domBox) this._domBox = $(opts.domBox);
        else this._domBox = $('#cjsBox');

        this._defaultText = defaultText || '';

        this._el[0].value = this._defaultText;

        let _el = this._el;
        let _defaultText = this._defaultText;

        if(opts.type=='password'){

            if (_el[0].value ==  _defaultText )_el[0].type='text';
            else  _el[0].type='password';


        }

        this._el.on('input', function (e) {

            // console.log(opts.max,_el[0].value.length);
            if (opts.max !== undefined && (_el[0].value.length > opts.max)) {

                _el[0].value = _el[0].value.slice(0, opts.max);

            }

        });

        this._el.on('blur', function (e) {

            if (_el[0].value === '' && _defaultText !== ''){

                _el[0].value = _defaultText;
                if(opts.type=='password')_el[0].type='text';

            } else{

                if(opts.type=='password')_el[0].type='password';
            }

        });

        this._el.on('focus', function (e) {

            if (_el[0].value == _defaultText && _defaultText !== '') _el[0].value = '';
            if(opts.type=='password')_el[0].type='password';

        });

        //进行设置点击非本输入框 移除焦点
        $('body').on('touchstart', function (e) {

            if (_el[0] !== e.target) {_el[0].blur();}

        });

        //添加到dom列表内
        this._domBox.append(_el);
        //捆绑显示容器与输入框对象
        this.display.addChild(this._domElement);

        InputText.inputTextList.push(this);

    }

    /**
     * 判断是否输入
     * @return {boolean}
     */
    isInput() {

        if (this._el[0].value === this._defaultText) return false;
        if (this._el[0].value === '') return false;
        if (this._el[0].value.length <= 0) return false;
        return true;

    }

    /**
     * 文本输入框的值
     * @readonly
     */
    get value(){
        return this._el[0].value;
    }


    /**
     * 输入的框对象 （zepto或者jquery对象）
     * @return {InputElement}
     * @readonly
     */
    get el() {
        return this._el;
    }

    /**
     * createjs封装的Dom对象
     * @return {createjs.DOMElement}
     * @readonly
     */
    get domElement() {
        return this._domElement;
    }

    /**
     * 判断是否要在场景上
     */
    upInStage (){

        // console.log(this,this.display,this.display.stage);
        // if(this._domElement)
        if(this.display&&this.display.stage){
            this._el.show();
        }else{
            this._el.hide();
        }

    }

    /**
     * 摧毁删除这个文本框
     */
    destroy () {

        this._el.remove();
        this._el=null;

        for (var i = 0; i < InputText.inputTextList.length; i++) {

            if (InputText.inputTextList[i] == this) InputText.inputTextList.splice(i, 1);

        }

    }

}

/**
 * 是否支持实时刷新监听 输入框dom元素是否不在场景上.
 * 这个是不断实时在刷新，会消耗一定的性能，如果自己能更好控制这个显示流程，建议设置成false
 * @type {boolean}
 */
InputText.upDateBool=true;

InputText.inputTextList = [];

createjs.Ticker.addEventListener("tick", function () {


    if(!InputText.upDateBool)return;


    for (var i = 0; i < InputText.inputTextList.length; i++) {

        var _input=InputText.inputTextList[i];
        if (_input) _input.upInStage();

    }

});

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);
let ds = root.ds = root.ds || {};
ds.createjs = ds.createjs || {};
ds.createjs.InputText = InputText;

export default InputText;