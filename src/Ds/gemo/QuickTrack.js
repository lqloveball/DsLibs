/**
 * @class Ds.gemo.QuickTrack
 * @classdesc:快速添加检查代码类
 * @extends
 * @example:
 * //百度PV
 * Ds.gemo.QuickTrack.BaiduPV('/virtual/login');
 * //百度事件 默认点击 Click
 * Ds.gemo.QuickTrack.BaiduEvent('GotoHome');
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
(function(){
  window.Ds=window.Ds ||{};
  window.Ds.gemo=window.Ds.gemo ||{};
  window.Ds.gemo.QuickTrack=new QuickTrack();
  /**
   * 快速进行执行检测代码
   */
  function QuickTrack(){
    /**
     * 百度虚拟PV
     * @param  {[String]} pageurl [如 '/virtual/login']
     * @return {[type]}
     */
    this.BaiduPV=function(pageurl){
      _hmt.push(['_trackPageview', pageurl]);
    };
    /**
     * 百度监测事件
     * @param  {[String]} category  [默认Event【百度描述】要监控的目标的类型名称，通常是同一组目标的名字，比如"视频"、"音乐"、"软件"、"游戏"等等。该项必填，不填、填"-"的事件会被抛弃。]
     * @param  {[String]} action    [默认Click【百度描述】用户跟目标交互的行为，如"播放"、"暂停"、"下载"等等。该项必填，不填、填"-"的事件会被抛弃。]
     * @param  {[String]} opt_label [必填【百度描述】事件的一些额外信息，通常可以是歌曲的名称、软件的名称、链接的名称等等。该项选填，不填、填"-"代表此项为空。。]
     * @param  {[String]} opt_value [默认one【百度描述】事件的一些数值信息，比如权重、时长、价格等等，在报表中可以看到其平均值等数据。该项可选。]
     * @return {[type]}
     */
    this.BaiduEvent=function( opt_label, opt_value,category, action){
      if(!category)category='Event';
      if(!action)action='Click';
      if(!opt_value)opt_value='one';
      if(!opt_label)return;
      _hmt.push(['_trackEvent', category, action, opt_label, opt_value]);
    };
  }
})();
