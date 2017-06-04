> **类:** Ds.EventDispatcher

# 定义

EventDispatcher 类 是所有拥有事件调度,发送功能的类的基类。事件发送者（EventDispatcher）是Ds库的重要组成部分。很多模块都需要用有事件发送功能。

**让一个类继承拥有事件发送功能**

```javascript
//创建一个类
function ClassA(){
  var _Self=this;
  //这个类继承有事件派发功能
  Ds.Extend(this, new Ds.EventDispatcher());
  //一个运行方法
  this.Run=function () {
    //运行这个方法时候 发出一个事件通知
    _Self.ds({type:'run',time:new Date().getTime()})
  }
}
//构建 ClassA的实例 _Temp对象
var _Temp=new ClassA();
//注册一个对_Temp对象进行监听的 run 事件
_Temp.on('run',function(e){console.log(e);});

//试着执行_Temp.Run();
_Temp.Run();
```

> 实例构造

### 属性

!>无

### 方法

> #### on<br>

添加监听对当前对象发送的事件<br>
**等同 addeventlistener** [详见](/Ds/EventDispatcher?id=addeventlistener)

> #### off<br>

删除对当前对象事件监听<br>
**等同 removeeventlistener** [详见](/Ds/EventDispatcher?id=removeeventlistener)

> #### ds<br>

派发事件，对外广播一个事件。对当前对象进行事件监听的函数会被执行。<br>
**等同 dispatchevent** [详见](/Ds/EventDispatcher?id=dispatchevent)

> #### addEventListener<br>

**定义**<br>
添加监听对当前对象发送的事件

**参数**<br>
type `String` 事件名<br>
listener`Function` 接收到事件后执行的方法<br>
key`String` 可选项 默认空值。事件钥匙，删除事件时候需要输入钥匙号。（避免一些高级组件事件被误删）<br>

**返回**<br>
true `Boolean` 是否添加成功，false就是不成功。

> #### removeEventListener<br>

**定义**<br>
删除对当前对象事件监听

**参数**<br>
type `String` 事件名<br>
listener`Function` 接收到事件后执行的方法<br>
key`String` 可选项 默认空值。事件钥匙，删除事件时候需要输入钥匙号。（避免一些高级组件事件被误删）<br>

**返回**<br>
true `Boolean` 是否添加成功，false就是不成功。

> #### removeEventListenerByType<br>

**定义**<br>
删除指定类型的所有事件监听

**参数**<br>
type `String` 事件名<br>
key`String` 可选项 默认空值。事件钥匙，删除事件时候需要输入钥匙号。（避免一些高级组件事件被误删）<br>

**返回**<br>
true `Boolean` 是否添加成功，false就是不成功。

> #### removeAllEventListeners<br>

**定义**<br>
删除所有事件侦听器。

!>带key事件是没办法批量删除，只能手动对key进行删除

**参数**<br>
无

**返回**<br>
无

> #### dispatchEvent<br>

**定义**<br>
派发事件，对外广播一个事件。对当前对象进行事件监听的函数会被执行。

**参数**<br>
event `String Object` 进行发送事件 可以是字符串 也可以是一个事件对象。

**返回**<br>
true `Boolean` 是否添加成功，false就是不成功。

> #### hasEventListener<br>

**定义**<br>
检查是否为指定事件类型注册了任何监听器。

**参数**<br>
type `String` 事件名<br>

**返回**<br>
map `Array` 返回一组这个事件会触发的函数列表

### 查看示例

<iframe  src="https://jsfiddle.net/maksim84/4dvu5rwj/2/embedded/js,result,html,css/" allowfullscreen="allowfullscreen" frameborder="0" style="width:100%;height:300px;"></iframe>
