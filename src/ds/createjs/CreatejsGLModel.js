import EventDispatcher from '../core/EventDispatcher';

/**
 * 快速构建Createjs 带 WebGL渲染 框架模块类
 * @class
 * @memberof ds.createjs
 * @requires module:libs/createjs/createjs1.0.0.min.js
 * @requires module:ds/core/EventDispatcher.js
 */
class CreatejsGLModel extends EventDispatcher
{

    /**
     * 构建带双canvas的 支持webgl的createjs项目结构
     */
    constructor() {
        super();

        /**
         * 渲染是否暂停，默认值是不暂停渲染
         * @member {boolean}
         * @default false
         */
        this.pause = false;

        /**
         * 2d canvas对象
         * @member {CanvasElement}
         */
        this.canvas = document.createElement("canvas");

        /**
         * 2d canvas对象
         * 等同于this.canvas
         * @member {CanvasElement}
         */
        this.canvas2d = this.canvas;

        /**
         * 舞台对象2d
         * @member {createjs.Stage}
         */
        this.stage = new createjs.Stage(this.canvas2d);
        this.stage.createjsModel = this;
        this.stage.update();

        /**
         * 舞台对象2d
         * 等同于this.stage
         * @member {createjs.Stage}
         */
        this.stage2d=this.stage;
        this.stage2d.name='stage2d';

        this.canvas.createjsModel = this;

        /**
         * 主场景容器 2d
         * @member {createjs.Container}
         */
        this.root = new createjs.Container();
        this.root.name = 'root2d';
        this.root.createjsModel = this;

        /**
         * 主场景容器 2d
         * 等同于this.root
         * @member {createjs.Container}
         */
        this.root2d=this.root;

        this.stage.root = this.root;
        this.stage.addChild(this.root);

        this.stage.enableMouseOver(30);

        createjs.Touch.enable(this.stage);

        this.stage.mouseMoveOutside = true;
        this.stage.mouseInBounds = true;


        //----------------------3d 部分------------------------
        /**
         * 3d canvas对象
         * @member {CanvasElement}
         */
        this.canvas3d = document.createElement("canvas");

        /**
         * 舞台对象3d
         * @member {createjs.Stage}
         */
        this.stage3d = new createjs.StageGL(this.canvas3d,{antialias: true});
        this.stage3d.createjsModel = this;
        this.stage3d.update();

        this.stage3d.name='stage3d';

        this.canvas3d.createjsModel = this;

        /**
         * 主场景容器 3d
         * @member {createjs.Container}
         */
        this.root3d = new createjs.Container();
        this.root3d.name = 'root3d';
        this.root3d.createjsModel = this;

        this.stage3d.root = this.root3d;
        this.stage3d.addChild(this.root3d);

        this.stage3d.enableMouseOver(false);

        //把2d舞台鼠标事件传给3d舞台
        this.stage.nextStage = this.stage3d;


        createjs.MotionGuidePlugin.install();

        createjs.Ticker.on("tick", this.update, this);

    }

    /**
     * 设置fps帧数
     * @param {number} value 一般会设置30帧每秒
     */
    setFPS(value) {

        createjs.Ticker.getMeasuredFPS(value);

    }

    /**
     * 场景刷新
     */
    update() {

        if (this.pause) return;

        this.stage3d.update();
        this.stage.update();

    }

    /**
     * 设置场景大小
     * @param {number} width 场景宽
     * @param {number} height 场景高
     */
    size(width, height) {

        try{

            this.canvas2d.setAttribute('width', width);
            this.canvas2d.setAttribute('height', height);

            this.canvas3d.setAttribute('width', width);
            this.canvas3d.setAttribute('height', height);

            this.stage3d.updateViewport(width, height);

        }
        catch (e){

            alert(e);

        }

    }

    /**
     * 添加到dom列表内
     * @param domBox
     */
    appendTo(domBox){

        try{

            if (typeof domBox === 'string'){

                document.getElementById(domBox).appendChild(this.canvas3d);
                document.getElementById(domBox).appendChild(this.canvas2d);

            }
            else if (domBox instanceof HTMLElement){

                domBox.appendChild(this.canvas3d);
                domBox.appendChild(this.canvas2d);

            }
            else if (domBox[0] instanceof HTMLElement){

                domBox[0].appendChild(this.canvas3d);
                domBox[0].appendChild(this.canvas2d);

            }
            else console.warn('未获取到domBox相关DOM对象，无法添加到DOM列表内:', domBox);

        }
        catch (e){

            alert(e);

        }


    }

}


let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
ds.createjs = ds.createjs || {};
ds.createjs.CreatejsGLModel=CreatejsGLModel;

export default CreatejsGLModel;