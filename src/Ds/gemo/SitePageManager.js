/**
 * @class
 * @classdesc:网站页面跳转管理器
 * @extends
 * @example:
 //使用项目页面模块例子
 function PageModel(){
   var _Self=this;
   this.name='HomePage';
   //事件继承
   // Ds.Extend(this, new Ds.EventDispatcher());
   //主模块
   var _AppMain=SiteModel.AppMain;
   //如果有用到 createjs 部分代码
   var _Root, _Stage, _CJSModel;
   if(SiteModel.CJSModel){
     //createjs
     _CJSModel=SiteModel.CJSModel;
     _Root = _CJSModel.Root;
     _Stage = _CJSModel.Stage;
   }

   // var _View=new lib.HomePage();
   //动画进场
   this.MovieIn=function(){
     // _Root.removeAllChildren();
     // _Root.addChild(_View);
   };
 }
 module.exports=new PageModel();
 //在Atom里面 代码片段配置 添加入下配置
 'webpack 模块':
     'prefix': 'wpjs'
     'body': """
             function $1(){
               var _Self=this;
               this.name='$1';
               //事件继承
               // Ds.Extend(this, new Ds.EventDispatcher());
               //主模块
               var _AppMain=SiteModel.AppMain;
               //如果有用到 createjs 部分代码
               var _Root, _Stage, _CJSModel;
               if(SiteModel.CJSModel){
                 //createjs
                 _CJSModel=SiteModel.CJSModel;
                 _Root = _CJSModel.Root;
                 _Stage = _CJSModel.Stage;
               }

               //动画进场
               this.MovieIn=function(){
                 $2
               };
             }
             module.exports=new $1();
             """
 *
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright: Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
(function (factory) {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);

    if (typeof define === 'function' && define.amd) {
        define(['exports'], function (exports) {
            module.exports= factory(root, exports);
        });
    } else if (typeof exports !== 'undefined') {
        module.exports=factory(root, exports);
    } else {
         factory(root, {});
    }

}(function (root, modelObj) {
  root.Ds = root.Ds || {};
  root.Ds.gemo = root.Ds.gemo || {};
  root.Ds.gemo.SitePageManager=SitePageManager;
  function SitePageManager(){
    var _Self=this;
    //事件继承
    Ds.Extend(this, new Ds.EventDispatcher());
    //页面索引字典
    var _PageDc = {};
    Object.defineProperty(this, "PageDc", {get: function() {return _PageDc;},});
    //页面列表
    var _PageList=[];
    //当前页面标签
    var _PageLabel = '';
    Object.defineProperty(this, "PageLabel", {
      get: function() {
        return _PageLabel;
      },
    });
    //当前页面模块
    var  _PageModel;
    Object.defineProperty(this, "PageModel", {
      get: function() {
        return _PageModel;
      },
    });
    /**
     * 页面跳转控制
     * @param  {[String or Number ]} value [description]
     * @return {[type]}       [description]
     */
    this.GotoPage=function(value) {
      if (_PageLabel == value) return;
      //取项目页面字典表内是否有这个页面对象
      var _temp = _PageDc[value];
      //如果没有这个对象，不做页面跳转
      if (!_temp) return;
      //记录当前页面名称
      _PageLabel = value;
      //记录当前页面对象
      _PageModel = _temp;
      if (_PageModel && _PageModel.MovieIn) _PageModel.MovieIn();
    };
    /**
     * 添加页面模块
     * @param  {[type]} page [description]
     * @return {[type]}      [description]
     */
    this.Add=function(page){
      //如果已经添加过这个页面 不进行再次添加
      if(_PageList.indexOf(page)!=-1)return;
      if(page.name){
        _PageDc[page.name]=page;
        _PageList.push(page);
      }else{
        //如果没有页面名称，使用自动默认创建的页面名
        var _name='DsPage'+_PageList.length;
        page.name=_name;
        _PageDc[page.name]=page;
        _PageList.push(page);
      }
    };
  }

  return root.Ds.gemo.SitePageManager;
}));
