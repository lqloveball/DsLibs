/**
 * 一个快速实现createjs内输入框对象
 * @class
 * @memberof ds.createjs
 * @requires module:libs/createjs/createjs0.8.2.min.js
 */
class InputText {

}

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);
let ds = root.ds = root.ds || {};
ds.createjs = ds.createjs || {};
ds.createjs.InputText=InputText;

export default InputText;