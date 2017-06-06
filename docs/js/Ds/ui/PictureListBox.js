/**
 * @class Ds.ui.PictureListBox
 * @classdesc:类说明: 图片galley框，快速实现左右滑动切换图片效果内容
 * @extends
 * @example:
  _PictureListBox = new PictureListBox({
    list:[
      './images/product/Small1.jpg',
      './images/product/Small2.jpg',
    ],
    width:440,
    height:330,
    appendTo:$('.productListPanel .box')[0],
  });
  $('.productListPanel .previous').on('click',function(){
    _PictureListBox.Previous();
  });
  $('.productListPanel .next').on('click',function(){
    _PictureListBox.Next();
  });
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
!(function(factory) {
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

}(function(root, exports) {
    window.Ds = window.Ds || {};
    window.Ds.ui = window.Ds.ui || {};
    window.Ds.ui.PictureListBox = PictureListBox;

    function PictureListBox(opts) {
        var _Self = this;
        Ds.Extend(this, new Ds.EventDispatcher());
        // 显示内容框
        var _View = $(window.document.createElement('div'));
        //内容宽
        var _Width = opts.width !== undefined ? opts.width : 300;
        //内容的高
        var _Height = opts.height !== undefined ? opts.height : 300;

        //图片列表
        var _Pictures;
        //当前显示图片位置
        var _PicNum = 0;
        Object.defineProperty(this, "PicNum", {
            get: function() {
                return _PicNum;
            }
        });
        //当前图片
        var _Picture;

        //运动时间
        var _MovieTime = 0.8;
        //是否运动中
        var _MovieBool = false;
        /**
         * 初始化
         */
        function Init() {
            //设置容器宽高 css样式
            _View.css({
                position: 'absolute',
                left: 0,
                top: 0,
                width: _Width,
                height: _Height,
                overflow: 'hidden',
            });
            //按参数创建初始化的image对象的list
            if (opts.list && opts.list.length > 0) _Self.CreateList(opts.list);
            //添加到参数制定的容器
            if (opts.appendTo) {
                $(opts.appendTo).append(_View);
            }
            //touch事件
            touch.on(_View[0], 'swipeleft', function() {
                _Self.Next();
            });
            touch.on(_View[0], 'swiperight', function() {
                _Self.Previous();
            });
            _View.on('click', function() {
                _Self.ds({
                    type: 'click',
                    num: _PicNum
                });
            });
        }
        /**
         * 上一张图片
         */
        this.Previous = function() {
            if (_MovieBool) return;
            if (!_Pictures) return;
            if (_Pictures.length <= 0) return;
            var _num = _PicNum - 1;
            if (_num < 0) _num = _Pictures.length - 1;
            _Self.GotoPicture(_num,false);
        };
        /**
         * 下一张图片
         */
        this.Next = function() {
            if (_MovieBool) return;
            if (!_Pictures) return;
            if (_Pictures.length <= 0) return;
            var _num = _PicNum + 1;
            if (_num >= _Pictures.length) _num = 0;
            _Self.GotoPicture(_num,true);
        };
        /**
         * 跳转到页面图片
         * @param {[type]} value [跳转到第几张图片]
         * @param {[type]} swipeDirection [滑动方向]
         */
        this.GotoPicture = function(value,swipeDirection) {
            if (_MovieBool) return;
            if (_PicNum === value) return;
            if(swipeDirection===undefined)swipeDirection=true;
            _PicNum = value;
            _MovieBool = true;
            var _oldPic = _Picture;
            _Picture = _Pictures[_PicNum];
            JT.set(_Picture[0], {
                x: swipeDirection ? _Width : -_Width
            });
            _View.append(_Picture);
            JT.to(_Picture[0], _MovieTime, {
                x: 0,
                onEnd: function() {
                    _MovieBool = false;
                }
            });
            JT.to(_oldPic[0], _MovieTime, {
                x: swipeDirection ? -_Width : _Width
            });
        };
        /**
         * 创建图片列表
         * @param {[type]} list [图片列表  可以是 images也可以是string]
         */
        this.CreateList = function(list) {
            _Pictures = [];
            for (var i = 0; i < list.length; i++) {
                var _img = list[i];
                if (_img instanceof Image) {
                    _Pictures.push($(_img));
                } else {
                    var _temp = new Image();
                    _temp.src = _img;
                    _Pictures.push($(_temp));

                }
                var _image = _Pictures[i];
                _image.css({
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: _Width,
                    height: _Height,
                });
            }
            _PicNum = 0;
            _View.html('');
            _Picture = _Pictures[0];
            _View.append(_Picture);

        };

        Init();
    }
    return PictureListBox;
}));
