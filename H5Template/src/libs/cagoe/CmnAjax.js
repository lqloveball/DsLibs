/// <reference path="Cmn.js"/>
/// <reference path="jquery.js"/>
/*
 * http://www.cagoe.com/
 * 本框架隶属于上海市加谷网络科技有限公司
 * Date: 2015-7-11 21:15
 */

Cmn.Version.CmnAjax = "2.4.0";

/// Version:2.1  几个填充函数都增加了beforFillDataEvent事件
/// Version:2.0  增加了跨域处理
//  Version:2.3.3 因为在Safari浏览器里面 post 请求会丢失链接里面的参数 所以将翻页参数直接扩展到参数

//检查CmnMis有没有定义，如果没有定义就定义下
if (typeof (CmnMis) == "undefined") { window.CmnMis = {}; }

var CmnAjax =Cmn.Ajax = {
    Cfg: {
        //请求代理url,目前主要用于Tmall
        ProxyUrl: "",
        //显示默认的Ajax加载提示，1：显示；0：不显示
        ShowDefaultAjaxHint: 0,
        //接口TokenKey
        ItfTokenKey: "ItfTokenKey",
        //接口验证配置列表
        ItfVerifyCfgList: {},
        //cookie前缀参数名
        CookiePrefixParamName: "Cg_CookiePrefix",
        //所有请求都加的参数
        ParamForAllRequest: null
    },
    //处理方法名，如果不是全路劲处理成全路劲
    MethodNameToUrl: function (methodName) {
        /// <summary>处理方法名，如果不是全路劲处理成全路劲</summary>
        /// <param name="methodName" type="String">方法名</param>
        /// <returns type="String" />

        if (methodName.indexOf("/") > -1) { return methodName; }

        var _curUrl = window.location.href;
        if (_curUrl.indexOf("?") > -1) { _curUrl = _curUrl.substring(0, _curUrl.indexOf("?")); }
        if (_curUrl.indexOf("#") > -1) { _curUrl = _curUrl.substring(0, _curUrl.indexOf("#")); }

        if (_curUrl[_curUrl.length - 1] == "/") { return _curUrl + methodName; } //最后是斜杠
        else { return _curUrl + "/" + methodName; }
    },
    //用Class填充单条数据
    FillDataByClass: function (containerSelector, methodName, param, successFunc, errorFunc, loadingSelector) {
        /// <summary>用Class填充单条数据</summary>
        /// <param name="containerSelector" type="String">控件容器选择器(和jquery的选择器一样，例如：.className或#controlID(如果是多条记录的话不能用id否则在二次填充的时候会多出记录)等)</param>
        /// <param name="methodName" type="String">函数名</param>
        /// <param name="param" type="String">调用webmethod的参数，例如：{id:'1',name:'name'}(可为空或不传)</param>
        /// <param name="successFunc" type="function">成功时调用的函数，参数为jason格式的数据例如：{"data":[{"id":"1","name":"chi"},{"id":"2","name":"chi2"}]} (可以不传)</param>
        /// <param name="errorFunc" type="function">错误时调用的函数 (可以不传)</param>
        /// <param name="loadingSelector" type="String">正在加载提示选择器(和jquery的选择器一样，例如：.className或#controlID等)</param>

        return CmnAjax.FillData(containerSelector, methodName, param, successFunc, errorFunc, loadingSelector);
    },
    //填充数据
    FillData: function (containerSelector, methodName, param, successFunc, errorFunc, loadingSelector, beforFillDataEvent) {
        /// <summary>填充数据</summary>
        /// <param name="containerSelector" type="String">控件容器选择器(和jquery的选择器一样，例如：.className或#controlID(如果是多条记录的话不能用id否则在二次填充的时候会多出记录)等)</param>
        /// <param name="methodName" type="String">WebMethod函数名</param>
        /// <param name="param" type="String">调用webmethod的参数，例如：{id:'1',name:'name'}(可为空或不传)</param>
        /// <param name="successFunc" type="function">成功时调用的函数，参数为jason格式的数据例如：{"data":[{"id":"1","name":"chi"},{"id":"2","name":"chi2"}]} (可以不传)</param>
        /// <param name="errorFunc" type="function">错误时调用的函数 (可以不传)</param>
        /// <param name="loadingSelector" type="String">正在加载提示选择器(和jquery的选择器一样，例如：.className或#controlID等)</param>
        /// <param name="beforFillDataEvent" type="function">填充数据之前触发的事件，接收参数data,可以改写填充数据</param>

        //填充空数据，目的把数据区块隐藏，用户就看不到占位符了
        Cmn.FillData(containerSelector, []);

        CmnAjax.ShowAjaxHandleHint(loadingSelector, containerSelector); //显示正在加载提示

        CmnAjax.PostData(methodName, param, function (data) {
            CmnAjax.HideAjaxHandleHint(loadingSelector); //隐藏正在加载提示

            if (beforFillDataEvent) { beforFillDataEvent(data.data); }
            Cmn.FillData(containerSelector, data.data);
            if (successFunc) { successFunc(data); } //如果有成功函数就调用

            return true;
        }, function () {
            CmnAjax.HideAjaxHandleHint(loadingSelector); //隐藏正在加载提示

            if (errorFunc) { errorFunc(); }

            return false;
        });
    },
    //存放DataPaging变量，翻页的时候用
    //DataPagingList: new Array(),
    //填充数据带翻页控件
    DataPaging: function (dataContainerSelector, methodName, param, pageContainerSelector, pageSize, successFunc, errorFunc,
        loadingSelector, curPageNo, beforFillDataEvent) {
        /// <summary>填充数据带翻页控件</summary>
        /// <param name="dataContainerSelector" type="String">控件容器选择器(和jquery的选择器一样，例如：.className或#controlID(如果是多条记录的话不能用id否则在二次填充的时候会多出记录)等)</param>
        /// <param name="methodName" type="String">后台WebMethod名，也可以是全路径</param>
        /// <param name="param" type="String">调用webmethod的参数，例如：{id:'1',name:'name'}(可为空或不传)  </param>
        /// <param name="pageContainerSelector" type="String">翻页控件容器选择器(和jquery的选择器一样，例如：.className或#controlID等)</param>
        /// <param name="pageSize" type="int">每页显示的记录条数</param>
        /// <param name="successFunc" type="function">成功时调用的函数，参数为jason格式的数据例如：{"data":[{"id":"1","name":"chi"},{"id":"2","name":"chi2"}]} (可以不传)</param>
        /// <param name="errorFunc" type="function">错误时调用的函数 (可以不传)</param>
        /// <param name="loadingSelector" type="String">正在加载提示选择器(和jquery的选择器一样，例如：.className或#controlID等)</param>
        /// <param name="curPageNo" type="int">当前页为第几页</param>
        /// <param name="beforFillDataEvent" type="function">填充数据之前触发的事件，接收参数data,可以改写填充数据</param>
        /// <field name="Paging" type="Cmn.Paging">翻页控件</field>

        this.EventBeforePaging = null; //在翻页之前触发事件

        //填充空数据，目的把数据区块隐藏，用户就看不到占位符了
        Cmn.FillData(dataContainerSelector, []);

        if (!curPageNo) { curPageNo = 1; }

        methodName = CmnAjax.MethodNameToUrl(methodName);

        //CmnAjax.DataPagingList[CmnAjax.DataPagingList.length] = this;
        var _Self = this;
        //var _dataPagingVarName = "CmnAjax.DataPagingList[" + (CmnAjax.DataPagingList.length - 1) + "]";

        function PagingFunction(pageNo) {
            //触发翻页前事件
            //eval("if(" + _dataPagingVarName + ".EventBeforePaging!=null) { " + _dataPagingVarName + ".EventBeforePaging(); }");
            if (_Self.EventBeforePaging != null) { _Self.EventBeforePaging(); }

            //methodName = Cmn.Func.AddParamToUrl(methodName, "CurPage=" + pageNo);
            //methodName = Cmn.Func.AddParamToUrl(methodName, "PageSize=" + pageSize);

            CmnAjax.ShowAjaxHandleHint(loadingSelector, dataContainerSelector); //显示正在加载提示

            //2017-3-13 因为在Safari浏览器里面 post 请求会丢失链接里面的参数 所以将翻页参数直接扩展到参数
            if (!param) { param = {}; };
            param["CurPage"] = pageNo;
            param["PageSize"] = pageSize;
            CmnAjax.PostData(methodName, param, function (data) {
                CmnAjax.HideAjaxHandleHint(loadingSelector); //隐藏正在加载提示

                if (beforFillDataEvent) {
                    //填充之前如果返回false的话就不填充
                    if (beforFillDataEvent(data.data) === false) { return false;}
                }
                //填充
                Cmn.FillData(dataContainerSelector, data.data);

                if (successFunc) { successFunc(data); }

                return true;
            }, function (httpRequest) {
                CmnAjax.HideAjaxHandleHint(loadingSelector); //隐藏正在加载提示

                if (errorFunc) { errorFunc(httpRequest); }

                Cmn.Log("DataPaging填充数据时Ajax报错！dataContainerSelector:" + dataContainerSelector + " methodName:" + methodName +
                    " param:" + param + " 错误详细信息：" + httpRequest.responseText);
                return false;
            });
        }

        this.Paging = new Cmn.Paging(pageContainerSelector, 0, pageSize, PagingFunction);


        //刷新数据和翻页控件
        this.Refresh = function (paging) {
            /// <summary>刷新数据和翻页控件</summary>

            //methodName = Cmn.Func.AddParamToUrl(methodName, "CurPage=" + curPageNo);
            //methodName = Cmn.Func.AddParamToUrl(methodName, "PageSize=" + pageSize);

            CmnAjax.ShowAjaxHandleHint(loadingSelector, dataContainerSelector); //显示正在加载提示

            //2017-3-13 因为在Safari浏览器里面 post 请求会丢失链接里面的参数 所以将翻页参数直接扩展到参数
            if (!param) { param = {}; };
            param["CurPage"] = curPageNo;
            param["PageSize"] = pageSize;
            CmnAjax.PostData(methodName, param, function (data) {
                CmnAjax.HideAjaxHandleHint(loadingSelector); //隐藏正在加载提示

                //eval(_dataPagingVarName + ".Paging.RecCount=" + data.RecCount + ";");

                if (data.RecCount) { _Self.Paging.RecCount = parseInt(data.RecCount); }
                else { _Self.Paging.RecCount = 0; }

                //eval(_dataPagingVarName + ".Paging.ToPage(" + curPageNo + ",false);");
                _Self.Paging.ToPage(curPageNo,false);

                if (beforFillDataEvent) { beforFillDataEvent(data.data); }
                Cmn.FillData(dataContainerSelector, data.data);
                if (successFunc) { successFunc(data); }

                return true;
            }, function (httpRequest) {
                CmnAjax.HideAjaxHandleHint(loadingSelector); //隐藏正在加载提示

                if (errorFunc) { errorFunc(httpRequest); }

                Cmn.Log("DataPaging填充数据时Ajax报错！dataContainerSelector:" + dataContainerSelector + " methodName:" + methodName +
                    " param:" + param + "  错误详细信息：" + httpRequest.responseText);
                return false;
            });
        }

        this.Refresh(this.Paging);
    },
    //存放图片分布加载PicStepLoad对象，
    //PicStepLoadList: new Array(),
    //图片分步加载
    DataStepLoad: function (dataContainerSelector, methodName, param, pageContainerSelector, pageSize, blockSize, successFunc,
        errorFunc,loadingSelector,beforFillDataEvent) {
        /// <summary>图片分步加载</summary>
        /// <param name="dataContainerSelector" type="String">控件容器选择器(和jquery的选择器一样，例如：.className或#controlID(如果是多条记录的话不能用id否则在二次填充的时候会多出记录)等)</param>
        /// <param name="methodName" type="String">后台WebMethod名，也可以是全路径</param>
        /// <param name="param" type="String">调用webmethod的参数，例如：{id:'1',name:'name'}(可为空或不传)</param>
        /// <param name="pageContainerSelector" type="String">翻页控件容器选择器(和jquery的选择器一样，例如：.className或#controlID等)</param>
        /// <param name="pageSize" type="int">每页显示的记录条数</param>
        /// <param name="blockSize" type="int">每块加载的记录条数</param>
        /// <param name="successFunc" type="function">成功时调用的函数，参数为jason格式的数据例如：{"data":[{"id":"1","name":"chi"},{"id":"2","name":"chi2"}]} (可以不传)</param>
        /// <param name="errorFunc" type="function">错误时调用的函数 (可以不传)</param>
        /// <param name="loadingSelector" type="String">正在加载提示选择器(和jquery的选择器一样，例如：.className或#controlID等)</param>
        /// <param name="beforFillDataEvent" type="function">填充数据之前触发的事件，接收参数data,可以改写填充数据</param>

        /*********************************************************
         * 2014-04-16 黄启 添加属性： ScrollContainerSelector  LoadingSensitivity
         * 2014-04-16 黄启 重写 ScrollHandle方法
        **********************************************************/

        this.CurrBlockNo = 0; //当前的块号
        this.IsNewPage = true; //是否是一个新页
        this.IsAddingBlock = false; //是否正在加载块
        this.RecCount = 100; //记录条数
        this.Destroyed = false; //是否已经删除了
        this.ScrollContainerSelector = ""; //需要监听scroll 的容器选择器 默认为window
        this.LoadingSensitivity = 50;       //图片加载的灵敏度 越大越灵敏

        //填充空数据，目的把数据区块隐藏，用户就看不到占位符了
        Cmn.FillData(dataContainerSelector, []);

        methodName = CmnAjax.MethodNameToUrl(methodName);

        //CmnAjax.PicStepLoadList[CmnAjax.PicStepLoadList.length] = this;
        //var _picStepLoadListVarName = "CmnAjax.PicStepLoadList[" + (CmnAjax.PicStepLoadList.length - 1) + "]";
        var _Self = this;

        //获取一个选择器，主要用于找到他的parent
        var _dataContainerSelectorOne = dataContainerSelector;
        if (Cmn.Func.IsArray(dataContainerSelector)) { _dataContainerSelectorOne = dataContainerSelector[0]; }

        //增加一块函数
        this.AddBlock = function () {
            if (this.Destroyed == true) { console.log("已经删除(刚进入AddBlock)"); return true; }

            if (this.IsAddingBlock) { return; } //如果正在加载，就直接退出，防止重入
            else { this.IsAddingBlock = true; }

            if (this.CurrBlockNo!=0 && this.CurrBlockNo % (pageSize / blockSize) == 0 &&
                this.IsNewPage == false) { this.IsAddingBlock = false;  return; } //当前页块已经加完，不能再加载

            //如果所有的记录已经加载完就不加载了
            if (this.CurrBlockNo >= parseInt((this.RecCount + blockSize - 1) / blockSize)) { this.IsAddingBlock = false; return; }

            //methodName = Cmn.Func.AddParamToUrl(methodName, "CurPage=" + (this.CurrBlockNo+1));
            //methodName = Cmn.Func.AddParamToUrl(methodName, "PageSize=" + blockSize);

            var _isNewPage = this.IsNewPage;

            CmnAjax.ShowAjaxHandleHint(loadingSelector, _dataContainerSelectorOne); //显示正在加载提示

            //2017-3-13 因为在Safari浏览器里面 post 请求会丢失链接里面的参数 所以将翻页参数直接扩展到参数
            if (!param) { param = {}; };
            param["CurPage"] = (this.CurrBlockNo + 1);
            param["PageSize"] = blockSize;

            CmnAjax.PostData(methodName, param, function (data) {
                CmnAjax.HideAjaxHandleHint(loadingSelector);  //隐藏正在加载

                //if (eval("(" + _picStepLoadListVarName + ".Destroyed)") == true) { console.log("已经删除"); return true; }
                if (_Self.Destroyed == true) { console.log("已经删除"); return true; }

                if (beforFillDataEvent) { beforFillDataEvent(data.data); } //触发填充前事件

                Cmn.FillData(dataContainerSelector, data.data, _isNewPage ? false : true, true);
                if (successFunc) { successFunc(data); }

                //eval(_picStepLoadListVarName + ".CurrBlockNo++;" +
                //    _picStepLoadListVarName + ".IsNewPage=false;" +
                //    _picStepLoadListVarName + ".IsAddingBlock=false;" +
                //    _picStepLoadListVarName + ".RecCount=" + data.RecCount + ";");
                _Self.CurrBlockNo++;
                _Self.IsNewPage = false;
                _Self.IsAddingBlock = false;
                _Self.RecCount = parseInt(data.RecCount);


                return true;
            }, function (httpRequest) {
                CmnAjax.HideAjaxHandleHint(loadingSelector);  //隐藏正在加载

                if (errorFunc) { errorFunc(httpRequest); }

                Cmn.Log("PicStepLoad填充数据时Ajax报错！dataContainerSelector:" + dataContainerSelector + " methodName:" + methodName +
                    " param:" + param + " 错误详细信息：" + httpRequest.responseText);
                return false;
            });
        }

        //滚动条事件处理
        //绑定滚动条加载数据
        this.BindScrollLoadData = function (containerSelector, sensitivity) {
            /// <summary>绑定滚动条事件</summary>
            /// <param name="containerSelector" type="String">内容容器选择器</param>
            /// <param name="sensitivity" type="String">加载内容的灵敏度（默认50）</param>

            if (containerSelector) { this.ScrollContainerSelector = containerSelector; }
            if (sensitivity) { this.LoadingSensitivity = sensitivity; }

            var _scrollHeight = 0;  //滚动条的总高度
            var _sensitivity = this.LoadingSensitivity;  //临时存储灵敏度
            var _$scrollContainer = $("body");          //默认监听window的scroll

            //判断是否传进来scroll容器选择器
            if (this.ScrollContainerSelector != "") {
                _$scrollContainer = $(this.ScrollContainerSelector);
                _scrollHeight = _$scrollContainer[0].scrollHeight;
            }
            else {  _scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight; }

            function _scrollHeader() {
                if (_Self.ScrollContainerSelector != "") { _scrollHeight = _$scrollContainer[0].scrollHeight; }
                else { _scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight; }

                var _height = _$scrollContainer[0].clientHeight || _$scrollContainer.height();

                if (_$scrollContainer.scrollTop() + _height + _sensitivity >= _scrollHeight) {
                    //eval(_picStepLoadListVarName + ".AddBlock();");
                    _Self.AddBlock();
                }
            };

            //绑定scroll事件
            if (Cmn.IsType(_$scrollContainer[0], "htmlbodyelement") ||
                Cmn.IsType(_$scrollContainer[0], "htmldocument")) {
                $(window).off("scroll").on("scroll", _scrollHeader);
            }
            else { _$scrollContainer.off("scroll").on("scroll", _scrollHeader); }

            return {
                Destroy: function () {  _$scrollContainer.off("scroll", _scrollHeader); }
            }
        };

        //bangding
        this.BindScrollLoadData();
        //解除所有绑定(在多次绑定的时候防止重复触发一些事件)
        this.Destroy = function () {
            if (Cmn.Func.IsArray(dataContainerSelector)) {
                for (var _i = 0; _i < dataContainerSelector.length; _i++) {
                    $(dataContainerSelector[_i]).siblings().html("");
                }
            }
            else { $(dataContainerSelector).siblings().html(""); }

            this.BindScrollLoadData().Destroy();
            this.Destroyed = true;
        }

        //判断是否有翻页控件
        if (pageContainerSelector == null || typeof(pageContainerSelector) == "undefind" || pageContainerSelector == "") {
            this.AddBlock();
            return;
        }





        //翻页触发函数
        var PagingFunction = function(pageNo) {
            //eval(_picStepLoadListVarName + ".CurrBlockNo=" + ((pageNo - 1) * pageSize / blockSize) + ";" +
            //     _picStepLoadListVarName + ".IsNewPage=true;" +
            //     _picStepLoadListVarName + ".IsAddingBlock=false;"+
            //     _picStepLoadListVarName + ".AddBlock();");

            _Self.CurrBlockNo = ((pageNo - 1) * pageSize / blockSize);
            _Self.IsNewPage = true;
            _Self.IsAddingBlock = false;
            _Self.AddBlock();
        }

        this.Paging = new Cmn.Paging(pageContainerSelector, 0, pageSize, PagingFunction);


        //刷新数据和翻页控件
        this.Refresh = function () {
            //eval(_picStepLoadListVarName + ".AddBlock();");
            _Self.AddBlock();

            //methodName = Cmn.Func.AddParamToUrl(methodName, "CurPage=1");
            //methodName = Cmn.Func.AddParamToUrl(methodName, "PageSize=" + pageSize);
            //2017-3-13 因为在Safari浏览器里面 post 请求会丢失链接里面的参数 所以将翻页参数直接扩展到参数
            if (!param) { param = {}; };
            param["CurPage"] = 1;
            param["PageSize"] = pageSize;
            CmnAjax.PostData(methodName, param, function (data) {
                //eval(_picStepLoadListVarName + ".Paging.RecCount=" + data.RecCount + ";");
                _Self.Paging.RecCount = parseInt(data.RecCount);
                //eval(_picStepLoadListVarName + ".Paging.ToPage(1,false);");
                _Self.Paging.ToPage(1,false);

                return true;
            }, function (httpRequest) {
                if (errorFunc) { errorFunc(httpRequest); }
                Cmn.Log("picStepLoad填充数据时Ajax报错！dataContainerSelector:" + dataContainerSelector + " methodName:" + methodName +
                    " param:" + param + "  错误详细信息：" + httpRequest.responseText);
                return false;
            });
        }

        this.Refresh();
    },
    //提交数据
    SubmitData: function (containerSelector, methodName, param, checkRegular, errDispSelector, submitingHintSelector,
        successFunc, errorFunc) {
        /// <summary>提交数据</summary>
        /// <param name="containerSelector" type="String">控件容器选择器(和jquery的选择器一样，例如：.className或#controlID等)</param>
        /// <param name="methodName" type="String">服务器端Webmethod名，也可以是全路径</param>
        /// <param name="param" type="String">调用webmethod的参数，例如：{id:'1',name:'name'}(可为空或不传)</param>
        /// <param name="checkRegular" type="Array">验证正则</param>
        /// <param name="errDispSelector" type="String">错误显示容器选择器</param>
        /// <param name="submitingHintSelector" type="String">正在提交提示选择器(和jquery的选择器一样，例如：.className或#controlID等)</param>
        /// <param name="successFunc" type="function">成功时调用的函数，参数为jason格式的数据例如：{"data":[{"id":"1","name":"chi"},{"id":"2","name":"chi2"}]} (可以不传)</param>
        /// <param name="errorFunc" type="function">错误时调用的函数 (可以不传)</param>

        var _data = "";
        var _errMsg = "";
        var _radioLst = new Array(); //存放radio的name列表


        methodName = CmnAjax.MethodNameToUrl(methodName);

        //获取容器中的input中的数据
        $(containerSelector).find("input[id][type!='button'][id!='__VIEWSTATE']").add(containerSelector + " textarea").add(containerSelector + " select").each(function () {
            var _name = $(this).attr("id").toString();

            if (_name != null && _name != undefined && _name.length > 3) {
                _name = _name.substring(3);

                if ($(this).attr("type") == "checkbox") { //是checkbox
                    if ($(this).attr("checked")) { _value = "1"; }
                    else { _value = "0"; }
                }
                else if ($(this).attr("type") == "radio") { //是radio
                    var _isExists = false;
                    var _tmpName = $(this).attr("name");

                    if (_tmpName.length <= 3) { return; }

                    for (var _i = 0; _i < _radioLst.length; _i++) {
                        if (_radioLst[_i] == _tmpName) { _isExists = true; break; }
                    }

                    if (!_isExists) { _radioLst.push(_tmpName); }

                    return;
                }
                else { _value = $(this).val(); }

                //查看有没有Check如果有需要check
                if (checkRegular != null && checkRegular != undefined) {
                    if (checkRegular[_name] != null && checkRegular[_name] != undefined) {
                        var _checkRet = Cmn.CheckValid(checkRegular[_name], _value);

                        if (_checkRet != true) { //错误
                            _errMsg += _checkRet;

                            return false;
                        }

                        //var _reg = new RegExp(checkRegular[_name].Regular);

                        //if (!_reg.test(_value)) { alert(checkRegular[_name].ErrMsg); return false; }
                    }
                }

                if (_data.length > 1) { _data += ","; }
                _data += "'" + _name + "':'" + Cmn.Func.FormatJsonData(_value) + "'";
            }
        });

        //如果没有错误，把错误显示框清空
        if (_errMsg != "") {
            if (errDispSelector) { $(errDispSelector).html(_errMsg); }
            else { alert(_errMsg); }

            return false;
        }
        else { if (errDispSelector) { $(errDispSelector).html(""); } }

        //加radio的值
        for (var _i = 0; _i < _radioLst.length; _i++) {
            //如果没有选中的话，返回空字符串
            var _tmpDom = $("input[name='" + _radioLst[_i] + "']:checked");
            var _tmpValue = "";

            if (_tmpDom.length > 0) { _tmpValue = _tmpDom.val(); }

            if (_data.length > 1) { _data += ","; }
            _data += "'" + _radioLst[_i].substring(3) + "':'" + _tmpValue + "'";
        }

        if (_data == "") { return false; }

        //在data中加入param
        if (!Cmn.Func.IsString(param)) { param = Cmn.Func.JsonToStr(param); }

        if (param && param != "") {
            param = Cmn.Func.Trim(param);
            param = param.substring(1);
            param = param.substring(0, param.length - 1);

            if (param != "") { _data = _data + "," + param; }
        }

        var _retText = "";
        methodName = CmnAjax.Func.GetProxyUrl(methodName);
        var _isWebMethod = Cmn.Func.IsWebMethod(methodName);
        var _execComplete = false; //是否已经执行完成


        //处理参数
        var _tmpData = "{" + _data + "}";
        if (!_isWebMethod) {
            try{ _tmpData = eval("({" + _data + "})"); }
            catch (err) { Cmn.alert("输入的内容可能存在问题！错误信息："+err.message); }
        }

        CmnAjax.ShowAjaxHandleHint(submitingHintSelector); //显示正在提交提示

        _retText = CmnAjax.GetData(methodName, _tmpData, submitingHintSelector,successFunc,errorFunc);

        //$.ajax({type: "Post", url:methodName, dataType: "text",
        //    contentType: (_isWebMethod ? "application/json;charset=uft-8" : "application/x-www-form-urlencoded"),
        //    data: _tmpData, async: false,
        //    success: function (retData) {
        //        CmnAjax.HideAjaxHandleHint(submitingHintSelector); //隐藏正在提交提示

        //        try { _retText = eval("(" + retData + ")").d; if (!_retText) { _retText = eval("(" + retData + ")"); } } //是json
        //        catch (err) { _retText = retData; } //不是json

        //        _execComplete = true;

        //        if (successFunc) { successFunc(_retText); }
        //    },
        //    error: function (httpRequest) {
        //        CmnAjax.HideAjaxHandleHint(submitingHintSelector); //隐藏正在提交提示

        //        _execComplete = true;

        //        if (errorFunc) { errorFunc(); }

        //        Cmn.Log("GetData！ methodName:" + methodName +
        //            " param:" + param + "  错误详细信息：" + httpRequest.responseText);
        //    }
        //});

        //for (; ;) { if (_execComplete) { break; } } //等待ajax执行完成

        return _retText;
    },
    //获取远程数据(阻塞方式)
    GetData: function (methodName, param, getingHintSelector,successFunc,errorFunc) {
        /// <summary>获取远程数据(阻塞方式)</summary>
        /// <param name="methodName" type="String">服务器端Webmethod名，也可以是全路径</param>
        /// <param name="param" type="String">调用webmethod的参数，例如：{id:'1',name:'name'}(可为空或不传)</param>
        /// <param name="getingHintSelector" type="String">正在获取数据提示选择器(和jquery的选择器一样，例如：.className或#controlID等)</param>
        /// <param name="successFunc" type="function">成功回调函数</param>
        /// <param name="errorFunc" type="function">错误回调函数</param>
        /// <returns type="String" />

        //确保参数是json
        if (param == undefined) { param = {}; }
        else {
            //处理参数是以字符串的形式传进来的
            if (Cmn.Func.IsString(param)) { //参数是字符串
                if (param == "") { param = "{}"; }
                try { param = eval("(" + param + ")"); } catch (e) { param = {}; }
            }
        }

        //处理cookie前缀
        if (Cmn.Func.Cookie.GetPrefix() != "") {
            param[CmnAjax.Cfg.CookiePrefixParamName] = Cmn.Func.Cookie.GetPrefix();
        }

        //添加所有请求需要添加的参数
        if (CmnAjax.Cfg.ParamForAllRequest) { $.extend(param,CmnAjax.Cfg.ParamForAllRequest); }

        param = CmnAjax.Func.AddSignature(methodName, param);

        var _methodName = CmnAjax.MethodNameToUrl(methodName);
        _methodName = CmnAjax.Func.GetProxyUrl(_methodName);

        var _isWebMethod = Cmn.Func.IsWebMethod(_methodName);
        var _retText = "";
        var _hasExecComplete = false; //是否已经执行完成

        ////参数处理
        //var _paramJson = null; //参数的json对象

        //if (param != undefined) {
        //    if (Cmn.Func.IsString(param)) { //参数是字符串
        //        if (param == "") { param = "{}"; }

        //        if (_isWebMethod == false) { param = eval("(" + param + ")"); _paramJson = param; } //不是WebMethod的话，需要转成对象
        //        else { _paramJson = eval("(" + param + ")"); }
        //    }
        //    else { //是json对象
        //        _paramJson = param;
        //        if (_isWebMethod) { param = Cmn.Func.JsonToStr(param); }
        //    }
        //}

        if (_isWebMethod) { param = Cmn.Func.JsonToStr(param); }

        CmnAjax.ShowAjaxHandleHint(getingHintSelector); //显示正在获取数据提示

        var _dataType = "text";

        //if (Cmn.Func.IsSameMainDomain(methodName) === false) { //不同域，需要跨域
        //    _dataType = "jsonp";
        //}

        $.ajax({
            type: "Post", "url": _methodName, dataType: _dataType,
            jsonp:"callback",
            contentType: (_isWebMethod ? "application/json;charset=uft-8" : "application/x-www-form-urlencoded"),
            data: param, async: false,
            success: function (retData) {
                CmnAjax.HideAjaxHandleHint(getingHintSelector); //隐藏正在获取数据提示

                if (_isWebMethod) {
                    _retText = eval("(" + retData + ")").d;

                    if (_retText == null) { _retText = ""; }
                    else {
                        try { _retText = eval("(" + _retText + ")"); } catch (er) { }
                    }
                }
                else {
                    try { _retText = eval("(" + retData + ")"); } catch (err) { _retText = retData; }
                }

                //处理接口验证
                if (CmnAjax.Func.IsNeedGetCgTk(methodName,_retText)) {
                    CmnAjax.GetData(Cmn.Func.AddParamToUrl(CmnAjax.Func.GetStdItfUrl(methodName), "method=GetCgTk"), {}, "", function (data) {
                        if (data["IsSuccess"] == "1" && data["CgTk"] && data["CgTk"] != "") {
                            CmnAjax.Func.SetItfToken(methodName, data["CgTk"], data["Time"], data["Milliseconds"]);
                            _retText = CmnAjax.GetData(methodName, param, getingHintSelector, successFunc, errorFunc);
                        }
                    }, errorFunc);
                }
                else if (_retText && _retText["ItfVerifyErrorNo"] && _retText["ItfVerifyErrorNo"] == "3") {
                    //走到这里可能是第一次调接口的时候是还没有token, 但在IsNeedGetCgTk的时候已经有了
                    _retText = CmnAjax.GetData(methodName, param, getingHintSelector, successFunc, errorFunc);
                }

                if (successFunc) { successFunc(_retText); } //如果有成功函数就调用

                _hasExecComplete = true;
            },
            error: function (httpRequest) {
                _hasExecComplete = true;
                CmnAjax.HideAjaxHandleHint(getingHintSelector); //隐藏正在获取数据提示

                Cmn.Log("GetData！ methodName:" + _methodName +
                    " param:" + Cmn.Func.JsonToStr(param) + "  错误详细信息：" + httpRequest.responseText);

                if (errorFunc) { errorFunc(httpRequest); }
            }
        });

        //for (; ;) { if (_hasExecComplete) { break; } } //等待ajax执行完成

        return _retText;
    },
    //发送数据(非阻塞方式)
    PostData: function (methodName, param, successFunc, errorFunc,loadingSelector) {
        /// <summary>发送数据(非阻塞方式)</summary>
        /// <param name="methodName" type="String">WebMethod函数名</param>
        /// <param name="param" type="String">调用webmethod的参数(字符串)，例如："{id:'1',name:'name'}"(可为空或不传)</param>
        /// <param name="successFunc" type="String">成功时调用的函数，参数为jason格式的数据例如：{"data":[{"id":"1","name":"chi"},{"id":"2","name":"chi2"}]} (可以不传)</param>
        /// <param name="errorFunc" type="String">错误时调用的函数 (可以不传)</param>
        /// <param name="loadingSelector" type="String">正在加载提示选择器(和jquery的选择器一样，例如：.className或#controlID等)</param>

        //确保参数是json
        if (param == undefined) { param = {}; }
        else {
            //处理参数是以字符串的形式传进来的
            if (Cmn.Func.IsString(param)) { //参数是字符串
                if (param == "") { param = "{}"; }
                try { param = eval("(" + param + ")"); } catch (e) { param = {}; }
            }
        }


        //处理cookie前缀
        if (Cmn.Func.Cookie.GetPrefix() != "") {
            param[CmnAjax.Cfg.CookiePrefixParamName] = Cmn.Func.Cookie.GetPrefix();
        }

        //添加所有请求需要添加的参数
        if (CmnAjax.Cfg.ParamForAllRequest) { $.extend(param, CmnAjax.Cfg.ParamForAllRequest); }

        param = CmnAjax.Func.AddSignature(methodName, param);

        var _methodName = CmnAjax.MethodNameToUrl(methodName);
        _methodName = CmnAjax.Func.GetProxyUrl(_methodName); //如果有代理加代理

        var _isWebMethod = Cmn.Func.IsWebMethod(_methodName);

        ////参数处理
        //var _paramJson = null; //参数的json对象

        //if (param != undefined) {
        //    if (Cmn.Func.IsString(param)) { //参数是字符串
        //        if (param == "") { param = "{}"; }

        //        if (_isWebMethod == false) { param = eval("(" + param + ")"); _paramJson = param; } //不是WebMethod的话，需要转成对象
        //        else { _paramJson = eval("(" + param + ")"); }
        //    }
        //    else { //是json对象
        //        _paramJson = param;
        //        if (_isWebMethod) { param = Cmn.Func.JsonToStr(param); }
        //    }
        //}

        if (_isWebMethod) { param = Cmn.Func.JsonToStr(param); }

        CmnAjax.ShowAjaxHandleHint(loadingSelector); //显示正在获取数据提示

        var _dataType = "text";

        if (Cmn.Func.IsSameMainDomain(_methodName) === false) { //不同域，需要跨域
            _dataType = "jsonp";
        }

        $.ajax({
            type: "Post",
            jsonp: "callback",
            url: _methodName,
            data: param,
            contentType: (_isWebMethod ? "application/json;charset=uft-8" : "application/x-www-form-urlencoded"),
            dataType: _dataType,
            success: function (retData) {
                CmnAjax.HideAjaxHandleHint(loadingSelector); //隐藏正在获取数据提示

                var _retVal = "";

                if (_isWebMethod) {
                    _retVal = eval("(" + retData + ")").d;

                    if (_retVal == null) { _retVal = ""; }
                    else {
                        try { _retVal = eval("(" + _retVal + ")"); }  catch (er) { }
                    }
                }
                else {
                    try { _retVal = eval("(" + retData + ")"); }
                    catch (err) { _retVal = retData; }
                }


                //处理接口验证
                if (CmnAjax.Func.IsNeedGetCgTk(methodName, _retVal)) {
                    CmnAjax.PostData(Cmn.Func.AddParamToUrl(CmnAjax.Func.GetStdItfUrl(methodName), "method=GetCgTk"), {}, function (data) {
                        if (data["IsSuccess"] == "1" && data["CgTk"] && data["CgTk"] != "") {
                            CmnAjax.Func.SetItfToken(methodName, data["CgTk"], data["Time"], data["Milliseconds"]);
                            CmnAjax.PostData(methodName, param, successFunc, errorFunc, loadingSelector);
                        }
                        else { if (successFunc) { successFunc(_retVal); } }
                    }, errorFunc);
                }
                else if (_retVal && _retVal["ItfVerifyErrorNo"] && _retVal["ItfVerifyErrorNo"] == "3") {
                    //走到这里可能是第一次调接口的时候是还没有token, 但在IsNeedGetCgTk的时候已经有了
                    CmnAjax.PostData(methodName, param, successFunc, errorFunc, loadingSelector);
                }
                else { if (successFunc) { successFunc(_retVal); } } //如果有成功函数就调用

                return true;
            },
            error: function (httpRequest) {
                CmnAjax.HideAjaxHandleHint(loadingSelector); //隐藏正在获取数据提示

                if (errorFunc) { errorFunc(httpRequest); }
                Cmn.Log("PostData填充数据时Ajax报错！ methodName:" + _methodName +
                    " param:" + Cmn.Func.JsonToStr(param) + "  错误详细信息：" + httpRequest.responseText);

                return false;
            }
        });
    },
    //获取远程文件
    GetFile: function (fileUrl, successFunc, errorFunc,isBlock) {
        /// <summary>获取远程文件，返回文件内容</summary>
        /// <param name="fileUrl" type="String">远程文件的url</param>
        /// <param name="successFunc" type="function">成功回调函数</param>
        /// <param name="errorFunc" type="function">失败回调函数</param>
        /// <param name="isBlock" type="bool">是否是阻塞方式获取（默认是阻塞方式）</param>
        /// <returns type="String" />

        var _fileContent = ""; //文件内容
        var _fileSuffix = "text"; //文件后缀

        if (fileUrl == "") { return ""; }

        //var _suffixLoc = fileUrl.lastIndexOf(".");
        //if (_suffixLoc != -1) { //找到了
        //    _fileSuffix = Cmn.Func.Trim(fileUrl.substring(_suffixLoc + 1));

        //    if (_fileSuffix == "js") { _fileSuffix = "script"; }
        //    else if (_fileSuffix == "htm") { _fileSuffix = "html"; }
        //    else { _fileSuffix = "text"; }
        //}

        //设置阻塞方式
        var _async = false;

        if (isBlock === false) { _async = true; }


        CmnAjax.ShowAjaxHandleHint(""); //显示正在获取数据提示

        $.ajax({
            type: "GET", url: fileUrl,
            async: _async,
            dataType: _fileSuffix,
            success: function (retData) {
                CmnAjax.HideAjaxHandleHint(""); //隐藏正在获取数据提示

                _fileContent = retData;

                if (successFunc) { successFunc(_fileContent); }
            },
            error: function (httpRequest, textStatus) {
                CmnAjax.HideAjaxHandleHint(""); //隐藏正在获取数据提示

                if (errorFunc) { errorFunc(); }

                Cmn.Log("GetFile！ fileUrl:" + fileUrl + "； dataType:" + _fileSuffix + "；  错误详细信息：" + textStatus+"------" + httpRequest.responseText);
            }
        });

        return _fileContent;
    },
    //获取某一个字段的值
    GetField: function (fieldName, tableName, condition, orderBy) {
        /// <summary>获取某一个字段的值</summary>
        /// <param name="fieldName" type="String">字段名</param>
        /// <param name="tableName" type="String">表名</param>
        /// <param name="condition" type="String">条件</param>
        /// <param name="orderBy" type="String">排序</param>
        /// <returns type="String" />

        if (!condition) { condition = ""; }
        else { condition = condition.replace(new RegExp("'", "g"), "\\'"); }

        if (!orderBy) { orderBy = ""; }
        else { orderBy = orderBy.replace(new RegExp("'", "g"), "\\'"); }

        var _retText = "";

        var _retVal = $.ajax({ type: "Post", "url": "/CmnAjax/CmnAjax.aspx/GetField", dataType: "text",
            contentType: "application/json;charset=uft-8",
            async: false,
            data: "{fieldName:'" + fieldName + "',tableName:'" + tableName + "',condition:'" + condition + "',orderBy:'" + orderBy + "'}",
            success: function (retData) {
                try { _retText = eval("(" + retData + ")").d; if (!_retText) { _retText = retData; } } //是json
                catch (err) { _retText = retData; } //不是json
            },
            error: function (httpRequest) {
                Cmn.Log("GetField ajax调用错误！ fieldName:" + fieldName + "  tableName：" + tableName +
                    "  错误明细：" + httpRequest.responseText);
            }
        });

        return _retText;
    },
    //显示默认ajax提示的次数（框架内部用）
    ShowDefaultAjaxHintCount: 0,
    //显示正在加载提示(框架内部用)
    ShowAjaxHandleHint: function (ajaxHandleHintSelector, dataContainerSelector) {
        /// <summary>显示正在加载提示(框架内部用)</summary>
        /// <param name="ajaxHandleHintSelector" type="String">正在加载提示选择器(和jquery的选择器一样，例如：.className或#controlID等)</param>
        /// <param name="dataContainerSelector" type="String">数据控件容器选择器(和jquery的选择器一样，例如：.className或#controlID等)</param>

        //显示正在加载，如果在同一父节点下，移到最后
        if (ajaxHandleHintSelector != null && ajaxHandleHintSelector != "" && typeof (ajaxHandleHintSelector) != "undefind") {
            if (dataContainerSelector != null && dataContainerSelector != "" && typeof (dataContainerSelector) != "undefind") {
                if (Cmn.Func.IsArray(dataContainerSelector)) {
                    dataContainerSelector = dataContainerSelector[0];
                }

                //如果在数据填充的容器中，要移到最后
                if ($(ajaxHandleHintSelector).parent().children(dataContainerSelector).length > 0) {
                    //$(ajaxHandleHintSelector).parent().append($(ajaxHandleHintSelector));
                    $(ajaxHandleHintSelector).parent().each(function () {
                        $(this).append($(this).children(ajaxHandleHintSelector));
                    });
                }
            }

            $(ajaxHandleHintSelector).show(); //显示正在加载
        }
        else { //显示默认提示
            if (CmnAjax.ShowDefaultAjaxHintCount == 0 && CmnAjax.Cfg.ShowDefaultAjaxHint==1) {
                $("body").append("<div class='cmn_body_loading' style='position:fixed;right:4px;bottom:4px;font-size:12px;z-index:10001;color:#ffffff;padding:2px;padding-left:6px;padding-right:6px; background:rgba(33, 33, 33, 0.4) none repeat scroll 0 0 !important;filter:Alpha(opacity=40);background:#333333;'> <span style='position:relative;'> Loading... </span></div>");
            }
            CmnAjax.ShowDefaultAjaxHintCount++;
        }
    },
    //隐藏正在加载提示(框架内部用)
    HideAjaxHandleHint: function (ajaxHandleHintSelector) {
        /// <summary>隐藏正在加载提示(框架内部用)</summary>
        /// <param name="ajaxHandleHintSelector" type="String">正在加载提示选择器(和jquery的选择器一样，例如：.className或#controlID等)</param>

        //隐藏正在加载
        if (ajaxHandleHintSelector != null && ajaxHandleHintSelector != "" && typeof (ajaxHandleHintSelector) != "undefind") {
            $(ajaxHandleHintSelector).hide();
        }
        else {
            CmnAjax.ShowDefaultAjaxHintCount--;
            if (CmnAjax.ShowDefaultAjaxHintCount == 0) { $("body .cmn_body_loading").remove(); }
        }
    },
    Func: {
        //获取代理url
        GetProxyUrl: function (url) {
            /// <summary>获取代理url</summary>
            /// <param name="url" type="String">网址</param>
            /// <returns type="String" />

            if (CmnAjax.Cfg.ProxyUrl == "") { return url; }

            if (url.indexOf("?TargetUrl=") >= 0) { return url; }
            else { return CmnAjax.Cfg.ProxyUrl + "?TargetUrl=" + encodeURIComponent(url); }
        },
        HasLoadJsUrl: {},
        HasLoadCss:{},
        LoadJs: function (jsUrl, callback, isAllowRepeatLoad) {
            /// <summary>动态加载Js</summary>
            /// <param name="jsUrl" type="String">jsUrl</param>
            /// <param name="callback" type="function">加载完回调函数</param>
            /// <param name="isAllowRepeatLoad" type="bool">是否允许重复加载，默认为允许</param>

            var _retVal = "";

            if (typeof (isAllowRepeatLoad) == "undefined") { isAllowRepeatLoad = false; }

            if (isAllowRepeatLoad == false) { //不允许重复加载
                var _jsUrl = CmnAjax.Func.HasLoadJsUrl[jsUrl];

                if (_jsUrl == null || _jsUrl == undefined) { //没有加载过
                    CmnAjax.Func.HasLoadJsUrl[jsUrl] = jsUrl;
                    //$.getScript(jsUrl, callback);
                    _retVal = CmnAjax.GetFile(jsUrl,callback,callback);
                }
            }
            else {
                _retVal = CmnAjax.GetFile(jsUrl, callback, callback);
                //$.getScript(jsUrl, callback);
            }

            if (_retVal != "") { eval(_retVal + " \r\n//# sourceURL=" + jsUrl); }

            return _retVal;
        },
        LoadCss: function (path) {
            /// <summary>动态加载Css</summary>
            /// <param name="path" type="String">css路径</param>
            if (!path || path.length === 0) {
                throw new Error('argument "path" is required !');
            }

            var _path = CmnAjax.Func.HasLoadCss[path];

            if (!_path) { //没有加载过
                var _head = document.getElementsByTagName('head')[0];
                var _link = document.createElement('link');
                _link.href = path;
                _link.rel = 'stylesheet';
                _link.type = 'text/css';
                _head.appendChild(_link);
                CmnAjax.Func.HasLoadCss[path] = path;
            }

        },
        SetItfToken: function (url, token, serverTime, milliseconds) {
            /// <summary>设置接口Token</summary>
            /// <param name="token" type="String">token</param>
            /// <param name="serverTime" type="String">服务器时间</param>
            /// <param name="milliseconds" type="String">服务器时间距1970年的毫秒数</param>

            var _verifyCfg = CmnAjax.Func.GetVerifyCfg(url);

            _verifyCfg["CacheToken"] = token;
            _verifyCfg["CacheTokenLastGetTime"] = new Date();

            if (serverTime != undefined && serverTime != "") { _verifyCfg["ServerTime"] = new Date(serverTime); }
            else { _verifyCfg["ServerTime"] = new Date(); }

            //保留毫秒数，解决时区问题
            if (milliseconds) { _verifyCfg["Milliseconds"] = milliseconds; }
            else { _verifyCfg["Milliseconds"] = _verifyCfg["ServerTime"].getTime(); }
        },
        GetSignature: function (url,param) {
            /// <summary>获取接口签名</summary>

            url = Cmn.Func.Trim(url);

            var _verifyCfg = CmnAjax.Func.GetVerifyCfg(url);

            if (_verifyCfg["CacheToken"] == "" || _verifyCfg["CacheToken"] == undefined) {
                _verifyCfg["CacheToken"] = "";
                Cmn.Log("在获取签名时，Tk为空。");
            }

            var _tmp = [],
                _paramString = "",
                _tmpStr = "",
                _lcKeyJson = []; //小写主键的参数json

            var _urlParamList = Cmn.Func.GetParamListFromurl(url);
            var _json = {};

            $.extend(_json, param, _urlParamList);

            //将json的参数加到数组中
            for (var _key in _json) {
                if (_key != "Cg_sg") {
                    _tmpStr = _key.toLocaleLowerCase();
                    _tmp.push(_tmpStr);

                    if (_lcKeyJson[_tmpStr] == undefined) { _lcKeyJson[_tmpStr] = _json[_key]; }
                    else { Cmn.Log("接口验证时存在重复的键：" + _tmpStr + " 接口地址：" + url);  }
                }
            }

            _tmp.sort();

            for (var _i = 0; _i < _tmp.length; _i++) {
                _paramString += "&" + _tmp[_i] + "=" + _lcKeyJson[_tmp[_i]];
            }

            _paramString = _paramString.substring(1, _paramString.length) + CmnAjax.Cfg.ItfTokenKey + _verifyCfg["CacheToken"];
            _paramString = $.md5(_paramString);

            return _paramString;
        },
        AddSignature: function (url, param) {
            /// <summary>添加签名到参数中</summary>
            /// <param name="url" type="String">网址</param>
            /// <param name="param" type="json">json参数</param>

            var _verifyCfg = CmnAjax.Func.GetVerifyCfg(url);

            if (param == undefined) { param = {}; }
            else {
                //处理参数是以字符串的形式传进来的
                if (Cmn.IsType(param, "string")) {
                    try { param = eval("(" + param + ")"); } catch (e) { param = {}; }
                }
            }

            if (Cmn.IsType(param, "object")) {
                if (_verifyCfg["CacheToken"] != undefined && _verifyCfg["CacheToken"] != "") { //存在token说明需要加密
                    param["Cg_rm"] = Cmn.Math.Random(0, 1);
                    param["Cg_tt"] = parseInt(_verifyCfg["Milliseconds"]) + (new Date() - _verifyCfg["CacheTokenLastGetTime"]); //new Date().getTime();
                    param["Cg_sg"] = CmnAjax.Func.GetSignature(url,param);
                }
            }

            return param;
        },
        IsNeedGetCgTk: function (url,data) {
            /// <summary>判断是否需要获取CgTk</summary>

            if (data && data["ItfVerifyErrorNo"] && data["ItfVerifyErrorNo"] != "") {
                var _verifyCfg = CmnAjax.Func.GetVerifyCfg(url);

                //如果返回了标准接口地址，就存到配置中
                if (data["StdItfUrl"] && data["StdItfUrl"] != "") {
                    //这个地方如果使用代理过去的话，服务器上取到的主域和真实的主域是不一样的，所以用真实的替换下
                    var _mainDomain = Cmn.Func.GetMainDomain(url);
                    if (_mainDomain != "about:srcdoc" && _mainDomain.toLowerCase() != Cmn.Func.GetMainDomain(data["StdItfUrl"]).toLowerCase()) {
                        _verifyCfg["StdItfUrl"] = data["StdItfUrl"].replace(Cmn.Func.GetMainDomain(data["StdItfUrl"]), _mainDomain);
                    }
                    else { _verifyCfg["StdItfUrl"] = data["StdItfUrl"]; }
                }

                if (_verifyCfg["CacheToken"] == undefined || _verifyCfg["CacheToken"] == "" || _verifyCfg["CacheTokenLastGetTime"] == undefined ||
                   (new Date() - _verifyCfg["CacheTokenLastGetTime"]) / 1000 > 5) {
                    //如果验证错误，有token并大于5秒没有更新,则需要重新获取
                    return true;
                }
            }

            return false;
        },
        ClearCgTk: function () {
            /// <summary>清除Token</summary>

            //CmnAjax.Cfg.CacheToken = undefined;
            //CmnAjax.Cfg.CacheTokenLastGetTime = undefined;

            CmnAjax.Cfg.ItfVerifyCfgList = {};
        },
        GetVerifyCfg: function (url) {
            /// <summary>根据url获取验证配置,如果不存在就自动创建</summary>
            /// <param name="url" type="String">网址</param>

            var _mainDomain = Cmn.Func.GetMainDomain(url).toLowerCase();

            var _verifyCfg = CmnAjax.Cfg.ItfVerifyCfgList[_mainDomain];

            if (_verifyCfg) { return _verifyCfg; }
            else {
                CmnAjax.Cfg.ItfVerifyCfgList[_mainDomain] = {};
                return CmnAjax.Cfg.ItfVerifyCfgList[_mainDomain];
            }
        },
        GetStdItfUrl: function (url) {
            /// <summary>获取标准接口地址</summary>
            /// <param name="url" type="String">网址</param>

            var _verifyCfg = CmnAjax.Func.GetVerifyCfg(url);

            if (_verifyCfg["StdItfUrl"]) { return _verifyCfg["StdItfUrl"]; }
            else { return InterfaceUrl; }
        },
        SetParamForAllRequest: function (param) {
            /// <summary>设置所有请求都添加的参数</summary>
            /// <param name="param" type="json">ajax参数,json格式例如：{ParamName:value}</param>
            CmnAjax.Cfg.ParamForAllRequest = param;
        }
    }
};

Cmn.EasyItf = new function () {
    var _Self = this;

    var GetItfUrl = function (itfName) {
        /// <summary>根据接口名获取接口地址</summary>
        /// <param name="itfName" type="String">接口名</param>
        var _itfUrl = "";

        if (InterfaceUrl == undefined) {
            Cmn.Log("InterfaceUrl 未设置。需要引用前台网站的SiteConfig.js");
            _itfUrl = Cmn.Func.GetRoot() + "Cg/Itf/CSharp/EasyItf.aspx"; //默认为c#接口
        }
        else { _itfUrl = InterfaceUrl; }

        return Cmn.Func.AddParamToUrl(_itfUrl, "method=EasyItf&ItfName=" + itfName);
    };

    this.GetData = function (itfName, param,isBlock, successFunc, errorFunc) {
        /// <summary>获取sql类型接口返回的数据</summary>
        /// <param name="itfName" type="String">接口名</param>
        /// <param name="isBlock" type="bool">是否为阻塞方式，默认为不是阻塞方式</param>
        /// <param name="successFunc" type="function">执行成功调用的函数,并返回data参数</param>
        /// <param name="errorFunc" type="function">执行错误调用的函数</param>

        itfName = GetItfUrl(itfName);

        if (isBlock === true) { return CmnAjax.GetData(itfName, param); }
        else { CmnAjax.PostData(itfName, param, successFunc, errorFunc); }
    };

    this.FillData = function (containerSelector, itfName, param, successFunc, errorFunc, loadingSelector) {
        /// <summary>用sql类型的接口填充数据</summary>
        /// <param name="containerSelector" type="String">控件容器选择器(和jquery的选择器一样，例如：.className或#controlID(如果是多条记录的话不能用id否则在二次填充的时候会多出记录)等)</param>
        /// <param name="itfName" type="String">接口名</param>
        /// <param name="param" type="String">调用webmethod的参数，例如：{id:'1',name:'name'}(可为空或不传)</param>
        /// <param name="successFunc" type="function">成功时调用的函数，参数为jason格式的数据例如：{"data":[{"id":"1","name":"chi"},{"id":"2","name":"chi2"}]} (可以不传)</param>
        /// <param name="errorFunc" type="function">错误时调用的函数 (可以不传)</param>
        /// <param name="loadingSelector" type="String">正在加载提示选择器(和jquery的选择器一样，例如：.className或#controlID等)</param>

        CmnAjax.FillData(containerSelector, GetItfUrl(itfName), param, successFunc, errorFunc, loadingSelector);
    };

    this.DataPaging = function (dataContainerSelector, itfName, param, pageContainerSelector, pageSize, successFunc, errorFunc,
       loadingSelector, curPageNo) {
        /// <summary>填充数据带翻页控件</summary>
        /// <param name="dataContainerSelector" type="String">控件容器选择器(和jquery的选择器一样，例如：.className或#controlID(如果是多条记录的话不能用id否则在二次填充的时候会多出记录)等)</param>
        /// <param name="itfName" type="String">接口名</param>
        /// <param name="param" type="String">调用webmethod的参数，例如：{id:'1',name:'name'}(可为空或不传)  </param>
        /// <param name="pageContainerSelector" type="String">翻页控件容器选择器(和jquery的选择器一样，例如：.className或#controlID等)</param>
        /// <param name="pageSize" type="int">每页显示的记录条数</param>
        /// <param name="successFunc" type="function">成功时调用的函数，参数为jason格式的数据例如：{"data":[{"id":"1","name":"chi"},{"id":"2","name":"chi2"}]} (可以不传)</param>
        /// <param name="errorFunc" type="function">错误时调用的函数 (可以不传)</param>
        /// <param name="loadingSelector" type="String">正在加载提示选择器(和jquery的选择器一样，例如：.className或#controlID等)</param>
        /// <param name="curPageNo" type="int">当前页为第几页</param>
        /// <field name="Paging" type="Cmn.Paging">翻页控件</field>

        return new CmnAjax.DataPaging(dataContainerSelector, GetItfUrl(itfName), param, pageContainerSelector, pageSize, successFunc, errorFunc,
            loadingSelector, curPageNo);
    };

    this.GetValue = function (itfName, param, isBlock, successFunc, errorFunc) {
        /// <summary>获取sql类型接口返回的数据</summary>
        /// <param name="itfName" type="String">接口名</param>
        /// <param name="isBlock" type="bool">是否为阻塞方式，默认为不是阻塞方式</param>
        /// <param name="successFunc" type="function">执行成功调用的函数,并返回data参数</param>
        /// <param name="errorFunc" type="function">执行错误调用的函数</param>

        var _url = GetItfUrl(itfName);

        if (isBlock === true) {
            var _data = CmnAjax.GetData(_url, param);

            if (_data.data != undefined && _data.data != null && _data.data.length > 0 ) {
                for (var _key in _data.data[0]) {
                    return _data.data[0][_key];
                }
            }

            return "";
        }
        else {
            if (successFunc == undefined || successFunc == null) {
                Cmn.alert("GetValue非阻塞方式必须提供successFunc回调函数！");
                return;
            }

            CmnAjax.PostData(_url, param, function (data) {
                var _data = "";

                if (data.data != undefined && data.data != null && data.data.length > 0) {
                    for (var _key in data.data[0]) {
                        _data = data.data[0][_key];
                        break;
                    }
                }

                successFunc(_data);
            }, errorFunc);
        }
    };

    this.Execute = function (itfName, param, isBlock, successFunc, errorFunc) {
        /// <summary>执行一个接口</summary>
        /// <param name="itfName" type="String">接口名</param>
        /// <param name="isBlock" type="bool">是否为阻塞方式，默认为不是阻塞方式</param>
        /// <param name="successFunc" type="function">执行成功调用的函数,并返回IsSuccess和data参数</param>
        /// <param name="errorFunc" type="function">执行错误调用的函数</param>

       // itfName = GetItfUrl(itfName);

        if (isBlock === true) { //阻塞
            var _retData = _Self.GetData(itfName, param, true); // CmnMis.Itf.GetData(itfName, param, true);

            if (_retData && _retData["IsSuccess"] == "1") { return true; }
            else { return false; }
        }
        else { //非阻塞
            _Self.GetData(itfName, param, false, function (data) {
                if (_retData && _retData["IsSuccess"] == "1") { successFunc(true, data); }
                else { successFunc(false, data); }
            },errorFunc);

            //CmnMis.Itf.GetData(itfName, param, false, function (data) {
            //    if (data.SqlExecIsOk != undefined && data.SqlExecIsOk == "1") { successFunc(true, data); }
            //    else { successFunc(false, data); }
            //}, errorFunc);
        }
    };
};
window.CmnAjax=CmnAjax;
