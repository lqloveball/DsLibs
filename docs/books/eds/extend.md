### 扩展逻辑配置

`SiteConfig.extend` 如果有复杂逻辑页面可以通过加载扩展js来进行实现。

如：

```js
extend: [
    './js/site/SiteExtend.js',
    './js/site/HomePage.js',
    './js/site/Page1.js',
]
```

### 对页面逻辑编写

比如直接编写 `./js/site/HomePage.js`

```js

function HomePage(){
    //获取到页面模块
    var _pageModel=SiteModel.pager.getPage('HomePage');
    //获取页面模块下的显示界面对象
    var _view=_pageModel.view;
    //监听页面进场
    _pageModel.on('movieIn',movieIn);
    //监听页面进场完成
    _pageModel.on('movieInEnd',movieInEnd);
    //获取显示界面上按钮对象 捆绑点击方法
    _view.btn.on('click',function(){
        console.log('HomePage btn click');
    });
    
    function movieIn() {
      console.log('页面开始进场');
    }
    
    
    function movieInEnd() {
      console.log('页面进场完成');
    }
}
new HomePage();
```