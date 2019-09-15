[Sotez Documentation](../README.md) › ["tez-client"](../modules/_tez_client_.md) › [TezClient](_tez_client_.tezclient.md)

# Class: TezClient


Main Client Library
```javascript
import Client from 'client';
const client = new Client('https://127.0.0.1:8732', 'main', { defaultFee: 1275 })
await client.importKey('edskRv6ZnkLQMVustbYHFPNsABu1Js6pEEWyMUFJQTqEZjVCU2WHh8ckcc7YA4uBzPiJjZCsv3pC1NDdV99AnyLzPjSip4uC3y');
client.transfer({
  to: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
  amount: '1000000',
});
```

## Hierarchy

* [AbstractTezModule](_tez_core_.abstracttezmodule.md)

  ↳ **TezClient**

## Index

### Constructors

* [constructor](_tez_client_.tezclient.md#constructor)

### Properties

* [_chain](_tez_client_.tezclient.md#_chain)
* [_counters](_tez_client_.tezclient.md#_counters)
* [_debugMode](_tez_client_.tezclient.md#_debugmode)
* [_defaultFee](_tez_client_.tezclient.md#_defaultfee)
* [_localForge](_tez_client_.tezclient.md#_localforge)
* [_provider](_tez_client_.tezclient.md#_provider)
* [_validateLocalForge](_tez_client_.tezclient.md#_validatelocalforge)
* [key](_tez_client_.tezclient.md#key)
* [party2](_tez_client_.tezclient.md#party2)

### Accessors

* [chain](_tez_client_.tezclient.md#chain)
* [counters](_tez_client_.tezclient.md#counters)
* [debugMode](_tez_client_.tezclient.md#debugmode)
* [defaultFee](_tez_client_.tezclient.md#defaultfee)
* [localForge](_tez_client_.tezclient.md#localforge)
* [provider](_tez_client_.tezclient.md#provider)
* [validateLocalForge](_tez_client_.tezclient.md#validatelocalforge)

### Methods

* [account](_tez_client_.tezclient.md#account)
* [activate](_tez_client_.tezclient.md#activate)
* [awaitOperation](_tez_client_.tezclient.md#awaitoperation)
* [call](_tez_client_.tezclient.md#call)
* [getBaker](_tez_client_.tezclient.md#getbaker)
* [getBalance](_tez_client_.tezclient.md#getbalance)
* [getBallotList](_tez_client_.tezclient.md#getballotlist)
* [getBallots](_tez_client_.tezclient.md#getballots)
* [getCounter](_tez_client_.tezclient.md#getcounter)
* [getCurrentPeriod](_tez_client_.tezclient.md#getcurrentperiod)
* [getCurrentProposal](_tez_client_.tezclient.md#getcurrentproposal)
* [getCurrentQuorum](_tez_client_.tezclient.md#getcurrentquorum)
* [getDelegate](_tez_client_.tezclient.md#getdelegate)
* [getHead](_tez_client_.tezclient.md#gethead)
* [getHeadHash](_tez_client_.tezclient.md#getheadhash)
* [getHeadMetadata](_tez_client_.tezclient.md#getheadmetadata)
* [getHeader](_tez_client_.tezclient.md#getheader)
* [getListings](_tez_client_.tezclient.md#getlistings)
* [getManager](_tez_client_.tezclient.md#getmanager)
* [getProposals](_tez_client_.tezclient.md#getproposals)
* [importEd25519Party2](_tez_client_.tezclient.md#imported25519party2)
* [importKey](_tez_client_.tezclient.md#importkey)
* [importLedger](_tez_client_.tezclient.md#importledger)
* [inject](_tez_client_.tezclient.md#inject)
* [originate](_tez_client_.tezclient.md#originate)
* [packData](_tez_client_.tezclient.md#packdata)
* [prepareOperation](_tez_client_.tezclient.md#prepareoperation)
* [query](_tez_client_.tezclient.md#query)
* [registerDelegate](_tez_client_.tezclient.md#registerdelegate)
* [runCode](_tez_client_.tezclient.md#runcode)
* [sendOperation](_tez_client_.tezclient.md#sendoperation)
* [setDelegate](_tez_client_.tezclient.md#setdelegate)
* [setProvider](_tez_client_.tezclient.md#setprovider)
* [silentInject](_tez_client_.tezclient.md#silentinject)
* [simulateOperation](_tez_client_.tezclient.md#simulateoperation)
* [transfer](_tez_client_.tezclient.md#transfer)
* [typecheckCode](_tez_client_.tezclient.md#typecheckcode)
* [typecheckData](_tez_client_.tezclient.md#typecheckdata)

## Constructors

###  constructor

\+ **new TezClient**(`provider`: string, `chain`: string, `options`: [ModuleOptions](../interfaces/_tez_client_.moduleoptions.md)): *[TezClient](_tez_client_.tezclient.md)*

*Overrides [AbstractTezModule](_tez_core_.abstracttezmodule.md).[constructor](_tez_core_.abstracttezmodule.md#constructor)*

*Defined in [tez-client.ts:246](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L246)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`provider` | string | "http://127.0.0.1:8732" |
`chain` | string | "main" |
`options` | [ModuleOptions](../interfaces/_tez_client_.moduleoptions.md) |  {} |

**Returns:** *[TezClient](_tez_client_.tezclient.md)*

## Properties

###  _chain

• **_chain**: *string*

*Inherited from [AbstractTezModule](_tez_core_.abstracttezmodule.md).[_chain](_tez_core_.abstracttezmodule.md#_chain)*

*Defined in [tez-core.ts:3](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-core.ts#L3)*

___

###  _counters

• **_counters**: *object*

*Defined in [tez-client.ts:244](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L244)*

#### Type declaration:

* \[ **key**: *string*\]: number

___

###  _debugMode

• **_debugMode**: *boolean*

*Defined in [tez-client.ts:243](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L243)*

___

###  _defaultFee

• **_defaultFee**: *number*

*Defined in [tez-client.ts:242](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L242)*

___

###  _localForge

• **_localForge**: *boolean*

*Defined in [tez-client.ts:240](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L240)*

___

###  _provider

• **_provider**: *string*

*Inherited from [AbstractTezModule](_tez_core_.abstracttezmodule.md).[_provider](_tez_core_.abstracttezmodule.md#_provider)*

*Defined in [tez-core.ts:2](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-core.ts#L2)*

___

###  _validateLocalForge

• **_validateLocalForge**: *boolean*

*Defined in [tez-client.ts:241](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L241)*

___

###  key

• **key**: *[KeyInterface](../interfaces/_tez_client_.keyinterface.md)*

*Defined in [tez-client.ts:245](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L245)*

___

###  party2

• **party2**: *[Party2](_party2_.party2.md)*

*Defined in [tez-client.ts:246](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L246)*

## Accessors

###  chain

• **get chain**(): *string*

*Inherited from [AbstractTezModule](_tez_core_.abstracttezmodule.md).[chain](_tez_core_.abstracttezmodule.md#chain)*

*Defined in [tez-core.ts:21](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-core.ts#L21)*

**Returns:** *string*

• **set chain**(`value`: string): *void*

*Inherited from [AbstractTezModule](_tez_core_.abstracttezmodule.md).[chain](_tez_core_.abstracttezmodule.md#chain)*

*Defined in [tez-core.ts:25](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-core.ts#L25)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *void*

___

###  counters

• **get counters**(): *object*

*Defined in [tez-client.ts:285](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L285)*

**Returns:** *object*

* \[ **key**: *string*\]: number

• **set counters**(`counters`: object): *void*

*Defined in [tez-client.ts:289](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L289)*

**Parameters:**

Name | Type |
------ | ------ |
`counters` | object |

**Returns:** *void*

___

###  debugMode

• **get debugMode**(): *boolean*

*Defined in [tez-client.ts:293](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L293)*

**Returns:** *boolean*

• **set debugMode**(`t`: boolean): *void*

*Defined in [tez-client.ts:297](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L297)*

**Parameters:**

Name | Type |
------ | ------ |
`t` | boolean |

**Returns:** *void*

___

###  defaultFee

• **get defaultFee**(): *number*

*Defined in [tez-client.ts:261](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L261)*

**Returns:** *number*

• **set defaultFee**(`fee`: number): *void*

*Defined in [tez-client.ts:265](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L265)*

**Parameters:**

Name | Type |
------ | ------ |
`fee` | number |

**Returns:** *void*

___

###  localForge

• **get localForge**(): *boolean*

*Defined in [tez-client.ts:269](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L269)*

**Returns:** *boolean*

• **set localForge**(`value`: boolean): *void*

*Defined in [tez-client.ts:273](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L273)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

___

###  provider

• **get provider**(): *string*

*Inherited from [AbstractTezModule](_tez_core_.abstracttezmodule.md).[provider](_tez_core_.abstracttezmodule.md#provider)*

*Defined in [tez-core.ts:13](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-core.ts#L13)*

**Returns:** *string*

• **set provider**(`provider`: string): *void*

*Inherited from [AbstractTezModule](_tez_core_.abstracttezmodule.md).[provider](_tez_core_.abstracttezmodule.md#provider)*

*Defined in [tez-core.ts:17](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-core.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`provider` | string |

**Returns:** *void*

___

###  validateLocalForge

• **get validateLocalForge**(): *boolean*

*Defined in [tez-client.ts:277](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L277)*

**Returns:** *boolean*

• **set validateLocalForge**(`value`: boolean): *void*

*Defined in [tez-client.ts:281](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L281)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

## Methods

###  account

▸ **account**(`__namedParameters`: object): *Promise‹any›*

*Defined in [tez-client.ts:439](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L439)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Default |
------ | ------ | ------ |
`balance` | number | - |
`delegatable` | undefined &#124; false &#124; true | - |
`delegate` | undefined &#124; string | - |
`fee` | number |  this.defaultFee |
`gasLimit` | number | 10600 |
`spendable` | undefined &#124; false &#124; true | - |
`storageLimit` | number | 257 |

**Returns:** *Promise‹any›*

Object containing the injected operation hash
```javascript
client.account({
  balance: 10,
  spendable: true,
  delegatable: true,
  delegate: 'tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4',
}).then(res => console.log(res.operations[0].metadata.operation_result.originated_contracts[0]));
```

___

###  activate

▸ **activate**(`pkh`: string, `secret`: string): *Promise‹any›*

*Defined in [tez-client.ts:1066](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L1066)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`pkh` | string | The public key hash of the account |
`secret` | string | The secret to activate the account |

**Returns:** *Promise‹any›*

Object containing the injected operation hash
```javascript
client.activate(pkh, secret)
  .then((activateOperation) => console.log(activateOperation));
```

___

###  awaitOperation

▸ **awaitOperation**(`hash`: string, `interval`: number, `timeout`: number): *Promise‹string›*

*Defined in [tez-client.ts:684](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L684)*

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`hash` | string | - | The operation hash to check |
`interval` | number | 10 | - |
`timeout` | number | 180 | - |

**Returns:** *Promise‹string›*

The hash of the block in which the operation was included
```javascript
client.awaitOperation('ooYf5iK6EdTx3XfBusgDqS6znACTq5469D1zQSDFNrs5KdTuUGi')
 .then((hash) => console.log(hash));
```

___

###  call

▸ **call**(`path`: string, `payload?`: [OperationObject](../interfaces/_tez_client_.operationobject.md)): *Promise‹any›*

*Defined in [tez-client.ts:733](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L733)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`path` | string | The path to query |
`payload?` | [OperationObject](../interfaces/_tez_client_.operationobject.md) | The payload of the request |

**Returns:** *Promise‹any›*

The response of the rpc call

___

###  getBaker

▸ **getBaker**(`address`: string): *Promise‹[Baker](../interfaces/_tez_client_.baker.md)›*

*Defined in [tez-client.ts:549](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L549)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | string | The contract for which to retrieve the baker information |

**Returns:** *Promise‹[Baker](../interfaces/_tez_client_.baker.md)›*

The information of the delegate address
```javascript
client.getBaker('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
  .then(({
    balance,
    frozen_balance,
    frozen_balance_by_cycle,
    staking_balance,
    delegated_contracts,
    delegated_balance,
    deactivated,
    grace_period,
  }) => console.log(
    balance,
    frozen_balance,
    frozen_balance_by_cycle,
    staking_balance,
    delegated_contracts,
    delegated_balance,
    deactivated,
    grace_period,
  ));
```

___

###  getBalance

▸ **getBalance**(`address`: string): *Promise‹string›*

*Defined in [tez-client.ts:475](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L475)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | string | The contract for which to retrieve the balance |

**Returns:** *Promise‹string›*

The balance of the contract
```javascript
client.getBalance('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
  .then(balance => console.log(balance));
```

___

###  getBallotList

▸ **getBallotList**(): *Promise‹any[]›*

*Defined in [tez-client.ts:600](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L600)*

**Returns:** *Promise‹any[]›*

Ballots casted so far during a voting period
```javascript
client.getBallotList().then(ballotList => console.log(ballotList));
```

___

###  getBallots

▸ **getBallots**(): *Promise‹object›*

*Defined in [tez-client.ts:625](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L625)*

**Returns:** *Promise‹object›*

Sum of ballots casted so far during a voting period
```javascript
client.getBallots().then(({ yay, nay, pass }) => console.log(yay, nay, pass));
```

___

###  getCounter

▸ **getCounter**(`address`: string): *Promise‹string›*

*Defined in [tez-client.ts:518](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L518)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | string | The contract for which to retrieve the counter |

**Returns:** *Promise‹string›*

The counter of a contract, if any
```javascript
client.getCounter('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
  .then(counter => console.log(counter));
```

___

###  getCurrentPeriod

▸ **getCurrentPeriod**(): *Promise‹any›*

*Defined in [tez-client.ts:658](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L658)*

**Returns:** *Promise‹any›*

Current period kind
```javascript
client.getCurrentPeriod().then(currentPeriod => console.log(currentPeriod));
```

___

###  getCurrentProposal

▸ **getCurrentProposal**(): *Promise‹string›*

*Defined in [tez-client.ts:647](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L647)*

**Returns:** *Promise‹string›*

Current proposal under evaluation
```javascript
client.getCurrentProposal().then(currentProposal => console.log(currentProposal));
```

___

###  getCurrentQuorum

▸ **getCurrentQuorum**(): *Promise‹number›*

*Defined in [tez-client.ts:669](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L669)*

**Returns:** *Promise‹number›*

Current expected quorum
```javascript
client.getCurrentQuorum().then(currentQuorum => console.log(currentQuorum));
```

___

###  getDelegate

▸ **getDelegate**(`address`: string): *Promise‹string | boolean›*

*Defined in [tez-client.ts:488](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L488)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | string | The contract for which to retrieve the delegate |

**Returns:** *Promise‹string | boolean›*

The delegate of a contract, if any
```javascript
client.getDelegate('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
  .then(delegate => console.log(delegate));
```

___

###  getHead

▸ **getHead**(): *Promise‹[Head](../interfaces/_tez_client_.head.md)›*

*Defined in [tez-client.ts:582](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L582)*

**Returns:** *Promise‹[Head](../interfaces/_tez_client_.head.md)›*

The current head block
```javascript
client.getHead().then(head => console.log(head));
```

___

###  getHeadHash

▸ **getHeadHash**(): *Promise‹string›*

*Defined in [tez-client.ts:591](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L591)*

**Returns:** *Promise‹string›*

The block's hash, its unique identifier
```javascript
client.getHeadHash().then(headHash => console.log(headHash))
```

___

###  getHeadMetadata

▸ **getHeadMetadata**(): *Promise‹[Header](../interfaces/_tez_client_.header.md)›*

*Defined in [tez-client.ts:571](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L571)*

**Returns:** *Promise‹[Header](../interfaces/_tez_client_.header.md)›*

The head block metadata
```javascript
client.getHeadMetadata().then(metadata => console.log(metadata));
```

___

###  getHeader

▸ **getHeader**(): *Promise‹[Header](../interfaces/_tez_client_.header.md)›*

*Defined in [tez-client.ts:560](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L560)*

**Returns:** *Promise‹[Header](../interfaces/_tez_client_.header.md)›*

The whole block header
```javascript
client.getHeader().then(header => console.log(header));
```

___

###  getListings

▸ **getListings**(): *Promise‹any[]›*

*Defined in [tez-client.ts:636](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L636)*

**Returns:** *Promise‹any[]›*

The ballots of the current voting period
```javascript
client.getListings().then(listings => console.log(listings));
```

___

###  getManager

▸ **getManager**(`address`: string): *Promise‹object›*

*Defined in [tez-client.ts:505](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L505)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | string | The contract for which to retrieve the manager |

**Returns:** *Promise‹object›*

The manager of a contract
```javascript
client.getManager('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
  .then(({ manager, key }) => console.log(manager, key));
```

___

###  getProposals

▸ **getProposals**(): *Promise‹any[]›*

*Defined in [tez-client.ts:614](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L614)*

**Returns:** *Promise‹any[]›*

List of proposals with number of supporters
```javascript
client.getProposals().then(proposals => {
  console.log(proposals[0][0], proposals[0][1])
  console.log(proposals[1][0], proposals[1][1])
);
```

___

###  importEd25519Party2

▸ **importEd25519Party2**(`party2`: Ed25519Party2, `party2Share?`: Ed25519Party2Share): *Promise‹void›*

*Defined in [tez-client.ts:321](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L321)*

**Parameters:**

Name | Type |
------ | ------ |
`party2` | Ed25519Party2 |
`party2Share?` | Ed25519Party2Share |

**Returns:** *Promise‹void›*

___

###  importKey

▸ **importKey**(`key`: string, `passphrase?`: undefined | string, `email?`: undefined | string): *Promise‹void›*

*Defined in [tez-client.ts:316](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L316)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | string | The secret key |
`passphrase?` | undefined &#124; string | - |
`email?` | undefined &#124; string | - |

**Returns:** *Promise‹void›*

___

###  importLedger

▸ **importLedger**(`path`: string, `curve`: number): *Promise‹void›*

*Defined in [tez-client.ts:334](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L334)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`path` | string | "44'/1729'/0'/0'" |
`curve` | number | 0 |

**Returns:** *Promise‹void›*

___

###  inject

▸ **inject**(`opOb`: [OperationObject](../interfaces/_tez_client_.operationobject.md), `sopbytes`: string): *Promise‹any›*

*Defined in [tez-client.ts:971](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L971)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`opOb` | [OperationObject](../interfaces/_tez_client_.operationobject.md) | The operation object |
`sopbytes` | string | The signed operation bytes |

**Returns:** *Promise‹any›*

Object containing the injected operation hash

___

###  originate

▸ **originate**(`__namedParameters`: object): *Promise‹any›*

*Defined in [tez-client.ts:1089](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L1089)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Default |
------ | ------ | ------ |
`balance` | number | - |
`code` | string &#124; object &#124; object &#124; object &#124; object &#124; object &#124; object &#124; object &#124; object &#124; object &#124; [MichelineArray](../interfaces/_tez_client_.michelinearray.md) | - |
`delegatable` | boolean | false |
`delegate` | undefined &#124; string | - |
`fee` | number |  this.defaultFee |
`gasLimit` | number | 10600 |
`init` | string &#124; object &#124; object &#124; object &#124; object &#124; object &#124; object &#124; object &#124; object &#124; object &#124; [MichelineArray](../interfaces/_tez_client_.michelinearray.md) | - |
`spendable` | boolean | false |
`storageLimit` | number | 257 |

**Returns:** *Promise‹any›*

Object containing the injected operation hash

___

###  packData

▸ **packData**(`data`: string | [Micheline](../modules/_tez_client_.md#micheline), `type`: string | [Micheline](../modules/_tez_client_.md#micheline)): *Promise‹any›*

*Defined in [tez-client.ts:1217](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L1217)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | string &#124; [Micheline](../modules/_tez_client_.md#micheline) |
`type` | string &#124; [Micheline](../modules/_tez_client_.md#micheline) |

**Returns:** *Promise‹any›*

Serialized data

___

###  prepareOperation

▸ **prepareOperation**(`__namedParameters`: object): *Promise‹[ForgedBytes](../interfaces/_tez_client_.forgedbytes.md)›*

*Defined in [tez-client.ts:753](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L753)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`operation` | [Operation](../interfaces/_tez_client_.operation.md) &#124; [Operation](../interfaces/_tez_client_.operation.md)[] |
`source` | undefined &#124; string |

**Returns:** *Promise‹[ForgedBytes](../interfaces/_tez_client_.forgedbytes.md)›*

Object containing the prepared operation
```javascript
client.prepareOperation({
  operation: {
    kind: 'transaction',
    fee: '1420',
    gas_limit: '10600',
    storage_limit: '300',
    amount: '1000',
    destination: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
  }
}).then(({ opbytes, opOb, counter }) => console.log(opbytes, opOb, counter));
```

___

###  query

▸ **query**(`path`: string, `payload?`: any, `method?`: undefined | string): *Promise‹any›*

*Defined in [tez-client.ts:365](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L365)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`path` | string | The RPC path to query |
`payload?` | any | The payload of the query |
`method?` | undefined &#124; string | The request method. Either 'GET' or 'POST' |

**Returns:** *Promise‹any›*

The response of the query
```javascript
client.query(`/chains/main/blocks/head`)
 .then(head => console.log(head));
```

___

###  registerDelegate

▸ **registerDelegate**(`__namedParameters`: object): *Promise‹any›*

*Defined in [tez-client.ts:1175](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L1175)*

**Parameters:**

▪`Default value`  **__namedParameters**: *object*=  {}

Name | Type | Default |
------ | ------ | ------ |
`fee` | number |  this.defaultFee |
`gasLimit` | number | 10600 |
`storageLimit` | number | 0 |

**Returns:** *Promise‹any›*

Object containing the injected operation hash

___

###  runCode

▸ **runCode**(`code`: string | [Micheline](../modules/_tez_client_.md#micheline), `amount`: number, `input`: string, `storage`: string, `trace`: boolean): *Promise‹any›*

*Defined in [tez-client.ts:1282](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L1282)*

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`code` | string &#124; [Micheline](../modules/_tez_client_.md#micheline) | - | Code to run |
`amount` | number | - | Amount in tez to send |
`input` | string | - | Input to run though code |
`storage` | string | - | State of storage |
`trace` | boolean | false | - |

**Returns:** *Promise‹any›*

Run results

___

###  sendOperation

▸ **sendOperation**(`__namedParameters`: object): *Promise‹any›*

*Defined in [tez-client.ts:923](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L923)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Default |
------ | ------ | ------ |
`operation` | [Operation](../interfaces/_tez_client_.operation.md) &#124; [Operation](../interfaces/_tez_client_.operation.md)[] | - |
`skipPrevalidation` | boolean | false |
`skipSignature` | boolean | false |
`source` | undefined &#124; string | - |

**Returns:** *Promise‹any›*

Object containing the injected operation hash
```javascript
const operation = {
  kind: 'transaction',
  fee: '1420',
  gas_limit: '10600',
  storage_limit: '300',
  amount: '1000',
  destination: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
};

client.sendOperation({ operation }).then(result => console.log(result));

client.sendOperation({ operation: [operation, operation] }).then(result => console.log(result));
```

___

###  setDelegate

▸ **setDelegate**(`__namedParameters`: object): *Promise‹any›*

*Defined in [tez-client.ts:1149](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L1149)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Default |
------ | ------ | ------ |
`delegate` | string | - |
`fee` | number |  this.defaultFee |
`gasLimit` | number | 10600 |
`source` | string |  (this.key && this.key.publicKeyHash()) || this.party2.publicKeyHash() |
`storageLimit` | number | 0 |

**Returns:** *Promise‹any›*

Object containing the injected operation hash

___

###  setProvider

▸ **setProvider**(`provider`: string, `chain`: string): *void*

*Overrides [AbstractTezModule](_tez_core_.abstracttezmodule.md).[setProvider](_tez_core_.abstracttezmodule.md#setprovider)*

*Defined in [tez-client.ts:301](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L301)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`provider` | string | - |
`chain` | string |  this.chain |

**Returns:** *void*

___

###  silentInject

▸ **silentInject**(`sopbytes`: string): *Promise‹any›*

*Defined in [tez-client.ts:1004](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L1004)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`sopbytes` | string | The signed operation bytes |

**Returns:** *Promise‹any›*

Object containing the injected operation hash

___

###  simulateOperation

▸ **simulateOperation**(`__namedParameters`: object): *Promise‹any›*

*Defined in [tez-client.ts:896](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L896)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`operation` | [Operation](../interfaces/_tez_client_.operation.md) &#124; [Operation](../interfaces/_tez_client_.operation.md)[] |
`source` | undefined &#124; string |

**Returns:** *Promise‹any›*

The simulated operation result
```javascript
client.simulateOperation({
  operation: {
    kind: 'transaction',
    fee: '1420',
    gas_limit: '10600',
    storage_limit: '300',
    amount: '1000',
    destination: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
  },
}).then(result => console.log(result));
```

___

###  transfer

▸ **transfer**(`__namedParameters`: object): *Promise‹any›*

*Defined in [tez-client.ts:1028](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L1028)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Default |
------ | ------ | ------ |
`amount` | number | - |
`fee` | number |  this.defaultFee |
`gasLimit` | number | 10600 |
`mutez` | boolean | false |
`parameter` | undefined &#124; string | - |
`source` | undefined &#124; string | - |
`storageLimit` | number | 300 |
`to` | string | - |

**Returns:** *Promise‹any›*

Object containing the injected operation hash
```javascript
client.transfer({
  to: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
  amount: '1000000',
  fee: '1420',
}).then(result => console.log(result));
```

___

###  typecheckCode

▸ **typecheckCode**(`code`: string | [Micheline](../modules/_tez_client_.md#micheline), `gas`: number): *Promise‹any›*

*Defined in [tez-client.ts:1196](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L1196)*

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`code` | string &#124; [Micheline](../modules/_tez_client_.md#micheline) | - | The code to typecheck |
`gas` | number | 10000 | The the gas limit |

**Returns:** *Promise‹any›*

Typecheck result

___

###  typecheckData

▸ **typecheckData**(`data`: string | [Micheline](../modules/_tez_client_.md#micheline), `type`: string | [Micheline](../modules/_tez_client_.md#micheline)): *Promise‹any›*

*Defined in [tez-client.ts:1248](https://github.com/KZen-networks/sotez/blob/80ad203/src/tez-client.ts#L1248)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | string &#124; [Micheline](../modules/_tez_client_.md#micheline) |
`type` | string &#124; [Micheline](../modules/_tez_client_.md#micheline) |

**Returns:** *Promise‹any›*

Typecheck result