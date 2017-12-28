import PanelBase from '../base/PanelBase';
import {getDefault} from 'ds/utils/Mixin';

/**
 * 浮动层模块
 */
class PanelModel extends PanelBase {

    constructor(opts) {
        super(opts);
        let _self = this;
        //字符串的配置
        if (typeof opts === 'string') {
            let _temp = opts;
            opts = {};
            if (_temp.indexOf('.') > 0) {
                let _arr = _temp.split('.');
                opts.name = _arr[1];
                opts.cs = _temp;
                opts.touchSwipe = getDefault(opts.touchSwipe, true);
            }
            else if (_temp.indexOf('#') === 0) {
                opts.name = _temp;
                opts.cs = 'html';
                opts.touchSwipe = getDefault(opts.touchSwipe, true);
            }
            else {
                console.error('页面配置错误：' + _temp);
                return;
            }
        }

        //对象配置 判断是否html页面
        if (opts.name.indexOf('#') === 0) {
            let _temp = opts.name;
            opts.name = _temp.slice(1).split(' ')[0];
            opts.$dom = _temp;
            opts.cs = 'html';
        }

        this._name = opts.name;
        this._cs = opts.cs;

        //页面类型 html createjs videoPage
        this._type = 'html';
        this._screenType = getDefault(opts.screenType, 'v');

        this._isCreatejsView = false;
        this._view = null;
        this._domInHtml = false;
        this._config = opts;

        if (opts.cs === 'html') {
            this._isCreatejsView = false;
            this._name = opts.name;
            this._cs = opts.cs;
            let _temp;
            if (opts.$dom) _temp = $(opts.$dom);
            else _temp = $('#' + this._name);
            //判断是否非原dom结构内拥有
            if (_temp.length <= 0) {
                _temp = $(document.createElement("div"));
                _temp[0].id = this._name;
                let _css = {position: 'absolute', left: 0, top: 0,};
                if (opts.css) _css = opts.css;
                _temp.css(_css);
            } else {
                this._domInHtml = true;
            }
            this._view = _temp;
            this._type = 'html';
        }
        else {
            this._type = 'createjs';
            if (this._name.indexOf('.') !== -1) {
                let _temp = this._name;
                let _arr = _temp.split('.');
                this._name = _arr[1];
                if (!this._cs) this._cs = _temp;
            }
            let _ns = this._cs.split('.')[0];
            let _class = this._cs.split('.')[1];
            try {

                this.view = new window[_ns][_class]();

            } catch (e) {

                console.error('你的页面设置配置有误：' + _ns + '.' + _class);
                return;

            }
        }

    }
}