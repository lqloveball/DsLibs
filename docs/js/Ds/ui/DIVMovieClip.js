/**
 * @class Ds.ui.DIVMovieClip
 * @classdesc:类说明: DIV的CSS序列帧动画 。自动判断 是否使用设置了Variabe Frame（压缩大小的比例）。致命缺点使用CSS的动画，使用2张以上的图片序列会出现跳祯
 * @extends
 * @example: //需要 Zepto
   window.Ds.ui.DIVMovieClip.ticker.setFPS(30);
   var movie=new window.Ds.ui.DIVMovieClip();
   movie.initMovieData(data);
   $(movie.el).css({position:'absolute',left:100,top:200});
   $('body').append($(movie.el));
   movie.gotoAndPlay(10);

   var movie=new window.Ds.ui.DIVMovieClip();
   movie.loadJSON('./test.json');
   $(movie.el).css({position:'absolute',left:180,top:200});
   $('body').append($(movie.el));


   var movie=new window.Ds.ui.DIVMovieClip();
   movie.initMovieData(data);
   $(movie.el).css({position:'absolute',left:280,top:200});
   $('body').append($(movie.el));
   movie.gotoAndStop(15);


   var movie=new window.Ds.ui.DIVMovieClip();
   movie.initMovieData(data);
   $(movie.el).css({position:'absolute',left:380,top:200});
   $('body').append($(movie.el));
   $(movie.el).on('click',function(){
       movie.paused=!movie.paused;
   });
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
!(function() {
    window.Ds = window.Ds || {};
    window.Ds.ui = window.Ds.ui || {};
    window.Ds.ui.DIVMovieClip = DIVMovieClip;
    var prefix = '';
    (function() {
        var _d = document.createElement('div');
        var _prefixes = ['Webkit', 'Moz', 'Ms', 'O'];

        for (var i in _prefixes) {
            if ((_prefixes[i] + 'Transform') in _d.style) {
                prefix = _prefixes[i];
                break;
            }
        }
    }());

    function firstUper(str) {
        return str.replace(/\b(\w)|\s(\w)/g, function(m) {
            return m.toUpperCwindow.Ds.ui.e();
        });
    }

    function browserPrefix(str) {
        if (str) {
            return prefix + firstUper(str);
        } else {
            return prefix;
        }
    }
    var DIVMovieClip = function() {
        var _self = this;
        this.el = document.createElement('div');
        this.paused = false;
        this.loop = true;
        this.current = 0;
        this.movieData = null;
        this.cssMovieArr = null;
        // this.cssMovieArr2=null;
        this.initMovieData = function(data) {
            if (typeof(data) != 'object') return;
            this.movieData = data;
            var frames = data.frames;
            var images = data.images;

            this.current = 0;
            var frame = frames[this.current];
            var index = images[frame[4]];

            var cssMovieArr = [];
            var cssMovieArr2 = [];
            var mo;
            //通过判断确定css是否使用设置了Variabe Frame，压缩大小的比例
            var ow, oh, bool = false;
            for (var i = 0; i < frames.length; i++) {
                frame = frames[i];
                index = images[frame[4]];
                //设置了Variabe Frame后的
                mo= {};
                mo.background = 'url(' + index + ') ' + 'no-repeat ' + ' -' + (frame[0]) + 'px -' + (frame[1]) + 'px';
                mo.width = (frame[2]) + 'px';
                mo.height = (frame[3]) + 'px';
                mo.translate = 'translate3d(' + (-(frame[5]) + 'px,') + ' ' + (-(frame[6]) + 'px,0px') + ')';
                cssMovieArr.push(mo);


                mo = {};
                mo.background = 'url(' + index + ') ' + 'no-repeat ' + ' -' + (frame[0] + frame[5]) + 'px -' + (frame[1] + frame[6]) + 'px';
                mo.width = (frame[2] - frame[5] - frame[5]) + 'px';
                mo.height = (frame[3] - frame[6] - frame[6]) + 'px';
                cssMovieArr2.push(mo);

                if (i !== 0) {
                    if (frame[2] != ow) bool = true;
                    if (frame[2] != oh) bool = true;
                }
                ow = frame[2];
                oh = frame[3];
            }
            // log(bool)
            if (bool) {
                this.cssMovieArr = cssMovieArr;
            } else {
                this.cssMovieArr = cssMovieArr2;
            }
            mo = this.cssMovieArr[this.current];
            this.el.style.background = mo.background;
            this.el.style.width = mo.width;
            this.el.style.height = mo.height;
            if (mo.translate) {
                this.el.style[prefix + 'transform'] = mo.translate;
            }
        };
        this.loadJSON = function(value) {
            $.getJSON(value, function(data) {
                _self.initMovieData(data);
            });
        };
        this.gotoAndStop = function(value) {
            this.paused = true;
            if (this.current == value) return;
            if (value <= 0) value = 0;
            if (value >= this.cssMovieArr.length) value = this.cssMovieArr.length - 1;
            this.current = value;
            // var mo=this.cssMovieArr[this.current];
            this.updata();
        };
        this.gotoAndPlay = function(value) {
            if (value <= 0) value = 0;
            if (value >= this.cssMovieArr.length) value = this.cssMovieArr.length - 1;
            this.paused = false;
            this.current = value;
            // var mo=this.cssMovieArr[this.current];
            this.updata();

        };
        this.stop = function() {
            this.paused = true;
        };
        this.play = function() {
            this.paused = false;
        };

        this.updata = function() {
            if (!this.cssMovieArr) return;
            var mo = this.cssMovieArr[this.current];

            this.el.style[browserPrefix('transform')] = mo.translate;
            this.el.style.background = mo.background;
            this.el.style.width = mo.width;
            this.el.style.height = mo.height;

        };
        this.movieTicker = function() {
            // log(_self)
            if (_self.paused) return;
            if (!_self.cssMovieArr) return;
            _self.updata();
            _self.current += 1;
            if (_self.current >= _self.cssMovieArr.length) {
                if (_self.loop) _self.current = 0;
            }
        };
        this.destroy = function() {
            DIVMovieClip.ticker.off('updata', _self.movieTicker);
        };
        DIVMovieClip.ticker.on('updata', this.movieTicker);
    };
    DIVMovieClip.ticker = new DIVMovieClipTicker();

    function DIVMovieClipTicker() {
        Ds.Extend(this, new Ds.EventDispatcher());
        var timer;
        var _self = this;
        this.FPS = 30;
        var time = 1000 / this.FPS;
        this.setFPS = function(value) {
            this.FPS = value;
            time = 1000 / this.FPS;
            this.loop();
        };
        this.loop = function() {
            clearTimeout(timer);
            if (this.paused) return;
            _self.ds({
                type: 'updata'
            });
            timer = setTimeout(_self.loop, time);
        };
        this.paused = false;
        this.stop = function() {
            this.paused = true;
            this.loop();
        };
        this.play = function() {
            this.paused = false;
            this.loop();
        };
    }


})();
