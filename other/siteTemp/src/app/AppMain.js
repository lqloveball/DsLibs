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
        //如果是CJS类型项目
        if(SiteModel.CJSModel){
          _CJSModel = SiteModel.CJSModel;
          _Root = _CJSModel.Root;
          _Stage = _CJSModel.Stage;
        }
        //微信分享
        WeiShare();
    };
    /**
     * 微信分享接口
     */
    function WeiShare() {
        CallJsApiWXConfigItf("http://wechat.cagoe.com/JsApiWXConfig.aspx");
        SetWechatShare("分享标题", "分享内容", location.origin + "/index.aspx", "images/ShareImg.jpg", function() {
            Ds.gemo.QuickTrack.baiduEvent('WechatShare');
        });
        SetWechatShareToFriend("分享标题", "分享内容");
        SetWechatShareToTimeline("分享标题", "分享内容");
    }
}
module.exports = new AppMain();
