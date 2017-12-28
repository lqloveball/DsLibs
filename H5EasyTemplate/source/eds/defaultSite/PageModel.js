import PageBase from '../base/PageBase';
import {getDefault} from 'ds/utils/Mixin';

let [_AppMain, _CreateJsModel, _PixiJsModel, _ThreeJsModel] = [SiteModel.appMain, SiteModel.createJsModel, SiteModel.pixiJsModel, SiteModel.threeJsModel];
let _Root, _Stage;
if (_PixiJsModel) {
    _Root = _PixiJsModel.root;
    _Stage = _PixiJsModel.stage;
}
else if (_CreateJsModel) {
    _Root = _CreateJsModel.root;
    _Stage = _CreateJsModel.stage;
}

/**
 * 常规html 与 createjs 页面模块
 */
class PageModel extends PageBase {

    constructor(opts) {

        super(opts);

        let _self = this;

        //字符串的配置
        if (typeof opts === 'string') {
            let _temp = opts;
            opts = {};
            if (_temp.indexOf('.') > 0) {
                let _arr = _temp.split('.');
                opts.name = _arr[1];
                opts.cs = _temp;
                opts.touchSwipe = getDefault(opts.touchSwipe, true);
            }
            else if (_temp.indexOf('#') === 0) {
                opts.name = _temp;
                opts.cs = 'html';
                opts.touchSwipe = getDefault(opts.touchSwipe, true);
            }
            else {
                console.error('页面配置错误：' + _temp);
                return;
            }
        }

        //对象配置 判断是否html页面
        if (opts.name.indexOf('#') === 0) {
            let _temp = opts.name;
            opts.name = _temp.slice(1).split(' ')[0];
            opts.$dom = _temp;
            opts.cs = 'html';
            opts.touchSwipe = getDefault(opts.touchSwipe, true);
        }


        //是否能滑动翻页
        opts.touchSwipe = getDefault(opts.touchSwipe, false);
        //上下滑动
        opts.touchVertical = getDefault(opts.touchVertical, true);
        //运动中是锁住
        opts.movieLock = getDefault(opts.movieLock, true);
        //页面切换是否可以循环,到最后一页是否能切到上一页
        opts.touchSwipeLoop = getDefault(opts.touchSwipeLoop, true);
        //是否可以切下一页
        opts.touchNext = getDefault(opts.touchNext, true);
        //是否能切上一页
        opts.touchPrevious = getDefault(opts.touchPrevious, true);

        this._name = opts.name;
        this._cs = opts.cs;

        //页面类型 html createjs videoPage
        this._type = 'html';
        this._screenType = getDefault(opts.screenType, 'v');


        this._movieIning = true;
        this._movieOuting = true;
        this._isCreatejsView = false;
        this._view = null;
        this._domInHtml = false;
        this._config = opts;

        if (opts.cs === 'html') {

            this._isCreatejsView = false;
            this._name = opts.name;
            this._cs = opts.cs;
            let _temp;
            if (opts.$dom) _temp = $(opts.$dom);
            else _temp = $('#' + this._name);
            //判断是否非原dom结构内拥有
            if (_temp.length <= 0) {
                _temp = $(document.createElement("div"));
                _temp[0].id = this._name;
                let _css = {position: 'absolute', left: 0, top: 0,};
                if (opts.css) _css = opts.css;
                _temp.css(_css);
            } else {
                this._domInHtml = true;
            }
            this._view = _temp;
            this._type = 'html';

        }
        else if (window['createjs'] && opts.cs !== 'html') {

            this._type = 'createjs';
            if (this._name.indexOf('.') !== -1) {
                let _temp = this._name;
                let _arr = _temp.split('.');
                this._name = _arr[1];
                if (!this._cs) this._cs = _temp;
            }

            let _ns = this._cs.split('.')[0];
            let _class = this._cs.split('.')[1];

            try {

                this.view = new window[_ns][_class]();

            } catch (e) {

                console.error('你的页面设置配置有误：' + _ns + '.' + _class);
                return;

            }
        }

        if (opts.movieIn) opts.movieIn = opts.movieIn.bind(this);
        if (opts.movieInEnd) opts.movieInEnd = opts.movieInEnd.bind(this);
        if (opts.movieOut) opts.movieOut = opts.movieOut.bind(this);
        if (opts.movieOutEnd) opts.movieOutEnd = opts.movieOutEnd.bind(this);
        if (opts.resize) opts.resize = opts.resize.bind(this);
        if (opts.initUI) {
            opts.initUI = opts.initUI.bind(this);
            opts.initUI();
        }

        touch.on($('#screen')[0], 'swipeleft', () => {
            if (SiteModel.pager.pageLabel !== this.name) return;
            if (!opts.touchSwipe) return;
            if (opts.touchVertical) return;
            if(SiteModel.paneler&&SiteModel.paneler.hasShowPanel())return;
            this._nextPage();
        });
        touch.on($('#screen')[0], 'swiperight', () => {
            if (SiteModel.pager.pageLabel !== this.name) return;
            if (!opts.touchSwipe) return;
            if (opts.touchVertical) return;
            if(SiteModel.paneler&&SiteModel.paneler.hasShowPanel())return;
            this._previousPage();
        });
        touch.on($('#screen')[0], 'swipeup', () => {
            if (SiteModel.pager.pageLabel !== this.name) return;
            if (!opts.touchSwipe) return;
            if (!opts.touchVertical) return;
            if(SiteModel.paneler&&SiteModel.paneler.hasShowPanel())return;
            this._nextPage();
        });
        touch.on($('#screen')[0], 'swipedown', () => {
            if (SiteModel.pager.pageLabel !== this.name) return;
            if (!opts.touchSwipe) return;
            if (!opts.touchVertical) return;
            if(SiteModel.paneler&&SiteModel.paneler.hasShowPanel())return;
            this._previousPage();
        });



    }

    _nextPage() {
        // console.log(this.name, this._config.touchSwipe);
        if (SiteModel.pager.pageLabel !== this.name) return;
        let _config = this._config;
        if (_config.movieLock && (this._movieIning || this._movieOuting)) return;
        if (!_config.touchNext) return;
        let _pager = SiteModel.pager;
        let _index = _pager.pageList.indexOf(_pager.pageModel);
        let _num = _index + 1;
        if (_num >= _pager.pageList.length) {
            if (_config.touchSwipeLoop) _num = 0;
            else _num = _pager.pageList.length - 1;
        }
        let _page = _pager.pageList[_num];
        if (_page.type !== 'html' && _page.type !== 'createjs') return;
        SiteModel.gotoPage(_page.name);

    }

    _previousPage() {

        if (SiteModel.pager.pageLabel !== this.name) return;
        let _config = this._config;
        if (_config.movieLock && (this._movieIning || this._movieOuting)) return;
        if (!_config.touchPrevious) return;
        let _pager = SiteModel.pager;
        let _index = _pager.pageList.indexOf(_pager.pageModel);
        let _num = _index - 1;
        if (_num < 0) {
            _num = _pager.pageList.length - 1;
            if (_config.touchSwipeLoop) _num = _pager.pageList.length - 1;
            else _num = 0;
        }
        let _page = _pager.pageList[_num];
        if (_page.type !== 'html' && _page.type !== 'createjs') return;
        SiteModel.gotoPage(_page.name);

    }

}



let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let eds = root.eds = root.eds || {};

eds.PageModel = PageModel;

export default PageModel;