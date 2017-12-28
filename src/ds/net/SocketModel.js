(function (factory) {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);

    if (typeof define === 'function' && define.amd) {
        define(['exports'], function (exports) {
            require('ds/core/EventDispatcher');
            module.exports = factory(root, exports);
        });
    } else if (typeof exports !== 'undefined') {
        require('ds/core/EventDispatcher');
        module.exports = factory(root, exports);
    } else {
        factory(root, {});
    }
}(function (root, modelOb) {

    var io = require('libs/socket.io/socket.io.js');

    root.ds = root.ds || {};
    root.ds.net = root.ds.net || {};
    root.ds.net.SocketModel = SocketModel;


    /**
     * socket 交互模块。
     * ##### 常用于双屏互动项目
     * 服务器端代码如下：配套对应的Node socket.io服务器使用. socket服务器端代码 other/SocektServer.zip
     * 基于socket.io.js，请确保socket.io.js已经加载 (webpack开发模式下已经做了处理,src/libs/socket.io/socket.io.js)。 -
     * @class ds.net.SocketModel
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

        /**
         * 链接成功后获取到socket对象
         */
        Object.defineProperty(this, "socket", {
            get: function () {
                return _socket;
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
        //进行监听的事件
        var _events = [];
        //默认监听事件  适合做双屏互动的
        var _defaultEvents = [
            "serverFull",
            "roomFull",
            "addRoomOK",
            "upUserRoomData",
            "clearWaste",//被服务器当垃圾用户清理退出
        ];
        Object.defineProperty(this, "defaultEvents", {
            get: function () {
                return _defaultEvents;
            },
        });

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
         * @param {array} opts.events 需要监听的事件名 ['noRoom','outRoom',.....];
         * @param {boolean} [opts.reconnect=true] 是否断线重连
         */
        this.initSocket = function (opts) {

            _id = '';

            opts = opts || {};

            _socketUrl = opts.url;
            if (opts.port !== undefined) _port = opts.port;
            //如果没设置连接socket服务器端ip，使用当前域名进行连接
            if (!_socketUrl) _socketUrl = window.location.hostname;
            _reconnect = opts.reconnect !== undefined ? opts.reconnect : true;


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

            _events = opts.events !== undefined ? opts.events : [];

            console.log('initSocket:', _serverUrl);

            //按传递参数拼合理的服务器连接进行连接

            this.socketConfig = {
                // 'force new connection': true,
                // 是否允许建立新的连接
                forceNew: true,
                // 是否允许重连
                reconnection: _reconnect,
                // 重连时间间隔 毫秒
                reconnectionDelay: 100,
                //重连时间最大间隔 毫秒
                reconnectionDelayMax: 1000,
                // 重连次数
                reconnectionAttempts: 10,
                // 超时时间
                timeout: 1000 * 10
            };

            //重新连接次数
            this.reconnectionIndex = 0;

            _socket = io(_serverUrl, this.socketConfig);
            //_socket = io.connect(_serverUrl, this.socketConfig);

            //socket连接的事件绑定
            initSocketEvent();

            return _socket;
        };

        /**
         * 主动断开连接
         * 是不会触发disconnect
         * @method ds.net.SocketModel.prototype.initSocket
         */
        this.destroy = function () {

            if (_socket) {
                console.log('socket destroy');
                _socket.destroy();
                _socket = null;
                _self.ds('destroy');
            }


        };

        /**
         * 加入到指定房间
         * @method ds.net.SocketModel.prototype.addRoom
         * @param {string} roomid [加入的房间号]
         *
         */
        this.addRoom = function (roomid) {

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
        this.call = function (data) {

            _socket.emit('call', data);
            _self.CallEndTime = new Date().getTime();

        };

        /**
         * 对房间内人进行发送消息 包括自己
         * @method ds.net.SocketModel.prototype.callAll
         * @param {object|string} data [发送消息]
         */
        this.callAll = function (data) {
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
            _socket.on('connect', function (obj) {
                _self.reconnectionIndex = 0;
                console.log("connect", _socket.connected, _socket.io.engine);
                _id = '/#' + _socket.io.engine.id;
                console.log("connect:", _self.id);
                /**
                 * 连接成功
                 * @event ds.net.SocketModel#connect
                 */
                _self.ds('connect');

            });


            /*连接中？一般没看到这个事件*/
            _socket.on('connecting', function (e) {

                console.log("connecting");

                /**
                 * 连接中，一般不会发出这个事件
                 * @event ds.net.SocketModel#connecting
                 */
                _self.ds('connecting');

            });


            /*连接完成？一般没看到这个事件*/
            _socket.on('connect_failed', function (e) {
                console.log("connect_failed");

                /**
                 * 连接完成，一般不会发出这个事件
                 * @event ds.net.SocketModel#connect_failed
                 */
                _self.ds('connect_failed');

            });
            /*链接错误错误信息*/
            _socket.on('connect_error', function (e) {


                _self.reconnectionIndex += 1;
                console.log("connect_error", _self.reconnectionIndex);
                /**
                 * 链接错误
                 * @event ds.net.SocketModel#connect_error
                 */
                _self.ds('connect_error');
                if (_self.reconnectionIndex > _self.socketConfig.reconnectionAttempts) {
                    /**
                     * 多次链接最终失败
                     * @event ds.net.SocketModel#connectError
                     */
                    _self.ds('connectError');
                }


            });

            /*链接超时间*/
            _socket.on('connect_timeout', function (e) {

                console.log("connect_timeout");

                /**
                 * 链接超时间
                 * @event ds.net.SocketModel#connect_timeout
                 */
                _self.ds('connect_timeout');

            });

            /*错误信息*/
            _socket.on('error', function (e) {

                console.log("error");

                /**
                 * 错误信息
                 * @event ds.net.SocketModel#error
                 */
                _self.ds('error');

            });

            /*断开连接*/
            _socket.on('disconnect', function (e) {
                console.log("disconnect", e);

                /**
                 * 断开连接
                 * @event ds.net.SocketModel#disconnect
                 */
                _self.ds({
                    type: 'disconnect',
                    data: e,
                });

            });

            /*断线重连接*/
            _socket.on('reconnect', function (transport_type, reconnectionAttempts) {

                // console.log('reconnect*********',_self.ID,' ',transport_type,reconnectionAttempts);

                /**
                 * 断线重连接
                 * @event ds.net.SocketModel#reconnect
                 */
                _self.ds('reconnect');

            });

            _socket.on("message", function (obj) {

                //获取到接受到消息
                console.log('获取到接受到消息', obj);

            });

            //封装call消息命令方式
            _socket.on("call", function (obj) {

                console.log('call:', obj);

                // _self.ds({type:'call',data:obj});
                if (typeof obj === 'string' && (obj.indexOf(':') !== -1)) {

                    var type2 = obj.slice(0, obj.indexOf(':'));
                    var data = obj.slice(obj.indexOf(':') + 1);

                    /**
                     * 房间发送来的 call消息自定义封装了一层消息机制
                     * @event ds.net.SocketModel#xxx
                     * @property {number} type - 自定义事件类型
                     * @property {*} data - 数据
                     */
                    _self.ds({
                        type: type2,
                        data: data
                    });
                    console.log(type2+' > '+data);
                }
                if (typeof obj === 'object' && obj.type !== undefined) {

                    _self.ds(obj);

                }
                /**
                 * 房间发送来的 call消息
                 * @event ds.net.SocketModel#call
                 * @property {number} type - 自定义事件类型
                 * @property {*} data - 数据
                 */
                _self.ds({
                    type: 'call',
                    data: obj
                });

            });

            //绑定其他事件
            for (var i = 0; i < _events.length; i++) {
                var _event = _events[i];
                _addSocketEvent(_event);
            }

        }

        //绑定其他事件
        function _addSocketEvent(event) {
            _socket.on(event, function (data) {
                // console.log(event);
                _self.ds({type: event, data: data});

            });
        }

    }


    return root.ds.net.SocketModel;
}));