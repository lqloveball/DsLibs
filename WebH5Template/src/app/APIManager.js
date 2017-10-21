require('ds/net/QuickAjax'); //快速数据请求

function APIManager() {

    var _self = this;

    //事件继承
    ds.EventDispatcher.extend(this);

    //是否本地
    var _isLocal = false;
    if (location.href.indexOf(':800') !== -1) _isLocal = true;
    //记录网站实际地址，给到获取绝对图片路径时候使用
    var _webUrl = location.origin;//'http://nongfurunningchina.ne.cagoe.com';
    Object.defineProperty(this, "WebUrl", {
        get: function () {
            return _webUrl;
        },
    });

    //接口对接==有接口相关从这里开始编写===============================

    //=================接口方式参考Start==================
    var _dataUrl=location.origin+'/ajax/Ajax.aspx?method=data';
    if (_isLocal)_dataUrl='testApi/data.txt';
    var _testAPIing=false;
    this.testApi = function(postData, callBack, errorBack) {

        if(_testAPIing)return;
        _testAPIing=true;


        ds.net.post(_dataUrl, postData, function(data) {

            if(callBack)callBack(data);
            _testAPIing=false;

        }, function() {

            if(errorBack)errorBack(error,data);
            _testAPIing=false;

        },{dataType:'jsonp'});

    };

}

module.exports = new APIManager();
