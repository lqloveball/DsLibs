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
  root.Ds = root.Ds || {};
  root.Ds.gemo = root.Ds.gemo || {};
  root.Ds.gemo.InputInteractive=InputInteractive;
  function InputInteractive(){}
  /**
   * 省市联动二级组件 绑定方法
   * @param  {[String]}   pUrl  [省份请求接口地址]
   * @param  {[String]}   cUrl  [城市请求接口地址]
   * @param  {[DOM]}   domBox  [组件所在dom]
   * @param  {[Object]}   opts  [description]
   * opts.pName  省份的class名称   默认 province
   * opts.cName  城市份的class名称 默认 city
   * opts.replace  是否使用代替的div 或者其他dom来显示 ,默认true
   * 如果replace  为true,  .province+'Label' 与  .city+'Label' 是代替显示的选择结果
   * opts.dataType  ajax 请求方式
   * opts.pDesc   省份进行显示描述字段  默认'province_desc'
   * opts.pID     省份交互请求id字段  默认'province_id'
   * opts.cDesc   省份进行显示描述字段  默认'province_desc'
   * opts.defaultP   省份默认选择空显示项
   * opts.defaultC   城市默认选择空显示项
   * opts.select     城市选择调用
   * @example
   *    html结构可以如下
       <div class="provinceLabel selectShow"></div>
       <select class="province"></select>

        <div class="cityLabel selectShow">城市</div>
       <select class="city"></select>
       //---------------js
       var _provincesDataUrl=SiteModel.APIer.WebUrl+'/ajax/Ajax.aspx?method=GetProvince';
       var _cityDataUrl=SiteModel.APIer.WebUrl+'/ajax/Ajax.aspx?method=GetCity';
       Ds.gemo.InputInteractive.ProvincesCityLinkComponents(
         _provincesDataUrl,
         _cityDataUrl,
         _Dom,
         {
           dataType: 'jsonp',//接口请求方式 这里可以使用jsonp方式
           pDesc:'province_desc',//省份数据描述字段
           cDesc:'c_desc',//城市数据描述字段
           pID:'province_id'//获取城市list 提交省份字段
         }
       );
   *
   *
   */

  InputInteractive.ProvincesCityLinkComponents=function(pUrl,cUrl,domBox,opts){
    opts=opts||{};
    var _dataType=opts.dataType!==undefined?opts.dataType:'json';
    if(!opts.defaultP)opts.defaultP='省份';
    if(!opts.defaultC)opts.defaultC='城市';
    var _pName=opts.pName||'province';
    var _cName=opts.cName||'city';
    var _provinceDom=domBox.find('.'+_pName)[0],_cityDom=domBox.find('.'+_cName)[0];
    if(!_provinceDom||!_cityDom){
      console.warn('InputInteractive.ProvincesCityLinkComponents 没有对应的dom对象');
      return;
    }
    var _provinceLabel,_cityLabel;
    var _replace=opts.replace;
    if(opts.replace===undefined)_replace=true;
    if(_replace){
      _provinceLabel=domBox.find('.'+_pName+'Label')[0];
      _cityLabel=domBox.find('.'+_cName+'Label')[0];
      Ds.gemo.InputInteractive.SetShowLabelUpChange(_provinceDom,_provinceLabel);
      Ds.gemo.InputInteractive.SetShowLabelUpChange(_cityDom,_cityLabel);
    }

    var _provinceConfig={
      dataType:_dataType,//ajax 使用 jsonp跨域
      label:opts.pDesc!==undefined?opts.pDesc:'province_desc',//需要在选项里面显示的内容
      defaultData:opts.defaultP!==undefined?opts.defaultP:'省份',
      callback:function(){
        if(_replace)Ds.gemo.InputInteractive.UpSelectShowLabel(_provinceDom,_provinceLabel);
      },
      select:provinceSelectUpCity
    };

    Ds.gemo.InputInteractive.CreatSelectGetUrl(pUrl,{},
      _provinceDom,
      _provinceConfig
    );

    function provinceSelectUpCity(option,index,data){
      console.log('provinceSelectUpCity:',data,opts.defaultP);
      if(data===opts.defaultP)return;
      var _cityConfig={
        dataType:_dataType,//ajax 使用 jsonp跨域
        label:opts.cDesc!==undefined?opts.cDesc:'city_desc',//需要在选项里面显示的内容
        defaultData:opts.defaultC!==undefined?opts.defaultC:'城市',
        callback:function(){
          if(_replace)Ds.gemo.InputInteractive.UpSelectShowLabel(_cityDom,_cityLabel);
        },
        select:function(option,index,data){
          if(opts.select)opts.select(option,index,data);
        }
      };
      var _postData={};
      if(opts.pID)_postData[opts.pID]=data[opts.pID];
      else if(data['province_id'])_postData['province_id']=data['province_id'];
      else _postData.province_id='';
      Ds.gemo.InputInteractive.CreatSelectGetUrl(cUrl,_postData,_cityDom,_cityConfig);
    }

  };
  /**
   * 使用url创建下来选择项目
   * @param  {[type]}   url        [获取内容的url]
   * @param  {[type]}   postData [post数据]
   * @param  {[type]}   selectDom [下拉列表dom对象]
   * @param  {[Object]}   opts  [description]
   * opts.type      ajax请求类型  默认POST
   * opts.dataType      ajax请求类型  默认json
   * opts.defaultData   默认选择值
   * opts.label     label值   需要显示value内的变量名  默认空
   * opts.value     数据值  value如果是object 会转换成json  默认空
   * opts.callback   ajax后callback
   * opts.erorr   ajax erorr后callback
   *
   * @return {[type]}              [description]
   */
  InputInteractive.CreatSelectGetUrl=function(url,postData,selectDom,opts){
    selectDom=getHTMLElement(selectDom);
    opts=opts||{};
    var _type=opts.type!==undefined?opts.type:'POST';
    var _dataType=opts.dataType!==undefined?opts.dataType:'json';
    if(_dataType==='jsonp')_type = 'GET';
    if(opts.debug)console.log('InputInteractive.CreatSelectGetUrl:',url);
    // console.log('InputInteractive.CreatSelectGetUrl:',url,postData,opts);
    $.ajax({
      type:_type,
      url:url,
      data:postData!==undefined?postData:{},
      dataType:opts.dataType||'json',
      success: function(data){
        if(typeof(data)==='string')data=JSON.parse(data);
        if(opts.debug)console.log('CreatSelectGetUrl: ' + url + ':', data);
        // console.log('CreatSelectGetUrl: ' + url + ':', data);
        //如果是公司数据返回结果处理方式
        if (data&&data.IsSuccess&&Number(data.IsSuccess) !== 1) {
          if(opts.erorr)opts.erorr(data.ErrMsg,data);
          return;
        }
        var _dataList=data.data;
        InputInteractive.UpSelectListData(selectDom,_dataList,opts);
        if(opts.callback)opts.callback(data);
        selectOption();
        // console.log(data);
      },
      error: function(xhr, type){
        console.log('Error：',url);
        if(opts.erorr)opts.erorr('网络异常');
      }
    });

    if(selectDom.selectOptionFun)  selectDom.removeEventListener('change',selectDom.selectOptionFun);

    selectDom.selectOptionFun=selectOption;
    selectDom.addEventListener('change',selectOption);
    function  selectOption() {
      var _index=selectDom.selectedIndex;
      var _option=selectDom.options[_index];
      var _data=_option.data;
      if(opts.select)opts.select(_option,_index,_option.data);
    }

  };
  /**
   * 更新选择列表项目
   * @param  {[type]} selectDom [列表数据]
   * @param  {[type]} dataList [列表数据]
   * @param  {[type]} opts      [参数]
   * opts.defaultData   默认选择值
   * @return {[type]}           [description]
   */
  InputInteractive.UpSelectListData=function(selectDom,dataList,opts){
    selectDom=getHTMLElement(selectDom);
    selectDom.options.length=0;
    selectDom.options=[];
    var _option,_data,_label,_value;
    if(opts.defaultData){
      // console.log('add defaultData-----');
      if(typeof(opts.defaultData)==='string'){
        _data=opts.defaultData;
        _value=opts.defaultData;
        _label=opts.defaultData;
      }else{
        _data=opts.defaultData;
        if(opts.label&&_data[opts.label])_label=_data[opts.label];
        if(opts.value&&_data[opts.value])_value=_data[opts.value];
        else _value=JSON.stringify(_data);
        if(!_label&&(typeof(_value)==='string'))_label=_value;
        else _label=JSON.stringify(_value);
      }
      _option=new Option(_label,_value);
      _option.data=_data;
      selectDom.options.add(_option);
    }

    _label=null;_value=null;
    for (var i = 0; i < dataList.length; i++) {
      _data=dataList[i];
      if(typeof(_data)==='string'){
        _label=_data;_value=_data;
      }else{
        if(opts.label)_label=_data[opts.label];
        if(!opts.value)_value=JSON.stringify(_data);
        else _value=_data[opts.value];
        if(!_label){
          if(typeof(_value)==='string') _label=_value;
          else _label=JSON.stringify(_value);
        }
      }

      _option=new Option(_label,_value);
      _option.data=_data;
      selectDom.options.add(_option);
    }
  };

  /**
   * 进行绑定输入框与具体显示框显示
   * @param  {[Dom]} selectDom    [选择框]
   * @param  {[Dom]} showLabelDom [需要进行渲染的dom]
   * @param  {[Dom]} opts [进行渲染的属性]
   * @return {[type]}              [description]
   */
  InputInteractive.SetShowLabelUpChange=function(selectDom,showLabelDom,opts){
    selectDom=getHTMLElement(selectDom);
    showLabelDom=getHTMLElement(showLabelDom);
    // console.log(selectDom,showLabelDom);
    opts=opts||{};
    if(selectDom&&selectDom.changeFun){
      selectDom.removeEventListener('change',selectDom.changeFun);
    }
    selectDom.changeFun=changeFun;
    selectDom.addEventListener('change',changeFun);
    function changeFun(){
      InputInteractive.UpSelectShowLabel(selectDom,showLabelDom);
    }
    InputInteractive.UpSelectShowLabel(selectDom,showLabelDom);
  };
  /**
   * 把选择框内容显到指定渲染dom上
   * @param  {[Dom]} selectDom    [选择框]
   * @param  {[Dom]} showLabelDom [需要进行渲染的dom]
   * @param  {[Dom]} opts [进行渲染的属性]
   * opts.label
   * @return {[String]}              [渲染的文本]
   */
  InputInteractive.UpSelectShowLabel=function(selectDom,showLabelDom,opts){
    selectDom=getHTMLElement(selectDom);
    showLabelDom=getHTMLElement(showLabelDom);
    if(!selectDom.options||selectDom.options.length<=0)return;
    opts=opts||{};
    var _selectedIndex=selectDom.selectedIndex;
    var _options=selectDom.options[_selectedIndex];
    var _selectObj=selectDom.options[selectDom.selectedIndex];
    var _label;
    if(opts.label&&_selectObj.data&&typeof(_selectObj.data)==='object'){
      _label=_selectObj.data[opts.label];
    }else{
      _label=selectDom.options[selectDom.selectedIndex].text;
    }
    if(_label)$(showLabelDom).html(_label);
    return _label;
  };
  /**
   * 获取当前select Dom 值，
   * @param  {[DOM]} selectDom [select对象]
   * @param  {[String]} value     [获取指定的值]
   * 必须存在data 数据对象，不存在 返回option.value
   * 如果value不传 data存在 返回 data对象
   *
   * @return {[type]}           [description]
   */
  InputInteractive.GetOptionData=function(selectDom,value){
    selectDom=getHTMLElement(selectDom);
    var _index=selectDom.selectedIndex;
    var _option=selectDom.options[_index];
    if(!_option) return undefined;
    var _data=_option.data;
    if(!value&&_data)return _data;
    if(_data&&_data&&_data[value]!==undefined)return _data[value];
    return _option.value;
  };
  /**
   * $对象转换成HTMLElement对象
   * @param  {[$ HTMLElement]} dom [一个dom对象]
   * @return {[HTMLElement]}     [dom对象]
   */
  function getHTMLElement(dom){
    if(dom instanceof HTMLElement)return dom;
    else if(!(dom instanceof HTMLElement)&&(dom[0] instanceof HTMLElement))return dom[0];
    else return null;
  }

  return InputInteractive;
}));
