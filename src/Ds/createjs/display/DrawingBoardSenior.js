/**
 * @class Ds.createjs.display.DrawingBoard
 * @classdesc:类说明: 一个画图板容器 create 容器 继承至createjs.Container,提供给需要有强制横屏需求的项目使用
 * @extends
 * @example: 举例
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
(function() {

    window.Ds = window.Ds || {};
    window.Ds.createjs = window.Ds.createjs || {};
    window.Ds.createjs.display = window.Ds.createjs.display || {};
    if (!createjs.BitmapData) {
        console.error('DrawingBoard Error NoHas createjs.BitmapData');
        return;
    }
    /**
     * 画板
     * @param {[type]} width        [宽]
     * @param {[type]} height       [高]
     * @param {[type]} boardBgColor [默认透明色]
     */
    function DrawingBoard(width, height, boardBgColor) {
        this.Container_constructor();
        var _Self = this;
        //宽 高
        var _Width = width,
            _Height = height;
        //画板背景色
        var _BoardBgColor = boardBgColor || 0x00FFFFFF;
        //画板位图对象像素数据操作对象
        var _BoardBMPData = new BitmapData(null, width, height, _BoardBgColor);
        //画板位图对象
        var _BoardBMP = new createjs.Bitmap(_BoardBMPData.canvas);
        //画板的Cavans对象
        var _Canvas = _BoardBMPData.canvas;
        //添加到场景上
        this.addChild(_BoardBMP);

        /**
         * 绘制类型
         * @type {String}
         * pencil 铅笔类型
         * brush 笔刷类型
         * crayon 蜡笔类型
         * signature 签字笔类型
         * marker  马克笔类型
         * rubber  橡皮
         * writingBrush  毛笔
         */
        var _PaintType = '';
        /**
         * 铅笔类型
         * @type {Object}
         */
        var _Pencil = {
            type: 'pencil',
            pen: {},
            size: 2, //笔触大小
            color: '#000',
        };
        /**
         * 橡皮
         * @type {Object}
         */
        var _Rubber = {
            type: 'rubber',
            pen: {},
            size: 8, //笔触大小

            color: '#000'
        };
        /**
         * 笔刷类型
         */
        var _Brush = {
            type: 'brush',
            pen: {},
            size: 1, //笔触大小 缩放比例

            color: '#000',
        };

        /**
         * 蜡笔类型
         * @type {Object}
         */
        var _Crayon = {
            type: 'crayon',
            pen: {},
            size: 1, //笔触大小 缩放比例

            color: '#000',
        };
        /**
         * 签字笔类型
         * @type {Object}
         */
        var _Signature = {
            type: 'signature',
            pen: {},
            size: 1, //笔触大小 缩放比例

            color: '#000'
        };

        /**
         * 马克笔
         * @type {Object}
         */
        var _Marker = {
            type: 'marker',
            pen: {},
            size: 1, //笔触大小 缩放比例

            color: '#000'
        };

        /**
         * 毛笔
         * @type {Object}
         */
        var _WritingBrush = {
            type: 'writingBrush',
            pen: {},
            size: 1, //笔触大小 缩放比例

            color: '#000'
        };


        //当前使用的笔
        var _NowPen;
        //创建get set方法
        Object.defineProperty(this, "NowPen", {
            get: function() {
                return _NowPen;
            }
        });


        //当前使用的颜色
        var _NowColor = '#000';
        /**
         * 锁 是否可以画
         * @type {Boolean}
         */
        var _Lock = false;
        //创建 锁的 get set方法
        Object.defineProperty(this, "Lock", {
            get: function() {
                return _Lock;
            },
            set: function(value) {
                if (_Lock == value) return;
                _Lock = value;
                _Self.dispatchEvent('UpLock');
            }
        });
        /**
         * 初始化设置铅笔 与颜色
         */
        SetPaintPen({
            type: 'pencil',
            color: '#000'
        });
        /**
         * 设置画笔类型
         * @type {[type]}
         */
        this.SetPaintType = SetPaintType;
        //创建get set方法
        Object.defineProperty(this, "PaintType", {
            get: function() {
                return _PaintType;
            },
            set: function(value) {
                SetPaintType(value);
            }
        });
        /**
         * 设置画笔类型
         * @type {[type]}
         */
        function SetPaintType(value) {
            if (value == _PaintType) return;
            _PaintType = value;
            if (value == 'pencil') _NowPen = _Pencil;
            if (value == 'rubber') _NowPen = _Rubber;
            if (value == 'brush') _NowPen = _Brush;
            if (value == 'signature') _NowPen = _Signature;
            if (value == 'marker') _NowPen = _Marker;
            if (value == 'writingBrush') _NowPen = _WritingBrush;
        }
        this.SetPaintPen = SetPaintPen;
        /**
         * 设置画笔
         * @param {[Object]} obj  [画笔类型]
         * @param {[type]} type  [画笔类型]
         * @param {[type]} color [画笔颜色] true 使用全局色覆盖  color值 设置新的颜色;
         */
        function SetPaintPen(obj) {
            SetPaintType(obj.type);
            //颜色值的设置
            if (obj.color !== null && obj.color !== undefined) {
                if (obj.color === true) {
                    _NowPen.color = _NowColor;
                } else if (typeof(obj.color) == "string") {
                    _NowPen.color = color;
                }
            }
        }

        /**
         * 参考BitmapData.draw
         * @param {[type]} source             [description]
         * @param {[type]} matrix             [description]
         * @param {[type]} colorTransform     [description]
         * @param {[type]} compositeOperation [description]
         * @param {[type]} clipRect           [description]
         * @param {[type]} smoothing          [description]
         */
        this.Draw = function(source, matrix, colorTransform, compositeOperation, clipRect, smoothing) {
            _BoardBMPData.draw(source, matrix, colorTransform, compositeOperation, clipRect, smoothing);
        };
        /**
         * [UpDrawData description]
         */
        this.UpDrawData = function() {

        };
        /**
         * 设置画布大小
         * @param {[Number]} width  [宽]
         * @param {[Number]} height [高]
         */
        this.setSize = function(width, height) {
            this.Width = _Width = width;
            this.Height = _Height = height;
            //进行修改canvas大小
            var  _cxt  = _Canvas.getContext("2d");
            var _imgData = _cxt.getImageData(0, 0, canvas.width, canvas.height);
            _Canvas.width = _Width;
            _Canvas.height = _Height;
            _cxt.putImageData(_imgData, 0, 0);


            _Self.dispatchEvent('Resize');
        };
        //监听屏幕尺寸变化
        $(window).resize(function() {
            _Self.Resize();
        });
        //马上计算屏幕现实状态
        _Self.Resize();
    }
    var p = createjs.extend(DrawingBoard, createjs.Container);
    window.Ds.createjs.display.DrawingBoard = createjs.promote(DrawingBoard, "Container");
})();
