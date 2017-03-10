/**
 * @class Ds.map.BMapRoutePath
 * @classdesc 百度地图获取路径功能 带模糊搜索数据绑定
 * @extends
 * @example:
  //创建一个百度
  var _BMapModel=new Ds.map.BMapRoutePath();
    _BMapModel.on('init', function() {
    //初始化完成，避免百度的js加载完成再这个类之后
   })
   _BMapModel.on('searchComplete', SearchComplete);
   function SearchComplete(e) {
    if (e.data === null){
      //e.data === null 说明搜索失败  e.error=='start'起始点  e.error=='end'目的地
     }else{
      //这个数据是搜索成功结果数据
       _BMapModel.SearchData
       //{
       //    path: _path, //路径点
       //    duration: duration, //时间
       //    distance: distance, //距离
       //    rect: _rect, //地图矩形大小
      //    startPt: _StartPt, //开始点
      //    endPt: _EndPt, //结束点
       //    start: _Start, //开始名称
       //    end: _End, //结束名称
       //  }
     }
    }
 *
 * //模糊搜索
 * var _StartAutocompleteObject = _BMapModel.GetAutocompleteObject($('.start input')[0],
 *        //模糊搜索
 *        function(results) {
 *          //这里可以去实现模糊搜索后结果列表
 *        })
 *
 *
 *  //强行设置现在不在搜索中
 *  _BMapModel.Searching = false;
 *  //开始搜索
 *  _BMapModel.SearchMap('上海', '北京');
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright: Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
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
    root.Ds.map = root.Ds.map || {};
    root.Ds.map.BMapRoutePath = BMapRoutePath;
    /**
     * 百度地图获取路径功能 带模糊搜索数据绑定
     * @param {[String Dom]} mapDom [百度地图承载的dom元素]
     * <div id="allmap" style="width:640px;height:230px;position:absolute;left:-1000px;top:0;"></div>
     */
    function BMapRoutePath(mapDom) {
        var _Self = this;
        Ds.Extend(this, new Ds.EventDispatcher());

        var _Map, _MapDriving, _MyCity, _MyGeocoder;

        //地图是否初始化完成
        this.InitBMapBool = false;
        //初始化计数器
        var _InitBMaper;
        //默认城市
        var _CityName = '上海';
        //初始化百度地图
        InitBMap();
        /**
         * 初始化百度地图
         */
        function InitBMap() {
            try {
                if (BMap === undefined) {
                    console.log('InitBMap error');
                    clearTimeout(_InitBMaper);
                    _InitBMaper = setTimeout(function() {
                        InitBMap();
                    }, 2 * 1000);
                    return;
                }
            } catch (e) {
                console.log('InitBMap error');
                clearTimeout(_InitBMaper);
                _InitBMaper = setTimeout(function() {
                    InitBMap();
                }, 2 * 1000);
                return;
            }
            if (_Self.InitBMapBool) return;
            clearTimeout(_InitBMaper);
            _Self.InitBMapBool = true;
            //百度地图对象
            _Map = new BMap.Map(mapDom);
            // _Map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
            _Map.centerAndZoom('上海', 12);
            window.Map = _Map;
            //地图查询对象
            _MapDriving = new BMap.DrivingRoute(_Map, {
                // policy:BMAP_DRIVING_POLICY_LEAST_TIME,//用时间最少
                renderOptions: {
                    map: _Map,
                    autoViewport: true
                },
                onSearchComplete: function(results) {
                    console.log('onSearchComplete', results, _MapDriving.getStatus());
                    if (_MapDriving.getStatus() == BMAP_STATUS_SUCCESS) {
                        // 地图覆盖物
                        GetRoutePath(results);
                    }
                }
            });

            //自己位置定位
            _MyCity = new BMap.LocalCity();
            _MyCity.get(function(result) {
                _CityName = result.name;
                _Map.centerAndZoom(_CityName, 12);
            });
            //区域搜索转换成坐标
            _MyGeocoder = new BMap.Geocoder();
            setTimeout(function() {
                console.log('InitBMap');
                _Self.ds('init');
            }, 10);

        }

        /**
         * 设置一个自动完成对象
         * @param {[Dom||String]} input [description]
         * @param {[function]} callBack [description]
         * @example
         *
           var _StartAutocompleteObject=_BMapModel.GetAutocompleteObject($('#StartInput')[0],
             //模糊搜索
             function(results){
               for (var i = 0; i < results.length; i++) {
                 var _result=results[i];
               }
           });
         */
        this.GetAutocompleteObject = function(inputElement, callBack) {
            var _defaultInput = document.createElement('input');
            _defaultInput.style.display = 'none';
            document.body.appendChild(_defaultInput);
            var _autocomplete = new BMap.Autocomplete( //建立一个自动完成的对象
                {
                    "location": _Map,
                    'input': _defaultInput,
                    // "types":['province','city','district','street','streetNumber','business'],
                    "onSearchComplete": function(e) {
                        // document.body.removeChild(_defaultInput);
                        var _results = _autocomplete.getResults();
                        console.log('onSearchComplete:', _results);
                        var _arll = _results.getNumPois();
                        var _arr = [];
                        for (var i = 0; i < _arll; i++) {
                            var _value = _results.getPoi(i);
                            // console.log('i:', _value);
                            if (_value) {
                                _value.allName = _value.province + _value.city + _value.district + _value.street + _value.business;
                                _value.showName = _value.business;
                                _arr.push(_value);
                            }


                        }
                        if (callBack) callBack(_arr);
                        //隐藏下拉框
                        _autocomplete.hide();
                    }
                });

            //偷梁换柱 使用自己输入框做搜索
            var _inputElement;
            if (inputElement !== undefined) {
                _inputElement = $(inputElement);
                _inputElement.on('input', function() {
                    _autocomplete.search(_inputElement[0].value);
                });

            }
            return _autocomplete;
        };
        //搜索中
        var _Searching = false;
        Object.defineProperty(this, "Searching", {
            get: function() {
                return _Searching;
            },
            set: function(value) {
                _Searching = value;
            }
        });

        //是否搜索完成
        var _SearchEnd = false;
        /**
         * 搜索结果
         * @type {[Object]}
         * {
             path:_path,//路径点
             duration:duration,//时间
             distance:distance,//距离
             rect:_rect,//地图矩形大小
             startPt:_StartPt,//开始点
             endPt:_EndPt,//结束点
         }
         */
        var _SearchData = null;
        Object.defineProperty(this, "SearchData", {
            get: function() {
                return _SearchData;
            },
        });
        var _SearchTimer, _SearchTime = 4 * 1000;
        var _StartPt, _EndPt;
        var _Start, _End;
        //搜索地图
        this.SearchMap = function(start, end) {
            if (_Searching) return;

            //[Error 定位点目前不成功]如果传入就是坐标点那就需要直接进行搜索
            if ((start instanceof BMap.Point) && (end instanceof BMap.Point)) {
                SearchMapByPoint(start, end);
                return;
            }
            _Searching = true;
            _SearchEnd = false;
            _SearchData = null;
            console.log('SearchMap:', start, end);
            // StartSearch(start, end);
            // start='外滩';
            // console.log('SearchMap:', start, end);
            var _startPoint, _endPoint;
            _Start = start;
            _End = end;
            //查询开始点
            _MyGeocoder.getPoint(start, function(point) {
                if (point) {
                    _startPoint = point;
                    // console.log(point);
                    _StartPt = point.lat + ',' + point.lng;
                    console.log('start:', _StartPt);
                    getEnd();
                } else {
                    console.log('_MyGeocoder start Error');
                    SearchEnd(null, 'start');
                }
            }, _CityName);
            //查询结束点
            function getEnd() {
                _MyGeocoder.getPoint(end, function(point) {
                    if (point) {
                        _endPoint = point;
                        _EndPt = point.lat + ',' + point.lng;
                        console.log('end:', _EndPt);
                        //开始搜索
                        StartSearch(_startPoint, _endPoint);
                    } else {
                        console.log('_MyGeocoder end Error');
                        SearchEnd(null, 'end');
                    }
                }, _CityName);
            }
            // console.log('error',_MapDriving.getStatus());

        };
        /**
         * 按坐标搜索 目前测试无法正常获取
         * @param {[type]} start [description]
         * @param {[type]} end   [description]
         */
        function SearchMapByPoint(start, end) {
            if (_Searching) return;
            _Searching = true;
            _SearchEnd = false;
            _SearchData = null;
            console.log('按坐标点搜索:', start, end);
            var _startName, _endName;
            // _Start = start;
            // _End = end;
            //查询开始点
            _MyGeocoder.getLocation(start, function(rs) {

                if (rs) {
                    console.log(rs);
                    var _addComp = rs.addressComponents;
                    _startName = _addComp.province + _addComp.city + _addComp.district + _addComp.street + _addComp.streetNumber;
                    console.log(_startName);
                    getEnd();
                } else {
                    console.log('_MyGeocoder start Error');
                    SearchEnd(null, 'start');
                }
            }, "中国");
            //查询结束点
            function getEnd() {
                _MyGeocoder.getLocation(end, function(rs) {
                    if (rs) {
                        var _addComp = rs.addressComponents;
                        _endName = _addComp.province + _addComp.city + _addComp.district + _addComp.street + _addComp.streetNumber;
                        console.log(_endName);
                        //开始搜索
                        StartSearch(_startName, _endName);

                    } else {
                        console.log('_MyGeocoder end Error');
                        SearchEnd(null, 'end');
                    }
                }, "中国");
            }
        }
        //搜索结束
        function SearchEnd(data, error) {
            clearTimeout(_SearchTimer);
            _SearchEnd = true;
            _Searching = false;
            _SearchData = data;
            var _event = {
                type: 'searchComplete',
                data: _SearchData
            };
            if (_SearchData === null) {
                if (error !== undefined) _event.error = error;
                else _event.error = 'all';
                // console.log('obj');
            }
            _Self.ds(_event);
        }
        /**
         * 开始查询搜索
         * @param {[type]} start [description]
         * @param {[type]} end   [description]
         */
        function StartSearch(start, end) {
            _MapDriving.search(start, end);
            if ((start instanceof BMap.Point) && (end instanceof BMap.Point)) {
                // setTimeout(function() {
                //     console.log(_MapDriving.getResults().getStart());
                //     console.log(_MapDriving.getResults().getStart());
                // }, 1000);
            }
            clearTimeout(_SearchTimer);
            _SearchTimer = setTimeout(function() {
                if (!_SearchEnd) SearchEnd(null);
            }, _SearchTime);
        }

        /**
         * 获取路线点
         * @param {[type]} results [description]
         */
        function GetRoutePath(results) {

            var start = results.getStart();
            var end = results.getEnd();
            // console.log('GetRoutePath:', start, end);
            var viewPoints = [start.point, end.point];
            // console.log('GetRoutePath:',viewPoints);
            // 获取方案 1
            var plan = results.getPlan(0);
            var routes = plan.getNumRoutes(); //路线方案种类 Numberd
            var path = plan.getRoute(0).getPath(); //路线路径 Array
            var duration = plan.getDuration(true); //时间
            var distance = plan.getDistance(true); //距离
            // console.log('plan:',plan);
            // console.log('routes:',routes);
            // console.log('path:',path);
            // console.log('duration:',duration);
            // console.log('distance:',distance);
            //绘制出地图上线路
            _Map.addOverlay(new BMap.Polyline(path, {
                strokeColor: '#f00',
                enableClicking: false
            }));
            // console.log('getNumRoutes:',routes);
            // console.log('getPath:',path);
            viewPoints.concat(path);
            // 设置地图视野
            _Map.setViewport(viewPoints, {
                margins: [10, 320, 10, 10]
            });
            //转换屏幕坐标
            var _path = [];
            for (var i = 0; i < path.length; i++) {
                var _obj = _Map.pointToPixel(path[i]);
                _path.push(_obj);
            }
            //计算出矩形区域
            var _minx = _path[0].x,
                _miny = _path[0].y,
                _maxx = _path[0].x,
                _maxy = _path[0].y;
            var _pt;
            for (i = 0; i < _path.length; i++) {
                _pt = _path[i];
                _minx = Math.min(_minx, _pt.x);
                _miny = Math.min(_miny, _pt.y);
                _maxx = Math.max(_maxx, _pt.x);
                _maxy = Math.max(_maxy, _pt.y);
            }
            var _rect = {
                x: _minx,
                y: _miny,
                width: _maxx - _minx,
                height: _maxy - _miny
            };
            for (i = 0; i < _path.length; i++) {
                _pt = _path[i];
                _pt.x = _pt.x - _rect.x;
                _pt.y = _pt.y - _rect.y;
            }
            _rect.x = 0;
            _rect.y = 0;
            if (!_SearchEnd) {
                SearchEnd({
                    path: _path, //路径点
                    duration: duration, //时间
                    distance: distance, //距离
                    rect: _rect, //地图矩形大小
                    startPt: _StartPt, //开始点
                    endPt: _EndPt, //结束点
                    start: _Start, //开始名称
                    end: _End, //结束名称
                });
            }

        }
    }

    return root.Ds.map.BMapRoutePath;
}));
