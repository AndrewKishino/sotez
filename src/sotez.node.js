const XMLHttpRequest = require('xhr2');
const bs58check = require('bs58check');
const sodium = require('libsodium-wrappers');
const bip39 = require('bip39');
const pbkdf2 = require('pbkdf2');
const BN = require('bignumber.js');

const DEFAULT_PROVIDER = 'https://rpc.mytezoswallet.com';
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

const utility = {
  b582int: (v) => {
    let rv = new BN(0);
    const alpha = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    for (let i = 0; i < v.length; i++) {
      rv = rv.plus(new BN(alpha.indexOf(v[v.length - 1 - i]).multipliedBy(new BN(alpha.length).exponentiatedBy(i))));
    }
    return rv.toString(16);
  },
  totez: m => parseInt(m, 10) / 1000000,
  mutez: tz => new BN(new BN(tz).toFixed(6)).multipliedBy(1000000).toString(),
  b58cencode: (payload, prefixArg) => {
    const n = new Uint8Array(prefixArg.length + payload.length);
    n.set(prefixArg);
    n.set(payload, prefixArg.length);
    return bs58check.encode(Buffer.from(n, 'hex'));
  },
  b58cdecode: (enc, prefixArg) => bs58check.decode(enc).slice(prefixArg.length),
  buf2hex: (buffer) => {
    const byteArray = new Uint8Array(buffer);
    const hexParts = [];
    byteArray.forEach((byte) => {
      const hex = byte.toString(16);
      const paddedHex = (`00${hex}`).slice(-2);
      hexParts.push(paddedHex);
    });
    return hexParts.join('');
  },
  hex2buf: hex => new Uint8Array(hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16))),
  hexNonce: (length) => {
    const chars = '0123456789abcedf';
    let hex = '';
    while (length--) {
      hex += chars[(Math.random() * 16) | 0];
    }
    return hex;
  },
  mergebuf: (b1, b2) => {
    const r = new Uint8Array(b1.length + b2.length);
    r.set(b1);
    r.set(b2, b1.length);
    return r;
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
  },
  mic2arr: function me2(s) {
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
  },
  formatMoney: (n, c, d, t) => {
    const cc = isNaN(c = Math.abs(c)) ? 2 : c; // eslint-disable-line
    const dd = d === undefined ? '.' : d;
    const tt = t === undefined ? ',' : t;
    const s = n < 0 ? '-' : '';
    const i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(cc), 10));
    const j = i.length > 3 ? i.length % 3 : 0;
    return s + (j ? i.substr(0, j) + tt : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${tt}`) + (cc ? dd + Math.abs(n - i).toFixed(c).slice(2) : '');
  },
};

// TODO: Add p256 and secp256k1 cryptographay
const crypto = {
  extractKeys: (sk) => { // eslint-disable-line
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
  },
  generateMnemonic: () => bip39.generateMnemonic(160),
  checkAddress: (a) => {
    try {
      utility.b58cdecode(a, prefix.tz1);
      return true;
    } catch (e) {
      return false;
    }
  },
  generateKeysNoSeed: () => {
    const kp = sodium.crypto_sign_keypair();
    return {
      sk: utility.b58cencode(kp.privateKey, prefix.edsk),
      pk: utility.b58cencode(kp.publicKey, prefix.edpk),
      pkh: utility.b58cencode(sodium.crypto_generichash(20, kp.publicKey), prefix.tz1),
    };
  },
  generateKeys: (m, p) => {
    const s = bip39.mnemonicToSeed(m, p).slice(0, 32);
    const kp = sodium.crypto_sign_seed_keypair(s);
    return {
      mnemonic: m,
      passphrase: p,
      sk: utility.b58cencode(kp.privateKey, prefix.edsk),
      pk: utility.b58cencode(kp.publicKey, prefix.edpk),
      pkh: utility.b58cencode(sodium.crypto_generichash(20, kp.publicKey), prefix.tz1),
    };
  },
  generateKeysFromSeedMulti: (m, p, n) => {
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
  },
  sign: (bytes, sk, wm) => {
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
  },
  verify: (bytes, sig, pk) => (
    sodium.crypto_sign_verify_detached(sig, utility.hex2buf(bytes), utility.b58cdecode(pk, prefix.edpk))
  ),
};

const node = {
  activeProvider: DEFAULT_PROVIDER,
  debugMode: false,
  async: true,
  isZeronet: false,
  setDebugMode: (t) => {
    node.debugMode = t;
  },
  setProvider: (u, z) => {
    if (typeof z !== 'undefined') node.isZeronet = z;
    node.activeProvider = u;
  },
  resetProvider: () => {
    node.activeProvider = DEFAULT_PROVIDER;
  },
  query: (e, o, t) => {
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
  },
};

const rpc = {
  account: ({
    keys,
    amount,
    spendable,
    delegatable,
    delegate,
    fee = DEFAULT_FEE,
    gasLimit = '10000',
    storageLimit = '257',
  }) => {
    const operation = {
      kind: 'origination',
      balance: `${utility.mutez(amount)}`,
      fee: `${fee}`,
      gas_limit: gasLimit,
      storage_limit: storageLimit,
    };

    if (node.isZeronet) {
      operation.manager_pubkey = keys.pkh;
    } else {
      operation.managerPubkey = keys.pkh;
    }

    if (typeof spendable !== 'undefined') operation.spendable = spendable;
    if (typeof delegatable !== 'undefined') operation.delegatable = delegatable;
    if (typeof delegate !== 'undefined' && delegate) operation.delegate = delegate;
    return rpc.sendOperation(keys.pkh, operation, keys);
  },
  getBalance: tz1 => (
    node.query(`/chains/main/blocks/head/context/contracts/${tz1}/balance`)
      .then(r => r)
  ),
  getDelegate: tz1 => (
    node.query(`/chains/main/blocks/head/context/contracts/${tz1}/delegate`)
      .then((r) => {
        if (r) { return r; }
        return false;
      }).catch(() => false)
  ),
  getHead: () => node.query('/chains/main/blocks/head'),
  getHeadHash: () => node.query('/chains/main/blocks/head/hash'),
  call: (e, d) => node.query(e, d),
  sendOperation: (from, operation, keys = false, skipPrevalidation = false) => {
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
      if (['transaction', 'origination', 'delegation'].indexOf(ops[i].kind) >= 0) {
        requiresReveal = true;
        promises.push(node.query(`/chains/main/blocks/head/context/contracts/${from}/counter`));
        promises.push(node.query(`/chains/main/blocks/head/context/contracts/${from}/manager_key`));
        break;
      }
    }

    return Promise.all(promises).then(([header, headCounter, manager]) => {
      head = header;
      if (requiresReveal && keys && typeof manager.key === 'undefined') {
        ops.unshift({
          kind: 'reveal',
          fee: node.isZeronet ? '100000' : '1269',
          public_key: keys.pk,
          source: from,
          gas_limit: '10000',
          storage_limit: '0',
        });
      }
      counter = parseInt(headCounter, 10);
      if (typeof counters[from] === 'undefined') counters[from] = counter;
      if (counter > counters[from]) counters[from] = counter;
      counters[from] = counter;

      ops.forEach((op) => {
        if (['proposals', 'ballot', 'transaction', 'origination', 'delegation'].indexOf(op.kind) >= 0) {
          if (typeof op.source === 'undefined') op.source = from;
        }
        if (['reveal', 'transaction', 'origination', 'delegation'].indexOf(op.kind) >= 0) {
          if (typeof op.gas_limit === 'undefined') op.gas_limit = '0';
          if (typeof op.storage_limit === 'undefined') op.storage_limit = '0';
          op.counter = `${counters[from]++}`;
          op.fee = `${op.fee}`;
          op.gas_limit = `${op.gas_limit}`;
          op.storage_limit = `${op.storage_limit}`;
        }
      });

      opOb = {
        branch: head.hash,
        contents: ops,
      };

      return node.query(`/chains/${head.chain_id}/blocks/${head.hash}/helpers/forge/operations`, opOb);
    })
      .then((opbytes) => {
        if (keys.sk === false) {
          opOb.protocol = head.protocol;
          return {
            opOb,
            opbytes,
          };
        }
        if (!keys) {
          sopbytes = `${opbytes}00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000`;
          opOb.signature = 'edsigtXomBKi5CTRf5cjATJWSyaRvhfYNHqSUGrn4SdbYRcGwQrUGjzEfQDTuqHhuA8b2d8NarZjz8TRf65WkpQmo423BtomS8Q';
        } else {
          const signed = crypto.sign(opbytes, keys.sk, watermark.generic);
          sopbytes = signed.sbytes;
          opOb.signature = signed.edsig;
        }

        opOb.protocol = head.protocol;
        if (skipPrevalidation) {
          return rpc.silentInject(sopbytes);
        }
        return rpc.inject(opOb, sopbytes);
      });
  },
  inject: (opOb, sopbytes) => {
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
  },
  silentInject: sopbytes => node.query('/injection/operation', sopbytes).then(hash => ({ hash })),
  transfer: ({
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
  }) => {
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
    return rpc.sendOperation(from, operation, keys);
  },
  activate: (keys, secret) => {
    const operation = {
      kind: 'activate_account',
      pkh: keys.pkh,
      secret,
    };
    return rpc.sendOperation(keys.pkh, operation, keys);
  },
  originate: ({
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
  }) => {
    const _code = utility.ml2mic(code);

    const script = {
      code: _code,
      storage: utility.sexp2mic(init),
    };

    const operation = {
      kind: 'origination',
      fee: `${fee}`,
      storage_limit: storageLimit,
      gas_limit: gasLimit,
      balance: `${utility.mutez(amount)}`,
      spendable,
      delegatable,
      delegate: (typeof delegate !== 'undefined' && delegate ? delegate : keys.pkh),
      script,
    };

    if (node.isZeronet) {
      operation.manager_pubkey = keys.pkh;
    } else {
      operation.managerPubkey = keys.pkh;
    }

    return rpc.sendOperation(keys.pkh, operation, keys);
  },
  setDelegate: (from, keys, delegate, fee = DEFAULT_FEE, gasLimit = '10000', storageLimit = '0') => {
    const operation = {
      kind: 'delegation',
      fee: `${fee}`,
      gas_limit: gasLimit,
      storage_limit: storageLimit,
      delegate: (typeof delegate !== 'undefined' ? delegate : keys.pkh),
    };
    return rpc.sendOperation(from, operation, keys);
  },
  registerDelegate: (keys, fee = DEFAULT_FEE, gasLimit = '10000', storageLimit = '0') => {
    const operation = {
      kind: 'delegation',
      fee: `${fee}`,
      gas_limit: gasLimit,
      storage_limit: storageLimit,
      delegate: keys.pkh,
    };
    return rpc.sendOperation(keys.pkh, operation, keys);
  },
  typecheckCode: (code) => {
    const _code = utility.ml2mic(code);
    return node.query('/chains/main/blocks/head/helpers/scripts/typecheck_code', { program: _code, gas: '10000' });
  },
  packData: (data, type) => {
    const check = {
      data: utility.sexp2mic(data),
      type: utility.sexp2mic(type),
      gas: '4000000',
    };
    return node.query('/chains/main/blocks/head/helpers/scripts/pack_data', check);
  },
  typecheckData: (data, type) => {
    const check = {
      data: utility.sexp2mic(data),
      type: utility.sexp2mic(type),
      gas: '4000000',
    };
    return node.query('/chains/main/blocks/head/helpers/scripts/typecheck_data', check);
  },
  runCode: (code, amount, input, storage, trace = false) => {
    const ep = trace ? 'trace_code' : 'run_code';
    return node.query(`/chains/main/blocks/head/helpers/scripts/${ep}`, {
      script: utility.ml2mic(code),
      amount: `${utility.mutez(amount)}`,
      input: utility.sexp2mic(input),
      storage: utility.sexp2mic(storage),
    });
  },
};

const contract = {
  hash: (operationHash, ind) => {
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
  },
  originate: ({
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
  }) => (
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
    })
  ),
  storage: contractAddress => (
    new Promise((resolve, reject) => (
      node.query(`/chains/main/blocks/head/context/contracts/${contractAddress}/storage`)
        .then(r => resolve(r))
        .catch(e => reject(e))
    ))
  ),
  load: contractAddress => node.query(`/chains/main/blocks/head/context/contracts/${contractAddress}`),
  watch: (contractAddress, timeout, callback) => {
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
  },
  send: ({
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
  }) => (
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
    })
  ),
};

const trezor = {
  source: (address) => {
    const tag = (address[0] === 't' ? 0 : 1);
    const curve = (parseInt(address[2], 10) - 1);
    const pp = (tag === 1 ? prefix.KT : prefix[`tz${curve + 1}`]);
    let bytes = utility.b58cdecode(address, pp);
    if (tag === 1) {
      bytes = utility.mergebuf(bytes, [0]);
    } else {
      bytes = utility.mergebuf([curve], bytes);
    }
    return {
      tag,
      hash: bytes,
    };
  },
  parameter: (address, opbytes) => {
    const tag = (address[0] === 't' ? 0 : 1);
    const curve = (parseInt(address[2], 10) - 1);
    const pp = (tag === 1 ? prefix.KT : prefix[`tz${curve + 1}`]);
    let bytes = utility.b58cdecode(address, pp);
    if (tag === 1) {
      bytes = utility.mergebuf(bytes, [0]);
    } else {
      bytes = utility.mergebuf([curve], bytes);
    }
    const hex = utility.buf2hex(utility.mergebuf([tag], bytes));
    return (opbytes.substr(-46) === `${hex}00` ? false : utility.hex2buf(opbytes.substr(opbytes.indexOf(hex) + hex.length + 2)));
  },
  operation: (d) => {
    const operations = [];
    let revealOp = false;
    let op;
    let p;
    for (let i = 0; i < d.opOb.contents.length; i++) {
      op = d.opOb.contents[i];
      if (op.kind === 'reveal') {
        if (revealOp) {
          throw new Error('Can\'t have 2 reveals');
        }
        revealOp = {
          source: trezor.source(op.source),
          fee: parseInt(op.fee, 10),
          counter: parseInt(op.counter, 10),
          gasLimit: parseInt(op.gas_limit, 10),
          storageLimit: parseInt(op.storage_limit, 10),
          publicKey: utility.mergebuf([0], utility.b58cdecode(op.public_key, prefix.edpk)),
        };
      } else {
        if (['origination', 'transaction', 'delegation'].includes(op.kind)) {
          return console.log('err2');
        }
        const op2 = {
          type: op.kind,
          source: trezor.source(op.source),
          fee: parseInt(op.fee, 10, 10),
          counter: parseInt(op.counter, 10),
          gasLimit: parseInt(op.gas_limit, 10),
          storageLimit: parseInt(op.storage_limit, 10),
        };
        switch (op.kind) {
          case 'transaction':
            op2.amount = parseInt(op.amount, 10);
            op2.destination = trezor.source(op.destination);
            if (p = trezor.parameter(op.destination, d.opbytes)) op2.parameters = p;
            break;
          case 'origination':
            if (node.isZeronet) op2.manager_pubkey = trezor.source(op.manager_pubkey).hash;
            else op2.managerPubkey = trezor.source(op.managerPubkey).hash;
            op2.balance = parseInt(op.balance, 10);
            op2.spendable = op.spendable;
            op2.delegatable = op.delegatable;
            if (typeof op.delegate !== 'undefined') {
              op2.delegate = trezor.source(op.delegate).hash;
            }
            // Script not supported yet...
            break;
          case 'delegation':
            if (typeof op.delegate !== 'undefined') {
              op2.delegate = trezor.source(op.delegate).hash;
            }
            break;
          default:
            break;
        }
        operations.push(op2);
      }
    }
    if (operations.length > 1) {
      return console.log('Too many operations');
    }
    const operation = operations[0];
    // const tx = {};
    return [operation, revealOp];
  },
};

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
  trezor,
};

module.exports = sotez;
