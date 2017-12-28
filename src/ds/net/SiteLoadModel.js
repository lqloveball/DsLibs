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
        this.showProgress = function (progress) {

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


                if (_loadPanel instanceof createjs.MovieClip) {
                    _loadPanel.gotoAndStop(progress >= 99 ? 99 : progress);
                }
                if (_loadPanel.label) _loadPanel.label.text = progress < 10 ? '0' + (progress ) + '%' : (progress) + '%';
            }

        };

        /**
         * 隐藏loading Panel
         * @method ds.net.SiteLoadModel.prototype.hitLoadPanel
         * @param {function} callBack 隐藏loading界面完成后回调
         */
        this.hitLoadPanel = function (callBack) {

            var _loadPanel = SiteModel.loadPanel;
            if (!_loadPanel) return;

            //判断是Dom方式的loading
            if ((_loadPanel instanceof HTMLElement) || (_loadPanel.length >= 1 && _loadPanel[0] instanceof HTMLElement)) {

                $(_loadPanel).hide();

            }
            else if (window['createjs'] !== undefined && _loadPanel instanceof createjs.DisplayObject) {
                if (window['JT']) {
                    JT.to(_loadPanel, .5, {
                        alpha: 0, onEnd: function () {
                            if (_loadPanel.parent) _loadPanel.parent.removeChild(_loadPanel);
                        }
                    });
                }else{
                    if (_loadPanel.parent) _loadPanel.parent.removeChild(_loadPanel);
                }


            }

        };

        /**
         * 创建dom loading界面
         * @method ds.net.SiteLoadModel.prototype.initDOMLoadPanel
         * @param {function} callBack 创建完成loading界面完成后回调
         */
        this.initDOMLoadPanel = function (callBack) {

            //开始初始化Domloading
            SiteModel.loadPanel = $('#siteLoadPanel');
            SiteModel.loadPanel.show();
            //加载这单页面应用
            if (callBack) callBack();

        };

        /**
         * 创建createjs loading界面
         * @method ds.net.SiteLoadModel.prototype.initCreateJsLoadPanel
         * @param {function} callBack 创建完成loading界面完成后回调
         */
        this.initCreateJsLoadPanel = function (callBack) {

            $('#siteLoadPanel').hide();

            //loading加载配置
            var _loadObj = {
                complete: onComplete
            };

            var _config = SiteModel.cjsLoadData || {};

            _loadObj.basePath = _getDefault(_config.basePath, './assets/');
            _loadObj.jsUrl = _getDefault(_config.jsUrl, 'loading.js');
            _loadObj.jsNS = _getDefault(_config.jsNS, 'loadlib');
            _loadObj.imgNS = _getDefault(_config.imgNS, 'loadimages');
            _loadObj.loadType = _getDefault(_config.loadType, true);
            _loadObj.crossOrigin = _getDefault(_config.crossOrigin, true);
            // console.log('_loadObj:',_loadObj);

            //loading加载完成后的方法处理
            function onComplete(e) {

                // console.log('LoadPanel加载完成');

                if (SiteModel) {
                    //创建加载界面
                    if (_config && _config.className) {
                        SiteModel.loadPanel = new window[_loadObj.jsNS][_config.className]();
                    } else {
                        SiteModel.loadPanel = new loadlib.LoadPanel();
                    }

                    //添加到场景
                    SiteModel.createJsModel.stage.addChild(SiteModel.loadPanel);

                    SiteModel.loadPanel.gotoAndStop(0);

                    SiteModel.resize();

                }

                //loading UI构建完成
                if (callBack) callBack();

            }

            //开始加载loading的资源
            ds.createjs.loadAssets(_loadObj);

        };

        /**
         * 网站站点快速加载cjs的资源方法，
         * @method ds.net.SiteLoadModel.prototype.loadCJS
         * @param {string} url 加载js地址
         * @param {function} complete 加载完成执行方法
         * @param {array|string} progress  加载进度开始与结束点设置
         * - 数组格式 [20,100]
         * - 字符串格式 '20,100'
         * @param {object} opts 加载配置参数，具体参考 {@link ds.createjs.loadAssets}
         * @example
         * SiteModel.loadModel.loadCJS(
         *       'main.js',
         *       function () {
         *           SiteModel.showProgress(100);
         *           initModels();
         *       },
         *        [20, 100],
         *        {basePath: './assets/test/'}
         *   );
         *
         */
        this.loadCJS = function (url, complete, progress, opts) {

            opts = opts || {};
            var _progressArr;
            if (typeof progress === 'string') _progressArr = progress.split(',');
            else if (progress instanceof Array) _progressArr = progress;

            var _start = 0, _end = 100, _speed;

            if (_progressArr) {

                _start = Number(_progressArr[0]);
                _end = Number(_progressArr[1]);

            }

            _speed = _end - _start;

            //加载配置对象
            var _loadData = {
                basePath: _getDefault(opts.basePath, './assets/'),
                jsUrl: url,
                jsNS: _getDefault(opts.jsNS, 'lib'),
                imgNS: _getDefault(opts.imgNS, 'images'),
                loadType: _getDefault(opts.loadType, true),
                crossOrigin: _getDefault(opts.crossOrigin, false),
                otherList: _getDefault(opts.otherList, []),
                complete: function (e) {

                    if (complete) complete();

                },
                progress: function (e) {

                    if (opts.progress) opts.progress(e);

                    SiteModel.showProgress(_start + (_speed * e.target.progress >> 0));

                }

            };

            //开始加载动画资源
            if (ds.createjs) ds.createjs.loadAssets(_loadData);

        };

    }

    function _getDefault(obj, defaultValue) {
        if (obj === undefined || obj === null) return defaultValue;
        if (obj === 'true') return true;
        else if (obj === 'false') return false;
        return obj;
    }

    var ds = root.ds = root.ds || {};
    ds.net = ds.net || {};
    ds.net.SiteLoadModel = SiteLoadModel;


    return ds.net.SiteLoadModel;

}));