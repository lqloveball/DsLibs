!(function (factory) {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);

    if (typeof define === 'function' && define.amd) {
        define(['exports'], function (exports) {
            //基于shrek的图片选择上传控件
            require('libs/shrek/imgslterV.js');
            module.exports = factory(root, exports);
        });
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(root, exports);
    } else {
        factory(root, {});
    }

}(function (root, modelObj) {
    root.Ds = root.Ds || {};
    root.Ds.gemo = root.Ds.gemo || {};
    Ds.gemo.SelectUpImager = SelectUpImager;

    /**
     * 快速图片上传选择器
     * @param {[Number]} size  [图片选择器对图片大小进行压缩size]
     * @param {[HTMLElement createjs.Container PIXI.Container ]} addToContainer [选择的图片添加什么容器内]
     * @param {[Object]} opts  [选择器配置参数]
     * opts.layoutType  默认：'outSide' 撑满容器 'inSide' 缩放到容器内
     * opts.width  缩放显示区域
     * opts.height  缩放显示区域
     * opts.type  上传图片压缩类型 默认'jpg'
     * opts.quality  上传图片压缩质量 默认0.5
     * opts.clear    选择后图片 添加到容器内时候是否清空容器
     * opts.clickDelay   点击选择延迟
     *
     * @constructor
     */
    function SelectUpImager(size, addToContainer, opts) {
        var _self = this;
        Ds.Extend(this, new Ds.EventDispatcher());
        opts = opts || {};
        //选择图片缩放在什么区域范围
        var _size = size || 1100;
        //压缩后图片类型 jpg 或者 png
        var _type = opts.type || 'jpg';
        //如果是jpg 质量设置
        var _quality = opts.quality || 0.5;
        //outSide撑满容器 inSide缩放到容器内
        var _layoutType = opts.layoutType !== undefined ? opts.layoutType : 'outSide';
        //进行缩放大小
        var _width = opts.width !== undefined ? opts.width : null;
        //进行显示容器区域
        var _height = opts.height !== undefined ? opts.height : _width;
        //是否自动清空容器 默认是清空
        var _clear = opts.clear !== undefined ? opts.clear : true;
        //点击选择延迟
        var _clickDelay = opts.clickDelay !== undefined ? opts.clickDelay : 2*1000;
        //点击计时
        var _time=new Date().getTime()-_clickDelay;
        //图片选择器
        var _selectImager;
        //图片选择器
        Object.defineProperty(this, "selectImager", {
            get: function () {
                return _selectImager;
            },
        });
        //图片选择器的DOM
        Object.defineProperty(this, "selectDOM", {
            get: function () {
                return _selectImager.el;
            },
        });

        //创建一个选择器
        createSelectImager();


        /**
         * 选择上传
         */
        this.select = function () {
            if(new Date().getTime()-_time<_clickDelay)return;
            _time=new Date().getTime();
            _selectImager.select();
        };

        /**
         * 创建一个选择器
         */
        function createSelectImager() {
            _selectImager = new ImgSlter({
                size: _size,
                type: _type,
                quality: _quality,
            });
            _selectImager.handler = upImageData;

            _time=new Date().getTime()-_clickDelay;

            _self.ds({
                type: 'selectImager',
                //选择器
                select: _selectImager,
                //选择器dom元素
                el:_selectImager.el,
                //选择器id
                elID:_selectImager.el.id,
            });

        }


        /**
         * 选择器选择图片完成后
         * @param data
         */
        function upImageData(data) {
            // console.log('upImageData:', data);
            var _img = new Image();
            var _base64 = data.img;
            _img.onload = loadEnd;
            var _scale = 1;

            function loadEnd() {
                if (_width !== null && _height !== null) {
                    var _w = _width, _h = _height;
                    var _sw = _w / _img.width, _sh = _h / _img.height;
                    if (_layoutType == 'inSide') _scale = Math.min(_sw, _sh);
                    else _scale = Math.max(_sw, _sh);
                }

                //根据需要被添加到容器，判断需要转换这个上传图片创建对象类型
                var _objType = '';
                //根据容器类型创建需要的对象
                var _obj;
                if (window['createjs'] && addToContainer && (addToContainer instanceof createjs.Container)) {
                    _objType = 'createjs';
                }
                else if (window['PIXI'] && addToContainer && (addToContainer instanceof PIXI.Container)) {
                    _objType = 'pixi';
                }else if(addToContainer&&getHTMLElement(addToContainer) instanceof HTMLElement){
                    _objType = 'div';
                }

                console.log('_objTyp：',_objType);
                if (_objType == 'div') {
                    //TODO 准备之后进行实现
                }
                else if (_objType == 'createjs') {
                    //属于createjs类型进行创建对象
                    var _bitmap = new createjs.Bitmap(_img);
                    var _box = new createjs.Container();
                    _box.addChild(_bitmap);
                    _box.bitmap = _bitmap;
                    _bitmap.scaleX = _bitmap.scaleY = _scale;
                    _box.width = _bitmap.width = _img.width * _scale;
                    _box.height = _bitmap.height = _img.height * _scale;
                    if (_width !== null && _height !== null) {
                        _bitmap.x = -_bitmap.width / 2;
                        _bitmap.y = -_bitmap.height / 2;
                        _box.x = _width / 2;
                        _box.y = _height / 2;
                    }
                    if (addToContainer) {
                        if (_clear) addToContainer.removeAllChildren();
                        addToContainer.addChild(_box);
                    }
                    _obj = _box;
                }
                else if (_objType == 'pixi') {
                    var _box = new PIXI.Container();
                    var _sprite = new PIXI.Sprite(PIXI.Texture.fromLoader(_img));
                    _box.addChild(_sprite);
                    _box.sprite = _sprite;

                    var _baseTexture=_sprite.texture.baseTexture;
                    _sprite.width=_baseTexture.width*_scale;
                    _sprite.height=_baseTexture.height*_scale;

                    _sprite.scale.set(_scale);
                    if (_width !== null && _height !== null) {
                        _sprite.x = -_sprite.width / 2;
                        _sprite.y = -_sprite.height / 2;
                        _box.x = _width / 2;
                        _box.y = _height / 2;
                    }
                    if (addToContainer) {
                        if (_clear) addToContainer.removeChildren();
                        addToContainer.addChild(_box);
                    }
                    _obj = _box;
                }
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
                    //创建出来显示对象
                    obj: _obj
                });
            }

            _img.src = _base64;
            _selectImager.destroy();
            createSelectImager();
        }

        function getHTMLElement(dom) {
            if (dom instanceof HTMLElement) return dom;
            else if (!(dom instanceof HTMLElement) && (dom[0] instanceof HTMLElement)) return dom[0];
            else return null;
        }


    }

    return Ds.gemo.SelectUpImager;
}));