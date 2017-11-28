----

TweenMax 是基于继承 [TweenLite](Team/TweenMax/TweenLite) 的扩展。会有添加了如repeat(), repeatDelay(), yoyo()这样更多功能。<br>
等同于TweenLite 添加了完整版本的插件  CSSPlugin, RoundPropsPlugin, BezierPlugin, AttrPlugin, DirectionalRotationPlugin 等。<br>

>### 使用示例

可以看的出，使用方法基本与TweenLite相似。<br>
对一个id为 photo的元素进行动画变化成 宽200px 高200px

```js
//tween the element with ID of "myID"
TweenMax.to("#myID", 2, {backgroundColor:"#ff0000", width:"50%", top:"100px", ease:Power2.easeInOut});

//or you can do more advanced selecting like all the elements with the class "myClass" like this:
TweenMax.to(".myClass", 2, {boxShadow:"0px 0px 20px red", color:"#FC0"});
```

也可以同时对多个元素进行动画操作

```js
TweenMax.to([obj1, obj2, obj3], 1, {opacity:0.5, rotation:45});
```

除了 **TweenMax.to()** 从当前状态运动到最终状态，还可以使用 **TweenMax.from()** 从初始化状态运动到当前状态。出此以外还能
**TweenMax.fromTo()** 设置从初始化状态到最终状态。

如果还需要使用到 **paused,play** 等还可以用面对对象写法来编写运动效果。这样可以获取到一个运动控制对象。

```js
var tween = new TweenMax(element, 2, {width:200, height:150});
//或者
var tween = TweenMax.to(element, 2, {width:200, height:150});
```
>### 运动参数配置

!>TweenMax继承TweenLite，这里只列出属于TweenMax新增的属性与方法。

- #### repeat: `Number`
动画重复的次数

- #### repeatDelay: `Number`
动画重复播放延迟执行的时间

- #### yoyo: `Boolean`
动画是否进行yoyo运动

?>更多插件提供动画设置参数可见[Plugin](Team/TweenMax/Plugin.md)

--------

!>TweenMax继承TweenLite，以下是继承的方法。

--------

- #### delay: `Number`
延迟开始运动的时间设置
- #### ease: `Ease` (or Function or String)
运动的方式、变化速度。如`Elastic.easeOut`,`Strong.easeInOut`,运动方式类型有`Linear, Power0, Power1, Power2, Power3, Power4, Quad, Cubic, Quart, Quint,Strong`等，具体可以参考 **`Easing`**

- #### onComplete: `Function`
运动结束后调用的方法

- #### onCompleteParams: `Array`
运动结束后调用的方法内调用的参数<br>
example:

```js
var element = document.getElementById("selectDIV");

TweenLite.to(element, 1, {left:"100px", onComplete:myFunction,onCompleteParams:[element, "param2"]});

function myFunction(value1,value2) {
  console.log(value1,value2);
}
```


如果需要传入当前这个运动对象还能如下写法 使用`"{self}"`

```js
var element = document.getElementById("selectDIV");

TweenLite.to(element, 1, {left:"100px",onComplete:myFunction,onCompleteParams:["{self}", "param2"]});

function myFunction(value1,value2) {
  console.log(value1,value2);
}
```

- #### onCompleteScope: `Object`
可以指定onComplete里面的`this`指向


- #### onReverseComplete: `Function`
一个运动已经完成并进行反向运动，如果反向运动完成后会调用

- #### onReverseCompleteParams: `Array`
反向运动完成后回调函数内的参数设置。（具体参考`onCompleteParams`）

- #### onReverseCompleteScope: `Object`
可以指定onReverseComplete里面的`this`指向


- #### onStart: `Function`
一个运动开始时候

- #### onStartParams: `Array`
一个运动开始时候回调函数内的参数设置。（具体参考`onCompleteParams`）

- #### onStartScope: `Object`
可以指定onStart里面的`this`指向

- #### onUpdate: `Function`
运动过程中的回调

- #### onUpdateParams: `Array`
运动过程中的回调函数内的参数设置。（具体参考`onCompleteParams`）

- #### onUpdateScope: `Object`
可以指定onUpdate里面的`this`指向

- #### onOverwrite: `Function`
运动被覆盖时候的回调

- #### autoCSS: `Boolean`
默认开启，如果`utoCSS:false` 那在运动参数里面进行对运动值的设置必须是`css:{}`内设置

- #### callbackScope: `Object`
设置所有的回调函数的 `this`指向

- #### useFrames: `Boolean`
如果这里设置成**true** 这里进行计算的时候就是按帧来计算而不是秒。具体的FPS的设置在根的帧设置内。

- #### lazy: `Boolean`
惰性，这个参数默认基本不需要去管。根性能相关，想深入了解可以官方查文档`可以忽略这个参数，一般很少使用到`

- #### paused: `Boolean`
是否立刻暂停之前动画运动，可以理解成是否覆盖之前动画。`可以忽略这个参数，一般很少使用到`

- #### immediateRender: `Boolean`
是否立刻开始渲染，但如果设置delay 这个设置忽略，默认是false `可以忽略这个参数，一般很少使用到`

- #### overwrite: `String` (or integer)  
默认是 `auto`,但之前对象已经在运动时候，如果在对这个对象执行运动，那运动引擎要如何处理。`可以忽略这个参数，一般很少使用到`
  - "none" (0) 忽略什么都不做
  - "all" (1) 全部覆盖
  - "auto" (2) 只有有冲突运动属性才会做覆盖
  - "concurrent" (3) 干掉所有，从当前重新开始(个人理解、有误请指出)
  - "allOnStart" (4) 干掉所有对这个对象进行运动的显示对象，只要是已经开始的运动对象(个人理解、有误请指出)
  - "preexisting" (5)理解太挠，建议自己看英文文档并尝试(个人理解、有误请指出)

- #### lazy: `Boolean`
惰性设置 提供性能

- #### autoCSS: `Boolean`
开启自动转换css参数值设置倒vars值内

- #### callbackScope: `Object`
统一设定回调的this指向


>### Plugins 插件

主要是 **CSSPlugin** ，对k数要求高，不希望引入 **CSSPlugin** 。<br>
会在写法上有区别,不引入插件 对dom元素进行运动 css变化必须如下写法

```js
TweenLite.to(element, 1, {css:{top:"100px", left:"50px", backgroundColor:"#ff0000", fontSize:"12px"}, delay:0.5});
```


>### Plugins 插件

!>TweenMax继承TweenLite，这里只列出属于TweenMax新增的属性与方法。其他特性与TweenLite一致

- roundProps : String
- bezier Object

>### 属性

#### .data : `*`
 设置运动的参数数据
#### .target : `Object`
 [只读] 运动的对象
#### .timeline : `SimpleTimeline`
 [只读] 运动时间轴队列
#### .vars : `Object`
 运动过程与运动结束时候 运动变化的数据

----
>### 方法

!>TweenMax继承TweenLite，这里只列出属于TweenMax新增的属性与方法。

--------
#### .repeat( value:`Number` ) :` *`
获取重复动画次数， 设置重复动画次数

#### .repeatDelay( value:`Number` ) :` *`
设置或者获取 重复动画延迟执行的时间

#### .updateTo( vars:`object`, resetDuration:`Boolean` ) : `*`
动态更新动画最终运动参数设置
- vars: `object` 参数设置
- resetDuration: `Boolean` (default = false) 是否重新计算渐变

#### .yoyo( value:`Boolean` ) : `*`
悠悠球运动 正播后进行倒播
- value:`Boolean`(default = false)  

!>TweenMax继承TweenLite，以下是继承的方法。

--------
#### .delay( value:`Number` ) : *
get:获取动画延迟执行时间<br>
set:`value`值传入设置动画延迟执行时间

#### .duration( value:`Number` ) : *
get:获取动画持续时间<br>
set:`value`值传入设置动画持续时间

#### .endTime( includeRepeats:`Boolean` ) : `Number`
返回动画完成时候在timeline中时间，默认值 true，避免重复计算结束时间带来的错误

#### .eventCallback( type:`String`, callback:`Function`, params:`Array`, scope:`*` ) : `*`
进行设置事件回调  "onComplete", "onUpdate", "onStart", "onReverseComplete" or "onRepeat"。（onRepeat是TweenMax才有的）

#### .invalidate( ) : `*`
可以理解成重置，清除所有初始化数据。把一个动画恢复最初状态

#### .isActive( ) : `Boolean`
判断一个动画是否激活在活动状态

#### .kill( vars:`Object`, target:`Object` ) : `*`
干掉一个动画
```js
//干掉所有动画
 myAnimation.kill();

 //干掉指定参数的动画
 myAnimation.kill({x:true, y:true});

 //干掉指定对象所有动画
 myAnimation.kill(null, myObject);

 //干掉指定对象指定参数的动画
 myAnimation.kill({x:true, y:true}, myObject);

 //干掉指定数量对象指定参数的动画
 myAnimation.kill({opacity:true}, [myObject1, myObject2]);
```

#### .pause( atTime:`*`, suppressEvents:`Boolean` ) : `*`
暂定当前的动画<br>
`atTime: *` 暂时在时间位置<br>
`suppressEvents:Boolean` 是否触发事件，默认是true
#### .paused( value:`Boolean` ) : *
获取动画是否暂停，传值可以控制暂停还是播放

#### .play( from:`*`, suppressEvents:`Boolean` ) : `*`
控制运动是否播放<br>
`from: *`控制播放时间点<br>
`suppressEvents:Boolean` 是否触发事件，默认是true

#### .progress( value:`Number`, suppressEvents:`Boolean` ) : `*`
设置或者获取运动的播放进度 值`0`至`1`

#### .restart( includeDelay:`Boolean`, suppressEvents:`Boolean` ) :` *`
重新启动引擎播放<br>
`includeDelay: Boolean` 重播放是需要加入延迟执行的设置<br>
`suppressEvents:Boolean` 是否触发事件，默认是true

#### .resume( from:`*`, suppressEvents:`Boolean` ) : `*`
恢复到特定运行时间节点

#### .reverse( from:`*`, suppressEvents:`Boolean` ) : `*`
方向播放运动动画<br>
`from: *`在动画结束后多久进行方向播放<br>
`suppressEvents:Boolean` 是否触发事件，默认是true

#### .reversed( value:`Boolean` ) : `*`
获取或者设置动画是否反向播放

#### .seek( time:`*`, suppressEvents:`Boolean` ) : `*`
跳转到指定动画时间点

#### .startTime( value:`Number` ) :` *`
获取或设置动画在timeline的开始时间点

#### .time( value:Number, suppressEvents:`Boolean` ) : `*`
获取或设置本地播放时间 <br>
get:获取当前时间t<br>
set:类似于seek()<br>

#### .timeScale( value:`Number` ) :` *`
运动播放速度的控制，1=1x速 2=2x速 0.5=0.5x速

#### .totalDuration( value:`Number` ) : `*`
获取或设置动画的总持续时间包括repeats or repeatDelays( 只在TweenMax and TimelineMax有效)

#### .totalProgress( value:`Number`, suppressEvents:`Boolean` ) :` *`
设置或者获取播放进度

#### .totalTime( time:`Number`, suppressEvents:`Boolean` ) : `*`
设置或者获取播放总时间


-----

>### 全局属性

!>TweenMax继承TweenLite，这里只列出属于TweenMax新增的属性与方法。

--------
无

!>TweenMax继承TweenLite，以下是继承的方法。

--------
#### TweenMax.defaultEase : `Ease`
[静态方法] 全局设置运动的方式
#### TweenMax.defaultOverwrite : `String` = "auto"
[静态方法] 默认运动覆盖方式 默认值 "auto". 还可以设置"auto", "all", "none", "allOnStart", "concurrent", "preexisting".
#### TweenMax.onOverwrite : `Function`
[静态方法] 覆盖运动时候回调函数
#### TweenMax.selector : `*` = document.getElementById()
[静态方法] 使用的dom选择器
#### TweenMax.ticker : `Object`
[静态方法] 运动引擎的触发器。
```js
  //add listener
  TweenMax.ticker.addEventListener("tick", myFunction);

  function myFunction(event) {
      //executes on every tick after the core engine updates
  }

  //to remove the listener later...
  TweenMax.ticker.removeEventListener("tick", myFunction);
```
默认使用requestAnimationFrame，没有requestAnimationFrame支持的浏览器，自动会使用setTimeout来代替。<br>
可以强制使用setTimout() 代替 requestAnimationFrame
```js
TweenMax.ticker.useRAF(false);
```
如果运动时候使用帧来代替，可以设置全局的 fps
```js
TweenMax.ticker.fps(30);
```
添加对运动引擎触发器的监听
```js
addEventListener(type, callback, scope, useParam, priority)
```
1. type : String - 监听类型 "tick"
2. callback : Function - 监听执行事件函数
3. scope : Object - 回调函数内的 `this` 指向
4. useParam : Boolean - 如果是ture 一直监听  false会监听一次后取消监听 提供性能。
5. priority : Integer - 监听次数
```js
TweenMax.ticker.addEventListener("tick", myFunction, this, true, 1);

function myFunction(event) {
    //executes on every tick after the core engine updates
}

//to remove the listener later...
TweenMax.ticker.removeEventListener("tick", myFunction);
```

>### 全局方法

!>TweenMax继承TweenLite，这里只列出属于TweenMax新增的属性与方法。

--------

#### TweenMax.getAllTweens( includeTimelines:`Boolean` ) : `Array`
返回一个数组,其中包含所有tweens
- includeTimelines: `Boolean` (default = false)  如果是true 会包含TimelineLite 与 TimelineMax 实例

#### TweenMax.globalTimeScale( value:`Number` )
获取或者设置全局的动画时间播放倍数

#### TweenMax.isTweening( target:`Object` ) : `Boolean`
判断一个tweens是否在动画播放中

#### TweenMax.killAll( complete:`Boolean`, tweens:`Boolean`, delayedCalls:`Boolean`, timelines:`Boolean` )
干掉所有动画
- complete: `Boolean` (default = false) Determines whether or not the tweens/delayedCalls/timelines should be forced to completion before being killed.
- tweens: `Boolean` (default = true) If true, all tweens will be killed (TweenLite and TweenMax instances)
- delayedCalls: `Boolean` (default = true) If true, all delayedCalls will be killed. TimelineMax callbacks are treated the same as delayedCalls.
- timelines: `Boolean` (default = true) If true, all delayedCalls will be killed. TimelineMax callbacks are treated the same as delayedCalls.

#### TweenMax.killChildTweensOf( parent:`Object`, complete:`Boolean` )
干掉一个对象的动画执行，还可以设置强制执行播放完成函数回调

#### TweenMax.pauseAll( tweens:`Boolean`, delayedCalls:`Boolean`, timelines:`Boolean` )
暂停所有的动画播放
- tweens: `Boolean` (default = true) — If true, all tweens will be paused.
- delayedCalls: `Boolean` (default = true) — If true, all delayedCalls will be paused. timeline callbacks are treated the same as delayedCalls.
- timelines: `Boolean` (default = true) — If true, all TimelineLite and TimelineMax instances will be paused (at least the ones who haven’t finished and been removed from their parent timeline)

#### TweenMax.resumeAll( tweens:`Boolean`, delayedCalls:`Boolean`, timelines:`Boolean` )
快速恢复所有暂停动画命令执行
- tweens: `Boolean` (default = true) — If true, all tweens will be resumed.
- delayedCalls: `Boolean` (default = true) — If true, all delayedCalls will be resumed. timeline callbacks are treated the same as delayedCalls.
- timelines: `Boolean` (default = true) — If true, all TimelineLite and TimelineMax instances will be resumed (at least the ones who haven’t finished and been removed from their parent timeline)

#### TweenMax.staggerFrom( targets:`Array`, duration:`Number`, vars:`Object`, stagger:`Number`, onCompleteAll:`Function`, onCompleteAllParams:`Array`, onCompleteAllScope:`*` ) : Array
快速一组对象进行设置动画 并且设置动画之间间隔

#### TweenMax.staggerFromTo( targets:`Array`, duration:`Number`, vars:`Object`, stagger:`Number`, onCompleteAll:`Function`, onCompleteAllParams:`Array`, onCompleteAllScope:`*` ) : Array
快速一组对象进行设置动画 并且设置动画之间间隔

#### TweenMax.staggerTo( targets:`Array`, duration:`Number`, vars:`Object`, stagger:`Number`, onCompleteAll:`Function`, onCompleteAllParams:`Array`, onCompleteAllScope:`*` ) : Array
快速一组对象进行设置动画 并且设置动画之间间隔

!>TweenMax继承TweenLite，以下是继承的方法。

--------

#### TweenMax.delayedCall( delay:`Number`, callback:`Function`, params:`Array` , scope:`*`, useFrames:`Boolean` ) : `TweenLite`

提供了一个简单的方法来调用一个函数延迟执行<br>
- delay: Number   延迟执行事件
- callback: Function  延迟执行的函数
- params: Array   延迟执行的函数参数
- scope: *      函数内this指向
- useFrames: Boolean 使用帧 还是秒数


#### TweenMax.from( target:`Object`, duration:`Number`, vars:`Object` ) : `TweenLite`
从什么状态运动到当前状态。当前有一个div x=100px。TweenLite.from 可以设置div的x=-100px 那动画就是从-100px运动到100px位置。
- target: Object  运动的对象
- duration: Number 运动使用的时间或帧
- vars: Object  运动参数设置


#### TweenMax.fromTo( target:`Object`, duration:`Number`, fromVars:`Object`, toVars:`Object` ) : `TweenLite`
从一个指定的fromVars:`Object` 参数 运动到 toVars:`Object` 参数的位置
- target: Object  运动的对象
- duration: Number 运动使用的时间或帧
- fromVars: Object  运动初始化参数设置
- vars: Object  运动参数设置


#### TweenMax.getTweensOf( target:`*`, onlyActive:`Boolean` ) : `Array`
根据对象获取一组 TweenLite运动对象
- target: * 一个或者多个对象
- onlyActive: * 是否只获取激活的运动对象


#### TweenMax.killDelayedCallsTo( func:`Function` ) :
消灭一个延迟执行方法

#### TweenMax.killTweensOf( target:`Object`, onlyActive:Boolean, vars:`Object` ) :
干掉一个或者多个对象的运动执行。
- target: Object 一个或者多个对象
- onlyActive: Boolean 是否只干掉激活的
- vars: Object 设置只干掉的运动对象里面参数值


#### TweenMax.lagSmoothing( threshold:`Number`, adjustedLag:`Number` ) :

运动平滑，这个考虑到控制太多的运动对象，从性能上可能会出现跳帧状态。通过调整核心心跳包机制来解决跳帧
- threshold: Number

?>Amount of lag (in millisecond) after which the engine will adjust the internal clock to act like the adjustedLag elapsed instead. The lower the number, the more likely (and frequently) lagSmoothing() will be triggered. For example, if the threshold is 500 and the adjustedLag is 33 (those are the defaults), the only time an adjustment will occur is when more than 500ms elapses between two ticks in which case it will act as though only 33ms elapsed. So if the CPU bogs down for 2 full seconds (yikes!), your animations will move 33ms worth of time on the next render instead of jumping a full 2-seconds. Note: this has no affect on the device’s performance or true frame rate – this merely affects how GSAP reacts when the browser drops frames.
- adjustedLag: Number

?>The new (adjusted) amount of time (in milliseconds) from the previous tick. Typically it is best to set this to at least 16 because that’s the normal amount of time between ticks when the engine is running at 60 frames per second. It is more common to set it to at least 33 (which is 2 normal “ticks”). If you set the threshold and the adjustedLag too low, your animations can appear to slow down under heavy pressure. The higher the adjustedLag, the more of a “jump” you’ll see when lagSmoothing kicks in.

#### TweenMax.render( )

!>两手一摊，我没有理解

#### TweenMax.set( target:`Object`, vars:`Object` ) : `TweenLite`

设置对象的状态
- target: Object 一个或者多个对象
- vars: Object 设置对象状态


#### TweenMax.to( target:`Object`, duration:`Number`, vars:`Object` ) : `TweenLite`

当前对象从现在状态 运动到指定的状态
- target: Object  运动的对象
- duration: Number 运动使用的时间或帧
- vars: Object  运动参数设置
