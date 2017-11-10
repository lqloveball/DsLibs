/**
 * 创建loading提示浮层
 * @class
 * @memberof ds.ui
 * @author shadow  mail:597707404@qq.com
 */
class PopLoading
{

    /**
     * 构造函数创建一个loading的模块
     * @param {object}   [opts = undefined] 配置参数
     * @param {string}   [opts.container = "#screen" ] dom容器的id
     * @param {string}   [opts.text = "资源加载中，请耐心等待" ] 显示的文案
     * @param {string}   [opts.color = "#fff" ] 字体颜色
     * @param {string}   [opts.bgColor = "#fff" ] 背景颜色
     * @param {number}   [opts.size = 30 ] 字体大小
     *
     */
    constructor(opts)
    {

        let _self=this;
        // super();

        /**
         * 一个放置整个loading浮层的最外层级的容器 ，默认的是#screen
         * @member {string}
         * @default  "#screen"
         *
         */
        this.container=opts&&opts.container?opts.container:"#screen";

        /**
         * loading的提示文字
         * @member {string}
         * @default "资源加载中，请耐心等待"
         *
         */
        this.text=opts&&opts.text?opts.text:'资源加载中，请耐心等待';

        /**
         * loading提示文字的颜色
         * @member {string}
         * @default "#fff"
         *
         */
        this.color=opts&&opts.color?opts.color:'#fff';

        /**
         * loading提示文字的字体大小
         * @member {number}
         * @default 30
         *
         */
        this.size=opts&&opts.size?opts.size:30;

        /**
         * loading浮层的背景颜色
         * @member {string}
         * @default "rgba(0, 0, 0, 0.7)"
         *
         */
        this.bgColor=opts&&opts.bgColor?opts.bgColor:'rgba(0, 0, 0, 0.7)';


        /**
         * 显示loading浮层
         */
        this.show=function (){

            // console.log(_self);
            let _div=document.createElement('div');
            // console.log(_self.container);
            _div.className='waiting';
            _div.innerHTML='<div class="waitingTip">'+_self.text+'</div><div class="csshub-line-spin-fade-loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';

            document.querySelector(_self.container).appendChild(_div);

            if(!PopLoading.style){
                let _style = document.createElement('style');
                _style.type = 'text/css';
                _style.innerHTML='.waiting {position: absolute;left: 0;top: 0;width: 100%;height: 100%;z-index: 200000;background: '+_self.bgColor+';}'+
                    '.waiting .waitingTip {position: absolute;left: 50%;margin-left: -200px;top: 56%;width: 400px;height: 30px;line-height: 30px;font-size: '+_self.size+'px;color: '+_self.color+';text-align: center;font-weight: bold;}'+
                    '.waiting .csshub-line-spin-fade-loader {left: 50%;top: 45%;}'+
                    '.waiting .csshub-line-spin-fade-loader {position: relative;}'+
                    '.waiting .csshub-line-spin-fade-loader > div:nth-child(1) {top: 20px;left: 0;-webkit-animation: csshub-line-spin-fade-loader 1.2s -0.84s infinite ease-in-out;animation: csshub-line-spin-fade-loader 1.2s -0.84s infinite ease-in-out;}'+
                    '.waiting .csshub-line-spin-fade-loader > div:nth-child(2) {top: 13.63636px;left: 13.63636px;-webkit-transform: rotate(-45deg);transform: rotate(-45deg);-webkit-animation: csshub-line-spin-fade-loader 1.2s -0.72s infinite ease-in-out;animation: csshub-line-spin-fade-loader 1.2s -0.72s infinite ease-in-out;}'+
                    '.waiting .csshub-line-spin-fade-loader > div:nth-child(3) {top: 0;left: 20px;-webkit-transform: rotate(90deg);transform: rotate(90deg);-webkit-animation: csshub-line-spin-fade-loader 1.2s -0.6s infinite ease-in-out;animation: csshub-line-spin-fade-loader 1.2s -0.6s infinite ease-in-out;}'+
                    '.waiting .csshub-line-spin-fade-loader > div:nth-child(4) {top: -13.63636px;left: 13.63636px;-webkit-transform: rotate(45deg);transform: rotate(45deg);-webkit-animation: csshub-line-spin-fade-loader 1.2s -0.48s infinite ease-in-out;animation: csshub-line-spin-fade-loader 1.2s -0.48s infinite ease-in-out;}'+
                    '.waiting .csshub-line-spin-fade-loader > div:nth-child(5) {top: -20px;left: 0;-webkit-animation: csshub-line-spin-fade-loader 1.2s -0.36s infinite ease-in-out;animation: csshub-line-spin-fade-loader 1.2s -0.36s infinite ease-in-out;}'+
                    '.waiting .csshub-line-spin-fade-loader > div:nth-child(6) {top: -13.63636px;left: -13.63636px;-webkit-transform: rotate(-45deg);transform: rotate(-45deg);-webkit-animation: csshub-line-spin-fade-loader 1.2s -0.24s infinite ease-in-out;animation: csshub-line-spin-fade-loader 1.2s -0.24s infinite ease-in-out;}'+
                    '.waiting .csshub-line-spin-fade-loader > div:nth-child(7) {top: 0;left: -20px;-webkit-transform: rotate(90deg);transform: rotate(90deg);-webkit-animation: csshub-line-spin-fade-loader 1.2s -0.12s infinite ease-in-out;animation: csshub-line-spin-fade-loader 1.2s -0.12s infinite ease-in-out;}'+
                    '.waiting .csshub-line-spin-fade-loader > div:nth-child(8) {top: 13.63636px;left: -13.63636px;-webkit-transform: rotate(45deg);transform: rotate(45deg);-webkit-animation: csshub-line-spin-fade-loader 1.2s 0s infinite ease-in-out;animation: csshub-line-spin-fade-loader 1.2s 0s infinite ease-in-out;}'+
                    '.waiting .csshub-line-spin-fade-loader > div {background-color: #fff;width: 4px;height: 35px;border-radius: 2px;margin: 2px;-webkit-animation-fill-mode: both;animation-fill-mode: both;position: absolute;width: 5px;height: 15px;}'+
                    '@-webkit-keyframes csshub-line-spin-fade-loader {50% {opacity: 0.3;}100% {opacity: 1;}}'+
                    '@keyframes csshub-line-spin-fade-loader {50% {opacity: 0.3;}100% {opacity: 1;}}';

                document.getElementsByTagName('HEAD').item(0).appendChild(_style);

                PopLoading.style=_style;

            }


        };

        /**
         * 隐藏loading浮层
         */
        this.hide=function (){

            if(document.querySelectorAll('.waiting').length > 0) $(".waiting").remove();

            if(_style!==undefined) $(_style).remove();

        };

    }




}

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
ds.ui = ds.ui || {};
ds.ui.PopLoading=PopLoading;

/**
 * 简易使用poploading
 */
ds.ui.PopLoading.show=function () {

};

export default PopLoading;
