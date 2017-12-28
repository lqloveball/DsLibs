### 浮层页面配置方式

`SiteConfig.panels` 模板会通过读取这个页面配置数组来构建页面 

### 简易配置 String字符串

通过`string`简单快速进行页面配置，自动识别内置初始化页面配置

如：

- `'main.HomePage'` ,带有`.`都会被识别成是Adobe Animate资源页面

- `'#HomePage'` ，`#`开头字符串配置会被识别成是Html Dom类型的页面


### 全部配置 Object对象

通过object可以配置更多复杂逻辑与功能参数

- name 页面名
- cs  `cs='html`是否html，`cs!='html` 作为createjs页面的命名空间
- initUI 页面模块构建时候执行
- movieInEnd 页面进场完成时执行
- movieOutEnd 页面退场完成时执行

### Createjs 动画页面类型

#### name 解析规则

以下三种设置是相同效果

```js
'main.HomePage'
```
```js
{name:'main.HomePage'}
```
```js
{name:'HomePage',cs:'main'}
```

只要是`name`内带有`.`都会被识别成是Adobe Animate资源页面。最终在页面模块中被创建成view对象。

`name`会被解析成`cs`+`name`两个部分， 页面createjs显示对象是通过 `cs`.`name` 被创建出来（`new window[cs][name]`）

#### 动画时间轴规则

 - 动画资源如果拥有时间轴，默认会以时间轴最后一帧作为动画进场完成计算
 - 动画资源时间轴的`movieInEnd`标识作为动画进场完成，但不影响动画时间轴播放完成暂定，还是会以时间轴上 `this.stop()`代码为准
 - 动画资源时间轴上如果有`movieInEnd`标识，那会以为`movieInEnd`标识帧作为动画进场完成计算
 - 动画只要时间轴上如果有`movieOutEnd`标识,会执行退场动画到`movieOutEnd`标识帧后才会切换到下一个页面。
 - 页面也可以是`单帧`没有时间轴。



### HTML DOM结构页面类型
     
 简易 `string` 配置       
 ```js
'#HomePage'
 ``` 
 或者 复杂 `object` 配置
```js
{name: '#HomePage'}
``` 
- `#`开头字符串配置会被识别成是Html Dom类型的页面
- 简易模板会查找Html上是否有`$('#HomePage')` 这个dom节点，如果不存在会自动创建一个`'#HomePage'` 的 `<div>`作为这个页面
- 原html上dom节页面，页面切换时候只会进行显示或隐藏操作
- 模板创建出来dom节页面，页面切换时候只会进行添加或与删除操作，拥有`#domBox`节点，会被添加到`#domBox`节点内，没有就会 被添加`#screen`节点内
    
