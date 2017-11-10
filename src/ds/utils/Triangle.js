let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};

ds.utils = ds.utils || {};

/**
 * @member ds.utils.Triangle
 * @type {module:ds/utils/Triangle}
 */
const Triangle = {};

/**
 * 三角函数相关计算
 *
 * ```js
 * 三角函数相关公式
 *  A
 *  |\
 *  | \
 *  |  \
 * b|   \c
 *  |    \
 *  |     \
 * C|______\B
 *     a
 * 正弦：锐角的对边与斜边的比。sinA＝a/c
 * 余弦：锐角的邻边与斜边的比。cosA＝b/c
 * 正切：锐角的对边与邻边的比。tanA＝a/b
 * 余切：锐角的邻边与对边的比。cotA＝b/a
 * 勾股定理：直角三角形中，两直角边的平方和等于斜边的平方。a^2＋b^2＝c^2
 * ```
 *
 * @module module:ds/utils/Triangle
 */
ds.utils.Triangle = Triangle;

/**
 * @memberof module:ds/utils/Triangle
 * @param angle
 * @return {number}
 */
ds.utils.Triangle.sinD = function (angle) {
    return Math.sin(angle * Math.PI / 180);
};
/**
 * @memberof module:ds/utils/Triangle
 * @param angle
 * @return {number} 弧度值
 */
ds.utils.Triangle.cosD = function (angle) {
    return Math.cos(angle * Math.PI / 180);
};
/**
 * @memberof module:ds/utils/Triangle
 * @param angle
 * @return {number} 弧度值
 */
ds.utils.Triangle.tanD = function (angle) {
    return Math.tan(angle * Math.PI / 180);
};
/**
 * @memberof module:ds/utils/Triangle
 * @param ratio
 * @return {number} 角度值
 */
ds.utils.Triangle.asinD = function (ratio) {
    return Math.asin(ratio) * 180 / Math.PI;
};
/**
 * @memberof module:ds/utils/Triangle
 * @param ratio
 * @return {number} 角度值
 */
ds.utils.Triangle.acosD = function (ratio) {
    return Math.acos(ratio) * 180 / Math.PI;
};
/**
 * @memberof module:ds/utils/Triangle
 * @param ratio
 * @return {number} 角度值
 */
ds.utils.Triangle.atanD = function (ratio) {
    return Math.atan(ratio) * 180 / Math.PI;
};
/**
 * @memberof module:ds/utils/Triangle
 * @param x
 * @param y
 * @return {number}
 */
ds.utils.Triangle.atan2D = function (x, y) {
    return Math.atan2(y, x) * 180 / Math.PI;
};
/**
 * 角度转换为弧度
 * @memberof module:ds/utils/Triangle
 * @param angle
 * @return {number} 弧度
 */
ds.utils.Triangle.angleToDeg = function (angle) {
    return angle * Math.PI / 180;
};
/**
 * 弧度转换为角度
 * @memberof module:ds/utils/Triangle
 * @param angle
 * @return {number}
 */
ds.utils.Triangle.degToAngle = function (angle) {
    return angle * Math.PI / 180;
};
/**
 * 求两点间距离
 * @memberof module:ds/utils/Triangle
 * @param {number} x1 点1x
 * @param {number} y1 点1y
 * @param {number} x2 点2x
 * @param {number} y2 点2y
 * @return {number} 距离值
 */
ds.utils.Triangle.distance = function (x1, y1, x2, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
};
/**
 * 任意数转成360角度
 * @memberof module:ds/utils/Triangle
 * @param {number} angle 被转换的角度
 * @return {number} 角度
 */
ds.utils.Triangle.fixAngle = function (angle) {
    angle %= 360;
    return angle < 0 ? angle + 360 : angle;
};
/**
 * 计算2个点之间的夹角
 * @memberof module:ds/utils/Triangle
 * @param {object} cpt 对比点{x:0,y:0}
 * @param {object} opt 原点{x:0,y:0}
 * @return {number} 角度
 */
ds.utils.Triangle.pointToAngle = function (cpt, opt) {

    if (opt === null || opt === undefined) opt = {x: 0, y: 0};
    let numx = cpt.x - opt.x;
    let numy = cpt.y - opt.y;
    let num = Math.atan(numy / numx);
    if (cpt.x > opt.x) num = (num * 180 / Math.PI) + 90;
    else num = (num * 180 / Math.PI) - 90;
    return num;

};
/**
 * 获取对边长度 (已知邻边与夹角)
 * @memberof module:ds/utils/Triangle
 * @param {number} angle 夹角
 * @param {number} side  一个邻边长度b
 * @return {number}  0 出现先在坐标线上了
 */
ds.utils.Triangle.getOppositeSide = function (angle, side) {

    angle = ds.utils.Triangle.fixAngle(angle);

    //出现在线上直接是0
    if ((angle === 0 || angle === 90) || (angle === 270 || angle === 360) || angle === 180) return 0;
    //tanA＝a/b  ---> a=b*tanA
    return ds.utils.Triangle.tanD(angle) * side;

};

/**
 * 获取邻边 (已知对边与夹角)
 * @memberof module:ds/utils/Triangle
 * @param  {number} angle 夹角
 * @param  {number} side  对边长
 * @return {number}       0 出现先在坐标线上了
 */
ds.utils.Triangle.getVicinageSide = function (angle, side) {

    angle = ds.utils.Triangle.fixAngle(angle);
    if ((angle === 0 || angle === 90) || (angle === 270 || angle === 360) || angle === 180) return 0;
    //tanA＝a/b  ---> b=a/tanA
    return side / ds.utils.Triangle.tanD(angle);

};

/**
 * 将极坐标系转化为笛卡尔坐标系
 * @memberof module:ds/utils/Triangle
 * @param {object} px
 * @param {object} py
 * @return {object} {x:0,y:0}
 */
ds.utils.Triangle.cartesianToPolar = function (px, py) {

    let rt = {x: 0, y: 0};
    let radius = Math.sqrt(px * px + py * py);//半径
    let theta = ds.utils.Triangle.atan2D(py, px);//角度
    rt.x = radius;
    rt.y = theta;

    return rt;

};
/**
 * 角度，圆心点x,y，X方向轴长，Y方轴长，计算椭圆形 上的点
 * @memberof module:ds/utils/Triangle
 * @param angle 角度
 * @param {number} x
 * @param {number} y
 * @param {number} sideA  X方向轴长
 * @param {number} sideB  Y方轴长 为空就是园形
 * @return {object} {x: *, y: *}
 */
ds.utils.Triangle.getPoint = function (angle, x, y, sideA, sideB) {

    angle = ds.utils.Triangle.fixAngle(angle);
    angle = angle * Math.PI / 180;
    if (sideA === undefined) sideA = 100;
    if (sideB === undefined) sideB = sideA;
    let point = {x: Math.cos(angle) * sideA + x, y: Math.sin(angle) * sideB + y};
    return point;

};
/**
 * 360角换象限
 * @memberof module:ds/utils/Triangle
 * @param {number} angle  角度
 * @return {number} 1 2 3 4
 */
ds.utils.Triangle.angleToQuadrant = function (angle) {

    angle = ds.utils.Triangle.fixAngle(angle);
    if ((angle === 0 || angle === 90) || (angle === 270 || angle === 360) || angle === 180) return 0;
    else {

        if (angle > 90 && angle <= 180) return 2;
        else if (angle > 180 && angle <= 270) return 3;
        else if (angle > 270 && angle <= 360) return 4;
        else return 1;

    }

};

export default ds.utils.Triangle;

