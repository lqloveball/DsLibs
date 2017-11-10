let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};

ds.utils = ds.utils || {};

/**
 * @member ds.utils.Bezier
 * @type {module:ds/utils/Bezier}
 */
const Bezier = {};

/**
 * Bezier 贝塞尔曲线
 * 算法来源http://jsdo.it/foka/aiq4
 * @module module:ds/utils/Bezier
 */
ds.utils.Bezier = Bezier;

/**
 * 取多维Bezier曲线百分比上的点
 * @memberof module:ds/utils/Bezier
 * @param {array} array
 * @param {number} per  0-1
 * @return {array}
 */
ds.utils.Bezier.getMovePoint = function (array, per) {

    //取百分比上的点
    while (array.length > 1) {
        array = ds.utils.Bezier.getBetweenPointArray(array, per);
    }
    //第一个点
    return array[0];

};

/**
 * 计算所有Bezier点 的数据情况
 * @memberof module:ds/utils/Bezier
 * @param  {array} array [贝塞尔的点]
 * @param  {number} per   [进度]
 * @return {array}       [贝塞尔数组]
 */
ds.utils.Bezier.getBetweenPointArray = function (array, per) {
    var num = array.length;
    var betweenPointArray = [];
    //Bezier线段上多个当前运动轨迹点
    for (i = 0; i < num - 1; i++) {
        var point = ds.utils.Bezier.getBeweenPoint(array[i], array[i + 1], per);
        betweenPointArray.push(point);
    }
    //Bezier 运动轨迹点
    return betweenPointArray;
};

/**
 * 取线段中的百分比的点
 * @memberof module:ds/utils/Bezier
 * @param  {object} startPoint 开始点{x:*,y:*}
 * @param  {object} endPoint   结束点{x:*,y:*}
 * @param  {number} per        0-1
 * @return {object}            点
 */
ds.utils.Bezier.getBeweenPoint = function (startPoint, endPoint, per) {
    var point = {x: 0, y: 0};
    point.x = (endPoint.x - startPoint.x) * per + startPoint.x;
    point.y = (endPoint.y - startPoint.y) * per + startPoint.y;
    return point;
};

/**
 * 根据曲线变化点计算出曲线上的所有点
 * @memberof module:ds/utils/Bezier
 * @param  {array} bezierArr [贝塞尔曲线点]
 * @return {array}           [所有贝塞尔点]
 */
ds.utils.Bezier.getBeweenLinePoint = function (bezierArr) {
    var pointArr = [];
    if (bezierArr.length < 1) return pointArr;
    var per = 0;
    var speed = 0.1 / bezierArr.length;
    while (per < 1 + speed) {
        var pt = ds.utils.Bezier.getMovePoint(bezierArr, per);
        pointArr.push(pt);
        per += speed;
        if (per >= 1) {
            ds.utils.Bezier.getMovePoint(bezierArr, 1);
            pointArr.push(pt);
            break;
        }
    }
    return pointArr;
};

export default ds.utils.Bezier;
