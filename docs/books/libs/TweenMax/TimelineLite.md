
-----

如是一个动画队列，那TweenLite就不太够用了。这时候需要一个时间轴的概念来做复杂的动画。我们可以通过TimelineLite来完成。

> ### 使用示例

比如对3个对象做一系列的动画执行

```js
TweenLite.to(element, 1, {left:100});
TweenLite.to(element, 1, {top:50, delay:1});
TweenLite.to(element, 1, {opacity:0, delay:2});
```

可以通过TimelineLite写成,这样就可以对整个动画队列进行播放 暂停 跳转时间 倒播进行控制

```js
var tl = new TimelineLite();
tl.add( TweenLite.to(element, 1, {left:100}) );
tl.add( TweenLite.to(element, 1, {top:50}) );
tl.add( TweenLite.to(element, 1, {opacity:0}) );

//then later, control the whole thing...
tl.pause();
tl.resume();
tl.seek(1.5);
tl.reverse();
```
也能通过`to()`方法进行快速编写
```js
var tl = new TimelineLite();
tl.to(element, 1, {left:100}).to(element, 1, {top:50}).to(element, 1, {opacity:0});
```

以我的理解，列举下timeline方式好处与特点。
- 动画可以多个进行重叠，多个对象动画运动执行时间开始时间、结束时间、运动过程时间互相之间重叠控制更方便。
- 可以添加动画标签label ，控制播放 停止  跳转  重播  倒播
- 后续添加新的动画（特别是项目需求增加删除一些动画元素的时候）更加智能与灵活，不需要重新编写大量代码（前提理解时间轴概率）
- 支持播放时间倍数  1x 2x  0.5x 等
- 可以根据交互快速控制播放的进度 myTimeline.progress(0.5);
- 灵活控制时间与倒播
- 添加各种播放事件的响应 如 onComplete, onStart, onUpdate 等
- 对动画对象运动清理工作也很简便  kill
- 可以独立设置是否 已经帧计算 （fps），或者是时间 秒数。默认是秒数为单位
- 可以面对对象的方式，快速定义对一个类型的对象设计一个timeline轨迹
- 通过TimelineMax 还能有更多如epeat, repeatDelay, yoyo, currentLabel(), getLabelAfter(), getLabelBefore(), addCallback(), removeCallback(), getActive(), 这些编辑的方法。


### 运动参数配置

可以通过运动参数配置进行初始化设置动画时间轴配置。
```js
new TimelineLite({onComplete:myFunction, delay:2});
```
#### delay: `Number`
延迟开始的时间

#### paused: `Boolean`
是否初始化暂停 默认 true

#### onComplete: `Function`
动画播放结束后执行方法

#### onCompleteScope: `Object`
动画播放结束回调方法 this的指向

#### useFrames: `Boolean`
是否以帧计算 默认是false

#### tweens: `Array`
时间轴内的tween对象列表

#### align: `String`
进行添加tween运动时候 添加对齐方式
- "sequence" :序列 一个接一个
- "start" : 全部都添加一开始 （忽略延迟时间 delays）
- "normal" 对齐开始时间 （不忽略延迟时间 delays）

#### stagger: `Number`
每个新添加的运动之间的间隔时间

#### onStart: `Function`
动画开始回调函数

#### onStartScope: `Object`
动画开始回调函数 this的指向

#### onReverseComplete: `Function`
动画倒播回调函数
#### onReverseCompleteScope: `Object`
动画倒播回调函数 this的指向
#### onUpdate: `Function`
动画播放回调函数
#### onUpdateScope: `Object`
动画播放回调函数 this的指向
#### autoRemoveChildren: `Boolean`
是否自动删除已经运动完成运动引擎 提供性能

#### smoothChildTiming: `Boolean`
是否需要平滑播放动画

#### onCompleteParams: `Array`
动画播放结束回调函数 参数 `更多细节可以参考TimelineLite`
#### onStartParams: `Array`
动画开始播放回调函数 参数 `更多细节可以参考TimelineLite`
#### onUpdateParams: `Array`
动画播放中回调函数 参数 `更多细节可以参考TimelineLite`
#### onReverseCompleteParams: `Array`
动画倒播回调函数 参数 `更多细节可以参考TimelineLite`

> #### 简单例子代码

```js
//create the timeline with an onComplete callback that calls myFunction() when the timeline completes
var tl = new TimelineLite({onComplete:myFunction});
//add a tween
tl.add( TweenLite.to(element, 1, {left:200, top:100}) );

//add another tween at the end of the timeline (makes sequencing easy)
tl.add( TweenLite.to(element, 0.5, {opacity:0}) );

//append a tween using the convenience method (shorter syntax) and offset it by 0.5 seconds
tl.to(element, 1, {rotation:30}, "+=0.5");

//reverse anytime
tl.reverse();
//Add a "spin" label 3-seconds into the timeline
tl.addLabel("spin", 3);
//insert a rotation tween at the "spin" label (you could also define the insertion point as the time instead of a label)
tl.add( TweenLite.to(element, 2, {rotation:"+=360"}), "spin");

//go to the "spin" label and play the timeline from there
tl.play("spin");
//nest another TimelineLite inside your timeline...
var nested = new TimelineLite();
nested.to(element, 1, {left:400}));
tl.append(nested);
```

> ### 属性

  #### autoRemoveChildren : `Boolean`
  在动画结束删除子child（tweens/timelines）

  #### smoothChildTiming : `Boolean`
  动画播放平滑过优化

> ### 方法

  #### add( value:`*`, position:`*`, align:`String`, stagger:`Number` ) : `*`
  添加 运动、时间表、回调或标签(或数组)
  - value: `*` 运动、时间表、回调或标签(或数组)
  - position: `*` (默认值 = +=0) 可以是固定的秒数，也可以使用"+=" or "-="方式代表添加在当前总时间数学计算后的时间 也可以是一个标签如"myLabel" or "myLabel-=3"
  - align: `String` (默认值 = normal) 添加运动队列对齐方式
  - stagger: `Number`(默认值 = 0) 动画与动画直接执行间隔

  #### addLabel( label:`String`, position:`*` ) : `*`
  添加一个标签代表指定的时间
  - label: `String` 标签名
  - position: `* ` 标签时间点 可以是固定的秒数，也可以使用"+=" or "-="方式代表添加在当前总时间数学计算后的时间 也可以是一个标签如"myLabel" or "myLabel-=3"

  #### addPause( position:`*`, callback:`Function`, params:`Array`, scope:`*` ) : `*`
  添加一个暂停的时间点
  - position: * 添加暂停的时间点
  - callback: Function 添加暂停回调函数
  - params: Array 添加回调函数参数
  - scope: * 添加回调的 this指向

  #### call( callback:`Function`, params:`Array`, scope:`*`, position:`*` ) : `*`
  添加代码执行函数调用
  - callback: `Function` 添加暂停回调函数
  - params: `Array` 添加回调函数参数
  - scope: `*` 添加回调的 this指向
  - position: `*` 添加暂停的时间点

  #### clear( labels:`Boolean` ) : `*`
  清空所有动画执行队列
  - labels: `Boolean` (默认值 = true) 标签也会被清除。

  #### delay( value:`Number` ) : `*`
  设置或者获取动画延迟执行的时间

  #### duration( value:`Number` ) : `*`
  设置或者获取动画时间长度

  #### endTime( includeRepeats:`Boolean` ) : `Number`
  返回动画播放完成对应父级时间轴时间
  ```js
  var tl = new TimelineLite();
  var tween = TweenLite.to(e, 1, {x:100}); //create a 1-second tween
  tl.add(tween, 0.5); //insert the tween at 0.5 seconds into the timeline
  console.log(tween.endTime()); //1.5
  tween.timeScale(2); //double the speed of the tween, thus it'll finish in half the normal time
  console.log(tween.endTime()); //1
  ```

  #### eventCallback( type:`String`, callback:`Function`, params:`Array`, scope:`*` ) : `*`
  进行设置事件回调  "onComplete", "onUpdate", "onStart", "onReverseComplete" or "onRepeat"。（onRepeat是TweenMax才有的）
  - type: `String`  "onComplete", "onUpdate", "onStart", "onReverseComplete" or "onRepeat"。（
  - callback: `Function`  回调的方法
  - params: `Array`  回调的参数
  - scope: `*`  回调的 this 指向


  #### from( target:`Object`, duration:`Number`, vars:`Object`, position:`*` ) : `*`
  从什么状态运动到当前状态。当前有一个div x=100px。TweenLite.from 可以设置div的x=-100px 那动画就是从-100px运动到100px位置。
  - target: `Object`  运动的对象
  - duration: `Number` 运动使用的时间或帧
  - vars: `Object`  运动参数设置
  - position:`*`  标签时间点 可以是固定的秒数，也可以使用"+=" or "-="方式代表添加在当前总时间数学计算后的时间 也可以是一个标签如"myLabel" or "myLabel-=3"


  #### fromTo( target:`Object`, duration:`Number`, fromVars:`Object`, toVars:`Object`, position:`*` ) :` *`
  从一个指定的fromVars:`Object` 参数 运动到 toVars:`Object` 参数的位置
  - target: `Object`  运动的对象
  - duration: `Number` 运动使用的时间或帧
  - fromVars: `Object`  运动初始化参数设置
  - vars: `Object`  运动参数设置
  - position:`*`  标签时间点 可以是固定的秒数，也可以使用"+=" or "-="方式代表添加在当前总时间数学计算后的时间 也可以是一个标签如"myLabel" or "myLabel-=3"


  #### getChildren( nested:`Boolean`, tweens:`Boolean`, timelines:`Boolean`, ignoreBeforeTime:`Number` ) : `Array`
  返回时间轴上运动对象列表
  - nested:`Boolean` (default = true) 是否包含嵌套
  - tweens:`Boolean` (default = true)  
  - timelines:`Boolean`(default = true)
  - ignoreBeforeTime:`Number`(default = -9999999999) 是否忽略指定时间以后的子对象
  ```js
  //first, let's set up a master timeline and nested timeline:
  var master = new TimelineLite(),
      nestedTimeline = new TimelineLite();
  //drop 2 tweens into the nested timeline
  nestedTimeline.to("#e1", 1, {x:100})
      .to("#e2", 2, {y:200});
  //drop 3 tweens into the master timeline
  master.to("#e3", 1, {top:200})
      .to("#e4", 1, {left:100})
      .to("#e5", 1, {backgroundColor:"red"});
  //nest the timeline:
  master.add(nestedTimeline);

  //now let's get only the direct children of the master timeline:
  var children = master.getChildren(false, true, true, 0);
  console.log(children.length); //"3" (2 tweens and 1 timeline)
  //get all of the tweens/timelines (including nested ones) that occur AFTER 0.5 seconds
  children = master.getChildren(true, true, true, 0.5);
  console.log(children.length); //"5" (4 tweens and 1 timeline)
  //get only tweens (not timelines) of master (including nested tweens):
  children = master.getChildren(true, true, false, 0);
  console.log(children.length); //"5" (5 tweens)
  ```

  #### getLabelTime( label:`String` ) : `Number`
  根据标签名获取时间点

  #### getTweensOf( target:`Object`, nested:`Boolean` ) : `Array`
  根据对象获取timeline
  - target:`Object` 根据对象找timeline
  - nested:`Boolean` 是否包含嵌套

  #### invalidate( ) : `*`
  初始化重置时间轴

  #### isActive() : `Boolean`
  时间轴是否激活

  #### .kill( vars:`Object`, target:`Object` ) : `*`
  干掉一个动画 `【更多】继承Animation 可以看TweenLit`

  #### .pause( atTime:`*`, suppressEvents:`Boolean` ) : `*`
  暂停动画 `【更多】继承Animation 可以看TweenLit`

  #### .play( from:`*`, suppressEvents:`Boolean` ) : `*`
  播放动画 `【更多】继承Animation 可以看TweenLit`

  #### progress( value:`Number`, suppressEvents:`Boolean` ) :` *`
  动画进度获取或者设置 `【更多】继承Animation 可以看TweenLit`

  #### recent( ) : `Animation`
  返回最近添加子对象 tween/timline/回调无论在时间轴的位置。
  ```js
  var tl = new TimelineLite();
  tl.to(e1, 999, {x:100, repeat:5}) //very long tween
    .to(e2, 1, {y:200}, 0.5); //insert this tween at 0.5 seconds (toward the beginning of the timeline)
    .to(e3, 1, {scaleX:2}, tl.recent().endTime() + 3);//inserts the new tween 3 seconds after the e2 tween which was added most recently.
  ```

  #### remove( value:`*` ) : `*`
  删除一个子对象tween/timline/回调


  #### removeLabel( label:`String` ) :` *`
  删除一个指定标签名

  #### render( time:`Number`, suppressEvents:`Boolean`, force:`Boolean` ) :`renders`
  忽略不用管

  #### restart( includeDelay:`Boolean`, suppressEvents:`Boolean` ) : `*`
  动画重播
  - includeDelay:`Boolean` 是否包含延迟时间
  - suppressEvents:`Boolean` 事件支持

  #### resume( from:`*`, suppressEvents:`Boolean` ) :` *`
  恢复播放
  - from:`*` 重指定地方恢复播放
  - suppressEvents:`Boolean` 事件支持

  #### reverse( from:`*`, suppressEvents:`Boolean` ) : `*`
  倒播
  - from:`*` 重指定地方倒播
  - suppressEvents:`Boolean` 事件支持

  #### reversed( value:`Boolean` ) : `*`
  获取动画倒播状态 或者 设置倒播
  - value:`Boolean` 输入值的话就是进行倒播设置

  #### seek( position:`*`, suppressEvents:`Boolean` ) : `*`
  动画跳到指定时间 `【更多】继承Animation 可以看TweenLit`

  #### set( target:`Object`, vars:`Object`, position:`*` ) : `*`
  动画跳到指定时间 `【更多】继承Animation 可以看TweenLit`


  #### shiftChildren( amount:`Number`, adjustLabels:`Boolean`, ignoreBeforeTime:`Number` ) :` *`
  批量移动指定时间的子对象播放时间点

  #### staggerFrom( targets:`Array`, duration:`Number`, vars:`Object`, stagger:`Number`, position:`*`, onCompleteAll:`Function`, onCompleteAllParams:`Array`, onCompleteScope:`*` ) : `*`
  对一组对象进行设置相同的动画 ，同时设置每个动画直接运动的间隔 `适用面不大`

  #### staggerFromTo( targets:`Array`, duration:`Number`, fromVars:`Object`, toVars:`Object`, stagger:`Number`, position:`*`, onCompleteAll:`Function`, onCompleteAllParams:`Array`, onCompleteScope:`*` ) :` *`
  对一组对象进行设置相同的动画 ，同时设置每个动画直接运动的间隔 `适用面不大`

  #### staggerTo( targets:`Array`, duration:`Number`, vars:`Object`, stagger:`Number`, position:`*`, onCompleteAll:`Function`, onCompleteAllParams:`Array`, onCompleteScope:`*` ) : `*`
  对一组对象进行设置相同的动画 ，同时设置每个动画直接运动的间隔 `适用面不大`

  #### time( value:Number, suppressEvents:Boolean ) : *
  设置或者获取动画时间 `【更多】继承Animation 可以看TweenLit`

  #### timeScale( value:Number ) : *
  设置或者获取动画播放倍数 `【更多】继承Animation 可以看TweenLit`

  #### to( target:`Object`, duration:`Number`, vars:`Object`, position:`*` ) : `*`
  当前对象从现在状态 运动到指定的状态
  - target: `Object`  运动的对象
  - duration: `Number` 运动使用的时间或帧
  - vars: `Object`  运动参数设置
  - position:`*`  插入到时间轴内时间点

  #### totalDuration( value:`Number` ) :` *`
  获取总时间 `【更多】继承Animation 可以看TweenLit`

  #### totalProgress( value:Number, suppressEvents:Boolean ) : *
  设置总的动画播放进度 `【更多】继承Animation 可以看TweenLit`

  #### totalTime( time:Number, suppressEvents:Boolean ) : *
  设置动画总时间 `【更多】继承Animation 可以看TweenLit`

  #### useFrames( ) : `Boolean`
  设置是否适用帧计算 `【更多】继承Animation 可以看TweenLit`

>### 全局静态方法

  #### TimelineLite.exportRoot( vars:`Object`, omitDelayedCalls:`Boolean` ) : `TimelineLite`
  直接看代码理解吧
  ```js
  var tl = TimelineLite.exportRoot();
  TweenLite.to(tl, 0.5, {timeScale:0});

  //this tween isn't affected because it's created after the export.
  TweenLite.fromTo(myWindow, 1, {scaleX:0, scaleY:0}, {scaleX:1, scaleY:1});
  ```
