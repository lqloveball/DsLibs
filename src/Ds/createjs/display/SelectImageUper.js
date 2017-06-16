!(function (factory) {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);

    if (typeof define === 'function' && define.amd) {
        define(['exports'], function (exports) {
            require('libs/shrek/imgslterV.js'); //图片选择上传
            module.exports= factory(root, exports);
        });
    } else if (typeof exports !== 'undefined') {
        module.exports=factory(root, exports);
    } else {
         factory(root, {});
    }

}(function (root, modelObj) {

  root.Ds = root.Ds || {};
  root.Ds.createjs = root.Ds.createjs || {};
  root.Ds.createjs.display = root.Ds.createjs.display || {};
  root.Ds.createjs.display.SelectImageUper=SelectImageUper;
  /**
   * 快速图片上传选择器
   * @param       {[Number]} width [选择器对图片进行压缩处理]
   * @param       {[createjs.Container()]} box   [处理完成后]
   * @param       {[Boolean]} hasEdit   [是否需要进行再次编辑，需要二次编辑考虑中间缩放，不二次编辑 位置会按00点摆放]
   * @param       {[Object]} opts  [详细设置参数]
   * opts.layoutType  默认：outSide撑满容器 inSide缩放到容器内
   * opts.width  显示区域  如果不做编辑就是做裁切区域
   * opts.height  显示区域 如果不做编辑就是做裁切区域
   * @constructor
   */
  function SelectImageUper(width,box,hasEdit,opts){
    var _Self=this;
    Ds.Extend(this, new Ds.EventDispatcher());
    opts=opts||{};

    var _Width=width||1100;
    var _HasEdit=hasEdit!==undefined?hasEdit:true;//是否需要编辑  变
    var _Type=opts.type||'jpg';
    var _Quality=opts.quality||0.5;

    var _Box=box||null;

    var _LayoutType=opts.layoutType!==undefined?opts.layoutType:'outSide'; //outSide撑满容器 inSide缩放到容器内
    var _LayoutWidth=opts.width!==undefined?opts.width:null; //进行缩放大小
    var _LayoutHeight=opts.height!==undefined?opts.height:_LayoutWidth; //进行缩放大小
    /**
     * 选择上传
     * @return {[type]} [description]
     */
    this.Select=function () {
      _SelectImager.select();
    };
    //选择器
    var _SelectImager;
    /**
     * 创建一个选择器
     * @constructor
     */
    function CreateSelectImager() {
      _SelectImager = new ImgSlter({
        size: _Width,
        type: _Type,
        quality: _Quality,
      });
      _SelectImager.handler = UpImageData;
    }
    /**
     * 图片上传完成
     * @param       {[type]} data [description]
     * @constructor
     */
    function UpImageData(data) {
      var _img = new Image();
      var _base64=data.img;
      _img.onload = function() {
        var _bitmap=null;
        var _box=null;
        var _ss=1;
        console.log(_LayoutWidth,_LayoutHeight);
        if(_LayoutWidth!==null&&_LayoutHeight!==null){
          var _w = _LayoutWidth,
            _h = _LayoutHeight;
          var _sw = _w / _img.width;
          var _sh = _h / _img.height;
          if (_LayoutType == 'inSide') _ss = Math.min(_sw, _sh);
          else  _ss = Math.max(_sw, _sh);
        }


        if(createjs){
          _bitmap= new createjs.Bitmap(_img);
          _box = new createjs.Container();
          _box.addChild(_bitmap);
          _bitmap.scaleX = _bitmap.scaleY = _ss;
          _bitmap.width = _img.width * _ss;
          _bitmap.height = _img.height* _ss;
          _bitmap.x = -_bitmap.width/ 2;
          _bitmap.y = -_bitmap.height/ 2;

        }
        // console.log('_HasEdit:',_HasEdit);
        //是否编辑
        if(_HasEdit){
          //编辑进行居中
          if(_LayoutWidth!==null&&_LayoutHeight!==null){
            _box.x=_LayoutWidth/2;
            _box.y=_LayoutHeight/2;
          }
          //有呈现容器 添加到呈现容器中
          if(_Box){
            _Box.removeAllChildren();
            _Box.addChild(_box);
          }
        }else{
          //不需要编辑 但有呈现区域，那就需要做裁切
          if(_LayoutWidth!==null&&_LayoutHeight!==null){
            var _container = new createjs.Container();
            _container.addChild(_box);
            _box.x=_LayoutWidth/2;
            _box.y=_LayoutHeight/2;
            _container.cache(0, 0, _LayoutWidth, _LayoutHeight);
            _base64=_container.cacheCanvas.toDataURL('image/jpeg');
            _img = new Image();
            _img.src = _base64;
            if(_bitmap)_bitmap.image=_img;
            // _img.onload = function() {
              // if(_bitmap)_bitmap.image=_img;
            // }
          }
          _box.x=0;
          _box.y=0;
          _bitmap.x =0;
          _bitmap.y =0;
          _bitmap.scaleX = _bitmap.scaleY = 1;
          if(_Box){
            _Box.removeAllChildren();
            _Box.addChild(_box);
          }
        }

        _Self.ds({
          type:'update',
          img:_img,//images标签
          bmp:_bitmap,//bmp对象
          box:_box,//摆放的容器
          base64:_base64,//上传上来的base64数据
        });
      };
      _img.src = _base64;
      _SelectImager.destroy();
      CreateSelectImager();
    }

    CreateSelectImager();
  };

  return root.Ds.SelectImageUper;
}));
