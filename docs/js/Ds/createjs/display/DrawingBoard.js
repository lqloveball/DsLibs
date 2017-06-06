/**
 * @class Ds.createjs.display.DrawingBoard
 * @classdesc:类说明: 张田维同学的画板类,maksim帮忙修改整理
 * @extends
 * @example: 举例
 *   //创建画板
   var _DrawingBoard=new cagoeAG.display.DrawingBoard(640,1138,{maxHitory:50});
   //可以执行关闭画板绘画功能
   _DrawingBoard.OpenOrCloseDarw(false)


   //可以设置 画笔还是橡皮， 设置画笔还能设置粗细  颜色
   _DrawingBoard.SetPen(true）

   //清空画布
   _DrawingBoard.Clear()

   //清空画布 并且清空所有的历史记录
   _DrawingBoard.ClearAndClearHitory()

   //撤销上一步
   _DrawingBoard.Revoke()

   //导入一个url做贴图
   _DrawingBoard.ImportImageUrl('./images/test.jpg',{max:4,min:.2,drag:false});

   //导入一个create的显示对象做贴图
   var temp=new lib.IconMovie();
   _DrawingBoard.ImportDisplayObject(temp,{max:4,min:.2,drag:false})

   //ImportDisplayObject 与ImportImageUrl 第2给参数说明
   //是否拖动  是否旋转  是否缩放  缩放最小  缩放最大
   //{drag:true,rotation:true,scale:true,min:.2,max:4};
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright: Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
(function() {
    window.Ds = window.Ds || {};
    window.Ds.createjs = window.Ds.createjs || {};
    window.Ds.createjs.display = window.Ds.createjs.display || {};
    window.Ds.createjs.display.DrawingBoard = DrawingBoard;

    function DrawingBoard(w, h, opts) {
        var _Self = this;
        opts=opts||{};
        //最大历史记录
        var _MaxHitory = opts.maxHitory!==undefined?opts.maxHitory:50;
        var _View, _Bitmap, _Canvas, _Context;
        var _PencilColor = 'rgba(0,0,0,0.7)',
            _PencilSize = 5;
        var _PathArray = [];
        var _Stage;
        var _W = w || 546,
            _H = h || 872;

        /*画笔相关*/
        this.IsPen = true;
        var _DarwDown = false;
        //是否打开绘画功能 默认是开启
        var _DarwBool = true;
        /*贴图相关*/
        var _ImportArr = [];
        var _Container = new createjs.Container(); //贴图容器
        var _DragDown = false; //是否拖动贴图
        var _SeletImportDisplay = null; //选择一个贴图
        var _SelectTip = new createjs.Shape(); //贴图的提示对象

        /*缩放 旋转 相关*/
        var _StarPinchScale, _PinchScale = {
            max: 4,
            min: 0.2
        };
        var _StarRotation;
        var _PinchBool = false;

        /*默认操作配置*/
        //是否拖动  是否旋转  是否缩放  缩放最小  缩放最大
        var _DefaultDarwData = {
            drag: true,
            rotation: true,
            scale: true,
            min: 0.2,
            max: 4
        };




        /**
         * 初始化这个画板
         */
        function Init() {

            _View = new createjs.Container();
            _Self.View = _View;
            _Canvas = document.createElement("canvas");
            $(_Canvas).attr('width', _W);
            $(_Canvas).attr('height', _H);

            var _graphics = new createjs.Graphics().beginFill("#ff0000").drawRect(0, 0, _W, _H);
            var _shape = new createjs.Shape(_graphics);
            _View.addChild(_shape);
            _shape.alpha = 0.01;

            _Bitmap = new createjs.Bitmap(_Canvas);
            _Self.Bitmap = _Bitmap;
            _View.addChild(_Bitmap);

            _View.addChild(_Container);

            _Context = _Canvas.getContext("2d");
            var _imgData = _Context.getImageData(0, 0, _Canvas.width, _Canvas.height);
            _PathArray.push(_imgData);
            _View.on('mousedown', DarwDownEvent);


            touch.on($('body')[0], 'pinchstart', PinchStartEvent);
            touch.on($('body')[0], 'pinchend', PinchEndEvent);
            touch.on($('body')[0], 'pinch', PinchEvent);
            touch.on($('body')[0], 'rotate', RotationEvent);
        }

        function PinchStartEvent(e) {
            if (_View && !_View.stage) return;
            if (!_SeletImportDisplay) return;
            _StarPinchScale = _SeletImportDisplay.scaleX;
            _StarRotation = _SeletImportDisplay.rotation;
            _PinchBool = true;
        }

        function PinchEndEvent(e) {
            _PinchBool = false;
        }

        function RotationEvent(e) {
            if (_View && !_View.stage) return;
            if (!_SeletImportDisplay) return;
            if (!_SeletImportDisplay.darwData.rotation) return;
            log(e.rotation);
            _SeletImportDisplay.rotation = _StarRotation + e.rotation;

        }

        function PinchEvent(e) {
            if (_View && !_View.stage) return;
            if (!_SeletImportDisplay) return;
            clearTimeout(_RemoveSelectImportDisplayTimer);

            if (!_SeletImportDisplay.darwData.scale) return;
            var _scale = e.scale - 1;
            var _dScale = _StarPinchScale + _scale;
            var _pScale = _SeletImportDisplay.darwData || _PinchScale;
            if (_dScale < _pScale.min) _dScale = _pScale.min;
            if (_dScale > _pScale.max) _dScale = _pScale.max;
            _SeletImportDisplay.scaleX = _SeletImportDisplay.scaleY = _dScale;


        }
        /**
         * 导入一个贴图来至 url
         * @param {[type]} url [description]
         * @param {[type]} darwData [贴图参数]
         */
        this.ImportImageUrl = function(url, darwData) {
            var _img = new Image();
            var _bitmap = new createjs.Bitmap(_img);
            var _display = new createjs.Container(); //贴图容器
            _display.addChild(_bitmap);
            _img.onload = function() {
                var _rect = _display.getBounds();
                _display.regX = _rect.width / 2 >> 0;
                _display.regY = _rect.height / 2 >> 0;
                _display.rect = _rect;
            };
            _img.src = url;
            _ImportArr.push(_display);
            if (_display.mouseChildren) _display.mouseChildren = false;
            _display.type = 'ImportDisplayObject';
            _Container.addChild(_display);
            _display.scaleX = _display.scaleY = 1;

            _display.x = _W / 2;
            _display.y = _H / 2;

            _display.darwData = darwData || _DefaultDarwData;
            __Extend(_display.darwData, _DefaultDarwData);
            var _data = {
                type: 'add',
                mc: _display
            };
            AddHitory(_data);
        };

        /**
         * 导入一个显示对象
         * @param {[type]} display [description]
         * @param {[type]} darwData [description]
         */
        this.ImportDisplayObject = function(display, darwData) {
            log('ImportDisplayObject', _W, _H);
            var _display = display;
            _ImportArr.push(_display);
            if (_display.mouseChildren) _display.mouseChildren = false;
            _display.type = 'ImportDisplayObject';

            _Container.addChild(_display);

            _display.scaleX = _display.scaleY = 1;


            var _rect = _display.getBounds();
            _display.regX = _rect.width / 2 >> 0;
            _display.regY = _rect.height / 2 >> 0;

            _display.rect = _rect;
            _display.x = _W / 2;
            _display.y = _H / 2;

            _display.darwData = darwData || _DefaultDarwData;
            __Extend(_display.darwData, _DefaultDarwData);

            var _data = {
                type: 'add',
                mc: _display
            };
            AddHitory(_data);

        };
        /**
         * 撤销
         */
        this.Revoke = function() {
            log("_PathArray old:", _PathArray.length);
            if (_PathArray.length <= 0) return;
            var _imgData = _PathArray.pop();
            log("_PathArray now:", _PathArray.length, _imgData);
            //_Context.clearRect(0, 0, _Canvas.width, _Canvas.height);
            var _mc;
            if (_imgData.type) {
                if (_imgData.type == 'add') {
                    log('add');
                    _mc = _imgData.mc;
                    if (_Container.contains(_mc)) _Container.removeChild(_mc);
                }
                if (_imgData.type == 'change') {
                    _mc = _imgData.mc;

                    _mc.x = _imgData.x;
                    _mc.y = _imgData.y;
                    _mc.scaleX = _mc.scaleY = _imgData.scale;
                    _mc.rotation = _imgData.rotation;

                }
            } else {
                _Context.putImageData(_imgData, 0, 0);
            }
        };
        /**
         * 清空画布
         */
        this.Clear = function() {
            _Context.clearRect(0, 0, _Canvas.width, _Canvas.height);
            _ImportArr = [];
            _Container.removeAllChildren();
            RemoveSelectImportDisplay();
        };
        /**
         * 清空画笔并且撤销历史记录
         */
        this.ClearAndClearHitory = function() {
            _Context.clearRect(0, 0, _Canvas.width, _Canvas.height);
            _PathArray = [];
            _Context = _Canvas.getContext("2d");
            var _imgData = _Context.getImageData(0, 0, _Canvas.width, _Canvas.height);
            _PathArray.push(_imgData);

            _ImportArr = [];
            _Container.removeAllChildren();
            RemoveSelectImportDisplay();
        };

        /*选择一个导入贴图对象*/
        function SelectImportDisplay(display) {
            var _graphics = _SelectTip.graphics;
            _graphics.clear();
            _graphics.setStrokeStyle(4, "round").beginStroke("#F00").drawRect(0, 0, display.rect.width, display.rect.height);
            display.addChild(_SelectTip);
            _SeletImportDisplay = display;

            var _data = {
                type: 'change',
                mc: display,
                x: display.x,
                y: display.y,
                scale: display.scaleX,
                rotation: display.rotation,
            };
            _tempData = _PathArray[_PathArray.length - 1];
            if (_tempData) {
                log((_tempData.type == _data.type &&
                    _tempData.mc == _data.mc &&
                    _tempData.x == _data.x &&
                    _tempData.y == _data.y &&
                    _tempData.scale == _data.scale &&
                    _tempData.rotation == _data.rotation
                ));
                log(_tempData.type == _data.type,
                    _tempData.mc == _data.mc,
                    _tempData.x == _data.x,
                    _tempData.y == _data.y,
                    _tempData.scale == _data.scale,
                    _tempData.rotation == _data.rotation
                );
                if (_tempData.type == _data.type &&
                    _tempData.mc == _data.mc &&
                    _tempData.x == _data.x &&
                    _tempData.y == _data.y &&
                    _tempData.scale == _data.scale &&
                    _tempData.rotation == _data.rotation
                ) {

                    //更改参数都一样就不做变化
                    return;
                }
            }
            AddHitory(_data);
        }
        var _RemoveSelectImportDisplayTimer, _RemoveSelectImportDisplayTime = 2500;
        /*开始删除选择的贴图对象*/
        function RemoveSelectImportDisplay() {
            clearTimeout(_RemoveSelectImportDisplayTimer);
            var _temp = _SeletImportDisplay;
            if (_SelectTip.parent) _SelectTip.parent.removeChild(_SelectTip);
            _SeletImportDisplay = null;
        }
        /*准备删除选择贴图*/
        function ReadyRemoveSelectImportDispla(delay) {
            clearTimeout(_RemoveSelectImportDisplayTimer);
            _RemoveSelectImportDisplayTimer = setTimeout(RemoveSelectImportDisplay, delay);
        }
        /**
         * 设置画笔
         * @param {[Boolean]} type  [画笔类型 true画笔  false橡皮檫]
         * @param {[type]} value [画笔大小]
         * @param {[type]} color [画笔颜色]
         */
        this.SetPen = function(type, value, color) {
            this.IsPen = type;
            _PencilSize = value || _PencilSize;
            _PencilColor = color || _PencilColor;
            //设置画笔时候说明 要马上开始画画了 所以不要选择一个贴图
            RemoveSelectImportDisplay();
        };
        /**
         * 是否开启绘画功能
         * @param {[type]} bool [true 开启  false 关闭]
         */
        this.OpenOrCloseDarw = function(bool) {
            _DarwBool = bool;
        };
        /**
         * 添加历史记录
         */
        function AddHitory(data) {
            _PathArray.push(data);
            if (_PathArray.length > _MaxHitory) _PathArray.shift();
            log("_PathArray push:", _PathArray.length);
        }
        var _PointerID = null;
        /**/
        function DarwDownEvent(e) {
            //添加滑动监听
            if (_View && !_View.stage) {
                _DarwDown = false;
                return;
            }
            if (_PointerID) return;
            _PointerID = e.pointerID;
            log('DarwDownEvent:', e.target);

            clearTimeout(_RemoveSelectImportDisplayTimer);
            var _temp = e.target;
            if (_temp.type == 'ImportDisplayObject') {
                _DarwDown = false;
                _DragDown = true;
                SelectImportDisplay(_temp);
            } else {

                if (_SeletImportDisplay) {
                    if (!_DarwBool) {
                        ReadyRemoveSelectImportDispla(500);
                        _PointerID = null;
                        _DragDown = false;
                        return;
                    }
                    ReadyRemoveSelectImportDispla(1000);
                    _PointerID = null;
                    _DragDown = false;
                    return;
                }
                _DarwDown = true;
            }

            _Stage = _View.stage;
            _Stage.addEventListener('stagemouseup', StageUp);
            _Stage.addEventListener('stagemousemove', StageMove);

            var _pt = _Bitmap.globalToLocal(e.stageX, e.stageY);
            if (_DarwDown && _DarwBool) {
                //历史记录
                var _imgData = _Context.getImageData(0, 0, _Canvas.width, _Canvas.height);
                AddHitory(_imgData);
                //开始绘制或者擦除
                if (_Self.IsPen) {
                    _Context.globalCompositeOperation = "source-over";
                    //设置线条样式和起点位置
                    _Context.strokeStyle = _PencilColor; //线条颜色：绿色
                    _Context.lineWidth = _PencilSize; //设置线宽
                    _Context.beginPath();
                    _Context.moveTo(_pt.x, _pt.y);
                } else {
                    _Context.globalCompositeOperation = "destination-out";
                    _Context.moveTo(_pt.x, _pt.y);
                }
            }

        }

        function StageMove(e) {
            log('StageMove');
            if (_View && !_View.stage) return;

            if (_PointerID != e.pointerID) return;

            var _pt = _Bitmap.globalToLocal(e.stageX, e.stageY);

            if (_DarwDown && _DarwBool) {
                if (_Self.IsPen) {
                    //开始画线
                    _Context.lineTo(_pt.x, _pt.y);
                    _Context.stroke(); //画线框
                } else {
                    _Context.beginPath();
                    _Context.arc(_pt.x, _pt.y, 20, 0, Math.PI * 2);
                    _Context.strokeStyle = "rgba(250,250,250,0)"; //使用颜色值为白色，透明为0的颜色填充
                    _Context.fill();
                }
            }

            if (_DragDown && _SeletImportDisplay) {
                if (_PinchBool) return;

                if (_SeletImportDisplay.darwData.drag) {
                    _SeletImportDisplay.x = _pt.x;
                    _SeletImportDisplay.y = _pt.y;
                }

            }

        }

        function StageUp(e) {
            //移除滑动监听
            if (_View && !_View.stage) return;
            if (_PointerID != e.pointerID) return;

            _Stage.removeEventListener('stagemouseup', StageUp);
            _Stage.removeEventListener('stagemousemove', StageMove);
            _Stage = null;
            _PointerID = null;

            _DarwDown = false;
            _DragDown = false;
            //ReadyRemoveSelectImportDispla(2000);


        }
        Init();
    }
    /*扩展用的*/
    function __Extend(target, source, cover) {
        var key;
        for (key in source) {
            if (cover) {
                target[key] = source[key];
            } else {
                if (source[key] !== undefined && target[key] === undefined) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    }

})();
