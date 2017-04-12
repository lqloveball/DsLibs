(function(factory) {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);

    if (typeof define === 'function' && define.amd) {
        define(['exports'], function(exports) {
            require('../gemo/SliderDistance');
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
    root.Ds.threejs.ThroughSpace = ThroughSpace;
    /**
     * 穿越空间类
     * 需要
     * THREE = require('threejs/three82.js');  //3D引擎
     * require('threejs/Detector.js');        //判断是否支持3d引擎
     * require('threejs/controls/OrbitControls.js'); //镜头控制器
     * require('ds/threejs/Three3DModel');  //快速创建3d模块
     * require('libs/greensock/TweenMax.min');  //运动引擎
     **/
    function ThroughSpace(three3DModelOpts, sliderOpts) {
        three3DModelOpts = three3DModelOpts || {};

        var _Self = this;
        Ds.Extend(this, new Ds.EventDispatcher());

        //纹理加载器
        var _LoadManager = require('ds/threejs/LoadManager');
        //3D空间构建
        var _Three3DModel = new Ds.threejs.Three3DModel({
            appendTo: three3DModelOpts.appendTo !== undefined ? three3DModelOpts.appendTo : '#threeBox',
            addDebugBox: false,
            resizeEvent: false,
            width: 640,
            height: 1138,
            resizeType: 'fixed',
            cameraFov: 60,
            cameraFar: 100000,
            cameraNear: 1,
            cameraPosition: {
                x: 0,
                y: 0,
                z: 1000
            },
            hasControls: three3DModelOpts.hasControls !== undefined ? three3DModelOpts.hasControls : false,
        });
        Object.defineProperty(this, "Three3DModel", {
            get: function() {
                return _Three3DModel;
            },
        });

        //默认滑块参数
        sliderOpts = sliderOpts || null;
        //场景
        var _Scene = _Three3DModel.Scene;
        Object.defineProperty(this, "Scene", {
            get: function() {
                return _Scene;
            },
        });
        //摄像机
        var _Camera = _Three3DModel.Camera;
        //放背景的容器
        var _BGGroup = new THREE.Group();
        _Scene.add(_BGGroup);
        //放场景的容器
        var _SceneGroup = new THREE.Group();
        _Scene.add(_SceneGroup);
        Object.defineProperty(this, "SceneGroup", {get: function() {return _SceneGroup;},});
        //场景的配置
        var _SceneConfig;
        //场景配置列表
        var _SceneDataList;
        //纹理索引
        var _TextureDc;
        Object.defineProperty(this, "TextureDc", {
            get: function() {
                return _TextureDc;
            },
        });
        //纹理加载队列
        var _TextureLoadList = [];
        //纹理url检索
        var _TempTextureUrlList = [];
        //场景列表
        var _SceneList;
        //最远背景视距
        var _BgFar = 6000;
        //是否默认开启效果过度
        var _Effects = true;
        //拖拽距离控制器
        var _SliderDistance;
        Object.defineProperty(this, "SliderDistance", {
            get: function() {
                return _SliderDistance;
            },
        });
        /**
         * 获取3d对象的数据
         * @type {Object}
         * var _tip=Object3DDc['scene0/tip'];
         */
        var _Object3DDc = {};
        Object.defineProperty(this, "Object3DDc", {
            get: function() {
                return _Object3DDc;
            },
        });
        /**
         * 初始化
         * @param  {[Object]} config [配置文件]
         * //总配置
         * _ConfigData={scene0:{...},scene1:{...},scene1:{...}}
         * //场景配置
         scene: function() {
            var _start = 0;
            return {
              type: 'group',
                // name: 'scene0',// 自动构建 根据在_ConfigData名称
                // group: null,   // 自动构建  子对象组 THREE.Group
                // scene: null,   // 自动构建  当前场景对象 THREE.Group
                // start:0,       // 自动构建  场景开始位置
                // end:0,         // 自动构建  场景结束位置
                //背景
                bg: {
                  x: 0,y: 0,z:_BgFar + 10,  //坐标定位
                  src: './images/models/bg0.jpg',   //设置纹理图片地址
                  s: 8,                             //缩放比例
                },
                //子元素列表
                childs: {
                  cloud0: {
                    //type: 'group',                  //默认自动构建 sprite
                    //obj: null,                      //自动构建 创建后的3d对象
                    //texture: null,                  //自动构建 使用纹理
                    x: 0,y: 0,z: _start=_start +100,  //坐标定位
                    src: _Path0 + 'cloud0.png',       //设置纹理图片地址
                    s: 8,                             //缩放比例 不填写自动构建 默认1
                    opacity:0.6,                      //透明度
                    rotation:0,                         //z轴的旋转
                    effects:'opacity rotation',              //自带动画  内置类型，可以是Array 也可以是字符串靠空格区分
                    movie:function(){var _obj=this.obj;}, //可为空，初始化执行的函数，内部可以对自身这个对象的动画控制
                    //这个对象到场景中的 根据当前距离进行 自计算
                    upDate:function(e){
                      var _obj=this.obj;
                      // //获取世界坐标
                      var _pt=e.pt;
                      // //计算出从背景穿出的位置
                      var _z=e.z;
                      // //计算用1000做渐变动画
                      var _s=e.speed;
                      _obj.material.opacity=this.opacity*_s;
                      // console.log(_pt.z,'---',_BgFar,'---',_z);
                    }
                  },
                  cloud1: {
                    x: 0,y: 0,z: _start=_start +100,  //坐标定位
                    src: _Path0 + 'cloud0.png',       //设置纹理图片地址
                    s: 8,                             //缩放比例 不填写自动构建
                  }
                }
            }
          }
         */
        this.Init = function(config, bgFar) {
            _SceneConfig = config;
            _BgFar = bgFar || 6000;
            //场景数据类型
            _SceneDataList = [];
            var _src, _id, _loadData;
            var _end = 0;
            //对场景组进行处理
            for (var _name in _SceneConfig) {
                //获取到场景
                var _sceneData;
                if (typeof(_SceneConfig[_name]) === 'function') {
                    _sceneData = _SceneConfig[_name]();
                } else {
                    _sceneData = _SceneConfig[_name];
                }

                //设置场景数据的名称
                _sceneData.name = _name;
                //设置场景的开始点
                _sceneData.start = _end;
                // console.log(_sceneData.z);
                // 场景数据放进列表
                _SceneDataList.push(_sceneData);
                //这个场景有背景的处理
                if (_sceneData.bg) {
                    _sceneData.bg.name = 'bg';
                    //处理纹理
                    AddTextureLoadList(_sceneData.bg.src);
                }
                //获取场景子元素
                _sceneData.list = [];
                var _end2 = 0;
                if (_sceneData.childs) {
                    //查询出来子元素的数据
                    for (var _cname in _sceneData.childs) {
                        var _child = _sceneData.childs[_cname];
                        //计算最远距离
                        _end2 = Math.max(_end2, _child.z);
                        //子元素名称设置
                        _child.name = _cname;
                        //场景的列表里面放入子元素数据
                        _sceneData.list.push(_child);
                        //纹理处理
                        AddTextureLoadList(_child.src);
                    }
                }
                _end = (_end + _end2);
                //记录场景结束点
                _sceneData.end = _end;
                _MaxLength = _sceneData.end;
                console.log(_name + ' start:' + _sceneData.start + ' end:' + _sceneData.end);
            }
            // StatrLoad();
        };
        /**
         * 开始加载
         * @return {[type]} [description]
         */
        this.StatrLoad = function() {
            //开始加载纹理资源，并且创建纹理字典
            _TextureDc = _LoadManager.LoadTextureList(_TextureLoadList,
                function() {
                    console.log('贴图加载完成');
                    _Self.ds({
                        type: 'loadEnd'
                    });
                    //开始创建场景组队列
                    CreateGroupList();
                },
                function(progress) {
                    //console.log('贴图加载进度:'+progress);
                    _Self.ds({
                        type: 'progress',
                        progress: progress,
                    });
                }
            );
        };
        /**
         * 添加进行纹理加载列表
         * @param {[type]} src [description]
         */
        function AddTextureLoadList(src) {
            if (!src) return;
            if (_TempTextureUrlList.indexOf(src) === -1) {
                var _loadData = {
                    src: src,
                    id: src,
                };
                _TextureLoadList.push(_loadData);
            }
        }
        this.AddTextureLoadList = AddTextureLoadList;
        /**
         * 创建场景列表
         */
        function CreateGroupList() {
            _SceneList = [];
            var _scene;
            var _groupData;
            var _bgObj;
            for (var i = 0; i < _SceneDataList.length; i++) {
                _groupData = _SceneDataList[i];
                _scene = CreateGroup(_groupData);
                _SceneList.push(_scene);
                _SceneGroup.add(_scene);
                _bgObj = _groupData.bgObj;
                _BGGroup.add(_bgObj);
            }
            //开始更新场景
            _Value = 0;
            UpDateScene();
            //创建滑块控制器
            if (sliderOpts) _Self.CreateSlider(sliderOpts);
            //穿梭空间构建完成
            _Self.ds({
                type: 'createEnd'
            });
        }

        /**
         * 初始化滑块
         * @param  {[type]} opts [description]
         {
             touchDom: $(three3DModelOpts.appendTo), //拖动的touch用的dom对象
             min: 0, //最小距离
             max: _Self.MaxLength, //最大距离
             interval: 2000, //拖动间隔
             touchHeight: window.innerHeight, //拖动高度
             touchDirection: true, // 方向
             autoSpeed: false, //一开始就自动播放
         };
         * @return {[type]}      [description]
         */
        this.CreateSlider = function(opts) {
            //创建一个拖拽控制器
            _SliderDistance = new Ds.gemo.SliderDistance(_Self, 'Value', opts);
        };
        /**
         * 创建单个场景
         * @param {[Object]} groupData [场景组数据]
         */
        function CreateGroup(groupData) {
            // console.log('创建场景:', groupData.name);
            //设置索引
            _Object3DDc[groupData.name] = groupData;
            var _scene = new THREE.Group();
            groupData.scene = _scene;
            var _group = new THREE.Group();
            groupData.group = _group;
            _scene.add(_group);
            _scene.groupData = groupData;
            _scene.position.z = -groupData.start;

            var _list = groupData.list;
            for (var i = 0; i < _list.length; i++) {
                var _child = _list[i];
                var _child3DObject = Greate3DObject(_child, groupData.name);
                if (_child3DObject) _group.add(_child3DObject);
            }
            if (groupData.bg) {
                var _bg3DObject = Greate3DObject(groupData.bg, groupData.name);
                groupData.bgObj = _bg3DObject;
            }

            return _scene;
        }
        /**
         * 创建子元素
         * @param
         */
        function Greate3DObject(data, name) {
            var _nowName = name + '/' + data.name;
            //设置索引
            _Object3DDc[_nowName] = data;
            // 查找纹理
            var _map, _width, _height, _material;
            if (_TextureDc[data.src] && _TextureDc[data.src].texture) {
                _map = _TextureDc[data.src].texture;
                _width = _map.image.width;
                _height = _map.image.height;
                //设置对象纹理索引
                data.texture = _map;
            } else {
                console.warn('Get3DObject Textur Error:', _nowName, data.src);
            }
            return _Self.Greate3DObject(data, _map);
        }

        /**
         * 创建子元素
         * @param  {[Object]} data [创建参数]
         * @param  {[Texture]} map  [传入贴图纹理]
         * @return {[type]}      [description]
         */
        this.Greate3DObject = function(data, map) {
            // console.log(_nowName);
            var _width, _height, _material, _scale,_reverse;
            if (map) {
                _width = map.image.width;
                _height = map.image.height;
            }
            var _object3D;
            //没设置子元素类型，默认类型使用THREE.Sprite
            if (!data.type && map) {
                data.type = 'sprite';
                //创建sprite对象
                _object3D = new THREE.Sprite();
                data.obj = _object3D;
                //创建纹理
                if (map) {
                    _material = new THREE.SpriteMaterial({
                        map: map,
                    });
                    if (data.blending) {
                        _material.blending = data.blending;
                    }
                    if (data.opacity !== undefined) {
                        _material.opacity = data.opacity;
                    }
                    if (data.transparent) {
                        _material.transparent = true;
                        _material.alphaTest = 0.1;
                    }
                    _object3D.material = _material;
                    //是否镜像
                    // _reverse= data.reverse!==undefined ? data.reverse : false;
                    //设置缩放比例
                    _scale = data.s !== undefined ? data.s : 1;
                    data.width = _width * _scale;
                    data.height = _height * _scale;
                    _object3D.scale.set(data.width, data.height, 1);
                }
                //设置位置
                _object3D.position.x = data.x || 0;
                _object3D.position.y = data.y || 0;
                _object3D.position.z = -data.z || 0;
                //旋转角度
                _object3D.rotation.z = -data.rotation || 0;
                //如果纯在动画这里进行动画控制
                if (data.movie) data.movie();
            } else if (data.type == 'plane' && map) {
                var _geometry = new THREE.PlaneGeometry(1, 1, 1);
                _material = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    side: THREE.DoubleSide,
                    transparent: true,
                    alphaTest: 0.8,
                    map: map,
                });
                _object3D = new THREE.Mesh(_geometry, _material);
                if (data.blending) {
                    _material.blending = data.blending;
                }
                if (data.opacity !== undefined) {
                    _material.opacity = data.opacity;
                }
                //是否镜像
                _reverse= data.reverse!==undefined ? data.reverse : false;
                //设置缩放比例
                _scale = data.s !== undefined ? data.s : 1;
                data.width = _width * _scale;
                data.height = _height * _scale;
                _object3D.scale.set(data.width, data.height, 1);
                //设置位置
                _object3D.position.x = data.x || 0;
                _object3D.position.y = data.y || 0;
                _object3D.position.z = -data.z || 0;
                //旋转角度
                _object3D.rotation.z = -data.rotation || 0;
                if(_reverse) _object3D.rotation.y= Math.PI;
                if (data.movie) data.movie();
            } else if (!data.type && !map) {
                data.type = 'object3D';
                _object3D = new THREE.Group();
                data.obj = _object3D;
                //设置位置
                _object3D.position.x = data.x || 0;
                _object3D.position.y = data.y || 0;
                _object3D.position.z = -data.z || 0;
                //旋转角度
                _object3D.rotation.z = -data.rotation || 0;


                if (data.movie) data.movie();
            }
            return _object3D;
        };
        /**
         * 是否锁定不能运动
         * @type {Boolean}
         */
        var _Lock = false;
        Object.defineProperty(this, "Lock", {
            get: function() {
                return _Lock;
            },
            set: function(value) {
                _Lock = value;
            }
        });

        /**
         * 场景当前值
         * @type {Number}
         */
        var _Value = 0;
        Object.defineProperty(this, "Value", {
            get: function() {
                return _Value;
            },
            set: function(value) {
                if (_Lock) return;
                if (_Value == value) return;
                _Value = value;
                UpDateScene();
                // console.log('--------',_Value);
            }
        });

        var _MaxLength = 0;
        Object.defineProperty(this, "MaxLength", {
            get: function() {
                return _MaxLength;
            },
        });

        /**
         * 场景刷新更新
         */
        function UpDateScene() {
            if (_Lock) return;
            if (!_SceneList) return;
            _SceneGroup.position.z = _Value;
            var _event = {
                type: 'update'
            };
            _event.z = _Value;
            var _scene, _groupData, _bgObj;
            //console.log('_SceneList.length',_SceneList.length);
            var _nowScene = null;
            var _nowGroupData = null;
            // console.log('UpDateScene:',_Value);
            // 做算法剔除
            var _sceneList = [];
            var _sceneDataList = [];
            for (var i = 0; i < _SceneList.length; i++) {
                _scene = _SceneList[i];
                _groupData = _SceneDataList[i];
                if (_Value >= _groupData.start - _BgFar && _Value <= _groupData.end ) {
                    // console.log(i+'显示');
                    _nowScene = _scene;
                    _sceneList.push(_scene);
                    _sceneDataList.push(_groupData);
                    _SceneGroup.add(_scene);
                    if (_groupData.bg) _BGGroup.add(_groupData.bg.obj);
                    //子元素有upDate方法 需要帮忙执行
                    for (var j = 0; j < _groupData.list.length; j++) {
                        var _childData = _groupData.list[j];
                        UpDateChild(_childData);
                    }

                } else {
                    // console.log(i+'剔除');
                    _SceneGroup.remove(_scene);
                    if (_groupData.bg) _BGGroup.remove(_groupData.bg.obj);
                }
            }
            _event.sceneList = _sceneList;
            _event.sceneDataList = _sceneDataList;
            _Self.ds(_event);
        }
        /**
         * 更新子对象状态
         * @param {[type]} childData [description]
         */
        function UpDateChild(childData) {
            var _childData = childData;
            var _obj = _childData.obj;
            // console.log(_childData);
            var _pt, _z, _effectSpeed, _opacity, _speed, _outSpeed, _hasOut,_noOutEffect;
            if ((_obj && _Effects) || (_obj && _childData.effects) || _childData.upDate) {
                //计算当前世界坐标
                _pt = _obj.getWorldPosition();
                //计算出从背景穿出的位置
                _z = _BgFar + _pt.z;
                //特效过渡默认使用1000，除非有设置
                _effectSpeed = _childData.speed !== undefined ? _childData.speed : 1000;
                //最大透明度
                _opacity = _childData.opacity !== undefined ? _childData.opacity : 1;
                //旋转角度，默认大约90度
                _rotation = _childData.rotation !== undefined ? _childData.rotation : 1.5;
                _noOutEffect=_childData.outEffect!==undefined?_childData.outEffect:true;
                //计算用1000做渐变动画
                _speed = 0;


                if (_z >= 100 + _effectSpeed) {
                    _speed = 1;
                } else if (_z >= 100) {
                    _speed = Math.min((_z - 100) / _effectSpeed, 1);
                }
                //判断是否还在进场
                _hasOut = false;
                if (_z >= 100 + _effectSpeed) {
                    _hasOut = true;
                }

                //计算退出动画使用
                // _outSpeed=_pt.z>=0?-(_pt.z-250)/250:1;
                _outSpeed = _pt.z >= 100 ? 1 - Math.min((_pt.z - 100) / (250 - 100), 1) : 1;

            }
            //自动滤镜  或者自身带设置有滤镜
            if ((_obj && _Effects) || (_obj && _childData.effects)) {
                // if (_childData.name === 'star6_1') console.log(_childData.name, _opacity, _s);
                // if (_childData.src && _childData.src.indexOf('god2.png') != -1) {
                //     console.log(_childData.effects, _Effects, (!_childData.effects && _Effects), _opacity);
                // }
                if (!_childData.effects && _Effects) {
                    //进场滤镜
                    if (_obj.material) _obj.material.opacity = _opacity * _speed;
                    if(_noOutEffect){
                      //退场效果
                      if (_obj.material && _hasOut) _obj.material.opacity = _opacity * _outSpeed;
                    }

                } else {
                    if (_childData.effects.indexOf('opacity') != -1) {
                        //进场滤镜
                        if (_obj.material) _obj.material.opacity = _opacity * _speed;
                        if(_noOutEffect){
                          //退场效果
                          if (_obj.material && _hasOut) _obj.material.opacity = _opacity * _outSpeed;
                        }

                    }
                    if (_childData.effects.indexOf('rotation') != -1) {
                        _obj.rotation.z = _rotation * _speed;
                    }

                }
            }
            // 自刷新计算 提供默认的  value:场景当前值 speed:默认的过度值百分比 pt：当前元素世界坐标 bgz:与背景视长_BgFar的距离
            if (_childData.upDate) {
                _childData.upDate({
                    z: _Value,//当前场景z
                    bgz: _z,//相对背景z
                    speed: _speed,//进场百分比
                    outSpeed:_outSpeed,//退场百分比
                    hasOut:_hasOut,//是否先不设置退出，因为还在进场
                    worldPt: _pt//世界坐标
                });
            }
        }

        /**
         * 子元素进出场辅助防范
         * @param  {[type]} obj [description]
         * @return {[type]}     [description]
         */
        this.ChildObjectInOutFactory = function(obj, opts) {
            var _pt,_z,_effectSpeed,_opacity,_speed,_outSpeed,_hasOut;
            var _obj=obj;
            opts=opts||{};
            _pt = _obj.getWorldPosition();
            //计算出从背景穿出的位置
            _z = _BgFar + _pt.z;
            //特效过渡默认使用1000，除非有设置
            _effectSpeed = opts.speed !== undefined ? opts.speed : 1000;
            //最大透明度
            _opacity = opts.opacity !== undefined ? opts.opacity : 1;
            //计算用1000做渐变动画
            _speed = 0;
            if (_z >= 100 + _effectSpeed) {
                _speed = 1;
            } else if (_z >= 100) {
                _speed = Math.min((_z - 100) / _effectSpeed, 1);
            }
            //判断是否还在进场
            _hasOut = false;
            if (_z >= 100 + _effectSpeed) {
                _hasOut = true;
            }
            //计算退出动画使用
            // _outSpeed=_pt.z>=0?-(_pt.z-250)/250:1;
            _outSpeed = _pt.z >= 100 ? 1 - Math.min((_pt.z - 100) / (250 - 100), 1) : 1;
            //进场滤镜
            if (_obj.material) _obj.material.opacity = _opacity * _speed;
            //退场效果
            if (_obj.material && _hasOut) _obj.material.opacity = _opacity * _outSpeed;
        };

    }


    return ThroughSpace;
}));
