webpackJsonp([1],{

/***/ 2:
/***/ (function(module, exports) {

eval("/**\n * 网站主入口\n * @type {[Class]}\n **/\nfunction AppMain() {\n  //指向这个网站入口模块\n  var _Self = this;\n  //如果有用到 createjs 部分代码\n  var _Root, _Stage, _CJSModel;\n\n  /**\n   * 初始化\n   */\n  this.Init = function () {\n    console.log('AppMain Init');\n\n    InitResizeModel();\n  };\n  /**\n   * 进行自适应\n   */\n  function InitResizeModel() {\n    SiteModel.SiteResizeModel.on('resize', ReSize);\n    ReSize();\n  }\n  /**\n   * 如果拥有Createjs运行这个代码\n   * 记的需要引用下面库\n   * require('createjs')//需要create\n   * require('dscreatejs')//需要create 扩展\n   */\n  function InitCJSModel() {\n    window.ss = window.ss || {};\n    window.cjs = window.createjs;\n    window.images = window.images || {};\n    window.AdobeAn = window.AdobeAn || {};\n    _CJSModel = ccjs.CCJSModel.Create({\n      appendTo: $('#cjsBox')[0],\n      width: 640,\n      height: 1040,\n      fps: 30\n    });\n    _Root = _CJSModel.Root;\n    _Stage = _CJSModel.Stage;\n  }\n  /**\n   * 自适应\n   */\n  function ReSize() {\n    var _width = SiteModel.SiteResizeModel.Width;\n    var _height = SiteModel.SiteResizeModel.Height;\n    var _actualH = SiteModel.SiteResizeModel.ActualH;\n    var _pageScale = SiteModel.SiteResizeModel.PageScale;\n    var _isInputState = SiteModel.SiteResizeModel.IsInputState;\n    var _horizontal = SiteModel.SiteResizeModel.Horizontal;\n    var _screenWidth = SiteModel.SiteResizeModel.ScreenWidth;\n    var _densityDpi = SiteModel.SiteResizeModel.DensityDpi;\n\n    //_CJSModel.SetSize(640,_actualH);\n  }\n}\nmodule.exports = new AppMain();\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/app/AppMain.js\n// module id = 2\n// module chunks = 1\n\n//# sourceURL=webpack:///./src/app/AppMain.js?");

/***/ })

});