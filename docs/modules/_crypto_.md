**[Sotez Documentation](../README.md)**

[Globals](../README.md) › ["crypto"](_crypto_.md)

# External module: "crypto"

## Index

### Functions

* [checkAddress](_crypto_.md#const-checkaddress)
* [extractKeys](_crypto_.md#const-extractkeys)
* [generateKeys](_crypto_.md#const-generatekeys)
* [generateMnemonic](_crypto_.md#const-generatemnemonic)
* [sign](_crypto_.md#const-sign)

## Functions

### `Const` checkAddress

▸ **checkAddress**(`address`: string): *boolean*

*Defined in [crypto.ts:96](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/crypto.ts#L96)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | string | The address to check |

**Returns:** *boolean*

Whether address is valid or not

___

### `Const` extractKeys

▸ **extractKeys**(`sk`: string, `password`: string): *Promise‹Keys›*

*Defined in [crypto.ts:24](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/crypto.ts#L24)*

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`sk` | string | - | The secret key to extract key pairs from |
`password` | string | "" | - |

**Returns:** *Promise‹Keys›*

The extracted key pairs
```javascript
crypto.extractKeys('edskRqAF8s2MKKqRMxq53CYYLMnrqvokMyrtmPRFd5H9osc4bFmqKBY119jiiqKQMti2frLAoKGgZSQN3Lc3ybf5sgPUy38e5A')
  .then(({ sk, pk, pkh }) => console.log(sk, pk, pkh));
```

___

### `Const` generateKeys

▸ **generateKeys**(`mnemonic`: string, `passphrase`: string): *Promise‹KeysMnemonicPassphrase›*

*Defined in [crypto.ts:115](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/crypto.ts#L115)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`mnemonic` | string | The mnemonic seed |
`passphrase` | string | The passphrase used to encrypt the seed |

**Returns:** *Promise‹KeysMnemonicPassphrase›*

The generated key pair
```javascript
crypto.generateKeys('raw peace visual boil prefer rebel anchor right elegant side gossip enroll force salmon between', 'my_password_123')
  .then(({ mnemonic, passphrase, sk, pk, pkh }) => console.log(mnemonic, passphrase, sk, pk, pkh));
```

___

### `Const` generateMnemonic

▸ **generateMnemonic**(): *string*

*Defined in [crypto.ts:89](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/crypto.ts#L89)*

**Returns:** *string*

The generated mnemonic

___

### `Const` sign

▸ **sign**(`bytes`: string, `sk`: string, `wm`: Uint8Array, `password`: string): *Promise‹Signed›*

*Defined in [crypto.ts:148](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/crypto.ts#L148)*

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`bytes` | string | - | The bytes to sign |
`sk` | string | - | The secret key to sign the bytes with |
`wm` | Uint8Array | - | The watermark bytes |
`password` | string | "" | - |

**Returns:** *Promise‹Signed›*

The signed bytes
```javascript
import { watermark } from 'sotez';

crypto.sign(opbytes, keys.sk, watermark.generic)
  .then(({ bytes, sig, edsig, sbytes }) => console.log(bytes, sig, edsig, sbytes));
```