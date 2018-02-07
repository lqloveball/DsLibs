import EventDispatcher from '../../core/EventDispatcher';

/**
 * 滚动条组件
 */
class ScrollPanel extends EventDispatcher {

    /**
     *
     * @param skin 需要控制皮肤
     * @param contentHeight  滚动的内容高度
     * @param boxHeight  容器高度
     * @param opts 其他配置
     */
    constructor(skin, contentHeight, boxHeight, opts) {
        super();
        opts = opts || {};
        this._skin = skin;

        this._contentHeight = contentHeight;
        this._height = boxHeight;


        //获取内容容器
        let _target;
        if (skin.content) _target = skin.content;
        else if (skin.box) _target = skin.box;
        else if (skin.info) _target = skin.info;
        else {
            console.warn('ScrollPanel no Has Child Name: "content" "box" ');
            return;
        }
        this._target = _target;
        this._target.y = 0;
        //滚动百分比
        this._proportionY = 0;


        this._skin.on('mousedown', (e) => {
            this._mousedown(e);
        }, this);

        this._lock = false;

        this._stage = null;
        this._startY = 0;
        this._startPt = null;
        this._startTime = null;

        this._movieing = false;

        this._autoProportion = 0.3;

    }

    _mousedown(e) {

        if (this.lock) return;
        if (this._movieing) return;
        let _stage = this._skin.stage;
        if (!_stage) return;
        this._startPt = this._skin.globalToLocal(_stage.mouseX, _stage.mouseY);
        this._startY = this._target.y;
        this._startTime = new Date().getTime();

        this._stage = _stage;
        this._stagemousemove = this.__stagemousemove.bind(this);
        this._stagemouseup = this.__stagemouseup.bind(this);
        _stage.addEventListener('stagemousemove', this._stagemousemove, this);
        _stage.addEventListener('stagemouseup', this._stagemouseup, this);


    }

    __stagemousemove(e) {
        if (this.lock) return;
        if (!this._stage) return;
        if (this._movieing) return;
        let _stage = this._stage;
        if (!_stage) return;
        let _pt = this._skin.globalToLocal(_stage.mouseX, _stage.mouseY);
        let _diffeY = _pt.y - this._startPt.y;
        let _y = this._startY + _diffeY;

        this._target.y = _y;
        this._upProportion();
    }

    __stagemouseup(e) {

        if (this.lock) return;
        if (!this._stage) return;
        if (this._movieing) return;
        let _self = this;
        let _stage = this._stage;
        if (!_stage) return;
        let _pt = this._skin.globalToLocal(_stage.mouseX, _stage.mouseY);
        let _endTime = new Date().getTime();
        if (_endTime - this._startTime <= 200) {
            //判断方向
            let _add = true;
            if (_pt.y > this._startPt.y) _add = false;
            let _dy = this._height/2;//this._autoProportion * this.scrollH;
            let _y = _add ? this._target.y - _dy : this._target.y + _dy;
            this._movieing = true;
            JT.to(this._target, 0.3, {
                y: _y,
                onUpdate:()=>{
                    _self._upProportion();
                },
                onEnd: () => {
                    _self._movieEnd();
                }
            })
        } else {
            _self._movieEnd();
        }

        _stage.removeEventListener('stagemousemove', this._stagemousemove);
        _stage.removeEventListener('stagemouseup', this._stagemouseup);
        this._stage = null;
        this._startPt = null;
        this._startTime = null;
    }

    _movieEnd() {
        this._movieing = true;
        let _self = this;
        if (this._target.y > 0) {
            this._target.y
            JT.to(this._target, 0.3, {
                y: 0,
                onUpdate:()=>{
                    _self._upProportion();
                },
                onEnd: () => {
                    _self._movieing = false;
                    _self._upProportion();
                }
            })
        }
        else if (this._target.y < -this.scrollH) {
            JT.to(this._target, 0.2, {
                y: -this.scrollH,
                onUpdate:()=>{
                    _self._upProportion();
                },
                onEnd: () => {
                    _self._movieing = false;
                    _self._upProportion();
                }
            })
        } else {
            _self._movieing = false;
            _self._upProportion();
        }
    }

    /**
     * 计算百分比
     * @private
     */
    _upProportion() {
        let _y = this._target.y;
        if (_y > 0) this._proportionY = 0;
        else if (_y < -this.scrollH) {
            this._proportionY = 1;
        }
        else {
            this._proportionY=_y/ -this.scrollH;

        }
        if(this._proportionY>=1)this._proportionY=1;
        if(this._proportionY<=0)this._proportionY=0;
        this.ds('update');

    }

    get proportionY(){
        return this._proportionY;
    }

    set lock(value) {
        this._lock = value;
    }

    get lock() {
        return this._lock;
    }

    /**
     * 可以滚动高度区域
     * @return {number}
     */
    get scrollH() {
        if (this._contentHeight <= this._height) return 0;
        return this._contentHeight - this._height
    }

    get skin() {
        return this._skin;
    }

}

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds ? root.ds : {};
ds.createjs = ds.createjs ? ds.createjs : {};
ds.createjs.ui = ds.createjs.ui ? ds.createjs.ui : {};
ds.createjs.ui.ScrollPanel = ScrollPanel;

export default ScrollPanel;