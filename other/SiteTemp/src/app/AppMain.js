/**
 * 网站主入口
 * @type {[Class]}
 **/
function AppMain() {
  //指向这个网站入口模块
  var _Self = this;
  //如果有用到 createjs 部分代码
  var _Root, _Stage, _CJSModel;
  //如果是有CJS类型项目
  if (SiteModel.CJSModel) {
    _CJSModel = SiteModel.CJSModel;
    _Root = _CJSModel.Root;
    _Stage = _CJSModel.Stage;
  }
  //一般会需要touchjs
  require('touchjs');
  //一般会需要jstween,当然还能使用tweenlite或 tweenmax
  require('jstween');//15k
  // require('jstimeline');//11 KB
  // require('tweenlite');//28k
  // require('timelinelite');//13 KB
  // require('tweenmax');//113 KB
  //接口管理器
  var _APIer=require('app/APIManager');
  SiteModel.APIer=this.APIer=_APIer;
  //通用的提示浮动层，alert代替解决方案
  require('ds/ui/PopLayer.min');
  //页面跳转管理器
  require('ds/gemo/SitePageManager');
  var _Pager=new Ds.gemo.SitePageManager();
  SiteModel.Pager=this.Pager=_Pager;
  //兼容原来写法，与方便添加监测代码
  this.GotoPage=GotoPage;
  /**
   * 初始化
   */
  this.Init = function() {
    console.log('AppMain Init');
    //微信分享设置
    // _APIer.WorkPageUrl='/BackWork.html?WorkID=';
    _APIer.DefaultWeiShare();
    //开始加载资源
    LoadMainAssets();
  };
  //加载资源 可以参考下面注释
  function LoadMainAssets() {
    InitModels();
  }
  /*
  //加载动画资源代码 这里是flash 类型资源加载例子
  function LoadMainAssets() {
    var _loadObj = {
      basePath: './assets/',
      //js路径
      jsUrl: 'mainUI.js',
      jsNS: 'lib',
      imgNS: 'images',
      //加载完成后调用的方法
      complete: onComplete,
      //加载进行调用的方法
      progress: onProgress,
      //加载方式 初始化LoadQueue的crossOrigin参数
      loadType: true,
      judge: true,
      id: null,
    };
    //loading加载完成后的方法处理
    function onComplete(e) {
      console.log('MainAssets加载完成');
      InitModels();
    }
    function onProgress(e) {
      var progress = e.target.progress;
      SiteModel.ShowProgress(20 + progress * 80 >> 0);
    }
    //开始加载loading的资源
    ccjs.LoadCJSAssets(_loadObj);
  }
  */

  function InitModels() {
    //隐藏loading
    SiteModel.HitLoadPanel();

    //添加一个页面模块
    // _Pager.Add(require('./HomePage'));
    // GotoPage('HomePage');

  }
  //页面跳转控制
  function GotoPage(value){
    if (_Pager.PageLabel == value) return;
    _Pager.GotoPage(value);
    Ds.gemo.QuickTrack.PV(value);
  }

}
module.exports = new AppMain();
