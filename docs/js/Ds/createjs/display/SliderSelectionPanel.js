/**
 * @class Ds.createjs.display.SliderSelectionPanel
 * @classdesc:滑块选择器 模拟手机滑块选择菜单
 *      [--4--]
 *    [----5----]
 *  [------1-----] <----选择项
 *   [----2----]
 *    [--3--]
 * @param {[Object]} opts [初始化参数项]
 * {
     container:_WordsSelectPanel.box,//【必须】选择器的容器 一个空显示对象
     itemClass:lib.SelectItem,//【必须】选项类对象 是一个MovieChilp,会按MovieChilp帧数构建多少项目
     scenes:$('#screen'),//【必须】选择器的touch交互dom对象
     height:560/2,//选择器的touch高度 可以理解成组件高度，因为touch运动计算只是组件高度一半算100%;
     minScale:0.3,//缩放最小值
     minAlpha:0,//最小通明度
     spacing:120,//选择项之间间隔
     showNum:5,//选择器显示项个数
     lock:true,//是否锁住 默认是不锁的false 当这个显示对象不显示时候可以通过SliderSelectionPanel.Lock=true关闭滚动计算[性能优化]
     //绑定到项上数据，注意1、数据长度不能超过MovieClip的帧的长度。2、如果有传入数据，会按数据长度进行计算选项个数
     dataList:[
       {label:'规则'},
       {label:'态度'},
       {label:'眼光'},
       {label:'看法'},
       {label:'想法'},
     ],
   }
 *
 * @extends
 * @example:
 //创建选择器
 var _SliderSelectionPanel=new Ds.createjs.display.SliderSelectionPanel(
   {
     container:_WordsSelectPanel.box,//选择器的容器 一个空显示对象
     itemClass:lib.SelectItem,//选项类对象 是一个MovieChilp,会按MovieChilp帧数构建多少项目
     scenes:$('#screen'),//选择器的touch交互dom对象
     height:560/2,//选择器的touch高度 可以理解成组件高度，因为touch运动计算只是组件高度一半算100%;
     minScale:0.3,//缩放最小值
     minAlpha:0,//最小通明度
     spacing:120,//选择项之间间隔
     showNum:5,//选择器显示项个数
     lock:true,//是否锁住 默认是不锁的false 当这个显示对象不显示时候可以通过SliderSelectionPanel.Lock=true关闭滚动计算[性能优化]
     speed:3,//速度，是 运动距离/height*speed 默认3倍速度
     //绑定到项上数据，注意1、数据长度不能超过MovieClip的帧的长度。2、如果有传入数据，会按数据长度进行计算选项个数
     dataList:[
       {label:'规则'},
       {label:'态度'},
       {label:'眼光'},
       {label:'看法'},
       {label:'想法'},
     ],
   }
 );
 //监听滑动过程中选中变化
 _SliderSelectionPanel.on('change',function(e){
   console.log('change:',
               e.index,//索引
               e.item,//选择项（显示对象）
               e.data//绑定的数据
             );
 });
 //监听选中事件
 _SliderSelectionPanel.on('select',function(e){
   console.log('select:',
               e.index,//索引
               e.item,//选择项（显示对象）
               e.data//绑定的数据
             );
 });
 //可以手动进行控制是否开启滚动锁
 _SliderSelectionPanel.Lock=false;
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
(function(factory) {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);

    if (typeof define === 'function' && define.amd) {
        define(['exports'], function(exports) {
            require('ds/EventDispatcher');
            require('ds/gemo/PageSlider');
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
    root.Ds.createjs.display.SliderSelectionPanel = SliderSelectionPanel;

    function SliderSelectionPanel(opts) {
        var _Self = this;
        Ds.Extend(this, new Ds.EventDispatcher());
        //判断必须传入的参数
        if (opts.container === undefined || opts.scenes === undefined || opts.itemClass === undefined) {
            if (opts.container === undefined) console.warn('opts.container is undefined');
            if (opts.scenes === undefined) console.warn('opts.scenes is undefined');
            if (opts.itemClass === undefined) console.warn('opts.itemClass is undefined');
            return;
        }
        //交互场景Dom
        var _Scenes = opts.scenes;
        //容器
        var _Container = opts.container;
        _Container.removeAllChildren();
        // _Container.oparent=_Container.parent;
        // _Container.ox=_Container.x;
        // _Container.oy=_Container.y;
        //选择项类
        var _ItemClass = opts.itemClass;
        //滑动计算高度
        var _Height = opts.height !== undefined ? opts.height : window.window.innerHeight;
        //缩放用的最小
        var _MinScale = opts.minScale !== undefined ? opts.minScale : 0.2;
        //最小透明度
        var _MinAlpha = opts.minAlpha !== undefined ? opts.minAlpha : 0.1;
        //选择项之间间隔
        var _Spacing = opts.spacing !== undefined ? opts.spacing : 120;
        //显示多少个选择项
        var _ShowNum = opts.showNum !== undefined ? opts.showNum : 5;
        //是否锁住不让滚动
        var _Lock = opts.lock !== undefined ? opts.lock : false;

        Object.defineProperty(this, "Lock", {
            get: function() {
                return _Lock;
            },
            set: function(value) {
                if (_Lock === value) return;
                _Lock = value;
                _Slider.lock = _Lock;
            }
        });
        var _Speed = opts.speed !== undefined ? opts.speed : 3;
        //判断不奇数要显示奇数
        if (_ShowNum % 2 === 0) _ShowNum += 1;
        //中间数
        var _Middle = _ShowNum / 2 >> 0;
        //计算实际项数量  因为有可能显示项比选择用项多
        var _All;
        //当前索引
        var _Index = 0;
        //选项列表
        var _List;
        Object.defineProperty(this, "List", {
            get: function() {
                return _List;
            }
        });
        //选项参考位置列表
        var _ReferenceList;
        var _Reference; //选择部分参考
        var _UpOutReference; //上部分消失参考
        var _DownOutReference; //下部分消失参考
        var _ReferenceUpList; //上滚部分
        var _ReferenceDownList; //下滚部分
        //滑动时候运动时间
        var _SlideTime = 0.1;
        //运动过程中临时记录选择中的项
        var _MoveTempSelectNum;
        //运动过程中计算出来显示项
        var _MoveTempShowList;
        //运动完成后用来算偏移合理计算的
        var _EndMoveObj = {
            direction: true, //计算之后选中项目的偏移方向
            percent: 1, //选中偏移百分比
            diffPercent: 1, //偏移百分比
        };

        //初始化列表
        InitList();
        /**
         * 初始化选择列表
         */
        function InitList() {

            var i;
            var _item = new _ItemClass();
            var _All = _item.totalFrames;
            var _length = _All * 2;
            var _dataList = null;
            if (opts.dataList !== undefined && opts.dataList.length > 0) {
                _All = opts.dataList.length;
                _length = _All * 2;
                _dataList = opts.dataList;
            } else {
                _dataList = [];
                for (i = 0; i < _All; i++) {
                    _dataList.push({
                        index: i
                    });
                }
            }
            _List = [];
            for (i = 0; i < _length; i++) {
                _item = new _ItemClass();
                var _num = i % _All;
                // console.log(_num);
                _item.index = _num; //对外列表索引项目
                _item.loopNum = i; //因为是循环滚动的，索引是2倍，那这个就记录
                _item.data = _dataList[_num];
                _item.data.index = _num;
                _item.gotoAndStop(_num);
                _List.push(_item);
                console.log(_item.data);
            }
            _Index = 0;
            InitPermutation();
        }

        /**
         * 初始化排列 计算运动动画参考点
         */
        function InitPermutation() {
            _Container.removeAllChildren();
            _ReferenceList = [];
            _ReferenceUpList = [];
            _ReferenceDownList = [];
            var _tempRF;
            var _index = _Index;
            //默认第一位
            var _item = _List[_index];
            _item.y = 0;
            _item.scaleX = _item.scaleY = 1;
            _item.alpha = 1;
            _Container.addChild(_item);
            _tempRF = {
                y: 0,
                scale: 1,
                alpha: 1,
            };
            _Reference = _tempRF;
            _ReferenceList.push(_tempRF);
            //补充出其他显示位置
            for (var i = 0; i < _Middle; i++) {
                //上下补位
                var _num = i + 1;
                //百分比
                var _percent = i / _Middle;
                // console.log(_num);
                var _pow0 = Math.pow(2, _Middle - i); //8 4 2
                // var _pow1=Math.pow(2,i+1);//2 4 8
                var _powScale0 = 1 / _pow0; //0.12 0.25 0.5
                // var _powScale1=1/_pow1;//0.5  0.25  0.12
                // console.log(_num,"_percent:",_percent,'_pow0:',_pow0,'_pow1:',_pow1,'_powScale0:',_powScale0,'_powScale1:',_powScale1,'_hScale:',_hScale);
                console.log(_num, _List.length - _num, "_percent:", _percent, '_pow0:', _pow0, '_powScale0:', _powScale0);
                var _scale = (1 - _powScale0) * (1 - _MinScale) + _MinScale;
                var _alpha = (1 - _powScale0) * (1 - _MinAlpha) + _MinAlpha;

                //选择中项下方
                var _selectNum = _num;
                _item = _List[_selectNum];

                _Container.addChild(_item);
                _item.y = _Spacing * _num - _Spacing * _powScale0 * _percent; //正间隔*排列数 - 间隔*平方递减*排列百分比数
                _item.scaleX = _item.scaleY = _scale;
                _item.alpha = _alpha;
                _tempRF = {
                    y: _item.y,
                    scale: _scale,
                    alpha: _alpha,
                };
                _ReferenceList.push(_tempRF);
                _ReferenceDownList.push(_tempRF);

                //选择中项上方
                _selectNum = _List.length - _num;
                _item = _List[_List.length - _num];
                _Container.addChild(_item);
                _item.y = -_Spacing * _num + _Spacing * _powScale0 * _percent; //反向间隔*排列数 + 间隔*平方递减*排列百分比数
                _item.scaleX = _item.scaleY = _scale;
                _item.alpha = _alpha;
                _tempRF = {
                    y: _item.y,
                    scale: _scale,
                    alpha: _alpha,
                };
                _ReferenceList.splice(0, 0, _tempRF);
                _ReferenceUpList.push(_tempRF);
            }
            //向下消失参考
            _DownOutReference = {
                y: _ReferenceList[_ReferenceList.length - 1].y + _Spacing * 0.15,
                scale: _MinScale,
                alpha: 0,
            };
            //向上消失参考
            _UpOutReference = {
                y: _ReferenceList[0].y - _Spacing * 0.15,
                scale: _MinScale,
                alpha: 0,
            };
        }

        //平滑滚动计算类
        var _Slider = new Ds.gemo.PageSlider(_Scenes);
        //判断默认是否锁住
        _Slider.lock = _Lock;
        //开始交互触摸
        _Slider.on('start', function(e) {
            //锁住不做更改
            if (_Self.Lock) return;
            _MoveTempSelectNum = _Index;
        });
        //移动过程
        _Slider.on('move', function(e) {
            //锁住不做更改
            if (_Self.Lock) return;
            //只计算纵向滚动 不是上下滑动忽略
            if (!e.upright) return;
            //纵向偏移量
            var _diffY = e.diffY;
            //计算偏移的百分比
            var _diffPercent = _diffY / _Height*_Speed; //滑动方向偏移量
            var _direction = _diffPercent > 0 ? true : false; //是否下滑
            //偏移的百分比正数
            var _percent = Math.abs(_diffPercent);
            //用来结束计算偏移时候使用
            _EndMoveObj.direction = _direction;
            _EndMoveObj.percent = _percent;
            _EndMoveObj.diffPercent = _diffPercent;

            //计算缩放百分比
            // var _scale=(1-(1-_MinScale)*_percent);
            // log(_percent);
            //拖动百分比超出1 就要计算正确当前选择项index
            var _index = _Index - (_diffPercent >> 0);
            if (_index >= _List.length) _index = _index - _List.length;
            if (_index < 0) _index = _List.length + _index;
            // console.log(_Index, (_diffY / _Height >> 0), _index);
            //计算出选项列表
            var _num,
                i,
                _rf, //参考项目
                _nextrf; //下一个参考项目
            var _itemList = []; //当前显示项
            var _selectNum = _index;
            var _item = _List[_selectNum];
            //记录运动过程中已经选择到那个选项
            if (_MoveTempSelectNum != _selectNum) {
                _MoveTempSelectNum = _selectNum;
                //更新变化事件
                var _temp = _List[_selectNum];
                _Self.ds({
                    type: 'change',
                    index: _temp.index,
                    item: _temp,
                    data: _temp.data,
                });
            }

            //运动过程中记录下来显示项目
            _MoveTempShowList = _itemList;
            // console.log(_direction, _selectNum);
            _itemList.push(_item);
            // var _arr=[_selectNum];
            //补充出其他显示位置
            for (i = 0; i < _Middle; i++) {
                //上下补位
                _num = i + 1;
                //选择中项下方
                _selectNum = _index + _num;
                //计算合理值
                if (_selectNum >= _List.length) _selectNum = _selectNum - _List.length;
                if (_selectNum < 0) _selectNum = _List.length + _selectNum;
                _item = _List[_selectNum];
                _itemList.push(_item);
                // _arr.push(_selectNum);
                //选择中项上方
                _selectNum = _index - _num;
                //计算合理值
                if (_selectNum >= _List.length) _selectNum = _selectNum - _List.length;
                if (_selectNum < 0) _selectNum = _List.length + _selectNum;
                _item = _List[_selectNum];
                _itemList.splice(0, 0, _item);
                // _arr.splice(0, 0, _selectNum);
            }
            //百分比合理计算
            _percent = _percent % 1;
            //动画运动对象
            var _mObj;
            //开始计算对应位置
            for (i = 0; i < _ReferenceList.length; i++) {
                _rf = _ReferenceList[i];
                _item = _itemList[i];
                //下滚动
                if (!_direction) {
                    //计算新添加进场景的选项做初始化位置
                    if (!_item.parent) {
                        _item.y = _DownOutReference.y;
                        _item.scaleX = _item.scaleY = _DownOutReference.scale;
                        _item.alpha = _DownOutReference.alpha;
                        _Container.addChild(_item);
                    }
                    //计算出参考对象
                    if (i === 0) _nextrf = _UpOutReference;
                    else _nextrf = _ReferenceList[i - 1];
                }
                //上滑滚动
                else {
                    //计算新添加进场景的选项做初始化位置
                    if (!_item.parent) {
                        _item.y = _UpOutReference.y;
                        _item.scaleX = _item.scaleY = _UpOutReference.scale;
                        _item.alpha = _UpOutReference.alpha;
                        _Container.addChild(_item);
                    }
                    //计算出参考对象
                    if (i === _ReferenceList.length - 1) _nextrf = _DownOutReference;
                    else _nextrf = _ReferenceList[i + 1];
                }
                _mObj = {
                    y: _rf.y + _percent * (_nextrf.y - _rf.y),
                    scaleX: _rf.scale - _percent * (_rf.scale - _nextrf.scale),
                    scaleY: _rf.scale - _percent * (_rf.scale - _nextrf.scale),
                    alpha: _rf.alpha - _percent * (_rf.alpha - _nextrf.alpha),
                };
                // console.log(_direction,_nextrf.scale,_rf.scale);
                // console.log(_mObj,_nextrf);
                JT.to(_item, _SlideTime, _mObj);
            }
            //剔除不显示项
            for (i = 0; i < _List.length; i++) {
                _item = _List[i];
                if (_itemList.indexOf(_item) == -1) {
                    if (_item.parent) _item.parent.removeChild(_item);
                }
            }


        });
        //移动完成
        _Slider.on('end', function(e) {
            if (_Self.Lock) return;
            if (!_Slider.sliding && _Slider.capture) {
                if (e.upright) {
                    SlideTo(e.state);
                }
            }
        });
        //移动完成归位计算
        function SlideTo(state) {
            var i, _rf, _item, _selectNum;

            var _direction = _EndMoveObj.direction; //方向
            var _percent = _EndMoveObj.percent; //正数百分比
            var _diffPercent = _EndMoveObj.diffPercent; //偏移百分比

            var _index = _Index - (_diffPercent >> 0);
            if (_index >= _List.length) _index = _index - _List.length;
            if (_index < 0) _index = _List.length + _index;
            _percent = _percent % 1;
            if (_percent > 0.5) {
                if (!_direction) _index += 1;
                else _index -= 1;
            }

            //选中索引
            _selectNum = _index;

            //计算合理值
            if (_selectNum >= _List.length) _selectNum = _selectNum - _List.length;
            if (_selectNum < 0) _selectNum = _List.length + _selectNum;
            // console.log(_Index,_selectNum,_percent);
            _Index = _selectNum;
            //当前显示项列表
            var _itemList = [];
            //选中项
            _item = _List[_selectNum];
            _itemList.push(_item);
            //补充出其他显示位置
            for (i = 0; i < _Middle; i++) {
                //上下补位
                _num = i + 1;
                //选择中项下方
                _selectNum = _index + _num;
                //计算合理值
                if (_selectNum >= _List.length) _selectNum = _selectNum - _List.length;
                if (_selectNum < 0) _selectNum = _List.length + _selectNum;
                _item = _List[_selectNum];
                _itemList.push(_item);
                //选择中项上方
                _selectNum = _index - _num;
                //计算合理值
                if (_selectNum >= _List.length) _selectNum = _selectNum - _List.length;
                if (_selectNum < 0) _selectNum = _List.length + _selectNum;
                _item = _List[_selectNum];
                _itemList.splice(0, 0, _item);
            }
            //开始计算对应位置
            for (i = 0; i < _ReferenceList.length; i++) {
                _rf = _ReferenceList[i];
                _item = _itemList[i];
                if (!_direction) {
                    //计算新添加进场景的选项做初始化位置
                    if (!_item.parent) {
                        _item.y = _DownOutReference.y;
                        _item.scaleX = _item.scaleY = _DownOutReference.scale;
                        _item.alpha = _DownOutReference.alpha;
                        _Container.addChild(_item);
                    }
                }
                //上滑滚动
                else {
                    //计算新添加进场景的选项做初始化位置
                    if (!_item.parent) {
                        _item.y = _UpOutReference.y;
                        _item.scaleX = _item.scaleY = _UpOutReference.scale;
                        _item.alpha = _UpOutReference.alpha;
                        _Container.addChild(_item);
                    }
                }
                _mObj = {
                    y: _rf.y,
                    scaleX: _rf.scale,
                    scaleY: _rf.scale,
                    alpha: _rf.alpha,
                };
                if (i === 0) JT.to(_item, 0.5, {
                    y: _rf.y,
                    scaleX: _rf.scale,
                    scaleY: _rf.scale,
                    alpha: _rf.alpha,
                    onEnd: function() {
                        _Slider.sliding = false;
                        _Slider.capture = false;
                        //更新选中事件
                        var _temp = _List[_Index];
                        _Self.ds({
                            type: 'select',
                            index: _temp.index,
                            item: _temp,
                            data: _temp.data,
                        });
                    },
                });
                else {
                    JT.to(_item, 0.5, _mObj);
                }
            }
            //剔除不显示项
            for (i = 0; i < _List.length; i++) {
                _item = _List[i];
                if (_itemList.indexOf(_item) == -1) {
                    if (_item.parent) _item.parent.removeChild(_item);
                }
            }

        }
    }

    return root.Ds.SliderSelectionPanel;
}));
