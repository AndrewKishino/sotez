const library = require('./library.tez');
const prefix = require('./prefix.tez');

const utility = {
  mintotz(m) {
    return parseInt(m, 10) / 1000000;
  },
  tztomin(tz) {
    let r = tz.toFixed(6) * 1000000;
    if (r > 4294967296) r = r.toString();
    return r;
  },
  b58cencode(payload, prefix) {
    const n = new Uint8Array(prefix.length + payload.length);
    n.set(prefix);
    n.set(payload, prefix.length);
    return library.bs58check.encode(new Buffer(n, 'hex'));
  },
  b58cdecode(enc, prefix) {
    let n = library.bs58check.decode(enc);
    n = n.slice(prefix.length);
    return n;
  },
  buf2hex(buffer) {
    const byteArray = new Uint8Array(buffer);
    const hexParts = [];
    for (let i = 0; i < byteArray.length; i++) {
      const hex = byteArray[i].toString(16);
      const paddedHex = (`00${hex}`).slice(-2);
      hexParts.push(paddedHex);
    }
    return hexParts.join('');
  },
  hex2buf(hex) {
    return new Uint8Array(hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));
  },
  hexNonce(length) {
    const chars = '0123456789abcedf';
    let hex = '';
    while (length--) hex += chars[(Math.random() * 16) | 0];
    return hex;
  },
  sexp2mic: function me(mi) {
    mi = mi.replace(/(?:@[a-z_]+)|(?:#.*$)/mg, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (mi.charAt(0) === '(') mi = mi.slice(1, -1);
    let pl = 0;
    let sopen = false;
    let escaped = false;
    const ret = {
      prim: '',
      args: []
    };
    let val = '';
    for (let i = 0; i < mi.length; i++) {
      if (escaped) {
        val += mi[i];
        escaped = false;
        continue;
      } else if ((i === (mi.length - 1) && sopen === false) || (mi[i] === ' ' && pl === 0 && sopen === false)) {
        if (i === (mi.length - 1)) val += mi[i];
        if (val) {
          if (val === parseInt(val, 10).toString()) {
            if (!ret.prim) return { int: val };
            ret.args.push({ int: val });
          } else if (ret.prim) {
            ret.args.push(me(val));
          } else {
            ret.prim = val;
          }
          val = '';
        }
        continue;
      } else if (mi[i] === '"' && sopen) {
        sopen = false;
        if (!ret.prim) return { string: val };
        ret.args.push({ string: val });
        val = '';
        continue;
      } else if (mi[i] === '"' && !sopen && pl === 0) {
        sopen = true;
        continue;
      } else if (mi[i] === '\\') escaped = true;
      else if (mi[i] === '(') pl++;
      else if (mi[i] === ')') pl--;
      val += mi[i];
    }
    return ret;
  },
  mic2arr: function me2(s) {
    let ret = [];
    if (s.hasOwnProperty('prim')) {
      if (s.prim == 'Pair') {
        ret.push(me2(s.args[0]));
        ret = ret.concat(me2(s.args[1]));
      } else if (s.prim === 'Elt') {
        ret = {
          key: me2(s.args[0]),
          val: me2(s.args[1])
        };
      } else if (s.prim === 'True') {
        ret = true;
      } else if (s.prim === 'False') {
        ret = false;
      }
    } else if (Array.isArray(s)) {
      const sc = s.length;
      for (let i = 0; i < sc; i++) {
        const n = me2(s[i]);
        if (typeof n.key !== 'undefined') {
          if (Array.isArray(ret)) {
            ret = {
              keys: [],
              vals: [],
            };
          }
          ret.keys.push(n.key);
          ret.vals.push(n.val);
        } else {
          ret.push(n);
        }
      }
    } else if (s.hasOwnProperty('string')) {
      ret = s.string;
    } else if (s.hasOwnProperty('int')) {
      ret = parseInt(s.int, 10);
    } else {
      ret = s;
    }
    return ret;
  },
  ml2mic: function me(mi) {
    const ret = [];
    let inseq = false;
    let seq = '';
    let val = '';
    let pl = 0;
    let bl = 0;
    let sopen = false;
    let escaped = false;
    for (let i = 0; i < mi.length; i++) {
      if (val === '}' || val === ';') {
        val = '';
      }
      if (inseq) {
        if (mi[i] === '}') {
          bl--;
        } else if (mi[i] === '{') {
          bl++;
        }
        if (bl === 0) {
          const st = me(val);
          ret.push({
            prim: seq.trim(),
            args: [st]
          });
          val = '';
          bl = 0;
          inseq = false;
        }
      } else if (mi[i] === '{') {
        bl++;
        seq = val;
        val = '';
        inseq = true;
        continue;
      } else if (escaped) {
        val += mi[i];
        escaped = false;
        continue;
      } else if ((i === (mi.length - 1) && sopen === false) || (mi[i] === ';' && pl === 0 && sopen === false)) {
        if (i === (mi.length - 1)) val += mi[i];
        if (val.trim() === '' || val.trim() === '}' || val.trim() === ';') {
          val = '';
          continue;
        }
        ret.push(utility.ml2tzjson(val));
        val = '';
        continue;
      } else if (mi[i] === '"' && sopen) sopen = false;
      else if (mi[i] === '"' && !sopen) sopen = true;
      else if (mi[i] === '\\') escaped = true;
      else if (mi[i] === '(') pl++;
      else if (mi[i] === ')') pl--;
      val += mi[i];
    }
    return ret;
  },
  formatMoney(n, c, d, t) {
    const c = isNaN(c = Math.abs(c)) ? 2 : c;
    const d = d == undefined ? '.' : d;
    const t = t == undefined ? ',' : t;
    const s = n < 0 ? '-' : '';
    const i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c)));
    const j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${t}`) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
  }
};

utility.ml2tzjson = utility.sexp2mic;
utility.tzjson2arr = utility.mic2arr;
utility.mlraw2json = utility.ml2mic;

module.exports = utility;
