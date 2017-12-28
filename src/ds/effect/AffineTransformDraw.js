import {getDefault} from 'ds/utils/Mixin';

/**
 * 映射变形绘制 基于原生的canvas
 *  @memberof ds.effect
 */
class AffineTransformDraw {

    /**
     *
     * @param {Image|string} image 一个image对象或者图片地址 base64数据
     * @param {object} opts 配置
     * @param {CanvasElement} opts.canvas 渲染的canvas对象
     * @param {number} opts.width=640 画布宽
     * @param {number} opts.height=1235 画布高
     * @param {number} opts.x=0 绘制原点
     * @param {number} opts.y=0 绘制原点
     * @param {number} opts.segments=1 绘制分段
     */
    constructor(image, opts) {

        opts = opts || {};
        //顶点组
        this._vertices = [];
        //uv组
        this._uv = [];
        //节点组
        this._nodes = [];
        //三角面索引
        this._indices = [];
        //段 分多少段
        //
        // 1段
        // p0 - p2
        // |    |
        // p1 - p3
        //
        // 2段
        // p0---p3---p6
        //  |   |    |
        // p1---p4---p7
        //  |   |    |
        // p2---p5---p8
        this._segments = getDefault(opts.segments, 1);

        let _canvas = opts.canvas ? opts.canvas : document.createElement("canvas");
        let _width = getDefault(opts.width, 640);
        let _height = getDefault(opts.height, 1235);
        _canvas.setAttribute('width', _width);
        _canvas.setAttribute('height', _height);

        this._cx = getDefault(opts.x, 0);
        this._cy = getDefault(opts.y, 0);

        this._canvas = _canvas;
        this._width = _width;
        this._height = _height;

        if (image) this.setImage(image);

    }

    /**
     * 计算映射关系
     */
    calcAffine() {

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

        //节点转顶点
        // for(i=0; i<_nodes.length; i++)
        // {
        //     _vertices[i*2] = _nodes[i].x;
        //     _vertices[i*2+1] = _nodes[i].y;
        // }

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

    _draw() {

        let _cx = this._cx, _cy = this._cy;
        let _img = this._image;
        let _c = this._canvas.getContext("2d");
        let _indices = this._indices;
        let _vertices = this._vertices;
        let _uv = this._uv;
        let _v = [], i, l = _indices.length;
        let _w, _h, _t1, _t2, _t3, _t4;
        for (i = 0; i < _vertices.length; i++) {
            _v.push(_vertices[i]);
        }
        _c.clearRect(0, 0, this._canvas.width, this._canvas.height);
        for (i = 0; i < l; i += 3) {
            _c.save();
            _c.beginPath();
            _c.moveTo(_v[_indices[i] * 2] + _cx, _v[_indices[i] * 2 + 1] + _cy);
            _c.lineTo(_v[_indices[i + 1] * 2] + _cx, _v[_indices[i + 1] * 2 + 1] + _cy);
            if (i % 6 === 0) _c.lineTo(_v[_indices[i + 5] * 2] + _cx, _v[_indices[i + 5] * 2 + 1] + _cy);
            _c.lineTo(_v[_indices[i + 2] * 2] + _cx, _v[_indices[i + 2] * 2 + 1] + _cy);
            _c.lineTo(_v[_indices[i] * 2] + _cx, _v[_indices[i] * 2 + 1] + _cy);
            _c.closePath();

            //_c.lineWidth = 1;
            //_c.strokeStyle = "#0000ff";
            //_c.stroke();


            _c.clip();
            if (i % 6 === 0) {
                _w = (_uv[_indices[i + 1] * 2] - _uv[_indices[i] * 2]) * _img.width;
                _h = (_uv[_indices[i + 2] * 2 + 1] - _uv[_indices[i] * 2 + 1]) * _img.height;

                _t1 = (_v[_indices[i + 1] * 2] - _v[_indices[i] * 2]) / _w;
                _t2 = (_v[_indices[i + 1] * 2 + 1] - _v[_indices[i] * 2 + 1]) / _w;
                _t3 = (_v[_indices[i + 2] * 2] - _v[_indices[i] * 2]) / _h;
                _t4 = (_v[_indices[i + 2] * 2 + 1] - _v[_indices[i] * 2 + 1]) / _h;
                _c.setTransform(_t1, _t2, _t3, _t4, _v[_indices[i] * 2] + _cx, _v[_indices[i] * 2 + 1] + _cy);
                _c.drawImage(_img,
                    _img.width * _uv[_indices[i] * 2],
                    _img.height * _uv[_indices[i] * 2 + 1],
                    _w, _h,
                    0, 0,
                    _w, _h);
            } else {
                _w = (_uv[_indices[i + 2] * 2] - _uv[_indices[i + 1] * 2]) * _img.width;
                _h = (_uv[_indices[i + 2] * 2 + 1] - _uv[_indices[i] * 2 + 1]) * _img.height;
                _t1 = (_v[_indices[i + 2] * 2] - _v[_indices[i + 1] * 2]) / _w;
                _t2 = (_v[_indices[i + 2] * 2 + 1] - _v[_indices[i + 1] * 2 + 1]) / _w;
                _t3 = (_v[_indices[i + 2] * 2] - _v[_indices[i] * 2]) / _h;
                _t4 = (_v[_indices[i + 2] * 2 + 1] - _v[_indices[i] * 2 + 1]) / _h;
                _c.setTransform(_t1, _t2, _t3, _t4, _v[_indices[i + 1] * 2] + _cx, _v[_indices[i + 1] * 2 + 1] + _cy);
                _c.drawImage(_img,
                    _img.width * _uv[_indices[i + 1] * 2],
                    _img.height * _uv[_indices[i] * 2 + 1],
                    _w, _h,
                    0, -_h,
                    _w, _h);
            }
            _c.restore();
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
     * 设置画布宽高
     * @param w
     * @param h
     */
    setSize(w, h) {
        let _canvas = this._canvas;
        _canvas.setAttribute('width', w);
        _canvas.setAttribute('height', h);
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
                    _self.calcAffine();
                    _self._draw();
                    if (callback) callback();
                };
                this._image = _image;
            } else {
                this._image = image;
                _self.calcAffine();
                this._draw();
                if (callback) callback();
            }
        }
    }

    /**
     * 渲染图片
     * @return {Image}
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
     * 画布对象
     * @return {*}
     */
    get canvas() {
        return this._canvas;
    }


}

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
ds.effect = ds.effect || {};
ds.effect.AffineTransformDraw = AffineTransformDraw;

export default AffineTransformDraw;