# Sotez - A JS Library for Tezos

# Getting Started
```js
npm install sotez
```

```js
import sotez from 'sotez';

sotez.node.query('/chains/main/blocks/head')
  .then(response => console.log(response));
```

Or import individule modules

```js
import { node, rpc } from 'sotez';

node.query('/chains/main/blocks/head')
  .then(response => console.log(response));
```

# Documentation
Sotez is exported as a collection of modules. Each module and the respective functions are detailed below:

- [node](#node)
  - [setDebugMode](#setDebugMode)
  - [setProvider](#setProvider)
  - [resetProvider](#resetProvider)
  - [query](#query)
- [rpc](#rpc)
  - [call](#call)
  - [sendOperation](#sendOperation)
  - [transfer](#transfer)
  - [originate](#originate)
  - [setDelegate](#setDelegate)
  - [registerDelegate](#registerDelegate)
  - [typecheckCode](#typecheckCode)
  - [packData](#packData)
  - [typecheckData](#typecheckData)
  - [runCode](#runCode)
- [contract](#contract)
  - [hash](#hash)
  - [contractOriginate](#contractOriginate)
  - [storage](#storage)
  - [load](#load)
  - [watch](#watch)
  - [send](#send)
- [crypto](#crypto)
  - [extractKeys](#extractKeys)
  - [generateMnemonic](#generateMnemonic)
  - [checkAddress](#checkAddress)
  - [generateKeysNoSeed](#generateKeysNoSeed)
  - [generateKeys](#generateKeys)
  - [generateKeysFromSeedMulti](#generateKeysFromSeedMulti)
  - [sign](#sign)
  - [verify](#verify)

## <a name="node"></a>Node
### <a name="setDebugMode"></a>setDebugMode
Sets the output mode of node functions. Allows for easier debugging of node functions.

```js
node.setDebugMode(debugMode)
```

Arguments:

```
debugMode:
  Type: Boolean
  Description: Whether to enable more verbose logging
```

Ex:

```js
node.setDebugMode(true)
```

### <a name="setProvider"></a>setProvider
Sets the rpc address to use when interacting with the Tezos node.

```js
node.setProvider(provider)
```

Arguments:

```
provider:
  Type: String
  Description: The RPC address to use when querying.
```

Ex:

```js
node.setProvider('http://rpc-mytezoswallet.com')
```

### <a name="resetProvider"></a>resetProvider
Resets the rpc address to the default value (http://rpc-mytezoswallet.com).

```js
node.resetProvider()
```

Ex:

```js
node.resetProvider()
```

### <a name="query"></a>query
Given a valid RPC path, the query function will return a promise containing the response from the RPC server. For a complete list of available RPC paths, visit the [Tezos RPC API Documentation](http://tezos.gitlab.io/mainnet/api/rpc.html).

```js
query(rpcPath, postParams, httpMethod)
```

Arguments:

```js
rpcPath:
  Type: String
  Description: The path of the RPC

postParams: [Optional (default: undefined)]
  Type: Object || Array
  Description: The POST parameters

httpMethod: [Optional (default: undefined)]
  Type: String
  Description: To explicitly set the HTTP Method to either 'GET' or 'POST'
```

Ex:

```js
node.query('/chains/main/blocks/head')
  .then(response => console.log(response))

node.query('/chains/main/blocks/head/helpers/forge/operations', {
  branch: head.hash,
  contents: ops,
}).then(response => console.log(response))
```

## <a name="rpc"></a>RPC
### <a name="account"></a>account
Originate a new account (KT1...) for an implicit account (tz1...). Returns a promise containing the successfully injected operation hash.

```js
rpc.account(accountObject)
```

Arguments:

```js
accountObject: {
  keys: Object,
  amount: Number,
  spendable: Boolean, [Optional (default: undefined)]
  delegatable: Boolean, [Optional (default: undefined)]
  delegate: String, [Optional (default: undefined)]
  fee: Number, [Optional (default: 0.05)]
}
```

Ex.

```js
const keys = {
  pk: 'edpk...',
  pkh: 'tz1...',
  sk: 'edsk...'
}

rpc.account({
  keys,
  amount: 10,
  spendable: true,
  delegatable: true,
  delegate: 'tz1...',
  fee: 0.05,
}).then(({ hash, operations }) => {
  console.log(hash)
  console.log(operations)
})
```

### <a name="getBalance"></a>getBalance
Retrieve the balance of an originated or implicit account.

```js
rpc.getBalance(account)
```

Arguments:

```js
account:
  Type: String
  Description: The address of the implicit or originated account
```

Ex:

```js
rpc..getBalance('tz1...').then(response => console.log(response));
```

### <a name="getDelegate"></a>getDelegate
Retrieve the delegate of an originated or implicit account.

```js
rpc.getDelegate(account)
```

Arguments:

```js
account:
  Type: String
  Description: The address of the implicit or originated account
```

Ex:

```js
rpc.getDelegate('tz1...').then(response => console.log(response));
```

### <a name="getHead"></a>getHead
Retrieve the latest block from the node.

```js
rpc.getHead()
```

Ex:

```js
rpc.getHead().then(response => console.log(response));
```

### <a name="getHeadHash"></a>getHeadHash
Retrieve the hash of the latest block from the node.

```js
rpc.getHeadHash()
```

Ex:

```js
rpc.getHeadHash().then(response => console.log(response));
```

### <a name="call"></a>call
Similar to node.query, rpc.call essentially wraps node.query. Given a valid RPC path, the query function will return a promise containing the response from the RPC server. For a complete list of available RPC paths, visit the [Tezos RPC API Documentation](http://tezos.gitlab.io/mainnet/api/rpc.html).

```js
rpc.call(rpcPath, postParams)
```

Arguments:

```js
rpcPath:
  Type: String
  Description: The path of the RPC

postParams: [Optional (default: undefined)]
  Type: Object || Array
  Description: The POST parameters
```

### <a name="sendOperation"></a>sendOperation
Given a contructed operation object, sendOperation will attempt to inject the provided operation(s) into the node.

```js
rpc.sendOperation({ from, operation, keys }, { useLedger, curve, path })
```

Arguments:

```js
from:
  Type: String
  Description: The account address

operation:
  Type: Object || Array
  Description: Operation(s) to be injected

keys:
  Type: Object
  Description: An object with keys ('pk', 'pkh', 'sk') pertaining to an account

useLedger:
  Type: Boolean
  Description: Use ledger to sign operation, Default: false

curve:
  Type: One of [0x00, 0x01, 0x02]
  Description: Signing curve. Default: 0x00

path:
  Type: Object
  Description: The derivation path. Default: "44'/1729'/0'/0'"
```

Ex:

```js
const keys = {
  pk: 'edpk...',
  pkh: 'tz1...',
  sk: 'edsk...'
}

rpc.sendOperation({ from: 'tz1...', operation, keys })
  .then(({ hash, operations }) => {
    console.log(hash)
    console.log(operations)
  })
```

### <a name="transfer"></a>transfer
Generate and inject a transfer transaction into the node. Can either transfer tez from one account to the other or be used to call Tezos smart contracts with a parameter.

```js
rpc.transfer(transferObject, { useLedger, curve, path })
```

Arguments:

```js
transferObject: {
  from: String,
  keys: Object,
  to: String,
  amount: Number,
  fee: Number, [Optional (default: 0.05)]
  parameter: String || Object, [Optional (default: false)]
  gasLimit: Number, [Optional (default: 200)]
  storageLimit: Number = 0, [Optional (default: 0)]
  mutez: Boolean = false, [Optional (default: false)] (If true, dont convert amount to tez, else use tez)
  rawParam: Boolean [Optional (default: false)] (If true, accept JSON params, else use standard CLI params)
},
{
useLedger:
  Type: Boolean
  Description: Use ledger to sign operation, Default: false

curve:
  Type: One of [0x00, 0x01, 0x02]
  Description: Signing curve. Default: 0x00

path:
  Type: Object
  Description: The derivation path. Default: "44'/1729'/0'/0'"
}
```

Ex.

```js
const keys = {
  pk: 'edpk...',
  pkh: 'tz1...',
  sk: 'edsk...'
}

rpc.transfer({
  from: 'tz1...',
  keys,
  to: 'tz1...',
  amount: 10,
  fee: 0.05,
}).then(({ hash, operations }) => {
  console.log(hash)
  console.log(operations)
})
```

### <a name="originate"></a>originate
Originate a new smart contract for an implicit account. The contract is initialized with code to generate a smart contract.

```js
rpc.originate(originateObject)
```

Arguments:

```js
originateObject: {
  keys: Object,
  amount: Number,
  code,
  init,
  fee, [Optional (default: 0.05)]
  spendable: Boolean, [Optional (default: false)],
  delegatable: Boolean, [Optional (default: false)],
  delegate: String, [Optional (default: undefined)],
  gasLimit: Number, [Optional (default: 10000)]
  storageLimit: Number [Optional (default: 10000)]
}
```

Ex.

```js
const keys = {
  pk: 'edpk...',
  pkh: 'tz1...',
  sk: 'edsk...'
}

rpc.originate({
  keys,
  amount: 10,
  fee: 0.05,
  code: '<code>',
  init: '<init>',
}).then(({ hash, operations }) => {
  console.log(hash)
  console.log(operations)
})
```

### <a name="setDelegate"></a>setDelegate
Sets the delegate for a given originated account.

```js
rpc.setDelegate({ from, keys, delegate, fee, gasLimit, storageLimit })
```

Arguments:

```js
from:
  Type: String
  Description: The originated address to set the delegate for

keys:
  Type: Object
  Description: An object with keys ('pk', 'pkh', 'sk') pertaining to an account

delegate:
  Type: String
  Description: The implicit account to set the delegate to

fee: [Optional (default: 0.05)]
  Type: Number
  Description: The fee for the transaction

gasLimit: [Optional (default: 0)]
  Type: Number
  Description: The gas limit for this transaction

storageLimit: [Optional (default: 0)]
  Type:  Number
  Description: The storage limit for this transaction
```

Ex:

```js
const keys = {
  pk: 'edpk...',
  pkh: 'tz1...',
  sk: 'edsk...'
}

rpc.setDelegate({ from: 'KT1...', keys, delegate: 'tz1...' })
  .then(({ hash, operations }) => {
    console.log(hash)
    console.log(operations)
  })
```

### <a name="registerDelegate"></a>registerDelegate
Sets the delegate for a given originated account.

```js
rpc.registerDelegate({ from, keys, delegate, gasLimit, storageLimit })
```

Arguments:

```js
from:
  Type: String
  Description: The originated address to set the delegate for

keys:
  Type: Object
  Description: An object with keys ('pk', 'pkh', 'sk') pertaining to an account

delegate:
  Type: String
  Description: The implicit account to set the delegate to

gasLimit: [Optional (default: 0)]
  Type: Number
  Description: The gas limit for this transaction

storageLimit: [Optional (default: 0)]
  Type:  Number
  Description: The storage limit for this transaction
```

Ex:

```js
const keys = {
  pk: 'edpk...',
  pkh: 'tz1...',
  sk: 'edsk...'
}

rpc.registerDelegate({ from: 'KT1...', keys, delegate: 'tz1...' })
  .then(({ hash, operations }) => {
    console.log(hash)
    console.log(operations)
  })
```

### <a name="typecheckCode"></a>typecheckCode
Typechecks the provided code.

```js
rpc.typecheckCode(code)
```

### <a name="packData"></a>packData
Serializes a piece of data to a binary representation.

```js
rpc.packData(data, type)
```

### <a name="typecheckData"></a>typecheckData
Typechecks data against a type.

```js
rpc.typecheckData(data, type)
```

### <a name="runCode"></a>runCode
Runs or traces code against an input and storage

```js
rpc.runCode(code, amount, input, storage, trace)
```

## <a name="contract"></a>Contract
### <a name="hash"></a>hash
Runs or traces code against an input and storage

```js
contract.hash(operationHash, ind)
```

### <a name="contractOriginate"></a>contractOriginate
Originate a new smart contract for an implicit account. The contract is initialized with code to generate a smart contract.

```js
contract.originate(originateObject)
```

Arguments:

```js
originateObject: {
  keys: Object,
  amount: Number,
  code,
  init,
  fee, [Optional (default: 0.05)]
  spendable: Boolean, [Optional (default: false)],
  delegatable: Boolean, [Optional (default: false)],
  delegate: String, [Optional (default: undefined)],
  gasLimit: Number, [Optional (default: 10000)]
  storageLimit: Number [Optional (default: 10000)]
}
```

Ex.

```js
const keys = {
  pk: 'edpk...',
  pkh: 'tz1...',
  sk: 'edsk...'
}

contract.originate({
  keys,
  amount: 10,
  fee: 0.05,
  code: '<code>',
  init: '<init>',
}).then(({ hash, operations }) => {
  console.log(hash)
  console.log(operations)
})
```

### <a name="storage"></a>storage
Retrieve the storage of a contract.

```js
contract.storage(contract)
```

Arguments:

```js
contract:
  Type: String
  Description: The address of the contract
```

Ex:

```js
contract.storage('KT1...').then(response => console.log(response));
```

### <a name="load"></a>load
Retrieve the storage of a contract.

```js
contract.load(contract)
```

Arguments:

```js
contract:
  Type: String
  Description: The address of the contract
```

Ex:

```js
contract.storage('KT1...').then(response => console.log(response));
```

### <a name="watch"></a>watch
Retrieve the storage of a contract.

```js
contract.watch(contract, timeout, callback)
```

Arguments:

```js
contract:
  Type: String
  Description: The address of the contract

timeout:
  Type: Number
  Description: Interval in which to check storage of the contract

callback:
  Type: Function
  Description: The callback to perform when the contractstorage changes
```

Ex:

```js
contract.watch('KT1...', 10000, (storage) => {
  console.log(storage);
});
```

### <a name="send"></a>send
Initiate a transfer to a contract. Essentially a wrapper for rpc.transfer.

```js
contract.send(sendObject)
```

Arguments:

```js
sendObject: {
  to: String
  from : String,
  keys: Object,
  amount: Number,
  parameter: String || Object, [Optional (default: false)]
  fee: Number, [Optional (default: 0.05)]
  gasLimit: Number, [Optional (default: 200)]
  storageLimit: Number = 0, [Optional (default: 0)]
  mutez: Boolean = false, [Optional (default: false)] (If true, dont convert amount to tez, else use tez)
  rawParam: Boolean [Optional (default: false)] (If true, accept JSON params, else use standard CLI params)
}
```

Ex.

```js
const keys = {
  pk: 'edpk...',
  pkh: 'tz1...',
  sk: 'edsk...'
}

rpc.transfer({
  from: 'tz1...',
  keys,
  to: 'KT1...',
  amount: 10,
  parameters: 'Right (Right (Right (Right (Unit))))',
  fee: 0.05,
}).then(({ hash, operations }) => {
  console.log(hash)
  console.log(operations)
})
```

## <a name="crypto"></a>Crypto
### <a name="extractKeys"></a>extractKeys
Extract keys from a secret key.

```js
crypto.extractKeys(secretKey)
```

Arguments:

```js
secretKey:
  Type: String
  Description: The secret key of an account
```

Ex:

```js
crypto.extractKeys('edsk...')
  .then(keys => console.log(keys));
```

### <a name="generateMnemonic"></a>generateMnemonic
Generate a mnemonic.

```js
crypto.generateMnemonic()
```

### <a name="checkAddress"></a>checkAddress
Extract keys from a secret key.

```js
crypto.checkAddress(address)
```

Arguments:

```js
address:
  Type: String
  Description: The address to check
```

Ex:

```js
crypto.checkAddress('tz1...')
```

### <a name="generateKeysNoSeed"></a>generateKeysNoSeed
Extract keys without a seed.

```js
crypto.generateKeysNoSeed()
```

### <a name="checkAddress"></a>checkAddress
Extract keys from a secret key.

```js
crypto.checkAddress(address)
```

Arguments:

```js
address:
  Type: String
  Description: The address to check
```

Ex:

```js
crypto.checkAddress('tz1...')
```

### <a name="generateKeysNoSeed"></a>generateKeysNoSeed
Generate keys without a seed.

```js
crypto.generateKeysNoSeed()
```

### <a name="generateKeys"></a>generateKeys
Gen

```js
crypto.generateKeys(mnemonic, passphrase)
```

Arguments:

```js
mnemonic:
  Type: String
  Description: The mnemonic seed used to generate keys

passphrase:
  Type: String
  Description: The passphrase used to generate the keys
```

Ex:

```js
crypto.generateKeys('mnemonic words here ...', 'passphrase')
```

### <a name="generateKeysFromSeedMulti"></a>generateKeysFromSeedMulti
Generate keys from a mnemonic seed.

```js
crypto.generateKeysFromSeedMulti(mnemonic, passphrase, n)
```

### <a name="sign"></a>sign
Sign bytes with the secret key

```js
crypto.sign(bytes, secretKey, watermark)
```

Arguments:

```js
bytes:
  Type: String
  Description: The bytes to sign

secretKey:
  Type: String
  Description: The secret key of an account

watermark:
  Type: String
  Description: The watermark associated with either a block, endorsement, or generic signiture
```

### <a name="verify"></a>verify
verify bytes with the public key

```js
crypto.verify(bytes, signiture, publicKey)
```

Arguments:

```js
bytes:
  Type: String
  Description: The bytes to verify

signiture:
  Type: String
  Description: The signiture from the bytes

publicKey:
  Type: String
  Description: The public key to verify with
```

# Development
```js
npm install
npm run build
```

## License
MIT
