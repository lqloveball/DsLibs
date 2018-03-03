import EventDispatcher from '../core/EventDispatcher';

/**
 * 一个快速构建Createjs框架模块类
 * @class
 * @memberof ds.createjs
 * @requires module:libs/createjs/createjs0.8.2.min.js
 * @requires module:ds/core/EventDispatcher.js
 */
class CreatejsModel extends EventDispatcher {


    /**
     * 构造函数，初始化创建一个快速使用createjs模块
     * @param {CanvasElement} [canvas = undefined] 一个canvas对象
     */
    constructor(canvas) {

        super();

        /**
         * 渲染是否暂停，默认值是不暂停渲染
         * @member {boolean}
         * @default false
         */
        this.pause = false;

        /**
         * 渲染使用的canvas对象
         * @member {CanvasElement}
         */
        this.canvas = canvas ? canvas : document.createElement("canvas");


        /**
         * 舞台对象
         * @member {createjs.Stage}
         */
        this.stage = new createjs.Stage(canvas);

        this.stage.createjsModel = this;
        this.stage.update();

        this.canvas.createjsModel = this;

        /**
         * 主场景容器
         * @member {createjs.Container}
         */
        this.root = new createjs.Container();
        this.root.name = 'root';
        this.root.createjsModel = this;

        this.stage.root = this.root;
        this.stage.addChild(this.root);

        this.stage.enableMouseOver(30);

        createjs.Touch.enable(this.stage);

        this.stage.mouseMoveOutside = true;
        this.stage.mouseInBounds = true;


        createjs.MotionGuidePlugin.install();

        this.tempBox=new createjs.Container();
        this.tempBox.x=100000;
        this.tempBox.y=100000;
        this.stage.addChild(this.tempBox);

        // createjs.Ticker.on("tick", this._tickEvent,this);
        this._addTick();

    }

    _tickEvent() {
        this.update();
    }

    _addTick() {
        createjs.Ticker.on("tick", this._tickEvent, this);
    }

    _removeTick() {
        createjs.Ticker.off("tick", this._tickEvent);
    }


    /**
     * 设置fps帧数
     * @param {number} value 一般会设置30帧每秒
     */
    setFPS(value) {

        //console.log(createjs.EaselJS.version.indexOf('1')===0 );

        if (createjs.EaselJS.version.indexOf('1') === 0) {
            createjs.Ticker.getMeasuredFPS(value);
        } else {
            createjs.Ticker.setFPS(value);
        }

    }


    /**
     * 场景刷新
     */
    update() {

        if (this.pause) return;
        this.stage.update();


    }

    /**
     * 设置场景大小
     * @param {number} width 场景宽
     * @param {number} height 场景高
     */
    size(width, height) {

        this.canvas.setAttribute('width', width);
        this.canvas.setAttribute('height', height);

    }

    /**
     * 添加到dom列表内
     * @param domBox
     */
    appendTo(domBox) {

        if (typeof domBox === 'string') document.getElementById(domBox).appendChild(this.canvas);
        else if (domBox instanceof HTMLElement) domBox.appendChild(this.canvas);
        else if (domBox[0] instanceof HTMLElement) domBox[0].appendChild(this.canvas);
        else console.warn('未获取到domBox相关DOM对象，无法添加到DOM列表内:', domBox);

    }


}

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds ?root.ds: {};
ds.createjs = ds.createjs?ds.createjs: {name:'createjs'};
ds.createjs.CreatejsModel = CreatejsModel;



export default CreatejsModel;

