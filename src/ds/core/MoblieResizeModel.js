//这个类使用老js方法，有可能直接插入html标签内使用
!(function (factory) {

    var root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

    if (typeof define === 'function' && define.amd) {

        define(['exports'], function (exports) {

            module.exports = factory(root, exports);

        });
    } else if (typeof exports !== 'undefined') {

        module.exports = factory(root, exports);

    } else {

        factory(root);

    }

}(function (root, model) {

    var _os = 'ios';
    if (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) _os = 'ios';
    else _os = (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux')) ? 'android' : 'pc';


    /**
     * 手机端屏幕自适应模块
     * @class ds.core.MoblieResizeModel
     * @classdesc:一个适合制作自适应、横屏、竖屏、横竖屏混合互动H5的屏幕尺寸算法模块。
     * @param {object} [opts] - 设置自适应模块初始化参数
     * @param {HTMLElement | string} [opts.screen='#screen'] - 屏幕自适应进行缩放的html元素,也可以是一个html元素的id值
     * @param {string} [opts.type='v'] - 屏幕自适应方式分别是 竖屏'v' 横屏'h' 自动'auto'。默认竖屏幕 'v'
     * @param {array} [opts.widths=[640,1138]] - 屏幕设定固定宽自适应计算设置，默认值 [640,1138]。 自适应框架是以屏幕设定固定宽进行等比换算高
     * @param {number} [opts.delay=100] - 微信下旋转后自适应响应时间慢，设置合理delay 强制执行一次reisze（特别是load 过程中）
     * @extends ds.core.EventDispatcher
     */
    function MoblieResizeModel(opts) {

        opts = opts || {};

        var _self = this;

        ds.EventDispatcher.extend(this);

        var _resizeDelay=opts.delay||100;


        var _screen, _type, _widths, _orientationTip;

        /**
         * 进行自适应的场景div容器
         * @member {HTMLElement} ds.core.MoblieResizeModel.prototype.screen
         */
        Object.defineProperty(this, "screen", {
            get: function () {
                return _screen;
            }
        });

        /**
         * 自适应类型 竖屏 'v' 横屏 'h' 横竖屏切换 'auto'
         * @member {string} ds.core.MoblieResizeModel.prototype.type
         */
        Object.defineProperty(this, "type", {
            get: function () {
                return _type;
            }
        });

        _widths = opts.widths || [640, 1138];

        _type = opts.type !== undefined ? opts.type : 'v';

        _screen = opts.screen ? opts.screen : document.getElementById('screen');
        if (typeof _screen === 'string') _screen = document.getElementById(_screen);


        /**
         * 自适应时候进行横竖屏显示提示
         * @member {string} ds.core.MoblieResizeModel.prototype.orientationTip
         */
        Object.defineProperty(this, "orientationTip", {
            get: function () {
                return _orientationTip;
            }
        });
        /**
         * 创建一个自适应提示元素
         * @method ds.core.MoblieResizeModel.prototype.createOrientationTip
         * @function
         * @return {HTMLElement} 横竖屏提示界面html元素
         */
        this.createOrientationTip = function () {

            if (!_orientationTip) {

                var html = ['<style type="text/css">', '@-webkit-keyframes orientRotation {', '    10% {', '        transform: rotate(90deg);', '        -webkit-transform: rotate(90deg)', '    }', '    50%, 60% {', '        transform: rotate(0deg);', '        -webkit-transform: rotate(0deg)', '    }', '    90% {', '        transform: rotate(90deg);', '        -webkit-transform: rotate(90deg)', '    }', '    100% {', '        transform: rotate(90deg);', '        -webkit-transform: rotate(90deg)', '    }', '}', '@keyframes orientRotation {', '    10% {', '        transform: rotate(90deg);', '        -webkit-transform: rotate(90deg)', '    }', '    50%, 60% {', '        transform: rotate(0deg);', '        -webkit-transform: rotate(0deg)', '    }', '    90% {', '        transform: rotate(90deg);', '        -webkit-transform: rotate(90deg)', '    }', '    100% {', '        transform: rotate(90deg);', '        -webkit-transform: rotate(90deg)', '    }', '}', '#orientLayer {', '    display: none;', '}', '@media screen and (min-aspect-ratio: 12/7) {', '    #orientLayer {', '        display: block;', '    }', '}', '.mod-orient-layer {', '    display: none;', '    position: fixed;', '    height: 100%;', '    width: 100%;', '    left: 0;', '    top: 0;', '    right: 0;', '    bottom: 0;', '    background: #333;', '    z-index: 9997', '}', '.mod-orient-layer__content {', '    position: absolute;', '    width: 100%;', '    top: 45%;', '    margin-top: -75px;', '    text-align: center;', '}', '.mod-orient-layer__icon-orient {', '    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIYAAADaCAMAAABU68ovAAAAXVBMVEUAAAD29vb////x8fH////////x8fH5+fn29vby8vL////5+fn39/f6+vr////x8fH////////+/v7////09PT////x8fH39/f////////////////////x8fH///+WLTLGAAAAHXRSTlMAIpML+gb4ZhHWn1c2gvHBvq1uKJcC6k8b187lQ9yhhboAAAQYSURBVHja7d3blpowFIDhTUIAOchZDkre/zE7ycySrbUUpsRN2/1fzO18KzEqxEVgTiZNfgmmtxRc8iaR8HNe8x4BtjQePKayYCIoyBSgvNNE1AkNSHqZyLqk97EgUCCHBzZ5mkg7ScvIJuIyOyXBRFxgpqWZyGsAZLB1KjsJi8nutHU4JCRbFRH8tmirI9k8Jx2sqNs8K/m0LQkrktO2crgcgXGB4AiTEsB0hJfo9MGgX7CGcYiYwQxmMOOvZwRhBG8tCoMXjBDeXvWCEcHbi14wgCBmMIMZzGAGM5jxETNwzMAxA8cMHDNwzMAxA8cMHDNwzMAxA8cMHDNwzMAxY6E2rUQxnH2tz9cirlJFwFBJedaPnUv0M7++egPDE8iAJcIDmxwH5wwv9vUviw2kLbVO3TJU5uul/EyB0FoLp4x60PdGUd3qPurrWyjGGTc05u+1dcgI7/+tCCPARWGhH7o5Y7RCf+bH9ctXLp6v2BVDxfqz0oPXeSVaNtINo/1SXDv4dck8IIkbhtC2ol+iouEonTBCbYvVMnXOjxww6s/RFrBUpXHh/gw1rHj5d/qhYn9Gpk2FWh6xRBRX5Oj3Znh2Sq49/L6+y8pB26q9GbE2dbA2mVbx6I+7MfBglLCttm73ZQi7AD3iL4HqjFYJHSPRppqaUaJ3ATpGa+ckpGak2hRRMyqjGMkvl+xyFeSMwjAqcsZgGDdyhl0oNTnDN4yenJGZFGxNChP5/Y3efh6SM2rDOJMzboYxkDMqwyjIGcIw6F+io2FU1IxIm1JqRmgXSkvNKNCXeTpGrU0JNSO2c6LIGPgCS8AuDHz9ta0SXWDtxoDRH+MqlbC2Dt2G2JFRadtQZt2qq/orGowdGb2euxYiqWEpVWhTBnszoNAPdStuQwxqf0aocdWKW4Z+DfszIh8pxJqbuCE4YAC+4bm0evtipjpgJHeFnyyt1Ku2xa0bhjxr27p75rECNwyI9ZwvXkHq+7aTaMEV44YYy/spfgjgjNHaWW+GeUhGEX7tLlVinIFDDSgnOwhi1V6bU0b6tVS9eAERe863g4dRrtiHdc6o+nn5vtyVVgR79Cqt4uL6gfHPQyGqtP2vf7HADGbcYwaOGThm4JiBYwaOGThm4JiBYwaOGThm4JiBYwaOGThm4JiBYwaOGThm4JjhtOM+J/AgT008yDMkN/dPP9hzS8zAMQN3OEYeekp5YU7KOKXwVXqiY+QS7smcinGKABWdiBgpPJTSMHJ4KidhhPBUSMLw4CmPhKHgKUXCkHsygum71ftNSgCX6bsl8FQyfbcL5EdYsDk0R3j7aiA5wpt5AjKg/2gLJEBD/0Hf2OOf/vRrj6z/7GtP4B3nMKyjHA12kIPSjnJs3FEO0TvKkYJHOWCR+rjJH0Vn6fI5PjNbAAAAAElFTkSuQmCC");', '    display: inline-block;', '    width: 67px;', '    height: 109px;', '    transform: rotate(90deg);', '    -webkit-transform: rotate(90deg);', '    -webkit-animation: orientRotation infinite 1.5s ease-in-out;', '    animation: orientRotation infinite 1.5s ease-in-out;', '    -webkit-background-size: 67px;', '    background-size: 67px', '}', '.mod-orient-layer__desc {', '    margin-top: 20px;', '    font-size: 15px;', '    color: #fff', '}', '</style>', '<div id="orientLayer" class="mod-orient-layer">', '    <div class="mod-orient-layer__content">', '       <i class="icon mod-orient-layer__icon-orient"></i>', '        <div class="mod-orient-layer__desc">为了更好的体验，请使用竖屏浏览</div>', '    </div>', '</div>'].join("");
                _orientationTip = $(html);

            }

            if (_type === 'auto') {

                _orientationTip.remove();

            } else {

                $('body').append(_orientationTip);
                if (_type === 'v') $('#orientLayer .mod-orient-layer__desc').text('为了更好的体验，请使用竖屏浏览');
                else $('#orientLayer .mod-orient-layer__desc').text('为了更好的体验，请使用横屏浏览');

            }

            return _orientationTip;
        };

        /**
         * 显示提示
         * @method ds.core.MoblieResizeModel.prototype.showOrientationTip
         * @param {boolean} [bool=true]  竖屏提示
         * @function
         */
        this.showOrientationTip=function (bool) {

            if(!_orientationTip)return;

            bool=bool!==undefined?bool:true;

            $('body').append(_orientationTip);

            if (bool) _orientationTip.find('.mod-orient-layer__desc').text('为了更好的体验，请使用竖屏浏览');
            else _orientationTip.find('.mod-orient-layer__desc').text('为了更好的体验，请使用横屏浏览');

        };
        /**
         * 隐藏提示
         * @method ds.core.MoblieResizeModel.prototype.hideOrientationTip
         * @function
         */
        this.hideOrientationTip=function () {

            if(!_orientationTip)return;
            _orientationTip.remove();

        };

        var _width,
            _height,
            _screenWidth,
            _pageScale,
            _actualH,
            _horizontal = false,
            _isInputState = false,
            _densityDpi = 1,
            _oldActualH,
            _oldInputState = false;

        /**
         * 屏幕宽
         * @member {number} ds.core.MoblieResizeModel.prototype.width
         */
        Object.defineProperty(this, "width", {get: function () {return _width;}});

        /**
         * 屏幕高
         * @member {number} ds.core.MoblieResizeModel.prototype.height
         */
        Object.defineProperty(this, "height", {get: function () {return _height;}});

        /**
         * 实际场景宽
         * @member {number} ds.core.MoblieResizeModel.prototype.screenWidth
         */
        Object.defineProperty(this, "screenWidth", {get: function () {return _screenWidth;}});

        /**
         * 页面缩放比例
         * @member {number} ds.core.MoblieResizeModel.prototype.pageScale
         */
        Object.defineProperty(this, "pageScale", {get: function () {return _pageScale;}});

        /**
         * 页面实际高度
         * @member {number} ds.core.MoblieResizeModel.prototype.actualH
         */
        Object.defineProperty(this, "actualH", {get: function () {return _actualH;}});

        /**
         * 页面是否横屏
         * @member {boolean} ds.core.MoblieResizeModel.prototype.horizontal
         */
        Object.defineProperty(this, "horizontal", {get: function () {return _horizontal;}});

        /**
         * 页面是否输入状态下
         * @member {boolean} ds.core.MoblieResizeModel.prototype.isInputState
         */
        Object.defineProperty(this, "isInputState", {get: function () {return _isInputState;}});

        /**
         * 页面viewport设置的densityDpi
         * @member {number} ds.core.MoblieResizeModel.prototype.densityDpi
         */
        Object.defineProperty(this, "densityDpi", {get: function () {return _densityDpi;}});

        /**
         * 页面改变前实际高
         * @member {number} ds.core.MoblieResizeModel.prototype.oldActualH
         */
        Object.defineProperty(this, "oldActualH", {get: function () {return _oldActualH;}});

        /**
         * 页面改变是否在输入状态
         * @member {boolean} ds.core.MoblieResizeModel.prototype.oldInputState
         */
        Object.defineProperty(this, "oldInputState", {get: function () {return _oldInputState;}});

        /**
         * 初始化启动自适应计算
         * @method ds.core.MoblieResizeModel.prototype.initResize
         * @function
         */
        this.initResize = function () {

            $(window).resize(function () {

                _self.resize();
                setTimeout(function () {
                    _self.resize();
                }, _resizeDelay);

            });

            //部分手机自适应会有问题
            setTimeout(function () {
                _self.resize();
            }, _resizeDelay);

            _self.resize();

        };

        /**
         * 自适应计算，一般不使用。如果需要强制执行一次自适应时候使用
         * @method ds.core.MoblieResizeModel.prototype.resize
         * @function
         */
        this.resize = function () {

            _oldActualH = _actualH;
            _oldInputState = _isInputState;

            //重置viewport
            _densityDpi = ds.core.MoblieResizeModel.resetViewporte();
            //自适应后的相关数据
            var _resizeData = ds.core.MoblieResizeModel.getResizeData(_type,_widths);

            _width = _resizeData.width;
            _height = _resizeData.height;
            _isInputState = _resizeData.isInputState;
            _horizontal = _resizeData.horizontal;
            _pageScale = _resizeData.pageScale;
            _actualH = _resizeData.actualH;
            _screenWidth = _resizeData.screenWidth;

            if(!_oldActualH)_oldActualH=_actualH;

            //设置场景宽高
            if (_screen) {

                var _resizeObj={
                    "-webkit-transform-origin": '0 0',
                    "transform-origin": '0 0',
                    "-webkit-transform": "scale(" + _pageScale + ")",
                    "transform": "scale(" + _pageScale + ")",
                    "width": _screenWidth + 'px',
                    "height": _actualH + 'px'
                };

                //判断输入宽情况下
                if(_isInputState&&_oldInputState!==_isInputState)_resizeObj.height=_oldActualH+ 'px';

                $(_screen).css(_resizeObj);

                //输入情况下进行滚动
                if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {

                    window.setTimeout(function() {document.activeElement.scrollIntoViewIfNeeded();},0);

                }

            }

            //自适应提示界面
            if(_orientationTip&&_type!=='auto'){

                if (_type === 'v') {

                    if (_horizontal) $('#orientLayer').css({'display': 'block'});
                    else $('#orientLayer').css({'display': 'none'});

                } else {

                    if (_horizontal) $('#orientLayer').css({'display': 'none'});
                    else $('#orientLayer').css({'display': 'block'});

                }

            }

            /**
             * 自适应 resize
             * @event  ds.core.MoblieResizeModel#resize
             */
            this.ds('resize');

        };

    }

    /**
     * 获取自适应计算后数据
     * @method ds.core.MoblieResizeModel.getResizeData
     * @param {string} [type='auto'] 自适应的方式
     * @param {array} [widhts=[640, 1138]] 自适应宽高比
     * @return {object} 自适应计算后相关数据
     */
    MoblieResizeModel.getResizeData = function (type, widhts) {

        var _width, _height, _screenWidth, _pageScale, _actualH, _horizontal = false, _isInputState = false;
        //获取屏幕宽高
        _width = window.innerWidth;
        _height = window.innerHeight;


        //计算是否横屏
        if (_width > _height) _horizontal = true;
        else _horizontal = false;

        //判断输入框状态 与 输入框状态获取与横竖屏幕纠正;
        if (_width / _height > 3) {

            //算出竖屏幕下输入框状态下比例
            _isInputState = true;

        } else if (_width / _height < 640 / 400 && _width / _height > 1) {

            //算出竖屏幕下输入框状态下比例
            _isInputState = true;
            //说明这时候不会是横屏
            _horizontal = false;

        } else {

            //非输入状态
            _isInputState = false;

        }

        //按屏幕方式进行计算使用等比缩放使用的宽
        type = type || 'auto';
        widhts = widhts || [640, 1138];

        if (type === 'auto') {

            if (_horizontal) _screenWidth = widhts[1];
            else _screenWidth = widhts[0];

        } else if (type === 'h') {

            _screenWidth = widhts[1];

        } else {

            _screenWidth = widhts[0];

        }
        //计算缩放比例
        _pageScale = _width / _screenWidth;
        //计算实际高度
        _actualH = _height / _pageScale;

        return {
            width: _width,
            height: _height,
            horizontal: _horizontal,
            isInputState: _isInputState,
            pageScale: _pageScale,
            actualH: _actualH,
            screenWidth: _screenWidth,
        };

    };
    /**
     * 根据当前页面情况进行重置 viewporte
     * @method ds.core.MoblieResizeModel.resetViewporte
     * @return {number} viewport的densityDpi
     */
    MoblieResizeModel.resetViewporte = function () {

        //判断浏览器类型
        var ua = navigator.userAgent.toLowerCase();

        var _isWeixin = false;
        if (ua.match(/MicroMessenger/i) == "micromessenger") _isWeixin = true;

        var _viewport = document.querySelector("meta[name=viewport]");
        var _winWidth = window.innerWidth;
        var _densityDpi = 640 / _winWidth;

        _densityDpi = (_densityDpi > 1 ? 300 * 640 * _densityDpi / 640 : _densityDpi) >> 0;

        if (_isWeixin) {
            // _viewport.setAttribute('content', 'width=640, target-densityDpi='+_densityDpi+',user-scalable=no');
            if (_os === 'ios') {
                // console.log(_densityDpi);
                // _viewport.setAttribute('content', 'target-densitydpi=device-dpi,maximum-scale=1.0, user-scalable=no');
                _viewport.setAttribute('content', 'target-densityDpi=' + _densityDpi + ',initial-scale=1.0, maximum-scale=1.0,user-scalable=no');
                //  _viewport.setAttribute('content', 'width='+_winWidth+',target-densityDpi='+_densityDpi+',initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                //  _viewport.setAttribute('content', 'width=device-width,target-densityDpi='+_densityDpi+',initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            } else {
                // _viewport.setAttribute('content', 'target-densityDpi=' + _densityDpi + ',initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                // _viewport.setAttribute('content', 'width=device-width,target-densityDpi=' + _densityDpi + ',initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                _viewport.setAttribute('content', 'width=640,target-densityDpi=' + _densityDpi + ',user-scalable=no');
            }
        } else {
            _viewport.setAttribute('content', 'width=640, user-scalable=no');
            //window.setTimeout(function(){_viewport.setAttribute('content', 'width=640, user-scalable=yes');},1000);
        }
        return _densityDpi;
    };


    var ds = root.ds = root.ds || {};
    ds.core = ds.core || {};
    ds.core.MoblieResizeModel = MoblieResizeModel;

    return ds.core.MoblieResizeModel;

}));