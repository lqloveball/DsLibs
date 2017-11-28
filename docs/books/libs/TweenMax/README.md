#### GreenSock简介

GreeenSock在Flash业界久负盛名，他们推出的TweenLite、TweenMax等动画引擎得到了广泛关注和应用。在Flash时代就是运动引擎中的王者。性能是非常重要的，尤其是在移动设备上。GSAP不断优化，以保证互动项目的快速响应、高效率及平滑

GSAP动画平台四个插件的不同功能：

#### TweenLite
GSAP动画平台核心部分，使用它可以用来实现大部分的动画效果。比如：元素的位置及宽高。如果使用**CSSPlugin**,则能实现任何属性的动画效果，比如元素的fontSize,backgroundColor等属性。TweenLite适合用来实现一些元素鉴定的动画效果。

#### TimelineList
一个强大的，轻量级的序列工具，它就如一个存放补间动画的容器，可以很容易的控制整体补间动画，并且精确管理补间动画彼此之间的时间关系。比如动画的各种状态，**Pause，reverse,restart,speed up,slow down,seek time,addlabels**等。
TimelineLite 适合用来实现一些复杂的动画效果


#### TimelineMax
扩展TimelineLite ,提供完整的相同功能再加上有用的（但非必要）功能，**如repeat,repeatDelay,yoyo,currentLabel()**等


#### TweenMax
这是一个完整的动画引擎，是一个全功能运动引擎。min版本达到100k出头。它可以实现TweenLite的功能，以及一些非必要功能，如repeat、yoyo、updateTo()等。它会自动激活插件。
