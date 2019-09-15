[Sotez Documentation](../README.md) › ["party2"](../modules/_party2_.md) › [Party2](_party2_.party2.md)

# Class: Party2


## Hierarchy

* **Party2**

## Index

### Constructors

* [constructor](_party2_.party2.md#constructor)

### Properties

* [_p2](_party2_.party2.md#_p2)
* [_p2Share](_party2_.party2.md#_p2share)
* [ready](_party2_.party2.md#ready)

### Methods

* [initialize](_party2_.party2.md#initialize)
* [publicKey](_party2_.party2.md#publickey)
* [publicKeyHash](_party2_.party2.md#publickeyhash)
* [secretShare](_party2_.party2.md#secretshare)
* [sign](_party2_.party2.md#sign)

## Constructors

###  constructor

\+ **new Party2**(`p2`: Ed25519Party2, `p2Share?`: Ed25519Party2Share): *[Party2](_party2_.party2.md)*

*Defined in [party2.ts:10](https://github.com/KZen-networks/sotez/blob/80ad203/src/party2.ts#L10)*

**Parameters:**

Name | Type |
------ | ------ |
`p2` | Ed25519Party2 |
`p2Share?` | Ed25519Party2Share |

**Returns:** *[Party2](_party2_.party2.md)*

## Properties

###  _p2

• **_p2**: *Ed25519Party2*

*Defined in [party2.ts:8](https://github.com/KZen-networks/sotez/blob/80ad203/src/party2.ts#L8)*

___

###  _p2Share

• **_p2Share**: *Ed25519Party2Share | undefined*

*Defined in [party2.ts:9](https://github.com/KZen-networks/sotez/blob/80ad203/src/party2.ts#L9)*

___

###  ready

• **ready**: *Promise‹void›*

*Defined in [party2.ts:10](https://github.com/KZen-networks/sotez/blob/80ad203/src/party2.ts#L10)*

## Methods

###  initialize

▸ **initialize**(): *Promise‹void›*

*Defined in [party2.ts:18](https://github.com/KZen-networks/sotez/blob/80ad203/src/party2.ts#L18)*

**Returns:** *Promise‹void›*

___

###  publicKey

▸ **publicKey**(): *string*

*Defined in [party2.ts:37](https://github.com/KZen-networks/sotez/blob/80ad203/src/party2.ts#L37)*

**Returns:** *string*

The shared (aggregated) public key associated with the secret share

___

###  publicKeyHash

▸ **publicKeyHash**(): *string*

*Defined in [party2.ts:47](https://github.com/KZen-networks/sotez/blob/80ad203/src/party2.ts#L47)*

**Returns:** *string*

The public key hash (address) for this secret share

___

###  secretShare

▸ **secretShare**(): *Ed25519Party2Share*

*Defined in [party2.ts:30](https://github.com/KZen-networks/sotez/blob/80ad203/src/party2.ts#L30)*

**Returns:** *Ed25519Party2Share*

Party two's secret share

___

###  sign

▸ **sign**(`bytes`: string, `watermark`: Uint8Array): *Promise‹object›*

*Defined in [party2.ts:57](https://github.com/KZen-networks/sotez/blob/80ad203/src/party2.ts#L57)*

**Parameters:**

Name | Type |
------ | ------ |
`bytes` | string |
`watermark` | Uint8Array |

**Returns:** *Promise‹object›*

JSON object containing the Ed25519 signature on given bytes and watermark