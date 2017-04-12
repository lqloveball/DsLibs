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
    root.Ds.ui = root.Ds.ui || {};
    root.Ds.ui.DatePickers = new DatePickers();

    function DatePickers() {
        /**
         * 快速设置日期控件
         * @param  {[DOM]} selectYear  [select Dom]
         * @param  {[DOM]} selectMonth [select Dom]
         * @param  {[DOM]} selectDay   [select Dom]
         * @param  {[DOM]} labelYear   [显示用div]
         * @param  {[DOM]} labelMonth  [显示用div]
         * @param  {[DOM]} labelDay    [显示用div]
         * @param  {[Object]} opts    [description]
         * opts.resetDay  false 选择月份的时候不重置日期与当前一样  false默认不选择日期
         * @return {[type]}             [description]
         */
        this.SetDatePickersByDom = function(selectYear, selectMonth, selectDay, labelYear, labelMonth, labelDay,opts) {
            opts=opts||{};
            selectYear = $(selectYear)[0];
            selectMonth = $(selectMonth)[0];
            selectDay = $(selectDay)[0];

            labelYear = $(labelYear);
            labelMonth = $(labelMonth);
            labelDay = $(labelDay);

            var _MonHead = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            var i;
            //先给年下拉框赋内容
            var y = new Date().getFullYear();
            //以今年为准，前30年，后30年
            // for (i = (y - 30); i < (y + 30); i++) {
            //     selectYear.options.add(new Option(i + '', i));
            // }
            for (i = (y - 80); i < (y + 1); i++) {
                selectYear.options.add(new Option(i + '', i));
            }
            //赋月份的下拉框
            for (i = 1; i < 13; i++) {
                selectMonth.options.add(new Option(i + '', i));
            }
            selectYear.value = y;
            selectMonth.value = new Date().getMonth() + 1;
            var n = _MonHead[new Date().getMonth()];
            //闰月
            if (new Date().getMonth() == 1 && IsPinYear(selectYear.value)) n++;
            writeDay(n); //赋日期下拉框Author:meizz
            if(opts.resetDay){
              selectDay.value = new Date().getDate();
            }else{
              selectDay.value = '';
            }

            upShowTime();

            selectYear.addEventListener('change', function() {
                YYYYDD(selectYear.value);
                upShowTime();
            });
            selectMonth.addEventListener('change', function() {
                MMDD(selectMonth.value);
                upShowTime();
            });
            selectDay.addEventListener('change', function() {
                upShowTime();
            });

            function upShowTime() {
                // console.log('selectDay:', selectDay.value);
                labelYear.html(selectYear.value);
                labelMonth.html(selectMonth.value);
                labelDay.html(selectDay.value);
            }
            //年发生变化时日期发生变化(主要是判断闰平年)
            function YYYYDD(str) {
                var MMvalue = selectMonth.options[selectMonth.selectedIndex].value;
                // console.log('obj',MMvalue);
                if (MMvalue === "") {
                    var e = selectDay;
                    optionsClear(e);
                    return;
                }
                var n = _MonHead[MMvalue - 1];
                if (MMvalue == 2 && IsPinYear(str)) n++;
                writeDay(n);
            }
            //月发生变化时日期联动
            function MMDD(str)
            {
                var YYYYvalue = selectYear.options[selectYear.selectedIndex].value;
                if (YYYYvalue === "") {
                    var e = selectDay;
                    optionsClear(e);
                    return;
                }
                var n = _MonHead[str - 1];
                if (str == 2 && IsPinYear(YYYYvalue)) n++;
                writeDay(n,opts.resetDay);
            }

            function writeDay(n,resetDay) //据条件写日期的下拉框
            {
                //是否重置数据与之前日期一样，如果不设置默认实在与之前一样。
                resetDay=resetDay!==undefined?resetDay:true;
                var _oldValue = selectDay.value;
                // console.log(selectMonth.value,'有'+n+'天 原来选择'+_oldValue);
                var e = selectDay;
                optionsClear(e);
                for (var i = 1; i < (n + 1); i++) {
                    e.options.add(new Option(i + '', i));
                }
                if(resetDay){
                  if (_oldValue <= n) {
                      selectDay.value = _oldValue;
                      labelDay.html(selectDay.value);
                  } else {
                      selectDay.value = n;
                      labelDay.html(selectDay.value);
                  }
                }
                else {
                  selectDay.value = '';
                  labelDay.html(selectDay.value);
                }


            }
            //判断是否闰平年
            function IsPinYear(year) {
                return (0 === year % 4 && (year % 100 !== 0 || year % 400 === 0));
            }
            //清空时间
            function optionsClear(e) {
                e.options.length = 1; //=1时候会创建一个空的选择项目
            }
        };

    }

    return DatePickers;
}));
