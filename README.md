# Sotez - A JS Library for Tezos
![npm](https://img.shields.io/npm/v/sotez.svg?logo=npm&color=blue)
[![Build Status](https://travis-ci.org/AndrewKishino/sotez.svg?branch=master)](https://travis-ci.org/AndrewKishino/sotez)

# Getting Started
```js
npm install sotez
```

```js
// Import library or individual modules
import Sotez, { utility, forge, crypto, ledger } from 'sotez';

// Or using require
const Sotez = require('sotez').default;
const { utility, forge, crypto, ledger } = require('sotez');
```

```js
const sotez = new Sotez('http://127.0.0.1:8732');

const example = async () => {
  // A secret key or a ledger must be imported to sign transactions
  // await sotez.importLedger();
  await sotez.importKey('...');

  // A simple transfer operation
  const { hash } = await sotez.transfer({
    to: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
    amount: '1000000',
  });

  console.log(`Injected Operation Hash: ${hash}`);

  // Await confirmation of included operation
  const block = await sotez.awaitOperation(hash);
  console.log(`Operation found in block ${block}`);
};

sotez.query('/chains/main/blocks/head')
  .then(response => console.log(response));

crypto.generateMnemonic()
  .then(mnemonic => console.log(mnemonic));
```

# Documentation
Documentation can be found [HERE](https://github.com/AndrewKishino/sotez/wiki/Documentation).

# Development
```js
npm install
npm run build
```

## License
MIT

## Credits
Credits to Stephen Andrews and [EZTZ](https://github.com/TezTech/eztz).
