# Changelog

All notable changes to this project will be documented in this file.

## [11.0.0] - 2021-12-22

- General release Hangzhou

### Added

- Support for Hangzhou protocol

## [11.0.0-beta.0] - 2021-11-12

### Added

- Support for Hangzhou protocol

## [10.1.0-beta.0] - 2021-08-21

### Added

- Added new default options to the constructor for the dry run limiter and the mempool counter manager
  - The mempool counter manager allows multiple transactions to be injected before the previous transactions was included in a block
    - Before a transaction is constructed, the mempool is parsed for previous transactions and uses the next counter
    - When enabling the mempool counter manager, transactions are not prevalidated against the node to allow the transaction to inject without counter errors

```js
// To disable the dry run limiter and mempool counter manager, initialze the instance with:
const tezos = new Tezos('https://testnet-tezos.giganode.io', 'main', {
  dryRunLimiter: false,
  mempoolCounterManager: false,
});
```

## [10.0.0] - 2021-08-01

### Added

- Added support for Granada
- Removed protocol logic from previous protocols

## [9.0.0] - 2021-05-02

### Added

- Added support for Florence
- `transfer` method now optionally accepts an array of transfer parameters

```js
tezos.transfer([
  { to: 'tz1...', amount: 1 },
  { to: 'tz2...', amount: 1 },
]);
```

- Added an additional constructor argument for dry run limiting. All operations will run through a simulation against the node in order to calculate gas and storage consumption. Useful when gas/storage limits are not known or a closer approximation to the actual limit is desired.

```js
const tezos = new Sotez('https://testnet-tezos.giganode.io', 'main', {
  useMutez: false,
  dryRunLimiter: true,
});

await tezos.importKey('esk...');
tezos.transfer({ to: 'tz1...', amount: 1 });
```

## [8.0.0] - 2021-02-01

### Added

- Added support for Edo
- Added additional curve support to all the cryptoUtils functions
- Added `encryptSecretKey` to cryptoUtils
- The `Key` module can now encrypt secret keys by providing a passphrase: `key.secretKey('password')`
- Refactored and cleaned up some logic

### Changed

- `cryptoUtils.generateMnemonic` now generates 15 word mnemonics as per the original implementation

## [7.0.0] - 2020-10-23

### Added

- Added Delphi and Dalpha protocols
- Added smart contract abstraction
- Changed the "crypto" export to "cryptoUtils" to avoid clash with browser
- Removed embedded Ledger Transports. Now requires the user to provide the transport but provides more flexibility.
- The ledger curve is represented as a string ('tz1', 'tz2', 'tz3') instead of 0x00, 0x01, 0x02

```js
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid';

await sotez.importLedger(TransportNodeHid, "44'/1729'/0'/0'", 'tz2');
```

## [0.7.1] - 2020-06-02

### Added

- Added `magicBytes` to the `sign` responses. Allows signatures to be verified by doing:

```js
import { magicBytes as magicBytesMap } from 'sotez';
// ...
const { bytes, magicBytes, prefixSig } = await key.sign(
  '051d7ba791fbe8ccfb6f83dd9c760db5642358909eede2a...',
  magicBytesMap.generic,
);
const verified = await key.verify(`${magicBytes}${bytes}`, prefixSig);
```

### Changed

- Changed `watermark` to be `magicBytes`. This is more consistent with the tezos documentation.

```js
export const magicBytes: MagicBytes = {
  block: new Uint8Array([1]),
  endorsement: new Uint8Array([2]),
  generic: new Uint8Array([3]),
};
```

## [0.7.0] - 2020-05-30

### Added

- Extend the `key.verify` function to accept `sig` as well as `prefixSig`.
- Update eslint config.

### Changed

- Sotez is no longer exported as `default`.

```js
import { Sotez } from 'sotez';
```

- Exported most functions directly from module.
- Update `useMutez` as an initializer option for Sotez.

```js
const sotez = new Sotez('https://127.0.0.1:8732', 'main', {
  defaultFee: 1275,
  useMutez: false,
});
```

## [0.6.4] - 2020-05-28

### Added

- Ensure public keys are constructed correctly and padded when necessary.

## [0.6.3] - 2020-05-28

### Added

- Make sure counter is correctly incremented 'locally' even with `skipCounter=true` by [@CherryDT](https://github.com/CherryDT).

[0.7.0]: https://github.com/AndrewKishino/sotez/commit/a69635497f2be8213131ce11eac716a00e6f9fef
[0.6.4]: https://github.com/AndrewKishino/sotez/commit/1d73c11a8714a6beea5b770c65ac412e09244f2e
[0.6.3]: https://github.com/AndrewKishino/sotez/commit/61506099ea98c46c2d08198fbfa172c0a2ac84a6
