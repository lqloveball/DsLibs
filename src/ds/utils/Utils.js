!(function (factory) {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global);

    if (typeof define === 'function' && define.amd) {
        define(['exports'], function (exports) {
            module.exports = factory(root, exports);
        });
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(root, exports);
    } else {
        factory(root, {});
    }

}(function (root, Utils) {

    var ds = root.ds = root.ds || {};
    ds.utils = ds.utils || {};

    /**
     * 常用操作对象，判断字符串，输入值验证、数组排序等
     * @module ds/utils/Utils
     *
     */
    Utils;

    /**
     * 常用操作对象，判断字符串，输入值验证、数组排序等
     * @member ds.utils.Utils
     * @type module:ds/utils/Utils
     */
    ds.utils.Utils = Utils;



    /**
     * 判断是否是DOM对象
     * @alias module:ds/utils/Utils~isDOM
     * @function
     * @param {*} obj [一个用来判断是否是dom对象的参数]
     * @return {boolean} 判断是否是一个dom
     */
    Utils.isDOM = function (obj) {

        if (typeof HTMLElement === 'object') return obj instanceof HTMLElement;
        else return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';

    };


    /**
     * 对数组进行按指定值升续排列
     * @alias module:ds/utils/Utils~arraySort
     * @function
     * @param  {array} arr   [排序的数组]
     * @param  {string} value [指定值]
     * @param  {boolean} litre [升续]
     * @return {array}       [排序后的数组]
     */
    Utils.arraySort = function (arr, value, litre) {

        litre = litre !== undefined ? litre : true;

        var compare = function (prop) {

            return function (obj1, obj2) {

                var val1 = obj1[prop];
                var val2 = obj2[prop];
                if (val1 < val2) return -1;
                else if (val1 > val2) return 1;
                else return 0;

            };

        };

        var compare2 = function (prop) {

            return function (obj1, obj2) {

                var val1 = obj1[prop];
                var val2 = obj2[prop];

                if (val1 > val2) return -1;
                else if (val1 < val2) return 1;
                else return 0;

            };

        };

        if (litre) return arr.sort(compare(value));
        else return arr.sort(compare2(value));

    };

    /**
     * 判断邮箱
     * @alias module:ds/utils/Utils~isEmail
     * @function
     * @param  {string} value [判断字符串]
     * @return {boolean}       [判断结果]
     */
    Utils.isEmail = function (value) {

        var pattern = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        return pattern.test(value);

    };

    /**
     * 是否是一个空字符串
     * @alias module:ds/utils/Utils~isEmptyString
     * @function
     * @param  {string} value [判断字符串]
     * @return {boolean}     [判断结果]
     */
    Utils.isEmptyString = function (value) {

        if (value === "") return true;
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(value);

    };

    /**
     * 判断是否手机号码
     * @alias module:ds/utils/Utils~isPhone
     * @function
     *
     * @param  {string} value [判断字符串]
     * @return {boolean}     [判断结果]
     */
    Utils.isPhone = function (value) {

        var re = new RegExp(/^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/);
        var retu = value.match(re);
        if (retu) return true;
        else return false;

    };

    /**
     * 验证是否用户身份证号
     * @alias module:ds/utils/Utils~IsUserCard
     * @function
     *
     * @param  {string} card [判断字符串]
     * @return {boolean}     [判断结果]
     */
    Utils.IsUserCard = function (card) {

        // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (reg.test(card) === false) return false;
        return true;

    };

    /**
     * 完整验证身份证的方式
     * @alias module:ds/utils/Utils~isUserCardAll
     * @function
     *
     * @param  {string} code [判断字符串]
     * @return {boolean|string}     [判断结果]
     */
    Utils.isUserCardAll = function (code) {

        var city = {
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江 ",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北 ",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏 ",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "新疆",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外 "
        };
        var tip = "";
        var pass = true;

        if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {

            tip = "身份证号格式错误";
            pass = false;

        }

        else if (!city[code.substr(0, 2)]) {

            tip = "地址编码错误";
            pass = false;

        }
        else {

            //18位身份证需要验证最后一位校验位
            if (code.length == 18) {

                code = code.split('');
                //∑(ai×Wi)(mod 11)
                //加权因子
                var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                //校验位
                var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
                var sum = 0;
                var ai = 0;
                var wi = 0;
                for (var i = 0; i < 17; i++) {
                    ai = code[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                var last = parity[sum % 11];

                if (parity[sum % 11] != code[17]) {

                    tip = "校验位错误";
                    pass = false;

                }

            }

        }

        if (!pass) return tip;

        return pass;

    };


    return ds.utils.Utils;
}));
