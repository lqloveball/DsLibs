/**
 * @class Ds.ui.HorizontalScreenAutoContainer
 * @classdesc: 强制横屏容器 Dom
 * @extends
 * @example:
 * var _Container =new Ds.ui.HorizontalScreenAutoContainer('#autoContainer');
 *
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright: Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
(function(factory) {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);

    if (typeof define === 'function' && define.amd) {
        define(['exports'], function(exports) {
            module.exports = factory(root, exports);
        });
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(root, exports);
    } else {
        factory(root, {});
    }

}(function(root, modelObj) {
    root.Ds = root.Ds || {};
    root.Ds.ui = root.Ds.ui || {};
    root.Ds.ui.HorizontalScreenAutoContainer = HorizontalScreenAutoContainer;

    function HorizontalScreenAutoContainer(dom) {
        var _Self = this;
        Ds.Extend(this, new Ds.EventDispatcher());
        var _Container = $(dom);
        _Container.css({
            "-webkit-transform-origin": '0 0',
            "transform-origin": '0 0',
            position: 'absolute',
            left: 0,
            top: 0,
            overflow: 'hidden',
        });

        //宽 高 是否横屏  是否输入  屏幕计算用的宽 屏幕缩放尺寸
        var _Width, _Height, _Horizontal = false,
            _IsInputState = false,
            _ScreenWidth = 640,
            _PageScale;

        this.Resize = function() {

            _Width = window.innerWidth; //获取到window宽
            _Height = window.innerHeight; //获取到window高;
            //计算是否横屏
            if (_Width > _Height) _Horizontal = true;
            else _Horizontal = false;
            //计算是否在输入框情况下
            if (_Width / _Height < 12 / 7 && _Width / _Height > 1) _IsInputState = true;
            else _IsInputState = false;

            if (_Horizontal && !_IsInputState) {
                _ScreenWidth = 1138;
            } else {
                _ScreenWidth = 640;
            }
            _PageScale = _Width / _ScreenWidth;
            //计算实际高度
            _ActualH = _Height / _PageScale;
            //进行开放事件给外部
            _Self.PageScale = _PageScale;
            _Self.ScreenWidth = _ScreenWidth;
            _Self.IsInputState = _IsInputState;
            if (_ScreenWidth == 1138) {
                _Self.Width = _ScreenWidth;
                _Self.Height = _ActualH;
                _Container.css({
                    "-webkit-transform": 'rotate(0deg)',
                    "-moz-transform": 'rotate(0deg)',
                    "transform": 'rotate(0deg)',
                });

            } else {
                _Self.Width = _ActualH;
                _Self.Height = _ScreenWidth;
                _Container.css({
                    "-webkit-transform": 'rotate(90deg) translate(0px,-640px)',
                    "-moz-transform": 'rotate(90deg) translate(0px,-'+_Self.Height+'px)',
                    "transform": 'rotate(90deg) translate(0px,-'+_Self.Height+'px)',
                });
            }
            _Container.css({
                width: _Self.Width,
                height: _Self.Height
            });
            _Self.dispatchEvent('Resize');
        };
        //监听屏幕尺寸变化
        $(window).resize(function() {
            setTimeout(function(){_Self.Resize();},100);
            _Self.Resize();
        });
        //马上计算屏幕现实状态
        _Self.Resize();
    }

    return Ds.ui.HorizontalScreenAutoContainer;
}));
