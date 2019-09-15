[Sotez Documentation](../README.md) › ["utility"](_utility_.md)

# External module: "utility"


## Index

### Interfaces

* [MichelineArray](../interfaces/_utility_.michelinearray.md)

### Type aliases

* [Micheline](_utility_.md#micheline)

### Variables

* [mintotz](_utility_.md#const-mintotz)
* [ml2tzjson](_utility_.md#const-ml2tzjson)
* [mlraw2json](_utility_.md#const-mlraw2json)
* [tzjson2arr](_utility_.md#const-tzjson2arr)
* [tztomin](_utility_.md#const-tztomin)

### Functions

* [b582int](_utility_.md#const-b582int)
* [b58cdecode](_utility_.md#const-b58cdecode)
* [b58cencode](_utility_.md#const-b58cencode)
* [buf2hex](_utility_.md#const-buf2hex)
* [hex2buf](_utility_.md#const-hex2buf)
* [hexNonce](_utility_.md#const-hexnonce)
* [mergebuf](_utility_.md#const-mergebuf)
* [mic2arr](_utility_.md#const-mic2arr)
* [ml2mic](_utility_.md#const-ml2mic)
* [mutez](_utility_.md#const-mutez)
* [sexp2mic](_utility_.md#const-sexp2mic)
* [textDecode](_utility_.md#const-textdecode)
* [textEncode](_utility_.md#const-textencode)
* [totez](_utility_.md#const-totez)

## Type aliases

###  Micheline

Ƭ **Micheline**: *object | object | object | object | object | object | object | object | object | [MichelineArray](../interfaces/_utility_.michelinearray.md)*

*Defined in [utility.ts:5](https://github.com/KZen-networks/sotez/blob/80ad203/src/utility.ts#L5)*

## Variables

### `Const` mintotz

• **mintotz**: *[totez](undefined)* =  totez

*Defined in [utility.ts:300](https://github.com/KZen-networks/sotez/blob/80ad203/src/utility.ts#L300)*

___

### `Const` ml2tzjson

• **ml2tzjson**: *[sexp2mic](undefined)* =  sexp2mic

*Defined in [utility.ts:297](https://github.com/KZen-networks/sotez/blob/80ad203/src/utility.ts#L297)*

___

### `Const` mlraw2json

• **mlraw2json**: *[ml2mic](undefined)* =  ml2mic

*Defined in [utility.ts:299](https://github.com/KZen-networks/sotez/blob/80ad203/src/utility.ts#L299)*

___

### `Const` tzjson2arr

• **tzjson2arr**: *[mic2arr](undefined)* =  mic2arr

*Defined in [utility.ts:298](https://github.com/KZen-networks/sotez/blob/80ad203/src/utility.ts#L298)*

___

### `Const` tztomin

• **tztomin**: *[mutez](undefined)* =  mutez

*Defined in [utility.ts:301](https://github.com/KZen-networks/sotez/blob/80ad203/src/utility.ts#L301)*

## Functions

### `Const` b582int

▸ **b582int**(`v`: string): *string*

*Defined in [utility.ts:31](https://github.com/KZen-networks/sotez/blob/80ad203/src/utility.ts#L31)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`v` | string | The b58 value |

**Returns:** *string*

The converted b58 value

___

### `Const` b58cdecode

▸ **b58cdecode**(`enc`: string, `prefixArg`: Uint8Array): *Uint8Array*

*Defined in [utility.ts:81](https://github.com/KZen-networks/sotez/blob/80ad203/src/utility.ts#L81)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`enc` | string | - |
`prefixArg` | Uint8Array | The Uint8Array prefix values |

**Returns:** *Uint8Array*

The decoded base58 value

___

### `Const` b58cencode

▸ **b58cencode**(`payload`: Uint8Array, `prefixArg`: Uint8Array): *string*

*Defined in [utility.ts:67](https://github.com/KZen-networks/sotez/blob/80ad203/src/utility.ts#L67)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`payload` | Uint8Array | The value to encode |
`prefixArg` | Uint8Array | The Uint8Array prefix values |

**Returns:** *string*

The base58 encoded value

___

### `Const` buf2hex

▸ **buf2hex**(`buffer`: Buffer): *string*

*Defined in [utility.ts:88](https://github.com/KZen-networks/sotez/blob/80ad203/src/utility.ts#L88)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`buffer` | Buffer | The buffer to convert to hex |

**Returns:** *string*

Converted hex value

___

### `Const` hex2buf

▸ **hex2buf**(`hex`: string): *Uint8Array*

*Defined in [utility.ts:104](https://github.com/KZen-networks/sotez/blob/80ad203/src/utility.ts#L104)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hex` | string | The hex to convert to buffer |

**Returns:** *Uint8Array*

Converted buffer value

___

### `Const` hexNonce

▸ **hexNonce**(`length`: number): *string*

*Defined in [utility.ts:114](https://github.com/KZen-networks/sotez/blob/80ad203/src/utility.ts#L114)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`length` | number | The length of the nonce |

**Returns:** *string*

The nonce of the given length

___

### `Const` mergebuf

▸ **mergebuf**(`b1`: Uint8Array, `b2`: Uint8Array): *Uint8Array*

*Defined in [utility.ts:129](https://github.com/KZen-networks/sotez/blob/80ad203/src/utility.ts#L129)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`b1` | Uint8Array | The first buffer |
`b2` | Uint8Array | The second buffer |

**Returns:** *Uint8Array*

The merged buffer

___

### `Const` mic2arr

▸ **mic2arr**(`s`: any): *any*

*Defined in [utility.ts:189](https://github.com/KZen-networks/sotez/blob/80ad203/src/utility.ts#L189)*

**Parameters:**

Name | Type |
------ | ------ |
`s` | any |

**Returns:** *any*

___

### `Const` ml2mic

▸ **ml2mic**(`mi`: string): *[Micheline](_utility_.md#micheline)*

*Defined in [utility.ts:232](https://github.com/KZen-networks/sotez/blob/80ad203/src/utility.ts#L232)*

**Parameters:**

Name | Type |
------ | ------ |
`mi` | string |

**Returns:** *[Micheline](_utility_.md#micheline)*

___

### `Const` mutez

▸ **mutez**(`tez`: number): *string*

*Defined in [utility.ts:59](https://github.com/KZen-networks/sotez/blob/80ad203/src/utility.ts#L59)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tez` | number | The amount in tez to convert to mutez |

**Returns:** *string*

The tez amount converted to mutez

___

### `Const` sexp2mic

▸ **sexp2mic**(`mi`: string): *[Micheline](_utility_.md#micheline)*

*Defined in [utility.ts:136](https://github.com/KZen-networks/sotez/blob/80ad203/src/utility.ts#L136)*

**Parameters:**

Name | Type |
------ | ------ |
`mi` | string |

**Returns:** *[Micheline](_utility_.md#micheline)*

___

### `Const` textDecode

▸ **textDecode**(`buffer`: Uint8Array): *string*

*Defined in [utility.ts:24](https://github.com/KZen-networks/sotez/blob/80ad203/src/utility.ts#L24)*

**Parameters:**

Name | Type |
------ | ------ |
`buffer` | Uint8Array |

**Returns:** *string*

___

### `Const` textEncode

▸ **textEncode**(`value`: string): *Uint8Array*

*Defined in [utility.ts:22](https://github.com/KZen-networks/sotez/blob/80ad203/src/utility.ts#L22)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *Uint8Array*

___

### `Const` totez

▸ **totez**(`mutez`: number): *number*

*Defined in [utility.ts:45](https://github.com/KZen-networks/sotez/blob/80ad203/src/utility.ts#L45)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`mutez` | number | The amount in mutez to convert to tez |

**Returns:** *number*

The mutez amount converted to tez