"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tztomin = exports.mintotz = exports.mlraw2json = exports.tzjson2arr = exports.ml2tzjson = exports.ml2mic = exports.mic2arr = exports.sexp2mic = exports.encodeExpr = exports.mergebuf = exports.hexNonce = exports.hex2buf = exports.buf2hex = exports.b58cdecode = exports.b58cencode = exports.mutez = exports.totez = exports.b582int = exports.textDecode = exports.textEncode = void 0;
var bs58check_1 = __importDefault(require("bs58check"));
var bignumber_js_1 = require("bignumber.js");
var buffer_1 = require("buffer/");
var blake2b_1 = __importDefault(require("blake2b"));
var constants_1 = require("./constants");
exports.textEncode = function (value) {
    return new Uint8Array(buffer_1.Buffer.from(value, 'utf8'));
};
exports.textDecode = function (buffer) {
    return buffer_1.Buffer.from(buffer).toString('utf8');
};
/**
 * @description Convert from base58 to integer
 * @param {string} v The b58 value
 * @returns {string} The converted b58 value
 */
exports.b582int = function (v) {
    var rv = new bignumber_js_1.BigNumber(0);
    var alpha = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    for (var i = 0; i < v.length; i++) {
        rv = rv.plus(new bignumber_js_1.BigNumber(alpha.indexOf(v[v.length - 1 - i])).multipliedBy(new bignumber_js_1.BigNumber(alpha.length).exponentiatedBy(i)));
    }
    return rv.toString(16);
};
/**
 * @description Convert from mutez to tez
 * @param {number} mutez The amount in mutez to convert to tez
 * @returns {number} The mutez amount converted to tez
 */
exports.totez = function (mutez) {
    if (typeof mutez === 'number') {
        return mutez / 1000000;
    }
    if (typeof mutez === 'string') {
        return parseInt(mutez, 10) / 1000000;
    }
    throw new TypeError('Invalid parameter for "mutez" provided.');
};
/**
 * @description Convert from tez to mutez
 * @param {number} tez The amount in tez to convert to mutez
 * @returns {string} The tez amount converted to mutez
 */
exports.mutez = function (tez) {
    return new bignumber_js_1.BigNumber(new bignumber_js_1.BigNumber(tez).toFixed(6)).multipliedBy(1000000).toString();
};
/**
 * @description Base58 encode
 * @param {string | Uint8Array} payload The value to encode
 * @param {Object} prefixArg The Uint8Array prefix values
 * @returns {string} The base58 encoded value
 */
exports.b58cencode = function (payload, prefixArg) {
    var n = new Uint8Array(prefixArg.length + payload.length);
    n.set(prefixArg);
    n.set(payload, prefixArg.length);
    // @ts-ignore
    return bs58check_1.default.encode(buffer_1.Buffer.from(n, 'hex'));
};
/**
 * @description Base58 decode
 * @param {string} enc The value to decode
 * @param {Object} prefixArg The Uint8Array prefix values
 * @returns {Object} The decoded base58 value
 */
exports.b58cdecode = function (enc, prefixArg) {
    return bs58check_1.default.decode(enc).slice(prefixArg.length);
};
/**
 * @description Buffer to hex
 * @param {Object} buffer The buffer to convert to hex
 * @returns {string} Converted hex value
 */
exports.buf2hex = function (buffer) {
    var byteArray = new Uint8Array(buffer);
    var hexParts = [];
    byteArray.forEach(function (byte) {
        var hex = byte.toString(16);
        var paddedHex = ("00" + hex).slice(-2);
        hexParts.push(paddedHex);
    });
    return hexParts.join('');
};
/**
 * @description Hex to Buffer
 * @param {string} hex The hex to convert to buffer
 * @returns {Object} Converted buffer value
 */
exports.hex2buf = function (hex) {
    // @ts-ignore
    return new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) { return parseInt(h, 16); }));
};
/**
 * @description Generate a hex nonce
 * @param {number} length The length of the nonce
 * @returns {string} The nonce of the given length
 */
exports.hexNonce = function (length) {
    var chars = '0123456789abcedf';
    var hex = '';
    while (length--) {
        hex += chars[(Math.random() * 16) | 0];
    }
    return hex;
};
/**
 * @description Merge two buffers together
 * @param {Object} b1 The first buffer
 * @param {Object} b2 The second buffer
 * @returns {Object} The merged buffer
 */
exports.mergebuf = function (b1, b2) {
    var r = new Uint8Array(b1.length + b2.length);
    r.set(b1);
    r.set(b2, b1.length);
    return r;
};
/**
 * @description Encodes an expression
 * @param {string} value The value to encode
 * @returns {string} The base58 encoded expression
 */
exports.encodeExpr = function (value) {
    var hash = blake2b_1.default(32);
    hash.update(exports.hex2buf(value));
    hash.digest((hash = buffer_1.Buffer.alloc(32)));
    return exports.b58cencode(hash, constants_1.prefix.expr);
};
exports.sexp2mic = function me(mi) {
    mi = mi
        .replace(/(?:@[a-z_]+)|(?:#.*$)/gm, '')
        .replace(/\s+/g, ' ')
        .trim();
    if (mi.charAt(0) === '(')
        mi = mi.slice(1, -1);
    var pl = 0;
    var sopen = false;
    var escaped = false;
    var ret = {
        prim: '',
        args: [],
    };
    var val = '';
    for (var i = 0; i < mi.length; i++) {
        if (escaped) {
            val += mi[i];
            escaped = false;
            continue;
        }
        else if ((i === mi.length - 1 && sopen === false) ||
            (mi[i] === ' ' && pl === 0 && sopen === false)) {
            if (i === mi.length - 1)
                val += mi[i];
            if (val) {
                if (val === parseInt(val, 10).toString()) {
                    if (!ret.prim)
                        return { int: val };
                    ret.args.push({ int: val });
                }
                else if (val[0] === '0' && val[1] === 'x') {
                    val = val.substring(2);
                    if (!ret.prim)
                        return { bytes: val };
                    ret.args.push({ bytes: val });
                }
                else if (ret.prim) {
                    ret.args.push(me(val));
                }
                else {
                    ret.prim = val;
                }
                val = '';
            }
            continue;
        }
        else if (mi[i] === '"' && sopen) {
            sopen = false;
            if (!ret.prim)
                return { string: val };
            ret.args.push({ string: val });
            val = '';
            continue;
        }
        else if (mi[i] === '"' && !sopen && pl === 0) {
            sopen = true;
            continue;
        }
        else if (mi[i] === '\\')
            escaped = true;
        else if (mi[i] === '(')
            pl++;
        else if (mi[i] === ')')
            pl--;
        val += mi[i];
    }
    return ret;
};
exports.mic2arr = function me2(s) {
    var ret = [];
    if (Object.prototype.hasOwnProperty.call(s, 'prim')) {
        if (s.prim === 'Pair') {
            ret.push(me2(s.args[0]));
            ret = ret.concat(me2(s.args[1]));
        }
        else if (s.prim === 'Elt') {
            ret = {
                key: me2(s.args[0]),
                val: me2(s.args[1]),
            };
        }
        else if (s.prim === 'True') {
            ret = true;
        }
        else if (s.prim === 'False') {
            ret = false;
        }
    }
    else if (Array.isArray(s)) {
        var sc = s.length;
        for (var i = 0; i < sc; i++) {
            var n = me2(s[i]);
            if (typeof n.key !== 'undefined') {
                if (Array.isArray(ret)) {
                    ret = {
                        keys: [],
                        vals: [],
                    };
                }
                ret.keys.push(n.key);
                ret.vals.push(n.val);
            }
            else {
                ret.push(n);
            }
        }
    }
    else if (Object.prototype.hasOwnProperty.call(s, 'string')) {
        ret = s.string;
    }
    else if (Object.prototype.hasOwnProperty.call(s, 'int')) {
        ret = parseInt(s.int, 10);
    }
    else {
        ret = s;
    }
    return ret;
};
exports.ml2mic = function me(mi) {
    var ret = [];
    var inseq = false;
    var seq = '';
    var val = '';
    var pl = 0;
    var bl = 0;
    var sopen = false;
    var escaped = false;
    for (var i = 0; i < mi.length; i++) {
        if (val === '}' || val === ';') {
            val = '';
        }
        if (inseq) {
            if (mi[i] === '}') {
                bl--;
            }
            else if (mi[i] === '{') {
                bl++;
            }
            if (bl === 0) {
                var st = me(val);
                ret.push({
                    prim: seq.trim(),
                    args: [st],
                });
                val = '';
                bl = 0;
                inseq = false;
            }
        }
        else if (mi[i] === '{') {
            bl++;
            seq = val;
            val = '';
            inseq = true;
            continue;
        }
        else if (escaped) {
            val += mi[i];
            escaped = false;
            continue;
        }
        else if ((i === mi.length - 1 && sopen === false) ||
            (mi[i] === ';' && pl === 0 && sopen === false)) {
            if (i === mi.length - 1)
                val += mi[i];
            if (val.trim() === '' || val.trim() === '}' || val.trim() === ';') {
                val = '';
                continue;
            }
            ret.push(exports.sexp2mic(val));
            val = '';
            continue;
        }
        else if (mi[i] === '"' && sopen) {
            sopen = false;
        }
        else if (mi[i] === '"' && !sopen) {
            sopen = true;
        }
        else if (mi[i] === '\\') {
            escaped = true;
        }
        else if (mi[i] === '(') {
            pl++;
        }
        else if (mi[i] === ')') {
            pl--;
        }
        val += mi[i];
    }
    return ret;
};
// Legacy commands
exports.ml2tzjson = exports.sexp2mic;
exports.tzjson2arr = exports.mic2arr;
exports.mlraw2json = exports.ml2mic;
exports.mintotz = exports.totez;
exports.tztomin = exports.mutez;
exports.default = {
    textEncode: exports.textEncode,
    textDecode: exports.textDecode,
    b582int: exports.b582int,
    totez: exports.totez,
    mutez: exports.mutez,
    b58cencode: exports.b58cencode,
    b58cdecode: exports.b58cdecode,
    buf2hex: exports.buf2hex,
    hex2buf: exports.hex2buf,
    hexNonce: exports.hexNonce,
    mergebuf: exports.mergebuf,
    encodeExpr: exports.encodeExpr,
    sexp2mic: exports.sexp2mic,
    mic2arr: exports.mic2arr,
    ml2mic: exports.ml2mic,
    ml2tzjson: exports.ml2tzjson,
    tzjson2arr: exports.tzjson2arr,
    mlraw2json: exports.mlraw2json,
    mintotz: exports.mintotz,
    tztomin: exports.tztomin,
};
