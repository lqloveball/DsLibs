/**
 * [后续废弃]这个类设计思路不是特别好
 * @class Ds.media.BMGer
 * @classdesc:项目中太经常做背景声音,这个类用来简化这个工作量。这个类甚至考虑独立插入到页面上也能使用
 * @extends
 * @example: 举例
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
!(function() {
    window.Ds = window.Ds || {};
    window.Ds.media = window.Ds.media || {};
    window.Ds.media.BMGer = BMGer;
    //判断微信兼容
    var _isWeixin = false;
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") _isWeixin = true;
    /**
     * 背景声音播放器
     * @param {[type]} value  [可以是一个url地址 也可以是用_Audio对象]
     * @param {[type]} opts [description]
     */
    function BMGer(value,opts) {
      var _Self=this;

      //创建声音播放对象
      var _Audio;
      /**
       * 初始化
       */
      function Init(){
        //判断传是不是声音标签DOM
        if(value instanceof Audio){
          // console.log('使用 Audio Tag');
          _Audio=value;
          //需要BMGer进行执行微信播放声音 如果是声音标签 需要进行下判断 是否需要微信加载时候触发播放
          if(opts&&opts.weChatInitPlay){
            WeChatInitPlay();
          }
        }else{
          _Audio=new Audio();
          _Audio.src=value;
          WeChatInitPlay();
        }

        _Audio.loop=true;
        _Audio.autoplay=true;

        //UI控制器
        if(opts&&opts.skin){
          _Self.SetUI(opts.skin);
        }

        //监听声音对象事件
        _Audio.addEventListener("play", function(){
          UpUIState();
        });
        _Audio.addEventListener("pause", function(){
          UpUIState();
        });

      }

      /**
       * 是否执行微信触发播放
       */
      function WeChatInitPlay(){
        //自动播放声音判断
        if(_isWeixin){
          // $('#debug').html('是微信')
          if (typeof WeixinJSBridge == "undefined"){
            //  $('#debug').html('WeixinJSBridge undefined')
            document.addEventListener("WeixinJSBridgeReady", function func() {
              // $('#debug').html('WeixinJSBridgeReady')
              _Audio.play();
              _InitBool=true;
            }, false);
          }else{
              //如果这个视频在是后创建交互视频对象，那就不能通过WeixinJSBridgeReady来触发视频播放 就不会有canplay，需要通过第一次touchstart；
            // $('#debug').html('WeixinJSBridge OK'+WeixinJSBridge)
            document.body.addEventListener('touchstart', AudioInBrowserHandler);
          }
        }else{
          //$('#debug').html('非微信')
          InitAudioPlay();
        }
      }
      //判断声音是否不初始化播放过
      var _InitBool=false;
      //初始化播放声音
      function InitAudioPlay(){
        if(!_InitBool)return;
        _InitBool=true;
        _Audio.play();
      }
      //需要第一次touch 来执行播放
      function AudioInBrowserHandler(){
        InitAudioPlay();
        document.body.removeEventListener('touchstart', AudioInBrowserHandler);
      }

      //更新UI状态
      function UpUIState(){
        if(_DOMElement){
          if(_Audio.paused){
            _DOMElement.find('.state0').hide();
            _DOMElement.find('.state1').show();
          }
          else{
            _DOMElement.find('.state0').show();
            _DOMElement.find('.state1').hide();
          }
        }
      }
      /**
       * 控制器的dom对象
       */
      var _DOMElement;
      /**
       * 设置
       * @param {[type]} dom [dom ui结构]
       * <div class="music">
           <div class="state0"></div>
           <div class="state1"></div>
         </div>
       */
      this.SetUI=function(dom){
        _DOMElement=$(dom);
        _DOMElement.on('click',function(){
          if(_Audio.paused)_Audio.play();
          else _Audio.pause();
        });
      };
      /**
       * 播放
       */
      this.Play=function(){
        _Audio.play();
      };
      /**
       * 暂停
       */
      this.Pause=function(){
        _Audio.pause();
      };
      //临时管理 开启时候判断之前是否是关闭
      var _TempStopBool=false;
      /**
       * 针对临时关闭 进行临时开启
       */
      this.TempPlay=function(){
        if(_TempStopBool)_Audio.play();
      };
      /**
       * 临时关闭，判断原来是否关闭，方便临时开启时候判断是否要开启
       */
      this.TempPause=function(){
        if(_Audio.paused)_TempStopBool=false;
        else _TempStopBool=true;
        console.log('TempPause');
        _Audio.pause();
      };
      //初始化
      Init();
    }
})();
