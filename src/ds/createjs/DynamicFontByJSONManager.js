import EventDispatcher from '../core/EventDispatcher';

/**
 * 动态字体输入处理类
 * 拆字解析保存基于node程序。
 * @memberof ds.createjs
 * @example
 *
 var _dynamicFontManager = new ds.createjs.DynamicFontByJSONManager('./assets/fonts/FZZDH/');

 //装字体的容器
 var _box = _view.box;
 //当前文本
 var _currentInfo;
 //颜色
 var _color='#ffffff';
 //字体大小
 var _fontSize=25;
 //创建输入框
 var _input = ds.createjs.addInput(_view.textInput, {
        width: 420,
        color: '#30004A',
        size: 22
    }, '默认输入字体ABCyqgJCD');
 //输入框内容改变时候
 _input.el.on('change', changeDynamicFont);
 //输入框内容输入时候
 _input.el.on('input', changeDynamicFont);
 //输入框内容改变事件
 function changeDynamicFont() {
        if (_input.el[0].value === _currentInfo) return;
        _currentInfo = _input.el[0].value;
        _dynamicFontManager.loadFontsByContent(_currentInfo, dynamicFontLoadEnd);
 }
 //输入内容加载完成后
 function dynamicFontLoadEnd(content) {
        if (_currentInfo !== content) return;
        _currentInfo=content;
        _box.removeAllChildren();
        for (var i = 0; i < _currentInfo.length; i++) {
            var _info=_currentInfo[i];
             var _font=_dynamicFontManager.getShapeFont(_info,{
                color:_color,
                size:_fontSize
            });
            _box.addChild(_font);

            _font.x=_fontSize*(i%21);
            _font.y=(_fontSize+8)*(i/21>>0);
        }
 }
 //默认呈现
 changeDynamicFont();

 */
class DynamicFontByJSONManager extends EventDispatcher {
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
    loadFontsByContent(content, callback) {

        let _self = this;
        //字符打散成数组
        let _cArr = content.split('');
        //创造需要加载字符列表字典作为判断不需要重复加载
        let _textDc = {};
        //创建需要加载字符列表
        let _textManifest = [];
        let _textCodeList = [];
        for (let i = 0; i < _cArr.length; i++) {

            //'!'.charCodeAt(0) = 33 = 0x0021
            let _unicode = _cArr[i].charCodeAt(0);
            if (!_textDc[_unicode] && !this._userFontsDc[_unicode]) {
                let _url = this._path + _unicode + '.txt';
                _textDc[_unicode] = {id: _unicode, src: _url};
                _textManifest.push(_textDc[_unicode]);
                _textCodeList.push(_unicode);
            }
        }

        if (_textManifest.length <= 0) {
            /**
             * 字体加载完成
             * @event ds.createjs.DynamicFontByJSONManager#complete
             * @property {string} content - 加载完成字体内容
             */
            _self.ds({type: 'complete', content: content});
            if (callback) callback(content);

            return;
        }

        let _queue = new createjs.LoadQueue(true);
        _queue.loadManifest(_textManifest);
        _queue.on("complete", loadComplete);

        //加载完成需要绘制字体的数据
        function loadComplete() {

            for (let i = 0; i < _textCodeList.length; i++) {

                let _unicode = _textCodeList[i];
                let _txt = _queue.getResult(_unicode);
                // console.log(_txt);
                let _path = {};
                if (_txt) _path = JSON.parse(_txt);
                _self._userFontsDc[_unicode] = _path;

            }
            /**
             * 字体加载完成
             * @event ds.createjs.DynamicFontByJSONManager#complete
             * @property {string} content - 加载完成字体内容
             */
            _self.ds({type: 'complete', content: content});
            if (callback) callback(content);

        }

    }

    /**
     * 获取font字体描述数据
     * ```js
     *  //unicode 与 string 之间互相转
     *  //这里直接输入进制数0x0061或97，而不是字符串
     *  String.fromCharCode(0x0061); //a
     *  //输出为10进制数
     *  'a'.charCodeAt(0);//97 (16进制0x0061)
     * ```
     * @param {string} text  单字
     * @return {array}
     */
    getFontPath(text) {
        if (text.length !== 1) return undefined;
        let _code = text.charCodeAt(0);
        return this._userFontsDc[_code];
    }

    /**
     * 获取一个绘制文字
     * @param {string} text 字
     * @param {object} opts 配置
     * @param {string} opts.color 字体颜色
     * @param {number} opts.size 字的大小 像素
     * @param {string} opts.stroke 描边色
     * @param {number} opts.strokeWidth 描边粗细
     * @param {debug}  opts.debug 是否绘制debug框
     * @return {createjs.Shape} shape 字体绘制对象
     * @return {object} shape.data
     *
     * ```js
     * text 对应的字
     * commands 原始绘制路径数据
     * unitsPerEm 原始画幅大小
     * unicode 对应unicode码
     * advanceWidth 原始字宽
     * xMin 原始最小x
     * yMin 原始最小y
     * xMax 原始最大x
     * yMax 原始最大y
     * leftSideBearing 对齐距离
     * descender 基线
     * ascender 基线 反向后
     * size 字体大小
     * width 字体实际宽
     * scale 字体按画幅缩放比
     * ```
     */
    getShapeFont(text, opts) {

        opts = opts || {};
        let _color = opts.color || '#000';
        let _fontSize = opts.size !== undefined ? opts.size : 72;
        let _debug = opts.debug !== undefined ? opts.debug : false;

        let _shape = new createjs.Shape();
        _shape.data = null;
        let path = this.getFontPath(text);
        if (!path) return _shape;
        if (!path || !path.commands) return _shape;
        let g = _shape.graphics;

        let scale = 1;
        if (path.unitsPerEm) scale = 1 / path.unitsPerEm * _fontSize;
        let x = 0, y = 0;

        y = path.ascender * scale;

        _shape.data = {
            text: text,
            commands: path.commands,
            unitsPerEm: path.unitsPerEm,
            unicode: path.unicode,
            advanceWidth: path.advanceWidth,
            xMin: path.xMin,
            xMax: path.xMax,
            yMin: path.yMin,
            yMax: path.yMax,
            leftSideBearing: path.leftSideBearing,
            descender: path.descender,
            ascender: path.ascender,
            size: path.unitsPerEm * scale,
            width: path.advanceWidth * scale,
            scale: scale,
        };

        g.append({
            exec: function (ctx, shape) {
                let i, cmd, x1, y1, x2, y2;
                // console.log(path);
                ctx.beginPath();
                for (i = 0; i < path.commands.length; i += 1) {
                    cmd = path.commands[i];
                    if (cmd.type === 'M') {
                        ctx.moveTo(
                            x + (cmd.x * scale),
                            y + (-cmd.y * scale)
                        );
                    } else if (cmd.type === 'L') {
                        ctx.lineTo(
                            x + (cmd.x * scale),
                            y + (-cmd.y * scale)
                        );
                    } else if (cmd.type === 'C') {
                        ctx.bezierCurveTo(
                            x + (cmd.x1 * scale),
                            y + (-cmd.y1 * scale),
                            x + (cmd.x2 * scale),
                            y + (-cmd.y2 * scale),
                            x + (cmd.x * scale),
                            y + (-cmd.y * scale)
                        );
                    } else if (cmd.type === 'Q') {
                        ctx.quadraticCurveTo(
                            x + (cmd.x1 * scale),
                            y + (-cmd.y1 * scale),
                            x + (cmd.x * scale),
                            y + (-cmd.y * scale)
                        );
                    } else if (cmd.type === 'Z') {
                        ctx.closePath();
                    }
                }

                if (opts.stroke) {
                    ctx.strokeStyle = opts.stroke;
                    ctx.lineWidth = opts.strokeWidth !== undefined ? opts.strokeWidth : 1;
                    ctx.stroke();
                }
                ctx.fillStyle = _color;
                ctx.fill();
            }
        });

        if (_debug) {
            let _size = 0.5;
            g.setStrokeStyle(_size, "round").beginStroke("#FF0");
            g.rect(0, 0, path.unitsPerEm * scale, path.unitsPerEm * scale);
            g.setStrokeStyle(_size, "round").beginStroke("#f00");
            g.moveTo(path.advanceWidth * scale, 0);
            g.lineTo(path.advanceWidth * scale, path.unitsPerEm * scale);
            // g.setStrokeStyle(0, "round").beginStroke(null);
        }

        return _shape;

    }

}


let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
ds.createjs = ds.createjs || {};
ds.createjs.DynamicFontByJSONManager = DynamicFontByJSONManager;

export default DynamicFontByJSONManager;