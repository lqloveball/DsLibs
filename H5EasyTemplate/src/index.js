/**
 * 还是使用webpack编译单页应用的方式编写
 */
require('touchjs');
require('jstween');
require('ds/net/QuickAjax');
require('ds/net/QueueLoad');
require('ds/ui/PopAlert');

require('ds/gemo/SitePageManager');
var _pager = new ds.gemo.SitePageManager();
SiteModel.pager = _pager;

//分享管理类
require('ds/net/CagoeWechatShareModel');
SiteModel.shareModel = new ds.net.CagoeWechatShareModel(
    '分享标题',
    '分享内容',
    '/index.html',
    '/index.html?WorkID='
);

function AppMain() {

    var _self = this;
    //快速指向页面跳转方法
    var gotoPage = SiteModel.gotoPage;
    this.gotoPage = gotoPage;

    this.init = function () {
        console.log('SPA Main init()');
        //设置分享
        SiteModel.shareModel.defaultWeiShare();
        //在加载模块需要的资源前需要siteModel创建需要的模块吗？
        SiteModel.beforeSinglePageApplicationLoadAssets(loadMainAssets);
    };

    function loadMainAssets() {

        console.log('loadMainAssets');
        // 加载cjs的动画资源
        // SiteModel.loadModel.loadCJS(
        //     'main.js',
        //     initModels,
        //     [20, 100],
        // );
        initModels();
    }

    function initModels() {

        console.log('initModels');

        SiteModel.hitLoadPanel();

    }

}

//单页面实例创建
SiteModel.appMain = new AppMain();
SiteModel.appMain.init();
module.exports = SiteModel.appMain;