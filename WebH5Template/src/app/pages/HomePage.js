// import DeviceOrientationer from  'ds/gemo/DeviceOrientationer';

/**
 * HomePage 使用CreateJs做页面dom
 * @type {module}
 **/
function HomePage() {

    var _Self = this;

    this.name = 'HomePage';

    //事件继承
    // ds.EventDispatcher.extend(this);
    //主模块
    var _AppMain = SiteModel.appMain;
    //如果有用到 pixi 部分代码
    var _Root, _Stage, _PixiJsModel, _CreateJsModel;
    if (SiteModel.pixiJsModel) {
        _PixiJsModel = SiteModel.pixiJsModel;
        _Root = _PixiJsModel.root;
        _Stage = _PixiJsModel.stage;
    } else if (SiteModel.createJsModel) {
        _CreateJsModel = SiteModel.createJsModel;
        _Root = _CreateJsModel.root;
        _Stage = _CreateJsModel.stage;
    }

    //添加页面模块
    var _pager=SiteModel.pager;
    _pager.add(require('./CreatejsAutoScreen'));
    _pager.add(require('./CreatejsCataract'));
    _pager.add(require('./CreatejsDomMovie'));
    _pager.add(require('./CreatejsGalley'));
    _pager.add(require('./CreatejsInput'));
    _pager.add(require('./DomAutoScreen'));
    _pager.add(require('./DynamicFont'));
    _pager.add(require('./HtmlPage'));
    _pager.add(require('./SelectImages'));
    _pager.add(require('./WebGL2Stage'));
    _pager.add(require('./ThreejsPage'));

    var _View=new lib.HomePage();

    _View.abtn0.on('click',function () {
       ds.alert('快速alert,默认一个确定按钮',function () {
           console.log('点击确认');
       }); 
    });

    _View.abtn1.on('click',function () {
        ds.alert('alert提示 2个按钮，请选择确定或者取消', {
            btns:'确定,取消',
            ok:function () {
                console.log('点击确认');
            },
            no:function () {
                console.log('点击取消');
            }
        });
    });

    _View.abtn2.on('click',function () {

        ds.alert('alert提示 关闭按钮', {
            title:'警告页面',
            btns:'确定,取消',
            color:'#b3f7fd',
            panelColor:"#451c5f",
            hasClose:true,
            ok:function () {
                console.log('点击确认');
            },
            no:function () {
                console.log('点击取消');
            }
        });

    });

    _View.btn0.on('click',function () {

        ds.alert('努力编码测试中..');
        return;

        _AppMain.gotoPage('DomAutoScreen');
    });
    _View.btn1.on('click',function () {
        _AppMain.gotoPage('CreatejsInput');
    });

    _View.btn2.on('click',function () {
        _AppMain.gotoPage('HtmlPage');
    });

    _View.btn3.on('click',function () {

        ds.alert('努力编码测试中..');
        return;

        _AppMain.gotoPage('CreatejsGalley');
    });
    _View.btn4.on('click',function () {

        ds.alert('努力编码测试中..');
        return;

        _AppMain.gotoPage('DynamicFont');
    });

    _View.btn5.on('click',function () {
        _AppMain.gotoPage('SelectImages');
    });

    _View.btn6.on('click',function () {

        ds.alert('努力编码测试中..');
        return;

        _AppMain.gotoPage('CreatejsCataract');
    });
    _View.btn7.on('click',function () {

        ds.alert('努力编码测试中..');
        return;

        _AppMain.gotoPage('CreatejsAutoScreen');
    });

    _View.btn8.on('click',function () {
        _AppMain.gotoPage('CreatejsDomMovie');
    });

    _View.btn9.on('click',function () {
        _AppMain.gotoPage('WebGL2Stage');
    });

    //动画进场
    this.MovieIn = function () {

        _Root.removeAllChildren();
        _Root.addChild(_View);

        ReSize();
    };

    require('ds/gemo/DeviceOrientationer');

    var _do=new ds.gemo.DeviceOrientationer();


    SiteModel.resizeModel.on('resize',ReSize);

    function ReSize(){
        var _resizeModel=SiteModel.resizeModel;
        var _width=_resizeModel.width;
        var _height=_resizeModel.height ;
        var _actualH=_resizeModel.actualH;
        var _pageScale=_resizeModel.pageScale;
        var _isInputState=_resizeModel.isInputState;
        var _horizontal=_resizeModel.horizontal;
        var _screenWidth=_resizeModel.screenWidth;
        var _densityDpi=_resizeModel.densityDpi ;

        if(_Self.name!==_AppMain.pager.pageLabel)return;
        if(_horizontal){
            SiteModel.resizeModel.showOrientationTip(true);
        }else{
            SiteModel.resizeModel.hideOrientationTip();
        }
    }


}

module.exports = new HomePage();

