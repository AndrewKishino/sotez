**[Sotez Documentation](../README.md)**

[Globals](../README.md) › [&quot;crypto&quot;](_crypto_.md)

# External module: "crypto"

## Index

### Interfaces

* [Keys](../interfaces/_crypto_.keys.md)
* [KeysMnemonicPassphrase](../interfaces/_crypto_.keysmnemonicpassphrase.md)
* [Signed](../interfaces/_crypto_.signed.md)

### Functions

* [checkAddress](_crypto_.md#const-checkaddress)
* [extractKeys](_crypto_.md#const-extractkeys)
* [generateKeys](_crypto_.md#const-generatekeys)
* [generateMnemonic](_crypto_.md#const-generatemnemonic)
* [sign](_crypto_.md#const-sign)

## Functions

### `Const` checkAddress

▸ **checkAddress**(`address`: string): *boolean*

*Defined in [crypto.ts:112](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/crypto.ts#L112)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | string | The address to check |

**Returns:** *boolean*

Whether address is valid or not

___

### `Const` extractKeys

▸ **extractKeys**(`sk`: string, `password`: string): *Promise‹[Keys](../interfaces/_crypto_.keys.md)›*

*Defined in [crypto.ts:40](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/crypto.ts#L40)*

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`sk` | string | - | The secret key to extract key pairs from |
`password` | string | "" | - |

**Returns:** *Promise‹[Keys](../interfaces/_crypto_.keys.md)›*

The extracted key pairs
```javascript
crypto.extractKeys('edskRqAF8s2MKKqRMxq53CYYLMnrqvokMyrtmPRFd5H9osc4bFmqKBY119jiiqKQMti2frLAoKGgZSQN3Lc3ybf5sgPUy38e5A')
  .then(({ sk, pk, pkh }) => console.log(sk, pk, pkh));
```

___

### `Const` generateKeys

▸ **generateKeys**(`mnemonic`: string, `passphrase`: string): *Promise‹[KeysMnemonicPassphrase](../interfaces/_crypto_.keysmnemonicpassphrase.md)›*

*Defined in [crypto.ts:131](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/crypto.ts#L131)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`mnemonic` | string | The mnemonic seed |
`passphrase` | string | The passphrase used to encrypt the seed |

**Returns:** *Promise‹[KeysMnemonicPassphrase](../interfaces/_crypto_.keysmnemonicpassphrase.md)›*

The generated key pair
```javascript
crypto.generateKeys('raw peace visual boil prefer rebel anchor right elegant side gossip enroll force salmon between', 'my_password_123')
  .then(({ mnemonic, passphrase, sk, pk, pkh }) => console.log(mnemonic, passphrase, sk, pk, pkh));
```

___

### `Const` generateMnemonic

▸ **generateMnemonic**(): *string*

*Defined in [crypto.ts:105](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/crypto.ts#L105)*

**Returns:** *string*

The generated mnemonic

___

### `Const` sign

▸ **sign**(`bytes`: string, `sk`: string, `wm`: Uint8Array, `password`: string): *Promise‹[Signed](../interfaces/_crypto_.signed.md)›*

*Defined in [crypto.ts:164](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/crypto.ts#L164)*

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`bytes` | string | - | The bytes to sign |
`sk` | string | - | The secret key to sign the bytes with |
`wm` | Uint8Array | - | The watermark bytes |
`password` | string | "" | - |

**Returns:** *Promise‹[Signed](../interfaces/_crypto_.signed.md)›*

The signed bytes
```javascript
import { watermark } from 'sotez';

crypto.sign(opbytes, keys.sk, watermark.generic)
  .then(({ bytes, sig, edsig, sbytes }) => console.log(bytes, sig, edsig, sbytes));
```