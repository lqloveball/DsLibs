import PanelBase from '../base/PanelBase';
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
 * 弹出框基类
 *
 */
class AlertBase extends PanelBase {

    constructor(opts) {
        opts = opts || {};
        super(opts);
        this.view = opts.skin;
        this._showLabel(opts);
    }
    /**
     * 显示
     * @param opts
     * @param opts.label 显示内容
     * @param opts.cb 调用命令要做回调
     * @param opts.ok 用户点击ok时候调用
     * @param opts.no 用户点击no时候调用
     * @param opts.show  调用show命令要做回调
     * @param opts.hide  调用hide命令要做回调
     * @param opts.movieInEnd  进入完成调用
     * @param opts.movieOutEnd  退场时候调用
     * @param opts.root 显示容器  这个浮动层view需要显示到容器位置
     */
    show(opts) {

        if (this._showBool) return;
        if (opts.root) this._showRoot =opts.root;
        if (!this._showRoot && this.isCreatejsView)  this._showRoot = _Stage;
        if (!this._showRoot && !this.isCreatejsView) {
            this._showRoot =$('#domBox');
            if(!this._showRoot.length <= 0)this._showRoot = $('#screen');
        }
        this._showLabel(opts);
        super.show(opts);
    }

    _showLabel(opts) {

        if (this._isCreatejsView) {
            this._label = this.view.label;
            if (!this._label &&this.view.panel &&this.view.panel.label) this._label = this.view.panel.label;
            if (opts.label && this._label) {
                if (opts.wrapW) {
                    ds.createjs.wrapMetrics(this._label, opts.label, opts.wrapW)
                }
                else if (this._createjsWrapW) {
                    ds.createjs.wrapMetrics(this._label, opts.label, this._createjsWrapW)
                }
                else {
                    this._label.text = opts.label;
                }
            }
        }

    }

}


let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let eds = root.eds = root.eds ? root.eds : {};

eds.AlertBase = AlertBase;

export default AlertBase;