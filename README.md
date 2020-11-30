# Sotez - A JS Library for Tezos

![npm](https://img.shields.io/npm/v/sotez.svg?logo=npm&color=blue)
[![Build Status](https://travis-ci.org/AndrewKishino/sotez.svg?branch=master)](https://travis-ci.org/AndrewKishino/sotez)

## Getting Started

```js
npm install sotez
```

```js
// Import library or individual modules
import { Sotez, utility, forge, cryptoUtils, ledger, Key } from 'sotez';
```

```js
import { Sotez } from 'sotez';
const tezos = new Sotez('http://127.0.0.1:8732');

const example = async () => {
  // A secret key or a ledger must be imported to sign transactions
  // import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
  //
  // await tezos.importLedger(TransportNodeHid, "44'/1729'/0'/0'");
  await tezos.importKey('...');

  // A simple 1ꜩ transfer operation
  const { hash } = await tezos.transfer({
    to: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
    amount: 1000000,
  });

  console.log(`Injected Operation Hash: ${hash}`);

  // Await confirmation of included operation
  const block = await tezos.awaitOperation(hash);
  console.log(`Operation found in block ${block}`);
};

sotez
  .query('/chains/main/blocks/head')
  .then((response) => console.log(response));

cryptoUtils.generateMnemonic().then((mnemonic) => console.log(mnemonic));
```

## Documentation

Documentation can be found [HERE](https://github.com/AndrewKishino/sotez/wiki/Documentation).

## Development

```js
npm install
npm run build
```

Compiled files will be located in the `lib` folder.

## License

MIT

## Credits

Credits to Stephen Andrews and [EZTZ](https://github.com/TezTech/eztz).
