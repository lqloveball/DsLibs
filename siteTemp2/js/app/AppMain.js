webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports) {

eval("/**\n * 网站主入口\n * @type {[Class]}\n **/\nfunction AppMain() {\n    //指向这个网站入口模块\n    var _Self = this;\n    //如果有用到 createjs 部分代码\n    var _Root, _Stage, _CJSModel;\n    /**\n     * 初始化\n     */\n    this.Init = function() {\n        console.log('AppMain Init');\n        //如果是CJS类型项目\n        if(SiteModel.CJSModel){\n          _CJSModel = SiteModel.CJSModel;\n          _Root = _CJSModel.Root;\n          _Stage = _CJSModel.Stage;\n        }\n        //微信分享\n        WeiShare();\n    };\n    /**\n     * 微信分享接口\n     */\n    function WeiShare() {\n        CallJsApiWXConfigItf(\"http://wechat.cagoe.com/JsApiWXConfig.aspx\");\n        SetWechatShare(\"分享标题\", \"分享内容\", location.origin + \"/index.aspx\", \"images/ShareImg.jpg\", function() {\n            Ds.gemo.QuickTrack.baiduEvent('WechatShare');\n        });\n        SetWechatShareToFriend(\"分享标题\", \"分享内容\");\n        SetWechatShareToTimeline(\"分享标题\", \"分享内容\");\n    }\n}\nmodule.exports = new AppMain();\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/app/AppMain.js\n// module id = 0\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/app/AppMain.js?");

/***/ })
]);