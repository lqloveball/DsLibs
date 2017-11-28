http://wiki.jikexueyuan.com/project/iscroll-5/versions.html

### 代码示例

#### html

```
<div class="要进行滚动容器">
  <div class="scrollBox">
      这个容器是被滚动，注意这个容器内部如果没有高就不会滚动
  </div>
</div>
```

#### css

```css
#要进行滚动容器 {
   position: relative; left: 0px; top: 0px;width:640px;height:1040px;overflow: hidden;
}
#要进行滚动容器 .scrollBox{position: absolute;top:0px;left:0px;width: 100%;}


```

#### less 
``` css
#要进行滚动容器 {
   position: relative; left: 0px; top: 0px;width:640px;height:1040px;overflow: hidden;

   #要进行滚动容器 .scrollBox{position: absolute;top:0px;left:0px;width: 100%;}

   //如果需要改变滚动条颜色等 进行设置
   .iScrollVerticalScrollbar{
       position: absolute;z-index: 9999;width: 7px;bottom: 2px;top: 2px;right: 2px;
       overflow: hidden;

       .iScrollIndicator{
         box-sizing: border-box;
         position: absolute;left:top: 0px; 0px;width: 100%;height: 308px;transition-duration: 0ms;display: block;
         border: 1px solid rgba(255, 255, 255, 0.9);
         border-radius: 3px;
         background: rgb(255, 0, 0);
       }
     }
}

```


#### js


```js
var _myScroll = new IScroll($('要进行滚动容器')[0],
{
    scrollX: false,
    scrollY: true,
    click:true,
    scrollbars: false ,
    // ,interactiveScrollbars: true
    useTransform: true,
    useTransition: true,
    probeType:3,
  });
```


### config参数说明

```js
scrollbars                false 实现需要滚动条，参数设置`'custom'` 可以设置滚动条的样式
hScroll                   false 禁止横向滚动 true横向滚动 默认为true
vScroll                   false 精致垂直滚动 true垂直滚动 默认为true
hScrollbar                false 隐藏水平方向上的滚动条
vScrollbar                false 隐藏垂直方向上的滚动条
fixedScrollbar            在iOS系统上，当元素拖动超出了scroller的边界时，滚动条会收缩，设置为true可以禁止滚动条超出。scroller的可见区域。默认在Android上为true， iOS上为false
fadeScrollbar             false 指定在无渐隐效果时隐藏滚动条  节省资源
interactiveScrollbars     false 指此属性可以让滚动条能拖动，用户可以与之交互。
hideScrollbar             在没有用户交互时隐藏滚动条 默认为 true
shrinkScrollbars          当在滚动区域外面滚动时滚动条是否可以收缩到较小的尺寸。有效的值为：'clip' 和 'scale'。
bounce                    启用或禁用边界的反弹，默认为true
momentum                  启用或禁用惯性，默认为true，此参数在你想要保存资源的时候非常有用
lockDirection             false 取消拖动方向的锁定， true拖动只能在一个方向上（up/down 或者left/right）
useTransform              默认情况下引擎会使用 CSS transform 属性。如果现在还是2007年，那么可以设置这个属性为 false，这就是说：引擎将使用top/left属性来进行滚动。
useTransition             iScroll使用CSS transition来实现动画效果（动量和弹力）。如果设置为false，那么将使用requestAnimationFrame代替。在现在浏览器中这两者之间的差异并不明显。在老的设备上transitions执行得更好。
HWCompositing             true 这个选项尝试使用translateZ(0)来把滚动器附加到硬件层，以此来改变CSS属性。在移动设备上这将提高性能，但在有些情况下,你可能想要禁用它(特别是如果你有太多的元素和硬件性能跟不上)。
freeScroll                false 需要2个维度同时滚动时候使用
invertWheelDirection      false 是否反向滚动
mouseWheel                false 侦听鼠标滚轮事件。
preventDefault            true 当事件触发时是否执行preventDefault()。此属性应该设置为true，除非你真的知道你需要怎么做。
scrollX、scrollY           默认情况下只有纵向滚动条可以使用。如果你需要使用横向滚动条，需要将scrollX 属性值设置为 true。
tap                       true 设置此属性为true，当滚动区域被点击或者触摸但并没有滚动时，可以让iScroll抛出一个自定义的tap事件。如下
                            //element.addEventListener('tap', doSomething, false); //原生
                            //$('#element').on('tap', doSomething); //jQuery

```


### 方法

```js
myScroll.refresh();               刷新滚动条状态
refresh()                         在DOM树发生变化时，应该调用此方法
scrollTo()                        滚动到某个位置
如: myscroll.scrollTo(0,10,200,true);
scrollToElement()                 滚动到某个元素
如: myscroll.scrollToElement("li:nth-child(10)",100);
detroy()                          完全消除myscroll及其占用的内存空间
```


### 事件处理

```js
myScroll.on('scrollEnd', doSomething);
```
其他事件
```js
beforeScrollStart，在用户触摸屏幕但还没有开始滚动时触发。
scrollCancel，滚动初始化完成，但没有执行。
scrollStart，开始滚动
scroll，内容滚动时触发，只有在scroll-probe.js版本中有效，请参考onScroll event。
scrollEnd，停止滚动时触发。
flick，用户打开左/右。
zoomStart，开始缩放。
zoomEnd，缩放结束。
```

### 滚动条信息
myScroll.x/y，当前位置
myScroll.directionX/Y，最后的方向 (-1 down/right, 0 still, 1 up/left)
myScroll.currentPage，当前对齐捕获点

### iScroll的版本

- iscroll.js，这个版本是常规应用的脚本。它包含大多数常用的功能，有很高的性能和很小的体积。
- iscroll-lite.js，精简版本。它不支持快速跳跃，滚动条，鼠标滚轮，快捷键绑定。但如果你所需要的是滚动(特别是在移动平台) iScroll 精简版 是又小又快的解决方案。
- iscroll-probe.js，探查当前滚动位置是一个要求很高的任务,这就是为什么我决定建立一个专门的版本。如果你需要知道滚动位置在任何给定的时间,这是iScroll给你的。（我正在做更多的测试,这可能最终在常规iscroll.js脚本，请留意）。
- iscroll-zoom.js，在标准滚动功能上增加缩放功能。
- iscroll-infinite.js，可以做无限缓存的滚动。处理很长的列表的元素为移动设备并非易事。 iScroll infinite版本使用缓存机制,允许你滚动一个潜在的无限数量的元素。
