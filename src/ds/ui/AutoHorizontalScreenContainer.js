!(function (factory) {

    var root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);


    if (typeof define === 'function' && define.amd) {

        define(['exports'], function (exports) {

            module.exports = factory(root, exports);

        });
    } else if (typeof exports !== 'undefined') {

        module.exports = factory(root, exports);

    } else {

        factory(root, {});

    }

}(function (root, Model) {

    var ds = root.ds = root.ds || {};
    ds.ui = ds.ui || {};

    ds.ui.AutoHorizontalScreenContainer = AutoHorizontalScreenContainer;

    /**
     * DOM 强制横屏自适应
     * @class ds.ui.AutoHorizontalScreenContainer
     * @param {HTMLElement|string} dom 需要转换成强制横屏的dom容器，不传会自动创建一个
     * @requires zepto.js 或者 jquery.js
     */
    function AutoHorizontalScreenContainer(dom) {

        var _self = this;

        ds.EventDispatcher.extend(this);

        var _el;
        /**
         * dom容器
         * @member {HTMLElement} ds.ui.AutoHorizontalScreenContainer.prototype.el
         */
        Object.defineProperty(this, "el", {
            get: function () {
                return _el;
            },
        });

        if (dom === undefined) _el = $(document.createElement('div'));
        else _el = $(dom);

        var _css = {
            "-webkit-transform-origin": '0 0',
            "transform-origin": '0 0',
            position: 'absolute',
            left: 0,
            top: 0,
            overflow: 'hidden',
        };

        _el.css(_css);


        var _widths=[640, 1138];
        var _width, _height, _actualH, _pageScale, _isInputState, _horizontal, _screenWidth, _densityDpi;

        /**
         * 自适应方法
         * @method ds.ui.AutoHorizontalScreenContainer.prototype.resize
         * @function
         */
        this.resize = function () {

            if (SiteModel && SiteModel.resizeModel) {
                var _resizeModel = SiteModel.resizeModel;
                _width = _resizeModel.width;
                _height = _resizeModel.height;
                _actualH = _resizeModel.actualH;
                _pageScale = _resizeModel.pageScale;
                _isInputState = _resizeModel.isInputState;
                _horizontal = _resizeModel.horizontal;
                _screenWidth = _resizeModel.screenWidth;
                _densityDpi = _resizeModel.densityDpi;


            } else {

                //重置viewport
                _densityDpi = ds.core.MoblieResizeModel.resetViewporte();
                //自适应后的相关数据
                var _resizeData = ds.core.MoblieResizeModel.getResizeData('auto', _widths);

                _width = _resizeData.width;
                _height = _resizeData.height;
                _isInputState = _resizeData.isInputState;
                _horizontal = _resizeData.horizontal;
                _pageScale = _resizeData.pageScale;
                _actualH = _resizeData.actualH;
                _screenWidth = _resizeData.screenWidth;

            }




            if (_screenWidth == 1138) {

                _self.width = _screenWidth;
                _self.height = _actualH;
                _el.css({
                    "-webkit-transform": 'rotate(0deg)',
                    "-moz-transform": 'rotate(0deg)',
                    "transform": 'rotate(0deg)',
                });

            }else{

                _self.width = _actualH;
                _self.height = _screenWidth;
                _el.css({
                    "-webkit-transform": 'rotate(90deg) translate(0px,-'+_self.height+'px)',
                    "-moz-transform": 'rotate(90deg) translate(0px,-'+_self.height+'px)',
                    "transform": 'rotate(90deg) translate(0px,-'+_self.height+'px)',
                });

            }

            _el.css({
                width: _self.width,
                height: _self.height
            });

            /**
             * 自适应更新
             * @event ds.ui.AutoHorizontalScreenContainer#resize
             */
            _self.ds('resize');


        };

        function iniResize() {

            //如果是在项目框架下 应该会有SiteModel ，直接使用SiteModel.resizeModel自适应计算
            if (SiteModel && SiteModel.resizeModel) {

                SiteModel.resizeModel.on('resize', _self.resize);

            }
            else {

                //监听屏幕尺寸变化
                $(window).resize(function () {

                    setTimeout(function () {
                        _self.resize();
                    }, 200);
                    _self.resize();

                });
            }
            //马上计算屏幕现实状态
            _self.resize();

        }

        iniResize();


    }


    return ds.ui.AutoHorizontalScreenContainer;
}));