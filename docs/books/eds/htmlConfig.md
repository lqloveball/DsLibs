#### Html页面结构配置

?>对简易模板html内设置简易说明

#### 框架代码插入

- `EDSSite`简易模板框架需要插入在`<body>`内最后一个节点

```html
<script src="js/edslibs/ESiteModel.js"></script>
```

#### 主容器

- 简易模板必须有一个 `id="screen"` 的 `<div>` 容器。这个容器是作为网站自适应不同手机的viewport时候进行缩放。
- `<div>`的属性 `data-config` 设置`EDSSite`配置文件路径地址

```html
<div id="screen" data-config="js/site/defaultSite.js">
```
#### cjsBox容器

- 通过Adobe Animate导出动画资源呈现canvans 会被添加到这个`<div>` 容器

```html
<div id="cjsBox"></div>
```

#### pixiBox容器

- 如果有用pixijs框架实现canvans 会被添加到这个`<div>` 容器
- 不使用可以删除

```html
<div id="pixiBox"></div>
```

#### threejsBox容器

- 如果有用threejs 引擎框架实现3D场景的canvans 会被添加到这个`<div>` 容器
- 不使用可以删除

```html
<div id="threejsBox"></div>
```

#### domBox容器

- 代码动态创建dom结构的`page`页面 默认会被添加到这个`<div>` 容器
- 如果这个容器不存在，代码动态创建dom结构的`page`页面会被添加到 `#screen` 主容器里

```html
<div id="domBox"></div>
```



#### 例图

![例图](./images/a/1511613166597.jpg)
