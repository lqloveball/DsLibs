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
  function InputInteractive(){

  }
  /**
   * 使用url创建下来选择项目
   * @param  {[type]}   url        [description]
   * @param  {[type]}   _SelectDom [description]
   * @param  {[type]}   valueName  [description]
   * @param  {[type]}   labelName  [description]
   * @param  {Function} callback   [description]
   * @return {[type]}              [description]
   */
  InputInteractive.CreatSelectGetUrl=function(url,SelectDom,postData,valueName,labelName,callback,debug){
    var _type='POST';
    if(debug)_type='GET';
    $.ajax({
      type:_type,
      url:url,
      data:postData||{},
      success: function(data){
        if(typeof(data)==='string'){
          data=JSON.parse(data);
        }
        SelectDom.options.length=0;
        SelectDom.options=[];
        var _dataList=data.data;
        for (var i = 0; i < _dataList.length; i++) {
          var _data=_dataList[i];
          var _label=_data[labelName];
          var _value;
          if(valueName===''||valueName===null||valueName===undefined){
            _value=JSON.stringify(_data);
          }
          else{
            _value=_data[valueName];
          }
          if(!_label){
            if(typeof(_value)==='string') _label=_value;
            else _label=JSON.stringify(_value);
          }
          var _option=new Option(_label,_value);
          _option.data=_data;
          SelectDom.options.add(_option);
        }
        if(callback)callback();
        // console.log(data);
      },
      error: function(xhr, type){
        // console.log('Ajax error!');
      }
    });
  };
  /**
   * [description]
   * @param  {[type]} SelectDom    [description]
   * @param  {[type]} ShowLabelDom [description]
   * @return {[type]}              [description]
   */
  InputInteractive.SetShowLabelUpChange=function(SelectDom,ShowLabelDom){
    SelectDom.addEventListener('change',changeFun);
    function changeFun(){
      InputInteractive.UpChangeShowLabel(SelectDom,ShowLabelDom);
    }
    InputInteractive.UpChangeShowLabel(SelectDom,ShowLabelDom);
  };
  /**
   * [description]
   * @param  {[type]} SelectDom    [description]
   * @param  {[type]} ShowLabelDom [description]
   * @return {[type]}              [description]
   */
  InputInteractive.UpChangeShowLabel=function(SelectDom,ShowLabelDom){
    if(!SelectDom.options||SelectDom.options.length<=0)return;
    var _selectedIndex=SelectDom.selectedIndex;
    var _options=SelectDom.options[_selectedIndex];
    var _label=SelectDom.options[SelectDom.selectedIndex].text;
    if(_label)$(ShowLabelDom).html(_label);
  };


  return InputInteractive;
}));
