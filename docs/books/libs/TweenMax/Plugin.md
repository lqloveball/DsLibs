> ### AttrPlugin

对Dom 元素内的属性进行渐变运动设置

```html
<rect id="rect" fill="none" x="0" y="0" width="500" height="400"></rect>
```

```js
TweenLite.to("#rect", 1, {attr:{x:100, y:50, width:100, height:100}, ease:Linear.easeNone});
```
> ### BezierPlugin

在配置内的对象为 **`bezier`**

- type:`String`  对对象进行贝塞尔相关渐变运动设置，可以设置贝塞尔计算的类型 如 `type:"soft"`
  - `thru` (the default) 穿过 可以设置对象运动轨迹穿过设定的点。
  - `soft` 贝塞尔曲线 控制点如同磁力吸起曲线  头尾2个点 是初始点与结束点，中间点如同磁力吸引运动物体
  - `quadratic` 贝塞尔曲线 点--控制点--点---控制点
  - `cubic` 贝塞尔曲线 每个贝塞尔曲线都有一个控制点 如ps的钢笔工具 点--控制点--控制点---点

- values:`Array` 贝塞尔曲线的值 如：[{x:100, y:250}, {x:300, y:0}, {x:500, y:400}]
- timeResolution:`Number`(default:6) - 可以理解成贝塞尔运动过程中细节度，默认值已经比较合理了
- curviness:`Number`(default:1) - 用默认就可以了不要多想了
- autoRotate : `Boolean, Number, or Array `  是否带自动角度旋转 如：`["x","y","rotation",90*Math.PI/180,true]`
- correlate : `String` 用默认值就好了 不设置

例子
```js
//tween the "left" and "top" css properties through the supplied values (notice we're passing the array directly to the bezier rather than creating an object with "values" because we're accepting the defaults)
TweenMax.to(document.getElementById("myDiv"), 5, {bezier:[{left:100, top:250}, {left:300, top:0}, {left:500, top:400}], ease:Power1.easeInOut});

//if we want to customize things, like the curviness and setting autoRotate:true, we need to define the bezier as an object instead, and pass our array as the "values" property
TweenMax.to(document.getElementById("myDiv"), 5, {bezier:{curviness:1.25, values:[{x:100, y:250}, {x:300, y:0}, {x:500, y:400}], autoRotate:true}, backgroundColor:"#f00", ease:Power1.easeInOut});

//let's define the type as "soft" instead of using the default "thru"
TweenMax.to(document.getElementById("myDiv"), 5, {bezier:{type:"soft", values:[{x:100, y:250}, {x:300, y:0}, {x:500, y:400}], autoRotate:true}, ease:Power1.easeInOut});

//now we'll do a cubic Bezier and make our target auto rotate but add 45 degrees to the rotation
TweenMax.to(document.getElementById("myDiv"), 5, {bezier:{type:"cubic", values:[{x:100, y:250}, {x:150, y:100}, {x:300, y:500}, {x:500, y:400}], autoRotate:["x","y","rotation",45,false]}, ease:Power1.easeInOut});

//NON-CSS, generic x/y property tween: animate obj through the points in the array (notice we're passing the array directly to the bezier rather than creating an object with "values" because we're accepting the defaults)
TweenMax.to(obj, 5, {bezier:[{x:100, y:250}, {x:300, y:0}, {x:500, y:400}], ease:Power1.easeInOut});
```

> ### ColorPropsPlugin

可以对任何对象的颜色值进行编号操作
```js
//tweens myObject.borderColor and myObject.myCustomProp
TweenLite.to(myObject, 1, {colorProps:{borderColor:"red", myCustomProp:"rgb(204,51,0)"}, ease:Linear.easeNone});
```
```js
//tween a getter/setter-based value
TweenLite.to(myObject, 1, {colorProps:{setColor:"rgb(102,255,51)"}, ease:Linear.easeNone});
```
```js
//gets
var color = myObject.lineColor();

//sets
myObject.lineColor("rgb(255,0,51)");

//tweens
TweenLite.to(myObject, 1, {colorProps:{lineColor:"rgb(102,255,51)"}, ease:Linear.easeNone});
```

> ### CSSPlugin

可以快速控制CSS属性设置运动的参数内，更多细节建议看[官方文档](https://greensock.com/docs/Plugins/CSSPlugin)

> ### CSSRulePlugin

可以快速控制CSS属性设置运动的参数内，更多细节建议看[官方文档](https://greensock.com/docs/Plugins/CSSRulePlugin)

> ### DirectionalRotationPlugin

对角度进行动画设置时候 可以加入顺时针与逆时针旋转

更多细节建议看[官方文档](https://greensock.com/docs/Plugins/DirectionalRotationPlugin)

如：
```js
//obj.rotation starts at 45
var obj = {rotation:45};

//tweens to the 270 position in a clockwise direction
TweenLite.to(obj, 1, {directionalRotation:"270_cw"});

//tweens to the 270 position in a counter-clockwise direction
TweenLite.to(obj, 1, {directionalRotation:"270_ccw"});

//tweens to the 270 position in the shortest direction (which, in this case, is counter-clockwise)
TweenLite.to(obj, 1, {directionalRotation:"270_short"});
```

> ### DrawSVGPlugin

对SVG路绘制的控制插件 更多细节建议看[官方文档](https://greensock.com/docs/Plugins/DrawSVGPlugin)

> ### EaselPlugin

`默认不在TweenMax内`

针对EaselJS进行运动操作，特别是关于动态滤镜 更多细节建议看[官方文档](https://greensock.com/docs/Plugins/EaselPlugin)

```js
TweenLite.to(circle, 3, {easel:{colorFilter:{redMultiplier:0.5, blueMultiplier:0.8, greenOffset:100}}});
```

> ### ModifiersPlugin

`默认不在TweenMax内`

需要修饰修改参数值变化过程 更多细节建议看[官方文档](https://greensock.com/docs/Plugins/ModifiersPlugin)


> ### MorphSVGPlugin

对SVG图像绘制对象动画切换 更多细节建议看[官方文档](https://greensock.com/docs/Plugins/MorphSVGPlugin)

> ### Physics2DPlugin

2D粒子效果 更多细节建议看[官方文档](https://greensock.com/docs/Plugins/Physics2DPlugin)

> ### Physics2DPlugin

物理效果 更多细节建议看[官方文档](https://greensock.com/docs/Plugins/PhysicsPropsPlugin)

> ### RaphaelPlugin

Raphael是一个很有名svg库，主要对这个库的动画插件 更多细节建议看[官方文档](https://greensock.com/docs/Plugins/RaphaelPlugin)
> ### RoundPropsPlugin

四舍五入计算插件 更多细节建议看[官方文档](https://greensock.com/docs/Plugins/RoundPropsPlugin)

对 x 与 y 变化过程中用四舍五入
```js
TweenMax.to(mc, 2, {x:300, y:200, opacity:0.5, roundProps:"x,y"});
```

> ### ScrambleTextPlugin

`默认不在TweenMax内 属于会员插件`

骇客字刷新替换出现效果插件 更多细节建议看[官方文档](https://greensock.com/docs/Plugins/ScrambleTextPlugin)

```js
//use the defaults
TweenLite.to(element, 1, {scrambleText:"THIS IS NEW TEXT"});

//or customize things:
TweenLite.to(element, 1, {scrambleText:{text:"THIS IS NEW TEXT", chars:"XO", revealDelay:0.5, speed:0.3, newClass:"myClass"}});
```

> ### ScrollToPlugin

对默认Scroll进行控制插件 更多细节建议看[官方文档](https://greensock.com/docs/Plugins/ScrollToPlugin)

> ### TextPlugin

文字打字效果插件 更多细节建议看[官方文档](https://greensock.com/docs/Plugins/ScrollToPlugin)

> ### ThrowPropsPlugin

平滑拖动效果 更多细节建议看[官方文档](https://greensock.com/docs/Plugins/ThrowPropsPlugin)

> ### TweenPlugin

想研究原理与细节可以看看 更多细节建议看[官方文档](https://greensock.com/docs/Plugins/TweenPlugin)
