require('ds/net/QuickAjax'); //快速数据请求

function APIManager() {

    var _self = this;

    //事件继承
    ds.EventDispatcher.extend(this);

    //是否本地
    var _isLocal = false;
    if (location.href.indexOf(':800') !== -1) _isLocal = true;

    //接口对接==有接口相关从这里开始编写===============================

    //记录网站实际地址，给到获取绝对图片路径时候使用
    var _webUrl = location.origin;//'http://nongfurunningchina.ne.cagoe.com';
    Object.defineProperty(this, "WebUrl", {
        get: function () {
            return _webUrl;
        },
    });


    //==================通用的分享接口使用代码==============================
    //设置默认分享 标题  内容  链接
    var _shareTitle = '分享标题';
    var _shareInfo = '分享内容';
    var _shareUrl = location.origin + "/index.html";
    //作品回流页面地址
    var _workPageUrl = '/index.html?WorkID=';

    Object.defineProperty(this, "WorkPageUrl", {
        get: function () {
            return _workPageUrl;
        },
        set: function (value) {
            _workPageUrl = value;
        }
    });

    //是否作品回流页面
    this.isWorkBackSharePage=false;

    /**
     * 默认微信分享接口
     * @param  {string} title [分享标题 默认 _shareTitle]
     * @param  {string} info  [分享内容 默认 _shareInfo]
     * @param  {string} url   [分享链接地址 默认 _shareUrl 传参参考：'/index.html','index.html','http://xxx.xx.com/index.html' ]
     * @param  {string} domain  [设定需要使用指定的域分享接口地址  如："zedigital.com.cn" ，那接口地址会按"http://wechat."+domain+".cn/JsApiWXConfig.aspx" 进行拼接 ]
     */
    this.defaultWeiShare = function (title, info, url, domain) {
        
        //插入分享接口js文件
        SiteModel.getScript('./js/libs/cagoeShare.js',function () {
            
            try {

                if (!CallJsApiWXConfigItf) {

                    console.log('分享接口./js/libs/cagoeShare.js 存在问题，请检查');
                    return;

                }

            } catch (e) {

                return;

            }

            var _apiUrl = "http://wechat.cagoe.com/JsApiWXConfig.aspx";
            if (location.href.indexOf(domain) !== -1) _apiUrl = "http://wechat." + domain + "/JsApiWXConfig.aspx";

            CallJsApiWXConfigItf(_apiUrl);

            //回流页面走的流程
            if (location.href.indexOf(_workPageUrl) !== -1) {

                _self.isWorkBackSharePage=true;
                _self.defaultWorkPageWeiShare(title, info);


            }
            //默认页面分享
            else {

                _self.setWeiShare(title, info, url);

            }
            
        });
        
    };
    /**
     * 设置微信分享
     * @param  {string} title [分享标题 默认 _shareTitle]
     * @param  {string} info  [分享内容 默认 _shareInfo]
     * @param  {string} url   [分享链接地址 默认 _shareUrl 传参参考：'/index.html','index.html','http://xxx.xx.com/index.html' ]
     */
    this.setWeiShare = function (title, info, url) {

        _shareTitle = title || _shareTitle;
        _shareInfo = info || _shareInfo;

        if (url && url.indexOf('http') === -1) {

            if (url.indexOf('/') === 0) url = location.origin + url;
            else url = location.origin + '/' + url;

        }

        _shareUrl = url || _shareUrl;

        //进行分享设置
        SetWechatShare(_shareTitle, _shareInfo, _shareUrl, "images/ShareImg.jpg", function () {

            ds.event('WechatShare');

        });

        SetWechatShareToFriend(_shareTitle, _shareInfo);
        SetWechatShareToTimeline(_shareInfo, _shareInfo);

    };
    /**
     * 做回流页面分享
     * @param  {string} workid [作品回流页面地址  如：100' 等于 location.origin+'/index.html?WorkID='+'100']
     * @param  {string} title  [分享标题]
     * @param  {string} info   [分享内容]
     */
    this.setWorkIDWeiShare = function (workid, title, info) {

        title = title || _shareTitle;
        info = info || _shareInfo;

        var _url = location.origin + _workPageUrl + workid;

        SetWechatShare(title, info, _url, "images/ShareImg.jpg", function () {

            ds.event('WechatShare');

        });

        SetWechatShareToFriend(title, info);
        SetWechatShareToTimeline(info, info);

    };
    /**
     * 默认作品回流分享
     * @param  {string} title  [分享标题]
     * @param  {string} info   [分享内容]
     */
    this.defaultWorkPageWeiShare = function (title, info) {

        //获取地址栏参数字典
        var _urlParamDc = ds.net.getUrlParameterDictionary();

        if (!_urlParamDc.WorkID) {

            this.isWorkBackSharePage=false;

            console.warn('地址内作品id参数不存在!');
            return;

        }

        this.isWorkBackSharePage=true;

        var _workid = _urlParamDc.WorkID;

        title = title || _shareTitle;
        info = info || _shareInfo;

        var _url = location.origin + _workPageUrl + _workid;

        SetWechatShare(title, info, _url, "images/ShareImg.jpg", function () {

            ds.event('WechatShare');

        });

        SetWechatShareToFriend(title, info);
        SetWechatShareToTimeline(info, info);

    };

}

module.exports = new APIManager();
