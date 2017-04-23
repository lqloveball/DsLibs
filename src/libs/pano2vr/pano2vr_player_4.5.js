/*
Pano2VR pro 4.5.3/10717 HTML5/CSS3 & WebGL Panorama Player
License:
(c) 2015, Garden Gnome Software, http://ggnome.com
*/
(function() {
    var l = !0,
        o = null,
        r = !1;

    function P(h, q, p, H, B) {
        var m = this;
        m.x = h;
        m.y = q;
        m.e = p;
        m.I = H;
        m.n = B;
        m.q = function(h, p, q) {
            m.x = h;
            m.y = p;
            m.e = q;
            m.I = void 0;
            m.n = void 0
        };
        m.toString = function() {
            return "(" + m.x + "," + m.y + "," + m.e + ") - (" + m.I + "," + m.n + ")"
        };
        m.k = function(h) {
            var p = Math.sin(h),
                h = Math.cos(h),
                q = m.y,
                B = m.e;
            m.y = h * q - p * B;
            m.e = p * q + h * B
        };
        m.l = function(h) {
            var p = Math.sin(h),
                h = Math.cos(h),
                q = m.x,
                B = m.e;
            m.x = h * q + p * B;
            m.e = -p * q + h * B
        };
        m.B = function(h) {
            var p = Math.sin(h),
                h = Math.cos(h),
                q = m.x,
                B = m.y;
            m.x = h * q - p * B;
            m.y = p * q + h * B
        };
        m.La = function() {
            return new P(m.x, m.y, m.e, m.I, m.n)
        };
        m.length = function() {
            return Math.sqrt(m.x * m.x + m.y * m.y + m.e * m.e)
        };
        m.wa = function(h) {
            return m.x * h.x + m.y * h.y + m.e * h.e
        };
        m.Oa = function(h, p) {
            var q;
            q = Math.cos(p * Math.PI / 180);
            m.x = q * Math.sin(h * Math.PI / 180);
            m.y = Math.sin(p * Math.PI / 180);
            m.e = q * Math.cos(h * Math.PI / 180)
        };
        m.bb = function(h, p, q) {
            m.x = h.x * q + p.x * (1 - q);
            m.y = h.y * q + p.y * (1 - q);
            m.e = h.e * q + p.e * (1 - q);
            m.I = h.I * q + p.I * (1 - q);
            m.n = h.n * q + p.n * (1 - q)
        }
    }
    glMatrixArrayType = "undefined" != typeof Float32Array ? Float32Array : "undefined" != typeof WebGLFloatArray ? WebGLFloatArray : Array;

    function ua(h) {
        h[0] = 1;
        h[1] = 0;
        h[2] = 0;
        h[3] = 0;
        h[4] = 0;
        h[5] = 1;
        h[6] = 0;
        h[7] = 0;
        h[8] = 0;
        h[9] = 0;
        h[10] = 1;
        h[11] = 0;
        h[12] = 0;
        h[13] = 0;
        h[14] = 0;
        h[15] = 1
    }

    function Ib(h, q, p) {
        var H, B = p[0],
            m = p[1],
            p = p[2],
            X = Math.sqrt(B * B + m * m + p * p);
        if (X) {
            1 != X && (X = 1 / X,
                B *= X,
                m *= X,
                p *= X);
            var wa = Math.sin(q),
                Va = Math.cos(q),
                oa = 1 - Va,
                q = h[0],
                X = h[1],
                rb = h[2],
                Wa = h[3],
                Da = h[4],
                Xa = h[5],
                ha = h[6],
                Ya = h[7],
                Ea = h[8],
                Za = h[9],
                $a = h[10],
                ab = h[11],
                Na = B * B * oa + Va,
                bb = m * B * oa + p * wa,
                cb = p * B * oa - m * wa,
                Oa = B * m * oa - p * wa,
                db = m * m * oa + Va,
                eb = p * m * oa + B * wa,
                fb = B * p * oa + m * wa,
                B = m * p * oa - B * wa,
                m = p * p * oa + Va;
            H ? h != H && (H[12] = h[12],
                H[13] = h[13],
                H[14] = h[14],
                H[15] = h[15]) : H = h;
            H[0] = q * Na + Da * bb + Ea * cb;
            H[1] = X * Na + Xa * bb + Za * cb;
            H[2] = rb * Na + ha * bb + $a * cb;
            H[3] = Wa * Na + Ya * bb + ab * cb;
            H[4] = q * Oa + Da * db + Ea * eb;
            H[5] = X * Oa + Xa * db + Za * eb;
            H[6] = rb * Oa + ha * db + $a * eb;
            H[7] = Wa * Oa + Ya * db + ab * eb;
            H[8] = q * fb + Da * B + Ea * m;
            H[9] = X * fb + Xa * B + Za * m;
            H[10] = rb * fb + ha * B + $a * m;
            H[11] = Wa * fb + Ya * B + ab * m
        }
    }

    function ac(h, q, p) {
        var h = 0.1 * Math.tan(h * Math.PI / 360),
            q = h * q,
            H = -q,
            B = -h;
        p || (p = new glMatrixArrayType(16));
        var m = q - H,
            X = h - B;
        p[0] = 0.2 / m;
        p[1] = 0;
        p[2] = 0;
        p[3] = 0;
        p[4] = 0;
        p[5] = 0.2 / X;
        p[6] = 0;
        p[7] = 0;
        p[8] = (q + H) / m;
        p[9] = (h + B) / X;
        p[10] = -100.1 / 99.9;
        p[11] = -1;
        p[12] = 0;
        p[13] = 0;
        p[14] = -20 / 99.9;
        p[15] = 0
    }

    function Mc() {
        var h = "perspective",
            q = ["Webkit", "Moz", "O", "ms", "Ms"],
            p;
        p = r;
        for (p = 0; p < q.length; p++)
            "undefined" !== typeof document.documentElement.style[q[p] + "Perspective"] && (h = q[p] + "Perspective");
        "undefined" !== typeof document.documentElement.style[h] ? "webkitPerspective" in document.documentElement.style ? (h = document.createElement("style"),
            q = document.createElement("div"),
            p = document.head || document.getElementsByTagName("head")[0],
            h.textContent = "@media (-webkit-transform-3d) {#ggswhtml5{height:5px}}",
            p.appendChild(h),
            q.id = "ggswhtml5",
            document.documentElement.appendChild(q),
            p = 5 === q.offsetHeight,
            h.parentNode.removeChild(h),
            q.parentNode.removeChild(q)) : p = l : p = r;
        return p
    }

    function Nc() {
        var h;
        if (h = !!window.WebGLRenderingContext)
            try {
                var q = document.createElement("canvas");
                q.width = 100;
                q.height = 100;
                var p = q.getContext("webgl");
                p || (p = q.getContext("experimental-webgl"));
                h = p ? l : r
            } catch (H) {
                h = r
            }
        return h
    }

    function pano2vrPlayer(h) {
        function q(a) {
            var d, c;
            c = [];
            d = a.getAttributeNode("title");
            c.title = d ? d.nodeValue.toString() : "";
            d = a.getAttributeNode("description");
            c.description = d ? d.nodeValue.toString() : "";
            d = a.getAttributeNode("author");
            c.author = d ? d.nodeValue.toString() : "";
            d = a.getAttributeNode("datetime");
            c.datetime = d ? d.nodeValue.toString() : "";
            d = a.getAttributeNode("copyright");
            c.copyright = d ? d.nodeValue.toString() : "";
            d = a.getAttributeNode("source");
            c.source = d ? d.nodeValue.toString() : "";
            d = a.getAttributeNode("info");
            c.information = d ? d.nodeValue.toString() : "";
            d = a.getAttributeNode("comment");
            c.comment = d ? d.nodeValue.toString() : "";
            d = a.getAttributeNode("latitude");
            c.latitude = d ? 1 * d.nodeValue : "0.0";
            d = a.getAttributeNode("longitude");
            c.longitude = d ? 1 * d.nodeValue : "0.0";
            if (d = a.getAttributeNode("tags")) {
                a = d.nodeValue.toString().split("|");
                for (d = 0; d < a.length; d++)
                    "" == a[d] && (a.splice(d, 1),
                        d--);
                c.tags = a
            } else
                c.tags = [];
            return c
        }

        function p(a) {
            Jb = "{" == a.charAt(0) ? a.substr(1, a.length - 2) : "";
            b.skinObj && b.skinObj.changeActiveNode && b.skinObj.changeActiveNode(a)
        }

        function H(a) {
            return function() {
                b.dirty = l;
                b.Na = l;
                a.d && (a.a && a.a.complete ? (a.loaded = l,
                    a.d.drawImage(a.a, 0, 0, a.width, a.height),
                    a.a = o,
                    a.A = o) : a.A && a.A.complete && !a.loaded && (a.d.drawImage(a.A, 0, 0, a.width, a.height),
                    a.A = o))
            }
        }

        function B(a) {
            for (var d = 0; d < C.length; d++)
                if (C[d].id == a)
                    return C[d];
            for (d = 0; d < y.length; d++)
                if (y[d].id == a)
                    return y[d];
            for (d = 0; d < fa.length; d++)
                if (fa[d].id == a)
                    return fa[d];
            return o
        }

        function m(a) {
            try {
                a.obj = document.createElement("img");
                a.obj.setAttribute("style", "-webkit-user-drag:none; max-width:none;");
                a.obj.setAttribute("class", "ggmedia");
                b.X && a.obj.setAttribute("id", b.X + a.id);
                a.obj.ondragstart = function() {
                    return r
                };
                if (1 == a.u || 4 == a.u)
                    a.o = function() {
                        a.W(!a.v)
                    },
                    a.ea = function() {
                        a.oa = r;
                        a.obj.style[xa] = "none"
                    },
                    a.W = function(c) {
                        a.v = c;
                        a.obj.style.zIndex = a.v ? 8E4 : 0;
                        a.obj.style[xa] = "all 1s ease 0s";
                        a.oa = l;
                        bc()
                    },
                    a.obj.addEventListener(wa(), a.ea, r),
                    a.obj.addEventListener("transitionend", a.ea, r);
                a.obj.setAttribute("src", pa(a.url));
                a.z && (a.obj.width = a.z);
                a.D && (a.obj.height = a.D);
                fa.push(a);
                a.obj.style.position = "absolute";
                a.o && (a.obj.onclick = a.o);
                s.appendChild(a.obj)
            } catch (d) {}
        }

        function X(a) {
            try {
                a.obj = document.createElement("video");
                a.obj.setAttribute("class", "ggmedia");
                b.X && a.obj.setAttribute("id", b.X + a.id);
                a.obj.setAttribute("style", "max-width:none;");
                if (1 == a.u || 4 == a.u)
                    a.o = function() {
                        a.W(!a.v)
                    },
                    a.ea = function() {
                        a.oa = r;
                        a.obj.style[xa] = "none"
                    },
                    a.W = function(c) {
                        a.v = c;
                        a.v ? (a.obj.style.zIndex = 8E4,
                            a.obj.style[xa] = "all 1s ease 0s",
                            b.playSound(a.id)) : (a.obj.style.zIndex = 0,
                            a.obj.style[xa] = "all 1s ease 0s");
                        a.oa = l;
                        bc()
                    },
                    a.obj.addEventListener(wa(), a.ea, r),
                    a.obj.addEventListener("transitionend", a.ea, r);
                2 == a.u && (a.o = function() {
                        b.playPauseSound(a.id)
                    },
                    a.W = function(c) {
                        c ? b.playSound(a.id) : b.pauseSound(a.id)
                    }
                );
                var d;
                for (d = 0; d < a.url.length; d++) {
                    var c;
                    c = document.createElement("source");
                    c.setAttribute("src", pa(a.url[d]));
                    a.obj.appendChild(c)
                }
                "" != a.poster && (a.obj.poster = pa(a.poster),
                    0 > a.loop && (a.obj.jb = "none"));
                a.obj.volume = a.i * Y;
                0 == a.loop && (a.obj.r = 1E7);
                1 <= a.loop && (a.obj.r = a.loop - 1);
                if ((1 == a.mode || 2 == a.mode || 3 == a.mode || 5 == a.mode) && 0 <= a.loop)
                    a.obj.autoplay = l;
                y.push(a);
                a.obj.style.position = "absolute";
                a.z && (a.obj.width = a.z);
                a.D && (a.obj.height = a.D);
                s.appendChild(a.obj);
                a.o && (a.obj.onclick = a.o);
                a.Ra = l;
                a.obj.addEventListener("ended", function() {
                    if (0 < this.r)
                        return this.r--,
                            this.currentTime = 0,
                            this.play(),
                            l;
                    this.Ra = r
                }, r)
            } catch (f) {}
        }

        function wa() {
            var a, d = document.createElement("fakeelement"),
                c = {
                    OTransition: "oTransitionEnd",
                    MSTransition: "msTransitionEnd",
                    MozTransition: "transitionend",
                    WebkitTransition: "webkitTransitionEnd",
                    transition: "transitionEnd"
                };
            for (a in c)
                if (void 0 !== d.style[a])
                    return c[a]
        }

        function Va(a) {
            var d = -1;
            try {
                for (var c = 0; c < C.length; c++)
                    C[c].id == a.id && C[c].obj != o && C[c].url.join() == a.url.join() && C[c].loop == a.loop && C[c].mode == a.mode && (d = c);
                if (-1 == d) {
                    for (c = 0; c < C.length; c++)
                        if (C[c].id == a.id && C[c].obj != o) {
                            try {
                                C[c].obj.pause()
                            } catch (f) {}
                            try {
                                C[c].obj.parentElement.removeChild(C[c].obj),
                                    delete C[c].obj,
                                    C[c].obj = o
                            } catch (e) {}
                            d = c
                        }
                    a.obj = document.createElement("audio");
                    a.obj.setAttribute("class", "ggmedia");
                    b.X && a.obj.setAttribute("id", b.X + a.id);
                    for (c = 0; c < a.url.length; c++) {
                        var g;
                        g = document.createElement("source");
                        "" != a.url[c] && "#" != a.url[c] && (g.setAttribute("src", pa(a.url[c])),
                            a.obj.appendChild(g))
                    }
                    a.obj.volume = a.i * Y;
                    0 == a.loop && (a.obj.r = 1E7);
                    1 <= a.loop && (a.obj.r = a.loop - 1);
                    if ((1 == a.mode || 2 == a.mode || 3 == a.mode || 5 == a.mode) && 0 <= a.loop)
                        a.obj.autoplay = l;
                    0 <= d ? C[d] = a : C.push(a);
                    0 < a.obj.childNodes.length && (b.c.appendChild(a.obj),
                        a.obj.addEventListener("ended", function() {
                            if (0 < this.r)
                                return this.r--,
                                    this.currentTime = 0,
                                    this.play(),
                                    l
                        }, r))
                }
            } catch (F) {}
        }

        function oa() {
            var a;
            aa = document.createElement("div");
            aa.innerHTML = Kd("PGRpdiBzdHlsZT0icG9zaXRpb246IHJlbGF0aXZlOyBsZWZ0OiAwcHg7IHJpZ2h0OiAwcHg7IHRvcDogNDAlOyBib3R0b206IDYwJTsgbWFyZ2luOiBhdXRvOyB3aWR0aDogMThlbTsgaGVpZ2h0OiA0ZW07IGJvcmRlcjogM3B4IHNvbGlkICM1NTU7IGJveC1zaGFkb3c6IDVweCA1cHggMTBweCAjMzMzOyBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTsgZGlzcGxheTogdGFibGU7IGZvbnQtZmFtaWx5OiBWZXJkYW5hLCBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmOyBmb250LXNpemU6IDEwcHQ7IG9wYWNpdHk6IDAuOTU7IGJvcmRlci1yYWRpdXM6IDE1cHg7Ij48cCBzdHlsZT0idGV4dC1hbGlnbjogY2VudGVyOyBkaXNwbGF5OiB0YWJsZS1jZWxsOyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlOyAiPkNyZWF0ZWQgd2l0aCA8YSBocmVmPSJodHRwOi8vcGFubzJ2ci5jb20vIiB0YXJnZXQ9Il9ibGFuayI+UGFubzJWUjwvYT48L3A+PC9kaXY+");
            a = "top:  0px;left: 0px;width: 100px;height: 100px;overflow: hidden;z-index: 5000;position:relative;";
            sb && !ga && (a += I + "transform: translateZ(99999999px);");
            aa.setAttribute("style", a);
            b.c.insertBefore(aa, b.c.firstChild);
            aa.style.width = 0 + Z + cc + z + "px";
            aa.style.height = 0 + ba + dc + t + "px";
            aa.onclick = function() {
                aa && (b.c.removeChild(aa),
                    aa = o)
            };
            aa.oncontextmenu = aa.onclick
        }

        function rb() {
            var a;
            a = new P;
            a.Oa(u, x);
            for (var d = 0; d < C.length + y.length; d++) {
                var c;
                c = d < C.length ? C[d] : y[d - C.length];
                if (c.obj) {
                    var b;
                    b = c.pan - u;
                    for (var e = c.tilt - x; - 180 > b;)
                        b += 360;
                    for (; 180 < b;)
                        b -= 360;
                    var g = c.ca,
                        F = c.field;
                    0 == F && (F = 0.01);
                    0 > F && (F = A);
                    c.n || (c.n = new P,
                        c.n.Oa(c.pan, c.tilt));
                    if (3 == c.mode) {
                        b = Math.abs(b);
                        b = b < c.s ? 0 : b - c.s;
                        var k = c.i,
                            e = Math.abs(e),
                            e = e < c.N ? 0 : e - c.N,
                            n = 1 - e / F;
                        if (Math.abs(b) > F || 0 > n)
                            c.obj.volume = k * g * Y;
                        else {
                            var h = 1 - Math.abs(b / F);
                            c.obj.volume = k * (g + (1 - g) * n * h) * Y
                        }
                    }
                    4 == c.mode && c.hb == o && (Math.abs(b) < c.s && Math.abs(e) < c.N ? c.ha || (c.ha = l,
                        c.obj.play()) : c.ha = r);
                    5 == c.mode && (b = 180 * Math.acos(a.wa(c.n)) / Math.PI,
                        b < c.s ? c.obj.volume = c.i * Y : (b -= c.s,
                            b < F && 0 < F ? (h = 1 - Math.abs(b / F),
                                c.obj.volume = c.i * (g + (1 - g) * h) * Y) : c.obj.volume = g * Y));
                    6 == c.mode && (b = 180 * Math.acos(a.wa(c.n)) / Math.PI,
                        Math.abs(b) < c.s ? c.ha || (c.ha = l,
                            c.obj.play()) : c.ha = r)
                }
            }
        }

        function Wa() {
            setTimeout(function() {
                b.setFullscreen(r)
            }, 10);
            setTimeout(function() {
                b.setFullscreen(r)
            }, 100)
        }

        function Da() {
            var a = new Date;
            ec = 0;
            fc && (b.setViewerSize(b.da.offsetWidth, b.da.offsetHeight),
                fc = r,
                Oc());
            0 <= Q && (Pa ? (qa = 0.4 * (Fa - tb),
                    ra = 0.4 * (Ga - ub),
                    tb += qa,
                    ub += ra) : (qa = 0.1 * -vb * gb / 8,
                    ra = 0.1 * -wb * gb / 8),
                Pc(qa, ra),
                b.update());
            xb && (b.changeFov(0.4 * (V - A)),
                0.001 > Math.abs(V - A) / A && (xb = r),
                b.update());
            if (gc && (0 != qa || 0 != ra) && 0 > Q)
                qa *= 0.9,
                ra *= 0.9,
                0.1 > qa * qa + ra * ra ? ra = qa = 0 : (Pc(qa, ra),
                    b.update());
            if (0 != Qa) {
                var d = gb / 8;
                switch (Qa) {
                    case 37:
                        b.changePan(d * ha(), l);
                        break;
                    case 38:
                        b.changeTilt(d * ha(), l);
                        break;
                    case 39:
                        b.changePan(-d * ha(), l);
                        break;
                    case 40:
                        b.changeTilt(-d * ha(), l);
                        break;
                    case 43:
                    case 107:
                    case 16:
                        b.changeFovLog(-d, l);
                        break;
                    case 17:
                    case 18:
                    case 109:
                    case 45:
                    case 91:
                        b.changeFovLog(d, l)
                }
                b.update()
            }
            if (!b.isLoaded && b.hasConfig) {
                var c = 0,
                    f = b.checkLoaded.length;
                if (yb)
                    f = 50,
                    hc < f && hc++,
                    c = hc;
                else
                    for (d = 0; d < f; d++)
                        b.checkLoaded[d].complete && "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYBgeACDAAADIAAE3iTbkAAAAAElFTkSuQmCC" != b.checkLoaded[d].src && c++;
                c == f ? (Kb = 1,
                    b.isLoaded = l,
                    b.divSkin && b.divSkin.ggLoaded && b.divSkin.ggLoaded()) : Kb = c / (1 * f)
            }
            for (; 360 < u;)
                u -= 360;
            for (; - 360 > u;)
                u += 360;
            if (zb) {
                G = ic - u;
                if (360 == hb - ib) {
                    for (; - 180 > G;)
                        G += 360;
                    for (; 180 < G;)
                        G -= 360
                }
                O = jc - x;
                N = kc - A;
                d = Qc * ha();
                c = Math.sqrt(G * G + O * O + N * N);
                if (10 * c < d) {
                    if (zb = r,
                        N = O = G = 0,
                        b.onMoveComplete)
                        b.onMoveComplete()
                } else
                    c = c > 5 * d ? d / c : 0.2,
                    G *= c,
                    O *= c,
                    N *= c;
                u += G;
                x += O;
                A += N;
                lc = a.getTime();
                b.update()
            } else if (ia)
                if (d = a.getTime() - jb,
                    0 < mc && b.Ba && d >= 1E3 * mc) {
                    if (1 < va.length) {
                        if (Rc) {
                            d = 1E3;
                            do
                                c = va[Math.floor(Math.random() * va.length)];
                            while (d-- && c == Jb)
                        } else
                            d = va.indexOf(Jb),
                            d++,
                            d >= va.length && (d = 0),
                            c = va[d];
                        jb = a.getTime();
                        b.openNext("{" + c + "}")
                    }
                } else
                    O = Lb * (0 - x) / 100,
                    N = Lb * (Mb - A) / 100,
                    G = 0.95 * G + 0.05 * -Ra * ha(),
                    u += G,
                    x += O,
                    A += N,
                    b.update();
            else {
                if (Ab && 0 > Q && a.getTime() - lc > 1E3 * nc && (oc && b.isLoaded || !oc))
                    ia = l,
                    jb = a.getTime(),
                    N = O = G = 0;
                if (gc && 0 == Qa && 0 > Q && (0 != G || 0 != O || 0 != N))
                    G *= 0.9,
                    O *= 0.9,
                    N *= 0.9,
                    u += G,
                    x += O,
                    b.changeFovLog(N),
                    1.0E-4 > G * G + O * O + N * N && (N = O = G = 0),
                    b.update()
            }
            Sc && (Nb ? a.getTime() - pc >= 1E3 * Tc && (Nb = r) : (Sa += kb,
                0 > Sa && (Sa = 0,
                    kb = -kb,
                    Nb = l,
                    pc = a.getTime()),
                1 < Sa && (Sa = 1,
                    kb = -kb,
                    Nb = l,
                    pc = a.getTime()),
                b.setOverlayOpacity(Sa)));
            if (0 < y.length)
                for (d = 0; d < y.length; d++)
                    y[d].Ra && y[d].$a != y[d].obj.currentTime && (y[d].$a = y[d].obj.currentTime, !y[d].Va && 0 < y[d].obj.videoHeight && (y[d].Va = y[d].obj.videoWidth / y[d].obj.videoHeight));
            if (0 < R) {
                if (2 == R)
                    for (d = 0; d < J.length; d++)
                        a = J[d],
                        "poly" == a.type && a.C != a.p && (a.C > a.p ? (a.p += 0.05,
                                a.C < a.p && (a.p = a.C)) : (a.p -= 0.05,
                                a.C > a.p && (a.p = a.C)),
                            b.update());
                3 == R && ya != ja && (ya > ja ? (ja += 0.05,
                        ya < ja && (ja = ya)) : (ja -= 0.05,
                        ya > ja && (ja = ya)),
                    b.update())
            }
            rb();
            b.dirty && (0 < b.ka ? b.ka-- : (b.dirty = r,
                    b.ka = 0),
                b.updatePanorama());
            Uc ? setTimeout(function() {
                Da()
            }, 1E3 / 60) : Vc(function() {
                Da()
            })
        }

        function Xa() {
            setTimeout(function() {
                Xa()
            }, 200);
            5 < ec && (Vc = function() {
                    return function(a) {
                        window.setTimeout(a, 10)
                    }
                },
                Uc = l,
                Da());
            ec++
        }

        function ha() {
            return Math.min(1, 2 * Math.tan(Math.PI * A / 360))
        }

        function Ya(a) {
            b.skinObj && b.skinObj.hotspotProxyClick && b.skinObj.hotspotProxyClick(a.id);
            "" != a.url && (b.openUrl(a.url, a.target),
                Wc(-1, -1))
        }

        function Ea() {
            b.isFullscreen && (Ob() || b.exitFullscreen(),
                Ob() && (b.c.style.left = "0px",
                    b.c.style.top = "0px"))
        }

        function Za() {
            Qa = 0
        }

        function $a(a) {
            Qa && (Qa = 0,
                a.preventDefault(),
                K())
        }

        function ab(a) {
            Pb || (b.isFullscreen && a.preventDefault(),
                Qa = a.keyCode,
                K())
        }

        function Na(a) {
            ca || (a.preventDefault(),
                K(),
                Ta && Ta.reset())
        }

        function bb(a) {
            ca || (a.preventDefault(),
                1 != a.scale && (xb = l,
                    Qb *= a.scale,
                    V = lb / Math.sqrt(Qb),
                    V > sa && (V = sa),
                    V < ka && (V = ka),
                    b.update(),
                    K()))
        }

        function cb(a) {
            !ca && Ha(a.target) && (a.preventDefault(),
                xb = l,
                V = lb / Math.sqrt(a.scale),
                V > sa && (V = sa),
                V < ka && (V = ka),
                b.update(),
                K())
        }

        function Oa(a) {
            qc = l;
            Qb = 1;
            ca || (a.touches ? (b.m = a.touches.target,
                Ha(a.target) && (a.preventDefault(),
                    lb = A,
                    K())) : (a.preventDefault(),
                lb = A,
                K()))
        }

        function db(a) {
            !Ta && window.MSGesture && (Ta = new MSGesture,
                Ta.target = b.control);
            Ta && Ta.addPointer(a.pointerId)
        }

        function _touchcancel() {
            ca || (Q = -2)
        }

        function _touchend(a) {
            var d;
            if (!ca) {
                0 <= Q && K();
                var c = (new Date).getTime();
                d = -1;
                var f, e, g = l;
                d = Math.abs(Xc - Bb) + Math.abs(Yc - Cb);
                if (0 <= d && 20 > d) {
                    a.preventDefault();
                    if (Ha(b.m) && (f = rc(b.mouse.x, b.mouse.y)))
                        b.hotspot = f;
                    if (b.m) {
                        d = b.m;
                        for (e = r; d && d != b.control;)
                            d.onclick && !e && (d.onclick(),
                                e = l,
                                g = r),
                            d = d.parentNode
                    }
                    d = Math.abs(Zc - Bb) + Math.abs($c - Cb);
                    if (700 > c - b.fa && 0 <= d && 20 > d) {
                        a.preventDefault();
                        Ha(b.m) && sc && setTimeout(function() {
                            b.toggleFullscreen()
                        }, 1);
                        if (b.m) {
                            d = b.m;
                            for (e = r; d && d != b.control;)
                                d.ondblclick && !e && (d.ondblclick(),
                                    e = l,
                                    g = r),
                                d = d.parentNode
                        }
                        b.fa = 0
                    } else
                        b.fa = c;
                    Zc = Bb;
                    $c = Cb
                }
                if (b.m) {
                    a.preventDefault();
                    d = b.m;
                    for (e = r; d && d != b.control;) {
                        if (d.onmouseout)
                            d.onmouseout();
                        d.onmouseup && !e && (d.onmouseup(),
                            e = l);
                        d = d.parentNode
                    }
                }
                b.m = o;
                Q = -11;
                f && g && Ya(f);
                b.hotspot = b.emptyHotspot
            }
        }

        function _touchmove(a) {
            a || (a = window.event);
            var d = a.touches,
                c = Db();

            b.mouse.x = d[0].pageX - c.x;
            b.mouse.y = d[0].pageY - c.y;
            // Dd(b.mouse.x+','+b.mouse.y+'>>'+c.x)
            if (!ca) {
                d[0] && (Bb = d[0].pageX,
                    Cb = d[0].pageY);
                if (0 <= Q) {
                    a.preventDefault();
                    for (c = 0; c < d.length; c++)
                        if (d[c].identifier == Q) {
                            ad(d[c].pageX, d[c].pageY);
                            break
                        }
                    K()
                }
                2 == d.length && d[0] && d[1] && (Q = -6,
                    qc || (bd = Math.sqrt((d[0].pageX - d[1].pageX) * (d[0].pageX - d[1].pageX) + (d[0].pageY - d[1].pageY) * (d[0].pageY - d[1].pageY)),
                        xb = l,
                        V = lb * Math.sqrt(cd / bd),
                        V > sa && (V = sa),
                        V < ka && (V = ka),
                        K(),
                        a.preventDefault()))
            }
            // event.preventDefault();
        }

        function _touchstart(a) {
            a || (a = window.event);
            var d = a.touches,
                c = Db();
            b.mouse.x = d[0].pageX - c.x;
            b.mouse.y = d[0].pageY - c.y;
            if (!ca) {
                if (0 > Q && d[0]) {
                    tc = (new Date).getTime();
                    Xc = d[0].pageX;
                    Yc = d[0].pageY;
                    Bb = d[0].pageX;
                    Cb = d[0].pageY;
                    b.m = d[0].target;
                    if (Ha(a.target)) {
                        if ((c = dd(b.mouse.x, b.mouse.y)) && c.o)
                            c.o();
                        else {
                            var c = d[0].pageX,
                                f = d[0].pageY;
                            uc = c;
                            vc = f;
                            Fa = c;
                            Ga = f;
                            tb = c;
                            ub = f;
                            Q = d[0].identifier
                        }
                        a.preventDefault();
                        K()
                    }
                    if (b.m) {
                        c = b.m;
                        for (flag = r; c && c != b.control;) {
                            if (c.onmouseover)
                                c.onmouseover();
                            c.onmousedown && !flag && (c.onmousedown(),
                                flag = l);
                            c = c.parentNode
                        }
                        flag && a.preventDefault()
                    }
                }
                1 < d.length && (Q = -5);
                !qc && 2 == d.length && d[0] && d[1] && (cd = Math.sqrt((d[0].pageX - d[1].pageX) * (d[0].pageX - d[1].pageX) + (d[0].pageY - d[1].pageY) * (d[0].pageY - d[1].pageY)),
                    lb = A);
                wb = vb = 0
            }
        }

        function wc(a) {
            if (!xc && (a = a ? a : window.event,
                    Ha(a.target))) {
                var d = a.detail ? -1 * a.detail : a.wheelDelta / 40;
                ed && (d = -d);
                a.axis && (-1 == Rb ? Rb = a.axis : Rb != a.axis && (d = 0));
                var c = 0 < d ? 1 : -1;
                0 != d && (b.changeFovLog(c * fd, l),
                    b.update());
                a.preventDefault();
                K()
            }
        }

        function gd(a) {
            a = a ? a : window.event;
            Rb = -1;
            if (!ca && 0 <= Q) {
                a.preventDefault();
                Q = -3;
                wb = vb = 0;
                var a = (new Date).getTime(),
                    d = -1,
                    d = Math.abs(uc - Fa) + Math.abs(vc - Ga);
                400 > a - tc && 0 <= d && 20 > d && ((d = rc(b.mouse.x, b.mouse.y)) && Ya(d),
                    d = Math.abs(hd - Fa) + Math.abs(id - Ga),
                    700 > a - b.fa && 0 <= d && 20 > d ? (sc && setTimeout(function() {
                            b.toggleFullscreen()
                        }, 10),
                        b.fa = 0) : b.fa = a,
                    hd = Fa,
                    id = Ga);
                K()
            }
        }

        function jd(a) {
            var a = a ? a : window.event,
                d = Db();
            Ob() ? (b.mouse.x = a.clientX - Z,
                b.mouse.y = a.clientY - ba) : (b.mouse.x = a.pageX - d.x,
                b.mouse.y = a.pageY - d.y);
            if (!ca && (0 <= Q && (a.preventDefault(),
                        (a.which || 0 == a.which || 1 == a.which) && ad(a.pageX, a.pageY),
                        K()),
                    b.hotspot == b.emptyHotspot || "poly" == b.hotspot.type)) {
                var c = b.emptyHotspot;
                0 < J.length && Ha(a.target) && (c = rc(b.mouse.x, b.mouse.y));
                b.hotspot != c && (b.hotspot != b.emptyHotspot && (0 < R && (b.hotspot.C = 0),
                        b.skinObj && b.skinObj.hotspotProxyOut && b.skinObj.hotspotProxyOut(b.hotspot.id)),
                    c ? (b.hotspot = c,
                        b.skinObj && b.skinObj.hotspotProxyOver && b.skinObj.hotspotProxyOver(b.hotspot.id),
                        S.style.cursor = "pointer",
                        0 < R && (ya = 1,
                            b.hotspot.C = 1)) : (b.hotspot = b.emptyHotspot,
                        S.style.cursor = "auto",
                        0 < R && (ya = 0)));
                Wc(a.pageX - d.x, a.pageY - d.y)
            }
        }

        function Wc(a, d) {
            var c = Sb;
            c.enabled && (b.hotspot != b.emptyHotspot && 0 <= a && 0 <= d && "" != b.hotspot.title ? (M.innerHTML = b.hotspot.title,
                M.style.color = Ia(c.Ea, c.Da),
                M.style.backgroundColor = c.background ? Ia(c.P, c.O) : "transparent",
                M.style.border = "solid " + Ia(c.R, c.Q) + " " + c.ya + "px",
                M.style.borderRadius = c.xa + "px",
                M.style.textAlign = "center",
                0 < c.width ? (M.style.left = a - c.width / 2 + Z + "px",
                    M.style.width = c.width + "px") : (M.style.width = "auto",
                    M.style.left = a - M.offsetWidth / 2 + Z + "px"),
                M.style.height = 0 < c.height ? c.height + "px" : "auto",
                M.style.top = d + 25 + +ba + "px",
                M.style.visibility = "inherit",
                M.style.overflow = "hidden") : (M.style.visibility = "hidden",
                M.innerHTML = ""))
        }

        function kd(a) {
            var d = Db();
            Ob() ? (b.mouse.x = a.clientX - Z,
                b.mouse.y = a.clientY - ba) : (b.mouse.x = a.pageX - d.x,
                b.mouse.y = a.pageY - d.y);
            if (aa)
                aa.onclick();
            if (!ca) {
                a = a ? a : window.event;
                if ((a.which || 0 == a.which || 1 == a.which) && Ha(a.target)) {
                    if ((d = dd(b.mouse.x, b.mouse.y)) && d.o)
                        d.o();
                    else {
                        var d = a.pageX,
                            c = a.pageY;
                        uc = d;
                        vc = c;
                        Fa = d;
                        Ga = c;
                        tb = d;
                        ub = c;
                        Q = 1;
                        tc = (new Date).getTime()
                    }
                    a.preventDefault();
                    K()
                }
                wb = vb = 0
            }
        }

        function Ob() {
            return document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement && document.msFullscreenElement != o || document.fullScreen
        }

        function dd(a, d) {
            var c = b.S(),
                f;
            for (f = 0; f < y.length + fa.length; f++) {
                var e;
                e = f < y.length ? y[f] : fa[f - y.length];
                if (e.v)
                    return e
            }
            for (f = 0; f < y.length + fa.length; f++) {
                e = f < y.length ? y[f] : fa[f - y.length];
                var g = [],
                    F = new P,
                    k, n, h;
                0 < e.J && (n = Math.tan(e.J / 2 * Math.PI / 180),
                    h = 0 < e.z ? n * e.D / e.z : n,
                    e.L && 1 != e.L && (h *= e.L));
                for (k = 0; 4 > k; k++) {
                    switch (k) {
                        case 0:
                            F.q(-n, -h, -1);
                            break;
                        case 1:
                            F.q(n, -h, -1);
                            break;
                        case 2:
                            F.q(n, h, -1);
                            break;
                        case 3:
                            F.q(-n, h, -1)
                    }
                    F.k(-e.tilt * Math.PI / 180);
                    F.l(e.pan * Math.PI / 180);
                    F.l(-u * Math.PI / 180);
                    F.k(x * Math.PI / 180);
                    F.B(la * Math.PI / 180);
                    g.push(F.La())
                }
                g = Tb(g);
                if (0 < g.length) {
                    for (k = 0; k < g.length; k++) {
                        F = g[k];
                        if (0.1 > F.e) {
                            var m = -c / F.e;
                            px = z / 2 + F.x * m;
                            py = t / 2 + F.y * m
                        } else
                            py = px = 0;
                        F.$ = px;
                        F.G = py
                    }
                    if (ld(g, a, d))
                        return e
                }
            }
        }

        function Ha(a) {
            return a == b.control || a && a.ggType && "container" == a.ggType ? l : r
        }

        function K() {
            ia && (ia = r,
                N = O = G = 0);
            zb && (zb = r,
                N = O = G = 0);
            lc = (new Date).getTime()
        }

        function ad(a, d) {
            yc = a;
            zc = d;
            vb = yc - Fa;
            wb = zc - Ga;
            Pa && (Fa = yc,
                Ga = zc,
                b.update())
        }

        function Pc(a, d) {
            var c = b.getVFov();
            u += a * c / t;
            x += d * c / t;
            Ua()
        }

        function md(a) {
            Ac = g.createBuffer();
            g.bindBuffer(g.ARRAY_BUFFER, Ac);
            var d = [-1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1];
            for (i = 0; 12 > i; i++)
                2 > i % 3 && (d[i] *= a);
            g.bufferData(g.ARRAY_BUFFER, new Float32Array(d), g.STATIC_DRAW);
            Ub = g.createBuffer();
            g.bindBuffer(g.ARRAY_BUFFER, Ub);
            g.bufferData(g.ARRAY_BUFFER, new Float32Array([1, 0, 0, 0, 0, 1, 1, 1]), g.STATIC_DRAW);
            Vb = g.createBuffer();
            g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, Vb);
            g.bufferData(g.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), g.STATIC_DRAW)
        }

        function nd() {
            var a, d;
            if (da)
                for (; 0 < da.length;)
                    g.deleteTexture(da.pop());
            da = [];
            for (var c = 0; 6 > c; c++)
                d = g.createTexture(),
                d.va = o,
                d.ra = o,
                d.Qa = r,
                g.bindTexture(g.TEXTURE_2D, d),
                g.texImage2D(g.TEXTURE_2D, 0, g.RGB, 1, 1, 0, g.RGB, g.UNSIGNED_BYTE, o),
                g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR),
                g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE),
                g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE),
                mb[c] && (a = new Image,
                    a.crossOrigin = b.ba,
                    a.src = pa(mb[c]),
                    d.va = a,
                    a.addEventListener && a.addEventListener("load", Bc(d), r),
                    b.checkLoaded.push(a)),
                da.push(d);
            for (c = 0; 6 > c; c++)
                Wb[c] && (a = new Image,
                    a.crossOrigin = b.ba,
                    a.src = pa(Wb[c]),
                    a.addEventListener ? a.addEventListener("load", Bc(da[c]), r) : a.onload = Bc(da[c]),
                    da[c].ra = a,
                    b.checkLoaded.push(a));
            for (c = 0; c < y.length; c++)
                y[c].gb = g.createTexture(),
                g.bindTexture(g.TEXTURE_2D, y[c].gb),
                g.texImage2D(g.TEXTURE_2D, 0, g.RGB, 1, 1, 0, g.RGB, g.UNSIGNED_BYTE, o),
                g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR),
                g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE),
                g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
            g.bindTexture(g.TEXTURE_2D, o)
        }

        function od(a) {
            var d = curCfNr,
                c = tx,
                b = ty,
                e = D.length - 1 - a,
                g = pd,
                h = "x";
            switch (d) {
                case 0:
                    h = "f";
                    break;
                case 1:
                    h = "r";
                    break;
                case 2:
                    h = "b";
                    break;
                case 3:
                    h = "l";
                    break;
                case 4:
                    h = "u";
                    break;
                case 5:
                    h = "d"
            }
            for (var k = 0; 3 > k; k++)
                g = Ja(g, "c", d),
                g = Ja(g, "s", h),
                g = Ja(g, "r", a),
                g = Ja(g, "l", e),
                g = Ja(g, "x", c),
                g = Ja(g, "y", b),
                g = Ja(g, "v", b),
                g = Ja(g, "h", c);
            return pa(g)
        }

        function Ja(a, d, c) {
            var b = RegExp("%0*" + d, "i").exec(a.toString());
            if (b) {
                var b = b.toString(),
                    e = c.toString();
                for (b.charAt(b.length - 1) != d && (e = (1 + c).toString()); e.length < b.length - 1;)
                    e = "0" + e;
                a = a.replace(b, e)
            }
            return a
        }

        function pa(a) {
            return a ? "{" == a.charAt(0) || "/" == a.charAt(0) || 0 < a.indexOf("://") || 0 == a.indexOf("javascript:") ? a : Eb + a : Eb
        }

        function Bc(a) {
            return function() {
                try {
                    if (a.eb)
                        return;
                    g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, l);
                    var d = r;
                    a.ra != o && a.ra.complete ? a.Qa || (g.bindTexture(g.TEXTURE_2D, a),
                        g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, a.ra),
                        d = a.Qa = l) : a.va != o && a.va.complete && (g.bindTexture(g.TEXTURE_2D, a),
                        g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, a.va),
                        d = l);
                    d && (g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR),
                        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR),
                        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE),
                        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE),
                        a.loaded = l);
                    g.bindTexture(g.TEXTURE_2D, o)
                } catch (c) {}
                b.update()
            }
        }

        function bc() {
            var a = Math.round(b.S()),
                d;
            for (d = 0; d < y.length + fa.length; d++) {
                var c;
                c = d < y.length ? y[d] : fa[d - y.length];
                ma || qd(a);
                var f = "";
                ma && (f += "perspective(" + a + "px) ");
                var f = f + ("translate3d(0px,0px," + a + "px) "),
                    f = f + ("rotateZ(" + la.toFixed(10) + "deg) "),
                    f = f + ("rotateX(" + x.toFixed(10) + "deg) "),
                    f = f + ("rotateY(" + (-u).toFixed(10) + "deg) "),
                    f = f + ("rotateY(" + c.pan.toFixed(10) + "deg) "),
                    f = f + ("rotateX(" + (-c.tilt).toFixed(10) + "deg) "),
                    e = 1E4,
                    g = c.obj.videoWidth,
                    h = c.obj.videoHeight;
                if (0 == g || 0 == h)
                    g = 640,
                    h = 480;
                0 < c.z && (g = c.z);
                0 < c.D && (h = c.D);
                0 < g && 0 < h && (c.obj.width = g + "px",
                    c.obj.ab = h + "px",
                    c.obj.style.width = g + "px",
                    c.obj.style.ab = h + "px");
                0 < c.J && (e = g / (2 * Math.tan(c.J / 2 * Math.PI / 180)));
                f += "translate3d(0px,0px," + (-e).toFixed(10) + "px) ";
                f += "rotateZ(" + c.B.toFixed(10) + "deg) ";
                f += "rotateY(" + (-c.l).toFixed(10) + "deg) ";
                f += "rotateX(" + c.k.toFixed(10) + "deg) ";
                c.L && 1 != c.L && (f += "scaleY(" + c.L + ") ");
                f += "translate3d(" + -g / 2 + "px," + -h / 2 + "px,0px) ";
                c.obj.style[T + "Origin"] = "0% 0%";
                c.v && (f = "",
                    1 == c.u && (e = Math.min(z / g, t / h),
                        f += "scale(" + e + ") "),
                    f += "translate3d(" + -g / 2 + "px," + -h / 2 + "px,0px) ");
                c.Za != f && (c.Za = f,
                    c.obj.style[T] = f,
                    c.obj.style.left = Z + z / 2 + "px",
                    c.obj.style.top = ba + t / 2 + "px",
                    c.obj.style.visibility = "visible",
                    c.oa && c.Ya == c.v && (c.obj.style[xa] = "all 0s linear 0s"),
                    c.Ya = c.v)
            }
        }

        function rd() {
            for (var a = 0, d = Math.tan(b.getVFov() * Math.PI / 360), c = t / (2 * d), c = c * (1 + d * (z / t) / 2), c = c * Math.pow(2, sd); D.length >= a + 2 && !D[a + 1].Ta && D[a + 1].width > c;)
                a++;
            return a
        }

        function td() {
            for (var a = 0; a < D.length; a++) {
                level = D[a];
                for (var d in level.g)
                    level.g.hasOwnProperty(d) && (level.g[d].ja = r)
            }
        }

        function ud() {
            var a;
            for (a = 0; 6 > a; a++) {
                var d;
                d = b.f.j[a];
                if (d.F) {
                    var c;
                    c = [];
                    c.push(new P(-1, -1, -1, 0, 0));
                    c.push(new P(1, -1, -1, 1, 0));
                    c.push(new P(1, 1, -1, 1, 1));
                    c.push(new P(-1, 1, -1, 0, 1));
                    for (var f = 0; f < c.length; f++)
                        4 > a ? c[f].l(a * (-Math.PI / 2)) : c[f].k((4 == a ? -1 : 1) * (Math.PI / 2)),
                        c[f].l(-u * Math.PI / 180),
                        c[f].k(x * Math.PI / 180),
                        c[f].B(la * Math.PI / 180);
                    c = Tb(c);
                    for (var e = {
                            ma: 1,
                            na: 1,
                            pa: 0,
                            qa: 0
                        }, f = 0; f < c.length; f++)
                        e.ma = Math.min(e.ma, c[f].I),
                        e.pa = Math.max(e.pa, c[f].I),
                        e.na = Math.min(e.na, c[f].n),
                        e.qa = Math.max(e.qa, c[f].n);
                    e.Ga = e.pa - e.ma;
                    e.Ka = e.qa - e.na;
                    e.scale = Math.max(e.Ga, e.Ka);
                    d.ta = e
                } else
                    d.ta = o
            }
        }

        function vd(a) {
            var d = level,
                c = {};
            c.U = a.ma * (d.width / L);
            c.V = a.na * (d.height / L);
            c.Y = a.pa * (d.width / L);
            c.Z = a.qa * (d.height / L);
            c.U = Math.min(Math.max(0, Math.floor(c.U)), d.H - 1);
            c.V = Math.min(Math.max(0, Math.floor(c.V)), d.aa - 1);
            c.Y = Math.min(Math.max(0, Math.floor(c.Y)), d.H - 1);
            c.Z = Math.min(Math.max(0, Math.floor(c.Z)), d.aa - 1);
            return c
        }

        function wd(a) {
            return function() {
                b.dirty = l;
                b.T = l;
                U && U--;
                0 == U && b.divSkin && b.divSkin.ggLoadedLevels && b.divSkin.ggLoadedLevels();
                a.a = o
            }
        }

        function Nd(a) {
            return function() {
                b.dirty = l;
                b.Na = l;
                b.T = l;
                a.loaded = l;
                a.a && !a.b && s.appendChild(a.a);
                U && U--;
                0 == U && b.divSkin && b.divSkin.ggLoadedLevels && b.divSkin.ggLoadedLevels();
                a.a && a.d && (a.d.drawImage(a.a, 0, 0),
                    a.a = o)
            }
        }

        function xd() {
            return function() {
                b.dirty = l;
                b.T = l;
                U && U--;
                0 == U && b.divSkin && b.divSkin.ggLoadedLevels && b.divSkin.ggLoadedLevels()
            }
        }

        function Od(a) {
            return function() {
                b.dirty = l;
                b.Na = l;
                b.T = l;
                a.loaded = l;
                U && U--;
                0 == U && b.divSkin && b.divSkin.ggLoadedLevels && b.divSkin.ggLoadedLevels();
                try {
                    g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, l),
                        a.a != o && a.a.complete && (a.M = g.createTexture(),
                            g.bindTexture(g.TEXTURE_2D, a.M),
                            g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, a.a),
                            g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR),
                            g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR),
                            g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE),
                            g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE),
                            g.bindTexture(g.TEXTURE_2D, o))
                } catch (d) {}
                b.update()
            }
        }

        function Ua() {
            var a, d;
            0 < Cc && (a = nb,
                D && 0 < D.length && (a = D[0].height),
                ka = 360 * Math.atan2(t / 2, a / 2 * Cc) / Math.PI);
            A < ka && (A = ka);
            A > sa && (A = sa);
            d = b.getVFov() / 2;
            a = 180 * Math.atan(z / t * Math.tan(d * Math.PI / 180)) / Math.PI;
            2 * d > Ka - La && (d = (Ka - La) / 2);
            b.setVFov(2 * d);
            90 > Ka ? x + d > Ka && (x = Ka - d) : x > Ka && (x = Ka); -
            90 < La ? x - d < La && (x = La + d) : x < La && (x = La);
            if (359.99 > hb - ib) {
                var c = 0;
                if (0 != x) {
                    var f, e = t / 2;
                    f = e * Math.tan(d * Math.PI / 180);
                    e /= Math.tan(Math.abs(x) * Math.PI / 180);
                    e -= f;
                    0 < e && (c = 180 * Math.atan(1 / (e / f)) / Math.PI,
                        c = c * (hb - ib) / 360)
                }
                u + (a + c) > hb && (u = hb - (a + c),
                    ia && (Ra = -Ra,
                        G = 0));
                u - (a + c) < ib && (u = ib + (a + c),
                    ia && (Ra = -Ra,
                        G = 0));
                90 < x + d && (x = 90 - d); -
                90 > x - d && (x = -90 + d)
            }
        }

        function rc(a, d) {
            var c = -1;
            if (0 <= R)
                for (var b = 0; b < J.length; b++) {
                    var e = J[b];
                    "poly" == e.type && e.ua && 0 < e.ua.length && ld(e.ua, a, d) && (c = b)
                }
            return 0 <= c ? J[c] : r
        }

        function ld(a, d, c) {
            var b, e, g = r;
            for (b = 0,
                e = a.length - 1; b < a.length; e = b++) {
                var h = a[b];
                e = a[e];
                h.G > c != e.G > c && d < (e.$ - h.$) * (c - h.G) / (e.G - h.G) + h.$ && (g = !g)
            }
            return g
        }

        function Ia(a, d) {
            a = Number(a);
            return "rgba(" + (a >> 16 & 255) + "," + (a >> 8 & 255) + "," + (a & 255) + "," + d + ")"
        }

        function Oc() {
            for (var a = new P(0, 0, -100), d = b.S(), c = 0; c < J.length; c++) {
                var f = J[c],
                    e, g;
                if ("point" == f.type) {
                    a.q(0, 0, -100);
                    a.k(-f.tilt * Math.PI / 180);
                    a.l(f.pan * Math.PI / 180);
                    a.l(-u * Math.PI / 180);
                    a.k(x * Math.PI / 180);
                    a.B(la * Math.PI / 180);
                    var h = r;
                    0.01 > a.e ? (g = -d / a.e,
                        e = a.x * g,
                        g *= a.y,
                        Math.abs(e) < z / 2 + 500 && Math.abs(g) < t / 2 + 500 && (h = l)) : g = e = 0;
                    f.obj && f.obj.__div && (f.obj.__div.style[xa] = "none",
                        f.obj.ggUse3d ? (ma || qd(d),
                            f.obj.__div.style.width = "1px",
                            f.obj.__div.style.height = "1px",
                            hs = "",
                            ma && (hs += "perspective(" + d + "px) "),
                            hs += "translate3d(0px,0px," + d + "px) ",
                            hs += "rotateZ(" + la.toFixed(10) + "deg) ",
                            hs += "rotateX(" + x.toFixed(10) + "deg) ",
                            hs += "rotateY(" + (-u).toFixed(10) + "deg) ",
                            hs += "rotateY(" + f.pan.toFixed(10) + "deg) ",
                            hs += "rotateX(" + (-f.tilt).toFixed(10) + "deg) ",
                            hs += "translate3d(0px,0px," + (-1 * f.obj.gg3dDistance).toFixed(10) + "px) ",
                            f.obj.__div.style[T + "Origin"] = "0% 0%",
                            f.obj.__div.style[T] = hs,
                            f.obj.__div.style.left = Z + z / 2 + "px",
                            f.obj.__div.style.top = ba + t / 2 + "px") : h ? (f.obj.__div.style.left = Z + e + z / 2 + "px",
                            f.obj.__div.style.top = ba + g + t / 2 + "px") : (f.obj.__div.style.left = "-1000px",
                            f.obj.__div.style.top = "-1000px"));
                    if(f.obj){
                      if(h){
                        f.obj.x=Z + e + z / 2;
                        f.obj.y=ba + g + t / 2;
                      }else {
                        f.obj.x=-1000;
                        f.obj.y=-1000;
                      }
                    }

                }
                if ("poly" == f.type) {
                    for (var k = [], h = 0; h < f.ia.length; h++)
                        e = f.ia[h],
                        a.q(0, 0, -100),
                        a.k(-e.tilt * Math.PI / 180),
                        a.l(e.pan * Math.PI / 180),
                        a.l(-u * Math.PI / 180),
                        a.k(x * Math.PI / 180),
                        a.B(la * Math.PI / 180),
                        k.push(a.La());
                    k = Tb(k);
                    if (0 < k.length)
                        for (h = 0; h < k.length; h++)
                            a = k[h],
                            0.1 > a.e ? (g = -d / a.e,
                                e = z / 2 + a.x * g,
                                g = t / 2 + a.y * g) : g = e = 0,
                            a.$ = e,
                            a.G = g;
                    f.ua = k
                }
            }
            if(b.__upHotspot)b.__upHotspot();
        }

        function qd(a) {
            !ma && b.cb != a && (b.cb = a,
                S.style[za] = a + "px",
                S.style[za + "Origin"] = Z + z / 2 + "px " + (ba + t / 2) + "px ",
                s.style[za] = a + "px",
                s.style[za + "Origin"] = Z + z / 2 + "px " + (ba + t / 2) + "px ")
        }

        function Tb(a) {
            a = Fb(a, yd);
            a = Fb(a, zd);
            a = Fb(a, Ad);
            a = Fb(a, Bd);
            return a = Fb(a, Cd)
        }

        function Fb(a, d) {
            if (0 == a.length)
                return a;
            var c, b, e, g, h, k, n, m = [];
            c = d.wa(a[0]) - 0;
            for (g = 0; g < a.length; g++) {
                k = g;
                n = g + 1;
                n == a.length && (n = 0);
                b = d.wa(a[n]) - 0;
                if (0 <= c && 0 <= b)
                    m.push(a[k]);
                else if (0 <= c || 0 <= b)
                    e = b / (b - c),
                    0 > e && (e = 0),
                    1 < e && (e = 1),
                    h = new P,
                    h.bb(a[k], a[n], e),
                    0 > c || m.push(a[k]),
                    m.push(h);
                c = b
            }
            return m
        }

        function Db() {
            var a = {
                    x: 0,
                    y: 0
                },
                d = s;
            if (d.offsetParent) {
                do
                    a.x += d.offsetLeft,
                    a.y += d.offsetTop;
                while (d = d.offsetParent)
            }
            return a
        }

        function Aa() {
            fc = l
        }

        function Dd(a) {
            if (location.href.indexOf(':800') != -1) {
                if (debug = document.getElementById("debug"))
                    debug.innerHTML = a + "<br />";
            }

            window.console && window.console.log(a)
        }
        var Sb, R, ja, ya, Dc, Ec, Fc, Gc, Hc;

        function Kd(a) {
            var d = "",
                c, b, e = "",
                g, h = "",
                k = 0,
                a = a.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            do
                c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(k++)),
                b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(k++)),
                g = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(k++)),
                h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(k++)),
                c = c << 2 | b >> 4,
                b = (b & 15) << 4 | g >> 2,
                e = (g & 3) << 6 | h,
                d += String.fromCharCode(c),
                64 != g && (d += String.fromCharCode(b)),
                64 != h && (d += String.fromCharCode(e));
            while (k < a.length);
            return d
        }

        function Pd(a, b) {
            var c = this;
            c.fb = a;
            c.hotspot = b;
            c.__div = document.createElement("div");
            c.a = document.createElement("img");
            var f;
            c.a.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA5xJREFUeNqclmlIVFEUx997TjrplFQW2WKBBSYtRFlpWUILSSsRZRQIBdGHCFqIoKIvQRsUFRJC9LEgaSFbMMpcWi1pLzOLsjItKms0U5t5/c/wH7nc5o2jF374xrv87z33nHOPaRsRtbFgDpgJxoD+wATfwDNQDK6CyrCr5OcbhgiGIRsUAZt4QTWoIFXgp9JfAhY7rgdBl8NeBoLDYBloA+dBOagFTcDHcVEgDgwBGWA+OAcugvXgvb5wKMGJoAAMp9BpUA96EBf/Btsf8BI8AWfAErAcpHHDZeriliY2AVwDg8AucAQ0Ag+I4XhTm2Oxz8PT46KMbTx5EZjuJDgAnAVusJUm9DhYwalFcc59sIXXIaceFkowDySBPTRPL20xm+b7zYXa+N3CPrWJ6GuwGySA40HLBHc/GywFhbS5R1lEBrZy7FQwiSaX9pmnqeAYt+KUcew7BVZw/QKTq0ocpYPVvDOXItZCk2xgDIZqL8BR8Ab0VDbr4yZOgLeIwzQx6WiQxcCt1+6sld66L4yYtFSwF4yg2dU7/cEwGW9YVkAwmycp1dzdpvgm0DcCh4kHmxWzBls0uBX4qqmZJ4KzePm1IeJLgjmlC16aDKZpp5Q168B3o6wsSwTHgU+MIUs74RSj6y1d+212HKimJlUE+tFRfJpYtOKNXWmJTASqWf2Bu/R6+4TKHOrOzG4IhptjWgHbGkZvepQ6SQK7oRuCXzjX1DJavBEX1ygfT8FgBqpfm1zRDcEKbR2bsZlkJCdXieB1ZhZ5YtqVgXIPN+m9kbY6hpdb+d9fPncJRmZmqQheZkemJmgxyxykl3XWJEkcAl7N21s7PDcl5ZJ0PAa3wVwmWtVbZafPwQ7wLozYB7ATPNJO56d/LAikP9u+66KNJS1d4IOZp7wU0hfLukUyzgwm70T2N/DOxIy/eFdqawa5DL2NEGwP5k15Ja4woz9glvcomd9NzyvkFcQo5gomaLfm5c0svnKZ2k7q7+FauvR2MJKZR3+sY5WgtvkdG6JyELGhNHMTXyGfLviRJ5Tcd4Dlhle7086Sgp8CqVxDkn4OqHaqacr5ekjy3Q/W0FRNNGmoMtamdzdxsytZC0lqXKhEgWPVVgImg2NgFT1MHOoOk3yLEtgWN5TEOYvoIFI1rGM19//2wpAD7imF7lfwENwAxaASNCj90pcLLKdC2Iyw1M9gnEplMEp5kOU1f8WwKGJm8oUr9f8JMAAVMDM6HSDa9QAAAABJRU5ErkJggg%3D%3D");
            c.a.setAttribute("style", "position: absolute;top: -14px;left: -14px; " + I + "user-select: none;");
            c.a.ondragstart = function() {
                return r
            };
            c.__div.appendChild(c.a);
            f = "position:absolute;" + (I + "user-select: none;");
            f += I + "touch-callout: none;";
            f += I + "tap-highlight-color: rgba(0,0,0,0);";
            sb && !ga && (f += I + "transform: translateZ(9999999px);");
            c.__div.setAttribute("style", f);
            c.__div.onclick = function() {
                c.fb.openUrl(b.url, b.target)
            };
            var e = Sb;
            e.enabled && (c.text = document.createElement("div"),
                f = "position:absolute;" + ("left: -" + b.w / 2 + "px;"),
                f = f + "top:  20px;" + ("width: " + b.w + "px;"),
                f = 0 == b.h ? f + "height: auto;" : f + ("height: " + b.h + "px;"),
                b.wordwrap ? f = f + "white-space: pre-wrap;" + ("width: " + b.w + "px;") : (f = 0 == b.h ? f + "width: auto;" : f + ("width: " + b.w + "px;"),
                    f += "white-space: nowrap;"),
                f += I + "transform-origin: 50% 50%;",
                c.text.setAttribute("style", f + "visibility: hidden;border: 1px solid #000000;background-color: #ffffff;text-align: center;overflow: hidden;padding: 0px 1px 0px 1px;"),
                c.text.style.color = Ia(e.Ea, e.Da),
                c.text.style.backgroundColor = e.background ? Ia(e.P, e.O) : "transparent",
                c.text.style.border = "solid " + Ia(e.R, e.Q) + " " + e.ya + "px",
                c.text.style.borderRadius = e.xa + "px",
                c.text.style.textAlign = "center",
                c.text.style.width = 0 < e.width ? e.width + "px" : "auto",
                c.text.style.height = 0 < e.height ? e.height + "px" : "auto",
                c.text.style.overflow = "hidden",
                c.text.innerHTML = b.title,
                c.__div.onmouseover = function() {
                    0 == b.h && (w = c.text.offsetWidth,
                        c.text.style.left = -w / 2 + "px");
                    c.text.style.visibility = "inherit"
                },
                c.__div.onmouseout = function() {
                    c.text.style.visibility = "hidden"
                },
                c.__div.appendChild(c.text))
        }
        var b = this;
        b.transitionsDisabled = r;
        var u = 0,
            Ic = 0,
            ib = 0,
            hb = 360,
            G = 0,
            Xb = 0,
            x = 0,
            Jc = 0,
            La = -90,
            Ka = 90,
            O = 0,
            la = 0,
            A = 90,
            Mb = 90,
            ka = 1,
            Cc = 0,
            sa = 170,
            lb = 0,
            N = 0,
            Kc = 0,
            cd, bd, z = 320,
            t = 480,
            uc = 0,
            vc = 0,
            Fa = 0,
            Ga = 0,
            hd = 0,
            id = 0,
            yc = 0,
            zc = 0,
            vb = 0,
            wb = 0,
            Q = -1,
            Xc = 0,
            Yc = 0,
            Bb = 0,
            Cb = 0,
            Zc = 0,
            $c = 0,
            tc, gc = l,
            tb = 0,
            ub = 0,
            qa = 0,
            ra = 0,
            xb = r,
            V = 0,
            Qa = 0,
            s = o,
            Ba = o,
            na = o,
            S = b.c = o,
            $ = o;
        b.control = o;
        b.checkLoaded = [];
        b.isFullscreen = r;
        b.dirty = r;
        b.ka = 1;
        b.divSkin = o;
        b.isLoaded = r;
        b.hasConfig = r;
        b.startNode = "";
        b.onMoveComplete = o;
        var Kb = 0,
            Wb = [],
            mb = [],
            nb = 1,
            Gb = 1,
            Hb = 1024,
            Ed = 0,
            Fd = 0,
            Ab = r,
            nc = 5,
            ia = r,
            oc = r,
            Ra = 0.4,
            Lb = 0,
            mc = 0,
            Rc = l,
            jb, zb = r,
            Qc = 0.1,
            ic = 0,
            jc = 0,
            kc, lc;
        b.skinObj = o;
        b.userdata = {};
        b.userdata.title = "";
        b.userdata.description = "";
        b.userdata.author = "";
        b.userdata.datetime = "";
        b.userdata.copyright = "";
        b.userdata.source = "";
        b.userdata.information = "";
        b.userdata.comment = "";
        b.userdata.tags = [];
        b.ba = "anonymous";
        var J = [];
        b.emptyHotspot = {
            pan: 0,
            tilt: 0,
            title: "",
            url: "",
            target: "",
            id: "",
            skinid: "",
            w: 100,
            h: 20,
            wordwrap: r,
            obj: o,
            type: "empty"
        };
        var C = [],
            y = [],
            fa = [],
            ob = [],
            va = [],
            Y = 1,
            D = [],
            pb = "0x000000",
            sd = 0.4,
            ta, L, pd, Sa = 0,
            kb = 0.01,
            Tc = 2,
            pc = 0,
            Nb = r,
            Sc = r,
            Z = 0,
            ba = 0,
            cc = 0,
            dc = 0,
            Pb = r,
            ca = r,
            xc = r,
            Pa = l,
            ed = r,
            fd = 1,
            sc = l,
            gb = 8;
        R = 1;
        ja = 0;
        ya = 0;
        Dc = 255;
        Ec = 1;
        Fc = 255;
        Gc = 0.3;
        Sb = {
            enabled: l,
            width: 180,
            height: 20,
            Ea: 0,
            Da: 1,
            background: l,
            P: 16777215,
            O: 1,
            R: 0,
            Q: 1,
            xa: 3,
            ya: 1,
            wordwrap: l
        };
        Hc = void 0;
        b.hotspot = b.emptyHotspot;
        var M = o;
        b.T = l;
        b.mouse = {
            x: 0,
            y: 0
        };
        var ga = r,
            Ca = r,
            yb = r,
            Yb = l,
            Gd = r,
            Lc = l,
            qc = r,
            U = 0,
            Zb = 10,
            Hd = 200,
            Eb = "",
            I = "",
            xa = "transition",
            T = "transform",
            za = "perspective",
            g, yd = new P,
            zd = new P,
            Ad = new P,
            Bd = new P,
            Cd = new P;
        b.Ba = r;
        var Jb = "";
        unusedTileCanvas = [];
        var Qd = navigator.userAgent.match(/(MSIE)/g) ? l : r,
            sb = navigator.userAgent.match(/(Safari)/g) ? l : r;
        navigator.userAgent.match(/(Chrome)/g) && (sb = r);
        var Id = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? l : r,
            Rd = navigator.userAgent.match(/(android)/i) ? l : r,
            Uc = r,
            Vc = function() {
                var a = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
                return Id || !a ? function(a) {
                        window.setTimeout(a, 10)
                    } :
                    a
            }();
        b.detectBrowser = function() {
            var a = ["Webkit", "Moz", "O", "ms", "Ms"],
                d;
            I = "";
            xa = "transition";
            T = "transform";
            za = "perspective";
            for (d = 0; d < a.length; d++)
                "undefined" !== typeof document.documentElement.style[a[d] + "Transform"] && (I = "-" + a[d].toLowerCase() + "-",
                    xa = a[d] + "Transition",
                    T = a[d] + "Transform",
                    za = a[d] + "Perspective");
            Gd = Mc();
            ga = Nc();
            Ca = Mc();
            ga && (Ca = r);
            ma = l;
            qb = r;
            (Id || Rd) && b.setMaxTileCount(80);
            Dd("Pano2VR player - Prefix:" + I + ", " + (Gd ? "CSS 3D available" : "CSS 3D not available") + ", " + (ga ? "WebGL available" : "WebGL not available"))
        };
        b.setMaxTileCount = function(a) {
            Hd = a
        };
        b.f = new function() {
            var a = this;
            a.j = [];
            a.la = [];
            for (i = 0; 6 > i; i++)
                a.j[i] = {
                    F: l
                };
            a.za = function(b, c) {
                for (var f = 0; 6 > f; f++) {
                    var e;
                    if (e = a.j[f]) {
                        var g;
                        g = [];
                        g.push(new P(-1, -1, -1, 0, 0));
                        g.push(new P(1, -1, -1, 1, 0));
                        g.push(new P(1, 1, -1, 1, 1));
                        g.push(new P(-1, 1, -1, 0, 1));
                        for (var h = 0; h < g.length; h++)
                            4 > f ? g[h].l(f * (-Math.PI / 2)) : g[h].k((4 == f ? -1 : 1) * (Math.PI / 2)),
                            g[h].l(-b * Math.PI / 180),
                            g[h].k(c * Math.PI / 180);
                        g = Tb(g);
                        e.F = 0 < g.length
                    }
                }
            }
        };
        b.setElementIdPrefix = function(a) {
            b.X = a
        };
        b.getPercentLoaded = function() {
            return Kb
        };
        b.setBasePath = function(a) {
            Eb = a
        };
        b.S = function() {
            return 1 * t / (2 * Math.tan(Math.PI / 180 * (b.getVFov() / 2)))
        };
        b.setViewerSize = function(a, d) {
            b.isFullscreen && (a = window.innerWidth,
                d = window.innerHeight);
            var c = a - Z - cc,
                f = d - ba - dc;
            if (!(10 > c || 10 > f)) {
                s.style.width = c + "px";
                s.style.height = f + "px";
                s.style.left = Z + "px";
                s.style.top = ba + "px";
                if (ga)
                    try {
                        Ba && (Ba.width = c,
                                Ba.height = f),
                            g && (g.Ja = c,
                                g.Ia = f,
                                g.viewport(0, 0, c, f))
                    } catch (e) {
                        alert(e)
                    }
                na && (na.style.width = a + "px",
                    na.style.height = d + "px",
                    na.width = a,
                    na.height = d);
                S && (S.style.width = a + "px",
                    S.style.height = d + "px",
                    $.style.width = a + "px",
                    $.style.height = d + "px",
                    $.width = a,
                    $.height = d,
                    $.style.left = Z + "px",
                    $.style.top = ba + "px",
                    b.divSkin && b.divSkin != S && (b.divSkin.style.width = a + "px",
                        b.divSkin.style.height = d + "px"));
                b.hasConfig && b.updatePanorama();
                b.divSkin && b.divSkin.ggUpdateSize && b.divSkin.ggUpdateSize(a, d)
            }
        };
        var fc = r;
        b.setMargins = function(a, b, c, f) {
            Z = a;
            ba = b;
            cc = c;
            dc = f;
            Aa()
        };
        b.changeViewMode = function(a) {
            0 == a && (Pa = r);
            1 == a && (Pa = l);
            2 == a && (Pa = Pa ? r : l)
        };
        b.changePolygonMode = function(a, d) {
            R = 1 == d && 0 < R ? 0 : Math.round(a);
            b.update()
        };
        b.polygonMode = function() {
            return R
        };
        var W;
        b.getVFov = function() {
            var a;
            switch (Kc) {
                case 0:
                    a = A / 2;
                    break;
                case 1:
                    a = 180 * Math.atan(t / z * Math.tan(A / 2 * Math.PI / 180)) / Math.PI;
                    break;
                case 2:
                    a = 180 * Math.atan(t / Math.sqrt(z * z + t * t) * Math.tan(A / 2 * Math.PI / 180)) / Math.PI;
                    break;
                case 3:
                    a = 4 * t / 3 > z ? A / 2 : 180 * Math.atan(4 * t / (3 * z) * Math.tan(A / 2 * Math.PI / 180)) / Math.PI
            }
            return 2 * a
        };
        b.setVFov = function(a) {
            var a = a / 2,
                b;
            switch (Kc) {
                case 0:
                    A = 2 * a;
                    break;
                case 1:
                    a = 180 * Math.atan(z / t * Math.tan(a * Math.PI / 180)) / Math.PI;
                    A = 2 * a;
                    break;
                case 2:
                    b = Math.sqrt(z * z + t * t);
                    a = 180 * Math.atan(b / t * Math.tan(a * Math.PI / 180)) / Math.PI;
                    A = 2 * a;
                    break;
                case 3:
                    4 * t / 3 > z || (a = 180 * Math.atan(3 * z / (4 * t) * Math.tan(a * Math.PI / 180)) / Math.PI),
                        A = 2 * a
            }
        };
        b.update = function(a) {
            b.dirty = l;
            a && (b.ka = a)
        };
        b.updatePanorama = function() {
            var a = b.S(),
                d = Math.atan2(z / 2 + 1, a),
                c = Math.atan2(t / 2 + 1, a),
                a = Math.sin(d),
                f = Math.sin(c),
                d = Math.cos(d),
                c = Math.cos(c);
            yd.q(0, 0, -1);
            zd.q(d, 0, -a);
            Ad.q(-d, 0, -a);
            Bd.q(0, c, -f);
            Cd.q(0, -c, -f);
            Oc();
            if ($ && (Hc != R && (Hc = R,
                        $.style.visibility = 0 < R ? "inherit" : "hidden"),
                    0 < R)) {
                W || (W = $.getContext("2d"));
                if (W.width != z || W.height != t)
                    W.width = z,
                    W.height = t;
                W.clear ? W.clear() : W.clearRect(0, 0, $.width, $.height);
                a = 1;
                3 == R && (a = ja);
                for (f = 0; f < J.length; f++)
                    if (d = J[f],
                        "poly" == d.type && (c = d.ua,
                            2 == R && (a = d.p),
                            W.fillStyle = Ia(d.P, d.O * a),
                            W.strokeStyle = Ia(d.R, d.Q * a),
                            0 < c.length)) {
                        W.beginPath();
                        for (j = 0; j < c.length; j++)
                            v = c[j],
                            0 == j ? W.moveTo(v.$, v.G) : W.lineTo(v.$, v.G);
                        W.closePath();
                        W.stroke();
                        W.fill()
                    }
            }
            if (ga)
                if (0 < D.length) {
                    Ua();
                    if (z != s.offsetWidth || t != s.offsetHeight)
                        z = parseInt(s.offsetWidth),
                        t = parseInt(s.offsetHeight);
                    Lc && (b.initWebGL(0),
                        Aa());
                    if (g) {
                        g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT);
                        ua(Ma);
                        ac(b.getVFov(), g.Ja / g.Ia, Ma);
                        g.uniformMatrix4fv(E.sa, r, Ma);
                        b.f.za(u, x);
                        Zb = 1;
                        ud();
                        td();
                        var e = rd(),
                            h;
                        for (h = D.length - 1; h >= e;) {
                            level = D[h];
                            a = 1;
                            h == D.length - 1 && 0 == ta && (a = L / (L - 0.5));
                            for (curCfNr = 0; 6 > curCfNr; curCfNr++)
                                if (f = b.f.j[curCfNr],
                                    d = f.ta,
                                    ua(ea),
                                    Ib(ea, -la * Math.PI / 180, [0, 0, 1]),
                                    Ib(ea, -x * Math.PI / 180, [1, 0, 0]),
                                    Ib(ea, (180 - u) * Math.PI / 180, [0, 1, 0]),
                                    4 > curCfNr ? Ib(ea, -Math.PI / 2 * curCfNr, [0, 1, 0]) : Ib(ea, Math.PI / 2 * (5 == curCfNr ? 1 : -1), [1, 0, 0]),
                                    f.F && d && 0 < d.Ga && 0 < d.Ka && 0 < d.scale || level.t) {
                                    f.dirty = r;
                                    level.t ? (c = {
                                            U: 0,
                                            V: 0
                                        },
                                        c.Y = level.H - 1,
                                        c.Z = level.aa - 1) : c = vd(d);
                                    for (ty = c.V; ty <= c.Z; ty++)
                                        for (tx = c.U; tx <= c.Y; tx++) {
                                            var m = tx + ty * level.H + curCfNr * level.H * level.aa;
                                            (d = level.g[m]) || (d = level.g[m] = {});
                                            U < Zb && !d.a && (Fd++,
                                                d.a = new Image,
                                                d.a.onload = Od(d),
                                                d.a.onerror = xd(),
                                                d.a.onabort = xd(),
                                                d.a.crossOrigin = b.ba,
                                                d.a.setAttribute("src", od(h)),
                                                level.t && b.checkLoaded.push(d.a),
                                                0 == U && b.divSkin && b.divSkin.ggReLoadedLevels && b.divSkin.ggReLoadedLevels(),
                                                U++,
                                                b.dirty = l);
                                            if (d.M) {
                                                if (d.Aa)
                                                    g.bindBuffer(g.ARRAY_BUFFER, d.Aa);
                                                else {
                                                    m = 2 * h + 1;
                                                    d.Aa = g.createBuffer();
                                                    g.bindBuffer(g.ARRAY_BUFFER, d.Aa);
                                                    var k = [-1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1];
                                                    k[0] = -2 * a * Math.min((tx + 1) * L, level.width) - ta;
                                                    k[1] = -2 * a * Math.min((ty + 1) * L, level.height) - ta;
                                                    k[3] = -2 * a * tx * L + ta;
                                                    k[4] = k[1];
                                                    k[6] = k[3];
                                                    k[7] = -2 * a * ty * L + ta;
                                                    k[9] = k[0];
                                                    k[10] = k[7];
                                                    for (i = 0; 12 > i; i++)
                                                        k[i] = 0 == i % 3 ? m * (k[i] / level.width + 1) : 1 == i % 3 ? m * (k[i] / level.height + 1) : m;
                                                    g.bufferData(g.ARRAY_BUFFER, new Float32Array(k), g.STATIC_DRAW)
                                                }
                                                g.vertexAttribPointer(E.Ha, 3, g.FLOAT, r, 0, 0);
                                                g.bindBuffer(g.ARRAY_BUFFER, Ub);
                                                g.vertexAttribPointer(E.Fa, 2, g.FLOAT, r, 0, 0);
                                                g.activeTexture(g.TEXTURE0);
                                                g.bindTexture(g.TEXTURE_2D, d.M);
                                                g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
                                                g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
                                                g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
                                                g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
                                                g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, Vb);
                                                g.uniform1i(E.Ua, 0);
                                                g.uniformMatrix4fv(E.Sa, r, ea);
                                                g.uniformMatrix4fv(E.sa, r, Ma);
                                                g.drawElements(g.TRIANGLES, 6, g.UNSIGNED_SHORT, 0)
                                            }
                                            d.ja = f.F
                                        }
                                }
                            h--
                        }
                        for (e = 0; e < D.length; e++) {
                            level = D[e];
                            for (var n in level.g)
                                level.g.hasOwnProperty(n) && (d = level.g[n], !d.ja && !level.t && (d.M && g.deleteTexture(d.M),
                                    d.a = o,
                                    delete level.g[n]))
                        }
                        b.T = r
                    }
                } else {
                    Ua();
                    if (z != s.offsetWidth || t != s.offsetHeight)
                        z = parseInt(s.offsetWidth),
                        t = parseInt(s.offsetHeight);
                    Lc && (b.initWebGL(0),
                        Aa());
                    if (g) {
                        g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT);
                        ua(Ma);
                        ac(b.getVFov(), g.Ja / g.Ia, Ma);
                        g.uniformMatrix4fv(E.sa, r, Ma);
                        for (v = 0; 6 > v; v++)
                            ua(ea),
                            Ib(ea, -la * Math.PI / 180, [0, 0, 1]),
                            Ib(ea, -x * Math.PI / 180, [1, 0, 0]),
                            Ib(ea, (180 - u) * Math.PI / 180, [0, 1, 0]),
                            4 > v ? Ib(ea, -Math.PI / 2 * v, [0, 1, 0]) : Ib(ea, Math.PI / 2 * (5 == v ? 1 : -1), [1, 0, 0]),
                            g.bindBuffer(g.ARRAY_BUFFER, Ac),
                            g.vertexAttribPointer(E.Ha, 3, g.FLOAT, r, 0, 0),
                            g.bindBuffer(g.ARRAY_BUFFER, Ub),
                            g.vertexAttribPointer(E.Fa, 2, g.FLOAT, r, 0, 0),
                            6 <= da.length && da[v].loaded && (g.activeTexture(g.TEXTURE0),
                                g.bindTexture(g.TEXTURE_2D, da[v]),
                                g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, Vb),
                                g.uniform1i(E.Ua, 0),
                                g.uniformMatrix4fv(E.Sa, r, ea),
                                g.uniformMatrix4fv(E.sa, r, Ma),
                                g.drawElements(g.TRIANGLES, 6, g.UNSIGNED_SHORT, 0))
                    }
                }
            else if (Ca)
                if (0 < D.length) {
                    Ua();
                    n = n = a = r;
                    Jd++;
                    if (z != s.offsetWidth || t != s.offsetHeight)
                        z = parseInt(s.offsetWidth),
                        t = parseInt(s.offsetHeight),
                        s.style[T + "OriginX"] = z / 2 + "px",
                        s.style[T + "OriginY"] = t / 2 + "px",
                        a = l;
                    h = Math.round(b.S());
                    if (b.ga != h || a)
                        b.ga = h,
                        ma || (s.style[za] = h + "px",
                            s.style[za + "Origin"] = "50% 50%");
                    b.f.za(u, x);
                    Zb = 1;
                    if (0 < D.length) {
                        ud();
                        td();
                        d = 0;
                        a = "";
                        for (curCfNr = 0; 6 > curCfNr; curCfNr++)
                            f = b.f.j[curCfNr],
                            f.F && (d = Math.max(d, f.ta.scale),
                                a = a + curCfNr + ",");
                        d = rd();
                        for (c = D.length - 1; c >= d;) {
                            level = D[c];
                            m = 1;
                            c == D.length - 1 && 0 == ta && (m = L / (L - 2));
                            for (curCfNr = 0; 6 > curCfNr; curCfNr++)
                                if (f = b.f.j[curCfNr],
                                    k = f.ta,
                                    f.F && k && 0 < k.Ga && 0 < k.Ka && 0 < k.scale || level.t) {
                                    f.dirty = r;
                                    var p;
                                    level.t ? (p = {
                                            U: 0,
                                            V: 0
                                        },
                                        p.Y = level.H - 1,
                                        p.Z = level.aa - 1) : p = vd(k);
                                    for (ty = p.V; ty <= p.Z; ty++)
                                        for (tx = p.U; tx <= p.Y; tx++) {
                                            var q = tx + ty * level.H + curCfNr * level.H * level.aa;
                                            (k = level.g[q]) || (k = level.g[q] = {});
                                            if (!k.b && U < Zb) {
                                                if (0 < unusedTileCanvas.length) {
                                                    k.b = unusedTileCanvas.shift();
                                                    for (q = s.firstChild; q && q.K && (-1 == q.K || q.K >= c);)
                                                        q = q.nextSibling;
                                                    s.insertBefore(k.b, q);
                                                    k.d = k.b.Xa
                                                } else if (Ed < Hd) {
                                                    Ed++;
                                                    k.b = document.createElement("canvas");
                                                    k.b.width = L + 2 * ta;
                                                    k.b.height = L + 2 * ta;
                                                    k.d = k.b.getContext("2d");
                                                    k.b.Xa = k.d;
                                                    a += I + "touch-callout: none;";
                                                    a += I + "tap-highlight-color: rgba(0,0,0,0);";
                                                    k.b.style[T + "Origin"] = "0% 0%";
                                                    k.b.style.overflow = "hidden";
                                                    k.b.style.position = "absolute";
                                                    for (q = s.firstChild; q && q.K && (-1 == q.K || q.K >= c);)
                                                        q = q.nextSibling;
                                                    s.insertBefore(k.b, q)
                                                }
                                                k.b && (Fd++,
                                                    k.a = new Image,
                                                    k.a.style[T + "Origin"] = "0% 0%",
                                                    k.a.style.position = "absolute",
                                                    k.a.style.overflow = "hidden",
                                                    k.a.crossOrigin = b.ba,
                                                    k.b.K = c,
                                                    n && (k.b.id = "tile" + curCfNr + "_" + c + "___" + ty + "_" + tx),
                                                    k.a.onload = Nd(k),
                                                    k.a.onerror = wd(k),
                                                    k.a.onabort = wd(k),
                                                    k.a.setAttribute("src", od(c)),
                                                    level.t && b.checkLoaded.push(k.a),
                                                    0 == U && b.divSkin && b.divSkin.ggReLoadedLevels && b.divSkin.ggReLoadedLevels(),
                                                    U++,
                                                    b.dirty = l)
                                            }
                                            k.b && (a = "",
                                                ma ? (a += "translate3d(" + z / 2 + "px," + t / 2 + "px,0px) ",
                                                    a += " perspective(" + h + "px) ",
                                                    a += "translate3d(0px,0px," + h + "px) ") : a += "translate3d(" + z / 2 + "px," + t / 2 + "px," + h + "px) ",
                                                a += "rotateZ(" + Number(la).toFixed(10) + "deg) rotateX(" + Number(x).toFixed(10) + "deg)  rotateY(" + Number(-u).toFixed(10) + "deg) ",
                                                a = 4 > curCfNr ? a + ("rotateY(" + -90 * curCfNr + "deg)") : a + ("rotateX(" + (4 == curCfNr ? -90 : 90) + "deg)"),
                                                q = 1,
                                                qb ? (q = (2 * c + 1) * L / level.width * (Hb / L),
                                                    q = sb ? 2 / Math.tan(A * Math.PI / 360) * q : 2 * q,
                                                    a += " scale(" + q * m * m + ")") : q = 1 / (m * m),
                                                a += " translate3d(" + (1 / m * tx * L - ta - level.width / 2) + "px," + (1 / m * ty * L - ta - level.width / 2) + "px," + -level.width * q / 2 + "px)",
                                                n && (k.b.id = "rtile_" + Jd + "_" + curCfNr + "_" + c + "___" + ty + "_" + tx),
                                                f.F && (k.ja = l,
                                                    k.b ? k.b.style[T] = a : k.a && (k.a.style[T] = a)))
                                        }
                                }
                            c--
                        }
                        for (h = 0; h < D.length; h++)
                            for (e in level = D[h],
                                level.g)
                                level.g.hasOwnProperty(e) && (k = level.g[e], !k.ja && k.b && (level.t ? (a = "translate3d(-10px,-10px,0px) scale(0.001,0.001)",
                                    k.b ? (k.b.style[T] = a,
                                        n && (k.b.id = "cache")) : k.a && (k.a.style[T] = "")) : (k.d && (k.d.clear ? k.d.clear() : k.d.clearRect(0, 0, k.d.canvas.width, k.d.canvas.height)),
                                    unusedTileCanvas.push(k.b),
                                    k.b ? (n && (k.b.id = "unused"),
                                        a = "translate3d(-10px,-10px,0px) scale(0.001,0.001)",
                                        k.b.style[T] = a,
                                        k.b.K = -1) : k.loaded && s.removeChild(k.a),
                                    k.b = o,
                                    k.a = o,
                                    k.d = o,
                                    delete level.g[e])));
                        b.T = r
                    }
                } else {
                    Ua();
                    n = r;
                    if (z != s.offsetWidth || t != s.offsetHeight)
                        z = parseInt(s.offsetWidth),
                        t = parseInt(s.offsetHeight),
                        s.style[T + "OriginX"] = z / 2 + "px",
                        s.style[T + "OriginY"] = t / 2 + "px",
                        n = l;
                    e = Math.round(b.S());
                    if ((b.ga != e || n) && !ma)
                        b.ga = e,
                        s.style[za] = e + "px";
                    b.f.za(u, x);
                    for (n = 0; 6 > n; n++)
                        if (h = b.f.j[n])
                            a = "",
                            ma ? (a += "translate3d(" + z / 2 + "px," + t / 2 + "px,0px) ",
                                a += "perspective(" + e + "px) ",
                                a += "translate3d(0px,0px," + e + "px) ") : a += "translate3d(" + z / 2 + "px," + t / 2 + "px," + e + "px) ",
                            a += "rotateZ(" + Number(la).toFixed(10) + "deg) rotateX(" + Number(x).toFixed(10) + "deg)  rotateY(" + Number(-u).toFixed(10) + "deg) ",
                            h.Pa && (a += h.Pa,
                                h.F || (a = "translate3d(-10px,-10px,0px) scale(0.001,0.001)"),
                                h.style[T] = a)
                }
            else if (yb) {
                Ua();
                na && (h = na.getContext("2d"));
                if (z != s.offsetWidth || t != s.offsetHeight)
                    z = parseInt(s.offsetWidth),
                    t = parseInt(s.offsetHeight);
                h && (e = h.canvas.width / 2,
                    n = h.canvas.height / 2,
                    a = h.createRadialGradient(e, n, 5, e, n, Math.max(e, n)),
                    a.addColorStop(0, "#333"),
                    a.addColorStop(1, "#fff"),
                    h.rect(0, 0, h.canvas.width, h.canvas.height),
                    h.fillStyle = a,
                    h.fill(),
                    h.fillStyle = "#f00",
                    h.font = "20px Helvetica",
                    h.textAlign = "center",
                    h.fillText("Pan: " + u.toFixed(1), e, n - 30),
                    h.fillText("Tilt: " + x.toFixed(1), e, n),
                    h.fillText("Fov: " + A.toFixed(1), e, n + 30))
            }
            bc()
        };
        var ma = r,
            qb = r;
        b.setRenderFlags = function(a) {
            a = Math.round(a);
            ma = a & 1;
            qb = a & 2;
            Yb = a & 4;
            4096 <= a && (Ca = a & 4096,
                ga = a & 8192,
                yb = a & 32768)
        };
        b.getRenderFlags = function() {
            var a = 0;
            ma && (a |= 1);
            qb && (a |= 2);
            Yb && (a |= 4);
            Ca && (a |= 4096);
            ga && (a |= 8192);
            yb && (a |= 32768);
            return a
        };
        var Jd = 1,
            E;
        b.initWebGL = function(a) {
            Lc = r;
            try {
                if (Ba = a ? a : document.createElement("canvas"),
                    Ba.width = 100,
                    Ba.height = 100,
                    s.appendChild(Ba),
                    (g = Ba.getContext("webgl")) || (g = Ba.getContext("experimental-webgl")),
                    g) {
                    g.Ja = 500;
                    g.Ia = 500;
                    g.clearColor(0, 0, 0, 0);
                    if (pb && 6 < pb.length) {
                        var b = parseInt(pb);
                        g.clearColor((b >> 16 & 255) / 255, (b >> 8 & 255) / 255, (b >> 0 & 255) / 255, 1)
                    }
                    g.enable(g.DEPTH_TEST);
                    g.viewport(0, 0, 500, 500);
                    g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT);
                    var c = g.createShader(g.FRAGMENT_SHADER);
                    g.shaderSource(c, "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nvoid main(void) {\n\tgl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n}\n");
                    g.compileShader(c);
                    g.getShaderParameter(c, g.COMPILE_STATUS) || (alert(g.getShaderInfoLog(c)),
                        c = o);
                    var f = g.createShader(g.VERTEX_SHADER);
                    g.shaderSource(f, "attribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nvarying vec2 vTextureCoord;\nvoid main(void) {\n\tgl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n\tvTextureCoord = aTextureCoord;\n}\n");
                    g.compileShader(f);
                    g.getShaderParameter(f, g.COMPILE_STATUS) || (alert(g.getShaderInfoLog(f)),
                        f = o);
                    E = g.createProgram();
                    g.attachShader(E, f);
                    g.attachShader(E, c);
                    g.linkProgram(E);
                    g.getProgramParameter(E, g.LINK_STATUS) || alert("Could not initialise shaders");
                    g.useProgram(E);
                    E.Ha = g.getAttribLocation(E, "aVertexPosition");
                    g.enableVertexAttribArray(E.Ha);
                    E.Fa = g.getAttribLocation(E, "aTextureCoord");
                    g.enableVertexAttribArray(E.Fa);
                    E.sa = g.getUniformLocation(E, "uPMatrix");
                    E.Sa = g.getUniformLocation(E, "uMVMatrix");
                    E.Ua = g.getUniformLocation(E, "uSampler");
                    md(Gb);
                    nd()
                }
            } catch (e) {}
            g ? ga = l : alert("Could not initialise WebGL!")
        };
        var da = [],
            ea = new glMatrixArrayType(16),
            Ma = new glMatrixArrayType(16),
            Ac, Ub, Vb;
        b.getPan = function() {
            return u
        };
        b.getPanDest = function() {
            return ic
        };
        b.getPanN = function() {
            for (var a = u; - 180 > a;)
                a += 360;
            for (; 180 < a;)
                a -= 360;
            return a
        };
        b.getPanNorth = function() {
            for (var a = u - Xb; - 180 > a;)
                a += 360;
            for (; 180 < a;)
                a -= 360;
            return a
        };
        b.setPan = function(a) {
            K();
            isNaN(a) || (u = Number(a));
            b.update()
        };
        b.setPanNorth = function(a) {
            K();
            isNaN(a) || (u = Number(a) + Xb);
            b.update()
        };
        b.changePan = function(a, d) {
            b.setPan(b.getPan() + a);
            d && (G = a)
        };
        b.changePanLog = function(a, d) {
            b.changePan(a * ha(), d)
        };
        b.getTilt = function() {
            return x
        };
        b.getTiltDest = function() {
            return jc
        };
        b.setTilt = function(a) {
            K();
            isNaN(a) || (x = Number(a));
            b.update()
        };
        b.changeTilt = function(a, d) {
            b.setTilt(b.getTilt() + a);
            d && (O = a)
        };
        b.changeTiltLog = function(a, d) {
            b.changeTilt(a * ha(), d)
        };
        b.getFov = function() {
            return A
        };
        b.getFovDest = function() {
            return kc
        };
        b.setFov = function(a) {
            K();
            if (!isNaN(a) && 0 < a && 180 > a) {
                var d = A;
                A = Number(a);
                Ua();
                d != A && b.update()
            }
        };
        b.changeFov = function(a, d) {
            b.setFov(b.getFov() + a);
            d && (N = a)
        };
        b.changeFovLog = function(a, d) {
            if (!isNaN(a)) {
                var c;
                c = a / 90 * Math.cos(A * Math.PI / 360);
                c = A * Math.exp(c);
                b.setFov(c);
                d && (N = a)
            }
        };
        b.setRoll = function(a) {
            K();
            isNaN(a) || (la = Number(a));
            b.update()
        };
        b.getRoll = function() {
            return la
        };
        b.setPanTilt = function(a, d) {
            K();
            isNaN(a) || (u = a);
            isNaN(d) || (x = d);
            b.update()
        };
        b.setPanTiltFov = function(a, d, c) {
            K();
            isNaN(a) || (u = a);
            isNaN(d) || (x = d);
            !isNaN(c) && 0 < c && 180 > c && (A = c);
            b.update()
        };
        b.setDefaultView = function() {
            b.setPanTiltFov(Ic, Jc, Mb)
        };
        b.setLocked = function(a) {
            b.setLockedMouse(a);
            b.setLockedWheel(a);
            b.setLockedKeyboard(a)
        };
        b.setLockedMouse = function(a) {
            ca = a
        };
        b.setLockedKeyboard = function(a) {
            Pb = a
        };
        b.setLockedWheel = function(a) {
            xc = a
        };
        b.moveTo = function(a, b, c, f) {
            K();
            zb = l;
            var e = a.toString().split("/");
            1 < e.length && (a = Number(e[0]),
                f = b,
                b = Number(e[1]),
                2 < e.length && (c = Number(e[2])));
            ic = isNaN(a) ? u : a;
            jc = isNaN(b) ? x : b;
            kc = !isNaN(c) && 0 < c && 180 > c ? c : A;
            Qc = !isNaN(f) && 0 < f ? f : 1
        };
        b.moveToDefaultView = function(a) {
            b.moveTo(Ic, Jc, Mb, a)
        };
        var Rb = -1;
        b.isTouching = function() {
            // Dd((b.m != o || 0 <= Q));
            return b.m != o || 0 <= Q
        };
        var Ta, Qb = 1;
        K();
        var ec = 0,
            hc = 0,
            aa;
        b.Wa = function() {
            var a;
            a = S;
            b.control = a;
            Wa();
            setTimeout(function() {
                Da()
            }, 10);
            setTimeout(function() {
                Xa()
            }, 200);
            setTimeout(function() {
                Aa();
                b.updatePanorama()
            }, 10);
            a.addEventListener ? (a.addEventListener("touchstart", _touchstart, r),
                a.addEventListener("touchmove", _touchmove, r),
                a.addEventListener("touchend", _touchend, r),
                a.addEventListener("touchcancel", _touchcancel, r),
                a.addEventListener("MSPointerDown", db, r),
                a.addEventListener("MSGestureStart", Oa, r),
                a.addEventListener("MSGestureEnd", Na, r),
                a.addEventListener("MSGestureChange", bb, r),
                a.addEventListener("gesturestart", Oa, r),
                a.addEventListener("gesturechange", cb, r),
                a.addEventListener("gestureend", Na, r),
                a.addEventListener("mousedown", kd, r),
                a.addEventListener("mousemove", jd, r),
                document.addEventListener("mouseup", gd, r),
                a.addEventListener("mousedblclick", b.toggleFullscreen, r),
                a.addEventListener("mousewheel", wc, r),
                a.addEventListener("DOMMouseScroll", wc, r),
                document.addEventListener("keydown", ab, r),
                document.addEventListener("keyup", $a, r),
                window.addEventListener("orientationchange", Wa, r),
                window.addEventListener("resize", Aa, r),
                window.addEventListener("blur", Za, r),
                b.c.addEventListener("webkitfullscreenchange", Ea, r),
                document.addEventListener("mozfullscreenchange", Ea, r),
                window.addEventListener("webkitfullscreenchange", Ea, r),
                document.addEventListener("MSFullscreenChange", Ea, r)) : a.attachEvent && (a.attachEvent("onmousedown", kd),
                a.attachEvent("onmousemove", jd),
                document.attachEvent("onmouseup", gd),
                a.attachEvent("onmousedblclick", b.toggleFullscreen),
                a.attachEvent("onmousewheel", wc),
                document.attachEvent("onkeydown", ab),
                document.attachEvent("onkeyup", $a),
                window.attachEvent("onresize", Aa),
                window.attachEvent("onblur", Za));
            a.oncontextmenu = function(a) {
                void 0 === a && (a = window.event);
                return !a.ctrlKey && (a = "<<U>>",
                    "U" != a.charAt(2)) ? (oa(),
                    r) : l
            }
        };
        b.addHotspotElements = function() {
            for (var a = 0; a < J.length; a++)
                if ("point" == J[a].type && (J[a].obj = b.skinObj && b.skinObj.addSkinHotspot ? new b.skinObj.addSkinHotspot(J[a]) : new Pd(this, J[a]),
                        J[a].obj.__div.style.left = "-1000px",
                        J[a].obj.__div.style.top = "-1000px",
                        J[a].obj && J[a].obj.__div)) {
                    var d = S.firstChild;
                    d ? S.insertBefore(J[a].obj.__div, d) : S.appendChild(J[a].obj.__div)
                }
        };
        b.isPlaying = function(a) {
            return "_main" == a ? l : (a = B(a)) ? !a.obj.ended && !a.obj.paused : r
        };
        b.playSound = function(a, b) {
            var c = B(a);
            c && (c.obj.r = b && !isNaN(Number(b)) ? Number(b) - 1 : c.loop - 1, -1 == c.obj.r && (c.obj.r = 1E7),
                c.obj.play())
        };
        b.playPauseSound = function(a, d) {
            b.isPlaying(a) ? b.pauseSound(a) : b.playSound(a, d)
        };
        b.pauseSound = function(a) {
            if ("_main" == a) {
                for (a = 0; a < C.length; a++)
                    C[a].obj.pause();
                for (a = 0; a < y.length; a++)
                    y[a].obj.pause()
            } else
                (a = B(a)) && a.obj.pause()
        };
        b.activateSound = function(a, b) {
            var c = B(a);
            c && (0 == b || 1 == b ? c.W && c.W(1 == b) : 2 == b && c.o && c.o())
        };
        b.stopSound = function(a) {
            if ("_main" == a) {
                for (a = 0; a < C.length; a++)
                    C[a].obj.pause(),
                    C[a].obj.currentTime = 0;
                for (a = 0; a < y.length; a++)
                    y[a].obj.pause(),
                    y[a].obj.currentTime = 0
            } else if (a = B(a))
                a.obj.pause(),
                a.obj.currentTime = 0
        };
        b.setVolume = function(a, b) {
            var c = Number(b);
            1 < c && (c = 1);
            0 > c && (c = 0);
            if ("_main" == a) {
                Y = c;
                for (c = 0; c < C.length; c++)
                    C[c].obj.volume = C[c].i * Y;
                for (c = 0; c < y.length; c++)
                    y[c].obj.volume = y[c].i * Y
            } else {
                var f = B(a);
                f && (f.i = c,
                    f.obj.volume = c * Y)
            }
        };
        b.changeVolume = function(a, b) {
            if ("_main" == a) {
                var c = Y,
                    c = c + Number(b);
                1 < c && (c = 1);
                0 > c && (c = 0);
                Y = c;
                for (c = 0; c < C.length; c++)
                    C[c].obj.volume = C[c].i * Y;
                for (c = 0; c < y.length; c++)
                    y[c].obj.volume = y[c].i * Y
            } else {
                var f = B(a);
                f && (c = f.i,
                    c += Number(b),
                    1 < c && (c = 1),
                    0 > c && (c = 0),
                    f.i = c,
                    f.obj.volume = c * Y)
            }
        };
        b.removeHotspots = function() {
            for (var a; 0 < J.length;)
                a = J.pop(),
                a.obj && (S.removeChild(a.obj.__div),
                    delete a.obj),
                a.obj = o
        };
        b.setFullscreen = function(a) {
            var d = b.isFullscreen != a;
            b.isFullscreen != a && (b.isFullscreen = a,
                b.update(100));
            if (b.isFullscreen) {
                if (Yb)
                    try {
                        b.c.webkitRequestFullScreen ? b.c.webkitRequestFullScreen() : b.c.mozRequestFullScreen ? b.c.mozRequestFullScreen() : b.c.msRequestFullscreen ? b.c.msRequestFullscreen() : b.c.requestFullScreen ? b.c.requestFullScreen() : b.c.requestFullscreen && b.c.requestFullscreen()
                    } catch (c) {}
                b.c.style.position = "absolute";
                a = Db();
                b.c.style.left = window.pageXOffset - a.x + Z + "px";
                b.c.style.top = window.pageYOffset - a.y + ba + "px";
                document.body.style.overflow = "hidden";
                d && b.divSkin && b.divSkin.ggEnterFullscreen && b.divSkin.ggEnterFullscreen()
            } else {
                if (Yb)
                    try {
                        document.webkitIsFullScreen ? document.webkitCancelFullScreen() : document.mozFullScreen ? document.mozCancelFullScreen() : document.msExitFullscreen ? document.msExitFullscreen() : document.fullScreen && (document.cancelFullScreen ? document.cancelFullScreen() : document.exitFullscreen && document.exitFullscreen())
                    } catch (f) {}
                b.c.style.position = "relative";
                b.c.style.left = "0px";
                b.c.style.top = "0px";
                document.body.style.overflow = "";
                d && b.divSkin && b.divSkin.ggExitFullscreen && b.divSkin.ggExitFullscreen()
            }
            Aa()
        };
        b.toggleFullscreen = function() {
            b.setFullscreen(!b.isFullscreen)
        };
        b.enterFullscreen = function() {
            b.setFullscreen(l)
        };
        b.exitFullscreen = function() {
            b.setFullscreen(r)
        };
        b.startAutorotate = function(a, b, c) {
            ia = Ab = l;
            jb = (new Date).getTime();
            a && 0 != a && (Ra = a);
            b && (nc = b);
            c && (Lb = c)
        };
        b.stopAutorotate = function() {
            Ab = ia = r
        };
        b.toggleAutorotate = function() {
            (ia = Ab = !ia) && (jb = (new Date).getTime())
        };
        b.createLayers = function(a) {
            var d = r,
                d = r;
            b.da = document.getElementById(a);
            b.da ? (b.da.innerHTML = "",
                b.c = document.createElement("div"),
                d && b.c.setAttribute("id", "viewport"),
                a = "top:  0px;left: 0px;position:relative;-ms-touch-action: none;" + (I + "user-select: none;"),
                a += I + "touch-callout: none;",
                a += I + "tap-highlight-color: rgba(0,0,0,0);",
                b.c.setAttribute("style", a),
                b.da.appendChild(b.c),
                s = document.createElement("div"),
                a = "top:  0px;left: 0px;width:  100px;height: 100px;overflow: hidden;position:absolute;" + (I + "user-select: none;"),
                a += I + "touch-callout: none;",
                a += I + "tap-highlight-color: rgba(0,0,0,0);",
                d && s.setAttribute("id", "viewer"),
                s.setAttribute("style", a),
                b.c.appendChild(s),
                S = document.createElement("div"),
                d && S.setAttribute("id", "hotspots"),
                a = "top:  0px;left: 0px;width:  100px;height: 100px;overflow: hidden;position:absolute;z-index: 1000;",
                Qd && (a += "background-image: url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7);"),
                sb && !ga && (a += I + "transform: translateZ(9999999px);"),
                a += I + "user-select: none;",
                a += I + "touch-callout: none;",
                a += I + "tap-highlight-color: rgba(0,0,0,0);",
                S.setAttribute("style", a),
                b.c.appendChild(S),
                $ = document.createElement("canvas"),
                d && $.setAttribute("id", "hotspotcanvas"),
                a = "top:  0px;left: 0px;width:  100px;height: 100px;overflow: hidden;position:absolute;z-index: 900;" + (I + "user-select: none;"),
                a += I + "pointer-events: none;",
                a += I + "touch-callout: none;",
                a += I + "tap-highlight-color: rgba(0,0,0,0);",
                $.setAttribute("style", a),
                b.c.appendChild($),
                M = document.createElement("div"),
                d && M.setAttribute("id", "hotspottext"),
                M.setAttribute("style", "top:  0px;left: 0px;position:absolute;padding: 3px;visibility: hidden;z-index: 1100;"),
                M.innerHTML = " Hotspot text!",
                b.c.appendChild(M),
                b.divSkin = S) : alert("container not found!")
        };
        b.Ma = function(a) {
            var d, c, f, e = 128;
            pb && (s.style.backgroundColor = pb.replace("0x", "#"));
            a ? (e = Hb,
                Gb = 1) : nb > e && (e = nb);
            for (f = 0; 6 > f; f++) {
                a ? (c = {},
                    c.width = Hb,
                    c.height = Hb) : (c = document.createElement("canvas"),
                    c.width = nb,
                    c.height = nb,
                    c.d = c.getContext("2d"));
                d = "position:absolute;";
                d += "left: 0px;";
                d += "top: 0px;";
                d += "width: " + e + "px;";
                d += "height: " + e + "px;";
                a && (d += "outline: 1px solid transparent;");
                d += I + "transform-origin: 0% 0%;";
                d += "-webkit-user-select: none;";
                d += I + "transform: ";
                var g;
                g = "";
                var h = 1;
                qb && (h = 100);
                g = 4 > f ? g + ("rotateY(" + -90 * f + "deg)") : g + ("rotateX(" + (4 == f ? -90 : 90) + "deg)");
                qb && (g += " scale(" + h + ")");
                g += " translate3d(" + -e / 2 + "px," + -e / 2 + "px," + -e * h / (2 * Gb) + "px)";
                d += g + ";";
                c.Pa = g;
                a || (c.setAttribute("style", d),
                    s.insertBefore(c, s.firstChild));
                b.f.j[f] = c
            }
            if (!a) {
                for (f = 0; 6 > f; f++)
                    c = b.f.j[f],
                    "" != mb[f] && (c.A = new Image,
                        c.A.onload = H(c),
                        c.A.crossOrigin = b.ba,
                        c.A.setAttribute("src", pa(mb[f])),
                        b.checkLoaded.push(c.A));
                for (f = 0; 6 > f; f++)
                    c = b.f.j[f],
                    c.loaded = r,
                    c.a = new Image,
                    c.a.onload = H(c),
                    c.a.crossOrigin = b.ba,
                    c.a.setAttribute("src", pa(Wb[f])),
                    b.checkLoaded.push(c.a)
            }
        };
        b.setOverlayOpacity = function(a) {
            var d;
            if (Ca)
                for (d = 0; 6 > d; d++)
                    b.f.la[d] && b.f.la[d].style && (b.f.la[d].style.opacity = a)
        };
        b.removePanorama = function() {
            var a;
            if (Ca) {
                for (a = 0; a < b.f.j.length; a++)
                    b.f.j[a].setAttribute && (b.f.j[a].setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYBgeACDAAADIAAE3iTbkAAAAAElFTkSuQmCC"),
                        s.removeChild(b.f.j[a]));
                if (D) {
                    for (a = 0; a < D.length; a++) {
                        var d = D[a],
                            c;
                        for (c in d.g)
                            if (d.g.hasOwnProperty(c)) {
                                var f = d.g[c];
                                f.ja = r;
                                f.b && (f.d && (f.d.clear ? f.d.clear() : f.d.clearRect(0, 0, f.d.canvas.width, f.d.canvas.height)),
                                    unusedTileCanvas.push(f.b));
                                f.a && delete f.a;
                                f.M && g.deleteTexture(f.M);
                                f.d = o;
                                f.b = o;
                                f.a = o
                            }
                        delete d.g
                    }
                    delete D;
                    D = o
                }
                b.f.j = [];
                b.f.la = []
            }
            if (g && da)
                for (; 0 < da.length;)
                    c = da.pop(),
                    c.eb = l,
                    g.deleteTexture(c);
            for (a = 0; a < y.length; a++)
                s.removeChild(y[a].obj);
            for (a = 0; a < fa.length; a++)
                s.removeChild(fa[a].obj);
            c = [];
            for (a = 0; a < C.length; a++)
                if (d = C[a],
                    0 == d.mode || 1 == d.mode || d.ib)
                    c.push(d);
                else {
                    try {
                        d.obj.pause()
                    } catch (e) {}
                    b.c.removeChild(d.obj)
                }
            C = c;
            y = [];
            fa = []
        };
        b.getScreenResolution = function() {
            var a = 1,
                b = -1 != navigator.userAgent.indexOf("Mac");
            window.devicePixelRatio && b && (a = window.devicePixelRatio);
            return {
                w: screen.width * a,
                h: screen.height * a
            }
        };
        b.getMaxScreenResolution = function() {
            var a = b.getScreenResolution();
            return a.w > a.h ? a.w : a.h
        };
        b.readConfigString = function(a, d) {
            window.DOMParser ? (parser = new DOMParser,
                xmlDoc = parser.parseFromString(a, "text/xml")) : (xmlDoc = new ActiveXObject("Microsoft.XMLDOM"),
                xmlDoc.async = "false",
                xmlDoc.loadXML(a));
            b.readConfigXml(xmlDoc, d)
        };
        b.readConfigUrl = function(a, d, c) {
            try {
                var f;
                f = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP");
                f.open("GET", a, r);
                f.send(o);
                if (f.responseXML) {
                    var e = a.lastIndexOf("/");
                    0 <= e && (Eb = a.substr(0, e + 1));
                    2 <= arguments.length && d != o && (Eb = d);
                    b.readConfigString(f.responseText, c)
                } else
                    alert("Error loading panorama XML")
            } catch (g) {
                alert("Error:" + g)
            }
        };
        var $b = l;
        b.getCurrentNode = function() {
            return Jb
        };
        b.readConfigXml = function(a, d) {
            var c = a.firstChild;
            ob = [];
            va = [];
            if ("tour" == c.nodeName) {
                var f = "",
                    e;
                (e = c.getAttributeNode("start")) && (f = e.nodeValue.toString());
                "" != b.startNode && (f = b.startNode,
                    b.startNode = "");
                for (c = c.firstChild; c;) {
                    e = "";
                    if ("panorama" == c.nodeName && (e = c.getAttributeNode("id")))
                        e = e.nodeValue.toString(),
                        "" == f && (f = e),
                        ob[e] = c,
                        va.push(e);
                    c = c.nextSibling
                }
                b.Ca(ob[f], d);
                p("{" + f + "}");
                b.Ba = l
            } else
                b.Ba = r,
                b.Ca(c, d),
                p(""),
                va.push("")
        };
        b.Ca = function(a, d) {
            b.removeHotspots();
            b.hotspot = b.emptyHotspot;
            b.removePanorama();
            b.ga = 0;
            for (var c = a.firstChild, f, e, h, p = 0; c;) {
                if ("view" == c.nodeName) {
                    (e = c.getAttributeNode("fovmode")) && (Kc = Number(e.nodeValue));
                    e = c.getAttributeNode("pannorth");
                    Xb = 1 * (e ? e.nodeValue : 0);
                    for (f = c.firstChild; f;)
                        "start" == f.nodeName && (e = f.getAttributeNode("pan"),
                            Ic = u = Number(e ? e.nodeValue : 0),
                            e = f.getAttributeNode("tilt"),
                            Jc = x = Number(e ? e.nodeValue : 0),
                            e = f.getAttributeNode("fov"),
                            Mb = A = Number(e ? e.nodeValue : 70)),
                        "min" == f.nodeName && (e = f.getAttributeNode("pan"),
                            ib = 1 * (e ? e.nodeValue : 0),
                            e = f.getAttributeNode("tilt"),
                            La = 1 * (e ? e.nodeValue : -90),
                            e = f.getAttributeNode("fov"),
                            ka = 1 * (e ? e.nodeValue : 5),
                            1.0E-20 > ka && (ka = 1.0E-20),
                            e = f.getAttributeNode("fovpixel"),
                            Cc = 1 * (e ? e.nodeValue : 0)),
                        "max" == f.nodeName && (e = f.getAttributeNode("pan"),
                            hb = 1 * (e ? e.nodeValue : 0),
                            e = f.getAttributeNode("tilt"),
                            Ka = 1 * (e ? e.nodeValue : 90),
                            e = f.getAttributeNode("fov"),
                            sa = 1 * (e ? e.nodeValue : 120),
                            180 <= sa && (sa = 179.9)),
                        f = f.nextSibling
                }
                if ("autorotate" == c.nodeName && ((e = c.getAttributeNode("speed")) && (Ra = 1 * e.nodeValue),
                        (e = c.getAttributeNode("delay")) && (nc = 1 * e.nodeValue),
                        (e = c.getAttributeNode("returntohorizon")) && (Lb = 1 * e.nodeValue),
                        (e = c.getAttributeNode("nodedelay")) && (mc = 1 * e.nodeValue),
                        (e = c.getAttributeNode("noderandom")) && (Rc = 1 == e.nodeValue),
                        $b && (ia = Ab = l,
                            jb = (new Date).getTime()),
                        e = c.getAttributeNode("startloaded")))
                    (oc = 1 == e.nodeValue) && (ia = r);
                "input" == c.nodeName && (h || (h = c));
                if (h)
                    for (f = 0; 6 > f; f++)
                        e = h.getAttributeNode("prev" + f + "url"),
                        mb[f] = e ? new String(e.nodeValue) : "";
                "altinput" == c.nodeName && (f = 0,
                    (e = c.getAttributeNode("screensize")) && (f = 1 * e.nodeValue),
                    0 < f && f <= b.getMaxScreenResolution() && f > p && (p = f,
                        h = c));
                if ("control" == c.nodeName && $b) {
                    (e = c.getAttributeNode("simulatemass")) && (gc = 1 == e.nodeValue);
                    (e = c.getAttributeNode("locked")) && (ca = 1 == e.nodeValue);
                    e && (Pb = 1 == e.nodeValue);
                    (e = c.getAttributeNode("lockedmouse")) && (ca = 1 == e.nodeValue);
                    (e = c.getAttributeNode("lockedkeyboard")) && (Pb = 1 == e.nodeValue);
                    (e = c.getAttributeNode("lockedwheel")) && (xc = 1 == e.nodeValue);
                    (e = c.getAttributeNode("invertwheel")) && (ed = 1 == e.nodeValue);
                    (e = c.getAttributeNode("speedwheel")) && (fd = 1 * e.nodeValue);
                    (e = c.getAttributeNode("invertcontrol")) && (Pa = 1 == e.nodeValue);
                    if (e = c.getAttributeNode("sensitivity"))
                        gb = 1 * e.nodeValue,
                        1 > gb && (gb = 1);
                    (e = c.getAttributeNode("dblclickfullscreen")) && (sc = 1 == e.nodeValue)
                }
                "overlay" == c.nodeName && ((e = c.getAttributeNode("blendspeed")) && (kb = 1 * e.nodeValue),
                    (e = c.getAttributeNode("auto")) && (Sc = 1 == e.nodeValue),
                    (e = c.getAttributeNode("delay")) && (Tc = 1 * e.nodeValue));
                "userdata" == c.nodeName && (b.userdata = q(c));
                if ("hotspots" == c.nodeName)
                    for (f = c.firstChild; f;) {
                        if ("label" == f.nodeName) {
                            var k = Sb;
                            if (e = f.getAttributeNode("enabled"))
                                k.enabled = 1 == e.nodeValue;
                            if (e = f.getAttributeNode("width"))
                                k.width = 1 * e.nodeValue;
                            if (e = f.getAttributeNode("height"))
                                k.height = 1 * e.nodeValue;
                            if (e = f.getAttributeNode("textcolor"))
                                k.Ea = 1 * e.nodeValue;
                            if (e = f.getAttributeNode("textalpha"))
                                k.Da = 1 * e.nodeValue;
                            if (e = f.getAttributeNode("background"))
                                k.background = 1 == e.nodeValue;
                            if (e = f.getAttributeNode("backgroundalpha"))
                                k.O = 1 * e.nodeValue;
                            if (e = f.getAttributeNode("backgroundcolor"))
                                k.P = 1 * e.nodeValue;
                            if (e = f.getAttributeNode("border"))
                                k.ya = 1 * e.nodeValue;
                            if (e = f.getAttributeNode("bordercolor"))
                                k.R = 1 * e.nodeValue;
                            if (e = f.getAttributeNode("borderalpha"))
                                k.Q = 1 * e.nodeValue;
                            if (e = f.getAttributeNode("borderradius"))
                                k.xa = 1 * e.nodeValue;
                            if (e = f.getAttributeNode("wordwrap"))
                                k.wordwrap = 1 == e.nodeValue
                        }
                        "polystyle" == f.nodeName && ((e = f.getAttributeNode("mode")) && (R = 1 * e.nodeValue),
                            (e = f.getAttributeNode("bordercolor")) && (Dc = 1 * e.nodeValue),
                            (e = f.getAttributeNode("backgroundcolor")) && (Fc = 1 * e.nodeValue),
                            (e = f.getAttributeNode("borderalpha")) && (Ec = 1 * e.nodeValue),
                            (e = f.getAttributeNode("backgroundalpha")) && (Gc = 1 * e.nodeValue));
                        "hotspot" == f.nodeName && (k = {
                                type: "point",
                                pan: 0,
                                tilt: 0,
                                url: "",
                                target: "",
                                id: "",
                                skinid: "",
                                w: 100,
                                h: 20,
                                wordwrap: r,
                                obj: o,
                                ia: o
                            },
                            e = f.getAttributeNode("pan"),
                            k.pan = 1 * (e ? e.nodeValue : 0),
                            e = f.getAttributeNode("tilt"),
                            k.tilt = 1 * (e ? e.nodeValue : 0),
                            (e = f.getAttributeNode("url")) && (k.url = e.nodeValue.toString()),
                            (e = f.getAttributeNode("target")) && (k.target = e.nodeValue.toString()),
                            (e = f.getAttributeNode("title")) && (k.title = e.nodeValue.toString()),
                            (e = f.getAttributeNode("id")) && (k.id = e.nodeValue.toString()),
                            (e = f.getAttributeNode("skinid")) && (k.skinid = e.nodeValue.toString()),
                            (e = c.getAttributeNode("width")) && (k.w = e.nodeValue.toString()),
                            (e = c.getAttributeNode("height")) && (k.h = e.nodeValue.toString()),
                            (e = c.getAttributeNode("wordwrap")) && (k.wordwrap = 1 == e.nodeValue),
                            J.push(k));
                        if ("polyhotspot" == f.nodeName) {
                            k = {
                                type: "poly",
                                url: "",
                                target: "",
                                id: "",
                                skinid: "",
                                w: 100,
                                h: 20,
                                wordwrap: r,
                                obj: o,
                                ia: o,
                                p: 0,
                                C: 0
                            };
                            (e = f.getAttributeNode("url")) && (k.url = e.nodeValue.toString());
                            (e = f.getAttributeNode("target")) && (k.target = e.nodeValue.toString());
                            (e = f.getAttributeNode("title")) && (k.title = e.nodeValue.toString());
                            (e = f.getAttributeNode("id")) && (k.id = e.nodeValue.toString());
                            k.R = Dc;
                            k.P = Fc;
                            k.Q = Ec;
                            k.O = Gc;
                            if (e = f.getAttributeNode("bordercolor"))
                                k.R = 1 * e.nodeValue;
                            if (e = f.getAttributeNode("backgroundcolor"))
                                k.P = 1 * e.nodeValue;
                            if (e = f.getAttributeNode("borderalpha"))
                                k.Q = 1 * e.nodeValue;
                            if (e = f.getAttributeNode("backgroundalpha"))
                                k.O = 1 * e.nodeValue;
                            k.ia = [];
                            for (var n = f.firstChild; n;) {
                                if ("vertex" == n.nodeName) {
                                    var t = {
                                        pan: 0,
                                        tilt: 0
                                    };
                                    e = n.getAttributeNode("pan");
                                    t.pan = 1 * (e ? e.nodeValue : 0);
                                    e = n.getAttributeNode("tilt");
                                    t.tilt = 1 * (e ? e.nodeValue : 0);
                                    k.ia.push(t)
                                }
                                n = n.nextSibling
                            }
                            J.push(k)
                        }
                        f = f.nextSibling
                    }
                if ("sounds" == c.nodeName || "media" == c.nodeName)
                    for (f = c.firstChild; f;) {
                        if ("sound" == f.nodeName) {
                            n = {
                                id: "",
                                url: "",
                                loop: 0,
                                i: 1,
                                ca: 0,
                                mode: 1,
                                field: 10,
                                pan: 0,
                                tilt: 0,
                                s: 0,
                                N: 0,
                                url: []
                            };
                            if (e = f.getAttributeNode("id"))
                                n.id = e.nodeValue.toString();
                            (e = f.getAttributeNode("url")) && n.url.push(e.nodeValue.toString());
                            if (e = f.getAttributeNode("level"))
                                n.i = Number(e.nodeValue);
                            if (e = f.getAttributeNode("loop"))
                                n.loop = Number(e.nodeValue);
                            if (e = f.getAttributeNode("mode"))
                                n.mode = Number(e.nodeValue);
                            if (e = f.getAttributeNode("field"))
                                n.field = Number(e.nodeValue);
                            if (e = f.getAttributeNode("ambientlevel"))
                                n.ca = Number(e.nodeValue);
                            if (e = f.getAttributeNode("pan"))
                                n.pan = Number(e.nodeValue);
                            if (e = f.getAttributeNode("tilt"))
                                n.tilt = Number(e.nodeValue);
                            if (e = f.getAttributeNode("pansize"))
                                n.s = Number(e.nodeValue);
                            if (e = f.getAttributeNode("tiltsize"))
                                n.N = Number(e.nodeValue);
                            for (k = f.firstChild; k;)
                                "source" == k.nodeName && (e = k.getAttributeNode("url")) && n.url.push(e.nodeValue.toString()),
                                k = k.nextSibling;
                            Va(n)
                        }
                        if ("video" == f.nodeName) {
                            n = {
                                id: "",
                                url: "",
                                poster: "",
                                loop: 0,
                                i: 1,
                                ca: 0,
                                mode: 1,
                                field: 10,
                                pan: 0,
                                tilt: 0,
                                s: 0,
                                N: 0,
                                k: 0,
                                l: 0,
                                B: 0,
                                J: 50,
                                u: 0,
                                url: []
                            };
                            if (e = f.getAttributeNode("id"))
                                n.id = e.nodeValue.toString();
                            (e = f.getAttributeNode("url")) && n.url.push(e.nodeValue.toString());
                            if (e = f.getAttributeNode("poster"))
                                n.poster = "" + e.nodeValue;
                            if (e = f.getAttributeNode("level"))
                                n.i = Number(e.nodeValue);
                            if (e = f.getAttributeNode("loop"))
                                n.loop = Number(e.nodeValue);
                            if (e = f.getAttributeNode("mode"))
                                n.mode = Number(e.nodeValue);
                            if (e = f.getAttributeNode("field"))
                                n.field = Number(e.nodeValue);
                            if (e = f.getAttributeNode("ambientlevel"))
                                n.ca = Number(e.nodeValue);
                            if (e = f.getAttributeNode("pan"))
                                n.pan = Number(e.nodeValue);
                            if (e = f.getAttributeNode("tilt"))
                                n.tilt = Number(e.nodeValue);
                            if (e = f.getAttributeNode("pansize"))
                                n.s = Number(e.nodeValue);
                            if (e = f.getAttributeNode("tiltsize"))
                                n.N = Number(e.nodeValue);
                            if (e = f.getAttributeNode("rotx"))
                                n.k = Number(e.nodeValue);
                            if (e = f.getAttributeNode("roty"))
                                n.l = Number(e.nodeValue);
                            if (e = f.getAttributeNode("rotz"))
                                n.B = Number(e.nodeValue);
                            if (e = f.getAttributeNode("fov"))
                                n.J = Number(e.nodeValue);
                            if (e = f.getAttributeNode("width"))
                                n.z = Number(e.nodeValue);
                            if (e = f.getAttributeNode("height"))
                                n.D = Number(e.nodeValue);
                            e = f.getAttributeNode("stretch");
                            n.L = e ? Number(e.nodeValue) : 1;
                            if (e = f.getAttributeNode("clickmode"))
                                n.u = Number(e.nodeValue);
                            for (k = f.firstChild; k;)
                                "source" == k.nodeName && (e = k.getAttributeNode("url")) && n.url.push(e.nodeValue.toString()),
                                k = k.nextSibling;
                            X(n)
                        }
                        if ("image" == f.nodeName) {
                            n = {
                                id: "",
                                url: "",
                                loop: 0,
                                i: 1,
                                ca: 0,
                                mode: 1,
                                field: 10,
                                pan: 0,
                                tilt: 0,
                                s: 0,
                                N: 0,
                                k: 0,
                                l: 0,
                                B: 0,
                                J: 50,
                                u: 0
                            };
                            if (e = f.getAttributeNode("id"))
                                n.id = e.nodeValue.toString();
                            if (e = f.getAttributeNode("url"))
                                n.url = e.nodeValue.toString();
                            if (e = f.getAttributeNode("pan"))
                                n.pan = Number(e.nodeValue);
                            if (e = f.getAttributeNode("tilt"))
                                n.tilt = Number(e.nodeValue);
                            if (e = f.getAttributeNode("rotx"))
                                n.k = Number(e.nodeValue);
                            if (e = f.getAttributeNode("roty"))
                                n.l = Number(e.nodeValue);
                            if (e = f.getAttributeNode("rotz"))
                                n.B = Number(e.nodeValue);
                            if (e = f.getAttributeNode("fov"))
                                n.J = Number(e.nodeValue);
                            if (e = f.getAttributeNode("width"))
                                n.z = Number(e.nodeValue);
                            if (e = f.getAttributeNode("height"))
                                n.D = Number(e.nodeValue);
                            e = f.getAttributeNode("stretch");
                            n.L = e ? Number(e.nodeValue) : 1;
                            if (e = f.getAttributeNode("clickmode"))
                                n.u = Number(e.nodeValue);
                            for (k = f.firstChild; k;) {
                                if ("source" == k.nodeName && (e = k.getAttributeNode("url")))
                                    n.url = e.nodeValue.toString();
                                k = k.nextSibling
                            }
                            m(n)
                        }
                        f = f.nextSibling
                    }
                c = c.nextSibling
            }
            d && "" != d && (e = d.toString().split("/"),
                0 < e.length && b.setPan(Number(e[0])),
                1 < e.length && b.setTilt(Number(e[1])),
                2 < e.length && b.setFov(Number(e[2])));
            if (h) {
                for (f = 0; 6 > f; f++)
                    (e = h.getAttributeNode("tile" + f + "url")) && (Wb[f] = new String(e.nodeValue));
                for (f = 0; 6 > f; f++)
                    (e = h.getAttributeNode("prev" + f + "url")) && (mb[f] = new String(e.nodeValue));
                (e = h.getAttributeNode("tilesize")) && (nb = 1 * e.nodeValue);
                (e = h.getAttributeNode("canvassize")) && (Hb = Number(e.nodeValue));
                (e = h.getAttributeNode("tilescale")) && (Gb = 1 * e.nodeValue);
                if (e = h.getAttributeNode("leveltileurl"))
                    pd = e.nodeValue;
                (e = h.getAttributeNode("leveltilesize")) && (L = Number(e.nodeValue));
                (e = h.getAttributeNode("levelbias")) && (sd = Number(e.nodeValue));
                (e = h.getAttributeNode("overlap")) && (ta = Number(e.nodeValue));
                D = [];
                for (f = h.firstChild; f;) {
                    if ("preview" == f.nodeName && (e = f.getAttributeNode("color")))
                        pb = e.nodeValue;
                    "level" == f.nodeName && (h = {},
                        e = f.getAttributeNode("width"),
                        h.width = 1 * (e ? e.nodeValue : 1),
                        h.height = 1 * (e ? e.nodeValue : 1),
                        e = f.getAttributeNode("preload"),
                        h.t = r,
                        e && (h.t = 1 == e.nodeValue),
                        e = f.getAttributeNode("preview"),
                        h.Ta = r,
                        e && (h.Ta = 1 == e.nodeValue),
                        h.H = Math.floor((h.width + L - 1) / L),
                        h.aa = Math.floor((h.height + L - 1) / L),
                        h.g = {},
                        D.push(h));
                    f = f.nextSibling
                }
            }
            yb && (ga = Ca = r,
                na = document.createElement("canvas"),
                na.width = 100,
                na.height = 100,
                na.id = "dummycanvas",
                s.appendChild(na),
                Aa());
            ga && g && (md(Gb),
                nd());
            Ca && (0 < D.length ? b.Ma(l) : b.Ma(),
                b.ga = 0);
            b.addHotspotElements();
            b.update();
            $b && b.divSkin && b.divSkin.ggViewerInit && b.divSkin.ggViewerInit();
            $b = r;
            b.hasConfig = l;
            Aa()
        };
        b.openUrl = function(a, d) {
            0 < a.length && (".xml" == a.substr(a.length - 4) || ".swf" == a.substr(a.length - 4) || "{" == a.charAt(0) ? b.openNext(pa(a), d) : window.open(pa(a), d))
        };
        b.openNext = function(a, d) {
            b.isLoaded = r;
            b.hasConfig = r;
            b.checkLoaded = [];
            Kb = 0;
            b.divSkin && b.divSkin.ggReLoaded && b.divSkin.ggReLoaded();
            b.skinObj && b.skinObj.hotspotProxyOut && b.skinObj.hotspotProxyOut(b.hotspot.id);
            ".swf" == a.substr(a.length - 4) && (a = a.substr(0, a.length - 4) + ".xml");
            var c = "";
            d && (c = d.toString());
            c = c.replace("$cur", u + "/" + x + "/" + A);
            c = c.replace("$ap", u);
            c = c.replace("$an", b.getPanNorth());
            c = c.replace("$at", x);
            c = c.replace("$af", A);
            if ("" != c) {
                var f = c.split("/");
                3 < f.length && "" != f[3] && (b.startNode = f[3])
            }
            K();
            if ("{" == a.charAt(0))
                if (f = a.substr(1, a.length - 2),
                    ob[f])
                    b.Ca(ob[f], c),
                    p(a);
                else {
                    Dd("invalid node id: " + f);
                    return
                }
            else
                b.readConfigUrl(a, o, c);
            d && (c = d.toString(), -1 != c.indexOf("$an") && (u += Xb));
            b.update(5)
        };
        b.getNodeIds = function() {
            return va.slice(0)
        };
        b.getNodeUserdata = function(a) {
            if (!a)
                return b.userdata;
            if (a = ob[a])
                for (a = a.firstChild; a;) {
                    if ("userdata" == a.nodeName)
                        return q(a);
                    a = a.nextSibling
                }
            return []
        };
        b.getNodeLatLng = function(a) {
            var a = b.getNodeUserdata(a),
                d = [];
            "" != a.latitude && 0 != a.latitude && 0 != a.longitude && (d.push(a.latitude),
                d.push(a.longitude));
            return d
        };
        b.getNodeTitle = function(a) {
            return b.getNodeUserdata(a).title
        };
        b.detectBrowser();
        b.createLayers(h);
        b.Wa();
        //在函数体内，添加一个获取热点的list Arrary 名字叫b._DsHotspots
        b._DsHotspots = J;
        b.__upHotspot;
    }
    window.ggHasHtml5Css3D = Mc;
    window.ggHasWebGL = Nc;
    window.pano2vrPlayer = pano2vrPlayer;
})();
