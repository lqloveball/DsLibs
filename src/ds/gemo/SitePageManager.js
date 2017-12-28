import EventDispatcher from '../core/EventDispatcher';

/**
 * 网站页面跳转管理模块
 * @class
 * @memberof ds.gemo
 * @requires module:libs/createjs/createjs0.8.2.min.js
 * @requires module:ds/core/EventDispatcher.js
 */
class SitePageManager extends EventDispatcher {


    /**
     *
     */
    constructor() {

        super();

        this._pageDc = {};
        this._pageList = [];
        this._pageLabel = '';
        this._pageModel = null;
        this._oldPageLabel = '';
        this._oldPageModel = null;
        this._history = [];
        this._historyIndex = 0;

    }

    /**
     * 调整页面模块
     * @param {string} value 跳转的页面标识
     * @param {boolean} [history=true] 是否添加进历史记录
     */
    gotoPage(value, history) {

        if (this._pageLabel === value) return;

        var _temp = this._pageDc[value];

        if (!_temp) return;

        this._oldPageLabel = this._pageLabel;

        this._pageLabel = value;
        this._oldPageModel = this._pageModel;

        //是否添加进历史记录
        history = history !== undefined ? history : true;
        //记录页面标识的历史记录
        if (this._oldPageLabel !== '' && history) {

            this._history.push(this._oldPageLabel);
            this._historyIndex = this._history.length - 1;

        }


        this._pageModel = _temp;
        if (this._pageModel) {

            if (this._pageModel.MovieIn) this._pageModel.MovieIn();
            else if (this._pageModel.movieIn) this._pageModel.movieIn();

        }

        /**
         * @event ds.gemo.SitePageManager#update
         * @type {object}
         * @property {string} type='update' 事件类型
         * @property {string} label 当前页面标识
         * @property {string} oldLabel 之前页面标识
         * @property {*} page 当前页面对象
         * @property {*} oldPage 之前页面对象
         */
        this.ds({
            type: 'update',
            label: this.pageLabel,
            page: this.pageModel,
            oldPage: this.oldPageModel,
            oldLabel: this.oldPageLabel,
        });

    }

    /**
     * 上一个历史记录页面
     */
    previousHistory() {

        if (this._history.length <= 0) return;
        var _num = this._historyIndex - 1;
        if (_num <= 0) _num = 0;

        var _label = this._history[_num];
        this.gotoPage(_label,false);

    }

    /**
     * 下一个历史记录页面
     */
    nextHistory() {

        if (this._history.length <= 0) return;
        var _num = this._historyIndex + 1;
        if (_num >= this._history.length) _num = this._history.length - 1;

        var _label = this._history[_num];
        this.gotoPage(_label,false);

    }

    /**
     * 添加页面模块
     * @param {*} page 一个页面对象，最好需要拥有name属性，这个会作为页面的标识名
     */
    add(page) {

        if (this._pageList.indexOf(page) !== -1) return;

        let _name = page.name;

        if (!_name)_name = 'DsPage' + this._pageList.length;
        page.name = _name;

        if (this._pageDc[_name]) {
            console.warn('Already have page.name ：', page.name);
            return;
        }

        this._pageDc[page.name] = page;
        this._pageList.push(page);

    }

    /**
     * 页面索引字典
     * @return {object}
     */
    get pageDc() {

        return this._pageDc;

    }

    /**
     * 页面列表
     * @return {Array}
     */
    get pageList() {

        return this._pageList;

    }

    /**
     * 当前页面标识
     * @return {string}
     */
    get pageLabel() {

        return this._pageLabel;

    }

    /**
     * 当前页面模块
     * @return {*}
     */
    get pageModel() {

        return this._pageModel;

    }

    /**
     * 旧的页面标识
     * @return {string}
     */
    get oldPageLabel() {

        return this._oldPageLabel;

    }

    /**
     * 旧的页面模块
     * @return {null}
     */
    get oldPageModel() {

        return this._oldPageModel;

    }

    /**
     * 历史记录
     * @return {Array}
     */
    get history() {

        return this._history;

    }

}

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);
let ds = root.ds = root.ds || {};
ds.gemo = ds.gemo || {};
ds.gemo.SitePageManager = SitePageManager;

export default SitePageManager;