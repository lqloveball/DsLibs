let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);


let ds = root.ds = root.ds || {};

ds.threejs = ds.threejs || {};

/**
 * threejs 简化加载处理工作
 * @module ds/threejs/LoadManager
 */
let LoadManager = {

    /**
     * 加载editor编辑导出的场景对象，快速读取灯光与场景
     * @alias module:ds/threejs/LoadManager~loadSceneJSON
     * @param {string} url 加载场景json地址
     * @param {function} complete 加载完成function
     * @param {function} progress 加载过程function(progress)
     * @param {function} error 加载错误function
     * @example
     * ds.threejs.LoadManager.loadSceneJSON('./a.json',function(scene){
     *
     *         //获取场景上设置灯光
     *         var _lightGroup=scene.getObjectByName('LightGroup');
     *
     * });
     */
    loadSceneJSON: function (url, complete, progress, error) {

        let _loader = new THREE.ObjectLoader();

        _loader.load(url,
            //完成
            function (scene) {
                //_LightGroup=scene.getObjectByName('LightGroup');
                if (complete) complete(scene);

            },
            //进度
            function (e) {
                var _progress = e.loaded / e.total;
                if (progress) progress(_progress);
            },
            //错误
            function () {
                // console.log('错误');
                if (error) error();
            }
        );

        return _loader;


    },
    /**
     * obj格式模型加载队列
     * @alias module:ds/threejs/LoadManager~loadObjectModels
     * @param {array} list  加载对象列表
     * ```js
     * [
     *  {src:'./assets/obj/Car/j-car1.obj',id:'Car1'},
     *  {src:'./assets/obj/Car/car2.obj',id:'Car2'},
     *  //只是字符会自动转换成object对象类型
     *  './assets/obj/Car/car3.obj'
     * ]
     * ```
     * @param {function} complete 加载完成function
     * @param {function} progress 加载进度function(progress)
     * @return {object} objectDc 返回一个object加载获取3d对象的字典
     * @requires  require('threejs/loaders/OBJLoader.js');
     * @example
     * var dc = ds.threejs.LoadManager.loadObjectModels([
     *         {src:'./assets/obj/Car/j-car1.obj',id:'Car1'},
     *         {src:'./assets/obj/Car/car2.obj',id:'Car2'}
     *      ],function(){
     *
     *          //这获取到模型加载后3d对象
     *          var car1=dc.Car1;
     *
     *      });
     */
    loadObjectModels: function (list, complete, progress) {

        let _objectDc = {};
        let _manager = new THREE.LoadingManager();
        _manager.onProgress = function (item, loaded, total) {

            if (loaded == total) {

                if (complete) complete();

            } else {

                let _progress = loaded / total;
                if (progress) progress(_progress);

            }
        };

        let _objList = [];
        for (let i = 0; i < list.length; i++) {

            let _obj = list[i];
            if (typeof(_obj) === 'string') {
                _obj = {src: _obj, id: _obj};
                list[i] = _obj;
            }

            if (_obj.id !== undefined) _objectDc[_obj.id] = _obj;

            let _loader = new THREE.OBJLoader(_manager);

            // _obj.loader=_loader;
            //加载完成后进行的附加值使用
            _loader._load_objData = _obj;

            _objList.push(_loader);

            //开始加载
            _loader.load(_obj.src,
                //加载完成
                function (object, self) {
                    // console.log(itself,object,itself._load_objData)
                    //改造OBJLoader内的onLoad传参数，多添加一个
                    if (self) self._load_objData.object = object;

                },
                //加载进度
                function (xhr) {

                    if (xhr.lengthComputable) {

                        let _progress = xhr.loaded / xhr.total * 100;

                    }

                },
                //加载错误
                function () {

                    console.log('Object Load Error');

                }
            );
        }

        return _objectDc;
    },

    /**
     * 加载SEA3D模型
     * 需要SEA3D loader支持，并且加载顺序有要求
     * @alias module:ds/threejs/LoadManager~loadSEA3DModel
     * @param {string} url 加载模型json地址
     * @param {function} complete 加载完成function
     * @param {function} progress 加载过程function(progress)
     * @return {object} loader 加载对象
     * @requires  require('threejs/loaders/sea3d/SEA3D.js');
     * @requires  require('threejs/loaders/sea3d/SEA3DLZMA.js');
     * @requires  require('threejs/loaders/sea3d/SEA3DLoader.js');
     * @requires  require('threejs/loaders/sea3d/SEA3DLegacy.js');
     * @example
     * ds.threejs.LoadManager.loadSEA3DModel('./assets/sea3d/cumo5.sea',function(loader){
     *
     *      //获取到模型内摄像机Camera001
     *      loader.getCamera( "Camera001" );
     *
     * });
     *
     */
    loadSEA3DModel: function (url,complete, progress) {

        if (!THREE.SEA3D) {

            console.warn('no has SEA3D Loader!');
            return;

        }
        var _loader = new THREE.SEA3D({

            autoPlay: true, // Auto play animations
            //container: _ControlElementGroup // Container to add models

        });

        _loader.onComplete = function (e) {

            if (complete) complete(_loader);

        };

        _loader.onProgress = function (e) {

            // console.log( "Progress:", e.type, "Total:", e.loaded / e.total * 100 );
            var _progress = e.loaded / e.total;
            if (progress) progress(_progress);

        };

        //_loader.load('./assets/sea3d/cumo5.sea');
        _loader.load(url);
        return _loader;

    },
    /**
     * 加载Texture队列
     * @alias module:ds/threejs/LoadManager~loadTextures
     * @param {array} list
     *
     * ```js
     * [
     *   {src:'./assets/model/tree1.png',id:'tree1'},
     *   {src:'./assets/model/tree2.png',id:'tree2'},
     * ]
     * ```
     * @param {function} complete 加载完成 function()
     * @param {function} progress 加载进度 function(progress)
     * @param {function} fileEnd 单个文件加载完成 function(obj)
     * @return {object} textureDc 返回一个加载对象检索字典
     * @example
     *
     * var textureDc = ds.threejs.LoadManager.loadTextures([
     *  {src:'./assets/model/tree1.png',id:'tree1'},
     *  {src:'./assets/model/tree2.png',id:'tree2'},
     * ],function(){
     *      //获取到相关材质对象
     *      textureDc.tree1.texture
     * });
     *
     */
    loadTextures:function (list,complete, progress,fileEnd) {

        //纹理图片字典
        let _textureDc = {};
        //加载对象列表
        let _loadList = [];
        let i, _obj, _loader;
        for (i = 0; i < list.length; i++) {

            _obj = list[i];

            if (typeof(_obj) === 'string') {

                _obj = { src: _obj,id:_obj};
                list[i] = _obj;

            }

            if (_obj.id !== undefined) _textureDc[_obj.id] = _obj;

            _loader = new THREE.TextureLoader();
            _loadList.push(_loader);

        }

        var _index = -1;
        fileLoad();

        //文件加载
        function fileLoad() {

            _index += 1;
            progresses();

            if (_index >= _loadList.length) {

                fileLoadAllEnd();
                return;

            }

            _obj = list[_index];
            _loader = _loadList[_index];

            _loader.load(
                // 加载图片路径
                _obj.src,
                // 图片加载完成
                function(texture) {

                    _obj.texture = texture;

                    //单个文件加载完成
                    if(fileEnd)fileEnd(_obj);

                    fileLoad();

                },
                // 加载进度
                function(xhr) {

                },
                // 加载错误
                function(xhr) {
                    fileLoad();
                }
            );

        }

        //加载完成
        function fileLoadAllEnd() {

            if (complete) complete();

        }

        function progresses() {

            var _progress = _index / _loadList.length;
            if (progress) progress(_progress);

        }

        return _textureDc;

    }

};

/**
 * 加载器对象
 * @member ds.threejs.LoadManager
 * @type module:ds/threejs/LoadManager
 */
ds.threejs.LoadManager = LoadManager;


export default ds.threejs.LoadManager;