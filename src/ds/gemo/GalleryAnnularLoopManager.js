import EventDispatcher from '../core/EventDispatcher';

/**
 * 环型画廊逻辑管理类。 呈现内容是在中间,所以显示个数必须是奇数;
 * @class
 * @memberof ds.gemo
 * @requires module:ds/core/EventDispatcher.js
 */
class GalleryAnnularLoopManager extends EventDispatcher {

    /**
     * 构建函数
     * @param {array} data  设置显示的内容数据列表，如果以开始无数据可以传null
     * @param {number} showNum 设置显示个数  至少3个 必须是奇数
     */
    constructor(data, showNum) {

        super();

        this._data = [];


        this._selectObj = null;

        this._direction = false;

        //小与3个至少3个，至少3个才能循环。并且是奇数
        let _showNum = showNum;
        if (_showNum <= 3) _showNum = 3;
        if (_showNum % 2 === 0) _showNum += 1;
        this._showNum = _showNum;

        // console.log('_showNum:',_showNum);

        //前后间隔值
        this._spaceNum = _showNum / 2 >> 0;

        //显示的对象index
        this._index = -1;

        // 上一个显示对象index
        this._oldIndex = 0;

        //当前显示元素数据list
        this._currentLists = null;
        //之前显示元素数list
        this._beforeLists = null;

        //初始化
        if (data) this.initData(data);

    }

    /**
     * 初始化数据
     * @param {array} data
     */
    initData(data) {

        this._data = data;
        this._currentIndexs = [];
        this._beforeIndexs = [];
        this._index = -1;
        this.select(0);

    }

    /**
     * 选择图片
     * @param {number|*} value 索引号 或者 呈现数据对象
     */
    select(value) {
        
        let _data=this._data;
        if (!_data) return;

        if (typeof(value) != 'number') {
            
            let _num = _data.indexOf(value);

            if (_num < 0) {
                console.warn('GalleryAnnularLoopManager 没有这个对象:', value);
                return;
            }

            value = _num;
            
        }

        let _index=this._index;
        //选择以后不做变化
        if (_index == value) return;
        if (value <= 0) value = 0;
        if (value >= _data.length) value = _data.length - 1;
        
        //记录旧的编号
        this._oldIndex = _index;
  
        //记录旧显示列表
        this._beforeLists = this._currentLists;
        //当前现在编号
        this._index = value;
        _index=this._index;
        //当前选择对象
        this._selectObj = _data[_index];
        //记录当前显示对象组
        this._currentLists = [];
        this._beforeIndexs = this._currentIndexs;
        this._currentIndexs = [];
        let _obj,_nobj,_pobj,_nnum,_pnum;

        // console.log('this._spaceNum',this._spaceNum);
        //填充前后
        for (let i = 0; i < this._spaceNum + 1; i++) {
            if (i === 0) {
                _obj = _data[_index];
                this._currentLists.push(_obj);
                this._currentIndexs.push(_index);
            } else {
                _nnum = this._getLegalNumber(_index + i);
                _pnum = this._getLegalNumber(_index - i);
              
                _nobj = _data[_nnum];
                _pobj = _data[_pnum];
                
                this._currentIndexs.push(_nnum);
                this._currentIndexs.splice(0, 0, _pnum);

                this._currentLists.push(_nobj);
                this._currentLists.splice(0, 0, _pobj);
            }
        }
        // console.log('beforeIndexs>',this._beforeIndexs);
        // console.log('_currentIndexs>',this._currentIndexs);

        //计算方向
        if (_index === _data.length - 1 && this._oldIndex === 0) {
            this._direction = false;
        } else if (_index === 0 && this._oldIndex == _data.length - 1) {
            this._direction = true;
        } else {
            if (_index > this._oldIndex) this._direction = true;
            else this._direction = false;
        }
        // log('this._beforeLists:',this._beforeLists);
        // log('this._currentLists:',this._currentLists);
        //数据更新事件
        /**
         * 翻页数据更新
         * @event  ds.gemo.GalleryAnnularLoopManager#update
         * @property {array} old - 旧数据数组,之前呈现数据
         * @property {array} now - 新数据数组,当前呈现数据
         * @property {array} oldIndexs - 旧数据索引数组
         * @property {array} nowIndexs - 新数据索引数组
         * @property {number} index - 当前索引
         * @property {*} select - 当前对象
         * @property {boolean} isInit - 是否刚初始化
         * @property {boolean} direction - 切换方向
         */
        this.ds({
            type: 'update', //更新数据
            old: this._beforeLists, //旧数据组
            now: this._currentLists, //新数据组
            oldIndexs: this._beforeIndexs, //旧编号数据组
            nowIndexs: this._currentIndexs, //新编号数据组
            index: _index, //当前选择数字
            select: this._selectObj, //当前选择对象
            isInit: (this._oldIndex == -1) ? true : false, //是否初始化数据
            direction: this._direction, //方向
        });
        //初始化数据时候发送事件
        if (this._oldIndex == -1) {
            /**
             * 初始化翻页内容
             * @event  ds.gemo.GalleryAnnularLoopManager#upTotal
             * @property {array} old - 旧数据数组,之前呈现数据
             * @property {array} now - 新数据数组,当前呈现数据
             * @property {number} index - 当前索引
             * @property {*} select - 当前对象
             * @property {boolean} direction - 切换方向
             */
            this.ds({
                type: 'upTotal',
                old: this._beforeLists,
                now: this._currentLists,
                index: _index,
                select: this._selectObj,
                direction: this._direction,
            });
        }
    }

    /**
     * 之前数据索引列表
     * @return {array}
     */
    get beforeIndexs(){
        return this._beforeLists;
    }

    /**
     * 之前数据索引列表
     * @return {array}
     */
    get currentIndexs(){
        return this._currentIndexs;
    }

    /**
     * 之前数据列表
     * @return {array}
     */
    get beforeLists(){
        return this._beforeLists;
    }
    /**
     * 当前数据列表
     * @return {array}
     */
    get currentLists(){
        return this._currentLists;
    }

    /**
     * 呈现数据对象
     * @return {array}
     */
    get data(){
        return this._data;
    }


    /**
     * 计算环型循环滚动 数字合理性
     * @param {number} value 需要计算的数字
     * @return {number}
     * @private
     */
    _getLegalNumber(value) {
        let _data=this._data;
        let _num;
        if (value >= 0 && value <= _data.length - 1) {
            return value;
        } else if (value < 0) {
            _num = _data.length + value;
            return _num;
        } else {
            _num = value - (_data.length);
            return _num;
        }
    }
    /**
     * 上一个
     */
    previous() {

        if (!this._data) return;
        var _num = this._index - 1;
        if (_num < 0) _num = this._data.length - 1;
        this.select(_num);
    }

    /**
     * 下一个
     */
    next() {

        if (!this._data) return;
        var _num = this._index + 1;
        if (_num >= this._data.length) _num = 0;
        this.select(_num);
    }

    /**
     * 运动方向
     * @return {*}
     */
    get direction() {
        return this.direction;
    }

    /**
     * 当前显示的对象
     * @return {*}
     */
    get selectObj() {
        return this._selectObj;
    }

    /**
     * 当前数据索引
     * @return {number}
     */
    get index(){
        return this._index;
    }

    /**
     * 间隔值
     * @return {number}
     */
    get spaceNum(){
        return this._spaceNum;
    }
}

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
ds.gemo = ds.gemo || {};
ds.gemo.GalleryAnnularLoopManager = GalleryAnnularLoopManager;

export default GalleryAnnularLoopManager;