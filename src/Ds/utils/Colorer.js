!(function (factory) {
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

}(function (root, Color) {
  root.Ds=root.Ds ||{};
  root.Ds.utils=root.Ds.utils ||{};
  root.Ds.utils.Colorer=new Colorer();

  function Colorer(){


    //[255,0,255] >> #ff00ff
    this.pack = function (rgb) {
      var r = Math.round(rgb[0] * 255);
      var g = Math.round(rgb[1] * 255);
      var b = Math.round(rgb[2] * 255);
      return '#' + (r < 16 ? '0' : '') + r.toString(16) +
             (g < 16 ? '0' : '') + g.toString(16) +
             (b < 16 ? '0' : '') + b.toString(16);
    };

    //#ff00ff >> [255,0,255]
    this.unpack = function (color) {
      if (color.length == 7) {
        return [parseInt('0x' + color.substring(1, 3)) / 255,
          parseInt('0x' + color.substring(3, 5)) / 255,
          parseInt('0x' + color.substring(5, 7)) / 255];
      }
      else if (color.length == 4) {
        return [parseInt('0x' + color.substring(1, 2)) / 15,
          parseInt('0x' + color.substring(2, 3)) / 15,
          parseInt('0x' + color.substring(3, 4)) / 15];
      }
    };


    this.HSLToRGB = function (hsl) {
      var m1, m2, r, g, b;
      var h = hsl[0], s = hsl[1], l = hsl[2];
      m2 = (l <= 0.5) ? l * (s + 1) : l + s - l*s;
      m1 = l * 2 - m2;
      return [this.hueToRGB(m1, m2, h+0.33333),
          this.hueToRGB(m1, m2, h),
          this.hueToRGB(m1, m2, h-0.33333)];
    };

    this.hueToRGB = function (m1, m2, h) {
      h = (h < 0) ? h + 1 : ((h > 1) ? h - 1 : h);
      if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
      if (h * 2 < 1) return m2;
      if (h * 3 < 2) return m1 + (m2 - m1) * (0.66666 - h) * 6;
      return m1;
    };

    this.RGBToHSL = function (rgb) {
      var min, max, delta, h, s, l;
      var r = rgb[0], g = rgb[1], b = rgb[2];
      min = Math.min(r, Math.min(g, b));
      max = Math.max(r, Math.max(g, b));
      delta = max - min;
      l = (min + max) / 2;
      s = 0;
      if (l > 0 && l < 1) {
        s = delta / (l < 0.5 ? (2 * l) : (2 - 2 * l));
      }
      h = 0;
      if (delta > 0) {
        if (max == r && max != g) h += (g - b) / delta;
        if (max == g && max != b) h += (2 + (b - r) / delta);
        if (max == b && max != r) h += (4 + (r - g) / delta);
        h /= 6;
      }
      return [h, s, l];
    };


  }

  return root.Ds.utils.Colorer;
}));
