import EventDispatcher from '../core/EventDispatcher';

/**
 * 一个快速构建Pixijs框架模块类
 * @class
 * @memberof ds.pixijs
 * @requires module:libs/pixijs/pixijs.js
 * @requires module:libs/pixijs/pixijsanimate.js
 * @requires module:libs/pixijs/pixi-projection.min.js
 */
class PixiModel extends EventDispatcher {

    /**
     * 构造函数，初始化创建一个快速使用createjs模块
     * @param  {object} opts Pixijs模块初始化参数
     * @param  {string} [opts.appendTo=undefined] 需要添加到dom容器，默认未空传到body节点下，如果''不做操作添加
     * @param  {number} [opts.width=640] canvas宽
     * @param  {number} [opts.height=1140] canvas宽
     * @param  {object} [opts.css=undefined] 需要对canvas设置什么css,一个object对象。需要jquery或者zepto支持
     * @param  {boolean} [opts.autoStart=true] 构建完成自动渲染
     * @param  {boolean} [opts.transparent=true] 是否支持透明通道
     * @param  {boolean} [opts.antialias=false] 支持平滑
     * @param  {boolean} [opts.preserveDrawingBuffer=false] 启用绘图缓冲区保存，如果需要在webgl上下文调用toDataUrl，则启用此方法
     * @param  {number} [opts.resolution=1] 渲染器的分辨率/设备像素比
     * @param  {boolean} [opts.forceCanvas=false]  设置true,就不会启动webgl渲染
     * @param  {number} [opts.backgroundColor=0x0]  背景色
     * @param  {boolean} [opts.clearBeforeRender=true] 渲染前清空之前渲染
     * @param  {boolean} [opts.sharedLoader=false] 是否用共享的loader
     * @param  {boolean} [opts.sharedTicker=false] 是否用共享的ticker
     */
    constructor(opts) {


        super();

        let _self = this;

        opts = opts || {};

        let _width = opts.width ? opts.width : 640;
        let _height = opts.height ? opts.height : 1140;
        let _fps = opts.fps ? opts.fps : 30;
        let _autoStart = opts.autoStart !== undefined ? opts.autoStart : true;
        let _transparent = opts.transparent !== undefined ? opts.transparent : true;//是否透明
        let _antialias = opts.antialias !== undefined ? opts.antialias : false;//是否抗锯齿 目前chrome支持
        let _preserveDrawingBuffer = opts.preserveDrawingBuffer !== undefined ? opts.preserveDrawingBuffer : false;//是否启用绘图缓冲区保存
        let _resolution = opts.resolution !== undefined ? opts.resolution : 1;//renderer 时候是否使用device pixel 可以使用如 2
        let _forceCanvas = opts.forceCanvas !== undefined ? opts.forceCanvas : false;//是否不使用webgl渲染
        let _backgroundColor = opts.backgroundColor !== undefined ? opts.backgroundColor : 0x0;
        let _clearBeforeRender = opts.clearBeforeRender !== undefined ? opts.clearBeforeRender : true;
        let _legacy = opts.legacy !== undefined ? opts.legacy : true;//考虑到旧的/不太先进的设备兼容可以设置成true,只需要webgl可以是 false;
        let _sharedLoader = opts.sharedLoader !== undefined ? opts.sharedLoader : false;
        let _sharedTicker = opts.sharedTicker !== undefined ? opts.sharedTicker : false;
        let _appendTo = opts.appendTo ? opts.appendTo : '';

        let _app = new PIXI.Application({
            width: _width,
            height: _height,
            autoStart: _autoStart,
            transparent: _transparent,
            antialias: _antialias,
            preserveDrawingBuffer: _preserveDrawingBuffer,
            resolution: _resolution,
            forceCanvas: _forceCanvas,
            backgroundColor: _backgroundColor,
            clearBeforeRender: _clearBeforeRender,
            legacy: _legacy,
            sharedLoader: _sharedLoader,
            sharedTicker: _sharedTicker,
        });

        this.app = _app;
        this.canvas = _app.view;
        this.stage = _app.stage;
        this.root = new PIXI.Container();
        this.stage.addChild(this.root);
        this.renderer = _app.renderer;
        this.screen = _app.screen;
        this.loader = _app.loader;
        this.ticker = _app.ticker;
        this.ticker = _app.ticker;

        //如果有css参数，按参数进行设置
        if (opts.css !== undefined)  $(this.canvas).css(opts.css);

        if (_appendTo !== '') {

            if (typeof _appendTo === 'string') {

                if (_appendTo.indexOf('#') === 0) _appendTo = _appendTo.slice(1);
                document.getElementById(_appendTo).appendChild(this.canvas);

            }
            else if (_appendTo instanceof HTMLElement) {

                _appendTo.appendChild(this.canvas);

            }
            else if (_appendTo[0] instanceof HTMLElement) {

                _appendTo[0].appendChild(this.canvas);

            }
            else {

                console.warn('opts.appendTo 参数非法');
                document.body.appendChild(this.canvas);

            }

        }
        else {

            document.body.appendChild(this.canvas);

        }

        _app.ticker.add(function (delta) {
            _self.emit('update', delta);
        });

    }

    /**
     * 设置场景大小
     * @param {number} width 场景宽
     * @param {number} height 场景高
     */
    size(width, height) {

        this.app.renderer.resize(width, height);

    }

}

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};

ds.pixijs = ds.pixijs || {};

ds.pixijs.PixiModel = PixiModel;

export default PixiModel;