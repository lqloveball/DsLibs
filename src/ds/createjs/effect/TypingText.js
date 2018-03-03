import EventDispatcher from '../../core/EventDispatcher';
import {getDefault} from '../../utils/Mixin';

/**
 * 打字效果
 *
 */
class TypingText extends EventDispatcher {
    /**
     *
     * @param box 包含做打字效果的容器
     * @param opts 配置
     * @param opts.delay=0.1 打字之间延迟执行
     * @param opts.time=0.1 字出现动画时间
     * @param opts.allTime=undefined 字动画总时间，如果设置就会忽略opts.delay与opts.time设置
     * @param opts.stage=null 可以设置辅助计算用stage,默认会直接获取
     * @param opts.autoAdd=true 是否自动添加原来容器内
     */
    constructor(box, opts) {
        super();
        opts = opts || {};
        this._view = new createjs.Container();
        this._box = box;
        let _box = this._box;

        let _stage = opts.stage;
        if (!_stage && SiteModel.createJsModel) _stage = SiteModel.createJsModel.stage;
        if (!_stage) {
            console.warn('需要设置stage来辅助计算');
            return;
        }

        this._delay=getDefault(opts.delay,0.1);
        this._time=getDefault(opts.time,0.1);
        this._allTime=getDefault(opts.allTime,undefined);
        this._progress=0;

        let _tempBox;
        let _hasTempBox = true;

        let _oparent = _box.parent;

        if (SiteModel.createJsModel && SiteModel.createJsModel.tempBox) {
            _tempBox = SiteModel.createJsModel.tempBox;
        } else {
            _hasTempBox = false;
            _tempBox = new createjs.Container();
            _tempBox.x = 100000;
            _tempBox.y = 100000;
            _stage.addChild(_tempBox);
        }


        //开始计算显示区域
        _tempBox.addChild(_box);
        _stage.update();
        let _rect = _box.getBounds();
        this.cacheRect=_rect;
        // console.log(_rect);

        let _isMCBox=(_box instanceof createjs.MovieClip);
        this._parentIsMovieClip=_isMCBox;
        // console.log('isMc:',_isMCBox);


        //判断如果是一个影片剪辑对象，那就要破坏原来的时间轴渲染
        if (_isMCBox) {
            let _timeline = _box.timeline;
            let _tweens = _timeline.tweens;
            for (let i = 0; i < _tweens.length; i++) {
                let _tween = _tweens[i];
                _timeline.removeTween(_tween);
            }
        }

        //解析分析字的数据
        this._parsing();

        //判断原来父亲是否是影片剪辑，如果不是就必须自己添加回原来位置
        if(_oparent&&_oparent instanceof createjs.MovieClip) {

        }else{
            _oparent.addChild(_box);
        }

        //如果是临时创建渲染盒子，就就必须做删除工作
        if(!_hasTempBox){
           if( _tempBox.parent) _tempBox.parent.removeChild(_tempBox);
        }


        let _autoAdd=getDefault(opts.autoAdd,true);
        if(_autoAdd){
            if(_isMCBox){
                _box.timeline.addTween(createjs.Tween.get(this._view).wait(1));
                _box.on('added',()=>{
                    this.play();
                });
            }else{
                _box.addChild(this._view);
            }
        }



    }

    /**
     * 解析拆字
     * @private
     */
    _parsing(){
        let _box=this._box;
        let _rect=this.cacheRect;

        //缓存显示对象
        _box.cache(_rect.x,_rect.y,_rect.width,_rect.height);
        let _cacheCanvas=_box.cacheCanvas;

        let _width=_cacheCanvas.width;
        let _height=_cacheCanvas.height;

        let _canvas = document.createElement("canvas");
        _canvas.width = _width;
        _canvas.height = _height;
        let _context = _canvas.getContext('2d');
        _context.drawImage(_cacheCanvas, 0, 0);

        // 获取到图片上每个点的像素值
        let _data = _context.getImageData(0, 0, _width, _height).data;

        //获取到图片上每个点的像素值的alpha值
        let _alphaArr = [];
        for (let i = 3; i < _data.length; i += 4) {
            _alphaArr.push(_data[i]);
        }

        // 透明度不为0的行数
        let _notAlpha0rows = [];
        // 遍历每一列
        for (let i = 0; i < _height; i++) {
            //遍历每一行  只要每一行中像素的alpha>40 那么就认为这一行是不透明的
            for (let k = 0; k < _width; k++) {
                if (_alphaArr[k + _width * i] > 40) {
                    _notAlpha0rows.push(i);
                    break;
                }
            }
        }
        // console.log(_notAlpha0rows);

        // 每一行文字的其实位置
        let _lineStart = [];
        // 每一行文字的结束位置
        let _lineEnd = [];
        // 两者相减 得到每一行文字的高度；
        let _lineHeight = [];
        // 通过遍历像素 找到起始位置和结束位置
        for (let i = 0; i < _notAlpha0rows.length; i++) {
            if ((i < _notAlpha0rows.length - 1) && (_notAlpha0rows[i + 1] - _notAlpha0rows[i] !== 1)) {
                _lineStart.push(_notAlpha0rows[i + 1]);
                _lineEnd.push(_notAlpha0rows[i]);
            }
        }
        _lineStart.unshift(_notAlpha0rows[0]);
        _lineEnd.push(_notAlpha0rows[_notAlpha0rows.length - 1]);

        // 计算行高
        for (let i = 0; i < _lineEnd.length; i++) {
            _lineHeight.push(_lineEnd[i] - _lineStart[i])
        }
        // 几排文字
        let _rows = _lineHeight.length;
        //------------------- 以上部分 将每行文字的位置 行高 行数 等遍历出来------------
        // 透明度不为0的列  一个二维数组：多少组和每组里alpha不为0的列
        let _notAlpha0Lines = [];
        for (let i = 0; i < _lineHeight.length; i++) {
            let tempArr = [];
            _notAlpha0Lines.push(tempArr);

            for (let k = 0; k < _width; k++) {

                for (let j = 0; j < _lineHeight[i]; j++) {

                    if (_alphaArr[_lineStart[i] * _width + k + _width * j] > 0.5) {
                        _notAlpha0Lines[i].push(k);
                        break;
                    }

                }

            }

        }
        // 得到alpha 不为0的列
        // console.log(_notAlpha0Lines);

        // 计算每一列里每个被切分出来的文字（并不是最终的文字）的起始位置 结束位置 以及宽度
        // 每个文字的起始位置  二维数组
        let _wordStartLineArr = [];
        // 每个文字的结束位置  二维数组
        let _wordEndLineArr = [];
        // 两者相减得到宽度    二维数组
        let _wordWidthArr = [];

        for (let i = 0; i < _lineHeight.length; i++) {
            let tempStartLine = [];
            let tempEndLine = [];
            _wordStartLineArr.push(tempStartLine);
            _wordEndLineArr.push(tempEndLine);
            for (let k = 0; k < _notAlpha0Lines[i].length; k++) {
                if ((k < _notAlpha0Lines[i].length - 1) && (_notAlpha0Lines[i][k + 1] - _notAlpha0Lines[i][k] !== 1)) {
                    _wordStartLineArr[i].push(_notAlpha0Lines[i][k + 1]);
                    _wordEndLineArr[i].push(_notAlpha0Lines[i][k]);
                }
            }
            _wordStartLineArr[i].unshift(_notAlpha0Lines[i][0]);
            _wordEndLineArr[i].push(_notAlpha0Lines[i][_notAlpha0Lines[i].length - 1])
        }
        // 得到了每一行中 每个被切割出来的文字的起始位置
        // console.log(_wordStartLineArr);
        // 得到了每一行中 每个被切割出来的文字的结束位置
        // console.log(_wordEndLineArr);

        // 计算取得所有的宽度
        for (let i = 0; i < _lineHeight.length; i++) {
            let tempArr = [];
            _wordWidthArr.push(tempArr);
            for (let k = 0; k < _wordEndLineArr[i].length; k++) {
                _wordWidthArr[i].push(_wordEndLineArr[i][k] - _wordStartLineArr[i][k])
            }
        }
        // 得到了每一行中 每个被切割出来的文字的宽度
        // console.log(_wordWidthArr);

        // 误差范围的设置   根据每行中的文字的宽度作为参考的文字的宽度
        // 设置每行中最小的宽度
        let _minWidthArr = [];
        // 设置每行中最大的宽度
        let _maxWidthArr = [];
        for (let i = 0; i < _lineHeight.length; i++) {
            // 取所有字体宽度的最大值作为参考
            let _wordWidth = parseInt(Math.max.apply(null, _wordWidthArr[i]));
            // 误差范围
            let _minWidth = parseInt(_wordWidth * 0.8);
            let _maxWidth = parseInt(_wordWidth * 1.25);

            _minWidthArr.push(_minWidth);
            _maxWidthArr.push(_maxWidth);

        }

        // console.log('minWidth' + _minWidthArr);
        // console.log('maxWidth' + _maxWidthArr);

        // ----------------------------------------------------
        // 对每行中被切割出来的文字进行计算和合并  得出最终的文字的位置和宽度
        // 最终的文字的起始位置  二维数组
        let _finalStartLine = [];
        // 最终的文字的结束位置  二维数组
        let _finalEndLine = [];
        // 合并之后文字的个数
        let _num = 0;

        for (let i = 0; i < _lineHeight.length; i++) {
            let tempStart = [];
            let tempEnd = [];
            _finalStartLine.push(tempStart);
            _finalEndLine.push(tempEnd);
            _num = 0;
            for (let k = 0; k < _wordStartLineArr[i].length; k++) {
                if ((_wordEndLineArr[i][k] - _wordStartLineArr[i][_num]) > _minWidthArr[i]) {

                    if ((_wordEndLineArr[i][k] - _wordStartLineArr[i][_num]) > _maxWidthArr[i]) {

                        _finalStartLine[i].push(_wordStartLineArr[i][_num]);
                        _finalEndLine[i].push(_wordEndLineArr[i][_num]);
                        k = _num + 1;
                        _num = k;
                    } else {
                        _finalStartLine[i].push(_wordStartLineArr[i][_num]);
                        _finalEndLine[i].push(_wordEndLineArr[i][k]);
                        _num = k + 1;
                    }
                }else{
                    _finalStartLine[i].push(_wordStartLineArr[i][_num]);
                    _finalEndLine[i].push(_wordEndLineArr[i][k]);
                    _num = k + 1;
                }

            }
            _finalStartLine[i].push(_wordStartLineArr[i][_wordStartLineArr[i].length - 1]);
            _finalEndLine[i].push(_wordEndLineArr[i][_wordStartLineArr[i].length - 1]);
        }


        // console.log(_finalStartLine);
        // console.log(_finalEndLine);

        //--------------切割线已经完成----------

        let _ssData = {
            images: [_canvas],
            frames: []
        };
        let _frames=_ssData.frames;


        //开始创建单个字显示对象
        let index = 0;
        // let domNum = 0;
        for (let i = 0; i < _lineHeight.length; i++) {
            if (i < 1) {
                index = 0;
            } else {
                index+=_finalEndLine[i - 1].length;
            }
            // domNum += _finalEndLine[i].length;
            for (let k = 0; k < _finalEndLine[i].length; k++) {
                let _num=index+k;
                // console.log(_lineHeight[i]);
                let _data=[
                    _finalStartLine[i][k],
                    _lineStart[i],
                    _finalEndLine[i][k] - _finalStartLine[i][k],
                    parseInt(_lineHeight[i])
                ];
                _frames[_num]=_data;
                // console.log('num:',_num,_data);
            }
        }


        // let _tweens=[];
        let _spriteSheet = new createjs.SpriteSheet(_ssData);
        this._spriteSheet=_spriteSheet;
        this._textList=[];
        for (let i = 0; i < _frames.length; i++) {
            let _temp=_frames[i];
            let _sprite = new createjs.Sprite(_spriteSheet);
            _sprite.gotoAndStop(i);
            let _rect = new createjs.Rectangle(_temp[0],_temp[1], _temp[2], _temp[3]);
            _sprite._rect=_rect;
            _sprite.x=_temp[0];
            _sprite.y=_temp[1];
            // console.log(_rect);
            this._view.addChild(_sprite);
            this._textList.push(_sprite);
            _sprite.alpha=0;
        }

       this.initTimeline(this._allTime);

        //释放缓存
        _box.uncache();
    }


    play(value=0){
        this.timeline.gotoAndPlay(value);
    }

    stop(value=0){
        this.timeline.gotoAndStop(value);
    }

    /**
     * 重新设置文字出现时间
     * @param allTime=undefined 不设置会用默认的动画值进行设置动画
     */
    initTimeline(allTime){

        if(this.timeline){
            this.timeline.removeAllEventListeners();
        }

        let _textList=this._textList;

        let _delay=this._delay;
        let _time=this._time;

        if(allTime!==undefined&&allTime!==null){
            _time=allTime/_textList.length;
            _delay=_time;
        }


        this._progress=0;
        let _tweens=[];
        for (let i = 0; i < _textList.length; i++) {
            let _sprite = _textList[i];
            _sprite.alpha=0;
            let _tween=createjs.Tween.get(_sprite)
                .set({alpha:0},_sprite)
                .wait(_delay*1000*i)
                .to({alpha:1},_time*1000);
            _tweens.push(_tween);
        }
        //创建动画时间
        this.timeline=new createjs.Timeline(_tweens,{},{
            loop:false,
            paused:true,
        });



        this.timeline.on('change',()=>{
            this._progress=this.timeline.position/this.timeline.duration;
            if(this._progress===1){
                this.ds('end');
                // console.log('播放完成');
            }
            let _event={
                type:'update',
                time:this.currentTime,
                progress:this._progress,
            };
            this.ds(_event);
        });

        // console.log('duration:',this.duration);

    }

    /**
     * 动画进度
     * @return {number|*}
     */
    get progress(){
        return this._progress;
    }

    /**
     * 显示到多少字
     * @return {number}
     */
    get wordProgress(){
        return this._progress*this._textList.length>>0;
    }

    get currentTime(){
        return this.timeline.position/1000;
    }


    /**
     * 持续时间
     */
    get duration(){
        return this.timeline.duration/1000;
    }

    /**
     * 文字列表
     * @return {Array}
     */
    get textList(){
        return this._textList;
    }
    /**
     * 原父级是否影片剪辑对象
     * @return {boolean|*}
     */
    get parentIsMovieClip(){
        return this._parentIsMovieClip;
    }

    /**
     * 显示对象
     * @return {createjs.Container|*}
     */
    get view(){
        return this._view;
    }
}

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
ds.createjs = ds.createjs || {};
ds.createjs.effect = ds.createjs.effect || {};

ds.createjs.effect.TypingText = TypingText;


export default TypingText;