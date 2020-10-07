# Changelog

All notable changes to this project will be documented in this file.

## [0.8.0] - 2020-10-07

### Added

- Added Delphi and Dalpha protocols
- Added smart contract abstraction

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
