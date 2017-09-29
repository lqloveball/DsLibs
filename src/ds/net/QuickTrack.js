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

        factory(root, {});

    }

}(function (root, QuickAjax) {

    var ds = root.ds = root.ds || {};
    ds.net = ds.net || {};

    /**
     * 快速Ajax交互请求
     * @module ds/net/QuickAjax
     *
     */
    QuickAjax;

    /**
     * 快速Ajax交互请求
     * @member ds.net.QuickAjax
     * @type module:ds/net/QuickAjax
     */
    ds.net.QuickAjax = QuickAjax;

    //是否本地测试
    var _isLocalDebug = false;
    if (location.href.indexOf(':800') !== -1) _isLocalDebug = true;


    Object.assign(QuickAjax, /** @lends module:ds/net/QuickAjax */ {

        /**
         * 快速post请求操作
         * @alias module:ds/net/QuickAjax.post
         * @param {string} url 请求api的url地址
         * @param {object} postData  提交api的参数
         * @param {function} callBack  成功后回调
         * @param {function} errorBack 识别后的回调
         * @param {object} [opts={}]  ajax请求需要额外设置参数
         * @param {string} [opts.success='IsSuccess'] 判断是否成功验证字段
         * @param {string} [opts.error='ErrMsg'] 判断失败后，失败原因提示字段
         * @param {string} [opts.dataType=undefined]  请求类型，比如可以指定是jsonp方式跨域请求
         * @param {boolean} [opts.isCrossDomain=undefined] 是需要根据url进行判断是否需要jsonp跨域请求
         */
        post: function (url, postData, callBack, errorBack, opts) {

            var _type = 'POST';
            var _postData = postData || {};
            opts = opts || {};
            var _successTags = opts.success || 'IsSuccess';
            var _errorTags = opts.error || 'ErrMsg';

            if (_isLocalDebug) _type = 'GET';
            if (opts.dataType && opts.dataType === 'jsonp') _type = 'GET';

            if (opts.isCrossDomain) {

                if (url.indexOf(location.host) < 0) {

                    opts.dataType = 'jsonp';
                    _type = 'GET';

                }

            }

            console.log('QuickAjax Post:', url, _postData);


            $.ajax({
                type: _type,
                url: url,
                dataType: opts.dataType || 'json',
                data: _postData,
                success: function (data) {

                    console.log('post End:' + url + 'data type:', typeof(data) + ':', data);
                    //如果是字符串 转下 object
                    if (typeof(data) === 'string') data = eval(data);
                    //JSON.parse(data);

                    if (data && data[_successTags] !== undefined && Number(data[_successTags]) === 1) {

                        if (callBack) callBack(data);

                    } else {

                        if (errorBack && data[_errorTags]) errorBack(data[_errorTags], data);
                        else errorBack('接口错误', data);

                    }
                },
                error: function (xhr, type) {

                    console.log('error:', xhr, type);
                    if (errorBack) errorBack('网络异常');

                }

            });

        },

        /**
         * 快速post请求操作
         * @alias module:ds/net/QuickAjax.get
         * @param {string} url 请求api的url地址
         * @param {object} postData  提交api的参数
         * @param {function} callBack  成功后回调
         * @param {function} errorBack 识别后的回调
         * @param {object} [opts={}]  ajax请求需要额外设置参数
         * @param {string} [opts.success='IsSuccess'] 判断是否成功验证字段
         * @param {string} [opts.error='ErrMsg'] 判断失败后，失败原因提示字段
         * @param {string} [opts.dataType=undefined]  请求类型，比如可以指定是jsonp方式跨域请求
         * @param {boolean} [opts.isCrossDomain=undefined] 是需要根据url进行判断是否需要jsonp跨域请求
         */
        get: function (url, postData, callBack, errorBack, opts) {

            var _type = 'GET';
            var _url = url;
            opts = opts || {};

            var _successTags = opts.success !== undefined ? opts.success : 'IsSuccess';
            var _errorTags = opts.error !== undefined ? opts.error : 'ErrMsg';

            //把数据转成地址栏参数
            if (postData) {
                var _parameter = '';
                var _pdata;
                var _num = 0;
                for (var variable in _postData) {

                    if (object.hasOwnProperty(variable)) {

                        _pdata = _parameter[variable];

                        if (typeof(_pdata) === 'object') _parameter += '&' + variable + '=' + JSON.stringify(_pdata);
                        else _parameter += '&' + variable + '=' + _pdata;


                    }

                }

                // console.warn('QuickAjax Get Url 没有?开头参数 程序自动拼接：', _url);
                if (_url.indexOf('?') === -1) _url = _url + '?' + _parameter.slice(1);
                else _url = _url + _parameter;

            }

            console.log('QuickAjax Get:', url, _postData);

            $.ajax({
                type: _type,
                url: _url,
                dataType: opts.dataType || 'json',
                // data: _postData,
                success: function (data) {

                    //如果是字符串 转下 object,尽量使用JSON.parse进行转换。
                    // if (typeof(data) === 'string') data = eval(data);
                    if (typeof(data) === 'string') JSON.parse(data);

                    console.log('get End: ' + url + ':', data);
                    if (data && data[_successTags] !== undefined && Number(data[_successTags]) === 1) {

                        if (callBack) callBack(data);

                    } else {

                        if (errorBack && data[_errorTags]) errorBack(data[_errorTags], data);
                        else errorBack('接口错误', data);

                    }

                },
                error: function (xhr, type) {

                    if (errorBack) errorBack('网络异常');

                }

            });

        },
        /**
         * 获取地址上面的?后的参数
         * @alias module:ds/net/QuickAjax.getUrlParameter
         * @param {string} name 参数对象名
         * @param {string} [url = location.href] url地址
         * @return {string} 参数值
         */
        getUrlParameter: function (name, url) {

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

        },

        /**
         * 获取地址栏参数索引对象
         * @alias module:ds/net/QuickAjax.getUrlParameterDictionary
         * @param {string} [url = location.href] url地址
         * @return {object} 参数值
         */
        getUrlParameterDictionary: function (url) {

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

        },

    });
    /**
     * @member ds.net.post
     * @function
     * @see 详细请见： {@link module:ds/net/QuickAjax.post}
     */
    ds.net.post=ds.net.QuickAjax.post;
    /**
     * @member ds.net.get
     * @function
     * @see 详细请见： {@link module:ds/net/QuickAjax.get}
     */
    ds.net.get=ds.net.QuickAjax.get;
    /**
     * @member ds.net.getUrlParameter
     * @function
     * @see 详细请见： {@link module:ds/net/QuickAjax.getUrlParameter}
     */
    ds.net.getUrlParameter=ds.net.QuickAjax.getUrlParameter;
    /**
     * @member ds.net.getUrlParameterDictionary
     * @function
     * @see 详细请见： {@link module:ds/net/QuickAjax.getUrlParameterDictionary}
     */
    ds.net.getUrlParameterDictionary=ds.net.QuickAjax.getUrlParameterDictionary;

    return ds.net.QuickAjax;
}));