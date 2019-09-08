**[Sotez Documentation](../README.md)**

[Globals](../README.md) › ["forge"](_forge_.md)

# External module: "forge"

## Index

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

## Functions

### `Const` activateAccount

▸ **activateAccount**(`op`: ConstructedOperation): *string*

*Defined in [forge.ts:263](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/forge.ts#L263)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`op` | ConstructedOperation | Operation to forge |

**Returns:** *string*

Forged operation bytes

___

### `Const` address

▸ **address**(`address`: string, `protocol?`: undefined | string): *string*

*Defined in [forge.ts:110](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/forge.ts#L110)*

Address to forge

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |
`protocol?` | undefined \| string |

**Returns:** *string*

Forged address bytes

___

### `Const` ballot

▸ **ballot**(`op`: ConstructedOperation): *string*

*Defined in [forge.ts:287](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/forge.ts#L287)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`op` | ConstructedOperation | Operation to forge |

**Returns:** *string*

Forged operation bytes

___

### `Const` bool

▸ **bool**(`bool`: boolean): *string*

*Defined in [forge.ts:44](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/forge.ts#L44)*

Boolean value to convert

**Parameters:**

Name | Type |
------ | ------ |
`bool` | boolean |

**Returns:** *string*

The converted boolean

___

### `Const` decodeRawBytes

▸ **decodeRawBytes**(`bytes`: string): *any*

*Defined in [forge.ts:474](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/forge.ts#L474)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`bytes` | string | The bytes to decode |

**Returns:** *any*

Decoded raw bytes

___

### `Const` delegation

▸ **delegation**(`op`: ConstructedOperation, `protocol`: string): *string*

*Defined in [forge.ts:406](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/forge.ts#L406)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`op` | ConstructedOperation | Operation to forge |
`protocol` | string | Current protocol |

**Returns:** *string*

Forged operation bytes

___

### `Const` doubleBakingEvidence

▸ **doubleBakingEvidence**(`op`: ConstructedOperation): *string*

*Defined in [forge.ts:254](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/forge.ts#L254)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`op` | ConstructedOperation | Operation to forge |

**Returns:** *string*

Forged operation bytes

___

### `Const` doubleEndorsementEvidence

▸ **doubleEndorsementEvidence**(`op`: ConstructedOperation): *string*

*Defined in [forge.ts:244](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/forge.ts#L244)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`op` | ConstructedOperation | Operation to forge |

**Returns:** *string*

Forged operation bytes

___

### `Const` encodeRawBytes

▸ **encodeRawBytes**(`input`: any): *string*

*Defined in [forge.ts:573](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/forge.ts#L573)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`input` | any | The value to encode |

**Returns:** *string*

Encoded value as bytes

___

### `Const` endorsement

▸ **endorsement**(`op`: ConstructedOperation): *string*

*Defined in [forge.ts:219](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/forge.ts#L219)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`op` | ConstructedOperation | Operation to forge |

**Returns:** *string*

___

### `Const` forge

▸ **forge**(`opOb`: OperationObject, `counter`: number, `protocol`: string): *Promise‹ForgedBytes›*

*Defined in [forge.ts:446](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/forge.ts#L446)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`opOb` | OperationObject | The operation object(s) |
`counter` | number | The current counter for the account |
`protocol` | string | - |

**Returns:** *Promise‹ForgedBytes›*

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

▸ **op**(`op`: ConstructedOperation, `protocol`: string): *string*

*Defined in [forge.ts:175](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/forge.ts#L175)*

Operation to forge

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`op` | ConstructedOperation | - |
`protocol` | string | Current protocol |

**Returns:** *string*

Forged operation bytes

___

### `Const` origination

▸ **origination**(`op`: ConstructedOperation, `protocol`: string): *string*

*Defined in [forge.ts:360](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/forge.ts#L360)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`op` | ConstructedOperation | Operation to forge |
`protocol` | string | Current protocol |

**Returns:** *string*

Forged operation bytes

___

### `Const` parameters

▸ **parameters**(`parameter`: any, `protocol`: string): *string*

*Defined in [forge.ts:64](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/forge.ts#L64)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`parameter` | any | Script to forge |
`protocol` | string | - |

**Returns:** *string*

Forged parameter bytes

___

### `Const` proposals

▸ **proposals**(`op`: ConstructedOperation): *string*

*Defined in [forge.ts:278](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/forge.ts#L278)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`op` | ConstructedOperation | Operation to forge |

**Returns:** *string*

Forged operation bytes

___

### `Const` publicKey

▸ **publicKey**(`pk`: string): *string*

*Defined in [forge.ts:156](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/forge.ts#L156)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`pk` | string | Public key to forge |

**Returns:** *string*

Forged public key bytes

___

### `Const` publicKeyHash

▸ **publicKeyHash**(`pkh`: string): *string*

*Defined in [forge.ts:97](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/forge.ts#L97)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`pkh` | string | Public key hash to forge |

**Returns:** *string*

Forged public key hash bytes

___

### `Const` reveal

▸ **reveal**(`op`: ConstructedOperation, `protocol`: string): *string*

*Defined in [forge.ts:314](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/forge.ts#L314)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`op` | ConstructedOperation | Operation to forge |
`protocol` | string | Current protocol |

**Returns:** *string*

Forged operation bytes

___

### `Const` script

▸ **script**(`script`: object): *string*

*Defined in [forge.ts:53](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/forge.ts#L53)*

Script to forge

**Parameters:**

▪ **script**: *object*

Name | Type |
------ | ------ |
`code` | string |
`storage` | string |

**Returns:** *string*

Forged script bytes

___

### `Const` seedNonceRevelation

▸ **seedNonceRevelation**(`op`: ConstructedOperation): *string*

*Defined in [forge.ts:229](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/forge.ts#L229)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`op` | ConstructedOperation | Operation to forge |

**Returns:** *string*

Forged operation bytes

___

### `Const` toBytesInt32

▸ **toBytesInt32**(`num`: number): *any*

*Defined in [forge.ts:17](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/forge.ts#L17)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`num` | number | Number to convert to bytes |

**Returns:** *any*

The converted number

___

### `Const` toBytesInt32Hex

▸ **toBytesInt32Hex**(`num`: number): *string*

*Defined in [forge.ts:34](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/forge.ts#L34)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`num` | number | Number to convert to hex |

**Returns:** *string*

The converted number

___

### `Const` transaction

▸ **transaction**(`op`: ConstructedOperation, `protocol`: string): *string*

*Defined in [forge.ts:333](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/forge.ts#L333)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`op` | ConstructedOperation | Operation to forge |
`protocol` | string | Current protocol |

**Returns:** *string*

Forged operation bytes

___

### `Const` zarith

▸ **zarith**(`n`: string): *string*

*Defined in [forge.ts:129](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/forge.ts#L129)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`n` | string | Zarith to forge |

**Returns:** *string*

Forged zarith bytes