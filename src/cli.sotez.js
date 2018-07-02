const { XMLHttpRequest } = require('xmlhttprequest');

const defaultProvider = 'http://node.mytezoswallet.com';

const library = {
  bs58check: require('bs58check'),
  sodium: require('libsodium-wrappers'),
  bip39: require('bip39'),
  pbkdf2: require('pbkdf2'),
};

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
  totez: m => parseInt(m, 10) / 1000000,
  mutez: (tz) => {
    const r = tz.toFixed(6) * 1000000;
    if (r > 4294967296) {
      return r.toString();
    }
    return r;
  },
  b58cencode: (payload, prefixArg) => {
    const n = new Uint8Array(prefixArg.length + payload.length);
    n.set(prefixArg);
    n.set(payload, prefixArg.length);
    return library.bs58check.encode(Buffer.from(n, 'hex'));
  },
  b58cdecode: (enc, prefixArg) => library.bs58check.decode(enc).slice(prefixArg.length),
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
    while (length -= 1) hex += chars[(Math.random() * 16) | 0];
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
    for (let i = 0; i < mi.length; i += 1) {
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
      else if (mi[i] === '(') pl += 1;
      else if (mi[i] === ')') pl -= 1;
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
      for (let i = 0; i < sc; i += 1) {
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
    for (let i = 0; i < mi.length; i += 1) {
      if (val === '}' || val === ';') {
        val = '';
      }
      if (inseq) {
        if (mi[i] === '}') {
          bl -= 1;
        } else if (mi[i] === '{') {
          bl += 1;
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
        bl += 1;
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
        pl += 1;
      } else if (mi[i] === ')') {
        pl -= 1;
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
            pkh: utility.b58cencode(library.sodium.crypto_generichash(20, utility.b58cdecode(sk, prefix.edsk).slice(32)), prefix.tz1),
            sk,
          };
        }
        if (sk.length === 54) { // seed
          const s = utility.b58cdecode(sk, prefix.edsk2);
          const kp = library.sodium.crypto_sign_seed_keypair(s);
          return {
            sk: utility.b58cencode(kp.privateKey, prefix.edsk),
            pk: utility.b58cencode(kp.publicKey, prefix.edpk),
            pkh: utility.b58cencode(library.sodium.crypto_generichash(20, kp.publicKey), prefix.tz1),
          };
        }
        break;
      default:
        return false;
    }
  },
  generateMnemonic: () => library.bip39.generateMnemonic(160),
  checkAddress: (a) => {
    try {
      utility.b58cdecode(a, prefix.tz1);
      return true;
    } catch (e) {
      return false;
    }
  },
  generateKeysNoSeed: () => {
    const kp = library.sodium.crypto_sign_keypair();
    return {
      sk: utility.b58cencode(kp.privateKey, prefix.edsk),
      pk: utility.b58cencode(kp.publicKey, prefix.edpk),
      pkh: utility.b58cencode(library.sodium.crypto_generichash(20, kp.publicKey), prefix.tz1),
    };
  },
  generateKeys: (m, p) => {
    const s = library.bip39.mnemonicToSeed(m, p).slice(0, 32);
    const kp = library.sodium.crypto_sign_seed_keypair(s);
    return {
      mnemonic: m,
      passphrase: p,
      sk: utility.b58cencode(kp.privateKey, prefix.edsk),
      pk: utility.b58cencode(kp.publicKey, prefix.edpk),
      pkh: utility.b58cencode(library.sodium.crypto_generichash(20, kp.publicKey), prefix.tz1),
    };
  },
  generateKeysFromSeedMulti: (m, p, n) => {
    n /= (256 ^ 2);
    const s = library.bip39.mnemonicToSeed(m, library.pbkdf2.pbkdf2Sync(p, n.toString(36).slice(2), 0, 32, 'sha512').toString()).slice(0, 32);
    const kp = library.sodium.crypto_sign_seed_keypair(s);
    return {
      mnemonic: m,
      passphrase: p,
      n,
      sk: utility.b58cencode(kp.privateKey, prefix.edsk),
      pk: utility.b58cencode(kp.publicKey, prefix.edpk),
      pkh: utility.b58cencode(library.sodium.crypto_generichash(20, kp.publicKey), prefix.tz1),
    };
  },
  sign: (bytes, sk, wm) => {
    let bb = utility.hex2buf(bytes);
    if (typeof wm !== 'undefined') {
      bb = utility.mergebuf(wm, bb);
    }
    const sig = library.sodium.crypto_sign_detached(library.sodium.crypto_generichash(32, bb), utility.b58cdecode(sk, prefix.edsk), 'uint8array');
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
    library.sodium.crypto_sign_verify_detached(sig, utility.hex2buf(bytes), utility.b58cdecode(pk, prefix.edpk))
  ),
};

const node = {
  activeProvider: defaultProvider,
  debugMode: false,
  async: true,
  setDebugMode: (t) => {
    node.debugMode = t;
  },
  setProvider: (u) => {
    node.activeProvider = u;
  },
  resetProvider: () => {
    node.activeProvider = defaultProvider;
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
  account: (keys, amount, spendable, delegatable, delegate, fee) => {
    const operation = {
      kind: 'origination',
      fee: fee.toString(),
      managerPubkey: keys.pkh,
      balance: utility.mutez(amount).toString(),
      spendable: (typeof spendable !== 'undefined' ? spendable : true),
      delegatable: (typeof delegatable !== 'undefined' ? delegatable : true),
      delegate: (typeof delegate !== 'undefined' ? delegate : keys.pkh),
    };
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
  sendOperation: (from, operation, keys) => {
    let counter;
    let sopbytes;
    let opOb;
    let errors = [];
    const opResponse = [];
    const promises = [];
    let requiresReveal = false;
    let head;

    promises.push(node.query('/chains/main/blocks/head/header'));
    const ops = [...operation];

    for (let i = 0; i < ops.length; i += 1) {
      if (['transaction', 'origination', 'delegation'].indexOf(ops[i].kind) >= 0) {
        requiresReveal = true;
        promises.push(node.query(`/chains/main/blocks/head/context/contracts/${from}/counter`));
        promises.push(node.query(`/chains/main/blocks/head/context/contracts/${from}/manager_key`));
        break;
      }
    }

    return Promise.all(promises).then(([header, headCounter, manager]) => {
      head = header;
      if (requiresReveal && typeof manager.key === 'undefined') {
        ops.unshift({
          kind: 'reveal',
          fee: 0,
          public_key: keys.pk,
          source: from,
        });
      }
      counter = parseInt(headCounter, 10) + 1;

      ops.forEach((op) => {
        if (['proposals', 'ballot', 'transaction', 'origination', 'delegation'].indexOf(op.kind) >= 0) {
          if (typeof op.source === 'undefined') op.source = from;
        }
        if (['reveal', 'transaction', 'origination', 'delegation'].indexOf(op.kind) >= 0) {
          if (typeof op.gas_limit === 'undefined') op.gas_limit = '0';
          if (typeof op.storage_limit === 'undefined') op.storage_limit = '0';
          op.counter = (counter += 1).toString();

          op.fee = op.fee.toString();
          op.gas_limit = op.gas_limit.toString();
          op.storage_limit = op.storage_limit.toString();
          op.counter = op.counter.toString();
        }
      });

      opOb = {
        branch: head.hash,
        contents: ops,
      };

      return node.query(`/chains/${head.chain_id}/blocks/${head.hash}/helpers/forge/operations`, opOb);
    })
      .then((f) => {
        const opbytes = f;
        const signed = crypto.sign(opbytes, keys.sk, watermark.generic);
        sopbytes = signed.sbytes;
        // const oh = utility.b58cencode(library.sodium.crypto_generichash(32, utility.hex2buf(sopbytes)), prefix.o);
        opOb.protocol = 'ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK';
        opOb.signature = signed.edsig;
        return node.query(`/chains/${head.chain_id}/blocks/${head.hash}/helpers/preapply/operations`, [opOb]);
      })
      .then((f) => {
        if (!Array.isArray(f)) {
          throw { error: "RPC Fail", errors: [] }; // eslint-disable-line
        }
        for (let i = 0; i < f.length; i += 1) {
          for (let j = 0; j < f[i].contents.length; j += 1) {
            opResponse.push(f[i].contents[j]);
            if (typeof f[i].contents[j].metadata.operation_result !== 'undefined' && f[i].contents[j].metadata.operation_result.status === 'failed') {
              errors = errors.concat(f[i].contents[j].metadata.operation_result.errors);
            }
          }
        }
        if (errors.length) throw { error: 'Operation Failed', errors: errors }; // eslint-disable-line
        return node.query('/injection/operation', sopbytes);
      })
      .then(f => ({
        hash: f,
        operations: opResponse,
      }));
  },
  transfer: (from, keys, to, amount, fee) => {
    const operation = {
      kind: 'transaction',
      fee: fee.toString(),
      gas_limit: '200',
      amount: utility.mutez(amount).toString(),
      destination: to,
    };
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
  originate: (keys, amount, code, init, spendable, delegatable, delegate, fee) => {
    const _code = utility.ml2mic(code);
    const script = {
      code: _code,
      storage: utility.sexp2mic(init),
    };
    const operation = {
      kind: 'origination',
      fee: fee.toString(),
      gas_limit: '10000',
      storage_limit: '10000',
      managerPubkey: keys.pkh,
      balance: utility.mutez(amount).toString(),
      spendable: (typeof spendable !== 'undefined' ? spendable : false),
      delegatable: (typeof delegatable !== 'undefined' ? delegatable : false),
      delegate: (typeof delegate !== 'undefined' && delegate ? delegate : keys.pkh),
      script,
    };
    return rpc.sendOperation(keys.pkh, operation, keys);
  },
  setDelegate: (from, keys, delegate, fee) => {
    const operation = {
      kind: 'delegation',
      fee: fee.toString(),
      delegate: (typeof delegate !== 'undefined' ? delegate : keys.pkh),
    };
    return rpc.sendOperation(from, operation, keys);
  },
  registerDelegate: (keys, fee) => {
    const operation = {
      kind: 'delegation',
      fee: fee.toString(),
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
      gas: '400000',
    };
    return node.query('/chains/main/blocks/head/helpers/scripts/pack_data', check);
  },
  typecheckData: (data, type) => {
    const check = {
      data: utility.sexp2mic(data),
      type: utility.sexp2mic(type),
      gas: '400000',
    };
    return node.query('/chains/main/blocks/head/helpers/scripts/typecheck_data', check);
  },
  runCode: (code, amount, input, storage, trace) => {
    const ep = ((typeof trace !== 'undefined' && trace) ? 'trace_code' : 'run_code');
    return node.query(`/chains/main/blocks/head/helpers/scripts/${ep}`, {
      script: utility.ml2mic(code),
      amount: utility.mutez(amount).toString(),
      input: utility.sexp2mic(input),
      storage: utility.sexp2mic(storage),
    });
  },
};

const contract = {
  hash: (operationHash, ind) => {
    const ob = utility.b58cdecode(operationHash, prefix.o);
    let tt = [];
    let i = 0;
    for (; i < ob.length; i += 1) {
      tt.push(ob[i]);
    }
    tt = tt.concat([
      (ind & 0xff000000) >> 24,
      (ind & 0x00ff0000) >> 16,
      (ind & 0x0000ff00) >> 8,
      (ind & 0x000000ff),
    ]);
    return utility.b58cencode(library.sodium.crypto_generichash(20, new Uint8Array(tt)), prefix.TZ);
  },
  originate: (keys, amount, code, init, spendable, delegatable, delegate, fee) => (
    rpc.originate(keys, amount, code, init, spendable, delegatable, delegate, fee)
  ),
  storage: contractArg => (
    new Promise((resolve, reject) => (
      node.query(`/chains/main/blocks/head/context/contracts/${contractArg}/storage`)
        .then(r => resolve(r))
        .catch(e => reject(e))
    ))
  ),
  load: contractArg => node.query(`/chains/main/blocks/head/context/contracts/${contractArg}`),
  watch: (cc, timeout, cb) => {
    let storage = [];
    const ct = () => {
      contract.storage(cc).then((r) => {
        if (JSON.stringify(storage) !== JSON.stringify(r)) {
          storage = r;
          cb(storage);
        }
      });
    };
    ct();
    return setInterval(ct, timeout * 1000);
  },
  send: (contractArg, from, keys, amount, parameter, fee) => (
    rpc.sendOperation(from, {
      kind: 'transaction',
      fee: fee.toString(),
      gas_limit: '2000',
      amount: utility.mutez(amount).toString(),
      destination: contractArg,
      parameters: utility.sexp2mic(parameter),
    }, keys)
  ),
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
  library,
  prefix,
  watermark,
  utility,
  crypto,
  node,
  rpc,
  contract,
};

module.exports = sotez;
