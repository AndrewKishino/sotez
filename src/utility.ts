import bs58check from 'bs58check';
import { BigNumber } from 'bignumber.js';
import { Buffer } from 'buffer/';

type Micheline = {
  prim: string,
  args?: MichelineArray,
  annots?: Array<string>
}
  | { bytes: string }
  | { int: string }
  | { string: string }
  | { address: string }
  | { contract: string }
  | { key: string }
  | { key_hash: string }
  | { signature: string }
  | MichelineArray;

interface MichelineArray extends Array<Micheline> { }

const textEncode = (value: string): Uint8Array => new Uint8Array(Buffer.from(value, 'utf8'));

const textDecode = (buffer: Uint8Array) => Buffer.from(buffer).toString('utf8');

/**
 * @description Convert from base58 to integer
 * @param {string} v The b58 value
 * @returns {string} The converted b58 value
 */
const b582int = (v: string): string => {
  let rv = new BigNumber(0);
  const alpha = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  for (let i = 0; i < v.length; i++) {
    rv = rv.plus(new BigNumber(alpha.indexOf(v[v.length - 1 - i])).multipliedBy(new BigNumber(alpha.length).exponentiatedBy(i)));
  }
  return rv.toString(16);
};

/**
 * @description Convert from mutez to tez
 * @param {number} mutez The amount in mutez to convert to tez
 * @returns {number} The mutez amount converted to tez
 */
const totez = (mutez: number): number => {
  if (typeof mutez === 'number') {
    return mutez / 1000000;
  } if (typeof mutez === 'string') {
    return parseInt(mutez, 10) / 1000000;
  }
  throw new TypeError('Invalid parameter for "mutez" provided.');
};

/**
 * @description Convert from tez to mutez
 * @param {number} tez The amount in tez to convert to mutez
 * @returns {string} The tez amount converted to mutez
 */
const mutez = (tez: number): string => new BigNumber(new BigNumber(tez).toFixed(6)).multipliedBy(1000000).toString();

/**
 * @description Base58 encode
 * @param {string | Uint8Array} payload The value to encode
 * @param {Object} prefixArg The Uint8Array prefix values
 * @returns {string} The base58 encoded value
 */
const b58cencode = (payload: Uint8Array, prefixArg: Uint8Array): string => {
  const n = new Uint8Array(prefixArg.length + payload.length);
  n.set(prefixArg);
  n.set(payload, prefixArg.length);
  // @ts-ignore
  return bs58check.encode(Buffer.from(n, 'hex'));
};

/**
 * @description Base58 decode
 * @param {string} payload The value to decode
 * @param {Object} prefixArg The Uint8Array prefix values
 * @returns {Object} The decoded base58 value
 */
const b58cdecode = (enc: string, prefixArg: Uint8Array): Uint8Array => bs58check.decode(enc).slice(prefixArg.length);

/**
 * @description Buffer to hex
 * @param {Object} buffer The buffer to convert to hex
 * @returns {string} Converted hex value
 */
const buf2hex = (buffer: Buffer): string => {
  const byteArray = new Uint8Array(buffer);
  const hexParts: string[] = [];
  byteArray.forEach((byte: any) => {
    const hex = byte.toString(16);
    const paddedHex = (`00${hex}`).slice(-2);
    hexParts.push(paddedHex);
  });
  return hexParts.join('');
};

/**
 * @description Hex to Buffer
 * @param {string} hex The hex to convert to buffer
 * @returns {Object} Converted buffer value
 */
const hex2buf = (hex: string): Uint8Array => (
  // @ts-ignore
  new Uint8Array(hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)))
);

/**
 * @description Generate a hex nonce
 * @param {number} length The length of the nonce
 * @returns {string} The nonce of the given length
 */
const hexNonce = (length: number): string => {
  const chars = '0123456789abcedf';
  let hex = '';
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
const mergebuf = (b1: Uint8Array, b2: Uint8Array): Uint8Array => {
  const r = new Uint8Array(b1.length + b2.length);
  r.set(b1);
  r.set(b2, b1.length);
  return r;
};

const sexp2mic = function me(mi: string): Micheline {
  mi = mi.replace(/(?:@[a-z_]+)|(?:#.*$)/mg, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (mi.charAt(0) === '(') mi = mi.slice(1, -1);
  let pl = 0;
  let sopen = false;
  let escaped = false;
  const ret: { prim: string; args: any[] } = {
    prim: '',
    args: [],
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
        } else if (val[0] === '0' && val[1] === 'x') {
          val = val.substr(2);
          if (!ret.prim) return { bytes: val };
          ret.args.push({ bytes: val });
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
};

const mic2arr = function me2(s: any): any {
  let ret: any = [];
  if (Object.prototype.hasOwnProperty.call(s, 'prim')) {
    if (s.prim === 'Pair') {
      ret.push(me2(s.args[0]));
      ret = ret.concat(me2(s.args[1]));
    } else if (s.prim === 'Elt') {
      ret = {
        key: me2(s.args[0]),
        val: me2(s.args[1]),
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
  } else if (Object.prototype.hasOwnProperty.call(s, 'string')) {
    ret = s.string;
  } else if (Object.prototype.hasOwnProperty.call(s, 'int')) {
    ret = parseInt(s.int, 10);
  } else {
    ret = s;
  }
  return ret;
};

const ml2mic = function me(mi: string): Micheline {
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
          args: [st],
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
      ret.push(sexp2mic(val));
      val = '';
      continue;
    } else if (mi[i] === '"' && sopen) {
      sopen = false;
    } else if (mi[i] === '"' && !sopen) {
      sopen = true;
    } else if (mi[i] === '\\') {
      escaped = true;
    } else if (mi[i] === '(') {
      pl++;
    } else if (mi[i] === ')') {
      pl--;
    }
    val += mi[i];
  }
  return ret;
};

// Legacy commands
const ml2tzjson = sexp2mic;
const tzjson2arr = mic2arr;
const mlraw2json = ml2mic;
const mintotz = totez;
const tztomin = mutez;

export default {
  textEncode,
  textDecode,
  b582int,
  totez,
  mutez,
  b58cencode,
  b58cdecode,
  buf2hex,
  hex2buf,
  hexNonce,
  mergebuf,
  sexp2mic,
  mic2arr,
  ml2mic,
  ml2tzjson,
  tzjson2arr,
  mlraw2json,
  mintotz,
  tztomin,
};
