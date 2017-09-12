/**
 * @class Ds.gemo.TurnPageManager
 * @classdesc 翻页管理器
 * @extends
 * @example:
 *
 *  //构建翻页组件
     var _Pager = new Ds.gemo.TurnPageManager(_Items, 5);
     _Pager.on('update', PageUpdate);
     PageUpdate();
     function PageUpdate(e) {
            var _direction = true;
            if (e) _direction = e.direction;
            var _nowData = _Pager.nowData;
            var _oldData = _Pager.oldData;
            if (_oldData) {
                for (var i = 0; i < _oldData.length; i++) {
                    var _item = _oldData[i];
                    if (_item.parent) _item.parent.removeChild(_item);
                }
            }
            if (_nowData) {
                for (var i = 0; i < _nowData.length; i++) {
                    var _item = _nowData[i];
                    _Box.addChild(_item);
                    _item.x = _direction ? 97 * i + 30 : 97 * i - 30;
                    _item.alpha = 0;
                    JT.to(_item, 0.5, {delay: 0.1 * i, x: 97 * i, alpha: 1});
                }
            }
        };
 * @author: maksim email:maksim.lin@foxmail.com
 *
 **/

(function (factory) {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);

    if (typeof define === 'function' && define.amd) {
        define(['exports'], function (exports) {
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
    root.Ds.gemo.TurnPageManager = TurnPageManager;

    /**
     *
     * 翻页管理器
     * @param data 翻页数据
     * @param show 每一页显示个数
     * @param opts 构建参数
     * opts.revolve   是否翻页循环 默认循环
     * @constructor
     */
    function TurnPageManager(data, show, opts) {
        opts = opts || {};

        var _self = this;

        Ds.Extend(this, new Ds.EventDispatcher());
        //是否循环
        var _revolve = opts.revolve != undefined ? opts.revolve : true;


        //每一页显示的个数
        var _showNum = show || 1;
        Object.defineProperty(this, "showNum", {
            get: function () {
                return _showNum;
            },
        });

        //选择第几项目
        var _index;
        Object.defineProperty(this, "index", {
            get: function () {
                return _index;
            },
        });
        //上一页
        var _oldIndex;
        Object.defineProperty(this, "oldIndex", {
            get: function () {
                return _oldIndex;
            },
        });
        //长度
        var _length = 1;
        Object.defineProperty(this, "length", {
            get: function () {
                return _length;
            },
        });
        //当前页面数据
        var _nowData;
        Object.defineProperty(this, "nowData", {
            get: function () {
                return _nowData;
            },
        });
        //翻页前数据
        var _oldData;
        Object.defineProperty(this, "oldData", {
            get: function () {
                return _oldData;
            },
        });

        //翻页项数据
        var _data = [];
        Object.defineProperty(this, "data", {
            get: function () {
                return _data;
            },
            set: function (value) {
                if (value === _data) return;
                //记录历史数据
                var _historyData = _data;

                _data = value;
                if (!_data) _data = [];

                if (_data.length <= 0) {
                    _length = 1;
                } else {
                    _length = 1;
                    if (_data.length > _showNum) {
                        var _tempLength = _data.length / _showNum;
                        if (_tempLength > (_tempLength >> 0)) _length = (_tempLength >> 0) + 1;
                        else _length = _tempLength;
                    }
                }
                _oldData = null;
                _nowData = null;
                _index = -1;

                _self.gotoPage(0, true);


                _self.ds({
                    type: 'initData',
                    historyData: _historyData,
                });
            }
        });

        /**
         * 上一页
         */
        this.previous = function () {
            var _num = _index - 1;
            if (_num < 0) {
                if (_revolve) _num = _length - 1;
                else _num = 0;
            }
            this.gotoPage(_num, false);
        };
        /**
         * 下一页
         */
        this.next = function () {
            var _num = _index + 1;
            if (_num >= _length) {
                if (_revolve) _num = 0;
                else _num = _length - 1;
            }
            this.gotoPage(_num, true);
        };
        /**
         * 跳转页面
         * @param value    跳转页面
         * @param direction  方向
         */
        this.gotoPage = function (value, direction) {
            if (value < 0) value = 0;
            if (value >= _length) value = _length - 1;
            if (_index === value) return;
            _oldIndex = _index;
            _index = value;
            _oldData = _nowData;
            if (_data.length < _showNum) {
                _nowData = _data.concat();
            } else {
                var _arr = [];
                var _lt;
                if (_showNum * (_index + 1) <= _data.length) _lt = _showNum * (_index + 1)
                else _lt = _data.length;
                for (var i = _showNum * _index; i < _lt; i++) {
                    _arr.push(data[i]);
                }
                _nowData = _arr;
            }

            var _direction;
            if (direction !== undefined) {
                _direction = direction;
            } else {
                if (_index >= _oldIndex) _direction = true;
                else _direction = false;
            }

            _self.ds({
                type: 'update',
                nows: _nowData,
                olds: _oldData,
                data: _data,
                direction: _direction,
            })
            console.log('_direction:', _direction);
        };

        //设置翻页数据
        this.data = data;

    }

    return TurnPageManager;
}));