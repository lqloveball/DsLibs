//这个类使用老js方法，有可能直接插入html标签内使用
!(function (factory) {

    var root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);


    if (typeof define === 'function' && define.amd) {

        define(['exports'], function (exports) {
            require('libs/shrek/imgslterV.js');
            module.exports = factory(root, exports);

        });
    } else if (typeof exports !== 'undefined') {
        require('libs/shrek/imgslterV.js');
        module.exports = factory(root, exports);

    } else {

        factory(root, {});

    }

}(function (root, Model) {

    var ds = root.ds = root.ds || {};
    ds.createjs = ds.createjs || {};



    /**
     * createjs下选择图片上传管理器
     * @class ds.createjs.SelectUpImager
     * @classdesc 实现createjs下选择图片上传，触摸的 拖拽、旋转、缩放
     * @param {number} width  图片显示容器宽
     * @param {number} height  图片显示容器高
     * @param {createjs.Container} container 选择好的图片会放添加到什么容器内，可以不设置
     * @param {object} opts  图片选择器的配置参数
     * @param {number} opts.size  选择器对选择的图片进行缩放尺寸。如：设置100，那选择上传的图片的图片 宽与高 都不可能小于100px。默认不设置会使用width或height的最大值
     * @param {string} [opts.layout='outSide']  默认：'outSide'  撑满容器 使用'inSide' 缩放到容器内
     * - SelectUpImager.LAYOUT_OUTSIDE='outSide'
     * - SelectUpImager.LAYOUT_INSIDE='inSide'
     * @param {number} [opts.scaleMax=0.2 ] 允许缩放最大比例
     * @param {number} [opts.scaleMin=3]    允许缩放最小比例
     * @param {boolean} [opts.look=false]   是否锁定 锁定不能缩放 不能拖动 不能旋转
     * @param {boolean} [opts.drag=true]  是否可以拖拽
     * @param {boolean} [opts.zoom=true]  是否可以缩放
     * @param {boolean} [opts.rotation=true] 是否可以旋转
     * @param {createjs.Rectangle} [opts.dragRect=undefined] 设置拖拽访问
     * @param {boolean} [opts.hasRect=false] 设置true 按width height 创建拖拽范围
     * @param {boolean} [opts.clear=true] 选择新相片是否自动清空之前编辑对象
     * @param {number} [opts.selectDelay=2] 选择延迟，距离上次选择多少秒时间内不能触发选择
     * @param {string} [opts.capture=undefined]  选择方式 默认null ，比如：camera 照相机；camcorder 摄像机；microphone 录音。
     * @requires libs/shrek/imgslterV.js
     * @requires libs/touch/touch.min.js
     * @example
     *
     *  require('ds/createjs/SelectUpImager');
     *  var _selectUpImager=new ds.createjs.SelectUpImager(250,250,_box);
     *  _SelectUpImager.on('update',function (e) {
     *      //选择了一张图片上来时候触发
     *  });
     *
     */
    ds.createjs.SelectUpImager = SelectUpImager;

    function SelectUpImager(width, height, container, opts) {

        opts = opts || {};

        var _self = this;
        ds.EventDispatcher.extend(this);

        if (!width && !height) console.warn('ds.createjs.SelectUpImager No Has width height?');

        var _width = width || 1000;
        var _height = height || _width;

        //选择器选择上来图片大小
        var _size = opts.size || Math.max(_width, _height);

        /**
         * 拖拽缩放使用的容器
         * @member ds.createjs.SelectUpImager.prototype.container
         * @type {createjs.Container}
         * @readonly
         */
        var _container = container || new createjs.Container();
        Object.defineProperty(this, "container", {
            get: function () {
                return _container;
            },
        });

        /**
         * 是否可以拖拽
         * @member ds.createjs.SelectUpImager.prototype.drag
         * @type {boolean}
         */
        var _drag = opts.drag !== undefined ? opts.drag : true;
        Object.defineProperty(this, "drag", {
            get: function () {
                return _drag;
            },
            set: function (value) {
                _drag = value;
            }
        });

        /**
         * 是否允许缩放
         * @member ds.createjs.SelectUpImager.prototype.zoom
         * @type {boolean}
         */
        var _zoom = opts.zoom !== undefined ? opts.zoom : true;
        Object.defineProperty(this, "zoom", {
            get: function () {
                return _zoom;
            },
            set: function (value) {
                _zoom = value;
            }
        });

        /**
         * 是否允许旋转
         * @member ds.createjs.SelectUpImager.prototype.rotation
         * @type {boolean}
         */
        var _rotation = opts.rotation !== undefined ? opts.rotation : true;
        Object.defineProperty(this, "rotation", {
            get: function () {
                return _rotation;
            },
            set: function (value) {
                _rotation = value;
            }
        });


        /**
         * 是否锁定 不能拖到 缩放 旋转
         * @member ds.createjs.SelectUpImager.prototype.look
         * @type {boolean}
         */
        var _look = opts.look !== undefined ? opts.look : false;
        Object.defineProperty(this, "look", {
            get: function () {
                return _look;
            },
            set: function (value) {
                _look = value;
            }
        });

        //添加新元素时候是否清空容器
        var _clear = opts.clear !== undefined ? opts.clear : true;


        //outSide撑满容器 inSide缩放到容器内
        /**
         * 选择图片到显示容器内画面布局
         * - 'outSide' 撑满容器
         * - 'inSide' 缩放到容器内
         * @member ds.createjs.SelectUpImager.prototype.layout
         * @default 'outSide'
         * @type {string}
         */
        var _layout = opts.layout !== undefined ? opts.layout : 'outSide';
        Object.defineProperty(this, "layout", {
            get: function () {
                return _layout;
            },
            set: function (value) {
                _layout = value;
            }
        });


        /**
         * 拖拽缩放触发的dom对象
         * @member ds.createjs.SelectUpImager.prototype.touchDom
         * @type {HTMLElement}
         */
        var _touchDom;
        Object.defineProperty(this, "touchDom", {
            get: function () {
                return _touchDom;
            },
            set: function (value) {

                if (_touchDom == value) return;
                if (_touchDom) {

                    touch.off(_touchDom, 'pinch', pinch);
                    touch.off(_touchDom, 'pinchstart', pinchstart);
                    touch.off(_touchDom, 'pinchend', pinchend);
                    touch.off(_touchDom, 'rotate', rotate);
                }

                _touchDom = value;
                touch.on(_touchDom, 'pinch', pinch);
                touch.on(_touchDom, 'pinchstart', pinchstart);
                touch.on(_touchDom, 'pinchend', pinchend);
                touch.on(_touchDom, 'rotate', rotate);
            }
        });

        //处理默认配置
        var _tempTouchDom;
        if (opts.touchDom) _tempTouchDom = getHTMLElement(opts.touchDom);
        if (!_tempTouchDom) _tempTouchDom = $('body')[0];
        this.touchDom = _tempTouchDom;

        /**
         * 设置拖拽区域
         * - null 不选择拖拽区域
         * @member ds.createjs.SelectUpImager.prototype.dragRect
         * @type {createjs.Rectangle}
         */
        var _dragRect = opts.dragRect;
        Object.defineProperty(this, "dragRect", {
            get: function () {
                return _dragRect;
            },
            set: function (value) {

                if (value === undefined || value === null) {
                    _dragRect = null;
                }
                else if (value instanceof createjs.Rectangle) {
                    _dragRect = value;
                }

            }
        });

        //是否自动创建一个拖拽选区
        // if(opts.hasRect===undefined) opts.hasRect=true;
        if (opts.hasRect && !_dragRect) _dragRect = new createjs.Rectangle(0, 0, _width, _height);


        /**
         * 选择图片选择器
         * @member ds.createjs.SelectUpImager.prototype.selecter
         * @type {ImgSlter}
         */
        var _selecter;
        Object.defineProperty(this, "selecter", {
            get: function () {
                return _selecter;
            },
        });
        /**
         * 上传图片转化编辑对象
         * @member ds.createjs.SelectUpImager.prototype.element
         * @type {createjs.Container}
         */
        var _element;
        Object.defineProperty(this, "element", {
            get: function () {
                return _element;
            },
        });

        //点击选择延迟
        var _selectDelay = opts.selectDelay !== undefined ? opts.selectDelay * 1000 : 2 * 1000;
        //点击计时
        var _selectTime = new Date().getTime() - _selectDelay;

        var _scale = 1;
        //开始拖动时候缩放比例
        var _scaleStart;
        var _scaleMax = opts.scaleMax !== undefined ? opts.scaleMax : 3;
        var _scaleMin = opts.scaleMin !== undefined ? opts.scaleMin : 0.2;

        var _objRotation = 0;
        var _objRotationStart;


        function pinch(e) {

            if (_look) return;
            if (!_zoom) return;

            var _temp = e.scale - 1;
            _temp = _scaleStart + _temp;
            if (_temp >= _scaleMax) _temp = _scaleMax;
            if (_temp <= _scaleMin) _temp = _scaleMin;
            _scale = _temp;

            if (_element) _element.scaleX = _element.scaleY = _scale;

        }

        function pinchend(e) {

            if (_look) return;
            if (!_zoom) return;
            _scaleStart = _scale;

        }


        function pinchstart(e) {

            if (_look) return;
            if (_rotation) _objRotationStart = _objRotation;
            if (_zoom) _scaleStart = _scale;

        }


        function rotate(e) {

            if (_look) return;
            if (!_rotation) return;

            _objRotation = _objRotationStart + e.rotation;
            if (_element) _element.rotation = _objRotation;

        }

        var _pointerID;

        //拖拽事件
        function onDragStart(e) {

            var _obj = _element;
            var _stage = _obj.stage;

            if (_look) return;
            if (!_drag) return;
            if (!_obj) return;
            if (!_stage) return;


            if (_obj.draging && _obj.draging > 0) return;

            _pointerID = e.pointerID;

            //记录拖动状态
            _obj.draging = 1;

            _obj.dragGlobalStart = new createjs.Point(_stage.mouseX, _stage.mouseY);
            _obj.dragPointerStart = _obj.parent.globalToLocal(_stage.mouseX, _stage.mouseY);
            _obj.dragObjStart = new createjs.Point(_obj.x, _obj.y);


            _stage.addEventListener('stagemousemove', onDragMove);
            _stage.addEventListener('stagemouseup', onDragEnd);

        }

        function onDragMove(e) {

            var _obj = _element;
            var _stage = _obj.stage;

            if (_look) return;
            if (!_drag) return;
            if (!_obj) return;
            if (!_stage) return;
            if (!_obj.draging) return;
            if (_pointerID !== e.pointerID) return;

            if (_obj.draging === 1) {
                var _spt = _obj.dragGlobalStart;
                //开始拖动  判断 x  y偏移和超过3 说明开始拖动
                if (Math.abs(_spt.x - _stage.mouseX) + Math.abs(_spt.y - _stage.mouseY) >= 3) _obj.draging = 2;
                // _obj.ds('dragStart');
            }

            //已经开始拖动
            if (_obj.draging === 2) {

                //鼠标指针转换成相对父亲内坐标
                var _dragPointerEnd = _obj.parent.globalToLocal(_stage.mouseX, _stage.mouseY);
                // 开始拖动
                var _x = _obj.dragObjStart.x + (_dragPointerEnd.x - _obj.dragPointerStart.x);
                var _y = _obj.dragObjStart.y + (_dragPointerEnd.y - _obj.dragPointerStart.y);

                if (_dragRect) {

                    _x = Math.max(_dragRect.x, _x);
                    _x = Math.min(_dragRect.x + _dragRect.width, _x);
                    _y = Math.max(_dragRect.y, _y);
                    _y = Math.min(_dragRect.y + _dragRect.height, _y);
                    // console.log(_x,_y);
                    _obj.x = _x;
                    _obj.y = _y;

                } else {

                    _obj.x = _x;
                    _obj.y = _y;

                }
                // _obj.ds('draging', e);

            }


        }

        function onDragEnd(e) {

            var _obj = _element;
            var _stage = _obj.stage;
            if (_look) return;
            if (_pointerID !== e.pointerID) return;

            _obj.draging = 0;

            _obj.removeEventListener('stagemousemove', onDragMove);
            _obj.removeEventListener('stagemouseup', onDragEnd);


        }


        //创建选择图片选择器
        function createSelectImager() {

            _selecter = new ImgSlter({
                capture: opts.capture !== undefined ? opts.capture : null,
                size: _size,
            });

            _selecter.handler = upImageData;

            _selectTime = new Date().getTime() - _selectDelay;

            /**
             * 创建新的图片选择对象
             * @event ds.createjs.SelectUpImager#create
             * @type {object}
             * @property {string} [type='create'] - 事件类型
             * @property {ImgSlter} selecter - 图片选择器
             * @property {selecter.el} el - 图片选择器的input对象
             * @property {string} id - 图片选择器的input对象的id值
             */
            _self.ds({
                type: 'create',
                //选择器
                selecter: _selecter,
                //选择器dom元素
                el: _selecter.el,
                //选择器id
                id: _selecter.el.id,
            });

        }

        //图片选择成功
        function upImageData(data) {

            var _img = new Image();
            var _base64 = data.img;
            _img.onload = complete;
            _img.src = _base64;

            function complete() {

                //处理上传上来素材----
                var _s = 1;
                var _w = _width, _h = _height;
                var _sw = _w / _img.width, _sh = _h / _img.height;
                if (_layout === 'inSide') _s = Math.min(_sw, _sh);
                else _s = Math.max(_sw, _sh);

                var _bitmap = new createjs.Bitmap(_img);
                var _tempElement = new createjs.Container();
                _tempElement.addChild(_bitmap);
                _tempElement.bitmap = _bitmap;
                _bitmap.scaleX = _bitmap.scaleY = _s;

                _tempElement.width = _bitmap.width = _img.width * _s;
                _tempElement.height = _bitmap.height = _img.height * _s;

                _bitmap.x = -_bitmap.width / 2;
                _bitmap.y = -_bitmap.height / 2;

                _tempElement.x = _width / 2;
                _tempElement.y = _height / 2;

                _container.uncache();

                if (_clear) {
                    _container.removeAllChildren();
                    if (_element) removeEvent(_element);
                }

                if (_container) _container.addChild(_tempElement);


                _element = _tempElement;
                addEvent(_element);

                _scale = 1;
                _objRotation = 0;


                /**
                 * 图片选择更新
                 * @event ds.createjs.SelectUpImager#update
                 * @type {object}
                 * @property {string} [type='update'] - 事件类型
                 * @property {ImageElement} img - 图片
                 * @property {number} width - 图片宽
                 * @property {number} height - 图片高
                 * @property {string} base64 - 图片base64数据
                 * @property {createjs.Container} element - 编辑对象
                 * @property {createjs.Bitmap} bitmap - Bitmap对象
                 */
                _self.ds({
                    type: 'update',
                    //上传后生成的images标签
                    img: _img,
                    //images宽
                    width: _img.width,
                    //images高
                    height: _img.height,
                    //上传生成的base64数据
                    base64: _base64,
                    //创建出来编辑对象
                    element: _element,
                    ///创建出来Bitmap对象
                    bitmap: _bitmap,
                });

            }

            if (_selecter) _selecter.destroy();
            createSelectImager();

        }

        function addEvent(displayObject) {

            displayObject.mouseChildren = false;
            displayObject.draging = 0;
            displayObject.addEventListener('mousedown', onDragStart);

        }

        function removeEvent(displayObject) {

            displayObject.removeEventListener('mousedown', onDragStart);

        }


        /**
         * 选择上传的图片
         * @method ds.createjs.SelectUpImager.prototype.select
         * @function
         */
        this.select = function () {

            if (new Date().getTime() - _selectTime < _selectDelay) return;

            if (_selecter) _selecter.select();

        };

        /**
         * 清空容器
         * @method ds.createjs.SelectUpImager.prototype.clear
         * @function
         */
        this.clear = function () {

            var _temp;
            if (_element) {
                _temp = _element;
                removeEvent(_element);
            }

            if (_container && _container.contains(_element)) _container.removeChild(_element);
            _element = undefined;

            /**
             * 图片选择更新
             * @event ds.createjs.SelectUpImager#clear
             * @type {object}
             * @property {string} [type='clear'] - 事件类型
             * @property {createjs.Container} element - 编辑对象
             */
            _self.ds({
                type: 'clear',
                element: _temp,
            });

        };

        /**
         * 缓存出一个Base64数据
         * @method ds.createjs.SelectUpImager.prototype.cacheBase64
         * @function
         * @param {object} opts 截图配置参数 详见：{@link ds.createjs.getBase64 }
         * @return {string} Base64数据
         */
        this.cacheBase64 = function (opts) {

            opts = opts || {};
            var _base64;

            opts.width=_width;
            opts.height=_height;

            _base64 = ds.createjs.getBase64(_container,opts);

            return _base64;

        };

        /**
         * 缓存出一个Bitmap对象
         * @method ds.createjs.SelectUpImager.prototype.cacheBitmap
         * @function
         * @param {object} opts 截图配置参数 详见：{@link ds.createjs.getBase64 }
         * @return {createjs.Bitmap}
         */
        this.cacheBitmap = function (opts) {

            opts = opts || {};
            var _base64;

            _base64 = _self.cacheBase64(opts);
            var _img = new Image();
            var _bitmap = new createjs.Bitmap(_img);
            _bitmap.image.src = _base64;

            return _bitmap;

        };

        /*
         * 获取是否dom  可以是一个dom对象 或者 zepto与jquery对象
         * @param dom
         * @return {HTMLElement}
         */
        function getHTMLElement(dom) {
            if (dom instanceof HTMLElement) return dom;
            else if (!(dom instanceof HTMLElement) && (dom[0] instanceof HTMLElement)) return dom[0];
            else return null;
        }

        //初始化创建图片选择器
        createSelectImager();

    }

    SelectUpImager.LAYOUT_OUTSIDE = 'outSide';
    SelectUpImager.LAYOUT_INSIDE = 'inSide';

    return ds.createjs.SelectUpImager;
}));