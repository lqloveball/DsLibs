/**
 * @class Ds.utils.Bezier
 * @classdesc:类说明:贝塞尔曲线Bezier 数学计算，算法来源http://jsdo.it/foka/aiq4
 * @extends
 * @example: 举例
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
!(function() {
	window.Ds=window.Ds ||{};
  window.Ds.utils=window.Ds.utils ||{};

	var Bezier={};
	Bezier.GetMovePoint=getMovePoint;
	Bezier.GetnetBetweenPointArray=getBetweenPointArray;
	Bezier.GetBeweenPoint=getBeweenPoint;
	Bezier.GetBeweenLinePoint=getBeweenLinePoint;
	window.Ds.utils.Bezier=Bezier;

	/**
	 * 取多维Bezier曲线百分比上的点
	 * @param  {[type]} array [贝塞尔点]
	 * @param  {[Number]} per   [0-1]
	 * @return {[type]}       [description]
	 */
	function getMovePoint(array,per){
		//取百分比上的点
		while(array.length>1){
			array=getBetweenPointArray(array,per);
		}
		//第一个点
		return array[0];
	}
	/**
	 *  计算所有Bezier点 的数据情况
	 * @param  {[type]} array [description]
	 * @param  {[type]} per   [description]
	 * @return {[type]}       [description]
	 */
	function getBetweenPointArray(array,per){
		var num=array.length;
		var betweenPointArray=[];
		//Bezier线段上多个当前运动轨迹点
		for(i=0;i<num-1;i++){
			var point=getBeweenPoint(array[i],array[i+1],per);
			betweenPointArray.push(point);
		}
		//Bezier 运动轨迹点
		return betweenPointArray;
	}
	/**
	 * 取线段中的百分比的点
	 * @param  {[type]} startPoint [description]
	 * @param  {[type]} endPoint   [description]
	 * @param  {[type]} per        [description]
	 * @return {[type]}            [description]
	 */
	function getBeweenPoint(startPoint,endPoint,per){
		var point={x:0,y:0};
		point.x=(endPoint.x-startPoint.x)*per+startPoint.x;
		point.y=(endPoint.y-startPoint.y)*per+startPoint.y;
		return point;
	}
	/**
	 * 根据曲线变化点计算出曲线上的所有点（以.1/曲线变化点个数作为步进);
	 * @param  {[type]} bezierArr [description]
	 * @return {[type]}           [description]
	 */
	function getBeweenLinePoint(bezierArr){
		var pointArr=[];
        if(bezierArr.length<1)return pointArr;
        var per=0;
        var speed=0.1/bezierArr.length;
        while(per<1+speed){
            var pt=getMovePoint(bezierArr,per);
            pointArr.push(pt);
            per+=speed;
            if(per>=1){
                getMovePoint(bezierArr,1);
                pointArr.push(pt);
                break;
            }
        }
        return pointArr;
	}
})();
