/**
 * 映射变形 对face对象进行映射变形 结合createjs.Shape遮罩来实现
 * 优点：可以快速实现动画元素的遮罩，也可以是图片
 * 缺点：很明显动画元素性能堪忧
 * @class
 * @memberof ds.createjs.effect
 */
class AffineTransformContainer {

    constructor() {

        this._object = null;
        this._container = new createjs.Container();
        this._width = 0;
        this._height = 0;
        this._points = [];
        this._originalPoints = [];
        this._faces = [];
    }

    /**
     * 添加映射变形对象
     * @param {*} obj
     * - string 类型 可以是一个base64图片数据，也可以是图片链接地址
     * - object 类型
     * obj.obj 一个显示对象createjs.DisplayObject
     * obj.width 宽
     * obj.height 高
     * @param {function} callback 初始化完成后对象
     */
    addObject(obj, callback) {
        let _self = this;
        if (typeof obj === 'string') {
            let _image = new Image();
            _image.onload = function () {
                _self._width = _image.width;
                _self._height = _image.height;
                _self._calcAffine(callback);
            };
            _image.src = obj;
            this._object = new createjs.Bitmap(_image);
        }
        else if (obj instanceof Image) {
            let _image = obj;
            this._object = new createjs.Bitmap(_image);
            if (!_image.complete) {
                _image.onload = function () {
                    _self._width = _image.width;
                    _self._height = _image.height;
                    _self._calcAffine(callback);
                };
            } else {
                _self._width = _image.width;
                _self._height = _image.height;
                _self._calcAffine(callback);
            }
        }
        else if (obj.obj && obj.width && obj.height && (obj.obj instanceof createjs.DisplayObject)) {
            this._width = obj.width;
            this._height = obj.height;
            this._object = obj.obj;
            this._calcAffine(callback);
        } else {
            console.error('传入映射变形对象错误');
        }
    }

    /**
     * 映射关系计算
     * @param callback
     * @private
     */
    _calcAffine(callback) {
        let _container = this._container;
        _container.removeAllChildren();
        let _w = this._width, _h = this._height;
        // p0 - p2
        // |  /  |
        // p1 - p3
        let _points = this._points = [];
        let _originalPoints = this._originalPoints = [];
        let _faces = this._faces = [];
        let i, j, _num = 1;
        let _vertices = [];
        let _indices = [];
        //顶点数据
        for (i = 0; i <= _num; i++) {
            for (j = 0; j <= _num; j++) {
                _vertices.push(i * (_w / _num), j * (_h / _num));
            }
        }
        //原始节点
        for (i = 0; i < _vertices.length; i += 2) {
            _originalPoints.push({x: _vertices[i], y: _vertices[i + 1]});
        }
        //控制节点
        _originalPoints.forEach((pt, index) => {
            _points[index] = {x: pt.x, y: pt.y};
        });
        //三角面指数索引
        for (i = 0; i < _num; i++) {
            for (j = 0; j < _num; j++) {
                _indices.push(i * (_num + 1) + j, (i + 1) * (_num + 1) + j, i * (_num + 1) + j + 1);
                _indices.push((i + 1) * (_num + 1) + j, i * (_num + 1) + j + 1, (i + 1) * (_num + 1) + j + 1);
            }
        }
        //三角面
        for (i = 0; i < _indices.length; i += 3) {
            // let _face=[
            //     _points[_indices[i]],
            //     _points[_indices[i+ 1]],
            //     _points[_indices[i+ 2]]
            // ];
            let _face=[
                _indices[i],
                _indices[i+ 1],
                _indices[i+ 2]
            ];
            _faces.push(_face);
        }

        let _object=this._object;
        let _class=_object.constructor;
        if(window.navigator.userAgent.toLowerCase().indexOf('chrome') < 0) {
            _faces.forEach((face) => {
                let bmp;
                if(_object instanceof createjs.Bitmap ){
                    bmp=_object.clone();
                }else{
                    bmp=new _class();
                }
                let shape = new createjs.Shape();

                //Chrome以外浏览器会破面，进行优化处理
                let n = 1.01;
                let g = {
                    x: (_points[face[0]].x + _points[face[1]].x + _points[face[2]].x) / 3,
                    y: (_points[face[0]].y + _points[face[1]].y + _points[face[2]].y) / 3
                };//重心
                let d = {x: g.x * (n - 1), y: g.y * (n - 1)};//座標のずれ

                shape.graphics.moveTo(_points[face[0]].x * n - d.x, _points[face[0]].y * n - d.y)
                    .lineTo(_points[face[1]].x * n - d.x, _points[face[1]].y * n - d.y)
                    .lineTo(_points[face[2]].x * n - d.x, _points[face[2]].y * n - d.y);
                bmp.mask = shape;
                this._container.addChild(bmp);
            });
        } else {
            // console.log("chrome");
            _faces.forEach((face) => {
                let bmp;
                if(_object instanceof createjs.Bitmap ){
                    bmp=_object.clone();
                }else{
                    bmp=new _class();
                }
                let shape = new createjs.Shape();

                shape.graphics.moveTo(_points[face[0]].x, _points[face[0]].y)
                    .lineTo(_points[face[1]].x, _points[face[1]].y)
                    .lineTo(_points[face[2]].x, _points[face[2]].y);
                bmp.mask = shape;
                this._container.addChild(bmp);
            });
        }

        if(callback)callback();
    }

    /**
     * 更新控制节点后的映射渲染关系
     * @return {ds.createjs.effect.AffineTransformContainer}
     */
    update(){
        this._faces.forEach((face, index) => {
            let points1 = [this._originalPoints[face[0]], this._originalPoints[face[1]], this._originalPoints[face[2]]];
            let points2 = [this._points[face[0]], this._points[face[1]], this._points[face[2]]];
            let matrix = this._getAffineTransform(points1, points2);
            this._container.children[index].transformMatrix = this._container.children[index].mask.transformMatrix = matrix;
        });
        return this;
    }

    /**
     * 映射矩阵算法
     * @param pts1
     * @param pts2
     * @return {Matrix2D}
     * @private
     */
    _getAffineTransform(pts1, pts2) {
        let a, b, c, d, tx, ty;

        //扭曲变形计算
        a = (pts2[0].x * pts1[1].y + pts2[1].x * pts1[2].y + pts2[2].x * pts1[0].y - pts2[0].x * pts1[2].y - pts2[1].x * pts1[0].y - pts2[2].x * pts1[1].y) / (pts1[0].x * pts1[1].y + pts1[1].x * pts1[2].y + pts1[2].x * pts1[0].y - pts1[0].x * pts1[2].y - pts1[1].x * pts1[0].y - pts1[2].x * pts1[1].y);
        b = (pts2[0].y * pts1[1].y + pts2[1].y * pts1[2].y + pts2[2].y * pts1[0].y - pts2[0].y * pts1[2].y - pts2[1].y * pts1[0].y - pts2[2].y * pts1[1].y) / (pts1[0].x * pts1[1].y + pts1[1].x * pts1[2].y + pts1[2].x * pts1[0].y - pts1[0].x * pts1[2].y - pts1[1].x * pts1[0].y - pts1[2].x * pts1[1].y);
        c = (pts1[0].x * pts2[1].x + pts1[1].x * pts2[2].x + pts1[2].x * pts2[0].x - pts1[0].x * pts2[2].x - pts1[1].x * pts2[0].x - pts1[2].x * pts2[1].x) / (pts1[0].x * pts1[1].y + pts1[1].x * pts1[2].y + pts1[2].x * pts1[0].y - pts1[0].x * pts1[2].y - pts1[1].x * pts1[0].y - pts1[2].x * pts1[1].y);
        d = (pts1[0].x * pts2[1].y + pts1[1].x * pts2[2].y + pts1[2].x * pts2[0].y - pts1[0].x * pts2[2].y - pts1[1].x * pts2[0].y - pts1[2].x * pts2[1].y) / (pts1[0].x * pts1[1].y + pts1[1].x * pts1[2].y + pts1[2].x * pts1[0].y - pts1[0].x * pts1[2].y - pts1[1].x * pts1[0].y - pts1[2].x * pts1[1].y);
        tx = (pts1[0].x * pts1[1].y * pts2[2].x + pts1[1].x * pts1[2].y * pts2[0].x + pts1[2].x * pts1[0].y * pts2[1].x - pts1[0].x * pts1[2].y * pts2[1].x - pts1[1].x * pts1[0].y * pts2[2].x - pts1[2].x * pts1[1].y * pts2[0].x) / (pts1[0].x * pts1[1].y + pts1[1].x * pts1[2].y + pts1[2].x * pts1[0].y - pts1[0].x * pts1[2].y - pts1[1].x * pts1[0].y - pts1[2].x * pts1[1].y);
        ty = (pts1[0].x * pts1[1].y * pts2[2].y + pts1[1].x * pts1[2].y * pts2[0].y + pts1[2].x * pts1[0].y * pts2[1].y - pts1[0].x * pts1[2].y * pts2[1].y - pts1[1].x * pts1[0].y * pts2[2].y - pts1[2].x * pts1[1].y * pts2[0].y) / (pts1[0].x * pts1[1].y + pts1[1].x * pts1[2].y + pts1[2].x * pts1[0].y - pts1[0].x * pts1[2].y - pts1[1].x * pts1[0].y - pts1[2].x * pts1[1].y);

        return new createjs.Matrix2D(a, b, c, d, tx, ty);
    }

    /**
     * 这个显示对象
     * @return {createjs.Container|*}
     */
    get view() {
        return this._container;
    }

    /**
     * 控制节点
     * @return {Array}
     */
    get points(){
        return this._points;
    }

}


let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
ds.createjs = ds.createjs || {};
ds.createjs.effect = ds.createjs.effect || {};

ds.createjs.effect.AffineTransformContainer = AffineTransformContainer;


export default AffineTransformContainer;