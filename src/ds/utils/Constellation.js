!(function (factory) {

    var root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);


    if (typeof define === 'function' && define.amd) {

        define(['exports'], function (exports) {

            module.exports = factory(root, exports);

        });
    } else if (typeof exports !== 'undefined') {

        module.exports = factory(root, exports);

    } else {

        factory(root, {});

    }

}(function (root, model) {

    var ds = root.ds = root.ds || {};
    ds.utils = ds.utils || {};

    /**
     * 根据日期获取星座方法
     * @member ds.utils.getConstellation
     * @function
     * @param {numbe} month 月份
     * @param {numbe} date 日期
     * @return {string} 星座名
     */
    ds.utils.getConstellation = function (month, date) {
        var value = '';
        if (month == 1 && date >= 20 || month == 2 && date <= 18) {
            value = "水瓶座";
        }
        if (month == 1 && date > 31) {
            value = "Huh?";
        }
        if (month == 2 && date >= 19 || month == 3 && date <= 20) {
            value = "双鱼座";
        }
        if (month == 2 && date > 29) {
            value = "Say what?";
        }
        if (month == 3 && date >= 21 || month == 4 && date <= 19) {
            value = "白羊座";
        }
        if (month == 3 && date > 31) {
            value = "OK. Whatever.";
        }
        if (month == 4 && date >= 20 || month == 5 && date <= 20) {
            value = "金牛座";
        }
        if (month == 4 && date > 30) {
            value = "I'm soooo sorry!";
        }
        if (month == 5 && date >= 21 || month == 6 && date <= 21) {
            value = "双子座";
        }
        if (month == 5 && date > 31) {
            value = "Umm ... no.";
        }
        if (month == 6 && date >= 22 || month == 7 && date <= 22) {
            value = "巨蟹座";
        }
        if (month == 6 && date > 30) {
            value = "Sorry.";
        }
        if (month == 7 && date >= 23 || month == 8 && date <= 22) {
            value = "狮子座";
        }
        if (month == 7 && date > 31) {
            value = "Excuse me?";
        }
        if (month == 8 && date >= 23 || month == 9 && date <= 22) {
            value = "处女座";
        }
        if (month == 8 && date > 31) {
            value = "Yeah. Right.";
        }
        if (month == 9 && date >= 23 || month == 10 && date <= 22) {
            value = "天秤座";
        }
        if (month == 9 && date > 30) {
            value = "Try Again.";
        }
        if (month == 10 && date >= 23 || month == 11 && date <= 21) {
            value = "天蝎座";
        }
        if (month == 10 && date > 31) {
            value = "Forget it!";
        }
        if (month == 11 && date >= 22 || month == 12 && date <= 21) {
            value = "人马座";
        }
        if (month == 11 && date > 30) {
            value = "Invalid Date";
        }
        if (month == 12 && date >= 22 || month == 1 && date <= 19) {
            value = "摩羯座";
        }
        if (month == 12 && date > 31) {
            value = "No way!";
        }
        return value;
    };


    return ds.utils.Devicer;
}));