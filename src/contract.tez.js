const node = require('./node.tez');
const rpc = require('./rpc.tez');
const utility = require('./utility.tez');

const contract = {
  originate: (keys, amount, code, init, spendable, delegatable, delegate, fee) => (
    rpc.originate(keys, amount, code, init, spendable, delegatable, delegate, fee)
  ),
  storage: TzContract => (
    new Promise((resolve, reject) => {
      node.query(`/blocks/head/proto/context/contracts/${TzContract}`).then((r) => {
        resolve(r.storage);
      }).catch((e) => {
        reject(e);
      });
    })
  ),
  load: TzContract => node.query(`/blocks/head/proto/context/contracts/${TzContract}`),
  send: (TzContract, keys, amount, parameter, fee) => (
    rpc.sendOperation({
      kind: 'transaction',
      amount: utility.tztomin(amount),
      destination: TzContract,
      parameters: parameter, // utility.sexp2mic(parameter)
    }, keys, fee)
  ),
};

contract.watch = (cc, timeout, cb) => {
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
};

module.exports = contract;
