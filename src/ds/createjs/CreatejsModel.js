import EventDispatcher from '../core/EventDispatcher';

/**
 * 一个快速构建Createjs框架模块类
 * @class
 * @memberof ds.createjs
 */
class CreatejsModel extends EventDispatcher
{
    /**
     * 渲染是否暂停
     */
    pause=false;

    /**
     * 构造函数，初始化创建一个快速使用createjs模块
     * @param {CanvasElement} [canvas = undefined] 一个canvas对象
     */
    constructor(canvas)
    {

        super();

        this.canvas = canvas ? canvas : document.createElement("canvas");

        this.stage = new createjs.Stage(canvas);
        this.stage.createjsModel = this;
        this.stage.update();

        this.canvas.createjsModel = this;


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

        let _self=this;
        createjs.Ticker.addEventListener("tick", function () {
            _self.update();
        });

    }



    /**
     * 设置fps帧数
     * @param {number} value 一般会设置30帧每秒
     */
    setFPS(value){
        createjs.Ticker.setFPS(value);
    }


    /**
     * 场景刷新
     */
    update(){

        if (this.pause) return;
        this.stage.update();

    }

    /**
     * 设置场景大小
     * @param {number} width 场景宽
     * @param {number} height 场景高
     */
    size(width,height){

        this.canvas.setAttribute('width', width);
        this.canvas.setAttribute('height', height);

    }
}

export default CreatejsModel;

