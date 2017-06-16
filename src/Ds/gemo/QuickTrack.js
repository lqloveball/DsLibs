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
 * @copyright:  我发起Ds库目的，简化方便工作项目开发。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里代码很多也都来源至或参考网络开源开放代码，所以这个库也开源开放。更多希望团队成员把积累工作中常用的代码，加快自己开发效率。
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
  root.Ds=root.Ds ||{};
  root.Ds.gemo=root.Ds.gemo ||{};
  root.Ds.gemo.QuickTrack=new QuickTrack();
  /**
   * 快速进行执行检测代码
   */
  function QuickTrack(){
    var _Self=this;
    /**
     * 百度虚拟PV
     * @param  {[String]} pageurl [如 '/virtual/login']
     * @return {[type]}
     */
    this.BaiduPV=function(pageurl){
      try {
        if(!_hmt)return null;
      } catch (e) {
        return;
      }
      if(pageurl.indexOf('/')!==0){
        pageurl='/'+pageurl;
      }
      console.log('BaiduPV:',pageurl);
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
      try {
        if(!_hmt)return null;
      } catch (e) {
        return;
      }
      if(!category)category='Event';
      if(!action)action='Click';
      if(!opt_value)opt_value='1';
      if(!opt_label)return;
      _hmt.push(['_trackEvent', category, action, opt_label, opt_value]);
    };
    /**
     * GA虚拟PV
     * @param {[type]} pageurl [description]
     */
    this.GAPV=function(pageurl){
      try {
        if(!ga)return null;
      } catch (e) {
        return;
      }
      if(pageurl.indexOf('/')!==0){
        pageurl='/'+pageurl;
      }
      ga('send', 'pageview',pageurl);
    };
    /**
     * GA监测事件
     * @param  {[String]} category  [默认Event【百度描述】要监控的目标的类型名称，通常是同一组目标的名字，比如"视频"、"音乐"、"软件"、"游戏"等等。该项必填，不填、填"-"的事件会被抛弃。]
     * @param  {[String]} action    [默认Click【百度描述】用户跟目标交互的行为，如"播放"、"暂停"、"下载"等等。该项必填，不填、填"-"的事件会被抛弃。]
     * @param  {[String]} opt_label [必填【百度描述】事件的一些额外信息，通常可以是歌曲的名称、软件的名称、链接的名称等等。该项选填，不填、填"-"代表此项为空。。]
     * @param  {[String]} opt_value [默认one【百度描述】事件的一些数值信息，比如权重、时长、价格等等，在报表中可以看到其平均值等数据。该项可选。]
     * @return {[type]}
     */
    this.GAEvent=function( opt_label, opt_value,category, action){
      try {
        if(!ga)return null;
      } catch (e) {
        return;
      }
      if(!category)category='Event';
      if(!action)action='Click';
      if(!opt_value)opt_value=1;
      if(!opt_label)return;
      ga('send', {
        hitType: 'event',
        eventCategory: category,
        eventAction: action,
        eventLabel: opt_label,
        eventValue:opt_value,
      });
    };

    /**
     * 秒针虚拟PV
     *  stm_clicki('send', 'pageview', {'page': '/virtualpage/...', 'title': '标题'});
     * "1、使用场景：指当网页内容改变，而页面URL不变时，为了记录不同内容的页面浏览，人为设定相关URL及其它参数。
     * 2、其中‘/virtualpage/...’和‘标题’需要自定义，send和pageview都不用动。
     * 示例：stm_clicki('send', 'pageview', {'page': '/mzh5/2', 'title': 'solution'});
     * 3、根据需求来添加到相关位置。
     * 例如：如果用虚拟页面统计H5页面不同屏的浏览量，那么可以当显示某个屏的时候触发相应的虚拟页面跟踪代码
     * 4、虚拟页面设定的URL不可重复,title可重复。
     * 5、进入 ‘首页‘时无需使用虚拟，而从第二页回到首页时需使用虚拟PV代码。
     * 6、Url无需填写http协议开头至domain这部分。"
     */
    this.STMPV=function(pageurl,title){
      try {
        if(!stm_clicki)return null;
      } catch (e) {
        return;
      }
      if(pageurl.indexOf('/')!==0){
        pageurl='/'+pageurl;
      }
      stm_clicki('send', 'pageview', {'page': pageurl, 'title': title!==undefined?title:''});
    };
    /**
     * 秒针监测事件
     * stm_clicki('send', 'event', 'Category', 'Action', 'Label', Value);
     *"1、事件由4个可用于描述用户与网站互动操作的字段组成：
     *必填项： 'Category', 'Action';
     *非必填项： 'Label', Value;
     *其中Value 为Number型，非负数。 其余字段为字符串型。
     *2、其中Category, Action, Value 需要自定义，send和event无需改动。
     *3、如以下实例，监测按钮统计事件，可绑定<a>标签 onclick事件。
     *示例：需要监测某网站导航栏-返回首页按钮，代码是：
     *<a href=""url"" onclick=""stm_clicki('send', 'event', '返回首页按钮', '点击', '导航按钮');"">返回首页</a>"
     */
    this.STMEvent=function( opt_label, opt_value,category, action){
      try {
        if(!stm_clicki)return null;
      } catch (e) {
        return;
      }
      if(!category)category='ClickEvent';//类型描述
      if(!action)action='点击';//事件
      if(!opt_value)opt_value=1;//可选 默认1
      if(!opt_label)return;//必须
      stm_clicki('send', 'event', opt_label, action, category, opt_value);
    };
    /**
     * 事件
     */
    this.Event=function(opt_label, opt_value,category, action){
      _Self.GAEvent(opt_label, opt_value,category, action);
      _Self.BaiduEvent(opt_label, opt_value,category, action);
      _Self.STMEvent(opt_label, opt_value,category, action);
    };
    /**
     * 虚拟PV
     */
    this.PV=function(pageurl,title){
      _Self.BaiduPV(pageurl);
      _Self.GAPV(pageurl);
      _Self.STMPV(pageurl,title);

    };
  }

  return root.Ds.gemo.QuickTrack;
}));
