/**
 * @class Ds.gemo.WebShare
 * @classdesc:微博分享代码类
 * @extends
 * @example:
 * //微博分享
 * Ds.gemo.WebShare.SetWebShare('tsina', 'images/ShareImg.jpg', '分享内容', location.href);
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  我发起Ds库目的，简化方便工作项目开发。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里代码很多也都来源至或参考网络开源开放代码，所以这个库也开源开放。更多希望团队成员把积累工作中常用的代码，加快自己开发效率。
 * @constructor
 **/


 //111
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
    root.Ds.gemo = root.Ds.gemo || {};
    root.Ds.gemo.WebShare = new WebShare();
    /**
     * 快速进行执行检测代码
     */
    function WebShare() {
        var _Self = this;
        var _ShareType = 'tsina',
            _ShareImg = 'images/ShareImg.jpg',
            _ShareContent = "分享内容",
            _ShareUrl = location.origin;
        /**
         * 设置分享
         * @param  {[String]} shareType   [分享类型 qqzone,tsina,renren,douban,kaixin,tenxun,weixin]
         * @param  {[String]} shareImg [分享图片]
         * @param  {[String]} shareContent [分享内容]
         * @param  {[String]} shareUrl [分享链接]
         */
        this.SetWebShare = function(shareType, shareImg, shareContent, shareUrl) {
            var _type = shareType || _ShareType,
                _img = shareImg || _ShareImg,
                _title = shareContent || _ShareContent,
                _url = shareUrl || _ShareUrl;
            if (_type == "qqzone") {
                window.location.href = ('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + encodeURIComponent(_url) +
                    '&title=' + encodeURIComponent(_title + "") + '&pics=' + encodeURIComponent(_img) + '&summary=' + encodeURIComponent(_title));
            } else if (_type == "tsina") {
                window.location.href = ('http://s.jiathis.com/?webid=' + _type + '&title=' + encodeURIComponent(_title + "") + '&pic=' +
                    encodeURIComponent(_img) + "&url=" + encodeURIComponent(_url));
            } else if (_type == "renren") {
                window.location.href = ('http://s.jiathis.com/?webid=' + _type + '&summary=' + encodeURIComponent(_title) + '&url=' +
                    encodeURIComponent(_url) + '&title=' + '&pic=' + encodeURIComponent(_img));
            } else if (_type == "douban") {
                window.location.href = ('http://s.jiathis.com/?webid=' + _type + '&summary=' + '&title=' + encodeURIComponent(_title) +
                    '&pic=' + encodeURIComponent(_img) + "&url=" + encodeURIComponent(_url));
            } else if (_type == "kaixin") {
                window.location.href = ('http://www.kaixin001.com/rest/records.php?content=' + encodeURIComponent(_title) +
                    '&starid=&aid=&style=11&pic=' + encodeURIComponent(_img) + '&t=10&url=' + encodeURIComponent(_url));
            } else if (_type == "tenxun") {
                window.location.href = ("http://share.v.t.qq.com/index.php?c=share&a=index&title=" + encodeURIComponent(_title) + "&url=" +
                    encodeURIComponent(_url) + "&appkey=&site=&pic=" + encodeURIComponent(_img));
            } else if (_type == "weixin") {
                window.location.href = ("http://s.jiathis.com/?webid=weixin&uid=0&jtss=0&appkey=&ralateuid=&url=" +
                    encodeURIComponent(_url) + "&title=" + encodeURIComponent(_title) + "&pic=" +
                    encodeURIComponent(_img) + "&acn=&acu=&summary=&isexit=false");
            }
        };
    }

    return root.Ds.gemo.WebShare;
}));
