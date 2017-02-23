/**
 * @class 快速加载队列
 * @classdesc:类说明:
 * @extends
 * @example: 举例
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  我发起Ds库目的，简化方便工作项目开发。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里代码很多也都来源至或参考网络开源开放代码，所以这个库也开源开放。更多希望团队成员把积累工作中常用的代码，加快自己开发效率。
 * @constructor
 **/
!(function (factory) {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);

    if (typeof define === 'function' && define.amd) {
        define(['exports'], function (exports) {
            module.exports= factory(root, exports);
        });
    } else if (typeof exports !== 'undefined') {
        module.exports=factory(root, exports);
    } else {
      factory(root, {});
    }

}(function (root, modelObj) {
  root.Ds = root.Ds || {};
  root.Ds.gemo = root.Ds.gemo || {};
  root.Ds.gemo.QueueLoad=new QueueLoad();

  function QueueLoad(){
    /**
     * 图片加载队列
     * @param {[type]} opts [队列加载图片]
     * opts.basePath
     * opts.list
     * opts.progress
     * opts.complete
     */
    this.ImageQueueLoad=function(opts){
      var _complete=opts.complete;
      var _progress=opts.progress;
      var _list=opts.list!==undefined?opts.list:[];
      var _basePath=opts.basePath!==undefined?opts.basePath:'';
      var _queueArr=[];
      var _loadNum=0;
      if(_list.length<=0){
        console.warn('加载队列未空');
        if(_complete!==undefined)_complete();
        return;
      }
      for (var i = 0; i < _list.length; i++) {
        var _obj=_list[i];
        if(typeof(_obj)==='string')_obj={src:_obj};
        _obj.src = _basePath + _obj.src;
        var _img=new Image();
        _img.onload=progress;
        _img.onerror=progress;
        _obj.img=_img;
        _queueArr.push(_obj);
      }
      //开始加载
      startLoad();
      //开始加载
      function startLoad(){
          _obj=_queueArr[0];
          _img=_obj.img;
          _img.src=_obj.src;
      }
      //队列加载完成
      function complete(){
        if(_progress!==undefined)_progress(1);
        if(_complete!==undefined)_complete();
      }
      //队列加载进度
      function progress(){
        _loadNum++;
        if(_loadNum>=_queueArr.length){
          complete();
          return;
        }
        _obj=_queueArr[_loadNum];
        _img=_obj.img;
        _img.src=_obj.src;
        if(_progress!==undefined)_progress(_loadNum/_queueArr.length);
      }


    };
  }

  return root.Ds.gemo.QueueLoad;
}));
