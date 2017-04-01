/**
 * 网站主入口
 * @type {[Class]}
 **/
function AppMain() {
    //指向这个网站入口模块
    var _Self = this;
    //如果有用到 createjs 部分代码
    var _Root, _Stage, _CJSModel;

    /**
     * 初始化
     */
    this.Init = function() {
      console.log('AppMain Init');

      InitResizeModel();
    };
    /**
     * 进行自适应
     */
    function InitResizeModel(){
      SiteModel.SiteResizeModel.on('resize',ReSize);
      ReSize();
    }
    /**
     * 如果拥有Createjs运行这个代码
     * 记的需要引用下面库
     * require('createjs')//需要create
     * require('dscreatejs')//需要create 扩展
     */
    function InitCJSModel(){
      window.ss = window.ss || {};
      window.cjs = window.createjs ;
      window.images = window.images||{} ;
      window.AdobeAn = window.AdobeAn||{} ;
      _CJSModel = ccjs.CCJSModel.Create({
          appendTo: $('#cjsBox')[0],
          width: 640,
          height: 1040,
          fps: 30
      });
      _Root = _CJSModel.Root;
      _Stage = _CJSModel.Stage;
    }
    /**
     * 自适应
     */
    function ReSize(){
        var _width=SiteModel.SiteResizeModel.Width;
        var _height=SiteModel.SiteResizeModel.Height ;
        var _actualH=SiteModel.SiteResizeModel.ActualH;
        var _pageScale=SiteModel.SiteResizeModel.PageScale;
        var _isInputState=SiteModel.SiteResizeModel.IsInputState;
        var _horizontal=SiteModel.SiteResizeModel.Horizontal;
        var _screenWidth=SiteModel.SiteResizeModel.ScreenWidth;
        var _densityDpi=SiteModel.SiteResizeModel.DensityDpi ;

        //_CJSModel.SetSize(640,_actualH);
    }

}
module.exports = new AppMain();
