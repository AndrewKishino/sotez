**[Sotez Documentation](../README.md)**

[Globals](../README.md) › [&quot;key&quot;](../modules/_key_.md) › [Key](_key_.key.md)

# Class: Key

Creates a key object from a base58 encoded key.

**`class`** Key

**`param`** A public or secret key in base58 encoding, or a 15 word bip39 english mnemonic string

**`param`** The passphrase used if the key provided is an encrypted private key or a fundraiser key

**`param`** Email used if a fundraiser key is passed
```javascript
const key = new Key('edskRv6ZnkLQMVustbYHFPNsABu1Js6pEEWyMUFJQTqEZjVCU2WHh8ckcc7YA4uBzPiJjZCsv3pC1NDdV99AnyLzPjSip4uC3y');
await key.ready;
```

## Hierarchy

* **Key**

## Index

### Constructors

* [constructor](_key_.key.md#constructor)

### Properties

* [_curve](_key_.key.md#_curve)
* [_isLedger](_key_.key.md#_isledger)
* [_isSecret](_key_.key.md#_issecret)
* [_ledgerCurve](_key_.key.md#_ledgercurve)
* [_ledgerPath](_key_.key.md#_ledgerpath)
* [_publicKey](_key_.key.md#_publickey)
* [_secretKey](_key_.key.md#optional-_secretkey)
* [ready](_key_.key.md#ready)

### Accessors

* [curve](_key_.key.md#curve)
* [isLedger](_key_.key.md#isledger)
* [ledgerCurve](_key_.key.md#ledgercurve)
* [ledgerPath](_key_.key.md#ledgerpath)

### Methods

* [initialize](_key_.key.md#initialize)
* [publicKey](_key_.key.md#publickey)
* [publicKeyHash](_key_.key.md#publickeyhash)
* [secretKey](_key_.key.md#secretkey)
* [sign](_key_.key.md#sign)

## Constructors

###  constructor

\+ **new Key**(`key`: string, `passphrase?`: undefined | string, `email?`: undefined | string): *[Key](_key_.key.md)*

*Defined in [key.ts:27](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/key.ts#L27)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`passphrase?` | undefined &#124; string |
`email?` | undefined &#124; string |

**Returns:** *[Key](_key_.key.md)*

## Properties

###  _curve

• **_curve**: *string*

*Defined in [key.ts:20](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/key.ts#L20)*

___

###  _isLedger

• **_isLedger**: *boolean*

*Defined in [key.ts:24](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/key.ts#L24)*

___

###  _isSecret

• **_isSecret**: *boolean*

*Defined in [key.ts:23](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/key.ts#L23)*

___

###  _ledgerCurve

• **_ledgerCurve**: *number*

*Defined in [key.ts:26](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/key.ts#L26)*

___

###  _ledgerPath

• **_ledgerPath**: *string*

*Defined in [key.ts:25](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/key.ts#L25)*

___

###  _publicKey

• **_publicKey**: *Buffer*

*Defined in [key.ts:21](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/key.ts#L21)*

___

### `Optional` _secretKey

• **_secretKey**? : *Buffer*

*Defined in [key.ts:22](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/key.ts#L22)*

___

###  ready

• **ready**: *Promise‹void›*

*Defined in [key.ts:27](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/key.ts#L27)*

## Accessors

###  curve

• **get curve**(): *string*

*Defined in [key.ts:38](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/key.ts#L38)*

**Returns:** *string*

___

###  isLedger

• **get isLedger**(): *boolean*

*Defined in [key.ts:42](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/key.ts#L42)*

**Returns:** *boolean*

• **set isLedger**(`value`: boolean): *void*

*Defined in [key.ts:46](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/key.ts#L46)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

___

###  ledgerCurve

• **get ledgerCurve**(): *number*

*Defined in [key.ts:58](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/key.ts#L58)*

**Returns:** *number*

• **set ledgerCurve**(`value`: number): *void*

*Defined in [key.ts:62](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/key.ts#L62)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | number |

**Returns:** *void*

___

###  ledgerPath

• **get ledgerPath**(): *string*

*Defined in [key.ts:50](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/key.ts#L50)*

**Returns:** *string*

• **set ledgerPath**(`value`: string): *void*

*Defined in [key.ts:54](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/key.ts#L54)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *void*

## Methods

###  initialize

▸ **initialize**(`key`: string, `passphrase?`: undefined | string, `email?`: undefined | string, `ready?`: any): *Promise‹void›*

*Defined in [key.ts:108](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/key.ts#L108)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`passphrase?` | undefined &#124; string |
`email?` | undefined &#124; string |
`ready?` | any |

**Returns:** *Promise‹void›*

___

###  publicKey

▸ **publicKey**(): *string*

*Defined in [key.ts:71](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/key.ts#L71)*

**Returns:** *string*

The public key associated with the private key

___

###  publicKeyHash

▸ **publicKeyHash**(): *string*

*Defined in [key.ts:97](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/key.ts#L97)*

**Returns:** *string*

The public key hash for this key

___

###  secretKey

▸ **secretKey**(): *string*

*Defined in [key.ts:78](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/key.ts#L78)*

**Returns:** *string*

The secret key associated with this key, if available

___

###  sign

▸ **sign**(`bytes`: string, `watermark`: Uint8Array): *Promise‹object›*

*Defined in [key.ts:203](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/key.ts#L203)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`bytes` | string | Sequence of bytes, raw format or hexadecimal notation |
`watermark` | Uint8Array | The watermark bytes |

**Returns:** *Promise‹object›*

The public key hash for this key