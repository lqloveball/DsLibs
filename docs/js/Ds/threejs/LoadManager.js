/**
 * @class Ds.threejs.LoadManager
 * @classdesc: 加载管理类
 * @extends
 * @example: 举例
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
    root.Ds.threejs.LoadManager = LoadManager;

    function LoadManager() {
        var _Self = this;
        /**
         * 加载editor导出场景，快速获取 灯光 与 Group
         * @param {[String]} url         [加载场景json地址]
         * @param {[Function]} endFun      [加载完成 scene 是加载完成3D对象]
         * @param {[Function]} progressFun [加载进度]
         */
        this.LoadSceneJSON = function(url, endFun, progressFun) {
            var _loader = new THREE.ObjectLoader();
            _loader.load(url,
                //完成
                function(scene) {
                    //_LightGroup=scene.getObjectByName('LightGroup');
                    if (endFun) endFun(scene);
                },
                //进度
                function(e) {
                    var _num = e.loaded / e.total;
                    if (progressFun) progressFun(_num);
                },
                //错误
                function() {
                    log('错误');
                }
            );
            return _loader;
        };
        /**
         * Obj格式模型加载队列
         * @param {[Array]} objList     [加载对象列表]
         * [
         *      {src:'./assets/obj/Car/j-car.obj',id:'Car',type:'essence'},
         *      {src:'./assets/obj/Car/l-car.obj',id:'Car',type:'low'},
         *  ]
         * 加载完成后会多一个 object 参数，这个参数就是加载完成后3D对象
         * 需要对OBJLoader.js类修改才能获取到object
         * @param {[Function]} endFun      [加载完成]
         * @param {[Function]} progressFun [加载进度]
         * @return {[Object]} _objectDc [返回一个检索字典]
         * @todo 修改成不需要对OBJLoader.js类进行修改
         */
        this.LoadOBJModels = function(objList, endFun, progressFun) {
            var _objectDc = {};
            var _manager = new THREE.LoadingManager();
            _manager.onProgress = function(item, loaded, total) {
                // console.log( item, loaded, total );
                if (loaded == total) {
                    if (endFun) endFun();
                } else {
                    var _num = loaded / total;
                    if (progressFun) progressFun(_num);
                }
            };
            var _objList = [];
            for (var i = 0; i < objList.length; i++) {
                var _obj = objList[i];
                if (_obj.id !== undefined) _objectDc[_obj.id] = _obj;
                var _loader = new THREE.OBJLoader(_manager);
                // _obj.loader=_loader;
                //加载完成后进行的附加值使用
                _loader._load_objData = _obj;
                _objList.push(_loader);
                //开始加载
                _loader.load(_obj.src,
                    //加载完成
                    function(object, itself) {
                        // console.log(itself,object,itself._load_objData)
                        //改造OBJLoader内的onLoad传参数，多添加一个
                        if (itself) {
                            itself._load_objData.object = object;
                        }
                    },
                    //加载进度
                    function(xhr) {
                        if (xhr.lengthComputable) {
                            var percentComplete = xhr.loaded / xhr.total * 100;
                        }
                    },
                    //加载错误
                    function() {
                        console.log('Object Load Error');
                    }
                );
            }
            return _objectDc;
        };
        /**
         * 开始加载SEA3D 模型
         * @param {[String]} url         [description]
         * @param {[Function]} endFun      [description]
         * @param {[Function]} progressFun [description]
         * 需要js库 步骤
         * 1、 loaders/sea3d/SEA3D.js
         * 2、 loaders/sea3d/SEA3DLZMA.js
         *     loaders/sea3d/SEA3DLoader.js
         * 3、 loaders/sea3d/SEA3DLegacy.js
         */
        this.LoadSEA3DModel = function(url, endFun, progressFun) {
            if (!THREE.SEA3D) return;
            var _loader = new THREE.SEA3D({
                autoPlay: true, // Auto play animations
                //container: _ControlElementGroup // Container to add models
            });
            _loader.onComplete = function(e) {
                if (endFun) endFun(_loader);
            };
            _loader.onProgress = function(e) {
                // console.log( "Progress:", e.type, "Total:", e.loaded / e.total * 100 );
                var _num = e.loaded / e.total;
                if (progressFun) progressFun(_num);
            };
            // _loader.load('./assets/sea3d/cumo5.sea');
            _loader.load(url);
            return _loader;
        };
        /**
         * Texture格式模型加载队列
         * @param {[Array]} objList     [加载对象列表]
         * [
         *      {src:'./assets/model/tree.png',id:'Car',type:'essence'},
         *      {src:'./assets/obj/Car/l-car.obj',id:'Car',type:'low'},
         *  ]
         * 加载完成后会多一个 object 参数，这个参数就是加载完成后3D对象
         * 需要对OBJLoader.js类修改才能获取到object
         * @param {[Function]} endFun      [加载完成]
         * @param {[Function]} progressFun [加载进度]
         * @return {[Object]} _textureDc [返回一个检索字典]
         */
        this.LoadTextureList = function(loadList, endFun, progressFun) {
            //纹理图片字典
            var _textureDc = {};
            //加载对象列表
            var _loadList = [];
            var i, _obj, _loader;
            for (i = 0; i < loadList.length; i++) {
                _obj = loadList[i];
                if (typeof(_obj) === 'string') {
                    _obj = { src: _obj};
                    loadList[i] = _obj;
                }
                if (_obj.id !== undefined) _textureDc[_obj.id] = _obj;
                _loader = new THREE.TextureLoader();
                _loadList.push(_loader);
            }
            var _loadNum = -1;
            startLoad();
            //开始加载
            function startLoad() {
                _loadNum += 1;
                progresses();
                if (_loadNum >= _loadList.length) {
                    loadEnd();
                    return;
                }
                _obj = loadList[_loadNum];
                _loader = _loadList[_loadNum];
                _loader.load(
                    // 加载图片路径
                    _obj.src,
                    // 图片加载完成
                    function(texture) {
                        _obj.texture = texture;
                        startLoad();
                    },
                    // 加载进度
                    function(xhr) {

                    },
                    // 加载错误
                    function(xhr) {
                        startLoad();
                    }
                );
            }
            //加载完成
            function loadEnd() {
                if (endFun) endFun();
            }
            //加载进度
            function progresses() {
                var _num = _loadNum / _loadList.length;
                if (progressFun) progressFun(_num);
            }
            return _textureDc;
        };
    }

    return new LoadManager();
}));
