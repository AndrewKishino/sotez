**[Sotez Documentation](../README.md)**

[Globals](../README.md) › [&quot;tez-core&quot;](../modules/_tez_core_.md) › [AbstractTezModule](_tez_core_.abstracttezmodule.md)

# Class: AbstractTezModule

## Hierarchy

* **AbstractTezModule**

  * [Sotez](_sotez_.sotez.md)

## Index

### Constructors

* [constructor](_tez_core_.abstracttezmodule.md#constructor)

### Properties

* [_chain](_tez_core_.abstracttezmodule.md#_chain)
* [_provider](_tez_core_.abstracttezmodule.md#_provider)

### Accessors

* [chain](_tez_core_.abstracttezmodule.md#chain)
* [provider](_tez_core_.abstracttezmodule.md#provider)

### Methods

* [setProvider](_tez_core_.abstracttezmodule.md#setprovider)

## Constructors

###  constructor

\+ **new AbstractTezModule**(`provider`: string, `chain`: string): *[AbstractTezModule](_tez_core_.abstracttezmodule.md)*

*Defined in [tez-core.ts:3](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/tez-core.ts#L3)*

**Parameters:**

Name | Type |
------ | ------ |
`provider` | string |
`chain` | string |

**Returns:** *[AbstractTezModule](_tez_core_.abstracttezmodule.md)*

## Properties

###  _chain

• **_chain**: *string*

*Defined in [tez-core.ts:3](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/tez-core.ts#L3)*

___

###  _provider

• **_provider**: *string*

*Defined in [tez-core.ts:2](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/tez-core.ts#L2)*

## Accessors

###  chain

• **get chain**(): *string*

*Defined in [tez-core.ts:21](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/tez-core.ts#L21)*

**Returns:** *string*

• **set chain**(`value`: string): *void*

*Defined in [tez-core.ts:25](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/tez-core.ts#L25)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *void*

___

###  provider

• **get provider**(): *string*

*Defined in [tez-core.ts:13](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/tez-core.ts#L13)*

**Returns:** *string*

• **set provider**(`provider`: string): *void*

*Defined in [tez-core.ts:17](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/tez-core.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`provider` | string |

**Returns:** *void*

## Methods

###  setProvider

▸ **setProvider**(`provider`: string, `chain`: string): *void*

*Defined in [tez-core.ts:29](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/tez-core.ts#L29)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`provider` | string | - |
`chain` | string |  this.chain |

**Returns:** *void*