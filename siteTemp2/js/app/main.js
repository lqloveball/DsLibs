/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [], result;
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId])
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules, executeModules);
/******/ 		while(resolves.length)
/******/ 			resolves.shift()();

/******/ 	};

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// objects to store loaded and loading chunks
/******/ 	var installedChunks = {
/******/ 		1: 0
/******/ 	};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}

/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		if(installedChunks[chunkId] === 0)
/******/ 			return Promise.resolve();

/******/ 		// an Promise means "currently loading".
/******/ 		if(installedChunks[chunkId]) {
/******/ 			return installedChunks[chunkId][2];
/******/ 		}
/******/ 		// start chunk loading
/******/ 		var head = document.getElementsByTagName('head')[0];
/******/ 		var script = document.createElement('script');
/******/ 		script.type = 'text/javascript';
/******/ 		script.charset = 'utf-8';
/******/ 		script.async = true;
/******/ 		script.timeout = 120000;

/******/ 		if (__webpack_require__.nc) {
/******/ 			script.setAttribute("nonce", __webpack_require__.nc);
/******/ 		}
/******/ 		script.src = __webpack_require__.p + "" + ({"0":"AppMain"}[chunkId]||chunkId) + ".js?" + "3ef76e609d12e38ed0e3" + "";
/******/ 		var timeout = setTimeout(onScriptComplete, 120000);
/******/ 		script.onerror = script.onload = onScriptComplete;
/******/ 		function onScriptComplete() {
/******/ 			// avoid mem leaks in IE.
/******/ 			script.onerror = script.onload = null;
/******/ 			clearTimeout(timeout);
/******/ 			var chunk = installedChunks[chunkId];
/******/ 			if(chunk !== 0) {
/******/ 				if(chunk) chunk[1](new Error('Loading chunk ' + chunkId + ' failed.'));
/******/ 				installedChunks[chunkId] = undefined;
/******/ 			}
/******/ 		};

/******/ 		var promise = new Promise(function(resolve, reject) {
/******/ 			installedChunks[chunkId] = [resolve, reject];
/******/ 		});
/******/ 		installedChunks[chunkId][2] = promise;

/******/ 		head.appendChild(script);
/******/ 		return promise;
/******/ 	};

/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./js/app/";

/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

eval("_time = new Date().getTime();\n//网址主模块\nwindow.SiteModel = {\n    ShowProgress: ShowProgress,//设置加载进度方法\n    HitLoadPanel: HitLoadPanel,//隐藏加载进度方法 [如需要使用这个函数进行设置隐藏加载进度条，Dom默认直接hide(),Createjs的loading 直接删除父级对象]\n    Debug:false,//是否debug  会根据端口号进行判断\n    SiteResizeModel:null,//也可以通过这里获取自适应模块\n    LoadPanel:null,//加载界面 [Dom的loading 请在InitLoadPanel函数内进行实现   Createjs的loading，正常来说不需要修改，如果需要修改InitCreateJsLoadPanel函数内修改实现]\n    CJSModel:null,//createjs项目模块  [设置IsCJSSiteModel=true 时候才会创建]\n    //==============以上参数不做修改，会根据下列配置进行生成===================\n    ScreenType:'v',//网站自适应方式\n    Screen:'#screen',//网站自适应容器\n    HasCreateJs:false,//网站是否需要是否是用createjs    [设置开发网站的类型,true会使用vendors2.js false使用vendors1.js]\n    IsCJSSiteModel:false,//是否是用createjs方式网站    [需要设置HasCreateJs 等于true]\n    IsCJSLoadPanel:false,//是否用createjs的loading  [设置使用什么方式做loading]\n};\n/**\n * 加载单页面应用的代码\n */\nfunction LoadSinglePageApplicationJS(){\n  __webpack_require__.e/* require.ensure */(0).then((function() {\n          ShowProgress(20);\n          _SinglePageApplication = __webpack_require__(0);\n          SiteModel.SinglePageApplication = _SinglePageApplication;\n          SiteModel.SinglePageApplication.Init();\n      }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);\n}\n/**\n *  初始化Dom loading界面\n */\nfunction InitLoadPanel(){\n  //开始初始化Domloading\n  SiteModel.LoadPanel=$('#siteLoadPanel');\n  //加载这单页面应用\n  LoadSinglePageApplicationJS();\n}\n/**\n * 设置加载进度方法\n * @param {[Number]} progress [loading的百分比 0-100]\n */\nfunction ShowProgress(progress){\n  //获取load界面\n  var _loadPanel=SiteModel.LoadPanel;\n\n  //判断是Dom方式的loading\n  if((_loadPanel instanceof HTMLElement)||(_loadPanel.length>=1&&_loadPanel[0] instanceof HTMLElement)){\n    //【Dom Loading 请在这里实现】\n    $('#siteLoadPanel .progress').css({width:(progress+1)+'%'});\n    $('#siteLoadPanel .progress').html((progress+1)+'%');\n  }\n  //判断是createjs类型loading\n  else if(createjs!==undefined&&_loadPanel instanceof createjs.DisplayObject){\n    if(progress>=99)progress=99;\n    if(_loadPanel instanceof createjs.MovieClip)_loadPanel.gotoAndStop(progress);\n    if(_loadPanel.label)_loadPanel.label.text=progress<10?'0'+progress+'%':progress+'%';\n  }\n}\n/**\n * 隐藏进度条方法\n */\nfunction HitLoadPanel(){\n  var _loadPanel=SiteModel.LoadPanel;\n  if(!_loadPanel)return;\n  //判断是Dom方式的loading\n  if((_loadPanel instanceof HTMLElement)||(_loadPanel.length>=1&&_loadPanel[0] instanceof HTMLElement)){\n    $(_loadPanel).hide();\n  }\n  else if(createjs!==undefined&&_loadPanel instanceof createjs.DisplayObject){\n    if(_loadPanel.parent)_loadPanel.parent.removeChild(_loadPanel);\n  }\n}\n/*=================以下部分基本通用可以不需要修改===================*/\n//进行判断是否进行debug的判断\nif (location.href.indexOf(':8001') != -1) SiteModel.Debug = true;\n//屏蔽滑动页面\ndocument.addEventListener('touchmove', function(e) {e.preventDefault();}, false);\n/**\n * 构建createjs模块\n */\nfunction InitCJSModel(){\n  //构建createjs模块\n  SiteModel.CJSModel = ccjs.CCJSModel.Create({\n      appendTo:$('#cjsBox')[0],\n      width: 640,\n      height: 1040,\n      fps: 30\n  });\n}\n/**\n *  初始化CreateJs loading界面\n */\nfunction InitCreateJsLoadPanel(){\n  //loading加载配置\n  var _loadObj = {\n      basePath: './assets/',\n      //js路径\n      jsUrl: 'loading.js',\n      jsNS: 'loadlib',\n      imgNS: 'loadimages',\n      //加载完成后调用的方法\n      complete: onComplete,\n      //加载进行调用的方法\n      // progress: onProgress,\n      //加载方式 初始化LoadQueue的crossOrigin参数\n      loadType: true,\n  };\n  //loading加载完成后的方法处理\n  function onComplete(e) {\n    console.log('LoadPanel加载完成');\n    //创建加载界面\n    SiteModel.LoadPanel=new loadlib.LoadPanel();\n    //添加到场景\n    SiteModel.CJSModel.Root.addChild(SiteModel.LoadPanel);\n    SiteModel.LoadPanel.gotoAndStop(0);\n    SiteResizeModel.ReSize();\n    ShowProgress(10);\n    //加载这单页面应用\n    LoadSinglePageApplicationJS();\n  }\n  //开始加载loading的资源\n  ccjs.LoadCJSAssets(_loadObj);\n}\n\n/**\n * 初始化网站自适应模块\n */\nfunction InitSiteResizeModel(){\n  //网站自适应模块\n  window.SiteResizeModel = new Ds.SiteMoblieResizeModel({\n    screen:SiteModel.Screen,\n    screenType:SiteModel.ScreenType,\n  });\n  SiteModel.SiteResizeModel=SiteResizeModel;\n  //进行提示浮动层显示\n  if(SiteResizeModel.ScreenType!='auto')SiteResizeModel.InitOrientationTip();\n  //监听场景自适应\n  SiteResizeModel.on('resize', ReSize);\n  //开始进行初始化场景自适应\n  SiteResizeModel.InitResize();\n}\n/**\n * 自适应\n */\nfunction ReSize(){\n  //var _Width, _Height, _PageScale, _ActualH, _Horizontal = false,_IsInputState = false,_ScreenWidth, _DensityDpi;\n  if(SiteResizeModel.ScreenType=='auto'){\n\n  }\n}\n\n/**\n * 加载基础库的\n */\nfunction LoadBaseJS() {\n    Promise.resolve().then((function() {\n            Promise.resolve().then(function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [\n                !(function webpackMissingModule() { var e = new Error(\"Cannot find module \\\"jquery\\\"\"); e.code = 'MODULE_NOT_FOUND';; throw e; }()),\n                !(function webpackMissingModule() { var e = new Error(\"Cannot find module \\\"eventdispatcher\\\"\"); e.code = 'MODULE_NOT_FOUND';; throw e; }()),\n                !(function webpackMissingModule() { var e = new Error(\"Cannot find module \\\"log\\\"\"); e.code = 'MODULE_NOT_FOUND';; throw e; }()),\n                !(function webpackMissingModule() { var e = new Error(\"Cannot find module \\\"ds/gemo/QuickTrack\\\"\"); e.code = 'MODULE_NOT_FOUND';; throw e; }()),\n                !(function webpackMissingModule() { var e = new Error(\"Cannot find module \\\"sitemoblieresizemodel\\\"\"); e.code = 'MODULE_NOT_FOUND';; throw e; }()),\n            ]; (function(){\n              console.log('LoadBaseJS:', new Date().getTime() - _time);\n              InitSiteResizeModel();\n              if(SiteModel.HasCreateJs)LoadCJSFrameWorkJS();\n              else LoadFrameWorkJS();\n            }.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}).catch(__webpack_require__.oe);\n\n        }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);\n}\n/**\n * 加载项目需要支持的第三方库\n */\nfunction LoadCJSFrameWorkJS(){\n  Promise.resolve().then((function() {\n          Promise.resolve().then(function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [\n              !(function webpackMissingModule() { var e = new Error(\"Cannot find module \\\"createjs\\\"\"); e.code = 'MODULE_NOT_FOUND';; throw e; }()),\n              !(function webpackMissingModule() { var e = new Error(\"Cannot find module \\\"dscreatejs\\\"\"); e.code = 'MODULE_NOT_FOUND';; throw e; }()),\n              !(function webpackMissingModule() { var e = new Error(\"Cannot find module \\\"jstween\\\"\"); e.code = 'MODULE_NOT_FOUND';; throw e; }()),\n              !(function webpackMissingModule() { var e = new Error(\"Cannot find module \\\"touchjs\\\"\"); e.code = 'MODULE_NOT_FOUND';; throw e; }()),\n          ]; (function(){\n            console.log('LoadCJSFrameWorkJS:', new Date().getTime() - _time);\n            //是否CJS类型网站\n            if(SiteModel.IsCJSSiteModel) InitCJSModel();\n            //使用什么模式的加载loading\n            if(SiteModel.IsCJSLoadPanel)InitCreateJsLoadPanel();\n            else InitLoadPanel();\n          }.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}).catch(__webpack_require__.oe);\n\n      }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);\n}\n/**\n * 加载项目需要支持的第三方库\n */\nfunction LoadFrameWorkJS(){\n  Promise.resolve().then((function() {\n          Promise.resolve().then(function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [\n              !(function webpackMissingModule() { var e = new Error(\"Cannot find module \\\"jstween\\\"\"); e.code = 'MODULE_NOT_FOUND';; throw e; }()),\n              !(function webpackMissingModule() { var e = new Error(\"Cannot find module \\\"touchjs\\\"\"); e.code = 'MODULE_NOT_FOUND';; throw e; }()),\n          ]; (function(){\n          \tconsole.log('LoadFrameWorkJS:', new Date().getTime() - _time);\n          \tInitLoadPanel();\n          }.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}).catch(__webpack_require__.oe);\n          \n      }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);\n}\n//开始加载代码\nLoadBaseJS();\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/main.js\n// module id = 1\n// module chunks = 1\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ })
/******/ ]);