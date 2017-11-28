### 了解事件

事件机制，中高级程序敲门砖

前端绝对大部分的时间都是在做交互事情，如果你只是想了解鼠标 、键盘 等人机交互运用，那可以不需要学习。
上一课说过面对对象编程，我们程序是一个个对象、一个个模块共同协作提供。这样必然涉及对象之间的交流消息。
事件机制是一个非常激动人心机制，只有了解了事件机制才能进入中高级编程的门。
要成为中高级程序员，不可避免需要学会人机交互、网络加载、异步处理、这些都离不开事件机制。


###  Event与callback

对于新手来说，刚刚接触事件处理机制，会觉的非常抽象。也许你已经非常习惯了callback的方式来写程序，觉的这样已经够用了。
我下面用一张图来说这事情的区别

<img src="./images/JSBase/e0.png" width = "300" alt="" align=center /><br><br>

### 事件机制三要素

- 事件发送者 EventDispatcher 
- 事件   Event
- 事件监听者 Event listener

EventDispatcher  什么是事件发送者，可以理解成是拥有一个消息广播功能的发射器<br>

<img src="./images/JSBase/e1.png" width = "300" alt="" align=center /><br><br>

Event 什么是事件，就是由EventDispatcher事件发送者发射出来的消息

<img src="./images/JSBase/e2.png" width = "300" alt="" align=center /><br>

Event listener 什么是事件监听者，是订阅接EventDispatcher事件发送者消息的对象
螺旋桨与灯光泡都可以订阅EventDispatcher事件发送者消息，做出相应的反应。


### 具体实现

可以看我们的`Dslibs`库里[EventDispatcher](https://github.com/lqloveball/DsLibs/blob/master/src/ds/core/EventDispatcher.js)

Q1、如何让我的一个类拥有事件发送者EventDispatcher能力。
A1、让你的类继承EventDispatcher，具体代码实现

```js

//ES6继承事件写法
import EventDispatcher from  'ds/core/EventDispatcher';
export default class CatClass extends EventDispatcher
{

}

//非ES6继承事件写法
function CatClass(){
    ds.core.EventDispatcher.extend(this);
};
```
