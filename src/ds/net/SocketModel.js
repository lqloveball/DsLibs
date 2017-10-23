(function (factory) {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);

    if (typeof define === 'function' && define.amd) {
        define(['exports'], function (exports) {
            require('ds/EventDispatcher');
            var _io = require('libs/socket.io/socket.io.js');
            module.exports = factory(root, exports, _io);
        });
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(root, exports);
    } else {
        factory(root, {});
    }
}(function (root, modelOb, io) {

    root.ds = root.ds || {};
    root.ds.net = root.ds.net || {};
    root.ds.net.SocketModel = SocketModel;


    /**
     * socket 交互模块。
     * ##### 常用于双屏互动项目
     * 服务器端代码如下：配套对应的Node socket.io服务器使用. socket服务器端代码 other/SocektServer.zip
     * 基于socket.io.js，请确保socket.io.js已经加载 (webpack开发模式下已经做了处理,src/libs/socket.io/socket.io.js)。 -
     * @class ds.net.SocketModel
     * @TODO 需要完善这个文档例子DEMO
     *
     */
    function SocketModel() {

        var _self = this;

        ds.EventDispatcher.extend(this);

        var _id;

        /**
         * socket 的 id
         * @member {string} ds.net.SocketModel.prototype.el
         */
        Object.defineProperty(this, "id", {
            get: function () {
                return _id;
            },
        });

        //socket对象
        var _socket;
        //连接的地址
        var _socketUrl;
        //连接的端口号
        var _port = '';
        //是否断线重连接
        var _reconnect;
        //房间
        var _roomID = '';

        /**
         * 双屏互动的房间号
         * @member {string} ds.net.SocketModel.prototype.roomID
         */
        Object.defineProperty(this, "roomID", {
            get: function () {
                return _roomID;
            },
        });

        /**
         * 初始化socket连接
         * @method ds.net.SocketModel.prototype.initSocket
         * @param {object} opts 配置参数
         * @param {string} [opts.url=window.location.hostname] 可选  填写 '192.168.1.188'  或者 '192.168.1.188:5001'
         * @param {string} opts.port 默认可以不传。如果传端口号 那链接规则是：opts.url+opts.port;
         * @param {boolean} [opts.reconnect=true] 是否断线重连
         */
        this.initSocket = function (opts) {

            _id = '';


            if (opts) {

                _socketUrl = opts.url;
                if (opts.port !== undefined) _port = opts.port;
                _reconnect = opts.reconnect;

            } else {

                //必须有传递参数
                console.log('InitSocket Error  No param Data');
                return;

            }

            //如果没设置连接socket服务器端ip，使用当前域名进行连接
            if (!_socketUrl) _socketUrl = window.location.hostname;
            _reconnect = _reconnect === undefined || _reconnect === true ? true : false;


            //对之前socket清空
            if (_socket) {

                _socket.destroy();
                _socket = null;

            }

            //开始判断连接的服务器url判断，按传递参数拼合理的服务器连接
            var _serverUrlArr = _socketUrl.split(':');
            var _serverUrl = '';

            if (_serverUrlArr.length >= 2) _serverUrl = _socketUrl;
            else if (_serverUrlArr.length === 1 && _port !== '') _serverUrl = _serverUrlArr[0] + ':' + _port;
            else {
                
                console.log('socket ServerUrl Error  SocketUrl:' + _socketUrl + '  Port:' + _port);
                return;
                
            }


            console.log('initSocket:', _serverUrl);

            //按传递参数拼合理的服务器连接进行连接
            _socket = io.connect(_serverUrl, {
                // 是否允许建立新的连接
                'force new connection': true,
                // 是否允许重连
                reconnect: _reconnect,
                // 重连时间间隔 毫秒
                'reconnection delay': 200,
                // 重连次数上限
                'max reconnection attempts': 10
            });

            //socket连接的事件绑定
            initSocketEvent();


        };

        /**
         * 主动断开连接
         * 是不会触发disconnect
         * @method ds.net.SocketModel.prototype.initSocket
         */
        this.destroy=function () {

            if (_socket) {
                
                _socket.destroy();
                _socket = null;
                
            }

            _self.ds('destroy');
            
        };

        /**
         * 加入到指定房间
         * @method ds.net.SocketModel.prototype.addRoom
         * @param {string} roomid [加入的房间号]
         *
         */
        this.addRoom = function(roomid) {

            _socket.emit('addRoom', roomid);

        };

        /**
         * 最后一次发消息时间点
         *
         * @type {number}
         */
        this.callEndTime = new Date().getTime();

        /**
         * 对房间内人进行发送消息
         * @method ds.net.SocketModel.prototype.call
         * @param {object|string} data [发送消息]
         */
        this.call = function(data) {

            _socket.emit('call', data);
            _self.CallEndTime = new Date().getTime();

        };

        /**
         * 对房间内人进行发送消息 包括自己
         * @method ds.net.SocketModel.prototype.callAll
         * @param {object|string} data [发送消息]
         */
        this.callAll = function(data) {

            _socket.emit('callAll', data);
            _self.CallEndTime = new Date().getTime();

        };


        
        function initSocketEvent() {

            /**
             * 开始进行socket连接
             * @event ds.net.SocketModel#initSocketEvent
             */
            _self.ds('initSocketEvent');

            /*连接完成*/
            _socket.on('connect', function(obj) {

                // console.log("connect",_Socket.connected,_Socket.io.engine);
                _self.id = '/#' + _socket.io.engine.id;
                console.log("connect:", _self.id);

                /**
                 * 连接成功
                 * @event ds.net.SocketModel#connect
                 */
                _self.ds('connect');
                
            });
            
            
            /*连接中？一般没看到这个事件*/
            _socket.on('connecting', function(e) {

                console.log("connecting");

                /**
                 * 连接中，一般不会发出这个事件
                 * @event ds.net.SocketModel#connecting
                 */
                _self.ds('connecting');

            });


            /*连接完成？一般没看到这个事件*/
            _socket.on('connect_failed', function(e) {
                console.log("connect_failed");

                /**
                 * 连接完成，一般不会发出这个事件
                 * @event ds.net.SocketModel#connect_failed
                 */
                _self.ds('connect_failed');

            });

            /*错误信息*/
            _socket.on('error', function(e) {

                console.log("error");

                /**
                 * 错误信息
                 * @event ds.net.SocketModel#error
                 */
                _self.ds('error');

            });

            /*断开连接*/
            _socket.on('disconnect', function(e) {
                console.log("disconnect");



                /**
                 * 断开连接
                 * @event ds.net.SocketModel#disconnect
                 */
                _self.ds('disconnect');

            });

            /*断线重连接*/
            _socket.on('reconnect', function(transport_type, reconnectionAttempts) {

                // console.log('reconnect*********',_self.ID,' ',transport_type,reconnectionAttempts);

                /**
                 * 断线重连接
                 * @event ds.net.SocketModel#reconnect
                 */
                _self.ds('reconnect');

            });

            _socket.on("message", function(obj) {

                //获取到接受到消息
                console.log('获取到接受到消息', obj);

            });

            /*被当垃圾用户清理退出*/
            _socket.on('clearWaste', function() {

                console.log('clearWaste');

                /**
                 * 被服务器当垃圾用户清理退出
                 * @event ds.net.SocketModel#clearWaste
                 */
                _self.ds('clearWaste');

            });

            _socket.on("call", function(obj) {

                console.log('call:', obj);

                // _self.ds({type:'call',data:obj});
                if (typeof obj == 'string') {

                    if (obj.indexOf(':') != -1) {

                        var type2 = obj.slice(0, obj.indexOf(':'));
                        var data = obj.slice(obj.indexOf(':') + 1);


                        /**
                         * 房间发送来的 自定义call消息
                         * @event ds.net.SocketModel#xxx
                         * @property {number} type - 自定义事件类型
                         * @property {*} data - 数据
                         */
                        _self.ds({
                            type: type2,
                            data: data
                        });

                    } else {

                        /**
                         * 房间发送来的 call消息
                         * @event ds.net.SocketModel#call
                         * @property {number} type - 事件类型
                         * @property {*} data - 数据
                         */
                        _self.ds({
                            type: 'call',
                            data: obj
                        });

                    }

                } else if (typeof obj == 'object' && obj.type !== undefined) {

                    _self.ds(obj);

                } else {

                    _self.ds({
                        type: 'call',
                        data: obj
                    });

                }

            });


            _socket.on('serverFull', function(e) {

                console.log('serverFull', e); //服务器最大人数


                /**
                 * 服务器最大人数已满
                 * @event ds.net.SocketModel#serverFull
                 */
                _self.ds('serverFull');

            });

            _socket.on('roomFull', function(data) {


                console.log('roomFull', data); //data房间最大人数


                /**
                 * 房间已经满
                 * @event ds.net.SocketModel#roomFull
                 */
                _self.ds({
                    type: 'roomFull',
                    data: data
                });


            });


            _socket.on('addRoomOK', function(roomid) {

                // console.log('addRoomOK');
                _roomID = roomid;

                /**
                 * 成功加入房间
                 * @event ds.net.SocketModel#addRoomOK
                 * @property {string} roomid - 房间id
                 */
                _self.ds({
                    type: 'addRoomOK',
                    data: roomid
                });

            });


            _socket.on('upUserRoomData', function(roomData) {

                console.log('upUserRoomData');

                /**
                 * 更新房间信息
                 * @event ds.net.SocketModel#upUserRoomData
                 * @property {object} data - 房间数据
                 * ```js
                 *  {
                 *      //房间的人数
                 *       length:2,
                 *       //自己在房间内编号
                 *       num:1,
                 *       //房间id
                 *       roomid:_clinet.RoomID
                 *   }
                 * ```
                 */
                _self.ds({
                    type: 'upUserRoomData',
                    data: roomData
                });

            });
            
        }

    }


    return root.ds.net.SocketModel;
}));