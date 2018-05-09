const node = require('./node.tez');
const rpc = require('./rpc.tez');
const library = require('./library.tez');
const crypto = require('./crypto.tez');
const utility = require('./utility.tez');
const prefix = require('./prefix.tez');

module.exports = {
  account(keys, amount, spendable, delegatable, delegate, fee) {
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
  freeAccount(keys) {
    let head;
    let predBlock;
    let opbytes;
    return node.query('/blocks/head')
      .then((f) => {
        head = f;
        predBlock = head.predecessor;
        return node.query('/blocks/prevalidation/proto/helpers/forge/forge/operations', {
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
        return node.query('/blocks/prevalidation/proto/helpers/apply_operation', {
          pred_block: predBlock,
          operation_hash: operationHash,
          forged_operation: opbytes,
        });
      })
      .then((f) => {
        const npkh = f.contracts[0];
        return node.query('/inject_operation', {
          signedOperationContents: opbytes,
        })
          .then(() => npkh);
      })
      .then(f => new Promise((resolve => setTimeout(() => resolve(f), 500))));
  },
  getBalance(tz1) {
    return node.query(`/blocks/prevalidation/proto/context/contracts/${tz1}/balance`).then(r => r.balance);
  },
  getDelegate(tz1) {
    return node.query(`/blocks/prevalidation/proto/context/contracts/${tz1}/delegate`);
  },
  getHead() {
    return node.query('/blocks/head');
  },
  call(e, d) {
    return node.query(e, d);
  },
  sendOperation(operation, keys, fee) {
    let head;
    let counter;
    let sopbytes;
    let returnedContracts;
    const promises = [];
    promises.push(node.query('/blocks/head'));
    if (typeof fee !== 'undefined') {
      promises.push(node.query(`/blocks/head/proto/context/contracts/${keys.pkh}/counter`));
    }
    return Promise.all(promises).then((f) => {
      head = f[0];
      const predBlock = head.predecessor;
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
      .then(e => new Promise(((resolve) => {
        setTimeout(() => resolve(e), 500);
      })))
      .catch(e => console.log(e));
  },
  freeDefaultAccount(keys) {
    const m = crypto.generateMnemonic();
    const k = crypto.generateKeys(m);
    const op = {
      kind: 'transaction',
      amount: utility.tztomin(100000),
      destination: keys.pkh,
      parameters: undefined,
    };
    return rpc
      .freeAccount(k)
      .then((r) => {
        k.pkh = r;
        return rpc.sendOperation(op, k, 0);
      })
      .then(() => keys.pkh)
      .catch(e => Promise.reject(e ? `RPC error: ${e}` : 'RPC error.'));
  },
  transfer(keys, from, to, amount, fee) {
    const operation = {
      kind: 'transaction',
      amount: utility.tztomin(amount),
      destination: to,
    };
    return rpc.sendOperation(operation, { pk: keys.pk, pkh: from, sk: keys.sk }, fee);
  },
  originate(keys, amount, code, init, spendable, delegatable, delegate, fee) {
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
  setDelegate(keys, account, delegate, fee) {
    const operation = {
      kind: 'delegation',
      delegate: (typeof delegate !== 'undefined' ? delegate : keys.pkh),
    };
    return rpc.sendOperation(operation, { pk: keys.pk, pkh: account, sk: keys.sk }, fee);
  },
  registerDelegate(keys, fee) {
    const operation = {
      kind: 'delegation',
      delegate: keys.pkh,
    };
    return rpc.sendOperation(operation, keys, fee);
  },
  typecheckCode(code) {
    const _code = utility.ml2mic(code);
    return node.query('/blocks/head/proto/helpers/typecheck_code', _code);
  },
  typecheckData(data, type) {
    const check = {
      data: utility.sexp2mic(data),
      type: utility.sexp2mic(type),
    };
    return node.query('/blocks/head/proto/helpers/typecheck_data', check);
  },
  runCode(code, amount, input, storage, trace) {
    const ep = (trace ? 'trace_code' : 'run_code');
    return node.query(`/blocks/head/proto/helpers/${ep}`, {
      script: utility.ml2mic(code),
      amount: utility.tztomin(amount),
      input: utility.sexp2mic(input),
      storage: utility.sexp2mic(storage),
    });
  },
};
