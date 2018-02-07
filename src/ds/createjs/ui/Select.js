import EventDispatcher from '../../core/EventDispatcher';
import {getDefault, getHTMLElement} from '../../utils/Mixin';

/**
 * 选择框封装
 */
class Select extends EventDispatcher {

    constructor(skin, opts) {
        super();
        opts = opts || {};
        this._skin = skin;
        this._tip = skin.tip;
        this._label = skin.label;

        this.showKey = getDefault(opts.showKey, 'label');

        let _lineHeight = 25;
        if (opts.lineHeight) _lineHeight = opts.lineHeight;
        else if (opts.size) _lineHeight = opts.size;

        this._el = $(document.createElement('Select'));
        this._domElement = ds.createjs.addDOM(skin, this._el);

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
            width: getDefault(opts.width, 100),
            color: getDefault(opts.color, '#000'),
            resize: 'none',
            'font-size': getDefault(opts.size, 25),
            'line-height': _lineHeight + 'px',
        });

        //是否隐藏原dom的显示
        if (opts.hideLabel) {
            this._el.css({
                color: 'rgba(0,0,0,0)'
            })
        }

        /**
         * 是否拥有空选项
         */
        this.hasEmpty = getDefault(opts.hasEmpty, false);
        /**
         * 默认空选项
         * @type {null}
         */
        this.defaultEmpty=null;

        this._el[0].options.length = 0;
        this._list = getDefault(opts.list, []);
        let _list = this._list;
        // console.log('dddd',this.hasEmpty,(typeof(this.hasEmpty) === 'string'));
        if (this.hasEmpty!==false) {
            let _temp;
            if (typeof(this.hasEmpty) === 'object') {
                _temp = this.hasEmpty;
            }
            else if (typeof(this.hasEmpty) === 'string') {
                _temp = {
                    'label': this.hasEmpty,
                    'value': this.hasEmpty,
                }
            }
            else {
                _temp = {
                    'label': '',
                    'value': '',
                }
            }
            let _option = new Option(_temp.label, _temp.value);
            _option.data = _temp;
            this._el[0].options.add(_option);

            this.defaultEmpty=_temp;
        }

        for (let i = 0; i < _list.length; i++) {
            let _temp = _list[i];
            if (typeof(_temp) === 'string') {
                _temp = {
                    'label': _temp,
                    'value': _temp,
                }
            }

            let _option = new Option(_temp.label, _temp.value);
            _option.data = _temp;
            this._el[0].options.add(_option);

        }

        this._el[0].addEventListener('change', () => {
            this._change();
        });

        this.upSelectLabel(this.showKey);

    }

    _change() {
        this.upSelectLabel(this.showKey);
    }

    upSelectLabel(key = 'label') {
        if (!this._el[0].options || this._el[0].options.length <= 0) return;
        let _index = this._el[0].selectedIndex;
        let _option = this._el[0].options[_index];
        let _data = _option.data;
        let _label;
        if (_data && _data[key]) {
            _label = _data[key];
        } else {
            _label = _option.text;
        }
        if (this._label) {
            this._label.text = _label;
            //判断是否默认空选项目，需要进行tip显示判断
            if(this.defaultEmpty){
                if(this.defaultEmpty===_data){
                    if(this._tip){
                        this._tip.visible=true;
                        this._label.text = '';
                    }
                }else{
                    if(this._tip)this._tip.visible=false;
                }
            }else{

            }
        }
    }

    /**
     * 是否选择是默认空选项目
     * @return {boolean}
     */
    get isSelectEmpty(){
        if(this.defaultEmpty===null)return false;
        let _selectData=this.selectData;
        return (this.defaultEmpty===_selectData);

    }

    /**
     * 是否选择
     */
    get isSelect(){
        if(this.isSelectEmpty)return false;
        if(!this.option)return false;
        else return true;
    }

    /**
     * 选择项
     */
    get option() {
        let _options = this._el[0].options;
        let _index = this._el[0].selectedIndex;
        let _option = _options[_index];
        return _option;
    }

    /**
     * 选择数据
     * @return {null}
     */
    get selectData() {
        let _option = this.option;
        if (!_option) return null;
        return _option.data;
    }

    /**
     * 重置
     */
    reset(){
        this.setSelectByIndex(0);
    }

    /**
     * 根据索引设置选择
     * @param value
     */
    setSelectByIndex(value){
        let _options = this._el[0].options;
        let _index = value;
        let _option = _options[_index];
        if (_option) _option.selected = true;
        this.upSelectLabel(this.showKey);
    }
    /**
     * 根据值来设置选项
     * @param value 值
     * @param key 值的key
     */
    setSelectOptionByKey(value, key) {
        let _options = this._el[0].options;
        let _index = this._el[0].selectedIndex;
        let _option;
        for (let i = 0; i < _options.length; i++) {
            _option = _options[i];
            let _data = _option.data;
            if (key && typeof(_data) === 'object' && _data[key]) {
                // console.log('------1');
                if (_data[key] === value) _index = i;
            }
            else if (_data) {
                // console.log('------2',_data,typeof(_data),value);
                if (_data === value) _index = i;
            } else {

                if (typeof(value) === 'number') {
                    // console.log('------3',_option.value,value,value===Number(_option.value));
                    if (value === Number(_option.value)) _index = i;
                } else {
                    // console.log('------4',_option.value,value,value===_option.value);
                    if (value === _option.value) _index = i;
                }

            }
        }
        _option = _options[_index];
        if (_option) _option.selected = true;
        this.upSelectLabel(this.showKey);
    }

    /**
     * 添加选择项目
     * @param {string|Object} data
     * @param {string} data.label
     * @param {*} data.value
     */
    add(data) {
        if (typeof(data) === 'string') {
            data = {
                'label': data,
                'value': data,
            }
        }
        let _option = new Option(data.label, data.value);
        _option.data = data;
        this._el[0].options.add(_option);
    }

    /**
     * 删除一个选项
     * @param value
     */
    remove(value) {
        this._el[0].options.remove(value);
    }

    /**
     * 获取选择项
     */
    get options() {
        return this._el[0].options;
    }

    get el() {
        return this._el;
    }

    get skin() {
        return this._skin;
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
ds.createjs.ui.Select = Select;

export default Select;