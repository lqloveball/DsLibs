/*!
 * pixi-filters - v2.0.0
 * Compiled Wed, 02 Aug 2017 13:37:27 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.__pixi_filters = {})));
}(this, (function (exports) { 'use strict';

if (typeof PIXI.Filter === 'undefined') { throw 'PixiJS is required'; }

/*!
 * @pixi/filter-ascii - v2.0.0
 * Compiled Wed, 02 Aug 2017 13:37:06 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment="varying vec2 vTextureCoord;\n\nuniform vec4 filterArea;\nuniform float pixelSize;\nuniform sampler2D uSampler;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 pixelate(vec2 coord, vec2 size)\n{\n    return floor( coord / size ) * size;\n}\n\nvec2 getMod(vec2 coord, vec2 size)\n{\n    return mod( coord , size) / size;\n}\n\nfloat character(float n, vec2 p)\n{\n    p = floor(p*vec2(4.0, -4.0) + 2.5);\n    if (clamp(p.x, 0.0, 4.0) == p.x && clamp(p.y, 0.0, 4.0) == p.y)\n    {\n        if (int(mod(n/exp2(p.x + 5.0*p.y), 2.0)) == 1) return 1.0;\n    }\n    return 0.0;\n}\n\nvoid main()\n{\n    vec2 coord = mapCoord(vTextureCoord);\n\n    // get the rounded color..\n    vec2 pixCoord = pixelate(coord, vec2(pixelSize));\n    pixCoord = unmapCoord(pixCoord);\n\n    vec4 color = texture2D(uSampler, pixCoord);\n\n    // determine the character to use\n    float gray = (color.r + color.g + color.b) / 3.0;\n\n    float n =  65536.0;             // .\n    if (gray > 0.2) n = 65600.0;    // :\n    if (gray > 0.3) n = 332772.0;   // *\n    if (gray > 0.4) n = 15255086.0; // o\n    if (gray > 0.5) n = 23385164.0; // &\n    if (gray > 0.6) n = 15252014.0; // 8\n    if (gray > 0.7) n = 13199452.0; // @\n    if (gray > 0.8) n = 11512810.0; // #\n\n    // get the mod..\n    vec2 modd = getMod(coord, vec2(pixelSize));\n\n    gl_FragColor = color * character( n, vec2(-1.0) + modd * 2.0);\n\n}";
var AsciiFilter=function(e){function n(n){void 0===n&&(n=8),e.call(this,vertex,fragment),this.size=n;}e&&(n.__proto__=e),(n.prototype=Object.create(e&&e.prototype)).constructor=n;var o={size:{}};return o.size.get=function(){return this.uniforms.pixelSize},o.size.set=function(e){this.uniforms.pixelSize=e;},Object.defineProperties(n.prototype,o),n}(PIXI.Filter);

/*!
 * @pixi/filter-bloom - v2.0.0
 * Compiled Wed, 02 Aug 2017 13:37:07 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var ref=PIXI.filters;
var BlurXFilter=ref.BlurXFilter;
var BlurYFilter=ref.BlurYFilter;
var VoidFilter=ref.VoidFilter;
var BloomFilter=function(r){function t(t){void 0===t&&(t=2),r.call(this),this.blurXFilter=new BlurXFilter,this.blurYFilter=new BlurYFilter,this.blurYFilter.blendMode=PIXI.BLEND_MODES.SCREEN,this.defaultFilter=new VoidFilter,"number"==typeof t?this.blur=t:t instanceof PIXI.Point&&(this.blurX=t.x,this.blurY=t.y);}r&&(t.__proto__=r),(t.prototype=Object.create(r&&r.prototype)).constructor=t;var l={blur:{},blurX:{},blurY:{}};return t.prototype.apply=function(r,t,l){var e=r.getRenderTarget(!0);this.defaultFilter.apply(r,t,l),this.blurXFilter.apply(r,t,e),this.blurYFilter.apply(r,e,l),r.returnRenderTarget(e);},l.blur.get=function(){return this.blurXFilter.blur},l.blur.set=function(r){this.blurXFilter.blur=this.blurYFilter.blur=r;},l.blurX.get=function(){return this.blurXFilter.blur},l.blurX.set=function(r){this.blurXFilter.blur=r;},l.blurY.get=function(){return this.blurYFilter.blur},l.blurY.set=function(r){this.blurYFilter.blur=r;},Object.defineProperties(t.prototype,l),t}(PIXI.Filter);

/*!
 * @pixi/filter-bulge-pinch - v2.0.0
 * Compiled Wed, 02 Aug 2017 13:37:06 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$1="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n";
var fragment$1="uniform float radius;\nuniform float strength;\nuniform vec2 center;\nuniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform vec2 dimensions;\n\nvoid main()\n{\n    vec2 coord = vTextureCoord * filterArea.xy;\n    coord -= center * dimensions.xy;\n    float distance = length(coord);\n    if (distance < radius) {\n        float percent = distance / radius;\n        if (strength > 0.0) {\n            coord *= mix(1.0, smoothstep(0.0, radius / distance, percent), strength * 0.75);\n        } else {\n            coord *= mix(1.0, pow(percent, 1.0 + strength * 0.75) * radius / distance, 1.0 - percent);\n        }\n    }\n    coord += center * dimensions.xy;\n    coord /= filterArea.xy;\n    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    gl_FragColor = texture2D(uSampler, clampedCoord);\n    if (coord != clampedCoord) {\n        gl_FragColor *= max(0.0, 1.0 - length(coord - clampedCoord));\n    }\n}\n";
var BulgePinchFilter=function(e){function r(r,n,t){e.call(this,vertex$1,fragment$1),this.center=r||[.5,.5],this.radius=n||100,this.strength=t||1;}e&&(r.__proto__=e),(r.prototype=Object.create(e&&e.prototype)).constructor=r;var n={radius:{},strength:{},center:{}};return r.prototype.apply=function(e,r,n){this.uniforms.dimensions[0]=r.sourceFrame.width,this.uniforms.dimensions[1]=r.sourceFrame.height,e.applyFilter(this,r,n);},n.radius.get=function(){return this.uniforms.radius},n.radius.set=function(e){this.uniforms.radius=e;},n.strength.get=function(){return this.uniforms.strength},n.strength.set=function(e){this.uniforms.strength=e;},n.center.get=function(){return this.uniforms.center},n.center.set=function(e){this.uniforms.center=e;},Object.defineProperties(r.prototype,n),r}(PIXI.Filter);

/*!
 * @pixi/filter-color-replace - v2.0.0
 * Compiled Wed, 02 Aug 2017 13:37:07 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$2="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n";
var fragment$2="varying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform vec3 originalColor;\nuniform vec3 newColor;\nuniform float epsilon;\nvoid main(void) {\n    vec4 currentColor = texture2D(texture, vTextureCoord);\n    vec3 colorDiff = originalColor - (currentColor.rgb / max(currentColor.a, 0.0000000001));\n    float colorDistance = length(colorDiff);\n    float doReplace = step(colorDistance, epsilon);\n    gl_FragColor = vec4(mix(currentColor.rgb, (newColor + colorDiff) * currentColor.a, doReplace), currentColor.a);\n}\n";
var ColorReplaceFilter=function(o){function r(r,e,n){void 0===r&&(r=16711680),void 0===e&&(e=0),void 0===n&&(n=.4),o.call(this,vertex$2,fragment$2),this.originalColor=r,this.newColor=e,this.epsilon=n;}o&&(r.__proto__=o),(r.prototype=Object.create(o&&o.prototype)).constructor=r;var e={originalColor:{},newColor:{},epsilon:{}};return e.originalColor.set=function(o){var r=this.uniforms.originalColor;"number"==typeof o?(PIXI.utils.hex2rgb(o,r),this._originalColor=o):(r[0]=o[0],r[1]=o[1],r[2]=o[2],this._originalColor=PIXI.utils.rgb2hex(r));},e.originalColor.get=function(){return this._originalColor},e.newColor.set=function(o){var r=this.uniforms.newColor;"number"==typeof o?(PIXI.utils.hex2rgb(o,r),this._newColor=o):(r[0]=o[0],r[1]=o[1],r[2]=o[2],this._newColor=PIXI.utils.rgb2hex(r));},e.newColor.get=function(){return this._newColor},e.epsilon.set=function(o){this.uniforms.epsilon=o;},e.epsilon.get=function(){return this.uniforms.epsilon},Object.defineProperties(r.prototype,e),r}(PIXI.Filter);

/*!
 * @pixi/filter-convolution - v2.0.0
 * Compiled Wed, 02 Aug 2017 13:37:11 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$3="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$3="precision mediump float;\n\nvarying mediump vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec2 texelSize;\nuniform float matrix[9];\n\nvoid main(void)\n{\n   vec4 c11 = texture2D(uSampler, vTextureCoord - texelSize); // top left\n   vec4 c12 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - texelSize.y)); // top center\n   vec4 c13 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y - texelSize.y)); // top right\n\n   vec4 c21 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y)); // mid left\n   vec4 c22 = texture2D(uSampler, vTextureCoord); // mid center\n   vec4 c23 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y)); // mid right\n\n   vec4 c31 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y + texelSize.y)); // bottom left\n   vec4 c32 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + texelSize.y)); // bottom center\n   vec4 c33 = texture2D(uSampler, vTextureCoord + texelSize); // bottom right\n\n   gl_FragColor =\n       c11 * matrix[0] + c12 * matrix[1] + c13 * matrix[2] +\n       c21 * matrix[3] + c22 * matrix[4] + c23 * matrix[5] +\n       c31 * matrix[6] + c32 * matrix[7] + c33 * matrix[8];\n\n   gl_FragColor.a = c22.a;\n}\n";
var ConvolutionFilter=function(e){function t(t,r,o){e.call(this,vertex$3,fragment$3),this.matrix=t,this.width=r,this.height=o;}e&&(t.__proto__=e),(t.prototype=Object.create(e&&e.prototype)).constructor=t;var r={matrix:{},width:{},height:{}};return r.matrix.get=function(){return this.uniforms.matrix},r.matrix.set=function(e){this.uniforms.matrix=new Float32Array(e);},r.width.get=function(){return 1/this.uniforms.texelSize[0]},r.width.set=function(e){this.uniforms.texelSize[0]=1/e;},r.height.get=function(){return 1/this.uniforms.texelSize[1]},r.height.set=function(e){this.uniforms.texelSize[1]=1/e;},Object.defineProperties(t.prototype,r),t}(PIXI.Filter);

/*!
 * @pixi/filter-cross-hatch - v2.0.0
 * Compiled Wed, 02 Aug 2017 13:37:11 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$4="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$4="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    float lum = length(texture2D(uSampler, vTextureCoord.xy).rgb);\n\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n\n    if (lum < 1.00)\n    {\n        if (mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.75)\n    {\n        if (mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.50)\n    {\n        if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.3)\n    {\n        if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n}\n";
var CrossHatchFilter=function(n){function o(){n.call(this,vertex$4,fragment$4);}return n&&(o.__proto__=n),o.prototype=Object.create(n&&n.prototype),o.prototype.constructor=o,o}(PIXI.Filter);

/*!
 * @pixi/filter-dot - v2.0.0
 * Compiled Wed, 02 Aug 2017 13:37:11 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$5="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$5="precision mediump float;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;\n\nuniform float angle;\nuniform float scale;\n\nfloat pattern()\n{\n   float s = sin(angle), c = cos(angle);\n   vec2 tex = vTextureCoord * filterArea.xy;\n   vec2 point = vec2(\n       c * tex.x - s * tex.y,\n       s * tex.x + c * tex.y\n   ) * scale;\n   return (sin(point.x) * sin(point.y)) * 4.0;\n}\n\nvoid main()\n{\n   vec4 color = texture2D(uSampler, vTextureCoord);\n   float average = (color.r + color.g + color.b) / 3.0;\n   gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);\n}\n";
var DotFilter=function(e){function n(n,t){void 0===n&&(n=1),void 0===t&&(t=5),e.call(this,vertex$5,fragment$5),this.scale=n,this.angle=t;}e&&(n.__proto__=e),(n.prototype=Object.create(e&&e.prototype)).constructor=n;var t={scale:{},angle:{}};return t.scale.get=function(){return this.uniforms.scale},t.scale.set=function(e){this.uniforms.scale=e;},t.angle.get=function(){return this.uniforms.angle},t.angle.set=function(e){this.uniforms.angle=e;},Object.defineProperties(n.prototype,t),n}(PIXI.Filter);

/*!
 * @pixi/filter-drop-shadow - v2.0.0
 * Compiled Wed, 02 Aug 2017 13:37:12 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$6="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$6="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float alpha;\nuniform vec3 color;\nvoid main(void){\n    vec4 sample = texture2D(uSampler, vTextureCoord);\n\n    // Un-premultiply alpha before applying the color\n    if (sample.a > 0.0) {\n        sample.rgb /= sample.a;\n    }\n\n    // Premultiply alpha again\n    sample.rgb = color.rgb * sample.a;\n\n    // alpha user alpha\n    sample *= alpha;\n\n    gl_FragColor = sample;\n}";
var DropShadowFilter=function(t){function r(r,e,i,n,o){void 0===r&&(r=45),void 0===e&&(e=5),void 0===i&&(i=2),void 0===n&&(n=0),void 0===o&&(o=.5),t.call(this),this.tintFilter=new PIXI.Filter(vertex$6,fragment$6),this.blurFilter=new PIXI.filters.BlurFilter,this.blurFilter.blur=i,this.rotation=r,this.padding=e,this.distance=e,this.alpha=o,this.color=n;}t&&(r.__proto__=t),(r.prototype=Object.create(t&&t.prototype)).constructor=r;var e={distance:{},rotation:{},blur:{},alpha:{},color:{}};return r.prototype.apply=function(r,e,i){var n=r.getRenderTarget();n.transform=new PIXI.Matrix,n.transform.translate(this.distance*Math.cos(this.angle),this.distance*Math.sin(this.angle)),this.tintFilter.apply(r,e,n,!0),this.blurFilter.apply(r,n,i),t.prototype.apply.call(this,r,e,i),n.transform=null,r.returnRenderTarget(n);},r.prototype.updatePadding=function(){this.padding=this.distance+2*this.blur;},e.distance.get=function(){return this._distance},e.distance.set=function(t){this._distance=t,this.updatePadding();},e.rotation.get=function(){return this.angle/PIXI.DEG_TO_RAD},e.rotation.set=function(t){this.angle=t*PIXI.DEG_TO_RAD;},e.blur.get=function(){return this.blurFilter.blur},e.blur.set=function(t){this.blurFilter.blur=t,this.updatePadding();},e.alpha.get=function(){return this.tintFilter.uniforms.alpha},e.alpha.set=function(t){this.tintFilter.uniforms.alpha=t;},e.color.get=function(){return PIXI.utils.rgb2hex(this.tintFilter.uniforms.color)},e.color.set=function(t){PIXI.utils.hex2rgb(t,this.tintFilter.uniforms.color);},Object.defineProperties(r.prototype,e),r}(PIXI.Filter);

/*!
 * @pixi/filter-emboss - v2.0.0
 * Compiled Wed, 02 Aug 2017 13:37:16 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$7="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$7="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float strength;\nuniform vec4 filterArea;\n\n\nvoid main(void)\n{\n\tvec2 onePixel = vec2(1.0 / filterArea);\n\n\tvec4 color;\n\n\tcolor.rgb = vec3(0.5);\n\n\tcolor -= texture2D(uSampler, vTextureCoord - onePixel) * strength;\n\tcolor += texture2D(uSampler, vTextureCoord + onePixel) * strength;\n\n\tcolor.rgb = vec3((color.r + color.g + color.b) / 3.0);\n\n\tfloat alpha = texture2D(uSampler, vTextureCoord).a;\n\n\tgl_FragColor = vec4(color.rgb * alpha, alpha);\n}\n";
var EmbossFilter=function(e){function t(t){void 0===t&&(t=5),e.call(this,vertex$7,fragment$7),this.strength=t;}e&&(t.__proto__=e),(t.prototype=Object.create(e&&e.prototype)).constructor=t;var r={strength:{}};return r.strength.get=function(){return this.uniforms.strength},r.strength.set=function(e){this.uniforms.strength=e;},Object.defineProperties(t.prototype,r),t}(PIXI.Filter);

/*!
 * @pixi/filter-glow - v2.0.0
 * Compiled Wed, 02 Aug 2017 13:37:17 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$8="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n";
var fragment$8="varying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\n\nuniform float distance;\nuniform float outerStrength;\nuniform float innerStrength;\nuniform vec4 glowColor;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nvec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);\n\nvoid main(void) {\n    const float PI = 3.14159265358979323846264;\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float totalAlpha = 0.0;\n    float maxTotalAlpha = 0.0;\n    float cosAngle;\n    float sinAngle;\n    vec2 displaced;\n    for (float angle = 0.0; angle <= PI * 2.0; angle += %QUALITY_DIST%) {\n       cosAngle = cos(angle);\n       sinAngle = sin(angle);\n       for (float curDistance = 1.0; curDistance <= %DIST%; curDistance++) {\n           displaced.x = vTextureCoord.x + cosAngle * curDistance * px.x;\n           displaced.y = vTextureCoord.y + sinAngle * curDistance * px.y;\n           curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\n           totalAlpha += (distance - curDistance) * curColor.a;\n           maxTotalAlpha += (distance - curDistance);\n       }\n    }\n    maxTotalAlpha = max(maxTotalAlpha, 0.0001);\n\n    ownColor.a = max(ownColor.a, 0.0001);\n    ownColor.rgb = ownColor.rgb / ownColor.a;\n    float outerGlowAlpha = (totalAlpha / maxTotalAlpha)  * outerStrength * (1. - ownColor.a);\n    float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * innerStrength * ownColor.a;\n    float resultAlpha = (ownColor.a + outerGlowAlpha);\n    gl_FragColor = vec4(mix(mix(ownColor.rgb, glowColor.rgb, innerGlowAlpha / ownColor.a), glowColor.rgb, outerGlowAlpha / resultAlpha) * resultAlpha, resultAlpha);\n}\n";
var GlowFilter=function(o){function t(t,n,r,e,l){void 0===t&&(t=10),void 0===n&&(n=4),void 0===r&&(r=0),void 0===e&&(e=16777215),void 0===l&&(l=.1),o.call(this,vertex$8,fragment$8.replace(/%QUALITY_DIST%/gi,""+(1/l/t).toFixed(7)).replace(/%DIST%/gi,""+t.toFixed(7))),this.uniforms.glowColor=new Float32Array([0,0,0,1]),this.distance=t,this.color=e,this.outerStrength=n,this.innerStrength=r;}o&&(t.__proto__=o),(t.prototype=Object.create(o&&o.prototype)).constructor=t;var n={color:{},distance:{},outerStrength:{},innerStrength:{}};return n.color.get=function(){return PIXI.utils.rgb2hex(this.uniforms.glowColor)},n.color.set=function(o){PIXI.utils.hex2rgb(o,this.uniforms.glowColor);},n.distance.get=function(){return this.uniforms.distance},n.distance.set=function(o){this.uniforms.distance=o;},n.outerStrength.get=function(){return this.uniforms.outerStrength},n.outerStrength.set=function(o){this.uniforms.outerStrength=o;},n.innerStrength.get=function(){return this.uniforms.innerStrength},n.innerStrength.set=function(o){this.uniforms.innerStrength=o;},Object.defineProperties(t.prototype,n),t}(PIXI.Filter);

/*!
 * @pixi/filter-outline - v2.0.0
 * Compiled Wed, 02 Aug 2017 13:37:16 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$9="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n";
var fragment$9="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float thickness;\nuniform vec4 outlineColor;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nvec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);\n\nvoid main(void) {\n    const float PI = 3.14159265358979323846264;\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float maxAlpha = 0.;\n    vec2 displaced;\n    for (float angle = 0.; angle < PI * 2.; angle += %THICKNESS% ) {\n        displaced.x = vTextureCoord.x + thickness * px.x * cos(angle);\n        displaced.y = vTextureCoord.y + thickness * px.y * sin(angle);\n        curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\n        maxAlpha = max(maxAlpha, curColor.a);\n    }\n    float resultAlpha = max(maxAlpha, ownColor.a);\n    gl_FragColor = vec4((ownColor.rgb + outlineColor.rgb * (1. - ownColor.a)) * resultAlpha, resultAlpha);\n}\n";
var OutlineFilter=function(e){function o(o,r){void 0===o&&(o=1),void 0===r&&(r=0),e.call(this,vertex$9,fragment$9.replace(/%THICKNESS%/gi,(1/o).toFixed(7))),this.thickness=o,this.uniforms.outlineColor=new Float32Array([0,0,0,1]),this.color=r;}e&&(o.__proto__=e),(o.prototype=Object.create(e&&e.prototype)).constructor=o;var r={color:{},thickness:{}};return r.color.get=function(){return PIXI.utils.rgb2hex(this.uniforms.outlineColor)},r.color.set=function(e){PIXI.utils.hex2rgb(e,this.uniforms.outlineColor);},r.thickness.get=function(){return this.uniforms.thickness},r.thickness.set=function(e){this.uniforms.thickness=e;},Object.defineProperties(o.prototype,r),o}(PIXI.Filter);

/*!
 * @pixi/filter-pixelate - v2.0.0
 * Compiled Wed, 02 Aug 2017 13:37:18 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$10="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$10="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform vec2 size;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 pixelate(vec2 coord, vec2 size)\n{\n\treturn floor( coord / size ) * size;\n}\n\nvoid main(void)\n{\n    vec2 coord = mapCoord(vTextureCoord);\n\n    coord = pixelate(coord, size);\n\n    coord = unmapCoord(coord);\n\n    gl_FragColor = texture2D(uSampler, coord);\n}\n";
var PixelateFilter=function(e){function o(o){void 0===o&&(o=10),e.call(this,vertex$10,fragment$10),this.size=o;}e&&(o.__proto__=e),(o.prototype=Object.create(e&&e.prototype)).constructor=o;var r={size:{}};return r.size.get=function(){return this.uniforms.size},r.size.set=function(e){"number"==typeof e&&(e=[e,e]),this.uniforms.size=e;},Object.defineProperties(o.prototype,r),o}(PIXI.Filter);

/*!
 * @pixi/filter-rgb-split - v2.0.0
 * Compiled Wed, 02 Aug 2017 13:37:22 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$11="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$11="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 red;\nuniform vec2 green;\nuniform vec2 blue;\n\nvoid main(void)\n{\n   gl_FragColor.r = texture2D(uSampler, vTextureCoord + red/filterArea.xy).r;\n   gl_FragColor.g = texture2D(uSampler, vTextureCoord + green/filterArea.xy).g;\n   gl_FragColor.b = texture2D(uSampler, vTextureCoord + blue/filterArea.xy).b;\n   gl_FragColor.a = texture2D(uSampler, vTextureCoord).a;\n}\n";
var RGBSplitFilter=function(e){function r(r,t,n){void 0===r&&(r=[-10,0]),void 0===t&&(t=[0,10]),void 0===n&&(n=[0,0]),e.call(this,vertex$11,fragment$11),this.red=r,this.green=t,this.blue=n;}e&&(r.__proto__=e),(r.prototype=Object.create(e&&e.prototype)).constructor=r;var t={red:{},green:{},blue:{}};return t.red.get=function(){return this.uniforms.red},t.red.set=function(e){this.uniforms.red=e;},t.green.get=function(){return this.uniforms.green},t.green.set=function(e){this.uniforms.green=e;},t.blue.get=function(){return this.uniforms.blue},t.blue.set=function(e){this.uniforms.blue=e;},Object.defineProperties(r.prototype,t),r}(PIXI.Filter);

/*!
 * @pixi/filter-shockwave - v2.0.0
 * Compiled Wed, 02 Aug 2017 13:37:22 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$12="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$12="varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nuniform vec2 center;\nuniform vec3 params; // 10.0, 0.8, 0.1\nuniform float time;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform vec2 dimensions;\n\nvoid main()\n{\n    vec2 uv = vTextureCoord * filterArea.xy / dimensions.xy;\n    vec2 coord = uv;\n\n    float dist = distance(coord, center);\n\n    if ( (dist <= (time + params.z)) && (dist >= (time - params.z)) )\n    {\n        float diff = (dist - time);\n        float powDiff = 1.0 - pow(abs(diff*params.x), params.y);\n\n        float diffTime = diff  * powDiff;\n        vec2 diffUV = normalize(uv - center);\n        coord = uv + (diffUV * diffTime);\n    }\n\n    coord *= dimensions.xy / filterArea.xy;\n    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    gl_FragColor = texture2D(uSampler, clampedCoord);\n    if (coord != clampedCoord) {\n        gl_FragColor *= max(0.0, 1.0 - length(coord - clampedCoord));\n    }\n}\n";
var ShockwaveFilter=function(e){function t(t,n,r){void 0===t&&(t=[.5,.5]),void 0===n&&(n=[10,.8,.1]),void 0===r&&(r=0),e.call(this,vertex$12,fragment$12,{center:{type:"v2",value:{x:.5,y:.5}},params:{type:"v3",value:{x:10,y:.8,z:.1}},time:{type:"1f",value:0},dimensions:{type:"2f",value:[0,0]}}),this.center=t,this.params=n,this.time=r;}e&&(t.__proto__=e),(t.prototype=Object.create(e&&e.prototype)).constructor=t;var n={center:{},params:{},time:{}};return t.prototype.apply=function(e,t,n){this.uniforms.dimensions[0]=t.sourceFrame.width,this.uniforms.dimensions[1]=t.sourceFrame.height,e.applyFilter(this,t,n);},n.center.get=function(){return this.uniforms.center},n.center.set=function(e){this.uniforms.center=e;},n.params.get=function(){return this.uniforms.params},n.params.set=function(e){this.uniforms.params=e;},n.time.get=function(){return this.uniforms.time},n.time.set=function(e){this.uniforms.time=e;},Object.defineProperties(t.prototype,n),t}(PIXI.Filter);

/*!
 * @pixi/filter-simple-lightmap - v2.0.0
 * Compiled Wed, 02 Aug 2017 13:37:22 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$13="precision mediump float;\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float thickness;\nuniform vec4 outlineColor;\nuniform float pixelWidth;\nuniform float pixelHeight;\nvec2 px = vec2(pixelWidth, pixelHeight);\n\nvoid main(void) {\n    const float PI = 3.14159265358979323846264;\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float maxAlpha = 0.;\n    for (float angle = 0.; angle < PI * 2.; angle +=  + (1 / thickness).toFixed(7) + ) {\n        curColor = texture2D(uSampler, vec2(vTextureCoord.x + thickness * px.x * cos(angle), vTextureCoord.y + thickness * px.y * sin(angle)));\n        maxAlpha = max(maxAlpha, curColor.a);\n    }\n    float resultAlpha = max(maxAlpha, ownColor.a);\n    gl_FragColor = vec4((ownColor.rgb + outlineColor.rgb * (1. - ownColor.a)) * resultAlpha, resultAlpha);\n}\n";
var fragment$13="varying vec4 vColor;\nvarying vec2 vTextureCoord;\nuniform sampler2D u_texture; //diffuse map\nuniform sampler2D u_lightmap;   //light map\nuniform vec2 resolution; //resolution of screen\nuniform vec4 ambientColor; //ambient RGB, alpha channel is intensity\nvoid main() {\n    vec4 diffuseColor = texture2D(u_texture, vTextureCoord);\n    vec2 lighCoord = (gl_FragCoord.xy / resolution.xy);\n    vec4 light = texture2D(u_lightmap, vTextureCoord);\n    vec3 ambient = ambientColor.rgb * ambientColor.a;\n    vec3 intensity = ambient + light.rgb;\n    vec3 finalColor = diffuseColor.rgb * intensity;\n    gl_FragColor = vColor * vec4(finalColor, diffuseColor.a);\n}\n";
var SimpleLightmapFilter=function(o){function e(e,r,n){void 0===n&&(n=[1,1]),o.call(this,vertex$13,fragment$13),this.uniforms.u_lightmap=e,this.uniforms.resolution=new Float32Array(n),this.uniforms.ambientColor=new Float32Array(r);}o&&(e.__proto__=o),(e.prototype=Object.create(o&&o.prototype)).constructor=e;var r={texture:{},color:{},resolution:{}};return r.texture.get=function(){return this.uniforms.u_lightmap},r.texture.set=function(o){this.uniforms.u_lightmap=o;},r.color.get=function(){return this.uniforms.ambientColor},r.color.set=function(o){this.uniforms.ambientColor=new Float32Array(o);},r.resolution.get=function(){return this.uniforms.resolution},r.resolution.set=function(o){this.uniforms.resolution=new Float32Array(o);},Object.defineProperties(e.prototype,r),e}(PIXI.Filter);

/*!
 * @pixi/filter-tilt-shift - v2.0.0
 * Compiled Wed, 02 Aug 2017 13:37:23 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$14="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$14="varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float blur;\nuniform float gradientBlur;\nuniform vec2 start;\nuniform vec2 end;\nuniform vec2 delta;\nuniform vec2 texSize;\n\nfloat random(vec3 scale, float seed)\n{\n    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n}\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n    float total = 0.0;\n\n    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n    vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));\n    float radius = smoothstep(0.0, 1.0, abs(dot(vTextureCoord * texSize - start, normal)) / gradientBlur) * blur;\n\n    for (float t = -30.0; t <= 30.0; t++)\n    {\n        float percent = (t + offset - 0.5) / 30.0;\n        float weight = 1.0 - abs(percent);\n        vec4 sample = texture2D(uSampler, vTextureCoord + delta / texSize * percent * radius);\n        sample.rgb *= sample.a;\n        color += sample * weight;\n        total += weight;\n    }\n\n    gl_FragColor = color / total;\n    gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\n}\n";
var TiltShiftAxisFilter=function(t){function i(i,r,e,n){void 0===i&&(i=100),void 0===r&&(r=600),void 0===e&&(e=null),void 0===n&&(n=null),t.call(this,vertex$14,fragment$14),this.uniforms.blur=i,this.uniforms.gradientBlur=r,this.uniforms.start=e||new PIXI.Point(0,window.innerHeight/2),this.uniforms.end=n||new PIXI.Point(600,window.innerHeight/2),this.uniforms.delta=new PIXI.Point(30,30),this.uniforms.texSize=new PIXI.Point(window.innerWidth,window.innerHeight),this.updateDelta();}t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i;var r={blur:{},gradientBlur:{},start:{},end:{}};return i.prototype.updateDelta=function(){this.uniforms.delta.x=0,this.uniforms.delta.y=0;},r.blur.get=function(){return this.uniforms.blur},r.blur.set=function(t){this.uniforms.blur=t;},r.gradientBlur.get=function(){return this.uniforms.gradientBlur},r.gradientBlur.set=function(t){this.uniforms.gradientBlur=t;},r.start.get=function(){return this.uniforms.start},r.start.set=function(t){this.uniforms.start=t,this.updateDelta();},r.end.get=function(){return this.uniforms.end},r.end.set=function(t){this.uniforms.end=t,this.updateDelta();},Object.defineProperties(i.prototype,r),i}(PIXI.Filter);
var TiltShiftXFilter=function(t){function i(){t.apply(this,arguments);}return t&&(i.__proto__=t),i.prototype=Object.create(t&&t.prototype),i.prototype.constructor=i,i.prototype.updateDelta=function(){var t=this.uniforms.end.x-this.uniforms.start.x,i=this.uniforms.end.y-this.uniforms.start.y,r=Math.sqrt(t*t+i*i);this.uniforms.delta.x=t/r,this.uniforms.delta.y=i/r;},i}(TiltShiftAxisFilter);
var TiltShiftYFilter=function(t){function i(){t.apply(this,arguments);}return t&&(i.__proto__=t),i.prototype=Object.create(t&&t.prototype),i.prototype.constructor=i,i.prototype.updateDelta=function(){var t=this.uniforms.end.x-this.uniforms.start.x,i=this.uniforms.end.y-this.uniforms.start.y,r=Math.sqrt(t*t+i*i);this.uniforms.delta.x=-i/r,this.uniforms.delta.y=t/r;},i}(TiltShiftAxisFilter);
var TiltShiftFilter=function(t){function i(i,r,e,n){void 0===i&&(i=100),void 0===r&&(r=600),void 0===e&&(e=null),void 0===n&&(n=null),t.call(this),this.tiltShiftXFilter=new TiltShiftXFilter(i,r,e,n),this.tiltShiftYFilter=new TiltShiftYFilter(i,r,e,n);}t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i;var r={blur:{},gradientBlur:{},start:{},end:{}};return i.prototype.apply=function(t,i,r){var e=t.getRenderTarget(!0);this.tiltShiftXFilter.apply(t,i,e),this.tiltShiftYFilter.apply(t,e,r),t.returnRenderTarget(e);},r.blur.get=function(){return this.tiltShiftXFilter.blur},r.blur.set=function(t){this.tiltShiftXFilter.blur=this.tiltShiftYFilter.blur=t;},r.gradientBlur.get=function(){return this.tiltShiftXFilter.gradientBlur},r.gradientBlur.set=function(t){this.tiltShiftXFilter.gradientBlur=this.tiltShiftYFilter.gradientBlur=t;},r.start.get=function(){return this.tiltShiftXFilter.start},r.start.set=function(t){this.tiltShiftXFilter.start=this.tiltShiftYFilter.start=t;},r.end.get=function(){return this.tiltShiftXFilter.end},r.end.set=function(t){this.tiltShiftXFilter.end=this.tiltShiftYFilter.end=t;},Object.defineProperties(i.prototype,r),i}(PIXI.Filter);

/*!
 * @pixi/filter-twist - v2.0.0
 * Compiled Wed, 02 Aug 2017 13:37:25 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$15="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$15="varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float radius;\nuniform float angle;\nuniform vec2 offset;\nuniform vec4 filterArea;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 twist(vec2 coord)\n{\n    coord -= offset;\n\n    float dist = length(coord);\n\n    if (dist < radius)\n    {\n        float ratioDist = (radius - dist) / radius;\n        float angleMod = ratioDist * ratioDist * angle;\n        float s = sin(angleMod);\n        float c = cos(angleMod);\n        coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);\n    }\n\n    coord += offset;\n\n    return coord;\n}\n\nvoid main(void)\n{\n\n    vec2 coord = mapCoord(vTextureCoord);\n\n    coord = twist(coord);\n\n    coord = unmapCoord(coord);\n\n    gl_FragColor = texture2D(uSampler, coord );\n\n}\n";
var TwistFilter=function(o){function n(n,r,t){void 0===n&&(n=200),void 0===r&&(r=4),void 0===t&&(t=20),o.call(this,vertex$15,fragment$15),this.radius=n,this.angle=r,this.padding=t;}o&&(n.__proto__=o),(n.prototype=Object.create(o&&o.prototype)).constructor=n;var r={offset:{},radius:{},angle:{}};return r.offset.get=function(){return this.uniforms.offset},r.offset.set=function(o){this.uniforms.offset=o;},r.radius.get=function(){return this.uniforms.radius},r.radius.set=function(o){this.uniforms.radius=o;},r.angle.get=function(){return this.uniforms.angle},r.angle.set=function(o){this.uniforms.angle=o;},Object.defineProperties(n.prototype,r),n}(PIXI.Filter);

exports.AsciiFilter = AsciiFilter;
exports.BloomFilter = BloomFilter;
exports.BulgePinchFilter = BulgePinchFilter;
exports.ColorReplaceFilter = ColorReplaceFilter;
exports.ConvolutionFilter = ConvolutionFilter;
exports.CrossHatchFilter = CrossHatchFilter;
exports.DotFilter = DotFilter;
exports.DropShadowFilter = DropShadowFilter;
exports.EmbossFilter = EmbossFilter;
exports.GlowFilter = GlowFilter;
exports.OutlineFilter = OutlineFilter;
exports.PixelateFilter = PixelateFilter;
exports.RGBSplitFilter = RGBSplitFilter;
exports.ShockwaveFilter = ShockwaveFilter;
exports.SimpleLightmapFilter = SimpleLightmapFilter;
exports.TiltShiftFilter = TiltShiftFilter;
exports.TiltShiftAxisFilter = TiltShiftAxisFilter;
exports.TiltShiftXFilter = TiltShiftXFilter;
exports.TiltShiftYFilter = TiltShiftYFilter;
exports.TwistFilter = TwistFilter;

Object.defineProperty(exports, '__esModule', { value: true });

Object.assign(PIXI.filters, exports);

})));
//# sourceMappingURL=pixi-filters.js.map
