/**
 * 网站主入口
 * @type {[Class]}
 **/
function AppMain() {

    var _self=this;

    //通用的提示浮动层，alert代替解决方案
    require('ds/ui/PopAlert');
    //页面跳转管理器
    require('ds/gemo/SitePageManager');
    //加载队列
    require('ds/net/QueueLoad');
    //数据监测
    require('ds/net/ADTrack');
    //一般会需要touchjs11 cc
    require('touchjs');
    //一般会需要jstween,当然还能使用tweenlite或 tweenmax
    require('jstween');//15k

    // require('jstimeline');//11 KB
    // require('tweenlite');//28k
    // require('timelinelite');//13 KB
    // require('tweenmax');//113 KB


    //接口模块
    var _apier = require('app/APIManager');
    SiteModel.apier = this.apier = _apier;

    //页面跳转控制
    var _pager = new ds.gemo.SitePageManager();
    SiteModel.pager = this.pager = _pager;

    //初始化
    this.init = function () {

        console.log('AppMain init()');

        _apier.defaultWeiShare();

        loadMainAssets();

    };

    //开始加载资源
    function loadMainAssets() {

        //加载配置对象
        var _loadData={
            basePath: './assets/test/',
            jsUrl: 'main.js',
            jsNS: 'lib',
            imgNS: 'images',
            imgNS: 'images',
            loadType: true,
            crossOrigin: false,//是否使用跨域
            id: '5071EEE873294290BE1B32546711C71F',//cc 2017 发布资源的id
            complete:function(e){
                SiteModel.showProgress(100);
                initModels();
            },
            progress:function(e){
                var _progress = e.target.progress;
                SiteModel.showProgress(20+(_progress * 80 >> 0));
            }
        };
        //开始加载动画资源
        ds.createjs.loadAssets(_loadData);

    }

    //开始初始化模块
    function initModels() {


        SiteModel.hitLoadPanel();

        _pager.add(require('./pages/HomePage'));

        //debug模式页面控制
        if(SiteModel.debug){

            // gotoPage('HomePage');
            gotoPage('HtmlPage');

        }
        //非debug模式页面控制
        else{

            // gotoPage('HomePage');

        }

        SiteModel.resize();

    }

    /**
     * 页面跳转
     * @param {string} value  页面标识
     */
    this.gotoPage=gotoPage;

    //页面跳转方法
    function gotoPage(value) {

        if (_pager.pageLabel === value) return;

        _pager.gotoPage(value);

        ds.net.pv(value);

    }

}

SiteModel.appMain=new AppMain();
SiteModel.appMain.init();
module.exports = SiteModel.appMain;
