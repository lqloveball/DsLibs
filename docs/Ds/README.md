---
### 全局方法

> #### Ds.Extend

对象进行扩展赋值。支持多个对象属性继承扩展。`平时用在对类对象简单继承扩展`

> #### Ds.ExtendNoCover

对象进行扩展赋值。但对对象原有值不进行覆盖

> #### Ds.ExtendFactory

对 Function 构建的类，创建子类继承工厂方法

### Ds 库结构
> 关于Ds取名，一开始来源至团队的称呼。现在更多是一种愿景。

关于Ds库的分包按曾经开发as互动ixiyou库的习惯，目前主要分包情况如下

- Ds.createjs 基于createjs的canvas开发包
- Ds.createjs.display  基于createjs封装的常用交互对象包
- Ds.gemo 一些常用的算法、交互、逻辑管理模块包。
`Ds.gemo 取名时候童心作祟，gemo像无穷的宝藏。 gem->宝石 o->吃惊张大了嘴`
- Ds.media 多媒体相关模块包
- Ds.utils 判断工具、算法相关模块包
- Ds.ui 界面控件相关模块包
- Ds.net 网络交互相关模块包
- Ds.map 地图相关模块包
