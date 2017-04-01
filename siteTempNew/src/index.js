/**
 * @class
 * @classdesc: webpack2 快速开发网站项目模板入口
 *  这个模板主面对需求
 *  1.有SiteResizeModel
 *  2.有背景声音自动播放
 *  3.jquery eventdispatcher sitemoblieresizemodel 进行默认打包
 * @extends
 * @example:
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright: Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
//网址主模块
window.SiteModel = {
    ShowProgress: ShowProgress,//设置加载进度方法
    HitLoadPanel: HitLoadPanel,//隐藏加载进度方法 [如需要使用这个函数进行设置隐藏加载进度条，Dom默认直接hide(),Createjs的loading 直接删除父级对象]
    Debug:false,//是否debug  会根据端口号进行判断
    SiteResizeModel:null,//也可以通过这里获取自适应模块
    LoadPanel:null,//加载界面 [Dom的loading 请在InitLoadPanel函数内进行实现   Createjs的loading，正常来说不需要修改，如果需要修改InitCreateJsLoadPanel函数内修改实现]
    AudioAutoPlayLister:null,//声音自动播放加载与控制器类对象
    //对整个网站框架进行ReSize方法执行
    ReSize:function(){
      SiteModel.SiteResizeModel.ReSize();
    },
    //==============以上参数不做修改，会根据下列配置进行生成===================
    ScreenType:'v',//网站自适应方式
    Screen:'#screen',//网站自适应容器
    //声音自动播放加载与控制器类对象参数，不需要可以设置成null。
    AudioAutoPlayListerData:{
      //加载声音列表  list=null list=undefined list.length<=0没有这个列表不会执行
      list:[],//项格式 {src:'./media/BGM.mp3',id:'BGM',loop:true}
      //默认播放声音背景
      id:'BGM',
      //这个BMG 绑定的控制的按钮
      button:'#BGMBtn'
    },
};

/**
 * 加载单页面应用的代码
 */
function LoadSinglePageApplicationJS(){
  require.ensure(
      ['app/AppMain.js'],
      function() {
          ShowProgress(20);
          _SinglePageApplication = require('app/AppMain.js');
          SiteModel.SinglePageApplication = _SinglePageApplication;
          SiteModel.SinglePageApplication.Init();
      },
      'AppMain'//单页面应用打包的js名称
  );
}
/**
 *  初始化Dom loading界面
 */
function InitLoadPanel(){
  //加载这单页面应用
  LoadSinglePageApplicationJS();
}
/**
 * 设置加载进度方法
 * @param {[Number]} progress [loading的百分比 0-100]
 */
function ShowProgress(progress){
  //【Dom Loading 请在这里实现】
  // $('#siteLoadPanel .progress').css({width:(progress+1)+'%'});
  // $('#siteLoadPanel .label').html((progress+1)+'%');
}
/**
 * 隐藏进度条方法
 */
function HitLoadPanel(){

}
/*=================以下部分基本通用可以不需要修改===================*/
//进行判断是否进行debug的判断
if (location.href.indexOf(':800') != -1) SiteModel.Debug = true;
//屏蔽滑动页面
document.addEventListener('touchmove', function(e) {e.preventDefault();}, false);
/**
 * 初始化网站自适应模块
 */
function InitSiteResizeModel(){
  //网站自适应模块
  window.SiteResizeModel = new Ds.SiteMoblieResizeModel({
    screen:SiteModel.Screen,
    screenType:SiteModel.ScreenType,
  });
  SiteModel.SiteResizeModel=SiteResizeModel;
  //进行提示浮动层显示
  if(SiteResizeModel.ScreenType!='auto')SiteResizeModel.InitOrientationTip();
  //监听场景自适应
  SiteResizeModel.on('resize', ReSize);
  //开始进行初始化场景自适应
  SiteResizeModel.InitResize();
  //解决loading页面缩放问题
  $(SiteModel.Screen).show();
}
/**
 * 初始化默认背景声音播放
 */
function InitAudioAutoPlayLister(){
  SiteModel.AudioAutoPlayLister=new Ds.media.MobileAudioAutoPlayLister();
  SiteModel.AudioAutoPlayLister.InitLoadAndSetBGM(SiteModel.AudioAutoPlayListerData);
}
/**
 * 自适应
 */
function ReSize(){
  //var _Width, _Height, _PageScale, _ActualH, _Horizontal = false,_IsInputState = false,_ScreenWidth, _DensityDpi;
  if(SiteResizeModel.ScreenType=='auto'){}
}
/**
 * 加载基础库的
 */
function LoadBaseJS() {
    require('jquery');
    require('ds/EventDispatcher.min');
    require('sitemoblieresizemodel');
    require('ds/media/MobileAudioAutoPlayLister');
    // require('jstween');
    InitSiteResizeModel();
    InitAudioAutoPlayLister();
    InitLoadPanel();

    // require.ensure(
    //     [
    //       'jquery',
    //       'eventdispatcher',
    //       'sitemoblieresizemodel',
    //     ],
    //     function() {
    //         require([
    //           'jquery',
    //           'eventdispatcher',
    //           'sitemoblieresizemodel',
    //         ],function(){
    //           InitLoadPanel();
    //           InitSiteResizeModel();
    //         });
    //     },
    //     'base'
    // );
}
//开始加载代码
LoadBaseJS();
