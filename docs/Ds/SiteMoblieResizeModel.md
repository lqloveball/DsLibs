

>**类:** Ds.SiteMoblieResizeModel

### 定义
互动H5项目自适应模块。<br/>
一个可以横树立屏幕都支持的自适应网站模板模块。
屏幕的宽度 竖屏情况下按 `640px`计算  横屏情况下按`1138px`计算。高度根据宽度进行等比换算。

>实例构造

**参数**<br/>
param `Object` 设置构建自适应模块的初始化参数<br/>
- param.screen  `String $Element DOMElement`    H5网站进行自适应用的主场景DIV对象 （可以是id号 选择器对象  dom对象） <br/>
- param.screenType `String` 默认值`v` 可选参数 `h`横屏 `v`竖屏  `auto` 自动 横竖屏皆可。<br/>
- param.screenWidthData `Array` 设置自动适应屏幕宽计算标准 默认`[640,1138]` 竖屏:640px  横屏1138px<br/>


### 属性

> #### Screen `$Element`<br/>

自适应时候进行场景缩放计算的DIV


> #### OrientationTip `$Element`<br/>

横竖屏时候进行显示的提示


> #### ScreenType `String`<br/>

使用何种自适应计算方式  `h`横屏 `v`竖屏  `auto` 自动 横竖屏皆可。

> #### Width `Number`<br/>

当前window宽

> #### Height `Number`<br/>

当前window高;

> #### ActualH `Number`<br/>

当前场场景实际高（根据ScreenWidth 进行换算实际高）

> #### ScreenWidth `Number`<br/>

当前场场景实际宽

> #### OldActualH `Number`<br/>

进行自适应前的场景实际高

> #### PageScale `Number`<br/>

场景进行缩放计算比例

> #### IsInputState `Boolean`<br/>

当前是否是输入状态

> #### Horizontal `Boolean`<br/>

当前是否横屏

> #### DensityDpi `Number`<br/>

当前使用计算的 densityDpi

### 事件

> #### resize <br/>

场景进行自适应计算完成的事件

```js

var _SiteResizeModel=new Ds.SiteMoblieResizeModel({
  screen:'#screen',
  screenType:'v',
});

_SiteResizeModel.on('resize',ReSize);

function ReSize(e){
  var _width=_SiteResizeModel.Width;
  var _height=_SiteResizeModel.Height ;
  var _actualH=_SiteResizeModel.ActualH;
  var _pageScale=_SiteResizeModel.PageScale;
  var _isInputState=_SiteResizeModel.IsInputState;
  var _horizontal=_SiteResizeModel.Horizontal;
  var _screenWidth=_SiteResizeModel.ScreenWidth;
  var _densityDpi=_SiteResizeModel.DensityDpi;
}

```

### 方法

>  #### InitResize<br/>

**定义**<br/>
开始初始化自适应计算

**参数**<br/>
无

**返回**<br/>
无

>  #### ReSize<br/>

**定义**<br/>
进行自适应计算`只有需要强制执行重新计算自适应时候使用`

**参数**<br/>
无

**返回**<br/>
无

>  #### InitOrientationTip<br/>

**定义**<br/>
初始化横屏或者竖屏提示

**参数**<br/>
无

**返回**<br/>
无

### 查看示例

!>无
