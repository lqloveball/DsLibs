import QRCode from 'libs/qrcode/index.js';

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};

ds.utils = ds.utils || {};

/**
 * @member ds.utils.QRCoder
 * @type {module:ds/utils/QRCoder}
 */
const QRCoder = {};
/**
 * 二维码处理工具
 * @module module:ds/utils/QRCoder
 */
ds.utils.QRCoder = QRCoder;
/**
 * 获取简单QRCode
 * @param {string} value 生成的字符串
 * @param {object} opts 配置
 */
ds.utils.QRCoder.getQRCode = function (value, opts) {
    opts = opts || {};
    let _qrCode = new QRCode({
        text: value,
        size: opts.size || 110,
        render: opts.render || 'canvas',
        correctLevel: opts.level || 3,
        background: opts.bg || "#FFFFFF",
        foreground: opts.color || "#000000"
    });
    return _qrCode;
};

ds.utils.QRCoder.getQRCodeImage = function (value, opts) {
    let _qrCode = ds.utils.QRCoder.getQRCode(value, opts);
    let _base64 = _qrCode.toDataURL("image/jpeg", 0.8);
    let _img=new Image();
    _img.src=_base64;
    return _img;

};

export default ds.utils.QRCoder;