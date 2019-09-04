**[Sotez Documentation](../README.md)**

[Globals](../README.md) › ["utility"](_utility_.md)

# External module: "utility"

## Index

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

## Variables

### `Const` mintotz

• **mintotz**: *[totez]()* =  totez

*Defined in [utility.ts:283](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/utility.ts#L283)*

___

### `Const` ml2tzjson

• **ml2tzjson**: *[sexp2mic]()* =  sexp2mic

*Defined in [utility.ts:280](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/utility.ts#L280)*

___

### `Const` mlraw2json

• **mlraw2json**: *[ml2mic]()* =  ml2mic

*Defined in [utility.ts:282](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/utility.ts#L282)*

___

### `Const` tzjson2arr

• **tzjson2arr**: *[mic2arr]()* =  mic2arr

*Defined in [utility.ts:281](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/utility.ts#L281)*

___

### `Const` tztomin

• **tztomin**: *[mutez]()* =  mutez

*Defined in [utility.ts:284](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/utility.ts#L284)*

## Functions

### `Const` b582int

▸ **b582int**(`v`: string): *string*

*Defined in [utility.ts:14](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/utility.ts#L14)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`v` | string | The b58 value |

**Returns:** *string*

The converted b58 value

___

### `Const` b58cdecode

▸ **b58cdecode**(`enc`: string, `prefixArg`: Uint8Array): *Uint8Array*

*Defined in [utility.ts:64](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/utility.ts#L64)*

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

*Defined in [utility.ts:50](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/utility.ts#L50)*

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

*Defined in [utility.ts:71](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/utility.ts#L71)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`buffer` | Buffer | The buffer to convert to hex |

**Returns:** *string*

Converted hex value

___

### `Const` hex2buf

▸ **hex2buf**(`hex`: string): *Uint8Array*

*Defined in [utility.ts:87](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/utility.ts#L87)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hex` | string | The hex to convert to buffer |

**Returns:** *Uint8Array*

Converted buffer value

___

### `Const` hexNonce

▸ **hexNonce**(`length`: number): *string*

*Defined in [utility.ts:97](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/utility.ts#L97)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`length` | number | The length of the nonce |

**Returns:** *string*

The nonce of the given length

___

### `Const` mergebuf

▸ **mergebuf**(`b1`: Uint8Array, `b2`: Uint8Array): *Uint8Array*

*Defined in [utility.ts:112](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/utility.ts#L112)*

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

*Defined in [utility.ts:172](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/utility.ts#L172)*

**Parameters:**

Name | Type |
------ | ------ |
`s` | any |

**Returns:** *any*

___

### `Const` ml2mic

▸ **ml2mic**(`mi`: string): *any*

*Defined in [utility.ts:215](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/utility.ts#L215)*

**Parameters:**

Name | Type |
------ | ------ |
`mi` | string |

**Returns:** *any*

___

### `Const` mutez

▸ **mutez**(`tez`: number): *string*

*Defined in [utility.ts:42](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/utility.ts#L42)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tez` | number | The amount in tez to convert to mutez |

**Returns:** *string*

The tez amount converted to mutez

___

### `Const` sexp2mic

▸ **sexp2mic**(`mi`: string): *any*

*Defined in [utility.ts:119](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/utility.ts#L119)*

**Parameters:**

Name | Type |
------ | ------ |
`mi` | string |

**Returns:** *any*

___

### `Const` textDecode

▸ **textDecode**(`buffer`: Uint8Array): *string*

*Defined in [utility.ts:7](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/utility.ts#L7)*

**Parameters:**

Name | Type |
------ | ------ |
`buffer` | Uint8Array |

**Returns:** *string*

___

### `Const` textEncode

▸ **textEncode**(`value`: string): *Uint8Array*

*Defined in [utility.ts:5](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/utility.ts#L5)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *Uint8Array*

___

### `Const` totez

▸ **totez**(`mutez`: number): *number*

*Defined in [utility.ts:28](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/utility.ts#L28)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`mutez` | number | The amount in mutez to convert to tez |

**Returns:** *number*

The mutez amount converted to tez