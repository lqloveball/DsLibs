/**
 * @class Ds.utils.Utils
 * @classdesc:类说明: 一些常用操作处理
 * @extends
 * @example: 举例
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright: Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
!(function(){
  window.Ds=window.Ds ||{};
  window.Ds.utils=window.Ds.utils||{};
  window.Ds.utils.Utils=new Utils();
  /**
   * 常用处理方式
   */
  function Utils(){
    /**
     * 判断是否是DOM对象
     * @param {[type]} obj [一个用来判断是否是dom对象的参数]
     */
    this.IsDOM=function(obj){
      if( typeof HTMLElement === 'object' ){
        return obj instanceof HTMLElement;
      }
      else{
        return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
      }
    };
    /**
     * [获取地址上面的？后的参数]
     *  @param {[Sring]} name [参数对象名]
     * @param {[String]} url  [地址]
     * @example 获取地址上面的GameID参数
     * Ds.utils.Utils.GetUrlParam(location.href, "GameID");
     */
    this.GetUrlParam=function ( name,url) {
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

  }
})();
