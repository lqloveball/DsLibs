/**
 * H5快速开发模板,网站基础结构对象
 */
var SiteModel = {
    //设备判断模块
    devicer: require('ds/gemo/Devicer'),
    //这个单页面程序主逻辑模块 loadSinglePageApplicationJS执行后创建
    appMain: null,
    //api接口模块
    apier:null,
    //加载页面模块
    loadModel: require('./app/LoadModel.js'),
    //是否开发模式下，会根据端口号进行判断
    debug: false,
    //完整自适应对象
    moblieResizeModel: null,
    //加载界面
    loadPanel: null,
    //网站自适应方式
    type: 'auto',
    //网站自适应进行缩放的dom元素
    screen: '#screen',
    //基础框架加载完成进度显示值
    baseProgress: 10,
    //框架加载完成进度显示值
    frameWorkProgress: 20,
    //自动背景声音控制对象
    autoAudioer: null,
    //自动声音控制对象初始化设置参数
    autoAudioerData: {
        list: [
            {src:'./media/BGM.mp3',id:'BGM',loop:true,volume:1},//项格式
        ],
        //默认播放声音背景
        id: 'BGM',
        //这个BMG 绑定的控制的按钮
        button: '#BGMBtn'
    },

    //createjs模块
    createJsModel: null,
    //是否需要用到createjs框架
    hasCreateJs: true,
    //是否createjs为主的网站开发方式
    isCreateJsSiteModel: true,
    //是否createjs来做网站的loading
    isCreateJsLoadPanel: false,
    //是否使用最新版本的createjs 带Webgl
    isCreateJsGL:true,

    //pixijs模块
    pixiJsModel: null,
    //是否需要pixijs框架
    hasPixiJs: false,
    //是否pixijs为主的网站开发方式
    isPixiJsSiteModel: false,

    //loading模块构建完成后
    loadingModelEnd: loadingModelEnd,
    //强制自适应
    resize: resize,
    //插入一个js到页面上
    getScript: getScript,
    //开始加载单页面应用
    loadSinglePageApplicationJS: loadSinglePageApplicationJS,
    //加载基础框架
    loadBaseJS: loadBaseJS,
    //加载caretejs框架
    loadCreateJsFrameWorkJS: loadCreateJsFrameWorkJS,
    //加载pixijs框架
    loadPixiJsFrameWorkJS: loadPixiJsFrameWorkJS,
    //插入js脚本
    getScript: getScript,
};

//设置成全局对象
window.SiteModel = SiteModel;

//根据端口好判断是不是本地测试
if (location.href.indexOf(':800') !== -1) SiteModel.debug = true;

//锁定滑动页面
document.addEventListener('touchmove', function (e) {
    e.preventDefault();
}, false);

//loading 方法
SiteModel.showProgress = SiteModel.loadModel.showProgress;
SiteModel.hitLoadPanel = SiteModel.loadModel.hitLoadPanel;
//基本的浏览器与设备的判断
SiteModel.isWeixin = SiteModel.devicer.isWeixin;
SiteModel.isIOS = SiteModel.devicer.isIOS;
SiteModel.isMobile = SiteModel.devicer.isMobile;

var _loadSinglePageApplicationJSBool=false;

function loadSinglePageApplicationJS() {

    if(_loadSinglePageApplicationJSBool)return;

    console.log('loadSinglePageApplicationJS Strat');

    _loadSinglePageApplicationJSBool=true;

    require.ensure(
        ['app/AppMain.js'],
        function() {
            SiteModel.loadModel.showProgress(SiteModel.frameWorkProgress);
            require('app/AppMain.js');
        },
        'AppMain'//单页面应用打包的js名称
    );
}

var _loadCreateJsFrameWorkJSBool = false;

function loadCreateJsFrameWorkJS() {

    if (_loadCreateJsFrameWorkJSBool) return;

    _loadCreateJsFrameWorkJSBool = true;

    SiteModel.getScript('./js/app/createjsFrameWork.js', function () {

        console.log('loadCreateJsFrameWorkJS End');

        //是否CJS类型网站
        if (SiteModel.isCreateJsSiteModel) initCreateModel();

        //使用createjs动画资源实现loading界面
        if (SiteModel.isCreateJsLoadPanel) SiteModel.loadModel.initCreateJsLoadPanel();
        else SiteModel.loadModel.initDomLoadPanel();

    });

}

function initCreateModel() {

    SiteModel.createJsModel = ds.createjs.create({
        hasGL:SiteModel.isCreateJsGL,
        appendTo: $('#cjsBox')[0],
        width: 640,
        height: 1140,
        fps: 30
    });

}

var _loadPixiJsFrameWorkJSBool = false;

function loadPixiJsFrameWorkJS() {

    if (_loadPixiJsFrameWorkJSBool) return;

    _loadPixiJsFrameWorkJSBool = true;

    SiteModel.getScript('./js/app/pixiFrameWork.js', function () {

        console.log('loadPixiJsFrameWorkJS End');

        // //是否pixi类型网站
        if (SiteModel.isPixiJsSiteModel) initPixiJsModel();

        loadSinglePageApplicationJS();

    });

}

function initPixiJsModel() {

    SiteModel.pixiJsModel = ds.pixijs.create({
        appendTo: $('#pixiBox')[0],
        width: 640,
        height: 1140,
        fps: 30
    });

    //是否实时进行刷新dom与显示对象之间关系
    ds.pixijs.domAuto = true;

}

var _loadBaseJSBool = false;

function loadBaseJS() {

    if (_loadBaseJSBool) return;

    _loadBaseJSBool = true;

    SiteModel.getScript('./js/app/base.js', function () {

        console.log('LoadBaseJS End');

        //初始化背景声音与声音加载对象
        initAutoAudioer();

        initMoblieResizeModel();

        //判断是否需要createjs
        if (SiteModel.hasCreateJs) SiteModel.loadCreateJsFrameWorkJS();
        else loadFrameWorkJS();

    });

}

function loadFrameWorkJS() {

    console.log('loadFrameWorkJS End');
    SiteModel.loadModel.initDomLoadPanel();

}

function loadingModelEnd() {

    if (SiteModel.hasPixiJs) SiteModel.loadPixiJsFrameWorkJS();
    else SiteModel.loadSinglePageApplicationJS();

}

function initAutoAudioer() {

    if(!ds.media||!new ds.media.AutoAudioManager)return;

    SiteModel.autoAudioer = new ds.media.AutoAudioManager();
    if (SiteModel.autoAudioerData)SiteModel.autoAudioer.initConfigData(SiteModel.autoAudioerData);

}

function initMoblieResizeModel() {

    SiteModel.moblieResizeModel = new ds.core.MoblieResizeModel({
        screen: $(SiteModel.screen)[0],
        type: SiteModel.type,
    });

    //进行提示浮动层显示
    SiteModel.moblieResizeModel.createOrientationTip();

    //监听场景自适应
    SiteModel.moblieResizeModel.on('resize', _resize);
    //开始进行初始化场景自适应
    SiteModel.moblieResizeModel.initResize();

    //解决loading页面缩放问题
    $(SiteModel.screen).show();

}

function _resize() {

    if (SiteModel.moblieResizeModel.type === 'auto') {

        if (SiteModel.createJsModel) {

            if (SiteModel.moblieResizeModel.screenWidth === 640){

                SiteModel.createJsModel.size(SiteModel.moblieResizeModel.screenWidth, 1140);

            }
            else {

                SiteModel.createJsModel.size(SiteModel.moblieResizeModel.screenWidth, 640);

            }

        }

    }

    if (!SiteModel.moblieResizeModel.isInputState) setTimeout(function () {$(SiteModel.screen).scrollTop(0);}, 30);

}

/**
 * 强制重新自适应计算
 */
function resize() {

    SiteModel.moblieResizeModel.resize();

}

/**
 * 加载js代码插入到html内
 * @param {string} src js代码路径
 * @param {function} complete js加载完成后
 */
function getScript(src, complete) {

    var _script = document.createElement("script");
    _script.setAttribute("type", "text/javascript");

    //ie下
    if (_script.onreadystatechange) {

        _script.onreadystatechange = function () {

            if (this.readyState == "loaded" || this.readyState == "complete") {

                if (complete) complete();

            }

        };

    } else {

        //其他浏览器
        _script.onload = function () {

            if (complete) complete();

        };

    }

    document.getElementsByTagName("head")[0].appendChild(_script);
    _script.src = src;
}

//开始加载代码
SiteModel.loadBaseJS();