/**
 * @class Ds.media.MobileAudioAutoPlayList
 * @classdesc:类说明: 解决初始化声音播放问题，在微信下可以通过微信WeixinJSBridgeReady事件来初始化声音播放，其他情况下第一次touch事件时候处理触发播放
 * @extends
 * @example:
 *
 ========javascript==========
 _MobileAudioAutoPlayLister=new Ds.media.MobileAudioAutoPlayLister();
 _MobileAudioAutoPlayLister.InitLoadAndSetBGM({
   //加载声音列表
   list:[
     {src:'./media/BGM.mp3',id:'BGM',loop:true}
   ],
   //默认播放声音背景
   id:'BGM',
   //这个BMG 绑定的控制的按钮
   button:'#BGMBtn',
   isfirstPlay:false,//默认是初始播放，如果设置false，默认背景声音是不会播放的
 });

 ========HTML ==========
 <!-- 音乐播放按钮HTML格式 -->
 <div id="BGMBtn">
   <div class="on"></div>
   <div class="off"></div>
 </div>
 //声音与背景声音切换  临时暂停
 SiteModel.AudioAutoPlayLister.AudioDc.VideoBg.volume=1;
 SiteModel.AudioAutoPlayLister.AudioDc.VideoBg.play();
 SiteModel.AudioAutoPlayLister.TemporarilyPaused(SiteModel.AudioAutoPlayLister.AudioDc.BGM);
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  我发起Ds库目的，简化方便工作项目开发。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里代码很多也都来源至或参考网络开源开放代码，所以这个库也开源开放。更多希望团队成员把积累工作中常用的代码，加快自己开发效率。
 * @constructor
 **/
(function(factory) {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);

    if (typeof define === 'function' && define.amd) {
        define(['exports'], function(exports) {
            module.exports = factory(root, exports);
        });
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(root, exports);
    } else {
        factory(root, {});
    }

}(function(root, modelObj) {
    root.Ds = root.Ds || {};
    root.Ds.media = root.Ds.media || {};
    //声音索引字典
    // root.AudioDc=root.AudioDc||{};
    root.Ds.media.MobileAudioAutoPlayLister = MobileAudioAutoPlayLister;

    function MobileAudioAutoPlayLister() {
        var _Self = this;
        //声音索引字典
        var _AudioDc = {};
        Object.defineProperty(this, "AudioDc", {
            get: function() {
                return _AudioDc;
            },
        });
        //声音列表
        var _AudioList;
        Object.defineProperty(this, "AudioList", {
            get: function() {
                return _AudioList;
            },
        });
        /**
         * 加载声音队列，并且播放第一个BGM,设置BGM按钮
         * @param {[Object]} opts [初始化参数]
         * opts.list=[
           {src:'./media/BGM.mp3',id:'BGM',loop:true}
          ]
          opts.id='BGM'
          opts.button='#BGMBtn'
         */
        this.InitLoadAndSetBGM = function(opts) {
            if (opts.list === undefined || opts.list === null) return;
            if (opts.list.length <= 0) return;
            //队列加载播放声音，微信设置默认播放声音
            _Self.LoadAudioListAndFirstAutoPlay(opts);
            //有设置按钮与声音 才会做捆绑 声音按钮的控制。
            if (opts.button !== undefined && opts.button !== null && opts.button !== ''&& opts.id !== null && opts.id !== undefined) {
                var _audio = _AudioDc[opts.id];
                if (_audio) _Self.SetBMGButton(_audio, opts.button);
            }
        };
        /**
         * 加载默认初始化播放声音的队列,并播放第一个声音
         * @param {[Array]} list [加载的声音列表队列]
         * [
         * {src:'./media/BGM1.mp3',id:'BGM1',loop:false,volume:0.5},
         * {src:'./media/BGM2.mp3',id:'BGM2',loop:true},
         * ]
         */
        this.LoadAudioListAndFirstAutoPlay = function(opts) {
            var list = opts.list; //声音加载队列
            var firstPlayID = opts.id; //第一个播放的声音 id索引值
            var isfirstPlay = opts.isfirstPlay !== undefined ? opts.isfirstPlay : true; //是否执行第一次声音默认播放
            //判断微信兼容
            var _isWeixin = false;
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") _isWeixin = true;
            //需要初始化声音播放的列表
            var _audioList = [];
            _AudioList = _audioList;
            for (var i = 0; i < list.length; i++) {
                var _obj = list[i];
                var _tempAudio = new Audio();
                _obj.audio = _tempAudio;
                _tempAudio.autoplay = _obj.autoplay === undefined ? false : _obj.autoplay;
                _tempAudio.loop = _obj.loop === undefined ? true : _obj.loop;
                _tempAudio._volume = _obj.volume;
                _tempAudio.src = _obj.src;
                if (_obj.id) _AudioDc[_obj.id] = _tempAudio;
                _tempAudio.volume = 0;
                _audioList.push(_tempAudio);
            }
            //判断声音是否不初始化播放过
            var _InitBool = false;
            //微信下自动播放声音判断
            if (_isWeixin) {
                // $('#debug').html('是微信')
                if (typeof WeixinJSBridge == "undefined") {
                    //  $('#debug').html('WeixinJSBridge undefined')
                    document.addEventListener("WeixinJSBridgeReady", function func() {
                        _InitBool = true;
                        var _tempAudio;
                        for (var i = 0; i < _audioList.length; i++) {
                            _tempAudio = _audioList[i];
                            _tempAudio.play();
                            // _tempAudio.volume=1;
                            // _tempAudio.pause();
                        }
                        if (_AudioDc[firstPlayID]) {
                          _tempAudio = _AudioDc[firstPlayID];
                          if (!isfirstPlay) _tempAudio.pause();
                          _tempAudio.volume = _tempAudio._volume !== undefined ? _tempAudio._volume : 1;
                        }
                        setTimeout(function() {
                            pauseOtherAudio();
                        }, 100);
                    }, false);
                } else {
                    //如果这个视频在是后创建交互视频对象，那就不能通过WeixinJSBridgeReady来触发视频播放 就不会有canplay，需要通过第一次touchstar；
                    // $('#debug').html('WeixinJSBridge OK'+WeixinJSBridge)
                    document.body.addEventListener('touchstart', audioInBrowserHandler);
                }
            } else {
                // $('#debug').html('非微信')
                // console.log('非微信');
                initAudioPlay();
            }
            //暂停那些不需要初始化播放的声音
            function pauseOtherAudio() {
                for (var i = 0; i < _audioList.length; i++) {
                    var _tempAudio = _audioList[i];
                    if (_AudioDc[firstPlayID] !== _tempAudio) {
                        _tempAudio.volume = _tempAudio._volume !== undefined ? _tempAudio._volume : 1;
                        _tempAudio.pause();
                    }
                }
            }
            //初始化播放声音
            function initAudioPlay() {
                console.log('非微信', _audioList.length);
                if (_InitBool) return;
                _InitBool = true;
                var _tempAudio;
                for (var i = 0; i < _audioList.length; i++) {
                    _tempAudio = _audioList[i];
                    _tempAudio.play();
                    // _tempAudio.volume=1;
                    // _tempAudio.pause();
                }
                if (_AudioDc[firstPlayID]) {
                    _tempAudio = _AudioDc[firstPlayID];
                    if (!isfirstPlay) _tempAudio.pause();
                    _tempAudio.volume = _tempAudio._volume !== undefined ? _tempAudio._volume : 1;
                }
                setTimeout(function() {
                    pauseOtherAudio();
                }, 100);
            }
            //需要第一次touch 来执行播放
            function audioInBrowserHandler() {
                initAudioPlay();
                document.body.removeEventListener('touchstart', audioInBrowserHandler);
            }
        };
        /**
         * 对一个按钮设置音乐开关
         * @param {[Audio]} audio  [音乐对象]
         * @param {[String||Dom]} button [按钮Dom 或者选择字符]
         */
        this.SetBMGButton = function(audio, button) {
            //按钮设置
            var _button = $(button);
            //旧音乐控制事件删除
            if (_button[0]._BMGclickFun) {
                _button.off('click', _button[0]._BMGclickFun);
            }
            if (_button[0]._BGMAudio && _button[0]._BGMAudio._upUIState) {
                _button[0]._BGMAudio.removeEventListener("play", _button[0]._BGMAudio._upUIState);
                _button[0]._BGMAudio.removeEventListener("pause", _button[0]._BGMAudio._upUIState);
            }
            //声音对象
            var _audio = audio;
            _audio._upUIState = upUIState;
            //监听声音对象事件
            _audio.addEventListener("play", upUIState);
            _audio.addEventListener("pause", upUIState);
            //按钮点击事件
            _button[0]._BMGclickFun = function() {
                // console.log(_button);
                if (_audio.paused) _audio.play();
                else _audio.pause();
            };
            _button[0]._BGMAudio = _audio;
            _button.on('click', _button[0]._BMGclickFun);
            //声音按钮状态update
            function upUIState() {
                if (_button) {
                    if (_audio.paused) {
                        _button.find('.on').hide();
                        _button.find('.off').show();
                    } else {
                        _button.find('.on').show();
                        _button.find('.off').hide();
                    }
                }
            }
            //重置UI状态
            upUIState();
        };
        /**
         * 临时暂停
         * @param  {[type]} audio [description]
         * @return {[type]}       [description]
         */
        this.TemporarilyPaused=function(audio){
          audio.__opaused=audio.paused;
          audio.pause();
        };
        /**
         * 临时关闭后播放
         * @param  {[type]} audio [description]
         * @return {[type]}       [description]
         */
        this.TemporarilyPlay=function(audio){
          if(!audio.__opaused){
            audio.play();
          }
        };

    }

    return root.Ds.media.MobileAudioAutoPlayLister;
}));
