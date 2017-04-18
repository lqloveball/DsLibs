/**
 * @class Ds.gemo.PageSlider
 * @classdesc:页面平滑滚动
 *  事件 start move end
    start
    {type:'start',startX:startX,startY:startY,mouseX:startX,mouseY:startY}
    move
    {type:'move',level:level,upright:upright,diffX:diffX,diffY:diffY,endX:endX,endY:endY}
    end
    {type:'end',level:level,upright:upright,state:state}
    state: up back  down
    //补充支持原生的touchmove 事件时候数据获取,在做平滑滚动页面情况下 如果还需要原生一些mouse坐标时候使用
    {type:'touchmove',oe:event,mouseX:touch.pageX,mouseY:touch.pageY}
 * @extends
 * @example:
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
    root.Ds.gemo.PageSlider = PageSlider;

    function PageSlider(_scenes, _opt) {
        Ds.Extend(this, new Ds.EventDispatcher());
        var $scenes = $(_scenes),
            _self = this;
        // log($scenes)
        //初始化一些参数
        var startY = 0, //开始Y
            endY = 0, //结束Y
            currentY = 0, //实际Y
            startX = 0, //开始X
            endX = 0, //结束X
            diffX = 0, //改变X
            diffY = 0, //改变Y
            limitY = 150, //改变超过该值时执行翻页
            limitX = 40, //改变超过该值时执行翻页
            limit = 10, //判断方向的最小滑动距离
            upright = false, //是否上下滑动
            level = false; //是否左右滑动
        _self.sliding = false; //是否正在滑动
        _self.capture = false; //是否扑捉到Touch
        _self.lock = false;
        if (_opt) {
            if (_opt.limitY) limitY = _opt.limitY;
            if (_opt.limitX) limitX = _opt.limitX;
            if (_opt.limit) limit = _opt.limit;
            if (_opt.lock !== undefined) _self.lock = _opt.lock;
        }
        var _touchid=null;
        // log('init',scenes)
        $scenes.bind('touchstart', function(event) {
            if (_self.lock) return;
            // console.log('touchstart:',event);
            var _targetTouches = event.targetTouches || event.originalEvent.targetTouches;
            var touch = _targetTouches[0];
            // console.log(touch.identifier,_touchid);
            if(_touchid===null)_touchid=touch.identifier;
            if(_touchid!==touch.identifier)return;

            var target = $(event.target);
            if (_self.capture) return;

            if (!_self.sliding) {
                _self.capture = true;
                startY = touch.pageY;
                startX = touch.pageX;
                endY = 0;
                endX = 0;
                diffY = 0;
                diffX = 0;
                level = false;
                upright = false;
                _self.ds({
                    type: 'start',
                    startX: startX,
                    startY: startY,
                    mouseX: startX,
                    mouseY: startY
                });
            }
        });
        $scenes.bind('touchmove', function(event) {
            if (_self.lock) return;


            //console.log(sliding)
            var _targetTouches = event.targetTouches || event.originalEvent.targetTouches;
            var touch = _targetTouches[0];

            if(_touchid===null)return;
            if(_touchid!==touch.identifier)return;

            if (!_self.sliding && _self.capture) {
                event.preventDefault();

                endX = touch.pageX;
                endY = touch.pageY;

                diffX = endX - startX;
                diffY = endY - startY;
                if (!level && !upright) {
                    if (Math.abs(diffX) >= limit && Math.abs(diffX) > Math.abs(diffY)) {
                        level = true;
                        upright = false;
                    } else if (Math.abs(diffY) >= limit && Math.abs(diffX) < Math.abs(diffY)) {
                        level = false;
                        upright = true;
                    } else {
                        level = false;
                        upright = false;
                    }
                }
                //如果是纵向滑动
                if (upright) {
                    diffY = diffY > 0 ? (diffY - limit) : (diffY + limit);
                }
                //如果是横向滑动
                if (level) {
                    diffX = diffX > 0 ? (diffX - limit) : (diffX + limit);
                }
                _self.ds({
                    type: 'move',
                    level: level,
                    upright: upright,
                    diffX: diffX,
                    diffY: diffY,
                    endX: endX,
                    endY: endY
                });
            }
            _self.ds({
                type: 'touchmove',
                oe: event,
                mouseX: touch.pageX,
                mouseY: touch.pageY
            });
        });
        $scenes.bind('touchend touchcancel', function(event) {

            var _targetTouches = event.targetTouches || event.originalEvent.targetTouches;
            var touch = _targetTouches[0];
            if(touch&&touch.identifier&&_touchid!==touch.identifier){
              return;
            }
            _touchid=null;
            // event.preventDefault();
            if (!_self.sliding && _self.capture) {
                //如果是纵向滑动
                var state = '';
                if (upright) {
                    if (diffY < -limitY) {
                        //上一个
                        state = 'up';
                    } else if (diffY < 0 && diffY > -limitY) {
                        //小于最小距离回到原位置
                        event.preventDefault();
                        state = 'back';
                    } else if (diffY > limitY) {
                        //下一个
                        state = 'down';
                    } else if (diffY > 0 && diffY < limitY) {
                        //小于最小距离回到原位置
                        state = 'back';
                    }
                    //如果是横向滑动
                } else if (level) {

                    if (diffX < -limitX) {
                        //上一个
                        state = 'up';
                    } else if (diffX < 0 && diffX > -limitX) {
                        event.preventDefault();
                        state = 'back';
                        //小于最小距离回到原位置
                    } else if (diffX > limitX) {
                        state = 'down';
                        //下一个

                    } else if (diffX > 0 && diffY < limitX) {
                        //小于最小距离回到原位置
                        state = 'back';
                    }
                } else {
                    //点击
                    _self.closeSliding();
                }
                _self.ds({
                    type: 'end',
                    level: level,
                    upright: upright,
                    state: state
                });
            } else {
                _self.closeSliding();
            }
        });
        this.openSliding = function() {
            _self.sliding = true;
            _self.capture = false;
        };
        this.closeSliding = function() {
            _self.sliding = false;
            _self.capture = false;
        };
    }
    return Ds.gemo.PageSlider;
}));
