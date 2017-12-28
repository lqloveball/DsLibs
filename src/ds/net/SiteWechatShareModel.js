//这个类使用老js方法，有可能直接插入html标签内使用
!(function (factory) {

    var root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);


    if (typeof define === 'function' && define.amd) {

        define(['exports'], function (exports) {

            module.exports = factory(root, exports);

        });
    } else if (typeof exports !== 'undefined') {

        module.exports = factory(root, exports);

    } else {

        factory(root);

    }

}(function (root, model) {


    /**
     * 站点通用加载方法模块，一般配合ds.core.SiteModelByMobile实例使用
     * @class ds.net.SiteWechatShareModel
     * @param {string} opts 配置
     * @param {string} opts.title='分享标题' 分享标题
     * @param {string} opts.info='分享内容' 分享内容
     * @param {string} opts.shareUrl='/index.html' 分享链接
     * @param {string} opts.workUrl='/index.html?WorkID=' 作品回流分享链接
     * @param {string} opts.imageUrl="images/ShareImg.jpg" 分享图片
     * @param {string} opts.wxJsUrl='./js/libs/cagoeShare.js' 分享处理js地址
     * @param {string} opts.apiUrl="http://wechat.cagoe.com/JsApiWXConfig.aspx"; 分享接口地址
     * @param {function} opts.shareCallBack=undefined 分享回流方法
     */
    function SiteWechatShareModel(opts) {

        var _self = this;
        opts = opts || {};
        //设置默认标题
        var _shareTitle = opts.title || '分享标题';
        //设置默认内容
        var _shareInfo = opts.info || '分享内容';
        //设置默认链接
        var _shareUrl = opts.shareUrl !== undefined ? getAbsoluteUrl(opts.shareUrl) : getAbsoluteUrl('/index.html');
        //作品回流页面地址
        var _workPageUrl = opts.workUrl !== undefined ? getAbsoluteUrl(opts.workUrl) : getAbsoluteUrl('/index.html?WorkID=');
        //分析链接
        var _shareImageUrl = opts.imageUrl !== undefined ? getAbsoluteUrl(opts.imageUrl) : getAbsoluteUrl("images/ShareImg.jpg");

        //分享接口js地址
        var _wxJsUrl = opts.wxJsUrl !== undefined ? opts.wxJsUrl : './js/libs/cagoeShare.js';
        //接口地址
        var _apiUrl = "http://wechat.cagoe.com/JsApiWXConfig.aspx";
        _apiUrl = opts.apiUrl !== undefined ? opts.apiUrl : _apiUrl;
        //分享成功调用方法
        var _shareCallBack=opts.shareCallBack;

        //微信分享接口模块
        var _WXSDKModel;
        /**
         * 分享js对象
         * @member ds.net.SiteWechatShareModel.prototype.WXSDKModel
         * @type {object}
         */
        Object.defineProperty(this, "WXSDKModel", {
            get: function () {
                return _WXSDKModel;
            }
        });
        /**
         * 作品回流页面地址
         * @member ds.net.SiteWechatShareModel.prototype.workPageUrl
         * @type {string}
         */
        Object.defineProperty(this, "workPageUrl", {
            get: function () {
                return _workPageUrl;
            },
            set: function (value) {
                _workPageUrl = value;
            }
        });

        /**
         * 是否作品回流页面
         * @member ds.net.SiteWechatShareModel.prototype.isWorkBackSharePage
         * @type {boolean}
         */
        this.isWorkBackSharePage = false;

        /**
         * 默认微信分享接口
         * @method ds.net.SiteWechatShareModel.prototype.defaultWeiShare
         * @param  {string} title 分享标题 默认 _shareTitle
         * @param  {string} info  分享内容 默认 _shareInfo
         * @param  {string} url   分享链接地址 默认 _shareUrl 传参参考：'/index.html','index.html','http://xxx.xx.com/index.html' ]
         * @param  {string} imageUrl  分享图片

         */
        this.defaultWeiShare = function (title, info, url, imageUrl) {

            //插入分享接口js文件
            SiteModel.getScript(_wxJsUrl, function () {

                try {

                    if (!WechatSDKModel||!WechatSDKModel.setWXApiConfig) {
                        console.log('分享接口./js/libs/cagoeShare.js 存在问题，请检查');
                        return;
                    }

                } catch (e) {

                    return;

                }

                _WXSDKModel=WechatSDKModel;
                if (!SiteModel.debug) _WXSDKModel.setWXApiConfig(_apiUrl);
                _shareImageUrl = imageUrl !== undefined ? getAbsoluteUrl(imageUrl) : _shareImageUrl;
                //回流页面走的流程
                if (location.href.indexOf(_workPageUrl) !== -1) {
                    _self.isWorkBackSharePage = true;
                    _self.defaultWorkPageWeiShare(title,info);
                }
                //默认页面分享
                else {
                    _self.setShare(title,info);
                }

            });

        };
        /**
         * 设置微信分享
         * @method ds.net.SiteWechatShareModel.prototype.setShare
         * @param  {string} title 分享标题 默认 _shareTitle
         * @param  {string} info  分享内容 默认 _shareInfo
         * @param  {string} url   分享链接地址 默认 _shareUrl 传参参考：'/index.html','index.html','http://xxx.xx.com/index.html'
         * @param  {string} imageUrl 分享图片地址
         * @param {function} callback 分享成功调用
         */
        this.setShare = function (title, info, url, imageUrl,callback) {

            _shareTitle = title || _shareTitle;
            _shareInfo = info || _shareInfo;
            _shareImageUrl = imageUrl !== undefined ? getAbsoluteUrl(imageUrl) : _shareImageUrl;

            if (url) url = getAbsoluteUrl(url);

            _shareUrl = url || _shareUrl;

            //进行分享设置
            _WXSDKModel.setShare(_shareTitle, _shareInfo, _shareUrl, _shareImageUrl, function (type) {
                ds.net.event('WeChatShare');
                if(callback)callback(type);
                if(_shareCallBack)_shareCallBack(type);
            });
        };

        /**
         * 只设置朋友圈的文案
         * @method ds.net.SiteWechatShareModel.prototype.setShareToTimeline
         * @param {string} title 这个值不起作用，朋友圈没有标题
         * @param {string} info 分享内容
         * @param {string} url 分享链接地址
         * @param {string} imageUrl  分享图片
         * @param {function} callback 分享成功调用
         */
        this.setShareToTimeline = function (title,info, url, imageUrl,callback) {

            // _shareTitle = title || _shareTitle;
            _shareInfo = info || _shareInfo;
            _shareImageUrl = imageUrl !== undefined ? getAbsoluteUrl(imageUrl) : _shareImageUrl;

            if (url) url = getAbsoluteUrl(url);

            _shareUrl = url || _shareUrl;

            _WXSDKModel.shareToTimeline(_shareInfo, _shareInfo,_shareUrl,_shareImageUrl,function (type) {
                ds.net.event('WeChatTimelineShare');
                if(callback)callback(type);
                // if(_shareCallBack)_shareCallBack(type);
            });
        };


        /**
         * 只设置分享朋友的
         * @method ds.net.SiteWechatShareModel.prototype.setShareToFriend
         * @param {string} title 分享标题
         * @param {string} info 分享内容
         * @param {string} url 分享链接地址
         * @param {string} imageUrl  分享图片
         * @param {function} callback 分享成功调用
         */
        this.setShareToFriend = function (title, info, url, imageUrl,callback) {

            _shareTitle = title || _shareTitle;
            _shareInfo = info || _shareInfo;
            _shareImageUrl = imageUrl !== undefined ? getAbsoluteUrl(imageUrl) : _shareImageUrl;

            if (url) url = getAbsoluteUrl(url);

            _shareUrl = url || _shareUrl;

            _WXSDKModel.shareToFriend(_shareTitle, _shareInfo,_shareUrl,_shareImageUrl,function (type) {
                ds.net.event('WeChatFriendShare');
                if(callback)callback(type);
                // if(_shareCallBack)_shareCallBack(type);
            });

        };

        /**
         * 设置回流页面分享
         * @method ds.net.SiteWechatShareModel.prototype.setWorkIDShare
         * @param  {string} workid 作品回流页面地址  如：100' 等于 location.origin+'/index.html?WorkID='+'100'
         * @param  {string} title  分享标题
         * @param  {string} info   分享内容
         * @param {string} imageUrl 分享图片
         * @param {function} callback 分享成功调用
         */
        this.setWorkIDShare = function (workid, title, info, imageUrl, callback) {

            _shareTitle = title || _shareTitle;
            _shareInfo = info || _shareInfo;
            _shareImageUrl = imageUrl !== undefined ? getAbsoluteUrl(imageUrl) : _shareImageUrl;

            var _url = _workPageUrl + workid;
            _url = getAbsoluteUrl(_url);
            _shareUrl = _url || _shareUrl;

            _WXSDKModel.setShare(_shareTitle, _shareInfo, _shareUrl, _shareImageUrl, function (type) {
                ds.net.event('WeChatShare');
                if(callback)callback(type);
                if(_shareCallBack)_shareCallBack(type);
            });

        };

        /**
         * 默认作品回流分享
         * @method ds.net.SiteWechatShareModel.prototype.defaultWorkPageWeiShare
         * @param  {string} title  分享标题
         * @param  {string} info   分享内容
         * @param  {string} imageUrl   分享内容
         * @param {function} callback 分享成功调用
         */
        this.defaultWorkPageWeiShare = function (title, info, imageUrl,callback) {

            //获取地址栏参数字典
            var _urlParamDc = ds.net.getUrlParameterDictionary();

            if (!_urlParamDc||!_urlParamDc['WorkID']) {
                this.isWorkBackSharePage = false;
                console.warn('地址内作品id参数不存在!');
                return;
            }

            this.isWorkBackSharePage = true;

            var _workid = _urlParamDc['WorkID'];

            _shareTitle = title || _shareTitle;
            _shareInfo = info || _shareInfo;
            _shareImageUrl = imageUrl !== undefined ? getAbsoluteUrl(imageUrl) : _shareImageUrl;

            var _url = _workPageUrl + _workid;
            _url = getAbsoluteUrl(_url);
            _shareUrl = _url || _shareUrl;

            _WXSDKModel.setShare(_shareTitle, _shareInfo, _shareUrl, _shareImageUrl, function (type) {
                ds.net.event('WeChatShare');
                if(callback)callback(type);
                if(_shareCallBack)_shareCallBack(type);
            });

        };


        /**
         * 隐藏微信按钮
         * @method ds.net.SiteWechatShareModel.prototype.hideMenuItems
         * @param  {array} menuList [https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115]
         */
        this.hideMenuItems = function (menuList) {
            if(!wx)return;
            menuList = menuList || [];
            wx.hideMenuItems({
                menuList: menuList
            });
        };
        /**
         * 显示微信按钮
         * @method ds.net.SiteWechatShareModel.prototype.showMenuItems
         * @param  {array} menuList [https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115]
         */
        this.showMenuItems = function (menuList) {
            if(!wx)return;
            menuList = menuList || [];
            wx.showMenuItems({
                menuList: menuList
            });
        };

        var _tempAnchor;
        function getAbsoluteUrl(url) {
            if (url.indexOf("http:") >= 0 || url.indexOf("https:") >= 0) return url;
            if (!_tempAnchor) _tempAnchor = document.createElement('a');
            _tempAnchor.href = url;
            url = _tempAnchor.href;
            return url;
        }

    }

    var ds = root.ds = root.ds || {};
    ds.net = ds.net || {};
    ds.net.SiteWechatShareModel = SiteWechatShareModel;


    return ds.net.SiteWechatShareModel;

}));