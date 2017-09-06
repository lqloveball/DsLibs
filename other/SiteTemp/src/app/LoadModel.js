/**
 *
 * @type {[Class]}
**/
function LoadModel(){
  var _Self=this;


  /**
   * 初始化Dom loading界面
   */
  this.InitDomLoadPanel=function(){
    //开始初始化Domloading
    SiteModel.LoadPanel=$('#siteLoadPanel');
    //加载这单页面应用
    SiteModel.LoadingModelEnd();
  };

  /**
   *  初始化CreateJs loading界面
   */
  this.InitCreateJsLoadPanel=function (){
    //loading加载配置
    var _loadObj = {
        basePath: './assets/',
        //js路径
        jsUrl: 'loading.js',
        jsNS: 'loadlib',
        imgNS: 'loadimages',
        //加载完成后调用的方法
        complete: onComplete,
        //加载进行调用的方法
        // progress: onProgress,
        //加载方式 初始化LoadQueue的crossOrigin参数
        loadType: true,
    };
    //loading加载完成后的方法处理
    function onComplete(e) {
      console.log('LoadPanel加载完成');
      //创建加载界面
      SiteModel.LoadPanel=new loadlib.LoadPanel();
      //添加到场景
      SiteModel.CJSModel.Root.addChild(SiteModel.LoadPanel);
      SiteModel.LoadPanel.gotoAndStop(0);
      SiteResizeModel.ReSize();
      ShowProgress(SiteModel.BaseProgress);
      //loading UI构建完成
      SiteModel.LoadingModelEnd();
    }
    //开始加载loading的资源
    ccjs.LoadCJSAssets(_loadObj);
  };
  this.ShowProgress=ShowProgress;
  /**
   * 设置加载进度方法
   * @param {[Number]} progress [loading的百分比 0-100]
   */
  function ShowProgress(progress){
    //获取load界面
    var _loadPanel=SiteModel.LoadPanel;

    //判断是Dom方式的loading
    if((_loadPanel instanceof HTMLElement)||(_loadPanel.length>=1&&_loadPanel[0] instanceof HTMLElement)){
      //【Dom Loading 请在这里实现】
      if(progress>=100)progress=100;
      $('#siteLoadPanel .progress').css({width:(progress)+'%'});
      $('#siteLoadPanel .label').html((progress)+'%');
    }
    //判断是createjs类型loading
    else if(window['createjs']!==undefined&&_loadPanel instanceof createjs.DisplayObject){
      if(progress>=99)progress=99;
      if(_loadPanel instanceof createjs.MovieClip)_loadPanel.gotoAndStop(progress);
      if(_loadPanel.label)_loadPanel.label.text=progress<10?'0'+(progress+1)+'%':(progress+1)+'%';
    }
  }
  this.HitLoadPanel=HitLoadPanel;
  /**
   * 隐藏进度条方法
   */
  function HitLoadPanel(){
    var _loadPanel=SiteModel.LoadPanel;
    if(!_loadPanel)return;
    //判断是Dom方式的loading
    if((_loadPanel instanceof HTMLElement)||(_loadPanel.length>=1&&_loadPanel[0] instanceof HTMLElement)){
      $(_loadPanel).hide();
    }
    else if(window['createjs']!==undefined&&_loadPanel instanceof createjs.DisplayObject){
      if(_loadPanel.parent)_loadPanel.parent.removeChild(_loadPanel);
    }
  }
}
module.exports=new LoadModel();
