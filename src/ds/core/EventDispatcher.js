
/**
 * 事件类
 *
 * @constructor
 */
function EventDispatcher() {}

Object.assign( EventDispatcher.prototype,
    /** @lends EventDispatcher.prototype */
    {
    /**
     * 添加监听事件
     * @param type 事件标识
     * @param listener 事件执行函数
     * @param opts 添加事件相关对象
     */
    addEventListener: function ( type, listener ,opts) {

        if ( this._listeners === undefined ) this._listeners = {};

        var listeners = this._listeners;

        if ( listeners[ type ] === undefined ) {

            listeners[ type ] = [];

        }

        if ( listeners[ type ].indexOf( listener ) === - 1 ) {

            listeners[ type ].push( listener );

        }

    },
    /**
     * 是否监听指定事件
     * @param type  事件标识
     * @param listener 事件执行函数
     * @returns {boolean}
     */
    hasEventListener: function ( type, listener ) {

        if ( this._listeners === undefined ) return false;

        var listeners = this._listeners;

        return listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1;

    },
    /**
     * 删除事件监听
     * @param type 事件标识
     * @param listener  时间执行函数
     * @alias off
     */
    removeEventListener: function ( type, listener ) {

        if ( this._listeners === undefined ) return;

        var listeners = this._listeners;
        var listenerArray = listeners[ type ];

        if ( listenerArray !== undefined ) {

            var index = listenerArray.indexOf( listener );

            if ( index !== - 1 ) {

                listenerArray.splice( index, 1 );

            }

        }

    },
    /**
     * 派发事件
     * @param event 事件标识或者事件对象
     * @alias on
     */
    dispatchEvent: function ( event ) {

        if ( this._listeners === undefined ) return;

        var listeners = this._listeners;
        var listenerArray = listeners[ event.type ];

        if ( listenerArray !== undefined ) {

            event.target = this;

            var array = listenerArray.slice( 0 );

            for ( var i = 0, l = array.length; i < l; i ++ ) {

                array[ i ].call( this, event );

            }

        }

    }

} );

EventDispatcher.prototype.on=EventDispatcher.prototype.addEventListener;
EventDispatcher.prototype.off=EventDispatcher.prototype.removeEventListener;
EventDispatcher.prototype.emit=EventDispatcher.prototype.dispatchEvent;
EventDispatcher.prototype.trigger=EventDispatcher.prototype.dispatchEvent;
EventDispatcher.prototype.ds=EventDispatcher.prototype.dispatchEvent;


export { EventDispatcher };