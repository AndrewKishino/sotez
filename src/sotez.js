const XMLHttpRequest = XMLHttpRequest || require('xhr2');
const Buffer = Buffer || require('buffer/').Buffer;

const bs58check = require('bs58check');
const sodium = require('libsodium-wrappers');
const bip39 = require('bip39');
const pbkdf2 = require('pbkdf2');
const BN = require('bignumber.js');
const isNode = require('detect-node');

if (isNode) {
  global.__non_webpack_require__ = require;
}

const LedgerTransport = isNode
  ? __non_webpack_require__('@ledgerhq/hw-transport-node-hid').default // eslint-disable-line
  : require('@ledgerhq/hw-transport-u2f').default;
const LedgerApp = require('./hw-app-xtz/lib/Tezos').default;

const DEFAULT_PROVIDER = 'http://127.0.0.1:8732';
const DEFAULT_FEE = '1278';
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
utility.b582int = (v) => {
  let rv = new BN(0);
  const alpha = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  for (let i = 0; i < v.length; i++) {
    rv = rv.plus(new BN(alpha.indexOf(v[v.length - 1 - i]).multipliedBy(new BN(alpha.length).exponentiatedBy(i))));
  }
  return rv.toString(16);
};

utility.totez = m => parseInt(m, 10) / 1000000;

utility.mutez = tz => new BN(new BN(tz).toFixed(6)).multipliedBy(1000000).toString();

utility.b58cencode = (payload, prefixArg) => {
  const n = new Uint8Array(prefixArg.length + payload.length);
  n.set(prefixArg);
  n.set(payload, prefixArg.length);
  return bs58check.encode(Buffer.from(n, 'hex'));
};

utility.b58cdecode = (enc, prefixArg) => bs58check.decode(enc).slice(prefixArg.length);

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

utility.hex2buf = hex => new Uint8Array(hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));

utility.hexNonce = (length) => {
  const chars = '0123456789abcedf';
  let hex = '';
  while (length--) {
    hex += chars[(Math.random() * 16) | 0];
  }
  return hex;
};

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
crypto.extractKeys = (sk) => { // eslint-disable-line
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

crypto.generateMnemoic = () => bip39.generateMnemonic(160);

crypto.checkAddress = (a) => {
  try {
    utility.b58cdecode(a, prefix.tz1);
    return true;
  } catch (e) {
    return false;
  }
};

crypto.generateKeysNoSeed = () => {
  const kp = sodium.crypto_sign_keypair();
  return {
    sk: utility.b58cencode(kp.privateKey, prefix.edsk),
    pk: utility.b58cencode(kp.publicKey, prefix.edpk),
    pkh: utility.b58cencode(sodium.crypto_generichash(20, kp.publicKey), prefix.tz1),
  };
};

crypto.generateKeys = (m, p) => {
  const s = bip39.mnemonicToSeed(m, p).slice(0, 32);
  const kp = sodium.crypto_sign_seed_keypair(s);
  return {
    mnemonic: m,
    passphrase: p,
    sk: utility.b58cencode(kp.privateKey, prefix.edsk),
    pk: utility.b58cencode(kp.publicKey, prefix.edpk),
    pkh: utility.b58cencode(sodium.crypto_generichash(20, kp.publicKey), prefix.tz1),
  };
};

crypto.generateKeysFromSeedMulti = (m, p, n) => {
  n /= (256 ^ 2);
  const s = bip39.mnemonicToSeed(m, pbkdf2.pbkdf2Sync(p, n.toString(36).slice(2), 0, 32, 'sha512').toString()).slice(0, 32);
  const kp = sodium.crypto_sign_seed_keypair(s);
  return {
    mnemonic: m,
    passphrase: p,
    n,
    sk: utility.b58cencode(kp.privateKey, prefix.edsk),
    pk: utility.b58cencode(kp.publicKey, prefix.edpk),
    pkh: utility.b58cencode(sodium.crypto_generichash(20, kp.publicKey), prefix.tz1),
  };
};

crypto.sign = (bytes, sk, wm) => {
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

crypto.verify = (bytes, sig, pk) => (
  sodium.crypto_sign_verify_detached(sig, utility.hex2buf(bytes), utility.b58cdecode(pk, prefix.edpk))
);

const node = {
  activeProvider: DEFAULT_PROVIDER,
  debugMode: false,
  async: true,
  isZeronet: false,
};

node.setDebugMode = (t) => {
  node.debugMode = t;
};

node.setProvider = (u, z) => {
  if (typeof z !== 'undefined') node.isZeronet = z;
  node.activeProvider = u;
};

node.resetProvider = () => {
  node.activeProvider = DEFAULT_PROVIDER;
};

node.query = (e, o, t) => {
  if (typeof o === 'undefined') {
    if (typeof t === 'undefined') {
      t = 'GET';
    } else {
      o = {};
    }
  } else if (typeof t === 'undefined') {
    t = 'POST';
  }
  return new Promise((resolve, reject) => {
    try {
      const http = new XMLHttpRequest();
      http.open(t, node.activeProvider + e, node.async);
      http.onload = () => {
        if (node.debugMode) {
          console.log(e, o, http.responseText);
        }
        if (http.status === 200) {
          if (http.responseText) {
            let r = JSON.parse(http.responseText);
            if (typeof r.error !== 'undefined') {
              reject(r.error);
            } else {
              if (typeof r.ok !== 'undefined') r = r.ok;
              resolve(r);
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
      if (t === 'POST') {
        http.setRequestHeader('Content-Type', 'application/json');
        http.send(JSON.stringify(o));
      } else {
        http.send();
      }
    } catch (err) {
      reject(err);
    }
  });
};

const ledger = {
  getAddress: async ({
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
  },
  signOperation: async ({
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
  },
  getVersion: async () => {
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
  },
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
  /* eslint-enable */
  opMappingReverse: {
    SHA512: '10',
    ABS: '11',
    ADD: '12',
    AMOUNT: '13',
    AND: '14',
    BALANCE: '15',
    CAR: '16',
    CDR: '17',
    CHECK_SIGNATURE: '18',
    COMPARE: '19',
    DROP: '20',
    DUP: '21',
    EDIV: '22',
    EMPTY_MAP: '23',
    EMPTY_SET: '24',
    EQ: '25',
    EXEC: '26',
    FAILWITH: '27',
    GE: '28',
    GET: '29',
    INT: '30',
    LAMBDA: '31',
    LE: '32',
    LEFT: '33',
    LOOP: '34',
    LSL: '35',
    LSR: '36',
    LT: '37',
    MAP: '38',
    MEM: '39',
    NOW: '40',
    OR: '41',
    PAIR: '42',
    PUSH: '43',
    RIGHT: '44',
    SIZE: '45',
    SOME: '46',
    SOURCE: '47',
    SENDER: '48',
    SELF: '49',
    UPDATE: '50',
    XOR: '51',
    ITER: '52',
    LOOP_LEFT: '53',
    ADDRESS: '54',
    CONTRACT: '55',
    ISNAT: '56',
    CAST: '57',
    RENAME: '58',
    bool: '59',
    map: '60',
    big_map: '61',
    nat: '62',
    option: '63',
    or: '64',
    pair: '65',
    set: '66',
    signature: '67',
    string: '68',
    bytes: '69',
    parameter: '00',
    storage: '01',
    code: '02',
    False: '03',
    Elt: '04',
    Left: '05',
    None: '06',
    Pair: '07',
    Right: '08',
    Some: '09',
    True: '0A',
    Unit: '0B',
    PACK: '0C',
    UNPACK: '0D',
    BLAKE2B: '0E',
    SHA256: '0F',
    CONCAT: '1A',
    CONS: '1B',
    CREATE_ACCOUNT: '1C',
    CREATE_CONTRACT: '1D',
    IMPLICIT_ACCOUNT: '1E',
    DIP: '1F',
    GT: '2A',
    HASH_KEY: '2B',
    IF: '2C',
    IF_CONS: '2D',
    IF_LEFT: '2E',
    IF_NONE: '2F',
    MUL: '3A',
    NEG: '3B',
    NEQ: '3C',
    NIL: '3D',
    NONE: '3E',
    NOT: '3F',
    STEPS_TO_QUOTA: '4A',
    SUB: '4B',
    SWAP: '4C',
    TRANSFER_TOKENS: '4D',
    SET_DELEGATE: '4E',
    UNIT: '4F',
    contract: '5A',
    int: '5B',
    key: '5C',
    key_hash: '5D',
    lambda: '5E',
    list: '5F',
    mutez: '6A',
    timestamp: '6B',
    unit: '6C',
    operation: '6D',
    address: '6E',
    SLICE: '6F',
  },
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

forge.toBytesInt32Hex = num => utility.buf2hex(forge.toBytesInt32(num));

forge.bool = b => (b ? 'ff' : '00');

forge.script = (s) => {
  const t1 = tezos.encodeRawBytes(s.code).toLowerCase();
  const t2 = tezos.encodeRawBytes(s.storage).toLowerCase();
  return forge.toBytesInt32Hex(t1.length / 2) + t1 + forge.toBytesInt32Hex(t2.length / 2) + t2;
};

forge.parameters = (p) => {
  const t = tezos.encodeRawBytes(p).toLowerCase();
  return forge.toBytesInt32Hex(t.length / 2) + t;
};

forge.publicKeyHash = (pkh) => {
  let fpkh;
  const t = parseInt(pkh.substr(2, 1), 10);
  fpkh = `0${(t - 1).toString()}`;
  fpkh += utility.buf2hex(utility.b58cdecode(pkh, prefix[pkh.substr(0, 3)]));
  return fpkh;
};

forge.address = (a) => {
  let fa;
  if (a.substr(0, 1) === 'K') {
    fa = '01';
    fa += utility.buf2hex(utility.b58cdecode(a, prefix.KT));
    fa += '00';
  } else {
    fa = '00';
    fa += forge.publicKeyHash(a);
  }
  return fa;
};

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

forge.publicKey = (pk) => {
  let fpk;
  // let t;
  switch (pk.substr(0, 2)) {
    case 'ed': fpk = '00'; break;
    case 'sp': fpk = '01'; break;
    case 'p2': fpk = '02'; break;
    default: break;
  }
  fpk += utility.buf2hex(utility.b58cdecode(pk, prefix[pk.substr(0, 4)]));
  return fpk;
};

/* eslint-disable */
forge.op = (op) => {
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
};
/* eslint-enable */

const tezos = {};
tezos.forge = async (head, opOb, debug = false) => {
  let remoteForgedBytes;

  if (debug) {
    remoteForgedBytes = await node.query(`/chains/${head.chain_id}/blocks/${head.hash}/helpers/forge/operations`, opOb);
  }

  let localForgedBytes = utility.buf2hex(utility.b58cdecode(opOb.branch, prefix.b));
  opOb.contents.forEach((content) => {
    localForgedBytes += forge.op(content);
  });

  if (debug) {
    console.log('FORGE VALIDATION TEST START');
    console.log(opOb);
    console.log(remoteForgedBytes);
    console.log(localForgedBytes);
    console.log('FORGE VALIDATION TEST END');
    if (localForgedBytes === remoteForgedBytes) {
      return remoteForgedBytes;
    }
    throw new Error('Forge validatione error - local and remote bytes don\'t match');
  }

  return localForgedBytes;
};

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

      const num = new BN(validBytes.reverse().join(''), 2);
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
          const annotsBytes = inputArg.annots.map(x => utility.buf2hex(new TextEncoder().encode(x))).join('20');
          result.push((annotsBytes.length / 2).toString(16).padStart(8, '0'));
          result.push(annotsBytes);
        }
      } else if (inputArg.bytes) {
        const len = inputArg.bytes.length / 2;
        result.push('0A');
        result.push(len.toString(16).padStart(8, '0'));
        result.push(inputArg.bytes);
      } else if (inputArg.int) {
        const num = new BN(inputArg.int, 10);
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
        ).join(''));

        result.push('00');
        result.push(numHex);
      } else if (inputArg.string) {
        const stringBytes = new TextEncoder().encode(inputArg.string);
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
rpc.account = async ({
  keys,
  amount,
  spendable,
  delegatable,
  delegate,
  fee = DEFAULT_FEE,
  gasLimit = '10000',
  storageLimit = '257',
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
    gas_limit: gasLimit,
    storage_limit: storageLimit,
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

rpc.getBalance = tz1 => (
  node.query(`/chains/main/blocks/head/context/contracts/${tz1}/balance`)
    .then(r => r)
);

rpc.getDelegate = tz1 => (
  node.query(`/chains/main/blocks/head/context/contracts/${tz1}/delegate`)
    .then((r) => {
      if (r) { return r; }
      return false;
    }).catch(() => false)
);

rpc.getHead = () => node.query('/chains/main/blocks/head');
rpc.getHeadHash = () => node.query('/chains/main/blocks/head/hash');
rpc.call = (e, d) => node.query(e, d);
rpc.sendOperation = ({
  from,
  operation,
  keys = false,
  skipPrevalidation = false,
}, {
  useLedger = false,
  path = "44'/1729'/0'/0'",
  curve = 0x00,
} = {}) => {
  let counter;
  let sopbytes;
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
      promises.push(node.query(`/chains/main/blocks/head/context/contracts/${from}/counter`));
      promises.push(node.query(`/chains/main/blocks/head/context/contracts/${from}/manager_key`));
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

    return tezos.forge(head, opOb);
  })
    .then(async (opbytes) => {
      if (useLedger) {
        const { signature } = await ledger.signOperation({
          path,
          rawTxHex: opbytes,
          curve,
        });

        sopbytes = `${opbytes}${signature}`;
      } else if (keys.sk === false) {
        opOb.protocol = head.protocol;
        return {
          opOb,
          opbytes,
        };
      } else if (!keys) {
        sopbytes = `${opbytes}00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000`;
        opOb.signature = 'edsigtXomBKi5CTRf5cjATJWSyaRvhfYNHqSUGrn4SdbYRcGwQrUGjzEfQDTuqHhuA8b2d8NarZjz8TRf65WkpQmo423BtomS8Q';
      } else {
        const signed = crypto.sign(opbytes, keys.sk, watermark.generic);
        sopbytes = signed.sbytes;
        opOb.signature = signed.edsig;
      }

      opOb.protocol = head.protocol;
      if (skipPrevalidation || useLedger) {
        return rpc.silentInject(sopbytes)
          .catch((e) => {
            counters[from] = counter;
            throw e;
          });
      }
      return rpc.inject(opOb, sopbytes)
        .catch((e) => {
          counters[from] = counter;
          throw e;
        });
    });
};

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

rpc.silentInject = sopbytes => node.query('/injection/operation', sopbytes).then(hash => ({ hash }));
rpc.transfer = ({
  from,
  keys,
  to,
  amount,
  fee = DEFAULT_FEE,
  parameter = false,
  gasLimit = '10100',
  storageLimit = '0',
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
    gas_limit: gasLimit,
    storage_limit: storageLimit,
    amount: mutez ? amount : `${utility.mutez(amount)}`,
    destination: to,
  };
  if (parameter) {
    operation.parameters = rawParam ? parameter : utility.sexp2mic(parameter);
  }
  return rpc.sendOperation({ from, operation, keys }, { useLedger, path, curve });
};

rpc.activate = (keys, secret) => {
  const operation = {
    kind: 'activate_account',
    pkh: keys.pkh,
    secret,
  };
  return rpc.sendOperation({ from: keys.pkh, operation, keys });
};

rpc.originate = async ({
  keys,
  amount,
  code,
  init,
  spendable = false,
  delegatable = false,
  delegate,
  fee = DEFAULT_FEE,
  gasLimit = '10000',
  storageLimit = '257',
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
    storage_limit: storageLimit,
    gas_limit: gasLimit,
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

rpc.setDelegate = async ({
  from,
  keys,
  delegate,
  fee = DEFAULT_FEE,
  gasLimit = '10000',
  storageLimit = '0',
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
    gas_limit: gasLimit,
    storage_limit: storageLimit,
    delegate: (typeof delegate !== 'undefined' ? delegate : publicKeyHash),
  };
  return rpc.sendOperation({ from, operation, keys }, { useLedger, path, curve });
};

rpc.registerDelegate = async ({
  keys,
  fee = DEFAULT_FEE,
  gasLimit = '10000',
  storageLimit = '0',
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
    gas_limit: gasLimit,
    storage_limit: storageLimit,
    delegate: publicKeyHash,
  };
  return rpc.sendOperation({ from: publicKeyHash, operation, keys }, { useLedger, path, curve });
};

rpc.typecheckCode = (code) => {
  const _code = utility.ml2mic(code);
  return node.query('/chains/main/blocks/head/helpers/scripts/typecheck_code', { program: _code, gas: '10000' });
};

rpc.packData = (data, type) => {
  const check = {
    data: utility.sexp2mic(data),
    type: utility.sexp2mic(type),
    gas: '4000000',
  };
  return node.query('/chains/main/blocks/head/helpers/scripts/pack_data', check);
};

rpc.typecheckData = (data, type) => {
  const check = {
    data: utility.sexp2mic(data),
    type: utility.sexp2mic(type),
    gas: '4000000',
  };
  return node.query('/chains/main/blocks/head/helpers/scripts/typecheck_data', check);
};

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
contract.hash = (operationHash, ind) => {
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

contract.originate = ({
  keys,
  amount,
  code,
  init,
  spendable,
  delegatable,
  delegate,
  fee = DEFAULT_FEE,
  gasLimit = '10000',
  storageLimit = '10000',
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

contract.storage = contractAddress => (
  new Promise((resolve, reject) => (
    node.query(`/chains/main/blocks/head/context/contracts/${contractAddress}/storage`)
      .then(r => resolve(r))
      .catch(e => reject(e))
  ))
);

contract.load = contractAddress => node.query(`/chains/main/blocks/head/context/contracts/${contractAddress}`);
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

contract.send = ({
  to,
  from,
  keys,
  amount,
  parameter,
  fee = DEFAULT_FEE,
  gasLimit = '2000',
  storageLimit = '0',
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
const sotez = {
  utility,
  crypto,
  node,
  rpc,
  contract,
  ledger,
  tezos,
};

module.exports = sotez;
