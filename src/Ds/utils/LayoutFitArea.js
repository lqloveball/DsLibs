/**
 * @class Ds.utils.LayoutFitArea
 * @classdesc:类说明:进行显示区域适配计算使用的类，主要提供一些静态使用方法
 * @extends
 * @example: 举例
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
!(function() {
    window.Ds = window.Ds || {};
    window.Ds.utils=window.Ds.utils ||{};

    var LayoutFitArea = {};
    window.Ds.utils.LayoutFitArea = LayoutFitArea;

    LayoutFitArea.OUTSIDE = 'outSide'; //铺满显示;
    LayoutFitArea.INSIDE = 'inSide'; //全部显示	;
    /**
     * 适配计算位置
     * @param _sourceSide适配对象({width:0, height:0 } 或者{w:0, h:0 }) _targetSide目标边界({width:0, height:0 } 或者{w:0, h:0 }) autoFitAreaType缩放类型
     * @param width height 适配对象 width height 目标边界 autoFitAreaType缩放类型
     */
    LayoutFitArea.AutoFitArea = function() {
        if (arguments.length != 3 && arguments.length != 5) {
            console.warn('Ds.LayoutFitArea.AutoFitArea function arguments.length Error');
            return null;
        }
        //原对象
        var _sourceSide = {
            width: 0,
            height: 0
        };
        //需要适配边界
        var _targetSide = {
            width: 0,
            height: 0
        };
        var _type = LayoutFitArea.OUTSIDE;
        if (arguments.length == 3) {
            _sourceSide = arguments[0];
            _targetSide = arguments[1];
            if (_sourceSide.w && _sourceSide.h) {
                _sourceSide = {
                    width: _sourceSide.w,
                    height: _sourceSide.h
                };
            }
            if (_targetSide.w && _targetSide.h) {
                _targetSide = {
                    width: _targetSide.w,
                    height: _targetSide.h
                };
            }
            if (arguments[2] == LayoutFitArea.OUTSIDE || arguments[2] == LayoutFitArea.INSIDE) _type = arguments[2];

        }
        if (arguments.length == 5) {
            _sourceSide = {
                width: arguments[0],
                height: arguments[1]
            };
            _targetSide = {
                width: arguments[2],
                height: arguments[3]
            };
            if (arguments[4] == LayoutFitArea.OUTSIDE || arguments[4] == LayoutFitArea.INSIDE) _type = arguments[4];
        }

        var _sw = _targetSide.width / _sourceSide.width;
        var _sh = _targetSide.height / _sourceSide.height;
        var _ss = 1;

        if (_type == LayoutFitArea.OUTSIDE) _ss = Math.max(_sw, _sh);
        else _ss = Math.min(_sw, _sh);

        var _temp = {};
        _temp.width = _ss * _sourceSide.width;
        _temp.height = _ss * _sourceSide.height;
        _temp.x = (_targetSide.width - _temp.width) / 2;
        _temp.y = (_targetSide.height - _temp.height) / 2;
        _temp.scale = _ss;
        return _temp;
    };
    /**
     * 快速对一个现实对象做位置自动适应
     * @param _sourceSide适配对象({width:0, height:0 } 或者{w:0, h:0 }) _targetSide目标边界({width:0, height:0 } 或者{w:0, h:0 }) autoFitAreaType缩放类型
     * @param width height 适配对象 width height 目标边界 autoFitAreaType缩放类型
     */
    LayoutFitArea.DisplayAutoFitArea = function() {
        if (arguments.length != 4 && arguments.length != 6) {
            console.warn('Ds.LayoutFitArea.DisplayAutoFitArea function arguments.length Error');
            return null;
        }

        var _display = arguments[0];
        log(_display instanceof createjs.DisplayObject);
        if (!(_display instanceof createjs.DisplayObject)) {
            console.warn('Ds.LayoutFitArea.DisplayAutoFitArea _display != createjs.DisplayObject');
            return null;
        }
        var _area;
        if (arguments.length == 4) _area = Ds.LayoutFitArea.AutoFitArea(arguments[1], arguments[2], arguments[3]);
        if (arguments.length == 6) _area = Ds.LayoutFitArea.AutoFitArea(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        _display.scaleX = _display.scaleY = _area.scale;
        _display.x = _area.x;
        _display.y = _area.y;
        return _display;
    };

})();
