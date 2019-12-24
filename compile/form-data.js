#!/usr/bin/env node
             
const stream = require('stream');
const events = require('events');
const _crypto = require('crypto');
const os = require('os');
const path = require('path');
const fs = require('fs');             
const y = stream.Readable, E = stream.Writable;
const I = events.EventEmitter;
/*
 MIT streamsearch by Brian White
 https://github.com/mscdex/streamsearch
*/
function aa(a, b, c, f, e) {
  for (var d = 0; d < e; ++d, ++b, ++f) {
    if (a[b] !== c[f]) {
      return !1;
    }
  }
  return !0;
}
function ba(a, b) {
  var c = b.length, f = a.h, e = f.length, d = -a.a, g = f[e - 1], h = a.g, k = a.f;
  if (0 > d) {
    for (; 0 > d && d <= c - e;) {
      var l = d + e - 1;
      l = 0 > l ? a.f[a.a + l] : b[l];
      if (l === g && ca(a, b, d, e - 1)) {
        return a.a = 0, ++a.c, d > -a.a ? a.emit("info", !0, k, 0, a.a + d) : a.emit("info", !0), a.b = d + e;
      }
      d += h[l];
    }
    if (0 > d) {
      for (; 0 > d && !ca(a, b, d, c - d);) {
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
    l = b[d + e - 1];
    if (l === g && b[d] === f[0] && aa(f, 0, b, d, e - 1)) {
      return ++a.c, 0 < d ? a.emit("info", !0, b, a.b, d) : a.emit("info", !0), a.b = d + e;
    }
    d += h[l];
  }
  if (d < c) {
    for (; d < c && (b[d] !== f[0] || !aa(b, d, f, 0, c - d));) {
      ++d;
    }
    d < c && (b.copy(k, 0, d, d + (c - d)), a.a = c - d);
  }
  0 < d && a.emit("info", !1, b, a.b, d < c ? d : c);
  return a.b = c;
}
function ca(a, b, c, f) {
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
class da extends I {
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
      var f = ba(this, a);
    }
    return f;
  }
}
;class ea extends y {
  constructor(a) {
    super(a);
  }
  _read() {
  }
}
;const fa = Buffer.from("\r\n\r\n"), ha = /\r\n/g, ia = /^([^:]+):[ \t]?([\x00-\xFF]+)?$/;
function ja(a) {
  a.f = !1;
  a.buffer = "";
  a.a = {};
  a = a.c;
  a.a = 0;
  a.c = 0;
  a.b = 0;
}
class ka extends I {
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
    this.c = new da(fa);
    this.c.on("info", (b, c, f, e) => {
      c && !this.g && (81920 < this.b + (e - f) ? (e = 81920 - this.b, this.b = 81920) : this.b += e - f, 81920 === this.b && (this.g = !0), this.buffer += c.toString("binary", f, e));
      if (b) {
        if (this.buffer && this.h !== this.maxHeaderPairs) {
          b = this.buffer.split(ha);
          c = b.length;
          e = !1;
          for (let g = 0; g < c; ++g) {
            if (0 !== b[g].length) {
              if ("\t" == b[g][0] || " " == b[g][0]) {
                this.a[d][this.a[d].length - 1] += b[g];
              } else {
                if (f = ia.exec(b[g])) {
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
const la = Buffer.from("-"), ma = Buffer.from("\r\n"), na = () => {
};
function oa(a) {
  a.a = void 0;
  a.h = void 0;
  a.g = void 0;
}
function pa(a, b, c, f, e) {
  var d, g = 0, h = !0;
  if (!a.a && a.o && c) {
    for (; 2 > a.f && f + g < e;) {
      if (45 === c[f + g]) {
        ++g, ++a.f;
      } else {
        a.f && (d = la);
        a.f = 0;
        break;
      }
    }
    2 === a.f && (f + g < e && a._events.trailer && a.emit("trailer", c.slice(f + g, e)), oa(a), a.s = !0, 0 === a.u && (a.b = !0, a.emit("finish"), a.b = !1));
    if (a.f) {
      return;
    }
  }
  a.o && (a.o = !1);
  a.a || (a.a = new ea(a.G), a.a._read = () => {
    qa(a);
  }, g = a.c ? "preamble" : "part", a._events[g] ? a.emit(g, a.a) : a._ignore(), a.c || (a.i = !0));
  c && f < e && !a.j && (a.c || !a.i ? (d && (h = a.a.push(d)), h = a.a.push(c.slice(f, e)), h || (a.m = !0)) : !a.c && a.i && (d && a.g.push(d), d = a.g.push(c.slice(f, e)), !a.i && void 0 !== d && d < e && pa(a, !1, c, f + d, e)));
  b && (ja(a.g), a.c ? a.c = !1 : (++a.u, a.a.on("end", () => {
    0 === --a.u && (a.s ? (a.b = !0, a.emit("finish"), a.b = !1) : qa(a));
  })), a.a.push(null), a.a = void 0, a.j = !1, a.o = !0, a.f = 0);
}
function qa(a) {
  if (a.m && (a.m = !1, a.l)) {
    const b = a.l;
    a.l = void 0;
    b();
  }
}
class ra extends E {
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
    this.g = new ka(a);
    this.g.on("header", b => {
      this.i = !1;
      this.a.emit("header", b);
    });
  }
  emit(a) {
    "finish" != a || this.b ? E.prototype.emit.apply(this, arguments) : this.s || process.nextTick(() => {
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
      if (this.a || (this.a = new ea(this.G), this._events.preamble ? this.emit("preamble", this.a) : this._ignore()), b = this.g.push(a), !this.i && void 0 !== b && b < a.length) {
        a = a.slice(b);
      } else {
        return c();
      }
    }
    this.F && (this.h.push(ma), this.F = !1);
    this.h.push(a);
    this.m ? this.l = c : c();
  }
  setBoundary(a) {
    this.h = new da("\r\n--" + a);
    this.h.on("info", (b, c, f, e) => {
      pa(this, b, c, f, e);
    });
  }
  _ignore() {
    this.a && !this.j && (this.j = !0, this.a.on("error", na), this.a.resume());
  }
}
;const {TextDecoder:sa} = require("text-decoding"), ta = /%([a-fA-F0-9]{2})/g;
function ua(a, b) {
  return String.fromCharCode(parseInt(b, 16));
}
function K(a) {
  let b = [], c = "key", f = "", e = !1, d = !1, g = 0, h = "";
  for (var k = 0, l = a.length; k < l; ++k) {
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
              f ? (h.length && (h = M(h.replace(ta, ua), f)), f = "") : h.length && (h = M(h, "utf8"));
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
  f && h.length ? h = M(h.replace(ta, ua), f) : h && (h = M(h, "utf8"));
  void 0 === b[g] ? h && (b[g] = h) : b[g][1] = h;
  return b;
}
function M(a, b) {
  let c;
  if (a) {
    try {
      c = (new sa(b)).decode(Buffer.from(a, "binary"));
    } catch (f) {
    }
  }
  return "string" == typeof c ? c : a;
}
const va = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], wa = /\+/g;
class xa {
  constructor() {
    this.buffer = void 0;
  }
  write(a) {
    a = a.replace(wa, " ");
    for (var b = "", c = 0, f = 0, e = a.length; c < e; ++c) {
      void 0 !== this.buffer ? va[a.charCodeAt(c)] ? (this.buffer += a[c], ++f, 2 === this.buffer.length && (b += String.fromCharCode(parseInt(this.buffer, 16)), this.buffer = void 0)) : (b += "%" + this.buffer, this.buffer = void 0, --c) : "%" == a[c] && (c > f && (b += a.substring(f, c), f = c), this.buffer = "", ++f);
    }
    f < e && void 0 === this.buffer && (b += a.substring(f));
    return b;
  }
}
function ya(a) {
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
const za = a => {
  const {fieldSize:b = 1048576, fieldNameSize:c = 100, fileSize:f = Infinity, files:e = Infinity, fields:d = Infinity, parts:g = Infinity} = a;
  return {v:b, K:f, L:e, w:d, M:g, A:c};
};
class Aa extends E {
  constructor(a = {}) {
    super({...a.highWaterMark ? {highWaterMark:a.highWaterMark} : {}});
    this.a = !1;
    this.b = void 0;
    this.j = this.i = this.f = this.h = !1;
    this.c = a;
    if (a.headers && "string" == typeof a.headers["content-type"]) {
      a: {
        a = a.headers;
        this.b = void 0;
        if (a["content-type"]) {
          const b = K(a["content-type"]);
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
;const Ba = /^boundary$/i, Ca = /^form-data$/i, Da = /^charset$/i, Ea = /^filename$/i, Fa = /^name$/i;
class Ga {
  static get detect() {
    return /^multipart\/form-data/i;
  }
  constructor(a, {limits:b = {}, preservePath:c, fileHwm:f, parsedConType:e = [], highWaterMark:d}) {
    function g() {
      0 === u && L && !a.a && (L = !1, process.nextTick(() => {
        a.a = !0;
        a.emit("finish");
      }));
    }
    let h, k;
    [, e] = e.find(m => Array.isArray(m) && Ba.test(m[0])) || [];
    if ("string" != typeof e) {
      throw Error("Multipart: Boundary not found");
    }
    const {M:l, L:n, K:B, w:C, v:F} = za(b);
    let G, q = 0, p = 0, u = 0, t, L = !1;
    this.c = this.f = !1;
    this.a = void 0;
    this.h = 0;
    this.g = a;
    this.b = new ra({boundary:e, maxHeaderPairs:b.headerPairs, highWaterMark:d, fileHwm:f});
    this.b.on("drain", () => {
      this.f = !1;
      if (this.a && !this.c) {
        const m = this.a;
        this.a = void 0;
        m();
      }
    }).on("error", m => {
      a.emit("error", m);
    }).on("finish", () => {
      L = !0;
      g();
    });
    const D = m => {
      if (++this.h > l) {
        return this.b.removeListener("part", D), this.b.on("part", N), a.j = !0, a.emit("partsLimit"), N(m);
      }
      if (t) {
        const r = t;
        r.emit("end");
        r.removeAllListeners("end");
      }
      m.on("header", r => {
        let J = "text/plain", z = "7bit", U;
        let P = 0;
        if (r["content-type"]) {
          var w = K(r["content-type"][0]);
          if (w[0]) {
            for (J = w[0].toLowerCase(), h = 0, k = w.length; h < k && !Da.test(w[h][0]); ++h) {
            }
          }
        }
        if (r["content-disposition"]) {
          w = K(r["content-disposition"][0]);
          if (!Ca.test(w[0])) {
            return N(m);
          }
          h = 0;
          for (k = w.length; h < k; ++h) {
            if (Fa.test(w[h][0])) {
              U = w[h][1];
            } else {
              if (Ea.test(w[h][0])) {
                var H = w[h][1];
                c || (H = ya(H));
              }
            }
          }
        } else {
          return N(m);
        }
        r["content-transfer-encoding"] && (z = r["content-transfer-encoding"][0].toLowerCase());
        if ("application/octet-stream" == J || void 0 !== H) {
          if (q == n) {
            return a.i || (a.i = !0, a.emit("filesLimit")), N(m);
          }
          ++q;
          if (!a._events.file) {
            this.b._ignore();
            return;
          }
          ++u;
          const v = new Ha({highWaterMark:f});
          G = v;
          v.on("end", () => {
            --u;
            this.c = !1;
            g();
            if (this.a && !this.f) {
              const x = this.a;
              this.a = void 0;
              x();
            }
          });
          v._read = () => {
            if (this.c && (this.c = !1, this.a && !this.f)) {
              const x = this.a;
              this.a = void 0;
              x();
            }
          };
          a.emit("file", U, v, H, z, J, m);
          r = x => {
            if ((P += x.length) > B) {
              const A = B - (P - x.length);
              0 < A && v.push(x.slice(0, A));
              v.emit("limit");
              v.truncated = !0;
              m.removeAllListeners("data");
            } else {
              v.push(x) || (this.c = !0);
            }
          };
          H = () => {
            G = void 0;
            v.push(null);
          };
        } else {
          if (p == C) {
            return a.f || (a.f = !0, a.emit("fieldsLimit")), N(m);
          }
          ++p;
          ++u;
          const v = [];
          let x = !1;
          t = m;
          r = A => {
            let V = A;
            P += A.length;
            P > F && (V = Buffer.from(A, 0, F).slice(0, F), x = !0, m.removeAllListeners("data"));
            v.push(V);
          };
          H = () => {
            t = void 0;
            var A = Buffer.concat(v);
            try {
              A = (new sa(void 0)).decode(A);
            } catch (V) {
            }
            a.emit("field", U, A, !1, x, z, J);
            --u;
            g();
          };
        }
        m._readableState.sync = !1;
        m.on("data", r);
        m.on("end", H);
      }).on("error", r => {
        G && G.emit("error", r);
      });
    };
    this.b.on("part", D);
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
class Ha extends y {
  constructor(a) {
    super(a);
    this.truncated = !1;
  }
  _read() {
  }
}
;const Ia = /^charset$/i;
class Ja {
  static get detect() {
    return /^application\/x-www-form-urlencoded/i;
  }
  constructor(a, {limits:b = {}, parsedConType:c, defCharset:f = "utf8"}) {
    this.f = a;
    this.h = void 0;
    const {v:e, A:d, w:g} = za(b);
    this.v = e;
    this.A = d;
    this.w = g;
    a = f;
    for (let h = 0, k = c.length; h < k; ++h) {
      if (Array.isArray(c[h]) && Ia.test(c[h][0])) {
        a = c[h][1].toLowerCase();
        break;
      }
    }
    this.g = new xa;
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
            if (++this.m, c = this.i, d = f > d ? this.a += this.g.write(a.toString("binary", d, f)) : this.a, this.h = !1, this.b = !0, this.a = "", this.l = 0, this.i = !1, this.g.buffer = void 0, d.length && this.f.emit("field", M(d, this.j), "", c, !1), d = f + 1, this.m === this.w) {
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
          if (++this.m, f > d && (this.c += this.g.write(a.toString("binary", d, f))), this.f.emit("field", M(this.a, this.j), M(this.c, this.j), this.i, this.u), this.o = "key", this.h = !1, this.b = !0, this.a = "", this.l = 0, this.i = !1, this.g.buffer = void 0, d = f + 1, this.m === this.w) {
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
    this.f.a || ("key" == this.o && 0 < this.a.length ? this.f.emit("field", M(this.a, this.j), "", this.i, !1) : "val" == this.o && this.f.emit("field", M(this.a, this.j), M(this.c, this.j), this.i, this.u), this.f.a = !0, this.f.emit("finish"));
  }
}
;class Ka extends Aa {
  constructor(a) {
    super(a);
  }
  get g() {
    return [Ga, Ja];
  }
}
;const La = /^[^[]*/, Ma = /^\[(\d+)\]/, Na = /^\[([^\]]+)\]/;
function Oa(a) {
  function b() {
    return [{type:"object", key:a, B:!0}];
  }
  var c = La.exec(a)[0];
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
      if (g = Ma.exec(a.substring(e)), null !== g) {
        e += g[0].length, c.C = "array", c = {type:"array", key:parseInt(g[1], 10)}, d.push(c);
      } else {
        if (g = Na.exec(a.substring(e)), null !== g) {
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
;function Pa(a) {
  return void 0 === a ? "undefined" : Array.isArray(a) ? "array" : "object" == typeof a ? "object" : "scalar";
}
function Qa(a, b, c, f) {
  switch(Pa(c)) {
    case "undefined":
      a[b.key] = b.append ? [f] : f;
      break;
    case "array":
      a[b.key].push(f);
      break;
    case "object":
      return Qa(c, {type:"object", key:"", B:!0}, c[""], f);
    case "scalar":
      a[b.key] = [a[b.key], f];
  }
  return a;
}
function Ra(a, b, c, f) {
  if (b.B) {
    return Qa(a, b, c, f);
  }
  let e;
  switch(Pa(c)) {
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
;function Sa(a, b, c) {
  Oa(b).reduce(function(f, e) {
    return Ra(f, e, f[e.key], c);
  }, a);
}
;function Ta(a, {fieldname:b}) {
  const c = {fieldname:b};
  switch(a.b) {
    case "ARRAY":
      a.a.files.push(c);
      break;
    case "OBJECT":
      a.a.files[b] ? a.a.files[b].push(c) : a.a.files[b] = [c];
  }
  return c;
}
function O(a, b) {
  switch(a.b) {
    case "ARRAY":
      a = a.a.files;
      b = a.indexOf(b);
      ~b && a.splice(b, 1);
      break;
    case "OBJECT":
      1 == a.a.files[b.fieldname].length ? delete a.a.files[b.fieldname] : (a = a.a.files[b.fieldname], b = a.indexOf(b), ~b && a.splice(b, 1));
  }
}
function Ua(a, b, c) {
  "VALUE" == a.b ? a.a.file = c : (delete b.fieldname, Object.assign(b, c));
}
class Va {
  constructor(a, b) {
    this.b = a;
    this.a = b;
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
;const Wa = {LIMIT_PART_COUNT:"Too many parts", LIMIT_FILE_SIZE:"File too large", LIMIT_FILE_COUNT:"Too many files", LIMIT_FIELD_KEY:"Field name too long", LIMIT_FIELD_VALUE:"Field value too long", LIMIT_FIELD_COUNT:"Too many fields", LIMIT_UNEXPECTED_FILE:"Unexpected field"};
function Q(a, b) {
  const c = new Xa(Wa[a]);
  c.code = a;
  b && (c.field = b);
  return c;
}
class Xa extends Error {
  constructor(a) {
    super(a);
    this.code = "";
    this.field = void 0;
  }
}
;function Ya(a) {
  0 === --a.value && a.emit("zero");
}
async function Za(a) {
  await new Promise((b, c) => {
    if (0 === a.value) {
      b();
    } else {
      a.once("zero", b);
    }
    a.once("error", c);
  });
}
class $a extends I {
  constructor() {
    super();
    this.value = 0;
  }
}
;const ab = a => (a = a["content-type"]) ? a.toLowerCase().startsWith("multipart/form-data") : !1;
function R(a) {
  return async function(b, c) {
    const f = b.req;
    if (!ab(f.headers)) {
      return c();
    }
    const {limits:e = {}, storage:d, fileFilter:g, D:h, preservePath:k} = a, l = {};
    f.body = l;
    const n = new Ka({limits:e, preservePath:k, headers:f.headers}), B = new Va(h, f), C = new $a, F = [];
    let G = !1;
    n.on("field", (q, p, u, t) => {
      if (t) {
        return n.emit("error", Q("LIMIT_FIELD_VALUE", q));
      }
      if (e.fieldNameSize && q.length > e.fieldNameSize) {
        return n.emit("error", Q("LIMIT_FIELD_KEY"));
      }
      Sa(l, q, p);
    });
    n.on("file", async(q, p, u, t, L) => {
      if (!u) {
        return p.resume();
      }
      if (e.fieldNameSize && q.length > e.fieldNameSize) {
        return n.emit("error", Q("LIMIT_FIELD_KEY"));
      }
      t = {fieldname:q, originalname:u, encoding:t, mimetype:L, stream:p};
      const D = Ta(B, t);
      let m = !1;
      u = () => {
        if (m) {
          return O(B, D), m;
        }
      };
      p.on("error", z => {
        Ya(C);
        n.emit("error", z);
      }).on("limit", () => {
        m = !0;
        n.emit("error", Q("LIMIT_FILE_SIZE", q));
      });
      let r;
      try {
        r = await g(f, t);
      } catch (z) {
        O(B, D);
        n.emit("error", z);
        return;
      }
      if (r) {
        C.value++;
        try {
          if (!u()) {
            var J = await d._handleFile(f, t);
            p = {...t, ...J};
            if (u()) {
              return F.push(p);
            }
            Ua(B, D, p);
            F.push(p);
          }
        } catch (z) {
          O(B, D), G ? C.emit("error", z) : n.emit("error", z);
        } finally {
          Ya(C);
        }
      } else {
        O(B, D), p.resume();
      }
    });
    f.pipe(n);
    b = q => d._removeFile(f, q);
    try {
      await new Promise((q, p) => {
        n.on("error", p).on("partsLimit", () => {
          p(Q("LIMIT_PART_COUNT"));
        }).on("filesLimit", () => {
          p(Q("LIMIT_FILE_COUNT"));
        }).on("fieldsLimit", () => {
          p(Q("LIMIT_FIELD_COUNT"));
        }).on("finish", q);
      });
    } catch (q) {
      await Za(C);
      const p = await bb(F, b);
      q.storageErrors = p;
      throw q;
    } finally {
      G = !0, f.unpipe(n), n.removeAllListeners();
    }
    await Za(C);
    await c();
  };
}
async function bb(a, b) {
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
;const cb = _crypto.pseudoRandomBytes;
const db = os.homedir, eb = os.tmpdir;
const fb = path.dirname, S = path.join, gb = path.relative;
const hb = fs.createWriteStream, T = fs.lstat, ib = fs.mkdirSync, jb = fs.readdir, kb = fs.rmdir, lb = fs.unlink;
const mb = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, nb = (a, b = !1) => mb(a, 2 + (b ? 1 : 0)), ob = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const pb = /\s+at.*(?:\(|\s)(.*)\)?/, qb = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, rb = db(), sb = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, f = c.join("|"), e = new RegExp(qb.source.replace("IGNORED_MODULES", f));
  return a.replace(/\\/g, "/").split("\n").filter(d => {
    d = d.match(pb);
    if (null === d || !d[1]) {
      return !0;
    }
    d = d[1];
    return d.includes(".app/Contents/Resources/electron.asar") || d.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(d);
  }).filter(d => d.trim()).map(d => b ? d.replace(pb, (g, h) => g.replace(h, h.replace(rb, "~"))) : d).join("\n");
};
function tb(a, b, c = !1) {
  return function(f) {
    var e = ob(arguments), {stack:d} = Error();
    const g = mb(d, 2, !0), h = (d = f instanceof Error) ? f.message : f;
    e = [`Error: ${h}`, ...null !== e && a === e || c ? [b] : [g, b]].join("\n");
    e = sb(e);
    return Object.assign(d ? f : Error(), {message:h, stack:e});
  };
}
;function W(a) {
  var {stack:b} = Error();
  const c = ob(arguments);
  b = nb(b, a);
  return tb(c, b, a);
}
;function ub(a, b) {
  if (b > a - 2) {
    throw Error("Function does not accept that many arguments.");
  }
}
async function X(a, b, c) {
  const f = W(!0);
  if ("function" !== typeof a) {
    throw Error("Function must be passed.");
  }
  const e = a.length;
  if (!e) {
    throw Error("Function does not accept any arguments.");
  }
  return await new Promise((d, g) => {
    const h = (l, n) => l ? (l = f(l), g(l)) : d(c || n);
    let k = [h];
    Array.isArray(b) ? (b.forEach((l, n) => {
      ub(e, n);
    }), k = [...b, h]) : 1 < Array.from(arguments).length && (ub(e, 0), k = [b, h]);
    a(...k);
  });
}
;async function vb(a, b) {
  b = b.map(async c => {
    const f = S(a, c);
    return {lstat:await X(T, f), path:f, relativePath:c};
  });
  return await Promise.all(b);
}
const wb = a => a.lstat.isDirectory(), xb = a => !a.lstat.isDirectory();
async function yb(a) {
  if (!a) {
    throw Error("Please specify a path to the directory");
  }
  const {ignore:b = []} = {};
  if (!(await X(T, a)).isDirectory()) {
    var c = Error("Path is not a directory");
    c.code = "ENOTDIR";
    throw c;
  }
  c = await X(jb, a);
  var f = await vb(a, c);
  c = f.filter(wb);
  f = f.filter(xb).reduce((e, d) => {
    var g = d.lstat.isDirectory() ? "Directory" : d.lstat.isFile() ? "File" : d.lstat.isSymbolicLink() ? "SymbolicLink" : void 0;
    return {...e, [d.relativePath]:{type:g}};
  }, {});
  c = await c.reduce(async(e, {path:d, relativePath:g}) => {
    const h = gb(a, d);
    if (b.includes(h)) {
      return e;
    }
    e = await e;
    d = await yb(d);
    return {...e, [g]:d};
  }, {});
  return {content:{...f, ...c}, type:"Directory"};
}
;const zb = async a => {
  await X(lb, a);
}, Ab = async a => {
  const {content:b} = await yb(a);
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
  await Promise.all(c.map(zb));
  f = f.map(e => S(a, e));
  await Promise.all(f.map(Ab));
  await X(kb, a);
}, Bb = async a => {
  (await X(T, a)).isDirectory() ? await Ab(a) : await zb(a);
};
function Cb(a) {
  a = fb(a);
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
    ib(a);
  } catch (b) {
    if ("ENOENT" == b.code) {
      const c = fb(a);
      Y(c);
      Y(a);
    } else {
      if ("EEXIST" != b.code) {
        throw b;
      }
    }
  }
}
;async function Db() {
  return await new Promise((a, b) => {
    cb(16, (c, f) => {
      if (c) {
        return b(c);
      }
      a(f.toString("hex"));
    });
  });
}
class Eb {
  constructor(a = {}) {
    const {filename:b = Db, destination:c = eb} = a;
    this.b = b;
    "string" == typeof c ? (Cb(S(c, "file.dat")), this.a = () => c) : this.a = c;
  }
  async _handleFile(a, b) {
    const c = await this.a(a, b);
    a = await this.b(a, b);
    const f = S(c, a), e = hb(f);
    await new Promise((d, g) => {
      b.stream.pipe(e);
      b.stream.on("error", g);
      e.on("error", g);
      e.on("finish", d);
    });
    return {destination:c, filename:a, path:f, size:e.bytesWritten};
  }
  async _removeFile(a, b) {
    a = b.path;
    delete b.destination;
    delete b.filename;
    delete b.path;
    await Bb(a);
  }
}
;const Fb = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class Gb extends E {
  constructor(a) {
    const {binary:b = !1, rs:c = null, ...f} = a || {}, {J:e = W(!0), proxyError:d} = a || {}, g = (h, k) => e(k);
    super(f);
    this.a = [];
    this.I = new Promise((h, k) => {
      this.on("finish", () => {
        let l;
        b ? l = Buffer.concat(this.a) : l = this.a.join("");
        h(l);
        this.a = [];
      });
      this.once("error", l => {
        if (-1 == l.stack.indexOf("\n")) {
          g`${l}`;
        } else {
          const n = sb(l.stack);
          l.stack = n;
          d && g`${l}`;
        }
        k(l);
      });
      c && Fb(this, c).pipe(this);
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
const Hb = async a => {
  ({b:a} = new Gb({rs:a, binary:!0, J:W(!0)}));
  return await a;
};
class Ib {
  async _handleFile(a, b) {
    a = await Hb(b.stream);
    return {buffer:a, size:a.length};
  }
  async _removeFile(a, b) {
    delete b.buffer;
    return null;
  }
}
;function Jb() {
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
class Kb {
  constructor(a = {}) {
    const {storage:b, dest:c, limits:f = {}, preservePath:e = !1, fileFilter:d = Jb} = a;
    b ? this.storage = b : c ? this.storage = new Eb({destination:c}) : this.storage = new Ib;
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
;module.exports = {_FormData:Kb, _diskStorage:(a = {}) => new Eb(a), _memoryStorage:() => new Ib, _FormDataError:Xa};


//# sourceMappingURL=form-data.js.map