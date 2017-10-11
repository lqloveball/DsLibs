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

}(function (root, Model) {

    var ds = root.ds = root.ds || {};
    ds.ui = ds.ui || {};
    ds.ui.PopAlert = PopAlert;

    //开发过程使用这个html结构
    // var _popAlertDom = $(require('./popAlert/PopAlert.html'));
    //弹出框的dom结构创建  基于./popAlert/PopAlert.html基础上 进行html与css内容的压缩
    //在线工具 http://tool.oschina.net/jscompress?type=2 与 http://www.css88.com/tool/html2js/
    var _popAlertDom=$(['<div><div class="Ds_PopAlert"><div class="bg"></div><div class="panel"><div class="title"></div><div class="info"><span></spa></div><div class="close"><svg class=\'closeSvg\' style=\'position: absolute;top:25%;left:25%;width: 50%;height: 50%;\'                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.8 14.8"><path d="M8.2 7.4L14.8.7 14 0 7.6 6.7.7 0 .2.7l6.8 6.7L0 14l.7.8L7.5 8l6.7 6.8.7-.7z"                          data-name="Layer0 0 FILL"/></svg></div><div class="btnPanel"><div class="btn0 btn"></div><div class="btn1 btn"></div></div></div></div><style type="text/css">        .Ds_PopAlert {            position: absolute;            top: 0;            left: 0;            width: 100%;            height: 100%;        }        .Ds_PopAlert .bg {            position: absolute;            top: 0;            left: 0;            width: 100%;            height: 100%;            background: #000;            opacity: 0.8;        }        .Ds_PopAlert .panel {            position: absolute;            top: 50%;            left: 50%;            display: -webkit-flex;            display: flex;            flex-direction: column;            align-items: center;            justify-content: space-between;            width: 500px;            height: 250px;            margin-left: -250px;            margin-top: -125px;            background: #fff;            border-radius: 30px;            text-align: center;        }        .Ds_PopAlert .panel .close {            position: absolute;            top: -15px;            right: -15px;            width: 50px;            height: 50px;            background: #fff;            border-radius: 25px;            box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.7);        }        .Ds_PopAlert .panel .close .closeSvg {            fill: #000;        }        .Ds_PopAlert .panel .title {            width: 100%;            color: #000;            font-size: 30px;            line-height: 60px;        }        .Ds_PopAlert .panel .info {            display: -webkit-flex;            display: flex;            flex-direction: column;            justify-content: center;            width: 80%;            text-align: center;            color: #000;            font-size: 25px;        }        .Ds_PopAlert .panel .btnPanel {            display: -webkit-flex;            display: flex;            flex-direction: row;            width: 100%;            height: 60px;            line-height: 60px;            font-size: 25px;            border-top: 1px solid #ccc;            overflow: hidden;        }        .Ds_PopAlert .panel .btnPanel .btn {            color: #000;            width: 100%;            height: 100%;        }</style></div>'].join(""));

    //抽取css插入到html内
    var _style = _popAlertDom.find('style');
    $('body').append(_style);

    //抽取提示框dom结构备用
    var _alertDom = $(_popAlertDom.find('.Ds_PopAlert')[0]);

    // alert 弹出框列表
    var _alertList = [];

    //弹出宽的容器
    var _popAlertContainer = $('<div id="Ds_PopLayerContainer" style="position: absolute;top:0;left: 0;width: 100%;height: 100%;"></div>');

    //自适应
    window.addEventListener("resize", function () {

        resize();
        setTimeout(function () {resize();}, 100);

    });

    //计算自适应 _PopLayerContainer设置宽高
    function resize() {

        var _width, _height, _pageScale, _actualH, _horizontal = false,
            _isInputState = false, _screenWidth;
        _width = window.innerWidth;
        _height = window.innerHeight;

        //计算是否横屏
        if (_width > _height) _horizontal = true;
        else _horizontal = false;
        if (_width / _height > 3) {

            //算出竖屏幕下输入框状态下比例
            _isInputState = true;

        } else if (_width / _height < 12 / 7 && _width / _height > 1) {

            //算出竖屏幕下输入框状态下比例
            _isInputState = true;
            //说明这时候不会是横屏
            _horizontal = false;

        } else {

            //非输入状态
            _isInputState = false;

        }

        if (_horizontal) _screenWidth = 1138;
        else _screenWidth = 640;

        //计算缩放比例
        _pageScale = _width / _screenWidth;
        //计算实际高度
        _actualH = _height / _pageScale;

        var _resizeObj = {
            "-webkit-transform-origin": '0 0',
            "transform-origin": '0 0',
            "-webkit-transform": "scale(" + _pageScale + ")",
            "transform": "scale(" + _pageScale + ")",
            "width": _screenWidth + 'px',
            "height": _actualH + 'px'
        };

        _popAlertContainer.css(_resizeObj);

    }

    //弹出浮动层基本值设置
    var _alertConfig = {};
    _alertConfig.color = '#000'; //字体颜色  默认#000;
    _alertConfig.panelColor = '#fff'; //框颜色  默认#fff;
    _alertConfig.bgColor = '#000'; //框颜色  默认#000;
    _alertConfig.bgAlpha = 0.8; //框颜色  默认0.8;


    /**
     * alert提示浮层 代替
     * @class ds.ui.PopAlert
     * @classdesc 手机H5交互中代替经常使用系统alert
     * @param {string} info   提示内容
     * @param {object|function} config object时候为配置参数，function时候为点击确认执行方法
     * @param {string} [config.title=''] 提示框标题 默认'' 会不出现标题
     * @param {arry|string} [config.btns='确定'] 按钮文案 可以是string 或者 Array,如：不需要按钮'' 单个按钮:'确定' ['确定']  双按钮：'确定,取消' ['确定','取消']
     * @param {function} config.ok 确定执行方法  默认空
     * @param {function} config.no 取消执行方法  默认空
     * @param {function} config.close 关闭执行方法  默认使用config.noFun代替 如果有背景关闭与关闭按钮下会执行
     * @param {boolean} [config.hasClose=false] 是否有关闭按钮  默认无关闭按钮
     * @param {boolean} [config.bgClose=false] 是否支持背景关闭  默认不支持
     * @param {string} [config.color='#000'] 字体颜色  默认#000;
     * @param {string} [config.panelColor='#fff'] 框颜色  默认#fff;
     * @param {string} [config.bgColor='#000'] 框颜色  默认#000;
     * @param {number} [config.bgAlpha=0.8] 框颜色  默认0.8;
     * @param {boolean} [config.hasBg=true] 是否有背景遮罩  默认true;
     * @requires zepto.js 或者 jquery.js
     *
     */
    function PopAlert(info, config) {

        var _self = this;

        //提示内容
        var _info = info || '';

        //头部
        var _title,
            //按钮文字内容
            _btnArr,
            //背景是否关闭
            _bgClose,
            //确定事件
            _okFun,
            //取消事件
            _noFun,
            //关闭按钮，如果没事件 那就用取消
            _closeFun;

        //dom元素创建
        var _view = _alertDom.clone();
        Object.defineProperty(this, "view", {
            get: function () {
                return _view;
            },
        });

        var _titleDom = _view.find('.title');
        var _inftoDom = _view.find('.info span');
        var _okDom = _view.find('.btnPanel .btn0');
        var _noDom = _view.find('.btnPanel .btn1');
        var _closeDom = _view.find('.close');
        var _bgDom = _view.find('.bg');

        //交互事件
        _bgDom.on('click', function () {

            if (!_bgClose) return;
            _self.hide();
            if (_closeFun) _closeFun();

        });
        _closeDom.on('click', function () {

            _self.hide();
            if (_closeFun) _closeFun();

        });
        _okDom.on('click', function () {

            _self.hide();
            if (_okFun) _okFun();

        });
        _noDom.on('click', function () {

            _self.hide();
            if (_noFun) _noFun();

        });

        //初始化配置
        initConfig(config);

        function initConfig(config) {

            //初始化配置
            var _config = config || {};

            //如果传递是一个function进行下转换
            if (typeof(_config) === 'function') _config = {ok: config};

            //头部
            _title = _config.title || '';
            //确定事件
            _okFun = _config.ok || null;
            //取消事件
            _noFun = _config.no || null;
            //关闭按钮，如果没事件 那就用取消
            _closeFun = _config.close || _noFun;

            //按钮
            var _btns = _config.btns !== undefined ? _config.btns : '确定';

            if (typeof(_btns) === 'string') {

                if (_btns === '') _btnArr = [];
                else if (_btns.indexOf(',') !== -1) _btnArr = _btns.split(',');
                else _btnArr = [_btns];

            } else if (_btns instanceof Array) {

                _btnArr = _btns;

            } else {

                _btnArr = [];

            }

            if (_btnArr.length <= 0) {

                _okDom.hide();
                _noDom.hide();

            } else if (_btnArr.length === 1) {

                _okDom.show();
                _noDom.hide();
                _okDom.html(_btnArr[0]);
                _okDom.css({'borderRight': '0px solid #ccc',});

            } else {

                _okDom.html(_btnArr[0]);
                _okDom.css({'borderRight': '1px solid #ccc',});
                _okDom.show();
                _noDom.html(_btnArr[1]);
                _noDom.show();

            }

            var _hasClose = _config.hasClose !== undefined ? _config.hasClose : false;

            if (_hasClose) _closeDom.show();
            else _closeDom.hide();

            _bgClose = _config.bgClose || false;

            //框颜色
            _config.panelColor = _config.panelColor || _alertConfig.panelColor;
            _view.find('.panel').css({background: _config.panelColor});
            _view.find('.close').css({background: _config.panelColor});

            //背景颜色
            _config.bgColor = _config.bgColor || _alertConfig.bgColor;
            //背景透明度
            _config.bgAlpha = _config.bgAlpha !== undefined ? _config.bgAlpha : _alertConfig.bgAlpha;
            //背景设置
            _view.find('.bg').css({
                opacity: _config.bgAlpha,
                background: _config.bgColor
            });

            //字体颜色
            _config.color = _config.color || _alertConfig.color;
            _view.find('.title').css({color: _config.color});
            _view.find('.info').css({color: _config.color});
            _view.find('.btn').css({color: _config.color});
            _view.find('.close svg').css({fill: _config.color});

            //是否拥有背景遮罩
            var _hasBg = _config.hasBg !== undefined ? _config.hasBg : true;
            if (_hasBg) _bgDom.show();
            else _bgDom.hide();

        }

        /**
         * 显示提示框
         * @param {string} info 提示内容
         * @param {object} config 配置
         * @method ds.ui.PopAlert.prototype.show
         */
        this.show=function(info, config) {

            if (config) initConfig(config);

            _info = info || _info;
            _titleDom.html(_title);
            _inftoDom.html(_info);

            $('body').append(_popAlertContainer);
            _popAlertContainer.append(_view);

            //弹出框索引
            if (_alertList.indexOf(_self) === -1) _alertList.push(_self);

            resize();

        };

        /**
         * 隐藏当前提示框
         * @method ds.ui.PopAlert.prototype.hide
         */
        this.hide=function () {

            _view.remove();

            for (var i = 0; i < _alertList.length; i++) {

                if (_alertList[i] === _self) _alertList.splice(i, 1);

            }

            if (_alertList.length <= 0) _popAlertContainer.remove();

        };

    }

    /**
     * 快速弹出提示框
     * @param {string} info 提示内容
     * @param {string|function} config 弹出框配置
     * @see ds.ui.PopAlert 等于创建一个ds.ui.PopAlert对象，并显示 {@link ds.ui.PopAlert}
     * @method  ds.ui.PopAlert.alert
     * @return {ds.ui.PopAlert}
     */
    ds.ui.PopAlert.alert = function(info, config) {

        var _alertPanel = new ds.ui.PopAlert(info, config);
        _alertPanel.show();
        return _alertPanel;

    };

    /**
     * 关闭所有提示框
     * @method   ds.ui.PopAlert.closeAll
     */
    ds.ui.PopAlert.closeAll=function () {

        var _tempArr = _alertList;

        for (var i = 0; i < _tempArr.length; i++) {

            _tempArr[i].Hide();

        }

        _alertList = [];

    };

    /**
     * 设置提示框样式配置
     * @param {object} config
     * @method  ds.ui.PopAlert.setConfig
     */
    ds.ui.PopAlert.setConfig=function (config) {

        if (config.color !== undefined) _alertConfig.color = config.color; //字体颜色  默认#000;
        if (config.panelColor !== undefined) _alertConfig.panelColor = config.panelColor; //字体颜色  默认#000;
        if (config.bgColor !== undefined) _alertConfig.bgColor = config.bgColor; //字体颜色  默认#000;
        if (config.bgAlpha !== undefined) _alertConfig.bgAlpha = config.bgAlpha; //字体颜色  默认#000;

    };

    /**
     * 设置提示框样式配置
     * @method  ds.alert
     * @see ds.alert 实际等同于 {@link ds.ui.PopAlert.alert}
     */
    ds.alert=ds.ui.PopAlert.alert;



    return ds.ui.PopAlert;
}));