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
     * @class ds.net.CagoeWechatShareModel
     * @param {string} title='分享标题' 分享标题
     * @param {string} info='分享内容' 分享内容
     * @param {string} shareUrl='/index.html' 分享链接
     * @param {string} workUrl='/index.html?WorkID=' 作品回流分享链接
     */
    function CagoeWechatShareModel(title,info,shareUrl,workUrl) {

        var _self=this;

        //设置默认标题
        var _shareTitle = title||'分享标题';
        //设置默认内容
        var _shareInfo = info||'分享内容';
        //设置默认链接
        var _shareUrl = shareUrl!==undefined?getAbsoluteUrl(shareUrl):getAbsoluteUrl('/index.html');
        //作品回流页面地址
        var _workPageUrl = workUrl!==undefined?getAbsoluteUrl(workUrl):getAbsoluteUrl('/index.html?WorkID=');

        /**
         * 作品回流页面地址
         * @member ds.net.CagoeWechatShareModel.prototype.workPageUrl
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
         * @member ds.net.CagoeWechatShareModel.prototype.isWorkBackSharePage
         * @type {boolean}
         */
        this.isWorkBackSharePage = false;

        /**
         * 默认微信分享接口
         * @method ds.net.CagoeWechatShareModel.prototype.defaultWeiShare
         * @param  {string} title [分享标题 默认 _shareTitle]
         * @param  {string} info  [分享内容 默认 _shareInfo]
         * @param  {string} url   [分享链接地址 默认 _shareUrl 传参参考：'/index.html','index.html','http://xxx.xx.com/index.html' ]
         * @param  {string} domain  [设定需要使用指定的域分享接口地址  如："zedigital.com.cn" ，那接口地址会按"http://wechat."+domain+".cn/JsApiWXConfig.aspx" 进行拼接 ]
         */
        this.defaultWeiShare = function (title, info, url, domain) {

            //插入分享接口js文件
            SiteModel.getScript('./js/libs/cagoeShare.js', function () {

                if (location.href.indexOf('github.io') !== -1)return;

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

                    _self.isWorkBackSharePage = true;
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
         * @method ds.net.CagoeWechatShareModel.prototype.setWeiShare
         * @param  {string} title [分享标题 默认 _shareTitle]
         * @param  {string} info  [分享内容 默认 _shareInfo]
         * @param  {string} url   [分享链接地址 默认 _shareUrl 传参参考：'/index.html','index.html','http://xxx.xx.com/index.html' ]
         */
        this.setWeiShare = function (title, info, url) {

            _shareTitle = title || _shareTitle;
            _shareInfo = info || _shareInfo;

            if (url && url.indexOf('http:') <0&& url.indexOf('https:') <0) url=getAbsoluteUrl(url);

            _shareUrl = url || _shareUrl;

            //进行分享设置
            SetWechatShare(_shareTitle, _shareInfo, _shareUrl, "images/ShareImg.jpg", function () {

                ds.event('WechatShare');

            });

            SetWechatShareToFriend(_shareTitle, _shareInfo);
            SetWechatShareToTimeline(_shareInfo, _shareInfo);

        };

        /**
         * 设置回流页面分享
         * @method ds.net.CagoeWechatShareModel.prototype.setWorkIDWeiShare
         * @param  {string} workid [作品回流页面地址  如：100' 等于 location.origin+'/index.html?WorkID='+'100']
         * @param  {string} title  [分享标题]
         * @param  {string} info   [分享内容]
         */
        this.setWorkIDWeiShare = function (workid, title, info) {

            title = title || _shareTitle;
            info = info || _shareInfo;

            var _url = _workPageUrl + workid;

            SetWechatShare(title, info, _url, "images/ShareImg.jpg", function () {

                ds.event('WechatShare');

            });

            SetWechatShareToFriend(title, info);
            SetWechatShareToTimeline(info, info);

        };

        /**
         * 默认作品回流分享
         * @method ds.net.CagoeWechatShareModel.prototype.defaultWorkPageWeiShare
         * @param  {string} title  [分享标题]
         * @param  {string} info   [分享内容]
         */
        this.defaultWorkPageWeiShare = function (title, info) {

            //获取地址栏参数字典
            var _urlParamDc = ds.net.getUrlParameterDictionary();

            if (!_urlParamDc.WorkID) {

                this.isWorkBackSharePage = false;

                console.warn('地址内作品id参数不存在!');
                return;

            }

            this.isWorkBackSharePage = true;

            var _workid = _urlParamDc.WorkID;

            title = title || _shareTitle;
            info = info || _shareInfo;

            var _url = _workPageUrl + _workid;

            SetWechatShare(title, info, _url, "images/ShareImg.jpg", function () {

                ds.event('WechatShare');

            });

            SetWechatShareToFriend(title, info);
            SetWechatShareToTimeline(info, info);

        };


        /**
         * 隐藏微信按钮
         * @method ds.net.CagoeWechatShareModel.prototype.hideMenuItems
         * @param  {array} menuList [https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115]
         */
        this.hideMenuItems=function (menuList) {
            menuList=menuList||[];
            wx.hideMenuItems({
                menuList: menuList // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
            });
        };
        /**
         * 显示微信按钮
         * @method ds.net.CagoeWechatShareModel.prototype.showMenuItems
         * @param  {array} menuList [https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115]
         */
        this.showMenuItems=function() {
            menuList=menuList||[];
            wx.showMenuItems({
                menuList: menuList // 要显示的菜单项，所有menu项见附录3
            });
        };

        var _tempAnchor;
        /**
         * 获取绝对路径 **【受保护内部执行】**
         * @access protected
         * @param {string} url 相对路径
         * @return {string}
         *
         */
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
    ds.net.CagoeWechatShareModel = CagoeWechatShareModel;


    return ds.net.CagoeWechatShareModel;

}));