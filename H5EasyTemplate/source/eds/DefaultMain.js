import PageManager from './defaultSite/PageManager';
import PanelManager from './defaultSite/PanelManager';
import 'touchjs';
import 'jstween';
import 'ds/net/QuickAjax';
import 'ds/net/ADTrack';
import 'ds/net/QueueLoad';
import 'ds/ui/PopAlert';
import 'ds/utils/Animate';
import 'ds/net/SiteWechatShareModel';


class DefaultMain extends ds.core.EventDispatcher {

    constructor() {
        super();
    }

    init() {

        // console.log('SPA init()');

        let _config = SiteModel.config;
        if (!_config.otherjs) _config.otherjs = [];
        let _otherjs = _config.otherjs;
        if (_config.hasThreeJs || _config.hasThreeJsModel) {
            if (_otherjs.indexOf('./js/edslibs/extend_threejs.js') < 0) _otherjs.push('./js/edslibs/extend_threejs.js');
        }
        if (_config.hasPixiJs || _config.hasPixiJsModel) {
            if (_otherjs.indexOf('./js/edslibs/extend_pixijs.js') < 0) _otherjs.push('./js/edslibs/extend_pixijs.js');
        }
        //是否需要添加插件
        if (SiteConfig.plugins && SiteConfig.plugins.length > 0) {

            let _plugins = SiteConfig.plugins;
            let _jsUrl;
            for (let i = 0; i < _plugins.length; i++) {

                let _url = _plugins[i];
                if (_url.indexOf('.js') < 0) _jsUrl = './js/edslibs/plugins_' + _url + '.js';
                else _jsUrl = _url;
                _otherjs.push(_jsUrl);

            }
        }


        //设置分享
        SiteModel.shareModel.defaultWeiShare();

        //在加载模块需要的资源前需要siteModel创建需要的模块吗？
        SiteModel.beforeSinglePageApplicationLoadAssets(() => {
            this._loadMainAssets();
        });

        SiteModel.on('otherJsProgress', function (e) {
            let _progressStart = SiteConfig.loadAssetsStartProgress || 20;
            let _progress = (_progressStart - 10) * e.progress;
            SiteModel.showProgress(_progress);
        }, this);

    }

    _loadMainAssets() {

        // console.log('load SPA Assets');

        let _self = this;

        _self.ds('loadAssetsStart');

        let _loadAssets = SiteConfig.loadAssets;

        if (!_loadAssets || _loadAssets.length <= 0) console.warn('你确定不配置加载资源吗！如果有createjs必须有相关资源');

        this._loadLazyImages();

        let _loadList = [];

        let _progressStart = SiteConfig.loadAssetsStartProgress || 20;
        SiteModel.showProgress(_progressStart);

        let _all = 100 - _progressStart;
        let _spacing = _all / _loadAssets.length;

        let i, obj, _loadObj, _index = -1;
        for (i = 0; i < _loadAssets.length; i++) {

            obj = _loadAssets[i];
            _loadObj = {
                loadType: true,
                crossOrigin: true,
                progress: progress,
                complete: loadStart,
            };
            if (obj instanceof Array) {
                let _tp = obj;
                obj = {type: 'images'};
                obj.basePath = '';
                obj.list = _tp;
            }

            if (typeof obj === 'string') {

                _loadObj.jsUrl = obj;
                if (obj.indexOf('./') < 0) _loadObj.jsUrl = './assets/' + _loadObj.jsUrl;
                _loadObj.jsNS = _loadObj.jsUrl.slice(_loadObj.jsUrl.lastIndexOf('/') + 1, _loadObj.jsUrl.lastIndexOf('.'));
                _loadObj.imgNS = _loadObj.jsNS + 'images';

            }
            else if (obj.type && obj.type === 'images') {
                _loadObj.type = obj.type;
                _loadObj.imgNS = 'other_image_dc';
                _loadObj.basePath = obj.basePath;
                _loadObj.list = obj.list;
            }
            else {

                _loadObj.jsUrl = obj.url;
                if (_loadObj.jsUrl.indexOf('./') < 0) _loadObj.jsUrl = './assets/' + _loadObj.jsUrl;
                if (obj.jsNS !== undefined) _loadObj.jsNS = obj.jsNS;
                else _loadObj.jsNS = _loadObj.jsUrl.slice(_loadObj.jsUrl.lastIndexOf('/') + 1, _loadObj.jsUrl.lastIndexOf('.'));
                _loadObj.imgNS = _loadObj.jsNS + 'images';
                if (obj.loadType !== undefined) _loadObj.loadType = obj.loadType;

            }

            _loadObj.start = (_progressStart + _spacing * i) >> 0;
            _loadObj.end = (_progressStart + _spacing * i + _spacing) >> 0;

            _loadList.push(_loadObj);

            // console.log('_loadObj:',_loadObj);

        }

        let _nowLoadData;

        function loadStart() {

            if (_nowLoadData) SiteModel.showProgress(_nowLoadData.end);

            _index += 1;
            if (_index >= _loadList.length) {
                // SiteModel.resizeModel.type='auto';
                // SiteModel.resize();
                _self.ds('loadAssetsEnd');
                loadEnd();
                return;
            }
            // if(_index===0)SiteModel.resize();
            _nowLoadData = _loadList[_index];

            if (_nowLoadData.type && _nowLoadData.type === 'images') {
                if(ds.createjs&&ds.createjs.queueLoad){
                    ds.createjs.queueLoad(_nowLoadData);
                }else{
                    ds.net.queueLoad(_nowLoadData.list, _nowLoadData.complete, _nowLoadData.progress, { basePath: _nowLoadData.basePath});
                }
            } else {
                ds.createjs.loadAssets(_nowLoadData);
            }


        }

        function progress(e) {

            let _progress;
            if (typeof e === 'number')  _progress = e;
            else _progress = e.target.progress;

            SiteModel.showProgress(_nowLoadData.start + (_spacing * _progress >> 0));
        }

        function loadEnd() {
            _self._loadLazyImagesEnd();
            _self._initPageManager();

        }

        loadStart();

    }

    _loadLazyImagesEnd() {
        let _lazysList = this._lazysList;
        for (let i = 0; i < _lazysList.length; i++) {
            let _img = _lazysList[i];
            _img.src = _img.getAttribute('lazypath');
        }
    }

    _loadLazyImages() {

        let _img;
        let _imgs = $('img');
        let _dc = {};
        let _lazys = [];
        this._lazysList = [];
        for (let i = 0; i < _imgs.length; i++) {
            _img = _imgs[i];
            let _url = _img.getAttribute('lazypath');
            if (_url) this._lazysList.push(_img);
            if (_url && !_dc[_url]) {
                _dc[_url] = _url;
                _lazys.push(_url);
            }
        }

        if (_lazys.length > 0) {
            if (SiteConfig.loadAssets) SiteConfig.loadAssets = [];
            SiteConfig.loadAssets.push(_lazys);
        }


    }

    _initPageManager() {

        let _pages = SiteConfig.pages;
        if (!_pages) {
            _pages = SiteConfig.pages = [];
            console.error('请配置页面');
        }

        let _panels = SiteConfig.panels;
        if (!_panels) {
            _panels = SiteConfig.panels = [];
        }

        let _pager = SiteModel.pager;
        _pager.initConfig(_pages);
        this.ds('initPageManager');

        let _paneler = SiteModel.paneler;
        _paneler.initConfig(_panels);
        this.ds('initPanelManager');

        let _extend = SiteConfig.extend;
        if (!_extend || _extend.length <= 0) {
            this._startSitePage();
        } else {
            console.log('load extend js');
            SiteModel.getScriptList(_extend, () => {
                this.ds('initExtend');
                this._startSitePage();
            })
        }

    }

    _startSitePage() {

        let _pager = SiteModel.pager;
        if (_pager.pageList.length <= 0) {
            console.error('未设置或者创建页面模块');
            return;
        }

        SiteModel.resizeModel.type = 'auto';
        // SiteModel.resize();

        this.ds('startSitePage');
        //如果有配置开始进入网站首页方法，会使用配置方法。默认startSitePage不执行
        if (SiteConfig.startSitePage) {
            let _startSitePage = SiteConfig.startSitePage.bind(this);
            _startSitePage();
            return;
        }

        this.startSitePage();


    }

    startSitePage(){

        let _pager = SiteModel.pager;

        this.isWorkBack = false;

        let _firstPage;

        let _urlParamDc = ds.net.getUrlParameterDictionary();
        if (_urlParamDc && _urlParamDc['WorkID']) {
            let _workPage = SiteConfig.workPage;
            if (!_workPage) {
                ds.alert('请在配置内设置回流页面');
                return;
            }


            let _workid = _urlParamDc['WorkID'];

            this.isWorkBack = true;
            this.workID = _workid;

            let _event = {
                type: 'backWorkPage',
                id: _workid,
            };

            if (typeof(_workPage) === 'string') _firstPage = _workPage;
            else _firstPage = _workPage.name;
            // console.log('_firstPage:',_firstPage);
            //
            if ((typeof(_workPage) === 'object' ) && _workPage.getWorkData) {
                _workPage.getWorkData(_workid);
            }
            else {
                SiteModel.gotoPage(_firstPage);
                SiteModel.hitLoadPanel();
            }

            this.ds(_event);
            SiteModel.ds(_event);


        }
        else {

            _firstPage = SiteConfig.firstPage;
            if (!_firstPage && _pager.pageList[0]) _firstPage = _pager.pageList[0].name;
            if (SiteModel.debug && SiteConfig.debugFirstPage) _firstPage = SiteConfig.debugFirstPage;
            if (!_pager.pageDc[_firstPage]) _firstPage = _pager.pageList[0].name;
            _firstPage = _pager.pageDc[_firstPage].name;
            SiteModel.gotoPage(_firstPage);
            SiteModel.hitLoadPanel();

        }
    }

}

let _shareData = SiteConfig.shareData || {};
let _shareTitle = _shareData.shareTitle || '速速提供分享标题';
let _shareInfo = _shareData.shareInfo || '速速提供分享内容';
let _shareUrl = _shareData.shareUrl || './index.html';
let _shareWorkUrl = _shareData.shareWorkUrl || './index.html?WorkID=';
let _shareImageUrl = _shareData.shareImageUrl || './images/ShareImg.jpg';
let _wxJsUrl = _shareData.wxJsUrl || './js/libs/cagoeShare.js';
let _apiUrl = _shareData.apiUrl || "http://wechat.cagoe.com/JsApiWXConfig.aspx";
let _shareCallBack = _shareData.shareCallBack;
SiteModel.shareModel = new ds.net.SiteWechatShareModel({
        title: _shareTitle,
        info: _shareInfo,
        shareUrl: _shareUrl,
        workUrl: _shareWorkUrl,
        imageUrl: _shareImageUrl,
        wxJsUrl: _wxJsUrl,
        apiUrl: _apiUrl,
        shareCallBack: _shareCallBack,
    }
);

SiteModel.pager = new PageManager();
SiteModel.paneler = new PanelManager();

SiteModel.show = SiteModel.paneler.show.bind(SiteModel.paneler);
SiteModel.hide = SiteModel.paneler.hide.bind(SiteModel.paneler);
SiteModel.hideAll = SiteModel.paneler.hideAll.bind(SiteModel.paneler);
// SiteModel.alert = SiteModel.paneler.alert.bind(SiteModel.paneler);
// console.log('-------------1',eds,eds.PageBase);
//单页面实例创建
SiteModel.appMain = new DefaultMain();
SiteModel.appMain.init();

export default SiteModel.appMain;
