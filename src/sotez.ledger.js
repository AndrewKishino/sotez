const { node, rpc, ledger } = require('./sotez.node');

node.setProvider('https://zeronet-rpc.mytezoswallet.com', true);
node.setDebugMode(true);

const main = async (destination, tezosLedger) => {
  const { address } = await ledger.getAddress({
    curve: 0x02,
    displayConfirm: true,
    appHandler: tezosLedger,
  });

  console.log('=====================================================');
  console.log('---------------- Public Key Provided ----------------');
  console.log(`Public Key Hash: ${address}`);
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
    from: address,
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
  .then(tezosLedger => main('tz1bFvgGhpwgVMBDh1ukhJj1fnnkaMfMzEaT', tezosLedger));
