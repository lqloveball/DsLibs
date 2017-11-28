-----
基础是一切的核心，地基不好，怎么盖高楼。<br>
真相使你更自由<br>
这句话我觉在程序的世界里面非常关键，越深入了解原理越能实现更多可能。<br>

<br>
课题内容如下<br>
  1. 类 与 对象
  2. 面对对象编程 OOP
  3. 基础类型
  4. 如何写一个类
  5. 创建一个类的对象 （类的实例化）

### 类 与 对象
 **什么是类 Class 什么是对象 Object**
 程序是由一个个部件对象组成的，所以我们必须了解清楚类与对象的关系<br>

 Class(类) 是描述一个这些对象的数据结构和行为方式。<br>

做小实验：描述下正方形 猫<br>

<img src="./images/JSBase/0.png" width = "200" alt="" align=center />

Object(对象) 按Class描述的生产出来的具体物件<br>

<img src="./images/JSBase/1.png" width = "200" alt="" align=center />

**Class与Object的区别**

Class类 相当于语言中的名称，指代一类事物Object对象 相当于现实生活中的实体。Class描述实体的特征与方法；Object实现Class所定义的特征与方法,并且有自己的具体状态。

-----
### 面对对象编程 OOP

20世纪80年代提出<br>
Object-Oriented Programming  直译 “以物体为本的编程”。Object被翻译成“对象”似乎欠妥，因为国外英语词典里 第一意思“可以被接触与感知的物体”。在港台地区是翻译成“物件”，直接暗示分块与组件的思想。但我们还是按国内惯例记住Object是对象。<br>
以下我用图来说明下我对程序 面对对象的图解<br>
<img src="./images/JSBase/2.png" width = "200" alt="" align=center /><br><br>
一个程序员，你就是上帝。你创造一个事物。
<img src="./images/JSBase/3.png" width = "400" alt="" align=center /><br><br>
上帝要做的事情描述创造的事物 Classs类
<img src="./images/JSBase/4.png" width = "400" alt="" align=center /><br><br>
程序运行环境 （js环境 C#环境 ）可以理解成就是一个大工厂企业。工厂里有很多生成设备与流水线，工厂生产出物件，拼装物件，最终成品呈现。
<img src="./images/JSBase/5.png" width = "400" alt="" align=center /><br><br>
具体事物生成。上帝描述的东西进入到工厂，工厂会根据上帝描述的内容，选择合适机器生产出所对应的事物对象
<img src="./images/JSBase/6.png" width = "550" alt="" align=center /><br><br>

整个完整程序，上帝一个个描述自己需要创建事物Class,描述如何具体成品的Class。交给自己熟悉的工厂，安排工厂流水线生产出具体成品。

-----

### 基础类型

数据类型，相信大家看到这是一个类。数据还分复杂类型与简单类型。<br>
String 	字符类型，一段文字描述<br>
Number 	数字类型，数字 、正数、整数、浮点数、负数等。<br>
Boolean   布尔值  就真和假<br>
Object      对象<br>
Array	数组 一个组数据<br>


具体类型使用这里不做说明，可以私下讨论与自己查资料。<br>
我们来说下复杂类型与简单类区别 。其实这个要细究到底，要了解真相有点复杂。<br>
我这边还是以我理解图解给大家（这个是为好理解其实不是这么一会事情）<br>


<img src="./images/JSBase/7.png" width = "350" alt="" align=center /><br><br>
程序中叫栈与堆，我们简单来理解，就一个大管理中心的货柜。<br>
要搞清楚怎么存放，先记下什么是简单类型，什么是复杂类型。<br>
简单类型 String Number Boolean<br>
复杂类型 Object Array 上帝创造的Class<br>


简单类型存放<br>
<img src="./images/JSBase/8.png" width = "350" alt="" align=center /><br><br>

```js
var a=1;
var b=a;
var b=2;
```

第一行代码有一个1放到货柜当中，放到货柜9中<br>
第二含代码b等于a，a是一个简单类型，程序会创建一个与a一样货物对象，放到货柜10中。<br>
第三行代码 b做了修改，这时候修改等于是10里面货物<br>
<img src="./images/JSBase/9.png" width = "350" alt="" align=center /><br><br>

```js
var a=[1,2,3];
var b=a;
var b[1]=3;
```

第一行代码有一个1放到货柜当中，放到货柜9中<br>
第二含代码b等于a，a是一个复杂类型，程序会打一个白条，这个白条说这个货物在货柜9中；<br>
第三行代码 b做了修改，这时候修改等于是9里面货物<br>


-----
### 如何写一个类

类的写法有很多种，我们先理解最简单的。通过一函数体来创建<br>

```js
function 类名(){
    //这种方式创建都是私有，外包是无法访问。
    var _Self=this;
    var _Name='';
    var _Test=function(){};
    //这种方式创建都是公有，外包是可以访问。
    this.Test=function(){};
    this.Name='';
}
```

### 创建一个类的对象
```js
var _obj=new 类名();
```
