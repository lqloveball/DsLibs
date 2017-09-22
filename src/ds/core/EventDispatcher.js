/**
 * 事件机制类
 * @class ds.core.EventDispatcher
 */
function EventDispatcher() {
}

Object.assign(EventDispatcher.prototype,
    /** @lends ds.core.EventDispatcher.prototype */
    {

        /**
         * 添加监听事件
         * @param {string | object} type 事件标识
         * @param {function} listener 事件执行函数
         * @param {object} opts 添加事件相关对象
         */
        addEventListener: function (type, listener, opts) {

            if (this._listeners === undefined) this._listeners = {};

            var listeners = this._listeners;

            if (listeners[type] === undefined) {

                listeners[type] = [];

            }

            if (listeners[type].indexOf(listener) === -1) {

                listeners[type].push(listener);

            }

        },
        /**
         * 添加监听事件
         * @method ds.core.EventDispatcher.prototype.on
         * @see {@link ds.core.EventDispatcher#addEventListener}
         */
        on: EventDispatcher.prototype.addEventListener,
        /**
         * 判断是否监听指定事件
         * @param {string } type  事件标识
         * @param {function} listener 事件执行函数
         * @returns {boolean}
         *
         */
        hasEventListener: function (type, listener) {

            if (this._listeners === undefined) return false;

            var listeners = this._listeners;

            return listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1;

        },
        /**
         * 判断是否监听指定事件
         * @method ds.core.EventDispatcher.prototype.hs
         * @see {@link ds.core.EventDispatcher#addEventListener}
         */
        hs: EventDispatcher.prototype.hasEventListener,
        /**
         * 删除监听事件
         * @param type 事件标识
         * @param listener  时间执行函数
         */
        removeEventListener: function (type, listener) {

            if (this._listeners === undefined) return;

            var listeners = this._listeners;
            var listenerArray = listeners[type];

            if (listenerArray !== undefined) {

                var index = listenerArray.indexOf(listener);

                if (index !== -1) {

                    listenerArray.splice(index, 1);

                }

            }

        },
        /**
         * 删除监听事件
         * @method ds.core.EventDispatcher.prototype.off
         * @see {@link ds.core.EventDispatcher#removeEventListener}
         */
        off: EventDispatcher.prototype.removeEventListener,
        /**
         * 派发事件
         * @param {string | object } event 事件标识或者事件对象
         */
        dispatchEvent: function (event) {

            if (this._listeners === undefined) return;

            var listeners = this._listeners;
            var listenerArray = listeners[event.type];

            if (listenerArray !== undefined) {

                event.target = this;

                var array = listenerArray.slice(0);

                for (var i = 0, l = array.length; i < l; i++) {

                    array[i].call(this, event);

                }
            }
        },
        /**
         * 派发事件
         * @method ds.core.EventDispatcher.prototype.emit
         * @see {@link ds.core.EventDispatcher#dispatchEvent}
         */
        emit: EventDispatcher.prototype.dispatchEvent,
        /**
         * 派发事件
         * @method ds.core.EventDispatcher.prototype.trigger
         * @see {@link ds.core.EventDispatcher#dispatchEvent}
         */
        trigger: EventDispatcher.prototype.dispatchEvent,
        /**
         * 派发事件
         * @method ds.core.EventDispatcher.prototype.ds
         * @see {@link ds.core.EventDispatcher#dispatchEvent}
         */
        ds: EventDispatcher.prototype.dispatchEvent,
    });

//获取 global对象，在浏览器中就是window
var root = (typeof window !== 'undefined'
    ? window
    : (typeof process === 'object' &&
        typeof require === 'function' &&
        typeof global === 'object')
        ? global
        : this);
/** @namespace */
ds = root.ds || {};
/** @namespace */
ds.core = ds.core || {};
ds.core.EventDispatcher = EventDispatcher;

export {EventDispatcher};