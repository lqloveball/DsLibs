//这个类使用老js方法，有可能直接插入html标签内使用
!(function (factory) {

    var root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);


    if (typeof define === 'function' && define.amd) {

        define(['exports'], function (exports) {

            module.exports = factory(root, exports);

        });
    } else if (typeof exports !== 'undefined') {

        module.exports = factory(root, exports);

    } else {

        factory(root);

    }

}(function (root, model) {


    /**
     * 站点通用加载方法模块，一般配合ds.core.SiteModelByMobile实例使用
     * @class ds.net.SiteLoadModel
     */
    function SiteLoadModel() {

        /**
         * 现在loading 进度
         * @method ds.net.SiteLoadModel.prototype.showProgress
         * @param {number} progress 加载进度值 0-100；
         */
        this.showProgress=function (progress) {

            //获取load界面
            var _loadPanel = SiteModel.loadPanel;

            //判断是Dom方式的loading
            if ((_loadPanel instanceof HTMLElement) || (_loadPanel.length >= 1 && _loadPanel[0] instanceof HTMLElement)) {

                if (progress >= 100) progress = 100;
                $('#siteLoadPanel .progress').css({width: (progress) + '%'});
                $('#siteLoadPanel .label').html((progress) + '%');

            }
            //判断是createjs类型loading
            else if (window['createjs'] !== undefined && _loadPanel instanceof createjs.DisplayObject) {

                if (progress >= 99) progress = 99;
                if (_loadPanel instanceof createjs.MovieClip) _loadPanel.gotoAndStop(progress);
                if (_loadPanel.label) _loadPanel.label.text = progress < 10 ? '0' + (progress + 1) + '%' : (progress + 1) + '%';
            }

        };

        /**
         * 隐藏loading Panel
         * @method ds.net.SiteLoadModel.prototype.hitLoadPanel
         * @param {function} callBack 隐藏loading界面完成后回调
         */
        this.hitLoadPanel=function (callBack) {

            var _loadPanel = SiteModel.loadPanel;
            if (!_loadPanel) return;

            //判断是Dom方式的loading
            if ((_loadPanel instanceof HTMLElement) || (_loadPanel.length >= 1 && _loadPanel[0] instanceof HTMLElement)) {

                $(_loadPanel).hide();

            }
            else if (window['createjs'] !== undefined && _loadPanel instanceof createjs.DisplayObject) {

                if (_loadPanel.parent) _loadPanel.parent.removeChild(_loadPanel);

            }

        };

        /**
         * 创建dom loading界面
         * @method ds.net.SiteLoadModel.prototype.initDOMLoadPanel
         * @param {function} callBack 创建完成loading界面完成后回调
         */
        this.initDOMLoadPanel=function (callBack) {

            //开始初始化Domloading
            SiteModel.loadPanel = $('#siteLoadPanel');

            //加载这单页面应用
            if(callBack)callBack();

        };

        /**
         * 创建createjs loading界面
         * @method ds.net.SiteLoadModel.prototype.initCreateJsLoadPanel
         * @param {function} callBack 创建完成loading界面完成后回调
         */
        this.initCreateJsLoadPanel=function (callBack) {

            $('#siteLoadPanel').hide();

            //loading加载配置
            var _loadObj = {

                basePath: './assets/',
                //js路径
                jsUrl: 'loading.js',
                jsNS: 'loadlib',
                imgNS: 'loadimages',
                //加载完成后调用的方法
                complete: onComplete,
                //加载进行调用的方法
                // progress: onProgress,
                //加载方式 初始化LoadQueue的crossOrigin参数
                loadType: true,
                crossOrigin: false,
            };

            //loading加载完成后的方法处理
            function onComplete(e) {

                console.log('LoadPanel加载完成');

                if(SiteModel){

                    //创建加载界面
                    SiteModel.loadPanel = new loadlib.LoadPanel();

                    //添加到场景
                    SiteModel.createJsModel.root.addChild(SiteModel.loadPanel);

                    SiteModel.loadPanel.gotoAndStop(0);

                    SiteModel.resize();

                }

                //loading UI构建完成
                if(callBack)callBack();

            }

            //开始加载loading的资源
            ds.createjs.loadAssets(_loadObj);

        };

    }

    var ds = root.ds = root.ds || {};
    ds.net = ds.net || {};
    ds.net.SiteLoadModel = SiteLoadModel;


    return ds.net.SiteLoadModel;

}));