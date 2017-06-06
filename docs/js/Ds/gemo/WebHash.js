/**
 * @class Ds.gemo.WebHash
 * @classdesc:实现简单的地址路由功能。
 * 锚点格式：#!/
 * 更新事件名：upData
 * 初始化格式#!/   如果不按这个格式来 会自动修改成#!/ ,但不会触发upData 事件；
 * @extends
 * @example:
 var _WebHash=new Ds.WebHash();//_WebHash=seajs.require('WebHash');
 _WebHash.Init();
 _WebHash.on('upData',Pfunction(){
 	log('webHash.pageArr:',webHash.pageArr)
 	log('webHash.hash:',webHash.hash)
 })
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
    root.Ds = window.Ds || {};
    root.Ds.gemo = root.Ds.gemo || {};
    root.Ds.gemo.WebHash = WebHash;
    var location = window.location;
    var feg = '#!/';

    function WebHash() {
        var _self = this,
            hash;
        if (Ds && Ds.Eventer) Ds.Extend(this, Ds.Eventer);
        this._hash = '';
        this.PageArr = [];
        this.Init = function() {
            //如果格式不对，就转正确
            if (location.hash.indexOf(feg) < 0) {
                location.hash = feg;
            }
            this._hash = location.hash.slice(3);
            this.PageArr = this._hash.split('/');
            window.onhashchange = _self.onhashchange;
        };
        this.onhashchange = function() {
            if (location.hash.indexOf(feg) < 0) {
                location.hash = feg;
            }
            var temp = location.hash.slice(3);
            log('window onhashchange', _self._hash, location.hash, temp);
            _self.Hash = temp;
        };
    }
    WebHash.prototype = {
        constructor: WebHash,
        get Hash() {
            // log('get hash',this._hash);
            this._hash = location.hash.slice(3);
            this.PageArr = this._hash.split('/');
            return this._hash;
        },
        set Hash(value) {
            // log('set hash upData',this._hash,value);
            if (this._hash == value) return;
            this._hash = value;
            this.PageArr = this._hash.split('/');
            window.location.hash = '!/' + value;
            //log('upData')
            this.ds({
                type: 'upData'
            });
        }
    };

    return WebHash;
}));
