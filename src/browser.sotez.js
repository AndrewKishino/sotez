const { Buffer } = require('buffer/');

const defaultProvider = 'http://mytezoswallet.com:8732';

const library = {
  bs58check: require('bs58check'),
  sodium: require('libsodium-wrappers'),
  bip39: require('bip39'),
  pbkdf2: require('pbkdf2'),
};

const prefix = {
  tz1: new Uint8Array([6, 161, 159]),
  edpk: new Uint8Array([13, 15, 37, 217]),
  edsk: new Uint8Array([43, 246, 78, 7]),
  edsk2: new Uint8Array([13, 15, 58, 7]),
  edsig: new Uint8Array([9, 245, 205, 134, 18]),
  nce: new Uint8Array([69, 220, 169]),
  b: new Uint8Array([1, 52]),
  o: new Uint8Array([5, 116]),
  TZ: new Uint8Array([3, 99, 29]),
};

const utility = {
  mintotz: m => parseInt(m, 10) / 1000000,
  tztomin: (tz) => {
    let r = tz.toFixed(6) * 1000000;
    if (r > 4294967296) r = r.toString();
    return r;
  },
  b58cencode: (payload, prefixArg) => {
    const n = new Uint8Array(prefixArg.length + payload.length);
    n.set(prefixArg);
    n.set(payload, prefixArg.length);
    return library.bs58check.encode(new Buffer(n, 'hex'));
  },
  b58cdecode: (enc, prefixArg) => library.bs58check.decode(enc).slice(prefixArg.length),
  buf2hex: (buffer) => {
    const byteArray = new Uint8Array(buffer);
    const hexParts = [];
    for (let i = 0; i < byteArray.length; i += 1) {
      const hex = byteArray[i].toString(16);
      const paddedHex = (`00${hex}`).slice(-2);
      hexParts.push(paddedHex);
    }
    return hexParts.join('');
  },
  hex2buf: hex => new Uint8Array(hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16))),
  hexNonce: (length) => {
    const chars = '0123456789abcedf';
    let hex = '';
    while (length -= 1) {
      hex += chars[(Math.random() * 16) | 0];
    }
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
      } else if (mi[i] === '"' && sopen) sopen = false;
      else if (mi[i] === '"' && !sopen) sopen = true;
      else if (mi[i] === '\\') escaped = true;
      else if (mi[i] === '(') pl += 1;
      else if (mi[i] === ')') pl -= 1;
      val += mi[i];
    }
    return ret;
  },
  formatMoney: (n, c, d, t) => {
    const cc = isNaN(c = Math.abs(c)) ? 2 : c;
    const dd = d === undefined ? '.' : d;
    const tt = t === undefined ? ',' : t;
    const s = n < 0 ? '-' : '';
    const i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(cc), 10));
    const k = i.length;
    const j = k > 3 ? k % 3 : 0;
    return s + (j ? i.substr(0, j) + tt : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${tt}`) + (cc ? dd + Math.abs(n - i).toFixed(cc).slice(2) : '');
  },
};

const crypto = {
  extractKeys: sk => (
    {
      pk: utility.b58cencode(utility.b58cdecode(sk, prefix.edsk).slice(32), prefix.edpk),
      pkh: utility.b58cencode(library.sodium.crypto_generichash(20, utility.b58cdecode(sk, prefix.edsk).slice(32)), prefix.tz1),
      sk,
    }
  ),
  extractKeysShort: (sk) => {
    const s = utility.b58cdecode(sk, prefix.edsk2);
    const kp = library.sodium.crypto_sign_seed_keypair(s);
    return {
      sk: utility.b58cencode(kp.privateKey, prefix.edsk),
      pk: utility.b58cencode(kp.publicKey, prefix.edpk),
      pkh: utility.b58cencode(library.sodium.crypto_generichash(20, kp.publicKey), prefix.tz1),
    };
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
  generateKeysSalted: (m, p) => {
    const ss = Math.random().toString(36).slice(2);
    const pp = library.pbkdf2.pbkdf2Sync(p, ss, 0, 32, 'sha512').toString();
    const s = library.bip39.mnemonicToSeed(m, pp).slice(0, 32);
    const kp = library.sodium.crypto_sign_seed_keypair(s);
    return {
      mnemonic: m,
      passphrase: p,
      salt: ss,
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
  sign: (bytes, sk) => {
    const sig = library.sodium.crypto_sign_detached(library.sodium.crypto_generichash(32, utility.hex2buf(bytes)), utility.b58cdecode(sk, prefix.edsk), 'uint8array');
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
  query: (e, o) => {
    if (typeof o === 'undefined') o = {};
    return new Promise((resolve, reject) => {
      const http = new XMLHttpRequest(); // eslint-disable-line
      http.open('POST', node.activeProvider + e, node.async);
      http.onload = () => {
        if (http.status === 200) {
          if (node.debugMode) {
            console.log(e, o, http.responseText);
          }
          if (http.responseText) {
            let r = JSON.parse(http.responseText);
            if (typeof r.error !== 'undefined') {
              reject(r.error);
            } else {
              if (typeof r.ok !== 'undefined') r = r.ok;
              resolve(r);
            }
          } else {
            reject('Empty response returned');
          }
        } else {
          reject(http.statusText);
        }
      };
      http.onerror = () => {
        reject(http.statusText);
      };
      http.setRequestHeader('Content-Type', 'application/json');
      http.send(JSON.stringify(o));
    });
  },
};

const rpc = {
  account: (keys, amount, spendable, delegatable, delegate, fee) => {
    const operation = {
      kind: 'origination',
      balance: utility.tztomin(amount),
      managerPubkey: keys.pkh,
      spendable: (typeof spendable !== 'undefined' ? spendable : true),
      delegatable: (typeof delegatable !== 'undefined' ? delegatable : true),
      delegate: (typeof delegate !== 'undefined' ? delegate : keys.pkh),
    };
    return rpc.sendOperation(operation, keys, fee);
  },
  freeAccount: (keys) => {
    let head;
    let predBlock;
    let opbytes;
    return node.query('/blocks/head')
      .then((f) => {
        head = f;
        predBlock = head.predecessor;
        return node.query('/blocks/head/proto/helpers/forge/operations', {
          branch: predBlock,
          operations: [{
            kind: 'faucet',
            id: keys.pkh,
            nonce: utility.hexNonce(32),
          }],
        });
      })
      .then((f) => {
        opbytes = f.operation;
        const operationHash = utility.b58cencode(library.sodium.crypto_generichash(32, utility.hex2buf(opbytes)), prefix.o);
        return node.query('/blocks/head/proto/helpers/apply_operation', {
          pred_block: predBlock,
          operation_hash: operationHash,
          forged_operation: opbytes,
        });
      })
      .then((f) => {
        const npkh = f.contracts[0];
        return node.query('/inject_operation', {
          signedOperationContents: opbytes,
        }).then(() => npkh);
      })
      .then(f => (
        new Promise((resolve) => {
          setTimeout(() => resolve(f), 500);
        })
      ))
      .catch(e => e);
  },
  getBalance: tz1 => node.query(`/blocks/head/proto/context/contracts/${tz1}/balance`).then(r => r.balance),
  getDelegate: tz1 => node.query(`/blocks/head/proto/context/contracts/${tz1}/delegate`),
  getHead: () => node.query('/blocks/head'),
  call: (e, d) => node.query(e, d),
  sendOperation: (operation, keys, fee) => {
    let head;
    let counter;
    let predBlock;
    let sopbytes;
    let returnedContracts;
    const promises = [];
    promises.push(node.query('/blocks/head'));
    if (typeof fee !== 'undefined') {
      promises.push(node.query(`/blocks/head/proto/context/contracts/${keys.pkh}/counter`));
    }
    return Promise.all(promises).then((f) => {
      head = f[0];
      predBlock = head.predecessor;
      let ops;
      if (Array.isArray(operation)) {
        ops = operation;
      } else if (operation.kind === 'transaction' || operation.kind === 'delegation' || operation.kind === 'origination') {
        ops = [
          {
            kind: 'reveal',
            public_key: keys.pk,
          },
          operation,
        ];
      } else {
        ops = [operation];
      }
      const opOb = {
        branch: predBlock,
        kind: 'manager',
        source: keys.pkh,
        operations: ops,
      };
      if (typeof fee !== 'undefined') {
        counter = f[1].counter + 1;
        opOb.fee = fee;
        opOb.counter = counter;
        // opOb['public_key'] = keys.pk;
      }
      return node.query('/blocks/head/proto/helpers/forge/operations', opOb);
    })
      .then((f) => {
        const opbytes = f.operation;
        const signed = crypto.sign(opbytes, keys.sk);
        sopbytes = signed.sbytes;
        const oh = utility.b58cencode(library.sodium.crypto_generichash(32, utility.hex2buf(sopbytes)), prefix.o);
        return node.query('/blocks/head/proto/helpers/apply_operation', {
          pred_block: predBlock,
          operation_hash: oh,
          forged_operation: opbytes,
          signature: signed.edsig,
        });
      })
      .then((f) => {
        returnedContracts = f.contracts;
        return node.query('/inject_operation', {
          signedOperationContents: sopbytes,
        });
      })
      .then((f) => {
        f.contracts = returnedContracts;
        return f;
      })
      .then(e => (
        new Promise((resolve) => {
          setTimeout(() => resolve(e), 500);
        })
      ))
      .catch(e => e);
  },
  transfer: (keys, from, to, amount, fee) => {
    const operation = {
      kind: 'transaction',
      amount: utility.tztomin(amount),
      destination: to,
    };
    return rpc.sendOperation(operation, { pk: keys.pk, pkh: from, sk: keys.sk }, fee);
  },
  originate: (keys, amount, code, init, spendable, delegatable, delegate, fee) => {
    const _code = utility.ml2mic(code);
    const script = {
      code: _code,
      storage: utility.sexp2mic(init),
    };
    const operation = {
      kind: 'origination',
      managerPubkey: keys.pkh,
      balance: utility.tztomin(amount),
      spendable: (typeof spendable !== 'undefined' ? spendable : false),
      delegatable: (typeof delegatable !== 'undefined' ? delegatable : false),
      delegate: (typeof delegate !== 'undefined' && delegate ? delegate : keys.pkh),
      script,
    };
    return rpc.sendOperation(operation, keys, fee);
  },
  setDelegate: (keys, account, delegate, fee) => {
    const operation = {
      kind: 'delegation',
      delegate: (typeof delegate !== 'undefined' ? delegate : keys.pkh),
    };
    return rpc.sendOperation(operation, { pk: keys.pk, pkh: account, sk: keys.sk }, fee);
  },
  registerDelegate: (keys, fee) => {
    const operation = {
      kind: 'delegation',
      delegate: keys.pkh,
    };
    return rpc.sendOperation(operation, keys, fee);
  },
  typecheckCode: (code) => {
    const _code = utility.ml2mic(code);
    return node.query('/blocks/head/proto/helpers/typecheck_code', _code);
  },
  typecheckData: (data, type) => {
    const check = {
      data: utility.sexp2mic(data),
      type: utility.sexp2mic(type),
    };
    return node.query('/blocks/head/proto/helpers/typecheck_data', check);
  },
  runCode: (code, amount, input, storage, trace) => {
    const ep = (trace ? 'trace_code' : 'run_code');
    return node.query(`/blocks/head/proto/helpers/${ep}`, {
      script: utility.ml2mic(code),
      amount: utility.tztomin(amount),
      input: utility.sexp2mic(input),
      storage: utility.sexp2mic(storage),
    });
  },
};

const contract = {
  originate: (keys, amount, code, init, spendable, delegatable, delegate, fee) => (
    rpc.originate(keys, amount, code, init, spendable, delegatable, delegate, fee)
  ),
  storage: contractArg => (
    new Promise((resolve, reject) => {
      node.query(`/blocks/head/proto/context/contracts/${contractArg}`)
        .then(r => resolve(r.storage))
        .catch(e => reject(e));
    })
  ),
  load: contractArg => node.query(`/blocks/head/proto/context/contracts/${contractArg}`),
  watch: (cc, timeout, cb) => {
    let storage = [];
    const ct = () => {
      contract.storage(cc)
        .then((r) => {
          if (JSON.stringify(storage) !== JSON.stringify(r)) {
            storage = r;
            cb(storage);
          }
        });
    };
    ct();
    return setInterval(ct, timeout * 1000);
  },
  send: (contractArg, keys, amount, parameter, fee) => (
    rpc.sendOperation({
      kind: 'transaction',
      amount: utility.tztomin(amount),
      destination: contractArg,
      parameters: parameter, // utility.sexp2mic(parameter),
    }, keys, fee)
  ),
};

// Legacy (for new micheline engine)
utility.ml2tzjson = utility.sexp2mic;
utility.tzjson2arr = utility.mic2arr;
utility.mlraw2json = utility.ml2mic;

// Expose library
const sotez = {
  library,
  prefix,
  utility,
  crypto,
  node,
  rpc,
  contract,
};

// Alpha only functions
sotez.alphanet = {};
sotez.alphanet.faucet = (toAddress) => {
  const keys = crypto.generateKeysNoSeed();
  let head;
  let predBlock;
  let opbytes;
  let npkh;
  return node.query('/blocks/head')
    .then((f) => {
      head = f;
      predBlock = head.predecessor;
      return node.query('/blocks/head/proto/helpers/forge/operations', {
        branch: predBlock,
        operations: [{
          kind: 'faucet',
          id: keys.pkh,
          nonce: utility.hexNonce(32),
        }],
      });
    })
    .then((f) => {
      opbytes = f.operation;
      const operationHash = utility.b58cencode(library.sodium.crypto_generichash(32, utility.hex2buf(opbytes)), prefix.o);
      return node.query('/blocks/head/proto/helpers/apply_operation', {
        pred_block: predBlock,
        operation_hash: operationHash,
        forged_operation: opbytes,
      });
    })
    .then((f) => {
      npkh = f.contracts[0];
      return node.query('/inject_operation', {
        signedOperationContents: opbytes,
      });
    })
    .then(() => node.query(`/blocks/head/proto/context/contracts/${npkh}/manager`))
    .then(() => {
      keys.pkh = npkh;
      const operation = {
        kind: 'transaction',
        amount: utility.tztomin(100000),
        destination: toAddress,
      };
      return rpc.sendOperation(operation, keys, 0);
    });
};

module.exports = sotez;
