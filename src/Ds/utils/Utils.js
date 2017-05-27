/**
 * @class Ds.utils.Utils
 * @classdesc:类说明: 一些常用操作处理
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
  root.Ds.utils=root.Ds.utils||{};
  root.Ds.utils.Utils=new Utils();
  //操作处理类
  function Utils(){
    /**
     * 判断是否是DOM对象
     * @param {[type]} obj [一个用来判断是否是dom对象的参数]
     */
    this.IsDOM=function(obj){
      if( typeof HTMLElement === 'object' ) return obj instanceof HTMLElement;
      else return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
    };
    /**
     * [获取地址上面的？后的参数]
     *  @param {[Sring]} name [参数对象名]
     * @param {[String]} url  [地址]
     * @example 获取地址上面的GameID参数
     * Ds.utils.Utils.GetUrlParam(location.href, "GameID");
     */
    this.GetUrlParam=function (name,url) {
        if(url===undefined||url===null)url=location.href;
        var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
        var matcher = pattern.exec(url);
        var items = null;
        if (null !== matcher) {
            try {
                items = decodeURIComponent(decodeURIComponent(matcher[1]));
            } catch (e) {
                try {
                    items = decodeURIComponent(matcher[1]);
                } catch (e) {
                    items = matcher[1];
                }
            }
        }
        return items;
    };
    /**
     * 对数组进行按指定值升续排列
     * @param  {[Array]} arr   [排序的数组]
     * @param  {[String]} value [指定值]
     * @param  {[Boolean]} litre [升续]
     * @return {[type]}       [description]
     */
    this.ArraySort=function(arr, value,litre) {
      litre=litre!==undefined?litre:true;
      var compare = function(prop) {
        return function(obj1, obj2) {
          var val1 = obj1[prop];
          var val2 = obj2[prop];
          if (val1 < val2) {
            return -1;
          } else if (val1 > val2) {
            return 1;
          } else {
            return 0;
          }
        };
      };
      var compare2 = function(prop) {
        return function(obj1, obj2) {
          var val1 = obj1[prop];
          var val2 = obj2[prop];
          if (val1 > val2) {
            return -1;
          } else if (val1 < val2) {
            return 1;
          } else {
            return 0;
          }
        };
      };
      if(litre) return arr.sort(compare(value));
      else return arr.sort(compare2(value));
    };
    /**
     * 判断是否手机号码
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    this.IsPhone=function(value){
      var re=new RegExp(/^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/);
        var retu=value.match(re);
        if(retu){
            return true;
        }else{
            return false;
        }
    };
    /**
     * 获取星座
     * @param  {[type]} month [description]
     * @param  {[type]} date  [description]
     * @return {[type]}       [description]
     */
    this.GetConstellation=function(month,date){
      var value='';
      if (month == 1 && date >=20 || month == 2 && date <=18) {value = "水瓶座";}
      if (month == 1 && date > 31) {value = "Huh?";}
      if (month == 2 && date >=19 || month == 3 && date <=20) {value = "双鱼座";}
      if (month == 2 && date > 29) {value = "Say what?";}
      if (month == 3 && date >=21 || month == 4 && date <=19) {value = "白羊座";}
      if (month == 3 && date > 31) {value = "OK. Whatever.";}
      if (month == 4 && date >=20 || month == 5 && date <=20) {value = "金牛座";}
      if (month == 4 && date > 30) {value = "I'm soooo sorry!";}
      if (month == 5 && date >=21 || month == 6 && date <=21) {value = "双子座";}
      if (month == 5 && date > 31) {value = "Umm ... no.";}
      if (month == 6 && date >=22 || month == 7 && date <=22) {value = "巨蟹座";}
      if (month == 6 && date > 30) {value = "Sorry.";}
      if (month == 7 && date >=23 || month == 8 && date <=22) {value = "狮子座";}
      if (month == 7 && date > 31) {value = "Excuse me?";}
      if (month == 8 && date >=23 || month == 9 && date <=22) {value = "处女座";}
      if (month == 8 && date > 31) {value = "Yeah. Right.";}
      if (month == 9 && date >=23 || month == 10 && date <=22) {value = "天秤座";}
      if (month == 9 && date > 30) {value = "Try Again.";}
      if (month == 10 && date >=23 || month == 11 && date <=21) {value = "天蝎座";}
      if (month == 10 && date > 31) {value = "Forget it!";}
      if (month == 11 && date >=22 || month == 12 && date <=21) {value = "人马座";}
      if (month == 11 && date > 30) {value = "Invalid Date";}
      if (month == 12 && date >=22 || month == 1 && date <=19) {value = "摩羯座";}
      if (month == 12 && date > 31) {value = "No way!";}
      return value;
    };
  }

  return root.Ds.utils.Utils;
}));
