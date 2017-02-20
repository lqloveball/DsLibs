/**
 * @class Ds.net.SocketModel
 * @classdesc: Socket连接服务器基础类,配套对应的Node socket.io服务器使用.基于socket.io.js 请确保socket.io.js已经加载。常用于双屏互动项目
 * @extends
 * @example: 举例
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  我发起Ds库目的，简化方便工作项目开发。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里代码很多也都来源至或参考网络开源开放代码，所以这个库也开源开放。更多希望团队成员把积累工作中常用的代码，加快自己开发效率。
 * @constructor
 **/
!(function () {
	window.Ds=window.Ds ||{};
	window.Ds.net = window.Ds.net || {};
	window.Ds.net.SocketModel=SocketModel;
	/**
	 * SocketModel Socket连接服务器基础类
	 */
	function SocketModel() {
			Ds.Extend(this,new Ds.EventDispatcher());
			var _Self=this;
			var _Socket;
			var _SocketUrl;
			var _Port='';
			var _Reconnect;
			_Self.ID='';
			/**
			 * 初始化Socket连接
			 * @param {[Obejct]} param [连接对象]
			 * param.url  		可选  填写 '192.168.1.188'  或者 '192.168.1.188:5001' 不带端口号会使用param.url+param.port;
			 * param.port 		可选  配合param.url 不带端口号时候会使用param.port 参数
			 * param.reconnect 	可选  是否断线重新连接
			 */
			this.InitSocket=function(param){

				_Self.ID='';
				//有传递参数按传递参数进行连接
				if(param){
					_SocketUrl= param.url;
					if(param.port!==undefined)_Port=param.port;
					_Reconnect=param.reconnect;
				}
				else{
					//必须有传递参数
					console.log('InitSocket Error  No param Data');
					return;
				}
				//如果没设置连接socket服务器端ip，使用当前域名进行连接
				if(!_SocketUrl)_SocketUrl=window.location.hostname;
				_Reconnect=_Reconnect===undefined||_Reconnect===true?true:false;

				_Self.SocketUrl=_SocketUrl;
				_Self.Port=_Port;
				_Self.Reconnect=_Reconnect;
				_Self.RoomID='';
				//有原来的Socket对象需要清除掉
				if(_Socket){
					_Socket.destroy();
					_Socket=null;
					_Self.Socket=null;
                }
                //开始判断连接的服务器url判断，按传递参数拼合理的服务器连接
	            _serverUrlArr=_SocketUrl.split(':');
                var _serverUrl='';
                if(_serverUrlArr.length>=2){
                	_serverUrl=_SocketUrl;
                }else if(_serverUrlArr.length===1&&_Port!==''){
                	_serverUrl=_serverUrlArr[0]+':'+_Port;
                }
                else{
                	console.log('socket ServerUrl Error  SocketUrl:'+_SocketUrl+'  Port:'+_Port);
					return;
                }
                console.log('InitSocket:',_serverUrl);
                //按传递参数拼合理的服务器连接进行连接
                _Socket = io.connect(_serverUrl, {
                    // ,port: _Port
                    'force new connection': true,  // 是否允许建立新的连接
                    reconnect: _Reconnect,           // 是否允许重连
                    'reconnection delay': 200, // 重连时间间隔 毫秒
                    'max reconnection attempts': 10 // 重连次数上限
                });
                //指向最新当前Socket对象
	            _Self.Socket=_Socket;
                //socket连接的事件绑定
	            InitSocketEvent();

			};
			/**
			 * 主动断开连接
			 * 是不会触发disconnect
			 */
			this.Destroy=function(){
				//主动断开是不会触发disconnect
				if(_Socket)_Socket.destroy();

				// _Socket=null;
				//  _Self.Socket=null;
				_Self.ds('destroy');
			};
			/**
			 * 加入到指定房间
			 * @param {[String]} roomid [加入的房间号]
			 */
			this.AddRoom=function(roomid){
				_Socket.emit('addRoom',roomid);

			};
			this.CallEndTime=new Date().getTime();
			/**
			 * 对房间内人进行发送消息
			 * @param {[任意]} data [发送消息]
			 */
			this.Call=function(data){
				_Socket.emit('call',data);
				_Self.CallEndTime=new Date().getTime();
			};
			/**
			 * 对房间内人进行发送消息 包括自己
			 * @param {[任意]} data [发送消息]
			 */
			this.CallAll=function(data){
				_Socket.emit('callAll',data);
				_Self.CallEndTime=new Date().getTime();
			};
			/**
			 * 初始化socket事件
			 */
			function InitSocketEvent(){
				 _Self.ds('initSocketEvent');
				/*连接完成*/
				 _Socket.on('connect', function (obj) {
	                // console.log("connect",_Socket.connected,_Socket.io.engine);
	                _Self.ID='/#'+_Socket.io.engine.id;
	                console.log("connect:",_Self.ID);
	                _Self.ds('connect');
	            });
				/*连接中？一般没看到这个事件*/
	            _Socket.on('connecting', function (e) {
	                console.log("connecting");
	                _Self.ds('connecting');
	            });
	            /*连接完成？一般没看到这个事件*/
	            _Socket.on('connect_failed', function (e) {
	                console.log("connect_failed");
	                 _Self.ds('connect_failed');
	            });
	            /*错误信息*/
	            _Socket.on('error', function (e) {
	                console.log("error");
	                _Self.ds('error');
	            });
	            /*断开连接*/
	            _Socket.on('disconnect', function (e) {
	                console.log("disconnect");
	                 _Self.ds('disconnect');
	            });
	            /*断线重连接*/
	            _Socket.on('reconnect', function(transport_type,reconnectionAttempts){
	                // console.log('reconnect*********',_Self.ID,' ',transport_type,reconnectionAttempts);
	                _Self.ds('reconnect');
	            });
	            _Socket.on("message", function (obj) {
	                //进行通知响应客户端连接上来
	                console.log('进行通知响应客户端连接上来',obj);
	            });
	            /*被当垃圾用户清理退出*/
	            _Socket.on('clearWaste', function(){
	            	console.log('clearWaste');
	                _Self.ds('clearWaste');
	            });
	            _Socket.on("call", function (obj) {
	                console.log('call:',obj);
	                // _Self.ds({type:'call',data:obj});
	                if(typeof obj == 'string'){
	               		if(obj.indexOf(':')!=-1){
	               			var type2=obj.slice(0,obj.indexOf(':'));
	               			var data=obj.slice(obj.indexOf(':')+1);
	               			_Self.ds({type:type2,data:data});
	               		}
	               		else{
	               			_Self.ds({type:'call',data:obj});
	               		}

	                }
	                else if(typeof obj == 'object'&&obj.type!==undefined){
               			_Self.ds(obj);
               		}
	                else{
	               		_Self.ds({type:'call',data:obj});
	                }
	            });
	            _Socket.on('serverFull', function(e){
	                console.log('serverFull',e);//服务器最大人数
	                _Self.ds('serverFull');
	            });
	            _Socket.on('roomFull', function(data){
	                console.log('roomFull',data);//data房间最大人数
	                _Self.ds({type:'roomFull',data:data});
	            });
	            _Socket.on('addRoomOK', function(_roomid){
	                // console.log('addRoomOK');
	                _Self.RoomID=_roomid;
	                _Self.ds({type:'addRoomOK',data:_roomid});
	            });
	            _Socket.on('upUserRoomData', function(_roomData){
	            	console.log('upUserRoomData');
	            	/*
	            	_roomData:
		            	{
			                length:_clinetList.length
			                ,num:_clinetList.length
			                ,roomid:_clinet.RoomID
			            }
		            */
	                _Self.ds({type:'upUserRoomData',data:_roomData});
	            });
			}
		}
})();
