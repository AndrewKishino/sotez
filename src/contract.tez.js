const node = require('./node.tez');
const rpc = require('./rpc.tez');
const contractModule = require('./contract.tez');
const utility = require('./utility.tez');

module.exports = {
  originate: (keys, amount, code, init, spendable, delegatable, delegate, fee) => (
    rpc.originate(keys, amount, code, init, spendable, delegatable, delegate, fee)
  ),
  storage: contract => (
    new Promise((resolve, reject) => {
      node.query(`/blocks/head/proto/context/contracts/${contract}`).then((r) => {
        resolve(r.storage);
      }).catch((e) => {
        reject(e);
      });
    })
  ),
  load: contract => node.query(`/blocks/head/proto/context/contracts/${contract}`),
  watch: (cc, timeout, cb) => {
    let storage = [];
    const ct = () => {
      contractModule.storage(cc).then((r) => {
        if (JSON.stringify(storage) !== JSON.stringify(r)) {
          storage = r;
          cb(storage);
        }
      });
    };
    ct();
    return setInterval(ct, timeout * 1000);
  },
  send: (contract, keys, amount, parameter, fee) => (
    rpc.sendOperation({
      kind: 'transaction',
      amount: utility.tztomin(amount),
      destination: contract,
      parameters: parameter, // utility.sexp2mic(parameter)
    }, keys, fee)
  ),
};
