/**
 * 映射变形绘制 createjs.Shape基于Graphics命令来进行绘制，通过算法解决衔接处破面
 * @class
 * @memberof ds.createjs.effect
 */
class AffineTransformShape {
    /**
     *
     * @param {createjs.Shape} shape 如果不设置会自动创建一个createjs.Shape
     */
    constructor(shape) {

        let _shape = shape || new createjs.Shape();
        this._shape = _shape;
        this._segments = 1;
        this._image = null;

        this._vertices = [];
        this._uv = [];
        this._nodes = [];
        this._indices = [];
        this._cx = 0;
        this._cy = 0;

    }

    /**
     * 计算映射关系
     * @private
     */
    _calcAffine() {

        let _vertices = this._vertices = [];
        let _uv = this._uv = [];
        let _nodes = this._nodes = [];
        let _indices = this._indices = [];
        let _w = this._image.width;
        let _h = this._image.height;
        let _num = this._segments;
        let i, j;
        //顶点数据
        for (i = 0; i <= _num; i++) {
            for (j = 0; j <= _num; j++) {
                _vertices.push(i * (_w / _num), j * (_h / _num));
            }
        }
        //节点数据
        for (i = 0; i < _vertices.length; i += 2) {
            _nodes.push({x: _vertices[i], y: _vertices[i + 1]});
        }
        //三角面映射索引
        for (i = 0; i < _num; i++) {
            for (j = 0; j < _num; j++) {
                _indices.push(i * (_num + 1) + j, (i + 1) * (_num + 1) + j, i * (_num + 1) + j + 1);
                _indices.push((i + 1) * (_num + 1) + j, i * (_num + 1) + j + 1, (i + 1) * (_num + 1) + j + 1);
            }
        }
        //uv数据
        for (i = 0; i <= _num; i++) {
            for (j = 0; j <= _num; j++) {
                _uv.push(i / _num, j / _num);
            }
        }

    }

    /**
     * 绘制
     * @private
     */
    _draw() {
        let _cx = this._cx, _cy = this._cy;
        let _img = this._image;
        let _indices = this._indices;
        let _vertices = this._vertices;
        let _uv = this._uv;
        let _shape = this._shape;
        let _g = _shape.graphics;
        let _w, _h, _t1, _t2, _t3, _t4;
        let _v = [], i, l = _indices.length;
        for (i = 0; i < _vertices.length; i++) _v.push(_vertices[i]);

        _g.clear();
        if (window.navigator.userAgent.toLowerCase().indexOf('chrome') < 0){
            let n = 1.01;
            for (i = 0; i < l; i += 3) {
                let _mx2d = new createjs.Matrix2D();
                let g = {
                    x: (_v[_indices[i] * 2] +_v[_indices[i + 1] * 2] + _v[_indices[i + 2] * 2]) / 3,
                    y: ( _v[_indices[i] * 2 + 1] + _v[_indices[i + 1] * 2 + 1] + _cx, _v[_indices[i + 2] * 2 +1]) / 3
                };
                let d = {x: g.x * (n - 1), y: g.y * (n - 1)};
                if (i % 6 === 0) {
                    _w = (_uv[_indices[i + 1] * 2] - _uv[_indices[i] * 2]) * _img.width;
                    _h = (_uv[_indices[i + 2] * 2 + 1] - _uv[_indices[i] * 2 + 1]) * _img.height;
                    _mx2d.a = (_v[_indices[i + 1] * 2] - _v[_indices[i] * 2]) / _w;
                    _mx2d.b = (_v[_indices[i + 1] * 2 + 1] - _v[_indices[i] * 2 + 1]) / _w;
                    _mx2d.c = (_v[_indices[i + 2] * 2] - _v[_indices[i] * 2]) / _h;
                    _mx2d.d = (_v[_indices[i + 2] * 2 + 1] - _v[_indices[i] * 2 + 1]) / _h;
                    _mx2d.tx = _v[_indices[i] * 2] + _cx;
                    _mx2d.ty = _v[_indices[i] * 2 + 1] + _cy;
                } else {
                    _w = (_uv[_indices[i + 2] * 2] - _uv[_indices[i + 1] * 2]) * _img.width;
                    _h = (_uv[_indices[i + 2] * 2 + 1] - _uv[_indices[i] * 2 + 1]) * _img.height;
                    _mx2d.a = (_v[_indices[i + 2] * 2] - _v[_indices[i + 1] * 2]) / _w;
                    _mx2d.b = (_v[_indices[i + 2] * 2 + 1] - _v[_indices[i + 1] * 2 + 1]) / _w;
                    _mx2d.c = (_v[_indices[i + 2] * 2] - _v[_indices[i] * 2]) / _h;
                    _mx2d.d = (_v[_indices[i + 2] * 2 + 1] - _v[_indices[i] * 2 + 1]) / _h;
                    _mx2d.tx = _v[_indices[i + 1] * 2] + _cx;
                    _mx2d.ty = _v[_indices[i + 1] * 2 + 1] + _cy;
                }
                _g.beginBitmapFill(_img, 'repeat', _mx2d);
                _g.moveTo(_v[_indices[i] * 2] * n - d.x + _cx, _v[_indices[i] * 2 + 1] * n - d.y + _cy);
                _g.lineTo(_v[_indices[i + 1] * 2]* n - d.x  + _cx, _v[_indices[i + 1] * 2 + 1]* n - d.y  + _cy);
                _g.lineTo(_v[_indices[i + 2] * 2]* n - d.x  + _cx, _v[_indices[i + 2] * 2 + 1] * n - d.y + _cy);
                _g.endStroke();
                _g.closePath();
                _g.endFill();
            }
        }else{
            for (i = 0; i < l; i += 3) {
                let _mx2d = new createjs.Matrix2D();
                if (i % 6 === 0) {
                    _w = (_uv[_indices[i + 1] * 2] - _uv[_indices[i] * 2]) * _img.width;
                    _h = (_uv[_indices[i + 2] * 2 + 1] - _uv[_indices[i] * 2 + 1]) * _img.height;
                    _mx2d.a = (_v[_indices[i + 1] * 2] - _v[_indices[i] * 2]) / _w;
                    _mx2d.b = (_v[_indices[i + 1] * 2 + 1] - _v[_indices[i] * 2 + 1]) / _w;
                    _mx2d.c = (_v[_indices[i + 2] * 2] - _v[_indices[i] * 2]) / _h;
                    _mx2d.d = (_v[_indices[i + 2] * 2 + 1] - _v[_indices[i] * 2 + 1]) / _h;
                    _mx2d.tx = _v[_indices[i] * 2] + _cx;
                    _mx2d.ty = _v[_indices[i] * 2 + 1] + _cy;
                } else {
                    _w = (_uv[_indices[i + 2] * 2] - _uv[_indices[i + 1] * 2]) * _img.width;
                    _h = (_uv[_indices[i + 2] * 2 + 1] - _uv[_indices[i] * 2 + 1]) * _img.height;
                    _mx2d.a = (_v[_indices[i + 2] * 2] - _v[_indices[i + 1] * 2]) / _w;
                    _mx2d.b = (_v[_indices[i + 2] * 2 + 1] - _v[_indices[i + 1] * 2 + 1]) / _w;
                    _mx2d.c = (_v[_indices[i + 2] * 2] - _v[_indices[i] * 2]) / _h;
                    _mx2d.d = (_v[_indices[i + 2] * 2 + 1] - _v[_indices[i] * 2 + 1]) / _h;
                    _mx2d.tx = _v[_indices[i + 1] * 2] + _cx;
                    _mx2d.ty = _v[_indices[i + 1] * 2 + 1] + _cy;
                }
                _g.beginBitmapFill(_img, 'repeat', _mx2d);
                _g.moveTo(_v[_indices[i] * 2]  + _cx, _v[_indices[i] * 2 + 1]  + _cy);
                _g.lineTo(_v[_indices[i + 1] * 2]  + _cx, _v[_indices[i + 1] * 2  + 1] + _cy);
                _g.lineTo(_v[_indices[i + 2] * 2]  + _cx, _v[_indices[i + 2] * 2  + 1] + _cy);
                _g.endStroke();
                _g.closePath();
                _g.endFill();

            }
        }

    }

    /**
     * 根据节点进行更新顶点 并映射渲染
     * @param {array} nodes
     */
    updateVerticesByNodes(nodes) {

        let _vertices = this._vertices;
        for (let i = 0; i < nodes.length; i++) {
            _vertices[i * 2] = nodes[i].x;
            _vertices[i * 2 + 1] = nodes[i].y;
        }
        this._draw();

    }

    /**
     * 设置画布渲染图片
     * @param {Image|string} image
     * @param {function} callback
     */
    setImage(image, callback) {
        let _self = this;
        if (image) {
            if (typeof image === 'string') {
                let _image = new Image();
                _image.src = image;
                _image.onload = function () {
                    _self._calcAffine();
                    _self._draw();
                    if (callback) callback();
                };
                this._image = _image;
            } else {
                this._image = image;
                _self._calcAffine();
                this._draw();
                if (callback) callback();
            }
        }
    }

    /**
     * 渲染图片
     * @return {Image|string}
     */
    get image() {
        return this._image;
    }

    /**
     * 顶点数据
     * @return {Array}
     */
    get vertices() {
        return this._vertices;
    }

    /**
     * 三角面数据
     * @return {Array}
     */
    get indices() {
        return this._indices;
    }

    /**
     * 控制节点数据
     * @return {Array}
     */
    get nodes() {
        return this._nodes;
    }

    /**
     * 绘制对象
     * @return {createjs.Shape|*}
     */
    get shape() {
        return this._shape;
    }


}


let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
ds.createjs = ds.createjs || {};
ds.createjs.effect = ds.createjs.effect || {};

ds.createjs.effect.AffineTransformShape = AffineTransformShape;


export default AffineTransformShape;