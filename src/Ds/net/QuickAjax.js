/**
 * @class 简易网络请求
 * @classdesc: 简化工作中项目做数据请求操作相关代码编写
 * @extends
 * @example: 举例
 *
   Ds.net.QuickAjax.Post('xxxx.aspx?R=1',{WorkID:10},function(data){
     alert(data);
   },function(error){
     alert('error');
   });
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright: Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
(function(factory) {
  var root = (typeof self == 'object' && self.self == self && self) ||
    (typeof global == 'object' && global.global == global && global);

  if (typeof define === 'function' && define.amd) {
    define(['exports'], function(exports) {
      module.exports = factory(root, exports);
    });
  } else if (typeof exports !== 'undefined') {
    module.exports = factory(root, exports);
  } else {
    factory(root, {});
  }

}(function(root, modelObj) {
  root.Ds = root.Ds || {};
  root.Ds.net = root.Ds.net || {};
  root.Ds.net.QuickAjax = new QuickAjax();

  function QuickAjax() {
    var _Self = this;
    //是否本地测试
    var _IsLocalDebug = false;
    if (location.href.indexOf(':800') != -1) _IsLocalDebug = true;
    Object.defineProperty(this, "IsLocalDebug", {
      get: function() {
        return _IsLocalDebug;
      },
      set: function(value) {
        _IsLocalDebug = value;
      }
    });
    /**
     * 快速post请求
     * @param  {[type]} url       [description]
     * @param  {[type]} postData  [description]
     * @param  {[type]} callBack  [description]
     * @param  {[type]} errorBack [description]
     * @return {[type]}           [description]
     */
    this.Post = function(url, postData, callBack, errorBack) {
      var _type = 'POST';
      var _postData = postData || {};

      console.log('QuickAjax Post:', url, _postData);
      if (_IsLocalDebug) {
        _type = 'GET';
        _postData = {};
      }
      $.ajax({
        type: _type,
        url: url,
        data: _postData,
        success: function(data) {
          //如果是字符串 转下 object
          if (typeof(data) === 'string') data = JSON.parse(data);
          console.log('post End:' + url + ':', data);
          if (Number(data.IsSuccess) === 1) {
            if (callBack) callBack(data);
          } else {
            if (errorBack) errorBack(data.ErrMsg);
          }
        },
        error: function(xhr, type) {
          if (errorBack) errorBack('网络异常');
        }
      });
    };
    /**
     * 快速get请求
     * @todo  还未完成 对 postData数据转换成Get地址请求
     * @param  {[type]} url       [description]
     * @param  {[type]} postData  [description]
     * @param  {[type]} callBack  [description]
     * @param  {[type]} errorBack [description]
     * @return {[type]}           [description]
     */
    this.Get = function(url, postData, callBack, errorBack) {
      var _type = 'GET';
      var _url = url;
      //把数据转成地址栏参数
      if (postData) {
        var _parameter = '';
        var _pdata;
        var _num = 0;
        for (var variable in _postData) {
          if (object.hasOwnProperty(variable)) {
            _pdata = _parameter[variable];
            if (typeof(_pdata) === 'object') {
              _parameter += '&' + variable + '=' + JSON.stringify(_pdata);
            } else {
              _parameter += '&' + variable + '=' + _pdata;
            }
          }
        }
        if (_url.indexOf('?') == -1) {
          console.warn('QuickAjax Get Url 没有?开头参数');
          return;
        }
        _url = _url + _parameter;
      }
      console.log('QuickAjax Get:', url, _postData);
      $.ajax({
        type: _type,
        url: _url,
        // data: _postData,
        success: function(data) {
          //如果是字符串 转下 object
          if (typeof(data) === 'string') data = JSON.parse(data);
          console.log('get End: ' + url + ':', data);
          if (Number(data.IsSuccess) === 1) {
            if (callBack) callBack(data);
          } else {
            if (errorBack) errorBack(data.ErrMsg);
          }
        },
        error: function(xhr, type) {
          if (errorBack) errorBack('网络异常');
        }
      });
    };

    /**
     * [获取地址上面的？后的参数]
     *  @param {[Sring]} name [参数对象名]
     * @param {[String]} url  [地址]
     * @example 获取地址上面的GameID参数
     * Ds.utils.Utils.GetUrlParam(location.href, "GameID");
     */
    this.GetUrlParam = function(name, url) {
      if (url === undefined || url === null) url = location.href;
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
     * [获取地址栏参数列表]
     * @param  {[String]} url [description]
     * @return {[Object]} _request   [description]
     */
    this.GetUrlParamDc = function(url) {
      if (url === undefined || url === null) url = location.href;
      var _name, _value;

      var _num = url.indexOf("?");
      url = url.substr(_num + 1); //取得所有参数   stringvar.substr(start [, length ]
      // console.log(url);
      var _request=null;
      var arr = url.split("&"); //各个参数放到数组里
      for (var i = 0; i < arr.length; i++) {
        _num = arr[i].indexOf("=");
        if (_num > 0) {
          _name = arr[i].substring(0, _num);
          _value = arr[i].substr(_num + 1);
          if(!_request)_request={};
          _request[_name] = _value;
        }
      }
      return _request;
    };

  }
  //为了快速使用
  root.Ds.net.Get = root.Ds.net.QuickAjax.Get;
  root.Ds.net.Post = root.Ds.net.QuickAjax.Post;
  root.Ds.net.GetUrlParam = root.Ds.net.QuickAjax.GetUrlParam;
  root.Ds.net.GetUrlParamDc = root.Ds.net.QuickAjax.GetUrlParamDc;
  root.Ds.net.OpenUrl = function(value){location.href=value;};

  return root.Ds.net.QuickAjax;
}));
