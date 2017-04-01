/**
 * @class 快速加载队列
 * @classdesc:类说明:
 * @extends
 * @example:
 * var _obj={
   basePath:'./images/',
   list:[
     'logo.jpg',
     'page0BackCover.jpg',
     'page0Cover.png',
   ],
   progress:function(num){
     SiteModel.ShowProgress(60+(40*num>>0));
   },
   complete:function(){
     SiteModel.HitLoadPanel();
     //加载这单页面应用
     InitModels();
   }
 };
 Ds.gemo.QueueLoad.ImageQueueLoad(_obj);
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

}(function(root, modelObj) {
    root.Ds = root.Ds || {};
    root.Ds.gemo = root.Ds.gemo || {};
    root.Ds.gemo.QueueLoad = new QueueLoad();

    function QueueLoad() {
        /**
         * 图片加载队列
         * @param {[type]} opts [队列加载图片]
         * opts.basePath
         * opts.list
         * opts.progress
         * opts.complete
         */
        this.ImageQueueLoad = function(opts) {
            var _complete = opts.complete;
            var _progress = opts.progress;
            var _list = opts.list !== undefined ? opts.list : [];
            var _basePath = opts.basePath !== undefined ? opts.basePath : '';
            var _queueArr = [];
            var _loadNum = 0;
            if (_list.length <= 0) {
                console.warn('加载队列未空');
                if (_complete !== undefined) _complete();
                return;
            }
            for (var i = 0; i < _list.length; i++) {
                var _obj = _list[i];
                if (typeof(_obj) === 'string') _obj = {
                    src: _obj
                };
                _obj.src = _basePath + _obj.src;
                var _img = new Image();
                _img.onload = progress;
                _img.onerror = progress;
                _obj.img = _img;
                _queueArr.push(_obj);
            }
            //开始加载
            startLoad();
            //开始加载
            function startLoad() {
                _obj = _queueArr[0];
                _img = _obj.img;
                _img.src = _obj.src;
            }
            //队列加载完成
            function complete() {
                if (_progress !== undefined) _progress(1);
                if (_complete !== undefined) _complete();
            }
            //队列加载进度
            function progress() {
                _loadNum++;
                if (_loadNum >= _queueArr.length) {
                    complete();
                    return;
                }
                _obj = _queueArr[_loadNum];
                _img = _obj.img;
                _img.src = _obj.src;
                if (_progress !== undefined) _progress(_loadNum / _queueArr.length);
            }


        };
    }

    return root.Ds.gemo.QueueLoad;
}));
