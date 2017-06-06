/**
 * @class 弹出浮动层 alert
 * @classdesc:类说明:
 * @extends
 * @example: 举例
 *
  var _alert=Ds.alert('测试你儿童团是的发生的',{
   // title:'提示',
   btns:'确定,取消',
   hasClose:true,
   bgClose:true,
   //color:'#00f',
   //hasBg:false,
  });
  //直接代码操作关闭这个alert
  _alert.Hide();
  //直接代码操作 重新显示
  _alert.Show('新的提示内容');
  //这个方法可以关闭所有alert
  Ds.ui.PopLayer.closeAllAlert();
 *
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright: Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
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
  root.Ds.ui = root.Ds.ui || {};
  root.Ds.ui.PopLayer = {};

  root.Ds.ui.PopLayer.PopAlert = PopAlert;

  //开发过程使用这个html结构
  // _PopLayerDom = $(require('./popLayer/PopLayer.html'));
  //弹出框的dom结构创建  基于./popLayer/PopLayer.html基础上 进行html与css内容的压缩 在线工具 http://tool.oschina.net/jscompress?type=2 与 http://www.css88.com/tool/html2js/
  var _PopLayerDom = $(['<div><div class="Ds_PopLayer"><div class="bg"></div><div class="panel"><div class="title"></div><div class="info"><span></spa></div><div class="close"><svg class=\'closeSvg\' style=\'position: absolute;top:25%;left:25%;width: 50%;height: 50%;\' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.8 14.8"><path d="M8.2 7.4L14.8.7 14 0 7.6 6.7.7 0 .2.7l6.8 6.7L0 14l.7.8L7.5 8l6.7 6.8.7-.7z" data-name="Layer0 0 FILL"/></svg></div><div class="btnPanel"><div class="btn0 btn"></div><div class="btn1 btn"></div></div></div></div><style type="text/css">.Ds_PopLayer{position:absolute;top:0;left:0;width:100%;height:100%}.Ds_PopLayer .bg{position:absolute;top:0;left:0;width:100%;height:100%;background:#000;opacity:.8}.Ds_PopLayer .panel{position:absolute;top:50%;left:50%;display:-webkit-flex;display:flex;flex-direction:column;align-items:center;justify-content:space-between;width:500px;height:250px;margin-left:-250px;margin-top:-125px;background:#fff;border-radius:30px;text-align:center}.Ds_PopLayer .panel .close{position:absolute;top:-15px;right:-15px;width:50px;height:50px;background:#fff;border-radius:25px;box-shadow:0 0 5px rgba(0,0,0,0.7)}.Ds_PopLayer .panel .close .closeSvg{fill:#000}.Ds_PopLayer .panel .title{width:100%;color:#000;font-size:30px;line-height:60px}.Ds_PopLayer .panel .info{display:-webkit-flex;display:flex;flex-direction:column;justify-content:center;width:80%;text-align:center;color:#000;font-size:25px}.Ds_PopLayer .panel .btnPanel{display:-webkit-flex;display:flex;flex-direction:row;width:100%;height:60px;line-height:60px;font-size:25px;border-top:1px solid #ccc;overflow:hidden}.Ds_PopLayer .panel .btnPanel .btn{color:#000;width:100%;height:100%}</style></div>'].join(""));
  //抽取css插入到html内
  var _Style = _PopLayerDom.find('style');
  $('body').append(_Style);
  //抽取提示框dom结构备用
  _AlertDom = $(_PopLayerDom.find('.Ds_PopLayer')[0]);
  // alert 弹出框列表
  var _AlertList = [];
  //弹出宽的容器
  var _PopLayerContainer = $('<div id="Ds_PopLayerContainer" style="position: absolute;top:0;left: 0;width: 100%;height: 100%;"></div>');
  //自适应
  window.addEventListener("resize", function() {
    ReSize();
    setTimeout(function() {
      ReSize();
    }, 100);
  });
  //计算自适应 _PopLayerContainer设置宽高
  function ReSize() {
    var _width, _height, _pageScale, _actualH, _horizontal = false,
      _isInputState = false;
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
    _PopLayerContainer.css(_resizeObj);
  }
  //弹出浮动层基本值设置
  var _AlertConfig = {};
  _AlertConfig.color = '#000'; //字体颜色  默认#000;
  _AlertConfig.panelColor = '#fff'; //框颜色  默认#fff;
  _AlertConfig.bgColor = '#000'; //框颜色  默认#000;
  _AlertConfig.bgAlpha = 0.8; //框颜色  默认0.8;
  /**
   * alert 弹出框 类
   * @param {[String]} info   [提示内容]
   * @param {[String]} title  [提示标题]
   * @param {[Object]} config [description]
   */
  function PopAlert(info, config) {
    var _Self = this;
    //提示内容
    var _Info = info || '';
    var _Title, //头部
      _BtnArr, //按钮文字内容
      _BgClose, //背景是否关闭
      _OkFun, //确定事件
      _NoFun, //取消事件
      _CloseFun; //关闭按钮，如果没事件 那就用取消

    //dom元素创建
    var _View = _AlertDom.clone();
    Object.defineProperty(this, "View", {
      get: function() {
        return _View;
      },
    });

    var _TitleDom = _View.find('.title');
    var _InftoDom = _View.find('.info span');
    var _OkDom = _View.find('.btnPanel .btn0');
    var _NoDom = _View.find('.btnPanel .btn1');
    var _CloseDom = _View.find('.close');
    var _BgDom = _View.find('.bg');
    //交互事件
    _BgDom.on('click', function() {
      if (!_BgClose) return;
      _Self.Hide();
      if (_CloseFun) _CloseFun();
    });
    _CloseDom.on('click', function() {
      _Self.Hide();
      if (_CloseFun) _CloseFun();
    });
    _OkDom.on('click', function() {
      _Self.Hide();
      if (_OkFun) _OkFun();
    });
    _NoDom.on('click', function() {
      _Self.Hide();
      if (_NoFun) _NoFun();
    });
    //初始化配置
    InitConfig(config);
    /**
     * 初始化配置
     * @param {[Object]} config [配置参数]
     * config.title 提示框标题 默认'' 会不出现标题
     * config.btns 按钮文案 可以是string 或者 Array,如：不需要按钮'' 单个按钮:'确定' ['确定']  双按钮：'确定,取消' ['确定','取消']
     * config.ok 确定执行方法  默认空
     * config.no 取消执行方法  默认空
     * config.close 关闭执行方法  默认使用config.noFun代替 如果有背景关闭与关闭按钮下会执行
     * config.hasClose 是否有关闭按钮  默认无关闭按钮
     * config.bgClose 是否支持背景关闭  默认不支持
     * config.color 字体颜色  默认#000;
     * config.panelColor 框颜色  默认#fff;
     * config.bgColor 框颜色  默认#000;
     * config.bgAlpha 框颜色  默认0.8;
     * config.hasBg 是否有背景遮罩  默认true;
     */
    function InitConfig(config) {
      //如果传递是一个function进行下转换
      if (typeof(config) === 'function') {
        config = {
          ok: config
        };
      }
      //初始化配置
      var _config = config || {};
      //头部
      _Title = _config.title || '';
      //确定事件
      _OkFun = _config.ok || null;
      //取消事件
      _NoFun = _config.no || null;
      //关闭按钮，如果没事件 那就用取消
      _CloseFun = _config.close || _NoFun;
      //按钮
      var _btns = _config.btns !== undefined ? _config.btns : '确定';
      if (typeof(_btns) == 'string') {
        if (_btns === '') {
          _BtnArr = [];
        } else if (_btns.indexOf(',') != -1) {
          _BtnArr = _btns.split(',');
        } else {
          _BtnArr = [_btns];
        }
      } else if (_btns instanceof Array) {
        _BtnArr = _btns;
      } else {
        _BtnArr = [];
      }
      if (_BtnArr.length <= 0) {
        _OkDom.hide();
        _NoDom.hide();
      } else if (_BtnArr.length === 1) {
        _OkDom.show();
        _NoDom.hide();
        _OkDom.html(_BtnArr[0]);
        _OkDom.css({
          'borderRight': '0px solid #ccc',
        });
      } else {
        _OkDom.html(_BtnArr[0]);
        _OkDom.css({
          'borderRight': '1px solid #ccc',
        });
        _OkDom.show();
        _NoDom.html(_BtnArr[1]);
        _NoDom.show();
      }
      var _hasClose = _config.hasClose !== undefined ? _config.hasClose : false;
      // console.log('_hasClose', _hasClose);
      if (_hasClose) {
        _CloseDom.show();
      } else {
        _CloseDom.hide();
      }
      _BgClose = _config.bgClose || false;
      //框颜色
      _config.panelColor = _config.panelColor || _AlertConfig.panelColor;
      _View.find('.panel').css({
        background: _config.panelColor
      });
      _View.find('.close').css({
        background: _config.panelColor
      });
      //背景颜色
      _config.bgColor = _config.bgColor || _AlertConfig.bgColor;
      //背景透明度
      _config.bgAlpha = _config.bgAlpha !== undefined ? _config.bgAlpha : _AlertConfig.bgAlpha;
      //背景设置
      _View.find('.bg').css({
        opacity: _config.bgAlpha,
        background: _config.bgColor
      });
      //字体颜色
      _config.color = _config.color || _AlertConfig.color;
      _View.find('.title').css({
        color: _config.color
      });
      _View.find('.info').css({
        color: _config.color
      });
      _View.find('.btn').css({
        color: _config.color
      });
      _View.find('.close svg').css({
        fill: _config.color
      });
      //是否拥有背景遮罩
      var _hasBg = _config.hasBg !== undefined ? _config.hasBg : true;
      if (_hasBg) {
        _BgDom.show();
      } else {
        _BgDom.hide();
      }
    }
    /**
     * 显示提示框
     * @param  {[type]} info  [description]
     * @return {[type]}       [description]
     */
    this.Show = function(info, config) {
      if (config) InitConfig(config);
      _Info = info || _Info;
      _TitleDom.html(_Title);
      _InftoDom.html(_Info);
      // if($('#screen').length>0){
      //   $('#screen').append(_View);
      // }else{
      //   $('body').append(_View);
      // }
      $('body').append(_PopLayerContainer);
      _PopLayerContainer.append(_View);
      //弹出框索引
      if (_AlertList.indexOf(_Self) == -1) {
        _AlertList.push(_Self);
      }
      ReSize();
    };
    /**
     * 隐藏当前提示框
     * @return {[type]} [description]
     */
    this.Hide = function() {
      _View.remove();
      //从显示的alert列表中进行做删除
      for (var i = 0; i < _AlertList.length; i++) {
        var _temp = _AlertList[i];
        if (_temp == _Self) {
          _AlertList.splice(i, 1);
        }
      }
      if (_AlertList.length <= 0) _PopLayerContainer.remove();
    };
  }

  /**
   * 快捷弹出提示框
   * @param  {[String]} info   [提示内容]
   * @param  {[Object]} config [提示框配置]
   * config.title 提示框标题 默认'' 会不出现头部标题
   * config.btns 按钮文案 可以是string 或者 Array,如：不需要按钮'' 单个按钮:'确定' ['确定']  双按钮：'确定,取消' ['确定','取消']
   * config.ok 确定执行方法  默认空
   * config.no 取消执行方法  默认空
   * config.close 关闭执行方法  默认使用config.noFun代替 如果有背景关闭与关闭按钮下会执行
   * config.hasClose 是否有关闭按钮  默认无关闭按钮
   * config.bgClose 是否支持背景关闭  默认不支持
   * config.color 字体颜色  默认#000;
   * config.panelColor 框颜色  默认#fff;
   * config.bgColor 框颜色  默认#000;
   * config.bgAlpha 框颜色  默认0.8;
   * config.hasBg 是否有背景遮罩  默认true;
   * @return {[PopAlert]}  result   [这个alert框对象 ]
   */
  root.Ds.ui.PopLayer.alert = function(info, config) {
    var _AlertPanel = new PopAlert(info, config);
    _AlertPanel.Show();
    return _AlertPanel;
  };
  /**
   * 关闭所有提示框
   * @return {[type]} [description]
   */
  root.Ds.ui.PopLayer.closeAllAlert = function() {
    var _tempArr = _AlertList;
    _AlertList = [];
    for (var i = 0; i < _tempArr.length; i++) {
      var _alert = _tempArr[i];
      _alert.Hide();
    }
  };
  /**
   * 设置弹出框的默认样式 快速方法索引 Ds.alert.SetConfig
   * @param  {[Object]} config [弹窗口参数值]
   * config.color
   * config.panelColor
   * config.bgColor
   * config.bgAlpha
   * @return {[type]}        [description]
   */
  root.Ds.ui.PopLayer.SetAlertConfig = function(config) {
    if (config.color !== undefined) _AlertConfig.color = config.color; //字体颜色  默认#000;
    if (config.panelColor !== undefined) _AlertConfig.panelColor = config.panelColor; //字体颜色  默认#000;
    if (config.bgColor !== undefined) _AlertConfig.bgColor = config.bgColor; //字体颜色  默认#000;
    if (config.bgAlpha !== undefined) _AlertConfig.bgAlpha = config.bgAlpha; //字体颜色  默认#000;
  };
  //开放给顶层命名空间下
  root.Ds.alert = root.Ds.ui.PopLayer.alert;
  root.Ds.closeAllAlert = root.Ds.ui.PopLayer.closeAllAlert;
  root.Ds.alert.SetConfig = root.Ds.ui.PopLayer.SetAlertConfig;


  return root.Ds.ui.PopLayer;
}));
