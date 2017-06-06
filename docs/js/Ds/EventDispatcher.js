 /**
  * @class Ds.EventDispatcher;
  * @classdesc 类说明:
  * 事件类：Ds.EventDispatcher
  * 类扩展方法：Ds.Extend
  * 类工厂方法：Ds.ExtendFactory
  * 对象不覆盖copy：Ds.ExtendNoCover
  * @extends
  * @example Ds.Extend(this, new Ds.EventDispatcher());
  * @author: maksim email:maksim.lin@foxmail.com
  * @copyright:   Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
  * @constructor
  **/
 (function(factory) {
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
     root.Ds.EventDispatcher = EventDispatcher;
     /**
      * 事件类
      * EventDispatcher类是可调度事件的类的基类，它允许显示列表上的任何对象都是一个事件目标。
      * 这个没按命名规范，这个尽量保持与第三方通用库统一 addEventListener removeEventListener dispatchEvent on off ds方式
      */
     function EventDispatcher() {
         var _self = this;
         this._eventMap = {}; //事件映射表，格式为：{type1:[listener1, listener2], type2:[listener3, listener4]}
         this._eventByKeyMap = {}; //需要使用key保护事件映射表
         /**
          * 添加监听事件
          * @param {[type]} type     [事件名]
          * @param {[type]} listener [事件执行函数]
          * @param  {[type]} key [事件key 可以空]
          */
         this.addEventListener = function(type, listener, key) {
             var _eventMap = this._eventMap;
             var _keyBool = false;
             if (key !== undefined && typeof(key) == 'string') _keyBool = true;
             if (_keyBool) {
                 _eventMap = this._eventByKeyMap;
             }
             if (_keyBool) listener.key = key;

             var map = _eventMap[type];
             if (map === null || map === undefined) map = _eventMap[type] = [];
             if (map.indexOf(listener) == -1) {
                 map.push(listener);
                 return true;
             }
             return false;
         };
         /**
          * 删除事件侦听器。
          * @param  {[type]} type     [事件类型]
          * @param  {[type]} listener [事件执行函数]
          * @param  {[type]} key [事件key 可以空]
          * @return {[type]}          [返回是否删除成功]
          */
         this.removeEventListener = function(type, listener, key) {
             var _eventMap = this._eventMap;
             var _keyBool = false;
             if (key !== undefined && typeof(key) == 'string') _keyBool = true;
             if (_keyBool) {
                 _eventMap = this._eventByKeyMap;
             }

             if (arguments.length == 1) return this.removeEventListenerByType(type);
             var map = _eventMap[type];
             if (map === null || map === undefined) return false;

             for (var i = 0; i < map.length; i++) {
                 var li = map[i];
                 if (li === listener) {
                     if (_keyBool && li.key != key) {
                         console.warn('Error: removeEventListener Key Mismatch');
                         return false;
                     }
                     map.splice(i, 1);
                     if (map.length === 0) delete _eventMap[type];
                     return true;
                 }
             }
             return false;
         };
         /**
          * 删除指定类型的所有事件侦听器。
          * @param  {[type]} type [事件类型]
          * @param  {[type]} key  [事件key 可以删除所有带key事件]
          * @return {[type]}      [是否删除成功]
          */
         this.removeEventListenerByType = function(type, key) {
             var _eventMap = this._eventMap;
             var _keyBool = false;
             if (key !== undefined && typeof(key) == 'string') _keyBool = true;
             if (_keyBool) {
                 _eventMap = this._eventByKeyMap;
             }
             var map = _eventMap[type];
             if (map === null || map === undefined) return false;
             //对没key处理
             if (!_keyBool) {
                 if (map !== null && map !== undefined) {
                     delete _eventMap[type];
                     return true;
                 }
             }
             //对带key处理
             else {
                 var bool = false;
                 for (var i = 0; i < map.length; i++) {
                     var li = map[i];
                     if (li.key == key) {
                         bool = true;
                         map.splice(i, 1);
                     }
                 }
                 return bool;
             }

             return false;
         };
         /**
          * 删除所有事件侦听器。
          * [注意:带key事件是没办法批量删除，只能手动对key进行删除];
          * @return {[type]} [事件类型]
          */
         this.removeAllEventListeners = function() {
             this._eventMap = {};
         };
         /**
          * 派发事件，调用事件侦听器。
          * @param  {[type]} event [触发事件对象，可以是字符串也可以使用一个对象]
          * @return {[type]}       [description]
          */
         this.dispatchEvent = function(event) {
             if (typeof event == 'string') event = {
                 type: event
             };
             var map = this._eventMap[event.type];
             var keyMap = this._eventByKeyMap[event.type];
             if ((map === null || map === undefined) && (keyMap === null || keyMap === undefined)) {
                 return false;
             }
             //普通事件
             if (!event.target) event.target = this;
             var i = 0;
             var listener;
             if (map) {
                 map = map.slice();
                 for (i = 0; i < map.length; i++) {
                     listener = map[i];
                     if (typeof(listener) == "function") {
                         listener.call(this, event);
                     }
                 }
             }
             //带key事件发送
             if (keyMap) {
                 keyMap = map.slice();
                 for (i = 0; i < map.length; i++) {
                     listener = keyMap[i];
                     if (typeof(listener) == "function") {
                         listener.call(this, event);
                     }
                 }
             }

             return true;
         };
         /**
          * 检查是否为指定事件类型注册了任何侦听器。
          * @param  {[type]}  type [description]
          * @return {Array}      [description]
          */
         this.hasEventListener = function(type) {
             var map = this._eventMap[type];
             return map;
             //  return (map != null && map != undefined) && map.length > 0;
         };
         //添加若干的常用的快捷缩写方法
         this.on = this.addEventListener;
         this.off = this.removeEventListener;
         this.ds = this.dispatchEvent;
     }
     EventDispatcher.extend = function(obj) {
         root.Ds.Extend(obj, new EventDispatcher());
     };

     /**
      * 类扩展方法，多个对象扩展
      * @param  {[type]} obj [目标扩展的对象]
      * @param  {[type]} arguments [多个继承父级对象]
      * @return {[type]}     [目标扩展的对象]
      */
     root.Ds.Extend = extend;
     /**
      * 类扩展方法，不做覆盖
      * @param  {[type]} target [目标扩展对象]
      * @param  {[type]} source [原对象,记住是不要用实际使用的一个对象，用一个new出来新对象]
      * @return {[type]}        [目标扩展对象]
      */
     root.Ds.ExtendNoCover = extendNoCover;
     /**
      * Function类创建继承子类工厂方法
      * @param  {[type]} protoProps  [description]
      * @param  {[type]} staticProps [description]
      * @return {[type]}             [description]
      * @example
        //命名空间
        var Namespaces={};
        //创建ClassA类
        Namespaces.ClassA=function(){
          name:'classA',
          initialize:function(){
              console.log(this.name+':initialize');
          }
        };
        //让ClassA有继承工厂方法
        Namespaces.ClassA.extend = window.Ds.ExtendFactory;
        //ClassB 通过 ClassA.extend
        Namespaces.ClassB=ClassA.extend({
          name:'classB',
          initialize: function (params) {
              //继承父级 调用父级initialize 重构前方法执行
              Namespaces.ClassB.__super__.initialize.apply(this, [params]);
              //以下重构过的方法实现
          },
        });
      *
      */
     root.Ds.ExtendFactory = extend2;
     /**
      * Object key List
      * @param  {[type]} obj [description]
      * @return {[Array]}     [description]
      */
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

     function extend2(protoProps, staticProps) {
         var parent = this;
         var child;

         if (protoProps && Object.prototype.hasOwnProperty.call(protoProps, 'constructor')) {
             child = protoProps.constructor;
         } else {
             child = function() {
                 return parent.apply(this, arguments);
             };
         }
         extend(child, parent, staticProps);
         var Surrogate = function() {
             this.constructor = child;
         };
         Surrogate.prototype = parent.prototype;
         child.prototype = new Surrogate();

         if (protoProps) extend(child.prototype, protoProps);

         child.__super__ = parent.prototype;

         return child;
     }

     function extendNoCover(target, source) {
         for (var key in source) {
             if (source[key] !== undefined && target[key] === undefined) {
                 target[key] = source[key];
             }
         }
         return target;
     }

     return root.Ds.EventDispatcher;
 }));
