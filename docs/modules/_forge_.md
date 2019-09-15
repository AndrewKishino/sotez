[Sotez Documentation](../README.md) › ["forge"](_forge_.md)

# External module: "forge"


## Index

### Interfaces

* [ConstructedOperation](../interfaces/_forge_.constructedoperation.md)
* [ForgedBytes](../interfaces/_forge_.forgedbytes.md)
* [MichelineArray](../interfaces/_forge_.michelinearray.md)
* [OperationObject](../interfaces/_forge_.operationobject.md)

### Type aliases

* [Micheline](_forge_.md#micheline)

### Functions

* [activateAccount](_forge_.md#const-activateaccount)
* [address](_forge_.md#const-address)
* [ballot](_forge_.md#const-ballot)
* [bool](_forge_.md#const-bool)
* [decodeRawBytes](_forge_.md#const-decoderawbytes)
* [delegation](_forge_.md#const-delegation)
* [doubleBakingEvidence](_forge_.md#const-doublebakingevidence)
* [doubleEndorsementEvidence](_forge_.md#const-doubleendorsementevidence)
* [encodeRawBytes](_forge_.md#const-encoderawbytes)
* [endorsement](_forge_.md#const-endorsement)
* [forge](_forge_.md#const-forge)
* [op](_forge_.md#const-op)
* [origination](_forge_.md#const-origination)
* [parameters](_forge_.md#const-parameters)
* [proposals](_forge_.md#const-proposals)
* [publicKey](_forge_.md#const-publickey)
* [publicKeyHash](_forge_.md#const-publickeyhash)
* [reveal](_forge_.md#const-reveal)
* [script](_forge_.md#const-script)
* [seedNonceRevelation](_forge_.md#const-seednoncerevelation)
* [toBytesInt32](_forge_.md#const-tobytesint32)
* [toBytesInt32Hex](_forge_.md#const-tobytesint32hex)
* [transaction](_forge_.md#const-transaction)
* [zarith](_forge_.md#const-zarith)

## Type aliases

###  Micheline

Ƭ **Micheline**: *object | object | object | object | object | object | object | object | object | [MichelineArray](../interfaces/_forge_.michelinearray.md)*

*Defined in [forge.ts:47](https://github.com/KZen-networks/sotez/blob/80ad203/src/forge.ts#L47)*

## Functions

### `Const` activateAccount

▸ **activateAccount**(`op`: [ConstructedOperation](../interfaces/_forge_.constructedoperation.md)): *string*

*Defined in [forge.ts:315](https://github.com/KZen-networks/sotez/blob/80ad203/src/forge.ts#L315)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`op` | [ConstructedOperation](../interfaces/_forge_.constructedoperation.md) | Operation to forge |

**Returns:** *string*

Forged operation bytes

___

### `Const` address

▸ **address**(`address`: string, `protocol?`: undefined | string): *string*

*Defined in [forge.ts:162](https://github.com/KZen-networks/sotez/blob/80ad203/src/forge.ts#L162)*

Address to forge

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |
`protocol?` | undefined &#124; string |

**Returns:** *string*

Forged address bytes

___

### `Const` ballot

▸ **ballot**(`op`: [ConstructedOperation](../interfaces/_forge_.constructedoperation.md)): *string*

*Defined in [forge.ts:339](https://github.com/KZen-networks/sotez/blob/80ad203/src/forge.ts#L339)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`op` | [ConstructedOperation](../interfaces/_forge_.constructedoperation.md) | Operation to forge |

**Returns:** *string*

Forged operation bytes

___

### `Const` bool

▸ **bool**(`bool`: boolean): *string*

*Defined in [forge.ts:96](https://github.com/KZen-networks/sotez/blob/80ad203/src/forge.ts#L96)*

Boolean value to convert

**Parameters:**

Name | Type |
------ | ------ |
`bool` | boolean |

**Returns:** *string*

The converted boolean

___

### `Const` decodeRawBytes

▸ **decodeRawBytes**(`bytes`: string): *[Micheline](_forge_.md#micheline)*

*Defined in [forge.ts:526](https://github.com/KZen-networks/sotez/blob/80ad203/src/forge.ts#L526)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`bytes` | string | The bytes to decode |

**Returns:** *[Micheline](_forge_.md#micheline)*

Decoded raw bytes

___

### `Const` delegation

▸ **delegation**(`op`: [ConstructedOperation](../interfaces/_forge_.constructedoperation.md), `protocol`: string): *string*

*Defined in [forge.ts:458](https://github.com/KZen-networks/sotez/blob/80ad203/src/forge.ts#L458)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`op` | [ConstructedOperation](../interfaces/_forge_.constructedoperation.md) | Operation to forge |
`protocol` | string | Current protocol |

**Returns:** *string*

Forged operation bytes

___

### `Const` doubleBakingEvidence

▸ **doubleBakingEvidence**(`op`: [ConstructedOperation](../interfaces/_forge_.constructedoperation.md)): *string*

*Defined in [forge.ts:306](https://github.com/KZen-networks/sotez/blob/80ad203/src/forge.ts#L306)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`op` | [ConstructedOperation](../interfaces/_forge_.constructedoperation.md) | Operation to forge |

**Returns:** *string*

Forged operation bytes

___

### `Const` doubleEndorsementEvidence

▸ **doubleEndorsementEvidence**(`op`: [ConstructedOperation](../interfaces/_forge_.constructedoperation.md)): *string*

*Defined in [forge.ts:296](https://github.com/KZen-networks/sotez/blob/80ad203/src/forge.ts#L296)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`op` | [ConstructedOperation](../interfaces/_forge_.constructedoperation.md) | Operation to forge |

**Returns:** *string*

Forged operation bytes

___

### `Const` encodeRawBytes

▸ **encodeRawBytes**(`input`: [Micheline](_forge_.md#micheline)): *string*

*Defined in [forge.ts:625](https://github.com/KZen-networks/sotez/blob/80ad203/src/forge.ts#L625)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`input` | [Micheline](_forge_.md#micheline) | The value to encode |

**Returns:** *string*

Encoded value as bytes

___

### `Const` endorsement

▸ **endorsement**(`op`: [ConstructedOperation](../interfaces/_forge_.constructedoperation.md)): *string*

*Defined in [forge.ts:271](https://github.com/KZen-networks/sotez/blob/80ad203/src/forge.ts#L271)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`op` | [ConstructedOperation](../interfaces/_forge_.constructedoperation.md) | Operation to forge |

**Returns:** *string*

___

### `Const` forge

▸ **forge**(`opOb`: [OperationObject](../interfaces/_forge_.operationobject.md), `counter`: number, `protocol`: string): *Promise‹[ForgedBytes](../interfaces/_forge_.forgedbytes.md)›*

*Defined in [forge.ts:498](https://github.com/KZen-networks/sotez/blob/80ad203/src/forge.ts#L498)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`opOb` | [OperationObject](../interfaces/_forge_.operationobject.md) | The operation object(s) |
`counter` | number | The current counter for the account |
`protocol` | string | - |

**Returns:** *Promise‹[ForgedBytes](../interfaces/_forge_.forgedbytes.md)›*

Forged operation bytes
```javascript
forge.forge({
  branch: head.hash,
  contents: [{
    kind: 'transaction',
    source: 'tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4',
    fee: '50000',
    counter: '31204',
    gas_limit: '10200',
    storage_limit: '0',
    amount: '100000000',
    destination: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
  }],
}, 32847).then(({ opbytes, opOb }) => console.log(opbytes, opOb));
```

___

### `Const` op

▸ **op**(`op`: [ConstructedOperation](../interfaces/_forge_.constructedoperation.md), `protocol`: string): *string*

*Defined in [forge.ts:227](https://github.com/KZen-networks/sotez/blob/80ad203/src/forge.ts#L227)*

Operation to forge

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`op` | [ConstructedOperation](../interfaces/_forge_.constructedoperation.md) | - |
`protocol` | string | Current protocol |

**Returns:** *string*

Forged operation bytes

___

### `Const` origination

▸ **origination**(`op`: [ConstructedOperation](../interfaces/_forge_.constructedoperation.md), `protocol`: string): *string*

*Defined in [forge.ts:412](https://github.com/KZen-networks/sotez/blob/80ad203/src/forge.ts#L412)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`op` | [ConstructedOperation](../interfaces/_forge_.constructedoperation.md) | Operation to forge |
`protocol` | string | Current protocol |

**Returns:** *string*

Forged operation bytes

___

### `Const` parameters

▸ **parameters**(`parameter`: any, `protocol`: string): *string*

*Defined in [forge.ts:116](https://github.com/KZen-networks/sotez/blob/80ad203/src/forge.ts#L116)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parameter` | any | Script to forge |
`protocol` | string | - |

**Returns:** *string*

Forged parameter bytes

___

### `Const` proposals

▸ **proposals**(`op`: [ConstructedOperation](../interfaces/_forge_.constructedoperation.md)): *string*

*Defined in [forge.ts:330](https://github.com/KZen-networks/sotez/blob/80ad203/src/forge.ts#L330)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`op` | [ConstructedOperation](../interfaces/_forge_.constructedoperation.md) | Operation to forge |

**Returns:** *string*

Forged operation bytes

___

### `Const` publicKey

▸ **publicKey**(`pk`: string): *string*

*Defined in [forge.ts:208](https://github.com/KZen-networks/sotez/blob/80ad203/src/forge.ts#L208)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`pk` | string | Public key to forge |

**Returns:** *string*

Forged public key bytes

___

### `Const` publicKeyHash

▸ **publicKeyHash**(`pkh`: string): *string*

*Defined in [forge.ts:149](https://github.com/KZen-networks/sotez/blob/80ad203/src/forge.ts#L149)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`pkh` | string | Public key hash to forge |

**Returns:** *string*

Forged public key hash bytes

___

### `Const` reveal

▸ **reveal**(`op`: [ConstructedOperation](../interfaces/_forge_.constructedoperation.md), `protocol`: string): *string*

*Defined in [forge.ts:366](https://github.com/KZen-networks/sotez/blob/80ad203/src/forge.ts#L366)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`op` | [ConstructedOperation](../interfaces/_forge_.constructedoperation.md) | Operation to forge |
`protocol` | string | Current protocol |

**Returns:** *string*

Forged operation bytes

___

### `Const` script

▸ **script**(`script`: object): *string*

*Defined in [forge.ts:105](https://github.com/KZen-networks/sotez/blob/80ad203/src/forge.ts#L105)*

Script to forge

**Parameters:**

▪ **script**: *object*

Name | Type |
------ | ------ |
`code` | [Micheline](_forge_.md#micheline) |
`storage` | [Micheline](_forge_.md#micheline) |

**Returns:** *string*

Forged script bytes

___

### `Const` seedNonceRevelation

▸ **seedNonceRevelation**(`op`: [ConstructedOperation](../interfaces/_forge_.constructedoperation.md)): *string*

*Defined in [forge.ts:281](https://github.com/KZen-networks/sotez/blob/80ad203/src/forge.ts#L281)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`op` | [ConstructedOperation](../interfaces/_forge_.constructedoperation.md) | Operation to forge |

**Returns:** *string*

Forged operation bytes

___

### `Const` toBytesInt32

▸ **toBytesInt32**(`num`: number): *any*

*Defined in [forge.ts:69](https://github.com/KZen-networks/sotez/blob/80ad203/src/forge.ts#L69)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`num` | number | Number to convert to bytes |

**Returns:** *any*

The converted number

___

### `Const` toBytesInt32Hex

▸ **toBytesInt32Hex**(`num`: number): *string*

*Defined in [forge.ts:86](https://github.com/KZen-networks/sotez/blob/80ad203/src/forge.ts#L86)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`num` | number | Number to convert to hex |

**Returns:** *string*

The converted number

___

### `Const` transaction

▸ **transaction**(`op`: [ConstructedOperation](../interfaces/_forge_.constructedoperation.md), `protocol`: string): *string*

*Defined in [forge.ts:385](https://github.com/KZen-networks/sotez/blob/80ad203/src/forge.ts#L385)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`op` | [ConstructedOperation](../interfaces/_forge_.constructedoperation.md) | Operation to forge |
`protocol` | string | Current protocol |

**Returns:** *string*

Forged operation bytes

___

### `Const` zarith

▸ **zarith**(`n`: string): *string*

*Defined in [forge.ts:181](https://github.com/KZen-networks/sotez/blob/80ad203/src/forge.ts#L181)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`n` | string | Zarith to forge |

**Returns:** *string*

Forged zarith bytes