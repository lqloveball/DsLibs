/**
 * @class Ds.gemo.GalleryAnnularLoopManager
 * @classdesc:环型画廊管理者（只是抽象逻辑）  呈现对象是在中心,奇数循环 中间代表最终呈现项;
 * @extends
 * @example:
 * 具体实现可以参考 Ds.createjs.GalleryLooper
 * var _GalleryLoopManager=new Ds.gemo.GalleryAnnularLoopManager(null,showNum);
 * //监听事件
 * _GalleryLoopManager.on('upDate',UpData);
 * //填充数据
 * _GalleryLoopManager.InitData(_DataArr);
 * //数据更新具体界面处理
 * function UpData(e){}
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
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
    root.Ds.gemo = root.Ds.gemo || {};
    root.Ds.gemo.GalleryAnnularLoopManager = GalleryAnnularLoopManager;

    function GalleryAnnularLoopManager(data, showNum) {
        Ds.Extend(this, new Ds.EventDispatcher());
        var _Self = this;
        /**
         * 事件类型对象
         * @type {Object}
         */
        this.event = {};
        /**
         * 填充数据全部更新
         * @type {String}
         */
        this.event.UP_TOTAL = 'upTotal';
        /**
         * 翻页数据更新
         * @type {String}
         * event Data:
         * {
           type:_Self.event.UP_DATE,				//更新数据
           old:_OldShowObjects,    				//旧数据组
           now:_NowShowObjects,    				//新数据组
           oldNums:_OldNumArr,    					//旧编号数据组
           nowNums:_NowNumArr,    					//新编号数据组
           seletNum:_SelectNum,					//当前选择数字
           seletObj:_SelectObj,					//当前选择对象
           isInit:(_OldSelectNum==-1)?true:false,	//是否初始化数据
           direction:_Direction,					//方向
         }
         */
        this.event.UP_DATE = 'upDate';
        /**
         * 填充翻页数据 dom对象 或者 cjs对象
         * @type {Array}
         */
        var _Data = [];
        /**
         * 当前选择元素
         * @type {[type]}
         */
        var _SelectObj = null;
        Object.defineProperty(this, "SelectObj", {
            get: function() {
                return _SelectObj;
            }
        });
        /**
         * 运动方向
         * @type {Boolean}
         */
        var _Direction = true;
        //get方法
        Object.defineProperty(this, "Direction", {
            get: function() {
                return _Direction;
            }
        });
        /**
         * 画廊显示个数
         * @type {[Number]}
         */
        var _ShowNum = showNum || 3;
        //get方法
        Object.defineProperty(this, "ShowNum", {
            get: function() {
                return _ShowNum;
            }
        });
        //小与3个至少3个，至少3个才能循环
        if (_ShowNum <= 3) _ShowNum = 3;
        //如果是偶数 就加1
        if (_ShowNum % 2 === 0) _ShowNum += 1;
        /**
         * 前后间隔值
         * @type {[Number]}
         */
        var _SpaceNum = _ShowNum / 2 >> 0;
        /**
         * 显示的对象index
         * @type {Number}
         */
        var _SelectNum = -1;
        Object.defineProperty(this, "SelectNum", {
            get: function() {
                return _SelectNum;
            }
        });
        /**
         * 上一个显示对象index
         * @type {Number}
         */
        var _OldSelectNum = 0;

        /**
         * 当前显示元素数据list
         * @type {[Array]}
         */
        var _NowShowObjects = null;
        Object.defineProperty(this, "NowShowObjects", {
            get: function() {
                return _NowShowObjects;
            }
        });

        /**
         * 更新前元素数据list
         * @type {[Array]}
         */
        var _OldShowObjects = null;
        Object.defineProperty(this, "OldShowObjects", {
            get: function() {
                return _OldShowObjects;
            }
        });


        /**
         * 初始化数据
         * @param {[Array]} data [画廊展示的元素]
         */
        this.InitData = function(data) {
            _Data = data;
            _OldNumArr = [];
            _NowNumArr = [];
            _SelectNum = -1;
            this.Select(0);
        };
        /**
         * 上一个
         */
        this.Previous = function() {
            // log('Previous')
            if (!_Data) return;
            var _num = _SelectNum - 1;
            if (_num < 0) _num = _Data.length - 1;
            this.Select(_num);
        };
        /**
         * 下一个
         */
        this.Next = function() {
            // log('Next');
            if (!_Data) return;
            var _num = _SelectNum + 1;
            if (_num >= _Data.length) _num = 0;
            this.Select(_num);

        };
        var _NowNumArr, _OldNumArr;
        /**
         * 选择显示对象
         * @param {[type]} value [description]
         */
        this.Select = function(value) {
            // console.log('Select:',value)
            if (!_Data) return;
            if (typeof(value) != 'number') {
                var _num = _Data.indexOf(value);
                if (_num < 0) {
                    console.warn('GalleryAnnularLoopManager 没有这个对象:', value);
                    return;
                }
                value = _num;
            }
            //选择以后不做变化
            if (_SelectNum == value) return;
            if (value <= 0) value = 0;
            if (value >= _Data.length) value = _Data.length - 1;
            //记录旧的编号
            _OldSelectNum = _SelectNum;
            //记录旧显示列表
            _OldShowObjects = _NowShowObjects;
            //当前现在编号
            _SelectNum = value;
            //当前选择对象
            _SelectObj = _Data[_SelectNum];
            //记录当前显示对象组
            _NowShowObjects = [];
            _OldNumArr = _NowNumArr;
            _NowNumArr = [];
            //填充前后
            for (var i = 0; i < _SpaceNum + 1; i++) {
                if (i === 0) {
                    var _obj = _Data[_SelectNum];
                    _NowShowObjects.push(_obj);
                    _NowNumArr.push(_SelectNum);
                } else {
                    var _nnum = GetLegalNumber(_SelectNum + i);
                    var _pnum = GetLegalNumber(_SelectNum - i);
                    // log(_SelectNum,i,'上:',_SelectNum-i,'/',_pnum,' 下：',_SelectNum+i,'/',_nnum)
                    var _nobj = _Data[_nnum];
                    var _pobj = _Data[_pnum];
                    _NowNumArr.push(_nnum);
                    _NowNumArr.splice(0, 0, _pnum);

                    _NowShowObjects.push(_nobj);
                    _NowShowObjects.splice(0, 0, _pobj);
                }
            }
            // console.log('old>',_OldNumArr)
            // console.log('now>',_NowNumArr)
            //计算方向
            if (_SelectNum === _Data.length - 1 && _OldSelectNum === 0) {
                _Direction = false;
            } else if (_SelectNum === 0 && _OldSelectNum == _Data.length - 1) {
                _Direction = true;
            } else {
                if (_SelectNum > _OldSelectNum) _Direction = true;
                else _Direction = false;
            }
            // log('OldShowObjects:',_OldShowObjects);
            // log('NowShowObjects:',_NowShowObjects);
            //数据更新事件
            _Self.ds({
                type: _Self.event.UP_DATE, //更新数据
                old: _OldShowObjects, //旧数据组
                now: _NowShowObjects, //新数据组
                oldNums: _OldNumArr, //旧编号数据组
                nowNums: _NowNumArr, //新编号数据组
                seletNum: _SelectNum, //当前选择数字
                seletObj: _SelectObj, //当前选择对象
                isInit: (_OldSelectNum == -1) ? true : false, //是否初始化数据
                direction: _Direction, //方向
            });
            //初始化数据时候发送事件
            if (_OldSelectNum == -1) {
                _Self.ds({
                    type: _Self.event.UP_TOTAL,
                    old: _OldShowObjects,
                    now: _NowShowObjects,
                    seletNum: _SelectNum,
                    seletObj: _SelectObj,
                    direction: _Direction,
                });
            }
        };
        /**
         * 计算环型循环滚动 数字合理性
         * @param {[type]} value [description]
         */
        function GetLegalNumber(value) {
            var _num;
            if (value >= 0 && value <= _Data.length - 1) {
                return value;
            } else if (value < 0) {
                _num = _Data.length + value;
                return _num;
            } else {
                // log(value)
                _num = value - (_Data.length);
                return _num;
            }
        }
        //初始化
        if (data) this.InitData(data);

    }

    return GalleryAnnularLoopManager;
}));
