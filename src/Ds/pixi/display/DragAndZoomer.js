!(function (factory) {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);
    if (typeof define === 'function' && define.amd) {
        define(['exports'], function (exports) {
            require('../../gemo/SelectUpImager');
            module.exports = factory(root, exports);
        });
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(root, exports);
    } else {
        factory(root, {});
    }
}(function (root, exports) {
    root.Ds = root.Ds || {};
    root.Ds.DsPixi = Ds.DsPixi || {};
    root.Ds.DsPixi.display = Ds.DsPixi.display || {};
    root.DsPixi = root.Ds.DsPixi;


    Ds.DsPixi.display.DragAndZoomer = DragAndZoomer;

    /**
     * 一个控制拖拽显示对象的管理器
     *
     * @param opts
     * opts.touchDom    拖拽缩放使用touch 元素对象  默认取
     * opts.box         拖拽缩放使用的容器  默认：自动创建一个PIXI.Container();
     * opts.layoutType  默认：'outSide' 撑满容器 'inSide' 缩放到容器内
     * opts.size       选择图片进行压缩的size大小
     * opts.width       容器宽
     * opts.height      容器高
     * opts.scaleMax      缩放最大 默认 3
     * opts.scaleMin      缩放最小 默认 0.2
     * opts.drag      是否可以拖动 默认true
     * opts.rectBool  是否需要按 opts.width opts.height 限制拖拽区域
     * opts.zoom      是否可以缩放 默认true
     * opts.look      是否锁定 默认false
     * opts.clear     添加新元素到容器内时候 是否清空容器 默认true
     * @constructor
     */
    function DragAndZoomer(opts) {
        opts = opts || {};
        var _self = this;
        Ds.Extend(this, new Ds.EventDispatcher());


        var _container = opts.box || new PIXI.Container();
        //拖拽缩放使用的容器
        Object.defineProperty(this, "container", {
            get: function () {
                return _container;
            },
        });

        var _element;
        //拖拽 缩放的元素
        Object.defineProperty(this, "element", {
            get: function () {
                return _element;
            },
        });

        var _drag = opts.drag != undefined ? opts.drag : true;
        //是否允许拖拽
        Object.defineProperty(this, "drag", {
            get: function () {
                return _drag;
            },
            set: function (value) {
                _drag = value;
            }
        });
        var _zoom = opts.zoom != undefined ? opts.zoom : true;
        //是否允许缩放
        Object.defineProperty(this, "zoom", {
            get: function () {
                return _zoom;
            },
            set: function (value) {
                _zoom = value;
            }
        });
        var _look = opts.look != undefined ? opts.look : false;
        //是否锁定
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
        //是否拖拽区域需要判断
        var _rectBool = opts.rectBool !== undefined ? opts.rectBool : true;

        //outSide撑满容器 inSide缩放到容器内
        var _layoutType = opts.layoutType !== undefined ? opts.layoutType : 'outSide';

        var _touchDom;
        //拖拽缩放使用touch 元素对象
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
                }
                _touchDom = value;
                touch.on(_touchDom, 'pinch', pinch);
                touch.on(_touchDom, 'pinchstart', pinchstart);
                touch.on(_touchDom, 'pinchend', pinchend);
            }
        });
        var _tempTouchDom;
        if (opts.touchDom) _tempTouchDom = getHTMLElement(opts.touchDom);
        if (!_tempTouchDom) _tempTouchDom = $('body')[0];
        this.touchDom = _tempTouchDom;

        //可以拖拽范围
        var _dragRect;

        var _width = opts.width != undefined ? opts.width : null;
        var _height = opts.height != undefined ? opts.height : _width;
        if (_width != null && _height != null) {
            _dragRect = new PIXI.Rectangle(0, 0, _width, _height);
        }
        //创建选择上传对象
        var _size= opts.size != undefined ? opts.size :1000;
        var _selecter=new Ds.gemo.SelectUpImager(_size,null,{
            width:_width!=null?_width:1000,
            height:_height!=null?_height:1000,
        });
        //图片选择上传对象
        Object.defineProperty(this, "selecter", {
            get: function () {
                return _selecter;
            },
        });
        _selecter.on('update',function (e) {
            var _img=e.img;
            // console.log('update................',_img);
            _self.add(_img);

        });
        /**
         * 选择上传的图片
         */
        this.select=function () {
            if(_selecter)_selecter.select();
        }



        //就缩放比例
        var _scale = 1;
        //开始拖动时候缩放比例
        var _scaleStart;
        var _scaleMax = opts.scaleMax != undefined ? opts.scaleMax : 3;
        var _scaleMin = opts.scaleMin != undefined ? opts.scaleMin : 0.2;
        //开始缩放手势
        function pinchstart(e) {
            if(!_zoom)return;
            _scaleStart = _scale;
        }
        //缩放中
        function pinch(e) {
            if(!_zoom)return;
            var _temp = e.scale - 1;
            _temp = _scaleStart + _temp;
            if (_temp >= _scaleMax) _temp = _scaleMax;
            if (_temp <= _scaleMin) _temp = _scaleMin;
            _scale = _temp;

            if (_element) _element.scale.set(_scale);

        }
        //缩放完成
        function pinchend(e) {
            if(!_zoom)return;
            _scaleStart = _scale;
        }


        /**
         * 添加被拖拽的对象
         * @param obj
         */
        this.add = function (value, opts) {
            var _temp = getElement(value, opts);

            if (!_temp) return;

            if (_element) {
                removeDragEvent(_element);
            }

            _element = _temp;
            _scale = 1;

            if (_clear) _container.removeChildren();
            _container.addChild(_element);

            addDragEvent(_element);
            _self.ds({
                type:'add',
                element:_element,
            })
        };

        function getElement(value, opts) {
            var _obj, _box, _baseTexture;
            if (typeof(value) === 'string') {
                _obj = new PIXI.Sprite.fromImage(value);
                _baseTexture = _obj.texture.baseTexture;
            }
            else if (value instanceof Image){
                _obj = new PIXI.Sprite(PIXI.Texture.fromLoader(value));
                _baseTexture = _obj.texture.baseTexture;
            }
            else if (value instanceof PIXI.Texture) {
                _obj = new PIXI.Sprite(value);
                _baseTexture = _obj.texture.baseTexture;
            } else if (value instanceof PIXI.DisplayObject) {
                _obj = value;
            }
            if (!_obj) {
                console.warn('添加拖拽对象类型错误');
                return null;
            }

            _box = new PIXI.Container();
            //属于输入图片路径与图片纹理
            if (_baseTexture) {
                console.log('_baseTexture.isLoading:',_baseTexture.isLoading);
                if (_baseTexture.isLoading) {
                    _baseTexture.on('loaded', function () {
                        console.log('_baseTexture loaded:',_baseTexture.isLoading);
                        buildSpriteBox(_obj, _box);
                        _self.ds('loaded');
                    });
                } else {
                    buildSpriteBox(_obj, _box);
                    _self.ds('loaded');
                }
            } else {

            }
            return _box;
        }
        //这是处理传入的是url与PIXI.Texture类型的拖拽处理对象
        function buildSpriteBox(sprite, box) {

            box.addChild(sprite);
            box.sprite = sprite;

            if (_width !== null && _height !== null) {
                _baseTexture = sprite.texture.baseTexture;
                var _sw = _width / _baseTexture.width, _sh = _height / _baseTexture.height;
                var _ss = 1;
                if (_layoutType == 'inSide') _ss = Math.min(_sw, _sh);
                else _ss = Math.max(_sw, _sh);

                sprite.width = _ss * _baseTexture.width;
                sprite.height = _ss * _baseTexture.height;

                sprite.x = -sprite.width / 2;
                sprite.y = -sprite.height / 2;
                box.x = _width / 2;
                box.y = _height / 2;
            }
        }

        /**
         * 添加拖拽事件
         * @param displayObject
         */
        function addDragEvent(displayObject) {
            displayObject.interactive = true;
            displayObject.cursor = 'pointer';
            displayObject.draging = 0;
            displayObject.on('pointerdown', onDragStart);
        }

        /**
         * 删除拖拽事件
         * @param displayObject
         */
        function removeDragEvent(displayObject) {
            displayObject.off('pointerdown', onDragStart);
        }
        //开始拖动
        function onDragStart(e) {
            if (_look) return;
            if(!_drag)return;
            var _obj = e.currentTarget;
            _obj.dragData = e.data;
            //记录拖动状态
            _obj.draging = 1;
            //鼠标指针转换成相对父亲内坐标
            _obj.dragPointerStart = e.data.getLocalPosition(_obj.parent);
            _obj.dragGlobalStart = new PIXI.Point();
            //记录全局坐标坐标
            _obj.dragGlobalStart.copy(e.data.global);
            _obj.dragObjStart = new PIXI.Point();
            //记录显示对象相对父亲的坐标
            _obj.dragObjStart.copy(_obj.position);
            // _obj.emit('dragDown', e);
            _obj.on('pointerup', onDragEnd)
                .on('pointerupoutside', onDragEnd)
                .on('pointermove', onDragMove);
        }
        //拖动
        function onDragMove(e) {
            if (_look) return;
            if(!_drag)return;
            var _obj = e.currentTarget;
            if (!_obj.draging) return;
            var _data = _obj.dragData;
            if (_obj.draging == 1) {
                //开始拖动  判断 x  y偏移和超过3 说明开始拖动
                if (Math.abs(_data.global.x - _obj.dragGlobalStart.x) + Math.abs(_data.global.y - _obj.dragGlobalStart.y) >= 3) _obj.draging = 2;
                // _obj.emit('dragStart', e);
            }
            //已经开始拖动
            if (_obj.draging == 2) {
                //鼠标指针转换成相对父亲内坐标
                var _dragPointerEnd = _data.getLocalPosition(_obj.parent);
                // 开始拖动
                var _x = _obj.dragObjStart.x + (_dragPointerEnd.x - _obj.dragPointerStart.x);
                var _y = _obj.dragObjStart.y + (_dragPointerEnd.y - _obj.dragPointerStart.y);
                if (_dragRect && _rectBool) {
                    _x = Math.max(_dragRect.x, _x);
                    _x = Math.min(_dragRect.x + _dragRect.width, _x);
                    _y = Math.max(_dragRect.y, _y);
                    _y = Math.min(_dragRect.y + _dragRect.height, _y);
                    // console.log(_x,_y);
                    _obj.position.set(_x, _y);
                } else {
                    _obj.position.set(_x, _y);
                }
                // _obj.emit('draging', e);
            }
        }
        //完成拖动
        function onDragEnd(e) {
            var _obj = e.currentTarget;
            if (_look) return;
            _obj.draging = 0;
            _obj.dragData = null;
            // _obj.emit('dragEnd', e);
            _obj.off('pointerup', onDragEnd)
                .off('pointerupoutside', onDragEnd)
                .off('pointermove', onDragMove);
            e.stopPropagation();
        }

        /**
         * 保存出图片
         * @returns {*}
         */
        this.saveToBase64 = function (opts) {
            opts = opts || {};
            var _base64;
            if (_width !== null && _height !== null) {
                DsPixi.GetSaveImageBase64(_container, {
                    type: 'png',
                    width: _width,
                    height: _height,
                    debug: opts.debug ? true : false,
                });
            }
            return _base64;
        };

        this.saveToSprite = function () {

        };

        function getHTMLElement(dom) {
            if (dom instanceof HTMLElement) return dom;
            else if (!(dom instanceof HTMLElement) && (dom[0] instanceof HTMLElement)) return dom[0];
            else return null;
        }

    }

    return DragAndZoomer;
}));