**[Sotez Documentation](../README.md)**

[Globals](../README.md) › [&quot;sotez&quot;](../modules/_sotez_.md) › [KeyInterface](_sotez_.keyinterface.md)

# Interface: KeyInterface

## Hierarchy

* **KeyInterface**

## Index

### Properties

* [_isLedger](_sotez_.keyinterface.md#_isledger)
* [_isSecret](_sotez_.keyinterface.md#_issecret)
* [_ledgerCurve](_sotez_.keyinterface.md#_ledgercurve)
* [_ledgerPath](_sotez_.keyinterface.md#_ledgerpath)
* [_publicKey](_sotez_.keyinterface.md#_publickey)
* [_secretKey](_sotez_.keyinterface.md#optional-_secretkey)
* [curve](_sotez_.keyinterface.md#curve)
* [initialize](_sotez_.keyinterface.md#initialize)
* [isLedger](_sotez_.keyinterface.md#isledger)
* [ledgerCurve](_sotez_.keyinterface.md#ledgercurve)
* [ledgerPath](_sotez_.keyinterface.md#ledgerpath)
* [publicKey](_sotez_.keyinterface.md#publickey)
* [publicKeyHash](_sotez_.keyinterface.md#publickeyhash)
* [ready](_sotez_.keyinterface.md#ready)
* [secretKey](_sotez_.keyinterface.md#secretkey)
* [sign](_sotez_.keyinterface.md#sign)

## Properties

###  _isLedger

• **_isLedger**: *boolean*

*Defined in [sotez.ts:12](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L12)*

___

###  _isSecret

• **_isSecret**: *boolean*

*Defined in [sotez.ts:15](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L15)*

___

###  _ledgerCurve

• **_ledgerCurve**: *number*

*Defined in [sotez.ts:14](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L14)*

___

###  _ledgerPath

• **_ledgerPath**: *string*

*Defined in [sotez.ts:13](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L13)*

___

###  _publicKey

• **_publicKey**: *Buffer*

*Defined in [sotez.ts:10](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L10)*

___

### `Optional` _secretKey

• **_secretKey**? : *Buffer*

*Defined in [sotez.ts:11](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L11)*

___

###  curve

• **curve**: *string*

*Defined in [sotez.ts:20](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L20)*

___

###  initialize

• **initialize**: *function*

*Defined in [sotez.ts:21](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L21)*

#### Type declaration:

▸ (`key`: string, `passphrase?`: undefined | string, `email?`: undefined | string, `resolve?`: any): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`passphrase?` | undefined &#124; string |
`email?` | undefined &#124; string |
`resolve?` | any |

___

###  isLedger

• **isLedger**: *boolean*

*Defined in [sotez.ts:16](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L16)*

___

###  ledgerCurve

• **ledgerCurve**: *number*

*Defined in [sotez.ts:18](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L18)*

___

###  ledgerPath

• **ledgerPath**: *string*

*Defined in [sotez.ts:17](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L17)*

___

###  publicKey

• **publicKey**: *function*

*Defined in [sotez.ts:22](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L22)*

#### Type declaration:

▸ (): *string*

___

###  publicKeyHash

• **publicKeyHash**: *function*

*Defined in [sotez.ts:24](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L24)*

#### Type declaration:

▸ (): *string*

___

###  ready

• **ready**: *Promise‹void›*

*Defined in [sotez.ts:19](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L19)*

___

###  secretKey

• **secretKey**: *function*

*Defined in [sotez.ts:23](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L23)*

#### Type declaration:

▸ (): *string*

___

###  sign

• **sign**: *function*

*Defined in [sotez.ts:25](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L25)*

#### Type declaration:

▸ (`bytes`: string, `wm`: Uint8Array): *Promise‹[Signed](_sotez_.signed.md)›*

**Parameters:**

Name | Type |
------ | ------ |
`bytes` | string |
`wm` | Uint8Array |