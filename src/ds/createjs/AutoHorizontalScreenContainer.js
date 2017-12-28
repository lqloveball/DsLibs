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
    ds.createjs = ds.createjs || {};

    ds.createjs.AutoHorizontalScreenContainer = AutoHorizontalScreenContainer;

    /**
     * createjs 强制横屏自适应容器
     * @class  ds.createjs.AutoHorizontalScreenContainer
     *
     */
    function AutoHorizontalScreenContainer() {

        this.Container_constructor();

        var _self = this;


        var _widths=[640, 1138];
        var _width, _height, _actualH, _pageScale, _isInputState, _horizontal, _screenWidth, _densityDpi;

        /**
         * 自适应方法
         * @method ds.createjs.AutoHorizontalScreenContainer.prototype.resize
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

            _self.width = _screenWidth;
            _self.height = _actualH;

            if (_screenWidth == 1138) {

                _self.rotation = 0;
                _self.x = 0;

            }else{

                _self.rotation = 90;
                _self.x = 640;

            }


            /**
             * 自适应更新
             * @event ds.createjs.AutoHorizontalScreenContainer#resize
             */
            _self.dispatchEvent('resize');


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

                //马上计算屏幕现实状态
                _self.resize();

            }

        }

        iniResize();


    }
    createjs.extend(AutoHorizontalScreenContainer, createjs.Container);
    createjs.promote(AutoHorizontalScreenContainer, "Container");


    return ds.createjs.AutoHorizontalScreenContainer;
}));