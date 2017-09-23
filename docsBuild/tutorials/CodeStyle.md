##### 常规预定
- 代码文件必须使用 UTF-8 编码方式保存文件
- 注意代码块之间缩进
- 在行末尾不要有空格（这个可以通过软件来进行设置,WebStorm默认去末尾空格）

##### 命名规范

- 类使用`大`写开头驼峰命名 如：`ColorFilter`
- 包或命名空间使用小写  如：`createjs`
- 类成员公有成员`小`写开头驼峰命名 如：`colorFilter`
- 类成员私有成 `_`加`小`写开头驼峰命名 如：`_colorFilter`
- function 传参数对象 `小`写开头驼峰命名 如：`colorFilter`
- function 内局部变量 `_`加`小`写开头驼峰命名 如：`_colorFilter`
- 命名尽可能唯一性、具有明确描述性。像for while 等这样循环体例外，使用如 `i`  `obj`  `key` 

#### 其他编码风格

#####Object 

创建一个对象 Object 使用 {} ，避免使用 new Object()

好的CodeStyle

```js
var obj = { A: 1, b: 2, C: 3 };

var obj = {
    A: 1, 
    b: 2, 
    C: 3 
};
```

不好的CodeStyle

```js
var obj = {A:1,b:2,C:3};

var obj = {A:1, b:2, C:3};

var obj = {A : 1, b : 2, C : 3};

var obj = { "A" : 1, "b" : 2, "C" : 3 };

var obj = { A : 1, b : 2, C : 3 };

var obj = { A :1, b :2, C :3 };

var obj = { A : 1 , b : 2 , C : 3 };

var obj = {
    A : 1, 
    b : 2, 
    C : 3, 
};


var obj = {
    A : 1 
  , b : 2
  , C : 3 
};
```


#####Arrays

创建一个数组 Array 使用 [] ，避免使用 new Array()

好的CodeStyle

```js
var arr = [ 1, 2, 3 ];

var arr = [
    1, 
    2, 
    3 
];
```

不好的CodeStyle

```js
var arr = [1,2,3];

var arr = [1, 2, 3];

var arr = [ 1 , 2 , 3 ];

var arr = [
    1, 
    2, 
    3,
];

var arr = [
    1
  , 2
  , 3 
];
```

##### 区块规范

花括号{} 前后都要空一个行

好的CodeStyle

```js
if ( a === 0 ) {

   // this is good
   return true;

}
```

不好的CodeStyle

```js
if ( a === 0 ) {
    // this is bad: missing empty line after '{' 
    return true;

}

if ( a === 0 ) {

    // this is bad: missing empty line before '}'
    return true;
}

if ( a === 0 ) { // this is bad:  stuff after '{'

    return true;

}

if ( a === 0 ){

   // this is bad: no space before '{'
   return true;

}
```

##### 尽量避免使用eval

eval 在大多数规范中是避免使用的，特别是在转换一个JSON对象时候，尽量使用 JSON.parse

##### undefined 的判断


```js
//合理：使用 三个= 来判断
x === undefined;
//避免1
typeof x === 'undefined';
//避免1
x === void 0;
```