!function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="./js/app/",t(t.s=107)}([function(e,t){var n=e.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},function(e,t){var n=e.exports={version:"2.5.1"};"number"==typeof __e&&(__e=n)},function(e,t){var n={}.hasOwnProperty;e.exports=function(e,t){return n.call(e,t)}},function(e,t,n){var r=n(12),o=n(33),i=n(22),s=Object.defineProperty;t.f=n(4)?Object.defineProperty:function(e,t,n){if(r(e),t=i(t,!0),r(n),o)try{return s(e,t,n)}catch(e){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(e[t]=n.value),e}},function(e,t,n){e.exports=!n(11)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var o=n(50),i=r(o),s=n(49),a=r(s),u="function"==typeof a.default&&"symbol"==typeof i.default?function(e){return typeof e}:function(e){return e&&"function"==typeof a.default&&e.constructor===a.default&&e!==a.default.prototype?"symbol":typeof e};t.default="function"==typeof a.default&&"symbol"===u(i.default)?function(e){return void 0===e?"undefined":u(e)}:function(e){return e&&"function"==typeof a.default&&e.constructor===a.default&&e!==a.default.prototype?"symbol":void 0===e?"undefined":u(e)}},function(e,t,n){var r=n(3),o=n(15);e.exports=n(4)?function(e,t,n){return r.f(e,t,o(1,n))}:function(e,t,n){return e[t]=n,e}},function(e,t,n){var r=n(45),o=n(20);e.exports=function(e){return r(o(e))}},function(e,t,n){var r=n(25)("wks"),o=n(16),i=n(0).Symbol,s="function"==typeof i;(e.exports=function(e){return r[e]||(r[e]=s&&i[e]||(s?i:o)("Symbol."+e))}).store=r},function(e,t,n){var r=n(0),o=n(1),i=n(40),s=n(6),a=function(e,t,n){var u,c,f,l=e&a.F,d=e&a.G,h=e&a.S,p=e&a.P,v=e&a.B,y=e&a.W,g=d?o:o[t]||(o[t]={}),b=g.prototype,S=d?r:h?r[t]:(r[t]||{}).prototype;d&&(n=t);for(u in n)(c=!l&&S&&void 0!==S[u])&&u in g||(f=c?S[u]:n[u],g[u]=d&&"function"!=typeof S[u]?n[u]:v&&c?i(f,r):y&&S[u]==f?function(e){var t=function(t,n,r){if(this instanceof e){switch(arguments.length){case 0:return new e;case 1:return new e(t);case 2:return new e(t,n)}return new e(t,n,r)}return e.apply(this,arguments)};return t.prototype=e.prototype,t}(f):p&&"function"==typeof f?i(Function.call,f):f,p&&((g.virtual||(g.virtual={}))[u]=f,e&a.R&&b&&!b[u]&&s(b,u,f)))};a.F=1,a.G=2,a.S=4,a.P=8,a.B=16,a.W=32,a.U=64,a.R=128,e.exports=a},function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t){e.exports=function(e){try{return!!e()}catch(e){return!0}}},function(e,t,n){var r=n(13);e.exports=function(e){if(!r(e))throw TypeError(e+" is not an object!");return e}},function(e,t){e.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},function(e,t){function n(){throw new Error("setTimeout has not been defined")}function r(){throw new Error("clearTimeout has not been defined")}function o(e){if(f===setTimeout)return setTimeout(e,0);if((f===n||!f)&&setTimeout)return f=setTimeout,setTimeout(e,0);try{return f(e,0)}catch(t){try{return f.call(null,e,0)}catch(t){return f.call(this,e,0)}}}function i(e){if(l===clearTimeout)return clearTimeout(e);if((l===r||!l)&&clearTimeout)return l=clearTimeout,clearTimeout(e);try{return l(e)}catch(t){try{return l.call(null,e)}catch(t){return l.call(this,e)}}}function s(){v&&h&&(v=!1,h.length?p=h.concat(p):y=-1,p.length&&a())}function a(){if(!v){var e=o(s);v=!0;for(var t=p.length;t;){for(h=p,p=[];++y<t;)h&&h[y].run();y=-1,t=p.length}h=null,v=!1,i(e)}}function u(e,t){this.fun=e,this.array=t}function c(){}var f,l,d=e.exports={};!function(){try{f="function"==typeof setTimeout?setTimeout:n}catch(e){f=n}try{l="function"==typeof clearTimeout?clearTimeout:r}catch(e){l=r}}();var h,p=[],v=!1,y=-1;d.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];p.push(new u(e,t)),1!==p.length||v||o(a)},u.prototype.run=function(){this.fun.apply(null,this.array)},d.title="browser",d.browser=!0,d.env={},d.argv=[],d.version="",d.versions={},d.on=c,d.addListener=c,d.once=c,d.off=c,d.removeListener=c,d.removeAllListeners=c,d.emit=c,d.prependListener=c,d.prependOnceListener=c,d.listeners=function(e){return[]},d.binding=function(e){throw new Error("process.binding is not supported")},d.cwd=function(){return"/"},d.chdir=function(e){throw new Error("process.chdir is not supported")},d.umask=function(){return 0}},function(e,t){e.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},function(e,t){var n=0,r=Math.random();e.exports=function(e){return"Symbol(".concat(void 0===e?"":e,")_",(++n+r).toString(36))}},function(e,t,n){var r=n(36),o=n(26);e.exports=Object.keys||function(e){return r(e,o)}},function(e,t){t.f={}.propertyIsEnumerable},function(e,t){var n=Math.ceil,r=Math.floor;e.exports=function(e){return isNaN(e=+e)?0:(e>0?r:n)(e)}},function(e,t){e.exports=function(e){if(void 0==e)throw TypeError("Can't call method on  "+e);return e}},function(e,t){e.exports=!0},function(e,t,n){var r=n(13);e.exports=function(e,t){if(!r(e))return e;var n,o;if(t&&"function"==typeof(n=e.toString)&&!r(o=n.call(e)))return o;if("function"==typeof(n=e.valueOf)&&!r(o=n.call(e)))return o;if(!t&&"function"==typeof(n=e.toString)&&!r(o=n.call(e)))return o;throw TypeError("Can't convert object to primitive value")}},function(e,t){e.exports={}},function(e,t,n){var r=n(25)("keys"),o=n(16);e.exports=function(e){return r[e]||(r[e]=o(e))}},function(e,t,n){var r=n(0),o=r["__core-js_shared__"]||(r["__core-js_shared__"]={});e.exports=function(e){return o[e]||(o[e]={})}},function(e,t){e.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(e,t,n){var r=n(3).f,o=n(2),i=n(8)("toStringTag");e.exports=function(e,t,n){e&&!o(e=n?e:e.prototype,i)&&r(e,i,{configurable:!0,value:t})}},function(e,t,n){t.f=n(8)},function(e,t,n){var r=n(0),o=n(1),i=n(21),s=n(28),a=n(3).f;e.exports=function(e){var t=o.Symbol||(o.Symbol=i?{}:r.Symbol||{});"_"==e.charAt(0)||e in t||a(t,e,{value:s.f(e)})}},function(e,t,n){var r=n(12),o=n(56),i=n(26),s=n(24)("IE_PROTO"),a=function(){},u=function(){var e,t=n(34)("iframe"),r=i.length;for(t.style.display="none",n(60).appendChild(t),t.src="javascript:",e=t.contentWindow.document,e.open(),e.write("<script>document.F=Object<\/script>"),e.close(),u=e.F;r--;)delete u.prototype[i[r]];return u()};e.exports=Object.create||function(e,t){var n;return null!==e?(a.prototype=r(e),n=new a,a.prototype=null,n[s]=e):n=u(),void 0===t?n:o(n,t)}},function(e,t){t.f=Object.getOwnPropertySymbols},function(e,t,n){"use strict";var r=n(21),o=n(9),i=n(35),s=n(6),a=n(2),u=n(23),c=n(55),f=n(27),l=n(41),d=n(8)("iterator"),h=!([].keys&&"next"in[].keys()),p=function(){return this};e.exports=function(e,t,n,v,y,g,b){c(n,t,v);var S,m,x,M=function(e){if(!h&&e in L)return L[e];switch(e){case"keys":case"values":return function(){return new n(this,e)}}return function(){return new n(this,e)}},j=t+" Iterator",w="values"==y,P=!1,L=e.prototype,J=L[d]||L["@@iterator"]||y&&L[y],O=J||M(y),T=y?w?M("entries"):O:void 0,C="Array"==t?L.entries||J:J;if(C&&(x=l(C.call(new e)))!==Object.prototype&&x.next&&(f(x,j,!0),r||a(x,d)||s(x,d,p)),w&&J&&"values"!==J.name&&(P=!0,O=function(){return J.call(this)}),r&&!b||!h&&!P&&L[d]||s(L,d,O),u[t]=O,u[j]=p,y)if(S={values:w?O:M("values"),keys:g?O:M("keys"),entries:T},b)for(m in S)m in L||i(L,m,S[m]);else o(o.P+o.F*(h||P),t,S);return S}},function(e,t,n){e.exports=!n(4)&&!n(11)(function(){return 7!=Object.defineProperty(n(34)("div"),"a",{get:function(){return 7}}).a})},function(e,t,n){var r=n(13),o=n(0).document,i=r(o)&&r(o.createElement);e.exports=function(e){return i?o.createElement(e):{}}},function(e,t,n){e.exports=n(6)},function(e,t,n){var r=n(2),o=n(7),i=n(57)(!1),s=n(24)("IE_PROTO");e.exports=function(e,t){var n,a=o(e),u=0,c=[];for(n in a)n!=s&&r(a,n)&&c.push(n);for(;t.length>u;)r(a,n=t[u++])&&(~i(c,n)||c.push(n));return c}},function(e,t){var n={}.toString;e.exports=function(e){return n.call(e).slice(8,-1)}},function(e,t,n){var r=n(20);e.exports=function(e){return Object(r(e))}},function(e,t,n){var r=n(36),o=n(26).concat("length","prototype");t.f=Object.getOwnPropertyNames||function(e){return r(e,o)}},function(e,t,n){var r=n(54);e.exports=function(e,t,n){if(r(e),void 0===t)return e;switch(n){case 1:return function(n){return e.call(t,n)};case 2:return function(n,r){return e.call(t,n,r)};case 3:return function(n,r,o){return e.call(t,n,r,o)}}return function(){return e.apply(t,arguments)}}},function(e,t,n){var r=n(2),o=n(38),i=n(24)("IE_PROTO"),s=Object.prototype;e.exports=Object.getPrototypeOf||function(e){return e=o(e),r(e,i)?e[i]:"function"==typeof e.constructor&&e instanceof e.constructor?e.constructor.prototype:e instanceof Object?s:null}},function(e,t,n){var r=n(18),o=n(15),i=n(7),s=n(22),a=n(2),u=n(33),c=Object.getOwnPropertyDescriptor;t.f=n(4)?c:function(e,t){if(e=i(e),t=s(t,!0),u)try{return c(e,t)}catch(e){}if(a(e,t))return o(!r.f.call(e,t),e[t])}},,,function(e,t,n){var r=n(37);e.exports=Object("z").propertyIsEnumerable(0)?Object:function(e){return"String"==r(e)?e.split(""):Object(e)}},,,,function(e,t,n){e.exports={default:n(65),__esModule:!0}},function(e,t,n){e.exports={default:n(51),__esModule:!0}},function(e,t,n){n(52),n(61),e.exports=n(28).f("iterator")},function(e,t,n){"use strict";var r=n(53)(!0);n(32)(String,"String",function(e){this._t=String(e),this._i=0},function(){var e,t=this._t,n=this._i;return n>=t.length?{value:void 0,done:!0}:(e=r(t,n),this._i+=e.length,{value:e,done:!1})})},function(e,t,n){var r=n(19),o=n(20);e.exports=function(e){return function(t,n){var i,s,a=String(o(t)),u=r(n),c=a.length;return u<0||u>=c?e?"":void 0:(i=a.charCodeAt(u),i<55296||i>56319||u+1===c||(s=a.charCodeAt(u+1))<56320||s>57343?e?a.charAt(u):i:e?a.slice(u,u+2):s-56320+(i-55296<<10)+65536)}}},function(e,t){e.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},function(e,t,n){"use strict";var r=n(30),o=n(15),i=n(27),s={};n(6)(s,n(8)("iterator"),function(){return this}),e.exports=function(e,t,n){e.prototype=r(s,{next:o(1,n)}),i(e,t+" Iterator")}},function(e,t,n){var r=n(3),o=n(12),i=n(17);e.exports=n(4)?Object.defineProperties:function(e,t){o(e);for(var n,s=i(t),a=s.length,u=0;a>u;)r.f(e,n=s[u++],t[n]);return e}},function(e,t,n){var r=n(7),o=n(58),i=n(59);e.exports=function(e){return function(t,n,s){var a,u=r(t),c=o(u.length),f=i(s,c);if(e&&n!=n){for(;c>f;)if((a=u[f++])!=a)return!0}else for(;c>f;f++)if((e||f in u)&&u[f]===n)return e||f||0;return!e&&-1}}},function(e,t,n){var r=n(19),o=Math.min;e.exports=function(e){return e>0?o(r(e),9007199254740991):0}},function(e,t,n){var r=n(19),o=Math.max,i=Math.min;e.exports=function(e,t){return e=r(e),e<0?o(e+t,0):i(e,t)}},function(e,t,n){var r=n(0).document;e.exports=r&&r.documentElement},function(e,t,n){n(62);for(var r=n(0),o=n(6),i=n(23),s=n(8)("toStringTag"),a="CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","),u=0;u<a.length;u++){var c=a[u],f=r[c],l=f&&f.prototype;l&&!l[s]&&o(l,s,c),i[c]=i.Array}},function(e,t,n){"use strict";var r=n(63),o=n(64),i=n(23),s=n(7);e.exports=n(32)(Array,"Array",function(e,t){this._t=s(e),this._i=0,this._k=t},function(){var e=this._t,t=this._k,n=this._i++;return!e||n>=e.length?(this._t=void 0,o(1)):"keys"==t?o(0,n):"values"==t?o(0,e[n]):o(0,[n,e[n]])},"values"),i.Arguments=i.Array,r("keys"),r("values"),r("entries")},function(e,t){e.exports=function(){}},function(e,t){e.exports=function(e,t){return{value:t,done:!!e}}},function(e,t,n){n(66),n(71),n(72),n(73),e.exports=n(1).Symbol},function(e,t,n){"use strict";var r=n(0),o=n(2),i=n(4),s=n(9),a=n(35),u=n(67).KEY,c=n(11),f=n(25),l=n(27),d=n(16),h=n(8),p=n(28),v=n(29),y=n(68),g=n(69),b=n(12),S=n(7),m=n(22),x=n(15),M=n(30),j=n(70),w=n(42),P=n(3),L=n(17),J=w.f,O=P.f,T=j.f,C=r.Symbol,_=r.JSON,E=_&&_.stringify,A=h("_hidden"),B=h("toPrimitive"),N={}.propertyIsEnumerable,D=f("symbol-registry"),z=f("symbols"),k=f("op-symbols"),U=Object.prototype,W="function"==typeof C,F=r.QObject,I=!F||!F.prototype||!F.prototype.findChild,G=i&&c(function(){return 7!=M(O({},"a",{get:function(){return O(this,"a",{value:7}).a}})).a})?function(e,t,n){var r=J(U,t);r&&delete U[t],O(e,t,n),r&&e!==U&&O(U,t,r)}:O,$=function(e){var t=z[e]=M(C.prototype);return t._k=e,t},R=W&&"symbol"==typeof C.iterator?function(e){return"symbol"==typeof e}:function(e){return e instanceof C},H=function(e,t,n){return e===U&&H(k,t,n),b(e),t=m(t,!0),b(n),o(z,t)?(n.enumerable?(o(e,A)&&e[A][t]&&(e[A][t]=!1),n=M(n,{enumerable:x(0,!1)})):(o(e,A)||O(e,A,x(1,{})),e[A][t]=!0),G(e,t,n)):O(e,t,n)},V=function(e,t){b(e);for(var n,r=y(t=S(t)),o=0,i=r.length;i>o;)H(e,n=r[o++],t[n]);return e},K=function(e,t){return void 0===t?M(e):V(M(e),t)},Y=function(e){var t=N.call(this,e=m(e,!0));return!(this===U&&o(z,e)&&!o(k,e))&&(!(t||!o(this,e)||!o(z,e)||o(this,A)&&this[A][e])||t)},q=function(e,t){if(e=S(e),t=m(t,!0),e!==U||!o(z,t)||o(k,t)){var n=J(e,t);return!n||!o(z,t)||o(e,A)&&e[A][t]||(n.enumerable=!0),n}},Q=function(e){for(var t,n=T(S(e)),r=[],i=0;n.length>i;)o(z,t=n[i++])||t==A||t==u||r.push(t);return r},X=function(e){for(var t,n=e===U,r=T(n?k:S(e)),i=[],s=0;r.length>s;)!o(z,t=r[s++])||n&&!o(U,t)||i.push(z[t]);return i};W||(C=function(){if(this instanceof C)throw TypeError("Symbol is not a constructor!");var e=d(arguments.length>0?arguments[0]:void 0),t=function(n){this===U&&t.call(k,n),o(this,A)&&o(this[A],e)&&(this[A][e]=!1),G(this,e,x(1,n))};return i&&I&&G(U,e,{configurable:!0,set:t}),$(e)},a(C.prototype,"toString",function(){return this._k}),w.f=q,P.f=H,n(39).f=j.f=Q,n(18).f=Y,n(31).f=X,i&&!n(21)&&a(U,"propertyIsEnumerable",Y,!0),p.f=function(e){return $(h(e))}),s(s.G+s.W+s.F*!W,{Symbol:C});for(var Z="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),ee=0;Z.length>ee;)h(Z[ee++]);for(var te=L(h.store),ne=0;te.length>ne;)v(te[ne++]);s(s.S+s.F*!W,"Symbol",{for:function(e){return o(D,e+="")?D[e]:D[e]=C(e)},keyFor:function(e){if(!R(e))throw TypeError(e+" is not a symbol!");for(var t in D)if(D[t]===e)return t},useSetter:function(){I=!0},useSimple:function(){I=!1}}),s(s.S+s.F*!W,"Object",{create:K,defineProperty:H,defineProperties:V,getOwnPropertyDescriptor:q,getOwnPropertyNames:Q,getOwnPropertySymbols:X}),_&&s(s.S+s.F*(!W||c(function(){var e=C();return"[null]"!=E([e])||"{}"!=E({a:e})||"{}"!=E(Object(e))})),"JSON",{stringify:function(e){if(void 0!==e&&!R(e)){for(var t,n,r=[e],o=1;arguments.length>o;)r.push(arguments[o++]);return t=r[1],"function"==typeof t&&(n=t),!n&&g(t)||(t=function(e,t){if(n&&(t=n.call(this,e,t)),!R(t))return t}),r[1]=t,E.apply(_,r)}}}),C.prototype[B]||n(6)(C.prototype,B,C.prototype.valueOf),l(C,"Symbol"),l(Math,"Math",!0),l(r.JSON,"JSON",!0)},function(e,t,n){var r=n(16)("meta"),o=n(13),i=n(2),s=n(3).f,a=0,u=Object.isExtensible||function(){return!0},c=!n(11)(function(){return u(Object.preventExtensions({}))}),f=function(e){s(e,r,{value:{i:"O"+ ++a,w:{}}})},l=function(e,t){if(!o(e))return"symbol"==typeof e?e:("string"==typeof e?"S":"P")+e;if(!i(e,r)){if(!u(e))return"F";if(!t)return"E";f(e)}return e[r].i},d=function(e,t){if(!i(e,r)){if(!u(e))return!0;if(!t)return!1;f(e)}return e[r].w},h=function(e){return c&&p.NEED&&u(e)&&!i(e,r)&&f(e),e},p=e.exports={KEY:r,NEED:!1,fastKey:l,getWeak:d,onFreeze:h}},function(e,t,n){var r=n(17),o=n(31),i=n(18);e.exports=function(e){var t=r(e),n=o.f;if(n)for(var s,a=n(e),u=i.f,c=0;a.length>c;)u.call(e,s=a[c++])&&t.push(s);return t}},function(e,t,n){var r=n(37);e.exports=Array.isArray||function(e){return"Array"==r(e)}},function(e,t,n){var r=n(7),o=n(39).f,i={}.toString,s="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],a=function(e){try{return o(e)}catch(e){return s.slice()}};e.exports.f=function(e){return s&&"[object Window]"==i.call(e)?a(e):o(r(e))}},function(e,t){},function(e,t,n){n(29)("asyncIterator")},function(e,t,n){n(29)("observable")},,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,function(e,t,n){"use strict";(function(e,t){function r(e,t){return void 0===e||null===e?t:"true"===e||"false"!==e&&e}var o=n(5),i=function(e){return e&&e.__esModule?e:{default:e}}(o);if(n(108),window.SiteModelStart=function(e){var t={resizeDelay:r(e.resizeDelay,100),hasCJS:r(e.hasCJS,!0),hasCJSModel:r(e.hasCJSModel,!0),hasCJSLoad:r(e.hasCJSLoad,!1),hasCJSWebGL:r(e.hasCJSWebGL,!1),cjsLoadData:r(e.cjsLoadData,void 0),cjsBox:r(e.cjsBox,"#cjsBox"),hasPixiJs:r(e.hasPixiJs,!1),hasPixiJsModel:r(e.hasPixiJsModel,!1),pixiBox:r(e.pixiBox,"#pixiBox"),hasThreeJs:r(e.hasThreeJs,!1),hasThreeJsModel:r(e.hasThreeJsModel,!1),threejsBox:r(e.threejsBox,"#threejsBox"),initLoadPanel:r(e.initLoadPanel,void 0),showProgress:r(e.showProgress,void 0),hitLoadPanel:r(e.hitLoadPanel,void 0),audioConfig:r(e.audioConfig,void 0),baseUrl:r(e.baseUrl,"./js/edslibs/base.js"),cjsUrl:r(e.cjsUrl,"./js/edslibs/createjsFrameWork.js"),threeUrl:r(e.threeUrl,"./js/libs/three.min.js"),pixiUrl:r(e.threeUrl,"./js/libs/pixijs.min.js"),otherjs:r(e.otherjs,[]),baseEnd:r(e.baseEnd,void 0)},n=r(e.base,""),o=r(e.type,"v");window.SiteModel=new ds.core.SiteModelByMobile(n+e.url,o,t),window.SiteModel.start()},void 0!==window.SiteConfig)window.SiteModelStart(window.SiteConfig);else{var s=document.getElementById("screen"),a={};if(s&&s.getAttribute("data-example"))a.url=s.getAttribute("data-example"),a.hasCJS=r(s.getAttribute("data-hasCJS"),!0),a.hasCJSModel=r(s.getAttribute("data-hasCJSModel"),!0),a.hasCJSLoad=r(s.getAttribute("data-hasCJSLoad"),!1),a.hasCJSWebGL=r(s.getAttribute("data-hasCJSWebGL"),!1),a.hasThreeJs=r(s.getAttribute("data-hasThreeJs"),!1),a.hasThreeJsModel=r(s.getAttribute("data-hasThreeJsModel"),!1),a.hasPixiJs=r(s.getAttribute("data-hasPixiJs"),!1),a.hasPixiJsModel=r(s.getAttribute("data-hasPixiJsModel"),!1),(a.hasThreeJs||a.hasThreeJsModel||a.hasPixiJs||a.hasPixiJsModel)&&(a.otherjs||(a.otherjs=[]),(a.hasThreeJs||a.hasThreeJsModel)&&a.otherjs.push("./js/edslibs/extend_threejs.js"),(a.hasPixiJs||a.hasPixiJsModel)&&a.otherjs.push("./js/edslibs/extend_pixijs.js")),SiteModelStart(a);else if(s&&s.getAttribute("data-config")){var u=r(s.getAttribute("data-mode"),"default"),c=function(e){if(e.indexOf("http:")>=0||e.indexOf("https:")>=0)return e;var t=document.createElement("a");return t.href=e,e=t.href}(s.getAttribute("data-config"));ds.core.SiteModelByMobile.getScript(c,function(){if(!window.SiteConfig)return void console.warn("请配置简易单页");u=r(SiteConfig.mode,u),SiteConfig.mode=u,SiteConfig.url="js/edslibs/DefaultMain.js",SiteModelStart(SiteConfig)})}else console.warn("请在页面上配置你的单页面逻辑代码")}var f="undefined"!=typeof window?window:"object"===(void 0===e?"undefined":(0,i.default)(e))&&"object"===(void 0===t?"undefined":(0,i.default)(t))?t:void 0;f.eds=f.eds||{}}).call(t,n(14),n(10))},function(e,t,n){"use strict";(function(r,o){var i,s,a=n(5),u=function(e){return e&&e.__esModule?e:{default:e}}(a);!function(a){var c="undefined"!=typeof window?window:"object"===(void 0===r?"undefined":(0,u.default)(r))&&"object"===(void 0===o?"undefined":(0,u.default)(o))?o:this;i=[t],void 0!==(s=function(t){n(109),e.exports=a(c,t)}.apply(t,i))&&(e.exports=s)}(function(e,t){function r(t,r,a){function u(){var e;(e=a.initLoadPanel?a.initLoadPanel:m.isCJSLoad?m.loadModel.initCreateJsLoadPanel:m.loadModel.initDOMLoadPanel)(c)}function c(){!m.isCJSLoad&&a.hasCJS?(m.showProgress(5),d()):f()}function f(){m.showProgress(10),t&&("string"==typeof t?m.getScript(t,function(){m.ds&&m.ds("spaEnd")}):t())}function l(){var e=a.baseUrl||"./js/edslibs/base.js";m.getScript(e,function(){s.core.EventDispatcher.extend(m),p(),v(),a.baseEnd&&a.baseEnd(),m.ds&&m.ds("baseEnd"),a.hasCJS&&m.isCJSLoad?d():u()})}function d(){var e=a.cjsUrl||"./js/edslibs/createjsFrameWork.js";m.getScript(e,function(){m.ds&&m.ds("createjsEnd"),a.hasCJSModel&&h(),m.isCJSLoad?u():f()})}function h(){m.createJsModel=s.createjs.create({hasGL:a.hasCJSWebGL,appendTo:void 0!==a.cjsBox?$(a.cjsBox):$("#cjsBox")[0],width:640,height:1235,fps:30}),m.ds&&m.ds("cjsModelBuild")}function p(){s.media&&new s.media.AutoAudioManager&&(m.audioer=new s.media.AutoAudioManager,a.audioConfig&&m.audioer.initConfigData(a.audioConfig))}function v(){var e=a.screen||"#screen";m.screen=$(e),m.resizeModel=new s.core.MoblieResizeModel({screen:m.screen[0],type:S,delay:a.resizeDelay||100}),"auto"!==m.resizeModel.type&&m.resizeModel.createOrientationTip(),m.resizeModel.on("resize",y),m.resizeModel.initResize(),m.screen.show()}function y(e){"auto"===m.resizeModel.type&&m.createJsModel&&(640===m.resizeModel.screenWidth?m.createJsModel.size(m.resizeModel.screenWidth,1140):m.createJsModel.size(m.resizeModel.screenWidth,640)),m.resizeModel.isInputState||setTimeout(function(){m.screen.scrollTop(0)},30),m.ds(e)}function g(){s.pixijs&&s.pixijs.create&&(a.pixiBox=void 0!==a.pixiBox?$(a.pixiBox)[0]:$("#pixiBox")[0],m.pixiJsModel=s.pixijs.create({appendTo:a.pixiBox,width:640,height:1235,fps:30}),s.pixijs.domAuto=!0,m.ds&&m.ds("pixiJsModelBuild"))}function b(){s.threejs&&s.threejs.create&&(a.threejsBox=void 0!==a.threejsBox?$(a.threejsBox)[0]:$("#threejsBox")[0],SiteModel.threeJsModel=s.threejs.create({width:640,height:1235,resizeType:"fixed2",hasModelAnimate:!0,intersect:!0,intersectDom:a.threejsBox,appendTo:a.threejsBox}),m.ds&&m.ds("threeJsModelBuild"))}if(!e.SiteModel){e.SiteModel=this;var S=r||"v",m=this;a=a||{},this.config=a,this.getScript=o,this.getScriptList=i,this.cjsLoadData=a.cjsLoadData,this.loadModel=new s.net.SiteLoadModel,this.isCJSLoad=!1,a.hasCJSLoad&&(this.isCJSLoad=!0),this.loadPanel=null,this.devicer=n(110),this.isWeixin=this.devicer.isWeixin,this.isIOS=this.devicer.isIOS,this.isMobile=this.devicer.isMobile;var x=!1;-1!==location.href.indexOf(":800")&&(x=!0),-1!==location.href.indexOf(":300")&&(x=!0),Object.defineProperty(this,"debug",{get:function(){return x}}),this.audioer=null,this.resizeModel=null,this.screen=null,this.createJsModel=null,this.pixiJsModel=null,this.threeJsModel=null,this.appMain=null,this.pager=null,this.gotoPage=function(e){m.pager&&m.pager.pageLabel!==e&&(m.pager.gotoPage(e),s.net&&s.net.pv&&s.net.pv(e))},this.getPage=function(e){if(m.pager&&m.pager.getPage)return m.pager.getPage(e)},this.apier=null,this.shareModel=null,this.start=function(){l()};var M=a.showProgress||this.loadModel.showProgress,j=a.hitLoadPanel||this.loadModel.hitLoadPanel;this.showProgress=function(e){M&&M(e)},this.hitLoadPanel=function(e){j&&j(e)},this.beforeSinglePageApplicationLoadAssets=function(e){var t,n=[];if((a.hasThreeJs||a.hasThreeJsModel)&&(t=a.threeUrl||"./js/libs/three.min.js",n.push(t)),(a.hasPixiJs||a.hasPixiJsModel)&&(t=a.pixiUrl||"./js/libs/pixijs.min.js",n.push(t)),a.otherjs&&a.otherjs.length>=0)for(var r=a.otherjs,o=0;o<r.length;o++)t=r[o],n.push(t);m.ds&&m.ds("otherJsStart"),m.getScriptList(n,function(){a.hasPixiJsModel&&g(),a.hasThreeJsModel&&b(),m.ds&&m.ds("otherJsEnd"),e&&e()})},this.resize=function(){this.resizeModel&&this.resizeModel.resize()},document.addEventListener("touchmove",function(e){e.cancelable&&(e.defaultPrevented||e.preventDefault())},!1)}}function o(e,t){var n=document.createElement("script");n.setAttribute("type","text/javascript"),n.onreadystatechange?n.onreadystatechange=function(){"loaded"!=this.readyState&&"complete"!=this.readyState||t&&t()}:n.onload=function(){t&&t()},document.getElementsByTagName("head")[0].appendChild(n),n.src=e}function i(e,t){function n(){if(++r>=e.length)return void(t&&t());o(e[r],n)}if(!e||e.length<=0)return void(t&&t());var r=-1;n()}r.getScript=o,r.getScriptList=i;var s=e.ds=e.ds||{};return s.core=s.core||{},s.core.SiteModelByMobile=r,s.core.SiteModelByMobile})}).call(t,n(14),n(10))},function(e,t,n){"use strict";(function(r,o){var i,s,a=n(5),u=function(e){return e&&e.__esModule?e:{default:e}}(a);!function(n){var a="undefined"!=typeof window?window:"object"===(void 0===r?"undefined":(0,u.default)(r))&&"object"===(void 0===o?"undefined":(0,u.default)(o))?o:this;i=[t],void 0!==(s=function(t){e.exports=n(a,t)}.apply(t,i))&&(e.exports=s)}(function(e,t){function n(){this.showProgress=function(e){var t=SiteModel.loadPanel;t instanceof HTMLElement||t.length>=1&&t[0]instanceof HTMLElement?(e>=100&&(e=100),$("#siteLoadPanel .progress").css({width:e+"%"}),$("#siteLoadPanel .label").html(e+"%")):void 0!==window.createjs&&t instanceof createjs.DisplayObject&&(t instanceof createjs.MovieClip&&t.gotoAndStop(e>=99?99:e),t.label&&(t.label.text=e<10?"0"+e+"%":e+"%"))},this.hitLoadPanel=function(e){var t=SiteModel.loadPanel;t&&(t instanceof HTMLElement||t.length>=1&&t[0]instanceof HTMLElement?$(t).hide():void 0!==window.createjs&&t instanceof createjs.DisplayObject&&(window.JT?JT.to(t,.5,{alpha:0,onEnd:function(){t.parent&&t.parent.removeChild(t)}}):t.parent&&t.parent.removeChild(t)))},this.initDOMLoadPanel=function(e){SiteModel.loadPanel=$("#siteLoadPanel"),SiteModel.loadPanel.show(),e&&e()},this.initCreateJsLoadPanel=function(e){function t(t){SiteModel&&(i&&i.className?SiteModel.loadPanel=new window[n.jsNS][i.className]:SiteModel.loadPanel=new loadlib.LoadPanel,SiteModel.createJsModel.stage.addChild(SiteModel.loadPanel),SiteModel.loadPanel.gotoAndStop(0),SiteModel.resize()),e&&e()}$("#siteLoadPanel").hide();var n={complete:t},i=SiteModel.cjsLoadData||{};n.basePath=r(i.basePath,"./assets/"),n.jsUrl=r(i.jsUrl,"loading.js"),n.jsNS=r(i.jsNS,"loadlib"),n.imgNS=r(i.imgNS,"loadimages"),n.loadType=r(i.loadType,!0),n.crossOrigin=r(i.crossOrigin,!0),o.createjs.loadAssets(n)},this.loadCJS=function(e,t,n,i){i=i||{};var s;"string"==typeof n?s=n.split(","):n instanceof Array&&(s=n);var a,u=0,c=100;s&&(u=Number(s[0]),c=Number(s[1])),a=c-u;var f={basePath:r(i.basePath,"./assets/"),jsUrl:e,jsNS:r(i.jsNS,"lib"),imgNS:r(i.imgNS,"images"),loadType:r(i.loadType,!0),crossOrigin:r(i.crossOrigin,!1),otherList:r(i.otherList,[]),complete:function(e){t&&t()},progress:function(e){i.progress&&i.progress(e),SiteModel.showProgress(u+(a*e.target.progress>>0))}};o.createjs&&o.createjs.loadAssets(f)}}function r(e,t){return void 0===e||null===e?t:"true"===e||"false"!==e&&e}var o=e.ds=e.ds||{};return o.net=o.net||{},o.net.SiteLoadModel=n,o.net.SiteLoadModel})}).call(t,n(14),n(10))},function(e,t,n){"use strict";(function(r,o){var i,s,a=n(5),u=function(e){return e&&e.__esModule?e:{default:e}}(a);!function(n){var a="undefined"!=typeof window?window:"object"===(void 0===r?"undefined":(0,u.default)(r))&&"object"===(void 0===o?"undefined":(0,u.default)(o))?o:this;i=[t],void 0!==(s=function(t){e.exports=n(a,t)}.apply(t,i))&&(e.exports=s)}(function(e,t){var n=e.ds=e.ds||{};n.gemo=n.gemo||{},n.gemo.Devicer=t;var r=navigator.userAgent,o=!1;"micromessenger"==r.toLowerCase().match(/MicroMessenger/i)&&(o=!0);var i=r.indexOf("Android")>-1||r.indexOf("Adr")>-1,s=!!r.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),a="ipad"==r.match(/ipad/i),u="midp"==r.match(/midp/i),c="rv:1.2.3.4"==r.match(/rv:1.2.3.4/i),f="ucweb"==r.match(/ucweb/i),l="windows ce"==r.match(/windows ce/i),d="windows mobile"==r.match(/windows mobile/i),h=!0;return h=!!(i||s||a||u||c||f||l||d),t.isWeixin=o,t.isAndroid=i,t.isIOS=s,t.isIpad=a,t.isMidp=u,t.isUc7=c,t.isUc=f,t.isCE=l,t.isWM=d,t.isMobile=h,t.isPc=!h,n.gemo.Devicer})}).call(t,n(14),n(10))}]);