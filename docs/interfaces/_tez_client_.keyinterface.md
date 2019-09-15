[Sotez Documentation](../README.md) › ["tez-client"](../modules/_tez_client_.md) › [KeyInterface](_tez_client_.keyinterface.md)

# Interface: KeyInterface


## Hierarchy

* **KeyInterface**

## Index

### Properties

* [_isLedger](_tez_client_.keyinterface.md#_isledger)
* [_isSecret](_tez_client_.keyinterface.md#_issecret)
* [_ledgerCurve](_tez_client_.keyinterface.md#_ledgercurve)
* [_ledgerPath](_tez_client_.keyinterface.md#_ledgerpath)
* [_publicKey](_tez_client_.keyinterface.md#_publickey)
* [_secretKey](_tez_client_.keyinterface.md#optional-_secretkey)
* [curve](_tez_client_.keyinterface.md#curve)
* [initialize](_tez_client_.keyinterface.md#initialize)
* [isLedger](_tez_client_.keyinterface.md#isledger)
* [ledgerCurve](_tez_client_.keyinterface.md#ledgercurve)
* [ledgerPath](_tez_client_.keyinterface.md#ledgerpath)
* [publicKey](_tez_client_.keyinterface.md#publickey)
* [publicKeyHash](_tez_client_.keyinterface.md#publickeyhash)
* [ready](_tez_client_.keyinterface.md#ready)
* [secretKey](_tez_client_.keyinterface.md#secretkey)
* [sign](_tez_client_.keyinterface.md#sign)

## Properties

###  _isLedger

• **_isLedger**: *boolean*

*Defined in [tez-client.ts:14](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L14)*

___

###  _isSecret

• **_isSecret**: *boolean*

*Defined in [tez-client.ts:17](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L17)*

___

###  _ledgerCurve

• **_ledgerCurve**: *number*

*Defined in [tez-client.ts:16](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L16)*

___

###  _ledgerPath

• **_ledgerPath**: *string*

*Defined in [tez-client.ts:15](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L15)*

___

###  _publicKey

• **_publicKey**: *Buffer*

*Defined in [tez-client.ts:12](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L12)*

___

### `Optional` _secretKey

• **_secretKey**? : *Buffer*

*Defined in [tez-client.ts:13](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L13)*

___

###  curve

• **curve**: *string*

*Defined in [tez-client.ts:22](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L22)*

___

###  initialize

• **initialize**: *function*

*Defined in [tez-client.ts:23](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L23)*

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

*Defined in [tez-client.ts:18](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L18)*

___

###  ledgerCurve

• **ledgerCurve**: *number*

*Defined in [tez-client.ts:20](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L20)*

___

###  ledgerPath

• **ledgerPath**: *string*

*Defined in [tez-client.ts:19](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L19)*

___

###  publicKey

• **publicKey**: *function*

*Defined in [tez-client.ts:24](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L24)*

#### Type declaration:

▸ (): *string*

___

###  publicKeyHash

• **publicKeyHash**: *function*

*Defined in [tez-client.ts:26](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L26)*

#### Type declaration:

▸ (): *string*

___

###  ready

• **ready**: *Promise‹void›*

*Defined in [tez-client.ts:21](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L21)*

___

###  secretKey

• **secretKey**: *function*

*Defined in [tez-client.ts:25](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L25)*

#### Type declaration:

▸ (): *string*

___

###  sign

• **sign**: *function*

*Defined in [tez-client.ts:27](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L27)*

#### Type declaration:

▸ (`bytes`: string, `wm`: Uint8Array): *Promise‹[Signed](_tez_client_.signed.md)›*

**Parameters:**

Name | Type |
------ | ------ |
`bytes` | string |
`wm` | Uint8Array |