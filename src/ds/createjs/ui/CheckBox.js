import EventDispatcher from '../../core/EventDispatcher';
import {getDefault, getHTMLElement} from '../../utils/Mixin';

/**
 * 双向选择按钮
 */
class CheckBox extends EventDispatcher {

    constructor(skin, bool = false) {

        super();
        this._skin = skin;

        this._skin.mouseChildren=false;

        this._select=null;
        this.select = bool;


        this._skin.on('click',()=>{
            this._click();
        });

        console.log('this.select:',this.select);
    }

    _click(){
        this.select = !this.select;
    }

    /**
     * 设置选择
     * @param bool
     */
    set select(bool) {
        if(this._select === bool)return;

        this._select = bool;
        if (this._select) {
            // this._skin.gotoAndStop(this._skin.totalFrames - 1);
            ds.createjs.movieTo(this._skin,(this._skin.totalFrames - 1));
        } else {
            ds.createjs.movieTo(this._skin,0);
            // this._skin.gotoAndStop(0);
        }

        this.ds('update');
    }

    /**
     * 选择状态
     * @return {Boolean}
     */
    get select() {
        return this._select;
    }
}


let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds ? root.ds : {};
ds.createjs = ds.createjs ? ds.createjs : {};
ds.createjs.ui = ds.createjs.ui ? ds.createjs.ui : {};
ds.createjs.ui.CheckBox = CheckBox;

export default CheckBox;