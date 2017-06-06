/**
 * @class Ds.JT3D
 * @classdesc:对shark的CSS3D 与 JT进行简化操作
 * @extends
 * @example: 举例
 * @author: maksim email:maksim.lin@foxmail.com
 * @copyright:  Ds是累积平时项目工作的经验代码库，不属于职位任务与项目的内容。里面代码大部分理念来至曾经flash 前端时代，尽力减小类之间耦合，通过webpack按需request使用。Ds库里内容多来至网络与参考其他开源代码库。Ds库也开源开放，随意使用在所属的职位任务与项目中。
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
    root.Ds.gemo = root.Ds.gemo || {};
    var JT3D = root.Ds.JT3D = modelObj;
    root.JT3D = JT3D;
    /**
     * 动画运动
     * @param  {[Object]} target [description]
     * @param  {[Number]} time   [description]
     * @param  {[Object]} opts   [description]
     * @param  {[Object]} type   [description]
     * @return {[type]}        [description]
     */
    JT3D.to = function(target, time, opts, type) {

        if (!opts.onUpdate) {
            if (opts.type === undefined || opts.type == 'all') {
                opts.onUpdate = function() {
                    target.update();
                };
            } else if (Array.isArray(opts.type)) {
                opts.onUpdate = function() {
                    if (opts.type.indexOf('s')) target.updateS(); //刷新尺寸
                    if (opts.type.indexOf('o')) target.updateO(); //刷新旋转中心
                    if (opts.type.indexOf('t')) target.updateT(); //刷新位置，角度
                    if (opts.type.indexOf('m')) target.updateM(); //刷新材质
                    if (opts.type.indexOf('v')) target.updateV(); //刷新可见性
                    if (opts.type.indexOf('f')) target.updateF(); //刷新滤镜
                };
            } else if (opts.type == 's') {
                opts.onUpdate = function() {
                    target.updateS();
                };
            } else if (opts.type == 'o') {
                opts.onUpdate = function() {
                    target.updateO();
                };
            } else if (opts.type == 't') {
                opts.onUpdate = function() {
                    target.updateT();
                };
            } else if (opts.type == 'm') {
                opts.onUpdate = function() {
                    target.updateM();
                };
            } else if (opts.type == 'v') {
                opts.onUpdate = function() {
                    target.updateV();
                };
            } else if (opts.type == 'f') {
                opts.onUpdate = function() {
                    target.updateF();
                };
            }
        }
        JT.to(target, time, opts);
    };
    /**
     * 设置属性
     * @param {[Object]} target [description]
     * @param {[Object]} opts   [description]
     * @param {[Bool]} updateBool   [description]
     */
    JT3D.set = function(target, opts, updateBool) {
        CopyData(target, opts);
        if (updateBool === undefined) target.update();
        else if (updateBool === true) {
            if (opts.type === undefined || opts.type == 'all') {
                target.update();
            } else if (Array.isArray(opts.type)) {
                if (opts.type.indexOf('s')) target.updateS(); //刷新尺寸
                if (opts.type.indexOf('o')) target.updateO(); //刷新旋转中心
                if (opts.type.indexOf('t')) target.updateT(); //刷新位置，角度
                if (opts.type.indexOf('m')) target.updateM(); //刷新材质
                if (opts.type.indexOf('v')) target.updateV(); //刷新可见性
                if (opts.type.indexOf('f')) target.updateF(); //刷新滤镜
            } else if (opts.type == 's') {
                target.updateS();
            } else if (opts.type == 'o') {
                target.updateO();
            } else if (opts.type == 't') {
                target.updateT();
            } else if (opts.type == 'm') {
                target.updateM();
            } else if (opts.type == 'v') {
                target.updateV();
            } else if (opts.type == 'f') {
                target.updateF();
            } else {
                target.update();
            }
        }
    };
    /**
     * 动画从XXX到XXX
     * @param  {[type]} target     [description]
     * @param  {[type]} time       [description]
     * @param  {[type]} fromParams [description]
     * @param  {[type]} toParams   [description]
     * @return {[type]}            [description]
     */
    JT3D.fromTo = function(target, time, fromParams, toParams) {
        JT3D.set(target, fromParams);
        JT3D.to(target, time, toParams);
    };
    /**
     * 复制数据
     * @param {[type]} target [description]
     * @param {[type]} source [description]
     */
    function CopyData(target, source) {
        for (var key in source) {
            if (source[key] !== undefined) {
                target[key] = source[key];
            }
        }
        return target;
    }
    return root.Ds.JT3D;
}));
