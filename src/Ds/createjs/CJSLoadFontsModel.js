/**
 * @class Ds.createjs.CJSLoadFontsModel
 * @param {[String]} pathUrl ['./fonts/HWXHOTxt/'];
 * @classdesc: 动态字体类
 * @extends
 * @example:
 *

   //创建动态字体类
   var _FontsModel=new Ds.createjs.CJSLoadFontsModel('./fonts/HYTT/');
   _FontsModel.on('loadFontsComplete',LoadFontsComplete);

   //字体排列容器
   var _FontsContainer=new createjs.Container();
   _Root.addChild(_FontsContainer);

   //需要加载的动态字体加载完成
   function LoadFontsComplete(){
     // console.log('loadFontsComplete');
     // console.log(_FontsModel.GetFontData('我'));
     // console.log(_FontsModel.GetFontPathData('测'));
     _InitInfo=_UserSend[0].value;
     _FontsContainer.removeAllChildren();
     var _all=_InitInfo.length;
     for (var i = 0; i < _all; i++) {
       var _info=_InitInfo[i];
       // console.log(_info);
       var _font=_FontsModel.GetShapeFont(_info,'#000000',_FontSize);
       _FontsContainer.addChild(_font);
       _font.x=_FontSize*i;
     }
   }

   //输入框更新
   function ChangeTextShow(){
     _InitInfo=_UserSend[0].value;
     _FontsModel.LoadUserWordFonts(_InitInfo);
   }
   //获取输入框变化 更新动态字体
   var _InitInfo,_FontSize=20;
   var _UserSend=$('#userSend');
   _UserSend.on('change',ChangeTextShow);

   //默认执行一个更新文本
   ChangeTextShow();

 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
 * @constructor
 **/
(function (factory) {
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

  root.Ds=root.Ds ||{};
  root.Ds.createjs=root.Ds.createjs ||{};
  root.Ds.createjs.CJSLoadFontsModel=CJSLoadFontsModel;
  /**
   * 动态字体类
   * @param {[String]} pathUrl [加载字体的项目对路径'./fonts/HWXHOTxt/'];
   */

  function CJSLoadFontsModel(pathUrl){
          var _Self=this;
          //基于事件扩展 AS.Eventer
          Ds.Extend(this, new Ds.EventDispatcher());
          var _PathUrl=pathUrl;
          var _UserFontsDc={};
          this.UserFontsDc=_UserFontsDc;
          // var _UserFontsBoxDc={}
          /**
           * 加载需要的文本内容的字体
           * @param {[String]} nowInfo [description]
           */
          this.LoadUserWordFonts=function (nowInfo){
              //字符打散成数组
              var textArr=nowInfo.split('');
              //创造需要加载字符列表字典作为判断不需要重复加载
              var textDc={};
              //创建需要加载字符列表
              var textManifest=[];
              var textCodeList=[];
              for (var i = 0; i < textArr.length; i++) {
                  //str2unicode(textArr[i])//
                 var info= textArr[i].charCodeAt(0);
                  // console.log(info);
                 if(!textDc[info]&&!_UserFontsDc[info]){
                      var url=_PathUrl+info+'.txt';
                      textDc[info]={id:info, src:url};
                      textManifest.push(textDc[info]);
                      textCodeList.push(info);
                 }
              }
              if(textManifest.length<=0){
                _Self.ds({type:'loadFontsComplete'});
                return;
              }
              // log('loadUserFonts length:',textManifest.length);
              var queue = new createjs.LoadQueue(true);
              queue.loadManifest(textManifest);
              queue.on("complete",loadComplete);
              //开始绘制字体
              function loadComplete(){

                  for (var i = 0; i < textCodeList.length; i++) {
                      var code=textCodeList[i];
                      var drawData= queue.getResult(code);
                      // log(drawData)
                      _UserFontsDc[code]=drawData;
                  }
                  // log('loadUserFonts complete');
                  _Self.ds({type:'loadFontsComplete'});
              }
          };
          /**
           * 获取原始的SVG描述文件
           * @param  {[type]} value [description]
           * @return {[type]}       [description]
           */
          this.GetFontData=function(value){
              var code= value.charCodeAt(0);
              // log(code)
              return _UserFontsDc[code];
          };
          /**
           * 获取转义过的SVG数据
           * @param  {[type]} value [description]
           * @return {[type]}       [description]
           */
          this.GetFontPathData=function(value){
              var pathString=_Self.GetFontData(value);
              return AnalysisPathData(pathString);
          };
          /**
           * [GetShapeFont description]
           * @param {[type]} value [description]
           * @param {[type]} color [description]
           * @param {[type]} size [description]
           */
          this.GetShapeFont=function(value,color,size){
              // var code= value.charCodeAt(0);
              // if(_UserFontsBoxDc[code]){
              //     var font = new createjs.Container();
              //     if(font.shape){
              //     }
              // }
              var pathData=_Self.GetFontPathData(value);
              // log('GetShapeFont1');
              var font = new createjs.Container();
              // var fonts
              if(!pathData)return font;
              // log('GetShapeFont2')
              var shape=DrawFontByPathData(pathData,color);
              font.shape=shape;
              font.addChild(shape);
              shape.scaleY=-1;
              shape.y=1000;
              if(size!==undefined){
                  // log(size);
                  var s=size/1000;
                  shape.scaleY=-s;
                  shape.scaleX=s;
                  shape.y=1000*s;
              }

              return font;
          };
          // this.DrawFont
          //绘制单个文字
          /**
           * 根据PathData绘制字体
           * @param  {[type]} data  [description]
           * @param  {[type]} color [description]
           * @return {[type]}       [description]
           */
          function DrawFontByPathData(pathData,color){
              var shape=new createjs.Shape();
              // console.log('DrawFontByPathData1');
              if(!pathData||pathData.length===0)return shape;
              // console.log('drawFontByPathData2',pathData.length);
              var g=shape.graphics;
              // g.clear();
              g.beginFill(color);
              for (var i = 0; i < pathData.length; i++) {
                  var gdata=pathData[i];
                  draw(gdata,i);
              }
              g.endFill();

              function draw(gdata,i){
                  var type=gdata.type;
                  var arr=gdata.arr;
                  // console.log(i,'draw ',type,arr);
                  if(type==='M') {
                    g.moveTo(arr[0], arr[1]);

                  }
                  if(type==='L') {
                      // log('draw L',arr)
                      g.lineTo(arr[0], arr[1]);
                  }
                  if(type==='BC') {
                    g.bezierCurveTo(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]);
                  }
                  if(type==='QC') {
                    g.quadraticCurveTo(arr[0], arr[1], arr[2], arr[3]);
                  }
                  if(type==='E'){
                     g.endFill();
                  }

              }
              return shape;
          }
          /**
           * 分析SVG数据 成可以绘制使用数据
           * @param  {[String]} path
           * @return {[Array]}
           *
           *  M moveto  移动到 (x y)+
              Z closepath  关闭路径 (none)
              L lineto  画线到 (x y)+
              H horizontal lineto  水平线到 x+
              V vertical lineto  垂直线到 y+
              C curveto  三次贝塞尔曲线到 (x1 y1 x2 y2 x y)+
              S smooth curveto  光滑三次贝塞尔曲线到 (x2 y2 x y)+
              Q quadratic Bézier curveto  二次贝塞尔曲线到 (x1 y1 x y)+
              T smooth quadratic Bézier curveto  光滑二次贝塞尔曲线到 (x y)+
              A elliptical arc  椭圆弧 (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+
              R Catmull-Rom curveto*  Catmull-Rom曲线 x1 y1 (x y)+
           */
          function AnalysisPathData(path){
                  // log('AnalysisPathData1')
                  var result=[];
                  if(!path)return result;
                   // log('AnalysisPathData2')
                  // var d = path;
                  var currentPoint = [0,0];
                  var lastControl = [0,0];
                  var actionReg = /([a-z])([^a-z]*)/gi;
                  for (var reg = "1"; reg;) {
                      reg = actionReg.exec(path);
                      if (reg) {
                          var type = (reg[1]+"").toLocaleUpperCase();
                          var param = reg[2];
                          var drawData={type:type};
                          result.push(drawData);
                          // log(type,param.length);
                          switch (type){
                              case "M":
                                  param = param.replace(/,/g," ");
                                  param = param.replace(/-/g," -");
                                  param = param.trim().split(" ");
                                  currentPoint[0] = +(param[0]);
                                  currentPoint[1] = +(param[1]);
                                  drawData.type='M';
                                  drawData.arr=[currentPoint[0],currentPoint[1]];

                                  // ctx.moveTo.apply(ctx,currentPoint);
                                  break;
                              case "L":
                                  param = param.replace(/,/g," ");
                                  param = param.replace(/-/g," -");
                                  param = param.trim().split(" ");
                                  currentPoint[0] = +(param[0]);
                                  currentPoint[1] = +(param[1]);

                                  drawData.type='L';
                                  drawData.arr=[currentPoint[0],currentPoint[1]];
                                  // ctx.lineTo.apply(ctx,currentPoint);
                                  break;
                              case "H":
                                  currentPoint[0] = +(param);
                                  drawData.type='H';
                                  drawData.arr=[currentPoint[0],currentPoint[1]];
                                  // ctx.lineTo.apply(ctx,currentPoint);
                                  break;

                              case "V":
                                  currentPoint[1] = +(param);
                                  drawData.type='V';
                                  drawData.arr=[currentPoint[0],currentPoint[1]];
                                  // ctx.lineTo.apply(ctx,currentPoint);
                                  break;
                              case "Z":
                                  drawData.type='E';
                                  drawData.arr=[];
                                  break;
                              case "C":
                                  param = param.replace(/,/g," ");
                                  param = param.replace(/-/g," -");
                                  param = param.trim().split(" ");
                                  param[0] = +param[0];
                                  param[1] = +param[1];
                                  param[2] = +param[2];
                                  param[3] = +param[3];
                                  param[4] = +param[4];
                                  param[5] = +param[5];
                                  // ctx.bezierCurveTo.apply(ctx,param);
                                  drawData.type='BC';
                                  drawData.arr=[
                                      param[0],
                                      param[1],
                                      param[2],
                                      param[3],
                                      param[4],
                                      param[5],
                                  ];

                                  currentPoint = [param[4],param[5]];
                                  lastControl = [2*param[4]-param[2],2*param[5]-param[3]];
                                  break;
                              case "S":
                                  param = param.replace(/,/g," ");
                                  param = param.replace(/-/g," -");
                                  param = param.trim().split(" ");
                                  param[0] = +param[0];
                                  param[1] = +param[1];
                                  param[2] = +param[2];
                                  param[3] = +param[3];
                                  param = lastControl.concat(param);
                                  // ctx.bezierCurveTo.apply(ctx,param);
                                  drawData.type='QC';
                                  drawData.arr=[
                                      param[0],
                                      param[1],
                                      param[2],
                                      param[3],
                                  ];
                                  currentPoint = [param[4],param[5]];
                                  lastControl = [2*param[4]-param[2],2*param[5]-param[3]];
                                  break;
                            case "Q":
                              param = param.replace(/,/g," ");
                              param = param.replace(/-/g," -");
                              param = param.trim().split(" ");
                              // log("Q",param)
                              var arr=[];
                              param[0] = Number(param[0]);
                              param[1] =  Number(param[1]);
                              param[2] = Number(param[2]);
                              param[3] =Number(param[3]);
                              // param = lastControl.concat(param);
                              // ctx.bezierCurveTo.apply(ctx,param);
                              drawData.type='QC';
                              drawData.arr=[
                                  param[0],
                                  param[1],
                                  param[2],
                                  param[3],
                              ];
                              currentPoint = [param[4],param[5]];
                              lastControl = [2*param[4]-param[2],2*param[5]-param[3]];
                              break;
                              default:
                          }
                     }
                  }
                  return result;
          }
  }

  return CJSLoadFontsModel;
}));
