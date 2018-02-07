
/**
 * 万花筒
 */
class KaleidoscopeContainer {

    constructor(image, opts) {
        opts = opts || {};
        let _self = this;

        this._image = image;
        this._width = opts.width || 1235;
        this._height = opts.height || 640;
        this._scale = opts.scale || 0.75;
        this._autoRotation = opts.auto !==undefined?opts.auto:false;
        this._view = new createjs.Container();

        //是否竖屏
        this._isVertical = true;
        //计算长 宽
        if (this._width > this._height) {
            this._isVertical = false;
            this._long = this._width;
            this._wide = this._height
        } else {
            this._long = this._height;
            this._wide = this._width
        }
        this._darwShot();

        createjs.Ticker.on("tick", ()=>{
            if(!this._autoRotation)return;
            this._defaultShotBox.rotation+=0.5;
        }, this);

    }

    /**
     * 默认镜头
     * @private
     *
     * _________________________
     * |   \       |       /    |
     * |    \   7  |  4   /     |
     * |  3  \     |     /  1   |
     * --------------------------
     * |     /     |     \      |
     * |  2 /    6 | 5    \ 0   |
     * |   /       |       \    |
     * __________________________
     */
    _darwShot() {
        this._defaultShotBox = new createjs.Container();
        this._defaultShotBox.scaleX = this._defaultShotBox.scaleY = this._scale;
        this._defaultShots = [];
        let _diff=1;
        for (let i = 0; i < 8; i++) {
            let _box = this._darwMaskBox();
            this._defaultShotBox.addChild(_box);
            this._defaultShots.push(_box);
            if (i === 0) {
                _box.x = -_diff;
                _box.y = -_diff;
            }
            if (i === 1) {
                _box.scaleY = -1;
                _box.x = -_diff;
                _box.y = _diff;
            }
            if (i === 2) {
                _box.scaleX = -1;
                _box.x = _diff*2;
                _box.y = -_diff;
            }
            if (i === 3) {
                _box.scaleY = -1;
                _box.scaleX = -1;
                _box.x = _diff*2;
                _box.y = _diff;
            }
            if (i === 4) {
                _box.scaleY = -1;
                _box.scaleX = -1;
                _box.rotation = 90;
                _box.x = _diff;
                _box.y = _diff;
            }
            if(i===5){
                _box.scaleX=-1;
                _box.rotation=-90;
                _box.y = -_diff;
            }
            if(i===6){
                _box.rotation=90;
                _box.y = -_diff;
                _box.x = _diff;
            }
            if(i===7){
                _box.scaleX=-1;
                _box.rotation=90;
                _box.y = _diff*2;
                _box.x = _diff*2;
            }
        }
        this._view.addChild(this._defaultShotBox);
    }

    /**
     * 绘制遮罩容器
     * @private
     */
    _darwMaskBox() {
        // console.log('_darwMaskBox',this._isVertical);
        let _box = new createjs.Container();
        let _btimap = new createjs.Bitmap();
        _btimap.image = this._image;
        _box.addChild(_btimap);
        let _shape = new createjs.Shape();
        let _g = _shape.graphics;
        // _box.addChild(_shape);
        _btimap.mask = _shape;
        //长
        let _long = this._long;
        //宽
        let _wide = this._wide;
        if (!this._isVertical) {
            let _w = _wide + (_long - _wide) / 2>>0;
            console.log('_darwMaskBox', _w, _wide);
            _g.beginFill('0x0');
            _g.moveTo(0, 0);
            _g.lineTo(_w, 0);
            _g.lineTo(_w, _wide);
            _g.lineTo(_wide, _wide);
            _g.lineTo(0, 0);
            _g.endFill();
            _btimap.x=-(_long - _wide) / 2;
        } else {
            let _w = _wide + (_long - _wide) / 2;
            _g.beginFill('0x0');
            _g.moveTo(0, 0);
            _g.lineTo(0, _w);
            _g.lineTo(_wide, _w);
            _g.lineTo(_wide, _wide);
            _g.lineTo(0, 0);
            _g.endFill();
            _btimap.y=-(_long - _wide) / 2;
        }
        return _box;
    }

    /**
     * 是否竖屏画面材质
     * @return {boolean}
     */
    get isVertical() {
        return this._isVertical;
    }

    get view() {
        return this._view;
    }

}

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds ? root.ds : {};
ds.createjs = ds.createjs ? ds.createjs : {};
ds.createjs.effect = ds.createjs.effect ? ds.createjs.effect : {};
ds.createjs.effect.KaleidoscopeContainer = KaleidoscopeContainer;

export default KaleidoscopeContainer;