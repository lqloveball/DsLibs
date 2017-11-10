//这个类使用老js方法，有可能直接插入html标签内使用
!(function (factory) {

    var root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);


    if (typeof define === 'function' && define.amd) {

        define(['exports'], function (exports) {

            module.exports = factory(root, exports);

        });
    } else if (typeof exports !== 'undefined') {

        module.exports = factory(root, exports);

    } else {

        factory(root, {});

    }

}(function (root, model) {

    var ds = root.ds = root.ds || {};
    ds.net = ds.net || {};

    /**
     * 快速Ajax交互请求
     * @module ds/net/QueueLoad
     *
     */
    var QueueLoad={};

    /**
     * 快速Ajax交互请求
     * @member ds.net.QueueLoad
     * @type module:ds/net/QueueLoad
     */
    ds.net.QueueLoad = QueueLoad;



    Object.assign(QueueLoad, /** @lends module:ds/net/QueueLoad */ {

        /**
         * 加载队列
         * @alias module:ds/net/QueueLoad.load
         * @param {array} list
         * @param {function} completeFun
         * @param {function} progressFun
         * @param {object} opts
         * @return {array} 加载队列数组
         */
        load: function (list,completeFun,progressFun,opts) {

            opts=opts||{};
            var _complete = completeFun||null;
            var _progress = progressFun||null;

            var _list =[];
            if(list&&list.length>0)  _list=list;

            var _basePath = opts.basePath !== undefined ? opts.basePath : '';
            var _queueArr = [];
            var _loadNum = 0;

            if (_list.length <= 0) {

                if (_complete !== undefined) _complete();
                return;

            }

            for (var i = 0; i < _list.length; i++) {

                var _obj = _list[i];

                if (typeof(_obj) === 'string') _obj = {src: _obj};

                _obj.src = _basePath + _obj.src;

                var _img = new Image();
                _img.onload = progress;
                _img.onerror = progress;
                _obj.img = _img;
                _obj.loadEnd=false;
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

                if (_progress) _progress(1);
                if (_complete) _complete();

            }

            //队列加载进度
            function progress() {

                _obj = _queueArr[_loadNum];
                _obj.loadEnd=true;
                _loadNum++;

                if (_loadNum >= _queueArr.length) {

                    complete();
                    return;

                }

                _obj = _queueArr[_loadNum];
                _img = _obj.img;
                _img.src = _obj.src;

                if (_progress) _progress(_loadNum / _queueArr.length);

            }

            //给到加载对象队列 进行img索引复制操作
            return _queueArr;

        },

    });

    /**
     * @member ds.net.post
     * @function
     * @see 详细请见： {@link module:ds/net/QueueLoad.load}
     */
    ds.net.queueLoad=ds.net.QueueLoad.load;

    return ds.net.QueueLoad;
}));