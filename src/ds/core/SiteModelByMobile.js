//这个类使用老js方法，有可能直接插入html标签内使用
!(function (factory) {

    var root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);


    if (typeof define === 'function' && define.amd) {

        define(['exports'], function (exports) {

            require('../net/SiteLoadModel');
            module.exports = factory(root, exports);

        });
    } else if (typeof exports !== 'undefined') {

        require('../net/SiteLoadModel');
        module.exports = factory(root, exports);

    } else {

        factory(root);

    }

}(function (root, model) {

    /**
     * 手机H5互动网站基础类
     * @class ds.core.SiteModelByMobile
     * @classdesc  同配合项目模板快速实现手机H5互动网站搭建

     *
     * @param {function|string} loadSPA 传入单页面应用的加载方法 **必传**
     * @param {string} [type='v'] 网站显示类型 只有竖屏 'v' 只有横屏 'h' 横竖屏自动切换 'auto'
     * @param {object} opts  SiteModel模块初始化构建参数
     * @param {string} [opts.screen='#screen'] 进行场景自适应的dom对象
     * @param {boolean} [opts.hasCJS=false] 是否需要createjs框架加载
     * @param {boolean} [opts.hasCJSModel=false] 是否是createjs类型网站，默认创建createjs模块
     * @param {boolean} [opts.hasCJSLoad=false] 是否使用createjs制作loading动画
     * @param {object} [opts.cjsLoadData=undefined] 使用createjs制作loading动画,需要配置修改loading资源时候使用。
     * ```js
     *  {
     *      basePath:"./assets/test/",
     *      jsUrl:'cjsLoad.js',
     *      className:"LoadPanel"
     *      jsNs:'loadlib',
     *      imgNS:'images',
     *  }
     * ```
     * @param {boolean} [opts.hasCJSWebGL=false] 是否使用createjs WebGL
     * @param {string} [opts.cjsBox='#cjsBox'] createjs模块添加什么dom容器内
     * @param {boolean} [opts.hasPixiJs=false] 是否需要pixijs框架加载
     * @param {boolean} [opts.hasPixiJsModel=false] 是否使用pixijs做网站
     * @param {boolean} [opts.hasThreeJs=false] 是否需要threejs框架加载
     * @param {boolean} [opts.hasThreeJsModel=false] 是否需要创建threejs模块
     * @param {string} [opts.threejsBox='#threejsBox'] threejs模块添加到dom容器
     * @param {function} [opts.initLoadPanel=undefined] 自定义创建loading界面,这个函数必须有一个callback函数，在loading界面创建完成后调用
     * @param {function} [opts.showProgress=undefined]  自定loading进度条 带参数 进度0-100
     * @param {function} [opts.hitLoadPanel=undefined]  自定loading进度条隐藏的方法 带参数 callback方法
     * @param {number} [opts.resizeDelay=100]  微信下旋转后自适应响应时间慢，设置合理delay 强制执行一次reisze（特别是load 过程中）
     * @param {object} [opts.audioConfig=undefined]  声音管理器。主要实现功能：默认背景音控制、与音频资源加载管理
     *
     * ```js
     * {
     *   list: [
     *        //声音文件配置
     *       {src:'./media/BGM.mp3',id:'BGM',loop:true,volume:1},
     *   ],
     *   //默认播放声音背景
     *   id: 'BGM',
     *   //这个BMG 绑定的控制的按钮
     *   button: '#BGMBtn'
     * }
     *
     * ```
     * @param {string} [opts.baseUrl='./js/app/base.js'] base.js路径设置
     * @param {string} [opts.cjsUrl='./js/app/createjsFrameWork.js'] createjsFrameWork.js路径设置
     * @param {string} [opts.threeUrl='./js/libs/three.min.js'] three.min.js路径设置
     * @param {string} [opts.pixiUrl='./js/libs/pixijs.min.js'] pixi.min.js路径设置
     * @param {array} [opts.otherjs=undefined] 在网站单页面应用执行前还需要加载js列表
     *
     * @example
     *
     require('ds/core/SiteModelByMobile');

     //网站模块
     window.SiteModel=new ds.core.SiteModelByMobile(loadSPA,'v',{
    //需要createjs框架
    hasCJS:true,
    //需要创建createjs模块
    hasCJSModel:true,
    //不需要createjs loading界面
    hasCJSLoad:false,
    //webgl 双canvas版本 createjs 模块
    hasCJSWebGL:true,
    //配置声音管理器
    audioConfig:{
        list: [
            //背景声音配置
            {src:'./media/BGM.mp3',id:'BGM',loop:true,volume:1},
        ],
        //默认播放声音背景
        id: 'BGM',
        //这个BMG 绑定的控制的按钮
        button: '#BGMBtn'
        }
    });

     //开启网站
     window.SiteModel.start();

     //需要加载单页面应用的js 使用require.ensure载入。
     function loadSPA(){

    require.ensure(
        ['app/AppMain.js'],
        function() {
            require('app/AppMain.js');
        },
        'AppMain'//单页面应用打包的js名称
    );
}
     *
     */
    function SiteModelByMobile(loadSPA, type, opts) {

        if (root.SiteModel) return;

        root.SiteModel = this;

        var _resizeModelType = type || 'v';

        var _self = this;

        opts = opts || {};

        this.cjsLoadData=opts.cjsLoadData;
        /**
         * 默认加载模块
         * @member ds.core.SiteModelByMobile.prototype.loadModel
         * @type {ds.net.SiteLoadModel}
         */
        this.loadModel = new ds.net.SiteLoadModel();

        /**
         * 是否使用createjs做loading
         * @member ds.core.SiteModelByMobile.prototype.isCJSLoad
         * @type {boolean}
         */
        this.isCJSLoad = false;
        if (opts.hasCJSLoad) this.isCJSLoad = true;

        /**
         * loading加载界面
         * @member ds.core.SiteModelByMobile.prototype.loadPanel
         * @type {HTMLElement|createjs.DisplayObject}
         */
        this.loadPanel = null;

        /**
         * 设备信息
         * 判断是否ios 、是否微信、是否pc、是否ipad 等等
         * @member ds.core.SiteModelByMobile.prototype.devicer
         * @type { module:ds/gemo/Devicer }
         */
        this.devicer = require('ds/gemo/Devicer');

        /**
         * 是否微信
         * @member ds.core.SiteModelByMobile.prototype.isWeixin
         * @type { boolean }
         */
        this.isWeixin = this.devicer.isWeixin;


        /**
         * 判断是否ios
         * @member ds.core.SiteModelByMobile.prototype.isIOS
         * @type { boolean }
         */
        this.isIOS = this.devicer.isIOS;

        /**
         * 判断是否手机端
         * @member ds.core.SiteModelByMobile.prototype.isMobile
         * @type { boolean }
         */
        this.isMobile = this.devicer.isMobile;


        var _debug = false;
        //根据端口好判断是不是本地测试
        if (location.href.indexOf(':800') !== -1) _debug = true;

        /**
         * 是否本地测试情况
         * 根据端口好判断是不是本地测试,因为平时开发环境运行后链接地址端口是:800*
         * @member ds.core.SiteModelByMobile.prototype.debug
         * @type {boolean}
         */
        Object.defineProperty(this, "debug", {
            get: function () {
                return _debug;
            },
        });

        /**
         * 声音管理器
         * 在SiteModel.loadBaseFrameWork()加载完成后 在SiteModel.initAudioer()内创建
         * @member ds.core.SiteModelByMobile.prototype.audioer
         * @type {ds.media.AutoAudioManager}
         */
        this.audioer = null;

        /**
         * 自适应管理器模块
         * 在SiteModel.loadBaseFrameWork()加载完成后 在SiteModel.iniResizeModel()内创建
         * @member ds.core.SiteModelByMobile.prototype.resizeModel
         * @type {ds.core.MoblieResizeModel}
         */
        this.resizeModel = null;

        /**
         * 自适应使用的场景对象
         * 在SiteModel.loadBaseFrameWork()加载完成后 在SiteModel.iniResizeModel()内创建
         * @type { $(HTMLElement) }
         */
        this.screen = null;

        /**
         * createJs 模块
         * 在 SiteModel.loadCreateJsFrameWork() 完成后，根据配置参数是否需要createJs 模块 然后开始创建
         * @member ds.core.SiteModelByMobile.prototype.createJsModel
         * @type {ds.createjs.CreatejsModel|ds.createjs.CreatejsGLModel}
         */
        this.createJsModel = null;

        /**
         * pixiJs 模块
         * 在SiteModel.beforeSinglePageApplicationLoadAssets()内按配置需求创建
         * @member ds.core.SiteModelByMobile.prototype.pixiJsModel
         * @type {ds.pixijs.PixiModel}
         */
        this.pixiJsModel = null;

        /**
         * threeJs 模块
         * 在SiteModel.beforeSinglePageApplicationLoadAssets()内按配置需求创建
         * @member ds.core.SiteModelByMobile.prototype.threeJsModel
         * @type {ds.threejs.ThreeJsModel}
         */
        this.threeJsModel = null;


        /**
         * 单页面应用模块(AppMain.js)
         * 在SiteModel.loadSinglePageApplication() (加载AppMain.js）后会执行时候创建
         * @member ds.core.SiteModelByMobile.prototype.appMain
         * @type {*}
         */
        this.appMain = null;

        /**
         * 页面跳转管理器
         * 在SiteModel.loadSinglePageApplication() (加载AppMain.js）后会执行时候创建
         * @member ds.core.SiteModelByMobile.prototype.pager
         * @type {ds.gemo.SitePageManager|*}
         */
        this.pager = null;

        /**
         * 页面跳转方法
         * 在SiteModel.loadSinglePageApplication() (加载AppMain.js）后会执行时候创建
         * @method ds.core.SiteModelByMobile.prototype.gotoPage
         * @param {string} value  需要调整到页面标识
         * @function
         */
        this.gotoPage = function gotoPage(value) {


            if (!_self.pager) return;

            if (_self.pager.pageLabel === value) return;

            _self.pager.gotoPage(value);

            if (ds.net && ds.net.pv) ds.net.pv(value);

        };

        /**
         * 单页面应用接口管理器 APIManager.js
         * 还在单页面应用（AppMain.js）构建时执行时候创建
         * @member ds.core.SiteModelByMobile.prototype.apier
         * @type {*}
         */
        this.apier = null;

        /**
         * 分享模块
         * 还在单页面应用（AppMain.js）构建时执行时候创建
         * @member ds.core.SiteModelByMobile.prototype.shareModel
         * @type {ds.net.ShareModel}
         */
        this.shareModel = null;


        /**
         * 开始是运行站点程序
         * @method ds.core.SiteModelByMobile.prototype.start
         */
        this.start = function () {

            loadBaseFrameWork();
        };

        var _showProgress = opts.showProgress || this.loadModel.showProgress;

        var _hitLoadPanel = opts.hitLoadPanel || this.loadModel.hitLoadPanel;


        /**
         * 创建loading界面  **【受保护内部执行】**
         *
         * 流程顺序
         *  -  opts.hasCJSLoad=false 在SiteModel.loadBaseFrameWork() 加载完成后执行
         *  -  opts.hasCJSLoad=true 在SiteModel.loadCreateJsFrameWork() 加载完成后执行
         *
         *  如果在配置参数内有传入 opts.initLoadPanel，那就使用opts.initLoadPanel来创建loading。
         *  默认会使用SiteModel.loadModel下提供 loading默认界面创建方法
         *  - SiteModel.loadModel.initCreateJsLoadPanel()
         *  - SiteModel.loadModel.initDOMLoadPanel()
         *
         * @access protected
         * @method ds.core.SiteModelByMobile.prototype.initLoadPanel
         */
        function initLoadPanel() {

            var _initLoadPanel;
            if (opts.initLoadPanel) _initLoadPanel = opts.initLoadPanel;
            else if (_self.isCJSLoad) _initLoadPanel = _self.loadModel.initCreateJsLoadPanel;
            else _initLoadPanel = _self.loadModel.initDOMLoadPanel;


            _initLoadPanel(initLoadPanelEnd);

        }

        /**
         * 创建loading界面完成  **【受保护内部执行】**
         * @access protected
         */
        function initLoadPanelEnd() {

            //不需要createjs实现loading界面，但需要createjs框架那就需要在loading界面构建完成后开始加载createjs
            if (!_self.isCJSLoad && opts.hasCJS) {

                _self.showProgress(5);
                loadCreateJsFrameWork();

            }
            //一切准备就绪开始载入单页面应用
            else {

                loadSinglePageApplication();

            }

        }


        /**
         * 现在loading 进度
         * @method ds.core.SiteModelByMobile.prototype.showProgress
         * @param {number} progress 加载进度值 0-100；
         */
        this.showProgress = function (progress) {

            if (_showProgress) _showProgress(progress);

        };

        /**
         * 隐藏loading Panel
         * @method ds.core.SiteModelByMobile.prototype.hitLoadPanel
         * @param {function} callBack 隐藏loading界面完成后回调
         */
        this.hitLoadPanel = function (callBack) {

            if (_hitLoadPanel) _hitLoadPanel(callBack);

        };

        /**
         * 加载单页面应用js  **【受保护内部执行】**
         * 通过入口文件（main.js）配置内传入
         * @access protected
         * @method ds.core.SiteModelByMobile.prototype.loadSinglePageApplication
         */
        function loadSinglePageApplication() {

            _self.showProgress(10);
            if (loadSPA) {

                if (typeof loadSPA === 'string') {

                    _self.getScript(loadSPA, function () {
                        console.log('loadSPA End');
                        /**
                         * 单页面应用加载完成
                         * @event ds.core.SiteModelByMobile#spaEnd
                         */
                        if(_self.ds)_self.ds('spaEnd');
                    });

                } else {

                    loadSPA();

                }

            }
        }


        /**
         * 加载基础框架js  **【受保护内部执行】**
         * 内含 zepto或者jquery、EventDispatcher、MoblieResizeModel、AutoAudioManager
         * - 加载完成基础js后开始创建 `声音管理对象`与`网站自适应对象`
         * - 需要createjs来实现loading，那就执行加载createjs框架`loadCreateJsFrameWork()`
         * - 无需createjs来实现loading，那就执行创建loading `initLoadPanel()`
         * @access protected
         * @method ds.core.SiteModelByMobile.prototype.loadBaseFrameWork
         */
        function loadBaseFrameWork() {

            var _url=opts.baseUrl||'./js/app/base.js';

            _self.getScript(_url, function () {

                console.log('loadBaseFrameWork');

                ds.core.EventDispatcher.extend(_self);

                //初始化背景声音与声音加载对象
                initAudioer();

                iniResizeModel();

                /**
                 * 加载基础框架 完成 $选择器 EventDispatcher 自适应 背景声音播放器
                 * @event ds.core.SiteModelByMobile#baseEnd
                 */
                if(_self.ds)_self.ds('baseEnd');

                //判断是否需要cteatejs的loading，如果需要createjs来实现loading，那就执行加载createjs框架
                if (opts.hasCJS && _self.isCJSLoad) loadCreateJsFrameWork();
                else initLoadPanel();

            });

        }

        /**
         * 加载createjs框架js  **【受保护内部执行】**
         * 加载的js文件内含 createjs框架、ds.createjs扩展
         * @access protected
         * @method ds.core.SiteModelByMobile.prototype.loadCreateJsFrameWork
         */
        function loadCreateJsFrameWork() {

            var _url=opts.cjsUrl||'./js/app/createjsFrameWork.js';

            _self.getScript(_url, function () {

                console.log('loadCreateJsFrameWork');

                /**
                 * createjs框架加载完成
                 * @event ds.core.SiteModelByMobile#createjsEnd
                 */
                if(_self.ds)_self.ds('createjsEnd');

                //如果是createjs类型网站或者需要createjsloading 都需要在initCreateJsModel创建后调用loading
                if (opts.hasCJSModel) initCreateJsModel();

                //开始创建loading
                if (_self.isCJSLoad) initLoadPanel();
                //在加载loadCreateJsFrameWork() 已经创建过 loadPanel了，开始加载单页面应用
                else {

                    loadSinglePageApplication();

                }

            });

        }


        /**
         * 初始化createjs模块创建 **【受保护内部执行】**
         * @access protected
         * @method ds.core.SiteModelByMobile.prototype.initCreateJsModel
         */
        function initCreateJsModel() {

            _self.createJsModel = ds.createjs.create({
                hasGL: opts.hasCJSWebGL,
                appendTo: opts.cjsBox !== undefined ? $(opts.cjsBox) : $('#cjsBox')[0],
                width: 640,
                height: 1140,
                fps: 30
            });
            /**
             * createJsModel模块 构建完成
             * @event ds.core.SiteModelByMobile#cjsModelBuild
             */
            if(_self.ds)_self.ds('cjsModelBuild');

        }

        /**
         * 声音管理模块创建 **【受保护内部执行】**
         * 在SiteModel.loadBaseFrameWork() 后会执行时候创建
         * @access protected
         * @method ds.core.SiteModelByMobile.prototype.initAudioer
         */
        function initAudioer() {

            if (!ds.media || !new ds.media.AutoAudioManager) return;

            _self.audioer = new ds.media.AutoAudioManager();
            if (opts.audioConfig) _self.audioer.initConfigData(opts.audioConfig);

        }

        /**
         * 自适应缩放场景管理模块创建 **【受保护内部执行】**
         * 在SiteModel.loadBaseFrameWork() 后会执行时候创建
         * @access protected
         * @method ds.core.SiteModelByMobile.prototype.iniResizeModel
         */
        function iniResizeModel() {

            var _screen = opts.screen || '#screen';

            _self.screen = $(_screen);

            _self.resizeModel = new ds.core.MoblieResizeModel({
                screen: _self.screen[0],
                type: _resizeModelType,
                delay:opts.resizeDelay||100
            });

            //进行提示浮动层显示
            if(_self.resizeModel.type!=='auto')_self.resizeModel.createOrientationTip();


            //监听场景自适应
            _self.resizeModel.on('resize', _resize);

            //开始进行初始化场景自适应
            _self.resizeModel.initResize();

            //loading也在场景内，loading缩放问题得到解决
            _self.screen.show();

        }

        //自适应计算
        function _resize() {

            //对cteatejs模块进行横竖屏幕下缩放计算控制
            if (_self.resizeModel.type === 'auto') {

                if (_self.createJsModel) {

                    if (_self.resizeModel.screenWidth === 640) _self.createJsModel.size(_self.resizeModel.screenWidth, 1140);
                    else _self.createJsModel.size(_self.resizeModel.screenWidth, 640);

                }

            }

            //避免进入输入框状态后，整体页面上移动
            if (!_self.resizeModel.isInputState) setTimeout(function () {
                _self.screen.scrollTop(0);
            }, 30);

        }


        /**
         * 初始化pixijs模块创建 **【受保护内部执行】**
         * @access protected
         * @method ds.core.SiteModelByMobile.prototype.initPixiJsModel
         */
        function initPixiJsModel() {

            if (ds.pixijs && ds.pixijs.create){

                _self.pixiJsModel = ds.pixijs.create({
                    appendTo: $('#pixiBox')[0],
                    width: 640,
                    height: 1140,
                    fps: 30
                });

                //是否实时进行刷新dom与显示对象之间关系
                ds.pixijs.domAuto = true;

                /**
                 * pixiJsModelBuild模块 构建完成
                 * @event ds.core.SiteModelByMobile#pixiJsModelBuild
                 */
                if(_self.ds)_self.ds('pixiJsModelBuild');
            }


        }


        /**
         * 初始化threejs模块创建 **【受保护内部执行】**
         * @access protected
         * @method ds.core.SiteModelByMobile.prototype.initThreeJsModel
         *
         */
        function initThreeJsModel() {

            if (ds.threejs && ds.threejs.create) {

                SiteModel.threeJsModel = ds.threejs.create({
                    width: 640,
                    height: 1140,
                    resizeType: 'fixed2',
                    hasModelAnimate: true,
                    intersect: true,
                    intersectDom: opts.threejsBox,
                    appendTo: opts.threejsBox !== undefined ? $(opts.threejsBox) : $('#threejsBox')[0],
                });

                /**
                 * threeJsModelBuild模块 构建完成
                 * @event ds.core.SiteModelByMobile#threeJsModelBuild
                 */
                if(_self.ds)_self.ds('threeJsModelBuild');
            }

        }


        /**
         * 在AppMain.js 开始执行loadAssets之前执行。
         * 这里会根据项目配置情况，按需是否创建pixijs或者threejs的模块。或者其他事情
         * @param {function} callback 传入是AppMain.js的loadAssets方法，
         * @method ds.core.SiteModelByMobile.prototype.beforeSinglePageApplicationLoadAssets
         */
        this.beforeSinglePageApplicationLoadAssets = function (callback) {

            console.log('before SAP LoadAssets Start');

            var _other=[];
            var _url;

            if (opts.hasThreeJs || opts.hasThreeJsModel){
                _url =opts.threeUrl||'./js/libs/three.min.js';
                _other.push(_url);
            }

            if (opts.hasPixiJs || opts.hasPixiJsModel){
                _url=opts.pixiUrl||'./js/libs/pixijs.min.js';
                _other.push(_url);
            }

            if(opts.otherjs&&opts.otherjs.length>=0){
                var _arr=opts.otherjs;
                for (var i = 0; i < _arr.length; i++) {
                    _url = _arr[i];
                    _other.push(_url);
                }
            }

            /**
             * 开始加载其他需要的js文件（spa 在加载资源与initModel前执行）
             * @event ds.core.SiteModelByMobile#otherJsStart
             */
            if(_self.ds)_self.ds('otherJsStart');

            _self.getScriptList(_other,function () {

                if(opts.hasPixiJsModel)initPixiJsModel();
                if(opts.hasThreeJsModel)initThreeJsModel();

                /**
                 * 加载其他需要的js文件完成
                 * @event ds.core.SiteModelByMobile#otherJsEnd
                 */
                if(_self.ds)_self.ds('otherJsEnd');

                if(callback)callback();

            });


        };


        /**
         * 网站执行自适应viewport与场景容器dom scale
         * @method ds.core.SiteModelByMobile.prototype.resize
         */
        this.resize = function () {

            if (this.resizeModel) this.resizeModel.resize();

        };

        /**
         * 网站加载其他需要的js，把加载的js嵌入到HTML页面'head'标签内
         * @param {string} src js代码路径
         * @param {function} complete js加载完成后执行方法
         * @method ds.core.SiteModelByMobile.prototype.getScript
         */
        this.getScript = function (src, complete) {

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

        };
        /**
         * 加载插入js列表
         * @param {array} list 加载js列表数组
         * @param {funtion} complete 加载完成后执行的方法回调
         */
        this.getScriptList=function (list,complete) {

            if(!list||list.length<=0){
                if(complete)complete();
                return;
            }

            var _index=-1;
            function load() {

                _index++;
                if(_index>=list.length){
                    if(complete)complete();
                    return;
                }

                var _url=list[_index];
                _self.getScript(_url,load);

            }

            load();

        };

        //锁定滑动页面
        document.addEventListener('touchmove', function (e) {

            if (e.cancelable) {

                if (!e.defaultPrevented) e.preventDefault();

            }

        }, false);

    }

    var ds = root.ds = root.ds || {};
    ds.core = ds.core || {};
    ds.core.SiteModelByMobile = SiteModelByMobile;


    return ds.core.SiteModelByMobile;
}));