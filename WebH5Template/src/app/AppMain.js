//一般会需要touchjs
require('touchjs');
//一般会需要jstween,当然还能使用tweenlite或 tweenmax
require('jstween');//15k
// require('jstimeline');//11 KB
// require('tweenlite');//28k
// require('timelinelite');//13 KB
// require('tweenmax');//113 KB
//=================项目需要支持模块=======
//通用的提示浮动层，alert代替解决方案模块
require('ds/ui/PopAlert');
//加载队列模块
require('ds/net/QueueLoad');
//数据监测模块
require('ds/net/ADTrack');
//分享管理类
require('ds/net/ShareModel');
//页面跳转管理器类
require('ds/gemo/SitePageManager');

/**
 * 网站单页面应用
 **/
function AppMain() {

    var _self = this;

    //构建完成 SiteModel 所需要剩余模块
    SiteModel.apier = require('app/APIManager');
    SiteModel.pager = new ds.gemo.SitePageManager();
    SiteModel.shareModel = new ds.net.ShareModel(
        '分享标题',
        '分享内容',
        '/index.html',
        '/index.html?WorkID='
    );

    //================为了兼容老模板写法 start ===========
    //接口模块
    var _apier = SiteModel.apier;
    this.apier = _apier;

    //页面跳转控制
    var _pager = SiteModel.pager;
    this.pager = _pager;

    //页面跳转方法
    this.gotoPage = SiteModel.gotoPage;
    var gotoPage = SiteModel.gotoPage;
    //================为了兼容老模板写法 end ===========

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

        SiteModel.loadModel.loadCJS(
            'main.js',
            initModels,
            [20, 100],
            {basePath: './assets/test/'}
        );

    }

    /**
     * 开始初始化模块
     */
    function initModels() {

        console.log('initModels');

        SiteModel.hitLoadPanel();

        _pager.add(require('./pages/HomePage'));

        //debug模式页面控制
        if (SiteModel.debug) {

            gotoPage('HomePage');
            // gotoPage('HtmlPage');
            // gotoPage('SelectImages');
            // gotoPage('CreatejsInput');
            // gotoPage('CreatejsDomMovie');
            // gotoPage('WebGL2Stage');

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
SiteModel.appMain.init();
module.exports = SiteModel.appMain;
