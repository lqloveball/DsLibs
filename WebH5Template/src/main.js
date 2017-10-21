require('ds/core/SiteModelByMobile');

//网站模块
window.SiteModel=new ds.core.SiteModelByMobile(loadSPA,'v',{
    //需要createjs框架
    hasCJS:true,
    //需要创建createjs模块
    hasCJSModel:true,
    //不需要createjs loading界面
    hasCJSLoad:false,
    //webgl 双canvas版本 createjs 模块
    hasCJSWebGL:true,
    //配置声音管理器
    audioConfig:{
        list: [
            //背景声音配置
            {src:'./media/BGM.mp3',id:'BGM',loop:true,volume:1},
        ],
        //默认播放声音背景
        id: 'BGM',
        //这个BMG 绑定的控制的按钮
        button: '#BGMBtn'
    }
});

//开启网站
window.SiteModel.start();

//需要加载单页面应用的js 使用require.ensure载入。
function loadSPA(){

    require.ensure(
        ['app/AppMain.js'],
        function() {
            require('app/AppMain.js');
        },
        'AppMain'//单页面应用打包的js名称
    );
}