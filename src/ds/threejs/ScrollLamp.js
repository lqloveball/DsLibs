import EventDispatcher from '../core/EventDispatcher';
import LoadManager from './LoadManager';
import SliderDistance from '../gemo/SliderDistance';

/**
 * 跑马灯效果
 * @class
 * @memberof ds.threejs
 * @example
 *
 * //配置参考配置说明
 * var config={....}
 * var _scrollLamp = new ds.threejs.ScrollLamp(config, {touchDom: '#threejsBox canvas'});
 *
 * //如果是一开始未创建完成配置，可以如下进行创建
 * var _scrollLamp = new ds.threejs.ScrollLamp(null, {touchDom: '#threejsBox canvas'});
 * //加载到50%的资源时候开始创建整个场景
 *  _scrollLamp.on('progress', function (e) {
     *     if (e.progress > 0.5) _scrollLamp.createScene();
     *  });
 *  //根据config构建跑马灯,不要马上加载
 *  _scrollLamp.create(config,false);
 *  //手动执行开始加载
 *  _scrollLamp.startLoad();
 */
class ScrollLamp extends EventDispatcher {

    /**
     *
     * @param {object} config 创建跑马灯元素
     * ```js
     *
     * config = {
     *   page1: {
     *       bg: './assets/3d/bg0.png', //页面的背景图片，建议图片相同大小
     *       children: [] // 子元素列表
     *   },
     *   page2: {
     *       bg: './assets/3d/bg1.png',
     *      children: [
     *           {
     *               src:'./assets/3d/test.png',
     *               x:50,y:300, // 子元素定位
     *               angle:10, // 可以是 a 也可以是angle ，代表子元素选择角度偏移
     *               s:1 // 子元素缩放大小
     *           }
     *       ]
     *   },
     *   .
     *   .
     *   .
     *   .
     *  }
     * ```
     * @param {object} opts 配置
     * @param {object} opts.interval=20  每个页面之间间隔角度
     * @param {object} opts.load=false  如果有config，是否执行配置后进行自动加载
     * @param {string} opts.type='h'  touch触发 是横向 还是纵向
     * @param {string|HTMLElement} opts.touchDom=false 进行touch的交互dom对象
     *
     *
     */
    constructor(config, opts) {

        super();

        opts = opts || {};

        /**
         * 这个跑马灯容器
         * @type {THREE.Group}
         */
        this.view = new THREE.Group();

        // 测试
        // var geometry = new THREE.PlaneGeometry( 20, 20, 1 );
        // var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        // var plane = new THREE.Mesh( geometry, material );
        // this.view.add(plane);

        /**
         * 跑马灯页面之间间隔角度
         * @type {number}
         */
        this.interval = opts.interval != undefined ? opts.interval : 20;

        this._rotation = 0;

        /**
         * 拖动距离控制器
         * @type {ds.gemo.SliderDistance}
         */
        this.slider = new SliderDistance(
            this,
            'rotation',
            {
                touchDom: opts.touchDom ? opts.touchDom : $('body'),
                minSpeed: 0.2,
                maxSpeed: 2,
                interval: this.interval * 2,
                type: opts.type !== undefined ? opts.type : 'h',
            });
        this.slider.lock = true;


        this.slider.on('update', this._update, this);

        /**
         * 材质索引对象
         * @type {object}
         */
        this.textureDc = {};

        /**
         * 页面列表
         * @type {Array}
         */
        this.pages = [];
        /**
         * 页面索引字典
         * @type {object}
         */
        this.pageDc={};

        this.on('fileLoad', this._textureFileLoadEnd, this);

        //有初始化配置参数，就自动构建
        if (config) {

            let _load = opts.load != undefined ? opts.load : true;
            this.create(config, _load);

        }
        else {

            this.slider.lock = true;

        }

    }

    _update(e) {

        // console.log('update:',  this.rotation);

        if (!this.pages) return;

        for (var i = 0; i < this.pages.length; i++) {

            var _page = this.pages[i];
            if(Math.abs(this.rotation-_page.rotation)<90){

                if(!_page.view.parent)this.view.add(_page.view);

            }
            else{

                if(_page.view.parent)_page.view.parent.remove(_page.view);

            }

        }
    }

    /**
     * 设置获取跑马灯操作是否锁定
     * @return {boolean}
     */
    get lock() {
        return this.slider.lock;
    }

    set lock(value) {

        this.slider.lock = value;
    }

    /**
     * 创建跑马灯页面
     * @param {object} config 页面配置文件
     * @param {boolean} load=true 是否立刻加载资源
     */
    create(config, load) {

        this.slider.lock = true;

        this.pages = [];
        this.pageDc={};

        //url索引list
        this._loadTextureURLList = [];
        //加载材质list
        this._loadTextureList = [];
        //添加材质更新 需要进行对象更新材质贴图列表
        this._upMaterialObjects = {};

        //清空所有子对象
        // this.view.remove(this.view.children);

        let _index = 0;

        for (let pageName in config) {

            let _cf = config[pageName];
            //定义一个页面数据对象
            let _pageData = {};
            _pageData.name = pageName;
            _pageData.index = _index;
            _pageData.view = new THREE.Group();
            _pageData.children = _cf.children || [];
            // _pageData.box=new THREE.Group();
            // _pageData.view.add(_pageData.box);
            _pageData.view.rotation.y = -this.interval * (Math.PI / 180) * _index;
            _pageData.rotation = this.interval * _index;
            this.view.add(_pageData.view);
            this.pages.push(_pageData);
            this.pageDc[pageName]=_pageData;

            if (_cf.bg) _pageData.bg = {src: _cf.bg, type: 'bg'};

            this.addTextureList(_cf.bg);

            //处理子元素加载材质
            let _children = _pageData.children;
            if (_children) {

                for (var j = 0; j < _children.length; j++) {

                    var _obj = _children[j];
                    // console.log('load children:',_obj);
                    this.addTextureList(_obj.src);

                }

            }


            _index++;

        }

        this.slider.max = this.interval * (this.pages.length - 1);

        //是否创建了跑马灯场景
        this._createSceneBool = false;
        //是否在配置处理后 执行过了开始加载
        this._startLoadBool = false;


        //配置是否立刻加载资源
        if (load === undefined || load == true) this.startLoad();

    }

    /**
     * 创建跑马灯场景，可以自行控制流程是否在load资源过程中就开始创建
     */
    createScene() {

        if (!this.textureDc) {

            console.error('还未执行加载资源，这时候创建场景不正确');
            return;

        }

        if (this._createSceneBool) return;
        this._createSceneBool = true;

        console.log('createScene');

        let _page, _bg;
        for (var i = 0; i < this.pages.length; i++) {
            _page = this.pages[i];
            _bg = _page.bg;
            _bg.parent = _page;
            // console.log(_bg);
            if (_bg) {
                _bg.obj = this.createObject(_bg);
                _page.view.add(_bg.obj);
            }

            //处理子元素加载材质
            let _children = _page.children;
            if (_children) {

                for (var j = 0; j < _children.length; j++) {

                    var _obj = _children[j];
                    _obj.parent = _page;
                    _obj.obj = this.createObject(_obj);
                    _page.view.add(_obj.obj);

                }
            }

        }

        this._update();
        this.slider.lock = false;
        /**
         * 创建创建完成
         * @event ds.threejs.ScrollLamp#createScene
         */
        this.ds('createScene');

    }

    /**
     * 创建3d对象
     * @param {object} data 创建3d对象配置参数
     * @return {THREE.Object3D}
     */
    createObject(data) {

        let _obj3d;
        if (!data.src) {

            //连材质都没有？直接给一个空显示容器对象先~！
            _obj3d = new THREE.Group();
            data.obj = _obj3d;
            return data.obj;

        }


        let _map = null;

        if (this.textureDc && this.textureDc[data.src] && this.textureDc[data.src].texture) {
            _map = this.textureDc[data.src].texture;
            data.texture = _map;
        }

        // console.log('_map',_map);

        let _geometry = new THREE.PlaneGeometry(1, 1, 1);
        let _material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
            alphaTest: 0.8,
            map: _map
        });
        _material.needsUpdate = true;

        data.material = _material;

        if (data.blending) _material.blending = data.blending;
        if (data.opacity !== undefined) _material.opacity = data.opacity;

        //是否镜像
        let _reverse = data.reverse !== undefined ? data.reverse : false;
        //设置缩放比例
        let _scale = data.s !== undefined ? data.s : 1;

        _obj3d = new THREE.Mesh(_geometry, _material);

        //旋转角度
        //_obj3d.rotation.z = -(Math.PI / 180) * data.rotation || 0;
        //镜像
        if (_reverse) _obj3d.rotation.y = Math.PI;

        if (data.type == 'bg') {

            data.obj = _obj3d;

        } else {

            // console.log('createObject children1:', data,data.type );
            data.obj = new THREE.Group();
            data.obj2 = _obj3d;

            var _angle = 0;

            if (data.angle !== undefined) _angle = data.angle;
            else if (data.a !== undefined) _angle = data.a;

            if (_angle >= this.interval) _angle = this.interval;
            data.obj.rotation.y = -_angle * (Math.PI / 180);
            data.obj.add(data.obj2);

        }

        if (_map) {

            data.width = _map.image.width * _scale;
            data.height = _map.image.height * _scale;
            _obj3d.scale.set(data.width, data.height, 1);

            // console.log('data.type:', data.type, data);
            if (data.type == 'bg') {

                let _parent = data.parent;
                _parent.width = data.width;
                _parent.height = data.height;
                _obj3d.position.x = -data.width / 2;

            }
            else {
                // console.log('createObject children2:', data);
                let _parent = data.parent;

                let _x = data.x || 0, _y = data.y || 0;
                data.obj2.position.x = _x + (data.width / 2) - _parent.width;
                data.obj2.position.y = -_y - (data.height / 2) + _parent.height / 2;

            }

        } else {
            //材质还未加载，添加材质加载处理通知
            if (!this._upMaterialObjects[data.src]) this._upMaterialObjects[data.src] = [];
            let _arr = this._upMaterialObjects[data.src]
            _arr.push(data);

        }

        //需要有动画 执行动画
        if (data.movie) data.movie();

        // console.log('createObject:',_obj3d);
        return data.obj;

    }

    /**
     * 一个材质加载完成
     * @param e 事件对象
     * e.data 材质信息
     * ```js
     * //纹理材质
     * data.texture
     * //图片路径
     * data.src
     * //加载的id
     * data.id
     * ```
     * @private
     */
    _textureFileLoadEnd(e) {

        // let _data=e.data;
        // let _src=_data.src;
        let _arr = this._upMaterialObjects[e.data.src];
        let _map = e.data.texture;
        // console.log('_textureFileLoadEnd upMaterials:',_arr);
        if (_arr) {

            for (let i = 0; i < _arr.length; i++) {

                let _data = _arr[i];
                // console.log(_data);
                let _obj = _data.obj;
                let _material = _data.material;
                if (_material) {
                    _data.texture = _map;
                    _material.map = _map;
                    if (_material.update) _material.update();
                    _material.needsUpdate = true;
                    let _scale = _data.s !== undefined ? _data.s : 1;
                    _data.width = _map.image.width * _scale;
                    _data.height = _map.image.height * _scale;
                    _obj.scale.set(_data.width, _data.height, 1);
                    if (_data.type == 'bg') {

                        let _parent = _data.parent;
                        _parent.width = _data.width;
                        _parent.height = _data.height;
                        _obj.position.x = -_data.width / 2;

                    } else {

                        console.log('createObject children3:', data);
                        let _parent = _data.parent;
                        let _x = _data.x || 0, _y = _data.y || 0;
                        _data.obj2.position.x = _x + (_data.width / 2) - _parent.width;
                        _data.obj2.position.y = -_y - (_data.height / 2) + _parent.height / 2;

                    }
                }

            }
        }


    }


    /**
     * 开始加载相关资源
     */
    startLoad() {

        if (this._startLoadBool) return;
        this._startLoadBool = true;

        console.log('loadTextureList:', this._loadTextureList.length);

        var _self = this;

        this.textureDc = LoadManager.loadTextures(this._loadTextureList,
            //全部加载完成
            function () {

                console.log('complete');
                /**
                 * 资源全部加载完成
                 * @event ds.threejs.ScrollLamp#complete
                 */
                _self.ds({type: 'complete'});
                //加载完成，创建场景，如果已经创建过不会再创建
                _self.createScene();

            },
            //全部加载进度
            function (progress) {

                /**
                 * 资源加载进度
                 * @event ds.threejs.ScrollLamp#progress
                 * @property {number} progress - 进度值
                 */
                _self.ds({type: 'progress', progress: progress});

            },
            //单个材质加载完成
            function (data) {

                /**
                 * 单个纹理材质加载完成
                 * @event ds.threejs.ScrollLamp#fileLoad
                 * @property {object} data - 单个纹理材质加载对象
                 * ```js
                 * //纹理材质
                 * data.texture
                 * //图片路径
                 * data.src
                 * //加载的id
                 * data.id
                 * ```
                 */
                _self.ds({type: 'fileLoad', data: data});

            });

    }


    /**
     * 添加到加载材质list。在create前就传入，有助控制加载资源的顺序
     * @param {string} src 加载资源url
     */
    addTextureList(src) {

        if (!src) return;
        if (this._loadTextureURLList.indexOf(src) === -1) {

            let _loadData = {
                src: src,
                id: src
            };

            this._loadTextureList.push(_loadData);
            this._loadTextureURLList.push(src);

        }

    }

    get rotation() {
        return this._rotation;
    }

    set rotation(value) {

        // console.log('rotation:',value);
        this._rotation = value;

        this.view.rotation.y = Math.PI / 180 * this._rotation;

    }


}


let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
ds.threejs = ds.threejs || {};

ds.threejs.ScrollLamp = ScrollLamp;

export default ScrollLamp;