             
let DEPACK_EXPORT;
const http = require('http');
const stream = require('stream');
const events = require('events');
const _crypto = require('crypto');
const os = require('os');
const path = require('path');
const fs = require('fs');             
const {Readable:aa, Writable:w} = stream;
const {EventEmitter:E} = events;
/*
 MIT streamsearch by Brian White
 https://github.com/mscdex/streamsearch
*/
function ba(a, b, c, f, e) {
  for (var d = 0; d < e; ++d, ++b, ++f) {
    if (a[b] !== c[f]) {
      return !1;
    }
  }
  return !0;
}
function ca(a, b) {
  var c = b.length, f = a.h, e = f.length, d = -a.a, g = f[e - 1], h = a.g, k = a.f;
  if (0 > d) {
    for (; 0 > d && d <= c - e;) {
      var m = d + e - 1;
      m = 0 > m ? a.f[a.a + m] : b[m];
      if (m === g && da(a, b, d, e - 1)) {
        return a.a = 0, ++a.c, d > -a.a ? a.emit("info", !0, k, 0, a.a + d) : a.emit("info", !0), a.b = d + e;
      }
      d += h[m];
    }
    if (0 > d) {
      for (; 0 > d && !da(a, b, d, c - d);) {
        d++;
      }
    }
    if (0 <= d) {
      a.emit("info", !1, k, 0, a.a), a.a = 0;
    } else {
      return f = a.a + d, 0 < f && a.emit("info", !1, k, 0, f), k.copy(k, 0, f, a.a - f), a.a -= f, b.copy(k, a.a), a.a += c, a.b = c;
    }
  }
  for (0 <= d && (d += a.b); d <= c - e;) {
    m = b[d + e - 1];
    if (m === g && b[d] === f[0] && ba(f, 0, b, d, e - 1)) {
      return ++a.c, 0 < d ? a.emit("info", !0, b, a.b, d) : a.emit("info", !0), a.b = d + e;
    }
    d += h[m];
  }
  if (d < c) {
    for (; d < c && (b[d] !== f[0] || !ba(b, d, f, 0, c - d));) {
      ++d;
    }
    d < c && (b.copy(k, 0, d, d + (c - d)), a.a = c - d);
  }
  0 < d && a.emit("info", !1, b, a.b, d < c ? d : c);
  return a.b = c;
}
function da(a, b, c, f) {
  for (var e = 0; e < f;) {
    var d = c + e;
    if ((0 > d ? a.f[a.a + d] : b[d]) === a.h[e]) {
      ++e;
    } else {
      return !1;
    }
  }
  return !0;
}
class ea extends E {
  constructor(a) {
    super();
    "string" === typeof a && (a = new Buffer(a));
    var b, c = a.length;
    this.i = Infinity;
    this.c = 0;
    this.g = Array(256);
    this.a = 0;
    this.h = a;
    this.b = 0;
    this.f = new Buffer(c);
    for (b = 0; 256 > b; ++b) {
      this.g[b] = c;
    }
    if (1 <= c) {
      for (b = 0; b < c - 1; ++b) {
        this.g[a[b]] = c - 1 - b;
      }
    }
  }
  push(a, b = 0) {
    Buffer.isBuffer(a) || (a = new Buffer(a, "binary"));
    var c = a.length;
    for (this.b = b; f !== c && this.c < this.i;) {
      var f = ca(this, a);
    }
    return f;
  }
}
;class fa extends aa {
  constructor(a) {
    super(a);
  }
  _read() {
  }
}
;const ha = Buffer.from("\r\n\r\n"), ia = /\r\n/g, ja = /^([^:]+):[ \t]?([\x00-\xFF]+)?$/;
function ka(a) {
  a.f = !1;
  a.buffer = "";
  a.a = {};
  a = a.c;
  a.a = 0;
  a.c = 0;
  a.b = 0;
}
class na extends E {
  constructor(a = {}) {
    super();
    ({maxHeaderPairs:a = 2000} = a);
    this.b = 0;
    this.g = !1;
    this.h = 0;
    this.maxHeaderPairs = a;
    this.buffer = "";
    this.a = {};
    this.f = !1;
    this.c = new ea(ha);
    this.c.on("info", (b, c, f, e) => {
      c && !this.g && (81920 < this.b + (e - f) ? (e = 81920 - this.b, this.b = 81920) : this.b += e - f, 81920 === this.b && (this.g = !0), this.buffer += c.toString("binary", f, e));
      if (b) {
        if (this.buffer && this.h !== this.maxHeaderPairs) {
          b = this.buffer.split(ia);
          c = b.length;
          e = !1;
          for (let g = 0; g < c; ++g) {
            if (0 !== b[g].length) {
              if ("\t" == b[g][0] || " " == b[g][0]) {
                this.a[d][this.a[d].length - 1] += b[g];
              } else {
                if (f = ja.exec(b[g])) {
                  var d = f[1].toLowerCase();
                  f[2] ? void 0 === this.a[d] ? this.a[d] = [f[2]] : this.a[d].push(f[2]) : this.a[d] = [""];
                  if (++this.h === this.maxHeaderPairs) {
                    break;
                  }
                } else {
                  this.buffer = b[g];
                  e = !0;
                  break;
                }
              }
            }
          }
          e || (this.buffer = "");
        }
        this.c.c = this.c.i;
        d = this.a;
        this.a = {};
        this.buffer = "";
        this.f = !0;
        this.b = this.h = 0;
        this.g = !1;
        this.emit("header", d);
      }
    });
  }
  push(a) {
    a = this.c.push(a);
    if (this.f) {
      return a;
    }
  }
}
;/*
 MIT dicer by Brian White
 https://github.com/mscdex/dicer
*/
const oa = Buffer.from("-"), pa = Buffer.from("\r\n"), qa = () => {
};
function ra(a) {
  a.a = void 0;
  a.h = void 0;
  a.g = void 0;
}
function sa(a, b, c, f, e) {
  var d, g = 0, h = !0;
  if (!a.a && a.o && c) {
    for (; 2 > a.f && f + g < e;) {
      if (45 === c[f + g]) {
        ++g, ++a.f;
      } else {
        a.f && (d = oa);
        a.f = 0;
        break;
      }
    }
    2 === a.f && (f + g < e && a._events.trailer && a.emit("trailer", c.slice(f + g, e)), ra(a), a.s = !0, 0 === a.u && (a.b = !0, a.emit("finish"), a.b = !1));
    if (a.f) {
      return;
    }
  }
  a.o && (a.o = !1);
  a.a || (a.a = new fa(a.G), a.a._read = () => {
    ta(a);
  }, g = a.c ? "preamble" : "part", a._events[g] ? a.emit(g, a.a) : a._ignore(), a.c || (a.i = !0));
  c && f < e && !a.j && (a.c || !a.i ? (d && (h = a.a.push(d)), h = a.a.push(c.slice(f, e)), h || (a.m = !0)) : !a.c && a.i && (d && a.g.push(d), d = a.g.push(c.slice(f, e)), !a.i && void 0 !== d && d < e && sa(a, !1, c, f + d, e)));
  b && (ka(a.g), a.c ? a.c = !1 : (++a.u, a.a.on("end", () => {
    0 === --a.u && (a.s ? (a.b = !0, a.emit("finish"), a.b = !1) : ta(a));
  })), a.a.push(null), a.a = void 0, a.j = !1, a.o = !0, a.f = 0);
}
function ta(a) {
  if (a.m && (a.m = !1, a.l)) {
    const b = a.l;
    a.l = void 0;
    b();
  }
}
class ua extends w {
  constructor(a) {
    super(a);
    if (!a || !a.headerFirst && "string" != typeof a.boundary) {
      throw new TypeError("Boundary required");
    }
    "string" == typeof a.boundary ? this.setBoundary(a.boundary) : this.h = void 0;
    this.H = a.headerFirst;
    this.u = this.f = 0;
    this.b = this.s = !1;
    this.c = !0;
    this.o = !1;
    this.i = this.F = !0;
    this.l = this.a = void 0;
    this.j = !1;
    this.G = "number" == typeof a.partHwm ? {highWaterMark:a.partHwm} : {};
    this.m = !1;
    this.g = new na(a);
    this.g.on("header", b => {
      this.i = !1;
      this.a.emit("header", b);
    });
  }
  emit(a) {
    "finish" != a || this.b ? w.prototype.emit.apply(this, arguments) : this.s || process.nextTick(() => {
      this.emit("error", Error("Unexpected end of multipart data"));
      this.a && !this.j ? (this.a.emit("error", Error((this.c ? "Preamble" : "Part") + " terminated early due to unexpected end of multipart data")), this.a.push(null), process.nextTick(() => {
        this.b = !0;
        this.emit("finish");
        this.b = !1;
      })) : (this.b = !0, this.emit("finish"), this.b = !1);
    });
    return !1;
  }
  _write(a, b, c) {
    if (!this.g && !this.h) {
      return c();
    }
    if (this.H && this.c) {
      if (this.a || (this.a = new fa(this.G), this._events.preamble ? this.emit("preamble", this.a) : this._ignore()), b = this.g.push(a), !this.i && void 0 !== b && b < a.length) {
        a = a.slice(b);
      } else {
        return c();
      }
    }
    this.F && (this.h.push(pa), this.F = !1);
    this.h.push(a);
    this.m ? this.l = c : c();
  }
  setBoundary(a) {
    this.h = new ea("\r\n--" + a);
    this.h.on("info", (b, c, f, e) => {
      sa(this, b, c, f, e);
    });
  }
  _ignore() {
    this.a && !this.j && (this.j = !0, this.a.on("error", qa), this.a.resume());
  }
}
;const {TextDecoder:va} = require("text-decoding"), wa = /%([a-fA-F0-9]{2})/g;
function xa(a, b) {
  return String.fromCharCode(parseInt(b, 16));
}
function I(a) {
  let b = [], c = "key", f = "", e = !1, d = !1, g = 0, h = "";
  for (var k = 0, m = a.length; k < m; ++k) {
    if ("\\" === a[k] && e) {
      if (d) {
        d = !1;
      } else {
        d = !0;
        continue;
      }
    } else {
      if ('"' == a[k]) {
        if (d) {
          d = !1;
        } else {
          e ? (e = !1, c = "key") : e = !0;
          continue;
        }
      } else {
        if (d && e && (h += "\\"), d = !1, ("charset" === c || "lang" === c) && "'" === a[k]) {
          "charset" === c ? (c = "lang", f = h.substring(1)) : c = "value";
          h = "";
          continue;
        } else {
          if ("key" == c && ("*" == a[k] || "=" == a[k]) && b.length) {
            c = "*" == a[k] ? "charset" : "value";
            b[g] = [h, void 0];
            h = "";
            continue;
          } else {
            if (!e && ";" == a[k]) {
              c = "key";
              f && (h.length && (h = K(h.replace(wa, xa), f)), f = "");
              void 0 === b[g] ? b[g] = h : b[g][1] = h;
              h = "";
              ++g;
              continue;
            } else {
              if (!e && (" " === a[k] || "\t" === a[k])) {
                continue;
              }
            }
          }
        }
      }
    }
    h += a[k];
  }
  f && h.length && (h = K(h.replace(wa, xa), f));
  void 0 === b[g] ? h && (b[g] = h) : b[g][1] = h;
  return b;
}
function K(a, b) {
  let c;
  if (a) {
    try {
      c = (new va(b)).decode(Buffer.from(a, "binary"));
    } catch (f) {
    }
  }
  return "string" == typeof c ? c : a;
}
const ya = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], za = /\+/g;
class Aa {
  constructor() {
    this.buffer = void 0;
  }
  write(a) {
    a = a.replace(za, " ");
    for (var b = "", c = 0, f = 0, e = a.length; c < e; ++c) {
      void 0 !== this.buffer ? ya[a.charCodeAt(c)] ? (this.buffer += a[c], ++f, 2 === this.buffer.length && (b += String.fromCharCode(parseInt(this.buffer, 16)), this.buffer = void 0)) : (b += "%" + this.buffer, this.buffer = void 0, --c) : "%" == a[c] && (c > f && (b += a.substring(f, c), f = c), this.buffer = "", ++f);
    }
    f < e && void 0 === this.buffer && (b += a.substring(f));
    return b;
  }
}
function Ba(a) {
  if ("string" != typeof a) {
    return "";
  }
  for (let b = a.length - 1; 0 <= b; --b) {
    switch(a.charCodeAt(b)) {
      case 47:
      case 92:
        return a = a.slice(b + 1), ".." == a || "." == a ? "" : a;
    }
  }
  return ".." == a || "." == a ? "" : a;
}
const Ca = a => {
  const {fieldSize:b = 1048576, fieldNameSize:c = 100, fileSize:f = Infinity, files:e = Infinity, fields:d = Infinity, parts:g = Infinity} = a;
  return {v:b, K:f, L:e, w:d, M:g, A:c};
};
class Da extends w {
  constructor(a) {
    a = void 0 === a ? {} : a;
    super(Object.assign({}, a.highWaterMark ? {highWaterMark:a.highWaterMark} : {}));
    this.a = !1;
    this.b = void 0;
    this.j = this.i = this.f = this.h = !1;
    this.c = a;
    if (a.headers && "string" == typeof a.headers["content-type"]) {
      a: {
        a = a.headers;
        this.b = void 0;
        if (a["content-type"]) {
          const b = I(a["content-type"]);
          let c, f;
          for (let e = 0; e < this.g.length && (f = this.g[e], "function" == typeof f.detect ? c = f.detect(b) : c = f.detect.test(b[0]), !c); ++e) {
          }
          if (c) {
            this.b = new f(this, {limits:this.c.limits, headers:a, parsedConType:b, highWaterMark:this.c.highWaterMark, fileHwm:this.c.fileHwm, defCharset:this.c.defCharset, preservePath:this.c.preservePath});
            break a;
          }
        }
        throw Error("Unsupported content type: " + a["content-type"]);
      }
    } else {
      throw Error("Missing Content-Type");
    }
  }
  emit(a, ...b) {
    if ("finish" == a) {
      if (!this.a) {
        return this.b && this.b.end(), !1;
      }
      if (this.h) {
        return !1;
      }
      this.h = !0;
    }
    return super.emit(a, ...b);
  }
  get g() {
    return [];
  }
  _write(a, b, c) {
    if (!this.b) {
      return c(Error("Not ready to parse. Missing Content-Type?"));
    }
    this.b.write(a, c);
  }
}
;const Ea = /^boundary$/i, Fa = /^form-data$/i, Ga = /^charset$/i, Ha = /^filename$/i, Ia = /^name$/i;
class Ja {
  static get detect() {
    return /^multipart\/form-data/i;
  }
  constructor(a, {limits:b = {}, defCharset:c = "utf8", preservePath:f, fileHwm:e, parsedConType:d = [], highWaterMark:g}) {
    function h() {
      0 === u && z && !a.a && (z = !1, process.nextTick(() => {
        a.a = !0;
        a.emit("finish");
      }));
    }
    let k, m;
    [, d] = d.find(n => Array.isArray(n) && Ea.test(n[0])) || [];
    if ("string" != typeof d) {
      throw Error("Multipart: Boundary not found");
    }
    const {M:l, L:y, K:A, w:L, v:M} = Ca(b);
    let p, q = 0, x = 0, u = 0, G, z = !1;
    this.c = this.f = !1;
    this.a = void 0;
    this.h = 0;
    this.g = a;
    this.b = new ua({boundary:d, maxHeaderPairs:b.headerPairs, highWaterMark:g, fileHwm:e});
    this.b.on("drain", () => {
      this.f = !1;
      if (this.a && !this.c) {
        const n = this.a;
        this.a = void 0;
        n();
      }
    }).on("error", n => {
      a.emit("error", n);
    }).on("finish", () => {
      z = !0;
      h();
    });
    const H = n => {
      if (++this.h > l) {
        return this.b.removeListener("part", H), this.b.on("part", N), a.j = !0, a.emit("partsLimit"), N(n);
      }
      if (G) {
        const r = G;
        r.emit("end");
        r.removeAllListeners("end");
      }
      n.on("header", r => {
        let C = "text/plain", B = c, V = "7bit", W;
        let P = 0;
        if (r["content-type"]) {
          var v = I(r["content-type"][0]);
          if (v[0]) {
            for (C = v[0].toLowerCase(), k = 0, m = v.length; k < m; ++k) {
              if (Ga.test(v[k][0])) {
                B = v[k][1].toLowerCase();
                break;
              }
            }
          }
        }
        if (r["content-disposition"]) {
          v = I(r["content-disposition"][0]);
          if (!Fa.test(v[0])) {
            return N(n);
          }
          k = 0;
          for (m = v.length; k < m; ++k) {
            if (Ia.test(v[k][0])) {
              W = K(v[k][1], "utf8");
            } else {
              if (Ha.test(v[k][0])) {
                var F = K(v[k][1], "utf8");
                f || (F = Ba(F));
              }
            }
          }
        } else {
          return N(n);
        }
        r["content-transfer-encoding"] && (V = r["content-transfer-encoding"][0].toLowerCase());
        if ("application/octet-stream" == C || void 0 !== F) {
          if (q === y) {
            return a.i || (a.i = !0, a.emit("filesLimit")), N(n);
          }
          ++q;
          if (!a._events.file) {
            this.b._ignore();
            return;
          }
          ++u;
          const t = new Ka({highWaterMark:e});
          p = t;
          t.on("end", () => {
            --u;
            this.c = !1;
            h();
            if (this.a && !this.f) {
              const D = this.a;
              this.a = void 0;
              D();
            }
          });
          t._read = () => {
            if (this.c && (this.c = !1, this.a && !this.f)) {
              const D = this.a;
              this.a = void 0;
              D();
            }
          };
          a.emit("file", W, t, F, V, C);
          r = D => {
            if ((P += D.length) > A) {
              var la = A - (P - D.length);
              0 < la && t.push(D.slice(0, la));
              t.emit("limit");
              t.truncated = !0;
              n.removeAllListeners("data");
            } else {
              t.push(D) || (this.c = !0);
            }
          };
          F = () => {
            p = void 0;
            t.push(null);
          };
        } else {
          if (x === L) {
            return a.f || (a.f = !0, a.emit("fieldsLimit")), N(n);
          }
          ++x;
          ++u;
          var J = "", ma = !1;
          G = n;
          r = t => {
            (P += t.length) > M ? (J += t.toString("binary", 0, M - (P - t.length)), ma = !0, n.removeAllListeners("data")) : J += t.toString("binary");
          };
          F = () => {
            G = void 0;
            J.length && (J = K(J, B));
            a.emit("field", W, J, !1, ma, V, C);
            --u;
            h();
          };
        }
        n._readableState.sync = !1;
        n.on("data", r);
        n.on("end", F);
      }).on("error", r => {
        p && p.emit("error", r);
      });
    };
    this.b.on("part", H);
  }
  end() {
    0 !== this.h || this.g.a ? this.b.writable && this.b.end() : process.nextTick(() => {
      this.g.a = !0;
      this.g.emit("finish");
    });
  }
  write(a, b) {
    (a = this.b.write(a)) && !this.c ? b() : (this.f = !a, this.a = b);
  }
}
function N(a) {
  a.resume();
}
class Ka extends aa {
  constructor(a) {
    super(a);
    this.truncated = !1;
  }
  _read() {
  }
}
;const La = /^charset$/i;
class Ma {
  static get detect() {
    return /^application\/x-www-form-urlencoded/i;
  }
  constructor(a, {limits:b = {}, parsedConType:c, defCharset:f = "utf8"}) {
    this.f = a;
    this.h = void 0;
    const {v:e, A:d, w:g} = Ca(b);
    this.v = e;
    this.A = d;
    this.w = g;
    a = f;
    for (let h = 0, k = c.length; h < k; ++h) {
      if (Array.isArray(c[h]) && La.test(c[h][0])) {
        a = c[h][1].toLowerCase();
        break;
      }
    }
    this.g = new Aa;
    this.j = a;
    this.m = 0;
    this.o = "key";
    this.b = !0;
    this.s = this.l = 0;
    this.c = this.a = "";
    this.u = this.i = !1;
  }
  write(a, b) {
    if (this.m === this.w) {
      return this.f.f || (this.f.f = !0, this.f.emit("fieldsLimit")), b();
    }
    for (var c, f, e, d = 0, g = a.length; d < g;) {
      if ("key" == this.o) {
        c = f = void 0;
        for (e = d; e < g; ++e) {
          this.b || ++d;
          if (61 === a[e]) {
            c = e;
            break;
          } else {
            if (38 === a[e]) {
              f = e;
              break;
            }
          }
          if (this.b && this.l === this.A) {
            this.h = !0;
            break;
          } else {
            this.b && ++this.l;
          }
        }
        if (void 0 !== c) {
          c > d && (this.a += this.g.write(a.toString("binary", d, c))), this.o = "val", this.h = !1, this.b = !0, this.c = "", this.s = 0, this.u = !1, this.g.buffer = void 0, d = c + 1;
        } else {
          if (void 0 !== f) {
            if (++this.m, c = this.i, d = f > d ? this.a += this.g.write(a.toString("binary", d, f)) : this.a, this.h = !1, this.b = !0, this.a = "", this.l = 0, this.i = !1, this.g.buffer = void 0, d.length && this.f.emit("field", K(d, this.j), "", c, !1), d = f + 1, this.m === this.w) {
              return b();
            }
          } else {
            this.h ? (e > d && (this.a += this.g.write(a.toString("binary", d, e))), d = e, (this.l = this.a.length) === this.A && (this.b = !1, this.i = !0)) : (d < g && (this.a += this.g.write(a.toString("binary", d))), d = g);
          }
        }
      } else {
        f = void 0;
        for (e = d; e < g; ++e) {
          this.b || ++d;
          if (38 === a[e]) {
            f = e;
            break;
          }
          if (this.b && this.s === this.v) {
            this.h = !0;
            break;
          } else {
            this.b && ++this.s;
          }
        }
        if (void 0 !== f) {
          if (++this.m, f > d && (this.c += this.g.write(a.toString("binary", d, f))), this.f.emit("field", K(this.a, this.j), K(this.c, this.j), this.i, this.u), this.o = "key", this.h = !1, this.b = !0, this.a = "", this.l = 0, this.i = !1, this.g.buffer = void 0, d = f + 1, this.m === this.w) {
            return b();
          }
        } else {
          if (this.h) {
            if (e > d && (this.c += this.g.write(a.toString("binary", d, e))), d = e, "" === this.c && 0 === this.v || (this.s = this.c.length) === this.v) {
              this.b = !1, this.u = !0;
            }
          } else {
            d < g && (this.c += this.g.write(a.toString("binary", d))), d = g;
          }
        }
      }
    }
    b();
  }
  end() {
    this.f.a || ("key" == this.o && 0 < this.a.length ? this.f.emit("field", K(this.a, this.j), "", this.i, !1) : "val" == this.o && this.f.emit("field", K(this.a, this.j), K(this.c, this.j), this.i, this.u), this.f.a = !0, this.f.emit("finish"));
  }
}
;class Na extends Da {
  constructor(a) {
    super(a);
  }
  get g() {
    return [Ja, Ma];
  }
}
;const Oa = /^[^[]*/, Pa = /^\[(\d+)\]/, Qa = /^\[([^\]]+)\]/;
function Ra(a) {
  function b() {
    return [{type:"object", key:a, B:!0}];
  }
  var c = Oa.exec(a)[0];
  if (!c) {
    return b();
  }
  const f = a.length;
  let e = c.length;
  c = {type:"object", key:c};
  const d = [c];
  for (; e < f;) {
    let g;
    if ("[" === a[e] && "]" === a[e + 1]) {
      if (e += 2, c.append = !0, e !== f) {
        return b();
      }
    } else {
      if (g = Pa.exec(a.substring(e)), null !== g) {
        e += g[0].length, c.C = "array", c = {type:"array", key:parseInt(g[1], 10)}, d.push(c);
      } else {
        if (g = Qa.exec(a.substring(e)), null !== g) {
          e += g[0].length, c.C = "object", c = {type:"object", key:g[1]}, d.push(c);
        } else {
          return b();
        }
      }
    }
  }
  c.B = !0;
  return d;
}
;function Sa(a) {
  return void 0 === a ? "undefined" : Array.isArray(a) ? "array" : "object" == typeof a ? "object" : "scalar";
}
function Ta(a, b, c, f) {
  switch(Sa(c)) {
    case "undefined":
      a[b.key] = b.append ? [f] : f;
      break;
    case "array":
      a[b.key].push(f);
      break;
    case "object":
      return Ta(c, {type:"object", key:"", B:!0}, c[""], f);
    case "scalar":
      a[b.key] = [a[b.key], f];
  }
  return a;
}
function Ua(a, b, c, f) {
  if (b.B) {
    return Ta(a, b, c, f);
  }
  let e;
  switch(Sa(c)) {
    case "undefined":
      return a[b.key] = "array" == b.C ? [] : {}, a[b.key];
    case "object":
      return a[b.key];
    case "array":
      if ("array" == b.C) {
        return c;
      }
      e = {};
      a[b.key] = e;
      c.forEach(function(d, g) {
        void 0 !== d && (e["" + g] = d);
      });
      return e;
    case "scalar":
      return e = {}, e[""] = c, a[b.key] = e;
  }
}
;function Va(a, b, c) {
  Ra(b).reduce(function(f, e) {
    return Ua(f, e, f[e.key], c);
  }, a);
}
;function Wa(a, {fieldname:b}) {
  const c = {fieldname:b};
  switch(a.a) {
    case "ARRAY":
      a.req.files.push(c);
      break;
    case "OBJECT":
      a.req.files[b] ? a.req.files[b].push(c) : a.req.files[b] = [c];
  }
  return c;
}
function O(a, b) {
  switch(a.a) {
    case "ARRAY":
      a = a.req.files;
      b = a.indexOf(b);
      ~b && a.splice(b, 1);
      break;
    case "OBJECT":
      1 == a.req.files[b.fieldname].length ? delete a.req.files[b.fieldname] : (a = a.req.files[b.fieldname], b = a.indexOf(b), ~b && a.splice(b, 1));
  }
}
function Xa(a, b, c) {
  "VALUE" == a.a ? a.req.file = c : (delete b.fieldname, Object.assign(b, c));
}
class Ya {
  constructor(a, b) {
    this.a = a;
    this.req = b;
    switch(a) {
      case "NONE":
        break;
      case "VALUE":
        break;
      case "ARRAY":
        b.files = [];
        break;
      case "OBJECT":
        b.files = {};
        break;
      default:
        throw Error("Unknown file strategy: " + a);
    }
  }
}
;const Za = {LIMIT_PART_COUNT:"Too many parts", LIMIT_FILE_SIZE:"File too large", LIMIT_FILE_COUNT:"Too many files", LIMIT_FIELD_KEY:"Field name too long", LIMIT_FIELD_VALUE:"Field value too long", LIMIT_FIELD_COUNT:"Too many fields", LIMIT_UNEXPECTED_FILE:"Unexpected field"};
function Q(a, b) {
  const c = new $a(Za[a]);
  c.code = a;
  b && (c.field = b);
  return c;
}
class $a extends Error {
  constructor(a) {
    super(a);
    this.field = this.code = null;
  }
}
;function ab(a) {
  0 === --a.value && a.emit("zero");
}
async function bb(a) {
  await new Promise((b, c) => {
    if (0 === a.value) {
      b();
    } else {
      a.once("zero", b);
    }
    a.once("error", c);
  });
}
class cb extends E {
  constructor() {
    super();
    this.value = 0;
  }
}
;const db = a => {
  ({"content-type":a} = a);
  return a ? a.toLowerCase().startsWith("multipart/form-data") : !1;
};
function R(a) {
  return async function(b, c) {
    const {req:f} = b;
    if (!db(f.headers)) {
      return c();
    }
    const {limits:e = {}, storage:d, fileFilter:g, D:h, preservePath:k} = a, m = {};
    f.body = m;
    const l = new Na({limits:e, preservePath:k, headers:f.headers}), y = new Ya(h, f), A = new cb, L = [];
    let M = !1;
    l.on("field", (p, q, x, u) => {
      if (u) {
        return l.emit("error", Q("LIMIT_FIELD_VALUE", p));
      }
      if (e.fieldNameSize && p.length > e.fieldNameSize) {
        return l.emit("error", Q("LIMIT_FIELD_KEY"));
      }
      Va(m, p, q);
    });
    l.on("file", async(p, q, x, u, G) => {
      if (!x) {
        return q.resume();
      }
      if (e.fieldNameSize && p.length > e.fieldNameSize) {
        return l.emit("error", Q("LIMIT_FIELD_KEY"));
      }
      x = {fieldname:p, originalname:x, encoding:u, mimetype:G, stream:q};
      const z = Wa(y, x);
      let H = !1;
      u = () => {
        if (H) {
          return O(y, z), H;
        }
      };
      q.on("error", B => {
        ab(A);
        l.emit("error", B);
      }).on("limit", () => {
        H = !0;
        l.emit("error", Q("LIMIT_FILE_SIZE", p));
      });
      let n;
      try {
        n = await g(f, x);
      } catch (B) {
        O(y, z);
        l.emit("error", B);
        return;
      }
      if (n) {
        A.value++;
        try {
          if (!u()) {
            var r = await d._handleFile(f, x), C = Object.assign({}, x, r);
            if (u()) {
              return L.push(C);
            }
            Xa(y, z, C);
            L.push(C);
          }
        } catch (B) {
          O(y, z), M ? A.emit("error", B) : l.emit("error", B);
        } finally {
          ab(A);
        }
      } else {
        O(y, z), q.resume();
      }
    });
    f.pipe(l);
    b = p => d._removeFile(f, p);
    try {
      await new Promise((p, q) => {
        l.on("error", q).on("partsLimit", () => {
          q(Q("LIMIT_PART_COUNT"));
        }).on("filesLimit", () => {
          q(Q("LIMIT_FILE_COUNT"));
        }).on("fieldsLimit", () => {
          q(Q("LIMIT_FIELD_COUNT"));
        }).on("finish", p);
      });
    } catch (p) {
      await bb(A);
      const q = await eb(L, b);
      p.storageErrors = q;
      throw p;
    } finally {
      M = !0, f.unpipe(l), l.removeAllListeners();
    }
    await bb(A);
    await c();
  };
}
async function eb(a, b) {
  return await a.reduce(async(c, f) => {
    c = await c;
    try {
      await b(f);
    } catch (e) {
      e.file = f, e.field = f.fieldname, c.push(e);
    }
    return c;
  }, []);
}
;const {pseudoRandomBytes:fb} = _crypto;
const {homedir:gb, tmpdir:hb} = os;
const {dirname:ib, join:S} = path;
const {createWriteStream:jb, lstat:T, mkdirSync:kb, readdir:lb, rmdir:mb, unlink:nb} = fs;
const ob = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, pb = (a, b = !1) => ob(a, 2 + (b ? 1 : 0)), qb = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const rb = /\s+at.*(?:\(|\s)(.*)\)?/, sb = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, tb = gb(), ub = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, f = c.join("|"), e = new RegExp(sb.source.replace("IGNORED_MODULES", f));
  return a.replace(/\\/g, "/").split("\n").filter(d => {
    d = d.match(rb);
    if (null === d || !d[1]) {
      return !0;
    }
    d = d[1];
    return d.includes(".app/Contents/Resources/electron.asar") || d.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(d);
  }).filter(d => d.trim()).map(d => b ? d.replace(rb, (g, h) => g.replace(h, h.replace(tb, "~"))) : d).join("\n");
};
function vb(a, b, c = !1) {
  return function(f) {
    var e = qb(arguments), {stack:d} = Error();
    const g = ob(d, 2, !0), h = (d = f instanceof Error) ? f.message : f;
    e = [`Error: ${h}`, ...null !== e && a === e || c ? [b] : [g, b]].join("\n");
    e = ub(e);
    return Object.assign(d ? f : Error(), {message:h, stack:e});
  };
}
;function U(a) {
  var {stack:b} = Error();
  const c = qb(arguments);
  b = pb(b, a);
  return vb(c, b, a);
}
;function wb(a, b) {
  if (b > a - 2) {
    throw Error("Function does not accept that many arguments.");
  }
}
async function X(a, b, c) {
  const f = U(!0);
  if ("function" !== typeof a) {
    throw Error("Function must be passed.");
  }
  const {length:e} = a;
  if (!e) {
    throw Error("Function does not accept any arguments.");
  }
  return await new Promise((d, g) => {
    const h = (m, l) => m ? (m = f(m), g(m)) : d(c || l);
    let k = [h];
    Array.isArray(b) ? (b.forEach((m, l) => {
      wb(e, l);
    }), k = [...b, h]) : 1 < Array.from(arguments).length && (wb(e, 0), k = [b, h]);
    a(...k);
  });
}
;async function xb(a, b) {
  b = b.map(async c => {
    const f = S(a, c);
    return {lstat:await X(T, f), path:f, relativePath:c};
  });
  return await Promise.all(b);
}
const yb = a => a.lstat.isDirectory(), zb = a => !a.lstat.isDirectory();
async function Ab(a) {
  if (!a) {
    throw Error("Please specify a path to the directory");
  }
  if (!(await X(T, a)).isDirectory()) {
    throw a = Error("Path is not a directory"), a.code = "ENOTDIR", a;
  }
  var b = await X(lb, a);
  b = await xb(a, b);
  a = b.filter(yb);
  b = b.filter(zb).reduce((c, f) => {
    var e = f.lstat.isDirectory() ? "Directory" : f.lstat.isFile() ? "File" : f.lstat.isSymbolicLink() ? "SymbolicLink" : void 0;
    return Object.assign({}, c, {[f.relativePath]:{type:e}});
  }, {});
  a = await a.reduce(async(c, f) => {
    var {path:e, relativePath:d} = f;
    c = await c;
    f = await Ab(e);
    return Object.assign({}, c, {[d]:f});
  }, {});
  return {content:Object.assign({}, b, a), type:"Directory"};
}
;const Bb = async a => {
  await X(nb, a);
}, Cb = async a => {
  const {content:b} = await Ab(a);
  var c = Object.keys(b).filter(e => {
    ({type:e} = b[e]);
    if ("File" == e || "SymbolicLink" == e) {
      return !0;
    }
  }), f = Object.keys(b).filter(e => {
    ({type:e} = b[e]);
    if ("Directory" == e) {
      return !0;
    }
  });
  c = c.map(e => S(a, e));
  await Promise.all(c.map(Bb));
  f = f.map(e => S(a, e));
  await Promise.all(f.map(Cb));
  await X(mb, a);
}, Db = async a => {
  (await X(T, a)).isDirectory() ? await Cb(a) : await Bb(a);
};
function Eb(a) {
  a = ib(a);
  try {
    Y(a);
  } catch (b) {
    if (!/EEXIST/.test(b.message) || -1 == b.message.indexOf(a)) {
      throw b;
    }
  }
}
function Y(a) {
  try {
    kb(a);
  } catch (b) {
    if ("ENOENT" == b.code) {
      const c = ib(a);
      Y(c);
      Y(a);
    } else {
      if ("EEXIST" != b.code) {
        throw b;
      }
    }
  }
}
;async function Fb() {
  return await new Promise((a, b) => {
    fb(16, (c, f) => {
      if (c) {
        return b(c);
      }
      a(f.toString("hex"));
    });
  });
}
class Gb {
  constructor(a = {}) {
    const {filename:b = Fb, destination:c = hb} = a;
    this.b = b;
    "string" == typeof c ? (Eb(c), this.a = () => c) : this.a = c;
  }
  async _handleFile(a, b) {
    const c = await this.a(a, b);
    a = await this.b(a, b);
    const f = S(c, a), e = jb(f);
    await new Promise((d, g) => {
      b.stream.pipe(e);
      b.stream.on("error", g);
      e.on("error", g);
      e.on("finish", d);
    });
    return {destination:c, filename:a, path:f, size:e.bytesWritten};
  }
  async _removeFile(a, b) {
    ({path:a} = b);
    delete b.destination;
    delete b.filename;
    delete b.path;
    await Db(a);
  }
}
;const Hb = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class Ib extends w {
  constructor(a) {
    var b = a || {}, c = Object.assign({}, b);
    const f = void 0 === b.binary ? !1 : b.binary, e = void 0 === b.rs ? null : b.rs;
    b = (delete c.binary, delete c.rs, c);
    const {J:d = U(!0), proxyError:g} = a || {}, h = (k, m) => d(m);
    super(b);
    this.a = [];
    this.I = new Promise((k, m) => {
      this.on("finish", () => {
        let l;
        f ? l = Buffer.concat(this.a) : l = this.a.join("");
        k(l);
        this.a = [];
      });
      this.once("error", l => {
        if (-1 == l.stack.indexOf("\n")) {
          h`${l}`;
        } else {
          const y = ub(l.stack);
          l.stack = y;
          g && h`${l}`;
        }
        m(l);
      });
      e && Hb(this, e).pipe(this);
    });
  }
  _write(a, b, c) {
    this.a.push(a);
    c();
  }
  get b() {
    return this.I;
  }
}
const Jb = async a => {
  var b = {binary:!0};
  b = void 0 === b ? {} : b;
  ({b:a} = new Ib(Object.assign({}, {rs:a}, b, {J:U(!0)})));
  return await a;
};
class Kb {
  async _handleFile(a, b) {
    a = await Jb(b.stream);
    return {buffer:a, size:a.length};
  }
  async _removeFile(a, b) {
    delete b.buffer;
    return null;
  }
}
;function Lb() {
  return !0;
}
function Z(a, b, c) {
  const f = a.fileFilter, e = {};
  b.forEach(({maxCount:d = Infinity, name:g}) => {
    e[g] = d;
  });
  return {limits:a.limits, preservePath:a.preservePath, storage:a.storage, fileFilter:function(d, g) {
    if (0 >= (e[g.fieldname] || 0)) {
      throw Q("LIMIT_UNEXPECTED_FILE", g.fieldname);
    }
    --e[g.fieldname];
    return f(d, g);
  }, D:c};
}
class Mb {
  constructor(a = {}) {
    const {storage:b, dest:c, limits:f = {}, preservePath:e = !1, fileFilter:d = Lb} = a;
    b ? this.storage = b : c ? this.storage = new Gb({destination:c}) : this.storage = new Kb;
    this.limits = f;
    this.preservePath = e;
    this.fileFilter = d;
  }
  single(a) {
    a = Z(this, [{name:a, maxCount:1}], "VALUE");
    return R(a);
  }
  array(a, b) {
    a = Z(this, [{name:a, maxCount:b}], "ARRAY");
    return R(a);
  }
  fields(a) {
    a = Z(this, a, "OBJECT");
    return R(a);
  }
  none() {
    const a = Z(this, [], "NONE");
    return R(a);
  }
  any() {
    return R({limits:this.limits, preservePath:this.preservePath, storage:this.storage, fileFilter:this.fileFilter, D:"ARRAY"});
  }
}
;DEPACK_EXPORT = {_MultipartFormData:Mb, _diskStorage:(a = {}) => new Gb(a), _memoryStorage:() => new Kb, _FormDataError:$a};


module.exports = DEPACK_EXPORT
//# sourceMappingURL=depack.js.map