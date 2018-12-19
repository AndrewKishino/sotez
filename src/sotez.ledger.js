const { node, rpc, ledger } = require('./sotez.node');

node.setProvider('http://127.0.0.1:8732', true);
node.setDebugMode(true);

const main = async (from, destination, tezosLedger) => {
  const publicKey = await ledger.getAddress({
    curve: 0x02,
    displayConfirm: true,
    appHandler: tezosLedger,
  });

  console.log('=====================================================');
  console.log(`Public Key: ${publicKey}`);
  console.log('=====================================================');

  const testTransfer = {
    kind: 'transaction',
    fee: '1278',
    gas_limit: '10100',
    amount: '1000000',
    destination,
    storage_limit: '0',
  };

  rpc.sendOperation({
    from,
    operation: testTransfer,
  }, {
    useLedger: true,
    curve: 0x02,
    appHandler: tezosLedger,
  })
    .then(response => console.log(`Result: ${response}`))
    .catch(e => console.log(`Error: ${e}`));
};

ledger
  .initialize()
  .then(tezosLedger => main('', '', tezosLedger));
