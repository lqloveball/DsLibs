// 微信Js API
!function (a, b) {
    "function" == typeof define && (define.amd || define.cmd) ? define(function () {
        return b(a);
    }) : b(a, !0);
}(this, function (a, b) {
    function c(b, c, d) {
        a.WeixinJSBridge ? WeixinJSBridge.invoke(b, e(c), function (a) {
            g(b, a, d);
        }) : j(b, d);
    }

    function d(b, c, d) {
        a.WeixinJSBridge ? WeixinJSBridge.on(b, function (a) {
            d && d.trigger && d.trigger(a), g(b, a, c);
        }) : d ? j(b, d) : j(b, c);
    }

    function e(a) {
        return a = a || {}, a.appId = E.appId, a.verifyAppId = E.appId, a.verifySignType = "sha1", a.verifyTimestamp = E.timestamp + "", a.verifyNonceStr = E.nonceStr, a.verifySignature = E.signature, a;
    }

    function f(a) {
        return {
            timeStamp: a.timestamp + "",
            nonceStr: a.nonceStr,
            "package": a.package,
            paySign: a.paySign,
            signType: a.signType || "SHA1"
        };
    }

    function g(a, b, c) {
        var d, e, f;
        switch (delete b.err_code, delete b.err_desc, delete b.err_detail, d = b.errMsg, d || (d = b.err_msg, delete b.err_msg, d = h(a, d), b.errMsg = d), c = c || {}, c._complete && (c._complete(b), delete c._complete), d = b.errMsg || "", E.debug && !c.isInnerInvoke && alert(JSON.stringify(b)), e = d.indexOf(":"), f = d.substring(e + 1)) {
            case "ok":
                c.success && c.success(b);
                break;
            case "cancel":
                c.cancel && c.cancel(b);
                break;
            default:
                c.fail && c.fail(b);
        }
        c.complete && c.complete(b);
    }

    function h(a, b) {
        var e, f, c = a, d = p[c];
        return d && (c = d), e = "ok", b && (f = b.indexOf(":"), e = b.substring(f + 1), "confirm" == e && (e = "ok"), "failed" == e && (e = "fail"), -1 != e.indexOf("failed_") && (e = e.substring(7)), -1 != e.indexOf("fail_") && (e = e.substring(5)), e = e.replace(/_/g, " "), e = e.toLowerCase(), ("access denied" == e || "no permission to execute" == e) && (e = "permission denied"), "config" == c && "function not exist" == e && (e = "ok"), "" == e && (e = "fail")), b = c + ":" + e;
    }

    function i(a) {
        var b, c, d, e;
        if (a) {
            for (b = 0, c = a.length; c > b; ++b) d = a[b], e = o[d], e && (a[b] = e);
            return a;
        }
    }

    function j(a, b) {
        if (!(!E.debug || b && b.isInnerInvoke)) {
            var c = p[a];
            c && (a = c), b && b._complete && delete b._complete, console.log('"' + a + '",', b || "");
        }
    }

    function k() {
        0 != D.preVerifyState && (u || v || E.debug || "6.0.2" > z || D.systemType < 0 || A || (A = !0, D.appId = E.appId, D.initTime = C.initEndTime - C.initStartTime, D.preVerifyTime = C.preVerifyEndTime - C.preVerifyStartTime, H.getNetworkType({
            isInnerInvoke: !0,
            success: function (a) {
                var b, c;
                D.networkType = a.networkType, b = "http://open.weixin.qq.com/sdk/report?v=" + D.version + "&o=" + D.preVerifyState + "&s=" + D.systemType + "&c=" + D.clientVersion + "&a=" + D.appId + "&n=" + D.networkType + "&i=" + D.initTime + "&p=" + D.preVerifyTime + "&u=" + D.url, c = new Image, c.src = b;
            }
        })));
    }

    function l() {
        return (new Date).getTime();
    }

    function m(b) {
        w && (a.WeixinJSBridge ? b() : q.addEventListener && q.addEventListener("WeixinJSBridgeReady", b, !1));
    }

    function n() {
        H.invoke || (H.invoke = function (b, c, d) {
            a.WeixinJSBridge && WeixinJSBridge.invoke(b, e(c), d);
        }, H.on = function (b, c) {
            a.WeixinJSBridge && WeixinJSBridge.on(b, c);
        });
    }

    var o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H;
    if (!a.jWeixin) return o = {
        config: "preVerifyJSAPI",
        onMenuShareTimeline: "menu:share:timeline",
        onMenuShareAppMessage: "menu:share:appmessage",
        onMenuShareQQ: "menu:share:qq",
        onMenuShareWeibo: "menu:share:weiboApp",
        onMenuShareQZone: "menu:share:QZone",
        previewImage: "imagePreview",
        getLocation: "geoLocation",
        openProductSpecificView: "openProductViewWithPid",
        addCard: "batchAddCard",
        openCard: "batchViewCard",
        chooseWXPay: "getBrandWCPayRequest"
    }, p = function () {
        var b, a = {};
        for (b in o) a[o[b]] = b;
        return a;
    }(), q = a.document, r = q.title, s = navigator.userAgent.toLowerCase(), t = navigator.platform.toLowerCase(), u = !(!t.match("mac") && !t.match("win")), v = -1 != s.indexOf("wxdebugger"), w = -1 != s.indexOf("micromessenger"), x = -1 != s.indexOf("android"), y = -1 != s.indexOf("iphone") || -1 != s.indexOf("ipad"), z = function () {
        var a = s.match(/micromessenger\/(\d+\.\d+\.\d+)/) || s.match(/micromessenger\/(\d+\.\d+)/);
        return a ? a[1] : "";
    }(), A = !1, B = !1, C = {
        initStartTime: l(),
        initEndTime: 0,
        preVerifyStartTime: 0,
        preVerifyEndTime: 0
    }, D = {
        version: 1,
        appId: "",
        initTime: 0,
        preVerifyTime: 0,
        networkType: "",
        preVerifyState: 1,
        systemType: y ? 1 : x ? 2 : -1,
        clientVersion: z,
        url: encodeURIComponent(location.href)
    }, E = {}, F = {_completes: []}, G = {state: 0, data: {}}, m(function () {
        C.initEndTime = l();
    }), H = {
        config: function (a) {
            E = a, j("config", a);
            var b = E.check === !1 ? !1 : !0;
            m(function () {
                var a, d, e;
                if (b) c(o.config, {verifyJsApiList: i(E.jsApiList)}, function () {
                    F._complete = function (a) {
                        C.preVerifyEndTime = l(), G.state = 1, G.data = a;
                    }, F.success = function () {
                        D.preVerifyState = 0;
                    }, F.fail = function (a) {
                        F._fail ? F._fail(a) : G.state = -1;
                    };
                    var a = F._completes;
                    return a.push(function () {
                        k();
                    }), F.complete = function () {
                        for (var c = 0, d = a.length; d > c; ++c) a[c]();
                        F._completes = [];
                    }, F;
                }()), C.preVerifyStartTime = l(); else {
                    for (G.state = 1, a = F._completes, d = 0, e = a.length; e > d; ++d) a[d]();
                    F._completes = [];
                }
            }), E.beta && n();
        }, ready: function (a) {
            0 != G.state ? a() : (F._completes.push(a), !w && E.debug && a());
        }, error: function (a) {
            "6.0.2" > z || B || (B = !0, -1 == G.state ? a(G.data) : F._fail = a);
        }, checkJsApi: function (a) {
            var b = function (a) {
                var c, d, b = a.checkResult;
                for (c in b) d = p[c], d && (b[d] = b[c], delete b[c]);
                return a;
            };
            c("checkJsApi", {jsApiList: i(a.jsApiList)}, function () {
                return a._complete = function (a) {
                    if (x) {
                        var c = a.checkResult;
                        c && (a.checkResult = JSON.parse(c));
                    }
                    a = b(a);
                }, a;
            }());
        }, onMenuShareTimeline: function (a) {
            d(o.onMenuShareTimeline, {
                complete: function () {
                    c("shareTimeline", {
                        title: a.title || r,
                        desc: a.title || r,
                        img_url: a.imgUrl || "",
                        link: a.link || location.href,
                        type: a.type || "link",
                        data_url: a.dataUrl || ""
                    }, a);
                }
            }, a);
        }, onMenuShareAppMessage: function (a) {
            d(o.onMenuShareAppMessage, {
                complete: function () {
                    c("sendAppMessage", {
                        title: a.title || r,
                        desc: a.desc || "",
                        link: a.link || location.href,
                        img_url: a.imgUrl || "",
                        type: a.type || "link",
                        data_url: a.dataUrl || ""
                    }, a);
                }
            }, a);
        }, onMenuShareQQ: function (a) {
            d(o.onMenuShareQQ, {
                complete: function () {
                    c("shareQQ", {
                        title: a.title || r,
                        desc: a.desc || "",
                        img_url: a.imgUrl || "",
                        link: a.link || location.href
                    }, a);
                }
            }, a);
        }, onMenuShareWeibo: function (a) {
            d(o.onMenuShareWeibo, {
                complete: function () {
                    c("shareWeiboApp", {
                        title: a.title || r,
                        desc: a.desc || "",
                        img_url: a.imgUrl || "",
                        link: a.link || location.href
                    }, a);
                }
            }, a);
        }, onMenuShareQZone: function (a) {
            d(o.onMenuShareQZone, {
                complete: function () {
                    c("shareQZone", {
                        title: a.title || r,
                        desc: a.desc || "",
                        img_url: a.imgUrl || "",
                        link: a.link || location.href
                    }, a);
                }
            }, a);
        }, startRecord: function (a) {
            c("startRecord", {}, a);
        }, stopRecord: function (a) {
            c("stopRecord", {}, a);
        }, onVoiceRecordEnd: function (a) {
            d("onVoiceRecordEnd", a);
        }, playVoice: function (a) {
            c("playVoice", {localId: a.localId}, a);
        }, pauseVoice: function (a) {
            c("pauseVoice", {localId: a.localId}, a);
        }, stopVoice: function (a) {
            c("stopVoice", {localId: a.localId}, a);
        }, onVoicePlayEnd: function (a) {
            d("onVoicePlayEnd", a);
        }, uploadVoice: function (a) {
            c("uploadVoice", {localId: a.localId, isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1}, a);
        }, downloadVoice: function (a) {
            c("downloadVoice", {serverId: a.serverId, isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1}, a);
        }, translateVoice: function (a) {
            c("translateVoice", {localId: a.localId, isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1}, a);
        }, chooseImage: function (a) {
            c("chooseImage", {
                scene: "1|2",
                count: a.count || 9,
                sizeType: a.sizeType || ["original", "compressed"],
                sourceType: a.sourceType || ["album", "camera"]
            }, function () {
                return a._complete = function (a) {
                    if (x) {
                        var b = a.localIds;
                        b && (a.localIds = JSON.parse(b));
                    }
                }, a;
            }());
        }, previewImage: function (a) {
            c(o.previewImage, {current: a.current, urls: a.urls}, a);
        }, uploadImage: function (a) {
            c("uploadImage", {localId: a.localId, isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1}, a);
        }, downloadImage: function (a) {
            c("downloadImage", {serverId: a.serverId, isShowProgressTips: 0 == a.isShowProgressTips ? 0 : 1}, a);
        }, getNetworkType: function (a) {
            var b = function (a) {
                var c, d, e, b = a.errMsg;
                if (a.errMsg = "getNetworkType:ok", c = a.subtype, delete a.subtype, c) a.networkType = c; else switch (d = b.indexOf(":"), e = b.substring(d + 1)) {
                    case "wifi":
                    case "edge":
                    case "wwan":
                        a.networkType = e;
                        break;
                    default:
                        a.errMsg = "getNetworkType:fail";
                }
                return a;
            };
            c("getNetworkType", {}, function () {
                return a._complete = function (a) {
                    a = b(a);
                }, a;
            }());
        }, openLocation: function (a) {
            c("openLocation", {
                latitude: a.latitude,
                longitude: a.longitude,
                name: a.name || "",
                address: a.address || "",
                scale: a.scale || 28,
                infoUrl: a.infoUrl || ""
            }, a);
        }, getLocation: function (a) {
            a = a || {}, c(o.getLocation, {type: a.type || "wgs84"}, function () {
                return a._complete = function (a) {
                    delete a.type;
                }, a;
            }());
        }, hideOptionMenu: function (a) {
            c("hideOptionMenu", {}, a);
        }, showOptionMenu: function (a) {
            c("showOptionMenu", {}, a);
        }, closeWindow: function (a) {
            a = a || {}, c("closeWindow", {}, a);
        }, hideMenuItems: function (a) {
            c("hideMenuItems", {menuList: a.menuList}, a);
        }, showMenuItems: function (a) {
            c("showMenuItems", {menuList: a.menuList}, a);
        }, hideAllNonBaseMenuItem: function (a) {
            c("hideAllNonBaseMenuItem", {}, a);
        }, showAllNonBaseMenuItem: function (a) {
            c("showAllNonBaseMenuItem", {}, a);
        }, scanQRCode: function (a) {
            a = a || {}, c("scanQRCode", {
                needResult: a.needResult || 0,
                scanType: a.scanType || ["qrCode", "barCode"]
            }, function () {
                return a._complete = function (a) {
                    var b, c;
                    y && (b = a.resultStr, b && (c = JSON.parse(b), a.resultStr = c && c.scan_code && c.scan_code.scan_result));
                }, a;
            }());
        }, openProductSpecificView: function (a) {
            c(o.openProductSpecificView, {pid: a.productId, view_type: a.viewType || 0, ext_info: a.extInfo}, a);
        }, addCard: function (a) {
            var e, f, g, h, b = a.cardList, d = [];
            for (e = 0, f = b.length; f > e; ++e) g = b[e], h = {card_id: g.cardId, card_ext: g.cardExt}, d.push(h);
            c(o.addCard, {card_list: d}, function () {
                return a._complete = function (a) {
                    var c, d, e, b = a.card_list;
                    if (b) {
                        for (b = JSON.parse(b), c = 0, d = b.length; d > c; ++c) e = b[c], e.cardId = e.card_id, e.cardExt = e.card_ext, e.isSuccess = e.is_succ ? !0 : !1, delete e.card_id, delete e.card_ext, delete e.is_succ;
                        a.cardList = b, delete a.card_list;
                    }
                }, a;
            }());
        }, chooseCard: function (a) {
            c("chooseCard", {
                app_id: E.appId,
                location_id: a.shopId || "",
                sign_type: a.signType || "SHA1",
                card_id: a.cardId || "",
                card_type: a.cardType || "",
                card_sign: a.cardSign,
                time_stamp: a.timestamp + "",
                nonce_str: a.nonceStr
            }, function () {
                return a._complete = function (a) {
                    a.cardList = a.choose_card_info, delete a.choose_card_info;
                }, a;
            }());
        }, openCard: function (a) {
            var e, f, g, h, b = a.cardList, d = [];
            for (e = 0, f = b.length; f > e; ++e) g = b[e], h = {card_id: g.cardId, code: g.code}, d.push(h);
            c(o.openCard, {card_list: d}, a);
        }, chooseWXPay: function (a) {
            c(o.chooseWXPay, f(a), a);
        }
    }, b && (a.wx = a.jWeixin = H), H;
});

!(function () {

    var root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

    //微信分享模块对象
    root.WechatSDKModel = {};
    var WechatSDKModel = root.WechatSDKModel;

    var _getAbsoluteATag = document.createElement('A');

    /**
     * 获取绝对路径
     * @param url
     * @return {*}
     */
    function getAbsoluteUrl(url) {
        if (url.indexOf("http:") >= 0 || url.indexOf("https:") >= 0) return url;
        _getAbsoluteATag.href = url;
        url = _getAbsoluteATag.href;
        return url;
    }

    /**
     * 获取默认值
     * @param obj
     * @param defaultValue
     * @return {*}
     */
    function getDefault(obj, defaultValue) {
        if (obj === undefined || obj === null) return defaultValue;
        if (obj === 'true') return true;
        else if (obj === 'false') return false;
        return obj;
    }

    /**
     * 获取地址栏参数索引对象
     * @alias module:ds/net/QuickAjax.getUrlParameterDictionary
     * @param {string} [url = location.href] url地址
     * @return {object} 参数值
     */
    function getUrlParameterDictionary(url) {

        if (url === undefined || url === null) url = location.href;

        var _name, _value;
        var _num = url.indexOf("?");

        url = url.substr(_num + 1);
        // console.log(url);

        var _request = null;
        var arr = url.split("&"); //各个参数放到数组里

        for (var i = 0; i < arr.length; i++) {

            _num = arr[i].indexOf("=");
            if (_num > 0) {

                _name = arr[i].substring(0, _num);
                _value = arr[i].substr(_num + 1);

                if (!_request) _request = {};
                _request[_name] = _value;

            }

        }

        return _request;
    }

    //分享接口地址
    var WXApiConfigUrl = '';
    //使用jssdk的功能列表
    var jsApiList = [
        'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'translateVoice',
        'startRecord',
        'stopRecord',
        'onRecordEnd',
        'playVoice',
        'pauseVoice',
        'stopVoice',
        'uploadVoice',
        'downloadVoice',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
        'getNetworkType',
        'openLocation',
        'getLocation',
        'hideOptionMenu',
        'showOptionMenu',
        'closeWindow',
        'scanQRCode',
        'chooseWXPay',
        'openProductSpecificView',
        'addCard',
        'chooseCard',
        'openCard'
    ];

    //默认分享成功
    var shareTitle = "";
    var shareContent = "";
    var shareUrl = window.location.href;
    var shareImgUrl = "";
    var shareSuccessCallBack = undefined;
    var shareCancelCallBack = undefined;
    var shareFailCallBack = undefined;

    //发送给朋友
    var shareFriendTitle = "";
    var shareFriendContent = "";
    var shareFriendUrl = "";
    var shareFriendImgUrl = "";
    var shareFriendSuccessCallBack = undefined;
    var shareFriendCancelCallBack = undefined;
    var shareFriendFailCallBack = undefined;

    //发送给朋友圈
    var shareTimelineTitle = "";
    var shareTimelineContent = "";
    var shareTimelineUrl = "";
    var shareTimelineImgUrl = "";
    var shareTimelineSuccessCallBack = undefined;
    var shareTimelineCancelCallBack = undefined;
    var shareTimelineFailCallBack = undefined;

    // 微信分享类型
    var shareTypes = {
        //发送给好友
        appmessage: "appmessage",
        //分享到朋友圈
        timeline: "timeline",
        //分享到微博
        weibo: "weibo",
        //分享到qq
        qq: "qq",
        //分享到facebook
        facebook: "facebook"
    };

    //设置分享内容
    WechatSDKModel.setShare = setShare;

    function setShare(title, content, tContent, url, imgUrl, success, cancel, fail) {

        title = shareTitle = getDefault(title, '设置分享标题');
        content = shareContent = getDefault(content, '设置分享内容');
        tContent = getDefault(tContent, content);

        url = shareUrl = getDefault(url, window.location.href);

        imgUrl = shareImgUrl = getDefault(imgUrl, getAbsoluteUrl('./images/ShareImg.jpg'));

        shareSuccessCallBack = success;
        shareCancelCallBack = cancel;
        shareFailCallBack = fail;

        shareFriendTitle = shareTitle;
        shareFriendContent = shareContent;
        shareFriendUrl = shareUrl;
        shareFriendImgUrl = shareImgUrl;

        // shareFriendSuccessCallBack = success;
        // shareFriendCancelCallBack = cancel;
        // shareFriendFailCallBack = fail;

        shareTimelineTitle = tContent;
        shareTimelineContent = tContent;
        shareTimelineUrl = shareUrl;
        shareTimelineImgUrl = shareImgUrl;
        // shareTimelineSuccessCallBack = success;
        // shareTimelineCancelCallBack = cancel;
        // shareTimelineFailCallBack = fail;

        if (WXApiConfigUrl !== "") bindJsApiEvent();
        else {
            $("body").prepend("<img class='sharePic' src='" + imgUrl + "' style='position:fixed;top: -1000px;left: -1000px;' />");
            $(document).attr('title', title);
            if (url.indexOf("#") >= 0) window.location.hash = url.substring(url.indexOf("#"));
        }

    }

    //分享给朋友
    WechatSDKModel.shareToFriend = shareToFriend;

    function shareToFriend(title, content, url, imgUrl, success, cancel, fail) {
        shareFriendTitle = title;
        shareFriendContent = content;

        if (url) shareFriendUrl = getAbsoluteUrl(url);
        if (shareFriendUrl === '') shareFriendUrl = shareUrl;

        if (imgUrl) shareFriendImgUrl = getAbsoluteUrl(imgUrl);
        if (shareFriendImgUrl === '') shareFriendImgUrl = shareImgUrl;

        shareFriendSuccessCallBack = success;
        shareFriendCancelCallBack = cancel;
        shareFriendFailCallBack = fail;

        if (WXApiConfigUrl !== "") bindJsApiEvent();
    }

    //分享到朋友圈
    WechatSDKModel.shareToTimeline = shareToTimeline;

    function shareToTimeline(title, content, url, imgUrl, success, cancel, fail) {

        shareTimelineTitle = title;
        shareTimelineContent = content;

        if (url) shareTimelineUrl = getAbsoluteUrl(url);
        if (shareTimelineUrl === '') shareTimelineUrl = shareUrl;

        if (imgUrl) shareTimelineImgUrl = getAbsoluteUrl(imgUrl);
        if (shareTimelineImgUrl === '') shareTimelineImgUrl = shareImgUrl;

        shareTimelineSuccessCallBack = success;
        shareTimelineCancelCallBack = cancel;
        shareTimelineFailCallBack = fail;

        if (WXApiConfigUrl !== "") bindJsApiEvent();

    }

    WechatSDKModel.setWXApiConfig = setWXApiConfig;

    /**
     * 进行微信分享API Config请求
     * @param {string} url  接口地址："http://wechat.cagoe.com/JsApiWXConfig.aspx"
     * @param {function} success  成功返回
     * @param {function} error  错误返回
     */
    function setWXApiConfig(url, success, error) {

        if (WXApiConfigUrl !== "") {
            if (error) error(-1, '已经请求过接口');
            return;
        }

        WXApiConfigUrl = url;

        var _debug = false;

        var _urlConfig = getUrlParameterDictionary();
        if (_urlConfig && _urlConfig.shareDebug && Number(_urlConfig.shareDebug) === 1) {
            _debug=true;
        }

        //不是绝对路径
        url = getAbsoluteUrl(url);

        var _url = url + (url.indexOf("?") > 0 ? "&" : "?") + "url=" + encodeURIComponent(location.href);

        if (_debug) {
            _url = _url + "&Debug=1";
            console.log('share API url:', url);
        }

        var _dataType = "jsonp";
        var _type = 'get';
        //非跨域情况下使用
        if (url.indexOf(location.origin) === 0) {
            _dataType = 'text';
        }

        $.ajax({
            url: _url,
            type: _type,
            dataType: _dataType,
            success: function (data) {
                if (success) success(data);
                if (_debug) {
                    console.log('share API back:', arguments);
                }
                /**
                 * cagoe的接口都会把 wx.config 写在返回的接口内，所以需要使用eval来执行。
                 * 在jsonp情况下 data ，会因为公司的data带了 wx.config ，所以data返回的是undefined,实际已经执行成功.
                 */
                eval(data);
                /**
                 * 如果对接别人第三方客户的分享接口，原生wx.config设置参考
                 * https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115
                 */

            }, error: function (data) {
                if (error) error(0, data);
                console.warn('WechatSDKModel.setWXApiConfig Error:', data);
            }
        });

    }

    //绑定微信SKD事件
    WechatSDKModel.bindJsApiEvent = bindJsApiEvent;

    function bindJsApiEvent() {
        //微信SDK API设置
        wx.checkJsApi({
            // 需要检测的JS接口列表，所有JS接口列表见附录2,
            jsApiList: jsApiList,
            success: function (res) {
                // 以键值对的形式返回，可用的api值true，不可用为false
                // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
            }
        });
        //2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareAppMessage({
            title: shareFriendTitle,
            desc: shareFriendContent,
            link: shareFriendUrl,
            imgUrl: shareFriendImgUrl,
            trigger: function (res) {
            },
            success: function (res) {
                if (shareSuccessCallBack) shareSuccessCallBack(shareTypes.appmessage);
                if (shareFriendSuccessCallBack) shareFriendSuccessCallBack(shareTypes.appmessage);
            },
            cancel: function (res) {
                if (shareCancelCallBack) shareCancelCallBack(shareTypes.appmessage);
                if (shareFriendCancelCallBack) shareFriendCancelCallBack(shareTypes.appmessage);
            },
            fail: function (res) {
                if (shareFailCallBack) shareFailCallBack(shareTypes.appmessage);
                if (shareFriendFailCallBack) shareFriendFailCallBack(shareTypes.appmessage);
            }
        });

        // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareTimeline({
            title: (shareTimelineContent !== '') ? shareTimelineContent : shareTimelineTitle,
            link: shareTimelineUrl,
            imgUrl: shareTimelineImgUrl,
            trigger: function (res) {
                //alert('用户点击分享到朋友圈');
            },
            success: function (res) {
                if (shareSuccessCallBack) shareSuccessCallBack(shareTypes.timeline);
                if (shareTimelineSuccessCallBack) shareTimelineSuccessCallBack(shareTypes.timeline);
            },
            cancel: function (res) {
                if (shareCancelCallBack) shareCancelCallBack(shareTypes.timeline);
                if (shareTimelineCancelCallBack) shareTimelineCancelCallBack(shareTypes.timeline);
            },
            fail: function (res) {
                if (shareFailCallBack) shareFailCallBack(shareTypes.timeline);
                if (shareTimelineFailCallBack) shareTimelineFailCallBack(shareTypes.timeline);
            }
        });

        // 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareQQ({
            title: shareTitle,
            desc: shareContent,
            link: shareUrl,
            imgUrl: shareImgUrl,
            trigger: function (res) {
                //alert(JSON.stringify(res));
            },
            complete: function (res) {
                //alert(JSON.stringify(res));
            },
            success: function (res) {
                if (shareSuccessCallBack) shareSuccessCallBack(shareTypes.qq);
            },
            cancel: function (res) {
                if (shareCancelCallBack) shareCancelCallBack(shareTypes.qq);
            },
            fail: function (res) {
                if (shareFailCallBack) shareFailCallBack(shareTypes.qq);
            }
        });

        // 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareWeibo({
            title: shareTitle,
            desc: shareContent,
            link: shareUrl,
            imgUrl: shareImgUrl,
            trigger: function (res) {
                //alert(JSON.stringify(res));
            },
            complete: function (res) {
                //alert(JSON.stringify(res));
            },
            success: function (res) {
                if (shareSuccessCallBack) shareSuccessCallBack(shareTypes.weibo);

            },
            cancel: function (res) {
                if (shareCancelCallBack) shareCancelCallBack(shareTypes.weibo);
            },
            fail: function (res) {
                if (shareFailCallBack) shareFailCallBack(shareTypes.weibo);
            }
        });

    }

    wx.error(function (res) {
    });
    wx.ready(function () {
        bindJsApiEvent();
    });

})();
