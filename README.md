# Tezos Threshold Wallet

Tezos wallet and JS SDK powered by two-party EdDSA (Ed25519).

## Installation
```js
npm install @kzen-networks/tezos-thresh-wallet
```

## Usage
Server (acts as the co-signer in the two-party signing protocol):
```js
const { Ed25519Party1 } = require('../build/node');

new Ed25519Party1().launchServer();
```
Client:
```js
import Sotez, { Ed25519Party2, Ed25519Party2Share } from '@kzen-networks/tezos-thresh-wallet';
const sotez = new Sotez('http://127.0.0.1:8732');

const P1_SERVER_ENDPOINT = 'http://localhost:8000';
const party2 = new Ed25519Party2(P1_SERVER_ENDPOINT);

(async () => {
  await sotez.importEd25519Party2(party2);  // activates two-party key generation protocol
  const address = sotez.party2.publicKeyHash();
  console.log(address);
  // tz1csGALMvB6sh3KJyHAMYVYVMUaucBgBDw7

  /* Now you should deposit XTZ into this address */

  console.log(await sotez.getBalance(address));  // in mutez (1 XTZ = 1,000,000 mutez)
  // 982974

  const { hash } = await sotez.transfer({
    source: address,
    to: 'tz1YaqLFe8nywjCiAF1vK1U1yns69nPQoyg1',
    amount: 10000
  });
  console.log(hash);
  // ooebvSGroFp7bma7Gicx5s2GeDT2j69m5r8z2nUMMzogYASCBzX

})();
```

## Documentation
Documentation can be found [HERE](https://github.com/KZen-networks/tezos-thresh-wallet/wiki/Documentation).

## Development
```js
npm install
npm run build
```
Built files will be located in the `build/node` and `build/web` folders.

## License
MIT

## Credits
This work is a fork extending the work of Andrew Kishino's [Sotez](https://github.com/AndrewKishino/sotez).
