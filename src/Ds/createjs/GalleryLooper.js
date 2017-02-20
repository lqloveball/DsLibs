/**
 * @class Ds.createjs.GalleryLooper
 * @classdesc:环形作品画廊 基于Ds.gemo.GalleryAnnularLoopManager进行逻辑计算
 * @param {[createjs.Container]} box     [容器]
 * @param {[Array]} dataArr [填充数据]
 * @param {[Number]} showNum [显示个数]
 * @extends
 * @example: 举例
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  我发起Ds库目的，简化方便工作项目开发。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里代码很多也都来源至或参考网络开源开放代码，所以这个库也开源开放。更多希望团队成员把积累工作中常用的代码，加快自己开发效率。
 * @constructor
 **/
!(function() {
    window.Ds = window.Ds || {};
    window.Ds.createjs=window.Ds.createjs ||{};
    window.Ds.createjs.GalleryLooper = GalleryLooper;

    function GalleryLooper(box, dataArr, showNum) {
        Ds.Extend(this, new Ds.EventDispatcher());
        var _Self = this;

        var _Box = box;
        //清空显示容器
        _Box.removeAllChildren();

        //数据
        var _DataArr = dataArr;
        //是否锁定
        this.Loack = false;
        //是否运动中
        this.MovieIng = false;

        //触摸
        touch.on($('body')[0], 'swipeleft', function() {
            _Self.Next();
        });
        touch.on($('body')[0], 'swiperight', function() {
            _Self.Previous();
        });

        //Reference参考对象
        //左消失
        var _Lout = _Box.leftOut;
        //右消失
        var _Rout = _Box.rightOut;
        //参考排列
        var _ReferenceArr = [];
        for (var i = 0; i < showNum; i++) {
            var _rf = _Box['mc' + i];
            _ReferenceArr.push(_rf);
        }
        //画廊滚动管理对象
        var _GalleryLoopManager = new Ds.gemo.GalleryAnnularLoopManager(null, showNum);
        this.GalleryLoopManager = _GalleryLoopManager;
        //监听事件
        _GalleryLoopManager.on(_GalleryLoopManager.event.UP_DATA, UpData);
        _GalleryLoopManager.InitData(_DataArr);

        /**
         * 上一个
         */
        this.Previous = function() {
            if (this.Loack) return;
            if (this.MovieIng) return;
            _GalleryLoopManager.Previous();
        };
        /**
         * 下一个
         */
        this.Next = function() {
            if (this.Loack) return;
            if (this.MovieIng) return;
            _GalleryLoopManager.Next();
        };
        /**
         * 选择显示对象
         * @param {[Number]} value []
         */
        this.Select = function(value) {
            if (this.Loack) return;
            if (this.MovieIng) return;
            _GalleryLoopManager.Select(value);
        };
        /**
         * [UpData 数据更新]
         * @param {[type]} e [事件对象]
         * {
        		type:_Self.event.UP_DATA,				//更新数据
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
        function UpData(e) {
            if (_Self.MovieIng) return;
            _Self.MovieIng = true;
            _Self.ds(e);

            // page.title.gotoAndStop(e.seletNum);
            var i,_mc,_rf,_nowArr,_oldArr;
            //判断是否初始化
            if (e.isInit) {
                _Box.removeAllChildren();
                _nowArr = e.now;
                for (i = 0; i < _nowArr.length; i++) {
                    _mc = _nowArr[i];
                    _rf = _ReferenceArr[i];
                    _mc.scaleX = _mc.scaleY = _rf.scaleX;
                    _mc.x = _rf.x;
                    _mc.y = _rf.y;
                    _Box.addChild(_mc);
                    if (i == 1) {
                        _mc.title.title1.visible = true;
                        _mc.title.title2.visible = false;
                    } else {
                        _mc.title.title1.visible = false;
                        _mc.title.title2.visible = true;
                    }
                }
                _Self.MovieIng = false;
            }
						else {
                _nowArr = e.now;
                _oldArr = e.old;
                var _time = 0.5;
                var _outMc = e.direction ? _Lout : _Rout;
                var _inMc = e.direction ? _Rout : _Lout;
                for ( i = 0; i < _oldArr.length; i++) {
                     _mc = _oldArr[i];
                    if (_nowArr.indexOf(_mc) == -1) {
                        JT.to(_mc, _time, {
                            x: _outMc.x,
                            y: _outMc.y,
                            alpha: _outMc.alpha,
                            scaleX: _outMc.scaleX,
                            scaleY: _outMc.scaleY,
                            onEnd: function(temp) {
                                if (temp.parent) temp.parent.removeChild(temp);
                            },
                            onEndParams: [_mc],
                        });
                    }
                }
                for ( i = 0; i < _nowArr.length; i++) {
                    _mc = _nowArr[i];
                    _rf = _ReferenceArr[i];
                    if (_oldArr.indexOf(_mc) == -1) {
                        JT.set(_mc, {
                            x: _inMc.x,
                            y: _inMc.y,
                            alpha: _inMc.alpha,
                            scaleX: _inMc.scaleX,
                            scaleY: _inMc.scaleY
                        });
                        _Box.addChild(_mc);
                    }
                    JT.to(_mc, _time, {
                        x: _rf.x,
                        y: _rf.y,
                        alpha: _rf.alpha,
                        scaleX: _rf.scaleX,
                        scaleY: _rf.scaleY,
                        onEnd:function(value){
                            //动画是否播放完成
                            if (value == 1)_Self.MovieIng = false;
                        },
                        onEndParams: [i],
                    });

                    if (i == 1) {
                        _mc.title.title1.visible = true;
                        _mc.title.title2.visible = false;
                    } else {
                        _mc.title.title1.visible = false;
                        _mc.title.title2.visible = true;
                    }

                }

            }

        }
    }
})();
