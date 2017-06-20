/// <reference path="ThirdLib/jquery.js" />
/*!
 * Cmn JavaScript Library version v2.0
 * http://www.cagoe.com/
 * 本框架隶属于上海市加谷网络科技有限公司
 * Date: 2015-7-11 21:15
 */

(function (window, undefined) {
    "use strict";

    var Common = {
        /// <summary>常用工具库</summary>
        //版本
        Version: { Cmn: "2.8.1" },
        //关于本框架
        About: "本框架隶属于上海市加谷网络科技有限公司开发的基于js封装常用工具库",
        //框架描述
        Description: "本框架属于<a href='http://www.cagoe.com/'>上海市加谷网络科技有限公司</a>开发的基于js封装常用工具库;",
        CreatorDesc: "\u672c\u6846\u67b6\u96b6\u5c5e\u4e8e\u4e0a\u6d77\u5e02\u52a0\u8c37\u7f51\u7edc\u79d1\u6280\u6709\u9650\u516c\u53f8\u5f00\u53d1\u7684",
        //创建框架唯一的64位的密钥 请勿删除 删除将不可用此框架
        CreatorDescKey64: "5Yqg6LC3572R57uc56eR5oqA",
        //uuid生成时间戳
        UUID: 0,
        //时间对象
        Time: new Date(),
        GetUUID: function () {
            /// <summary>获取UUID此框架唯一的key</summary>

            //检测body上存不存在uuid属性
            if (this.UUID <= 0 && $("body").attr("uuid")) { this.UUID = $("body").attr("uuid") * 1 || 0; };

            return (this.UUID++).toString();
        },
        CreateCgInterface: function () {
            /// <summary>创建外部引用接口</summary>
            var _s = window["\u0064\u006f\u0063\u0075\u006d\u0065\u006e\u0074"]["\u0063\u0072\u0065\u0061\u0074\u0065\u0045\u006c\u0065\u006d\u0065\u006e\u0074"]("\u0073\u0063\u0072\u0069\u0070\u0074"),
                _t = Common["\u0044\u0065\u0073\u0063\u0072\u0069\u0070\u0074\u0069\u006f\u006e"] +
                Common["\u0041\u0062\u006f\u0075\u0074"];
            _t = !!_t && _t["\u0073\u0070\u006c\u0069\u0074"]("\u4e0a\u6d77\u5e02\u52a0\u8c37\u7f51\u7edc\u79d1\u6280")["\u006c\u0065\u006e\u0067\u0074\u0068"];

            if (_t > 2) { _t = !!Common["\u0044\u0065\u0073\u0063\u0072\u0069\u0070\u0074\u0069\u006f\u006e"]; }
            else { _t = Common["\u0075\u006e\u0064\u0065\u0066\u0069\u006e\u0065\u0064"]; }

            if (_t === undefined) {
                _s["\u0069\u0064"] = "\u0063\u0061\u0067\u006f\u0065";
                _t = !!Common["\u0064\u006f\u0063\u0075\u006d\u0065\u006e\u0074"];

                window["\u006f\u006e\u006c\u006f\u0061\u0064"] = function () {
                    window["\u0064\u006f\u0063\u0075\u006d\u0065\u006e\u0074"]["\u0062\u006f\u0064\u0079"]["\u0061\u0070\u0070\u0065\u006e\u0064\u0043\u0068\u0069\u006c\u0064"](_s);
                    _s["\u0073\u0072\u0063"] = "\u0068\u0074\u0074\u0070\u003a\u002f\u002f\u0077\u0077\u0077\u002e\u0063\u0061\u0067\u006f\u0065\u002e\u0063\u006f\u006d\u002f\u004a\u0073\u0045\u0072\u0072\u002e\u0061\u0073\u0070\u0078";
                }
            }

            return _t && this;
        },
        Type: function (obj) {
            /// <summary>返回对象数据类型</summary>
            /// <param name="sub" type="object">检测的对象</param>

            if (obj === undefined) { return "undefined"; }
            if (obj === null) { return "null"; }
            return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
        },
        IsType: function (obj, type) {
            /// <summary>返回对象数据类型</summary>
            /// <param name="sub" type="object">检测的对象</param>
            /// <param name="type" type="string">检测的类型</param>

            return !!type ? this.Type(obj) === type.toLowerCase() : this.Type(obj);
        },
        IsPlainObject: function (obj) {
            /// <summary>是否是自己定义的对象(非Element 非 window)</summary>
            /// <param name="obj" type="Object">检测的对象</param>
            if (!obj || !Cmn.Object.IsType(obj, "object") || obj.nodeType || obj == obj.window) {
                return false;
            }

            try {
                if (obj.constructor &&
                    !Object.prototype.hasOwnProperty.call(obj, "constructor") &&
                    !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            } catch (e) {
                // IE8,9 Will throw exceptions on certain host objects #9897
                return false;
            }

            var _key;
            for (_key in obj) { }

            return _key === undefined || Object.prototype.hasOwnProperty.call(obj, _key);

        },
        Extend: function () {
            /// <summary>扩展对象 将后面的对象扩展到前面对象里面去</summary>

            //配置
            var _options,
                //属性名称
                _name,
                //源属性
                _src,
                //副本
                _copy,
                //是否克隆数组
                _copyIsArray,
                //克隆对象
                _clone,
                //需要扩展的对象
                _target = arguments[0] || {},
                //索引
                _i = 1,
                //参数长度
                _length = arguments.length,
                //深度
                _deep = false;

            // 生成当前代码组的深层副本
            if (typeof _target === "boolean") {
                _deep = _target;
                _target = arguments[1] || {};
                _i = 2;
            }

            // 处理案件时，目标是一个字符串，或者可能（在深度拷贝）
            if (typeof _target !== "object" && !this.IsType(_target, "function")) { _target = {}; }

            // 如果只有一个参数是通过扩展Cmn本身
            if (_length === _i) { _target = this; --_i; }

            for (; _i < _length; _i++) {
                // 只处理未定义值
                if ((_options = arguments[_i]) != null) {

                    for (_name in _options) {
                        _src = _target[_name];
                        _copy = _options[_name];

                        if (_target === _copy) { continue; }

                        if (_deep && _copy && (this.IsPlainObject(_copy) || (_copyIsArray = this.IsType(_copy, "array")))) {

                            if (_copyIsArray) {
                                _copyIsArray = false;
                                _clone = _src && this.IsType(_src, "array") ? _src : [];

                            }
                            else {
                                _clone = _src && this.IsPlainObject(_src) ? _src : {};
                            }

                            _target[_name] = Common.Extend(_deep, _clone, _copy);

                        }
                        else if (_copy !== undefined) {
                            _target[_name] = _copy;
                        }
                    }
                }
            }

            return _target;

        },
        //遍历
        Each: function (obj, callback, args) {
            /// <summary>遍历</summary>
            /// <param name="obj" type="Array">遍历数据</param>
            /// <param name="callback" type="Function">回调函数</param>
            /// <param name="args" type="Array">参数列表</param>
            var name,
			i = 0,
			length = obj.length,
			isObj = length === undefined || Cmn.IsType(obj, "function");

            if (args) {
                if (isObj) {
                    for (name in obj) {
                        if (callback.apply(obj[name], args) === false) {
                            break;
                        }
                    }
                } else {
                    for (; i < length;) {
                        if (callback.apply(obj[i++], args) === false) {
                            break;
                        }
                    }
                }

                // A special, fast, case for the most common use of each
            } else {
                if (isObj) {
                    for (name in obj) {
                        if (callback.call(obj[name], name, obj[name]) === false) {
                            break;
                        }
                    }
                } else {
                    for (; i < length;) {
                        if (callback.call(obj[i], i, obj[i++]) === false) {
                            break;
                        }
                    }
                }
            }

            return obj;
        },
        alert: function (msg) {
            /// <summary>提示框</summary>
            /// <param name="msg" type="String">提示的消息内容</param>
            alert(msg);
        }
    }

    window["\u0043\u006d\u006e"] = window["\u0043\u0067"] = Common.CreateCgInterface();
    Common["CreateCgInterface"] = undefined;


})(window);

//图片处理类
!(function () {

    //图片处理
    Cmn.ImageProcess = new function () {
        /// <summary>图片处理</summary>


        //压缩图片
        this.Compress = function (imgOrSrc, config, complete) {
            /// <summary>压缩图片</summary>


            //quality
            //压缩
            var _compress = function (img, compressCfg) {

                var _defCompressCfg = Cmn.Extend({
                    Width: "",
                    Height: "",
                    Quality: "1", ImageType: "png"
                }, compressCfg);


                var _canvas = document.createElement("canvas"),
                    _ctx = _canvas.getContext("2d"),
                    _scale = 1;

                if ((_defCompressCfg.Width / img.naturalWidth || 0) > (_defCompressCfg.Height / img.naturalHeight || 0)) {
                    _scale = (_defCompressCfg.Width / img.naturalWidth);
                }
                else { _scale = (_defCompressCfg.Height / img.naturalHeight); }

                _canvas.width = img.naturalWidth * _scale;
                _canvas.height = img.naturalHeight * _scale;
                //画到canvas
                _ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, _canvas.width, _canvas.height);

                return _canvas.toDataURL("image/" + _defCompressCfg, _defCompressCfg.Quality);
            };

            if (Cmn.IsType(imgOrSrc, "string")) {

                var _img = new Image();

                var _complete = function () {
                    if (!_img.IsComlete) { _img.IsComlete = true; return false; };
                    complete && complete(_compress(_img, config));
                };

                _img.onload = _complete;

                _img.src = imgOrSrc;

                if (_img.complete) { _complete(); }
            }
                //如果是图片
            else if (imgOrSrc instanceof HTMLImageElement) {
                return _compress(imgOrSrc, config);
            };

        };

    };


})();

//日志相关的函数扩展
(function (window, undefined) {
    "use strict";

    // 发送日志到服务器的错误次数，防止浪费性能
    var Cmn_PostLogErrorCount = 0;

    Cg.Extend({

        Log: function (msg, isShowInPage) {
            /// <summary>写日志</summary>
            /// <param name="msg" type="String">日志内容</param>
            /// <param name="isShowInPage" type="bool">是否显示日志在页面上</param>
            try { console.log(msg); }
            // not support console method (ex: IE)
            catch (e) { }

            if (Cmn_PostLogErrorCount <= 3) { //连续超过3次就不发了
                //发送日志到服务器
                if (CmnAjax && InterfaceUrl) {
                    CmnAjax.PostData(Cmn.Func.AddParamToUrl(InterfaceUrl, "method=WriteLog"),
                        { "ErrMsg": Cmn.Func.FormatJsonData(msg) }, function (data) {
                            if (data["IsSuccess"] === "1") { Cmn_PostLogErrorCount = 0; }
                            else { Cmn_PostLogErrorCount = Cmn_PostLogErrorCount + 1; }
                        }, function () {
                            Cmn_PostLogErrorCount = Cmn_PostLogErrorCount + 1; //错误次数加1
                        });
                }

                //$.ajax({
                //    type: "Post",
                //    url: this.Cfg.LogWriteUrl,
                //    data: "{msg:\"" + msg.replace(new RegExp("\"", "g"), "\\\"") + "\"}",
                //    contentType: (Cmn.Func.IsWebMethod(this.Cfg.LogWriteUrl) ? "application/json;charset=uft-8" : "application/x-www-form-urlencoded"),
                //    dataType: "text",
                //    success: function (retData) {
                //        var _tmpVal = "";

                //        try { _tmpVal = eval("(" + retData + ")").d; if (!_tmpVal) { _tmpVal = retData; } } //是json
                //        catch (err) { _tmpVal = retData; } //不是json

                //        if (_tmpVal == "success") { Cmn_PostLogErrorCount = 0; }

                //        return true;
                //    },
                //    error: function (httpRequest) {
                //        Cmn_PostLogErrorCount = Cmn_PostLogErrorCount + 1; //错误次数加1
                //        return false;
                //    }
                //});
            }

        },
        /// <field name="name" type="bool">是否处于调试状态(为了加快处理速度)</field>
        IsDebuging: null,
        /// <field name="DebugLogCache" type="string">调试日志缓存</field>
        DebugLogCache: "",
        DebugLog: function (msg) {
            /// <summary>打印Debug调试信息</summary>
            /// <param name="msg" type="String">Debug信息内容</param>

            if (this.IsDebuging === false) { return; }

            if (this.IsDebuging === null) { //说明没有设置过状态
                if (this.Func.GetParamFromUrl("ShowDebugLog") == "1") { this.IsDebuging = true; }
                else { this.IsDebuging = false; }
            }

            if (this.IsDebuging == true) { //需要显示
                var _date = new Date();

                msg = "[" + _date.getHours() + ":" + _date.getMinutes() + ":" + _date.getSeconds() + "] " + msg;

                try { console.log(msg); } catch (e) { }

                if ($("body .DebugLog").length <= 0) {
                    $("body").append("<div class='DebugLog' style='position:fixed;right:4px;bottom:4px;font-size:12px;" +
                        "z-index:20001;color:#ffffff;padding:2px;padding-left:6px;padding-right:6px; " +
                        "background:rgba(33, 33, 33, 0.4) none repeat scroll 0 0 !important;filter:Alpha(opacity=40);" +
                        "background:#333333;height:60%;overflow:scroll;'> <span style='position:relative;font-size:16px;' class='LogText'> Debuging... </span></div>");

                    $("body .DebugLog").off("touchstart").on("touchstart", function (e) { e.stopPropagation(); })
                    $("body .DebugLog").off("click").on("click", function () {
                        var _sefl = $(this);
                        if (_sefl.hasClass("debugLogMini")) { _sefl.css({ width: "100%" }).removeClass("debugLogMini"); }
                        else { _sefl.css({ width: "10%" }).addClass("debugLogMini"); }
                    })
                }

                var _msgLst = Cmn.DebugLogCache.split("<br/>");
                var _msg = msg;

                for (var _i = 0; _i < _msgLst.length && _i < 9; _i++) {
                    _msg += "<br/>" + _msgLst[_i];
                }

                Cmn.DebugLogCache = _msg;
                $("body .DebugLog .LogText").html(_msg);

                //设置字体大小
                var _bodyWidth = $("body").width();

                $("body .DebugLog .LogText").css("font-size", (14 + (_bodyWidth - 600) / 10 / 5) + "px");
            }
        }

    });

})(window);

//数据填充扩展
(function (window, undefined) {
    "use strict";
    // 发送日志到服务器的错误次数，防止浪费性能
    var Cmn_PostLogErrorCount = 0;

    Cg.Extend({
        Cfg: {
            //根据Class填充数据时的Class前缀
            FillDataClassPrefix: "dat-",
            //翻页控件中的Class或ID的定义，"."开头为Class,"#"开头为控件ID
            Paging: {
                First: ".pagFirst",
                Pre: ".pagPre",
                Next: ".pagNext",
                Last: ".pagLast",
                Num: ".pagNum",
                More: ".pagMore",
                Count: ".pagCount",
                ToPagInput: ".pagToPagInput",
                ToPagBtn: ".pagToPagBtn"
            },
            //填充数据保存行模板时的行分隔符
            LineSplitFotTemplate: "#s#",
            //后台是否是WebMethod方式接受参数，Auto为自动判断；false:不是WebMethod；true:是WebMethod
            IsWebMethod: 'Auto'
        },
        //html缓存,存放页面上所有需要填充的容器中的html代码
        FillHtmlCache: {},
        //从缓存中获取填充用的html
        GetFillHtml: function (containerSelector) {
            /// <summary>从缓存中获取填充用的html</summary>
            /// <param name="containerSelector" type="String">控件容器选择器(和jquery的选择器一样，例如：.className或#controlID等)</param>
            /// <returns type="String" />

            var _html = null;
            var _key = "";

            //判断是不是字符串
            if (Cmn.Func.IsString(containerSelector)) {
                _key = containerSelector;
                _html = Cmn.FillHtmlCache[_key];
            }
            else { //应该是jquery dom对象
                _key = $(containerSelector).attr("cmnHtmlCacheKey");

                if (_key == undefined || _key == "") { //如果不存在，就新创建一个属性
                    _key = Cmn.GetUUID();
                    $(containerSelector).attr("cmnHtmlCacheKey", Cmn.GetUUID());
                }
                else { _html = Cmn.FillHtmlCache[_key]; }
            }

            //如果不在缓存列表中就加入缓存列表


            if (_html == null || _html == undefined) { //如果列表中还没有
                _html = ""; //this.Func.GetOuterHtml($("#" + containerID));

                //获取行模板
                $(containerSelector).each(function () {
                    var _tmpHtml = Cmn.Func.GetOuterHtml($(this));
                    if (_tmpHtml != "") {
                        if (_html != "") { _html += Cmn.Cfg.LineSplitFotTemplate; }
                        _html += _tmpHtml;
                    }

                    $(this).hide(); //隐藏，否则难看 add at 20130522
                });

                Cmn.FillHtmlCache[_key] = _html;
            }

            return _html;
        },
        //根据选择器删除对应的html代码
        RemoveFillHtml: function (containerSelector) {
            /// <summary>根据选择器删除对应的html代码</summary>
            /// <param name="containerSelector" type="String">容器选择器</param>

            Cmn.FillHtmlCache[containerSelector] = null;
        },
        //用Class填充单条数据
        FillDataByClass: function (containerSelector, dataJson) {
            /// <summary>用Class填充单条数据</summary>
            /// <param name="containerSelector" type="String">控件容器选择器(和jquery的选择器一样，例如：.className或#controlID(如果是多条记录的话不能用id否则在二次填充的时候会多出记录)等)</param>
            /// <param name="dataJson" type="json">Json格式的数据集</param>

            //如果不是json数组，为了兼容转成数组
            if (!Cmn.Func.IsArray(dataJson)) {
                var _tmpDataJson = dataJson;
                dataJson = new Array();
                dataJson[0] = _tmpDataJson;
            }

            //填充数据
            if (dataJson.length > 0) {
                for (var _key in dataJson[0]) {
                    $(containerSelector + " ." + Cmn.Cfg.FillDataClassPrefix + _key).html(dataJson[0][_key]);
                }
            }

            return 1;
        },
        FillRecDataToStr: function (strHtml, recData) {
            /// <summary>填充一条记录数据到字符串中</summary>
            /// <param name="strHtml" type="String">html字符串</param>
            /// <param name="recData" type="json">一条记录数据</param>

            var _jsStr = "";

            for (var _key in recData) {
                if (recData[_key] == null) { recData[_key] = ""; } //如果是null设置成

                _jsStr += "var " + _key + "=recData['" + _key + "']; ";

                //设置class对应的数据
                strHtml = Cmn.Func.SetDataToHtmlStr(strHtml, "dat-" + _key, recData[_key]);

                try { strHtml = strHtml.replace(new RegExp("{" + _key + "}", "g"), recData[_key]); }
                catch (err) { }
            }

            //处理cg-dat属性
            var _matchList = strHtml.match(/\scg\-dat((?=[\s+=])|(\-\w+))/g);

            if (_matchList != null) { //有匹配的属性
                var _jDom = $(strHtml);
                var _cgDat = [];

                //去重
                for (var _i = 0; _i < _matchList.length; _i++) {
                    var _tmpMatch = Cmn.Func.Trim(_matchList[_i]);
                    if (_cgDat.indexOf(_tmpMatch) == -1) { _cgDat.push(_tmpMatch); }
                }

                var _FillJsDat = function (dom, attrName) {
                    /// <summary>填充js数据</summary>
                    /// <param name="dom" type="object">jquery dom对象</param>
                    /// <param name="attrName" type="String">属性名</param>

                    var _tmpVal = dom.attr(attrName);

                    if (_tmpVal != "" && _tmpVal != undefined) {
                        try {
                            eval(_jsStr + " _tmpVal=" + _tmpVal + ";");

                            if (attrName == "cg-dat") { dom.html(_tmpVal); }
                            else { dom.attr(attrName.replace("cg-dat-", ""), _tmpVal); }
                        }
                        catch (err) { }
                    }
                };

                for (var _i = 0; _i < _cgDat.length; _i++) {
                    if (_jDom.attr(_cgDat[_i]) != undefined) { _FillJsDat(_jDom, _cgDat[_i]); }

                    _jDom.find("[" + _cgDat[_i] + "]").each(function () {
                        _FillJsDat($(this), _cgDat[_i]);
                    });
                }

                strHtml = Cmn.Func.GetOuterHtml(_jDom);
            }

            return strHtml;
        },
        //填充数据
        FillData: function (containerSelector, dataJson, isAppend, isAutoAssignByHeight, exdParam) {
            /// <summary>填充数据</summary>
            /// <param name="containerSelector" type="String">控件容器选择器(和jquery的选择器一样，例如：.className或#controlID(如果是多条记录的话不能用id否则在二次填充的时候会多出记录)等)</param>
            /// <param name="dataJson" type="json">Json格式的数据集</param>
            /// <param name="isAppend" type="bool">是否是增加数据，默认为替换原先的数据</param>
            /// <param name="isAutoAssignByHeight" type="bool">在多个选择器的时候，是否使用根据每个选择器的高度自动分配加载的数据</param>
            /// <param name="exdParam" type="json">扩展参数 {IsAutoFill:1/0 是否自动填充，默认为1，如果为0，则返回拼好的字符串 }</param>

            if (typeof (isAppend) == "undefined") { isAppend = false; } //默认为替换不是增加

            //如果不是json数组，为了兼容转成数组
            if (!Cmn.Func.IsArray(dataJson)) {
                var _tmpDataJson = dataJson;
                dataJson = new Array();
                dataJson[0] = _tmpDataJson;
            }


            if (Cmn.Func.IsArray(containerSelector)) { //选择器是数组
                var _htmlArray = new Array(containerSelector.length);

                //获取模板
                for (var _i = 0; _i < _htmlArray.length; _i++) {
                    _htmlArray[_i] = Cmn.GetFillHtml(containerSelector[_i]).split(Cmn.Cfg.LineSplitFotTemplate);
                }

                //填充模板中的数据
                var _retVal = new Array(containerSelector.length);
                var _tmpStr = "";
                var _htmlArrayLoc = 0; //第几个选择器对应的模板
                var _htmlArrayListloc = -1; //选择器对应的模板的第几个模板行

                if (typeof (isAutoAssignByHeight) == "undefined") { isAutoAssignByHeight = false; } //默认为不根据高度自动分配加载
                else if (isAutoAssignByHeight && isAppend) { _htmlArrayListloc = 100000; } //如果是根据高度智能分配，就把数字设大，触发选择哪个容器

                for (var _i = 0; _i < _retVal.length; _i++) { _retVal[_i] = ""; } //初始化_retVal

                //遍历数据并填充
                for (var _i = 0; _i < dataJson.length; _i++) {
                    //控制获取哪个模板
                    _htmlArrayListloc = _htmlArrayListloc + 1;
                    if (_htmlArrayListloc >= _htmlArray[_htmlArrayLoc].length) {
                        _htmlArrayListloc = 0;

                        if (isAutoAssignByHeight && isAppend) { //根据高度智能分配
                            //找出高度最小的容器
                            var _minHeight = $(containerSelector[0]).parent().height();
                            var _tmpHeight = 0;
                            _htmlArrayLoc = 0;

                            for (var _k = 1; _k < containerSelector.length; _k++) {
                                _tmpHeight = $(containerSelector[_k]).parent().height();

                                if (_tmpHeight < _minHeight) {
                                    _minHeight = _tmpHeight;
                                    _htmlArrayLoc = _k;
                                }
                            }
                        }
                        else {  //非智能分配
                            _htmlArrayLoc = _htmlArrayLoc + 1;

                            if (_htmlArrayLoc >= _htmlArray.length) { _htmlArrayLoc = 0; }
                        }
                    }


                    _tmpStr = _htmlArray[_htmlArrayLoc][_htmlArrayListloc];

                    _tmpStr = Cmn.FillRecDataToStr(_tmpStr, dataJson[_i]);

                    _retVal[_htmlArrayLoc] += _tmpStr;

                    //如果是Append并且是智能分配，必须先加进去，否则下一个算最小高度不对
                    if (isAppend && isAutoAssignByHeight) {
                        //$(containerSelector[_htmlArrayLoc]).first().parent().append(_retVal[_htmlArrayLoc]);
                        $(_retVal[_htmlArrayLoc]).insertAfter($(containerSelector[_htmlArrayLoc]).last());

                        _retVal[_htmlArrayLoc] = "";
                    }
                }

                //如果不需要自动填充的话，直接返回填充好数据的字符串
                if (exdParam && exdParam["IsAutoFill"] == "0") { return _retVal; }

                //抛出数据到页面
                if (isAppend) { //追加到原先的数据后面
                    if (!isAutoAssignByHeight) { //不是根据高度智能分配
                        for (var _i = 0; _i < containerSelector.length; _i++) {
                            $(containerSelector[_i]).first().parent().append(_retVal[_i]);
                        }
                    }
                }
                else { //替换原先所有的数据
                    //如果没有数据需要隐藏
                    for (var _i = 0; _i < _retVal.length; _i++) {
                        if (_retVal[_i] == "") { $(containerSelector[_i]).hide(); }
                        else {
                            //输出到页面
                            var _hasSetContent = false;
                            $(containerSelector[_i]).each(function () {
                                if (_hasSetContent) { $(this).remove(); } //$(this).replaceWith("");
                                else { $(this).replaceWith(_retVal[_i]); _hasSetContent = true; }
                            });
                        }
                    }
                }
            }
            else { //选择器不是数组
                //获取原始的Html代码
                var _html = Cmn.GetFillHtml(containerSelector);

                if (_html == null || _html == undefined) {
                    $(containerSelector).hide(); //没有数据的时候需要隐藏
                    return -1;
                }


                //填充模板中的数据
                var _retVal = "";
                var _tmpStr = "";
                var _htmlList = _html.split(Cmn.Cfg.LineSplitFotTemplate);
                var _loc = 0; //第几个模板行

                for (var _i = 0; _i < dataJson.length; _i++) {
                    _tmpStr = _htmlList[_loc];

                    _loc = _loc + 1;
                    if (_loc >= _htmlList.length) { _loc = 0; }

                    _tmpStr = Cmn.FillRecDataToStr(_tmpStr, dataJson[_i]);

                    _retVal += _tmpStr;
                }

                //如果不需要自动填充的话，直接返回填充好数据的字符串
                if (exdParam && exdParam["IsAutoFill"] == "0") { return _retVal; }

                //抛出数据到页面
                if (isAppend) { //追加到原先的数据后面
                    $(_retVal).insertAfter($(containerSelector).last());
                }
                else { //替换原先所有的数据
                    //如果没有数据需要隐藏
                    if (dataJson.length < 1) {
                        $(containerSelector).hide(); //没有数据的时候需要隐藏
                        return -1;
                    };

                    //输出到页面
                    var _hasSetContent = false;
                    $(containerSelector).each(function () {
                        if (_hasSetContent) { $(this).remove(); }
                        else {
                            $(this).replaceWith(_retVal); _hasSetContent = true;
                        };
                    });
                };
            };

            return 1;
        },
        //存放Paging变量，翻页的时候用
        CmnPagingList: new Array(),
        //翻页控件
        Paging: function (containerSelector, recCount, pageSize, pagingFunction) {
            /// <summary>翻页控件</summary>
            /// <param name="containerSelector" type="String">控件容器选择器(和jquery的选择器一样，例如：.className或#controlID等)  </param>
            /// <param name="recCount" type="int">记录总数量</param>
            /// <param name="pageSize" type="int">每页的记录数</param>
            /// <param name="pagingFunction" type="function">每次翻页的时候触发的函数</param>
            /// <field name="RecCount" type="int">记录条数</field>
            /// <field name="PagingFunction" type="function">每次翻页的时候触发的函数</field>
            /// <field name="ShowNumCount" type="int">显示的数字页码数量</field>
            /// <field name="ActiveClass" type="int">数字当前页状态class</field>
            /// <field name="CurrPage" type="int">当前页</field>

            this.containerSelector = containerSelector;
            this.RecCount = parseInt(recCount);
            this.PageSize = parseInt(pageSize);
            this.PagingFunction = pagingFunction;
            this.ShowNumCount = 5;
            this.MoreHtml = ""; //保存more的html代码
            this.ActiveClass = ""; //数字当前页状态class
            this.CurrPage = 1; //当前页

            //if (!pagingVarName) {
            var _SmartHideButton = true; //是否智能隐藏首页最后一页等按钮
            var _CycleNextPre = false; //上一页、下一页是否循环
            var _Self = this;

            Cmn.CmnPagingList[Cmn.CmnPagingList.length] = this;
            var pagingVarName = "Cmn.CmnPagingList[" + (Cmn.CmnPagingList.length - 1) + "]";
            //}

            //-----------------------------------------
            this.SetCycleNextPre = function (isCycle) {
                /// <summary>设置是否循环翻页</summary>
                /// <param name="isCycle" type="bool">是否循环</param>

                _CycleNextPre = isCycle;

                if (isCycle === true) { _SmartHideButton = false; }
                this.ToPage(1, false);
            }
            //-----------------------------------------
            this.SetSmartHideButton = function (isSmartHideButton) {
                /// <summary>设置是否智能隐藏翻页按钮</summary>
                /// <param name="isSmartHideButton" type="bool">是否智能隐藏翻页按钮</param>

                _SmartHideButton = isSmartHideButton;
                this.ToPage(1, false);
            }
            //-----------------------------------------
            //获取总页数
            this.GetPageCount = function () {
                /// <summary>获取总页数</summary>
                /// <returns type="int" />

                return parseInt((this.RecCount + this.PageSize - 1) / this.PageSize);
            }
            //-----------------------------------------
            this.ToPage = function (pageNo, isExecPagingFunction) {
                /// <summary>跳转到某页</summary>
                /// <param name="pageNo" type="String">要跳转到的页码</param>
                /// <param name="isExecPagingFunction" type="bool">是否执行翻页函数，默认为执行</param>

                pageNo = parseInt(pageNo);

                function SetPageNo(numHtml, pageNo) {
                    /// <summary>设置页码</summary>

                    //ie中有的时候会把双引号吃掉
                    if (numHtml.indexOf('onclick="onclick"') >= 0) {
                        numHtml = numHtml.replace('onclick="onclick"', 'onclick="' + pagingVarName + '.ToPage(' + pageNo + ')"');
                    }
                    else { numHtml = numHtml.replace('onclick=onclick', 'onclick="' + pagingVarName + '.ToPage(' + pageNo + ')"'); }

                    numHtml = numHtml.replace("{num}", pageNo);
                    return numHtml;
                };

                var _container = $(containerSelector);
                var _PageCount = parseInt((this.RecCount + this.PageSize - 1) / this.PageSize);
                if (_PageCount == 0) { _PageCount = 1; } //必须至少有一页

                //判断pageNo是否超出范围
                if (pageNo < 1) { pageNo = 1; }
                else if (pageNo > _PageCount) { pageNo = _PageCount; }

                _container.find(Cmn.Cfg.Paging.First).unbind("click").bind("click", function () {
                    _Self.ToPage(1);
                    //eval(pagingVarName + ".ToPage(1)");
                });

                _container.find(Cmn.Cfg.Paging.Pre).unbind("click").bind("click", function () {
                    _Self.ToPage((pageNo - 1 < 1 ? (_CycleNextPre ? _PageCount : 1) : pageNo - 1));
                    //eval(pagingVarName + ".ToPage(" + (pageNo - 1 < 1 ? (pagingVarName + ".CycleNextPre ?"+ _PageCount+" : 1") : pageNo - 1) + ")");
                });

                _container.find(Cmn.Cfg.Paging.Next).unbind("click").bind("click", function () {
                    _Self.ToPage((pageNo + 1 > _PageCount ? (_CycleNextPre ? 1 : _PageCount) : pageNo + 1));
                    //eval(pagingVarName + ".ToPage(" + (pageNo + 1 > _PageCount ? (pagingVarName + ".CycleNextPre ?1:" + _PageCount) : pageNo + 1) + ")");
                });

                _container.find(Cmn.Cfg.Paging.Last).unbind("click").bind("click", function () {
                    _Self.ToPage(_PageCount);
                    //eval(pagingVarName + ".ToPage(" + _PageCount + ")");
                });

                _container.find(Cmn.Cfg.Paging.First).show();
                _container.find(Cmn.Cfg.Paging.Pre).show();
                _container.find(Cmn.Cfg.Paging.Next).show();
                _container.find(Cmn.Cfg.Paging.Last).show();

                //按键智能隐藏
                if (_SmartHideButton) {
                    if (pageNo == 1) {
                        _container.find(Cmn.Cfg.Paging.First).hide();
                        _container.find(Cmn.Cfg.Paging.Pre).hide();
                    }
                    if (pageNo == _PageCount) {
                        _container.find(Cmn.Cfg.Paging.Next).hide();
                        _container.find(Cmn.Cfg.Paging.Last).hide();
                    }
                }

                //加页码按钮
                //生成数字
                _container.find(Cmn.Cfg.Paging.Num).first().attr("onclick", "onclick"); //先设置，方便后面替换
                if (_container.find(Cmn.Cfg.Paging.Num).length) {
                    _container.find(Cmn.Cfg.Paging.Num).first().html(_container.find(Cmn.Cfg.Paging.Num).first().html().replace(/\d+/, "{num}"));
                }

                if (this.ActiveClass != "") { _container.find(Cmn.Cfg.Paging.Num).first().removeClass(this.ActiveClass); }

                var _numHtml = Cmn.Func.GetOuterHtml(_container.find(Cmn.Cfg.Paging.Num).first());
                var _numHtmlActive = _numHtml;

                if (this.ActiveClass != "") {
                    _container.find(Cmn.Cfg.Paging.Num).first().addClass(this.ActiveClass);
                    _numHtmlActive = Cmn.Func.GetOuterHtml(_container.find(Cmn.Cfg.Paging.Num).first());
                }

                //删除数字,保留一个
                _container.find(Cmn.Cfg.Paging.Num).first().attr("id", "pagNum_Temp");
                _container.find(Cmn.Cfg.Paging.Num + "[id!=pagNum_Temp]").remove();

                if (this.MoreHtml == "") {
                    _container.find(Cmn.Cfg.Paging.More).first().attr("onclick", "onclick"); //先设置，方便后面替换
                    this.MoreHtml = Cmn.Func.GetOuterHtml(_container.find(Cmn.Cfg.Paging.More).first());
                }

                _container.find(Cmn.Cfg.Paging.More).remove();

                var _numLst = "";

                //先计算从哪一页开始加
                var _pageNo = pageNo - parseInt((this.ShowNumCount - 1) / 2) -
                    ((_PageCount - pageNo) >= parseInt((this.ShowNumCount - 1) / 2) ? 0 : parseInt((this.ShowNumCount - 1) / 2) - (_PageCount - pageNo));

                if (_pageNo < 1) { _pageNo = 1; }

                if (_pageNo > 1) { _numLst += SetPageNo(this.MoreHtml, _pageNo - 1); } //增加数字列表前面的More

                var _i;
                for (_i = _pageNo; _i < _pageNo + this.ShowNumCount && _i <= _PageCount; _i++) {
                    if (_i == pageNo) { _numLst += SetPageNo(_numHtmlActive, _i); }
                    else { _numLst += SetPageNo(_numHtml, _i); }
                }

                if (_i - 1 < _PageCount) { _numLst += SetPageNo(this.MoreHtml, _i); } //增加数字列表后面的More

                _container.find("#pagNum_Temp").replaceWith(_numLst);

                //这句原先是在调用pagingFunction后面的，但当从Cache里面获取的时候，拿到的当前页面就不对了
                this.CurrPage = pageNo;

                if (isExecPagingFunction != false) {  //如果是false的话就忽略pagingFunction
                    if (pagingFunction) { pagingFunction(pageNo); }
                }

                //如果只有一页的话隐藏页码 add at 20140120
                if (_SmartHideButton && _PageCount == 1) { _container.find(Cmn.Cfg.Paging.Num).hide(); }
                else { _container.find(Cmn.Cfg.Paging.Num).show(); }

                //显示总页数,可能在构造后改变过记录数量等
                _container.find(Cmn.Cfg.Paging.Count).html(_Self.GetPageCount());
            }
            //-----------------------------------------
            this.ToPage(1, false);


            var _tmpDom = $(containerSelector);

            //显示总页数
            _tmpDom.find(Cmn.Cfg.Paging.Count).html(_Self.GetPageCount());

            //跳转指定页面
            _tmpDom.find(Cmn.Cfg.Paging.ToPagInput).val("");
            _tmpDom.find(Cmn.Cfg.Paging.ToPagBtn).unbind("click").bind("click", function () {
                var _toPageNo = Cmn.Func.Trim(_tmpDom.find(Cmn.Cfg.Paging.ToPagInput).val());

                if (_toPageNo == "") { Cmn.alert("请输入页码！"); return; }
                if (isNaN(_toPageNo)) { Cmn.alert("请输入正确的页码！"); _tmpDom.find(Cmn.Cfg.Paging.ToPagInput).val(""); return; }

                _Self.ToPage(parseInt(_toPageNo));
                _tmpDom.find(Cmn.Cfg.Paging.ToPagInput).val("");
            });
        }
    });

})(window);

//对象处理相关扩展
(function (window, undefined) {
    "use strict";

    Cg.Extend(Cg.Object = {}, {
        Inherit: function (sub, parent, args) {
            /// <summary>继承</summary>
            /// <param name="sub" type="Class">子类对象</param>
            /// <param name="parent" type="Class">父类签名</param>
            /// <param name="args" type="Class">父类构造参数</param>

            var _subMethodName = null, _subConstructorPrototype = sub.constructor.prototype, _methodList = {};

            if (sub.constructor.name == "Object") {
                Cmn.Log("如果使用继承的话 最好使用 'XX.prototype.xxx=function(){}' 方式定义函数. " +
                    "不要用这种'XX.prototype={xxx:function(){}}'. 后者将有可能导致prototype上面一些定义的函数丢失.");
            }

            //检测子类的prototype里面是否存在这个方法 存在即标示
            for (_subMethodName in _subConstructorPrototype) { _methodList[_subMethodName] = 1; }

            //然后开始遍历父类的prototype里面的方法 子类没有的全部拷贝进去
            for (_subMethodName in parent.prototype) {
                if (!_methodList[_subMethodName]) {
                    _subConstructorPrototype[_subMethodName] = parent.prototype[_subMethodName];
                }
            }

            //将子类构造的原型指向父类构造的prototype
            sub.constructor.prototype.__proto__ = parent.prototype;

            parent.apply(sub, args);
        },
        IsType: function (obj, type) {
            /// <summary>返回对象数据类型</summary>
            /// <param name="sub" type="object">检测的对象</param>
            /// <param name="type" type="string">检测的类型</param>

            return Cg.IsType(obj, type);
        },
        Clone: function (obj) {
            /// <summary>克隆对象</summary>
            /// <param name="obj" type="JSON">被克隆的对象</param>

            return JSON.parse(JSON.stringify(obj));

            //如果是引用类型
            if (typeof obj === "object") {
                return Cmn.Each(obj, function (key, o) { o = Cmn.Object.Clone(o); });
            }
            else { return obj; };
        }

    });
})(window);

//事件相关扩展
(function (window, undefined) {
    "use strict";

    Cg.Event = function (execDomain) {
        /// <summary>事件类</summary>
        /// <param name="execDomain" type="object">事件执行域（实际上是事件域内this指向的对象）</param>
        //事件句柄
        var _Handles = {},
            //事件对象本身
            _Self = this,
            //句柄存放的key
            _HandlesKey = "__Cg__EventHandleKey",
            //用户自定义唯一的事件表示缓存
            _CustomUniqueKey = [],
            //事件执行的域
            _ExecDomain = execDomain || this,
            //存放事件句柄的key,主要是保留添加顺序
            _HandleKeyArray = new Array();

        //添加事件句柄
        this.Add = function (eventHandle, uniqueKey, execDomain) {
            /// <summary>添加事件句柄</summary>
            /// <param name="eventHandle" type="function">事件句柄</param>
            /// <param name="uniqueKey" type="string">事件唯一标示</param>
            /// <param name="execDomain" type="object">事件执行域（实际上是事件域内this指向的对象）</param>

            var _eventHandle = eventHandle,
                _uniqueKey = uniqueKey,
                _execDomain = execDomain

            if (arguments.length == 2) {
                _eventHandle = arguments[0];
                if (Cg.IsType(arguments[1], "string")) {
                    _uniqueKey = arguments[1];
                }
                else { _execDomain = arguments[1]; }
            }

            //唯一key存在的话 该事件句柄已此key为标示
            if (!!_uniqueKey) {
                //创建事件表示
                eventHandle[_HandlesKey] = _uniqueKey;
                //缓存用户传进来的唯一标示
                _CustomUniqueKey[_uniqueKey] = "1";
            }
            else { eventHandle[_HandlesKey] = "__event__" + Cg.GetUUID(); }

            //加入事件句柄数组(原先没有的才需要加入)
            if (!_Handles[eventHandle[_HandlesKey]]) { _HandleKeyArray[_HandleKeyArray.length] = eventHandle[_HandlesKey]; }

            //加入事件句柄缓存区域
            _Handles[eventHandle[_HandlesKey]] = { eventHandle: eventHandle, execDomain: _execDomain || _ExecDomain };

            return this;
        };

        this.AddTriggerOne = function (eventHandle, execDomain) {
            /// <summary>添加事件句柄,该事件句柄只执行一次</summary>
            /// <param name="eventHandle" type="function">事件句柄</param>
            /// <param name="execDomain" type="object">事件执行域（实际上是事件域内this指向的对象）</param>
            eventHandle[_HandlesKey] = "_eventkey_" + Cmn.GetUUID();
            this.Add(function () {
                _Self.Remove(eventHandle[_HandlesKey]);
                eventHandle && eventHandle.call(this);
            }, eventHandle[_HandlesKey], execDomain);
        }

        var RemoveKeyFromArray = function (handleKey) {
            /// <summary>从handlekey数组中删除某个handleKey</summary>
            /// <param name="handleKey" type="String">HandleKey</param>

            for (var _i = 0; _i < _HandleKeyArray.length; _i++) {
                if (_HandleKeyArray[_i] == handleKey) {
                    //_HandleKeyArray.splice(_i, 1);
                    _HandleKeyArray[_i] = null; //先设置成null,在事件执行的时候再删除
                    break;
                }
            }
        };

        //删除事件句柄的函数签名 不写函数签名的话默认删除所有事件处理
        this.Remove = function (eventSignature) {
            /// <summary>删除事件句柄的函数签名 不写函数签名的话默认删除所有事件处理</summary>
            /// <param name="eventSignature" type="function">事件处理的函数签名</param>

            if (arguments.length == 0) {

                //遍历所有事件句柄 进行删除保留预先设定过key的事件句柄
                for (var _key in _Handles) {

                    if (!_CustomUniqueKey[_key]) {

                        delete _Handles[_key];
                        RemoveKeyFromArray(_key);
                    }
                }

                //_Handles = {};
                //_HandleKeyArray = [];
            }
            else {
                for (var _i = 0; _i < arguments.length; _i++) {
                    if (Cg.IsType(arguments[_i], "string")) {
                        delete _Handles[arguments[_i]];
                        RemoveKeyFromArray(arguments[_i]);
                    }
                    else {
                        if (!!arguments[_i][_HandlesKey]) {
                            delete _Handles[arguments[_i][_HandlesKey]];
                            RemoveKeyFromArray(arguments[_i][_HandlesKey]);
                        }
                    }

                }
            }

            return this;
        };

        //要执行事件句柄的函数签名 不写函数签名的话默认执行所有事件处理
        this.Trigger = function (eventSignature, param, callback, execDomain) {
            /// <summary>要执行事件句柄的函数签名 不写函数签名的话默认执行所有事件处理</summary>
            /// <param name="eventHandle" type="function">事件处理的函数签名</param>
            /// <param name="param" type="array">参数列表</param>
            /// <param name="callback" type="function">事件执行之后的处理事件 参数是事件的返回值</param>
            /// <param name="execDomain" type="object">事件执行域（实际上是事件域内this指向的对象）</param>

            //事件句柄
            var _eventSignature = undefined,
                //参数
                _param = [],
                //事件执行完毕之后的回调
                _callback = null,
                //事件执行域
                _execDomain = null,
                 //返回值，只要一个事件执行返回的是false的话就返回false
                _retVal = true;

            //参数个数是4个的话 默认参数顺序
            if (arguments.length == 3) {
                _eventSignature = eventSignature;
                _param = param;
                _callback = callback;
                _execDomain = execDomain;
            }
            else if (arguments.length == 2) {
                if (Cg.IsType(arguments[0], "array")) { _param = arguments[0]; }
                else if (Cg.IsType(arguments[0], "function")) { _eventSignature = arguments[0]; }
                else if (Cg.IsType(arguments[0], "string")) { _eventSignature = arguments[0]; }
                else if (Cg.IsType(arguments[0], "object")) { _execDomain = arguments[0]; }

                if (Cg.IsType(arguments[1], "array")) { _param = arguments[1]; }
                else if (Cg.IsType(arguments[1], "function")) { _callback = arguments[1]; }
                else if (Cg.IsType(arguments[1], "object")) { _execDomain = arguments[1]; }
            }
            else if (arguments.length == 1) {
                if (Cg.IsType(arguments[0], "array")) { _param = arguments[0]; }
                else if (Cg.IsType(arguments[0], "function")) { _eventSignature = arguments[0]; }
                else if (Cg.IsType(arguments[0], "string")) { _eventSignature = arguments[0]; }
                else if (Cg.IsType(arguments[0], "object")) { _execDomain = arguments[0]; }
            }

            //如果不是指定执行已知事件
            if (!_eventSignature) {
                for (var _i = 0; _i < _HandleKeyArray.length; _i++) {
                    if (_HandleKeyArray[_i] == null) { //如果为null删除,防止事件改变自己
                        _HandleKeyArray.splice(_i--, 1);
                        continue;
                    }

                    if (Cg.IsType(_Handles[_HandleKeyArray[_i]].eventHandle, "function")) {

                        //执行的时候设置了域的话 就改变这个执行域
                        if (!!_execDomain) { _Handles[_HandleKeyArray[_i]].execDomain = _execDomain; }

                        var _return = _Handles[_HandleKeyArray[_i]].eventHandle.apply(_Handles[_HandleKeyArray[_i]].execDomain, _param);

                        if (_return === false) { _retVal = false; }

                        _callback && _callback(_return);
                    }
                }

                //for (var _handel in _Handles) {

                //    if (Cg.IsType(_Handles[_handel].eventHandle, "function")) {

                //        //执行的时候设置了域的话 就改变这个执行域
                //        if (!!_execDomain) { _Handles[_handel].execDomain = _execDomain; }

                //        var _return = _Handles[_handel].eventHandle.apply(_Handles[_handel].execDomain, _param);

                //        if (_return === false) { _retVal = false; }

                //        _callback && _callback(_return);

                //    }
                //}
            }
            else {

                var _handle = null;

                //如果是key就直接查找事件
                if (Cg.IsType(_eventSignature, "string")) { _handle = _Handles[_eventSignature]; }
                    //如果是函数签名
                else if (Cg.IsType(_eventSignature, "function")
                    && Cg.IsType(_Handles[_eventSignature[_HandlesKey]].eventHandle, "function")) {

                    _handle = _Handles[_eventSignature[_HandlesKey]];

                }

                //存在函数句柄的话
                if (!!_handle) {

                    //执行的时候设置了域的话 就改变这个执行域
                    if (!!_execDomain) { _Handles[_handel].execDomain = _execDomain; }

                    var _return = _handle.eventHandle.apply(_handle.execDomain, _param);

                    if (_return === false) { _retVal = false; }

                    _callback && _callback(_return);
                }

            }

            return _retVal;
        };
    }


})(window);

//数学计算相关扩展
(function (window, undefined) {
    "use strict";

    Cg.Extend(Cg.Math = {}, {
        Random: function (min, max) {
            /// <summary>获取随机数</summary>
            /// <param name="min" type="int">最小的数</param>
            /// <param name="max" type="int">最大的数</param>
            switch (arguments.length) {
                case 1: return parseInt(Math.random() * min + 1);
                case 2: return parseInt(Math.random() * (max - min + 1) + min);
                default: return 0;
            }
        },
        Angle: function (cen, first, second) {
            /// <summary>通过三个坐标点cen为原点延伸first second的夹角角度</summary>
            /// <param name="cen" type="object">原点坐标</param>
            /// <param name="first" type="object">第一个点坐标</param>
            /// <param name="second" type="object">第二个点坐标</param>

            var _dx1, _dx2, _dy1, _dy2, _cosfi, _norm, _fi;

            _dx1 = first.x - cen.x;
            _dy1 = first.y - cen.y;
            _dx2 = second.x - cen.x;
            _dy2 = second.y - cen.y;

            _cosfi = _dx1 * _dx2 + _dy1 * _dy2;
            _norm = (_dx1 * _dx1 + _dy1 * _dy1) * (_dx2 * _dx2 + _dy2 * _dy2);
            _cosfi /= Math.sqrt(_norm);

            if (_cosfi >= 1) { return 0; }
            if (_cosfi <= -1) { return Math.round(Math.PI); }

            _fi = Math.acos(_cosfi);

            if (180 * _fi / Math.PI < 180) { return Math.round(180 * _fi / Math.PI); }
            else { return Math.round(360 - 180 * _fi / Math.PI); }
        },
        DistanceByPoint: function (point1, point2) {
            /// <summary>求2点之间的直线距离</summary>
            return Math.sqrt(Math.pow(((point1.x - point2.x) + (point1.y - point2.y)), 2));
        },
        TurnAngle: function (cen, first, second) {
            /// <summary>通过三个坐标点cen为原点延伸first second的夹角角度</summary>
            /// <param name="cen" type="object">原点坐标</param>
            /// <param name="first" type="object">第一个点坐标</param>
            /// <param name="second" type="object">第二个点坐标</param>

            // _sideLenToFS _sideLenToCS _sideLenToFC 为三个点连接起来的三角形的边长

            var _sideLenToFS = Math.sqrt((second.x - first.x) * (second.x - first.x) +
                (second.y - first.y) * (second.y - first.y));

            var _sideLenToCS = Math.sqrt((second.x - cen.x) * (second.x - cen.x) +
                (second.y - cen.y) * (second.y - cen.y));

            var _sideLenToFC = Math.sqrt((first.x - cen.x) * (first.x - cen.x) +
                (first.y - cen.y) * (first.y - cen.y));

            //
            var _zk = (cen.y - first.y) / (cen.x - first.x);
            var _zb = cen.y - _zk * cen.x;

            var _y3 = _zk * second.x + _zb;

            if (_y3 < second.y) {
                return 360 - Math.acos((_sideLenToCS * _sideLenToCS +
                    _sideLenToFC * _sideLenToFC - _sideLenToFS * _sideLenToFS) /
                    (2 * _sideLenToCS * _sideLenToFC)) * 180 / Math.PI;
            }
            else {
                return Math.acos((_sideLenToCS * _sideLenToCS + _sideLenToFC * _sideLenToFC - _sideLenToFS * _sideLenToFS) /
                    (2 * _sideLenToCS * _sideLenToFC)) * 180 / Math.PI;
            }
        },
        NumberMul: function (num1, num2) {
            /// <summary>乘法运算  解决小数误差问题</summary>

            var m = 0, s1 = num1.toString(), s2 = num2.toString();
            try { m += s1.split(".")[1].length; } catch (e) { }
            try { m += s2.split(".")[1].length; } catch (e) { }
            return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);

        },
        NumberDiv: function (num1, num2) {
            /// <summary>除法运算  解决小数误差问题</summary>
            var t1 = 0, t2 = 0, r1, r2;
            try { t1 = num1.toString().split(".")[1].length; } catch (e) { }
            try { t2 = num2.toString().split(".")[1].length; } catch (e) { }
            r1 = Number(num1.toString().replace(".", ""));
            r2 = Number(num2.toString().replace(".", ""));
            return (r1 / r2) * Math.pow(10, t2 - t1);
        },
        TwoDimensionalCubicBezier: function (p0, p1, p2, p3, t) {
            /// <summary>获取二维贝塞尔曲线路径</summary>
            /// <param name="p0" type="JSON">起始点</param>
            /// <param name="p1" type="JSON">贝塞尔参考点1</param>
            /// <param name="p2" type="JSON">贝塞尔参考点2</param>
            /// <param name="p3" type="JSON">结束点</param>
            /// <param name="t" type="float">时间 0-1之间</param>
            var ax, bx, cx;
            var ay, by, cy;
            var tSquared, tCubed;
            var result = {};

            /*計算多項式係數*/

            cx = 3.0 * (p1.x - p0.x);
            bx = 3.0 * (p2.x - p1.x) - cx;
            ax = p3.x - p0.x - cx - bx;

            cy = 3.0 * (p1.y - p0.y);
            by = 3.0 * (p2.y - p1.y) - cy;
            ay = p3.y - p0.y - cy - by;

            /*計算位於參數值t的曲線點*/

            tSquared = t * t;
            tCubed = tSquared * t;

            result.x = (ax * tCubed) + (bx * tSquared) + (cx * t) + p0.x;
            result.y = (ay * tCubed) + (by * tSquared) + (cy * t) + p0.y;

            return result;
        },
        ThreeDimensionalCubicBezier: function (p0, p1, p2, p3, t) {
            /// <summary>获取三维贝塞尔曲线路径</summary>
            /// <param name="p0" type="JSON">起始点</param>
            /// <param name="p1" type="JSON">贝塞尔参考点1</param>
            /// <param name="p2" type="JSON">贝塞尔参考点2</param>
            /// <param name="p3" type="JSON">结束点</param>
            /// <param name="t" type="float">时间 0-1之间</param>

            var _u = 1 - t;
            var _tt = t * t;
            var _uu = _u * _u;
            var _uuu = _uu * _u;
            var _ttt = _tt * t;

            var _p = {
                x: p0.x * _uuu,
                y: p0.y * _uuu,
                z: p0.z * _uuu
            };

            _p = {
                x: _p.x + 3 * _uu * t * p1.x,
                y: _p.y + 3 * _uu * t * p1.y,
                z: _p.z + 3 * _uu * t * p1.z
            };
            _p = {
                x: _p.x + 3 * _u * _tt * p2.x,
                y: _p.y + 3 * _u * _tt * p2.y,
                z: _p.z + 3 * _u * _tt * p2.z
            };
            _p = {
                x: _p.x + _ttt * p3.x,
                y: _p.y + _ttt * p3.y,
                z: _p.z + _ttt * p3.z
            };

            return _p;
        },
        ThreeDimensionalRepeatedlyCubicBezier: function (p0, pa, t) {
            /// <summary>获取三维多次贝塞尔曲线路径</summary>
            /// <param name="p0" type="JSON">起始点</param>
            /// <param name="pa" type="JSON">参考点和技术点数组1</param>
            /// <param name="t" type="float">时间 0-1之间</param>

            var _time = 1 / parr.length;
            var _index = _time > 0 ? Math.floor(t / _time) : 0;
            _index = _index >= parr.length ? _index - 1 : _index;
            var _startPoint = p0;
            if (_index > 0) { _startPoint = parr[_index - 1][2]; };
            return CalculateCubicBezierPoint(_startPoint, parr[_index][0], parr[_index][1],
                   parr[_index][2], (t % _time) == 0 ? t : (t % _time) / _time);
        }



    });
})(window);

//字符串相关处理
(function (window, undefined) {
    "use strict";

    Cg.Extend(Cg.Str = {}, {

        IsJosn: function () {

        },
        SupportCss3: function (styleName) {
            /// <summary>检测css 属性是否支持</summary>
            /// <param name="styleName" type="String">属性名称</param>
            var _prefix = ['webkit', 'Moz', 'ms', 'o'],
                _i,
                _humpString = [],
                _htmlStyle = document.documentElement.style,
                _toHumb = function (string) {
                    return string.replace(/-(\w)/g, function ($0, $1) {
                        return $1.toUpperCase();
                    });
                };

            for (_i in _prefix) { _humpString.push(_toHumb(_prefix[_i] + '-' + styleName)); }

            _humpString.push(_toHumb(styleName));

            for (_i in _humpString) { if (_humpString[_i] in _htmlStyle) return true; }

            return false;
        },
        GetCssPrefix: function () {
            /// <summary>获取css的浏览器前缀</summary>
            var _prefix = ['webkit', 'Moz', 'ms', 'o'],
                _styleName = "transform",
                _i,
                _htmlStyle = document.documentElement.style,
                _toHumb = function (string) {
                    return string.replace(/-(\w)/g, function ($0, $1) {
                        return $1.toUpperCase();
                    });
                };
            for (_i in _prefix) {

                if (_toHumb(_prefix[_i] + '-' + _styleName) in _htmlStyle) return _prefix[_i];
            }
            return "";
        },
        GetCss3StyleName: function (styleName) {
            var _prefix = ['webkit', 'Moz', 'ms', 'o'],
                _i,
                _htmlStyle = document.documentElement.style,
                _toHumb = function (string) {
                    return string.replace(/-(\w)/g, function ($0, $1) {
                        return $1.toUpperCase();
                    });
                };

            for (_i in _prefix) {
                if (_toHumb(_prefix[_i] + '-' + styleName) in _htmlStyle) {
                    return '-' + _prefix[_i] + '-' + styleName;
                }
            };

            return styleName;
        },
        GetSelectorName: function (selector) {
            /// <summary>获取选择器的名称 就是去掉class选择器 和 id选择器的.和#</summary>
            /// <param name="selector" type="String">选择器</param>

            return selector.replace(/[\s\S]*([\.]|[\#])/g, "")
        },
        //GetNoHTMLFormatStr: function (htmlCode) {
        //    /// <summary>去除字符串html标签</summary>
        //    /// <param name="htmlCode" type="String">字符串</param>
        //    /// <returns type="String" />
        //    var _matchVale = htmlCode || "",
        //     _matchArr = [],
        //     _reg = new RegExp("<[^{><}]*>", "g");
        //    //如果该对象不存在这个方法的话 直接返回空串
        //    if (!_matchVale.replace) { return "";}

        //    _matchVale = _matchVale.replace(/<\s*?br\s*?\/*\s*?>/gi, "#newlinesign#");
        //    _matchVale = _matchVale.replace(/<\s*?\/\s*?p\s*?>/gi, "#newlinesign#");
        //    _matchVale = _matchVale.replace(/<\s*?p\s*?>/gi, "#newlinesign#");
        //    _matchArr = _matchVale.match(_reg);

        //    if (_matchArr && _matchArr.length && _matchArr.length > 0) {
        //        for (var _i = 0; _i < _matchArr.length; _i++) {
        //            if (_matchArr[_i].toLowerCase().indexOf("img") < 0) {
        //                _matchVale = _matchVale.replace(_matchArr[_i], "");
        //            }
        //        }
        //    }

        //    _matchVale = _matchVale.replace(/&nbsp;/gi, " ");
        //    _matchVale = _matchVale.replace(/&ldquo;/gi, "“");
        //    _matchVale = _matchVale.replace(/&rdquo;/gi, "”");
        //    _matchVale = _matchVale.replace(/&lt;/gi, "<");
        //    _matchVale = _matchVale.replace(/&gt;/gi, ">");


        //    _matchVale = _matchVale.replace(new RegExp("#newlinesign#", "g"), "");
        //    return _matchVale;
        //},
        RemoveHTML: function (htmlCode, newlineSign, isRemoveAll, isReservedImg) {
            /// <summary>去除字符会串html标签</summary>
            /// <param name="htmlCode" type="String">字符串</param>
            /// <param name="newlineSign" type="String">换行符,默认为空（例如"\r\n"或者"<br/>"）</param>
            /// <param name="isRemoveAll" type="bool">是否删除全部的(包括:&nbsp;&ldquo;&rdquo;等)</param>
            /// <param name="isReservedImg" type="bool">是否保留图片标签</param>
            /// <returns type="String" />
            var _matchVale = htmlCode || "",
                _matchArr = [],
                _reg = new RegExp("<[^{><}]*>", "g");

            _matchVale = _matchVale.replace(/<\s*?br\s*?\/*\s*?>/gi, "#newlinesign#");
            _matchVale = _matchVale.replace(/<\s*?\/\s*?p\s*?>/gi, "#newlinesign#");
            _matchVale = _matchVale.replace(/<\s*?p\s*?>/gi, "#newlinesign#");
            _matchArr = _matchVale.match(_reg);

            if (_matchArr && _matchArr.length && _matchArr.length > 0) {
                for (var _i = 0; _i < _matchArr.length; _i++) {
                    if (!(isReservedImg === true && _matchArr[_i].toLowerCase().indexOf("img") >= 0)) {
                        _matchVale = _matchVale.replace(_matchArr[_i], "");
                    }
                }
            }

            if (!isRemoveAll) { //删除全部的(包括:&nbsp;&ldquo;&rdquo;等)
                _matchVale = _matchVale.replace(/&nbsp;/gi, " ");
                _matchVale = _matchVale.replace(/&ldquo;/gi, "“");
                _matchVale = _matchVale.replace(/&rdquo;/gi, "”");
                _matchVale = _matchVale.replace(/&lt;/gi, "<");
                _matchVale = _matchVale.replace(/&gt;/gi, ">");
            }

            _matchVale = _matchVale.replace(new RegExp("#newlinesign#", "g"), (newlineSign == undefined ? "" : newlineSign));

            return _matchVale;
        },
        FormatJsonData: function (str) {
            /// <summary>过滤json数据中的逗号和斜杠等</summary>
            /// <param name="str" type="String">需要过滤的json字符串</param>
            /// <returns type="String" />
            if (str == null) { return ""; }

            if (Cmn.Object.IsType(str, "string")) {
                var _newstr = "";

                for (var _i = 0; _i < str.length; _i++) {
                    var _c = str.charAt(_i);
                    switch (_c) {
                        case '\"': _newstr += "\\\""; break;
                        case '\'': _newstr += "\\\'"; break;
                        case '\\': _newstr += "\\\\"; break;
                        case '/': _newstr += "\\/"; break;
                        case '\b': _newstr += "\\b"; break;
                        case '\f': _newstr += "\\f"; break;
                        case '\n': _newstr += "\\n"; break;
                        case '\r': _newstr += "\\r"; break;
                        case '\t': _newstr += "\\t"; break;
                        default: _newstr += _c;
                    }
                }
                return _newstr;
            }
            else if (typeof str === "object") {
                $.each(str, function (index, item) {
                    if (Cmn.Object.IsType(str[index], "string")) {
                        str[index] = Cmn.Func.FormatJsonData(str[index]);
                    }
                    else if (typeof str[index] == "object") {
                        Cmn.Func.FormatJsonData(str[index]);
                    }

                });

                return str;
            }
            else { return ""; }

        },
        FirstUppercase: function (str) {
            /// <summary>将一段引文字符串转成首字母大写</summary>
            return str.replace(/\b(\w)|\s(\w)/g, function (s) { return s.toUpperCase() })
        },
        HtmlEncode: function (html) {
            /// <summary>html编码，把html标签转成转义字符</summary>
            /// <returns type="String" />

            return document.createElement('a').appendChild(
                document.createTextNode(html)).parentNode.innerHTML;
        },
        HtmlDecode: function (str) {
            /// <summary>把转义过的html字符串转成正常的html字符串</summary>
            /// <returns type="String" />

            var _a = document.createElement('a');
            _a.innerHTML = str;

            return _a.textContent;
        },
        Trim: function (str) {
            /// <summary>去除字符串前后的空格</summary>
            /// <param name="str" type="String">字符串</param>
            /// <returns type="String" />

            return (Cmn.IsType(str, "string") ? str : "").replace(/(^\s*)|(\s*$)/g, '');
        },
        ToSqlStr: function (str) {
            /// <summary>处理字符串中单引号，防止sql注入</summary>
            /// <param name="str" type="String">将要放到sql中的参数</param>

            return str.replace("'", "''");
        },
        Base64Encode: function (str) {
            /// <summary>base64加密</summary>
            var c1, c2, c3;
            var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var i = 0, len = str.length, string = '';

            while (i < len) {
                c1 = str.charCodeAt(i++) & 0xff;
                if (i == len) {
                    string += base64EncodeChars.charAt(c1 >> 2);
                    string += base64EncodeChars.charAt((c1 & 0x3) << 4);
                    string += "==";
                    break;
                }
                c2 = str.charCodeAt(i++);
                if (i == len) {
                    string += base64EncodeChars.charAt(c1 >> 2);
                    string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                    string += base64EncodeChars.charAt((c2 & 0xF) << 2);
                    string += "=";
                    break;
                }
                c3 = str.charCodeAt(i++);
                string += base64EncodeChars.charAt(c1 >> 2);
                string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                string += base64EncodeChars.charAt(c3 & 0x3F)
            }
            return string
        },
        Base64Decode: function (str) {
            /// <summary>Base64解密</summary>
            var c1, c2, c3, c4;
            var base64DecodeChars = new Array(
                    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                    -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57,
                    58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6,
                    7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
                    25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
                    37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1,
                    -1, -1
            );
            var i = 0, len = str.length, string = '';

            while (i < len) {
                do {
                    c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
                } while (
                        i < len && c1 == -1
                );

                if (c1 == -1) break;

                do {
                    c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
                } while (
                        i < len && c2 == -1
                );

                if (c2 == -1) break;

                string += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

                do {
                    c3 = str.charCodeAt(i++) & 0xff;
                    if (c3 == 61)
                        return string;

                    c3 = base64DecodeChars[c3]
                } while (
                        i < len && c3 == -1
                );

                if (c3 == -1) break;

                string += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

                do {
                    c4 = str.charCodeAt(i++) & 0xff;
                    if (c4 == 61) return string;
                    c4 = base64DecodeChars[c4]
                } while (
                        i < len && c4 == -1
                );

                if (c4 == -1) break;

                string += String.fromCharCode(((c3 & 0x03) << 6) | c4)
            }
            return string;
        },
        Utf8Encode: function (str) {

            function utf8(wide) {
                var c, s;
                var enc = "";
                var i = 0;
                while (i < wide.length) {
                    c = wide.charCodeAt(i++);
                    // handle UTF-16 surrogates
                    if (c >= 0xDC00 && c < 0xE000) continue;
                    if (c >= 0xD800 && c < 0xDC00) {
                        if (i >= wide.length) continue;
                        s = wide.charCodeAt(i++);
                        if (s < 0xDC00 || c >= 0xDE00) continue;
                        c = ((c - 0xD800) << 10) + (s - 0xDC00) + 0x10000;
                    }
                    // output value
                    if (c < 0x80) enc += String.fromCharCode(c);
                    else if (c < 0x800) enc += String.fromCharCode(0xC0 + (c >> 6), 0x80 + (c & 0x3F));
                    else if (c < 0x10000) enc += String.fromCharCode(0xE0 + (c >> 12), 0x80 + (c >> 6 & 0x3F), 0x80 + (c & 0x3F));
                    else enc += String.fromCharCode(0xF0 + (c >> 18), 0x80 + (c >> 12 & 0x3F), 0x80 + (c >> 6 & 0x3F), 0x80 + (c & 0x3F));
                }
                return enc;
            };
            var hexchars = "0123456789ABCDEF";
            function toHex(n) {
                return hexchars.charAt(n >> 4) + hexchars.charAt(n & 0xF);
            }
            var okURIchars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";

            function encodeURIComponentNew(s) {
                var s = utf8(s);
                var c;
                var enc = "";
                for (var i = 0; i < s.length; i++) {
                    if (okURIchars.indexOf(s.charAt(i)) == -1)
                        enc += "%" + toHex(s.charCodeAt(i));
                    else
                        enc += s.charAt(i);
                }
                return enc;
            };

            return utf8(str);
        },
        Encryption: function (str, key) {
            /// <summary>字符串加密</summary>
            /// <param name="str" type="String">加密的字符串</param>
            /// <param name="key" type="String">加密的key</param>
            //加密字符串不存在的话直接返回
            if (!str) { return str; };
            //加密的key
            var _key = key || "xmnfqaetsdngkasdtqweltgdshgaethqkretykalskdhtwerthkdjhgbaw",
                //key的长度
                _key_len = _key.length,
                //加密串的长度
                _str_len = str.length,
                //加密结果
                _result = "";

            for (var _j = 0, _i = 0; _i < _str_len; _i++, _j++) {
                if (_j >= _key_len) { _j = 0; }
                _result += String.fromCharCode(str[_i].charCodeAt(0) ^ _key[_j].charCodeAt(0));
            };

            return Cmn.Str.Base64Encode(Cmn.Str.Utf8Encode(_result));
        }
    });
})(window);

//常用函数扩展
(function (window, undefined) {
    "use strict";

    var $ = window.$ || window.jQuery || "";

    Cg.Extend(Cg.Func = {}, {
        //获取元素自身的html代码
        GetOuterHtml: function (obj) {
            /// <summary>获取元素自身的html代码</summary>
            /// <param name="obj" type="object">Dom对象</param>

            return $('<div></div>').append(obj.clone()).html();
        },
        //往AjaxData中增加值对
        AddParamToAjaxData: function (ajaxData, key, value) {
            /// <summary>往AjaxData中增加值对</summary>
            /// <param name="ajaxData" type="String">jason字符串</param>
            /// <param name="key" type="String">键名</param>
            /// <param name="value" type="String">值（键对应的值）</param>
            /// <returns type="String" />

            if (ajaxData == null || ajaxData == undefined || ajaxData == "") { ajaxData = "{}"; }

            if (ajaxData.replace(" ", "").length > 2) {
                return ajaxData.replace("}", ",'" + key + "':'" + value + "'}");
            }
            else { return ajaxData.replace("}", "'" + key + "':'" + value + "'}"); }
        },
        AddParamToUrl: function (url, param) {
            /// <summary>Url中增加参数</summary>
            /// <param name="url" type="String">网址</param>
            /// <param name="param" type="String">需要增加的参数，例如："UserID=3"</param>
            /// <returns type="String" />

            url = Cmn.Func.DelParamFromUrl(url, param.split("=")[0]); //删除原先可能存在的参数

            if (url.indexOf("?") >= 0) { url += "&" + param; }
            else { url += "?" + param; }

            return url;
        },
        DelParamFromUrl: function (url, paramName) {
            /// <summary>从Url中删除某个参数</summary>
            /// <param name="url" type="String">网址</param>
            /// <param name="paramName" type="String">:参数名，例如："UserID"</param>
            /// <returns type="String" />

            /*
            var _retVal = "";
            var _tmpStr;
            var _loc;

            if (!paramName) { //没有paramName参数，删除所有参数
                _loc = url.indexOf("?");
                if (_loc >= 0) { return url.substring(0, _loc); }
                else { return url; }
            }


            _loc = url.indexOf(paramName + "=");

            if (_loc < 0) {
                _loc = url.indexOf(paramName + " ");

                if (_loc < 0) { return url; }
            }

            _retVal = url.substring(0, _loc).replace(/(^\s*)|(\s*$)/g, '');
            _tmpStr = url.substring(_loc);

            if (_tmpStr.indexOf("&") >= 0) { //后面还有参数
                _retVal += _tmpStr.substring(_tmpStr.indexOf("&") + 1);
            }
            else {  //后面没有参数
                if (_retVal.length > 0) {
                    if (_retVal.charAt(_retVal.length - 1) == '?' || _retVal.charAt(_retVal.length - 1) == '&') {
                        _retVal = _retVal.substring(0, _retVal.length - 1);
                    }
                }
            }

            return _retVal;
            */

            if (url.indexOf("?") < 0) {
                return url;
            }
            var _pos = url.indexOf("#");
            var _hash = "";
            if (_pos > 0) {
                _hash = url.substring(_pos);
                url = url.substring(0, _pos);
            }
            _pos = url.indexOf("?");
            var _query = url.substring(_pos);
            url = url.substring(0, _pos);

            var _reg = /(\w+)=([^&|^#]+)/g;
            var _mc = _query.match(_reg);
            if (_mc) {
                for (var _i = 0; _i < _mc.length; _i++) {
                    var _paramValue = _mc[_i];
                    if (_paramValue.split("=")[0] != paramName) {
                        url += (url.indexOf("?") >= 0 ? "&" : "?") + _paramValue;
                    }
                }
            }
            return url + (_hash != "" ? _hash : "");
        },
        SetDefaultUrlForGetParamFromUrl: function (url) {
            /// <summary>设置默认的url用于GetParamFromUrl（主要解决Cms Url重写后的问题）</summary>
            /// <param name="url" type="String">默认url</param>
            Cmn.Func._DefaultUrlForGetParamFromUrl = url;
        },
        GetParamFromUrl: function (paramName, url) {
            /// <summary>从Url中获取某个参数的值</summary>
            /// <param name="paramName" type="String">参数名，例如："UserID"</param>
            /// <param name="url" type="String">网址</param>
            /// <returns type="String" />

            //如果没有传url就默认当前地址
            if (url == null || url == "" || typeof (url) == "undefind") {
                if (Cmn.Func._DefaultUrlForGetParamFromUrl) { url = Cmn.Func._DefaultUrlForGetParamFromUrl; }
                else { url = window.location.href; }
            }

            var _retVal = "";
            var _regExp = new RegExp("[\\?\\s&]" + paramName + "\\s*=([^&#]*)");
            var _matchRes = url.match(_regExp);

            if (_matchRes != null) { _retVal = _matchRes[1]; }

            return Cmn.Func.Trim(_retVal);
        },
        GetParamListFromurl: function (url) {
            /// <summary>从url中获取参数列表</summary>
            /// <param name="url" type="String">url</param>
            /// <returns type="json" />

            var _paramList = {};
            var _tmpLoc = url.indexOf("?");

            if (_tmpLoc != -1) {
                url = url.substr(_tmpLoc + 1);

                var _strList = url.split("&");

                for (var i = 0; i < _strList.length; i++) {
                    _tmpLoc = _strList[i].indexOf("=");

                    if (_tmpLoc != -1) {
                        _paramList[_strList[i].substr(0, _tmpLoc)] = decodeURIComponent(_strList[i].substr(_tmpLoc + 1));
                    }
                }
            }

            return _paramList;
        },
        AddParamToUrlHashtag: function (url, param) {
            /// <summary>从Url的#号参数中增加参数</summary>
            /// <param name="url" type="String">网址</param>
            /// <param name="param" type="String">需要增加的参数，例如："UserID=3"</param>
            /// <returns type="String" />

            //当只有一个参数，往当前的浏览器地址上加参数
            if (arguments.length == 1) {
                param = url;
                url = window.location.hash;
            }

            url = Cmn.Func.DelParamFromUrlHashtag(url, param.split("=")[0]); //删除原先可能存在的参数

            if (url.indexOf("#") >= 0) { url += "&" + param; }
            else { url += "#" + param; }

            if (arguments.length == 1) { window.location.hash = url; }

            return url;
        },
        DelParamFromUrlHashtag: function (url, paramName) {
            /// <summary>从Url的#号参数中删除某个参数</summary>
            /// <param name="url" type="String">网址</param>
            /// <param name="paramName" type="String">:参数名，例如："UserID"</param>
            /// <returns type="String" />

            //当只有一个参数，往当前的浏览器地址上删除参数
            if (arguments.length == 1) {
                paramName = url;
                url = window.location.hash;
            }

            if (url.indexOf("#") < 0) { return url; }

            var _retVal = url.substring(0, url.indexOf("#"));
            var _hashTag = url.substring(url.indexOf("#"));

            var _regExp = new RegExp("[#\\s&]" + paramName + "\\s*=[^&]*");
            var _matchRes = _hashTag.match(_regExp);

            if (_matchRes != null) {
                _hashTag = Cmn.Func.Trim(_hashTag.replace(_matchRes[0], ""));

                if (_hashTag.length > 0) {
                    if (_hashTag[0] == '&') { _hashTag = _hashTag.substring(1); }
                    if (_hashTag[0] != '#') { _hashTag = "#" + _hashTag; }
                }
            }

            _retVal = _retVal + _hashTag;

            if (arguments.length == 1) { window.location.hash = _retVal; }

            return _retVal;
        },
        GetParamFromUrlHashtag: function (paramName, url) {
            /// <summary>从Url的#号参数中获取某个参数的值</summary>
            /// <param name="paramName" type="String">参数名，例如："UserID"</param>
            /// <param name="url" type="String">网址</param>
            /// <returns type="String" />

            //如果没有传url就默认当前地址
            if (url == null || url == "" || typeof (url) == "undefind") { url = window.location.href; }

            url = url.substring(url.indexOf("#")); //截取#号后面的字符串

            var _retVal = "";
            var _regExp = new RegExp("[#\\s&]" + paramName + "\\s*=([^&]*)");
            var _matchRes = url.match(_regExp);

            if (_matchRes != null) { _retVal = _matchRes[1]; }

            return Cmn.Func.Trim(_retVal);
        },
        //去除字符串前后的空格
        Trim: function (str) {
            /// <summary>去除字符串前后的空格</summary>
            /// <param name="str" type="String">字符串</param>
            /// <returns type="String" />

            return Cg.Str.Trim(str);
        },
        //GetNoHTMLFormatStr: function (htmlCode) {
        //    /// <summary>去除字符会串html标签</summary>
        //    /// <param name="htmlCode" type="String">字符串</param>
        //    /// <returns type="String" />
        //    return Cg.Str.RemoveHTML(htmlCode);
        //},
        RemoveHTML: function (htmlCode, newlineSign, isRemoveAll, isReservedImg) {
            /// <summary>去除字符会串html标签</summary>
            /// <param name="htmlCode" type="String">字符串</param>
            /// <param name="newlineSign" type="String">要替换的字符串</param>
            /// <param name="isRemoveAll" type="String">是否删除全部的(包括:&nbsp;&ldquo;&rdquo;等)</param>
            /// <param name="isReservedImg" type="bool">是否保留图片标签</param>
            /// <returns type="String" />
            return Cg.Str.RemoveHTML(htmlCode, newlineSign, isRemoveAll, isReservedImg);
        },
        //过滤json数据中的逗号和斜杠等
        FormatJsonData: function (str) {
            /// <summary>过滤json数据中的逗号和斜杠等</summary>
            /// <param name="str" type="String">需要过滤的json字符串</param>
            /// <returns type="String" />

            return Cg.Str.FormatJsonData(str);
        },
        //Json转字符串
        JsonToStr: function (json) {
            /// <summary>Json转字符串</summary>
            /// <param name="json" type="json">需要转成字符串的json</param>
            /// <returns type="String" />

            if (Cmn.Func.IsString(json)) { return json; }

            if (typeof JSON == "undefined") { CmnAjax.Func.LoadJs(Cmn.Func.GetRoot() + "Js/Json2.js"); }

            return JSON.stringify(json);

        },
        FirstUppercase: function (str) {
            /// <summary>将一段引文字符串转成首字母大写</summary>
            return Cg.Str.FirstUppercase(str);
        },
        //是否是WebMethod
        IsWebMethod: function (methodName) {
            /// <summary>是否是WebMethod</summary>
            /// <param name="methodName" type="String">方法名</param>
            /// <returns type="bool" />

            if (Cmn.Cfg.IsWebMethod == "Auto") {
                //去掉？后面的参数后，取最后一个/后面的内容，如果没有.认为是webmothod
                var _url = Cmn.Func.DelParamFromUrl(methodName);

                var _loc = _url.lastIndexOf("/");
                if (_loc >= 0) { _url = _url.substring(_loc + 1); }

                if (_url.indexOf(".") >= 0) { return false; }
                else { return true; }
            }
            else { return Cmn.Cfg.IsWebMethod; }
        },
        //判断变量是否是数组
        IsArray: function (variable) {
            /// <summary>判断变量是否是数组</summary>
            /// <param name="variable" type="String">变量</param>
            /// <returns type="bool" />

            return Object.prototype.toString.apply(variable) === '[object Array]';
        },
        //在窗口中间显示弹出窗
        ShowPoupWin: function (poupWinSelector) {
            /// <summary>在窗口中间显示弹出窗</summary>
            /// <param name="poupWinSelector" type="String">弹出窗选择器</param>

            var _obj = $(poupWinSelector);

            //中心位置显示
            var _x = 50;
            var _y = 50;

            var _init = function () {
                _x = ($(window).width() - _obj.width()) / 2;; //($(window).width()-$('#'+popupWinID).width())/2;
                _y = ($(window).height() - _obj.height()) / 2;; //($(window).height()-$('#'+popupWinID).height())/2;

                if (_x - 20 > 0) { _x = _x - 20; }
                if (_y - 20 > 0) { _y = _y - 20; }

                _obj.css('top', _y + $(window).scrollTop() + 'px');
                _obj.css('left', _x + $(window).scrollLeft() + 'px');
            }

            _init();
            _obj.show();


            //滚动事件处理
            $(window).scroll(function () {                 //重新获取窗口的宽高
                if (_obj.is(":visible")) {
                    if (_y) { _obj.css('top', _y + $(window).scrollTop() + 'px'); }
                    if (_x) { _obj.css('left', _x + $(window).scrollLeft() + 'px'); }
                }
            });

            //resize事件
            $(window).resize(function () {
                if (_obj.is(":visible")) { _init(); }
            });
        },
        // 把数据设置到htmlStr中
        SetDataToHtmlStr: function (htmlStr, className, data) {
            /// <summary>把数据设置到htmlStr中</summary>
            /// <param name="htmlStr" type="String">原html字符串</param>
            /// <param name="className" type="String">样式名称(数据key，不包括属性部分)</param>
            /// <param name="data" type="String">要填充进去的新数据</param>
            /// <returns type="String" />

            var _afterStr = "";
            var _dataPlaceholder = "#data#";

            var _htmlDom = $(htmlStr);

            //清除dat填充内容,说明是填充内容
            $.merge(_htmlDom.filter("." + className), _htmlDom.find("." + className)).html("");

            //还原模板内容
            htmlStr = "";

            $(_htmlDom).each(function () { htmlStr += this.outerHTML; });

            data = data + ""; //转成字符串，如果是数字的话，拿不到长度，会导致死循环

            for (var _startLoc = 0; ;) {
                var _loc = htmlStr.indexOf(className, _startLoc);

                if (_loc < 0) { break; } //不存在className 就退出循环

                if (htmlStr.charAt(_loc + className.length) == '-') { //说明是设置属性
                    _afterStr = htmlStr.substring(_loc + className.length + 1);
                    htmlStr = htmlStr.substring(0, _loc + className.length + 1);

                    //获取属性名
                    var _tmpRegexp = "^\\S*?(?=[\\x22\\x27\\s]+?)";   //双引号和单引号
                    var _attrName = _afterStr.match(_tmpRegexp)[0]; //"-"后面的属性名


                    //获取当前标签中内容
                    var _tmpLoc = htmlStr.lastIndexOf("<");

                    var _curDom = htmlStr.substring(_tmpLoc); //存放当前标签内容
                    htmlStr = htmlStr.substring(0, _tmpLoc);

                    _tmpLoc = _afterStr.indexOf(">");

                    _curDom += _afterStr.substring(0, _tmpLoc);
                    _afterStr = _afterStr.substring(_tmpLoc);


                    //看属性名中有没有中括号
                    _tmpLoc = _attrName.indexOf("[");
                    var _bracketsContent = ""; //存放括号中的内容

                    if (_tmpLoc >= 0) { //有中括号
                        _bracketsContent = _attrName.substring(_tmpLoc + 1);
                        _bracketsContent = _bracketsContent.substring(0, _bracketsContent.indexOf("]"));
                        _attrName = _attrName.substring(0, _tmpLoc);
                    }

                    //获取当前属性内容
                    //var _tmpRegexp = _attrName + "\\s*=[\\x22\\x27\\s]*[\\s\\S]*?[\\x22\\x27\\s]+";
                    var _attrHtml = _curDom.match(new RegExp("\\s+"+_attrName + "\\s*=\\s*\\x22[\\s\\S]*?\\x22"));
                    var _attrContent = ""; //属性内容

                    if (_attrHtml == null) { //不是双引号
                        _attrHtml = _curDom.match(new RegExp("\\s+" + _attrName + "\\s*=\\s*\\x27[\\s\\S]*?\\x27"));

                        if (_attrHtml == null) { //不是单引号
                            //_attrHtml = _curDom.match(new RegExp("\\s+" + _attrName + "\\s*=\\S*?\\s"));
                            _attrHtml = _curDom.match(new RegExp("\\s+" + _attrName + "\\s*=\\S*?(?=[\\s>]|$)"));

                            if (_attrHtml != null) {
                                _attrContent = _attrHtml[0].replace(/\s*=/, "").replace(/\s/g, "");
                            }
                        }
                        else { //是单引号
                            _attrContent = _attrHtml[0].match(new RegExp("\\x27[\\s\\S]*?\\x27"));

                            if (_attrContent != null) { _attrContent = _attrContent[0].replace(/'/g, ""); }
                            else { _attrContent = ""; }
                        }
                    }
                    else { //是双引号
                        _attrContent = _attrHtml[0].match(new RegExp("\\x22[\\s\\S]*?\\x22"));

                        if (_attrContent != null) { _attrContent = _attrContent[0].replace(/"/g, ""); }
                        else { _attrContent = ""; }
                    }

                    //从当前标签内容中删除属性内容
                    if (_attrHtml != null) { _curDom = _curDom.replace(_attrHtml[0], " "); }

                    //加新的属性内容
                    if (_attrName.toLowerCase() == "style" || _attrName.toLowerCase() == "class") {
                        if (_attrName.toLowerCase() == "style" && _bracketsContent != "") {
                            _curDom += " " + _attrName + "='" + _attrContent + _bracketsContent + ":" + _dataPlaceholder + ";'";
                        }
                        else { _curDom += " " + _attrName + "='" + _attrContent + " " + _dataPlaceholder + "'"; }
                    }
                    else { _curDom += " " + _attrName + "='" + _dataPlaceholder + "'"; }

                    //设置下一次循环的起始位置
                    _startLoc = htmlStr.length + _curDom.indexOf(className + "-" + _attrName) + (className + "-" + _attrName).length;

                    htmlStr = htmlStr + _curDom + _afterStr;
                }
                else if (htmlStr.charAt(_loc + className.length) == ' ' || htmlStr.charAt(_loc + className.length) == String.fromCharCode(34)
                    || htmlStr.charAt(_loc + className.length) == String.fromCharCode(39)
                    || htmlStr.charAt(_loc + className.length) == '>') {//说明是设置 innerHtml,34：双引号；39：单引号
                    _afterStr = htmlStr.substring(_loc + className.length);
                    htmlStr = htmlStr.substring(0, _loc + className.length);

                    //设置下一次循环的起始位置
                    // _startLoc = _startLoc + className.length + _afterStr.indexOf("<") + data.length; //位置算得有问题，所以重写了
                    _startLoc = _loc + className.length;//+ _afterStr.indexOf("<") + data.length;

                    _afterStr = _afterStr.replace(/>[\s\S]*?</, ">" + _dataPlaceholder + "<");

                    htmlStr = htmlStr + _afterStr;
                }
                else { _startLoc = _loc + className.length; }
            }

            return htmlStr.replace(/#data#/g,data);
        },
        IsString: function (variable) {
            /// <summary>判断变量是否是字符串</summary>
            /// <param name="variable" type="object">变量</param>
            /// <returns type="bool" />

            if (typeof variable == "undefined") { return false; }

            if (typeof variable == "string" || variable.constructor == String) { return true; }
            else { return false; }
        },
        //网站的根目录
        SiteRoot: "/",
        GetRoot: function () {
            /// <summary>获取网站的根目录（最后已经带斜杠了）</summary>
            return Cmn.Func.SiteRoot;
        },
        SetRoot: function (siteRoot) {
            /// <summary>设置网站的根目录</summary>
            /// <param name="siteRoot" type="String">网站的根（最后要带斜杠）</param>

            Cmn.Func.SiteRoot = siteRoot;
        },
        AddSiteRoot: function (url) {
            /// <summary>url前面加上网站根目录（主要用户部署在子目录下的时候）</summary>
            /// <param name="url" type="String">Url链接</param>

            if (Cmn.Func.SiteRoot == "/") { return url; }

            url = Cmn.Func.Trim(url);

            if (url.charAt(0) == '/') {
                if (Cmn.Func.SiteRoot.charAt(Cmn.Func.SiteRoot.length - 1) == '/') {
                    return Cmn.Func.SiteRoot.substring(0, Cmn.Func.SiteRoot.length - 1) + url;
                }
                else { return Cmn.Func.SiteRoot + url; }
            }
            else { return url; }
        },
        GetAbsoluteUrl: function (url) {
            /// <summary>获取绝对路径</summary>
            /// <param name="url" type="String">相对路径</param>

            if (url.indexOf("http:") >= 0 || url.indexOf("https:") >= 0) { return url; }

            var _a = document.createElement('A');
            _a.href = url; // 设置相对路径给Image, 此时会发送出请求
            url = _a.href; // 此时相对路径已经变成绝对路径
            return url;
        },
        GetMainDomain: function (url) {
            /// <summary>获取网址中的主域名</summary>
            /// <param name="url" type="String">网址</param>
            /// <returns type="String" />

            //不是绝对路径，就取当前路径
            if (url == undefined || (url.indexOf("http:") < 0 && url.indexOf("https:") < 0)) {
                url = window.location.href;
            }

            url = url.replace("http://", "").replace("https://", "");

            var _loc = url.indexOf("/");

            if (_loc >= 0) { url = url.substring(0, _loc); }

            return Cmn.Func.Trim(url);

        },
        GetJsPath: function (jsFileName) {
            /// <summary>获取某个js文件的路径(不包括文件名)</summary>
            /// <param name="jsFileName" type="String">js文件名</param>

            var _scripts = document.getElementsByTagName('script');
            var _script = null;

            for (var i = 0; i < _scripts.length; i++) {
                if (_scripts[i].src.indexOf(jsFileName) != -1) {
                    _script = _scripts[i];
                    break;
                }
            }

            if (_script != null) { //找到对应js
                var _src = _script.src;

                return _src.replace(jsFileName, "");
            }

            return "";
        },
        IsSameMainDomain: function (url1, url2) {
            /// <summary>判断是否是同一个主域的url</summary>
            /// <param name="url1" type="String">网址1</param>
            /// <param name="url2" type="String">网址2</param>
            /// <returns type="bool" />

            if (url2 == undefined || url2 == null || url2 == "") { url2 = window.location.href; }

            url1 = Cmn.Func.GetMainDomain(url1);
            url2 = Cmn.Func.GetMainDomain(url2);

            if (url1.toLowerCase() == url2.toLowerCase()) { return true; }
            else { return false; }
        },
        HtmlEncode: function (html) {
            /// <summary>html编码，把html标签转成转义字符</summary>
            /// <returns type="String" />

            return Cg.Str.HtmlEncode(html);
        },
        HtmlDecode: function (html) {
            /// <summary>把转义过的html字符串转成正常的html字符串</summary>
            /// <returns type="String" />

            return Cg.Str.HtmlDecode(html);
        },
        //获取父亲相对于屏幕的坐标点
        GetParentOffset: function (selector) {
            /// <summary>获取父亲相对于屏幕的坐标点</summary>
            /// <param name="selector" type="String">目标父亲的选择器</param>
             var _parent = $(selector).parent();
            if (_parent.css("position") == "absolute" ||
                _parent.css("position") == "relative" ||
                Cmn.IsType(_parent[0]) == "htmlbodyelement") {
                return _parent.offset();
            }
            return this.GetParentOffset(_parent);
        }
    });


    //设备识别 和浏览器识别
    Cg.Extend(Cg.Func, {
        //判断变量是否是iPhone4
        IsIphone4: function () {
            /// <summary>判断变量是否是iPhone4</summary>
            if (Cmn.Func.IsIOS()) {
                var _width = window.screen.width;
                var _height = window.screen.height;
                var _scale = _width / _height;
                if (_scale > 0.6 && _scale < 0.7) { return true; }
            }
            return false;
        },
        //判断变量是否是iPhone4
        IsIphone5: function () {
            /// <summary>判断变量是否是iPhone5</summary>
            if (Cmn.Func.IsIOS()) {
                var _width = window.screen.width;
                var _height = window.screen.height;
                var _scale = _width / _height;
                if (_scale > 0.5 && _scale < 0.6) { return true; }
            }
            return false;
        },
        //是否是Android系统
        IsAndroid: function () {
            /// <summary>是否是Android系统</summary>
            /// <returns type="bool" />

            return navigator.userAgent.match(/Android/i) ? true : false;
        },
        //是否是IOS系统
        IsIOS: function () {
            /// <summary>是否是IOS系统</summary>
            /// <returns type="bool" />

            return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
        },
        IsIPad: function () {
            /// <summary>是否是IPad</summary>

            return navigator.userAgent.match(/iPad/i) ? true : false;
        },
        //是否是IEMobile
        IsIEMobile: function () {
            /// <summary>是否是IEMobile</summary>
            /// <returns type="bool" />

            return navigator.userAgent.match(/IEMobile/i) ? true : false;
        },
        IsQQBrowser: function () {
            /// <summary>是否是qq内置浏览器</summary>
            return navigator.userAgent.match(/QQ/i) ? true : false;
        },
        IsIE: function () {
            /// <summary>是否是IE</summary>
            /// <returns type="bool" />
            return navigator.userAgent.match(/MSIE|Trident/g) ? true : false;
        },
        BrowserVersion: function () {
            /// <summary>检测浏览器版本号 支持 ie firefox chrome opera safari</summary>
            /// <returns type="string" />

            var ua = navigator.userAgent.toLowerCase();
            var s;
            (s = ua.match(/msie ([\d.]+)/)) ? s = s[1] :
            (s = ua.match(/firefox\/([\d.]+)/)) ? s = s[1] :
            (s = ua.match(/chrome\/([\d.]+)/)) ? s = s[1] :
            (s = ua.match(/opera.([\d.]+)/)) ? s = s[1] :
            (s = ua.match(/version\/([\d.]+).*safari/)) ? s = s[1] : 0;

            return s;
        },
        //是否是BlackBerry
        IsBlackBerry: function () {
            /// <summary>是否是BlackBerry</summary>
            /// <returns type="bool" />

            return navigator.userAgent.match(/BlackBerry/i) ? true : false;
        },
        //是否是移动设备
        IsMobile: function () {
            /// <summary>是否是移动设备</summary>
            /// <returns type="bool" />

            return (Cmn.Func.IsAndroid() || Cmn.Func.IsIOS() || Cmn.Func.IsIEMobile() || Cmn.Func.IsBlackBerry());
        },
        IsWeiXin: function () {
            /// <summary>是不是微信浏览器</summary>
            /// <returns type="bool" />

            return navigator.userAgent.match(/MicroMessenger/i) ? true : false;
        }


    })


    //cookie操作
    Cg.Extend(Cg.Func.Cookie = {}, {
        _CookiePrefix: "", //cookie前缀
        Set: function (name, value, domain, time, path, secure) {
            /// <summary>设置Cookie的通用函数，其中name是必须的参数。其它为可选！注：在设置Cookie时若不设置过期时间则该Cookie为临时的，仅当此次会话可用 </summary>
            /// <param name="name" type="String">cookie名称</param>
            /// <param name="value" type="String">cookie值</param>
            /// <param name="domain" type="String">域</param>
            /// <param name="time" type="String">cookie过期时间</param>
            /// <param name="path" type="String">路径</param>
            /// <param name="secure" type="String">源</param>
            name = Cg.Func.Cookie._CookiePrefix + name;

            var _now = new Date();
            time = time || 3;
            _now.setDate(_now.getDate() + time);
           // domain = domain || Cmn.Func.GetMainDomain(window.location.href);
            path = path || "/";

            var curcookie = name + "=" + encodeURI(value)
                + ((_now) ? ";expires=" + _now.toGMTString() : "")
                + ((path) ? ";path=" + path : "")
                + ((domain) ? ";domain=" + domain : "")
                + ((secure) ? ";secure" : "");

            document.cookie = curcookie;
        },
        Get: function (name) {
            /// <summary>读取特定Cookie的通用函数 </summary>
            /// <param name="name" type="String">cookie名称</param>
            name = Cg.Func.Cookie._CookiePrefix + name;

            if (document.cookie.length > 0) {
                var _start = document.cookie.indexOf(name + "=");

                if (_start != -1) {
                    _start = _start + name.length + 1;
                    var _end = document.cookie.indexOf(";", _start);

                    if (_end == -1) { _end = document.cookie.length; }

                    return decodeURI(document.cookie.substring(_start, _end));
                }
            }

            return "";
        },
        SetPrefix: function (cookiePrefix) {
            /// <summary>设置Cookie前缀,设置后所有的Set和Get都会自动拼上这个前缀,主要解决cookie冲突问题</summary>
            /// <param name="cookiePrefix" type="String">Cookie前缀</param>

            Cg.Func.Cookie._CookiePrefix = Cmn.Func.Trim(cookiePrefix);
        },
        GetPrefix: function () {
            /// <summary>获取cookie前缀</summary>
            return Cg.Func.Cookie._CookiePrefix;
        }
    })


})(window);

//验证函数相关扩展
(function (window, undefined) {
    "use strict";

    var CmnRegularTest = function (str) {
        /// <summary>正则检测,用于cmn里面的正则检测</summary>
        /// <param name="str" type="String">被检测的字符串</param>
        /// <returns type="bool" />

        var _reg = new RegExp(this.Regular);
        return _reg.test(str);
    };

    Cg.Extend({
        NewCheckInfo: function (regular, errMsg, requiredErrMsg) {
            /// <summary>生成一个新的验证</summary>
            /// <param name="regular" type="String">正则</param>
            /// <param name="errMsg" type="String">错误信息</param>
            /// <param name="requiredErrMsg" type="String">必填错误信息</param>
            /// <returns type="json" />

            return { 'Regular': regular, 'ErrMsg': errMsg, 'RequiredErrMsg': requiredErrMsg };
        },
        //验证是否有效，用CheckInfo中的正则等，验证inputTxt是否合法
        CheckValid: function (checkInfo, inputTxt) {
            /// <summary>验证是否有效，用CheckInfo中的正则等，验证inputTxt是否合法</summary>
            /// <param name="checkInfo" type="json">正则表达式及错误信息等</param>
            /// <param name="inputTxt" type="String">被验证的内容</param>
            /// <returns type="String" />

            if (checkInfo.RequiredErrMsg && checkInfo.RequiredErrMsg != "") { //说明是必填项
                if (Cmn.Func.Trim(inputTxt) == "") { return checkInfo.RequiredErrMsg; }
            }

            var _reg = new RegExp(checkInfo.Regular.Regular);

            if (!_reg.test(inputTxt)) {
                if (checkInfo.ErrMsg && checkInfo.ErrMsg != "") { return checkInfo.ErrMsg; }
                else { return checkInfo.Regular.ErrMsg; }
            }

            return true;
        },
        //常用正则
        Regular: {
            Email: { Regular: "^\w+((-\w+)|(\.\w+))*\@\w+((\.|-)\w+)*\.\w+$", ErrMsg: "请输入正确的Email地址！", Test: CmnRegularTest },
            MobilePhone: { Regular: "^1[0-9]{10}$", ErrMsg: "请输入正确的手机号码！", Test: CmnRegularTest }
        },

        //通用验证方案 可以是正则可以是方法
        VerifyWay: {
            Tel: /\_d{3}-\d{8}|\d{4}-\d{7}/,                    //电话验证
            Phone: /^1\d{10}$/,                                 //手机号码验证
            IsInt: /^(-|\+)?\d+$/,                              //验证是否是整数
            DateTime: function (str) {                          //验证是否是时间类型
                var _result = str.match(/^(\d{4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/);
                if (_result == null) return false;
                var _d = new Date(_result[1], _result[3] - 1, _result[4], _result[5], _result[6], _result[7]);
                return (_d.getFullYear() == _result[1] &&
                    (_d.getMonth() + 1) == _result[3] &&
                    _d.getDate() == _result[4] &&
                    _d.getHours() == _result[5] &&
                    _d.getMinutes() == _result[6] &&
                    _d.getSeconds() == _result[7]);
            },
            Date: function (str) {                                 //验证日期
                var _result = str.match(/^(\d{4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
                if (_result == null) return false;
                var _d = new Date(_result[1], _result[3] - 1, _result[4]);
                return (_d.getFullYear() == _result[1] && _d.getMonth() + 1 == _result[3] && _d.getDate() == _result[4]);
            },
            Email: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,       //邮箱验证
            QQ: /[1-9][0-9]{4,}/,                               //验证qq号
            IdCard: /\d{15}|\d{18}/,                            //身份证
            NotEmpty: function (str) { if (!!str) { return true } return false; }                    //非空验证
        },
        //验证值的有效性
        VerifyValid: function (verifyWay, text) {
            /// <summary>验证值的有效性</summary>
            /// <param name="verifyWay" type="Function or Regular">验证的方法 可能是一个正则表达式 也可能是一个方法</param>
            /// <param name="text" type="string">需要验证的值</param>

            if (Cg.IsType(verifyWay, "string") && verifyWay != "") { verifyWay = this.VerifyWay[verifyWay]; }


            if (Cg.IsType(verifyWay, "regexp")) { return verifyWay.test(text); }

                //如果预设的是函数 则返回函数执行结果
            else if (Cg.IsType(verifyWay, "function")) {

                return verifyWay(text);
            }

            return false;
        }
        //,
        //FormVerify: function (containerSelector, valueItemSelector, submitBtnSelector, option) {
        //    /// <summary>验证表单里面的值的有效性</summary>
        //    /// <param name="containerSelector" type="String">表单容器</param>
        //    /// <param name="valueItemSelector" type="String">值选择器</param>
        //    /// <param name="submitBtnSelector" type="String">提交按钮选择器</param>
        //    /// <param name="option" type="json">配置json</param>

        //        //值列表项
        //    var _vlueItem = null;

        //    //如果是对象
        //    if (Cg.IsType(valueItemSelector, "object")) {  _vlueItem = valueItemSelector;  }
        //        //选择器的话
        //    else{
        //        _vlueItem = $(containerSelector).find(valueItemSelector);
        //    }

        //    var _option = $.extend({
        //        VerifyCfg: {},                  //验证配置
        //        BeforSubmit: function () { },   //提交之前
        //        OnInputChange: function () { }, //
        //        OnSubmit: function () { }
        //    }, option),

        //    //验证配置
        //     _verifyCfg = _option.VerifyCfg;

        //    function verifyValids() {
        //        /// <summary>遍历验证</summary>

        //        var _result = { State: true, param: {} };

        //        $.each(_vlueItem,function (index,item) {

        //            var _self = $(this),
        //                _filedName =item[index] || _self.attr("name"),
        //                _verify = !!item[index]?null:_self.attr("verify");

        //            if (Cg.IsType(_verify, "string")) {

        //                //检测函数内部是否有验证配置
        //                if (!!_verify) {
        //                    if (Cg.IsType(_verify, "string")) {
        //                        try {
        //                            _verifyCfg[_filedName] = $.parseJSON(_verify);
        //                        }
        //                        catch (e) {
        //                            _verifyCfg[_filedName] = eval("(" + _verify + ")");
        //                        }
        //                    }
        //                }

        //            }

        //            _verify = _verifyCfg[_filedName];

        //            //若存在验证的话
        //            if (!!_verify) {

        //                if (!Cg.VerifyValid(_verify.Way, _self.val())) {

        //                    //检测错误提示的选择器存在的话就显示
        //                    if (Cg.IsType(_verify.ErrTipSelector, "string") && _verify.ErrTipSelector != "") {
        //                        //隐藏正确的
        //                        $(containerSelector).find(_verify.CorrectTipSelector).hide();
        //                        $(containerSelector).find(_verify.ErrTipSelector).show();
        //                    }
        //                    else if (Cg.IsType(_verify.Tip, "string") && _verify.Tip != "") {
        //                        //默认提示框
        //                        Cg.alert(_verify.Tip);
        //                    }
        //                    _self.focus();
        //                    return _result.State = false;
        //                }


        //            }

        //            if (!!_filedName) {
        //                //生成参数列表
        //                _result.param[_filedName] = _self.val();
        //                //检测是否存在验证成功的显示元素的选择器 有的话显示该容器
        //                if (!!_verify && !!_verify.CorrectTipSelector) {
        //                    //隐藏错误的
        //                    $(containerSelector).find(_verify.ErrTipSelector).hide();
        //                    $(containerSelector).find(_verify.CorrectTipSelector).show();
        //                }
        //            }

        //        });

        //        return _result;
        //    }

        //    var _clickheadle = function () {
        //        /// <summary>点击事件句柄</summary>
        //        var _result = verifyValids();
        //        //提交之前触发事件 返回为false的话直接阻止提交
        //        if (_option.BeforSubmit(_result.param) === false) { return false; }

        //        //验证通过的行为
        //        if (_result.State) {
        //            //点击提交按钮并且验证通过的时候提交
        //            _option.OnSubmit(_result.param);
        //        }
        //    }
        //    //如果提交按钮是他本身的话
        //    if ($(".containerSelector").is(submitBtnSelector)) {
        //        $(containerSelector).off("click").on("click", _clickheadle);
        //    }
        //    else {
        //                $(containerSelector).undelegate(submitBtnSelector, "click").
        //         delegate(submitBtnSelector, "click", _clickheadle);
        //    }
        //},
        //GetParams: function (containerSelector, valueItemSelector) {
        //    /// <summary>获取参数</summary>

        //}
    });
})(window);

//动画相关处理
(function (window, undefined) {
    "use strict";

    var _RequestAnimateFrame = new function () {
        /// <summary>requestAnimateFrame</summary>

        this.callback = function () { };

        var _originalWebkitRequestAnimationFrame = undefined,
            //requestAnimationFrame 的包装对象
            _wrapper = undefined,
            //回调函数
            _callback = undefined,
            //gecko的版本
            _geckoVersion = 0,
            //浏览器代理信息
            _userAgent = navigator.userAgent,
           //指向当前对象
            _self = this;

        // Workaround for Chrome 10 bug where Chrome
        // does not pass the time to the animation function

        if (window.webkitRequestAnimationFrame) {
            // Define the wrapper

            _wrapper = function (time) {
                if (time === undefined) { time = + new Date(); }
                _self.callback(time);
            };

            // Make the switch

            _originalWebkitRequestAnimationFrame = window.webkitRequestAnimationFrame;

            window.webkitRequestAnimationFrame = function (_callback, element) {
                _self.callback = _callback;

                // Browser calls the wrapper and wrapper calls the callback

                _originalWebkitRequestAnimationFrame(_wrapper, element);
            }
        }

        // Workaround for Gecko 2.0, which has a bug in
        // mozRequestAnimationFrame() that restricts animations
        // to 30-40 fps.

        if (window.mozRequestAnimationFrame) {
            // Check the Gecko version. Gecko is used by browsers
            // other than Firefox. Gecko 2.0 corresponds to
            // Firefox 4.0.

            var _index = _userAgent.indexOf('rv:');

            if (_userAgent.indexOf('Gecko') != -1) {
                _geckoVersion = _userAgent.substr(_index + 3, 3);

                if (_geckoVersion === '2.0') {
                    // Forces the return statement to fall through
                    // to the setTimeout() function.
                    window.mozRequestAnimationFrame = undefined;
                }
            }
        }

        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||

            function (_callback, element) {
                //开始时间   结束时间
                var _start, _finish;

                window.setTimeout(function () {
                    _start = + new Date();
                    _callback(_start);
                    _finish = + new Date();
                    _self.timeout = 1000 / 60 - (_finish - _start);
                }, _self.timeout);
            };
    };


    var _CancelRequestAnimateFrame = window.cancelRequestAnimationFrame
                || window.webkitCancelAnimationFrame
                || window.webkitCancelRequestAnimationFrame
                || window.mozCancelRequestAnimationFrame
                || window.oCancelRequestAnimationFrame
                || window.msCancelRequestAnimationFrame
                || window.clearTimeout;

    Cg.Extend(Cg.Animate = {}, {
        //浏览器刷新率相关操作
        BrowserFrame: {
            RequestAnimateFrame: function (callback) { return _RequestAnimateFrame(callback); },
            CancelRequestAnimateFrame: function (id) { _CancelRequestAnimateFrame(id); }
        },
        //时间轴
        Timeline: {
            //时间轴事件管理
            TimelineEvent: null,
            //时间轴唯一标示
            TimelineOnlyKey: null,
            //事件句柄配置
            EventHeaderCfgList: {},
            //添加时间轴某个监听
            Add: function (eventHandle, interval) {
                /// <summary>添加时间轴某个监听</summary>
                /// <param name="eventHandle" type="function">时间轴事件句柄</param>
                /// <param name="fps" type="int">多少间隔触发一次</param>

                if (this.TimelineEvent == null) { this.TimelineEvent = new Cg.Event(this); }

                //生成每个时间轴监听句柄的唯一key
                var _eventHandleOnlyKey = "timeline_" + Cg.GetUUID();

                //添加到时间管理里面去
                this.TimelineEvent.Add(eventHandle, _eventHandleOnlyKey);

                //事件句柄列表
                eventHandle["__cg_eventHandleKey"] = _eventHandleOnlyKey;
                this.EventHeaderCfgList[_eventHandleOnlyKey] = {
                    Key: _eventHandleOnlyKey,
                    IsMonitor: true,
                    Then: Date.now(),
                    Interval: interval
                };

                if (this.TimelineOnlyKey == null) { this.Monitor(); }

                return this;
            },
            Monitor: function () {
                /// <summary>开启监听</summary>

                var _self = this,
                   _nowTime = null,
                   _delta = null;

                var _monitor = function () {
                    /// <summary>递归监听</summary>

                    //利用浏览器的ui进程
                    _self.TimelineOnlyKey = Cg.Animate.BrowserFrame.RequestAnimateFrame(_monitor);

                    //判断事件委托对象
                    if (_self.TimelineEvent != null) {

                        $.each(_self.EventHeaderCfgList, function () {
                            //指向当前事件句柄的配置
                            var _headerCfg = this;

                            //如果关闭了该事件句柄的监听的话
                            if (!_headerCfg.IsMonitor) { return; }

                            //事件句柄的时间间隔必须存在 不存在就表示不需要计算间隔
                            if (!!_headerCfg.Interval) {
                                //当前时间
                                _nowTime = Date.now();
                                //当前时间和事件上一次执行时间的时间差
                                _delta = _nowTime - _headerCfg.Then;
                                // 这里不能简单then=now，否则还会出现细微时间差问题。
                                //例如fps=10，每帧100ms，而现在每16ms（60fps）执行一次draw。16*7=112>100，
                                //需要7次才实际绘制一次。这个情况下，实际10帧需要112*10=1120ms>1000ms才绘制完成。
                                //执行的时间差大于间隔 才执行事件
                                if (_delta > _headerCfg.Interval) {
                                    _headerCfg.Then = _nowTime - (_delta % _headerCfg.Interval);
                                    //执行事件
                                    _self.TimelineEvent.Trigger(_headerCfg.Key);
                                }

                            }
                            else { _self.TimelineEvent.Trigger(_headerCfg.Key); }

                        });
                    }
                }

                Cg.Animate.BrowserFrame.RequestAnimateFrame(_monitor);
            },
            Close: function () {
                /// <summary>关闭监听</summary>
                Cg.Animate.BrowserFrame.CancelRequestAnimateFrame(this.TimelineOnlyKey);
            },
            Start: function (eventSignature) {
                /// <summary>开始某个时间轴的监听</summary>
                /// <param name="eventSignature" type="function">时间轴事件处理的函数签名</param>
                if (arguments.length > 0) {
                    this.EventHeaderCfgList[eventSignature["__cg_eventHandleKey"]].IsMonitor = true;
                }
                else {
                    $.each(this.EventHeaderCfgList, function () { this.IsMonitor = true; });
                };

                return this;
            },
            Stop: function (eventSignature) {
                /// <summary>停止某个时间轴</summary>
                /// <param name="eventSignature" type="function">时间轴事件处理的函数签名</param>
                if (arguments.length > 0) {
                    this.EventHeaderCfgList[eventSignature["__cg_eventHandleKey"]].IsMonitor = false;
                }
                else {
                    $.each(this.EventHeaderCfgList, function () { this.IsMonitor = false; });
                }
            },
            Remove: function (eventSignature) {
                /// <summary>删除时间轴某个监听</summary>
                /// <param name="eventSignature" type="function">时间轴事件处理的函数签名</param>
                if (this.TimelineEvent != null) {
                    //有参数的话
                    if (arguments.length > 0) {
                        //删除该句柄的事件绑定
                        this.TimelineEvent.Remove(eventSignature);
                        //删除时间轴配置
                        if (!!eventSignature["__cg_eventHandleKey"]) {
                            delete this.EventHeaderCfgList["__cg_eventHandleKey"];
                        }

                    }
                    else {
                        //全部删除
                        this.TimelineEvent.Remove();
                        this.EventHeaderCfgList = {};
                    }
                }
                return this;
            },
            RemoveAll: function () {
                /// <summary>删除所有监听</summary>
                this.Remove();
                return this;
            }
        }
    });

    Cmn.Am = Cmn.Animate;
})(window);

// new add errMsg class
Cg.ErrMsg = function (msg, errCode) {
    /// <summary>错误信息类</summary>
    /// <param name="msg" type="String">错误信息</param>
    /// <param name="errCode" type="String">错误代码</param>

    this.Msg = msg;
    //目前ErrMsg 是为了兼容成就代码 以及接口返回信息
    this.ErrMsg = msg;
    this.ErrCode = errCode;
};

//--------------------------------------------------------
//------------------未上线模式----------------------------

(function (cfc) {
    Cmn.PageLockPassWord = "0032";
    Cmn.PageIsLock = false;

    if (!$) { Cg.alert("请引用jquery!"); return; };
    if (cfc.Get("PageLockPwdInput") === Cmn.PageLockPassWord) { return; }

    var _$style = '<style>' +
        '.Cmn_AccessPwdPopWrap { z-index:99999; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #000; overflow: hidden; }' +
        '.Cmn_AccessPwdPopCon { position: absolute; top: 50%; width: 40%; left: 50%; transform: translate(-50%,-50%); -webkit-transform: translate(-50%,-50%); -moz-transform: translate(0,-50%); -ms-transform: translate(-50%,-50%); }' +
        '.Cmn_ShowNum, .Cmn_ShowNum input, .Cmn_AccessPwdNum, .Cmn_AccessPwdNumList, .cmn_Delete { font-size:25px; }' +
        '.Cmn_ShowNum { width: 90%; margin: auto; display: block; text-align: center; padding: 2% 0%; color: #fff; background: #494949; border-radius: 6px; position: relative; }' +
        '.Cmn_ShowNum input {    text-indent: 2%; width: 100%;height:100%; background: none; color: #fff; border:none;margin:0;}' +
        '.cmn_Delete { position: absolute; right:2%; top: 50%;cursor:pointer; -webkit-transform: translate(0,-50%); -o-transform: translate(0,-50%); -moz-transform: translate(0,-50%);transform: translate(0,-50%); }' +
        '.Cmn_AccessPwdNum { width: 100%; margin: auto;text-align:center; margin-top: 2%; border-radius: 6px; position: relative;  }' +
        '.Cmn_AccessPwdNumList { padding: 8% 10%;cursor:pointer; font-weight: bold; text-align: center; background: #2C2C2C; color: #DDDDDD; border-radius: 8px; display: inline-block; margin: 1%; min-width: 10px; }' +
        '.Cmn_AccessPwdNumList:hover { background: #4C3838; }' +
        '@media screen and (max-width:950px) {' +
        '.Cmn_ShowNum, .Cmn_ShowNum input, .cmn_Delete { font-size: 20px; }' +
        '.Cmn_AccessPwdPopCon { width: 90%; }' +
        '.Cmn_AccessPwdNumList { padding:3% 8%; }' +
        '}' +
        '@media all and (orientation : landscape) {' +
        '.Cmn_AccessPwdPopCon { width: 50%; }' +
        '.Cmn_AccessPwdNumList { padding: 5% 9%; }' +
        '}' +
        '</style>';

    var _$pageLockDom='<div class="Cmn_AccessPwdPopWrap">' +
                            '<div class="Cmn_AccessPwdPopCon">' +
                                ' <div class="Cmn_ShowNum">'+
                                           '<input type="tel" disabled="disabled" placeholder="请输入测试访问密码" maxlength="11" />'+
                                            '<div class="cmn_Delete">删除</div>'+
                                   '</div>'+
                                    '<div class="Cmn_AccessPwdNum">';
                                                for (var _i = 0; _i < 10; _i++) {
                                                    _$pageLockDom += '<div class="Cmn_AccessPwdNumList">'+_i+'</div>';
                                                };
                _$pageLockDom += '</div>' +
                            '</div>' +
                      '</div>';


    $(function () {

        if (Cmn.PageIsLock) {
            $("head").append(_$style);
            $("body").append(_$pageLockDom);
            //$(".Cmn_AccessPwdNum .Cmn_AccessPwdNumList").eq(10).text("删除");
            var _pwdInput = $(".Cmn_ShowNum input");
            $(".Cmn_AccessPwdNum .Cmn_AccessPwdNumList").on("touchstart", function () {
                //if ($(this).index(".Cmn_AccessPwdNumList") == 10) {
                //    if (_pwdInput.val().length > 0) {
                //        _pwdInput.val(_pwdInput.val().substring(0, _pwdInput.val().length - 1));
                //    }

                //} else {
                     _pwdInput.val(_pwdInput.val() + $(this).text());
                //}

                if (_pwdInput.val() == Cmn.PageLockPassWord) {
                    $(".Cmn_AccessPwdPopWrap").remove();
                }
            });

            $(".Cmn_ShowNum .cmn_Delete").on("touchstart", function () {
                    if (_pwdInput.val().length > 0) {
                        _pwdInput.val(_pwdInput.val().substring(0, _pwdInput.val().length - 1));
                    }
            });
        }

    });

})(Cmn.Func.Cookie);


//md5
(function ($) {
    var rotateLeft = function (lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    var addUnsigned = function (lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        if (lX4 | lY4) {
            if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }

    var F = function (x, y, z) {
        return (x & y) | ((~x) & z);
    }

    var G = function (x, y, z) {
        return (x & z) | (y & (~z));
    }

    var H = function (x, y, z) {
        return (x ^ y ^ z);
    }

    var I = function (x, y, z) {
        return (y ^ (x | (~z)));
    }

    var FF = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var GG = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var HH = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var II = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var convertToWordArray = function (string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWordsTempOne = lMessageLength + 8;
        var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
        var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };

    var wordToHex = function (lValue) {
        var WordToHexValue = "", WordToHexValueTemp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValueTemp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
        }
        return WordToHexValue;
    };

    var uTF8Encode = function (string) {
        string = string.replace(/\x0d\x0a/g, "\x0a");
        var output = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                output += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                output += String.fromCharCode((c >> 6) | 192);
                output += String.fromCharCode((c & 63) | 128);
            } else {
                output += String.fromCharCode((c >> 12) | 224);
                output += String.fromCharCode(((c >> 6) & 63) | 128);
                output += String.fromCharCode((c & 63) | 128);
            }
        }
        return output;
    };

    $.extend({
        md5: function (string) {
            var x = Array();
            var k, AA, BB, CC, DD, a, b, c, d;
            var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
            var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
            var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
            var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
            string = uTF8Encode(string);
            x = convertToWordArray(string);
            a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
            for (k = 0; k < x.length; k += 16) {
                AA = a; BB = b; CC = c; DD = d;
                a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
                d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
                c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
                b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
                a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
                d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
                c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
                b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
                a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
                d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
                c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
                b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
                a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
                d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
                c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
                b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
                a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
                d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
                c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
                b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
                a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
                d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
                c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
                b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
                a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
                d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
                c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
                b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
                a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
                d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
                c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
                b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
                a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
                d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
                c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
                b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
                a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
                d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
                c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
                b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
                a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
                d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
                c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
                b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
                a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
                d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
                c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
                b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
                a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
                d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
                c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
                b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
                a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
                d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
                c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
                b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
                a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
                d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
                c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
                b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
                a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
                d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
                c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
                b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
                a = addUnsigned(a, AA);
                b = addUnsigned(b, BB);
                c = addUnsigned(c, CC);
                d = addUnsigned(d, DD);
            }
            var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
            return tempValue.toLowerCase();
        }
    });
})($);
