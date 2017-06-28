/*个人习惯用log代替console.log来进行简写*/
/**
 * 类说明: 简单log写法
 * @class Log
 * @extends 无
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:
 * @constructor
 **/
(function(window) {
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
