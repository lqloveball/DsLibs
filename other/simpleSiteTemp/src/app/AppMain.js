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
    };

}
module.exports = new AppMain();
