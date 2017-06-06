//////////////////////////////////////////////////////////////////////
// Pano2VR 5.0.1/15068 HTML5/CSS3 & WebGL Panorama Player           //
// Trial License: For evaluation only!                              //
// (c) 2016, Garden Gnome Software, http://ggnome.com               //
//////////////////////////////////////////////////////////////////////

var h = function() {
    function e(a, b) {
        this.x = a;
        this.y = b
    }
    e.prototype.Ka = function(a, b) {
        this.x = a;
        this.y = b
    }
    ;
    e.prototype.hc = function(a, b, c) {
        var d = b.y - a.y;
        this.x = a.x + (b.x - a.x) * c;
        this.y = a.y + d * c
    }
    ;
    e.prototype.pi = function(a, b, c, d, f) {
        var t;
        t = new e;
        t.hc(a, c, f);
        a = new e;
        a.hc(c, d, f);
        c = new e;
        c.hc(d, b, f);
        b = new e;
        b.hc(t, a, f);
        t = new e;
        t.hc(a, c, f);
        a = new e;
        a.hc(b, t, f);
        this.x = a.x;
        this.y = a.y
    }
    ;
    e.prototype.ri = function(a, b, c, d, f) {
        var t = new e
          , g = .5
          , k = .25;
        do {
            t.pi(a, b, c, d, g);
            var l = t.x - f
              , g = 0 < l ? g - k : g + k
              , k = k / 2
        } while (.01 < Math.abs(l));this.x = t.x;
        this.y = t.y
    }
    ;
    return e
}()
  , y = function() {
    function e(a, b, c, d, f) {
        this.x = a;
        this.y = b;
        this.z = c;
        this.$b = d;
        this.$a = f
    }
    e.prototype.Ka = function(a, b, c, d, f) {
        this.x = a;
        this.y = b;
        this.z = c;
        this.$b = d;
        this.$a = f
    }
    ;
    e.prototype.toString = function() {
        return "(" + this.x + "," + this.y + "," + this.z + ") - (" + this.$b + "," + this.$a + ")"
    }
    ;
    e.prototype.pa = function(a) {
        var b = Math.sin(a);
        a = Math.cos(a);
        var c = this.y
          , d = this.z;
        this.y = a * c - b * d;
        this.z = b * c + a * d
    }
    ;
    e.prototype.Lj = function() {
        var a = this.y;
        this.y = -this.z;
        this.z = a
    }
    ;
    e.prototype.Kj = function() {
        var a = this.y;
        this.y = this.z;
        this.z = -a
    }
    ;
    e.prototype.wa = function(a) {
        var b = Math.sin(a);
        a = Math.cos(a);
        var c = this.x
          , d = this.z;
        this.x = a * c + b * d;
        this.z = -b * c + a * d
    }
    ;
    e.prototype.Mj = function() {
        var a = this.x;
        this.x = -this.z;
        this.z = a
    }
    ;
    e.prototype.Ra = function(a) {
        var b = Math.sin(a);
        a = Math.cos(a);
        var c = this.x
          , d = this.y;
        this.x = a * c - b * d;
        this.y = b * c + a * d
    }
    ;
    e.prototype.Gh = function() {
        var a = this.x;
        this.x = -this.y;
        this.y = a
    }
    ;
    e.prototype.Wf = function(a) {
        this.pa(a * Math.PI / 180)
    }
    ;
    e.prototype.Fh = function(a) {
        this.wa(a * Math.PI / 180)
    }
    ;
    e.prototype.Jj = function(a) {
        this.Ra(a * Math.PI / 180)
    }
    ;
    e.prototype.clone = function() {
        return new e(this.x,this.y,this.z,this.$b,this.$a)
    }
    ;
    e.prototype.length = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }
    ;
    e.prototype.Me = function(a) {
        return this.x * a.x + this.y * a.y + this.z * a.z
    }
    ;
    e.prototype.Cg = function(a, b) {
        var c;
        c = Math.cos(b * Math.PI / 180);
        this.x = c * Math.sin(a * Math.PI / 180);
        this.y = Math.sin(b * Math.PI / 180);
        this.z = c * Math.cos(a * Math.PI / 180)
    }
    ;
    e.prototype.li = function() {
        return 180 * Math.atan2(-this.x, -this.z) / Math.PI
    }
    ;
    e.prototype.mi = function() {
        return 180 * Math.asin(this.y / this.length()) / Math.PI
    }
    ;
    e.prototype.hc = function(a, b, c) {
        this.x = a.x * c + b.x * (1 - c);
        this.y = a.y * c + b.y * (1 - c);
        this.z = a.z * c + b.z * (1 - c);
        this.$b = a.$b * c + b.$b * (1 - c);
        this.$a = a.$a * c + b.$a * (1 - c)
    }
    ;
    return e
}();
function A() {
    var e;
    "undefined" != typeof Float32Array ? e = new Float32Array(16) : e = Array(16);
    return e
}
function D(e) {
    e[0] = 1;
    e[1] = 0;
    e[2] = 0;
    e[3] = 0;
    e[4] = 0;
    e[5] = 1;
    e[6] = 0;
    e[7] = 0;
    e[8] = 0;
    e[9] = 0;
    e[10] = 1;
    e[11] = 0;
    e[12] = 0;
    e[13] = 0;
    e[14] = 0;
    e[15] = 1
}
function F(e, a) {
    var b = a[0]
      , c = a[1];
    a = a[2];
    e[12] = e[0] * b + e[4] * c + e[8] * a + e[12];
    e[13] = e[1] * b + e[5] * c + e[9] * a + e[13];
    e[14] = e[2] * b + e[6] * c + e[10] * a + e[14];
    e[15] = e[3] * b + e[7] * c + e[11] * a + e[15]
}
function K(e, a, b) {
    var c, d = b[0], f = b[1];
    b = b[2];
    var t = Math.sqrt(d * d + f * f + b * b);
    if (t) {
        1 != t && (t = 1 / t,
        d *= t,
        f *= t,
        b *= t);
        var g = Math.sin(a)
          , k = Math.cos(a)
          , l = 1 - k;
        a = e[0];
        var t = e[1]
          , p = e[2]
          , n = e[3]
          , m = e[4]
          , q = e[5]
          , r = e[6]
          , v = e[7]
          , w = e[8]
          , u = e[9]
          , C = e[10]
          , B = e[11]
          , x = d * d * l + k
          , z = f * d * l + b * g
          , E = b * d * l - f * g
          , G = d * f * l - b * g
          , H = f * f * l + k
          , I = b * f * l + d * g
          , J = d * b * l + f * g
          , d = f * b * l - d * g
          , f = b * b * l + k;
        c ? e != c && (c[12] = e[12],
        c[13] = e[13],
        c[14] = e[14],
        c[15] = e[15]) : c = e;
        c[0] = a * x + m * z + w * E;
        c[1] = t * x + q * z + u * E;
        c[2] = p * x + r * z + C * E;
        c[3] = n * x + v * z + B * E;
        c[4] = a * G + m * H + w * I;
        c[5] = t * G + q * H + u * I;
        c[6] = p * G + r * H + C * I;
        c[7] = n * G + v * H + B * I;
        c[8] = a * J + m * d + w * f;
        c[9] = t * J + q * d + u * f;
        c[10] = p * J + r * d + C * f;
        c[11] = n * J + v * d + B * f
    }
}
function L(e, a, b) {
    e = .1 * Math.tan(e * Math.PI / 360);
    a = e * a;
    var c = -a
      , d = -e;
    b || (b = A());
    var f = a - c
      , t = e - d;
    b[0] = .2 / f;
    b[1] = 0;
    b[2] = 0;
    b[3] = 0;
    b[4] = 0;
    b[5] = .2 / t;
    b[6] = 0;
    b[7] = 0;
    b[8] = (a + c) / f;
    b[9] = (e + d) / t;
    b[10] = -100.1 / 99.9;
    b[11] = -1;
    b[12] = 0;
    b[13] = 0;
    b[14] = -20 / 99.9;
    b[15] = 0
}
function M(e, a) {
    this.m = e;
    this.ma = a;
    var b, c, d = this.__div = document.createElement("div");
    b = document.createElement("img");
    var f;
    f = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA5xJREFUeNqclmlIVFEUx997TjrplFQW2WKBBSYtRFlpWU";
    f += "ILSSsRZRQIBdGHCFqIoKIvQRsUFRJC9LEgaSFbMMpcWi1pLzOLsjItKms0U5t5/c/wH7nc5";
    f += "o2jF374xrv87z33nHOPaRsRtbFgDpgJxoD+wATfwDNQDK6CyrCr5OcbhgiGIRsUAZt4QTWo";
    f += "IFXgp9JfAhY7rgdBl8NeBoLDYBloA+dBOagFTcDHcVEgDgwBGWA+OAcugvXgvb5wKMGJoAA";
    f += "Mp9BpUA96EBf/Btsf8BI8AWfAErAcpHHDZeriliY2AVwDg8AucAQ0Ag+I4XhTm2Oxz8PT46";
    f += "KMbTx5EZjuJDgAnAVusJUm9DhYwalFcc59sIXXIaceFkowDySBPTRPL20xm+b7zYXa+N3CP";
    f += "rWJ6GuwGySA40HLBHc/GywFhbS5R1lEBrZy7FQwiSaX9pmnqeAYt+KUcew7BVZw/QKTq0oc";
    f += "pYPVvDOXItZCk2xgDIZqL8BR8Ab0VDbr4yZOgLeIwzQx6WiQxcCt1+6sld66L4yYtFSwF4y";
    f += "g2dU7/cEwGW9YVkAwmycp1dzdpvgm0DcCh4kHmxWzBls0uBX4qqmZJ4KzePm1IeJLgjmlC1";
    f += "6aDKZpp5Q168B3o6wsSwTHgU+MIUs74RSj6y1d+212HKimJlUE+tFRfJpYtOKNXWmJTASqW";
    f += "f2Bu/R6+4TKHOrOzG4IhptjWgHbGkZvepQ6SQK7oRuCXzjX1DJavBEX1ygfT8FgBqpfm1zR";
    f += "DcEKbR2bsZlkJCdXieB1ZhZ5YtqVgXIPN+m9kbY6hpdb+d9fPncJRmZmqQheZkemJmgxyxy";
    f += "kl3XWJEkcAl7N21s7PDcl5ZJ0PAa3wVwmWtVbZafPwQ7wLozYB7ATPNJO56d/LAikP9u+66";
    f += "KNJS1d4IOZp7wU0hfLukUyzgwm70T2N/DOxIy/eFdqawa5DL2NEGwP5k15Ja4woz9glvcom";
    f += "d9NzyvkFcQo5gomaLfm5c0svnKZ2k7q7+FauvR2MJKZR3+sY5WgtvkdG6JyELGhNHMTXyGf";
    f += "LviRJ5Tcd4Dlhle7086Sgp8CqVxDkn4OqHaqacr5ekjy3Q/W0FRNNGmoMtamdzdxsytZC0l";
    f += "qXKhEgWPVVgImg2NgFT1MHOoOk3yLEtgWN5TEOYvoIFI1rGM19//2wpAD7imF7lfwENwAxa";
    f += "ASNCj90pcLLKdC2Iyw1M9gnEplMEp5kOU1f8WwKGJm8oUr9f8JMAAVMDM6HSDa9QAAAABJR";
    f += "U5ErkJggg%3D%3D";
    b.setAttribute("src", f);
    b.setAttribute("style", "position: absolute;top: -14px;left: -14px; " + e.ua + "user-select: none;");
    b.ondragstart = function() {
        return !1
    }
    ;
    d.appendChild(b);
    f = "position:absolute;" + (e.ua + "user-select: none;");
    f += e.ua + "touch-callout: none;";
    f += e.ua + "tap-highlight-color: rgba(0,0,0,0);";
    e.Ic && !e.ka && (f += e.ua + "transform: translateZ(9999999px);");
    d.setAttribute("style", f);
    d.onclick = function() {
        e.gd(a);
        e.Of(a.url, a.target)
    }
    ;
    var t = e.v.dg;
    t.enabled && (c = document.createElement("div"),
    f = "position:absolute;top:\t 20px;",
    f = t.hf ? f + "white-space: pre-wrap;" : f + "white-space: nowrap;",
    f += e.ua + "transform-origin: 50% 50%;",
    f += "visibility: hidden;",
    f += "overflow: hidden;",
    f += "padding: 0px 1px 0px 1px;",
    c.setAttribute("style", f),
    c.style.color = this.m.X(t.eg, t.cg),
    t.background ? c.style.backgroundColor = this.m.X(t.mb, t.Mb) : c.style.backgroundColor = "transparent",
    c.style.border = "solid " + this.m.X(t.ob, t.Nb) + " " + t.mf + "px",
    c.style.borderRadius = t.lf + "px",
    c.style.textAlign = "center",
    0 < t.width ? (c.style.left = -t.width / 2 + "px",
    c.style.width = t.width + "px") : c.style.width = "auto",
    c.style.height = 0 < t.height ? t.height + "px" : "auto",
    c.style.overflow = "hidden",
    c.innerHTML = a.title,
    d.onmouseover = function() {
        0 == t.width && (c.style.left = -c.offsetWidth / 2 + "px");
        c.style.visibility = "inherit"
    }
    ,
    d.onmouseout = function() {
        c.style.visibility = "hidden"
    }
    ,
    d.appendChild(c))
}
var N = function() {
    function e(a) {
        this.m = a;
        this.enable = !1;
        this.mg = 1;
        this.he = 0;
        this.type = "crossdissolve";
        this.Kb = this.Ba = this.Zb = 0;
        this.jf = 5;
        this.fe = 1;
        this.kf = !1;
        this.We = this.Ve = this.bg = 0;
        this.jd = 70;
        this.gi = 0;
        this.Na = this.fi = 1;
        this.ee = this.de = .5;
        this.sd = this.sh = this.fh = !1;
        this.uf = 1
    }
    e.prototype.Jd = function() {
        var a = this.m.a, b = a.createShader(a.VERTEX_SHADER), c;
        c = "attribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n";
        c += "varying vec2 vTextureCoord;\n";
        c += "uniform bool uZoomIn;\n";
        c += "uniform float uZoomFactor;\n";
        c += "uniform vec2 uZoomCenter;\n";
        c += "void main(void) {\n";
        c += "\t gl_Position = vec4(aVertexPosition, 1.0);\n";
        c += "\t if(!uZoomIn) {\n";
        c += "\t \n";
        c += "\t   vTextureCoord = aTextureCoord;\n";
        c += "\t }\n";
        c += "\t else {\n";
        c += "\t   vTextureCoord = (aTextureCoord - vec2(0.5, 0.5)) * (1.0/uZoomFactor) + uZoomCenter;\n";
        c += "\t }\n";
        c += "}\n";
        a.shaderSource(b, c);
        a.compileShader(b);
        a.getShaderParameter(b, a.COMPILE_STATUS) || (alert(a.getShaderInfoLog(b)),
        b = null);
        var d = a.createShader(a.FRAGMENT_SHADER);
        c = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 vTextureCoord;\n";
        c += "uniform float uAlpha;\n";
        c += "uniform sampler2D uSampler;\n";
        c += "void main(void) {\n";
        c += " vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n";
        c += " gl_FragColor = vec4(textureColor.x, textureColor.y, textureColor.z, uAlpha);\n";
        c += "}\n";
        a.shaderSource(d, c);
        a.compileShader(d);
        a.getShaderParameter(d, a.COMPILE_STATUS) || (alert(a.getShaderInfoLog(d)),
        d = null);
        this.ga = a.createProgram();
        a.attachShader(this.ga, b);
        a.attachShader(this.ga, d);
        a.linkProgram(this.ga);
        a.getProgramParameter(this.ga, a.LINK_STATUS) || alert("Could not initialise shaders");
        this.ga.ca = a.getAttribLocation(this.ga, "aVertexPosition");
        a.enableVertexAttribArray(this.ga.ca);
        this.ga.Ga = a.getAttribLocation(this.ga, "aTextureCoord");
        a.enableVertexAttribArray(this.ga.Ga);
        d = a.createShader(a.FRAGMENT_SHADER);
        c = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 vTextureCoord;\n";
        c += "uniform float uColorPercent;\n";
        c += "uniform float uAlpha;\n";
        c += "uniform vec3 uDipColor;\n";
        c += "uniform sampler2D uSampler;\n";
        c += "void main(void) {\n";
        c += " vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n";
        c += " gl_FragColor = vec4(textureColor.x * (1.0 - uColorPercent) + uDipColor.x * uColorPercent, textureColor.y * (1.0 - uColorPercent) + uDipColor.y * uColorPercent, textureColor.z * (1.0 - uColorPercent) + uDipColor.z * uColorPercent, uAlpha);\n";
        c += "}\n";
        a.shaderSource(d, c);
        a.compileShader(d);
        a.getShaderParameter(d, a.COMPILE_STATUS) || (alert(a.getShaderInfoLog(d)),
        d = null);
        this.ya = a.createProgram();
        a.attachShader(this.ya, b);
        a.attachShader(this.ya, d);
        a.linkProgram(this.ya);
        a.getProgramParameter(this.ya, a.LINK_STATUS) || alert("Could not initialise shaders");
        this.ya.ca = a.getAttribLocation(this.ya, "aVertexPosition");
        a.enableVertexAttribArray(this.ya.ca);
        this.ya.Ga = a.getAttribLocation(this.ya, "aTextureCoord");
        a.enableVertexAttribArray(this.ya.Ga);
        d = a.createShader(a.FRAGMENT_SHADER);
        c = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 vTextureCoord;\n";
        c += "uniform bool uRound;\n";
        c += "uniform float uRadius;\n";
        c += "uniform vec2 uRectDim;\n";
        c += "uniform vec2 uIrisCenter;\n";
        c += "uniform float uSoftEdge;\n";
        c += "uniform sampler2D uSampler;\n";
        c += "void main(void) {\n";
        c += " float alpha = 0.0;\n";
        c += " vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n";
        c += " if (uRound) {\n";
        c += "\t  vec2 diff = uIrisCenter - gl_FragCoord.xy;\n";
        c += "\t   float distFromCenter = sqrt( (diff.x * diff.x) + (diff.y * diff.y) );\n";
        c += "\t   if (distFromCenter > uRadius) {\n";
        c += "      alpha = 1.0;\n";
        c += "    } else {\n";
        c += "      alpha = 1.0 - ((uRadius - distFromCenter) / uSoftEdge);\n";
        c += "    };\n";
        c += " }\n";
        c += " else {\n";
        c += "    float alphaFromLeft = 1.0 - ((gl_FragCoord.x -(uIrisCenter.x - uRectDim.x)) / uSoftEdge);\n";
        c += "    float alphaFromRight = 1.0 - (((uIrisCenter.x + uRectDim.x) - gl_FragCoord.x) / uSoftEdge);\n";
        c += "    float alphaFromTop = 1.0 - ((gl_FragCoord.y -(uIrisCenter.y - uRectDim.y)) / uSoftEdge);\n";
        c += "    float alphaFromBottom = 1.0 - (((uIrisCenter.y + uRectDim.y) - gl_FragCoord.y) / uSoftEdge);\n";
        c += "    alpha = max(max(alphaFromLeft, alphaFromRight), max(alphaFromTop, alphaFromBottom));\n";
        c += " }\n";
        c += " gl_FragColor = vec4(textureColor.x, textureColor.y, textureColor.z, alpha);\n";
        c += "}\n";
        a.shaderSource(d, c);
        a.compileShader(d);
        a.getShaderParameter(d, a.COMPILE_STATUS) || (alert(a.getShaderInfoLog(d)),
        d = null);
        this.qa = a.createProgram();
        a.attachShader(this.qa, b);
        a.attachShader(this.qa, d);
        a.linkProgram(this.qa);
        a.getProgramParameter(this.qa, a.LINK_STATUS) || alert("Could not initialise shaders");
        this.qa.ca = a.getAttribLocation(this.qa, "aVertexPosition");
        a.enableVertexAttribArray(this.qa.ca);
        this.qa.Ga = a.getAttribLocation(this.qa, "aTextureCoord");
        a.enableVertexAttribArray(this.qa.Ga);
        d = a.createShader(a.FRAGMENT_SHADER);
        c = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 vTextureCoord;\n";
        c += "uniform float uPercent;\n";
        c += "uniform int uDirection;\n";
        c += "uniform vec2 uCanvasDimensions;\n";
        c += "uniform float uSoftEdge;\n";
        c += "uniform sampler2D uSampler;\n";
        c += "void main(void) {\n";
        c += " vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n";
        c += " float alpha = 0.0;\n";
        c += " if (uDirection == 1) {\n";
        c += "\t if (gl_FragCoord.x > uPercent) {\n";
        c += "    alpha = 1.0; \n";
        c += "  } else {\n";
        c += "    alpha = 1.0 - ((uPercent - gl_FragCoord.x) / uSoftEdge);\n";
        c += "  }\n";
        c += " }\n";
        c += " if (uDirection == 2) {\n";
        c += "\t if (gl_FragCoord.x < uCanvasDimensions.x - uPercent) {\n";
        c += "    alpha = 1.0; \n";
        c += "  } else {\n";
        c += "    alpha = 1.0 - ((gl_FragCoord.x - (uCanvasDimensions.x - uPercent)) / uSoftEdge);\n";
        c += "  }\n";
        c += " }\n";
        c += " if (uDirection == 3) {\n";
        c += "\t if (gl_FragCoord.y < uCanvasDimensions.y - uPercent) {\n";
        c += "    alpha = 1.0; \n";
        c += "  } else {\n";
        c += "    alpha = 1.0 - ((gl_FragCoord.y - (uCanvasDimensions.y - uPercent)) / uSoftEdge);\n";
        c += "  }\n";
        c += " }\n";
        c += " if (uDirection == 4) {\n";
        c += "\t if (gl_FragCoord.y > uPercent) {\n";
        c += "    alpha = 1.0; \n";
        c += "  } else {\n";
        c += "    alpha = 1.0 - ((uPercent - gl_FragCoord.y) / uSoftEdge);\n";
        c += "  }\n";
        c += " }\n";
        c += " gl_FragColor = vec4(textureColor.x, textureColor.y, textureColor.z, alpha);\n";
        c += "}\n";
        a.shaderSource(d, c);
        a.compileShader(d);
        a.getShaderParameter(d, a.COMPILE_STATUS) || (alert(a.getShaderInfoLog(d)),
        d = null);
        this.ta = a.createProgram();
        a.attachShader(this.ta, b);
        a.attachShader(this.ta, d);
        a.linkProgram(this.ta);
        a.getProgramParameter(this.ta, a.LINK_STATUS) || alert("Could not initialise shaders");
        this.ta.ca = a.getAttribLocation(this.ta, "aVertexPosition");
        a.enableVertexAttribArray(this.ta.ca);
        this.ta.Ga = a.getAttribLocation(this.ta, "aTextureCoord");
        a.enableVertexAttribArray(this.ta.Ga)
    }
    ;
    e.prototype.vc = function() {
        var a = this.m.a;
        if (!a)
            return !1;
        if (this.kb = a.createFramebuffer()) {
            a.bindFramebuffer(a.FRAMEBUFFER, this.kb);
            this.kb.width = 1024;
            this.kb.height = 1024;
            this.Pc = a.createTexture();
            a.bindTexture(a.TEXTURE_2D, this.Pc);
            a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.LINEAR);
            a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, a.LINEAR);
            a.texImage2D(a.TEXTURE_2D, 0, a.RGBA, this.kb.width, this.kb.height, 0, a.RGBA, a.UNSIGNED_BYTE, null);
            var b = a.createRenderbuffer();
            a.bindRenderbuffer(a.RENDERBUFFER, b);
            a.renderbufferStorage(a.RENDERBUFFER, a.DEPTH_COMPONENT16, this.kb.width, this.kb.height);
            a.framebufferTexture2D(a.FRAMEBUFFER, a.COLOR_ATTACHMENT0, a.TEXTURE_2D, this.Pc, 0);
            a.framebufferRenderbuffer(a.FRAMEBUFFER, a.DEPTH_ATTACHMENT, a.RENDERBUFFER, b);
            a.bindTexture(a.TEXTURE_2D, null);
            a.bindRenderbuffer(a.RENDERBUFFER, null);
            a.bindFramebuffer(a.FRAMEBUFFER, null);
            return !0
        }
        return !1
    }
    ;
    e.prototype.vh = function(a) {
        var b = this.m.a
          , c = this.m.Ta;
        if (this.Dc) {
            b.useProgram(this.ga);
            b.bindBuffer(b.ARRAY_BUFFER, this.m.Fa);
            b.vertexAttribPointer(this.ga.ca, this.m.Fa.Qb, b.FLOAT, !1, 0, 0);
            b.bindBuffer(b.ARRAY_BUFFER, this.m.dd);
            b.vertexAttribPointer(this.ga.Ga, 2, b.FLOAT, !1, 0, 0);
            b.activeTexture(b.TEXTURE0);
            b.bindTexture(b.TEXTURE_2D, this.Pc);
            var c = 1 + (this.Na - 1) * a
              , d = b.getUniformLocation(this.ga, "uAlpha");
            b.uniform1f(d, 1);
            d = b.getUniformLocation(this.ga, "uZoomIn");
            b.uniform1i(d, 1);
            var d = b.getUniformLocation(this.ga, "uZoomCenter")
              , f = .5 + (this.de - .5) * Math.sqrt(a)
              , e = .5 + (this.ee - .5) * Math.sqrt(a);
            0 > f - .5 / c && (f = .5 / c);
            0 > e - .5 / c && (e = .5 / c);
            1 < f + .5 / c && (f = 1 - .5 / c);
            1 < e + .5 / c && (e = 1 - .5 / c);
            b.uniform2f(d, f, e);
            f = b.getUniformLocation(this.ga, "uZoomFactor");
            b.uniform1f(f, c);
            b.uniform1i(b.getUniformLocation(this.ga, "uSampler"), 0);
            b.drawArrays(b.TRIANGLE_STRIP, 0, this.m.Fa.yc);
            b.useProgram(this.m.F)
        } else {
            this.m.Zd();
            b.blendFuncSeparate(b.SRC_ALPHA, b.ONE_MINUS_SRC_ALPHA, b.SRC_ALPHA, b.ONE);
            b.enable(b.BLEND);
            b.disable(b.DEPTH_TEST);
            f = .5 + (this.de - .5);
            e = .5 + (this.ee - .5);
            0 > f - .5 / this.Na && (f = .5 / this.Na);
            0 > e - .5 / this.Na && (e = .5 / this.Na);
            1 < f + .5 / this.Na && (f = 1 - .5 / this.Na);
            1 < e + .5 / this.Na && (e = 1 - .5 / this.Na);
            if ("crossdissolve" == this.type)
                b.useProgram(this.ga),
                b.bindBuffer(b.ARRAY_BUFFER, this.m.Fa),
                b.vertexAttribPointer(this.ga.ca, this.m.Fa.Qb, b.FLOAT, !1, 0, 0),
                b.bindBuffer(b.ARRAY_BUFFER, this.m.dd),
                b.vertexAttribPointer(this.ga.Ga, 2, b.FLOAT, !1, 0, 0),
                b.activeTexture(b.TEXTURE0),
                b.bindTexture(b.TEXTURE_2D, this.Pc),
                d = b.getUniformLocation(this.ga, "uAlpha"),
                b.uniform1f(d, 1 - a),
                d = b.getUniformLocation(this.ga, "uZoomIn"),
                b.uniform1i(d, 1 == this.Ba || 2 == this.Ba ? 1 : 0),
                d = b.getUniformLocation(this.ga, "uZoomCenter"),
                b.uniform2f(d, f, e),
                f = b.getUniformLocation(this.ga, "uZoomFactor"),
                b.uniform1f(f, this.Na),
                b.uniform1i(b.getUniformLocation(this.ga, "uSampler"), 0);
            else if ("diptocolor" == this.type)
                b.useProgram(this.ya),
                b.bindBuffer(b.ARRAY_BUFFER, this.m.Fa),
                b.vertexAttribPointer(this.ya.ca, this.m.Fa.Qb, b.FLOAT, !1, 0, 0),
                b.bindBuffer(b.ARRAY_BUFFER, this.m.dd),
                b.vertexAttribPointer(this.ya.Ga, 2, b.FLOAT, !1, 0, 0),
                b.activeTexture(b.TEXTURE0),
                b.bindTexture(b.TEXTURE_2D, this.Pc),
                b.uniform1f(b.getUniformLocation(this.ya, "uColorPercent"), Math.min(2 * a, 1)),
                d = b.getUniformLocation(this.ya, "uAlpha"),
                a = Math.max(2 * (a - .5), 0),
                b.uniform1f(d, 1 - a),
                b.uniform3f(b.getUniformLocation(this.ya, "uDipColor"), (this.he >> 16 & 255) / 255, (this.he >> 8 & 255) / 255, (this.he & 255) / 255),
                d = b.getUniformLocation(this.ya, "uZoomIn"),
                b.uniform1i(d, 1 == this.Ba || 2 == this.Ba ? 1 : 0),
                d = b.getUniformLocation(this.ya, "uZoomCenter"),
                b.uniform2f(d, f, e),
                f = b.getUniformLocation(this.ya, "uZoomFactor"),
                b.uniform1f(f, this.Na),
                b.uniform1i(b.getUniformLocation(this.ya, "uSampler"), 0);
            else if ("irisround" == this.type || "irisrectangular" == this.type) {
                b.useProgram(this.qa);
                b.bindBuffer(b.ARRAY_BUFFER, this.m.Fa);
                b.vertexAttribPointer(this.qa.ca, this.m.Fa.Qb, b.FLOAT, !1, 0, 0);
                b.bindBuffer(b.ARRAY_BUFFER, this.m.dd);
                b.vertexAttribPointer(this.qa.Ga, 2, b.FLOAT, !1, 0, 0);
                b.activeTexture(b.TEXTURE0);
                b.bindTexture(b.TEXTURE_2D, this.Pc);
                var g;
                1 == this.Ba || 2 == this.Ba ? g = d = .5 : (d = this.de,
                g = this.ee);
                var k = d * c.width
                  , l = g * c.height
                  , k = Math.max(k, c.width - k)
                  , l = Math.max(l, c.height - l);
                "irisround" == this.type ? b.uniform1f(b.getUniformLocation(this.qa, "uRadius"), (Math.sqrt(k * k + l * l) + this.Zb) * a) : (k > l ? (l = c.height / c.width * k + this.Zb,
                k += this.Zb) : (k = c.width / c.height * l + this.Zb,
                l += this.Zb),
                b.uniform2f(b.getUniformLocation(this.qa, "uRectDim"), k * a, l * a));
                a = b.getUniformLocation(this.qa, "uSoftEdge");
                b.uniform1f(a, this.Zb);
                b.uniform1i(b.getUniformLocation(this.qa, "uRound"), "irisround" == this.type ? 1 : 0);
                b.uniform2f(b.getUniformLocation(this.qa, "uIrisCenter"), d * c.width, g * c.height);
                d = b.getUniformLocation(this.qa, "uZoomIn");
                b.uniform1i(d, 1 == this.Ba || 2 == this.Ba ? 1 : 0);
                d = b.getUniformLocation(this.qa, "uZoomCenter");
                b.uniform2f(d, f, e);
                f = b.getUniformLocation(this.qa, "uZoomFactor");
                b.uniform1f(f, this.Na);
                b.uniform1i(b.getUniformLocation(this.qa, "uSampler"), 0)
            } else if ("wipeleftright" == this.type || "wiperightleft" == this.type || "wipetopbottom" == this.type || "wipebottomtop" == this.type || "wiperandom" == this.type)
                b.useProgram(this.ta),
                b.bindBuffer(b.ARRAY_BUFFER, this.m.Fa),
                b.vertexAttribPointer(this.ta.ca, this.m.Fa.Qb, b.FLOAT, !1, 0, 0),
                b.bindBuffer(b.ARRAY_BUFFER, this.m.dd),
                b.vertexAttribPointer(this.ta.Ga, 2, b.FLOAT, !1, 0, 0),
                b.activeTexture(b.TEXTURE0),
                b.bindTexture(b.TEXTURE_2D, this.Pc),
                b.uniform1f(b.getUniformLocation(this.ta, "uPercent"), 3 > this.uf ? a * (c.width + this.Zb) : a * (c.height + this.Zb)),
                a = b.getUniformLocation(this.ta, "uSoftEdge"),
                b.uniform1f(a, this.Zb),
                b.uniform1i(b.getUniformLocation(this.ta, "uDirection"), this.uf),
                b.uniform2f(b.getUniformLocation(this.ta, "uCanvasDimensions"), c.width, c.height),
                d = b.getUniformLocation(this.ta, "uZoomIn"),
                b.uniform1i(d, 1 == this.Ba || 2 == this.Ba ? 1 : 0),
                d = b.getUniformLocation(this.ta, "uZoomCenter"),
                b.uniform2f(d, f, e),
                f = b.getUniformLocation(this.ta, "uZoomFactor"),
                b.uniform1f(f, this.Na),
                b.uniform1i(b.getUniformLocation(this.ta, "uSampler"), 0);
            b.drawArrays(b.TRIANGLE_STRIP, 0, this.m.Fa.yc);
            b.useProgram(this.m.F);
            b.disable(b.BLEND);
            b.enable(b.DEPTH_TEST)
        }
    }
    ;
    return e
}()
  , O = function() {
    function e(a) {
        this.Yd = [];
        this.m = a;
        this.enable = !1;
        this.Ec = 2;
        this.sg = !1
    }
    e.prototype.yf = function(a) {
        if (2 == a.mode || 3 == a.mode || 5 == a.mode) {
            var b = this.m.lb.currentTime
              , c = a.zb.gain.value
              , d = a.xb.gain.value
              , f = a.yb.gain.value;
            a.wb.gain.linearRampToValueAtTime(a.wb.gain.value, b);
            a.wb.gain.linearRampToValueAtTime(0, b + this.Ec);
            a.zb.gain.linearRampToValueAtTime(c, b);
            a.zb.gain.linearRampToValueAtTime(0, b + this.Ec);
            a.xb.gain.linearRampToValueAtTime(d, b);
            a.xb.gain.linearRampToValueAtTime(0, b + this.Ec);
            a.yb.gain.linearRampToValueAtTime(f, b);
            a.yb.gain.linearRampToValueAtTime(0, b + this.Ec)
        } else
            b = this.m.lb.currentTime,
            a.fc.gain.linearRampToValueAtTime(a.fc.gain.value, b),
            a.fc.gain.linearRampToValueAtTime(0, b + this.Ec);
        a.zf = !0
    }
    ;
    e.prototype.fk = function() {
        for (var a = 0; a < this.m.P.length; a++) {
            var b = this.m.P[a];
            this.m.xc(b.id) || 4 == b.mode || 6 == b.mode || (b.c.play(),
            b.c.currentTime = 0)
        }
    }
    ;
    e.prototype.Ci = function() {
        for (var a = (this.m.lb.currentTime - this.ck) / this.Ec, a = Math.min(1, a), b = 0; b < this.m.P.length; b++) {
            var c = this.m.P[b];
            this.m.xc(c.id) && 1 > c.aa && (c.aa = a)
        }
        1 == a && clearInterval(this.bk)
    }
    ;
    return e
}()
  , P = function() {
    function e(a) {
        this.Od = [];
        this.ac = null;
        this.ib = [];
        this.cb = [];
        this.jb = [];
        this.m = a;
        this.yi()
    }
    e.prototype.Jd = function() {
        var a = this.m.a, b = a.createShader(a.VERTEX_SHADER), c;
        c = "attribute vec3 aVertexPosition;\nvoid main(void) {\n";
        c += " gl_Position = vec4(aVertexPosition, 1.0);\n";
        c += "}\n";
        a.shaderSource(b, c);
        a.compileShader(b);
        a.getShaderParameter(b, a.COMPILE_STATUS) || (alert(a.getShaderInfoLog(b)),
        b = null);
        var d = a.createShader(a.FRAGMENT_SHADER);
        c = "#ifdef GL_FRAGMENT_PRECISION_HIGH\n";
        c += "precision highp float;\n";
        c += "#else\n";
        c += "precision mediump float;\n";
        c += "#endif\n";
        c += "varying vec4 vColor;\n";
        c += "uniform vec2 uCanvasDimensions;\n";
        c += "uniform vec2 uFlareCenterPosition;\n";
        c += "uniform float uBlindingValue;\n";
        c += "uniform float uAspectRatio;\n";
        c += "void main(void) {\n";
        c += " float canvasDiag = sqrt( (uCanvasDimensions.x * uCanvasDimensions.x) + (uCanvasDimensions.y * uCanvasDimensions.y) );\n";
        c += " vec2 diff = uFlareCenterPosition - gl_FragCoord.xy;\n";
        c += " diff.y = diff.y * uAspectRatio;\n";
        c += " float distFromFlarePoint = sqrt( (diff.x * diff.x) + (diff.y * diff.y) );\n";
        c += " float factor = (distFromFlarePoint / canvasDiag) / 10.0;\n";
        c += " gl_FragColor = vec4(1.0, 1.0, 1.0, pow(((1.0 - factor) * 0.8) * uBlindingValue, 2.0));\n";
        c += "}\n";
        a.shaderSource(d, c);
        a.compileShader(d);
        a.getShaderParameter(d, a.COMPILE_STATUS) || (alert(a.getShaderInfoLog(d)),
        d = null);
        this.nb = a.createProgram();
        a.attachShader(this.nb, b);
        a.attachShader(this.nb, d);
        a.linkProgram(this.nb);
        a.getProgramParameter(this.nb, a.LINK_STATUS) || alert("Could not initialise shaders");
        this.nb.ca = a.getAttribLocation(this.nb, "aVertexPosition");
        a.enableVertexAttribArray(this.nb.ca);
        d = a.createShader(a.VERTEX_SHADER);
        b = a.createShader(a.VERTEX_SHADER);
        c = "#ifdef GL_FRAGMENT_PRECISION_HIGH\n";
        c += "precision highp float;\n";
        c += "#else\n";
        c += "precision mediump float;\n";
        c += "#endif\n";
        c += "attribute vec3 aVertexPosition;\n";
        c += "varying vec4 vColor;\n";
        c += "uniform vec2 uCirclePosition;\n";
        c += "uniform float uCircleRadius;\n";
        c += "uniform vec2 uCanvasDimensions2;\n";
        c += "uniform float uAspectRatio;\n";
        c += "void main(void) {\n";
        c += " vec2 circleOnScreen = aVertexPosition.xy * uCircleRadius + uCirclePosition;\n";
        c += " circleOnScreen.y = circleOnScreen.y / uAspectRatio;\n";
        c += " vec2 circleNorm = (circleOnScreen / uCanvasDimensions2) * 2.0 - vec2(1.0, 1.0);\n";
        c += " gl_Position = vec4(circleNorm.x, circleNorm.y, 0.0, 1.0);\n";
        c += "}\n";
        a.shaderSource(d, c);
        a.compileShader(d);
        a.getShaderParameter(d, a.COMPILE_STATUS) || (alert(a.getShaderInfoLog(d)),
        d = null);
        a.shaderSource(b, c);
        a.compileShader(b);
        a.getShaderParameter(b, a.COMPILE_STATUS) || (alert(a.getShaderInfoLog(b)),
        d = null);
        var f = a.createShader(a.FRAGMENT_SHADER);
        c = "#ifdef GL_FRAGMENT_PRECISION_HIGH\n";
        c += "precision highp float;\n";
        c += "#else\n";
        c += "precision mediump float;\n";
        c += "#endif\n";
        c += "varying vec4 vColor;\n";
        c += "uniform vec2 uCircleTexturePosition;\n";
        c += "uniform vec3 uCircleColor;\n";
        c += "uniform float uCircleRadius;\n";
        c += "uniform float uCircleAlpha;\n";
        c += "uniform float uCircleSoftness;\n";
        c += "uniform float uAspectRatio;\n";
        c += "void main(void) {\n";
        c += " vec2 diff = uCircleTexturePosition - gl_FragCoord.xy;\n";
        c += " diff.y = diff.y * uAspectRatio;\n";
        c += " float distFromCircleCenter = sqrt( (diff.x * diff.x) + (diff.y * diff.y) );\n";
        c += " float softnessDistance = uCircleRadius * (1.0 - uCircleSoftness);\n";
        c += " if (distFromCircleCenter > uCircleRadius)\n";
        c += " {\n";
        c += "\t  gl_FragColor = vec4(uCircleColor, 0.0);\n";
        c += " }\n";
        c += " else if (distFromCircleCenter <= (softnessDistance))\n";
        c += " {\n";
        c += "\t  float factor = distFromCircleCenter / softnessDistance;\n";
        c += "\t  gl_FragColor = vec4(uCircleColor, pow((1.0 - (0.2 * factor)) * uCircleAlpha, 1.8));\n";
        c += " }\n";
        c += " else\n";
        c += " {\n";
        c += "\t  float factor = (distFromCircleCenter - softnessDistance) / (uCircleRadius - softnessDistance);\n";
        c += "\t  gl_FragColor = vec4(uCircleColor, pow((0.8 - (0.8 * factor)) * uCircleAlpha, 1.8));\n";
        c += " }\n";
        c += "}\n";
        a.shaderSource(f, c);
        a.compileShader(f);
        a.getShaderParameter(f, a.COMPILE_STATUS) || (alert(a.getShaderInfoLog(f)),
        f = null);
        this.fa = a.createProgram();
        a.attachShader(this.fa, d);
        a.attachShader(this.fa, f);
        a.linkProgram(this.fa);
        a.getProgramParameter(this.fa, a.LINK_STATUS) || alert("Could not initialise shaders");
        this.fa.ca = a.getAttribLocation(this.fa, "aVertexPosition");
        a.enableVertexAttribArray(this.fa.ca);
        d = a.createShader(a.FRAGMENT_SHADER);
        c = "#ifdef GL_FRAGMENT_PRECISION_HIGH\n";
        c += "precision highp float;\n";
        c += "#else\n";
        c += "precision mediump float;\n";
        c += "#endif\n";
        c += "varying vec4 vColor;\n";
        c += "uniform vec2 uRingTexturePosition;\n";
        c += "uniform float uRingRadius;\n";
        c += "uniform float uRingAlpha;\n";
        c += "uniform float uAspectRatio;\n";
        c += "uniform sampler2D uSampler;\n";
        c += "void main(void) {\n";
        c += " vec2 diff = uRingTexturePosition - gl_FragCoord.xy;\n";
        c += " diff.y = diff.y * uAspectRatio;\n";
        c += " float distFromRingCenter = sqrt( (diff.x * diff.x) + (diff.y * diff.y) );\n";
        c += " float factor = distFromRingCenter / uRingRadius;\n";
        c += " if (distFromRingCenter > uRingRadius)\n";
        c += " {\n";
        c += "\t gl_FragColor = vec4(1.0, 1.0, 1.0, 0.0);\n";
        c += " }\n";
        c += " else\n";
        c += " {\n";
        c += " vec4 textureColor = texture2D(uSampler, vec2(factor / uAspectRatio, 0.5));\n";
        c += " gl_FragColor = vec4(textureColor.x, textureColor.y, textureColor.z, uRingAlpha);\n";
        c += " }\n";
        c += "}\n";
        a.shaderSource(d, c);
        a.compileShader(d);
        a.getShaderParameter(d, a.COMPILE_STATUS) || (alert(a.getShaderInfoLog(d)),
        d = null);
        this.La = a.createProgram();
        a.attachShader(this.La, b);
        a.attachShader(this.La, d);
        a.linkProgram(this.La);
        a.getProgramParameter(this.La, a.LINK_STATUS) || alert("Could not initialise shaders");
        this.La.ca = a.getAttribLocation(this.La, "aVertexPosition")
    }
    ;
    e.prototype.vc = function() {
        var a = this.m.a;
        this.ec = a.createBuffer();
        a.bindBuffer(a.ARRAY_BUFFER, this.ec);
        a.bufferData(a.ARRAY_BUFFER, new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0]), a.STATIC_DRAW);
        this.ec.Qb = 3;
        this.ec.yc = 4;
        this.Wc = a.createBuffer();
        a.bindBuffer(a.ARRAY_BUFFER, this.Wc);
        for (var b = [0, 0, 0], c = 2 * Math.PI / 6, d = Math.PI / 180 * 35, f = 1, e = d; e <= d + 2 * Math.PI; e += c)
            b.push(Math.sin(e)),
            b.push(-Math.cos(e)),
            b.push(0),
            f++;
        a.bufferData(a.ARRAY_BUFFER, new Float32Array(b), a.STATIC_DRAW);
        this.Wc.Qb = 3;
        this.Wc.yc = f;
        this.Eh = a.createTexture();
        a.bindTexture(a.TEXTURE_2D, this.Eh);
        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.LINEAR);
        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, a.LINEAR);
        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_S, a.CLAMP_TO_EDGE);
        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_T, a.CLAMP_TO_EDGE);
        b = document.createElement("canvas");
        b.width = 100;
        b.height = 1;
        c = b.getContext("2d");
        c.width = 100;
        c.height = 1;
        d = c.createLinearGradient(0, 0, 100, 0);
        d.addColorStop(0, this.m.X(16777215, 0));
        d.addColorStop(.88, this.m.X(0, 0));
        d.addColorStop(.9, this.m.X(16654848, 1));
        d.addColorStop(.92, this.m.X(16776448, 1));
        d.addColorStop(.94, this.m.X(4849466, 1));
        d.addColorStop(.96, this.m.X(131071, 1));
        d.addColorStop(.98, this.m.X(8190, 1));
        d.addColorStop(1, this.m.X(0, 0));
        c.fillStyle = d;
        c.fillRect(0, 0, 100, 1);
        a.texImage2D(a.TEXTURE_2D, 0, a.RGBA, a.RGBA, a.UNSIGNED_BYTE, b)
    }
    ;
    e.prototype.Hj = function() {
        for (; 0 < this.Od.length; )
            this.Od.pop()
    }
    ;
    e.prototype.yi = function() {
        var a = []
          , b = []
          , c = []
          , d = {
            i: 14,
            alpha: .2,
            color: 11390415,
            h: .27
        };
        a.push(d);
        d = {
            i: 20,
            alpha: .25,
            color: 11390415,
            h: .4
        };
        a.push(d);
        d = {
            i: 10,
            alpha: .2,
            color: 12442332,
            h: .6
        };
        a.push(d);
        d = {
            i: 15,
            alpha: .2,
            color: 11390415,
            h: .8
        };
        a.push(d);
        d = {
            i: 10,
            alpha: .2,
            color: 12442332,
            h: 1.5
        };
        a.push(d);
        d = {
            i: 15,
            alpha: .2,
            color: 11390415,
            h: 1.8
        };
        a.push(d);
        d = {
            i: 8,
            alpha: .2,
            color: 12575203,
            s: .8,
            h: .7
        };
        b.push(d);
        d = {
            i: 7,
            alpha: .4,
            color: 12575203,
            s: .5,
            h: 1.6
        };
        b.push(d);
        d = {
            i: 5,
            alpha: .4,
            color: 12575203,
            s: .6,
            h: .9
        };
        b.push(d);
        d = {
            i: 8,
            alpha: .3,
            color: 12575203,
            s: .4,
            h: 1.1
        };
        b.push(d);
        this.ib.push(a);
        this.cb.push(b);
        this.jb.push(c);
        a = [];
        b = [];
        c = [];
        d = {
            i: 30,
            alpha: .3,
            color: 11390415,
            h: .5
        };
        a.push(d);
        d = {
            i: 10,
            alpha: .3,
            color: 11390415,
            h: 1
        };
        a.push(d);
        d = {
            i: 20,
            alpha: .3,
            color: 11390415,
            h: 1.3
        };
        a.push(d);
        d = {
            i: 10,
            alpha: .3,
            color: 11390415,
            h: 1.5
        };
        a.push(d);
        d = {
            i: 15,
            alpha: .3,
            color: 11390415,
            h: 1.8
        };
        a.push(d);
        d = {
            i: 10,
            alpha: .3,
            color: 15506856,
            s: .8,
            h: .7
        };
        b.push(d);
        d = {
            i: 20,
            alpha: .5,
            color: 15506856,
            s: .5,
            h: 1.6
        };
        b.push(d);
        d = {
            i: 5,
            alpha: .5,
            color: 15506856,
            s: .6,
            h: .9
        };
        b.push(d);
        d = {
            i: 60,
            alpha: .4,
            color: 15506856,
            s: .2,
            h: 1.1
        };
        b.push(d);
        c.push({
            i: 220,
            alpha: .035,
            h: 2
        });
        this.ib.push(a);
        this.cb.push(b);
        this.jb.push(c);
        a = [];
        b = [];
        c = [];
        d = {
            i: 30,
            alpha: .5,
            color: 15465727,
            h: .5
        };
        a.push(d);
        d = {
            i: 40,
            alpha: .28,
            color: 15726842,
            h: .8
        };
        a.push(d);
        d = {
            i: 25,
            alpha: .32,
            color: 15726842,
            h: 1.1
        };
        a.push(d);
        d = {
            i: 15,
            alpha: .25,
            color: 15726842,
            h: 1.35
        };
        a.push(d);
        d = {
            i: 10,
            alpha: .28,
            color: 15465727,
            h: 1.65
        };
        a.push(d);
        d = {
            i: 10,
            alpha: .45,
            color: 15465727,
            s: .8,
            h: .7
        };
        b.push(d);
        d = {
            i: 7,
            alpha: .5,
            color: 15465727,
            s: .4,
            h: .9
        };
        b.push(d);
        d = {
            i: 40,
            alpha: .4,
            color: 15465727,
            s: .3,
            h: .38
        };
        b.push(d);
        d = {
            i: 50,
            alpha: .4,
            color: 15465727,
            s: .5,
            h: 1.25
        };
        b.push(d);
        d = {
            i: 18,
            alpha: .2,
            color: 15465727,
            s: .5,
            h: 1.25
        };
        b.push(d);
        d = {
            i: 10,
            alpha: .34,
            color: 15726842,
            s: .8,
            h: 1.5
        };
        b.push(d);
        d = {
            i: 38,
            alpha: .37,
            color: 15465727,
            s: .3,
            h: -.5
        };
        b.push(d);
        this.ib.push(a);
        this.cb.push(b);
        this.jb.push(c);
        a = [];
        b = [];
        c = [];
        d = {
            i: 16,
            alpha: .5,
            color: 16363159,
            h: .1
        };
        a.push(d);
        d = {
            i: 26,
            alpha: .3,
            color: 16091819,
            h: .32
        };
        a.push(d);
        d = {
            i: 29,
            alpha: .2,
            color: 16091819,
            h: 1.32
        };
        a.push(d);
        d = {
            i: 20,
            alpha: .18,
            color: 16363159,
            h: 1.53
        };
        a.push(d);
        d = {
            i: 27,
            alpha: .13,
            color: 16425092,
            h: 1.6
        };
        a.push(d);
        d = {
            i: 20,
            alpha: .1,
            color: 16091819,
            h: 1.75
        };
        a.push(d);
        d = {
            i: 12,
            alpha: .45,
            color: 16312238,
            s: .45,
            h: .2
        };
        b.push(d);
        d = {
            i: 8,
            alpha: .25,
            color: 16434209,
            s: .7,
            h: .33
        };
        b.push(d);
        d = {
            i: 9,
            alpha: .25,
            color: 16091819,
            s: .4,
            h: .7
        };
        b.push(d);
        d = {
            i: 7,
            alpha: .2,
            color: 16091819,
            s: .4,
            h: .85
        };
        b.push(d);
        d = {
            i: 60,
            alpha: .23,
            color: 16091819,
            s: .55,
            h: 1.05
        };
        b.push(d);
        d = {
            i: 37,
            alpha: .1,
            color: 16091819,
            s: .55,
            h: 1.22
        };
        b.push(d);
        d = {
            i: 10,
            alpha: .25,
            color: 16363159,
            s: .65,
            h: 1.38
        };
        b.push(d);
        d = {
            i: 7,
            alpha: .2,
            color: 16434209,
            s: .5,
            h: 1.45
        };
        b.push(d);
        d = {
            i: 3,
            alpha: .2,
            color: 16416033,
            s: .5,
            h: 1.78
        };
        b.push(d);
        d = {
            i: 6,
            alpha: .18,
            color: 16434209,
            s: .45,
            h: 1.9
        };
        b.push(d);
        d = {
            i: 4,
            alpha: .14,
            color: 16766514,
            s: .45,
            h: 2.04
        };
        b.push(d);
        d = {
            i: 30,
            alpha: .14,
            color: 16766514,
            s: .8,
            h: .04
        };
        b.push(d);
        this.ib.push(a);
        this.cb.push(b);
        this.jb.push(c);
        a = [];
        b = [];
        c = [];
        d = {
            i: 9,
            alpha: .3,
            color: 14346999,
            s: .3,
            h: .3
        };
        b.push(d);
        d = {
            i: 5,
            alpha: .5,
            color: 14148072,
            s: .8,
            h: .6
        };
        b.push(d);
        d = {
            i: 3,
            alpha: .37,
            color: 14346999,
            s: .66,
            h: .8
        };
        b.push(d);
        d = {
            i: 45,
            alpha: .2,
            color: 14346999,
            s: .36,
            h: 1.2
        };
        b.push(d);
        d = {
            i: 13,
            alpha: .2,
            color: 14346999,
            s: .36,
            h: 1.23
        };
        b.push(d);
        d = {
            i: 11,
            alpha: .2,
            color: 14148072,
            s: .36,
            h: 1.28
        };
        b.push(d);
        d = {
            i: 27,
            alpha: .16,
            color: 14346999,
            s: .36,
            h: 1.55
        };
        b.push(d);
        d = {
            i: 6,
            alpha: .36,
            color: 14148072,
            s: .8,
            h: 1.7
        };
        b.push(d);
        this.ib.push(a);
        this.cb.push(b);
        this.jb.push(c);
        a = [];
        b = [];
        c = [];
        d = {
            i: 24,
            alpha: .2,
            color: 15186464,
            h: .2
        };
        a.push(d);
        d = {
            i: 7,
            alpha: .26,
            color: 15186464,
            h: .35
        };
        a.push(d);
        d = {
            i: 23,
            alpha: .18,
            color: 15186464,
            h: .65
        };
        a.push(d);
        d = {
            i: 13,
            alpha: .2,
            color: 15186464,
            h: .8
        };
        a.push(d);
        d = {
            i: 11,
            alpha: .15,
            color: 15186464,
            h: 1.4
        };
        a.push(d);
        d = {
            i: 15,
            alpha: .11,
            color: 15451904,
            h: 1.6
        };
        a.push(d);
        d = {
            i: 6,
            alpha: .45,
            color: 15579138,
            s: .45,
            h: .22
        };
        b.push(d);
        d = {
            i: 3,
            alpha: .3,
            color: 15451904,
            s: .25,
            h: .4
        };
        b.push(d);
        d = {
            i: 4,
            alpha: .2,
            color: 15451904,
            s: .25,
            h: .45
        };
        b.push(d);
        d = {
            i: 65,
            alpha: .17,
            color: 15186464,
            s: .25,
            h: .5
        };
        b.push(d);
        d = {
            i: 5,
            alpha: .45,
            color: 15579138,
            s: .45,
            h: .88
        };
        b.push(d);
        d = {
            i: 140,
            alpha: .18,
            color: 15579138,
            s: .32,
            h: .95
        };
        b.push(d);
        d = {
            i: 12,
            alpha: .22,
            color: 15579138,
            s: .32,
            h: 1.1
        };
        b.push(d);
        d = {
            i: 8,
            alpha: .32,
            color: 15451904,
            s: .72,
            h: 1.2
        };
        b.push(d);
        d = {
            i: 55,
            alpha: .2,
            color: 15451904,
            s: .45,
            h: 1.33
        };
        b.push(d);
        d = {
            i: 4,
            alpha: .3,
            color: 15451904,
            s: .25,
            h: 1.42
        };
        b.push(d);
        this.ib.push(a);
        this.cb.push(b);
        this.jb.push(c);
        a = [];
        b = [];
        c = [];
        d = {
            i: 16,
            alpha: .4,
            color: 10933495,
            h: .32
        };
        a.push(d);
        d = {
            i: 14,
            alpha: .3,
            color: 11007484,
            h: .36
        };
        a.push(d);
        d = {
            i: 10,
            alpha: .3,
            color: 4037331,
            h: .58
        };
        a.push(d);
        d = {
            i: 14,
            alpha: .22,
            color: 8835068,
            h: .68
        };
        a.push(d);
        d = {
            i: 10,
            alpha: .27,
            color: 11007484,
            h: .82
        };
        a.push(d);
        d = {
            i: 11,
            alpha: .27,
            color: 10867450,
            h: 1
        };
        a.push(d);
        d = {
            i: 9,
            alpha: .2,
            color: 6158332,
            h: 1.05
        };
        a.push(d);
        d = {
            i: 10,
            alpha: .17,
            color: 10867450,
            h: 1.78
        };
        a.push(d);
        d = {
            i: 10,
            alpha: .3,
            color: 4037331,
            h: -.23
        };
        a.push(d);
        d = {
            i: 8,
            alpha: .45,
            color: 8835068,
            s: .45,
            h: .175
        };
        b.push(d);
        d = {
            i: 7,
            alpha: .4,
            color: 12574715,
            s: .55,
            h: .46
        };
        b.push(d);
        d = {
            i: 3,
            alpha: .3,
            color: 10867450,
            s: .35,
            h: .5
        };
        b.push(d);
        d = {
            i: 60,
            alpha: .37,
            color: 4031699,
            s: .75,
            h: .75
        };
        b.push(d);
        d = {
            i: 3,
            alpha: .25,
            color: 4031699,
            s: .25,
            h: .75
        };
        b.push(d);
        d = {
            i: 3,
            alpha: .2,
            color: 6158332,
            s: .25,
            h: .9
        };
        b.push(d);
        d = {
            i: 7,
            alpha: .45,
            color: 8835068,
            s: .45,
            h: 1.3
        };
        b.push(d);
        d = {
            i: 32,
            alpha: .22,
            color: 8835068,
            s: .75,
            h: 1.62
        };
        b.push(d);
        d = {
            i: 9,
            alpha: .45,
            color: 4031699,
            s: .65,
            h: 1.6
        };
        b.push(d);
        d = {
            i: 8,
            alpha: .25,
            color: 4031699,
            s: .65,
            h: 1.83
        };
        b.push(d);
        d = {
            i: 7,
            alpha: .4,
            color: 12574715,
            s: .55,
            h: -.18
        };
        b.push(d);
        this.ib.push(a);
        this.cb.push(b);
        this.jb.push(c);
        a = [];
        b = [];
        c = [];
        d = {
            i: 16,
            alpha: .4,
            color: 16389120,
            h: .32
        };
        a.push(d);
        d = {
            i: 26,
            alpha: .22,
            color: 16389120,
            h: .4
        };
        a.push(d);
        d = {
            i: 26,
            alpha: .25,
            color: 16389120,
            h: .65
        };
        a.push(d);
        d = {
            i: 18,
            alpha: .3,
            color: 16389120,
            h: 1.23
        };
        a.push(d);
        d = {
            i: 14,
            alpha: .26,
            color: 16389120,
            h: 1.33
        };
        a.push(d);
        d = {
            i: 17,
            alpha: .18,
            color: 16389120,
            h: 1.7
        };
        a.push(d);
        d = {
            i: 30,
            alpha: .16,
            color: 16389120,
            h: 2.15
        };
        a.push(d);
        d = {
            i: 100,
            alpha: .25,
            color: 16389120,
            s: .22,
            h: 1.45
        };
        b.push(d);
        d = {
            i: 7,
            alpha: .5,
            color: 15628151,
            s: .3,
            h: 1.5
        };
        b.push(d);
        d = {
            i: 3,
            alpha: .5,
            color: 15628151,
            s: .3,
            h: 1.52
        };
        b.push(d);
        d = {
            i: 4,
            alpha: .5,
            color: 16389120,
            s: .3,
            h: 1.745
        };
        b.push(d);
        d = {
            i: 9,
            alpha: .22,
            color: 16389120,
            s: .3,
            h: 1.8
        };
        b.push(d);
        this.ib.push(a);
        this.cb.push(b);
        this.jb.push(c);
        a = [];
        b = [];
        c = [];
        d = {
            i: 16,
            alpha: .4,
            color: 10933495,
            h: .32
        };
        a.push(d);
        d = {
            i: 14,
            alpha: .3,
            color: 11007484,
            h: .36
        };
        a.push(d);
        d = {
            i: 10,
            alpha: .3,
            color: 4037331,
            h: .58
        };
        a.push(d);
        d = {
            i: 14,
            alpha: .22,
            color: 8835068,
            h: .68
        };
        a.push(d);
        d = {
            i: 10,
            alpha: .27,
            color: 11007484,
            h: .82
        };
        a.push(d);
        d = {
            i: 11,
            alpha: .27,
            color: 10867450,
            h: 1
        };
        a.push(d);
        d = {
            i: 9,
            alpha: .2,
            color: 6158332,
            h: 1.05
        };
        a.push(d);
        d = {
            i: 10,
            alpha: .17,
            color: 10867450,
            h: 1.78
        };
        a.push(d);
        d = {
            i: 10,
            alpha: .3,
            color: 4037331,
            h: -.23
        };
        a.push(d);
        d = {
            i: 8,
            alpha: .45,
            color: 8835068,
            s: .45,
            h: .175
        };
        b.push(d);
        d = {
            i: 7,
            alpha: .4,
            color: 12574715,
            s: .55,
            h: .46
        };
        b.push(d);
        d = {
            i: 3,
            alpha: .3,
            color: 10867450,
            s: .35,
            h: .5
        };
        b.push(d);
        d = {
            i: 60,
            alpha: .37,
            color: 4031699,
            s: .75,
            h: .75
        };
        b.push(d);
        d = {
            i: 3,
            alpha: .25,
            color: 4031699,
            s: .25,
            h: .75
        };
        b.push(d);
        d = {
            i: 3,
            alpha: .2,
            color: 6158332,
            s: .25,
            h: .9
        };
        b.push(d);
        d = {
            i: 7,
            alpha: .45,
            color: 8835068,
            s: .45,
            h: 1.3
        };
        b.push(d);
        d = {
            i: 32,
            alpha: .22,
            color: 8835068,
            s: .75,
            h: 1.62
        };
        b.push(d);
        d = {
            i: 9,
            alpha: .45,
            color: 4031699,
            s: .65,
            h: 1.6
        };
        b.push(d);
        d = {
            i: 8,
            alpha: .25,
            color: 4031699,
            s: .65,
            h: 1.83
        };
        b.push(d);
        d = {
            i: 7,
            alpha: .4,
            color: 12574715,
            s: .55,
            h: -.18
        };
        b.push(d);
        this.ib.push(a);
        this.cb.push(b);
        this.jb.push(c);
        a = [];
        b = [];
        c = [];
        d = {
            i: 16,
            alpha: .4,
            color: 16389120,
            h: .32
        };
        a.push(d);
        d = {
            i: 26,
            alpha: .22,
            color: 16389120,
            h: .4
        };
        a.push(d);
        d = {
            i: 26,
            alpha: .25,
            color: 16389120,
            h: .65
        };
        a.push(d);
        d = {
            i: 18,
            alpha: .3,
            color: 16389120,
            h: 1.23
        };
        a.push(d);
        d = {
            i: 14,
            alpha: .26,
            color: 16389120,
            h: 1.33
        };
        a.push(d);
        d = {
            i: 17,
            alpha: .18,
            color: 16389120,
            h: 1.7
        };
        a.push(d);
        d = {
            i: 30,
            alpha: .16,
            color: 16389120,
            h: 2.15
        };
        a.push(d);
        d = {
            i: 100,
            alpha: .25,
            color: 16389120,
            s: .22,
            h: 1.45
        };
        b.push(d);
        d = {
            i: 7,
            alpha: .5,
            color: 15628151,
            s: .3,
            h: 1.5
        };
        b.push(d);
        d = {
            i: 3,
            alpha: .5,
            color: 15628151,
            s: .3,
            h: 1.52
        };
        b.push(d);
        d = {
            i: 4,
            alpha: .5,
            color: 16389120,
            s: .3,
            h: 1.745
        };
        b.push(d);
        d = {
            i: 9,
            alpha: .22,
            color: 16389120,
            s: .3,
            h: 1.8
        };
        b.push(d);
        this.ib.push(a);
        this.cb.push(b);
        this.jb.push(c);
        a = [];
        b = [];
        c = [];
        d = {
            i: 24,
            alpha: .2,
            color: 15186464,
            h: .2
        };
        a.push(d);
        d = {
            i: 7,
            alpha: .26,
            color: 15186464,
            h: .35
        };
        a.push(d);
        d = {
            i: 23,
            alpha: .18,
            color: 15186464,
            h: .65
        };
        a.push(d);
        d = {
            i: 13,
            alpha: .2,
            color: 15186464,
            h: .8
        };
        a.push(d);
        d = {
            i: 11,
            alpha: .15,
            color: 15186464,
            h: 1.4
        };
        a.push(d);
        d = {
            i: 15,
            alpha: .11,
            color: 15451904,
            h: 1.6
        };
        a.push(d);
        d = {
            i: 6,
            alpha: .45,
            color: 15579138,
            s: .45,
            h: .22
        };
        b.push(d);
        d = {
            i: 3,
            alpha: .3,
            color: 15451904,
            s: .25,
            h: .4
        };
        b.push(d);
        d = {
            i: 4,
            alpha: .2,
            color: 15451904,
            s: .25,
            h: .45
        };
        b.push(d);
        d = {
            i: 65,
            alpha: .17,
            color: 15186464,
            s: .25,
            h: .5
        };
        b.push(d);
        d = {
            i: 5,
            alpha: .45,
            color: 15579138,
            s: .45,
            h: .88
        };
        b.push(d);
        d = {
            i: 140,
            alpha: .18,
            color: 15579138,
            s: .32,
            h: .95
        };
        b.push(d);
        d = {
            i: 12,
            alpha: .22,
            color: 15579138,
            s: .32,
            h: 1.1
        };
        b.push(d);
        d = {
            i: 8,
            alpha: .32,
            color: 15451904,
            s: .72,
            h: 1.2
        };
        b.push(d);
        d = {
            i: 55,
            alpha: .2,
            color: 15451904,
            s: .45,
            h: 1.33
        };
        b.push(d);
        d = {
            i: 4,
            alpha: .3,
            color: 15451904,
            s: .25,
            h: 1.42
        };
        b.push(d);
        this.ib.push(a);
        this.cb.push(b);
        this.jb.push(c)
    }
    ;
    e.prototype.wj = function() {
        var a = this.m.a, b, c, d, f = new y(0,0,-100), e = this.m.bc(), g, k;
        if (this.m.ka)
            g = this.m.Ta.width,
            k = this.m.Ta.height,
            this.m.S.Xd && (g = this.m.S.kb.width,
            k = this.m.S.kb.height);
        else {
            this.H || (this.H = this.ac.getContext("2d"));
            if (this.H.width !== this.m.l.width || this.H.height !== this.m.l.height)
                this.H.width = this.m.l.width,
                this.H.height = this.m.l.height;
            this.H.clear ? this.H.clear() : this.H.clearRect(0, 0, this.ac.width, this.ac.height);
            g = this.H.width;
            k = this.H.height
        }
        var l = Math.sqrt(g * g + k * k)
          , p = l / 800;
        for (c = 0; c < this.Od.length; c++) {
            var n = this.Od[c];
            f.Ka(0, 0, -100);
            f.pa(-n.j * Math.PI / 180);
            f.wa(n.pan * Math.PI / 180);
            f.wa(-this.m.pan.b * Math.PI / 180);
            f.pa(this.m.j.b * Math.PI / 180);
            f.Ra(this.m.G.b * Math.PI / 180);
            var m = !1;
            if (-.01 > f.z) {
                var q, r;
                r = -e / f.z;
                q = f.x * r;
                r *= f.y;
                Math.abs(q) < g / 2 + 100 && Math.abs(r) < k / 2 + 100 && (m = !0,
                q += g / 2,
                r += k / 2)
            }
            if (m) {
                this.m.ka && (a.blendFunc(a.SRC_ALPHA, a.DST_ALPHA),
                a.enable(a.BLEND),
                a.disable(a.DEPTH_TEST));
                var m = g / 2
                  , v = k / 2;
                d = Math.sqrt((m - q) * (m - q) + (v - r) * (v - r));
                var w = l / 2
                  , v = g > k ? g : k
                  , m = n.ng / 100 * ((w - d) / w);
                0 > m && (m = 0);
                if (this.m.ka) {
                    a.useProgram(this.nb);
                    a.bindBuffer(a.ARRAY_BUFFER, this.m.Fa);
                    a.vertexAttribPointer(this.nb.ca, this.m.Fa.Qb, a.FLOAT, !1, 0, 0);
                    var u = a.getUniformLocation(this.nb, "uCanvasDimensions");
                    a.uniform2f(u, a.drawingBufferWidth, a.drawingBufferHeight);
                    a.uniform2f(a.getUniformLocation(this.nb, "uFlareCenterPosition"), a.drawingBufferWidth / g * q, k - a.drawingBufferHeight / k * r);
                    a.uniform1f(a.getUniformLocation(this.nb, "uBlindingValue"), m);
                    u = a.getUniformLocation(this.nb, "uAspectRatio");
                    a.uniform1f(u, this.m.S.Xd ? a.drawingBufferWidth / a.drawingBufferHeight : a.drawingBufferWidth / a.drawingBufferHeight / (g / k));
                    a.drawArrays(a.TRIANGLE_STRIP, 0, this.m.Fa.yc)
                } else
                    u = this.H.createRadialGradient(q, r, 1, q, r, v),
                    u.addColorStop(0, "rgba(255, 255, 255, " + m + ")"),
                    u.addColorStop(.5, "rgba(255, 255, 255, " + .8 * m + ")"),
                    u.addColorStop(1, "rgba(255, 255, 255, " + .6 * m + ")"),
                    this.H.fillStyle = u,
                    this.H.fillRect(0, 0, this.H.width, this.H.height);
                if (0 != Number(n.type) && !this.m.S.Xd) {
                    var m = g / 2 - q
                      , v = k / 2 - r
                      , C = 1
                      , B = Number(n.type) - 1;
                    d < .35 * w && (C = d / (.35 * w),
                    C *= C);
                    d > .7 * w && (C = (w - d) / (.3 * w));
                    C *= n.alpha / 100;
                    if (0 < this.ib[B].length)
                        for (d = 0; d < this.ib[B].length; d++) {
                            var x = this.ib[B][d]
                              , w = x.i * p;
                            b = x.alpha * C;
                            0 > b && (b = 0);
                            var z = x.color;
                            if (8 == B || 9 == B || 10 == B)
                                z = n.color;
                            if (this.m.ka)
                                a.useProgram(this.fa),
                                a.bindBuffer(a.ARRAY_BUFFER, this.Wc),
                                a.vertexAttribPointer(this.fa.ca, this.Wc.Qb, a.FLOAT, !1, 0, 0),
                                u = a.getUniformLocation(this.fa, "uCanvasDimensions2"),
                                a.uniform2f(u, a.drawingBufferWidth, a.drawingBufferHeight),
                                a.uniform2f(a.getUniformLocation(this.fa, "uCirclePosition"), a.drawingBufferWidth / g * (q + m * x.h), a.drawingBufferWidth / g * (k - (r + v * x.h))),
                                a.uniform2f(a.getUniformLocation(this.fa, "uCircleTexturePosition"), a.drawingBufferWidth / g * (q + m * x.h), k - (r + v * x.h)),
                                a.uniform1f(a.getUniformLocation(this.fa, "uCircleRadius"), w),
                                a.uniform3f(a.getUniformLocation(this.fa, "uCircleColor"), (z >> 16 & 255) / 255, (z >> 8 & 255) / 255, (z & 255) / 255),
                                a.uniform1f(a.getUniformLocation(this.fa, "uCircleAlpha"), b),
                                a.uniform1f(a.getUniformLocation(this.fa, "uCircleSoftness"), .1),
                                u = a.getUniformLocation(this.fa, "uAspectRatio"),
                                a.uniform1f(u, a.drawingBufferWidth / a.drawingBufferHeight / (g / k)),
                                a.drawArrays(a.TRIANGLE_FAN, 0, this.Wc.yc);
                            else {
                                this.H.save();
                                this.H.translate(q + m * x.h, r + v * x.h);
                                u = this.H.createRadialGradient(0, 0, 1, 0, 0, 1.1 * w);
                                u.addColorStop(0, this.m.X(z, b));
                                u.addColorStop(.65, this.m.X(z, .9 * b));
                                u.addColorStop(.8, this.m.X(z, .7 * b));
                                u.addColorStop(1, this.m.X(z, .2 * b));
                                this.H.beginPath();
                                var z = 2 * Math.PI / 6
                                  , x = Math.PI / 180 * 35
                                  , E = !0;
                                for (b = x; b <= x + 2 * Math.PI; b += z)
                                    E ? (this.H.moveTo(w * Math.sin(b), w * Math.cos(b)),
                                    E = !1) : this.H.lineTo(w * Math.sin(b), w * Math.cos(b));
                                this.H.closePath();
                                this.H.fillStyle = u;
                                this.H.fill();
                                this.H.restore()
                            }
                        }
                    if (0 < this.cb[B].length)
                        for (d = 0; d < this.cb[B].length; d++) {
                            x = this.cb[B][d];
                            w = x.i * p;
                            b = x.alpha * C;
                            0 > b && (b = 0);
                            z = x.color;
                            if (8 == B || 9 == B || 10 == B)
                                z = n.color;
                            this.m.ka ? (a.useProgram(this.fa),
                            a.bindBuffer(a.ARRAY_BUFFER, this.ec),
                            a.vertexAttribPointer(this.fa.ca, this.ec.Qb, a.FLOAT, !1, 0, 0),
                            u = a.getUniformLocation(this.fa, "uCanvasDimensions2"),
                            a.uniform2f(u, a.drawingBufferWidth, a.drawingBufferHeight),
                            u = a.getUniformLocation(this.fa, "uCirclePosition"),
                            a.uniform2f(u, a.drawingBufferWidth / g * (q + m * x.h), a.drawingBufferWidth / g * (k - (r + v * x.h))),
                            u = a.getUniformLocation(this.fa, "uCircleTexturePosition"),
                            a.uniform2f(u, a.drawingBufferWidth / g * (q + m * x.h), k - (r + v * x.h)),
                            u = a.getUniformLocation(this.fa, "uCircleRadius"),
                            a.uniform1f(u, w),
                            a.uniform3f(a.getUniformLocation(this.fa, "uCircleColor"), (z >> 16 & 255) / 255, (z >> 8 & 255) / 255, (z & 255) / 255),
                            a.uniform1f(a.getUniformLocation(this.fa, "uCircleAlpha"), b),
                            a.uniform1f(a.getUniformLocation(this.fa, "uCircleSoftness"), x.s),
                            u = a.getUniformLocation(this.fa, "uAspectRatio"),
                            a.uniform1f(u, a.drawingBufferWidth / a.drawingBufferHeight / (g / k)),
                            a.drawArrays(a.TRIANGLE_FAN, 0, this.ec.yc)) : (this.H.save(),
                            this.H.translate(q + m * x.h, r + v * x.h),
                            u = this.H.createRadialGradient(0, 0, 1, 0, 0, w),
                            u.addColorStop(0, this.m.X(z, b)),
                            u.addColorStop(1 - x.s, this.m.X(z, .8 * b)),
                            u.addColorStop(1, this.m.X(z, 0)),
                            this.H.beginPath(),
                            this.H.arc(0, 0, w, 0, 2 * Math.PI, !1),
                            this.H.closePath(),
                            this.H.fillStyle = u,
                            this.H.fill(),
                            this.H.restore())
                        }
                    if (0 < this.jb[B].length)
                        for (d = 0; d < this.jb[B].length; d++)
                            n = this.jb[B][d],
                            w = n.i * p,
                            b = n.alpha * C,
                            0 > b && (b = 0),
                            this.m.ka ? (a.useProgram(this.La),
                            a.activeTexture(a.TEXTURE0),
                            a.bindTexture(a.TEXTURE_2D, this.Eh),
                            a.bindBuffer(a.ARRAY_BUFFER, this.ec),
                            a.vertexAttribPointer(this.La.ca, this.ec.Qb, a.FLOAT, !1, 0, 0),
                            u = a.getUniformLocation(this.La, "uCanvasDimensions2"),
                            a.uniform2f(u, g, k),
                            u = a.getUniformLocation(this.La, "uCirclePosition"),
                            a.uniform2f(u, q + m * n.h, k - (r + v * n.h)),
                            u = a.getUniformLocation(this.La, "uRingTexturePosition"),
                            a.uniform2f(u, a.drawingBufferWidth / g * (q + m * n.h), k - (r + v * n.h)),
                            u = a.getUniformLocation(this.La, "uCircleRadius"),
                            a.uniform1f(u, w),
                            a.uniform2f(a.getUniformLocation(this.La, "uRingPosition"), q + m * n.h, k - (r + v * n.h)),
                            a.uniform1f(a.getUniformLocation(this.La, "uRingRadius"), w),
                            a.uniform1f(a.getUniformLocation(this.La, "uRingAlpha"), b),
                            u = a.getUniformLocation(this.La, "uAspectRatio"),
                            a.uniform1f(u, a.drawingBufferWidth / a.drawingBufferHeight / (g / k)),
                            a.uniform1i(a.getUniformLocation(this.La, "uSampler"), 0),
                            a.drawArrays(a.TRIANGLE_FAN, 0, this.ec.yc)) : (this.H.save(),
                            this.H.translate(q + m * n.h, r + v * n.h),
                            u = this.H.createRadialGradient(0, 0, 0, 0, 0, w),
                            u.addColorStop(0, this.m.X(16777215, 0)),
                            u.addColorStop(.88, this.m.X(0, 0)),
                            u.addColorStop(.9, this.m.X(16654848, b)),
                            u.addColorStop(.92, this.m.X(16776448, b)),
                            u.addColorStop(.94, this.m.X(4849466, b)),
                            u.addColorStop(.96, this.m.X(131071, b)),
                            u.addColorStop(.98, this.m.X(8190, b)),
                            u.addColorStop(1, this.m.X(0, 0)),
                            this.H.beginPath(),
                            this.H.arc(0, 0, w, 0, 2 * Math.PI, !1),
                            this.H.closePath(),
                            this.H.fillStyle = u,
                            this.H.fill(),
                            this.H.restore())
                }
                this.m.ka && (a.useProgram(this.m.F),
                a.disable(a.BLEND),
                a.enable(a.DEPTH_TEST))
            }
        }
    }
    ;
    return e
}();
function Q() {
    var e = "perspective", a = ["Webkit", "Moz", "O", "ms", "Ms"], b;
    b = !1;
    for (b = 0; b < a.length; b++)
        "undefined" !== typeof document.documentElement.style[a[b] + "Perspective"] && (e = a[b] + "Perspective");
    "undefined" !== typeof document.documentElement.style[e] ? "webkitPerspective"in document.documentElement.style ? (e = document.createElement("style"),
    a = document.createElement("div"),
    b = document.head || document.getElementsByTagName("head")[0],
    e.textContent = "@media (-webkit-transform-3d) {#ggswhtml5{height:5px}}",
    b.appendChild(e),
    a.id = "ggswhtml5",
    document.documentElement.appendChild(a),
    b = 5 === a.offsetHeight,
    e.parentNode.removeChild(e),
    a.parentNode.removeChild(a)) : b = !0 : b = !1;
    return b
}
function R() {
    var e;
    if (e = !!window.WebGLRenderingContext)
        try {
            var a = document.createElement("canvas");
            a.width = 100;
            a.height = 100;
            var b = a.getContext("webgl");
            b || (b = a.getContext("experimental-webgl"));
            e = !!b
        } catch (c) {
            e = !1
        }
    return e
}
window.ggHasHtml5Css3D = Q;
window.ggHasWebGL = R;
var S = this && this.Kk || function(e, a) {
    function b() {
        this.constructor = e
    }
    for (var c in a)
        a.hasOwnProperty(c) && (e[c] = a[c]);
    e.prototype = null === a ? Object.create(a) : (b.prototype = a.prototype,
    new b)
}
  , T = function() {
    function e(a) {
        this.m = null;
        this.Dd = this.Tg = this.hb = !1;
        this.Ra = this.wa = this.pa = 0;
        this.f = 70;
        this.za = 0;
        this.autoplay = this.Hd = !1;
        this.id = "";
        this.j = this.pan = 0;
        this.m = a;
        this.Xb = this.Ob = 100;
        this.gc = 1
    }
    e.prototype.Za = function(a) {
        var b;
        if (b = a.getAttributeNode("id"))
            this.id = b.nodeValue.toString();
        if (b = a.getAttributeNode("pan"))
            this.pan = Number(b.nodeValue);
        if (b = a.getAttributeNode("tilt"))
            this.j = Number(b.nodeValue)
    }
    ;
    e.prototype.Yh = function(a) {
        var b = ""
          , c = this.m;
        c.Eb && (b += "perspective(" + a + "px) ");
        b = b + ("translate3d(0px,0px," + a + "px) ") + ("rotateZ(" + c.G.b.toFixed(10) + "deg) ");
        b += "rotateX(" + c.j.b.toFixed(10) + "deg) ";
        b += "rotateY(" + (-c.pan.b).toFixed(10) + "deg) ";
        b += "rotateY(" + this.pan.toFixed(10) + "deg) ";
        b += "rotateX(" + (-this.j).toFixed(10) + "deg) ";
        a = 1E4;
        var d = this.c.videoWidth
          , f = this.c.videoHeight;
        if (0 == d || 0 == f)
            d = 640,
            f = 480;
        0 < this.Ob && (d = this.Ob);
        0 < this.Xb && (f = this.Xb);
        0 < d && 0 < f && (this.c.width = d,
        this.c.height = f,
        this.c.style.width = d + "px",
        this.c.style.height = f + "px");
        0 < this.f && (a = d / (2 * Math.tan(this.f / 2 * Math.PI / 180)));
        b += "translate3d(0px,0px," + (-a).toFixed(10) + "px) ";
        b += "rotateZ(" + this.Ra.toFixed(10) + "deg) ";
        b += "rotateY(" + (-this.wa).toFixed(10) + "deg) ";
        b += "rotateX(" + this.pa.toFixed(10) + "deg) ";
        this.gc && 1 != this.gc && (b += "scaleY(" + this.gc + ") ");
        b += "translate3d(" + -d / 2 + "px," + -f / 2 + "px,0px) ";
        this.c.style[c.Aa + "Origin"] = "0% 0%";
        this.hb && (b = "",
        1 == this.za && (b += "scale(" + Math.min(c.l.width / d, c.l.height / f) + ") "),
        b += "translate3d(" + -d / 2 + "px," + -f / 2 + "px,0px) ");
        this.gj != b && (this.gj = b,
        this.c.style[c.Aa] = b,
        this.c.style.visibility = "visible",
        this.Dd && this.Tg == this.hb && (this.c.style[c.Vb] = "all 0s linear 0s"),
        this.Tg = this.hb)
    }
    ;
    e.prototype.Qc = function() {
        var a = this.m;
        this.c.style.left = a.margin.left + a.l.width / 2 + "px";
        this.c.style.top = a.margin.top + a.l.height / 2 + "px"
    }
    ;
    return e
}()
  , U = function(e) {
    function a(a) {
        e.call(this, a);
        this.Rf = this.zf = this.md = !1;
        this.url = [];
        this.loop = 0;
        this.level = 1;
        this.Lb = 0;
        this.mode = 1;
        this.zg = 10;
        this.bf = this.Xa = 0;
        this.aa = 1;
        this.Sb = this.Jb = this.Ib = this.Rb = 0
    }
    S(a, e);
    a.prototype.ak = function() {
        0 == this.loop ? this.c.play() : 0 < this.rc && (this.rc--,
        this.c.currentTime = 0,
        this.zf && (this.fc && 0 == this.fc.gain.value || 0 == this.wb.gain.value && 0 == this.zb.gain.value && 0 == this.xb.gain.value && 0 == this.yb.gain.value) || this.c.play())
    }
    ;
    a.prototype.kg = function() {
        var a = this.m.lb;
        a && (this.source = a.createMediaElementSource(this.c),
        2 == this.mode || 3 == this.mode || 5 == this.mode ? (this.wd = a.createChannelSplitter(2),
        this.wb = a.createGain(),
        this.xb = a.createGain(),
        this.yb = a.createGain(),
        this.zb = a.createGain(),
        this.vd = a.createChannelMerger(2),
        this.source.connect(this.wd),
        this.wd.connect(this.wb, 0),
        this.wd.connect(this.xb, 0),
        this.wd.connect(this.yb, 1),
        this.wd.connect(this.zb, 1),
        this.wb.connect(this.vd, 0, 0),
        this.xb.connect(this.vd, 0, 1),
        this.yb.connect(this.vd, 0, 0),
        this.zb.connect(this.vd, 0, 1),
        this.vd.connect(a.destination)) : (this.fc = a.createGain(),
        this.source.connect(this.fc),
        this.fc.connect(a.destination)))
    }
    ;
    a.prototype.Ud = function() {
        var a = this.m.lb;
        this.hb || this.Rf || (this.wb.gain.setValueAtTime(this.Rb, a.currentTime),
        this.zb.gain.setValueAtTime(this.Sb, a.currentTime),
        this.xb.gain.setValueAtTime(this.Ib, a.currentTime),
        this.yb.gain.setValueAtTime(this.Jb, a.currentTime))
    }
    ;
    a.prototype.gg = function() {
        var a = this.m
          , c = this.m.lb;
        if (this.c) {
            var d, f = this.pan - a.pan.b;
            for (d = this.j - a.j.b; -180 > f; )
                f += 360;
            for (; 180 < f; )
                f -= 360;
            var e = this.Lb
              , g = this.zg;
            0 == g && (g = .01);
            0 > g && (g = a.f.b);
            this.$a || (this.$a = new y,
            this.$a.Cg(this.pan, this.j));
            0 != this.mode && 1 != this.mode || !c || this.fc && this.fc.gain.setValueAtTime(this.level * a.ba * this.aa, c.currentTime);
            if (2 == this.mode && c) {
                var k = .5 * Math.cos(f * Math.PI / 180) + .5;
                this.Rb = Math.sqrt(k) * this.aa;
                this.Sb = Math.sqrt(k) * this.aa;
                this.Ib = Math.sqrt(1 - k) * this.aa;
                this.Jb = Math.sqrt(1 - k) * this.aa;
                this.Ud()
            }
            if (3 == this.mode) {
                0 > f ? f < -this.Xa ? f += this.Xa : f = 0 : f = f > this.Xa ? f - this.Xa : 0;
                k = this.level;
                d = Math.abs(d);
                d = d < this.bf ? 0 : d - this.bf;
                var l = 1 - d / g;
                if (Math.abs(f) > g || 0 > l) {
                    var p = k * e * a.ba;
                    c ? (this.Rb = p * this.aa,
                    this.Sb = p * this.aa,
                    this.Jb = this.Ib = 0,
                    this.Ud()) : this.c.volume = k * e * a.ba
                } else if (p = 1 - Math.abs(f / g),
                c) {
                    var n = k * (e + (1 - e) * l * p) * a.ba
                      , p = k * e * a.ba;
                    0 <= f ? (this.Rb = n * this.aa,
                    this.Sb = p * this.aa) : (this.Rb = p * this.aa,
                    this.Sb = n * this.aa);
                    2 * Math.abs(f) < g ? (p = 1 - Math.abs(2 * f) / g,
                    n = k * (e + (1 - e) * l * p) * a.ba,
                    p = .5 * k * (1 - e) * l * (1 - p) * a.ba,
                    0 <= f ? (this.Sb = n * this.aa,
                    this.Jb = p * this.aa,
                    this.Ib = 0) : (this.Rb = n * this.aa,
                    this.Ib = p * this.aa,
                    this.Jb = 0)) : (p = 1 - (Math.abs(2 * f) - g) / g,
                    n = .5 * k * (1 - e) * l * p * a.ba,
                    0 <= f ? (this.Jb = n * this.aa,
                    this.Ib = 0) : (this.Ib = n * this.aa,
                    this.Jb = 0));
                    this.Ud()
                } else
                    this.c.volume = k * (e + (1 - e) * l * p) * a.ba
            }
            4 == this.mode && (Math.abs(f) < this.Xa && Math.abs(d) < this.bf ? this.md || (this.md = !0,
            this.c.play()) : this.md = !1);
            5 == this.mode && (d = 180 * Math.acos(a.sf.Me(this.$a)) / Math.PI,
            d < this.Xa ? c ? (this.Rb = this.level * a.ba * this.aa,
            this.Sb = this.level * a.ba * this.aa,
            this.Jb = this.Ib = 0,
            this.Ud()) : this.c.volume = this.level * a.ba : c ? d < this.Xa + g ? (0 > f ? f = f > -this.Xa ? 0 : f + this.Xa : f = f < this.Xa ? 0 : f - this.Xa,
            n = 1 - Math.max(d - this.Xa, 0) / g,
            p = Math.max(1 - Math.abs(f) * Math.cos(this.j * Math.PI / 180) / g, 0),
            0 < f ? (this.Rb = this.level * (n * (1 - this.Lb) + this.Lb) * this.aa,
            this.Sb = this.level * (n * p * (1 - this.Lb) + this.Lb) * this.aa,
            this.Ib = 0,
            this.Jb = this.level * n * (1 - p) * this.aa) : (this.Rb = this.level * (n * p * (1 - this.Lb) + this.Lb) * this.aa,
            this.Sb = this.level * (n * (1 - this.Lb) + this.Lb) * this.aa,
            this.Ib = this.level * n * (1 - p) * this.aa,
            this.Jb = 0),
            this.Ud()) : (n = this.level * this.Lb,
            this.Rb = n * this.aa,
            this.Sb = n * this.aa,
            this.Jb = this.Ib = 0) : (d -= this.Xa,
            this.c.volume = d < g && 0 < g ? this.level * (e + (1 - e) * (1 - Math.abs(d / g))) * a.ba : e * a.ba));
            6 == this.mode && (d = 180 * Math.acos(a.sf.Me(this.$a)) / Math.PI,
            Math.abs(d) < this.Xa ? this.md || (this.md = !0,
            this.c.play()) : this.md = !1)
        }
    }
    ;
    a.prototype.addElement = function() {
        var a = -1
          , c = this
          , d = this.m
          , f = this.m.lb;
        try {
            for (var e = !1, g = 0; g < d.P.length; g++)
                d.P[g].id == c.id && (a = g,
                null != d.P[g].c && d.P[g].url.join() == c.url.join() && d.P[g].loop == c.loop && d.P[g].mode == c.mode && (e = !0));
            if (!e) {
                if (0 <= a) {
                    var k = d.P[a];
                    if (null != k.c)
                        if (f && d.ra.enabled)
                            d.ra.Yd.push(k),
                            1 != d.S.Ba && 2 != d.S.Ba && d.ra.yf(k);
                        else {
                            try {
                                k.c.pause()
                            } catch (p) {}
                            try {
                                k.ed()
                            } catch (p) {}
                        }
                }
                c.c = document.createElement("audio");
                c.c.setAttribute("class", "ggmedia");
                d.Yc && c.c.setAttribute("id", d.Yc + c.id);
                for (g = 0; g < c.url.length; g++) {
                    var l;
                    l = document.createElement("source");
                    "" != c.url[g] && "#" != c.url[g] && (l.setAttribute("src", d.ub(c.url[g])),
                    c.c.appendChild(l))
                }
                c.c.volume = c.level * d.ba;
                1 <= c.loop && (c.rc = c.loop - 1);
                0 <= a ? d.P[a] = c : d.P.push(c);
                0 < c.c.childNodes.length && (d.L.appendChild(c.c),
                c.c.addEventListener("ended", function() {
                    c.ak()
                }, !1),
                f && (c.kg(),
                c.zf = !1,
                0 == c.loop && c.source.mediaElement && (c.source.mediaElement.loop = !0)));
                1 != c.mode && 2 != c.mode && 3 != c.mode && 5 != c.mode || !(0 <= c.loop) || f && d.ra.enabled || (c.c.autoplay = !0,
                c.autoplay = !0);
                0 == c.mode && 0 <= c.loop && (c.autoplay = !0)
            }
        } catch (p) {}
    }
    ;
    a.prototype.ed = function() {
        try {
            this.m.L.removeChild(this.c),
            delete this.c,
            this.c = null
        } catch (a) {}
    }
    ;
    a.prototype.Za = function(a) {
        e.prototype.Za.call(this, a);
        var c;
        (c = a.getAttributeNode("url")) && this.url.push(c.nodeValue.toString());
        if (c = a.getAttributeNode("level"))
            this.level = Number(c.nodeValue);
        if (c = a.getAttributeNode("loop"))
            this.loop = Number(c.nodeValue);
        if (c = a.getAttributeNode("mode"))
            this.mode = Number(c.nodeValue);
        if (c = a.getAttributeNode("field"))
            this.zg = Number(c.nodeValue);
        if (c = a.getAttributeNode("ambientlevel"))
            this.Lb = Number(c.nodeValue);
        if (c = a.getAttributeNode("pansize"))
            this.Xa = Number(c.nodeValue);
        if (c = a.getAttributeNode("tiltsize"))
            this.bf = Number(c.nodeValue);
        for (a = a.firstChild; a; )
            "source" == a.nodeName && (c = a.getAttributeNode("url")) && this.url.push(c.nodeValue.toString()),
            a = a.nextSibling
    }
    ;
    return a
}(T)
  , V = function(e) {
    function a(a) {
        e.call(this, a);
        this.poster = "";
        this.Ra = this.wa = this.pa = 0;
        this.f = 50;
        this.za = 0;
        this.Hd = !1
    }
    S(a, e);
    a.prototype.Yb = function() {
        1 != this.za && 4 != this.za || this.Ed(!this.hb);
        2 == this.za && this.m.xh(this.id)
    }
    ;
    a.prototype.Ed = function(a) {
        var c = this.m.lb;
        if (1 == this.za || 4 == this.za)
            if (this.hb = a,
            this.m.Sa)
                (c = this.m.Y) && c.activateSound(this.id, this.hb ? 1 : 0);
            else {
                if (this.hb)
                    this.c.play(),
                    this.c.style.zIndex = "80000",
                    this.c.style[this.m.Vb] = "all 1s ease 0s",
                    this.m.bd(this.id);
                else {
                    this.c.style.zIndex = "0";
                    this.c.style[this.m.Vb] = "all 1s ease 0s";
                    this.Rf = !0;
                    var d = this;
                    setTimeout(function() {
                        d.Rf = !1
                    }, 1E3)
                }
                if (c) {
                    var c = c.currentTime
                      , f = this.wb.gain.value
                      , e = this.zb.gain.value
                      , g = this.xb.gain.value
                      , k = this.yb.gain.value;
                    this.hb ? (this.wb.gain.linearRampToValueAtTime(f, c),
                    this.wb.gain.linearRampToValueAtTime(this.level * this.m.ba, c + 1),
                    this.zb.gain.linearRampToValueAtTime(e, c),
                    this.zb.gain.linearRampToValueAtTime(this.level * this.m.ba, c + 1),
                    this.xb.gain.linearRampToValueAtTime(g, c),
                    this.xb.gain.linearRampToValueAtTime(0, c + 1),
                    this.yb.gain.linearRampToValueAtTime(k, c),
                    this.yb.gain.linearRampToValueAtTime(0, c + 1)) : (this.wb.gain.linearRampToValueAtTime(f, c),
                    this.wb.gain.linearRampToValueAtTime(this.Rb, c + 1),
                    this.zb.gain.linearRampToValueAtTime(e, c),
                    this.zb.gain.linearRampToValueAtTime(this.Sb, c + 1),
                    this.xb.gain.linearRampToValueAtTime(g, c),
                    this.xb.gain.linearRampToValueAtTime(this.Ib, c + 1),
                    this.yb.gain.linearRampToValueAtTime(k, c),
                    this.yb.gain.linearRampToValueAtTime(this.Jb, c + 1))
                }
                this.Dd = !0;
                this.m.Zh()
            }
        2 == this.za && (a ? this.m.bd(this.id) : this.m.Qf(this.id))
    }
    ;
    a.prototype.Fd = function() {
        this.Dd = !1;
        this.c.style[this.m.Vb] = "none"
    }
    ;
    a.prototype.Dk = function() {
        0 == this.loop ? this.c.play() : 0 < this.rc ? (this.rc--,
        this.c.currentTime = 0,
        this.c.play()) : this.eh = !1
    }
    ;
    a.prototype.Za = function(a) {
        e.prototype.Za.call(this, a);
        var c;
        if (c = a.getAttributeNode("poster"))
            this.poster = String(c.nodeValue);
        if (c = a.getAttributeNode("rotx"))
            this.pa = Number(c.nodeValue);
        if (c = a.getAttributeNode("roty"))
            this.wa = Number(c.nodeValue);
        if (c = a.getAttributeNode("rotz"))
            this.Ra = Number(c.nodeValue);
        if (c = a.getAttributeNode("fov"))
            this.f = Number(c.nodeValue);
        if (c = a.getAttributeNode("width"))
            this.Ob = Number(c.nodeValue);
        if (c = a.getAttributeNode("height"))
            this.Xb = Number(c.nodeValue);
        this.gc = (c = a.getAttributeNode("stretch")) ? Number(c.nodeValue) : 1;
        if (c = a.getAttributeNode("clickmode"))
            this.za = Number(c.nodeValue);
        if (c = a.getAttributeNode("handcursor"))
            this.Hd = 1 == Number(c.nodeValue)
    }
    ;
    a.prototype.addElement = function() {
        var a = this
          , c = this.m;
        try {
            a.c = document.createElement("video");
            a.c.setAttribute("class", "ggmedia");
            a.c.hidden = !0;
            c.Yc && a.c.setAttribute("id", c.Yc + a.id);
            if (c.ae)
                a.c.setAttribute("style", "display: none; max-width:none;");
            else if (a.c.setAttribute("style", "max-width:none;pointer-events:none;"),
            1 == a.za || 4 == a.za)
                a.c.addEventListener(c.ei(), function() {
                    a.Fd()
                }, !1),
                a.c.addEventListener("transitionend", function() {
                    a.Fd()
                }, !1);
            var d;
            for (d = 0; d < a.url.length; d++) {
                var f;
                f = document.createElement("source");
                f.setAttribute("src", c.ub(a.url[d]));
                a.c.appendChild(f)
            }
            "" != a.poster && (a.c.poster = c.ub(a.poster),
            0 > a.loop && (a.c.ii = "none"));
            a.c.volume = a.level * c.ba;
            1 <= a.loop && (a.rc = a.loop - 1);
            (1 == a.mode || 2 == a.mode || 3 == a.mode || 5 == a.mode) && 0 <= a.loop && (a.c.autoplay = !0,
            a.eh = !0,
            a.autoplay = !0);
            c.J.push(this);
            c.ae ? c.L.appendChild(a.c) : (a.c.style.position = "absolute",
            a.Ob && (a.c.width = a.Ob),
            a.Xb && (a.c.height = a.Xb),
            c.w.appendChild(a.c),
            a.kg());
            a.c.onclick = function() {
                a.Yb()
            }
            ;
            a.c.addEventListener("ended", function() {
                a.Dk()
            }, !1)
        } catch (e) {}
    }
    ;
    a.prototype.ed = function() {
        var a = this.m;
        a.ae && (a.a.deleteTexture(this.Gb),
        this.Gb = 0,
        a.L.removeChild(this.c));
        a.$h && a.w.removeChild(this.c);
        delete this.c;
        this.c = null
    }
    ;
    return a
}(U)
  , W = function(e) {
    function a(a) {
        e.call(this, a);
        this.url = "";
        this.Ra = this.wa = this.pa = 0;
        this.f = 50;
        this.za = 0;
        this.Hd = !1;
        this.Xb = this.Ob = 100;
        this.gc = 1
    }
    S(a, e);
    a.prototype.Za = function(a) {
        e.prototype.Za.call(this, a);
        var c;
        if (c = a.getAttributeNode("url"))
            this.url = c.nodeValue.toString();
        if (c = a.getAttributeNode("rotx"))
            this.pa = Number(c.nodeValue);
        if (c = a.getAttributeNode("roty"))
            this.wa = Number(c.nodeValue);
        if (c = a.getAttributeNode("rotz"))
            this.Ra = Number(c.nodeValue);
        if (c = a.getAttributeNode("fov"))
            this.f = Number(c.nodeValue);
        if (c = a.getAttributeNode("width"))
            this.Ob = Number(c.nodeValue);
        if (c = a.getAttributeNode("height"))
            this.Xb = Number(c.nodeValue);
        this.gc = (c = a.getAttributeNode("stretch")) ? Number(c.nodeValue) : 1;
        if (c = a.getAttributeNode("clickmode"))
            this.za = Number(c.nodeValue);
        if (c = a.getAttributeNode("handcursor"))
            this.Hd = 1 == Number(c.nodeValue);
        for (a = a.firstChild; a; )
            "source" == a.nodeName && (c = a.getAttributeNode("url")) && (this.url = c.nodeValue.toString()),
            a = a.nextSibling
    }
    ;
    a.prototype.Fd = function() {
        this.Dd = !1;
        this.c.style[this.m.Vb] = "none"
    }
    ;
    a.prototype.Yb = function() {
        1 !== this.za && 4 !== this.za || this.Ed(!this.hb)
    }
    ;
    a.prototype.Ed = function(a) {
        var c = this.m;
        if (1 === this.za || 4 === this.za)
            this.hb = a,
            this.m.Sa ? (a = this.m.Y) && a.activateSound(this.id, this.hb ? 1 : 0) : (this.c.style.zIndex = this.hb ? "80000" : "0",
            this.c.style[c.Vb] = "all 1s ease 0s",
            this.Dd = !0,
            c.Uh())
    }
    ;
    a.prototype.addElement = function() {
        var a = this
          , c = this.m;
        try {
            a.c = document.createElement("img");
            a.c.setAttribute("style", "-webkit-user-drag:none; max-width:none;");
            a.c.setAttribute("class", "ggmedia");
            a.c.hidden = !0;
            c.Yc && a.c.setAttribute("id", c.Yc + a.id);
            a.c.ondragstart = function() {
                return !1
            }
            ;
            if (1 === a.za || 4 === a.za)
                a.c.addEventListener(c.ei(), function() {
                    a.Fd()
                }, !1),
                a.c.addEventListener("transitionend", function() {
                    a.Fd()
                }, !1);
            a.c.setAttribute("src", c.ub(a.url));
            a.Ob && (a.c.width = a.Ob);
            a.Xb && (a.c.height = a.Xb);
            c.Ua.push(a);
            a.c.style.position = "absolute";
            a.Yb && (a.c.onclick = function() {
                a.Yb()
            }
            );
            c.w.appendChild(a.c)
        } catch (d) {}
    }
    ;
    a.prototype.ed = function() {
        this.m.w.removeChild(this.c);
        delete this.c;
        this.c = null
    }
    ;
    return a
}(T)
  , X = function(e) {
    function a(a) {
        e.call(this, a);
        this.alpha = this.ng = 50;
        this.type = 0;
        this.color = 16777215
    }
    S(a, e);
    a.prototype.Za = function(a) {
        e.prototype.Za.call(this, a);
        var c;
        if (c = a.getAttributeNode("blinding"))
            this.ng = Number(c.nodeValue);
        if (c = a.getAttributeNode("alpha"))
            this.alpha = Number(c.nodeValue);
        if (c = a.getAttributeNode("type"))
            this.type = Number(c.nodeValue);
        if (c = a.getAttributeNode("color"))
            this.color = 1 * Number(c.nodeValue)
    }
    ;
    return a
}(T)
  , Y = function() {
    function e(a) {
        this.type = "empty";
        this.Lh = this.id = this.target = this.description = this.title = this.url = "";
        this.gf = 100;
        this.ye = 20;
        this.hf = !1;
        this.c = null;
        this.Ha = this.ea = this.j = this.pan = 0;
        this.ob = a.v.ob;
        this.mb = a.v.mb;
        this.Nb = a.v.Nb;
        this.Mb = a.v.Mb;
        this.Xc = a.v.Xc;
        this.be = []
    }
    e.prototype.Vc = function() {
        this.id = this.id;
        this.pan = this.pan;
        this.tilt = this.j;
        this.url = this.url;
        this.target = this.target;
        this.title = this.title;
        this.description = this.description;
        this.skinid = this.Lh;
        this.obj = this.c
    }
    ;
    e.prototype.Za = function(a) {
        var b;
        if (b = a.getAttributeNode("url"))
            this.url = b.nodeValue.toString();
        if (b = a.getAttributeNode("target"))
            this.target = b.nodeValue.toString();
        if (b = a.getAttributeNode("title"))
            this.title = b.nodeValue.toString();
        if (b = a.getAttributeNode("description"))
            this.description = b.nodeValue.toString();
        if (b = a.getAttributeNode("id"))
            this.id = b.nodeValue.toString();
        if (b = a.getAttributeNode("skinid"))
            this.Lh = b.nodeValue.toString();
        if (b = a.getAttributeNode("width"))
            this.gf = Number(b.nodeValue);
        if (b = a.getAttributeNode("height"))
            this.ye = Number(b.nodeValue);
        if (b = a.getAttributeNode("wordwrap"))
            this.hf = 1 == Number(b.nodeValue);
        b = a.getAttributeNode("pan");
        this.pan = 1 * (b ? Number(b.nodeValue) : 0);
        b = a.getAttributeNode("tilt");
        this.j = 1 * (b ? Number(b.nodeValue) : 0);
        if (b = a.getAttributeNode("bordercolor"))
            this.ob = 1 * Number(b.nodeValue);
        if (b = a.getAttributeNode("backgroundcolor"))
            this.mb = 1 * Number(b.nodeValue);
        if (b = a.getAttributeNode("borderalpha"))
            this.Nb = 1 * Number(b.nodeValue);
        if (b = a.getAttributeNode("backgroundalpha"))
            this.Mb = 1 * Number(b.nodeValue);
        if (b = a.getAttributeNode("handcursor"))
            this.Xc = 1 == Number(b.nodeValue);
        for (a = a.firstChild; a; ) {
            if ("vertex" == a.nodeName) {
                var c = {
                    pan: 0,
                    j: 0
                };
                b = a.getAttributeNode("pan");
                c.pan = 1 * (b ? Number(b.nodeValue) : 0);
                b = a.getAttributeNode("tilt");
                c.j = 1 * (b ? Number(b.nodeValue) : 0);
                this.be.push(c)
            }
            a = a.nextSibling
        }
        this.Vc()
    }
    ;
    return e
}();
function aa() {
    this.ad = {
        zd: 1,
        Ad: 1,
        Qd: 0,
        Rd: 0,
        pd: 0,
        ce: 0,
        scale: 1
    };
    this.Ab = !0;
    this.Sc = []
}
var ba = function() {
    function e() {
        var a;
        this.Ja = Array(6);
        for (a = 0; 6 > a; a++)
            this.Ja[a] = new aa
    }
    e.prototype.xi = function(a, b, c, d) {
        for (var f = 0; 6 > f; f++) {
            var e;
            if (e = this.Ja[f]) {
                var g;
                g = [];
                g.push(new y(-1,-1,-1,0,0));
                g.push(new y(1,-1,-1,1,0));
                g.push(new y(1,1,-1,1,1));
                g.push(new y(-1,1,-1,0,1));
                for (var k = 0; k < g.length; k++)
                    4 > f ? g[k].wa(-Math.PI / 2 * f) : g[k].pa(Math.PI / 2 * (4 === f ? -1 : 1)),
                    d && (g[k].Ra(d.G * Math.PI / 180),
                    g[k].pa(-d.pitch * Math.PI / 180)),
                    g[k].wa(-a * Math.PI / 180),
                    g[k].pa(b * Math.PI / 180),
                    g[k].Ra(c * Math.PI / 180);
                e.Ab = 0 < g.length
            }
        }
    }
    ;
    return e
}()
  , Z = function() {
    function e(a, b) {
        this.pan = {
            b: 0,
            fb: 0,
            min: 0,
            max: 360,
            d: 0,
            Nf: 0
        };
        this.j = {
            b: 0,
            fb: 0,
            min: -90,
            max: 90,
            d: 0
        };
        this.G = {
            b: 0,
            fb: 0,
            min: -180,
            max: 180,
            d: 0
        };
        this.f = {
            b: 90,
            fb: 90,
            min: 1,
            Td: 0,
            max: 170,
            cd: 0,
            d: 0,
            mode: 0,
            Nh: 0,
            ug: 0
        };
        this.oa = {
            G: 0,
            pitch: 0
        };
        this.l = {
            width: 10,
            height: 10
        };
        this.rb = 0;
        this.sf = new y;
        this.N = {
            start: {
                x: 0,
                y: 0
            },
            W: {
                x: 0,
                y: 0
            },
            kc: {
                x: 0,
                y: 0
            },
            b: {
                x: 0,
                y: 0
            },
            V: {
                x: 0,
                y: 0
            }
        };
        this.M = {
            Da: -1,
            startTime: 0,
            start: {
                x: 0,
                y: 0
            },
            W: {
                x: 0,
                y: 0
            },
            kc: {
                x: 0,
                y: 0
            },
            b: {
                x: 0,
                y: 0
            },
            V: {
                x: 0,
                y: 0
            }
        };
        this.se = !0;
        this.B = {
            enabled: !0,
            W: {
                x: 0,
                y: 0
            },
            V: {
                x: 0,
                y: 0
            },
            f: {
                active: !1,
                Ia: 0
            }
        };
        this.o = {
            src: [],
            ge: 4,
            width: 640,
            height: 480,
            Zc: !1,
            Ce: !1,
            Fc: "loop",
            c: null,
            Gb: null,
            hg: null,
            Xe: null,
            Gf: null,
            format: "",
            xe: 0
        };
        this.Jc = 0;
        this.Y = this.la = this.va = this.L = this.pb = this.Oa = this.w = null;
        this.Gc = "pano";
        this.Af = "flashcontainer";
        this.tf = "";
        this.control = null;
        this.bb = [];
        this.Ca = !1;
        this.pe = 1;
        this.D = null;
        this.rd = this.Id = !1;
        this.lc = "";
        this.fd = this.Eb = !1;
        this.Ke = 0;
        this.le = [];
        this.Uc = [];
        this.Wd = this.nc = 1;
        this.td = 1024;
        this.Oe = !1;
        this.Ph = 0;
        this.u = {
            enabled: !1,
            timeout: 5,
            active: !1,
            Vd: !1,
            speed: .4,
            af: 0,
            Ie: 0,
            Mf: !0,
            ai: !1,
            startTime: 0,
            jc: 0
        };
        this.R = {
            active: !1,
            qd: !1,
            speed: .1,
            pan: 0,
            j: 0,
            G: 0,
            f: 70,
            jd: 70,
            hh: 0,
            jh: 0,
            ih: 0,
            gh: 0
        };
        this.xa = null;
        this.od = {};
        this.v = {
            mode: 1,
            Md: -1,
            ea: 0,
            Ha: 0,
            Tb: .05,
            ob: 255,
            Nb: 1,
            mb: 255,
            Mb: .3,
            Xc: !0,
            dg: {
                enabled: !0,
                width: 180,
                height: 20,
                eg: 0,
                cg: 1,
                background: !0,
                mb: 16777215,
                Mb: 1,
                ob: 0,
                Nb: 1,
                lf: 3,
                mf: 1,
                hf: !0
            }
        };
        this.na = null;
        this.I = [];
        this.P = [];
        this.J = [];
        this.Ua = [];
        this.Oc = [];
        this.sa = [];
        this.qc = [];
        this.ba = 1;
        this.pc = this.Tc = null;
        this.yd = {};
        this.addListener = function(a, b) {
            (this.yd[a] = this.yd[a] || []).push(b)
        }
        ;
        this.Rh = function(a, b) {
            var f = this.yd[a], e, g;
            if (f)
                for (g = 0,
                e = f.length; g < e; g++)
                    f[g].apply(null, b)
        }
        ;
        this.removeEventListener = function(a, b) {
            var f = this.yd[a];
            if (f) {
                var e, g;
                g = 0;
                for (e = f.length; g < e; g++)
                    if (f[g] === b) {
                        1 === e ? delete this.yd[a] : f.splice(g, 1);
                        break
                    }
            }
        }
        ;
        this.g = {
            K: [],
            mc: "0x000000",
            yh: !1,
            mh: .4,
            nh: .4,
            Z: 512,
            Va: 1,
            kh: 0,
            oh: "",
            width: 0,
            height: 0,
            Dh: 0
        };
        this.vj = {
            target: 0,
            current: 0,
            Tb: .01,
            zi: 2,
            wf: 0,
            oe: !1,
            oi: !1
        };
        this.margin = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        };
        this.C = {
            Pd: !1,
            Kf: !1,
            Wa: !1,
            Lf: !1,
            wc: !0,
            Zg: !1,
            Mh: 1,
            vf: !0,
            ke: !0,
            ze: !1,
            sensitivity: 8
        };
        this.Sd = [];
        this.cc = !0;
        this.ha = {
            x: 0,
            y: 0
        };
        this.ae = this.Sa = this.$d = this.Hb = this.ka = !1;
        this.ff = this.$h = !0;
        this.Ff = !1;
        this.te = !0;
        this.Ef = !1;
        this.ja = 0;
        this.Ye = 5;
        this.Nc = 0;
        this.qh = 200;
        this.ua = this.oc = "";
        this.Vb = "transition";
        this.Aa = "transform";
        this.dc = "perspective";
        this.xg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYBgeACDAAADIAAE3iTbkAAAAAElFTkSuQmCC";
        this.Ta = {
            width: 0,
            height: 0
        };
        this.Fg = new y;
        this.Eg = new y;
        this.Gg = new y;
        this.Hg = new y;
        this.Dg = new y;
        this.Kd = !1;
        this.currentNode = "";
        this.ig = [];
        this.df = [];
        this.uh = this.$g = this.Jf = this.dh = this.Hf = this.If = this.Ae = this.ah = this.Hh = this.Ic = this.bh = !1;
        this.Pa = new ba;
        this.fg = !1;
        this.xd = function(a, b) {
            if (0 == a.length)
                return a;
            var f, e, g, k, l, p, n, m;
            m = [];
            f = b.Me(a[0]) - 0;
            for (k = 0; k < a.length; k++) {
                p = k;
                n = k + 1;
                n == a.length && (n = 0);
                e = b.Me(a[n]) - 0;
                if (0 <= f && 0 <= e)
                    m.push(a[p]);
                else if (0 <= f || 0 <= e)
                    g = e / (e - f),
                    0 > g && (g = 0),
                    1 < g && (g = 1),
                    l = new y,
                    l.hc(a[p], a[n], g),
                    0 > f || m.push(a[p]),
                    m.push(l);
                f = e
            }
            return m
        }
        ;
        this.ag = 0;
        this.yg = 1;
        this.eb = [];
        this.O = A();
        this.qb = A();
        this.Ee = -1;
        this.Cd = function(a) {
            return a ? a.pageX || a.pageY ? {
                x: a.pageX,
                y: a.pageY
            } : a.clientX || a.clientY ? {
                x: a.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
                y: a.clientY + document.body.scrollTop + document.documentElement.scrollTop
            } : a.touches && a.touches[0] ? {
                x: a.touches[0].pageX,
                y: a.touches[0].pageY
            } : {
                x: 0,
                y: 0
            } : {
                x: 0,
                y: 0
            }
        }
        ;
        this.Ge = 1;
        this.Di = this.Bf = this.xf = this.Vf = this.Ne = 0;
        this.re = !0;
        this.Qa = new Y(this);
        this.Qa.Xc = !1;
        this.wg();
        this.gd(this.Qa);
        this.checkLoaded = this.bb;
        this.isLoaded = !1;
        b && b.hasOwnProperty("useFlash") && b.useFlash && (this.Sa = !0,
        this.ka = this.Hb = !1,
        b.hasOwnProperty("flashPlayerId") ? this.Gc = b.flashPlayerId : this.Gc = "pano",
        b.hasOwnProperty("flashContainerId") ? this.Af = b.flashContainerId : this.Af = a + "flash");
        this.ia();
        this.Sa || (this.Ea = new P(this));
        this.rg(a);
        this.ni();
        this.userdata = this.od = this.qe();
        this.emptyHotspot = this.Qa;
        this.mouse = this.ha;
        this.Ij();
        this.S = new N(this);
        this.ra = new O(this)
    }
    e.prototype.wg = function() {
        var a = 0;
        this.bh = navigator.userAgent.match(/(MSIE)/g) ? !0 : !1;
        if (this.Ic = navigator.userAgent.match(/(Safari)/g) ? !0 : !1)
            a = navigator.userAgent.indexOf("Safari"),
            this.Cc = navigator.userAgent.substring(a + 7),
            a = navigator.userAgent.indexOf("Version"),
            -1 != a && (this.Cc = navigator.userAgent.substring(a + 8)),
            this.Cc = this.Cc.substring(0, this.Cc.indexOf(" ")),
            this.Cc = this.Cc.substring(0, this.Cc.indexOf(".")),
            this.Hh = !0;
        if (this.ah = navigator.userAgent.match(/(Chrome)/g) ? !0 : !1)
            this.Ic = !1;
        this.Ae = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? !0 : !1;
        this.If = navigator.userAgent.match(/(iPhone|iPod)/g) ? !0 : !1;
        this.Hf = navigator.userAgent.match(/(android)/i) ? !0 : !1;
        this.dh = navigator.userAgent.match(/(IEMobile)/i) ? !0 : !1;
        this.Jf = this.Ae || this.Hf || this.dh;
        var a = ["Webkit", "Moz", "O", "ms", "Ms"], b;
        this.ua = "";
        this.Vb = "transition";
        this.Aa = "transform";
        this.dc = "perspective";
        for (b = 0; b < a.length; b++)
            "undefined" !== typeof document.documentElement.style[a[b] + "Transform"] && (this.ua = "-" + a[b].toLowerCase() + "-",
            this.Vb = a[b] + "Transition",
            this.Aa = a[b] + "Transform",
            this.dc = a[b] + "Perspective");
        this.Ff = Q();
        this.ka = R();
        this.Hb = this.Ff;
        this.ka && (this.Hb = !1);
        this.Eb = !0;
        this.fd = !1;
        if (this.Ae || this.Hf)
            this.Jh(80),
            this.Ye = 2;
        this.$c("Pano2VR player - Prefix:" + this.ua + ", " + (this.Ff ? "CSS 3D available" : "CSS 3D not available") + ", " + (this.ka ? "WebGL available" : "WebGL not available"));
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext,
            this.lb = new AudioContext
        } catch (c) {
            this.lb = null
        }
        if (this.Ic && !(this.Hh && 9 <= Number(this.Cc)) || this.Ae)
            this.lb = null
    }
    ;
    e.prototype.$c = function(a) {
        var b = document.getElementById("debug");
        b && (b.innerHTML = a + "<br />");
        window.console && window.console.log(a)
    }
    ;
    e.prototype.Ij = function() {
        this.requestAnimationFrame = function() {
            var a = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
            return a ? a : function(a) {
                window.setTimeout(a, 10)
            }
        }()
    }
    ;
    e.prototype.Jh = function(a) {
        this.qh = a
    }
    ;
    e.prototype.Pj = function(a) {
        this.Yc = a
    }
    ;
    e.prototype.Ui = function() {
        return this.Ke
    }
    ;
    e.prototype.Nj = function(a) {
        this.oc = a
    }
    ;
    e.prototype.Fi = function() {
        return this.oc
    }
    ;
    e.prototype.Li = function() {
        return this.Jf
    }
    ;
    e.prototype.Ji = function() {
        return this.u.active
    }
    ;
    e.prototype.Qj = function(a) {
        this.Jf = Boolean(a)
    }
    ;
    e.prototype.bc = function() {
        return 1 * this.l.height / (2 * Math.tan(Math.PI / 180 * (this.Wb() / 2)))
    }
    ;
    e.prototype.Kh = function(a, b) {
        this.isFullscreen && (a = window.innerWidth,
        b = window.innerHeight);
        var c = a - this.margin.left - this.margin.right
          , d = b - this.margin.top - this.margin.bottom;
        if (!(10 > c || 10 > d)) {
            var f = window.devicePixelRatio || 1;
            this.Oe && (f = 1);
            this.w.style.width = c + "px";
            this.w.style.height = d + "px";
            this.w.style.left = this.margin.left + "px";
            this.w.style.top = this.margin.top + "px";
            if (this.ka)
                try {
                    this.Oa && (this.Oa.style.position = "absolute",
                    this.Oa.style.display = "inline",
                    this.Oa.style.width = c + "px",
                    this.Oa.style.height = d + "px",
                    this.Oa.width = c * f,
                    this.Oa.height = d * f),
                    this.a && (this.Ta.width = c * f,
                    this.Ta.height = d * f,
                    this.a.viewport(0, 0, this.a.drawingBufferWidth, this.a.drawingBufferHeight))
                } catch (e) {
                    alert(e)
                }
            this.pb && (this.pb.style.width = a + "px",
            this.pb.style.height = b + "px",
            this.pb.width = a,
            this.pb.height = b);
            this.va && (this.va.style.width = a + "px",
            this.va.style.height = b + "px",
            this.la.style.width = a + "px",
            this.la.style.height = b + "px",
            this.la.width = a,
            this.la.height = b,
            this.la.style.left = this.margin.left + "px",
            this.la.style.top = this.margin.top + "px",
            this.D && this.D != this.va && (this.D.style.width = a + "px",
            this.D.style.height = b + "px"));
            this.Ea && (c = this.Ea.ac,
            c.style.width = a + "px",
            c.style.height = b + "px",
            c.width = a,
            c.height = b,
            c.style.left = this.margin.left + "px",
            c.style.top = this.margin.top + "px");
            this.Id && (this.Ca = !0);
            c = this.w.offsetWidth;
            d = this.w.offsetHeight;
            if (this.l.width != c || this.l.height != d)
                this.l.width = c,
                this.l.height = d;
            this.Ck();
            this.D && this.D.ggUpdateSize && this.D.ggUpdateSize(a, b)
        }
    }
    ;
    e.prototype.Qc = function() {
        this.fg = !0
    }
    ;
    e.prototype.Rc = function() {
        this.Kh(this.Tc.offsetWidth, this.Tc.offsetHeight)
    }
    ;
    e.prototype.fj = function() {
        var a = {
            width: 0,
            height: 0
        };
        a.width = this.l.width;
        a.height = this.l.height;
        return a
    }
    ;
    e.prototype.Hc = function() {
        var a = {
            x: 0,
            y: 0
        }
          , b = this.w;
        if (b.offsetParent) {
            do
                a.x += b.offsetLeft,
                a.y += b.offsetTop,
                b = b.offsetParent;
            while (b)
        }
        return a
    }
    ;
    e.prototype.Wj = function(a) {
        this.xa = a
    }
    ;
    e.prototype.Sj = function(a, b, c, d) {
        this.margin.left = a;
        this.margin.top = b;
        this.margin.right = c;
        this.margin.bottom = d;
        this.xa = this.skinObj;
        this.Qc()
    }
    ;
    e.prototype.ui = function(a) {
        0 == a && (this.C.wc = !1);
        1 == a && (this.C.wc = !0);
        2 == a && (this.C.wc = this.C.wc ? !1 : !0)
    }
    ;
    e.prototype.dj = function() {
        return 1 == this.C.wc ? 1 : 0
    }
    ;
    e.prototype.pg = function(a, b) {
        this.v.mode = 1 == b && 0 < this.v.mode ? 0 : Math.round(a);
        this.update();
        this.Y && (this.Y.changePolygonMode(a, b),
        this.Y.update())
    }
    ;
    e.prototype.Wi = function() {
        return this.v.mode
    }
    ;
    e.prototype.vi = function() {}
    ;
    e.prototype.ej = function() {
        return 0
    }
    ;
    e.prototype.Wg = function(a, b, c) {
        a = Math.atan2(a + 1, c);
        var d = Math.atan2(b + 1, c);
        b = Math.sin(a);
        c = Math.sin(d);
        a = Math.cos(a);
        d = Math.cos(d);
        this.Fg.Ka(0, 0, -1);
        this.Eg.Ka(a, 0, -b);
        this.Gg.Ka(-a, 0, -b);
        this.Hg.Ka(0, d, -c);
        this.Dg.Ka(0, -d, -c)
    }
    ;
    e.prototype.qf = function(a) {
        a = this.xd(a, this.Fg);
        a = this.xd(a, this.Eg);
        a = this.xd(a, this.Gg);
        a = this.xd(a, this.Hg);
        return a = this.xd(a, this.Dg)
    }
    ;
    e.prototype.Th = function(a) {
        if (!this.Eb && this.kj != a) {
            this.kj = a;
            var b;
            b = this.margin.left + this.l.width / 2 + "px ";
            b += this.margin.top + this.l.height / 2 + "px ";
            this.va.style[this.dc] = a + "px";
            this.va.style[this.dc + "Origin"] = b;
            this.w.style[this.dc] = a + "px";
            this.w.style[this.dc + "Origin"] = b
        }
    }
    ;
    e.prototype.ef = function() {
        var a, b = new y(0,0,-100), c = this.bc(), d, f, e;
        f = 100 / this.f.b;
        e = this.g.width / this.g.height;
        d = this.l.height * f * e;
        f *= this.l.height;
        for (var g = 0; g < this.I.length; g++) {
            var k = this.I[g], l, p;
            "point" == k.type && (p = !1,
            2 == this.rb ? (a = (this.pan.b - k.pan) / 100 / e * d,
            l = (this.j.b - k.j) / 100 * f,
            Math.abs(a) < this.l.width / 2 + 500 && Math.abs(l) < this.l.height / 2 + 500 && (p = !0)) : (b.Ka(0, 0, -100),
            b.pa(-k.j * Math.PI / 180),
            b.wa(k.pan * Math.PI / 180),
            b.wa(-this.pan.b * Math.PI / 180),
            b.pa(this.j.b * Math.PI / 180),
            b.Ra(this.G.b * Math.PI / 180),
            .01 > b.z ? (l = -c / b.z,
            a = b.x * l,
            l *= b.y,
            Math.abs(a) < this.l.width / 2 + 500 && Math.abs(l) < this.l.height / 2 + 500 && (p = !0)) : l = a = 0),
            k.sb = a + this.l.width / 2,
            k.Ya = l + this.l.height / 2,
            k.c && k.c.__div && ("none" != k.c.__div.style[this.Vb] && (k.c.__div.style[this.Vb] = "none"),
            k.c.ggUse3d ? (this.Eb || this.Th(c),
            k.c.__div.style.width = "1px",
            k.c.__div.style.height = "1px",
            a = "",
            this.Eb && (a += "perspective(" + c + "px) "),
            a += "translate3d(0px,0px," + c + "px) ",
            a += "rotateZ(" + this.G.b.toFixed(10) + "deg) ",
            a += "rotateX(" + this.j.b.toFixed(10) + "deg) ",
            a += "rotateY(" + (-this.pan.b).toFixed(10) + "deg) ",
            a += "rotateY(" + k.pan.toFixed(10) + "deg) ",
            a += "rotateX(" + (-k.j).toFixed(10) + "deg) ",
            a += "translate3d(0px,0px," + (-1 * k.c.gg3dDistance).toFixed(10) + "px) ",
            k.c.__div.style[this.Aa + "Origin"] = "0% 0%",
            k.c.__div.style[this.Aa] = a,
            k.c.__div.style.left = this.margin.left + this.l.width / 2 + "px",
            k.c.__div.style.top = this.margin.top + this.l.height / 2 + "px") : !p || this.S.ld || this.S.Dc ? (k.c.__div.style.left = "-1000px",
            k.c.__div.style.top = "-1000px") : (k.c.__div.style.left = this.margin.left + a + this.l.width / 2 + "px",
            k.c.__div.style.top = this.margin.top + l + this.l.height / 2 + "px")));
            if ("poly" == k.type) {
                var n = [];
                if (2 == this.rb)
                    for (k.zc = [],
                    p = 0; p < k.be.length; p++)
                        l = k.be[p],
                        a = (this.pan.b - l.pan) / 100 / e * d,
                        l = (this.j.b - l.j) / 100 * f,
                        a += this.margin.left + this.l.width / 2,
                        l += this.margin.top + this.l.height / 2,
                        k.zc.push({
                            sb: a,
                            Ya: l
                        });
                else {
                    for (p = 0; p < k.be.length; p++)
                        l = k.be[p],
                        b.Ka(0, 0, -100),
                        b.pa(-l.j * Math.PI / 180),
                        b.wa(l.pan * Math.PI / 180),
                        b.wa(-this.pan.b * Math.PI / 180),
                        b.pa(this.j.b * Math.PI / 180),
                        b.Ra(this.G.b * Math.PI / 180),
                        n.push(b.clone());
                    n = this.qf(n);
                    if (0 < n.length)
                        for (p = 0; p < n.length; p++)
                            b = n[p],
                            .1 > b.z ? (l = -c / b.z,
                            a = this.l.width / 2 + b.x * l,
                            l = this.l.height / 2 + b.y * l) : l = a = 0,
                            b.sb = a,
                            b.Ya = l;
                    k.zc = n
                }
            }
        }
    }
    ;
    e.prototype.Gi = function() {
        for (var a = [], b = 0; b < this.I.length; b++) {
            var c = this.I[b];
            "point" == c.type && c.c && c.c.__div && a.push(c.c.__div)
        }
        return a
    }
    ;
    e.prototype.X = function(a, b) {
        a = Number(a);
        isNaN(b) && (b = 0);
        0 > b && (b = 0);
        1 < b && (b = 1);
        return "rgba(" + (a >> 16 & 255) + "," + (a >> 8 & 255) + "," + (a & 255) + "," + b + ")"
    }
    ;
    e.prototype.xj = function() {
        var a, b;
        if (this.la && (this.v.Md != this.v.mode && (this.v.Md = this.v.mode,
        this.la.style.visibility = 0 < this.v.mode ? "inherit" : "hidden"),
        0 < this.v.mode)) {
            this.U || (this.U = this.la.getContext("2d"));
            if (this.U.width != this.l.width || this.U.height != this.l.height)
                this.U.width = this.l.width,
                this.U.height = this.l.height;
            this.U.clear ? this.U.clear() : this.U.clearRect(0, 0, this.la.width, this.la.height);
            var c = 1;
            3 == this.v.mode && (c = this.v.ea);
            for (a = 0; a < this.I.length; a++)
                if (b = this.I[a],
                "poly" == b.type) {
                    var d = b.zc;
                    2 == this.v.mode && (c = b.ea);
                    this.U.fillStyle = this.X(b.mb, b.Mb * c);
                    this.U.strokeStyle = this.X(b.ob, b.Nb * c);
                    if (0 < d.length) {
                        this.U.beginPath();
                        for (b = 0; b < d.length; b++) {
                            var f = d[b];
                            0 == b ? this.U.moveTo(f.sb, f.Ya) : this.U.lineTo(f.sb, f.Ya)
                        }
                        this.U.closePath();
                        this.U.stroke();
                        this.U.fill()
                    }
                }
        }
    }
    ;
    e.prototype.yj = function() {
        var a, b;
        this.la.style.visibility = "hidden";
        this.v.Md != this.v.mode && (this.v.Md = this.v.mode);
        if (0 < this.v.mode && !this.S.Xd) {
            var c = 1;
            3 == this.v.mode && (c = this.v.ea);
            for (a = 0; a < this.I.length; a++) {
                var d = this.I[a];
                if ("poly" == d.type) {
                    var f = d.zc;
                    2 == this.v.mode && (c = d.ea);
                    if (0 < f.length) {
                        var e = [];
                        for (b = 0; b < f.length; b++)
                            e.push(f[b].sb),
                            e.push(f[b].Ya),
                            e.push(0);
                        this.a.useProgram(this.Db);
                        this.a.enable(this.a.BLEND);
                        this.a.blendFuncSeparate(this.a.SRC_ALPHA, this.a.ONE_MINUS_SRC_ALPHA, this.a.SRC_ALPHA, this.a.ONE);
                        this.a.disable(this.a.DEPTH_TEST);
                        b = this.a.createBuffer();
                        this.a.bindBuffer(this.a.ARRAY_BUFFER, b);
                        this.a.bufferData(this.a.ARRAY_BUFFER, new Float32Array(e), this.a.STATIC_DRAW);
                        this.a.uniform2f(this.a.getUniformLocation(this.Db, "uCanvasDimensions"), this.l.width, this.l.height);
                        b = this.a.getUniformLocation(this.Db, "uColor");
                        this.a.uniform3f(b, (d.ob >> 16 & 255) / 255, (d.ob >> 8 & 255) / 255, (d.ob & 255) / 255);
                        f = this.a.getUniformLocation(this.Db, "uAlpha");
                        this.a.uniform1f(f, d.Nb * c);
                        this.a.vertexAttribPointer(this.Db.ca, 3, this.a.FLOAT, !1, 0, 0);
                        this.a.drawArrays(this.a.LINE_LOOP, 0, e.length / 3);
                        this.a.uniform3f(b, (d.mb >> 16 & 255) / 255, (d.mb >> 8 & 255) / 255, (d.mb & 255) / 255);
                        this.a.uniform1f(f, d.Mb * c);
                        this.a.enable(this.a.STENCIL_TEST);
                        this.a.clearStencil(0);
                        this.a.clear(this.a.STENCIL_BUFFER_BIT);
                        this.a.colorMask(!1, !1, !1, !1);
                        this.a.stencilFunc(this.a.ALWAYS, 1, 1);
                        this.a.stencilOp(this.a.INCR, this.a.INCR, this.a.INCR);
                        this.a.drawArrays(this.a.TRIANGLE_FAN, 0, e.length / 3);
                        this.a.colorMask(!0, !0, !0, !0);
                        this.a.stencilFunc(this.a.EQUAL, 1, 1);
                        this.a.stencilOp(this.a.ZERO, this.a.ZERO, this.a.ZERO);
                        this.a.drawArrays(this.a.TRIANGLE_FAN, 0, e.length / 3);
                        this.a.disable(this.a.BLEND);
                        this.a.enable(this.a.DEPTH_TEST);
                        this.a.disable(this.a.STENCIL_TEST);
                        this.a.useProgram(this.F)
                    }
                }
            }
        }
    }
    ;
    e.prototype.Vg = function(a, b, c) {
        var d, f, e = !1;
        d = 0;
        for (f = a.length - 1; d < a.length; f = d++) {
            var g = a[d];
            f = a[f];
            g.Ya > c != f.Ya > c && b < (f.sb - g.sb) * (c - g.Ya) / (f.Ya - g.Ya) + g.sb && (e = !e)
        }
        return e
    }
    ;
    e.prototype.pf = function(a, b) {
        var c = -1;
        if (0 <= this.v.mode)
            for (var d = 0; d < this.I.length; d++) {
                var f = this.I[d];
                "poly" == f.type && f.zc && 0 < f.zc.length && this.Vg(f.zc, a, b) && (c = d,
                f.sb = a,
                f.Ya = b)
            }
        return 0 <= c ? this.I[c] : !1
    }
    ;
    e.prototype.Wb = function() {
        var a;
        switch (this.f.mode) {
        case 0:
            a = this.f.b / 2;
            break;
        case 1:
            a = 180 * Math.atan(this.l.height / this.l.width * Math.tan(this.f.b / 2 * Math.PI / 180)) / Math.PI;
            break;
        case 2:
            a = 180 * Math.atan(this.l.height / Math.sqrt(this.l.width * this.l.width + this.l.height * this.l.height) * Math.tan(this.f.b / 2 * Math.PI / 180)) / Math.PI;
            break;
        case 3:
            a = 4 * this.l.height / 3 > this.l.width ? this.f.b / 2 : 180 * Math.atan(4 * this.l.height / (3 * this.l.width) * Math.tan(this.f.b / 2 * Math.PI / 180)) / Math.PI
        }
        return 2 * a
    }
    ;
    e.prototype.Ue = function(a) {
        a = a / 2;
        var b;
        switch (this.f.mode) {
        case 0:
            this.f.b = 2 * a;
            break;
        case 1:
            a = 180 * Math.atan(this.l.width / this.l.height * Math.tan(a * Math.PI / 180)) / Math.PI;
            this.f.b = 2 * a;
            break;
        case 2:
            b = Math.sqrt(this.l.width * this.l.width + this.l.height * this.l.height);
            a = 180 * Math.atan(b / this.l.height * Math.tan(a * Math.PI / 180)) / Math.PI;
            this.f.b = 2 * a;
            break;
        case 3:
            4 * this.l.height / 3 > this.l.width || (a = 180 * Math.atan(3 * this.l.width / (4 * this.l.height) * Math.tan(a * Math.PI / 180)) / Math.PI),
            this.f.b = 2 * a
        }
    }
    ;
    e.prototype.ab = function() {
        var a, b, c = this.l.width / this.l.height;
        if (2 == this.rb) {
            0 < this.f.Td && (a = this.nc,
            this.g.K && 0 < this.g.K.length && (a = this.g.K[0].height),
            this.f.min = 100 * this.l.height / (a * this.f.Td));
            b = this.f.b / 2;
            a = c * b;
            var d = 50 * this.g.width / (.01 + this.g.height);
            this.f.b < this.f.min && (this.f.b = this.f.min);
            this.f.b > this.f.max && (this.f.b = this.f.max);
            100 < this.f.b && (this.f.b = 100);
            this.f.b > 2 * d / c && (this.f.b = 2 * d / c);
            this.f.b > this.j.max - this.j.min && (this.f.b = this.j.max - this.j.min);
            this.f.b > this.pan.max - this.pan.min && (this.f.b = this.pan.max - this.pan.min);
            50 < this.j.b + b && (this.j.b = 50 - b);
            -50 > this.j.b - b && (this.j.b = -50 + b);
            this.pan.b + a > d && (this.pan.b = d - a,
            this.u.active && (this.u.speed = -this.u.speed,
            this.pan.d = 0));
            this.pan.b - a < -d && (this.pan.b = -d + a,
            this.u.active && (this.u.speed = -this.u.speed,
            this.pan.d = 0));
            this.j.b + b > this.j.max && (this.j.b = this.j.max - b);
            this.j.b - b < this.j.min && (this.j.b = this.j.min + b)
        } else if (0 < this.f.Td && (a = this.nc,
        this.g.K && 0 < this.g.K.length && (a = this.g.K[0].height),
        this.f.min = 360 * Math.atan2(this.l.height / 2, a / 2 * this.f.Td) / Math.PI),
        this.f.b < this.f.min && (this.f.b = this.f.min),
        this.f.b > this.f.max && (this.f.b = this.f.max),
        b = this.Wb() / 2,
        a = 180 * Math.atan(this.l.width / this.l.height * Math.tan(b * Math.PI / 180)) / Math.PI,
        2 * b > this.j.max - this.j.min && (b = (this.j.max - this.j.min) / 2,
        this.Ue(2 * b)),
        90 > this.j.max ? this.j.b + b > this.j.max && (this.j.b = this.j.max - b) : this.j.b > this.j.max && (this.j.b = this.j.max),
        -90 < this.j.min ? this.j.b - b < this.j.min && (this.j.b = this.j.min + b) : this.j.b < this.j.min && (this.j.b = this.j.min),
        c = this.pan.max - this.pan.min,
        359.99 > c) {
            var d = 90
              , f = Math.tan(b * Math.PI / 180)
              , e = Math.tan((Math.abs(this.j.b) + b) * Math.PI / 180)
              , e = Math.sqrt(e * e + 1) / Math.sqrt(f * f + 1);
            b = 180 * Math.atan(e * Math.tan(a * Math.PI / 180)) / Math.PI;
            2 * b > c && (e = Math.tan(c * Math.PI / 360) / Math.tan(a * Math.PI / 180),
            c = e * Math.sqrt(f * f + 1),
            e = Math.sqrt(c * c - 1),
            d = 180 / Math.PI * Math.atan(e));
            this.pan.b + b > this.pan.max && (this.pan.b = this.pan.max - b,
            this.u.active && (this.u.speed = -this.u.speed,
            this.pan.d = 0));
            this.pan.b - b < this.pan.min && (this.pan.b = this.pan.min + b,
            this.u.active && (this.u.speed = -this.u.speed,
            this.pan.d = 0));
            this.j.b + a > d && (this.j.b = d - a);
            this.j.b - a < -d && (this.j.b = -d + a)
        }
    }
    ;
    e.prototype.update = function(a) {
        void 0 === a && (a = 0);
        this.Ca = !0;
        a && (this.pe = a)
    }
    ;
    e.prototype.Mi = function() {
        return this.Y ? Boolean(this.Y.isTileLoading) : 0 < this.ja || 0 < this.Nc
    }
    ;
    e.prototype.Zd = function() {
        var a = Date.now(), b;
        this.Sa ? this.Y && (this.sk(),
        2 === this.rb ? (this.ab(),
        this.ab(),
        this.ef()) : 0 === this.rb && (b = this.bc(),
        this.Wg(this.l.width / 2, this.l.height / 2, b),
        this.ef())) : (this.ab(),
        2 === this.rb ? (this.ab(),
        this.ef(),
        this.wk()) : 0 === this.rb && (b = this.bc(),
        this.Wg(this.l.width / 2, this.l.height / 2, b),
        this.ef(),
        this.ae ? this.Bk() : this.$h && this.Zh(),
        this.Uh(),
        this.ka ? (this.o.Zc ? this.Ak() : 0 < this.g.K.length ? this.zk() : this.yk(),
        this.yj()) : (this.Hb ? 0 < this.g.K.length ? this.vk() : this.uk() : this.$d && this.rk(),
        this.xj()),
        this.Ea && this.Ea.wj()));
        50 < Date.now() - a ? this.Oe || (2 < this.ag ? (this.Oe = !0,
        this.Rc()) : this.ag++) : this.ag = 0;
        this.Id && this.g.Dh++
    }
    ;
    e.prototype.yk = function() {
        var a;
        this.ab();
        if (this.l.width != this.w.offsetWidth || this.l.height != this.w.offsetHeight)
            this.l.width = this.w.offsetWidth,
            this.l.height = this.w.offsetHeight;
        this.te && (this.vc(0),
        this.Rc());
        if (this.a)
            for (this.g.mc && 6 < this.g.mc.length && (a = parseInt(this.g.mc),
            this.a.clearColor((a >> 16 & 255) / 255, (a >> 8 & 255) / 255, (a >> 0 & 255) / 255, 1)),
            this.a.clear(this.a.COLOR_BUFFER_BIT | this.a.DEPTH_BUFFER_BIT),
            D(this.qb),
            L(this.Wb(), this.Ta.width / this.Ta.height, this.qb),
            this.a.uniformMatrix4fv(this.F.Mc, !1, this.qb),
            a = 0; 6 > a; a++)
                D(this.O),
                K(this.O, -this.G.b * Math.PI / 180, [0, 0, 1]),
                K(this.O, -this.j.b * Math.PI / 180, [1, 0, 0]),
                K(this.O, (180 - this.pan.b) * Math.PI / 180, [0, 1, 0]),
                this.oa && (K(this.O, -this.oa.pitch * Math.PI / 180, [1, 0, 0]),
                K(this.O, this.oa.G * Math.PI / 180, [0, 0, 1])),
                4 > a ? K(this.O, -Math.PI / 2 * a, [0, 1, 0]) : K(this.O, Math.PI / 2 * (5 == a ? 1 : -1), [1, 0, 0]),
                this.a.bindBuffer(this.a.ARRAY_BUFFER, this.rf),
                this.a.vertexAttribPointer(this.F.ca, 3, this.a.FLOAT, !1, 0, 0),
                this.a.bindBuffer(this.a.ARRAY_BUFFER, this.ne),
                this.a.vertexAttribPointer(this.F.Ga, 2, this.a.FLOAT, !1, 0, 0),
                6 <= this.eb.length && this.eb[a].loaded && (this.a.activeTexture(this.a.TEXTURE0),
                this.a.bindTexture(this.a.TEXTURE_2D, this.eb[a]),
                this.a.bindBuffer(this.a.ELEMENT_ARRAY_BUFFER, this.me),
                this.a.uniform1i(this.F.Pe, 0),
                this.a.uniformMatrix4fv(this.F.He, !1, this.O),
                this.a.uniformMatrix4fv(this.F.Mc, !1, this.qb),
                this.a.drawElements(this.a.TRIANGLES, 6, this.a.UNSIGNED_SHORT, 0))
    }
    ;
    e.prototype.kk = function(a) {
        var b = this;
        return function() {
            b.Ca = !0;
            b.cc = !0;
            a.loaded = !0;
            b.ja && b.ja--;
            0 == b.ja && b.D && b.D.ggLoadedLevels && b.D.ggLoadedLevels();
            b.a.pixelStorei(b.a.UNPACK_FLIP_Y_WEBGL, 1);
            if (null != a.g && a.g.complete) {
                a.Pb = b.a.createTexture();
                try {
                    b.a.bindTexture(b.a.TEXTURE_2D, a.Pb),
                    b.a.texImage2D(b.a.TEXTURE_2D, 0, b.a.RGBA, b.a.RGBA, b.a.UNSIGNED_BYTE, a.g)
                } catch (c) {}
                b.a.texParameteri(b.a.TEXTURE_2D, b.a.TEXTURE_MAG_FILTER, b.a.LINEAR);
                b.a.texParameteri(b.a.TEXTURE_2D, b.a.TEXTURE_MIN_FILTER, b.a.LINEAR);
                b.a.texParameteri(b.a.TEXTURE_2D, b.a.TEXTURE_WRAP_S, b.a.CLAMP_TO_EDGE);
                b.a.texParameteri(b.a.TEXTURE_2D, b.a.TEXTURE_WRAP_T, b.a.CLAMP_TO_EDGE);
                b.a.bindTexture(b.a.TEXTURE_2D, null)
            }
            b.update()
        }
    }
    ;
    e.prototype.qj = function(a) {
        var b = this;
        return function() {
            b.Ca = !0;
            b.cc = !0;
            try {
                if (null != a && a.complete) {
                    var c = {
                        width: a.width,
                        height: a.width,
                        cache: !0,
                        Sf: !0,
                        Ma: 1,
                        Fb: 1,
                        $: []
                    }, d;
                    for (d = 0; 6 > d; d++) {
                        var f = {
                            A: null,
                            da: null,
                            g: null,
                            Pb: null
                        };
                        f.A = document.createElement("canvas");
                        b.ka ? (f.A.width = c.width,
                        f.A.height = c.height) : (f.A.width = b.g.Z + 2 * b.g.Va,
                        f.A.height = b.g.Z + 2 * b.g.Va);
                        f.da = f.A.getContext("2d");
                        f.A.Rg = f.da;
                        f.A.style[b.Aa + "Origin"] = "0% 0%";
                        f.A.style.overflow = "hidden";
                        f.A.style.position = "absolute";
                        f.g = a;
                        f.da && (b.Hb ? f.da.drawImage(a, 0, d * c.height, c.width, c.height, 0, 0, c.width + 2, c.height + 2) : f.da.drawImage(a, 0, d * c.height, c.width, c.height, 0, 0, c.width, c.height));
                        b.ka && b.a && (b.a.pixelStorei(b.a.UNPACK_FLIP_Y_WEBGL, 1),
                        f.Pb = b.a.createTexture(),
                        b.a.bindTexture(b.a.TEXTURE_2D, f.Pb),
                        b.a.texImage2D(b.a.TEXTURE_2D, 0, b.a.RGBA, b.a.RGBA, b.a.UNSIGNED_BYTE, f.A),
                        b.a.texParameteri(b.a.TEXTURE_2D, b.a.TEXTURE_MAG_FILTER, b.a.LINEAR),
                        b.a.texParameteri(b.a.TEXTURE_2D, b.a.TEXTURE_MIN_FILTER, b.a.LINEAR),
                        b.a.texParameteri(b.a.TEXTURE_2D, b.a.TEXTURE_WRAP_S, b.a.CLAMP_TO_EDGE),
                        b.a.texParameteri(b.a.TEXTURE_2D, b.a.TEXTURE_WRAP_T, b.a.CLAMP_TO_EDGE),
                        b.a.bindTexture(b.a.TEXTURE_2D, null));
                        b.Hb && (f.A.uc = -1,
                        b.w.insertBefore(f.A, b.w.firstChild));
                        c.$[d] = f
                    }
                    b.g.K.push(c)
                }
            } catch (e) {}
            b.update()
        }
    }
    ;
    e.prototype.Qh = function() {
        var a = this;
        return function() {
            a.Ca = !0;
            a.cc = !0;
            a.ja && a.ja--;
            0 == a.ja && a.D && a.D.ggLoadedLevels && a.D.ggLoadedLevels()
        }
    }
    ;
    e.prototype.zk = function() {
        this.ab();
        var a, b, c;
        this.te && (this.vc(0),
        this.Rc());
        if (this.a) {
            if (this.g.mc && 6 < this.g.mc.length) {
                var d = parseInt(this.g.mc);
                this.a.clearColor((d >> 16 & 255) / 255, (d >> 8 & 255) / 255, (d >> 0 & 255) / 255, 1)
            }
            this.a.clear(this.a.COLOR_BUFFER_BIT | this.a.DEPTH_BUFFER_BIT);
            this.a.enable(this.a.DEPTH_TEST);
            D(this.qb);
            L(this.Wb(), this.Ta.width / this.Ta.height, this.qb);
            this.a.uniformMatrix4fv(this.F.Mc, !1, this.qb);
            this.Nc = 0;
            this.Wh();
            this.ph();
            var f = this.Ag(), e, d = this.g.K;
            for (e = d.length - 1; e >= f; ) {
                var g = d[e]
                  , k = 1;
                e == d.length - 1 && 0 == this.g.Va && (k = this.g.Z / (this.g.Z - .5));
                for (var l = 0; 6 > l; l++) {
                    var p = void 0
                      , p = this.Pa.Ja[l]
                      , n = p.ad;
                    if (p.Ab && 0 < n.pd && 0 < n.ce && 0 < n.scale || g.cache) {
                        p.Ca = !1;
                        var m;
                        p.Sc[e] || (p.Sc[e] = {
                            gb: 0,
                            vb: 0,
                            Bb: 0,
                            Cb: 0
                        });
                        m = p.Sc[e];
                        g.cache ? (m.gb = 0,
                        m.vb = 0,
                        m.Bb = g.Ma - 1,
                        m.Cb = g.Fb - 1) : this.Qg(g, n, m);
                        n = !0;
                        for (b = m.vb; b <= m.Cb; b++)
                            for (a = m.gb; a <= m.Bb; a++) {
                                c = a + b * g.Ma + l * g.Ma * g.Fb;
                                var q = g.$[c];
                                q || (q = g.$[c] = {});
                                this.ja < this.Ye ? q.g || (q.g = new Image,
                                q.g.onload = this.kk(q),
                                q.g.onerror = this.Qh(),
                                q.g.onabort = this.Qh(),
                                q.g.setAttribute("src", this.$e(l, e, a, b)),
                                g.cache && this.bb.push(q.g),
                                0 == this.ja && this.D && this.D.ggReLoadedLevels && this.D.ggReLoadedLevels(),
                                this.ja++,
                                this.Ca = !0) : this.Nc++;
                                if (q.Pb) {
                                    if (!q.Gd) {
                                        var r;
                                        r = .5 * e + 1;
                                        q.Gd = this.a.createBuffer();
                                        this.a.bindBuffer(this.a.ARRAY_BUFFER, q.Gd);
                                        var v = [-1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1];
                                        v[3] = a * this.g.Z - this.g.Va;
                                        v[0] = Math.min((a + 1) * this.g.Z, g.width) + this.g.Va;
                                        v[7] = b * this.g.Z - this.g.Va;
                                        v[1] = Math.min((b + 1) * this.g.Z, g.height) + this.g.Va;
                                        v[4] = v[1];
                                        v[6] = v[3];
                                        v[9] = v[0];
                                        v[10] = v[7];
                                        for (c = 0; 12 > c; c++)
                                            v[c] = 0 == c % 3 ? k * r * (-2 * v[c] / g.width + 1) : 1 == c % 3 ? k * r * (-2 * v[c] / g.height + 1) : r;
                                        this.a.bufferData(this.a.ARRAY_BUFFER, new Float32Array(v), this.a.STATIC_DRAW)
                                    }
                                } else
                                    n = !1;
                                q.visible = p.Ab
                            }
                        m.lh = n
                    }
                }
                e--
            }
            for (l = 0; 6 > l; l++)
                if (p = this.Pa.Ja[l],
                p.Ab)
                    for (n = p.ad,
                    D(this.O),
                    K(this.O, -this.G.b * Math.PI / 180, [0, 0, 1]),
                    K(this.O, -this.j.b * Math.PI / 180, [1, 0, 0]),
                    K(this.O, (180 - this.pan.b) * Math.PI / 180, [0, 1, 0]),
                    this.oa && (K(this.O, -this.oa.pitch * Math.PI / 180, [1, 0, 0]),
                    K(this.O, this.oa.G * Math.PI / 180, [0, 0, 1])),
                    4 > l ? K(this.O, -Math.PI / 2 * l, [0, 1, 0]) : K(this.O, Math.PI / 2 * (5 == l ? 1 : -1), [1, 0, 0]),
                    this.a.uniform1i(this.F.Pe, 0),
                    this.a.uniformMatrix4fv(this.F.Mc, !1, this.qb),
                    this.a.uniformMatrix4fv(this.F.He, !1, this.O),
                    this.a.bindBuffer(this.a.ARRAY_BUFFER, this.ne),
                    this.a.vertexAttribPointer(this.F.Ga, 2, this.a.FLOAT, !1, 0, 0),
                    this.a.activeTexture(this.a.TEXTURE0),
                    this.a.bindBuffer(this.a.ELEMENT_ARRAY_BUFFER, this.me),
                    this.a.useProgram(this.F),
                    e = f; e <= d.length - 1; ) {
                        g = d[e];
                        if (p.Ab && 0 < n.pd && p.Sc[e] && 0 <= p.Sc[e].gb) {
                            m = p.Sc[e];
                            for (b = m.vb; b <= m.Cb; b++)
                                for (a = m.gb; a <= m.Bb; a++)
                                    c = a + b * g.Ma + l * g.Ma * g.Fb,
                                    (q = g.$[c]) || (q = g.$[c] = {}),
                                    q.Pb && (this.a.uniform1f(this.F.hi, 1E-4 * (a % 2 + b % 2 * 2)),
                                    this.a.bindBuffer(this.a.ARRAY_BUFFER, q.Gd),
                                    this.a.vertexAttribPointer(this.F.ca, 3, this.a.FLOAT, !1, 0, 0),
                                    this.a.bindTexture(this.a.TEXTURE_2D, q.Pb),
                                    this.a.texParameteri(this.a.TEXTURE_2D, this.a.TEXTURE_MAG_FILTER, this.a.LINEAR),
                                    this.a.texParameteri(this.a.TEXTURE_2D, this.a.TEXTURE_MIN_FILTER, this.a.LINEAR),
                                    this.a.texParameteri(this.a.TEXTURE_2D, this.a.TEXTURE_WRAP_S, this.a.CLAMP_TO_EDGE),
                                    this.a.texParameteri(this.a.TEXTURE_2D, this.a.TEXTURE_WRAP_T, this.a.CLAMP_TO_EDGE),
                                    this.a.drawElements(this.a.TRIANGLES, 6, this.a.UNSIGNED_SHORT, 0)),
                                    q.visible = p.Ab;
                            m.lh && (e = d.length)
                        }
                        e++
                    }
            for (a = 0; a < d.length; a++)
                if (g = d[a],
                !g.cache)
                    for (var w in g.$)
                        g.$.hasOwnProperty(w) && (q = g.$[w],
                        q.visible || (q.Pb && this.a.deleteTexture(q.Pb),
                        q.g = null,
                        q.Gd && this.a.deleteBuffer(q.Gd),
                        delete g.$[w]));
            this.cc = !1
        }
    }
    ;
    e.prototype.Bk = function() {
        this.a.disable(this.a.DEPTH_TEST);
        var a;
        for (a = 0; a < this.J.length; a++) {
            var b = this.J[a];
            D(this.O);
            K(this.O, -this.G.b * Math.PI / 180, [0, 0, 1]);
            K(this.O, -this.j.b * Math.PI / 180, [1, 0, 0]);
            K(this.O, (180 - this.pan.b) * Math.PI / 180, [0, 1, 0]);
            K(this.O, b.pan * Math.PI / 180, [0, 1, 0]);
            K(this.O, -b.j * Math.PI / 180, [1, 0, 0]);
            F(this.O, [0, 0, 1]);
            K(this.O, b.Ra * Math.PI / 180, [0, 0, 1]);
            K(this.O, -b.wa * Math.PI / 180, [0, 1, 0]);
            K(this.O, b.pa * Math.PI / 180, [1, 0, 0]);
            var c = Math.tan(b.f / 2 * Math.PI / 180)
              , d = b.lg;
            d || (d = 16 / 9);
            var f = this.O
              , c = [c, c / d, 1]
              , d = c[0]
              , e = c[1]
              , c = c[2];
            f[0] *= d;
            f[1] *= d;
            f[2] *= d;
            f[3] *= d;
            f[4] *= e;
            f[5] *= e;
            f[6] *= e;
            f[7] *= e;
            f[8] *= c;
            f[9] *= c;
            f[10] *= c;
            f[11] *= c;
            F(this.O, [0, 0, -1]);
            this.a.bindBuffer(this.a.ARRAY_BUFFER, this.rf);
            this.a.vertexAttribPointer(this.F.ca, 3, this.a.FLOAT, !1, 0, 0);
            this.a.bindBuffer(this.a.ARRAY_BUFFER, this.ne);
            this.a.vertexAttribPointer(this.F.Ga, 2, this.a.FLOAT, !1, 0, 0);
            this.a.activeTexture(this.a.TEXTURE0);
            this.a.bindTexture(this.a.TEXTURE_2D, b.Gb);
            this.a.texParameteri(this.a.TEXTURE_2D, this.a.TEXTURE_MAG_FILTER, this.a.LINEAR);
            this.a.texParameteri(this.a.TEXTURE_2D, this.a.TEXTURE_MIN_FILTER, this.a.LINEAR);
            this.a.texParameteri(this.a.TEXTURE_2D, this.a.TEXTURE_WRAP_S, this.a.CLAMP_TO_EDGE);
            this.a.texParameteri(this.a.TEXTURE_2D, this.a.TEXTURE_WRAP_T, this.a.CLAMP_TO_EDGE);
            this.a.bindBuffer(this.a.ELEMENT_ARRAY_BUFFER, this.me);
            this.a.uniform1i(this.F.Pe, 0);
            this.a.uniformMatrix4fv(this.F.He, !1, this.O);
            this.a.uniformMatrix4fv(this.F.Mc, !1, this.qb);
            this.a.drawElements(this.a.TRIANGLES, 6, this.a.UNSIGNED_SHORT, 0)
        }
        this.a.enable(this.a.DEPTH_TEST)
    }
    ;
    e.prototype.Ak = function() {
        this.ab();
        var a;
        if (this.l.width != this.w.offsetWidth || this.l.height != this.w.offsetHeight)
            this.l.width = this.w.offsetWidth,
            this.l.height = this.w.offsetHeight;
        this.te && (this.vc(0),
        this.Rc());
        if (this.a)
            for (D(this.qb),
            L(this.Wb(), this.Ta.width / this.Ta.height, this.qb),
            this.a.uniformMatrix4fv(this.F.Mc, !1, this.qb),
            this.a.bindTexture(this.a.TEXTURE_2D, this.o.Gb),
            a = 0; 1 > a; a++)
                D(this.O),
                K(this.O, -this.G.b * Math.PI / 180, [0, 0, 1]),
                K(this.O, -this.j.b * Math.PI / 180, [1, 0, 0]),
                K(this.O, (180 - this.pan.b) * Math.PI / 180, [0, 1, 0]),
                this.oa && (K(this.O, -this.oa.pitch * Math.PI / 180, [1, 0, 0]),
                K(this.O, this.oa.G * Math.PI / 180, [0, 0, 1])),
                this.a.bindBuffer(this.a.ARRAY_BUFFER, this.o.hg),
                this.a.vertexAttribPointer(this.F.ca, 3, this.a.FLOAT, !1, 0, 0),
                this.a.bindBuffer(this.a.ARRAY_BUFFER, this.o.Xe),
                this.a.vertexAttribPointer(this.F.Ga, 2, this.a.FLOAT, !1, 0, 0),
                this.a.activeTexture(this.a.TEXTURE0),
                this.a.bindBuffer(this.a.ELEMENT_ARRAY_BUFFER, this.o.Gf),
                this.a.uniform1i(this.F.Pe, 0),
                this.a.uniformMatrix4fv(this.F.He, !1, this.O),
                this.a.uniformMatrix4fv(this.F.Mc, !1, this.qb),
                this.a.drawElements(this.a.TRIANGLES, 36, this.a.UNSIGNED_SHORT, 0)
    }
    ;
    e.prototype.uk = function() {
        this.ab();
        var a = !1;
        if (this.l.width != this.w.offsetWidth || this.l.height != this.w.offsetHeight)
            this.l.width = this.w.offsetWidth,
            this.l.height = this.w.offsetHeight,
            this.w.style[this.Aa + "OriginX"] = this.l.width / 2 + "px",
            this.w.style[this.Aa + "OriginY"] = this.l.height / 2 + "px",
            a = !0;
        var b = Math.round(this.bc());
        this.Nd == b && !a || this.Eb || (this.Nd = b,
        this.w.style[this.dc] = b + "px");
        this.Pa.xi(this.pan.b, this.j.b, this.G.b, this.oa);
        for (a = 0; 6 > a; a++) {
            var c, d;
            if (c = this.Pa.Ja[a])
                d = "",
                this.Eb ? (d += "translate3d(" + this.l.width / 2 + "px," + this.l.height / 2 + "px,0px) ",
                d += "perspective(" + b + "px) ",
                d += "translate3d(0px,0px," + b + "px) ") : d += "translate3d(" + this.l.width / 2 + "px," + this.l.height / 2 + "px," + b + "px) ",
                d += "rotateZ(" + Number(this.G.b).toFixed(10) + "deg) ",
                d += "rotateX(" + Number(this.j.b).toFixed(10) + "deg) ",
                d += "rotateY(" + Number(-this.pan.b).toFixed(10) + "deg) ",
                c.Sg && (d += c.Sg,
                c.Ab || (d = "translate3d(-10px,-10px,0px) scale(0.001,0.001)"),
                c.A.style[this.Aa] = d)
        }
    }
    ;
    e.prototype.rk = function() {
        this.ab();
        var a;
        this.pb && (a = this.pb.getContext("2d"));
        if (this.l.width !== this.w.offsetWidth || this.l.height !== this.w.offsetHeight)
            this.l.width = this.w.offsetWidth,
            this.l.height = this.w.offsetHeight;
        if (a) {
            var b = a.canvas.width / 2
              , c = a.canvas.height / 2
              , d = a.createRadialGradient(b, c, 5, b, c, Math.max(b, c));
            d.addColorStop(0, "#333");
            d.addColorStop(1, "#fff");
            a.rect(0, 0, a.canvas.width, a.canvas.height);
            a.fillStyle = d;
            a.fill();
            a.fillStyle = "#f00";
            a.font = "20px Helvetica";
            a.textAlign = "center";
            a.fillText("Pan: " + this.pan.b.toFixed(1), b, c - 60);
            a.fillText("Tilt: " + this.j.b.toFixed(1), b, c - 30);
            a.fillText("Fov: " + this.f.b.toFixed(1), b, c + 0);
            a.fillText("Node: " + this.Kg(), b, c + 30);
            a.fillText("Title: " + this.od.title, b, c + 60)
        }
    }
    ;
    e.prototype.sk = function() {
        this.ab();
        if (this.l.width !== this.w.offsetWidth || this.l.height !== this.w.offsetHeight)
            this.l.width = this.w.offsetWidth,
            this.l.height = this.w.offsetHeight;
        this.Y && this.Y.setPan && (this.Y.setPan(this.pan.b),
        this.Y.setTilt(this.j.b),
        this.Y.setFov(this.f.b))
    }
    ;
    e.prototype.wk = function() {
        this.la.style.visibility = "inherit";
        this.U || (this.U = this.la.getContext("2d"));
        if (this.U.width != this.l.width || this.U.height != this.l.height)
            this.U.width = this.l.width,
            this.U.height = this.l.height;
        this.U.clear ? this.U.clear() : this.U.clearRect(0, 0, this.la.width, this.la.height);
        this.Nc = 0;
        this.ab();
        var a, b, c;
        b = 100 / this.f.b;
        c = this.g.width / this.g.height;
        var d = this.l.height * b * c;
        b *= this.l.height;
        a = (this.pan.b / 100 / c - .5) * d + this.l.width / 2;
        for (var f = (this.j.b / 100 - .5) * b + this.l.height / 2, e, g, k, l, p = 0; this.g.K.length >= p + 2 && this.g.K[p + 1].width > d; )
            p++;
        var n, m;
        m = [];
        for (n = this.g.K.length - 1; n >= p; ) {
            c = this.g.K[n];
            var q;
            if (c.cache)
                q = {
                    gb: 0,
                    vb: 0
                },
                q.Bb = c.Ma - 1,
                q.Cb = c.Fb - 1;
            else {
                q = {};
                var r = -f / b * (c.height / this.g.Z);
                e = (-a + this.l.width) / d * (c.width / this.g.Z);
                g = (-f + this.l.height) / b * (c.height / this.g.Z);
                q.gb = Math.min(Math.max(0, Math.floor(-a / d * (c.width / this.g.Z))), c.Ma - 1);
                q.vb = Math.min(Math.max(0, Math.floor(r)), c.Fb - 1);
                q.Bb = Math.min(Math.max(0, Math.floor(e)), c.Ma - 1);
                q.Cb = Math.min(Math.max(0, Math.floor(g)), c.Fb - 1)
            }
            m[n] = q;
            var v = !0;
            for (g = q.vb; g <= q.Cb; g++)
                for (e = q.gb; e <= q.Bb; e++)
                    l = e + g * c.Ma,
                    (r = c.$[l]) || (r = c.$[l] = {}),
                    this.ja < this.Ye ? r.g || (r.g = new Image,
                    r.g.onload = this.jk(),
                    r.g.onerror = this.Ze(r),
                    r.g.onabort = this.Ze(r),
                    r.g.setAttribute("src", this.$e(0, n, e, g)),
                    c.cache && this.bb.push(r.g),
                    0 == this.ja && this.D && this.D.ggReLoadedLevels && this.D.ggReLoadedLevels(),
                    this.ja++,
                    this.Ca = !0) : this.Nc++,
                    r.g && r.g.complete || (v = !1),
                    r.visible = !0;
            q.lh = v;
            n--
        }
        for (n = this.g.K.length - 1; n >= p; ) {
            c = this.g.K[n];
            if (m[n] && 0 <= m[n].gb)
                for (q = m[n],
                g = q.vb; g <= q.Cb; g++)
                    for (e = q.gb; e <= q.Bb; e++)
                        l = e + g * c.Ma,
                        (r = c.$[l]) || (r = c.$[l] = {}),
                        r.g && r.g.complete && this.U.drawImage(r.g, a + (-this.g.Va + this.g.Z * e) * d / c.width, f + (-this.g.Va + this.g.Z * g) * b / c.height, r.g.width * d / c.width, r.g.height * b / c.height),
                        r.visible = !0;
            n--
        }
        for (d = 0; d < this.g.K.length; d++)
            if (c = this.g.K[d],
            !c.cache)
                for (k in c.$)
                    c.$.hasOwnProperty(k) && (r = c.$[k],
                    r.visible || (r.g = null,
                    delete c.$[k]));
        if (0 < this.v.mode)
            for (d = 1,
            3 == this.v.mode && (d = this.v.ea),
            k = 0; k < this.I.length; k++)
                if (c = this.I[k],
                "poly" == c.type && (b = c.zc,
                2 == this.v.mode && (d = c.ea),
                0 < b.length)) {
                    this.U.fillStyle = this.X(c.mb, c.Mb * d);
                    this.U.strokeStyle = this.X(c.ob, c.Nb * d);
                    this.U.beginPath();
                    for (c = 0; c < b.length; c++)
                        a = b[c],
                        0 == c ? this.U.moveTo(a.sb, a.Ya) : this.U.lineTo(a.sb, a.Ya);
                    this.U.closePath();
                    this.U.stroke();
                    this.U.fill()
                }
        this.cc = !1
    }
    ;
    e.prototype.ik = function(a) {
        var b = this;
        return function() {
            b.Ca = !0;
            b.cc = !0;
            a.loaded = !0;
            a.g && !a.A && b.w.appendChild(a.g);
            b.ja && b.ja--;
            0 == b.ja && b.D && b.D.ggLoadedLevels && b.D.ggLoadedLevels();
            a.g && a.da && (a.da.drawImage(a.g, 0, 0),
            a.g = null)
        }
    }
    ;
    e.prototype.jk = function() {
        var a = this;
        return function() {
            a.Ca = !0;
            a.cc = !0;
            a.ja && a.ja--;
            0 == a.ja && a.D && a.D.ggLoadedLevels && a.D.ggLoadedLevels()
        }
    }
    ;
    e.prototype.Ze = function(a) {
        var b = this;
        return function() {
            b.Ca = !0;
            b.cc = !0;
            b.ja && b.ja--;
            0 == b.ja && b.D && b.D.ggLoadedLevels && b.D.ggLoadedLevels();
            a.g = null
        }
    }
    ;
    e.prototype.Qg = function(a, b, c) {
        c.gb = a.width / this.g.Z * b.zd;
        c.vb = a.height / this.g.Z * b.Ad;
        c.Bb = a.width / this.g.Z * b.Qd;
        c.Cb = a.height / this.g.Z * b.Rd;
        c.gb = Math.min(Math.max(0, Math.floor(c.gb)), a.Ma - 1);
        c.vb = Math.min(Math.max(0, Math.floor(c.vb)), a.Fb - 1);
        c.Bb = Math.min(Math.max(0, Math.floor(c.Bb)), a.Ma - 1);
        c.Cb = Math.min(Math.max(0, Math.floor(c.Cb)), a.Fb - 1)
    }
    ;
    e.prototype.Uj = function(a) {
        a = Math.round(a);
        this.Eb = 0 < (a & 1);
        this.fd = 0 < (a & 2);
        this.ff = 0 < (a & 4);
        this.Oe = 0 < (a & 8);
        4096 <= a && (this.Hb = 0 < (a & 4096),
        this.ka = 0 < (a & 8192),
        this.$d = 0 < (a & 32768))
    }
    ;
    e.prototype.Zi = function() {
        var a = 0;
        this.Eb && (a |= 1);
        this.fd && (a |= 2);
        this.ff && (a |= 4);
        this.Hb && (a |= 4096);
        this.ka && (a |= 8192);
        this.$d && (a |= 32768);
        return a
    }
    ;
    e.prototype.Wh = function() {
        var a;
        if (!(6 > this.Pa.Ja.length))
            for (a = 0; 6 > a; a++) {
                var b;
                b = this.Pa.Ja[a];
                var c;
                c = [];
                c.push(new y(-1,-1,-1,0,0));
                c.push(new y(1,-1,-1,1,0));
                c.push(new y(1,1,-1,1,1));
                c.push(new y(-1,1,-1,0,1));
                for (var d = 0; 4 > d; d++)
                    4 > a ? c[d].wa(-Math.PI / 2 * a) : c[d].pa(Math.PI / 2 * (4 == a ? -1 : 1)),
                    this.oa && (c[d].Ra(this.oa.G * Math.PI / 180),
                    c[d].pa(-this.oa.pitch * Math.PI / 180)),
                    c[d].wa(-this.pan.b * Math.PI / 180),
                    c[d].pa(this.j.b * Math.PI / 180),
                    c[d].Ra(this.G.b * Math.PI / 180);
                c = this.qf(c);
                b.Ab = 0 < c.length;
                if (b.Ab) {
                    b = b.ad;
                    b.zd = c[0].$b;
                    b.Qd = c[0].$b;
                    b.Ad = c[0].$a;
                    b.Rd = c[0].$a;
                    for (d = 1; d < c.length; d++)
                        b.zd = Math.min(b.zd, c[d].$b),
                        b.Qd = Math.max(b.Qd, c[d].$b),
                        b.Ad = Math.min(b.Ad, c[d].$a),
                        b.Rd = Math.max(b.Rd, c[d].$a);
                    b.pd = b.Qd - b.zd;
                    b.ce = b.Rd - b.Ad;
                    b.scale = Math.max(b.pd, b.ce)
                } else
                    b.ad.pd = -1,
                    b.ad.ce = -1
            }
    }
    ;
    e.prototype.ph = function() {
        for (var a = 0; a < this.g.K.length; a++) {
            var b = this.g.K[a], c;
            for (c in b.$)
                b.$.hasOwnProperty(c) && (b.$[c].visible = !1)
        }
    }
    ;
    e.prototype.Ag = function() {
        for (var a = 0, b = Math.tan(this.Wb() * Math.PI / 360), c = this.l.height / (2 * b), c = c * (1 + this.l.width / this.l.height * b / 2), c = c * Math.pow(2, 1 < (window.devicePixelRatio || 1) ? this.g.nh : this.g.mh); this.g.K.length >= a + 2 && !this.g.K[a + 1].Sf && this.g.K[a + 1].width > c; )
            a++;
        return a
    }
    ;
    e.prototype.vk = function() {
        this.ab();
        var a = !1, b = !1, c, d, f, b = !1;
        this.yg++;
        if (this.l.width !== this.w.offsetWidth || this.l.height !== this.w.offsetHeight)
            this.l.width = this.w.offsetWidth,
            this.l.height = this.w.offsetHeight,
            this.w.style[this.Aa + "OriginX"] = this.l.width / 2 + "px",
            this.w.style[this.Aa + "OriginY"] = this.l.height / 2 + "px",
            a = !0;
        var e = Math.round(this.bc());
        if (this.Nd != e || a)
            this.Nd = e,
            this.Eb || (this.w.style[this.dc] = e + "px",
            this.w.style[this.dc + "Origin"] = "50% 50%");
        this.Nc = 0;
        if (0 < this.g.K.length) {
            this.Wh();
            this.ph();
            var g;
            g = "";
            for (c = 0; 6 > c; c++) {
                var k;
                k = this.Pa.Ja[c];
                k.Ab && (g = g + c + ",")
            }
            var l = this.Ag(), p;
            for (p = this.g.K.length - 1; p >= l; ) {
                var a = this.g.K[p]
                  , n = 1;
                p == this.g.K.length - 1 && 0 == this.g.Va && (n = this.g.Z / (this.g.Z - 2));
                for (c = 0; 6 > c; c++) {
                    k = this.Pa.Ja[c];
                    var m = k.ad;
                    if (k.Ab && 0 < m.pd && 0 < m.ce && 0 < m.scale || a.cache) {
                        k.Ca = !1;
                        var q;
                        q = {};
                        a.cache ? (q.gb = 0,
                        q.vb = 0,
                        q.Bb = a.Ma - 1,
                        q.Cb = a.Fb - 1) : this.Qg(a, m, q);
                        for (f = q.vb; f <= q.Cb; f++)
                            for (d = q.gb; d <= q.Bb; d++) {
                                g = d + f * a.Ma + c * a.Ma * a.Fb;
                                (m = a.$[g]) || (m = a.$[g] = {});
                                if (!m.A && this.ja < this.Ye) {
                                    if (0 < this.df.length) {
                                        m.A = this.df.shift();
                                        for (g = this.w.firstChild; g && g.uc && (-1 == g.uc || g.uc >= p); )
                                            g = g.nextSibling;
                                        this.w.insertBefore(m.A, g);
                                        m.da = m.A.Rg
                                    } else if (this.Ph < this.qh) {
                                        this.Ph++;
                                        m.A = document.createElement("canvas");
                                        m.A.width = this.g.Z + 2 * this.g.Va;
                                        m.A.height = this.g.Z + 2 * this.g.Va;
                                        m.da = m.A.getContext("2d");
                                        m.A.Rg = m.da;
                                        m.A.style[this.Aa + "Origin"] = "0% 0%";
                                        m.A.style.overflow = "hidden";
                                        m.A.style.position = "absolute";
                                        for (g = this.w.firstChild; g && g.uc && (-1 == g.uc || g.uc >= p); )
                                            g = g.nextSibling;
                                        this.w.insertBefore(m.A, g)
                                    }
                                    m.A && (m.g = new Image,
                                    m.g.style[this.Aa + "Origin"] = "0% 0%",
                                    m.g.style.position = "absolute",
                                    m.g.style.overflow = "hidden",
                                    m.A.uc = p,
                                    b && (m.A.id = "tile" + c + "_" + p + "___" + f + "_" + d),
                                    m.g.onload = this.ik(m),
                                    m.g.onerror = this.Ze(m),
                                    m.g.onabort = this.Ze(m),
                                    m.g.setAttribute("src", this.$e(c, p, d, f)),
                                    a.cache && this.bb.push(m.g),
                                    0 == this.ja && this.D && this.D.ggReLoadedLevels && this.D.ggReLoadedLevels(),
                                    this.ja++,
                                    this.Ca = !0)
                                } else
                                    this.Nc++;
                                if (m.A) {
                                    g = "";
                                    this.Eb ? (g += "translate3d(" + this.l.width / 2 + "px," + this.l.height / 2 + "px,0px) ",
                                    g += " perspective(" + e + "px) ",
                                    g += "translate3d(0px,0px," + e + "px) ") : g += "translate3d(" + this.l.width / 2 + "px," + this.l.height / 2 + "px," + e + "px) ";
                                    g += "rotateZ(" + Number(this.G.b).toFixed(10) + "deg) rotateX(" + Number(this.j.b).toFixed(10) + "deg) rotateY(" + Number(-this.pan.b).toFixed(10) + "deg) ";
                                    this.oa && (g += "rotateX(" + Number(-this.oa.pitch).toFixed(10) + "deg) rotateZ(" + Number(this.oa.G).toFixed(10) + "deg) ");
                                    g = 4 > c ? g + ("rotateY(" + -90 * c + "deg)") : g + ("rotateX(" + (4 == c ? -90 : 90) + "deg)");
                                    var r = 1;
                                    this.fd ? (r = this.td / this.g.Z * (this.g.Z / a.width) * (2 * p + 1),
                                    r = this.Ic ? 2 / Math.tan(this.f.b * Math.PI / 360) * r : 2 * r,
                                    g += " scale(" + r * n * n + ")") : r = 1 / (n * n);
                                    g += " translate3d(" + (1 / n * d * this.g.Z - this.g.Va - a.width / 2) + "px," + (1 / n * f * this.g.Z - this.g.Va - a.width / 2) + "px," + -a.width * r / 2 + "px)";
                                    b && (m.A.id = "rtile_" + this.yg + "_" + c + "_" + p + "___" + f + "_" + d);
                                    k.Ab && (m.visible = !0,
                                    m.A ? m.A.style[this.Aa] = g : m.g && (m.g.style[this.Aa] = g))
                                }
                            }
                    }
                }
                p--
            }
            for (e = 0; e < this.g.K.length; e++) {
                var a = this.g.K[e], v;
                for (v in a.$)
                    a.$.hasOwnProperty(v) && (m = a.$[v],
                    !m.visible && m.A && (a.cache ? (g = "translate3d(-10px,-10px,0px) scale(0.001,0.001)",
                    m.A ? (m.A.style[this.Aa] = g,
                    b && (m.A.id = "cache")) : m.g && (m.g.style[this.Aa] = "")) : (m.da && (m.da.clear ? m.da.clear() : m.da.clearRect(0, 0, m.da.canvas.width, m.da.canvas.height)),
                    this.df.push(m.A),
                    m.A ? (b && (m.A.id = "unused"),
                    g = "translate3d(-10px,-10px,0px) scale(0.001,0.001)",
                    m.A.style[this.Aa] = g,
                    m.A.uc = -1) : m.loaded && this.w.removeChild(m.g),
                    m.A = null,
                    m.g = null,
                    m.da = null,
                    delete a.$[v])))
            }
            this.cc = !1
        }
    }
    ;
    e.prototype.Uh = function() {
        var a = Math.round(this.bc()), b;
        this.Eb || this.Th(a);
        for (b = 0; b < this.Ua.length; b++) {
            var c;
            c = this.Ua[b];
            c.Yh(a);
            c.c.hidden = !1
        }
    }
    ;
    e.prototype.Zh = function() {
        for (var a = Math.round(this.bc()), b = 0; b < this.J.length; b++) {
            var c;
            c = this.J[b];
            c.Yh(a);
            c.c.hidden = !1
        }
    }
    ;
    e.prototype.Ck = function() {
        for (var a = 0; a < this.J.length; a++) {
            var b = void 0
              , b = this.J[a];
            b.Qc()
        }
        for (a = 0; a < this.Ua.length; a++)
            b = this.Ua[a],
            b.Qc()
    }
    ;
    e.prototype.vc = function(a) {
        this.te = !1;
        try {
            if (a ? this.Oa = a : this.Oa = document.createElement("canvas"),
            this.Oa.width = 100,
            this.Oa.height = 100,
            this.Oa.style.display = "none",
            this.Oa.style.Nk = "none",
            this.w.insertBefore(this.Oa, this.w.firstChild),
            this.a = this.Oa.getContext("webgl", {
                premultipliedAlpha: !1,
                stencil: !0
            }),
            this.a || (this.a = this.Oa.getContext("experimental-webgl", {
                premultipliedAlpha: !1,
                stencil: !0
            })),
            this.a) {
                var b = this.a;
                this.Ta.width = 500;
                this.Ta.height = 500;
                b.clearColor(0, 0, 0, 0);
                b.enable(this.a.DEPTH_TEST);
                b.viewport(0, 0, 500, 500);
                b.clear(b.COLOR_BUFFER_BIT | b.DEPTH_BUFFER_BIT);
                this.Jd();
                this.Xg(this.Wd);
                this.Yg();
                this.S && (this.S.Jd(),
                this.S.vc());
                this.Ea && (this.Ea.Jd(),
                this.Ea.vc())
            }
        } catch (c) {}
        this.a ? this.ka = !0 : alert("Could not initialise WebGL!")
    }
    ;
    e.prototype.Jd = function() {
        var a = this.a.createShader(this.a.FRAGMENT_SHADER), b;
        b = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n";
        b += "void main(void) {\n";
        b += " gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n";
        b += "}\n";
        this.a.shaderSource(a, b);
        this.a.compileShader(a);
        this.a.getShaderParameter(a, this.a.COMPILE_STATUS) || (console && console.log(this.a.getShaderInfoLog(a)),
        alert(this.a.getShaderInfoLog(a)),
        a = null);
        var c = this.a.createShader(this.a.VERTEX_SHADER);
        b = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nattribute vec3 aVertexPosition;\n";
        b += "attribute vec2 aTextureCoord;\n";
        b += "uniform mat4 uMVMatrix;\n";
        b += "uniform mat4 uPMatrix;\n";
        b += "uniform float uZoffset;\n";
        b += "varying vec2 vTextureCoord;\n";
        b += "void main(void) {\n";
        b += " gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n";
        b += " gl_Position.z += uZoffset;\n";
        b += " vTextureCoord = aTextureCoord;\n";
        b += "}\n";
        this.a.shaderSource(c, b);
        this.a.compileShader(c);
        this.a.getShaderParameter(c, this.a.COMPILE_STATUS) || (console && console.log(this.a.getShaderInfoLog(a)),
        alert(this.a.getShaderInfoLog(c)),
        c = null);
        this.F = this.a.createProgram();
        this.a.attachShader(this.F, c);
        this.a.attachShader(this.F, a);
        this.a.linkProgram(this.F);
        this.a.getProgramParameter(this.F, this.a.LINK_STATUS) || alert("Could not initialise shaders");
        this.a.useProgram(this.F);
        this.F.ca = this.a.getAttribLocation(this.F, "aVertexPosition");
        this.a.enableVertexAttribArray(this.F.ca);
        this.F.Ga = this.a.getAttribLocation(this.F, "aTextureCoord");
        this.a.enableVertexAttribArray(this.F.Ga);
        this.F.Mc = this.a.getUniformLocation(this.F, "uPMatrix");
        this.F.He = this.a.getUniformLocation(this.F, "uMVMatrix");
        this.F.Pe = this.a.getUniformLocation(this.F, "uSampler");
        this.F.hi = this.a.getUniformLocation(this.F, "uZoffset");
        a = this.a.createShader(this.a.VERTEX_SHADER);
        b = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nattribute vec3 aVertexPosition;\n";
        b += "uniform vec2 uCanvasDimensions;\n";
        b += "void main(void) {\n";
        b += " vec2 pointNorm = (aVertexPosition.xy / uCanvasDimensions) * 2.0 - vec2(1.0, 1.0);\n";
        b += " gl_Position = vec4(pointNorm.x, pointNorm.y * -1.0, 0.0, 1.0);\n";
        b += "}\n";
        this.a.shaderSource(a, b);
        this.a.compileShader(a);
        this.a.getShaderParameter(a, this.a.COMPILE_STATUS) || (alert(this.a.getShaderInfoLog(a)),
        a = null);
        c = this.a.createShader(this.a.FRAGMENT_SHADER);
        b = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nuniform vec3 uColor;\n";
        b += "uniform float uAlpha;\n";
        b += "void main(void) {\n";
        b += " gl_FragColor = vec4(uColor, uAlpha);\n";
        b += "}\n";
        this.a.shaderSource(c, b);
        this.a.compileShader(c);
        this.a.getShaderParameter(c, this.a.COMPILE_STATUS) || (alert(this.a.getShaderInfoLog(c)),
        c = null);
        this.Db = this.a.createProgram();
        this.a.attachShader(this.Db, a);
        this.a.attachShader(this.Db, c);
        this.a.linkProgram(this.Db);
        this.a.getProgramParameter(this.Db, this.a.LINK_STATUS) || alert("Could not initialise shaders");
        this.Db.ca = this.a.getAttribLocation(this.Db, "aVertexPosition");
        this.a.enableVertexAttribArray(this.Db.ca)
    }
    ;
    e.prototype.Df = function(a) {
        var b = this;
        return function() {
            try {
                if (a.sj)
                    return;
                b.a.pixelStorei(b.a.UNPACK_FLIP_Y_WEBGL, 1);
                var c = !1;
                null != a.Fe && a.Fe.complete ? a.Ug || (b.a.bindTexture(b.a.TEXTURE_2D, a),
                b.a.texImage2D(b.a.TEXTURE_2D, 0, b.a.RGBA, b.a.RGBA, b.a.UNSIGNED_BYTE, a.Fe),
                c = a.Ug = !0) : null != a.Le && a.Le.complete && (b.a.bindTexture(b.a.TEXTURE_2D, a),
                b.a.texImage2D(b.a.TEXTURE_2D, 0, b.a.RGBA, b.a.RGBA, b.a.UNSIGNED_BYTE, a.Le),
                c = !0);
                c && (b.a.texParameteri(b.a.TEXTURE_2D, b.a.TEXTURE_MAG_FILTER, b.a.LINEAR),
                b.a.texParameteri(b.a.TEXTURE_2D, b.a.TEXTURE_MIN_FILTER, b.a.LINEAR),
                b.a.texParameteri(b.a.TEXTURE_2D, b.a.TEXTURE_WRAP_S, b.a.CLAMP_TO_EDGE),
                b.a.texParameteri(b.a.TEXTURE_2D, b.a.TEXTURE_WRAP_T, b.a.CLAMP_TO_EDGE),
                a.loaded = !0);
                b.a.bindTexture(b.a.TEXTURE_2D, null)
            } catch (d) {}
            b.update()
        }
    }
    ;
    e.prototype.ub = function(a) {
        return a ? "{" == a.charAt(0) || "/" == a.charAt(0) || 0 < a.indexOf("://") || 0 == a.indexOf("javascript:") ? a : this.oc + a : this.oc
    }
    ;
    e.prototype.Bc = function(a, b, c) {
        var d = (new RegExp("%0*" + b,"i")).exec(a.toString());
        if (d) {
            var d = d.toString()
              , f = c.toString();
            for (d.charAt(d.length - 1) != b && (f = (1 + c).toString()); f.length < d.length - 1; )
                f = "0" + f;
            a = a.replace(d, f)
        }
        return a
    }
    ;
    e.prototype.$e = function(a, b, c, d) {
        var f = this.g.kh - 1 - b
          , e = this.g.oh
          , g = "x";
        switch (a) {
        case 0:
            g = "f";
            break;
        case 1:
            g = "r";
            break;
        case 2:
            g = "b";
            break;
        case 3:
            g = "l";
            break;
        case 4:
            g = "u";
            break;
        case 5:
            g = "d"
        }
        for (var k = 0; 3 > k; k++)
            e = this.Bc(e, "c", a),
            e = this.Bc(e, "s", g),
            e = this.Bc(e, "r", b),
            e = this.Bc(e, "l", f),
            e = this.Bc(e, "x", c),
            e = this.Bc(e, "y", d),
            e = this.Bc(e, "v", d),
            e = this.Bc(e, "h", c);
        return this.ub(e)
    }
    ;
    e.prototype.Yg = function() {
        var a, b;
        if (this.eb)
            for (; 0 < this.eb.length; )
                this.a.deleteTexture(this.eb.pop());
        this.eb = [];
        for (var c = 0; 6 > c; c++)
            b = this.a.createTexture(),
            b.Le = null,
            b.Fe = null,
            b.Ug = !1,
            this.a.bindTexture(this.a.TEXTURE_2D, b),
            this.a.texImage2D(this.a.TEXTURE_2D, 0, this.a.RGB, 1, 1, 0, this.a.RGB, this.a.UNSIGNED_BYTE, null),
            this.a.texParameteri(this.a.TEXTURE_2D, this.a.TEXTURE_MIN_FILTER, this.a.LINEAR),
            this.a.texParameteri(this.a.TEXTURE_2D, this.a.TEXTURE_WRAP_S, this.a.CLAMP_TO_EDGE),
            this.a.texParameteri(this.a.TEXTURE_2D, this.a.TEXTURE_WRAP_T, this.a.CLAMP_TO_EDGE),
            this.Uc[c] && (a = new Image,
            a.crossOrigin = "anonymous",
            a.src = this.ub(this.Uc[c]),
            b.Le = a,
            a.addEventListener && a.addEventListener("load", this.Df(b), !1),
            this.bb.push(a)),
            this.eb.push(b);
        for (c = 0; 6 > c; c++)
            this.le[c] && (a = new Image,
            a.crossOrigin = "anonymous",
            a.src = this.ub(this.le[c]),
            a.addEventListener ? a.addEventListener("load", this.Df(this.eb[c]), !1) : a.onload = this.Df(this.eb[c]),
            this.eb[c].Fe = a,
            this.bb.push(a));
        for (c = 0; c < this.J.length; c++)
            this.J[c].Gb = this.a.createTexture(),
            this.a.bindTexture(this.a.TEXTURE_2D, this.J[c].Gb),
            this.a.texImage2D(this.a.TEXTURE_2D, 0, this.a.RGB, 1, 1, 0, this.a.RGB, this.a.UNSIGNED_BYTE, null),
            this.a.texParameteri(this.a.TEXTURE_2D, this.a.TEXTURE_MIN_FILTER, this.a.LINEAR),
            this.a.texParameteri(this.a.TEXTURE_2D, this.a.TEXTURE_WRAP_S, this.a.CLAMP_TO_EDGE),
            this.a.texParameteri(this.a.TEXTURE_2D, this.a.TEXTURE_WRAP_T, this.a.CLAMP_TO_EDGE);
        this.o.Gb = this.a.createTexture();
        this.a.bindTexture(this.a.TEXTURE_2D, this.o.Gb);
        this.a.texImage2D(this.a.TEXTURE_2D, 0, this.a.RGB, 1, 1, 0, this.a.RGB, this.a.UNSIGNED_BYTE, null);
        this.a.texParameteri(this.a.TEXTURE_2D, this.a.TEXTURE_MIN_FILTER, this.a.LINEAR);
        this.a.texParameteri(this.a.TEXTURE_2D, this.a.TEXTURE_WRAP_S, this.a.CLAMP_TO_EDGE);
        this.a.texParameteri(this.a.TEXTURE_2D, this.a.TEXTURE_WRAP_T, this.a.CLAMP_TO_EDGE);
        this.a.bindTexture(this.a.TEXTURE_2D, null)
    }
    ;
    e.prototype.Xg = function(a) {
        var b, c, d, f;
        this.rf = this.a.createBuffer();
        this.a.bindBuffer(this.a.ARRAY_BUFFER, this.rf);
        var e = [-1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1];
        for (b = 0; 12 > b; b++)
            2 > b % 3 && (e[b] *= a);
        this.a.bufferData(this.a.ARRAY_BUFFER, new Float32Array(e), this.a.STATIC_DRAW);
        this.ne = this.a.createBuffer();
        this.a.bindBuffer(this.a.ARRAY_BUFFER, this.ne);
        var g = [1, 0, 0, 0, 0, 1, 1, 1];
        this.a.bufferData(this.a.ARRAY_BUFFER, new Float32Array(g), this.a.STATIC_DRAW);
        this.me = this.a.createBuffer();
        this.a.bindBuffer(this.a.ELEMENT_ARRAY_BUFFER, this.me);
        var k = [0, 1, 2, 0, 2, 3];
        this.a.bufferData(this.a.ELEMENT_ARRAY_BUFFER, new Uint16Array(k), this.a.STATIC_DRAW);
        var e = []
          , k = []
          , g = []
          , l = new y;
        for (a = 0; 6 > a; a++) {
            d = a % 3;
            f = 3 > a ? 1 : 0;
            for (c = 0; 4 > c; c++) {
                l.x = -1;
                l.y = -1;
                l.z = 1;
                for (b = 0; b < c; b++)
                    l.Gh();
                g.push((0 > l.x ? .33 : 0) + .33 * d, (0 > l.y ? 0 : .5) + .5 * f);
                if (4 > a)
                    for (b = 0; b < a; b++)
                        l.Mj();
                else
                    5 == a ? l.Lj() : l.Kj();
                e.push(l.x, l.y, l.z)
            }
            b = 4 * a;
            k.push(0 + b, 1 + b, 2 + b, 0 + b, 2 + b, 3 + b)
        }
        this.o.hg = this.a.createBuffer();
        this.a.bindBuffer(this.a.ARRAY_BUFFER, this.o.hg);
        this.a.bufferData(this.a.ARRAY_BUFFER, new Float32Array(e), this.a.STATIC_DRAW);
        this.o.Xe = this.a.createBuffer();
        this.a.bindBuffer(this.a.ARRAY_BUFFER, this.o.Xe);
        this.a.bufferData(this.a.ARRAY_BUFFER, new Float32Array(g), this.a.STATIC_DRAW);
        this.o.Gf = this.a.createBuffer();
        this.a.bindBuffer(this.a.ELEMENT_ARRAY_BUFFER, this.o.Gf);
        this.a.bufferData(this.a.ELEMENT_ARRAY_BUFFER, new Uint16Array(k), this.a.STATIC_DRAW);
        this.Fa = this.a.createBuffer();
        this.a.bindBuffer(this.a.ARRAY_BUFFER, this.Fa);
        this.a.bufferData(this.a.ARRAY_BUFFER, new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]), this.a.STATIC_DRAW);
        this.Fa.Qb = 3;
        this.Fa.yc = 4;
        this.dd = this.a.createBuffer();
        this.a.bindBuffer(this.a.ARRAY_BUFFER, this.dd);
        g = [0, 0, 1, 0, 0, 1, 1, 1];
        this.a.bufferData(this.a.ARRAY_BUFFER, new Float32Array(g), this.a.STATIC_DRAW)
    }
    ;
    e.prototype.ue = function() {
        return this.pan.b
    }
    ;
    e.prototype.Si = function() {
        return this.R.pan
    }
    ;
    e.prototype.Ti = function() {
        for (var a = this.pan.b; -180 > a; )
            a += 360;
        for (; 180 < a; )
            a -= 360;
        return a
    }
    ;
    e.prototype.ve = function() {
        for (var a = this.pan.b - this.pan.Nf; -180 > a; )
            a += 360;
        for (; 180 < a; )
            a -= 360;
        return a
    }
    ;
    e.prototype.Xf = function(a) {
        this.ia();
        isNaN(a) || (this.pan.b = Number(a));
        this.update()
    }
    ;
    e.prototype.Yf = function(a) {
        this.ia();
        isNaN(a) || (this.pan.b = Number(a) + this.pan.Nf);
        this.update()
    }
    ;
    e.prototype.ie = function(a, b) {
        isNaN(a) || (this.Xf(this.ue() + a),
        b && (this.pan.d = a))
    }
    ;
    e.prototype.si = function(a, b) {
        this.ie(a * this.tc(), b)
    }
    ;
    e.prototype.we = function() {
        return this.j.b
    }
    ;
    e.prototype.aj = function() {
        return this.R.j
    }
    ;
    e.prototype.$f = function(a) {
        this.ia();
        isNaN(a) || (this.j.b = Number(a));
        this.update()
    }
    ;
    e.prototype.je = function(a, b) {
        this.$f(this.we() + a);
        b && (this.j.d = a)
    }
    ;
    e.prototype.ti = function(a, b) {
        this.je(a * this.tc(), b)
    }
    ;
    e.prototype.Vj = function(a) {
        this.ia();
        isNaN(a) || (this.G.b = Number(a));
        this.update()
    }
    ;
    e.prototype.$i = function() {
        return this.G.b
    }
    ;
    e.prototype.Bd = function() {
        return this.f.b
    }
    ;
    e.prototype.Hi = function() {
        return this.R.jd
    }
    ;
    e.prototype.Re = function(a) {
        this.ia();
        if (!isNaN(a) && 0 < a && 180 > a) {
            var b = this.f.b;
            this.f.b = Number(a);
            this.ab();
            b != this.f.b && this.update()
        }
    }
    ;
    e.prototype.og = function(a, b) {
        this.Re(this.Bd() + a);
        b && (this.f.d = a)
    }
    ;
    e.prototype.ud = function(a, b) {
        if (!isNaN(a)) {
            var c;
            c = a / 90 * Math.cos(Math.min(this.f.b, 90) * Math.PI / 360);
            c = this.f.b * Math.exp(c);
            this.Re(c);
            b && (this.f.d = a)
        }
    }
    ;
    e.prototype.Tj = function(a, b) {
        this.ia();
        isNaN(a) || (this.pan.b = a);
        isNaN(b) || (this.j.b = b);
        this.update()
    }
    ;
    e.prototype.Zf = function(a, b, c) {
        this.ia();
        isNaN(a) || (this.pan.b = a);
        isNaN(b) || (this.j.b = b);
        !isNaN(c) && 0 < c && 180 > c && (this.f.b = c);
        this.update()
    }
    ;
    e.prototype.Oj = function() {
        this.Zf(this.pan.fb, this.j.fb, this.f.fb)
    }
    ;
    e.prototype.Rj = function(a) {
        this.Te(a);
        this.Ih(a);
        this.Se(a)
    }
    ;
    e.prototype.Te = function(a) {
        this.C.Wa = a
    }
    ;
    e.prototype.Se = function(a) {
        this.C.Pd = a
    }
    ;
    e.prototype.Ih = function(a) {
        this.C.Lf = a
    }
    ;
    e.prototype.moveTo = function(a, b, c, d, f) {
        this.ia();
        this.R.active = !0;
        this.R.qd = !1;
        var e = a.toString().split("/");
        1 < e.length && (a = Number(e[0]),
        d = b,
        b = Number(e[1]),
        2 < e.length && (c = Number(e[2])));
        this.R.pan = isNaN(a) ? this.pan.b : a;
        this.R.j = isNaN(b) ? this.j.b : b;
        this.R.f = !isNaN(c) && 0 < c && 180 > c ? c : this.f.b;
        !isNaN(d) && 0 < d ? this.R.speed = d : this.R.speed = 1;
        this.R.G = isNaN(f) ? this.G.b : f
    }
    ;
    e.prototype.oj = function(a) {
        this.moveTo(this.pan.fb, this.j.fb, this.f.fb, a)
    }
    ;
    e.prototype.ki = function(a, b, c, d) {
        var f = new Y(this);
        f.type = "point";
        f.pan = b;
        f.j = c;
        f.id = a;
        f.c = {};
        f.c.player = this;
        f.Vc();
        f.c.hotspot = f;
        f.c.__div = document.createElement("div");
        f.c.__div.appendChild(d);
        this.I.push(f);
        f.c.__div.style.position = "absolute";
        f.c.__div.style.left = "-1000px";
        f.c.__div.style.top = "-1000px";
        this.va.insertBefore(f.c.__div, this.va.firstChild);
        this.Ca = !0
    }
    ;
    e.prototype.tk = function(a, b, c) {
        for (var d = 0; d < this.I.length; d++) {
            var f = this.I[d];
            f.id == a && (f.pan = b,
            f.j = c,
            f.Vc())
        }
        this.Ca = !0
    }
    ;
    e.prototype.Gj = function(a) {
        for (var b = -1, c, d = 0; d < this.I.length; d++)
            c = this.I[d],
            c.id == a && (b = d);
        -1 < b && (c = this.I.splice(b, 1).pop(),
        c.c && c.c.__div && this.va.removeChild(c.c.__div))
    }
    ;
    e.prototype.Vi = function() {
        for (var a = [], b = 0; b < this.I.length; b++) {
            var c = this.I[b];
            "point" == c.type && a.push(String(c.id))
        }
        return a
    }
    ;
    e.prototype.Ii = function(a) {
        for (var b = 0; b < this.I.length; b++) {
            var c = this.I[b];
            if (c.id == a)
                return b = {},
                b.id = a,
                b.pan = c.pan,
                b.tilt = c.j,
                c.c && c.c.__div && (b.div = c.c.__div),
                b
        }
    }
    ;
    e.prototype.di = function(a, b) {
        this.N.start.x = a;
        this.N.start.y = b;
        this.N.W.x = a;
        this.N.W.y = b;
        this.B.W.x = a;
        this.B.W.y = b;
        this.Vf++
    }
    ;
    e.prototype.bi = function(a, b) {
        var c = this.Wb();
        this.pan.b += a * c / this.l.height;
        this.j.b += b * c / this.l.height;
        this.ab()
    }
    ;
    e.prototype.ci = function(a, b) {
        this.N.b.x = a;
        this.N.b.y = b;
        this.N.V.x = this.N.b.x - this.N.W.x;
        this.N.V.y = this.N.b.y - this.N.W.y;
        this.C.wc && (this.N.W.x = this.N.b.x,
        this.N.W.y = this.N.b.y,
        this.update())
    }
    ;
    e.prototype.ia = function() {
        this.u.active && (this.u.active = !1,
        this.pan.d = 0,
        this.j.d = 0,
        this.f.d = 0);
        this.R.active && (this.R.active = !1,
        this.pan.d = 0,
        this.j.d = 0,
        this.f.d = 0);
        this.rd = this.R.qd = !1;
        this.De = (new Date).getTime()
    }
    ;
    e.prototype.Ni = function() {
        return this.De
    }
    ;
    e.prototype.Og = function(a, b) {
        a || (a = this.ha.x,
        b = this.ha.y);
        var c = this.l.height / (2 * Math.tan(this.f.b * Math.PI / 360))
          , d = a - this.l.width / 2
          , f = b - this.l.height / 2
          , e = {};
        e.pan = 180 * Math.atan(d / c) / Math.PI;
        e.tilt = 180 * Math.atan(-f / Math.sqrt(d * d + c * c)) / Math.PI;
        return e
    }
    ;
    e.prototype.Xi = function(a, b) {
        var c, d;
        a || (a = this.ha.x,
        b = this.ha.y);
        if (2 === this.rb)
            d = this.f.b / this.l.height,
            c = -(a - this.l.width / 2) * d + this.pan.b,
            d = -(b - this.l.height / 2) * d + this.j.b;
        else {
            d = new y(0,0,1);
            c = this.Og(a, b);
            d.Wf(-c.tilt);
            d.Fh(c.pan);
            d.Wf(-this.j.b);
            d.Fh(-this.pan.b);
            d.Wf(-this.oa.pitch);
            d.Jj(this.oa.G);
            for (c = d.li() - 180; -180 > c; )
                c += 360;
            d = d.mi()
        }
        var f = {};
        f.pan = c;
        f.tilt = d;
        return f
    }
    ;
    e.prototype.ic = function(a) {
        return a == this.control || a && a.ggType && ("container" == a.ggType || "cloner" == a.ggType || "timer" == a.ggType) ? !0 : !1
    }
    ;
    e.prototype.of = function(a, b) {
        var c = this.bc(), d, f, e;
        for (d = 0; d < this.J.length + this.Ua.length; d++) {
            var g = void 0
              , g = d < this.J.length ? this.J[d] : this.Ua[d - this.J.length];
            if (g.hb)
                return g
        }
        for (d = 0; d < this.J.length + this.Ua.length; d++) {
            var g = d < this.J.length ? this.J[d] : this.Ua[d - this.J.length], k = [], l = new y, p, n, m;
            0 < g.f && (n = Math.tan(g.f / 2 * Math.PI / 180),
            m = 0 < g.Ob ? n * g.Xb / g.Ob : n,
            g.gc && 1 != g.gc && (m *= g.gc));
            for (p = 0; 4 > p; p++) {
                switch (p) {
                case 0:
                    l.Ka(-n, -m, -1);
                    break;
                case 1:
                    l.Ka(n, -m, -1);
                    break;
                case 2:
                    l.Ka(n, m, -1);
                    break;
                case 3:
                    l.Ka(-n, m, -1)
                }
                l.pa(-g.j * Math.PI / 180);
                l.wa(g.pan * Math.PI / 180);
                l.wa(-this.pan.b * Math.PI / 180);
                l.pa(this.j.b * Math.PI / 180);
                l.Ra(this.G.b * Math.PI / 180);
                k.push(l.clone())
            }
            k = this.qf(k);
            if (0 < k.length) {
                for (p = 0; p < k.length; p++)
                    l = k[p],
                    .1 > l.z ? (e = -c / l.z,
                    f = this.l.width / 2 + l.x * e,
                    e = this.l.height / 2 + l.y * e) : e = f = 0,
                    l.sb = f,
                    l.Ya = e;
                if (this.Vg(k, a, b))
                    return g
            }
        }
        return null
    }
    ;
    e.prototype.Be = function() {
        return document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement && null != document.msFullscreenElement || document.fullScreen
    }
    ;
    e.prototype.nj = function(a) {
        this.Vh(a);
        if (this.Ub)
            this.Ub.onclick();
        this.pc = null;
        if (!this.C.Wa) {
            a = a ? a : window.event;
            if ((a.which || 0 == a.which || 1 == a.which) && this.ic(a.target)) {
                var b;
                (b = this.of(this.ha.x, this.ha.y)) && b.Yb && (this.pc = b);
                this.di(a.pageX, a.pageY);
                this.M.Da = 1;
                this.M.startTime = (new Date).getTime();
                a.preventDefault();
                this.ia()
            }
            this.N.V.x = 0;
            this.N.V.y = 0
        }
    }
    ;
    e.prototype.nd = function(a, b) {
        var c = this.v.dg;
        c.enabled && (this.ma != this.Qa && 0 <= a && 0 <= b && "" != this.ma.title ? (this.na.innerHTML = this.ma.title,
        this.na.style.color = this.X(c.eg, c.cg),
        c.background ? this.na.style.backgroundColor = this.X(c.mb, c.Mb) : this.na.style.backgroundColor = "transparent",
        this.na.style.border = "solid " + this.X(c.ob, c.Nb) + " " + c.mf + "px",
        this.na.style.borderRadius = c.lf + "px",
        this.na.style.textAlign = "center",
        0 < c.width ? (this.na.style.left = a - c.width / 2 + this.margin.left + "px",
        this.na.style.width = c.width + "px") : (this.na.style.width = "auto",
        this.na.style.left = a - this.na.offsetWidth / 2 + this.margin.left + "px"),
        this.na.style.height = 0 < c.height ? c.height + "px" : "auto",
        this.na.style.top = b + 25 + +this.margin.top + "px",
        this.na.style.visibility = "inherit",
        this.na.style.overflow = "hidden") : (this.na.style.visibility = "hidden",
        this.na.innerHTML = ""))
    }
    ;
    e.prototype.Vh = function(a) {
        var b = this.Hc();
        this.Be() ? (this.ha.x = a.pageX - this.margin.left,
        this.ha.y = a.pageY - this.margin.top) : (this.ha.x = a.pageX - b.x,
        this.ha.y = a.pageY - b.y);
        return b
    }
    ;
    e.prototype.gd = function(a) {
        a && null !== a && "object" == typeof a ? this.ma = a : this.ma = this.Qa;
        this.ma.Vc && this.ma.Vc();
        this.hotspot = this.ma
    }
    ;
    e.prototype.mj = function(a) {
        a = a ? a : window.event;
        var b = this.Vh(a);
        if (!this.C.Wa) {
            0 <= this.M.Da && (a.preventDefault(),
            (a.which || 0 == a.which || 1 == a.which) && this.ci(a.pageX, a.pageY),
            this.ia());
            var c = !1;
            if (this.ma == this.Qa || "poly" == this.ma.type) {
                var d = this.Qa;
                0 < this.I.length && this.ic(a.target) && (d = this.pf(this.ha.x, this.ha.y));
                this.Qe(d);
                this.nd(a.pageX - b.x, a.pageY - b.y);
                0 != d && (c = !0)
            }
            a = null;
            c || (a = this.of(this.ha.x, this.ha.y));
            this.va.style.cursor = this.ma != this.Qa && this.ma.Xc && c || a && a.Hd ? "pointer" : "auto"
        }
    }
    ;
    e.prototype.Qe = function(a) {
        !1 === a && (a = this.Qa);
        this.ma != a && (this.ma != this.Qa && (0 < this.v.mode && (this.ma.Ha = 0),
        this.xa && this.xa.hotspotProxyOut && this.xa.hotspotProxyOut(this.ma.id)),
        a != this.Qa ? (this.gd(a),
        this.xa && this.xa.hotspotProxyOver && this.xa.hotspotProxyOver(this.ma.id),
        0 < this.v.mode && (this.v.Ha = 1,
        this.ma.Ha = 1)) : (this.gd(this.Qa),
        0 < this.v.mode && (this.v.Ha = 0)),
        this.Y && this.Y.changeCurrentHotspot(this.ma.id))
    }
    ;
    e.prototype.lj = function(a) {
        a = a ? a : window.event;
        this.Ee = -1;
        if (!this.C.Wa && 0 <= this.M.Da) {
            this.ia();
            a.preventDefault();
            this.M.Da = -3;
            this.N.V.x = 0;
            this.N.V.y = 0;
            a = (new Date).getTime();
            var b = -1
              , b = Math.abs(this.N.start.x - this.N.W.x) + Math.abs(this.N.start.y - this.N.W.y);
            400 > a - this.M.startTime && 0 <= b && 20 > b && (this.pc && this.pc.Yb(),
            (b = this.pf(this.ha.x, this.ha.y)) && this.Sh(b),
            b = Math.abs(this.N.kc.x - this.N.W.x) + Math.abs(this.N.kc.y - this.N.W.y),
            700 > a - this.Ld && 0 <= b && 20 > b ? (this.C.vf && this.cf(),
            this.Ld = 0) : this.Ld = a,
            this.N.kc.x = this.N.W.x,
            this.N.kc.y = this.N.W.y)
        }
    }
    ;
    e.prototype.rh = function(a) {
        if (!this.C.Lf && (a = a ? a : window.event,
        this.ic(a.target))) {
            var b = a.detail ? -1 * a.detail : a.wheelDelta / 40;
            this.C.Zg && (b = -b);
            a.axis && (-1 == this.Ee ? this.Ee = a.axis : this.Ee != a.axis && (b = 0));
            var c = 0 < b ? 1 : -1;
            0 != b && (this.ud(c * this.C.Mh, !0),
            this.update());
            a.preventDefault();
            this.ia()
        }
    }
    ;
    e.prototype.qk = function(a) {
        a || (a = window.event);
        var b = a.touches
          , c = this.Hc();
        this.ha.x = b[0].pageX - c.x;
        this.ha.y = b[0].pageY - c.y;
        this.kd = this.pc = null;
        this.se && (this.se = !1,
        this.Bg());
        if (!this.C.Wa) {
            if (0 > this.M.Da && b[0]) {
                this.M.startTime = (new Date).getTime();
                this.M.start.x = b[0].pageX;
                this.M.start.y = b[0].pageY;
                this.M.W.x = b[0].pageX;
                this.M.W.y = b[0].pageY;
                this.tb = b[0].target;
                if (this.ic(a.target)) {
                    var d;
                    (d = this.of(this.ha.x, this.ha.y)) && d.Yb && (this.pc = d);
                    if (d = this.pf(this.ha.x, this.ha.y))
                        this.kd = d,
                        this.Qe(d),
                        d = this.Cd(a),
                        this.nd(d.x - c.x, d.y - c.y);
                    this.di(b[0].pageX, b[0].pageY);
                    this.M.Da = b[0].identifier;
                    a.preventDefault();
                    this.ia()
                }
                if (this.tb) {
                    c = this.tb;
                    for (d = !1; c && c != this.control; ) {
                        if (c.onmouseover)
                            c.onmouseover();
                        c.onmousedown && !d && (c.onmousedown(),
                        d = !0);
                        c = c.parentNode
                    }
                    d && a.preventDefault()
                }
            }
            1 < b.length && (this.M.Da = -5);
            !this.Ef && 2 == b.length && b[0] && b[1] && (a = b[0].pageX - b[1].pageX,
            b = b[0].pageY - b[1].pageY,
            this.f.Nh = Math.sqrt(a * a + b * b),
            this.f.cd = this.f.b);
            this.N.V.x = 0;
            this.N.V.y = 0
        }
    }
    ;
    e.prototype.Bg = function() {
        for (var a = 0; a < this.P.length; a++) {
            var b = this.P[a];
            !this.xc(b.id) && 0 <= b.loop && b.autoplay && this.bd(b.id, b.loop)
        }
        for (a = 0; a < this.J.length; a++)
            b = this.J[a],
            this.xc(b.id) || !b.autoplay || this.If || this.bd(b.id, b.loop)
    }
    ;
    e.prototype.pk = function(a) {
        a || (a = window.event);
        var b = a.touches
          , c = this.Hc();
        this.ha.x = b[0].pageX - c.x;
        this.ha.y = b[0].pageY - c.y;
        if (!this.C.Wa) {
            b[0] && (this.M.W.x = b[0].pageX,
            this.M.W.y = b[0].pageY);
            if (0 <= this.M.Da) {
                a.preventDefault();
                for (var d = 0; d < b.length; d++)
                    if (b[d].identifier == this.M.Da) {
                        this.ci(b[d].pageX, b[d].pageY);
                        break
                    }
                this.kd && (d = this.Cd(a),
                this.nd(d.x - c.x, d.y - c.y));
                this.ia()
            }
            2 == b.length && b[0] && b[1] && (this.M.Da = -6,
            this.Ef || (c = b[0].pageX - b[1].pageX,
            b = b[0].pageY - b[1].pageY,
            this.f.ug = Math.sqrt(c * c + b * b),
            this.B.f.active = !0,
            this.B.f.Ia = this.f.cd * Math.sqrt(this.f.Nh / this.f.ug),
            this.B.f.Ia > this.f.max && (this.B.f.Ia = this.f.max),
            this.B.f.Ia < this.f.min && (this.B.f.Ia = this.f.min),
            this.ia(),
            a.preventDefault()))
        }
    }
    ;
    e.prototype.nk = function(a) {
        var b, c = this.Hc(), d = !1;
        this.se && (this.se = !1,
        this.Bg());
        if (!this.C.Wa) {
            0 <= this.M.Da && this.ia();
            var f = (new Date).getTime(), e;
            b = Math.abs(this.M.start.x - this.M.W.x) + Math.abs(this.M.start.y - this.M.W.y);
            if (0 <= b && 20 > b) {
                a.preventDefault();
                d = !0;
                this.ic(this.tb) && this.pc && this.pc.Yb();
                if (this.tb)
                    for (b = this.tb,
                    e = !1; b && b != this.control; )
                        b.onclick && !e && (b.onclick(),
                        e = !0,
                        d = !1),
                        b = b.parentNode;
                b = Math.abs(this.M.kc.x - this.M.W.x) + Math.abs(this.M.kc.y - this.M.W.y);
                if (700 > f - this.Ld && 0 <= b && 20 > b) {
                    a.preventDefault();
                    if (this.ic(this.tb) && this.C.vf) {
                        var g = this;
                        setTimeout(function() {
                            g.cf()
                        }, 1)
                    }
                    if (this.tb)
                        for (b = this.tb,
                        e = !1; b && b != this.control; )
                            b.ondblclick && !e && (b.ondblclick(),
                            e = !0,
                            d = !1),
                            b = b.parentNode;
                    this.Ld = 0
                } else
                    this.Ld = f;
                this.M.kc.x = this.M.W.x;
                this.M.kc.y = this.M.W.y
            }
            if (this.tb)
                for (a.preventDefault(),
                b = this.tb,
                e = !1; b && b != this.control; ) {
                    if (b.onmouseout)
                        b.onmouseout();
                    b.onmouseup && !e && (b.onmouseup(),
                    e = !0);
                    b = b.parentNode
                }
            this.tb = null;
            this.M.Da = -11;
            this.Qe(this.Qa);
            a = this.Cd(a);
            this.nd(a.x - c.x, a.y - c.y);
            this.kd && d && this.Sh(this.kd);
            this.kd = null
        }
    }
    ;
    e.prototype.mk = function(a) {
        var b = this.Hc();
        this.C.Wa || (this.M.Da = -2);
        this.kd = null;
        this.Qe(this.Qa);
        a = this.Cd(a);
        this.nd(a.x - b.x, a.y - b.y)
    }
    ;
    e.prototype.hj = function() {
        return null != this.tb || 0 <= this.M.Da
    }
    ;
    e.prototype.th = function(a) {
        !this.Kc && window.MSGesture && (this.Kc = new MSGesture,
        this.Kc.target = this.control);
        this.Kc && this.Kc.addPointer(a.pointerId)
    }
    ;
    e.prototype.Jg = function(a) {
        this.Ef = !0;
        this.Ge = 1;
        this.C.Wa || (a.touches ? (this.tb = a.touches.target,
        this.ic(a.target) && (a.preventDefault(),
        this.f.cd = this.f.b,
        this.ia())) : (a.preventDefault(),
        this.f.cd = this.f.b,
        this.ia()))
    }
    ;
    e.prototype.Ei = function(a) {
        !this.C.Wa && this.ic(a.target) && (a.preventDefault(),
        this.B.f.active = !0,
        this.B.f.Ia = this.f.cd / Math.sqrt(a.scale),
        this.B.f.Ia > this.f.max && (this.B.f.Ia = this.f.max),
        this.B.f.Ia < this.f.min && (this.B.f.Ia = this.f.min),
        this.update(),
        this.ia())
    }
    ;
    e.prototype.pj = function(a) {
        this.C.Wa || (a.preventDefault(),
        1 != a.scale && (this.B.f.active = !0,
        this.Ge *= a.scale,
        this.B.f.Ia = this.f.cd / Math.sqrt(this.Ge),
        this.B.f.Ia > this.f.max && (this.B.f.Ia = this.f.max),
        this.B.f.Ia < this.f.min && (this.B.f.Ia = this.f.min),
        this.update(),
        this.ia()))
    }
    ;
    e.prototype.Ig = function(a) {
        this.C.Wa || (this.B.f.active = !1,
        a.preventDefault(),
        this.ia(),
        this.Kc && this.Kc.reset && this.Kc.reset())
    }
    ;
    e.prototype.ij = function(a) {
        this.C.Pd || (this.isFullscreen && a.preventDefault(),
        this.Jc = a.keyCode,
        this.ia())
    }
    ;
    e.prototype.jj = function(a) {
        this.Jc && (this.Jc = 0,
        a.preventDefault(),
        this.ia())
    }
    ;
    e.prototype.uj = function() {
        this.Jc = 0
    }
    ;
    e.prototype.Je = function() {
        this.isFullscreen && (this.Be() || this.exitFullscreen(),
        this.Be() && (this.L.style.left = "0px",
        this.L.style.top = "0px"))
    }
    ;
    e.prototype.Sh = function(a) {
        this.xa && this.xa.hotspotProxyClick && this.xa.hotspotProxyClick(a.id);
        "" != a.url && (this.Of(a.url, a.target),
        this.nd(-1, -1))
    }
    ;
    e.prototype.tc = function() {
        return Math.min(1, 2 * Math.tan(Math.PI * this.f.b / 360))
    }
    ;
    e.prototype.wh = function() {
        var a = this;
        setTimeout(function() {
            a.wh()
        }, 100);
        9 != a.Ne || a.$g || requestAnimationFrame(function() {
            a.$c("restart recover timer")
        });
        10 < a.Ne && 1 < a.Vf && (a.$c("recover timer - disabling requestAnimationFrame"),
        a.$g = !0,
        a.Pf());
        a.Ne++
    }
    ;
    e.prototype.xk = function() {
        var a = this.a;
        if (0 < this.J.length)
            for (var b = 0; b < this.J.length; b++) {
                var c = this.J[b];
                if (c.eh && c.xe != c.c.currentTime && (c.xe = c.c.currentTime,
                !c.lg && 0 < c.c.videoHeight && (c.lg = c.c.videoWidth / c.c.videoHeight),
                this.ae))
                    try {
                        c.Gb && (a.bindTexture(a.TEXTURE_2D, c.Gb),
                        a.texImage2D(a.TEXTURE_2D, 0, a.RGB, a.RGB, a.UNSIGNED_BYTE, c.c),
                        this.update())
                    } catch (d) {}
            }
        if (this.o.c && this.o.xe != this.o.c.currentTime) {
            this.o.xe = this.o.c.currentTime;
            try {
                this.o.Gb && this.o.Ce && 0 < this.o.c.readyState && (this.o.Zc = !0,
                a.bindTexture(a.TEXTURE_2D, this.o.Gb),
                a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL, 0),
                a.texImage2D(a.TEXTURE_2D, 0, a.RGB, a.RGB, a.UNSIGNED_BYTE, this.o.c),
                this.update())
            } catch (d) {}
        }
    }
    ;
    e.prototype.zj = function(a) {
        var b;
        if (this.R.active) {
            this.pan.d = this.R.pan - this.pan.b;
            if (360 == this.pan.max - this.pan.min) {
                for (; -180 > this.pan.d; )
                    this.pan.d += 360;
                for (; 180 < this.pan.d; )
                    this.pan.d -= 360
            }
            this.j.d = this.R.j - this.j.b;
            this.G.d = this.R.G - this.G.b;
            this.f.d = this.R.f - this.f.b;
            var c = this.R.speed * this.tc()
              , d = Math.sqrt(this.pan.d * this.pan.d + this.j.d * this.j.d + this.G.d * this.G.d + this.f.d * this.f.d);
            b = this.pan.b - this.R.hh;
            var f = this.j.b - this.R.jh
              , e = this.G.b - this.R.ih
              , g = this.f.b - this.R.gh;
            100 * Math.sqrt(b * b + f * f + e * e + g * g) < c && (this.R.qd = !0);
            this.R.hh = this.pan.b;
            this.R.jh = this.j.b;
            this.R.ih = this.G.b;
            this.R.gh = this.f.b;
            if (100 * d < c || this.R.qd) {
                if (this.R.active = !1,
                this.pan.d = 0,
                this.j.d = 0,
                this.G.d = 0,
                this.f.d = 0,
                this.pan.b = this.R.pan,
                this.j.b = this.R.j,
                this.G.b = this.R.G,
                this.f.b = this.R.f,
                this.onMoveComplete)
                    this.onMoveComplete()
            } else
                d = d > 5 * c ? c / d : .2,
                this.pan.d *= d,
                this.j.d *= d,
                this.f.d *= d;
            this.pan.b += this.pan.d;
            this.j.b += this.j.d;
            this.G.b += this.G.d;
            this.f.b += this.f.d;
            this.De = a.getTime();
            this.update()
        } else if (this.u.active)
            if (d = a.getTime() - this.u.startTime,
            this.u.ai && 0 < this.qc.length) {
                d /= 100;
                f = !1;
                if (this.lc != this.T.cliptitle) {
                    for (b = 0; b < this.qc.length; b++)
                        if ("" == this.lc || "" != this.lc && this.qc[b].cliptitle == this.lc) {
                            f = !0;
                            this.T = this.qc[b];
                            this.lc = this.T.cliptitle;
                            break
                        }
                    !f && 0 < this.qc.length && (f = !0,
                    this.T = this.qc[0],
                    this.lc = this.T.cliptitle)
                } else
                    f = !0;
                if (f)
                    if (this.rd)
                        if (d >= this.T.length)
                            if (this.rd = !1,
                            this.lc = this.T.nextcliptitle,
                            this.lc == this.T.cliptitle) {
                                if (1 < this.sa.length && 0 < this.u.Ie) {
                                    if (this.u.Mf) {
                                        b = 1E3;
                                        do
                                            c = this.sa[Math.floor(Math.random() * this.sa.length)];
                                        while (b-- && c == this.currentNode)
                                    } else
                                        c = this.Ng();
                                    this.Lc("{" + c + "}");
                                    this.u.startTime = a.getTime();
                                    this.rd = !1;
                                    this.u.active = !0;
                                    this.S.sd = !0
                                }
                            } else
                                this.Kd && this.T.nextclipnodeid != this.currentNode && (this.Lc("{" + this.T.nextclipnodeid + "}"),
                                this.S.enabled ? (this.u.active = !1,
                                this.S.sd = !0) : this.u.active = !0),
                                this.u.startTime = a.getTime();
                        else {
                            a = {
                                Ik: {
                                    value: 0,
                                    name: "pan"
                                },
                                Jk: {
                                    value: 1,
                                    name: "tilt"
                                },
                                Hk: {
                                    value: 2,
                                    name: "fov"
                                }
                            };
                            for (c in a) {
                                b = a[c];
                                f = 0;
                                for (f = Math.floor(d); !this.Lg(f, b.value) && 0 < f; )
                                    f--;
                                var g = this.Lg(f, b.value)
                                  , k = this.Oi(g);
                                if (k) {
                                    var f = new h(g.time,g.value)
                                      , e = new h(k.time,k.value)
                                      , l = (d - g.time) / (k.time - g.time);
                                    if (0 != g.type || 0 != k.type && 3 != k.type)
                                        if (3 == g.type)
                                            f = g.value;
                                        else {
                                            var l = new h
                                              , p = new h
                                              , n = k.time - g.time;
                                            0 == g.type ? p.Ka(g.time + .3 * n, g.value) : p.Ka(g.bezierouttime, g.bezieroutvalue);
                                            0 == k.type || 3 == k.type ? l.Ka(k.time - .3 * n, k.value) : l.Ka(k.bezierintime, k.bezierinvalue);
                                            g = new h;
                                            g.ri(f, e, p, l, d);
                                            f = g.y
                                        }
                                    else
                                        g = new h,
                                        g.hc(f, e, l),
                                        f = g.y
                                } else
                                    f = g.value;
                                switch (b.value) {
                                case 0:
                                    b = this.pan.b;
                                    this.pan.b = f;
                                    this.pan.d = this.pan.b - b;
                                    break;
                                case 1:
                                    b = this.j.b;
                                    this.j.b = f;
                                    this.j.d = this.j.b - b;
                                    break;
                                case 2:
                                    b = this.f.b,
                                    this.f.b = f,
                                    this.f.d = this.f.b - b
                                }
                            }
                            this.update()
                        }
                    else
                        c = this.T.keyframes[0],
                        d = this.T.keyframes[1],
                        b = this.T.keyframes[2],
                        this.R.qd || this.ue() == c.value && this.we() == d.value && this.Bd() == b.value ? (this.rd = !0,
                        this.u.startTime = a.getTime()) : (this.moveTo(c.value, d.value, b.value, 1),
                        this.u.active = !0)
            } else if (0 < this.u.Ie && this.Kd && d >= 1E3 * this.u.Ie) {
                if (1 < this.sa.length) {
                    if (this.u.Mf) {
                        b = 1E3;
                        do
                            c = this.sa[Math.floor(Math.random() * this.sa.length)];
                        while (b-- && c == this.currentNode)
                    } else
                        b = this.sa.indexOf(this.currentNode),
                        b++,
                        b >= this.sa.length && (b = 0),
                        c = this.sa[b];
                    this.u.startTime = a.getTime();
                    this.u.jc = a.getTime();
                    this.u.timeout = 0;
                    this.Lc("{" + c + "}");
                    this.u.active = !0;
                    this.S.sd = !0
                }
            } else
                c = a.getTime(),
                a = d = 1E3 / 60,
                0 != this.u.jc && (a = c - this.u.jc),
                this.j.d = this.u.af * (0 - this.j.b) / 100,
                this.f.d = this.u.af * (this.f.fb - this.f.b) / 100,
                this.pan.d = .95 * this.pan.d + -this.u.speed * this.tc() * .05,
                d = a / d,
                this.pan.b += this.pan.d * d,
                this.j.b += this.j.d * d,
                this.f.b += this.f.d * d,
                this.u.jc = c,
                this.update();
        else
            this.u.enabled && 0 > this.M.Da && a.getTime() - this.De > 1E3 * this.u.timeout && (this.u.Vd && this.isLoaded || !this.u.Vd) && (this.u.active = !0,
            this.u.startTime = a.getTime(),
            this.u.jc = 0,
            this.pan.d = 0,
            this.j.d = 0,
            this.f.d = 0),
            this.B.enabled && 0 == this.Jc && 0 > this.M.Da && (0 != this.pan.d || 0 != this.j.d || 0 != this.f.d) && (this.pan.d *= .9,
            this.j.d *= .9,
            this.f.d *= .9,
            this.pan.b += this.pan.d,
            this.j.b += this.j.d,
            this.ud(this.f.d),
            1E-4 > this.pan.d * this.pan.d + this.j.d * this.j.d + this.f.d * this.f.d && (this.pan.d = 0,
            this.j.d = 0,
            this.f.d = 0),
            this.update())
    }
    ;
    e.prototype.Aj = function(a) {
        var b = this.S;
        if (b.Dc) {
            var c = a.getTime() - b.gi
              , c = c / (1E3 * b.fi);
            if (1 <= c) {
                b.Dc = !1;
                for (c = 0; c < this.ra.Yd.length; c++)
                    this.ra.yf(this.ra.Yd[c]);
                b.bg = a.getTime();
                this.Oh();
                b.ld = !0;
                1 != b.Kb && 2 != b.Kb && 3 != b.Kb || b.kf || this.moveTo(b.Ve, b.We, b.jd, b.fe)
            } else
                b.vh(c)
        } else
            b.ld && (c = a.getTime() - b.bg,
            c /= 1E3 * b.mg,
            1 <= c ? (b.ld = !1,
            this.De = a.getTime(),
            this.update(),
            1 != b.Kb && 2 != b.Kb && 3 != b.Kb || !b.kf || this.moveTo(b.Ve, b.We, b.jd, b.fe),
            this.Te(b.sh),
            this.Se(b.fh),
            this.u.active = b.sd,
            this.u.jc = 0,
            b.sd = !1) : b.vh(c));
        b = this.vj;
        b.oi && (b.oe ? a.getTime() - b.wf >= 1E3 * b.zi && (b.oe = !1) : (b.current += b.Tb,
        0 > b.current && (b.current = 0,
        b.Tb = -b.Tb,
        b.oe = !0,
        b.wf = a.getTime()),
        1 < b.current && (b.current = 1,
        b.Tb = -b.Tb,
        b.oe = !0,
        b.wf = a.getTime())))
    }
    ;
    e.prototype.Ej = function() {
        var a;
        if (2 == this.v.mode)
            for (a = 0; a < this.I.length; a++) {
                var b = this.I[a];
                "poly" == b.type && b.Ha != b.ea && (b.Ha > b.ea ? (b.ea += this.v.Tb,
                b.Ha < b.ea && (b.ea = b.Ha)) : (b.ea -= this.v.Tb,
                b.Ha > b.ea && (b.ea = b.Ha)),
                this.update())
            }
        3 == this.v.mode && this.v.Ha != this.v.ea && (this.v.Ha > this.v.ea ? (this.v.ea += this.v.Tb,
        this.v.Ha < this.v.ea && (this.v.ea = this.v.Ha)) : (this.v.ea -= this.v.Tb,
        this.v.Ha > this.v.ea && (this.v.ea = this.v.Ha)),
        this.update())
    }
    ;
    e.prototype.Bj = function() {
        0 <= this.M.Da && (this.C.wc ? (this.B.V.x = .4 * (this.N.W.x - this.B.W.x),
        this.B.V.y = .4 * (this.N.W.y - this.B.W.y),
        this.B.W.x += this.B.V.x,
        this.B.W.y += this.B.V.y) : (this.B.V.x = .1 * -this.N.V.x * this.C.sensitivity / 8,
        this.B.V.y = .1 * -this.N.V.y * this.C.sensitivity / 8),
        this.bi(this.B.V.x, this.B.V.y),
        this.update());
        this.B.f.active && (this.og(.4 * (this.B.f.Ia - this.f.b)),
        .001 > Math.abs(this.B.f.Ia - this.f.b) / this.f.b && (this.B.f.active = !1),
        this.update());
        this.B.enabled && (0 != this.B.V.x || 0 != this.B.V.y) && 0 > this.M.Da && (this.B.V.x = .9 * this.B.V.x,
        this.B.V.y = .9 * this.B.V.y,
        .1 > this.B.V.x * this.B.V.x + this.B.V.y * this.B.V.y ? (this.B.V.x = 0,
        this.B.V.y = 0) : (this.bi(this.B.V.x, this.B.V.y),
        this.update()))
    }
    ;
    e.prototype.Cj = function() {
        if (0 != this.Jc) {
            var a = this.C.sensitivity / 8;
            switch (this.Jc) {
            case 37:
            case 65:
                this.ie(a * this.tc(), !0);
                break;
            case 38:
            case 87:
                this.je(a * this.tc(), !0);
                break;
            case 39:
            case 68:
                this.ie(-a * this.tc(), !0);
                break;
            case 40:
            case 83:
                this.je(-a * this.tc(), !0);
                break;
            case 43:
            case 107:
            case 16:
            case 81:
                this.C.Kf || this.ud(-a, !0);
                break;
            case 17:
            case 18:
            case 109:
            case 45:
            case 91:
            case 69:
                this.C.Kf || this.ud(a, !0)
            }
            this.update()
        }
    }
    ;
    e.prototype.Dj = function() {
        if (!this.isLoaded && this.Id && 5 < this.g.Dh) {
            var a, b = 0, c = this.bb.length;
            if (this.$d)
                c = 50,
                this.xf < c && this.xf++,
                b = this.xf;
            else
                for (a = 0; a < c; a++)
                    (this.bb[a].complete && this.bb[a].src != this.xg || "" == this.bb[a].src) && b++;
            b == c ? (this.Ke = 1,
            this.isLoaded = !0,
            this.D && this.D.ggLoaded && this.D.ggLoaded(),
            this.u.Vd && this.u.enabled && !this.R.active && !this.S.Dc && (this.u.active = !0,
            this.u.jc = 0)) : this.Ke = b / (1 * c)
        }
    }
    ;
    e.prototype.Pf = function() {
        var a = new Date;
        this.Sa && "" !== this.Gc && !this.Y && document.hasOwnProperty(this.Gc) && document[this.Gc].setPan && 0 == this.Di-- && (this.Y = document[this.Gc],
        this.Hb = this.ka = !1,
        this.la && (this.la.style.visibility = "hidden"),
        this.Y.setLocked(!0),
        this.Y.setSlaveMode(!0),
        this.Y.readConfigString(this.tf),
        this.$c("Flash player '" + this.Gc + "' connected."));
        this.Bf++;
        120 <= this.Bf && (this.Bf = 0);
        this.Vf = this.Ne = 0;
        this.fg && (this.Rc(),
        this.fg = !1);
        this.Bj();
        this.Cj();
        for (this.Dj(); 360 < this.pan.b; )
            this.pan.b -= 360;
        for (; -360 > this.pan.b; )
            this.pan.b += 360;
        this.zj(a);
        this.Aj(a);
        this.xk();
        0 < this.v.mode && this.Ej();
        this.gg();
        this.Ca && (0 < this.pe ? this.pe-- : (this.Ca = !1,
        this.pe = 0),
        this.S.ld || this.S.Dc || this.Zd());
        var b = this;
        setTimeout(function() {
            b.Pf()
        }, 1E3 / 60)
    }
    ;
    e.prototype.Xh = function() {
        var a = this;
        setTimeout(function() {
            a.hd(!1)
        }, 10);
        setTimeout(function() {
            a.hd(!1)
        }, 100)
    }
    ;
    e.prototype.gg = function() {
        this.sf.Cg(this.pan.b, this.j.b);
        for (var a = 0; a < this.P.length + this.J.length; a++)
            (a < this.P.length ? this.P[a] : this.J[a - this.P.length]).gg()
    }
    ;
    e.prototype.vg = function(a) {
        var b = "", c, d, f = 0, e, g = 0, k = 0;
        a = a.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        do
            c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(k++)),
            d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(k++)),
            e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(k++)),
            g = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(k++)),
            c = c << 2 | d >> 4,
            d = (d & 15) << 4 | e >> 2,
            f = (e & 3) << 6 | g,
            b += String.fromCharCode(c),
            64 != e && (b += String.fromCharCode(d)),
            64 != g && (b += String.fromCharCode(f));
        while (k < a.length);return b
    }
    ;
    e.prototype.$j = function(a, b) {
        var c, d, f = this;
        if (0 != f.Sd.length || !f.C.ze || f.C.ke)
            if (f.Ub)
                f.Ub = null,
                f.L.removeChild(f.Ub);
            else {
                f.Ub = document.createElement("div");
                var e = f.Ub;
                c = "left: " + a + "px;" + ("top:\t " + b + "px;");
                c += "z-index: 32000;";
                c += "position:relative;";
                c += "display: table;";
                c += "background-color: white;";
                c += "border: 1px solid lightgray;";
                c += "box-shadow: 1px 1px 3px #333;";
                c += "font-family: Verdana, Arial, Helvetica, sans-serif;";
                c += "font-size: 9pt;";
                c += "opacity : 0.95;";
                e.setAttribute("style", c);
                e.setAttribute("class", "gg_contextmenu");
                c = document.createElement("style");
                d = document.createTextNode(".gg_context_row:hover { background-color: #3399FF }");
                c.type = "text/css";
                c.styleSheet ? c.styleSheet.cssText = d.nodeValue : c.appendChild(d);
                e.appendChild(c);
                for (d = 0; d < f.Sd.length; d++) {
                    var g = f.Sd[d]
                      , k = document.createElement("div");
                    c = "text-align: left;";
                    c += "margin: 0;";
                    c += "padding: 5px 20px;";
                    c += "vertical-align: left;";
                    k.setAttribute("style", c);
                    k.setAttribute("class", "gg_context_row");
                    c = document.createElement("a");
                    c.href = g.url;
                    c.target = "_blank";
                    c.innerHTML = g.text;
                    c.setAttribute("style", "color: black; text-decoration: none;");
                    k.appendChild(c);
                    e.appendChild(k)
                }
                0 < f.Sd.length && (!f.C.ze || f.C.ke) && e.appendChild(document.createElement("hr"));
                f.C.ke && (d = document.createElement("div"),
                d.setAttribute("class", "gg_context_row"),
                c = "text-align: left;margin: 0;",
                c += "padding: 5px 20px;",
                c += "vertical-align: left;",
                c += "cursor: pointer;",
                d.setAttribute("style", c),
                d.onclick = function() {
                    f.cf()
                }
                ,
                d.innerHTML = f.Be() ? "Exit Fullscreen" : "Enter Fullscreen",
                e.appendChild(d));
                f.C.ze || (d = document.createElement("div"),
                c = "text-align: left;margin: 0;",
                c += "padding: 5px 20px;",
                c += "vertical-align: left;",
                d.setAttribute("style", c),
                d.setAttribute("class", "gg_context_row"),
                c = document.createElement("a"),
                c.href = f.vg("aHR0cDovL3Bhbm8ydnIuY29tLw=="),
                c.target = "_blank",
                c.innerHTML = f.vg("Q3JlYXRlZCB3aXRoIFBhbm8yVlI="),
                c.setAttribute("style", "color: black; text-decoration: none;"),
                d.appendChild(c),
                e.appendChild(d));
                f.L.insertBefore(f.Ub, f.L.firstChild);
                e.onclick = function() {
                    f.Ub && (f.L.removeChild(f.Ub),
                    f.Ub = null)
                }
                ;
                e.oncontextmenu = e.onclick
            }
    }
    ;
    e.prototype.ni = function() {
        var a = this, b;
        b = a.va;
        a.control = b;
        a.control = b;
        a.Xh();
        setTimeout(function() {
            a.Pf()
        }, 10);
        setTimeout(function() {
            a.wh()
        }, 200);
        setTimeout(function() {
            a.Qc();
            a.Zd()
        }, 10);
        b.addEventListener && (b.addEventListener("touchstart", function(b) {
            a.qk(b)
        }, !1),
        b.addEventListener("touchmove", function(b) {
            a.pk(b)
        }, !1),
        b.addEventListener("touchend", function(b) {
            a.nk(b)
        }, !1),
        b.addEventListener("touchcancel", function(b) {
            a.mk(b)
        }, !1),
        b.addEventListener("pointerdown", function(b) {
            a.th(b)
        }, !1),
        b.addEventListener("MSPointerDown", function(b) {
            a.th(b)
        }, !1),
        b.addEventListener("MSGestureStart", function(b) {
            a.Jg(b)
        }, !1),
        b.addEventListener("MSGestureEnd", function(b) {
            a.Ig(b)
        }, !1),
        b.addEventListener("MSGestureChange", function(b) {
            a.pj(b)
        }, !1),
        b.addEventListener("gesturestart", function(b) {
            a.Jg(b)
        }, !1),
        b.addEventListener("gesturechange", function(b) {
            a.Ei(b)
        }, !1),
        b.addEventListener("gestureend", function(b) {
            a.Ig(b)
        }, !1),
        b.addEventListener("mousedown", function(b) {
            a.nj(b)
        }, !1),
        b.addEventListener("mousemove", function(b) {
            a.mj(b)
        }, !1),
        document.addEventListener("mouseup", function(b) {
            a.lj(b)
        }, !1),
        b.addEventListener("mousewheel", function(b) {
            a.rh(b)
        }, !1),
        b.addEventListener("DOMMouseScroll", function(b) {
            a.rh(b)
        }, !1),
        document.addEventListener("keydown", function(b) {
            a.ij(b)
        }, !1),
        document.addEventListener("keyup", function(b) {
            a.jj(b)
        }, !1),
        window.addEventListener("orientationchange", function() {
            a.Xh()
        }, !1),
        window.addEventListener("resize", function() {
            a.Qc()
        }, !1),
        window.addEventListener("blur", function() {
            a.uj()
        }, !1),
        a.L.addEventListener("webkitfullscreenchange", function() {
            a.Je()
        }, !1),
        document.addEventListener("mozfullscreenchange", function() {
            a.Je()
        }, !1),
        window.addEventListener("webkitfullscreenchange", function() {
            a.Je()
        }, !1),
        document.addEventListener("MSFullscreenChange", function() {
            a.Je()
        }, !1));
        b.oncontextmenu = function(b) {
            void 0 === b && (b = window.event);
            if (b.target && !a.ic(b.target))
                return !0;
            if (!b.ctrlKey) {
                b = a.Cd(b);
                var d = a.Hc();
                a.$j(b.x - d.x, b.y - d.y);
                return !1
            }
            return !0
        }
    }
    ;
    e.prototype.jg = function() {
        for (var a = 0; a < this.I.length; a++)
            if ("point" == this.I[a].type && (this.xa && this.xa.addSkinHotspot ? (this.I[a].Vc(),
            this.I[a].c = new this.xa.addSkinHotspot(this.I[a])) : this.I[a].c = new M(this,this.I[a]),
            this.I[a].c.__div.style.left = "-1000px",
            this.I[a].c.__div.style.top = "-1000px",
            this.I[a].c && this.I[a].c.__div)) {
                var b = this.va.firstChild;
                b ? this.va.insertBefore(this.I[a].c.__div, b) : this.va.appendChild(this.I[a].c.__div)
            }
    }
    ;
    e.prototype.ei = function() {
        var a, b = document.createElement("fakeelement"), c = {
            OTransition: "oTransitionEnd",
            MSTransition: "msTransitionEnd",
            MozTransition: "transitionend",
            WebkitTransition: "webkitTransitionEnd",
            transition: "transitionEnd"
        };
        for (a in c)
            if (void 0 !== b.style[a])
                return c[a]
    }
    ;
    e.prototype.sc = function(a) {
        var b = [];
        a = new RegExp(a,"");
        for (var c = 0; c < this.P.length; c++)
            a.test(this.P[c].id) && b.push(this.P[c]);
        for (c = 0; c < this.J.length; c++)
            a.test(this.J[c].id) && b.push(this.J[c]);
        for (c = 0; c < this.Ua.length; c++)
            a.test(this.Ua[c].id) && b.push(this.Ua[c]);
        return b
    }
    ;
    e.prototype.xc = function(a) {
        if (this.Sa) {
            var b = this.Y;
            if (b)
                return b.isPlaying(a)
        } else {
            if ("_main" === a)
                return !0;
            a = this.sc(a);
            if (0 < a.length)
                return !a[0].c.ended && !a[0].c.paused
        }
        return !1
    }
    ;
    e.prototype.bd = function(a, b) {
        if (this.Sa) {
            var c = this.Y;
            c && c.playSound(a, b)
        } else
            try {
                for (var c = this.sc(a), d = 0; d < c.length; d++) {
                    var f = c[d];
                    f.rc = b && !isNaN(Number(b)) ? Number(b) - 1 : f.loop - 1;
                    -1 == f.rc && (f.rc = 1E7);
                    f.c.play()
                }
            } catch (e) {}
    }
    ;
    e.prototype.xh = function(a, b) {
        for (var c = this.sc(a), d = 0; d < c.length; d++) {
            var f = c[d];
            this.xc(f.id) ? this.Qf(f.id) : this.bd(f.id, b)
        }
    }
    ;
    e.prototype.Qf = function(a) {
        if (this.Sa) {
            var b = this.Y;
            b && b.pauseSound(a)
        } else
            try {
                if ("_main" == a) {
                    for (b = 0; b < this.P.length; b++)
                        this.P[b].c.pause();
                    for (b = 0; b < this.J.length; b++)
                        this.J[b].c.pause()
                } else
                    for (var c = this.sc(a), b = 0; b < c.length; b++)
                        c[b].c.pause()
            } catch (d) {}
    }
    ;
    e.prototype.ji = function(a, b) {
        for (var c = this.sc(a), d = 0; d < c.length; d++) {
            var f = c[d];
            0 == b || 1 == b ? f.Ed && f.Ed(1 == b) : 2 == b && f.Yb && f.Yb()
        }
    }
    ;
    e.prototype.hk = function(a) {
        var b;
        if (this.Sa)
            (b = this.Y) && b.stopSound(a);
        else
            try {
                if ("_main" === a) {
                    for (b = 0; b < this.P.length; b++)
                        this.P[b].c.pause(),
                        this.P[b].c.currentTime = 0;
                    for (b = 0; b < this.J.length; b++)
                        this.J[b].c.pause(),
                        this.J[b].c.currentTime = 0
                } else {
                    var c = this.sc(a);
                    for (b = 0; b < c.length; b++) {
                        var d = c[b];
                        d.c && d.c.pause && (d.c.pause(),
                        d.c.currentTime = 0)
                    }
                }
            } catch (f) {}
    }
    ;
    e.prototype.Yj = function(a, b) {
        if (this.Sa) {
            var c = this.Y;
            c && c.setVolume(a, b)
        } else
            try {
                var d = Number(b);
                1 < d && (d = 1);
                0 > d && (d = 0);
                "_video" === a && this.o.c && (this.o.c.volume = d);
                if ("_main" === a) {
                    this.ba = d;
                    for (c = 0; c < this.P.length; c++)
                        this.P[c].c.volume = this.P[c].level * this.ba;
                    for (c = 0; c < this.J.length; c++)
                        this.J[c].c.volume = this.J[c].level * this.ba;
                    this.o.c && (this.o.c.volume = this.ba)
                } else
                    for (var f = this.sc(a), c = 0; c < f.length; c++) {
                        var e = f[c];
                        e.c && e.c.volume && (e.level = d,
                        e.c.volume = d * this.ba)
                    }
            } catch (g) {}
    }
    ;
    e.prototype.wi = function(a, b) {
        if (this.Sa) {
            var c = this.Y;
            c && c.changeVolume(a, b)
        } else
            try {
                var d;
                "_video" === a && this.o.c && (this.o.c.volume = this.o.c.volume + Number(b));
                if ("_main" === a) {
                    c = this.ba;
                    c += Number(b);
                    1 < c && (c = 1);
                    0 > c && (c = 0);
                    this.ba = c;
                    for (d = 0; d < this.P.length; d++)
                        this.P[d].c.volume = this.P[d].level * this.ba;
                    for (d = 0; d < this.J.length; d++)
                        this.J[d].c.volume = this.J[d].level * this.ba;
                    this.o.c && (this.o.c.volume = this.ba)
                } else {
                    var f = this.sc(a);
                    for (d = 0; d < f.length; d++) {
                        var e = f[d]
                          , c = e.level
                          , c = c + Number(b);
                        1 < c && (c = 1);
                        0 > c && (c = 0);
                        e.level = c;
                        e.c.volume = c * this.ba
                    }
                }
            } catch (g) {}
    }
    ;
    e.prototype.Oh = function() {
        try {
            for (var a = this, b = !1, c = !1, d = 0; d < this.P.length; d++) {
                var f = this.P[d];
                -1 != f.loop && (this.lb && this.ra.enabled && 4 != f.mode && 6 != f.mode ? this.ra.sg ? (f.c.play(),
                f.c.currentTime = 0,
                f.aa = 0,
                c = !0) : b = !0 : 4 == f.mode || 6 == f.mode || "_background" == f.id && this.xc(f.id) || (f.c.play(),
                f.c.currentTime && (f.c.currentTime = 0)))
            }
            b && setTimeout(function() {
                a.ra.fk()
            }, 1E3 * this.ra.Ec);
            c && (this.ra.ck = this.lb.currentTime,
            this.ra.bk = setInterval(function() {
                a.ra.Ci()
            }, 10))
        } catch (e) {}
    }
    ;
    e.prototype.Bh = function() {
        for (var a; 0 < this.I.length; )
            a = this.I.pop(),
            a.c && (this.va.removeChild(a.c.__div),
            delete a.c),
            a.c = null
    }
    ;
    e.prototype.Zj = function() {
        this.L.style.zIndex = "auto";
        this.w.style.zIndex = "auto";
        this.Ea && this.Ea.ac && (this.Ea.ac.zIndex = (900).toString());
        this.va.style.zIndex = (1E3).toString();
        this.la.style.zIndex = (900).toString();
        this.na.style.zIndex = (1100).toString()
    }
    ;
    e.prototype.hd = function(a) {
        var b = this.isFullscreen !== a;
        this.isFullscreen !== a && (this.isFullscreen = a,
        this.update(100));
        if (this.isFullscreen) {
            if (this.ff)
                try {
                    this.L.webkitRequestFullScreen ? this.L.webkitRequestFullScreen() : this.L.mozRequestFullScreen ? this.L.mozRequestFullScreen() : this.L.msRequestFullscreen ? this.L.msRequestFullscreen() : this.L.requestFullScreen ? this.L.requestFullScreen() : this.L.requestFullscreen && this.L.requestFullscreen()
                } catch (c) {}
            this.L.style.position = "absolute";
            a = this.Hc();
            this.L.style.left = window.pageXOffset - a.x + this.margin.left + "px";
            this.L.style.top = window.pageYOffset - a.y + this.margin.top + "px";
            document.body.style.overflow = "hidden";
            b && this.D && this.D.ggEnterFullscreen && this.D.ggEnterFullscreen()
        } else {
            if (this.ff)
                try {
                    document.webkitIsFullScreen ? document.webkitCancelFullScreen() : document.mozFullScreen ? document.mozCancelFullScreen() : document.msExitFullscreen ? document.msExitFullscreen() : document.fullScreen && (document.cancelFullScreen ? document.cancelFullScreen() : document.exitFullscreen && document.exitFullscreen())
                } catch (c) {}
            this.L.style.position = "relative";
            this.L.style.left = "0px";
            this.L.style.top = "0px";
            document.body.style.overflow = "";
            b && this.D && this.D.ggExitFullscreen && this.D.ggExitFullscreen()
        }
        this.Qc()
    }
    ;
    e.prototype.cf = function() {
        this.hd(!this.isFullscreen)
    }
    ;
    e.prototype.Bi = function() {
        this.hd(!0)
    }
    ;
    e.prototype.exitFullscreen = function() {
        this.hd(!1)
    }
    ;
    e.prototype.Ki = function() {
        return this.isFullscreen
    }
    ;
    e.prototype.dk = function(a, b, c) {
        this.u.enabled = !0;
        this.u.active = !0;
        this.u.jc = 0;
        this.u.startTime = (new Date).getTime();
        a && 0 != a && (this.u.speed = a);
        b && (this.u.timeout = b);
        c && (this.u.af = c)
    }
    ;
    e.prototype.gk = function() {
        this.u.active = !1;
        this.u.enabled = !1
    }
    ;
    e.prototype.lk = function() {
        this.u.enabled = !this.u.active;
        this.u.active = this.u.enabled;
        this.u.jc = 0;
        this.u.enabled && (this.u.startTime = (new Date).getTime())
    }
    ;
    e.prototype.rg = function(a) {
        if (this.Tc = document.getElementById(a)) {
            this.Tc.innerHTML = "";
            this.L = document.createElement("div");
            a = "top:\t0px;left: 0px;position:relative;";
            a += "-ms-touch-action: none;";
            a += "touch-action: none;";
            a += "text-align: left;";
            a += this.ua + "user-select: none;";
            this.L.setAttribute("style", a);
            this.Tc.appendChild(this.L);
            this.w = document.createElement("div");
            a = "top:\t0px;left: 0px;";
            a += "width:  100px;";
            a += "height: 100px;";
            a += "overflow: hidden;";
            a += "position:absolute;";
            a += "-ms-touch-action: none;";
            a += "touch-action: none;";
            a += this.ua + "user-select: none;";
            this.w.setAttribute("style", a);
            this.L.appendChild(this.w);
            if (this.Sa) {
                var b = document.createElement("div");
                a = "top:\t0px;left: 0px;";
                a += "width:  100%;";
                a += "height: 100%;";
                a += "overflow: hidden;";
                a += "position:absolute;";
                a += "-ms-touch-action: none;";
                a += "touch-action: none;";
                a += this.ua + "user-select: none;";
                b.setAttribute("id", this.Af);
                b.setAttribute("style", a);
                this.w.appendChild(b)
            }
            this.Ea && (this.Ea.ac = document.createElement("canvas"),
            a = "top:\t0px;left: 0px;",
            a += "width:  100px;",
            a += "height: 100px;",
            a += "overflow: hidden;",
            a += "position:absolute;",
            a += this.ua + "user-select: none;",
            a += this.ua + "pointer-events: none;",
            this.Ea.ac.setAttribute("style", a),
            this.L.appendChild(this.Ea.ac));
            this.va = document.createElement("div");
            a = "top:\t0px;left: 0px;";
            a += "width:  100px;";
            a += "height: 100px;";
            a += "overflow: hidden;";
            a += "position:absolute;";
            this.bh && (a += "background-image: url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7);");
            this.Ic && !this.ka && (a += this.ua + "transform: translateZ(9999999px);");
            a += this.ua + "user-select: none;";
            this.va.setAttribute("style", a);
            this.L.appendChild(this.va);
            this.la = document.createElement("canvas");
            a = "top:\t0px;left: 0px;";
            a += "width:  100px;";
            a += "height: 100px;";
            a += "overflow: hidden;";
            a += "position:absolute;";
            a += this.ua + "user-select: none;";
            a += this.ua + "pointer-events: none;";
            this.la.setAttribute("style", a);
            this.L.appendChild(this.la);
            this.na = document.createElement("div");
            a = "top:\t0px;left: 0px;";
            a += "position:absolute;";
            a += "padding: 3px;";
            a += "visibility: hidden;";
            this.na.setAttribute("style", a);
            this.na.innerHTML = " Hotspot text!";
            this.L.appendChild(this.na);
            this.divSkin = this.D = this.va;
            this.Zj()
        } else
            alert("container not found!")
    }
    ;
    e.prototype.tg = function(a) {
        this.Ca = !0;
        return function() {
            a.da && (a.g && a.g.complete ? (a.loaded = !0,
            a.da.drawImage(a.g, 0, 0, a.width, a.height),
            a.g = null,
            a.Ac = null) : a.Ac && a.Ac.complete && !a.loaded && (a.da.drawImage(a.Ac, 0, 0, a.width, a.height),
            a.Ac = null))
        }
    }
    ;
    e.prototype.qg = function(a) {
        var b, c, d, f = 128;
        this.g.mc && (this.w.style.backgroundColor = this.g.mc.replace("0x", "#"));
        a ? (f = this.td,
        this.Wd = 1) : this.nc > f && (f = this.nc);
        for (d = 0; 6 > d; d++) {
            c = this.Pa.Ja[d];
            a ? (c.width = this.td,
            c.height = this.td) : (c.A = document.createElement("canvas"),
            c.A.width = this.nc,
            c.A.height = this.nc,
            c.width = this.nc,
            c.height = this.nc,
            c.da = c.A.getContext("2d"));
            b = "position:absolute;";
            b += "left: 0px;";
            b += "top: 0px;";
            b += "width: " + f + "px;";
            b += "height: " + f + "px;";
            a && (b += "outline: 1px solid transparent;");
            b += this.ua + "transform-origin: 0% 0%;";
            b += "-webkit-user-select: none;";
            b += this.ua + "transform: ";
            var e;
            e = "";
            var g = 1;
            this.fd && (g = 100);
            e = 4 > d ? e + ("rotateY(" + -90 * d + "deg)") : e + ("rotateX(" + (4 == d ? -90 : 90) + "deg)");
            this.fd && (e += " scale(" + g + ")");
            e += " translate3d(" + -f / 2 + "px," + -f / 2 + "px," + -f * g / (2 * this.Wd) + "px)";
            b += e + ";";
            c.Sg = e;
            a || (c.A.setAttribute("style", b),
            this.w.insertBefore(c.A, this.w.firstChild))
        }
        if (!a) {
            for (d = 0; 6 > d; d++)
                c = this.Pa.Ja[d],
                "" != this.Uc[d] && (c.Ac = new Image,
                c.Ac.onload = this.tg(c),
                c.Ac.setAttribute("src", this.ub(this.Uc[d])),
                this.bb.push(c.Ac));
            for (d = 0; 6 > d; d++)
                c = this.Pa.Ja[d],
                c.loaded = !1,
                c.g = new Image,
                c.g.onload = this.tg(c),
                c.g.setAttribute("src", this.ub(this.le[d])),
                this.bb.push(c.g)
        }
    }
    ;
    e.prototype.Ch = function() {
        var a;
        if (this.Hb) {
            for (a = 0; a < this.Pa.Ja.length; a++)
                this.Pa.Ja[a].A && this.Pa.Ja[a].A.setAttribute && (this.Pa.Ja[a].A.setAttribute("src", this.xg),
                this.w.removeChild(this.Pa.Ja[a].A));
            if (this.g.K) {
                for (a = 0; a < this.g.K.length; a++) {
                    var b = this.g.K[a], c;
                    for (c in b.$)
                        if (b.$.hasOwnProperty(c)) {
                            var d = b.$[c];
                            d.visible = !1;
                            d.A && (d.da && (d.da.clear ? d.da.clear() : d.da.clearRect(0, 0, d.da.canvas.width, d.da.canvas.height)),
                            this.df.push(d.A));
                            d.g && delete d.g;
                            d.Pb && this.a.deleteTexture(d.Pb);
                            d.da = null;
                            d.A = null;
                            d.g = null
                        }
                    delete b.$
                }
                delete this.g.K;
                this.g.K = null
            }
        }
        if (this.a && this.eb)
            for (; 0 < this.eb.length; )
                c = this.eb.pop(),
                c.sj = !0,
                this.a.deleteTexture(c);
        for (a = 0; a < this.J.length; a++)
            this.J[a].ed();
        for (a = 0; a < this.Ua.length; a++)
            this.Ua[a].ed();
        this.v.Md = -1;
        this.la.style.visibility = "hidden";
        this.rb = 0;
        c = [];
        this.ra.Yd = [];
        for (a = 0; a < this.P.length; a++)
            if (b = this.P[a],
            0 == b.mode || 1 == b.mode)
                c.push(b);
            else if (this.lb && this.ra.enabled && this.xc(b.id))
                this.ra.Yd.push(b),
                1 != this.S.Ba && 2 != this.S.Ba && this.ra.yf(b);
            else {
                try {
                    b.c.pause()
                } catch (f) {}
                b.ed()
            }
        this.P = c;
        this.J = [];
        this.Ua = [];
        this.o.c && (this.L.removeChild(this.o.c),
        this.o.c = null);
        this.o.Zc = !1;
        this.o.Ce = !1
    }
    ;
    e.prototype.Pg = function() {
        var a = 1
          , b = -1 != navigator.userAgent.indexOf("Mac");
        window.devicePixelRatio && b && (a = window.devicePixelRatio);
        return {
            gf: screen.width * a,
            ye: screen.height * a
        }
    }
    ;
    e.prototype.Mg = function() {
        var a = this.Pg();
        return a.gf > a.ye ? a.gf : a.ye
    }
    ;
    e.prototype.Uf = function(a, b) {
        var c = (new DOMParser).parseFromString(a, "text/xml");
        this.tf = a;
        this.Ah(c, b);
        this.Y && (this.Y.readConfigString(this.tf),
        this.Y.setLocked(!0),
        this.Y.setSlaveMode(!0))
    }
    ;
    e.prototype.zh = function(a, b, c) {
        try {
            var d;
            d = new XMLHttpRequest;
            d.open("GET", a, !1);
            d.send(null);
            if (d.responseXML) {
                var f = a.lastIndexOf("/");
                0 <= f && (this.oc = a.substr(0, f + 1));
                2 <= arguments.length && null != b && (this.oc = b);
                this.Uf(d.responseText, c)
            } else
                alert("Error loading panorama XML")
        } catch (e) {
            alert("Error:" + e)
        }
    }
    ;
    e.prototype.Fj = function(a, b, c, d) {
        var f;
        f = new XMLHttpRequest;
        var e = this;
        f.onload = function(g) {
            if (4 <= f.readyState)
                if (f.responseXML) {
                    var k = a.lastIndexOf("/");
                    0 <= k && (e.oc = a.substr(0, k + 1));
                    3 <= arguments.length && null != c && (e.oc = c);
                    e.Uf(f.responseText, d);
                    b && b()
                } else
                    alert("Error loading panorama XML");
            else
                console.error("Wrong state loading XML:" + f.statusText)
        }
        ;
        f.onerror = function() {
            console.error("Error loading XML:" + f.statusText)
        }
        ;
        f.open("GET", a, !0);
        f.send(null)
    }
    ;
    e.prototype.nf = function(a) {
        this.Rh("beforechangenode", {
            tj: this.currentNode,
            Mk: a
        });
        "" != this.currentNode && -1 == this.ig.indexOf(this.currentNode) && this.ig.push(this.currentNode);
        "{" == a.charAt(0) ? this.currentNode = a.substr(1, a.length - 2) : this.currentNode = "";
        this.xa && this.xa.changeActiveNode && this.xa.changeActiveNode(a);
        this.Rh("changenode", {
            tj: this.currentNode,
            Lk: a
        })
    }
    ;
    e.prototype.Kg = function() {
        return this.currentNode
    }
    ;
    e.prototype.Ng = function() {
        if (0 < this.sa.length) {
            var a;
            a = this.sa.indexOf(this.currentNode);
            a++;
            a >= this.sa.length && (a = 0);
            return this.sa[a]
        }
        return ""
    }
    ;
    e.prototype.Yi = function() {
        if (0 < this.sa.length) {
            var a;
            a = this.sa.indexOf(this.currentNode);
            a--;
            0 > a && (a = this.sa.length - 1);
            return this.sa[a]
        }
        return ""
    }
    ;
    e.prototype.rj = function(a) {
        return -1 != this.ig.indexOf(a)
    }
    ;
    e.prototype.Ah = function(a, b) {
        var c = a.firstChild;
        this.Oc = [];
        this.sa = [];
        if ("tour" == c.nodeName) {
            this.Kd = !0;
            var d = "", f;
            (f = c.getAttributeNode("start")) && (d = f.nodeValue.toString());
            this.hasOwnProperty("startNode") && this.startNode && (d = String(this.startNode),
            this.startNode = "");
            for (var c = c.firstChild, e = f = ""; c; )
                "panorama" == c.nodeName && (f = c.getAttributeNode("id")) && (f = f.nodeValue.toString(),
                "" == d && (d = f),
                "" == e && (e = f),
                this.Oc[f] = c,
                this.sa.push(f)),
                c = c.nextSibling;
            this.Oc.hasOwnProperty(d) || (this.$c("Start node " + d + " not found!"),
            d = e);
            this.Tf(this.Oc[d], b);
            this.nf("{" + d + "}")
        } else
            this.Kd = !1,
            this.Tf(c, b),
            this.nf(""),
            this.sa.push("")
    }
    ;
    e.prototype.Tf = function(a, b) {
        this.Bh();
        this.Ea && this.Ea.Hj();
        this.gd(this.Qa);
        this.Ch();
        this.Nd = 0;
        for (var c = a.firstChild, d, f, e, g = 0; c; ) {
            if ("view" == c.nodeName) {
                if (d = c.getAttributeNode("fovmode"))
                    this.f.mode = Number(d.nodeValue);
                d = c.getAttributeNode("pannorth");
                this.pan.Nf = 1 * (d ? d.nodeValue : 0);
                for (f = c.firstChild; f; )
                    "start" == f.nodeName && (d = f.getAttributeNode("pan"),
                    this.pan.b = Number(d ? d.nodeValue : 0),
                    this.pan.fb = this.pan.b,
                    d = f.getAttributeNode("tilt"),
                    this.j.b = Number(d ? d.nodeValue : 0),
                    this.j.fb = this.j.b,
                    d = f.getAttributeNode("roll"),
                    this.G.b = Number(d ? d.nodeValue : 0),
                    this.G.fb = this.G.b,
                    d = f.getAttributeNode("fov"),
                    this.f.b = Number(d ? d.nodeValue : 70),
                    this.f.fb = this.f.b),
                    "min" == f.nodeName && (d = f.getAttributeNode("pan"),
                    this.pan.min = 1 * (d ? d.nodeValue : 0),
                    d = f.getAttributeNode("tilt"),
                    this.j.min = 1 * (d ? d.nodeValue : -90),
                    d = f.getAttributeNode("fov"),
                    this.f.min = 1 * (d ? d.nodeValue : 5),
                    1E-20 > this.f.min && (this.f.min = 1E-20),
                    d = f.getAttributeNode("fovpixel"),
                    this.f.Td = 1 * (d ? d.nodeValue : 0)),
                    "max" == f.nodeName && (d = f.getAttributeNode("pan"),
                    this.pan.max = 1 * (d ? d.nodeValue : 0),
                    d = f.getAttributeNode("tilt"),
                    this.j.max = 1 * (d ? d.nodeValue : 90),
                    d = f.getAttributeNode("fov"),
                    this.f.max = 1 * (d ? d.nodeValue : 120),
                    180 <= this.f.max && (this.f.max = 179.9)),
                    f = f.nextSibling
            }
            if ("autorotate" == c.nodeName) {
                if (d = c.getAttributeNode("speed"))
                    this.u.speed = 1 * d.nodeValue;
                if (d = c.getAttributeNode("delay"))
                    this.u.timeout = 1 * d.nodeValue;
                if (d = c.getAttributeNode("returntohorizon"))
                    this.u.af = 1 * d.nodeValue;
                if (d = c.getAttributeNode("nodedelay"))
                    this.u.Ie = 1 * d.nodeValue;
                if (d = c.getAttributeNode("noderandom"))
                    this.u.Mf = 1 == d.nodeValue;
                this.re && (this.u.enabled = !0,
                this.u.active = !1);
                if (d = c.getAttributeNode("startloaded"))
                    this.u.Vd = 1 == d.nodeValue,
                    this.u.Vd && (this.u.active = !1);
                if (d = c.getAttributeNode("useanimation"))
                    this.u.ai = 1 == d.nodeValue
            }
            if ("animation" == c.nodeName)
                for (this.qc = [],
                f = c.firstChild; f; ) {
                    if ("clip" == f.nodeName) {
                        this.T = {};
                        (d = f.getAttributeNode("animtitle")) && (this.T.animtitle = d.nodeValue.toString());
                        (d = f.getAttributeNode("cliptitle")) && (this.T.cliptitle = d.nodeValue.toString());
                        (d = f.getAttributeNode("nodeid")) && (this.T.nodeid = d.nodeValue.toString());
                        (d = f.getAttributeNode("length")) && (this.T.length = Number(d.nodeValue));
                        (d = f.getAttributeNode("animtype")) && (this.T.animtype = Number(d.nodeValue));
                        (d = f.getAttributeNode("nextcliptitle")) && (this.T.nextcliptitle = d.nodeValue.toString());
                        (d = f.getAttributeNode("nextclipnodeid")) && (this.T.nextclipnodeid = d.nodeValue.toString());
                        (d = f.getAttributeNode("transitiontype")) && (this.T.transitiontype = Number(d.nodeValue));
                        var k = f.firstChild;
                        for (this.T.keyframes = []; k; ) {
                            if ("keyframe" == k.nodeName) {
                                var l = {};
                                (d = k.getAttributeNode("time")) && (l.time = Number(d.nodeValue));
                                (d = k.getAttributeNode("value")) && (l.value = Number(d.nodeValue));
                                d = k.getAttributeNode("type");
                                var p = 0;
                                d && (l.type = Number(d.nodeValue),
                                p = Number(d.nodeValue));
                                (d = k.getAttributeNode("property")) && (l.property = Number(d.nodeValue));
                                if (1 == p || 2 == p)
                                    (d = k.getAttributeNode("bezierintime")) && (l.bezierintime = Number(d.nodeValue)),
                                    (d = k.getAttributeNode("bezierinvalue")) && (l.bezierinvalue = Number(d.nodeValue)),
                                    (d = k.getAttributeNode("bezierouttime")) && (l.bezierouttime = Number(d.nodeValue)),
                                    (d = k.getAttributeNode("bezieroutvalue")) && (l.bezieroutvalue = Number(d.nodeValue));
                                this.T.keyframes.push(l)
                            }
                            k = k.nextSibling
                        }
                        this.lc == this.T.cliptitle && (d = this.T.keyframes,
                        this.Zf(d[0].value, d[1].value, d[2].value));
                        this.qc.push(this.T)
                    }
                    f = f.nextSibling
                }
            "input" == c.nodeName && (e || (e = c));
            if (e)
                for (f = 0; 6 > f; f++)
                    d = e.getAttributeNode("prev" + f + "url"),
                    this.Uc[f] = d ? String(d.nodeValue) : "";
            "altinput" == c.nodeName && (f = 0,
            (d = c.getAttributeNode("screensize")) && (f = 1 * d.nodeValue),
            0 < f && f <= this.Mg() && f > g && (g = f,
            e = c));
            if ("control" == c.nodeName && this.re) {
                if (d = c.getAttributeNode("simulatemass"))
                    this.B.enabled = 1 == d.nodeValue;
                if (d = c.getAttributeNode("locked"))
                    this.C.Wa = 1 == d.nodeValue;
                d && (this.C.Pd = 1 == d.nodeValue);
                if (d = c.getAttributeNode("lockedmouse"))
                    this.C.Wa = 1 == d.nodeValue;
                if (d = c.getAttributeNode("lockedkeyboard"))
                    this.C.Pd = 1 == d.nodeValue;
                if (d = c.getAttributeNode("lockedkeyboardzoom"))
                    this.C.Kf = 1 == d.nodeValue;
                if (d = c.getAttributeNode("lockedwheel"))
                    this.C.Lf = 1 == d.nodeValue;
                if (d = c.getAttributeNode("invertwheel"))
                    this.C.Zg = 1 == d.nodeValue;
                if (d = c.getAttributeNode("speedwheel"))
                    this.C.Mh = 1 * d.nodeValue;
                if (d = c.getAttributeNode("invertcontrol"))
                    this.C.wc = 1 == d.nodeValue;
                if (d = c.getAttributeNode("sensitivity"))
                    this.C.sensitivity = 1 * d.nodeValue,
                    1 > this.C.sensitivity && (this.C.sensitivity = 1);
                if (d = c.getAttributeNode("dblclickfullscreen"))
                    this.C.vf = 1 == d.nodeValue;
                if (d = c.getAttributeNode("contextfullscreen"))
                    this.C.ke = 1 == d.nodeValue;
                if (d = c.getAttributeNode("hideabout"))
                    this.C.ze = 1 == d.nodeValue;
                for (f = c.firstChild; f; )
                    "menulink" == f.nodeName && (k = {
                        text: "",
                        url: ""
                    },
                    d = f.getAttributeNode("text"),
                    k.text = d.nodeValue,
                    d = f.getAttributeNode("url"),
                    k.url = d.nodeValue,
                    this.Sd.push(k)),
                    f = f.nextSibling
            }
            if ("transition" == c.nodeName) {
                if (d = c.getAttributeNode("enabled"))
                    this.S.enabled = 1 == d.nodeValue;
                if (d = c.getAttributeNode("blendtime"))
                    this.S.mg = d.nodeValue;
                if (d = c.getAttributeNode("blendcolor"))
                    this.S.he = d.nodeValue.toString();
                if (d = c.getAttributeNode("type"))
                    this.S.type = d.nodeValue.toString();
                if (d = c.getAttributeNode("softedge"))
                    this.S.Zb = 1 * d.nodeValue;
                if (d = c.getAttributeNode("zoomin"))
                    this.S.Ba = d.nodeValue;
                if (d = c.getAttributeNode("zoomout"))
                    this.S.Kb = d.nodeValue;
                if (d = c.getAttributeNode("zoomfov"))
                    this.S.jf = d.nodeValue;
                if (d = c.getAttributeNode("zoomspeed"))
                    this.S.fe = d.nodeValue;
                if (d = c.getAttributeNode("zoomoutpause"))
                    this.S.kf = 1 == d.nodeValue
            }
            if ("soundstransition" == c.nodeName) {
                if (d = c.getAttributeNode("enabled"))
                    this.ra.enabled = 1 == d.nodeValue;
                if (d = c.getAttributeNode("transitiontime"))
                    this.ra.Ec = 1 * d.nodeValue;
                if (d = c.getAttributeNode("crossfade"))
                    this.ra.sg = 1 == d.nodeValue
            }
            "userdata" == c.nodeName && (this.userdata = this.od = this.qe(c));
            if ("hotspots" == c.nodeName)
                for (f = c.firstChild; f; ) {
                    if ("label" == f.nodeName) {
                        k = this.v.dg;
                        if (d = f.getAttributeNode("enabled"))
                            k.enabled = 1 == d.nodeValue;
                        if (d = f.getAttributeNode("width"))
                            k.width = 1 * d.nodeValue;
                        if (d = f.getAttributeNode("height"))
                            k.height = 1 * d.nodeValue;
                        if (d = f.getAttributeNode("textcolor"))
                            k.eg = 1 * d.nodeValue;
                        if (d = f.getAttributeNode("textalpha"))
                            k.cg = 1 * d.nodeValue;
                        if (d = f.getAttributeNode("background"))
                            k.background = 1 == d.nodeValue;
                        if (d = f.getAttributeNode("backgroundalpha"))
                            k.Mb = 1 * d.nodeValue;
                        if (d = f.getAttributeNode("backgroundcolor"))
                            k.mb = 1 * d.nodeValue;
                        if (d = f.getAttributeNode("border"))
                            k.mf = 1 * d.nodeValue;
                        if (d = f.getAttributeNode("bordercolor"))
                            k.ob = 1 * d.nodeValue;
                        if (d = f.getAttributeNode("borderalpha"))
                            k.Nb = 1 * d.nodeValue;
                        if (d = f.getAttributeNode("borderradius"))
                            k.lf = 1 * d.nodeValue;
                        if (d = f.getAttributeNode("wordwrap"))
                            k.hf = 1 == d.nodeValue
                    }
                    if ("polystyle" == f.nodeName) {
                        if (d = f.getAttributeNode("mode"))
                            this.v.mode = 1 * d.nodeValue;
                        if (d = f.getAttributeNode("bordercolor"))
                            this.v.ob = 1 * d.nodeValue;
                        if (d = f.getAttributeNode("backgroundcolor"))
                            this.v.mb = 1 * d.nodeValue;
                        if (d = f.getAttributeNode("borderalpha"))
                            this.v.Nb = 1 * d.nodeValue;
                        if (d = f.getAttributeNode("backgroundalpha"))
                            this.v.Mb = 1 * d.nodeValue;
                        if (d = f.getAttributeNode("handcursor"))
                            this.v.Xc = 1 == d.nodeValue
                    }
                    d = void 0;
                    "hotspot" == f.nodeName && (d = new Y(this),
                    d.type = "point",
                    d.Za(f),
                    this.I.push(d));
                    "polyhotspot" == f.nodeName && (d = new Y(this),
                    d.type = "poly",
                    d.Za(f),
                    this.I.push(d));
                    f = f.nextSibling
                }
            if ("sounds" == c.nodeName || "media" == c.nodeName)
                for (f = c.firstChild; f; )
                    "sound" != f.nodeName || this.uh || (d = new U(this),
                    d.Za(f),
                    this.Sa || d.addElement()),
                    "video" == f.nodeName && (d = new V(this),
                    d.Za(f),
                    this.Sa || d.addElement()),
                    "image" == f.nodeName && (d = new W(this),
                    d.Za(f),
                    this.Sa || d.addElement()),
                    "lensflare" == f.nodeName && this.Ea && (d = new X(this),
                    d.Za(f),
                    this.Ea.Od.push(d)),
                    f = f.nextSibling;
            c = c.nextSibling
        }
        b && "" != b && (c = b.toString().split("/"),
        0 < c.length && (d = String(c[0]),
        "N" == d.charAt(0) ? this.Yf(Number(d.substr(1))) : "S" == d.charAt(0) ? this.Yf(-180 + Number(d.substr(1))) : this.Xf(Number(d))),
        1 < c.length && this.$f(Number(c[1])),
        2 < c.length && this.Re(Number(c[2])));
        if (e) {
            for (f = 0; 6 > f; f++)
                (d = e.getAttributeNode("tile" + f + "url")) && (this.le[f] = String(d.nodeValue)),
                d = e.getAttributeNode("tile" + f + "url1");
            for (f = 0; 6 > f; f++)
                (d = e.getAttributeNode("prev" + f + "url")) && (this.Uc[f] = String(d.nodeValue));
            if (d = e.getAttributeNode("tilesize"))
                this.nc = 1 * d.nodeValue;
            if (d = e.getAttributeNode("canvassize"))
                this.td = Number(d.nodeValue);
            if (d = e.getAttributeNode("tilescale"))
                this.Wd = 1 * d.nodeValue;
            if (d = e.getAttributeNode("leveltileurl"))
                this.g.oh = d.nodeValue;
            if (d = e.getAttributeNode("leveltilesize"))
                this.g.Z = Number(d.nodeValue);
            if (d = e.getAttributeNode("levelbias"))
                this.g.mh = Number(d.nodeValue);
            if (d = e.getAttributeNode("levelbiashidpi"))
                this.g.nh = Number(d.nodeValue);
            d = e.getAttributeNode("overlap");
            this.oa.G = 0;
            this.oa.pitch = 0;
            d && (this.g.Va = Number(d.nodeValue));
            if (d = e.getAttributeNode("levelingroll"))
                this.oa.G = Number(d.nodeValue);
            if (d = e.getAttributeNode("levelingpitch"))
                this.oa.pitch = Number(d.nodeValue);
            this.rb = 0;
            (d = e.getAttributeNode("flat")) && 1 == d.nodeValue && (this.rb = 2);
            d = e.getAttributeNode("width");
            this.g.width = 1 * (d ? d.nodeValue : 1);
            d = e.getAttributeNode("height");
            this.g.height = 1 * (d ? d.nodeValue : this.g.width);
            this.o.src = [];
            this.g.K = [];
            for (f = e.firstChild; f; ) {
                if ("preview" == f.nodeName) {
                    if (d = f.getAttributeNode("color"))
                        this.g.mc = d.nodeValue;
                    if (d = f.getAttributeNode("strip"))
                        this.g.yh = 1 == d.nodeValue
                }
                if ("video" == f.nodeName) {
                    if (d = f.getAttributeNode("format"))
                        this.o.format = d.nodeValue.toString();
                    if (d = f.getAttributeNode("bleed"))
                        this.o.ge = Number(d.nodeValue);
                    if (d = f.getAttributeNode("endaction"))
                        this.o.Fc = String(d.nodeValue);
                    if (d = f.getAttributeNode("width"))
                        this.o.width = Number(d.nodeValue);
                    if (d = f.getAttributeNode("height"))
                        this.o.height = Number(d.nodeValue);
                    for (e = f.firstChild; e; )
                        "source" == e.nodeName && (d = e.getAttributeNode("url")) && this.o.src.push(d.nodeValue.toString()),
                        e = e.nextSibling
                }
                if ("level" == f.nodeName) {
                    e = {
                        width: 0,
                        height: 0,
                        cache: !1,
                        Sf: !1,
                        Ma: 0,
                        Fb: 0,
                        $: []
                    };
                    d = f.getAttributeNode("width");
                    e.width = 1 * (d ? d.nodeValue : 1);
                    d = f.getAttributeNode("height");
                    e.height = 1 * (d ? d.nodeValue : e.width);
                    if (d = f.getAttributeNode("preload"))
                        e.cache = 1 == d.nodeValue;
                    if (d = f.getAttributeNode("preview"))
                        e.Sf = 1 == d.nodeValue;
                    e.Ma = Math.floor((e.width + this.g.Z - 1) / this.g.Z);
                    e.Fb = Math.floor((e.height + this.g.Z - 1) / this.g.Z);
                    this.g.K.push(e)
                }
                f = f.nextSibling
            }
            this.g.kh = this.g.K.length
        }
        this.$d && (this.ka = this.Hb = !1,
        this.pb || (this.pb = document.createElement("canvas"),
        this.pb.width = 100,
        this.pb.height = 100,
        this.pb.id = "dummycanvas",
        this.w.appendChild(this.pb)),
        this.Rc());
        this.ka && this.a && (this.Xg(this.Wd),
        this.Yg());
        this.Hb && (0 < this.g.K.length ? this.qg(!0) : this.qg(!1),
        this.Nd = 0);
        var n = this;
        0 < this.g.K.length && this.g.yh && 0 == this.rb && (e = new Image,
        e.onload = this.qj(e),
        e.setAttribute("src", this.$e(6, this.g.K.length - 1, 0, 0)));
        if (0 < this.o.src.length)
            if (this.If)
                "{" == this.o.Fc.charAt(0) && n.Lc(n.o.Fc, "$fwd");
            else {
                this.o.c = document.createElement("video");
                this.o.c.setAttribute("style", "display:none; max-width:none;");
                this.o.c.ii = !0;
                this.o.c.volume = this.ba;
                this.L.appendChild(this.o.c);
                this.o.Zc = !1;
                this.o.c.oncanplay = function() {
                    if (!n.o.Zc) {
                        n.o.Ce = !0;
                        var a, b, c, d, e, f, g = [], k = new y, l = n.a, p = n.o.c.videoWidth / 3;
                        for (a = 0; 6 > a; a++)
                            for (c = a % 3 * p + n.o.ge,
                            e = c + p - 2 * n.o.ge,
                            d = 4,
                            3 <= a && (d += p),
                            f = d + p - 2 * n.o.ge,
                            b = 0; 4 > b; b++) {
                                k.x = -1;
                                k.y = -1;
                                k.z = 1;
                                for (var t = 0; t < b; t++)
                                    k.Gh();
                                g.push((0 < k.x ? c : e) / (3 * p), (0 < k.y ? d : f) / (2 * p))
                            }
                        l.bindBuffer(l.ARRAY_BUFFER, n.o.Xe);
                        l.bufferData(l.ARRAY_BUFFER, new Float32Array(g), l.STATIC_DRAW)
                    }
                }
                ;
                "exit" == this.o.Fc ? this.o.c.onended = function() {
                    n.o.Ce = !1;
                    n.o.Zc = !1;
                    n.L.removeChild(this.o.c);
                    n.o.c = null
                }
                : "stop" == this.o.Fc ? n.o.c.onended = function() {}
                : "{" == this.o.Fc.charAt(0) ? this.o.c.onended = function() {
                    n.Lc(n.o.Fc, "$fwd")
                }
                : this.o.c.loop = !0;
                for (e = 0; e < this.o.src.length; e++)
                    c = document.createElement("source"),
                    c.setAttribute("src", this.ub(this.o.src[e])),
                    this.o.c.appendChild(c);
                this.o.c.play()
            }
        this.jg();
        this.S.Dc || this.Oh();
        this.update();
        this.re && this.D && this.D.ggViewerInit && this.D.ggViewerInit();
        this.re = !1;
        this.Id = !0;
        this.Rc()
    }
    ;
    e.prototype.Of = function(a, b) {
        0 < a.length && (".xml" == a.substr(a.length - 4) || ".swf" == a.substr(a.length - 4) || "{" == a.charAt(0) ? this.Lc(this.ub(a), b) : window.open(this.ub(a), b))
    }
    ;
    e.prototype.ek = function() {
        this.Id = this.isLoaded = !1;
        this.checkLoaded = this.bb = [];
        this.Ke = 0;
        this.D && this.D.ggReLoaded && this.D.ggReLoaded()
    }
    ;
    e.prototype.Lc = function(a, b) {
        this.ek();
        this.xa && this.xa.hotspotProxyOut && this.xa.hotspotProxyOut(this.ma.id);
        ".swf" == a.substr(a.length - 4) && (a = a.substr(0, a.length - 4) + ".xml");
        var c = "";
        b && (c = b.toString());
        c = c.replace("$cur", this.pan.b + "/" + this.j.b + "/" + this.f.b);
        c = c.replace("$fwd", "N" + this.ve() + "/" + this.j.b + "/" + this.f.b);
        c = c.replace("$bwd", "S" + this.ve() + "/" + this.j.b + "/" + this.f.b);
        c = c.replace("$ap", String(this.pan.b));
        c = c.replace("$an", String(this.ve()));
        c = c.replace("$at", String(this.j.b));
        c = c.replace("$af", String(this.f.b));
        if ("" != c) {
            var d = c.split("/");
            3 < d.length && "" != d[3] && (this.startNode = d[3])
        }
        this.ia();
        if ("{" == a.charAt(0)) {
            var d = a.substr(1, a.length - 2)
              , e = this.S
              , t = this.a;
            if (this.Oc[d]) {
                if (0 == this.rb && this.S.enabled && this.ka && this.S.kb) {
                    e.ld || e.Dc || (e.sh = this.C.Wa,
                    e.fh = this.C.Pd,
                    this.Te(!0),
                    this.Se(!0));
                    var g;
                    "wipeleftright" == e.type ? g = 1 : "wiperightleft" == e.type ? g = 2 : "wipetopbottom" == e.type ? g = 3 : "wipebottomtop" == e.type ? g = 4 : "wiperandom" == e.type && (g = Math.ceil(4 * Math.random()));
                    e.uf = g;
                    t.bindFramebuffer(t.FRAMEBUFFER, e.kb);
                    t.viewport(0, 0, e.kb.width, e.kb.height);
                    t.clear(t.COLOR_BUFFER_BIT | t.DEPTH_BUFFER_BIT);
                    e.Xd = !0;
                    this.Zd();
                    e.Xd = !1;
                    t.bindFramebuffer(t.FRAMEBUFFER, null);
                    t.viewport(0, 0, this.Ta.width, this.Ta.height);
                    g = new Date;
                    this.ma != this.Qa ? (e.de = this.ma.sb / this.l.width,
                    e.ee = 1 - this.ma.Ya / this.l.height) : (e.de = .5,
                    e.ee = .5);
                    1 != e.Ba && 2 != e.Ba ? (e.bg = g.getTime(),
                    e.ld = !0) : (e.gi = g.getTime(),
                    e.Dc = !0,
                    e.Na = Math.sin(this.Wb() / 2 * Math.PI / 180) / Math.sin(e.jf / 2 * Math.PI / 180),
                    e.Na = Math.max(e.Na, 1),
                    e.fi = 1 / e.fe * e.Na * .3)
                }
                this.Tf(this.Oc[d], c);
                this.nf(a);
                e.enabled && this.ka && (1 == e.Kb || 2 == e.Kb || 3 == e.Kb) && (e.Ve = this.ue(),
                e.We = this.we(),
                e.jd = this.Wb(),
                1 == e.Kb || 3 == e.Kb ? this.Ue(e.jf) : this.Ue(this.Bd() + (this.Bd() - e.jf)),
                e.kf || 1 == e.Ba || 2 == e.Ba || this.moveTo(e.Ve, e.We, e.jd, e.fe));
                this.Y && this.Y.openNext(a, c)
            } else {
                this.$c("invalid node id: " + d);
                return
            }
        } else
            this.zh(a, null, c);
        this.update(5)
    }
    ;
    e.prototype.Pi = function() {
        return this.Kd ? this.sa.slice(0) : [""]
    }
    ;
    e.prototype.qe = function(a) {
        var b, c;
        c = [];
        c.title = "";
        c.description = "";
        c.author = "";
        c.datetime = "";
        c.copyright = "";
        c.source = "";
        c.information = "";
        c.comment = "";
        c.latitude = 0;
        c.longitude = 0;
        c.tags = [];
        if (a && ((b = a.getAttributeNode("title")) && (c.title = b.nodeValue.toString()),
        (b = a.getAttributeNode("description")) && (c.description = b.nodeValue.toString()),
        (b = a.getAttributeNode("author")) && (c.author = b.nodeValue.toString()),
        (b = a.getAttributeNode("datetime")) && (c.datetime = b.nodeValue.toString()),
        (b = a.getAttributeNode("copyright")) && (c.copyright = b.nodeValue.toString()),
        (b = a.getAttributeNode("source")) && (c.source = b.nodeValue.toString()),
        (b = a.getAttributeNode("info")) && (c.information = b.nodeValue.toString()),
        (b = a.getAttributeNode("comment")) && (c.comment = b.nodeValue.toString()),
        (b = a.getAttributeNode("latitude")) && (c.latitude = Number(b.nodeValue)),
        (b = a.getAttributeNode("longitude")) && (c.longitude = Number(b.nodeValue)),
        b = a.getAttributeNode("tags"))) {
            a = b.nodeValue.toString().split("|");
            for (b = 0; b < a.length; b++)
                "" == a[b] && (a.splice(b, 1),
                b--);
            c.tags = a
        }
        return c
    }
    ;
    e.prototype.Cf = function(a) {
        if (!a)
            return this.od;
        if (a = this.Oc[a])
            for (a = a.firstChild; a; ) {
                if ("userdata" == a.nodeName)
                    return this.qe(a);
                a = a.nextSibling
            }
        return this.qe()
    }
    ;
    e.prototype.Qi = function(a) {
        a = this.Cf(a);
        var b = [];
        "" != a.latitude && 0 != a.latitude && 0 != a.longitude && (b.push(a.latitude),
        b.push(a.longitude));
        return b
    }
    ;
    e.prototype.Ri = function(a) {
        return this.Cf(a).title
    }
    ;
    e.prototype.Lg = function(a, b) {
        var c;
        for (c = 0; c < this.T.keyframes.length; c++)
            if (this.T.keyframes[c].time == a && this.T.keyframes[c].property == b)
                return this.T.keyframes[c];
        return !1
    }
    ;
    e.prototype.Oi = function(a) {
        var b, c = 1E5, d = a, e = !1;
        for (b = 0; b < this.T.keyframes.length; b++)
            this.T.keyframes[b].property == a.property && this.T.keyframes[b].time > a.time && this.T.keyframes[b].time < c && (d = this.T.keyframes[b],
            c = d.time,
            e = !0);
        return e ? d : !1
    }
    ;
    e.prototype.Fk = function() {
        this.o.c && this.o.c.play()
    }
    ;
    e.prototype.Gk = function() {
        this.o.c && (this.o.c.pause(),
        this.o.c.time = 0)
    }
    ;
    e.prototype.Ek = function() {
        this.o.c && this.o.c.pause()
    }
    ;
    e.prototype.Xj = function(a) {
        this.o.c && (0 > a && (a = 0),
        a > this.o.c.duration && (a = this.o.c.duration - .1),
        this.o.c.currentTime = a,
        this.update())
    }
    ;
    e.prototype.cj = function() {
        return this.o.c ? this.o.c.currentTime : 0
    }
    ;
    e.prototype.bj = function() {
        if (this.o.c)
            return this.o.c
    }
    ;
    e.prototype.Ai = function() {
        this.uh = !0
    }
    ;
    return e
}();
window.pano2vrPlayer = Z;
Z.prototype.readConfigString = Z.prototype.Uf;
Z.prototype.readConfigUrl = Z.prototype.zh;
Z.prototype.readConfigUrlAsync = Z.prototype.Fj;
Z.prototype.readConfigXml = Z.prototype.Ah;
Z.prototype.openUrl = Z.prototype.Of;
Z.prototype.openNext = Z.prototype.Lc;
Z.prototype.setMargins = Z.prototype.Sj;
Z.prototype.addListener = Z.prototype.addListener;
Z.prototype.removeEventListener = Z.prototype.removeEventListener;
Z.prototype.detectBrowser = Z.prototype.wg;
Z.prototype.initWebGL = Z.prototype.vc;
Z.prototype.getPercentLoaded = Z.prototype.Ui;
Z.prototype.setBasePath = Z.prototype.Nj;
Z.prototype.getBasePath = Z.prototype.Fi;
Z.prototype.setViewerSize = Z.prototype.Kh;
Z.prototype.getViewerSize = Z.prototype.fj;
Z.prototype.setSkinObject = Z.prototype.Wj;
Z.prototype.changeViewMode = Z.prototype.ui;
Z.prototype.getViewMode = Z.prototype.dj;
Z.prototype.changePolygonMode = Z.prototype.pg;
Z.prototype.setPolygonMode = Z.prototype.pg;
Z.prototype.getPolygonMode = Z.prototype.Wi;
Z.prototype.changeViewState = Z.prototype.vi;
Z.prototype.getViewState = Z.prototype.ej;
Z.prototype.setRenderFlags = Z.prototype.Uj;
Z.prototype.getRenderFlags = Z.prototype.Zi;
Z.prototype.setMaxTileCount = Z.prototype.Jh;
Z.prototype.getVFov = Z.prototype.Wb;
Z.prototype.setVFov = Z.prototype.Ue;
Z.prototype.updatePanorama = Z.prototype.Zd;
Z.prototype.isTouching = Z.prototype.hj;
Z.prototype.getIsMobile = Z.prototype.Li;
Z.prototype.setIsMobile = Z.prototype.Qj;
Z.prototype.getIsAutorotating = Z.prototype.Ji;
Z.prototype.getIsTileLoading = Z.prototype.Mi;
Z.prototype.getLastActivity = Z.prototype.Ni;
Z.prototype.getPan = Z.prototype.ue;
Z.prototype.getPanNorth = Z.prototype.ve;
Z.prototype.getPanDest = Z.prototype.Si;
Z.prototype.getPanN = Z.prototype.Ti;
Z.prototype.setPan = Z.prototype.Xf;
Z.prototype.setPanNorth = Z.prototype.Yf;
Z.prototype.changePan = Z.prototype.ie;
Z.prototype.changePanLog = Z.prototype.si;
Z.prototype.getTilt = Z.prototype.we;
Z.prototype.getTiltDest = Z.prototype.aj;
Z.prototype.setTilt = Z.prototype.$f;
Z.prototype.changeTilt = Z.prototype.je;
Z.prototype.changeTiltLog = Z.prototype.ti;
Z.prototype.getFov = Z.prototype.Bd;
Z.prototype.getFovDest = Z.prototype.Hi;
Z.prototype.setFov = Z.prototype.Re;
Z.prototype.changeFov = Z.prototype.og;
Z.prototype.changeFovLog = Z.prototype.ud;
Z.prototype.getRoll = Z.prototype.$i;
Z.prototype.setRoll = Z.prototype.Vj;
Z.prototype.setPanTilt = Z.prototype.Tj;
Z.prototype.setPanTiltFov = Z.prototype.Zf;
Z.prototype.setDefaultView = Z.prototype.Oj;
Z.prototype.setLocked = Z.prototype.Rj;
Z.prototype.setLockedMouse = Z.prototype.Te;
Z.prototype.setLockedKeyboard = Z.prototype.Se;
Z.prototype.setLockedWheel = Z.prototype.Ih;
Z.prototype.moveTo = Z.prototype.moveTo;
Z.prototype.moveToDefaultView = Z.prototype.oj;
Z.prototype.addHotspotElements = Z.prototype.jg;
Z.prototype.playSound = Z.prototype.bd;
Z.prototype.playPauseSound = Z.prototype.xh;
Z.prototype.pauseSound = Z.prototype.Qf;
Z.prototype.activateSound = Z.prototype.ji;
Z.prototype.isPlaying = Z.prototype.xc;
Z.prototype.stopSound = Z.prototype.hk;
Z.prototype.setVolume = Z.prototype.Yj;
Z.prototype.changeVolume = Z.prototype.wi;
Z.prototype.removeHotspots = Z.prototype.Bh;
Z.prototype.addHotspot = Z.prototype.ki;
Z.prototype.updateHotspot = Z.prototype.tk;
Z.prototype.removeHotspot = Z.prototype.Gj;
Z.prototype.setActiveHotspot = Z.prototype.gd;
Z.prototype.getPointHotspotIds = Z.prototype.Vi;
Z.prototype.getHotspot = Z.prototype.Ii;
Z.prototype.setFullscreen = Z.prototype.hd;
Z.prototype.toggleFullscreen = Z.prototype.cf;
Z.prototype.enterFullscreen = Z.prototype.Bi;
Z.prototype.exitFullscreen = Z.prototype.exitFullscreen;
Z.prototype.getIsFullscreen = Z.prototype.Ki;
Z.prototype.startAutorotate = Z.prototype.dk;
Z.prototype.stopAutorotate = Z.prototype.gk;
Z.prototype.toggleAutorotate = Z.prototype.lk;
Z.prototype.createLayers = Z.prototype.rg;
Z.prototype.removePanorama = Z.prototype.Ch;
Z.prototype.getScreenResolution = Z.prototype.Pg;
Z.prototype.getMaxScreenResolution = Z.prototype.Mg;
Z.prototype.getNodeIds = Z.prototype.Pi;
Z.prototype.getNodeUserdata = Z.prototype.Cf;
Z.prototype.getNodeLatLng = Z.prototype.Qi;
Z.prototype.getNodeTitle = Z.prototype.Ri;
Z.prototype.getCurrentNode = Z.prototype.Kg;
Z.prototype.getNextNode = Z.prototype.Ng;
Z.prototype.getPrevNode = Z.prototype.Yi;
Z.prototype.getCurrentPointHotspots = Z.prototype.Gi;
Z.prototype.getPositionAngles = Z.prototype.Xi;
Z.prototype.getPositionRawAngles = Z.prototype.Og;
Z.prototype.nodeVisited = Z.prototype.rj;
Z.prototype.setElementIdPrefix = Z.prototype.Pj;
Z.prototype.videoPanoPlay = Z.prototype.Fk;
Z.prototype.videoPanoStop = Z.prototype.Gk;
Z.prototype.videoPanoPause = Z.prototype.Ek;
Z.prototype.getVideoPanoTime = Z.prototype.cj;
Z.prototype.setVideoPanoTime = Z.prototype.Xj;
Z.prototype.getVideoPanoObject = Z.prototype.bj;
Z.prototype.disableSoundLoading = Z.prototype.Ai;
