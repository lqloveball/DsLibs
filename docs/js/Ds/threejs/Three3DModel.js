/**
 * @class root.Ds.threejs.Three3DModel
 * @classdesc:快速创建3D交互空间
 * @param {[Object]} opts [初始化参数]
 * opts.init 是否初始化引擎，false的话需要手动运行Init3DEngine();
 * opts.width 没必要 目前其实作用不大
 * opts.height 没必要 目前其实作用不大
 * opts.alpha 设置_Renderer的alpha 默认是可以透明
 * opts.antialias 设置_Renderer的antialias
 * opts.clearColor 设置canvas背景色默认"#000000"
 * opts.clearAlpha 设置canvas背景色通明度 默认0;
 * opts.devicePixelRatio 设置渲染的精度
 * opts.sortObjects 设置透明物体排序 默认false
 * opts.autoClear 设置是否清空背景色 默认true
 * opts.appendTo 设置添加到dom什么的位置
 * opts.cameraFov 设置相机视角 默认60
 * opts.cameraNear 设置相机垂直视角 默认1
 * opts.cameraFar 设置相机最远视角长度 默认100000
 * opts.cameraPosition 设置相机位置
 * opts.cameraUp 设置相机up
 * opts.hasControls 是否有控制器 默认true
 * opts.hasIntersect 是否支持交互 默认false
 * opts.intersectDom 鼠标交互使用dom对象
 * opts.hasAnimateUpdate 是否支持动画渲染 默认true
 * opts.resizeEvent 是否开启监听resize 默认true
 * opts.addDebugBox 开启默认初始化场景有一个测试方盒子
 * opts.isActive 是否激活渲染 默认true
 * opts.resizeType    默认值window   3d场景自适应方式，参数值fixed使用固定方式640*实际高.  fixed2 自适应横竖屏幕，window 使用window.innerWidth window.innerHeight
 *
 * @extends 需要支持库
 * THREE = require('threejs/three.js');
 * Stats = require('threejs/stats.min.js');
 * require('threejs/Detector.js');
 *
 * require('threejs/renderers/Projector.js');
 * require('threejs/utils/GeometryUtils.js');
 *
 * require('threejs/controls/OrbitControls.js'); // 控制器
 * require('threejs/loaders/OBJLoader.js'); //基础OBJLoader
 *
 * @example:
 *
   var _Three3DModel=new Ds.threejs.Three3DModel({
     appendTo:'#threeBox'
   });
   var _Scene=_Three3DModel.Scene;
   var _Camera=_Three3DModel.Camera;
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright: Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
(function(factory) {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);

    if (typeof define === 'function' && define.amd) {
        define(['exports'], function(exports) {
            module.exports = factory(root, exports);
        });
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(root, exports);
    } else {
        factory(root, {});
    }

}(function(root, modelObj) {
    root.Ds = root.Ds || {};
    root.Ds.threejs = root.Ds.threejs || {};
    root.Ds.threejs.Three3DModel = Three3DModel;

    function Three3DModel(opts) {
        opts = opts || {
            init: true
        };
        //this 指向定位
        var _Self = this;
        //继承事件
        Ds.Extend(this, new Ds.EventDispatcher());
        // 场景
        var _Scene;
        Object.defineProperty(this, "Scene", {
            get: function() {
                return _Scene;
            },
        });
        // 渲染对象
        var _Renderer;
        Object.defineProperty(this, "Renderer", {
            get: function() {
                return _Renderer;
            },
        });
        // 相机
        var _Camera;
        Object.defineProperty(this, "Camera", {
            get: function() {
                return _Camera;
            },
        });
        // 控制器
        var _Controls;
        Object.defineProperty(this, "Controls", {
            get: function() {
                return _Controls;
            },
        });
        // 交互触发器
        var _Raycaster = new THREE.Raycaster();
        Object.defineProperty(this, "Raycaster", {
            get: function() {
                return _Raycaster;
            },
        });
        // 鼠标模拟
        var _Mouse = new THREE.Vector2();
        Object.defineProperty(this, "Mouse", {
            get: function() {
                return _Mouse;
            },
        });
        // 交互对象列表
        var _IntersectObjects = [];
        Object.defineProperty(this, "IntersectObjects", {
            get: function() {
                return _IntersectObjects;
            },
        });
        //3d场景自适应方式，参数值fixed使用固定方式640*实际高.  fixed2 自适应横竖屏幕，window 使用window.innerWidth window.innerHeight
        var _ReSizeType = 'window';
        Object.defineProperty(this, "ReSizeType", {
            get: function() {
                return _ReSizeType;
            },
            set: function(value) {
                if (_ReSizeType === value) return;
                _ReSizeType = value;
                ReSize();
            }
        });
        // 是否激活渲染
        var _IsActiveRendererUpdate = false;
        Object.defineProperty(this, "IsActiveRendererUpdate", {
            get: function() {
                return _IsActiveRendererUpdate;
            },
            set: function(value) {
                if (_IsActiveRendererUpdate === value) return;
                _IsActiveRendererUpdate = value;
                // console.log('IsActiveRendererUpdate:',_IsActiveRendererUpdate);
                if (_IsActiveRendererUpdate) ThreeJsAnimateFrame();
            }
        });
        //FPS状态
        var _Stats;
        Object.defineProperty(this, "Stats", {
            get: function() {
                return _Stats;
            },
        });

        //three 时间函数
        var _Clock = new THREE.Clock();
        Object.defineProperty(this, "Clock", {
            get: function() {
                return _Clock;
            },
        });

        //是否拥有交互对象
        var _HasIntersect = false;
        Object.defineProperty(this, "HasIntersect", {
            get: function() {
                return _HasIntersect;
            },
            set: function(value) {
                if (_HasIntersect === value) return;
                _HasIntersect = value;
            }
        });
        //交互的dom对象
        var _IntersectDom;
        Object.defineProperty(this, "IntersectDom", {
            get: function() {
                return _IntersectDom;
            },
            set: function(value) {
                if (_IntersectDom === value) return;
                if (_IntersectDom) {
                    _IntersectDom.removeEventListener('mousemove', DocumentMouseMoveEvent);
                    _IntersectDom.removeEventListener('touchmove', DocumentMouseMoveEvent);
                }
                _IntersectDom = value;
                if (_IntersectDom) {
                    _IntersectDom.addEventListener('mousemove', DocumentMouseMoveEvent, false);
                    _IntersectDom.addEventListener('touchmove', DocumentMouseMoveEvent, false);
                }
            }
        });


        /**
         * 初始化激活引擎
         * @param {[Object]} opts [description]
         */
        function Init3DEngine(opts) {
            var _width = opts.width || window.innerWidth,
                _height = opts.height || window.innerHeight;

            // 创建渲染器
            _Renderer = new THREE.WebGLRenderer({
                alpha: opts.alpha !== undefined ? opts.alpha : true,
                antialias: opts.antialias !== undefined ? opts.antialias : true,
            });
            // 设置size
            _Renderer.setSize(_width, _height);
            // 设置canvas背景色(clearColor,alpha);
            var _clearColor = opts.clearColor || "#000000";
            var _clearAlpha = opts.clearAlpha !== undefined ? opts.clearAlpha : 0;
            _Renderer.setClearColor(_clearColor, 0);
            var _devicePixelRatio = opts.devicePixelRatio || window.devicePixelRatio;
            _Renderer.setPixelRatio(window.devicePixelRatio); //渲染的清晰度

            // 排序是用来试图 正确地渲染具有一定程度的透明度的对象。
            var _sortObjects = opts.sortObjects !== undefined ? opts.sortObjects : false;
            _Renderer.sortObjects = _sortObjects;
            // 自动清空背景色
            var _autoClear = opts.autoClear !== undefined ? opts.autoClear : true;
            _Renderer.autoClear = _autoClear;

            // 创建场景
            _Scene = new THREE.Scene();
            // 添加到dom中
            if (opts.appendTo) $(opts.appendTo).append(_Renderer.domElement);

            //  创建相机
            var _cameraFov = opts.cameraFov || 60; //摄像机垂直视角
            var _cameraNear = opts.cameraNear !== undefined ? opts.cameraNear : 1; //摄像机垂直视角
            var _cameraFar = opts.cameraFar || 100000; //摄像机最远视距
            _Camera = new THREE.PerspectiveCamera(_cameraFov, _width / _height, _cameraNear, _cameraFar);
            var _cameraPosition = opts.cameraPosition || {
                x: 0,
                y: 0,
                z: 500
            }; //摄像机定位
            _Camera.position.x = _cameraPosition.x; //设置相机的位置坐标
            _Camera.position.y = _cameraPosition.y; //设置相机的位置坐标
            _Camera.position.z = _cameraPosition.z; //设置相机的位置坐标
            var _cameraUp = opts.cameraUp || {
                x: 0,
                y: 1,
                z: 0
            }; //摄像机定位
            _Camera.up.x = _cameraUp.x; //设置相机的上为「x」轴方向
            _Camera.up.y = _cameraUp.y; //设置相机的上为「y」轴方向
            _Camera.up.z = _cameraUp.z; //设置相机的上为「z」轴方向
            _Camera.lookAt(_Scene.position); //设置视野的中心坐标
            _Scene.add(_Camera);

            // 是否拥有控制器
            var _hasControls = opts.hasControls !== undefined ? opts.hasControls : true;
            if (_hasControls) {
                _Controls = new THREE.OrbitControls(_Camera, $('body')[0]);
                // _Controls.minDistance=0;
                // _Controls.maxDistance=1000;
                // _Controls.minPolarAngle=Math.PI/180*40;
                // _Controls.maxPolarAngle=Math.PI/180*90;
            }


            //鼠标交互点
            _HasIntersect = opts.hasIntersect !== undefined ? opts.hasControls : false;
            //鼠标交互对象
            _IntersectDom = opts.intersectDom || _Renderer.domElement;
            if (_IntersectDom) {
                // _Renderer.domElement.addEventListener('mousemove', DocumentMouseMoveEvent);
                _IntersectDom.addEventListener('mousemove', DocumentMouseMoveEvent, false);
                _IntersectDom.addEventListener('touchmove', DocumentMouseMoveEvent, false);
            }
            //是否有动画渲染
            _HasAnimateUpdate = opts.hasAnimateUpdate !== undefined ? opts.hasAnimateUpdate : true;

            //自适应类型
            _ReSizeType=opts.resizeType!== undefined ? opts.resizeType : 'window';
            //自适应
            var _hasResize = opts.resizeEvent !== undefined ? opts.resizeEvent : true;
            if (_hasResize) {
                _Self.InitSiteResizeModelReSize();
            } else {
                ReSize();
            }
            if (opts.addDebugBox || opts.addDebugBox === undefined) {
                _Self.AddInitDebugBox();
            }

            //帧渲染开始
            _IsActiveRendererUpdate = opts.isActive !== undefined ? opts.isActive : true;
            if (_IsActiveRendererUpdate) ThreeJsAnimateFrame();
        }
        this.Init3DEngine = Init3DEngine;

        //鼠标事件
        function DocumentMouseMoveEvent(event) {
            if (!_HasIntersect) return;
            event.preventDefault();
            // log('DocumentMouseMoveEvent')
            _Mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            _Mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }

        /**
         * 初始化FPS状态
         */
        this.InitStats = function() {
            if (_Stats) return;
            _Stats = new Stats(); //创建状态
            $('body').append(_Stats.dom); //添加到dom列表
        };

        /**
         * ThreeJs 帧渲染 Frame Animate
         */
        function ThreeJsAnimateFrame() {
            if (!_Renderer) return;
            if (!_IsActiveRendererUpdate) return;
            //ThreeJs 帧渲染
            requestAnimationFrame(ThreeJsAnimateFrame);
            //事件
            _Self.ds('beforeUpdate');
            //交互事件
            if (_HasIntersect) UpDateIntersectObjects();
            //动画渲染
            if (_HasAnimateUpdate) UpdateAnimate();
            //渲染 场景 相机
            ThreeJsRender();
            //事件
            _Self.ds('afterUpdate');
            //状态
            if (_Stats) _Stats.update();
        }

        /**
         * 交互事件update
         */
        function UpDateIntersectObjects() {
            if (!_Renderer) return;
            if (!_IsActiveRendererUpdate) return;
            if (!_HasIntersect) return;
            _Raycaster.setFromCamera(_Mouse, _Camera);
            var _intersects = _Raycaster.intersectObjects(_IntersectObjects);
            if (_intersects.length > 0) {
                _Renderer.domElement.style.cursor = 'pointer';
            } else {
                _Renderer.domElement.style.cursor = 'auto';
            }
        }
        /**
         * 动画渲染
         */
        function UpdateAnimate() {
            if (!_Renderer) return;
            if (!_IsActiveRendererUpdate) return;
            if (!_HasAnimateUpdate) return;
            var _delta = _Clock.getDelta();
            //有SEA的时候使用
            if (THREE.SEA3D && THREE.SEA3D.AnimationHandler) THREE.SEA3D.AnimationHandler.update(_delta);
        }
        /**
         * 渲染场景
         */
        function ThreeJsRender() {
            if (!_Renderer) return;
            if (!_IsActiveRendererUpdate) return;
            // console.log('ThreeJsRender');
            //刷新场景
            _Renderer.render(_Scene, _Camera);
        }

        /**
         * 添加一个盒子进行测试场景是否创建成功
         */
        this.AddInitDebugBox = function() {
            console.log('AddInitDebugThreejs');
            var geometry = new THREE.TorusKnotGeometry(40, 10, 10, 10);
            var material = new THREE.MeshBasicMaterial({
                color: 0xffff00,
                wireframe: true
            });
            var torusKnot = new THREE.Mesh(geometry, material);
            _Self.Scene.add(torusKnot);

            geometry = new THREE.BoxGeometry(150, 150, 150);
            material = new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                wireframe: true
            });
            var cube = new THREE.Mesh(geometry, material);
            _Self.Scene.add(cube);
        };
        /**
         * 使用框架的resize 代码
         */
        this.InitSiteResizeModelReSize = function() {
            if (SiteModel && SiteModel.SiteResizeModel) SiteModel.SiteResizeModel.on('resize', ReSize);
            else {
                $(window).resize(function() {
                    ReSize();
                });
            }
            ReSize();
        };
        /**
         * 自适应
         */
        function ReSize() {
            // console.log('3D ReSize');
            var _width = window.innerWidth;
            var _height = window.innerHeight;
            if (SiteModel && SiteModel.SiteResizeModel) {
                _width = SiteModel.SiteResizeModel.Width;
                _height = SiteModel.SiteResizeModel.Height;
                var _actualH = SiteModel.SiteResizeModel.ActualH;
                var _pageScale = SiteModel.SiteResizeModel.PageScale;
                var _isInputState = SiteModel.SiteResizeModel.IsInputState;
                var _horizontal = SiteModel.SiteResizeModel.Horizontal;
                var _screenWidth = SiteModel.SiteResizeModel.ScreenWidth;
                var _densityDpi = SiteModel.SiteResizeModel.DensityDpi;
                if (_Camera && _Renderer) {
                    if (_ReSizeType === 'fixed') {
                      _Camera.aspect = 640 / _actualH;
                      _Camera.updateProjectionMatrix();
                      _Renderer.setSize(640, _actualH);
                    }
                    else if(_ReSizeType === 'fixed2'){
                      _Camera.aspect = _screenWidth / _actualH;
                      _Camera.updateProjectionMatrix();
                      _Renderer.setSize(_screenWidth, _actualH);
                    }
                    else {
                      _Camera.aspect = _width / _height;
                      _Camera.updateProjectionMatrix();
                      _Renderer.setSize(_width, _height);
                    }
                }
            } else {
                _Camera.aspect = _width / _height;
                _Camera.updateProjectionMatrix();
                _Renderer.setSize(_width, _height);
            }
        }
        this.ReSize = ReSize;
        //默认初始化激活引擎
        if (opts.init || opts.init === undefined) Init3DEngine(opts);

    }

    return Three3DModel;
}));
