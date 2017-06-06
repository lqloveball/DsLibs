/**
 * @class Ds.utils.TimeUtils
 * @classdesc:类说明:时间处理类
 * @extends
 * @example: 举例
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright: Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
(function (factory) {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);

    if (typeof define === 'function' && define.amd) {
        define(['exports'], function (exports) {
            module.exports= factory(root, exports);
        });
    } else if (typeof exports !== 'undefined') {
        module.exports=factory(root, exports);
    } else {
         factory(root, {});
    }

}(function (root, modelObj) {
  root.Ds = root.Ds || {};
  root.Ds.utils = root.Ds.utils || {};
  root.Ds.utils.TimeUtils=new TimeUtils();
  function TimeUtils(){


    var _Self=this;
    //一天毫秒数
    var _DayMs=this.DayMs=24*60*60*1000;
    //一个小时毫秒数
    var _HoursMs=this.HoursMs=60*60*1000;
    //一个分钟毫秒数
    var _MinutesMs=this.MinutesMs=60*1000;
    /**
     * 获取当前时间
     * @return {[type]} [description]
     */
    this.GetTime=function(){
      return new Date().getTime();
    };
    /**
     * 获取倒计时 time 毫秒
    * @param  {[type]} value [description]
     * @return {[type]} [description]
     */
    this.GetCountdownMs=function(endDate){
      var _date=new Date();
      var _endDate;
      if(endDate instanceof Date){
        _endDate=endDate;
      }
      else if(typeof(endDate)==="object"){
        _endDate=_Self.ObjectToDate(endDate);
      }
      else if(typeof(endDate)==="string"){
        _endDate=_Self.StringToDate(endDate);
      }
      var _ms=_endDate.getTime()-_date.getTime();
      if(_ms<=0)_ms=0;
      console.log(_endDate.getTime(),_date.getTime(),_ms);
      return _ms;
    };
    /**
     * 获取倒计时 数据
     * @param  {[type]} endDate [description]
     * @return {[type]}         [description]
     */
    this.GetCountdownTimeData=function(endDate){
      var _date=new Date();
      var _endDate;
      if(endDate instanceof Date){
        _endDate=endDate;
      }
      else if(typeof(endDate)==="object"){
        _endDate=_Self.ObjectToDate(endDate);
      }
      else if(typeof(endDate)==="string"){
        _endDate=_Self.StringToDate(endDate);
      }
      var _ms=_endDate.getTime()-_date.getTime();
      if(_ms<=0)_ms=0;
      // console.log(endDate);
      // console.log(_endDate.getTime(),_date.getTime(),_ms);
      // console.log(_ms/_DayMs);
      var _day=(_ms/_DayMs)>>0;
      // console.log(_day);
      var _hours=((_ms%_DayMs)/_HoursMs)>>0;
      var _minutes=(((_ms%_DayMs)%_HoursMs)/_MinutesMs)>>0;
      var _second =(((_ms%_DayMs)%_HoursMs)%_MinutesMs)/1000>>0;
      var _cms =_ms%100;
      var _obj={
        day:_day,//剩余天数
        hours:_hours,//属于小时数
        minutes:_minutes,//剩余分钟数
        second:_second,//剩余秒数
        ms:_cms,//剩余毫秒数
      };
      // console.log(_obj);
      return _obj;
    };
     /**
      * 对象转时间Date
      * @param  {[type]} obj     [description]
      * {
        year:2017,
        month:5,
        date:10,
        hours:19,
        minutes:30,
        second:0,
      }
      * @param  {[type]} nowBool [description]
      * @return {[type]}         [description]
      */
    this.ObjectToDate=function(obj,nowBool){

      var _year=obj.year?obj.year:new Date().getYear();
      var _month=obj.month?obj.month:new Date().getMonth();
      var _date=obj.date?obj.date:new Date().getDate();
      var _hours=obj.hours?obj.hours:(nowBool?new Date().getHours():0);//new Date().getHours();
      var _minutes=obj.minutes?obj.minutes:(nowBool?new Date().getMinutes():0);//new Date().getMinutes();
      var _second=obj.second?obj.second:(nowBool?new Date().getSeconds():0);//new Date().getSeconds();
      var _ms=obj.ms?obj.ms:(nowBool?new Date().getMilliseconds():0);//new Date().getSeconds();
      _month=Math.min(Math.max(_month-1,0),11);
      var _result=new Date();
      _result.setYear(_year);
      _result.setMonth(_month);
      _result.setDate(_date);
      _result.setHours(_hours);
      _result.setMinutes(_minutes);
      _result.setSeconds(_second);
      _result.setMilliseconds(_ms);
      return _result;
    };
    /**
     * [description]
     * @param  {[type]} value   ['2017/05/10/19/30/0']
     * @param  {[type]} nowBool [description]
     * @return {[type]}         [description]
     */
    this.StringToDate=function(value,nowBool){
      var _arr=value.split('/');
      var _year=Number(_arr[0]);
      _year=!isNaN(_year)?_year:new Date().getYear();
      var _month=Number(_arr[1]);
      _month=!isNaN(_month)?_month:new Date().getMonth();
      var _date=Number(_arr[2]);
      _date=!isNaN(_date)?_date:new Date().getDate();
      var _hours=Number(_arr[3]);
      _hours=!isNaN(_hours)?_hours:(nowBool?new Date().getHours():0);//new Date().getHours();
      var _minutes=Number(_arr[4]);
      _minutes=!isNaN(_minutes)?_minutes:(nowBool?new Date().getMinutes():0);//new Date().getHours();
      var _second=Number(_arr[5]);
      _second=!isNaN(_second)?_second:(nowBool?new Date().getSeconds():0);//new Date().getHours();
      var _ms=Number(_arr[6]);
      _ms=!isNaN(_ms)?_ms:(nowBool?new Date().getMilliseconds():0);//new Date().getHours();
      _month=Math.min(Math.max(_month-1,0),11);
      var _result=new Date();
      _result.setYear(_year);
      _result.setMonth(_month);
      _result.setDate(_date);
      _result.setHours(_hours);
      _result.setMinutes(_minutes);
      _result.setSeconds(_second);
      _result.setMilliseconds(_ms);
      return _result;
    };
  }

  return root.Ds.utils.TimeUtils;
}));
