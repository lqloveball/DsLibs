import EventDispatcher from '../core/EventDispatcher';


const _resizeEvent = Symbol("_resizeEvent");
const _documentMouseMoveEvent = Symbol("_documentMouseMoveEvent");
const _animateFrame = Symbol("_animateFrame");

/**
 * 快速创建threejs 3D模块
 * @class
 * @classdesc 构建threejs 3D模块
 * > 需要第三方js模块需要自行`require`。建议把 `https://github.com/mrdoob/three.js/tree/dev/examples/js` 下第三方支持模块代码copy到 `src/threejs/` 目录下
 * @memberof ds.threejs
 * @requires  require('ds/threejs/index.js');
 * @example
 *
 * require('ds/threejs/index.js');
 *
 * let _threejsModel = new ThreeJsModel({
 *       appendTo:'#threejsBox',
 *       width:640,
 *       height:1140,
 *       resizeType:'fixed2',
 *       hasModelAnimate:false,
 * });
 *
 * //内存 cpu信息监测模块
 * window.Stats=require('threejs/libs/stats.min.js');
 * //控制器模块
 * require('threejs/controls/OrbitControls.js');
 *
 *  _threejsModel.createControls();
 *  _threejsModel.createStats();
 *
 *  //创建测试显示3d元素
 *  _threejsModel.createTestBox();

 *
 */
class ThreeJsModel extends EventDispatcher {

    /**
     * 构建threejs 3D模块
     * @param {object} opts 配置参数
     * @param {number} [opts.width=window.innerWidth] 场景宽
     * @param {number} [opts.height=window.innerHeight] 场景高
     * @param {boolean} [opts.alpha=true] 支持透明度
     * @param {string} [opts.clearColor="#000000"] 清空画布使用填充色彩
     * @param {boolean} [opts.sortObjects=true] 透明元素排序
     * @param {boolean} [opts.autoClear=true] 自动清空画布
     * @param {string|HTMLElement} [opts.appendTo=undefined] canvas添加到dom容器
     * @param {number} [opts.cameraFov=60] 摄像机视角
     * @param {number} [opts.cameraNear=1] 摄像机近视角
     * @param {number} [opts.cameraFar=100000] 摄像机最远视距
     * @param {object} [opts.cameraPosition={x: 0,y: 0, z: 500}] 摄像机位置坐标
     * @param {object} [opts.cameraUp= {x: 0, y: 1, z: 0}] 摄像机镜头方向
     * @param {boolean} [opts.intersect=true] 是否支持交互
     * @param {boolean} [opts.hasModelAnimate=true] 是否拥有模型动画渲染
     * @param {string} [opts.resizeType='window'] 自适应类型 'window' 'fixed' 'fixed2'
     * @param {boolean} [opts.hasResize=true] 是否要自适应计算
     * @param {boolean} [opts.adapterCameraFov =true] 需要自动计算摄像机视角适合等比显示适配
     * @param {CanvasElement} [opts.canvas=undefined] 一个canvas对象
     */
    constructor(opts) {

        super();

        opts = opts || {};

        let _width = opts.width || window.innerWidth;
        let _height = opts.height || window.innerHeight;

        /**
         * 3d场景宽
         * @type {number}
         */
        this.width = _width;
        /**
         * 3d场景高
         * @type {number}
         */
        this.height = _height;

        let _render = new THREE.WebGLRenderer({
            canvas: opts.canvas ? opts.canvas : document.createElement("canvas"),
            alpha: opts.alpha !== undefined ? opts.alpha : true,
            antialias: opts.antialias !== undefined ? opts.antialias : true,

        });

        this.canvas = _render.domElement;

        /**
         * 渲染对象
         * @type {WebGLRenderer}
         */
        this.render = _render;

        // 设置size
        _render.setSize(_width, _height);

        // 设置canvas背景色(clearColor,alpha);
        let _clearColor = opts.clearColor || "#000000";
        // let _clearAlpha = opts.clearAlpha !== undefined ? opts.clearAlpha : 0;
        _render.setClearColor(_clearColor, 0);

        let _devicePixelRatio = opts.devicePixelRatio || (window.devicePixelRatio ? window.devicePixelRatio : 2);
        _render.setPixelRatio(_devicePixelRatio);

        // 正确地渲染具有一定程度的透明度的对象。排序算法
        let _sortObjects = opts.sortObjects !== undefined ? opts.sortObjects : true;
        _render.sortObjects = _sortObjects;

        // 自动清空背景色
        let _autoClear = opts.autoClear !== undefined ? opts.autoClear : true;
        _render.autoClear = _autoClear;

        // 添加到dom中
        if (opts.appendTo) {

            $(opts.appendTo).append(_render.domElement);

        }

        // 创建场景
        let _screen = new THREE.Scene();
        /**
         * 场景对象
         * @type {THREE.Scene}
         */
        this.screen = _screen;


        //  创建相机
        //摄像机垂直视角
        let _cameraFov = opts.cameraFov || 45;
        //摄像机垂直视角
        let _cameraNear = opts.cameraNear !== undefined ? opts.cameraNear : 1;
        //摄像机最远视距
        let _cameraFar = opts.cameraFar || 100000;

        let _camera = new THREE.PerspectiveCamera(_cameraFov, _width / _height, _cameraNear, _cameraFar);
        /**
         * 自动计算摄像机视角适合等比显示适配
         * @type {boolean}
         */
        this.adapterCameraFov = opts.adapterCameraFov !== undefined ? opts.adapterCameraFov : true;

        /**
         * 相机对象
         * @type {THREE.PerspectiveCamera}
         */
        this.camera = _camera;

        let _cameraPosition = opts.cameraPosition || {
            x: 0,
            y: 0,
            z: 500
        };
        //设置相机的位置坐标
        _camera.position.x = _cameraPosition.x;
        //设置相机的位置坐标
        _camera.position.y = _cameraPosition.y;
        //设置相机的位置坐标
        _camera.position.z = _cameraPosition.z;

        var _cameraUp = opts.cameraUp || {x: 0, y: 1, z: 0};
        //设置相机的上为「x」轴方向
        _camera.up.x = _cameraUp.x;
        //设置相机的上为「y」轴方向
        _camera.up.y = _cameraUp.y;
        //设置相机的上为「z」轴方向
        _camera.up.z = _cameraUp.z;
        //设置视野的中心坐标
        _camera.lookAt(_screen.position);


        /**
         * 是否可以交互监测
         * @type {boolean}
         * @default true
         */
        this.intersect = opts.intersect !== undefined ? opts.intersect : true;

        let _intersectDom = opts.intersectDom != undefined ? $(opts.intersectDom) : _render.domElement;


        this.intersectDom = _intersectDom;

        /**
         * 交互触发器
         * @type {THREE.Raycaster}
         */
        this.raycaster = new THREE.Raycaster();

        /**
         * 鼠标模拟交互点
         * @type {THREE.Vector2}
         * @private
         */
        this._mouse = new THREE.Vector2();


        this._intersectObjects = [];

        /**
         * 是否拥有模型动画渲染
         * @type {boolean}
         * @default true
         */
        this.hasModelAnimate = opts.hasModelAnimate !== undefined ? opts.hasModelAnimate : true;

        //three 时钟对象
        this._clock = new THREE.Clock();


        /**
         * 自适应类型
         *  - window 默认，按window宽高自适应
         *  - fixed 固定宽640，根据实际高自适应
         *  - fixed2 按缩放框架 实际宽高自适应
         * @type {string}
         * @default 'window'
         */
        this.resizeType = opts.resizeType !== undefined ? opts.resizeType : 'window';


        /**
         * 是否要自适应,固定不自适应的话可以锁死
         * @type {boolean}
         * @default true
         */
        this.hasResize = opts.hasResize !== undefined ? opts.hasResize : true;

        //开始计算自适应
        this.initReizeEvent();

        //开始渲染
        this[_animateFrame] = animateFrame.bind(this);
        // this[_animateFrame]();
        /**
         * 渲染是否暂停，默认值是不暂停渲染
         * @member {boolean}
         * @default false
         */
        this.pause = false;


    }

    /**
     * 添加一个交互对象
     * @param obj
     */
    addIntersectObject(obj) {
        if (this._intersectObjects.indexOf(obj) === -1) this._intersectObjects.push(obj);
    }

    /**
     * 删除一个交互对象
     * @param obj
     */
    removeIntersectObject(obj) {
        if (this._intersectObjects.indexOf(obj) !== -1) {
            for (let i = 0; i < this._intersectObjects.length; i++) {
                if (this._intersectObjects[i] === obj) {
                    this._intersectObjects.splice(i, 1);
                    return;
                }
            }
        }
    }

    /**
     * 交互对象列表
     * @type {Array}
     */
    get intersectObjects() {
        return this._intersectObjects.concat();
    }

    /**
     * 暂定渲染
     * @return {*}
     */
    get pause() {
        return this._pause;
    }

    set pause(bool) {
        if (this._pause === bool) return;
        this._pause = bool;
        if (!this._pause) this[_animateFrame]();
    }

    /**
     * 设置交互方式触发的dom对象，默认会使用renderer.domElement
     * @type {jQuery|HTMLElement}
     */
    get intersectDom() {
        return this._intersectDom;
    }


    set intersectDom(value) {

        if (this._intersectDom) {

            this._intersectDom.off('mousemove', this[_documentMouseMoveEvent]);
            this._intersectDom.off('touchmove', this[_documentMouseMoveEvent]);
            this._intersectDom.off('touchstart', this[_documentMouseMoveEvent]);

        }

        this[_documentMouseMoveEvent] = documentMouseMoveEvent.bind(this);
        this._intersectDom = $(value);
        this._intersectDom.on('mousemove', this[_documentMouseMoveEvent]);
        this._intersectDom.on('touchmove', this[_documentMouseMoveEvent]);
        this._intersectDom.on('touchstart', this[_documentMouseMoveEvent]);


    }

    /**
     * 创建一个控制器，方便调试时候使用
     * @requires require('threejs/controls/OrbitControls.js')
     */
    createControls(dom) {

        if (!THREE.OrbitControls) {

            console.warn('no has THREE.OrbitControls');
            return;

        }

        if (this.controls) return;

        console.log('createControls');
        let _dom=dom!==undefined?$(dom)[0]:this.render.domElement;
        /**
         * 镜头控制器
         * @type {THREE.OrbitControls}
         */
        this.controls = new THREE.OrbitControls(this.camera, _dom);
        // this.controls = new THREE.OrbitControls(this.camera, $('body')[0]);

    }

    /**
     * 摧毁控制器
     */
    disposeControls() {

        if (!this.controls) return;

        console.log('disposeControls');
        this.controls.dispose();

        this.controls = null;

    }

    /**
     * 显示状态监测器
     * @requires window.Stats=require('threejs/libs/stats.min.js');
     */
    showStats() {

        if (this.stats) {

            $(this.stats.dom).show();
            return;

        }

        console.log('createStats');

        try {

            //创建状态器
            this.stats = new Stats();
            //添加到dom列表
            $('body').append(this.stats.dom);


        }
        catch (error) {
            console.warn(error);
        }

    }

    /**
     * 隐藏状态监测器
     */
    hideStates() {

        if (!this.stats) return;
        $(this.stats.dom).hide();
    }


    /**
     * 创建一个测试盒子
     */
    createTestBox() {

        let _geometry = new THREE.TorusKnotGeometry(40, 10, 10, 10);
        let _material = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            wireframe: true
        });

        let _torusKnot = new THREE.Mesh(_geometry, _material);
        this.screen.add(_torusKnot);

        _geometry = new THREE.BoxGeometry(150, 150, 150);
        _material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        let _cube = new THREE.Mesh(_geometry, _material);

        this.screen.add(_cube);
    }


    /**
     * 初始化自适应
     */
    initReizeEvent() {

        if (this[_resizeEvent]) return;

        this[_resizeEvent] = resizeEvent.bind(this);

        if (SiteModel && SiteModel.resizeModel) {

            SiteModel.resizeModel.on('resize', this[_resizeEvent]);

        }
        else {

            $(window).resize(function () {
                this[_resizeEvent]();
            });

        }

        this[_resizeEvent]();

    }


    /**
     * 交互事件判断
     * @private
     */
    _intersectUpDate() {

        if (!this.render) return;
        if (this.pause) return;
        if (!this.intersect) return;
        // console.log(this._mouse);
        this.raycaster.setFromCamera(this._mouse, this.camera);

        let _intersects = this.raycaster.intersectObjects(this.intersectObjects);

        /**
         * 鼠标交互相交点
         * @event ds.threejs.ThreeJsModel#intersects
         * @property {array} intersects - 相交的对象列表
         * @example
         *  var _intersectObject;
         *  _ThreeJsModel.on('intersects', function (e) {
         *       var _intersects = e.intersects;
         *       if (_intersects.length > 0) {
         *           _intersectObject = _intersects[0].object;
         *       } else {
         *           _intersectObject = null;
         *       }
         *   });
         */
        this.ds({
            type: "intersects",
            intersects: _intersects
        });

        // if (_intersects.length > 0) this.render.domElement.style.cursor = 'pointer';
        // else this.render.domElement.style.cursor = 'auto';


    }

    /**
     * 模型动画渲染
     * @private
     */
    _modelAnimateUpDate() {

        if (!this.render) return;
        if (this.pause) return;

        let _delta = this._clock.getDelta();

        //有SEA的时候使用
        try {

            if (THREE.SEA3D && THREE.SEA3D.AnimationHandler) THREE.SEA3D.AnimationHandler.update(_delta);

        } catch (error) {

        }


    }

    /**
     * 场景渲染
     * @private
     */
    _renderUpDate() {

        if (!this.render) return;
        if (this.pause) return;

        //刷新场景
        this.render.render(this.screen, this.camera);

        if (!this._updateEvent) this._updateEvent = {type: 'update'};
        /**
         * 场景渲染
         * @event ds.threejs.ThreeJsModel#update
         */
        this.ds(this._updateEvent);

    }

    /**
     *
     * 计算相机 fov 的值能确保，物件在坐标000点时候 显示像素尺寸与实际尺寸匹配
     * 显示对象等比，屏幕适配
     * {@link https://segmentfault.com/a/1190000008796468}
     * @param {number} d  在相机前方 d 距离
     * @param {number} w  想要看到最大正方形区域边长为 w
     * @param {number} r  屏幕宽高比
     */
    adapterFov(d, w, r) {

        let f;
        let vertical = w;
        if (r < 1) {
            vertical = vertical / r;
        }
        f = Math.atan(vertical / d / 2) * 2 * (180 / Math.PI);
        return f;

    }

}

function animateFrame() {

    // console.log('ThreeJsModel animateFrame',this);

    if (!this.render) return;
    if (this.pause) return;
    //ThreeJs 帧渲染
    requestAnimationFrame(this[_animateFrame]);

    if (!this._beforeUpdateEvent) this._beforeUpdateEvent = {type: 'beforeUpdate'};
    /**
     * 渲染前
     * @event ds.threejs.ThreeJsModel#beforeUpdate
     */
    this.ds(this._beforeUpdateEvent);

    //交互事件
    if (this.intersect) this._intersectUpDate();

    //模型动画渲染
    if (this.hasModelAnimate) this._modelAnimateUpDate();

    //渲染 场景 相机
    this._renderUpDate();


    if (!this._afterUpdateEvent) this._afterUpdateEvent = {type: 'afterUpdate'};
    /**
     * 渲染后
     * @event ds.threejs.ThreeJsModel#afterUpdate
     */
    this.ds(this._afterUpdateEvent);


    //状态
    if (this.stats) this.stats.update();


}

function documentMouseMoveEvent(e) {


    if (!this.intersect) return;
    // e.preventDefault();

    if (e.type !== 'touchmove' && e.type !== 'touchstart') {

        this._mouse.x = (e.clientX / (this.width || window.innerWidth)) * 2 - 1;
        this._mouse.y = -(e.clientY / (this.height || window.innerHeight) ) * 2 + 1;

    } else {

        let _targetTouches = e.targetTouches || e.originalEvent.targetTouches;
        let _touch = _targetTouches[0];
        this._mouse.x = (_touch.clientX / (this.width || window.innerWidth)) * 2 - 1;
        this._mouse.y = -(_touch.clientY / (this.height || window.innerHeight)) * 2 + 1;

    }

}


function resizeEvent() {

    let _width = window.innerWidth;
    let _height = window.innerHeight;

    if (!this.hasResize) return;

    let _camera = this.camera;
    let _renderer = this.render;

    // console.log('resizeEvent:',this.resizeType);

    if (SiteModel && SiteModel.resizeModel) {

        let _resizeModel = SiteModel.resizeModel;
        let _actualH = _resizeModel.actualH;
        let _pageScale = _resizeModel.pageScale;
        let _isInputState = _resizeModel.isInputState;
        let _horizontal = _resizeModel.horizontal;
        let _screenWidth = _resizeModel.screenWidth;
        let _densityDpi = _resizeModel.densityDpi;

        if (this.resizeType == 'fixed') {

            _width = 640;
            _height = _actualH;

        }
        else if (this.resizeType == 'fixed2') {

            _width = _screenWidth;
            _height = _actualH;

        }


    }

    this.width = _width;
    this.height = _height;
    if (this.adapterCameraFov) _camera.fov = this.adapterFov(_camera.position.z, _width, _width / _height);
    _camera.aspect = _width / _height;
    _camera.updateProjectionMatrix();
    _renderer.setSize(_width, _height);


}

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
ds.threejs = ds.threejs || {};

ds.threejs.ThreeJsModel = ThreeJsModel;

export default ThreeJsModel;