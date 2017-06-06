/**
 * @class Ds.utils.ArcMath
 * @classdesc:三角函数相关 这个类可经常使用了，
   三角函数相关公式
       A
       |\
       | \
       |  \
      b|   \c
       |    \
       |     \
      C|______\B
           a

   正弦：锐角的对边与斜边的比。sinA＝a/c
   余弦：锐角的邻边与斜边的比。cosA＝b/c
   正切：锐角的对边与邻边的比。tanA＝a/b
   余切：锐角的邻边与对边的比。cotA＝b/a
   勾股定理：直角三角形中，两直角边的平方和等于斜边的平方。a^2＋b^2＝c^2
 * @extends
 * @example: 举例 无
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
!(function(){
    window.Ds=window.Ds ||{};
    window.Ds.utils=window.Ds.utils ||{};
    var ArcMath=window.Ds.utils.ArcMath=Ds.utils.ArcMath ||{};
    //==============================需要用到相关角度数学算法＝＝＝＝＝＝＝＝＝＝＝＝
    function sinD(angle) {
        return Math.sin(angle * Math.PI / 180);
    }
    function cosD(angle) {
        return Math.cos(angle * Math.PI / 180);
    }

    function tanD(angle) {
        return Math.tan(angle * Math.PI / 180);
    }
    function asinD(ratio) {
        return Math.asin(ratio) * 180 / Math.PI;
    }
    function acosD(ratio) {
        return Math.acos(ratio) * 180 / Math.PI;
    }
    function atanD(ratio) {
        return Math.atan(ratio) * 180 / Math.PI;
    }
    function atan2D(y,x) {
        return Math.atan2(y,x) * 180 / Math.PI;
    }
    /*角度度转换为弧度*/
    function degreesToRadians(angle) {
        return angle * Math.PI / 180;
    }
    ArcMath.DegreesToRadians=degreesToRadians;
    /*弧度转换为角度*/
    function radiansToDegrees(degrees) {
        return degrees * 180 / Math.PI;
    }
    ArcMath.RadiansToDegrees=radiansToDegrees;
    /*求两点间距离*/
    function distance(x1,y1,x2,y2) {
        var dx=x2 - x1;
        var dy=y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
    ArcMath.Distance=distance;
    /*任意数转成360角度*/
    function fixAngle(angle) {
        angle%= 360;
        return angle < 0?angle + 360:angle;
    }
    ArcMath.FixAngle=fixAngle;
    /**
     * 计算2个点之间的夹角
     *
     * @param  {[type]}   cpt     [对比点{x:0,y:0}]
     * @param  {[type]}   opt     [原点{x:0,y:0}]
     * @return {[type]}           [description]
     */
    function pointToAngle(cpt,opt){
      if(opt===null||opt===undefined)opt={x:0,y:0};
      var numx = cpt.x - opt.x;
      var numy = cpt.y - opt.y;
      var num = Math.atan(numy/numx);
      if(cpt.x>opt.x) num =(num * 180 / Math.PI)+90;
      else num =(num * 180 / Math.PI)-90;
      return num;
    }
    ArcMath.PointToAngle=pointToAngle;
    /**
     * 获取对边 (已知邻边与夹角)
     * @param  {[Number]}  angle      [夹角]
     * @param  {[Number]}  side       [一个邻边长度b]
     * @return {[Number]}             [0 出现先在坐标线上了]
     */
    function getOppositeSide(angle,side){
        angle=fixAngle(angle);
        // log('--->',angle)
        //出现在线上直接是0
        if ((angle===0|| angle === 90)||(angle===270|| angle === 360)||angle === 180) {
            return 0;
        }
        //tanA＝a/b  ---> a=b*tanA
        return tanD(angle)*side;
    }
    ArcMath.GetOppositeSide=getOppositeSide;
    /**
     * 获取邻边 (已知对边与夹角)
     * @param  {[type]} angle [夹角]
     * @param  {[type]} side  [对边长]
     * @return {[type]}       [0 出现先在坐标线上了]
     */
    function getVicinageSide(angle,side){
        angle=fixAngle(angle);
        if ((angle===0|| angle === 90)||(angle===270|| angle === 360)||angle === 180) {
            return 0;
        }
        //tanA＝a/b  ---> b=a/tanA
        return side/tanD(angle);
    }
    ArcMath.GetVicinageSide=getOppositeSide;

    /*将极坐标系转化为笛卡尔坐标系*/
    function cartesianToPolar(px,py) {
        var rt={x:0,y:0};
        var radius=Math.sqrt(px * px + py * py);//半径
        var theta=atan2D(py,px);//角度
        rt.x=radius;
        rt.y=theta;
        return rt;
    }
    ArcMath.CartesianToPolar=cartesianToPolar;
    /**
     * 角度，圆心点x,y，X方向轴长，Y方轴长，计算椭圆形 上的点
     * @param x0圆形点x
     * @param y0圆形点y
     * @param sideA X方向轴长
     * @param sideB Y方轴长 为空就是园形
     * @param r 角度
     * @return
    */
    function getRPoint(angle,x,y,sideA, sideB) {
       angle=fixAngle(angle);
       angle = angle * Math.PI / 180;
       if(sideA=== undefined)sideA=100;
       if (sideB === undefined) sideB = sideA;
       var point={x:Math.cos(angle) * sideA + x,y:Math.sin(angle) * sideB + y};
       return point;
    }
    ArcMath.GetRPoint=getRPoint;
    /*360角换象限*/
    function angleToQuadrant(angle){
        angle=fixAngle(angle);
        if ((angle === 0 || angle === 90) || (angle === 270 || angle === 360) || angle === 180)return 0;
        else {
            if (angle > 90 && angle <=180) return 2;
            else if (angle > 180 && angle  <=270) return 3;
            else if (angle > 270 && angle  <=360) return 4;
            else  return 1;

        }
    }
    ArcMath.AngleToQuadrant=angleToQuadrant;
})();
