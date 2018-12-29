const { node, rpc, ledger } = require('../dist/sotez.node.min');

node.setProvider('https://rpczero.tzbeta.net', true);
node.setDebugMode(true);

const test = async (destination, curve = 0x00, n = 1, amount = 100000) => {
  const { address } = await ledger.getAddress({
    curve,
    displayConfirm: true,
  });

  console.log('=====================================================');
  console.log(`Public Key Hash: ${address}`);
  console.log('=====================================================');

  const testTransfer = [...Array(n)]
    .map(() => ({
      kind: 'transaction',
      fee: '1275',
      gas_limit: '10100',
      amount: `${amount}`,
      destination,
      storage_limit: '0',
    }));

  rpc.sendOperation({
    from: address,
    operation: [...testTransfer],
  }, {
    useLedger: true,
    curve,
  })
    .then(response => console.log(`Injected Operation Hash: ${response.hash}`))
    .catch(e => console.log(`Error: ${e}`));
};

// Provide a public key hash to transfer to
test('tz3SMFkjGkQfkzBpNcf74VK7VWKq2KLqVAxG', 0x00, 1, 100000);
