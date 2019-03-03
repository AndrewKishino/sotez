if (typeof Buffer === 'undefined') Buffer = require('buffer/').Buffer; // eslint-disable-line
if (typeof XMLHttpRequest === 'undefined') XMLHttpRequest = require('xhr2'); // eslint-disable-line

const bs58check = require('bs58check');
const _sodium = require('libsodium-wrappers');
const bip39 = require('bip39');
const { BigNumber } = require('bignumber.js');
const isNode = require('detect-node');
const { encode } = require('isomorphic-textencoder');

if (isNode) {
  global.__non_webpack_require__ = require;
}

const LedgerTransport = isNode
  ? __non_webpack_require__('@ledgerhq/hw-transport-node-hid').default // eslint-disable-line
  : require('@ledgerhq/hw-transport-u2f').default;
const LedgerApp = require('./hw-app-xtz/lib/Tezos').default;

const DEFAULT_PROVIDER = 'http://127.0.0.1:8732';
const DEFAULT_FEE = 1278;
const counters = {};

const prefix = {
  tz1: new Uint8Array([6, 161, 159]),
  tz2: new Uint8Array([6, 161, 161]),
  tz3: new Uint8Array([6, 161, 164]),
  KT: new Uint8Array([2, 90, 121]),

  edpk: new Uint8Array([13, 15, 37, 217]),
  edsk2: new Uint8Array([13, 15, 58, 7]),
  spsk: new Uint8Array([17, 162, 224, 201]),
  p2sk: new Uint8Array([16, 81, 238, 189]),

  sppk: new Uint8Array([3, 254, 226, 86]),
  p2pk: new Uint8Array([3, 178, 139, 127]),

  edesk: new Uint8Array([7, 90, 60, 179, 41]),

  edsk: new Uint8Array([43, 246, 78, 7]),
  edsig: new Uint8Array([9, 245, 205, 134, 18]),
  spsig1: new Uint8Array([13, 115, 101, 19, 63]),
  p2sig: new Uint8Array([54, 240, 44, 52]),
  sig: new Uint8Array([4, 130, 43]),

  Net: new Uint8Array([87, 82, 0]),
  nce: new Uint8Array([69, 220, 169]),
  b: new Uint8Array([1, 52]),
  o: new Uint8Array([5, 116]),
  Lo: new Uint8Array([133, 233]),
  LLo: new Uint8Array([29, 159, 109]),
  P: new Uint8Array([2, 170]),
  Co: new Uint8Array([79, 179]),
  id: new Uint8Array([153, 103]),
};

const watermark = {
  block: new Uint8Array([1]),
  endorsement: new Uint8Array([2]),
  generic: new Uint8Array([3]),
};

const utility = {};
/**
 * @description Convert from base58 to integer
 * @param {Number} v The b58 value
 * @returns {String} The converted b58 value
 */
utility.b582int = (v) => {
  let rv = new BigNumber(0);
  const alpha = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  for (let i = 0; i < v.length; i++) {
    rv = rv.plus(new BigNumber(alpha.indexOf(v[v.length - 1 - i]).multipliedBy(new BigNumber(alpha.length).exponentiatedBy(i))));
  }
  return rv.toString(16);
};

/**
 * @description Convert from mutez to tez
 * @param {Number} mutez The amount in mutez to convert to tez
 * @returns {Integer} The mutez amount converted to tez
 */
utility.totez = mutez => parseInt(mutez, 10) / 1000000;

/**
 * @description Convert from tez to mutez
 * @param {Number} tez The amount in tez to convert to mutez
 * @returns {String} The tez amount converted to mutez
 */
utility.mutez = tez => new BigNumber(new BigNumber(tez).toFixed(6)).multipliedBy(1000000).toString();

/**
 * @description Base58 encode
 * @param {String} payload The value to encode
 * @param {Object} prefixArg The Uint8Array prefix values
 * @returns {String} The base58 encoded value
 */
utility.b58cencode = (payload, prefixArg) => {
  const n = new Uint8Array(prefixArg.length + payload.length);
  n.set(prefixArg);
  n.set(payload, prefixArg.length);
  return bs58check.encode(Buffer.from(n, 'hex'));
};

/**
 * @description Base58 decode
 * @param {String} payload The value to decode
 * @param {Object} prefixArg The Uint8Array prefix values
 * @returns {String} The decoded base58 value
 */
utility.b58cdecode = (enc, prefixArg) => bs58check.decode(enc).slice(prefixArg.length);

/**
 * @description Buffer to hex
 * @param {Object} buffer The buffer to convert to hex
 * @returns {String} Converted hex value
 */
utility.buf2hex = (buffer) => {
  const byteArray = new Uint8Array(buffer);
  const hexParts = [];
  byteArray.forEach((byte) => {
    const hex = byte.toString(16);
    const paddedHex = (`00${hex}`).slice(-2);
    hexParts.push(paddedHex);
  });
  return hexParts.join('');
};

/**
 * @description Hex to Buffer
 * @param {String} hex The hex to convert to buffer
 * @returns {Object} Converted buffer value
 */
utility.hex2buf = hex => new Uint8Array(hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));

/**
 * @description Generate a hex nonce
 * @param {Number} length The length of the nonce
 * @returns {String} The nonce of the given length
 */
utility.hexNonce = (length) => {
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
utility.mergebuf = (b1, b2) => {
  const r = new Uint8Array(b1.length + b2.length);
  r.set(b1);
  r.set(b2, b1.length);
  return r;
};

utility.sexp2mic = function me(mi) {
  mi = mi.replace(/(?:@[a-z_]+)|(?:#.*$)/mg, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (mi.charAt(0) === '(') mi = mi.slice(1, -1);
  let pl = 0;
  let sopen = false;
  let escaped = false;
  const ret = {
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
        } else if (val[0] === '0') {
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

utility.mic2arr = function me2(s) {
  let ret = [];
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

utility.ml2mic = function me(mi) {
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
      ret.push(utility.ml2tzjson(val));
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

utility.formatMoney = (n, c, d, t) => {
  const cc = isNaN(c = Math.abs(c)) ? 2 : c; // eslint-disable-line
  const dd = d === undefined ? '.' : d;
  const tt = t === undefined ? ',' : t;
  const s = n < 0 ? '-' : '';
  const i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(cc), 10));
  const j = i.length > 3 ? i.length % 3 : 0;
  return s + (j ? i.substr(0, j) + tt : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${tt}`) + (cc ? dd + Math.abs(n - i).toFixed(c).slice(2) : '');
};

// TODO: Add p256 and secp256k1 cryptographay
const crypto = {};
/**
 * @description Extract key pairs from a secret key
 * @param {Object} sk The secret key to extract key pairs from
 * @returns {Promise} The extracted key pairs
 */
crypto.extractKeys = async (sk) => { // eslint-disable-line
  await _sodium.ready;
  const sodium = _sodium;
  const pref = sk.substr(0, 4);
  switch (pref) {
    case 'edsk':
      if (sk.length === 98) {
        return {
          pk: utility.b58cencode(utility.b58cdecode(sk, prefix.edsk).slice(32), prefix.edpk),
          pkh: utility.b58cencode(sodium.crypto_generichash(20, utility.b58cdecode(sk, prefix.edsk).slice(32)), prefix.tz1),
          sk,
        };
      }
      if (sk.length === 54) { // seed
        const s = utility.b58cdecode(sk, prefix.edsk2);
        const kp = sodium.crypto_sign_seed_keypair(s);
        return {
          sk: utility.b58cencode(kp.privateKey, prefix.edsk),
          pk: utility.b58cencode(kp.publicKey, prefix.edpk),
          pkh: utility.b58cencode(sodium.crypto_generichash(20, kp.publicKey), prefix.tz1),
        };
      }
      break;
    default:
      return false;
  }
};

/**
 * @description Generate a mnemonic
 * @returns {String} The generated mnemonic
 */
crypto.generateMnemonic = () => bip39.generateMnemonic(160);

/**
 * @description Check the validity of a tezos implicit address (tz1...)
 * @param {String} address The address to check
 * @returns {Boolean} Whether address is valid or not
 */
crypto.checkAddress = (address) => {
  try {
    utility.b58cdecode(address, prefix.tz1);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * @description Generate a new key pair given a mnemonic and passphrase
 * @param {String} mnemonic The mnemonic seed
 * @param {String} passphrase The passphrase used to encrypt the seed
 * @returns {Promise} The generated key pair
 */
crypto.generateKeys = async (mnemonic, passphrase) => {
  await _sodium.ready;
  const sodium = _sodium;
  const s = bip39.mnemonicToSeed(mnemonic, passphrase).slice(0, 32);
  const kp = sodium.crypto_sign_seed_keypair(s);
  return {
    mnemonic,
    passphrase,
    sk: utility.b58cencode(kp.privateKey, prefix.edsk),
    pk: utility.b58cencode(kp.publicKey, prefix.edpk),
    pkh: utility.b58cencode(sodium.crypto_generichash(20, kp.publicKey), prefix.tz1),
  };
};

/**
 * @description Sign bytes
 * @param {String} bytes The bytes to sign
 * @param {String} sk The secret key to sign the bytes with
 * @param {Object} wm The watermark bytes
 * @returns {Promise} The signed bytes
 */
crypto.sign = async (bytes, sk, wm) => {
  await _sodium.ready;
  const sodium = _sodium;

  if (sk.length === 54) {
    ({ sk } = await crypto.extractKeys(sk));
  }

  let bb = utility.hex2buf(bytes);
  if (typeof wm !== 'undefined') {
    bb = utility.mergebuf(wm, bb);
  }
  const sig = sodium.crypto_sign_detached(sodium.crypto_generichash(32, bb), utility.b58cdecode(sk, prefix.edsk), 'uint8array');
  const edsig = utility.b58cencode(sig, prefix.edsig);
  const sbytes = bytes + utility.buf2hex(sig);
  return {
    bytes,
    sig,
    edsig,
    sbytes,
  };
};

/**
 * @description Verify signed bytes
 * @param {String} bytes The signed bytes
 * @param {String} sig The signature of the signed bytes
 * @param {String} pk The public key
 * @returns {Boolean} Whether the signed bytes are valid
 */
crypto.verify = async (bytes, sig, pk) => {
  await _sodium.ready;
  const sodium = _sodium;
  return sodium.crypto_sign_verify_detached(sig, utility.hex2buf(bytes), utility.b58cdecode(pk, prefix.edpk));
};

const node = {
  activeProvider: DEFAULT_PROVIDER,
  debugMode: false,
  async: true,
  isZeronet: false,
};

/**
 * @description Enable additional logging by enabling debug mode
 * @param {Boolen} t Debug mode value
 */
node.setDebugMode = (t) => {
  node.debugMode = t;
};

/**
 * @description Set a new default provider
 * @param {String} provider The address of the provider
 * @param {Boolean} isZeronet Whether the provider is a zeronet node
 */
node.setProvider = (provider, isZeronet) => {
  if (typeof z !== 'undefined') node.isZeronet = isZeronet;
  node.activeProvider = provider;
};

/**
 * @description Reset the provider to the default provider
 */
node.resetProvider = () => {
  node.activeProvider = DEFAULT_PROVIDER;
};

/**
 * @description Queries a node given a path and payload
 * @param {String} path The RPC path to query
 * @param {String} payload The payload of the query
 * @param {String} method The request method. Either 'GET' or 'POST'
 * @returns {Promise} The response of the query
 */
node.query = (path, payload, method) => {
  if (typeof payload === 'undefined') {
    if (typeof method === 'undefined') {
      method = 'GET';
    } else {
      payload = {};
    }
  } else if (typeof method === 'undefined') {
    method = 'POST';
  }
  return new Promise((resolve, reject) => {
    try {
      const http = new XMLHttpRequest();
      http.open(method, node.activeProvider + path, node.async);
      http.onload = () => {
        if (node.debugMode) {
          console.log('Node call', path, payload);
        }
        if (http.status === 200) {
          if (http.responseText) {
            let response = JSON.parse(http.responseText);
            if (node.debugMode) {
              console.log('Node response', path, payload, response);
            }
            if (typeof response.error !== 'undefined') {
              reject(response.error);
            } else {
              if (typeof response.ok !== 'undefined') response = response.ok;
              resolve(response);
            }
          } else {
            reject('Empty response returned'); // eslint-disable-line
          }
        } else if (http.responseText) {
          reject(http.responseText);
        } else {
          reject(http.statusText);
        }
      };
      http.onerror = () => {
        reject(http.statusText);
      };
      if (method === 'POST') {
        http.setRequestHeader('Content-Type', 'application/json');
        http.send(JSON.stringify(payload));
      } else {
        http.send();
      }
    } catch (e) {
      reject(e);
    }
  });
};

const ledger = {};
/**
 * @description Get the public key and public key hash from the ledger
 * @param {Object} ledgerParams The parameters of the getAddress function
 * @param {string} [ledgerParams.path=44'/1729'/0'/0'] The ledger path
 * @param {Boolean} [ledgerParams.displayConfirm=false] Whether to display a confirmation the ledger
 * @param {Number} [ledgerParams.curve=0x00] The value which defines the curve (0x00=tz1, 0x01=tz2, 0x02=tz3)
 * @returns {Promise} The public key and public key hash
 */
ledger.getAddress = async ({
  path = "44'/1729'/0'/0'",
  displayConfirm = false,
  curve = 0x00,
} = {}) => {
  const transport = await LedgerTransport.create();
  const tezosLedger = new LedgerApp(transport);
  let publicKey;
  try {
    publicKey = await tezosLedger.getAddress(path, displayConfirm, curve);
  } catch (e) {
    transport.close();
    return e;
  }
  transport.close();
  return publicKey;
};

/**
 * @description Sign an operation with the ledger
 * @param {Object} ledgerParams The parameters of the signOperation function
 * @param {string} [ledgerParams.path=44'/1729'/0'/0'] The ledger path
 * @param {Boolean} ledgerParams.rawTxHex The transaction hex for the ledger to sign
 * @param {Number} [ledgerParams.curve=0x00] The value which defines the curve (0x00=tz1, 0x01=tz2, 0x02=tz3)
 * @returns {Promise} The signed operation
 */
ledger.signOperation = async ({
  path = "44'/1729'/0'/0'",
  rawTxHex,
  curve = 0x00,
} = {}) => {
  const transport = await LedgerTransport.create();
  const tezosLedger = new LedgerApp(transport);
  let signature;
  try {
    ({ signature } = await tezosLedger.signOperation(path, `03${rawTxHex}`, curve));
  } catch (e) {
    transport.close();
    return e;
  }
  transport.close();
  return { signature };
};

/**
 * @description Show the version of the ledger
 * @returns {Promise} The version info
 */
ledger.getVersion = async () => {
  const transport = await LedgerTransport.create();
  const tezosLedger = new LedgerApp(transport);
  let versionInfo;
  try {
    versionInfo = await tezosLedger.getVersion();
  } catch (e) {
    transport.close();
    return e;
  }
  transport.close();
  return versionInfo;
};

const forgeMappings = {
  /* eslint-disable */
  opMapping: {
    '00': 'parameter',
    '01': 'storage',
    '02': 'code',
    '03': 'False',
    '04': 'Elt',
    '05': 'Left',
    '06': 'None',
    '07': 'Pair',
    '08': 'Right',
    '09': 'Some',
    '0A': 'True',
    '0B': 'Unit',
    '0C': 'PACK',
    '0D': 'UNPACK',
    '0E': 'BLAKE2B',
    '0F': 'SHA256',
    '10': 'SHA512',
    '11': 'ABS',
    '12': 'ADD',
    '13': 'AMOUNT',
    '14': 'AND',
    '15': 'BALANCE',
    '16': 'CAR',
    '17': 'CDR',
    '18': 'CHECK_SIGNATURE',
    '19': 'COMPARE',
    '1A': 'CONCAT',
    '1B': 'CONS',
    '1C': 'CREATE_ACCOUNT',
    '1D': 'CREATE_CONTRACT',
    '1E': 'IMPLICIT_ACCOUNT',
    '1F': 'DIP',
    '20': 'DROP',
    '21': 'DUP',
    '22': 'EDIV',
    '23': 'EMPTY_MAP',
    '24': 'EMPTY_SET',
    '25': 'EQ',
    '26': 'EXEC',
    '27': 'FAILWITH',
    '28': 'GE',
    '29': 'GET',
    '2A': 'GT',
    '2B': 'HASH_KEY',
    '2C': 'IF',
    '2D': 'IF_CONS',
    '2E': 'IF_LEFT',
    '2F': 'IF_NONE',
    '30': 'INT',
    '31': 'LAMBDA',
    '32': 'LE',
    '33': 'LEFT',
    '34': 'LOOP',
    '35': 'LSL',
    '36': 'LSR',
    '37': 'LT',
    '38': 'MAP',
    '39': 'MEM',
    '3A': 'MUL',
    '3B': 'NEG',
    '3C': 'NEQ',
    '3D': 'NIL',
    '3E': 'NONE',
    '3F': 'NOT',
    '40': 'NOW',
    '41': 'OR',
    '42': 'PAIR',
    '43': 'PUSH',
    '44': 'RIGHT',
    '45': 'SIZE',
    '46': 'SOME',
    '47': 'SOURCE',
    '48': 'SENDER',
    '49': 'SELF',
    '4A': 'STEPS_TO_QUOTA',
    '4B': 'SUB',
    '4C': 'SWAP',
    '4D': 'TRANSFER_TOKENS',
    '4E': 'SET_DELEGATE',
    '4F': 'UNIT',
    '50': 'UPDATE',
    '51': 'XOR',
    '52': 'ITER',
    '53': 'LOOP_LEFT',
    '54': 'ADDRESS',
    '55': 'CONTRACT',
    '56': 'ISNAT',
    '57': 'CAST',
    '58': 'RENAME',
    '59': 'bool',
    '5A': 'contract',
    '5B': 'int',
    '5C': 'key',
    '5D': 'key_hash',
    '5E': 'lambda',
    '5F': 'list',
    '60': 'map',
    '61': 'big_map',
    '62': 'nat',
    '63': 'option',
    '64': 'or',
    '65': 'pair',
    '66': 'set',
    '67': 'signature',
    '68': 'string',
    '69': 'bytes',
    '6A': 'mutez',
    '6B': 'timestamp',
    '6C': 'unit',
    '6D': 'operation',
    '6E': 'address',
    '6F': 'SLICE',
  },
  opMappingReverse: {
    'SHA512': '10',
    'ABS': '11',
    'ADD': '12',
    'AMOUNT': '13',
    'AND': '14',
    'BALANCE': '15',
    'CAR': '16',
    'CDR': '17',
    'CHECK_SIGNATURE': '18',
    'COMPARE': '19',
    'DROP': '20',
    'DUP': '21',
    'EDIV': '22',
    'EMPTY_MAP': '23',
    'EMPTY_SET': '24',
    'EQ': '25',
    'EXEC': '26',
    'FAILWITH': '27',
    'GE': '28',
    'GET': '29',
    'INT': '30',
    'LAMBDA': '31',
    'LE': '32',
    'LEFT': '33',
    'LOOP': '34',
    'LSL': '35',
    'LSR': '36',
    'LT': '37',
    'MAP': '38',
    'MEM': '39',
    'NOW': '40',
    'OR': '41',
    'PAIR': '42',
    'PUSH': '43',
    'RIGHT': '44',
    'SIZE': '45',
    'SOME': '46',
    'SOURCE': '47',
    'SENDER': '48',
    'SELF': '49',
    'UPDATE': '50',
    'XOR': '51',
    'ITER': '52',
    'LOOP_LEFT': '53',
    'ADDRESS': '54',
    'CONTRACT': '55',
    'ISNAT': '56',
    'CAST': '57',
    'RENAME': '58',
    'bool': '59',
    'map': '60',
    'big_map': '61',
    'nat': '62',
    'option': '63',
    'or': '64',
    'pair': '65',
    'set': '66',
    'signature': '67',
    'string': '68',
    'bytes': '69',
    'parameter': '00',
    'storage': '01',
    'code': '02',
    'False': '03',
    'Elt': '04',
    'Left': '05',
    'None': '06',
    'Pair': '07',
    'Right': '08',
    'Some': '09',
    'True': '0A',
    'Unit': '0B',
    'PACK': '0C',
    'UNPACK': '0D',
    'BLAKE2B': '0E',
    'SHA256': '0F',
    'CONCAT': '1A',
    'CONS': '1B',
    'CREATE_ACCOUNT': '1C',
    'CREATE_CONTRACT': '1D',
    'IMPLICIT_ACCOUNT': '1E',
    'DIP': '1F',
    'GT': '2A',
    'HASH_KEY': '2B',
    'IF': '2C',
    'IF_CONS': '2D',
    'IF_LEFT': '2E',
    'IF_NONE': '2F',
    'MUL': '3A',
    'NEG': '3B',
    'NEQ': '3C',
    'NIL': '3D',
    'NONE': '3E',
    'NOT': '3F',
    'STEPS_TO_QUOTA': '4A',
    'SUB': '4B',
    'SWAP': '4C',
    'TRANSFER_TOKENS': '4D',
    'SET_DELEGATE': '4E',
    'UNIT': '4F',
    'contract': '5A',
    'int': '5B',
    'key': '5C',
    'key_hash': '5D',
    'lambda': '5E',
    'list': '5F',
    'mutez': '6A',
    'timestamp': '6B',
    'unit': '6C',
    'operation': '6D',
    'address': '6E',
    'SLICE': '6F',
  },
  /* eslint-enable */
  primMapping: {
    '00': 'int',
    '01': 'string',
    '02': 'seq',
    '03': { name: 'prim', len: 0, annots: false },
    '04': { name: 'prim', len: 0, annots: true },
    '05': { name: 'prim', len: 1, annots: false },
    '06': { name: 'prim', len: 1, annots: true },
    '07': { name: 'prim', len: 2, annots: false },
    '08': { name: 'prim', len: 2, annots: true },
    '09': { name: 'prim', len: 3, annots: true },
    '0A': 'bytes',
  },
  primMappingReverse: {
    0: {
      false: '03',
      true: '04',
    },
    1: {
      false: '05',
      true: '06',
    },
    2: {
      false: '07',
      true: '08',
    },
    3: {
      true: '09',
    },
  },
  forgeOpTags: {
    endorsement: 0,
    seed_nonce_revelation: 1,
    double_endorsement_evidence: 2,
    double_baking_evidence: 3,
    activate_account: 4,
    proposals: 5,
    ballot: 6,
    reveal: 7,
    transaction: 8,
    origination: 9,
    delegation: 10,
  },
};

const forge = {};
/**
 * @description Convert bytes from Int32
 * @param {Number} num Number to convert to bytes
 * @returns {Object} The converted number
 */
forge.toBytesInt32 = (num) => {
  num = parseInt(num, 10);
  const arr = new Uint8Array([
    (num & 0xff000000) >> 24,
    (num & 0x00ff0000) >> 16,
    (num & 0x0000ff00) >> 8,
    (num & 0x000000ff),
  ]);
  return arr.buffer;
};

/**
 * @description Convert hex from Int32
 * @param {Number} num Number to convert to hex
 * @returns {String} The converted number
 */
forge.toBytesInt32Hex = num => utility.buf2hex(forge.toBytesInt32(num));

/**
 * @description Forge boolean
 * @param {Boolean} bool Boolean value to convert
 * @returns {String} The converted boolean
 */
forge.bool = bool => (bool ? 'ff' : '00');

/**
 * @description Forge script bytes
 * @param {Object} script Script to forge
 * @param {String} script.code Script code
 * @param {String} script.storage Script storage
 * @returns {String} Forged script bytes
 */
forge.script = (script) => {
  const t1 = tezos.encodeRawBytes(script.code).toLowerCase();
  const t2 = tezos.encodeRawBytes(script.storage).toLowerCase();
  return forge.toBytesInt32Hex(t1.length / 2) + t1 + forge.toBytesInt32Hex(t2.length / 2) + t2;
};

/**
 * @description Forge parameter bytes
 * @param {String} parameter Script to forge
 * @returns {String} Forged parameter bytes
 */
forge.parameters = (parameter) => {
  const t = tezos.encodeRawBytes(parameter).toLowerCase();
  return forge.toBytesInt32Hex(t.length / 2) + t;
};

/**
 * @description Forge public key hash bytes
 * @param {String} pkh Public key hash to forge
 * @returns {String} Forged public key hash bytes
 */
forge.publicKeyHash = (pkh) => {
  let fpkh;
  const t = parseInt(pkh.substr(2, 1), 10);
  fpkh = `0${(t - 1).toString()}`;
  fpkh += utility.buf2hex(utility.b58cdecode(pkh, prefix[pkh.substr(0, 3)]));
  return fpkh;
};

/**
 * @description Forge address bytes
 * @param {String} address Address to forge
 * @returns {String} Forged address bytes
 */
forge.address = (address) => {
  let fa;
  if (address.substr(0, 1) === 'K') {
    fa = '01';
    fa += utility.buf2hex(utility.b58cdecode(address, prefix.KT));
    fa += '00';
  } else {
    fa = '00';
    fa += forge.publicKeyHash(address);
  }
  return fa;
};

/**
 * @description Forge zarith bytes
 * @param {Number} n Zarith to forge
 * @returns {String} Forged zarith bytes
 */
forge.zarith = (n) => {
  let fn = '';
  n = parseInt(n, 10);
  while (true) { // eslint-disable-line
    if (n < 128) {
      if (n < 16) fn += '0';
      fn += n.toString(16);
      break;
    } else {
      let b = (n % 128);
      n -= b;
      n /= 128;
      b += 128;
      fn += b.toString(16);
    }
  }
  return fn;
};

/**
 * @description Forge public key bytes
 * @param {Number} pk Public key to forge
 * @returns {String} Forged public key bytes
 */
forge.publicKey = (pk) => {
  let fpk;
  switch (pk.substr(0, 2)) {
    case 'ed': fpk = '00'; break;
    case 'sp': fpk = '01'; break;
    case 'p2': fpk = '02'; break;
    default: break;
  }
  fpk += utility.buf2hex(utility.b58cdecode(pk, prefix[pk.substr(0, 4)]));
  return fpk;
};

/**
 * @description Forge operation bytes
 * @param {Object} op Operation to forge
 * @returns {String} Forged operation bytes
 */
forge.op = (op) => {
  /* eslint-disable */
  let fop;
  fop = utility.buf2hex(new Uint8Array([forgeMappings.forgeOpTags[op.kind]]));
  switch (forgeMappings.forgeOpTags[op.kind]) {
    case 0:
    case 1:
      fop += utility.buf2hex(forge.toBytesInt32(op.level));
      if (forgeMappings.forgeOpTags[op.kind] === 0) break;
      fop += op.nonce;
      if (forgeMappings.forgeOpTags[op.kind] === 1) break;
    case 2:
    case 3:
      throw new Error('Double bake and double endorse forging is not complete');
      if (forgeMappings.forgeOpTags[op.kind] === 2) break;
      if (forgeMappings.forgeOpTags[op.kind] === 3) break;
    case 4:
      fop += utility.buf2hex(utility.b58cdecode(op.pkh, prefix.tz1));
      fop += op.secret;
      if (forgeMappings.forgeOpTags[op.kind] === 4) break;
    case 5:
    case 6:
      fop += forge.publicKeyHash(op.source);
      fop += utility.buf2hex(forge.toBytesInt32(op.period));
      if (forgeMappings.forgeOpTags[op.kind] === 5) {
        throw new Error('Proposal forging is not complete');
        break;
      } else if (forgeMappings.forgeOpTags[op.kind] === 6) {
        fop += utility.buf2hex(utility.b58cdecode(op.proposal, prefix.P));
        let ballot;
        if (op.ballot === 'yay') {
          ballot = '00';
        } else if (op.ballot === 'nay') {
          ballot = '01';
        } else {
          ballot = '02';
        }
        fop += ballot;
        break;
      }
    case 7:
    case 8:
    case 9:
    case 10:
      fop += forge.address(op.source);
      fop += forge.zarith(op.fee);
      fop += forge.zarith(op.counter);
      fop += forge.zarith(op.gas_limit);
      fop += forge.zarith(op.storage_limit);
      if (forgeMappings.forgeOpTags[op.kind] === 7) {
        fop += forge.publicKey(op.public_key);
      } else if (forgeMappings.forgeOpTags[op.kind] === 8) {
        fop += forge.zarith(op.amount);
        fop += forge.address(op.destination);
        if (typeof op.parameters !== 'undefined' && op.parameters) {
          fop += forge.bool(true);
          fop += forge.parameters(op.parameters);
        } else {
          fop += forge.bool(false);
        }
      } else if (forgeMappings.forgeOpTags[op.kind] === 9) {
        fop += forge.publicKeyHash(op.managerPubkey);
        fop += forge.zarith(op.balance);
        fop += forge.bool(op.spendable);
        fop += forge.bool(op.delegatable);
        if (typeof op.delegate !== 'undefined' && op.delegate) {
          fop += forge.bool(true);
          fop += forge.publicKeyHash(op.delegate);
        } else {
          fop += forge.bool(false);
        }
        if (typeof op.script !== 'undefined' && op.script) {
          fop += forge.bool(true);
          fop += forge.script(op.script);
        } else {
          fop += forge.bool(false);
        }
      } else if (forgeMappings.forgeOpTags[op.kind] === 10) {
        if (typeof op.delegate !== 'undefined' && op.delegate) {
          fop += forge.bool(true);
          fop += forge.publicKeyHash(op.delegate);
        } else {
          fop += forge.bool(false);
        }
      }
      break;
    default:
      break;
  }
  return fop;
  /* eslint-enable */
};

const tezos = {};
/**
 * @description Forge operation bytes
 * @param {Object} head The current head of the chain
 * @param {Object} opOb The operation object(s)
 * @param {Boolean} [debug=false] Enable extra logging for debugging
 * @returns {String} Forged operation bytes
 */
tezos.forge = async (head, opOb, validateLocalForge = false) => {
  let remoteForgedBytes;

  if (validateLocalForge) {
    remoteForgedBytes = await node.query(`/chains/${head.chain_id}/blocks/${head.hash}/helpers/forge/operations`, opOb);
  }

  let localForgedBytes = utility.buf2hex(utility.b58cdecode(opOb.branch, prefix.b));
  opOb.contents.forEach((content) => {
    localForgedBytes += forge.op(content);
  });

  opOb.protocol = head.protocol;
  if (validateLocalForge) {
    if (localForgedBytes === remoteForgedBytes) {
      return {
        opbytes: localForgedBytes,
        opOb,
      };
    }
    throw new Error('Forge validation error - local and remote bytes don\'t match');
  }

  return {
    opbytes: localForgedBytes,
    opOb,
  };
};

/**
 * @description Decode raw bytes
 * @param {String} bytes The bytes to decode
 * @returns {Object} Decoded raw bytes
 */
tezos.decodeRawBytes = (bytes) => {
  bytes = bytes.toUpperCase();

  let index = 0;
  const read = len => bytes.slice(index, index + len);

  const rec = () => {
    const b = read(2);
    const prim = forgeMappings.primMapping[b];

    if (prim instanceof Object) {
      index += 2;
      const op = forgeMappings.opMapping[read(2)];
      index += 2;
      const args = [...Array(prim.len)];
      const result = {
        prim: op,
        args: args.map(() => rec()),
        annots: undefined,
      };
      if (!prim.len) {
        delete result.args;
      }
      if (prim.annots) {
        const annotsLen = parseInt(read(8), 16) * 2;
        index += 8;
        const stringHexLst = read(annotsLen).match(/[\dA-F]{2}/g);
        index += annotsLen;
        if (stringHexLst) {
          const stringBytes = new Uint8Array(stringHexLst.map(x => parseInt(x, 16)));
          const stringResult = new TextDecoder('utf-8').decode(stringBytes);
          result.annots = stringResult.split(' ');
        }
      } else {
        delete result.annots;
      }
      return result;
    }

    if (b === '0A') {
      index += 2;
      const len = read(8);
      index += 8;
      const intLen = parseInt(len, 16) * 2;
      const data = read(intLen);
      index += intLen;
      return { bytes: data };
    }

    if (b === '01') {
      index += 2;
      const len = read(8);
      index += 8;
      const intLen = parseInt(len, 16) * 2;
      const data = read(intLen);
      index += intLen;

      const matchResult = data.match(/[\dA-F]{2}/g);
      if (matchResult instanceof Array) {
        const stringRaw = new Uint8Array(matchResult.map(x => parseInt(x, 16)));
        return { string: new TextDecoder('utf-8').decode(stringRaw) };
      }

      throw new Error('Input bytes error');
    }

    if (b === '00') {
      index += 2;
      const firstBytes = parseInt(read(2), 16).toString(2).padStart(8, '0');
      index += 2;
      // const isPositive = firstBytes[1] === '0';
      const validBytes = [firstBytes.slice(2)];
      let checknext = firstBytes[0] === '1';

      while (checknext) {
        const bytesCheck = parseInt(read(2), 16).toString(2).padStart(8, '0');
        index += 2;
        validBytes.push(bytesCheck.slice(1));
        checknext = bytesCheck[0] === '1';
      }

      const num = new BigNumber(validBytes.reverse().join(''), 2);
      return { int: num.toString() };
    }

    if (b === '02') {
      index += 2;
      const len = read(8);
      index += 8;
      const intLen = parseInt(len, 16) * 2;
      // const data = read(intLen);
      const limit = index + intLen;

      const seqLst = [];
      while (limit > index) {
        seqLst.push(rec());
      }
      return seqLst;
    }
    throw new Error(`Invalid raw bytes: Byte:${b} Index:${index}`);
  };

  return rec();
};

/**
 * @description Encode raw bytes
 * @param {Object} input The value to encode
 * @returns {String} Encoded value as bytes
 */
tezos.encodeRawBytes = (input) => {
  const rec = (inputArg) => {
    const result = [];

    if (inputArg instanceof Array) {
      result.push('02');
      const bytes = inputArg.map(x => rec(x)).join('');
      const len = bytes.length / 2;
      result.push(len.toString(16).padStart(8, '0'));
      result.push(bytes);
    } else if (inputArg instanceof Object) {
      if (inputArg.prim) {
        const argsLen = inputArg.args ? inputArg.args.length : 0;
        result.push(forgeMappings.primMappingReverse[argsLen][!!inputArg.annots]);
        result.push(forgeMappings.opMappingReverse[inputArg.prim]);
        if (inputArg.args) {
          inputArg.args.forEach(arg => result.push(rec(arg)));
        }
        if (inputArg.annots) {
          const annotsBytes = inputArg.annots.map(x => utility.buf2hex(encode(x))).join('20');
          result.push((annotsBytes.length / 2).toString(16).padStart(8, '0'));
          result.push(annotsBytes);
        }
      } else if (inputArg.bytes) {
        const len = inputArg.bytes.length / 2;
        result.push('0A');
        result.push(len.toString(16).padStart(8, '0'));
        result.push(inputArg.bytes);
      } else if (inputArg.int) {
        const num = new BigNumber(inputArg.int, 10);
        const positiveMark = num.toString(2)[0] === '-' ? '1' : '0';
        const binary = num.toString(2).replace('-', '');

        let pad;
        if (binary.length <= 6) {
          pad = 6;
        } else if ((binary.length - 6) % 7) {
          pad = (binary.length + 7 - (binary.length - 6)) % 7;
        } else {
          pad = binary.length;
        }

        const splitted = binary.padStart(pad, '0').match(/\d{6,7}/g);
        const reversed = splitted.reverse();

        reversed[0] = positiveMark + reversed[0];
        const numHex = reversed.map((x, i) => (
          parseInt((i === reversed.length - 1 ? '0' : '1') + x, 2)
            .toString(16)
            .padStart(2, '0')
        )).join('');

        result.push('00');
        result.push(numHex);
      } else if (inputArg.string) {
        const stringBytes = encode(inputArg.string);
        const stringHex = [].slice.call(stringBytes).map(x => x.toString(16).padStart(2, '0')).join('');
        const len = stringBytes.length;
        result.push('01');
        result.push(len.toString(16).padStart(8, '0'));
        result.push(stringHex);
      }
    }
    return result.join('');
  };

  return rec(input).toUpperCase();
};

const rpc = {};
/**
 * @description Originate a new account
 * @param {Object} paramObject The parameters for the origination
 * @param {Object} [paramObject.keys] The keys for which to originate the account. If using a ledger, this is optional
 * @param {Number} paramObject.amount The amount in tez to transfer for the initial balance
 * @param {Boolean} [paramObject.spendable] Whether the keyholder can spend the balance from the new account
 * @param {Boolean} [paramObject.delegatable] Whether the new account is delegatable
 * @param {String} [paramObject.delegate] The delegate for the new account
 * @param {Number} [paramObject.fee=1278] The fee to set for the transaction
 * @param {Number} [paramObject.gasLimit=10000] The gas limit to set for the transaction
 * @param {Number} [paramObject.storageLimit=257] The storage limit to set for the transaction
 * @param {Object} [ledgerObject={}] The ledger parameters for the operation
 * @param {Boolean} [ledgerObject.useLedger=false] Whether to sign the transaction with a connected ledger device
 * @param {String} [ledgerObject.path=44'/1729'/0'/0'] The ledger path
 * @param {Number} [ledgerObject.curve=0x00] The value which defines the curve (0x00=tz1, 0x01=tz2, 0x02=tz3)
 * @returns {Promise} Object containing the injected operation hash
 */
rpc.account = async ({
  keys,
  amount,
  spendable,
  delegatable,
  delegate,
  fee = DEFAULT_FEE,
  gasLimit = 10000,
  storageLimit = 257,
}, {
    useLedger = false,
    path = "44'/1729'/0'/0'",
    curve = 0x00,
  } = {}) => {
  let publicKeyHash = keys && keys.pkh;

  if (useLedger) {
    const { address } = await ledger.getAddress({
      path,
      curve,
    });
    publicKeyHash = address;
  }

  const operation = {
    kind: 'origination',
    balance: `${utility.mutez(amount)}`,
    fee: `${fee}`,
    gas_limit: `${gasLimit}`,
    storage_limit: `${storageLimit}`,
  };

  if (node.isZeronet) {
    operation.manager_pubkey = publicKeyHash;
  } else {
    operation.managerPubkey = publicKeyHash;
  }

  if (typeof spendable !== 'undefined') operation.spendable = spendable;
  if (typeof delegatable !== 'undefined') operation.delegatable = delegatable;
  if (typeof delegate !== 'undefined' && delegate) operation.delegate = delegate;
  return rpc.sendOperation({
    from: publicKeyHash,
    operation,
    keys,
  }, { useLedger, path, curve });
};

/**
 * @description Get the balance for a contract
 * @param {String} address The contract for which to retrieve the balance
 * @returns {Promise} The balance of the contract
 */
rpc.getBalance = address => (
  node.query(`/chains/main/blocks/head/context/contracts/${address}/balance`)
    .then(r => r)
);

/**
 * @description Get the delegate for a contract
 * @param {String} address The contract for which to retrieve the delegate
 * @returns {Promise} The delegate of a contract, if any
 */
rpc.getDelegate = address => (
  node.query(`/chains/main/blocks/head/context/contracts/${address}/delegate`)
    .then((r) => {
      if (r) { return r; }
      return false;
    }).catch(() => false)
);

/**
 * @description Get the manager for a contract
 * @param {String} address The contract for which to retrieve the manager
 * @returns {Promise} The manager of a contract
 */
rpc.getManager = address => (
  node.query(`/chains/main/blocks/head/context/contracts/${address}/manager_key`)
);

/**
 * @description Get the counter for an contract
 * @param {String} address The contract for which to retrieve the counter
 * @returns {Promise} The counter of a contract, if any
 */
rpc.getCounter = address => (
  node.query(`/chains/main/blocks/head/context/contracts/${address}/counter`)
);

/**
 * @description Get the baker information for an address
 * @param {String} address The contract for which to retrieve the baker information
 * @returns {Promise} The information of the delegate address
 */
rpc.getBaker = address => (
  node.query(`/chains/main/blocks/head/context/delegates/${address}`)
);

/**
 * @description Get the header of the current head
 * @returns {Promise} The whole block header
 */
rpc.getHeader = () => (
  node.query('/chains/main/blocks/head/header')
);

/**
 * @description Get the current head block of the chain
 * @returns {Promise} The current head block
 */
rpc.getHead = () => node.query('/chains/main/blocks/head');

/**
 * @description Get the current head block hash of the chain
 * @returns {Promise} The block's hash, its unique identifier
 */
rpc.getHeadHash = () => node.query('/chains/main/blocks/head/hash');

/**
 * @description Ballots casted so far during a voting period
 * @returns {Promise} Ballots casted so far during a voting period
 */
rpc.getBallotList = () => (
  node.query('/chains/main/blocks/head/votes/ballot_list')
);

/**
 * @description List of proposals with number of supporters
 * @returns {Promise} List of proposals with number of supporters
 */
rpc.getProposals = () => (
  node.query('/chains/main/blocks/head/votes/proposals')
);

/**
 * @description Sum of ballots casted so far during a voting period
 * @returns {Promise} Sum of ballots casted so far during a voting period
 */
rpc.getBallots = () => (
  node.query('/chains/main/blocks/head/votes/ballots')
);

/**
 * @description List of delegates with their voting weight, in number of rolls
 * @returns {Promise} The ballots of the current voting period
 */
rpc.getListings = () => (
  node.query('/chains/main/blocks/head/votes/listings')
);

/**
 * @description Current proposal under evaluation
 * @returns {Promise} Current proposal under evaluation
 */
rpc.getCurrentProposal = () => (
  node.query('/chains/main/blocks/head/votes/current_proposal')
);

/**
 * @description Current period kind
 * @returns {Promise} Current period kind
 */
rpc.getCurrentPeriod = () => (
  node.query('/chains/main/blocks/head/votes/current_period_kind')
);

/**
 * @description Current expected quorum
 * @returns {Promise} Current expected quorum
 */
rpc.getCurrentQuorum = () => (
  node.query('/chains/main/blocks/head/votes/current_quorum')
);

/**
 * @description Check for the inclusion of an operation in new blocks
 * @param {String} hash The operation hash to check
 * @param {Number} [interval=10] The interval to check new blocks
 * @param {Number} [timeout=180] The time before the operation times out
 * @returns {Promise} The hash of the block in which the operation was included
 */
rpc.awaitOperation = (hash, interval = 10, timeout = 180) => {
  if (timeout <= 0) {
    throw new Error('Timeout must be more than 0');
  }

  if (interval <= 0) {
    throw new Error('Interval must be more than 0');
  }

  const timeoutAt = Math.ceil(timeout / interval) + 1;
  let count = 0;
  let found = false;

  const operationCheck = (operation) => {
    if (operation.hash === hash) {
      found = true;
    }
  };

  return new Promise((resolve, reject) => {
    const repeater = () => (
      rpc.getHead()
        .then((head) => {
          count++;

          for (let i = 3; i >= 0; i--) {
            head.operations[i].forEach(operationCheck);
          }

          if (found) {
            resolve(head.hash);
          } else if (count >= timeoutAt) {
            reject(new Error('Timeout'));
          } else {
            setTimeout(repeater, interval);
          }
        })
    );

    repeater();
  });
};

/**
 * @description Get the current head block hash of the chain
 * @param {String} path The path to query
 * @param {Object} payload The payload of the request
 * @returns {Promise} The response of the rpc call
 */
rpc.call = (path, payload) => node.query(path, payload);

/**
 * @description Send an operation
 * @param {Object} paramObject The parameters for the operation
 * @param {String} paramObject.from The address sending the operation
 * @param {Object|Array} paramObject.operation The operation to include in the transaction
 * @param {Object|Boolean} [paramObject.keys=false] The keys for which to originate the account
 * @param {Boolean} [paramObject.skipPrevalidation=false] Skip prevalidation before injecting operation
 * @param {Object} [ledgerObject] The ledger parameters for the operation
 * @param {Boolean} [ledgerObject.useLedger=false] Whether to sign the transaction with a connected ledger device
 * @param {String} [ledgerObject.path=44'/1729'/0'/0'] The ledger path
 * @param {Number} [ledgerObject.curve=0x00] The value which defines the curve (0x00=tz1, 0x01=tz2, 0x02=tz3)
 * @returns {Promise} Object containing the injected operation hash
 */
rpc.prepareOperation = ({
  from,
  operation,
  keys = false,
}, {
  useLedger = false,
  path = "44'/1729'/0'/0'",
  curve = 0x00,
} = {}) => {
  let counter;
  let opOb;
  const promises = [];
  let requiresReveal = false;
  let ops = [];
  let head;

  promises.push(node.query('/chains/main/blocks/head/header'));

  if (Array.isArray(operation)) {
    ops = [...operation];
  } else {
    ops = [operation];
  }

  for (let i = 0; i < ops.length; i++) {
    if (['transaction', 'origination', 'delegation'].includes(ops[i].kind)) {
      requiresReveal = true;
      promises.push(rpc.getCounter(from));
      promises.push(rpc.getManager(from));
      break;
    }
  }

  return Promise.all(promises).then(async ([header, headCounter, manager]) => {
    head = header;
    if (requiresReveal && (keys || useLedger) && typeof manager.key === 'undefined') {
      let publicKey;

      if (useLedger) {
        const ledgerAddress = await ledger.getAddress({
          path,
          curve,
        });
        publicKey = ledgerAddress.publicKey; // eslint-disable-line
      }

      ops.unshift({
        kind: 'reveal',
        fee: node.isZeronet ? '100000' : '1269',
        public_key: publicKey || keys.pk,
        source: from,
        gas_limit: '10000',
        storage_limit: '0',
      });
    }

    counter = parseInt(headCounter, 10);
    if (!counters[from] || counters[from] < counter) {
      counters[from] = counter;
    }

    const constructOps = () => ops.map((op) => {
      if (['proposals', 'ballot', 'transaction', 'origination', 'delegation'].includes(op.kind)) {
        if (typeof op.source === 'undefined') op.source = from;
      }
      if (['reveal', 'transaction', 'origination', 'delegation'].includes(op.kind)) {
        if (typeof op.gas_limit === 'undefined') op.gas_limit = '0';
        if (typeof op.storage_limit === 'undefined') op.storage_limit = '0';
        op.counter = `${++counters[from]}`;
        op.fee = `${op.fee}`;
        op.gas_limit = `${op.gas_limit}`;
        op.storage_limit = `${op.storage_limit}`;
      }
      return JSON.stringify(op);
    }).map(op => JSON.parse(op));

    opOb = {
      branch: head.hash,
      contents: constructOps(),
    };

    const fullOp = await tezos.forge(head, opOb);
    return {
      ...fullOp,
      counter,
    };
  });
};

rpc.simulateOperation = ({
  from,
  operation,
  keys = false,
}, {
  useLedger = false,
  path = "44'/1729'/0'/0'",
  curve = 0x00,
} = {}) => (
  rpc.prepareOperation({
    from,
    operation,
    keys,
  }, {
    useLedger,
    path,
    curve,
  }).then(fullOp => (
    node.query('/chains/main/blocks/head/helpers/scripts/run_operation', fullOp.opOb)
  ))
);

rpc.sendOperation = async ({
  from,
  operation,
  keys = false,
  skipPrevalidation = false,
}, {
    useLedger = false,
    path = "44'/1729'/0'/0'",
    curve = 0x00,
  } = {}) => {
  const fullOp = await rpc.prepareOperation({
    from,
    operation,
    keys,
  }, {
    useLedger,
    path,
    curve,
  });

  if (useLedger) {
    const { signature } = await ledger.signOperation({
      path,
      rawTxHex: fullOp.opbytes,
      curve,
    });
    fullOp.opbytes += signature;
  } else if (keys.sk === false) {
    const { counter, ...rest } = fullOp;
    return rest;
  } else if (!keys) {
    fullOp.opbytes += '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
    fullOp.opOb.signature = 'edsigtXomBKi5CTRf5cjATJWSyaRvhfYNHqSUGrn4SdbYRcGwQrUGjzEfQDTuqHhuA8b2d8NarZjz8TRf65WkpQmo423BtomS8Q';
  } else {
    const signed = await crypto.sign(fullOp.opbytes, keys.sk, watermark.generic);
    fullOp.opbytes = signed.sbytes;
    fullOp.opOb.signature = signed.edsig;
  }

  if (skipPrevalidation || useLedger) {
    return rpc.silentInject(fullOp.opbytes)
      .catch((e) => {
        counters[from] = fullOp.counter;
        throw e;
      });
  }

  return rpc.inject(fullOp.opOb, fullOp.opbytes)
    .catch((e) => {
      counters[from] = fullOp.counter;
      throw e;
    });
};


/**
 * @description Inject an operation
 * @param {Object} opOb The operation object
 * @param {String} sopbytes The signed operation bytes
 * @returns {Promise} Object containing the injected operation hash
 */
rpc.inject = (opOb, sopbytes) => {
  const opResponse = [];
  let errors = [];

  return node.query('/chains/main/blocks/head/helpers/preapply/operations', [opOb])
    .then((f) => {
      if (!Array.isArray(f)) {
        throw new Error({ error: 'RPC Fail', errors: [] });
      }
      for (let i = 0; i < f.length; i++) {
        for (let j = 0; j < f[i].contents.length; j++) {
          opResponse.push(f[i].contents[j]);
          if (typeof f[i].contents[j].metadata.operation_result !== 'undefined' && f[i].contents[j].metadata.operation_result.status === 'failed') {
            errors = errors.concat(f[i].contents[j].metadata.operation_result.errors);
          }
        }
      }
      if (errors.length) {
        throw new Error({ error: 'Operation Failed', errors });
      }
      return node.query('/injection/operation', sopbytes);
    }).then(hash => ({
      hash,
      operations: opResponse,
    }));
};

/**
 * @description Inject an operation without prevalidation
 * @param {String} sopbytes The signed operation bytes
 * @returns {Promise} Object containing the injected operation hash
 */
rpc.silentInject = sopbytes => node.query('/injection/operation', sopbytes).then(hash => ({ hash }));

/**
 * @description Transfer operation
 * @param {Object} paramObject The parameters for the operation
 * @param {String} paramObject.from The address sending the operation
 * @param {Object} [paramObject.keys] The keys for which to originate the account. If using a ledger, this is optional
 * @param {String} paramObject.to The address of the recipient
 * @param {Number} paramObject.amount The amount in tez to transfer for the initial balance
 * @param {Number} [paramObject.fee=1278] The fee to set for the transaction
 * @param {String} [paramObject.parameter=false] The parameter for the transaction
 * @param {Number} [paramObject.gasLimit=10100] The gas limit to set for the transaction
 * @param {Number} [paramObject.storageLimit=0] The storage limit to set for the transaction
 * @param {Number} [paramObject.mutez=false] Whether the input amount is set to mutez (1/1,000,000 tez)
 * @param {Number} [paramObject.rawParam=false] Whether to accept the object parameter format
 * @param {Object} [ledgerObject] The ledger parameters for the operation
 * @param {Boolean} [ledgerObject.useLedger=false] Whether to sign the transaction with a connected ledger device
 * @param {String} [ledgerObject.path=44'/1729'/0'/0'] The ledger path
 * @param {Number} [ledgerObject.curve=0x00] The value which defines the curve (0x00=tz1, 0x01=tz2, 0x02=tz3)
 * @returns {Promise} Object containing the injected operation hash
 */
rpc.transfer = ({
  from,
  keys,
  to,
  amount,
  fee = DEFAULT_FEE,
  parameter = false,
  gasLimit = 10100,
  storageLimit = 0,
  mutez = false,
  rawParam = false,
}, {
  useLedger = false,
  path = "44'/1729'/0'/0'",
  curve = 0x00,
} = {}) => {
  const operation = {
    kind: 'transaction',
    fee: `${fee}`,
    gas_limit: `${gasLimit}`,
    storage_limit: `${storageLimit}`,
    amount: mutez ? `${utility.mutez(amount)}` : `${amount}`,
    destination: to,
  };
  if (parameter) {
    operation.parameters = rawParam ? parameter : utility.sexp2mic(parameter);
  }
  return rpc.sendOperation({ from, operation, keys }, { useLedger, path, curve });
};

/**
 * @description Activate an account
 * @param {Object} keys The keys containing the public key hash
 * @param {String} secret The secret to activate the account
 * @returns {Promise} Object containing the injected operation hash
 */
rpc.activate = (keys, secret) => {
  const operation = {
    kind: 'activate_account',
    pkh: keys.pkh,
    secret,
  };
  return rpc.sendOperation({ from: keys.pkh, operation, keys });
};

/**
 * @description Originate a new contract
 * @param {Object} paramObject The parameters for the operation
 * @param {Object} [paramObject.keys] The keys for which to originate the account. If using a ledger, this is optional
 * @param {Number} paramObject.amount The amount in tez to transfer for the initial balance
 * @param {String} paramObject.code The code to deploy for the contract
 * @param {String} paramObject.init The initial storage of the contract
 * @param {Boolean} [paramObject.spendable=false] Whether the keyholder can spend the balance from the new account
 * @param {Boolean} [paramObject.delegatable=false] Whether the new account is delegatable
 * @param {String} [paramObject.delegate] The delegate for the new account
 * @param {Number} [paramObject.fee=1278] The fee to set for the transaction
 * @param {Number} [paramObject.gasLimit=10000] The gas limit to set for the transaction
 * @param {Number} [paramObject.storageLimit=257] The storage limit to set for the transaction
 * @param {Object} [ledgerObject] The ledger parameters for the operation
 * @param {Boolean} [ledgerObject.useLedger=false] Whether to sign the transaction with a connected ledger device
 * @param {String} [ledgerObject.path=44'/1729'/0'/0'] The ledger path
 * @param {Number} [ledgerObject.curve=0x00] The value which defines the curve (0x00=tz1, 0x01=tz2, 0x02=tz3)
 * @returns {Promise} Object containing the injected operation hash
 */
rpc.originate = async ({
  keys,
  amount,
  code,
  init,
  spendable = false,
  delegatable = false,
  delegate,
  fee = DEFAULT_FEE,
  gasLimit = 10000,
  storageLimit = 257,
}, {
    useLedger = false,
    path = "44'/1729'/0'/0'",
    curve = 0x00,
  } = {}) => {
  const _code = utility.ml2mic(code);

  const script = {
    code: _code,
    storage: utility.sexp2mic(init),
  };

  let publicKeyHash = keys && keys.pkh;
  if (useLedger) {
    const { address } = await ledger.getAddress({
      path,
      curve,
    });
    publicKeyHash = address;
  }

  const operation = {
    kind: 'origination',
    fee: `${fee}`,
    gas_limit: `${gasLimit}`,
    storage_limit: `${storageLimit}`,
    balance: `${utility.mutez(amount)}`,
    spendable,
    delegatable,
    delegate: (typeof delegate !== 'undefined' && delegate ? delegate : publicKeyHash),
    script,
  };

  if (node.isZeronet) {
    operation.manager_pubkey = publicKeyHash;
  } else {
    operation.managerPubkey = publicKeyHash;
  }

  return rpc.sendOperation({ from: publicKeyHash, operation, keys }, { useLedger, path, curve });
};

/**
 * @description Set a delegate for an account
 * @param {Object} paramObject The parameters for the operation
 * @param {String} paramObject.from The address sending the operation
 * @param {Object} [paramObject.keys] The keys for which to originate the account. If using a ledger, this is optional
 * @param {String} [paramObject.delegate] The delegate for the new account
 * @param {Number} [paramObject.fee=1278] The fee to set for the transaction
 * @param {Number} [paramObject.gasLimit=10000] The gas limit to set for the transaction
 * @param {Number} [paramObject.storageLimit=0] The storage limit to set for the transaction
 * @param {Object} [ledgerObject] The ledger parameters for the operation
 * @param {Boolean} [ledgerObject.useLedger=false] Whether to sign the transaction with a connected ledger device
 * @param {String} [ledgerObject.path=44'/1729'/0'/0'] The ledger path
 * @param {Number} [ledgerObject.curve=0x00] The value which defines the curve (0x00=tz1, 0x01=tz2, 0x02=tz3)
 * @returns {Promise} Object containing the injected operation hash
 */
rpc.setDelegate = async ({
  from,
  keys,
  delegate,
  fee = DEFAULT_FEE,
  gasLimit = 10000,
  storageLimit = 0,
}, {
    useLedger = false,
    path = "44'/1729'/0'/0'",
    curve = 0x00,
  } = {}) => {
  let publicKeyHash = keys && keys.pkh;

  if (useLedger) {
    const { address } = await ledger.getAddress({
      path,
      curve,
    });
    publicKeyHash = address;
  }

  const operation = {
    kind: 'delegation',
    fee: `${fee}`,
    gas_limit: `${gasLimit}`,
    storage_limit: `${storageLimit}`,
    delegate: (typeof delegate !== 'undefined' ? delegate : publicKeyHash),
  };
  return rpc.sendOperation({ from, operation, keys }, { useLedger, path, curve });
};

/**
 * @description Register an account as a delegate
 * @param {Object} paramObject The parameters for the operation
 * @param {Object} [paramObject.keys] The keys for which to originate the account. If using a ledger, this is optional
 * @param {Number} [paramObject.fee=1278] The fee to set for the transaction
 * @param {Number} [paramObject.gasLimit=10000] The gas limit to set for the transaction
 * @param {Number} [paramObject.storageLimit=0] The storage limit to set for the transaction
 * @param {Object} [ledgerObject] The ledger parameters for the operation
 * @param {Boolean} [ledgerObject.useLedger=false] Whether to sign the transaction with a connected ledger device
 * @param {String} [ledgerObject.path=44'/1729'/0'/0'] The ledger path
 * @param {Number} [ledgerObject.curve=0x00] The value which defines the curve (0x00=tz1, 0x01=tz2, 0x02=tz3)
 * @returns {Promise} Object containing the injected operation hash
 */
rpc.registerDelegate = async ({
  keys,
  fee = DEFAULT_FEE,
  gasLimit = 10000,
  storageLimit = 0,
}, {
    useLedger = false,
    path = "44'/1729'/0'/0'",
    curve = 0x00,
  } = {}) => {
  let publicKeyHash = keys && keys.pkh;

  if (useLedger) {
    const { address } = await ledger.getAddress({
      path,
      curve,
    });
    publicKeyHash = address;
  }

  const operation = {
    kind: 'delegation',
    fee: `${fee}`,
    gas_limit: `${gasLimit}`,
    storage_limit: `${storageLimit}`,
    delegate: `${publicKeyHash}`,
  };
  return rpc.sendOperation({ from: publicKeyHash, operation, keys }, { useLedger, path, curve });
};

/**
 * @description Typechecks the provided code
 * @param {String} code The code to typecheck
 * @returns {Promise} Typecheck result
 */
rpc.typecheckCode = (code) => {
  const _code = utility.ml2mic(code);
  return node.query('/chains/main/blocks/head/helpers/scripts/typecheck_code', { program: _code, gas: '10000' });
};

/**
 * @description Serializes a piece of data to a binary representation
 * @param {String} data
 * @param {String} type
 * @returns {Promise} Serialized data
 */
rpc.packData = (data, type) => {
  const check = {
    data: utility.sexp2mic(data),
    type: utility.sexp2mic(type),
    gas: '4000000',
  };
  return node.query('/chains/main/blocks/head/helpers/scripts/pack_data', check);
};

/**
 * @description Typechecks data against a type
 * @param {String} data
 * @param {String} type
 * @returns {Promise} Typecheck result
 */
rpc.typecheckData = (data, type) => {
  const check = {
    data: utility.sexp2mic(data),
    type: utility.sexp2mic(type),
    gas: '4000000',
  };
  return node.query('/chains/main/blocks/head/helpers/scripts/typecheck_data', check);
};

/**
 * @description Runs or traces code against an input and storage
 * @param {String} code Code to run
 * @param {Number} amount Amount to send
 * @param {String} input Input to run though code
 * @param {String} storage State of storage
 * @param {Boolean} [trace=false] Whether to trace
 * @returns {Promise} Run results
 */
rpc.runCode = (code, amount, input, storage, trace = false) => {
  const ep = trace ? 'trace_code' : 'run_code';
  return node.query(`/chains/main/blocks/head/helpers/scripts/${ep}`, {
    script: utility.ml2mic(code),
    amount: `${utility.mutez(amount)}`,
    input: utility.sexp2mic(input),
    storage: utility.sexp2mic(storage),
  });
};

const contract = {};
contract.hash = async (operationHash, ind) => {
  await _sodium.ready;
  const sodium = _sodium;
  const ob = utility.b58cdecode(operationHash, prefix.o);
  let tt = [];
  for (let i = 0; i < ob.length; i++) {
    tt.push(ob[i]);
  }
  tt = tt.concat([
    (ind & 0xff000000) >> 24,
    (ind & 0x00ff0000) >> 16,
    (ind & 0x0000ff00) >> 8,
    (ind & 0x000000ff),
  ]);
  return utility.b58cencode(sodium.crypto_generichash(20, new Uint8Array(tt)), prefix.KT);
};

/**
 * @description Originate a new contract
 * @param {Object} paramObject The parameters for the operation
 * @param {Object} [paramObject.keys] The keys for which to originate the account. If using a ledger, this is optional
 * @param {Number} paramObject.amount The amount in tez to transfer for the initial balance
 * @param {String} paramObject.code The code to deploy for the contract
 * @param {String} paramObject.init The initial storage of the contract
 * @param {Boolean} [paramObject.spendable=false] Whether the keyholder can spend the balance from the new account
 * @param {Boolean} [paramObject.delegatable=false] Whether the new account is delegatable
 * @param {String} [paramObject.delegate] The delegate for the new account
 * @param {Number} [paramObject.fee=1278] The fee to set for the transaction
 * @param {Number} [paramObject.gasLimit=10000] The gas limit to set for the transaction
 * @param {Number} [paramObject.storageLimit=10000] The storage limit to set for the transaction
 * @param {Object} [ledgerObject] The ledger parameters for the operation
 * @param {Boolean} [ledgerObject.useLedger=false] Whether to sign the transaction with a connected ledger device
 * @param {String} [ledgerObject.path=44'/1729'/0'/0'] The ledger path
 * @param {Number} [ledgerObject.curve=0x00] The value which defines the curve (0x00=tz1, 0x01=tz2, 0x02=tz3)
 * @returns {Promise} Object containing the injected operation hash
 */
contract.originate = ({
  keys,
  amount,
  code,
  init,
  spendable,
  delegatable,
  delegate,
  fee = DEFAULT_FEE,
  gasLimit = 10000,
  storageLimit = 10000,
}, {
  useLedger = false,
  path = "44'/1729'/0'/0'",
  curve = 0x00,
} = {}) => (
  rpc.originate({
    keys,
    amount,
    code,
    init,
    spendable,
    delegatable,
    delegate,
    fee,
    gasLimit,
    storageLimit,
  }, { useLedger, path, curve })
);

/**
 * @description Get the current storage of a contract
 * @param {String} contractAddress The address of the contract
 * @returns {Promise} The storage of the contract
 */
contract.storage = contractAddress => (
  new Promise((resolve, reject) => (
    node.query(`/chains/main/blocks/head/context/contracts/${contractAddress}/storage`)
      .then(r => resolve(r))
      .catch(e => reject(e))
  ))
);

/**
 * @description Get the contract at a given address
 * @param {String} contractAddress The address of the contract
 * @returns {Promise} The contract
 */
contract.load = contractAddress => node.query(`/chains/main/blocks/head/context/contracts/${contractAddress}`);

/**
 * @description Watch a contract's storage based on a given interval
 * @param {String} contractAddress The address of the contract
 * @param {Number} timeout The interval between checks in milliseconds
 * @param {requestCallback} callback The callback to fire when a change is detected
 * @returns {Object} The setInterval object
 */
contract.watch = (contractAddress, timeout, callback) => {
  let storage = [];
  const storageCheck = () => {
    contract.storage(contractAddress).then((response) => {
      if (JSON.stringify(storage) !== JSON.stringify(response)) {
        storage = response;
        callback(storage);
      }
    });
  };
  storageCheck();
  return setInterval(storageCheck, timeout * 1000);
};

/**
 * @description Send to contract
 * @param {Object} paramObject The parameters for the operation
 * @param {String} paramObject.to The address of the recipient
 * @param {Object} paramObject.from The address sending the operation
 * @param {Object} [paramObject.keys] The keys for which to originate the account. If using a ledger, this is optional
 * @param {Number} paramObject.amount The amount in tez to transfer for the initial balance
 * @param {String} paramObject.parameter The parameter for the transaction
 * @param {Number} [paramObject.fee=1278] The fee to set for the transaction
 * @param {Number} [paramObject.gasLimit=400000] The gas limit to set for the transaction
 * @param {Number} [paramObject.storageLimit=60000] The storage limit to set for the transaction
 * @param {Number} [paramObject.mutez=false] Whether the input amount is set to mutez (1/1,000,000 tez)
 * @param {Number} [paramObject.rawParam=false] Whether to accept the object parameter format
 * @param {Object} [ledgerObject] The ledger parameters for the operation
 * @param {Boolean} [ledgerObject.useLedger=false] Whether to sign the transaction with a connected ledger device
 * @param {String} [ledgerObject.path=44'/1729'/0'/0'] The ledger path
 * @param {Number} [ledgerObject.curve=0x00] The value which defines the curve (0x00=tz1, 0x01=tz2, 0x02=tz3)
 * @returns {Promise} Object containing the injected operation hash
 */
contract.send = ({
  to,
  from,
  keys,
  amount,
  parameter,
  fee = DEFAULT_FEE,
  gasLimit = 400000,
  storageLimit = 60000,
  mutez = false,
  rawParam = false,
}, {
  useLedger = false,
  path = "44'/1729'/0'/0'",
  curve = 0x00,
} = {}) => (
  rpc.transfer({
    from,
    keys,
    to,
    amount,
    fee,
    parameter,
    gasLimit,
    storageLimit,
    mutez,
    rawParam,
  }, { useLedger, path, curve })
);

// Legacy commands
utility.ml2tzjson = utility.sexp2mic;
utility.tzjson2arr = utility.mic2arr;
utility.mlraw2json = utility.ml2mic;
utility.mintotz = utility.totez;
utility.tztomin = utility.mutez;
prefix.TZ = new Uint8Array([2, 90, 121]);

// Expose library
module.exports = {
  DEFAULT_PROVIDER,
  utility,
  crypto,
  node,
  rpc,
  contract,
  ledger,
  tezos,
  forge,
};
