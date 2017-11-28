### createjs简介

是canvas的开发框架，基本延续了flash的显示列表渲染机制。其核心对象EventDispatcher（事件） DisplayObject（显示对象）

#### 显示对象类型
DisplayObject（显示对象）类型分两种

- 容器 (继承DisplayObject属性与方法，容器可以添加其他显示对象到自己内部)
- 非容器

##### 容器类型
- Container       容器显示对象
- MovieClip       带动画的容器像素对象
- Stage           舞台对象，一个canvas中只会有一个舞台，所有显示对象都是渲染在这个上面

?>不常用不列举

##### 非容器类型
- Bitmap          图片显示对象  等同HTML里的 Image 标签
- Text            文本对象
- Shape           绘制对象，能实现在画布上的绘制图形。如：圆、正方形、线、曲线。（实际操作通过Shape下的graphics 命令集对象，具体看createjs.Graphics类）
- BitmapText      显示文本使用位图字形在雪碧表定义。

?>不常用不列举

### DisplayObject 特征

显示对象拥有的基本属性与方法特征

- 坐标系：x y 定义显示对象针对父级显示对象（容器）的位置
- 角度：rotation 定义显示对象的角度（还有旋转角度的注册点相关）
- 是否显示：visible 这个等同于对HTML的元素设置 display:none 或者display:block
- 透明度：alpha 透明度的值0-1, 1是不透明
- 缩放大小：scaleX 横向缩放 scaleY纵向缩放 值0至无穹大 默认是1
- 父级容器：parent
- 是否接受鼠标（touch）事件mouseEnabled 默认是true
- 注册点 regX regY，很少用，但很关键。影响显示对象的坐标系 旋转 缩放等。
- 滤镜 filters 一些特效 模糊 发光
- 遮罩 mask 遮罩用的蒙板对象只能是Shape对象
拥有那些方法：
- 复制当前对象 clone
- 全局坐标与相对坐标的转换  globalToLocal全局坐标转成当前自身的坐标  localToLocal 当前坐标转换成其他一个显示对象的坐标。
- 事件监听 on off  任何一个显示对象都继承事件发送者（EventDispatcher）

### Container 特征

容器会拥有哪些更多属性与方法  

这里必须提出一种概念  **显示列表**
显示列表 可以理解成 photoshop里面的图层。从程序角度就是一个Array数组

**属性：**
- 子对象列表 children 一个数组，数组里面每个对象就是一个显示对象的实例
- 子对象是否对鼠标事件（touch进行冒泡）mouseChildren

**方法：**
- 添加一个显示对象到容器 addChild 与addChildAt

```js
Box.addChild(DisplayA);
//等同于
Box.addChildAt(DisplayA,Box.children.length);
//addChildAt一般使用的时候是为了添加最底层
Box.addChildAt(DisplayA,0);
```
- contains 判断一个显示对象是否在自己容器内 contains，这里判断是包含判断显示对象是否在自己的子容器内。
getChildIndex 更加层级找显示对象

- removeAllChildren 删除所有的显示对象，清空容器内容使用。
删除一个显示对象 removeChild
删除某个层级上一个显示对象 removeChildAt


### 代码实例

```js
    //我们来看如何使用createjs
    require('createjs'); //我们需要的一个createjs框架
    require('jstween'); //运动引擎，感谢shark
    //创建一个我们要的canvas对象
    var _Canvas = document.createElement("canvas");
    //创建一个我们的舞台
    var _Stage = new createjs.Stage(_Canvas);
    //创建一个主容器，方便以后更灵活的层级控制（不理解也可以）
    var _Root = new createjs.Container();
    //舞台是一个显示对象，我们可以把主容器放到舞台上
    _Stage.addChild(_Root);
    //设置鼠标移动上去响应帧数 这里修改成30 手机性能都提高了可以刷新快点
    _Stage.enableMouseOver(30);
    //支持touch事件 （手机端上必须）
    createjs.Touch.enable(_Stage);
    //鼠标点击相关设置
    _Stage.mouseMoveOutside = true;
    _Stage.mouseInBounds = true;
    //支持引导线动画
    createjs.MotionGuidePlugin.install();
    //因为我们的网站是需要的动画的，我们需要不断去刷新canvas 进行重新绘制，这里会按_Stage.enableMouseOver(30); 设置，每秒刷新30次
    createjs.Ticker.addEventListener("tick", HandleTick);

    function HandleTick() {
      _Stage.update();
    }
    //需要对我们的canvas容器设置宽高大小
    _Canvas.setAttribute('width', window.innerWidth);
    _Canvas.setAttribute('height', window.innerHeight);
    //把这个canvas添加页面的div内
    document.getElementById('cjsBox').appendChild(_Canvas);

    //神奇的时候来了 ，我们来添加一个图片显示上来。
    var _Bmp = new createjs.Bitmap('./images/ShareImg.jpg');
    //在主容器里面添加
    _Root.addChild(_Bmp);
    //让他动起来  这个具体api 看https://github.com/shrekshrek/jstween/blob/master/doc/jstween.md
    JT.to(_Bmp, 1, {
      x: 100, //对它的坐标进行改变
      y: 100, //对它的坐标进行改变
      yoyo: true, //循环溜溜球运动
      repeat: -1, //重复执行次数，-1代表无限
    });

```

### 快速创建createjs框架

通过 **src/Ds/createjs/DsCreatejs.js** 我们可以更简单点来创建createjs的框架。<br>
同样的代码效果如下:
```js
  //如何通过封装好的方法快速实现写createjs
  require('createjs');//我们需要的一个createjs框架
  require('dscreatejs');//快速搭建一个createjs canvas的模块，还有很多快速操作方法
  require('jstween');//运动引擎，感谢shark
  //其实不需要每次都去做这个构建工作
  var _CJSModel=ccjs.CCJSModel.Create({
      appendTo: document.getElementById('cjsBox'),
      width: window.innerWidth,
      height: window.innerHeight,
      fps: 30
  });
  var _Root,_Stage;
  _Stage=_CJSModel.Stage;
  _Root=_CJSModel.Root;
  //神奇的时候来了 ，我们来添加一个图片显示上来。
  var _Bmp = new createjs.Bitmap('./images/ShareImg.jpg');
  //在主容器里面添加
  _Root.addChild(_Bmp);
  //让他动起来  这个具体api 看https://github.com/shrekshrek/jstween/blob/master/doc/jstween.md
  JT.to(_Bmp, 1, {
    x: 100, //对它的坐标进行改变
    y: 100, //对它的坐标进行改变
    yoyo: true, //循环溜溜球运动
    repeat: -1, //重复执行次数，-1代表无限
  });
```
