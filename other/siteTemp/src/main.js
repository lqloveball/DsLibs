/**
 * @class
 * @classdesc: webpack2 快速开发网站项目模板入口
 * @extends
 * @example:
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright: Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
_time = new Date().getTime();
//网址主模块
window.SiteModel = {
    // ShowProgress: 自动创建 通过SiteModel.LoadModel 实现
    // HitLoadPanel: 自动创建 通过SiteModel.LoadModel 实现
    Devicer:require('ds/gemo/Devicer'),//设备判断，依托于Ds.gemo.Devicer类
    AppMain:null,//这个单页面程序主逻辑模块  自动创建通过LoadSinglePageApplicationJS;
    LoadModel:require('app/LoadModel.js'),//设置加载loading的逻辑模块  [这个里如果是多页面可以根据自己页面Load的js来设置]
    Debug:false,//是否debug  会根据端口号进行判断
    LoadSinglePageApplicationJS:LoadSinglePageApplicationJS,//加载单页面应用逻辑代码
    SiteResizeModel:null,//网站自适应模块 自动创建
    LoadPanel:null,//加载界面 [Dom的loading 请在InitLoadPanel函数内进行实现   Createjs的loading，正常来说不需要修改，如果需要修改InitCreateJsLoadPanel函数内修改实现]
    CJSModel:null,//createjs项目模块  [设置IsCJSSiteModel=true 时候才会创建]
    AudioAutoPlayLister:null,//声音自动播放加载与控制器类对象  自动创建
    //对整个网站框架进行ReSize方法执行 重置执行强制resize计算
    ReSize:function(){SiteModel.SiteResizeModel.ReSize();},
    //==============以上参数不做修改，会根据下列配置进行生成===================
    ScreenType:'v',//网站自适应方式
    Screen:'#screen',//网站自适应容器
    HasCreateJs:false,//网站是否需要是否是用createjs    [设置开发网站的类型,true会使用vendors2.js false使用vendors1.js]
    IsCJSSiteModel:false,//是否是用createjs方式网站    [需要设置HasCreateJs 等于true]
    IsCJSLoadPanel:false,//是否用createjs的loading  [设置使用什么方式做loading]

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
//loading 方法
SiteModel.ShowProgress=SiteModel.LoadModel.ShowProgress;
SiteModel.HitLoadPanel=SiteModel.LoadModel.HitLoadPanel;
//基本的浏览器与设备的判断
SiteModel.IsWeixin=SiteModel.Devicer.IsWeixin;
SiteModel.IsIOS=SiteModel.Devicer.IsIOS;
SiteModel.IsMobile=SiteModel.Devicer.IsMobile;
//设置变量确保LoadSinglePageApplicationJS只能执行一次
var _LoadSinglePageApplicationEnd=false;
/**
 * 加载单页面应用的代码
 */
function LoadSinglePageApplicationJS(){
  if(_LoadSinglePageApplicationEnd)return;
  _LoadSinglePageApplicationEnd=true;
  require.ensure(
      ['app/AppMain.js'],
      function() {
          SiteModel.LoadModel.ShowProgress(20);
          _SinglePageApplication = require('app/AppMain.js');
          SiteModel.AppMain = _SinglePageApplication;
          SiteModel.AppMain.Init();
      },
      'AppMain'//单页面应用打包的js名称
  );
}
/*=================以下部分基本通用可以不需要修改===================*/
//进行判断是否进行debug的判断
if (location.href.indexOf(':800') != -1) SiteModel.Debug = true;
//屏蔽滑动页面
document.addEventListener('touchmove', function(e) {e.preventDefault();}, false);
/**
 * 构建createjs模块
 */
function InitCJSModel(){
  //构建createjs模块
  SiteModel.CJSModel = Ds.createjs.CJSModel.Create({
      appendTo:$('#cjsBox')[0],
      width: 640,
      height: 1140,
      fps: 30
  });
}
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
 * 自适应
 */
function ReSize(){
  //var _Width, _Height, _PageScale, _ActualH, _Horizontal = false,_IsInputState = false,_ScreenWidth, _DensityDpi;
  if(SiteResizeModel.ScreenType=='auto'){
    if(SiteModel.CJSModel){
      if(SiteResizeModel.ScreenWidth===640)SiteModel.CJSModel.SetSize(SiteResizeModel.ScreenWidth,1140);
      else SiteModel.CJSModel.SetSize(SiteResizeModel.ScreenWidth,640);
    }
  }
}
/**
 * 加载基础库的
 */
function LoadBaseJS() {
    require.ensure(
        [
          'jquery',
          'eventdispatcher',
          'ds/gemo/QuickTrack',
          'ds/media/MobileAudioAutoPlayLister',
          'sitemoblieresizemodel',
        ],
        function() {
            require([
              'jquery',
              'eventdispatcher',
              'ds/gemo/QuickTrack',
              'ds/media/MobileAudioAutoPlayLister',
              'sitemoblieresizemodel',
            ],function(){
              console.log('LoadBaseJS:', new Date().getTime() - _time);
              if(SiteModel.AudioAutoPlayListerData){
                InitAudioAutoPlayLister();
              }
              InitSiteResizeModel();
              if(SiteModel.HasCreateJs)LoadCJSFrameWorkJS();
              else LoadFrameWorkJS();
            });
        },
        'base'
    );
}
/**
 * 初始化默认背景声音播放
 */
function InitAudioAutoPlayLister(){
  SiteModel.AudioAutoPlayLister=new Ds.media.MobileAudioAutoPlayLister();
  SiteModel.AudioAutoPlayLister.InitLoadAndSetBGM(SiteModel.AudioAutoPlayListerData);
}
/**
 * 加载项目需要支持的第三方库
 */
function LoadCJSFrameWorkJS(){
  require.ensure(
      [
          'createjs',//需要create
          'dscreatejs',//需要create 扩展
          'jstween',//需要运动引擎
          // 'touchjs',//需要touch事件
      ],
      function() {
          require([
              'createjs',
              'dscreatejs',
              'jstween',
              // 'touchjs',
          ],function(){
            console.log('LoadCJSFrameWorkJS:', new Date().getTime() - _time);
            //是否CJS类型网站
            if(SiteModel.IsCJSSiteModel) InitCJSModel();
            //使用什么模式的加载loading
            if(SiteModel.IsCJSLoadPanel) SiteModel.LoadModel.InitCreateJsLoadPanel();
            else  SiteModel.LoadModel.InitDomLoadPanel();
          });

      },
      'vendors2'
  );
}
/**
 * 加载项目需要支持的第三方库
 */
function LoadFrameWorkJS(){
  require.ensure(
      [
          'jstween',//需要运动引擎
          // 'touchjs',//需要touch事件
      ],
      function() {
          require([
              'jstween',
              // 'touchjs',
          ],function(){
            console.log('LoadFrameWorkJS:', new Date().getTime() - _time);
            SiteModel.LoadModel.InitDomLoadPanel();
          });

      },
      'vendors1'
  );
}
//开始加载代码
LoadBaseJS();
