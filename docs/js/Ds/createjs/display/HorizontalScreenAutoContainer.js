/**
 * @class Ds.createjs.display.HorizontalScreenAutoContainer
 * @classdesc: 强制横屏容器 继承createjs.Container
 * @extends
 * @example:
 * var _Container =new Ds.createjs.display.HorizontalScreenAutoContainer();
 * _Root.addChild(_Container);
 *
 * //resize 自适应  对象canvas进行设置宽高 需要按屏幕宽与实际宽高来设置
 * _CJSModel.SetSize(SiteModel.SiteResizeModel.ScreenWidth,SiteModel.SiteResizeModel.ActualH);
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
    root.Ds.createjs = root.Ds.createjs || {};
    root.Ds.createjs.display = root.Ds.createjs.display || {};
    root.Ds.createjs.display.HorizontalScreenAutoContainer=HorizontalScreenAutoContainer;

    function HorizontalScreenAutoContainer() {

        this.Container_constructor();

        var _Self = this;
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
                _Self.rotation = 0;
                _Self.x = 0;
                _ScreenWidth = 1138;

            } else {
                _Self.rotation = 90;
                _Self.x = 640;
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
            } else {
                _Self.Width = _ActualH;
                _Self.Height = _ScreenWidth;
            }
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
    createjs.extend(HorizontalScreenAutoContainer, createjs.Container);
    createjs.promote(HorizontalScreenAutoContainer, "Container");
    return Ds.createjs.display.HorizontalScreenAutoContainer;
}));
