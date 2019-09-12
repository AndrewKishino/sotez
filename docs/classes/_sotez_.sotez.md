**[Sotez Documentation](../README.md)**

[Globals](../README.md) › [&quot;sotez&quot;](../modules/_sotez_.md) › [Sotez](_sotez_.sotez.md)

# Class: Sotez

Main Sotez Library
```javascript
import Sotez from 'sotez';
const sotez = new Sotez('https://127.0.0.1:8732', 'main', { defaultFee: 1275 })
await sotez.importKey('edskRv6ZnkLQMVustbYHFPNsABu1Js6pEEWyMUFJQTqEZjVCU2WHh8ckcc7YA4uBzPiJjZCsv3pC1NDdV99AnyLzPjSip4uC3y');
sotez.transfer({
  to: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
  amount: '1000000',
});
```

## Hierarchy

* [AbstractTezModule](_tez_core_.abstracttezmodule.md)

  * **Sotez**

## Index

### Constructors

* [constructor](_sotez_.sotez.md#constructor)

### Properties

* [_chain](_sotez_.sotez.md#_chain)
* [_counters](_sotez_.sotez.md#_counters)
* [_debugMode](_sotez_.sotez.md#_debugmode)
* [_defaultFee](_sotez_.sotez.md#_defaultfee)
* [_localForge](_sotez_.sotez.md#_localforge)
* [_provider](_sotez_.sotez.md#_provider)
* [_validateLocalForge](_sotez_.sotez.md#_validatelocalforge)
* [key](_sotez_.sotez.md#key)

### Accessors

* [chain](_sotez_.sotez.md#chain)
* [counters](_sotez_.sotez.md#counters)
* [debugMode](_sotez_.sotez.md#debugmode)
* [defaultFee](_sotez_.sotez.md#defaultfee)
* [localForge](_sotez_.sotez.md#localforge)
* [provider](_sotez_.sotez.md#provider)
* [validateLocalForge](_sotez_.sotez.md#validatelocalforge)

### Methods

* [account](_sotez_.sotez.md#account)
* [activate](_sotez_.sotez.md#activate)
* [awaitOperation](_sotez_.sotez.md#awaitoperation)
* [call](_sotez_.sotez.md#call)
* [getBaker](_sotez_.sotez.md#getbaker)
* [getBalance](_sotez_.sotez.md#getbalance)
* [getBallotList](_sotez_.sotez.md#getballotlist)
* [getBallots](_sotez_.sotez.md#getballots)
* [getCounter](_sotez_.sotez.md#getcounter)
* [getCurrentPeriod](_sotez_.sotez.md#getcurrentperiod)
* [getCurrentProposal](_sotez_.sotez.md#getcurrentproposal)
* [getCurrentQuorum](_sotez_.sotez.md#getcurrentquorum)
* [getDelegate](_sotez_.sotez.md#getdelegate)
* [getHead](_sotez_.sotez.md#gethead)
* [getHeadHash](_sotez_.sotez.md#getheadhash)
* [getHeadMetadata](_sotez_.sotez.md#getheadmetadata)
* [getHeader](_sotez_.sotez.md#getheader)
* [getListings](_sotez_.sotez.md#getlistings)
* [getManager](_sotez_.sotez.md#getmanager)
* [getProposals](_sotez_.sotez.md#getproposals)
* [importKey](_sotez_.sotez.md#importkey)
* [importLedger](_sotez_.sotez.md#importledger)
* [inject](_sotez_.sotez.md#inject)
* [originate](_sotez_.sotez.md#originate)
* [packData](_sotez_.sotez.md#packdata)
* [prepareOperation](_sotez_.sotez.md#prepareoperation)
* [query](_sotez_.sotez.md#query)
* [registerDelegate](_sotez_.sotez.md#registerdelegate)
* [runCode](_sotez_.sotez.md#runcode)
* [sendOperation](_sotez_.sotez.md#sendoperation)
* [setDelegate](_sotez_.sotez.md#setdelegate)
* [setProvider](_sotez_.sotez.md#setprovider)
* [silentInject](_sotez_.sotez.md#silentinject)
* [simulateOperation](_sotez_.sotez.md#simulateoperation)
* [transfer](_sotez_.sotez.md#transfer)
* [typecheckCode](_sotez_.sotez.md#typecheckcode)
* [typecheckData](_sotez_.sotez.md#typecheckdata)

## Constructors

###  constructor

\+ **new Sotez**(`provider`: string, `chain`: string, `options`: [ModuleOptions](../interfaces/_sotez_.moduleoptions.md)): *[Sotez](_sotez_.sotez.md)*

*Overrides [AbstractTezModule](_tez_core_.abstracttezmodule.md).[constructor](_tez_core_.abstracttezmodule.md#constructor)*

*Defined in [sotez.ts:243](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L243)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`provider` | string | "http://127.0.0.1:8732" |
`chain` | string | "main" |
`options` | [ModuleOptions](../interfaces/_sotez_.moduleoptions.md) |  {} |

**Returns:** *[Sotez](_sotez_.sotez.md)*

## Properties

###  _chain

• **_chain**: *string*

*Inherited from [AbstractTezModule](_tez_core_.abstracttezmodule.md).[_chain](_tez_core_.abstracttezmodule.md#_chain)*

*Defined in [tez-core.ts:3](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/tez-core.ts#L3)*

___

###  _counters

• **_counters**: *object*

*Defined in [sotez.ts:242](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L242)*

#### Type declaration:

* \[ **key**: *string*\]: number

___

###  _debugMode

• **_debugMode**: *boolean*

*Defined in [sotez.ts:241](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L241)*

___

###  _defaultFee

• **_defaultFee**: *number*

*Defined in [sotez.ts:240](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L240)*

___

###  _localForge

• **_localForge**: *boolean*

*Defined in [sotez.ts:238](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L238)*

___

###  _provider

• **_provider**: *string*

*Inherited from [AbstractTezModule](_tez_core_.abstracttezmodule.md).[_provider](_tez_core_.abstracttezmodule.md#_provider)*

*Defined in [tez-core.ts:2](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/tez-core.ts#L2)*

___

###  _validateLocalForge

• **_validateLocalForge**: *boolean*

*Defined in [sotez.ts:239](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L239)*

___

###  key

• **key**: *[KeyInterface](../interfaces/_sotez_.keyinterface.md)*

*Defined in [sotez.ts:243](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L243)*

## Accessors

###  chain

• **get chain**(): *string*

*Inherited from [AbstractTezModule](_tez_core_.abstracttezmodule.md).[chain](_tez_core_.abstracttezmodule.md#chain)*

*Defined in [tez-core.ts:21](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/tez-core.ts#L21)*

**Returns:** *string*

• **set chain**(`value`: string): *void*

*Inherited from [AbstractTezModule](_tez_core_.abstracttezmodule.md).[chain](_tez_core_.abstracttezmodule.md#chain)*

*Defined in [tez-core.ts:25](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/tez-core.ts#L25)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *void*

___

###  counters

• **get counters**(): *object*

*Defined in [sotez.ts:282](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L282)*

**Returns:** *object*

* \[ **key**: *string*\]: number

• **set counters**(`counters`: object): *void*

*Defined in [sotez.ts:286](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L286)*

**Parameters:**

Name | Type |
------ | ------ |
`counters` | object |

**Returns:** *void*

___

###  debugMode

• **get debugMode**(): *boolean*

*Defined in [sotez.ts:290](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L290)*

**Returns:** *boolean*

• **set debugMode**(`t`: boolean): *void*

*Defined in [sotez.ts:294](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L294)*

**Parameters:**

Name | Type |
------ | ------ |
`t` | boolean |

**Returns:** *void*

___

###  defaultFee

• **get defaultFee**(): *number*

*Defined in [sotez.ts:258](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L258)*

**Returns:** *number*

• **set defaultFee**(`fee`: number): *void*

*Defined in [sotez.ts:262](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L262)*

**Parameters:**

Name | Type |
------ | ------ |
`fee` | number |

**Returns:** *void*

___

###  localForge

• **get localForge**(): *boolean*

*Defined in [sotez.ts:266](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L266)*

**Returns:** *boolean*

• **set localForge**(`value`: boolean): *void*

*Defined in [sotez.ts:270](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L270)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

___

###  provider

• **get provider**(): *string*

*Inherited from [AbstractTezModule](_tez_core_.abstracttezmodule.md).[provider](_tez_core_.abstracttezmodule.md#provider)*

*Defined in [tez-core.ts:13](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/tez-core.ts#L13)*

**Returns:** *string*

• **set provider**(`provider`: string): *void*

*Inherited from [AbstractTezModule](_tez_core_.abstracttezmodule.md).[provider](_tez_core_.abstracttezmodule.md#provider)*

*Defined in [tez-core.ts:17](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/tez-core.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`provider` | string |

**Returns:** *void*

___

###  validateLocalForge

• **get validateLocalForge**(): *boolean*

*Defined in [sotez.ts:274](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L274)*

**Returns:** *boolean*

• **set validateLocalForge**(`value`: boolean): *void*

*Defined in [sotez.ts:278](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L278)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | boolean |

**Returns:** *void*

## Methods

###  account

▸ **account**(`__namedParameters`: object): *Promise‹any›*

*Defined in [sotez.ts:431](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L431)*

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
sotez.account({
  balance: 10,
  spendable: true,
  delegatable: true,
  delegate: 'tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4',
}).then(res => console.log(res.operations[0].metadata.operation_result.originated_contracts[0]));
```

___

###  activate

▸ **activate**(`pkh`: string, `secret`: string): *Promise‹any›*

*Defined in [sotez.ts:1054](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L1054)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`pkh` | string | The public key hash of the account |
`secret` | string | The secret to activate the account |

**Returns:** *Promise‹any›*

Object containing the injected operation hash
```javascript
sotez.activate(pkh, secret)
  .then((activateOperation) => console.log(activateOperation));
```

___

###  awaitOperation

▸ **awaitOperation**(`hash`: string, `interval`: number, `timeout`: number): *Promise‹string›*

*Defined in [sotez.ts:676](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L676)*

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`hash` | string | - | The operation hash to check |
`interval` | number | 10 | - |
`timeout` | number | 180 | - |

**Returns:** *Promise‹string›*

The hash of the block in which the operation was included
```javascript
sotez.awaitOperation('ooYf5iK6EdTx3XfBusgDqS6znACTq5469D1zQSDFNrs5KdTuUGi')
 .then((hash) => console.log(hash));
```

___

###  call

▸ **call**(`path`: string, `payload?`: [OperationObject](../interfaces/_sotez_.operationobject.md)): *Promise‹any›*

*Defined in [sotez.ts:725](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L725)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`path` | string | The path to query |
`payload?` | [OperationObject](../interfaces/_sotez_.operationobject.md) | The payload of the request |

**Returns:** *Promise‹any›*

The response of the rpc call

___

###  getBaker

▸ **getBaker**(`address`: string): *Promise‹[Baker](../interfaces/_sotez_.baker.md)›*

*Defined in [sotez.ts:541](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L541)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | string | The contract for which to retrieve the baker information |

**Returns:** *Promise‹[Baker](../interfaces/_sotez_.baker.md)›*

The information of the delegate address
```javascript
sotez.getBaker('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
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

*Defined in [sotez.ts:467](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L467)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | string | The contract for which to retrieve the balance |

**Returns:** *Promise‹string›*

The balance of the contract
```javascript
sotez.getBalance('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
  .then(balance => console.log(balance));
```

___

###  getBallotList

▸ **getBallotList**(): *Promise‹any[]›*

*Defined in [sotez.ts:592](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L592)*

**Returns:** *Promise‹any[]›*

Ballots casted so far during a voting period
```javascript
sotez.getBallotList().then(ballotList => console.log(ballotList));
```

___

###  getBallots

▸ **getBallots**(): *Promise‹object›*

*Defined in [sotez.ts:617](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L617)*

**Returns:** *Promise‹object›*

Sum of ballots casted so far during a voting period
```javascript
sotez.getBallots().then(({ yay, nay, pass }) => console.log(yay, nay, pass));
```

___

###  getCounter

▸ **getCounter**(`address`: string): *Promise‹string›*

*Defined in [sotez.ts:510](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L510)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | string | The contract for which to retrieve the counter |

**Returns:** *Promise‹string›*

The counter of a contract, if any
```javascript
sotez.getCounter('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
  .then(counter => console.log(counter));
```

___

###  getCurrentPeriod

▸ **getCurrentPeriod**(): *Promise‹any›*

*Defined in [sotez.ts:650](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L650)*

**Returns:** *Promise‹any›*

Current period kind
```javascript
sotez.getCurrentPeriod().then(currentPeriod => console.log(currentPeriod));
```

___

###  getCurrentProposal

▸ **getCurrentProposal**(): *Promise‹string›*

*Defined in [sotez.ts:639](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L639)*

**Returns:** *Promise‹string›*

Current proposal under evaluation
```javascript
sotez.getCurrentProposal().then(currentProposal => console.log(currentProposal));
```

___

###  getCurrentQuorum

▸ **getCurrentQuorum**(): *Promise‹number›*

*Defined in [sotez.ts:661](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L661)*

**Returns:** *Promise‹number›*

Current expected quorum
```javascript
sotez.getCurrentQuorum().then(currentQuorum => console.log(currentQuorum));
```

___

###  getDelegate

▸ **getDelegate**(`address`: string): *Promise‹string | boolean›*

*Defined in [sotez.ts:480](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L480)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | string | The contract for which to retrieve the delegate |

**Returns:** *Promise‹string | boolean›*

The delegate of a contract, if any
```javascript
sotez.getDelegate('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
  .then(delegate => console.log(delegate));
```

___

###  getHead

▸ **getHead**(): *Promise‹[Head](../interfaces/_sotez_.head.md)›*

*Defined in [sotez.ts:574](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L574)*

**Returns:** *Promise‹[Head](../interfaces/_sotez_.head.md)›*

The current head block
```javascript
sotez.getHead().then(head => console.log(head));
```

___

###  getHeadHash

▸ **getHeadHash**(): *Promise‹string›*

*Defined in [sotez.ts:583](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L583)*

**Returns:** *Promise‹string›*

The block's hash, its unique identifier
```javascript
sotez.getHeadHash().then(headHash => console.log(headHash))
```

___

###  getHeadMetadata

▸ **getHeadMetadata**(): *Promise‹[Header](../interfaces/_sotez_.header.md)›*

*Defined in [sotez.ts:563](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L563)*

**Returns:** *Promise‹[Header](../interfaces/_sotez_.header.md)›*

The head block metadata
```javascript
sotez.getHeadMetadata().then(metadata => console.log(metadata));
```

___

###  getHeader

▸ **getHeader**(): *Promise‹[Header](../interfaces/_sotez_.header.md)›*

*Defined in [sotez.ts:552](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L552)*

**Returns:** *Promise‹[Header](../interfaces/_sotez_.header.md)›*

The whole block header
```javascript
sotez.getHeader().then(header => console.log(header));
```

___

###  getListings

▸ **getListings**(): *Promise‹any[]›*

*Defined in [sotez.ts:628](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L628)*

**Returns:** *Promise‹any[]›*

The ballots of the current voting period
```javascript
sotez.getListings().then(listings => console.log(listings));
```

___

###  getManager

▸ **getManager**(`address`: string): *Promise‹object›*

*Defined in [sotez.ts:497](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L497)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | string | The contract for which to retrieve the manager |

**Returns:** *Promise‹object›*

The manager of a contract
```javascript
sotez.getManager('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
  .then(({ manager, key }) => console.log(manager, key));
```

___

###  getProposals

▸ **getProposals**(): *Promise‹any[]›*

*Defined in [sotez.ts:606](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L606)*

**Returns:** *Promise‹any[]›*

List of proposals with number of supporters
```javascript
sotez.getProposals().then(proposals => {
  console.log(proposals[0][0], proposals[0][1])
  console.log(proposals[1][0], proposals[1][1])
);
```

___

###  importKey

▸ **importKey**(`key`: string, `passphrase?`: undefined | string, `email?`: undefined | string): *Promise‹void›*

*Defined in [sotez.ts:313](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L313)*

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

*Defined in [sotez.ts:326](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L326)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`path` | string | "44'/1729'/0'/0'" |
`curve` | number | 0 |

**Returns:** *Promise‹void›*

___

###  inject

▸ **inject**(`opOb`: [OperationObject](../interfaces/_sotez_.operationobject.md), `sopbytes`: string): *Promise‹any›*

*Defined in [sotez.ts:959](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L959)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`opOb` | [OperationObject](../interfaces/_sotez_.operationobject.md) | The operation object |
`sopbytes` | string | The signed operation bytes |

**Returns:** *Promise‹any›*

Object containing the injected operation hash

___

###  originate

▸ **originate**(`__namedParameters`: object): *Promise‹any›*

*Defined in [sotez.ts:1077](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L1077)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Default |
------ | ------ | ------ |
`balance` | number | - |
`code` | string &#124; object &#124; object &#124; object &#124; object &#124; object &#124; object &#124; object &#124; object &#124; object &#124; [MichelineArray](../interfaces/_sotez_.michelinearray.md) | - |
`delegatable` | boolean | false |
`delegate` | undefined &#124; string | - |
`fee` | number |  this.defaultFee |
`gasLimit` | number | 10600 |
`init` | string &#124; object &#124; object &#124; object &#124; object &#124; object &#124; object &#124; object &#124; object &#124; object &#124; [MichelineArray](../interfaces/_sotez_.michelinearray.md) | - |
`spendable` | boolean | false |
`storageLimit` | number | 257 |

**Returns:** *Promise‹any›*

Object containing the injected operation hash

___

###  packData

▸ **packData**(`data`: string | [Micheline](../modules/_sotez_.md#micheline), `type`: string | [Micheline](../modules/_sotez_.md#micheline)): *Promise‹any›*

*Defined in [sotez.ts:1205](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L1205)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | string &#124; [Micheline](../modules/_sotez_.md#micheline) |
`type` | string &#124; [Micheline](../modules/_sotez_.md#micheline) |

**Returns:** *Promise‹any›*

Serialized data

___

###  prepareOperation

▸ **prepareOperation**(`__namedParameters`: object): *Promise‹[ForgedBytes](../interfaces/_sotez_.forgedbytes.md)›*

*Defined in [sotez.ts:745](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L745)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`operation` | [Operation](../interfaces/_sotez_.operation.md) &#124; [Operation](../interfaces/_sotez_.operation.md)[] |
`source` | undefined &#124; string |

**Returns:** *Promise‹[ForgedBytes](../interfaces/_sotez_.forgedbytes.md)›*

Object containing the prepared operation
```javascript
sotez.prepareOperation({
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

*Defined in [sotez.ts:357](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L357)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`path` | string | The RPC path to query |
`payload?` | any | The payload of the query |
`method?` | undefined &#124; string | The request method. Either 'GET' or 'POST' |

**Returns:** *Promise‹any›*

The response of the query
```javascript
sotez.query(`/chains/main/blocks/head`)
 .then(head => console.log(head));
```

___

###  registerDelegate

▸ **registerDelegate**(`__namedParameters`: object): *Promise‹any›*

*Defined in [sotez.ts:1163](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L1163)*

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

▸ **runCode**(`code`: string | [Micheline](../modules/_sotez_.md#micheline), `amount`: number, `input`: string, `storage`: string, `trace`: boolean): *Promise‹any›*

*Defined in [sotez.ts:1270](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L1270)*

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`code` | string &#124; [Micheline](../modules/_sotez_.md#micheline) | - | Code to run |
`amount` | number | - | Amount in tez to send |
`input` | string | - | Input to run though code |
`storage` | string | - | State of storage |
`trace` | boolean | false | - |

**Returns:** *Promise‹any›*

Run results

___

###  sendOperation

▸ **sendOperation**(`__namedParameters`: object): *Promise‹any›*

*Defined in [sotez.ts:914](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L914)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Default |
------ | ------ | ------ |
`operation` | [Operation](../interfaces/_sotez_.operation.md) &#124; [Operation](../interfaces/_sotez_.operation.md)[] | - |
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

sotez.sendOperation({ operation }).then(result => console.log(result));

sotez.sendOperation({ operation: [operation, operation] }).then(result => console.log(result));
```

___

###  setDelegate

▸ **setDelegate**(`__namedParameters`: object): *Promise‹any›*

*Defined in [sotez.ts:1137](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L1137)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Default |
------ | ------ | ------ |
`delegate` | string | - |
`fee` | number |  this.defaultFee |
`gasLimit` | number | 10600 |
`source` | string |  this.key.publicKeyHash() |
`storageLimit` | number | 0 |

**Returns:** *Promise‹any›*

Object containing the injected operation hash

___

###  setProvider

▸ **setProvider**(`provider`: string, `chain`: string): *void*

*Overrides [AbstractTezModule](_tez_core_.abstracttezmodule.md).[setProvider](_tez_core_.abstracttezmodule.md#setprovider)*

*Defined in [sotez.ts:298](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L298)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`provider` | string | - |
`chain` | string |  this.chain |

**Returns:** *void*

___

###  silentInject

▸ **silentInject**(`sopbytes`: string): *Promise‹any›*

*Defined in [sotez.ts:992](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L992)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`sopbytes` | string | The signed operation bytes |

**Returns:** *Promise‹any›*

Object containing the injected operation hash

___

###  simulateOperation

▸ **simulateOperation**(`__namedParameters`: object): *Promise‹any›*

*Defined in [sotez.ts:887](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L887)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`operation` | [Operation](../interfaces/_sotez_.operation.md) &#124; [Operation](../interfaces/_sotez_.operation.md)[] |
`source` | undefined &#124; string |

**Returns:** *Promise‹any›*

The simulated operation result
```javascript
sotez.simulateOperation({
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

*Defined in [sotez.ts:1016](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L1016)*

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
sotez.transfer({
  to: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
  amount: '1000000',
  fee: '1420',
}).then(result => console.log(result));
```

___

###  typecheckCode

▸ **typecheckCode**(`code`: string | [Micheline](../modules/_sotez_.md#micheline), `gas`: number): *Promise‹any›*

*Defined in [sotez.ts:1184](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L1184)*

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`code` | string &#124; [Micheline](../modules/_sotez_.md#micheline) | - | The code to typecheck |
`gas` | number | 10000 | The the gas limit |

**Returns:** *Promise‹any›*

Typecheck result

___

###  typecheckData

▸ **typecheckData**(`data`: string | [Micheline](../modules/_sotez_.md#micheline), `type`: string | [Micheline](../modules/_sotez_.md#micheline)): *Promise‹any›*

*Defined in [sotez.ts:1236](https://github.com/AndrewKishino/sotez/blob/0fceff4/src/sotez.ts#L1236)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | string &#124; [Micheline](../modules/_sotez_.md#micheline) |
`type` | string &#124; [Micheline](../modules/_sotez_.md#micheline) |

**Returns:** *Promise‹any›*

Typecheck result