const crypto = require('./crypto.tez');
const node = require('./node.tez');
const rpc = require('./rpc.tez');
const library = require('./library.tez');
const utility = require('./utility.tez');
const prefix = require('./prefix.tez');

module.exports = {
  faucet: (toAddress) => {
    const keys = crypto.generateKeysNoSeed();
    let head;
    let predBlock;
    let opbytes;
    let npkh;
    return node.query('/blocks/head')
      .then((f) => {
        head = f;
        predBlock = head.predecessor;
        return node.query('/blocks/head/proto/helpers/forge/forge/operations', {
          branch: predBlock,
          operations: [{
            kind: 'faucet',
            id: keys.pkh,
            nonce: utility.hexNonce(32),
          }],
        });
      }).then((f) => {
        opbytes = f.operation;
        const operationHash = utility
          .b58cencode(library.sodium.crypto_generichash(32, utility.hex2buf(opbytes)), prefix.o);
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
      .then(() => (
        node.query(`/blocks/head/proto/context/contracts/${npkh}/manager`)
      ))
      .then(() => {
        keys.pkh = npkh;
        const operation = {
          kind: 'transaction',
          amount: utility.tztomin(100000),
          destination: toAddress,
        };
        return rpc.sendOperation(operation, keys, 0);
      });
  },
};
