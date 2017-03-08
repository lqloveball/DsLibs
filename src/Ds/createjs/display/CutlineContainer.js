/**
 * @class Ds.display.CutlineContainer
 * @classdesc:切西瓜线类
 * @extends
 * @example: 举例
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/

!(function() {
    window.Ds = window.Ds || {};
    window.Ds.createjs = window.Ds.createjs || {};
    window.Ds.createjs.display = window.Ds.createjs.display || {};


    function CutlineContainer() {
        // this.Container_constructor();
        var _Self = this;
        var _Linelist = [];
        /*当前切线组*/
        this.Linelist = _Linelist;
        //准备删除的线
        this.ReMoveList = [];
        /*舞台对象*/
        var _Stage;
        /*当下移动鼠标ID*/
        // var _NowMouseID=null;
        /*初始化*/
        this.Init = function() {
            if (_Stage) return;
            _Stage = this.stage;
            _Stage.addEventListener('stagemousedown', StageDown);
            _Stage.addEventListener('stagemousemove', StageMove);
            _Stage.addEventListener('stagemouseup', StageUp);
            createjs.Ticker.addEventListener("tick", HandleTick);
            // log('Init')
        };
        /*删除事件*/
        this.RemoveEvent = function() {
            _Stage.removeEventListener('stagemousedown', StageDown);
            _Stage.removeEventListener('stagemousemove', StageMove);
            _Stage.removeEventListener('stagemouseup', StageUp);
            createjs.Ticker.removeEventListener("tick", HandleTick);
            _Stage = null;
            _Linelist = [];
            _Self.Linelist = _Linelist;
            _Self.ReMoveList = [];

        };
        /*切线计算*/
        function HandleTick() {
            var i;
            var _cutline;
            for (i = 0; i < _Self.Linelist.length; i++) {
                _cutline = _Self.Linelist[i];
                _cutline.UpData();
            }
            for (i = 0; i < _Self.ReMoveList.length; i++) {
                _cutline = _Self.ReMoveList[i];
                _cutline.UpData();
                if (_cutline.Linelist.length <= 0) {
                    _Self.ReMoveList.splice(i, 1);
                    // log('删除一个切线')
                    if (_cutline.parent) _cutline.parent.removeChild(_cutline);
                }
            }
            // if(_NowMouseID){
            //     _cutline=GetCutlineByID(_NowMouseID);
            //     _cutline.AddNewLine(_Stage.mouseX,_Stage.mouseY);
            // }
        }
        /*查询一个ID线*/
        function GetCutlineByID(id) {
            for (var i = 0; i < _Linelist.length; i++) {
                var _cutline = _Linelist[i];
                if (_cutline.ID == id) return _cutline;
            }
            return null;
        }
        /*根据ID删除这个线*/
        function RemoveCutlineByID(id) {
            for (var i = 0; i < _Linelist.length; i++) {
                var _cutline = _Linelist[i];
                if (_cutline.ID == id) {
                    _Linelist.splice(i, 1);
                    return _cutline;
                }
            }

        }

        function StageDown(e) {
            // log('StageDown:',e,e.pointerID);
            var _cutline = GetCutlineByID(e.pointerID);
            if (!_cutline) {
                var _color = '#FF0000';
                if (e.stageY < window.innerHeight / 2) {
                    _color = '#0099FF';
                }
                _cutline = new Cutline(e.pointerID, e.stageX, e.stageY, _color);
                _Linelist.push(_cutline);
                _Self.addChild(_cutline);
            }
        }

        function StageUp(e) {
            // log('StageUp:',e,e.pointerID)
            var _cutline = RemoveCutlineByID(e.pointerID);
            _Self.ReMoveList.push(_cutline);
        }

        function StageMove(e) {
            // log('StageMove:',e,e.pointerID);
            // _NowMouseID=e.pointerID;
            var _cutline = GetCutlineByID(e.pointerID);
            // _cutline.X=e.stageX;
            // _cutline.Y=e.stageY;
            if (_cutline) {
                _cutline.AddNewLine(e.stageX, e.stageY);
            }
            //测试
            var info = '';
            for (var i = 0; i < _Linelist.length; i++) {
                _cutline = _Linelist[i];
                info += _cutline.ID + ' >' + _cutline.X + '/' + _cutline.Y + '/' + _cutline.Linelist.length + '<br>';
            }
            // $('#debug').text(info);

        }
    }
    var p = createjs.extend(CutlineContainer, createjs.Container);
    window.Ds.createjs.display.CutlineContainer = createjs.promote(CutlineContainer, "Container");

    /**
     * 切线
     * @param {[type]} id     [description]
     * @param {[type]} mouseX [description]
     * @param {[type]} mouseY [description]
     * @param {[type]} color  [description]
     */
    function Cutline(id, mouseX, mouseY, color) {
        var _Self = this;
        this.ID = id;
        this.X = 0;
        this.Y = 0;
        var _Linelist = [];
        var _CacheX, _CacheY;
        _CacheX = mouseX;
        _CacheY = mouseY;
        this.Linelist = [];
        var _Color = color;
        this.AddNewLine = function(mouseX, mouseY) {
            var _line = new SlidingLine(_Self, _CacheX, _CacheY, mouseX, mouseY, _Color);
            _CacheX = mouseX;
            _CacheY = mouseY;
            this.X = _CacheX;
            this.Y = _CacheY;
            this.Linelist.push(_line);
        };

        this.UpData = function() {
            for (var i = 0; i < _Self.Linelist.length; i++) {
                var _line = _Self.Linelist[i];
                _line.UpData();
            }
        };

    }
    createjs.extend(Cutline, createjs.Container);
    createjs.promote(Cutline, "Container");

    /**
     * 线的类
     * @param {[type]} cutlineBox [description]
     * @param {[type]} sX         [description]
     * @param {[type]} sY         [description]
     * @param {[type]} eX         [description]
     * @param {[type]} eY         [description]
     * @param {[type]} color      [description]
     */
    function SlidingLine(cutlineBox, sX, sY, eX, eY, color) {

        var _Self = this;
        var _View = new createjs.Shape();
        this.View = _View;
        var _Graphics = _View.graphics;

        var _SX = sX;
        var _SY = sY;
        var _EX = eX;
        var _EY = eY;
        var _Linesize = 13;
        var _Color = color || "#0598a4";
        this.Draw = function() {
            _Graphics.clear();
            _Graphics.setStrokeStyle(_Linesize, "round").beginStroke(_Color);
            _Graphics.moveTo(_SX, _SY);
            _Graphics.lineTo(_EX, _EY);
            _Graphics.endFill(_EX, _EY);
        };

        this.UpData = function() {
            this.Draw();
            _Linesize -= 1;
            if (_Linesize < 1) _Self.Clear();
        };

        this.Clear = function() {

            _Graphics.clear();

            if (_View.parent) _View.parent.removeChild(_View);

            for (var i in _Linelist) {
                if (_Linelist[i] == this) _Linelist.splice(i, 1);
            }
        };

        var _CutlineBox = cutlineBox;
        var _Linelist = _CutlineBox.Linelist;
        _CutlineBox.addChild(_View);
        _Linelist.push(this);
        _Self.Draw();
    }
})();
