require('ds/net/QuickAjax'); //快速数据请求
/**
 * 接口对接管理类  包含默认微信分享
 * @type
**/
function APIManager(){
  var _Self=this;
  //事件继承
  Ds.Extend(this, new Ds.EventDispatcher());
  //是否本地
  var _IsLocal=false;
  if (location.href.indexOf(':800') != -1)_IsLocal=true;
  //接口对接==有接口相关从这里开始编写===============================

  //==================通用的分享接口使用代码==============================
  //设置默认分享 标题  内容  链接
  var _ShareTitle='分享标题';
  var _ShareInfo='分享内容';
  var _ShareUrl=location.origin + "/index.aspx";
  //作品回流页面地址
  var _WorkPageUrl='/BackWork.html?WorkID=';
  Object.defineProperty(this, "WorkPageUrl", {
      get: function() {
          return _WorkPageUrl;
      },
      set: function(value) {
        _WorkPageUrl=value;
      }
  });
  /**
   * 默认微信分享接口
   * @param  {[string]} title [分享标题 默认_ShareTitle]
   * @param  {[string]} info  [分享内容 默认_ShareInfo]
   * @param  {[string]} url   [分享链接地址 默认_ShareUrl 传参参考：'/index.html','index.html','http://xxx.xx.com/index.html' ]
   * @param  {[string]} domain  [设定需要使用指定的域分享接口地址  如："zedigital.com.cn" ，那接口地址会按"http://wechat."+domain+".cn/JsApiWXConfig.aspx" 进行拼接 ]
   */
  this.DefaultWeiShare=function (title,info,url,domain) {
    //请确保插入的了分享接口js
    if(!CallJsApiWXConfigItf)return;
    var _apiUrl="http://wechat.cagoe.com/JsApiWXConfig.aspx";
    if (location.href.indexOf(domain) != -1){
      _apiUrl="http://wechat."+domain+"/JsApiWXConfig.aspx";
    }
    CallJsApiWXConfigItf(_apiUrl);
    //回流页面走的流程
    if (location.href.indexOf(_WorkPageUrl) != -1){
      _Self.DefaultWorkPageWeiShare(title,info);
    }else{
      //默认页面分享
      _Self.SetWeiShare(title,info,url);
    }
  };
  /**
   * 设置微信分享
   * @param  {[string]} title [分享标题 默认_ShareTitle]
   * @param  {[string]} info  [分享内容 默认_ShareInfo]
   * @param  {[string]} url   [分享链接地址 默认_ShareUrl 传参参考：'/index.html','index.html','http://xxx.xx.com/index.html' ]
   * @return {[type]}       [description]
   */
  this.SetWeiShare=function(title,info,url){
    _ShareTitle=title||_ShareTitle;
    _ShareInfo=info||_ShareInfo;
    if(url){
      if(url.indexOf('http')===-1){
        if(url.indexOf('/')===0)url=location.origin +url;
        else url=location.origin +'/'+url;
      }
    }
    _ShareUrl=url||_ShareUrl;
    //进行分享设置
    SetWechatShare(_ShareTitle,_ShareInfo, _ShareUrl, "images/ShareImg.jpg", function() {
        Ds.gemo.QuickTrack.Event('WechatShare');
    });
    SetWechatShareToFriend(_ShareTitle,_ShareInfo);
    SetWechatShareToTimeline(_ShareTitle,_ShareInfo);
  };
  /**
   * 做回流页面分享
   * @param  {[string]} workid [作品回流页面地址  如：100' 等于 location.origin+'/BackWork.html?WorkID='+'100']
   * @param  {[string]} title  [分享标题]
   * @param  {[string]} info   [分享内容]
   * @return {[type]}        [description]
   */
  this.SetWorkIDWeiShare=function(workid,title,info){
    title=title||_ShareTitle;
    info=info||_ShareInfo;
    var _url=location.origin+_WorkPageUrl+workid;
    SetWechatShare(title, info, _url, "images/ShareImg.jpg", function() {
      Ds.gemo.QuickTrack.Event('WechatShare');
    });
    SetWechatShareToFriend(title,info);
    SetWechatShareToTimeline(title,title);
  };
  /**
   * 默认作品回流分享
   * @param  {[string]} title  [分享标题]
   * @param  {[string]} info   [分享内容]
   * @return {[type]} [description]
   */
  this.DefaultWorkPageWeiShare=function(title,info){
    //获取地址栏参数字典
    var _urlParamDc = Ds.net.GetUrlParamDc();
    if (!_urlParamDc.WorkID) {
      console.warn('地址内作品id参数不存在!');
      return;
    }
    title=title||_ShareTitle;
    info=info||_ShareInfo;
    var _url=location.origin+_WorkPageUrl+workid;
    SetWechatShare(title, info, _url, "images/ShareImg.jpg", function() {
      Ds.gemo.QuickTrack.Event('WechatShare');
    });
    SetWechatShareToFriend(title,info);
    SetWechatShareToTimeline(title,title);
  };

}
module.exports=new APIManager();
