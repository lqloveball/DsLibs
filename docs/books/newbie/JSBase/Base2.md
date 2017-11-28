!>原文地址：https://www.sitepoint.com/dom-manipulation-vanilla-javascript-no-jquery/<br>
原文标题：The Basics of DOM Manipulation in Vanilla JavaScript (No jQuery)<br>
前言：看到原文标题的Vanilla JavaScript，大家肯定以为这是一个JS库，其实它就是原生JS，大家可以去官网上看一下，上面的吐槽还是蛮有意思的。其实本文就是介绍了原生JS的强大DOM操作能力，并建议大家弃用jQuery（Github的一个repo：You-Dont-Need-jQuery，和本文内容十分一致，建议大家看一下）[原文](https://dumengjie.github.io/2017/04/18/%E8%AF%91-%E5%8E%9F%E7%94%9FJS-DOM%E5%9F%BA%E6%9C%AC%E6%93%8D%E4%BD%9C/)


当要进行DOM操作时，我们总会去`jQuery`中查找相应的方法。然而，原生JS的DOM API足以应大多数情况，并且由于IE11以下版本已被正式弃用，使用原生JS没有任何后顾之忧。

在本文中，我会展示如何使用原生JS来实现最常见的DOM操作，分别有：

- 查找和改动DOM节点
- 变更类和属性classes and attributes
- 监听事件
- 动画

在文章结尾，我会告诉大家如何创建自己的可放入任何项目的超轻量级DOM库。在文章中你会了解到利用原生JS进行DOM操作并不是什么复杂的事，jQuery中的许多方法可以使用原生API可以直接实现。

### DOM操作：查找DOM节点

请注意：我只会对原生DOM API进行简单介绍，并不会详细阐述。所以在示例中你可能会看到我并没有明确介绍的一些方法。这种情况下请自行查阅(Mozilla Developer Network)[https://developer.mozilla.org/en-US/]。


查找DOM节点可以使用`.querySelector()`方法，可以使用任意的CSS选择器作为参数。

```js
const myElement = document.querySelector('#foo > div.bar')
```

这个方法会返回第一个匹配元素（深度优先）。相反的，我们也可以检测一个元素是否匹配一个选择器。

```js
myElement.matches('div.bar') === true
```

如果想获取所有匹配元素，可以使用`.querySelectorAll()`：

```js
const myElements = document.querySelectorAll('.bar')
```

如果已经引用了父级元素，我们可以只查找子元素而不是整个文档`document`。像这样缩小了查找范围，我们可以简化选择器并提高性能。


```js
const myChildElemet = myElement.querySelector('input[type="submit"]')
// Instead of
// document.querySelector('#foo > div.bar input[type="submit"]')
```

既然如此,为什么我们还要使用像`.getElementByTagName()`之类的并不是很方便的方法呢？一个重要原因是因为`.querySelector()`方法返回的结果并不是实时的，如果我们动态的添加一个匹配选择器的元素，结果集合并不会更新。

```js
const elements1 = document.querySelectorAll('div')
const elements2 = document.getElementsByTagName('div')
const newElement = document.createElement('div')
document.body.appendChild(newElement)
elements1.length === elements2.length // false
```
另一个原因是这样的一个实时集合并不需要事先收集好所有信息，然而`.querySelectorAll()`会立即收集所有信息并生成一个静态列表，这样做的性能并不是很高。

### 操作节点列表
现在对于`.querySelectorAll()`我们有两个问题。第一个问题是无法在结果上调用节点方法`Node methods`并且无法向子元素传递。我们需要在这些元素上进行显示迭代。这就产生了另外一个问题：`.querySelectorAll()`方法的返回值是一个节点列表，而不是数组。这意味着不能直接使用常见的数组方法。对于节点列表有一些对应的方法，例如`.forEach()`，但是现在IE还不支持。因此我们要先把节点列表转换为数组，或者从数组原型`Array prototype`”借“一些方法。

```js
// Using Array.from()
Array.from(myElements).forEach(doSomethingWithEachElement)
// Or prior to ES6
Array.prototype.forEach.call(myElements, doSomethingWithEachElement)
// Shorthand:
[].forEach.call(myElements, doSomethingWithEachElement)
```

每个元素都有一些只读的属性，它们都是实时更新的：

```js
myElement.children
myElement.firstElementChild
myElement.lastElementChild
myElement.previousElementSibling
myElement.nextElementSibling
```

由于元素接口`Element interface`继承自节点接口`Node interface`，以下这些属性也是可用的：

```js
myElement.childNodes
myElement.firstChild
myElement.lastChild
myElement.previousSibling
myElement.nextSibling
myElement.parentNode
myElement.parentElement
```


前者只有元素可用，后者（除了`.parentElement`）任意节点均可使用，例如：文本节点`text node`。我们可以检查一个节点的类型，如下：

```js
myElement.firstChild.nodeType === 3 // this would be a text node
```

我们可以使用`instanceof`操作符来查看节点的原型链：

```js
myElement.firstChild.nodeType instanceof Text
```
### 更改类和属性

更改元素的类非常简单：

```js
myElement.classList.add('foo')
myElement.classList.remove('bar')
myElement.classList.toggle('baz')
```
关于如何更改类的深入讨论请阅读(quick tip by Yaphi Berhanu)[https://www.sitepoint.com/add-remove-css-class-vanilla-js/]。元素属性可以像其他对象属性一样被获取：


```js
// Get an attribute value
const value = myElement.value
// Set an attribute as an element property
myElement.value = 'foo'
// Set multiple properties using Object.assign()
Object.assign(myElement, {
  value: 'foo',
  id: 'bar'
})
// Remove an attribute
myElement.value = null
```
要注意存在`.getAttibute()`， `.setAttribute()` 和`removeAttribute()`这些方法。他们会直接更改元素的HTML属性`HTML attributes`（而不是DOM属性`DOM properties`），这会触发浏览器重绘（你可以使用浏览器的开发工具检查元素来观察这些改变）。除了触发浏览器重绘，这比仅设置DOM属性更加耗费性能，这些方法也会导致一些(无法预料的结果)[https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute#Notes]。

一般来说，只有对没有相应DOM属性的属性（例如`colspan`）使用它们，或是你坚持要改变HTML的情况（例如克隆元素时保存属性或更改父元素的`.innerHTML`）。

### 增加CSS样式

CSS样式可以其他属性一样应用到元素上。请注意JavaScript中元素的名称要使用驼峰写法。

```js
myElement.style.marginLeft = '2em'
```

可以使用`.style`来获取确定值，但是这种方法只能取到直接应用的样式。要获取计算后的值`computed values`，可以使用`.window.getComputedStyle()`。这个方法以元素为参数，返回(CSSStyleDeclaration)[https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration]，包含元素自身样式以及继承样式：

```js
window.getComputedStyle(myElement).getPropertyValue('margin-left')
```

### 变更DOM节点

可以如下移动元素：

```js
// Append element1 as the last child of element2
element1.appendChild(element2)
// Insert element2 as child of element 1, right before element3
element1.insertBefore(element2, element3)
```
如果不想移动元素，仅插入一份`copy`，可以如下进行克隆：

```js
// Create a clone
const myElementClone = myElement.cloneNode()
myParentElement.appendChild(myElementClone)
```

`.cloneNode()`方法可以以一个布尔值作为可选参数，如果值为真，会进行深复制，即子元素也会被克隆。


当然，我们也可以创建新的元素或节点：

```js
const myNewElement = document.createElement('div')
const myNewTextNode = document.createTextNode('some text')
```

可以使用之前的方法插入它们。如果要删除元素，并不能直接删除，但是可以从父元素删除子元素，如下：

```js
myParentElement.removeChild(myElement)
```

可以看出，只需要做一点简单的工作就可以通过某元素的父元素直接删除该元素：

```js
myElement.parentNode.removeChild(myElement)
```


### 元素属性


每个元素都有`.innerHTML`和`.textContent`属性（也有`.innerText`，它和`.textContent`类似，但也有一些重要区别）。这两个属性分别会取得HTML内容和纯文本内容。这些属性都是可写的，可以直接更改元素内容：


```js
// Replace the inner HTML
myElement.innerHTML = `
  <div>
    <h2>New content</h2>
    <p>beep boop beep boop</p>
  </div>
`
// Remove all child nodes
myElement.innerHTML = null
// Append to the inner HTML
myElement.innerHTML += `
  <a href="foo.html">continue reading...</a>
  <hr/>
`
```

像上面这样往HTML中加入标签并不是一个好主意，这样做会丢失掉元素上已做的属性更改和已绑定的事件侦听器。`.innerHTML`适用于用其他内容将标签完全替换掉，例如服务器端呈现的标记。所以最好如下添加元素：

```js
const link = document.createElement('a')
const text = document.createTextNode('continue reading...')
const hr = document.createElement('hr')
link.href = 'foo.html'
link.appendChild(text)
myElement.appendChild(link)
myElement.appendChild(hr)
```

但是用这种方法会造成两次浏览器重绘，每添加一个元素都会触发一次，然而改变`.innerHTML`只会触发一次。为了解决这个性能问题，我们可以先把所有节点都放到一个(DocumentFragment)[https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment]中，然后再添加这个`fragment`：

```js
const fragment = document.createDocumentFragment()
fragment.appendChild(text)
fragment.appendChild(hr)
myElement.appendChild(fragment)
```

### 事件侦听

大家最熟知的添加事件侦听器的方法可能是下面这种：

```js
myElement.onclick = function onclick (event) {
  console.log(event.type + ' got fired')
}
```

但应尽量避免使用这种方法。由于`.onclick`是元素的属性，因此我们可以改变它，但是不能用它来添加额外的侦听器——重新分配一个函数会改写对旧函数的引用。

我们可以使用更加强大的`.addEventListener()`方法不限数量的添加各种类型的侦听器。该方法共有三个参数：事件类型（例如`click`），事件发生时触发的函数（该函数会传递一个事件对象`event object`），以及一个可选的配置对象（将在下文介绍）。

```js
myElement.addEventListener('click', function (event) {
  console.log(event.type + ' got fired')
})
myElement.addEventListener('click', function (event) {
  console.log(event.type + ' got fired again')
})
```

在侦听器函数中，`event.target`指向发生事件的元素（和`this`的作用一样，除非使用箭头函数）。因此可以很方便的取得事件对象的属性：

```js
// The `forms` property of the document is an array holding
// references to all forms
const myForm = document.forms[0]
const myInputElements = myForm.querySelectorAll('input')
Array.from(myInputElements).forEach(el => {
  el.addEventListener('change', function (event) {
    console.log(event.target.value)
  })
})
```
#### 阻止默认行为

尽管在侦听器函数内部随时都可取得`event`对象，但最好还是需要的时候再传入（可以任意命名）。对于`Event`的接口就不做详细介绍了，但`.preventDefault()`方法还是要注意一下，该方法会阻止浏览器的默认行为，例如链接跳转。关于`.preventDefault()`另一个广泛应用的例子是客户端表单验证失败时阻止表单提交：

```js
myForm.addEventListener('submit', function (event) {
  const name = this.querySelector('#name')
  if (name.value === 'Donald Duck') {
    alert('You gotta be kidding!')
    event.preventDefault()
  }
})
```

另一个重要的方法是`.stopPropagation()`，这个方法会阻止事件向上冒泡。如果子元素和父元素上都绑定了单击事件侦听器，单击子元素两个事件都会触发，但是如果子元素设置了阻止事件冒泡， 那么只会触发子元素上的事件。


`.addEventListener()`方法可以以一个可选的配置对象作为第三个参数，该对象可以包含0至3个的布尔类型属性（默认值都是` false` ）：

- `capture`：事件会先在该元素上触发，然后再在子元素上触发（时间捕获和冒泡机制`event capturing and bubbling`是一片单独的文章，详情请点击）
- `once`：该事件只会触发一次
- `passive`：监听器内部不会调用`.preventDefault()`函数来阻止默认行为，`.preventDefault()`将被忽略（控制台中会有警告）。


最常用的选项是`.capture`，可以不把它写在配置对象里，而是直接以布尔值传入：

```js
myElement.addEventListener(type, listener, true)
```

事件侦听器可以通过`.removeEventListener()`移除，它的参数包括事件类型和要移除的回调函数`callback function`的引用。`once`选项（即只触发一次）也可以这样实现：

```js
myElement.addEventListener('change', function listener (event) {
  console.log(event.type + ' got triggered on ' + this)
  this.removeEventListener('change', listener)
})
```

### 事件代理

另一个有用的模式是事件代理`event delegation`：假设我们想在表格`form`的所有`input`标签绑定`change`事件侦听器。一种解决方案是使`用myForm.querySelectorAll('input')`来迭代绑定。其实，没必要这么麻烦，可以只给表单`form`添加事件侦听器然后检查`event.target`的内容。

```js
myForm.addEventListener('change', function (event) {
  const target = event.target
  if (target.matches('input')) {
    console.log(target.value)
  }
})
```

这种模式的另一个优点是会自动计算动态插入的元素，无需插入新的事件侦听器。

### 动画

实现动画的最好方法通常是应用有`transition`属性的类，或是`CSS @keyframes`。但如果动画需要更多弹性的话（例如游戏里的动画），也可以使用`JavaScript`来实现。

原生方法是设定一个`window.setTimeout()`函数在动画结束时调用它自己。但是这种方法会导致文档流重排， 这些`layout transh`会导致卡顿，特别是移动设备上。相反，我们可以使用`window.requestAnimationFrame()`来同步更新，把所有的更新安排到下一个浏览器重绘帧上。它以一个回调函数作为参数，这个函数会接收到现在的时间戳：

```js

const start = window.performance.now()
const duration = 2000
window.requestAnimationFrame(function fadeIn (now)) {
  const progress = now - start
  myElement.style.opacity = progress / duration
  if (progress < duration) {
    window.requestAnimationFrame(fadeIn)
  }
}

```


这样就能实现非常流畅的动画了。想了解更多细节，请(点击)[https://www.sitepoint.com/quick-tip-game-loop-in-javascript/]。


### 编写你自己的帮助函数

与jQuery简明的链式语法`$('.foo').css({color: 'red'})`相比，总是在元素上迭代的操作确实有些麻烦。何不写出我们自己对这些方法的简写方案？


```js
const $ = function $ (selector, context = document) {
const elements = Array.from(context.querySelectorAll(selector))
  return {
    elements,
    html (newHtml) {
      this.elements.forEach(element => {
        element.innerHTML = newHtml
      })
      return this
    },
    css (newCss) {
      this.elements.forEach(element => {
        Object.assign(element.style, newCss)
      })
      return this
    },
    on (event, handler, options) {
      this.elements.forEach(element => {
        element.addEventListener(event, handler, options)
      })
      return this
    }
    // etc.
  }
}

```

这样我们就有了超轻量级`DOM`库，仅包含我们需要的方法，不向后兼容。通常我们会把这些方法放到集合的原型中。 [这里](https://gist.github.com/SitePointEditors/4f6643d62a87aece860b0784c6eeffd2) 有更详尽的版本。或者我们可以写的简单一些：

```js
const $ = (selector, context = document) => context.querySelector(selector)
const $$ = (selector, context = document) => context.querySelectorAll(selector)
const html = (nodeList, newHtml) => {
  Array.from(nodeList).forEach(element => {
    element.innerHTML = newHtml
  })
}

```

### 总结

希望大家已经了解到利用原生JS进行DOM操作并不是什么复杂的事，`jQuery`中的许多方法可以使用原生API可以直接实现。这意味对一些日常操作（例如导航菜单和弹出框），没必要再添加DOM库。

尽管有些`native API`确实很冗长或不方便，我们可以很简单的写出自己的帮助函数来抽象这些重复工作。

现在轮到你了，你怎么想呢？尽量避免使用第三方库还是不做改变？
