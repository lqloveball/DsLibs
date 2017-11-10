//一般会需要touchjs
require('touchjs');
//一般会需要jstween,当然还能使用tweenlite或 tweenmax
require('jstween');//15k
// require('jstimeline');//11 KB
// require('tweenlite');//28k
// require('timelinelite');//13 KB
require('tweenmax');//113 KB
//需要threejs相关扩展模块
require('ds/threejs/index.js');
//=================项目需要支持模块=======
//通用的提示浮动层，alert代替解决方案模块
require('ds/ui/PopAlert');
//加载队列模块
require('ds/net/QueueLoad');
//数据监测模块
require('ds/net/ADTrack');

//构建完成 SiteModel 所需要剩余模块
SiteModel.apier = require('app/APIManager');
//页面跳转管理器类
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

/**
 * 网站单页面应用
 **/
function AppMain() {

    var _self = this;

    //快速指向页面跳转方法
    var gotoPage=SiteModel.gotoPage;
    this.gotoPage=gotoPage;

    /**
     * 初始化
     */
    this.init = function () {

        console.log('AppMain init()');
        //设置分享
        SiteModel.shareModel.defaultWeiShare();
        //在加载模块需要的资源前需要siteModel创建需要的模块吗？
        SiteModel.beforeSinglePageApplicationLoadAssets(loadMainAssets);

    };

    /**
     * 开始加载资源
     */
    function loadMainAssets() {

        console.log('loadMainAssets');

        // 加载cjs的动画资源
        // SiteModel.loadModel.loadCJS(
        //     'main.js',
        //     initModels,
        //     [20, 100],
        //     {basePath: './assets/'}
        // );

    }

    /**
     * 开始初始化模块
     */
    function initModels() {

        console.log('initModels');

        SiteModel.hitLoadPanel();

        // _pager.add(require('./pages/HomePage'));

        //debug模式页面控制
        if (SiteModel.debug) {

            gotoPage('HomePage');


        }
        //非debug模式页面控制
        else {

            gotoPage('HomePage');
        }

        SiteModel.resize();

    }

}

//单页面实例创建
SiteModel.appMain = new AppMain();
//初始化
SiteModel.appMain.init();
module.exports = SiteModel.appMain;
