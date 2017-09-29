//这个类使用老js方法，有可能直接插入html标签内使用
!(function (factory) {

    var root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);


    if (typeof define === 'function' && define.amd) {

        define(['exports'], function (exports) {

            module.exports = factory(root, exports);

        });
    } else if (typeof exports !== 'undefined') {

        module.exports = factory(root, exports);

    } else {

        factory(root, {});

    }

}(function (root, model) {

    /**
     * 自动背景声音播放管理对象
     * @class ds.media.AutoAudioManager
     * @classdesc 一般用在网站 加载声音队列、自动播放背景声音BGM、控制声音临时暂停、开启临时暂停声音使用
     *
     */
    function AutoAudioManager() {

        var _self = this;

        //声音索引字典
        var _audioDc = {};
        Object.defineProperty(this, "audioDc", {
            get: function () {
                return _audioDc;
            },
        });

        //声音列表
        var _audioList;
        Object.defineProperty(this, "audioList", {
            get: function () {
                return _audioList;
            },
        });


        /**
         * 设置声音自动播放管理 config配置
         * @method ds.media.AutoAudioManager.prototype.initConfigData
         * @param {object} opts 初始化参数
         * @param {array} [opts.list=[]] 声音列表参数如:opts.list=[{src:'./media/BGM.mp3',id:'BGM',loop:true}]
         * opts.list[i].src 声音文件路径
         * opts.list[i].id 声音标识id
         * opts.list[i].loop 声音播放是否循环
         * opts.list[i].volume 声音默认音量
         * @param {string} [opts.id='BGM']  声音列表内那个id的声音作为背景声音
         * @param {string} [opts.button='#BGMBtn']  控制背景声音播放的dom元素 会转换成 $(opts.button)
         * @param {boolean} [opts.autoPlay='true']  设置是否已进来就自动播放
         */
        this.initConfigData = function (opts) {

            opts = opts || {};
            opts.list = opts.list || [];
            opts.id = opts.id || 'BGM';
            opts.button = opts.button || '#BGMBtn';

            //队列加载播放声音，微信设置默认播放声音
            loadAudioListAndFirstAutoPlay(opts);

            //有设置按钮与声音 才会做捆绑 声音按钮的控制。
            if (opts.button !== undefined && opts.button !== null && opts.button !== '' && opts.id !== null && opts.id !== undefined) {

                var _audio = _audioDc[opts.id];
                if (_audio) _self.setAudioButton(_audio, opts.button);

            }

        };

        function loadAudioListAndFirstAutoPlay(opts) {

            //声音加载队列
            var list = opts.list;
            //第一个播放的声音 id索引值
            var firstPlayID = opts.id;
            //是否执行第一次声音默认播放
            var autoPlay = opts.autoPlay !== undefined ? opts.autoPlay : true;

            //判断微信兼容
            var _isWeixin = false;
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) === "micromessenger") _isWeixin = true;

            //需要初始化声音播放的列表
            _audioList = [];
            for (var i = 0; i < list.length; i++) {

                var _obj = list[i];
                var _tempAudio = new Audio();
                _obj.audio = _tempAudio;
                _tempAudio.autoplay = _obj.autoplay === undefined ? false : _obj.autoplay;
                _tempAudio.loop = _obj.loop === undefined ? true : _obj.loop;
                _tempAudio._volume = _obj.volume;
                _tempAudio.src = _obj.src;
                if (_obj.id) _audioDc[_obj.id] = _tempAudio;
                _tempAudio.volume = 0;
                _audioList.push(_tempAudio);

            }

            //判断声音是否不初始化播放过
            var _InitBool = false;

            //微信下自动播放声音判断
            if (_isWeixin) {


                if (window['WeixinJSBridge'] === undefined) {


                    document.addEventListener("WeixinJSBridgeReady", function func() {

                        _InitBool = true;

                        var _tempAudio;

                        for (var i = 0; i < _audioList.length; i++) {

                            _tempAudio = _audioList[i];
                            _tempAudio.play();

                        }

                        if (_audioDc[firstPlayID]) {

                            _tempAudio = _audioDc[firstPlayID];

                            if (!autoPlay) _tempAudio.pause();

                            _tempAudio.volume = _tempAudio._volume !== undefined ? _tempAudio._volume : 1;

                        }

                        setTimeout(function () {
                            pauseOtherAudio();
                        }, 100);

                    }, false);

                } else {

                    //如果这个视频在是后创建交互视频对象，那就不能通过WeixinJSBridgeReady来触发视频播放 就不会有canplay，需要通过第一次touchstar；
                    document.body.addEventListener('touchstart', audioInBrowserHandler);

                }

            } else {

                initAudioPlay();

            }

            //暂停那些不需要初始化播放的声音
            function pauseOtherAudio() {

                for (var i = 0; i < _audioList.length; i++) {

                    var _tempAudio = _audioList[i];

                    if (_audioDc[firstPlayID] !== _tempAudio) {

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

                }

                if (_audioDc[firstPlayID]) {

                    _tempAudio = _audioDc[firstPlayID];

                    if (!autoPlay) _tempAudio.pause();

                    _tempAudio.volume = _tempAudio._volume !== undefined ? _tempAudio._volume : 1;

                }

                setTimeout(function () {
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
         * 设置一个音乐的按钮开关
         * @method ds.media.AutoAudioManager.prototype.setAudioButton
         * @param {Audio} audio  一个声音对象
         * @param {string | HTMLElement } button 一个HTMLElement元素或者一个字符标签 通过$来获取HTMLElement元素。需要有on 与 off子元素
         * @example
         * //html 按钮标签示例
         * <div id="BGMBtn">
         *      <div class="on"></div>
         *      <div class="off"></div>
         * </div>
         *
         * //css 部分示例代码
         *  #BGMBtn{
         *      position: absolute;
         *       right: 50px;
         *       top: 90px;
         *       width: 50px;
         *       height: 50px;
         *       //z-index: 10000;
         *       outline:none;
         *       -webkit-tap-highlight-color:rgba(0,0,0,0);
         *       .on,.off{
         *           position: absolute;
         *           left:20px;
         *           top: 20px;
         *           width: 44px;
         *           height: 42px;
         *       }
         *       .on{
         *           background: url(../images/BGMICON.png) no-repeat center;
         *           animation: bgmove 1.1s linear infinite;
         *           -webkit-animation: bgmove 1.1s linear infinite;
         *           display: none;
         *       }
         *       .off{
         *           background: url(../images/BGMICON.png) no-repeat center ;
         *       }  @keyframes bgmove{
         *
         *           0%{transform:rotate(0deg);}
         *           100%{transform: rotate(360deg);}
         *       }  @-webkit-keyframes
         *        bgmove{
         *           0%{transform:rotate(0deg);}
         *           100%{transform: rotate(360deg);}
         *       }
         *   }
         *
         *   //如果需要换一个背景声音
         *   var _autoAudioer=SiteModel.autoAudioer;
         *
         *   var _audio=_autoAudioer.getAudioByID('BMG');
         *
         *   _autoAudioer.setAudioButton(_audio,'#BGMBtn');
         *
         */
        this.setAudioButton = function (audio, button) {

            //按钮设置
            var _button = $(button);

            if (_button.length <= 0) {

                console.warn('setAudioButton Error no Has Button DOM');
                return;

            }

            //旧音乐控制事件删除
            if (_button[0]._bgmClickActivate) {

                _button.off('click', _button[0]._bgmClickActivate);

            }

            if (_button[0]._bgmAudio && _button[0]._bgmAudio._upUIState) {

                _button[0]._bgmAudio.removeEventListener("play", _button[0]._bgmAudio._upUIState);
                _button[0]._bgmAudio.removeEventListener("pause", _button[0]._bgmAudio._upUIState);

            }

            //声音对象
            var _audio = audio;
            _audio._upUIState = upUIState;
            //监听声音对象事件
            _audio.addEventListener("play", upUIState);
            _audio.addEventListener("pause", upUIState);

            //按钮点击事件
            _button[0]._bgmClickActivate = function () {

                // console.log(_button);
                if (_audio.paused) _audio.play();
                else _audio.pause();

            };

            _button[0]._bgmAudio = _audio;
            _button.on('click', _button[0]._bgmClickActivate);

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
         * 临时暂停声音播放
         * 常见使用在H5交互逻辑中，出现视频声音、游戏特定环节需要禁音，可以通过这个方法进行禁音。
         * @method ds.media.AutoAudioManager.prototype.temporarilyPaused
         * @param  {Audio} audio 声音对象
         * @example
         *
         * //先获取到AutoAudioManager实例对象
         * var _autoAudioer=SiteModel.autoAudioer;
         *
         * var _audio=_autoAudioer.getAudioByID('BMG');
         *
         * //也可以通过直接字典自己去查询
         * //var _audio=_autoAudioer.audioDc['BMG'];
         *
         * _autoAudioer.temporarilyPaused(_audio);
         *
         */
        this.temporarilyPaused = function (audio) {

            audio.__opaused = audio.paused;
            audio.pause();

        };
        /**
         * 临时暂停声音播放，通过这个方法可以根据关闭前是播放还是暂定来决定是否要重新播放。
         * @method ds.media.AutoAudioManager.prototype.temporarilyPlay
         * @param  {Audio} audio 声音对象
         * @example
         *
         * //取到AutoAudioManager实例对象
         * var _autoAudioer=SiteModel.autoAudioer;
         * //要进行判断是否重新播放的声音对象
         * var _audio=_autoAudioer.audioDc['BMG'];
         * //进行播放判断
         * _autoAudioer.temporarilyPlay(_audio);
         *
         */
        this.temporarilyPlay = function (audio) {

            if (!audio.__opaused) audio.play();

        };

        /**
         * 临时暂停声音播放，通过这个方法可以根据关闭前是播放还是暂定来决定是否要重新播放。
         * @method ds.media.AutoAudioManager.prototype.getAudioByID
         * @param {string} value 传入一个在声音加载列表里面的声音id，获取这个 audio 声音对象
         * @return  {Audio} audio 声音对象
         */
        this.getAudioByID = function (value) {

            var _audio = _autoAudioer.audioDc[value];
            return _audio;

        };


    }

    var ds = root.ds = root.ds || {};
    ds.media = ds.media || {};
    ds.media.AutoAudioManager = AutoAudioManager;


    return ds.media.AutoAudioManager;
}));