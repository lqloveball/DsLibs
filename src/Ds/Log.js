/*个人习惯用log代替console.log来进行简写*/
/**
 * 类说明: 简单log写法
 * @class Log
 * @extends 无
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  我发起Ds库目的，简化方便工作项目开发。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里代码很多也都来源至或参考网络开源开放代码，所以这个库也开源开放。更多希望团队成员把积累工作中常用的代码，加快自己开发效率。
 * @constructor
 **/
! (function(window) {
    if (window.log) return;
    window.Ds = window.Ds || {};
    window.Ds.Debug = window.Ds.Debug || {};

    var _slice = [].slice;
    var _con = window.console;
    function log(type, args) {
        var vs = _slice.call(args);
        if (_con) {
          if(  _con[type].apply ){
             _con[type].apply(_con, vs);
          }else{
            _con[type](type + ":",vs);
          }
        }
    }
    //是否显示debug
    window.Ds.Debug.ShowLog=true;
    /**
     * 大约debug
     */
    Ds.Debug.Log=function() {
      if(!Ds.Debug.ShowLog)return;
      log("log", arguments);
    };
    window.log=window.Ds.Debug.Log;
} (window));
