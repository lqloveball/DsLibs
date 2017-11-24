import QRCode from 'libs/qrcode/index.js';

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};

ds.createjs = ds.createjs || {};

/**
 * 获取简单QRCode
 * @param {string} value 生成的字符串
 * @param {object} opts 配置
 * @return {createjs.Bitmap}
 */
ds.createjs.getQRCode=function (value,opts) {
    let _qrCode=new QRCode({
        text: value,
        size: opts.size||110,
        render:opts.render|| 'canvas',
        correctLevel:opts.level|| 3,
        background: opts.bg||"#FFFFFF",
        foreground:opts.color||"#000000"
    });
    let _bitmap = new createjs.Bitmap(_qrCode);
    return _bitmap;
};

export default ds.createjs;