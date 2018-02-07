import EventDispatcher from '../../core/EventDispatcher';
import '../../net/QuickAjax';
import {getDefault, getAbsoluteUrl} from '../../utils/Mixin';
import Utils from '../../utils/Utils';
/**
 * 发送手机验证码按钮封装
 * @class
 * @memberof ds.createjs.ui
 */
class PhoneCodeButton extends EventDispatcher {

    /**
     *
     * @param {} skin皮肤
     * @param {object} opts 配置参数
     * @param {Number} opts.time=60 短信发送时间间隔
     * @param {Function|String} opts.sendPost 短信发送函数，或者短信接口地址
     * @example
     *
     * ```
     * import PhoneCodeButton from 'ds/createjs/ui/PhoneCodeButton';
     * let smsBtn = new PhoneCodeButton(this.view.panel.smsBtn, {
            sendPost: './Ajax/DataInterface.aspx?Method=SendCode',
            phoneText:this.phoneLabel,
        });
     * ```
     */
    constructor(skin, opts) {
        super();
        opts = opts || {};

        this.config = opts;
        this.time = getDefault(opts.time, 60);
        this.startTime = new Date().getTime();
        this._skin = skin;
        this._label = skin.label;
        this._timeLabel = skin.timeLabel;
        if (this._timeLabel) this._timeLabel.visible = false;

        this._skin.mouseChildren = false;

        if (this._skin instanceof createjs.MovieClip) this._skin.gotoAndStop(0);


        this._skin.on('click', () => {
            this.sendCode();
        });


        //配置发送短信接口地址 或 发送短信方法
        this._sendPost = getDefault(opts.sendPost, null);
        this._phoneText = getDefault(opts.phoneText, null);
        //发送中
        this._isSendPosting = false;

        this._timer = null;
        this.waitTime = false;

    }

    /**
     * 重置
     */
    reset(){
        clearTimeout(this._timer);
        this._timer = null;
        this.waitTime = false;
        if (this._skin instanceof createjs.MovieClip) this._skin.gotoAndStop(0);
        if (this._timeLabel) this._timeLabel.visible = false;
        if (this._label) this._label.visible = true;
    }

    /**
     * 发送
     * @param {function} sendPost调用接口方法
     */
    sendCode(sendPost) {

        if (sendPost) this._sendPost = sendPost;

        if (this.waitTime) {
            this.ds('waitTime');
            return;
        }

        //配置是短信接口地址，进行调用发送短信接口
        if (this._sendPost && typeof(this._sendPost) === 'string'&&this._phoneText) {
            this._autoSendPost();
        } else {
            if (this._sendPost) {
                this._sendPost(() => {
                    this.sendCodeEnd();
                });
                this.ds('send');
            }
        }


    }

    /**
     * 短信发送完成调用
     */
    sendCodeEnd() {

        this.startTime = new Date().getTime();

        if (this._skin instanceof createjs.MovieClip) this._skin.gotoAndStop(1);
        if (this._timeLabel) {
            this._timeLabel.visible = true;
        }
        if (this._label) {
            this._label.visible = false;
        }

        this.waitTime = true;
        this._upShowTime();

    }

    _upShowTime() {

        clearTimeout(this._timer);

        let _time = (new Date().getTime() - this.startTime) / 1000;

        _time = (this.time - _time) >> 0;

        if (_time <= 0) {
            this.openSendClick();

            return;
        }

        if (this._timeLabel) {
            this._timeLabel.text = _time;
        }

        this._timer = setTimeout(() => {
            this._upShowTime();
        }, 500);
    }

    /**
     * 打开可以开始点击
     */
    openSendClick() {
        clearTimeout(this._timer);
        this.waitTime = false;
        if (this._skin instanceof createjs.MovieClip) this._skin.gotoAndStop(0);
        if (this._timeLabel) this._timeLabel.visible = false;
        if (this._label) this._label.visible = true;
    }

    /**
     * 配置的是短信接口地址，进行自动发送
     * @private
     */
    _autoSendPost() {
        let _self = this;
        let _url = getAbsoluteUrl(this._sendPost);

        if (_self._isSendPosting) return;
        _self._isSendPosting = true;

        // //本地测试
        if (SiteModel.debug) {
            _url= getAbsoluteUrl('./testApi/sms.txt');
        }

        if(!this._phoneText){
            ds.alert('设置电话输入框');
            _self._isSendPosting = false;
            return;
        }

        let _value=this._phoneText.value;
        console.log(_value);
        console.log(Utils.isPhone(_value));
        if(!Utils.isPhone(_value)){
            ds.alert('输入正确电话号码');
            _self._isSendPosting = false;
            return;
        }

        ds.net.post(_url, {
            phone:_value,
        }, function (data) {
            _self._isSendPosting = false;
            _self.sendCodeEnd();


        }, function (error, data) {
            _self._isSendPosting = false;
            ds.alert(error);

        });

        this.ds('send');

    }


    get skin() {
        return this._skin;
    }


}

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds ? root.ds : {};
ds.createjs = ds.createjs ? ds.createjs : {};
ds.createjs.ui = ds.createjs.ui ? ds.createjs.ui : {};
ds.createjs.ui.PhoneCodeButton = PhoneCodeButton;

export default PhoneCodeButton;