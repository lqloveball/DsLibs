import EventDispatcher from '../core/EventDispatcher';

/**
 * 动态字体类处理类
 * 动态字体资源输出工具[https://github.com/lqloveball/DynamicFontTools](https://github.com/lqloveball/DynamicFontTools)
 * 进行字体的资源生成，生成后是一堆单个字体的绘制描述的txt文件。注意太大的字体，会转换失败。
 * @class
 * @memberof ds.createjs
 * @requires module:libs/createjs/createjs0.8.2.min.js
 * @requires module:ds/core/EventDispatcher.js
 */
class DynamicFontManager extends EventDispatcher {

    /**
     * 构造函数
     * @param {string} path 需要加载的文字资源的路径地址  如：`./fonts/HWXHOTxt/`
     */
    constructor(path) {
        super();

        this._path = path;

        this._userFontsDc = {};

    }

    /**
     * 根据内容加载需要的字体
     * @param {string} content 需要绘制的显示对象内容
     * @param {function} callback  加载完成后执行的函数
     */
    loadFontsByContent(content,callback) {

        var _self = this;
        //字符打散成数组
        let _cArr = content.split('');
        //创造需要加载字符列表字典作为判断不需要重复加载
        let _textDc = {};
        //创建需要加载字符列表
        let _textManifest = [];
        let _textCodeList = [];
        for (let i = 0; i < _cArr.length; i++) {

            //str2unicode(textArr[i])//
            let _info = _cArr[i].charCodeAt(0);
            // console.log(info);
            if (!_textDc[_info] && !this._userFontsDc[_info]) {
                let _url = this._path + _info + '.txt';
                _textDc[info] = {id: _info, src: _url};
                _textManifest.push(_textDc[_info]);
                _textCodeList.push(_info);
            }
        }

        if (_textManifest.length <= 0) {
            /**
             * 字体加载完成
             * @event ds.createjs.DynamicFontManager#complete
             * @property {string} content - 加载完成字体内容
             */
            _self.ds({type: 'complete', content: content});
            if(callback)callback(content);

            return;
        }

        let _queue = new createjs.LoadQueue(true);
        _queue.loadManifest(_textManifest);
        _queue.on("complete", loadComplete);

        //加载完成需要绘制字体的数据
        function loadComplete() {

            for (let i = 0; i < _textCodeList.length; i++) {

                let _code = _textCodeList[i];
                let _drawData = _queue.getResult(_code);
                this._userFontsDc[_code] = _drawData;

            }
            /**
             * 字体加载完成
             * @event ds.createjs.DynamicFontManager#complete
             * @property {string} content - 加载完成字体内容
             */
            _self.ds({type: 'complete', content: content});
            if(callback)callback(content);

        }

    }

    /**
     * 获取font字体描述数据
     * @param {sring} value  单字
     * @return {string}
     */
    getFontData(value) {
        if (value.length !== 1) return undefined;
        let _code = value.charCodeAt(0);
        return this._userFontsDc[_code];
    }

    /**
     *  获取转义过的font字体描述数据
     * @param value 单字
     * @return {array}
     */
    getFontPathData(value) {
        let _path = this.getFontData(value);
        if (!_path) return null;
        return this.analysisPathData(_path);
    }

    /**
     * 获取一个字体的绘制显示对象
     * @param {string} value 字体文本
     * @param {sring} color 字体颜色
     * @param {number} size 字体大小
     * @return {createjs.Container} 返回的是一个容器显示对象，字体文件是font.shape
     */
    getShapeFont(value, color, size) {

        let _path = this.getFontPathData(value);
        let _font = new createjs.Container();
        if (!_path) return _font;

        let _shape = this.drawFontByPath(_path, color);
        _font.shape = _shape;
        _font.size = size || 1000;
        _font.addChild(_shape);
        _shape.scaleY = -1;
        _shape.y = 1000;

        if (size !== undefined) {

            let _s = size / 1000;
            _shape.scaleY = -_s;
            _shape.scaleX = _s;
            _shape.y = 1000 * _s;

        }

        return _font;
    }

    /**
     * 根据绘制数据进行绘制一个字体显示对象
     * @param {array} path
     * @param {string} color
     * @return {createjs.Shape}
     */
    drawFontByPath(path, color) {

        let _shape = new createjs.Shape();

        if (!path || path.length === 0) return _shape;

        var g = shape.graphics;
        g.beginFill(color);

        for (let i = 0; i < path.length; i++) {
            // let _gd=path[i];
            _draw(path[i], i);
        }

        g.endFill();

        function _draw(gd, i) {

            let type = gd.type;
            let arr = gd.arr;
            // console.log(i,'draw ',type,arr);
            if (type === 'M') g.moveTo(arr[0], arr[1]);
            if (type === 'L') g.lineTo(arr[0], arr[1]);
            if (type === 'BC') g.bezierCurveTo(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]);
            if (type === 'QC') g.quadraticCurveTo(arr[0], arr[1], arr[2], arr[3]);
            if (type === 'E') g.endFill();

        }

        return _shape;

    }

    /**
     * 动态字体字典
     * @return {object}
     */
    get userFontsDc() {
        return this._userFontsDc;
    }

    /**
     * 动态字体路径
     * @return {string}
     */
    get path() {
        return this._path;
    }

    /**
     * 分析font字体描述数据 转换成可以使用的绘制数据
     * @param {string} path font字体描述数据
     * @return {array} 转义过的font字体描述数据
     */
    analysisPathData(path) {
        // log('AnalysisPathData1')
        let _result = [];
        if (!path) return _result;
        // log('AnalysisPathData2')
        // var d = path;
        let _currentPt = [0, 0];
        let _lastPt = [0, 0];
        let _action = /([a-z])([^a-z]*)/gi;
        let _type, _param, _drawData;
        for (let _reg = "1"; _reg;) {
            _reg = _action.exec(path);
            if (_reg) {
                _type = (_reg[1] + "").toLocaleUpperCase();
                _param = _reg[2];
                _drawData = {type: _type};
                _result.push(_drawData);
                // log(type,param.length);
                switch (_type) {
                    case "M":
                        _param = _param.replace(/,/g, " ");
                        _param = _param.replace(/-/g, " -");
                        _param = _param.trim().split(" ");
                        _currentPt[0] = +(_param[0]);
                        _currentPt[1] = +(_param[1]);
                        _drawData.type = 'M';
                        _drawData.arr = [_currentPt[0], _currentPt[1]];
                        break;
                    case "L":
                        _param = _param.replace(/,/g, " ");
                        _param = _param.replace(/-/g, " -");
                        _param = _param.trim().split(" ");
                        _currentPt[0] = +(_param[0]);
                        _currentPt[1] = +(_param[1]);
                        _drawData.type = 'L';
                        _drawData.arr = [_currentPt[0], _currentPt[1]];
                        break;
                    case "H":
                        _currentPt[0] = +(_param);
                        _drawData.type = 'H';
                        _drawData.arr = [_currentPt[0], _currentPt[1]];
                        break;
                    case "V":
                        _currentPt[1] = +(param);
                        _drawData.type = 'V';
                        _drawData.arr = [_currentPt[0], _currentPt[1]];
                        break;
                    case "Z":
                        _drawData.type = 'E';
                        _drawData.arr = [];
                        break;
                    case "C":
                        _param = _param.replace(/,/g, " ");
                        _param = _param.replace(/-/g, " -");
                        _param = _param.trim().split(" ");
                        _param[0] = +_param[0];
                        _param[1] = +_param[1];
                        _param[2] = +_param[2];
                        _param[3] = +_param[3];
                        _param[4] = +_param[4];
                        _param[5] = +_param[5];
                        // ctx.bezierCurveTo.apply(ctx,param);
                        _drawData.type = 'BC';
                        _drawData.arr = [
                            _param[0],
                            _param[1],
                            _param[2],
                            _param[3],
                            _param[4],
                            _param[5],
                        ];

                        _currentPt = [_param[4], _param[5]];
                        _lastPt = [2 * _param[4] - _param[2], 2 * _param[5] - _param[3]];
                        break;
                    case "S":
                        _param = _param.replace(/,/g, " ");
                        _param = _param.replace(/-/g, " -");
                        _param = _param.trim().split(" ");
                        _param[0] = +_param[0];
                        _param[1] = +_param[1];
                        _param[2] = +_param[2];
                        _param[3] = +_param[3];
                        _param = _lastPt.concat(_param);
                        // ctx.bezierCurveTo.apply(ctx,param);
                        _drawData.type = 'QC';
                        _drawData.arr = [
                            _param[0],
                            _param[1],
                            _param[2],
                            _param[3],
                        ];
                        _currentPt = [_param[4], _param[5]];
                        _lastPt = [2 * _param[4] - _param[2], 2 * _param[5] - _param[3]];
                        break;
                    case "Q":
                        _param = _param.replace(/,/g, " ");
                        _param = _param.replace(/-/g, " -");
                        _param = _param.trim().split(" ");
                        // log("Q",param)
                        var arr = [];
                        _param[0] = Number(_param[0]);
                        _param[1] = Number(_param[1]);
                        _param[2] = Number(_param[2]);
                        _param[3] = Number(_param[3]);
                        // param = lastControl.concat(param);
                        // ctx.bezierCurveTo.apply(ctx,param);
                        _drawData.type = 'QC';
                        _drawData.arr = [
                            _param[0],
                            _param[1],
                            _param[2],
                            _param[3],
                        ];
                        _currentPt = [_param[4], _param[5]];
                        _lastPt = [2 * _param[4] - _param[2], 2 * _param[5] - _param[3]];
                        break;
                    default:
                }
            }
        }
        return _result;
    }


}


let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
ds.createjs = ds.createjs || {};
ds.createjs.ScrollPanel = ScrollPanel;

export default ScrollPanel;