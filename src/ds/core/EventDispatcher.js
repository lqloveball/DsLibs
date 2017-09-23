!(function (factory) {

    var root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

    if (typeof define === 'function' && define.amd) {

        define(['exports'], function (exports) {

            module.exports = factory(root, exports);

        });
    } else if (typeof exports !== 'undefined') {

        module.exports = factory(root, exports);

    } else {

        factory(root);

    }

}(function (root, model) {


    /**
     * 事件机制类
     * @class ds.core.EventDispatcher
     * @classdesc 实现js下的事件派发机制，为复杂的互动交互提供事件派发功能。
     */
    function EventDispatcher() {

        /**
         * 添加监听事件
         * @method ds.core.EventDispatcher.prototype.addEventListener
         * @function
         * @param {string} type 事件标识
         * @param {function} listener 事件执行函数
         * @param {*} [context=this]  监听方法内的this上下文关系
         */
        this.addEventListener = function (type, listener, context) {

            if (this._listeners === undefined) this._listeners = {};

            var _listeners = this._listeners;

            if (_listeners[type] === undefined) {

                _listeners[type] = [];

            }

            if (_listeners[type].indexOf(listener) === -1) {

                if (context !== undefined) listener._ds_context = context;

                _listeners[type].push(listener);

            }

        };

        /**
         * 添加监听事件
         * @method ds.core.EventDispatcher.prototype.on
         * @function
         * @see {@link ds.core.EventDispatcher#addEventListener}
         */
        this.on = this.addEventListener;

        /**
         * 添加监听事件,执行一次就销毁
         * @method ds.core.EventDispatcher.prototype.once
         * @param {string} type 事件标识
         * @param {function} listener 事件执行函数
         * @param {*} [context=this]  监听方法内的this上下文关系
         */
        this.once = function (type, listener, context) {

            listener.once = true;
            this.addEventListener(type, listener, context);

        };

        /**
         * 判断是否监听指定事件
         * @function
         * @method ds.core.EventDispatcher.prototype.hasEventListener
         * @param {string } type  事件标识
         * @param {function} listener 事件执行函数
         * @returns {boolean}
         */
        this.hasEventListener = function (type, listener) {

            if (this._listeners === undefined) return false;

            var _listeners = this._listeners;

            return _listeners[type] !== undefined && _listeners[type].indexOf(listener) !== -1;

        };
        /**
         * 判断是否监听指定事件
         * @method ds.core.EventDispatcher.prototype.hs
         * @see {@link ds.core.EventDispatcher#addEventListener}
         */
        this.hs = this.hasEventListener;


        /**
         * 删除监听事件
         * @method ds.core.EventDispatcher.prototype.removeEventListener
         * @param type 事件标识
         * @param listener  时间执行函数
         */
        this.removeEventListener = function (type, listener) {

            if (this._listeners === undefined) return;

            var _listeners = this._listeners;
            var _listenerArray = _listeners[type];

            if (_listenerArray !== undefined) {

                var _index = _listenerArray.indexOf(listener);

                if (_index !== -1) {

                    _listenerArray.splice(_index, 1);

                }

            }

        };


        /**
         * 删除监听事件
         * @method ds.core.EventDispatcher.prototype.off
         * @see {@link ds.core.EventDispatcher#removeEventListener}
         */
        this.off = this.removeEventListener;

        /**
         * 派发事件
         * @method ds.core.EventDispatcher.prototype.dispatchEvent
         * @param {string | object} event 可以是事件标识名的字符串、或者带事件标识名的对象。
         * @param {string } event.type 事件标识名
         * @param {*} [event.*] 派发事件对象可带任意对象参数
         */
        this.dispatchEvent = function (event) {

            if (this._listeners === undefined) return;

            if (typeof(event) === 'string') event = {type: event};

            var _listeners = this._listeners;
            var _listenerArray = _listeners[event.type];

            if (_listenerArray !== undefined) {

                event.target = this;

                var _array = _listenerArray.slice(0);

                for (var i = 0, l = _array.length; i < l; i++) {

                    if (_array[i]._ds_context) _array[i].call(_array[i]._ds_context, event);
                    else _array[i].call(this, event);

                    if (_array[i].once) {
                        this.removeEventListener(event.type, _array[i]);
                    }

                }

            }
        };


        /**
         * 派发事件
         * @method ds.core.EventDispatcher.prototype.emit
         * @see {@link ds.core.EventDispatcher#dispatchEvent}
         */
        this.emit = this.dispatchEvent;

        /**
         * 派发事件
         * @method ds.core.EventDispatcher.prototype.trigger
         * @see {@link ds.core.EventDispatcher#dispatchEvent}
         */
        this.trigger = this.dispatchEvent;

        /**
         * 派发事件
         * @method ds.core.EventDispatcher.prototype.ds
         * @see {@link ds.core.EventDispatcher#dispatchEvent}
         */
        this.ds = this.dispatchEvent;

        /**
         * 删除所有的事件监听
         * @method ds.core.EventDispatcher.prototype.removeAllEventListeners
         */
        this.removeAllEventListeners = function () {

            this._listeners = {};

        };

    }

    function keys(obj) {

        var keys = [];
        for (var key in obj) {

            keys.push(key);

        }

        return keys;

    }

    function extend(obj) {

        var length = arguments.length;

        if (length < 2 || obj === null) return obj;

        for (var index = 1; index < length; index++) {

            var source = arguments[index],
                ks = keys(source),
                l = ks.length;

            for (var i = 0; i < l; i++) {

                var key = ks[i];
                obj[key] = source[key];

            }

        }

        return obj;
    }

    /**
     * 一个对象通过copy一个EventDispatcher对象方法成员来进行继承事件派发机制
     * @method  ds.core.EventDispatcher.extend
     * @function
     * @static
     * @param {class} source 需要继承事件派发机制的对象
     * @example
     *
     * //创建一个猫的类，继承事件派发机制。
     * function CatClass(){
     *
     *    //这个猫继承了事件派发机制
     *    EventDispatcher.extend(this);
     *
     *    //猫有一个行走的方法
     *    this.startRun=function(){
     *
     *        //发出行走事件 `run`
     *        this.ds('run');
     *
     *    }
     *
     * }
     *
     * //创建一个类的实例
     * var cat = new CatClass();
     *
     * //开始监听猫的 run 行为
     * cat.on('run',function(){
     *      console.log('cat run');
     * });
     *
     * //执行猫开始行走，之前监听就会接受到相关事件
     * cat.startRun();
     *
     */
    EventDispatcher.extend = function (source) {

        extend(source, new EventDispatcher());

    };


    var ds = root.ds || {};
    ds.core = ds.core || {};
    ds.core.EventDispatcher = EventDispatcher;
    /**
     * 事件机制类
     * @class ds.EventDispatcher
     * @classdesc 实现js下的事件派发机制，为复杂的互动交互提供事件派发功能。
     * @see ds.EventDispatcher 实际等同于 {@link ds.core.EventDispatcher}
     */
    ds.EventDispatcher = EventDispatcher;

    return ds.core.EventDispatcher;
}));