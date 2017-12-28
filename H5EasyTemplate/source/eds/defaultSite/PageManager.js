
import PageModel from './PageModel';

class PageManager extends ds.core.EventDispatcher {

    constructor() {

        super();
        this._pageList = [];
        this._pageDc = {};
        this._pageModel = null;
        this._oldPageModel = null;
        this._pageLabel = '';
        this._oldPageLabel = '';

    }

    gotoPage(value,forced) {

        let _page;
        if(typeof value==='number'){
            _page =this._pageList[value];
            if(!_page)return;
            if(!_page.name)return;
            value=_page.name;
        }
        else if(typeof value==='object'){
            _page=value;
            if(this._pageList.indexOf(_page)<0)return;
            if(!_page.name)return;
            value=_page.name;
        }

        if (this._pageLabel === value) return;

        let _temp = this._pageDc[value];
        if (!_temp) return;


        let _oldPageLabel=this._pageLabel;;
        let _pageLabel=value;
        let _oldPageModel=this._pageModel;
        let _pageModel=_temp;




        if(_oldPageModel){

            _oldPageModel.once('movieOutEnd',()=>{

                this._oldPageLabel = this._pageLabel;
                this._pageLabel = value;
                this._oldPageModel = _oldPageModel;
                this._pageModel = _pageModel;

                if (this._pageModel.MovieIn) this._pageModel.MovieIn();
                else if (this._pageModel.movieIn) this._pageModel.movieIn();

                this.ds({
                    type: 'update',
                    label: this.pageLabel,
                    page: this.pageModel,
                    oldPage: this.oldPageModel,
                    oldLabel: this.oldPageLabel,
                });

            });

            _oldPageModel.movieOut();

        }else{
            this._oldPageLabel = this._pageLabel;
            this._pageLabel = value;
            this._oldPageModel = _oldPageModel;
            this._pageModel = _pageModel;

            if (this._pageModel.MovieIn) this._pageModel.MovieIn();
            else if (this._pageModel.movieIn) this._pageModel.movieIn();

            /**
             * @event ds.gemo.SitePageManager#update
             * @type {object}
             * @property {string} type='update' 事件类型
             * @property {string} label 当前页面标识
             * @property {string} oldLabel 之前页面标识
             * @property {*} page 当前页面对象
             * @property {*} oldPage 之前页面对象
             */
            this.ds({
                type: 'update',
                label: this.pageLabel,
                page: this.pageModel,
                oldPage: this.oldPageModel,
                oldLabel: this.oldPageLabel,
            });

        }





    }

    add(page) {

        if (this._pageList.indexOf(page) !== -1) return;

        let _name = page.name;

        if (!_name){
            _name = 'DsPage' + this._pageList.length;
            page.name = _name;
        }


        if (this._pageDc[_name]) {
            console.warn('Already have page.name ：', page.name);
            return;
        }

        this._pageDc[page.name] = page;
        this._pageList.push(page);

    }

    initPageConfig(list){

        for (let i = 0; i < list.length; i++) {
            let _config=list[i];
            let _page ;
            if(typeof _config==='object'){

                if(_config.type&&_config.type==='video'){
                    //没有视频页面插件
                    if(!eds.VideoPageModel) {
                        console.error(_config.name+' :缺少视频页面插件');
                        return;
                    }
                    _page=new eds.VideoPageModel(_config);
                }
                else if(_config.type&&_config.type==='frames'){
                    if(!eds.VideoPageModel) {
                        console.error(_config.name+' :缺少视频页面插件');
                        return;
                    }
                    _page=new eds.FramesPageModel(_config);
                }

                else {
                    _page=new PageModel(_config);
                }

            }
            else{

                _page=new PageModel(_config);

            }
            this.add(_page);
        }

    }

    getPage(value){
        return this._pageDc[value];
    }


    get pageDc() {
        return this._pageDc;
    }

    get pageList() {
        return this._pageList;
    }

    get pageModel() {
        return this._pageModel;
    }

    get oldPageModel() {
        return this._oldPageModel;
    }

    get pageLabel() {
        return this._pageLabel;
    }

    get oldPageLabel() {
        return this._oldPageLabel;
    }

}

export default PageManager;