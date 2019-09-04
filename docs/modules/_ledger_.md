**[Sotez Documentation](../README.md)**

[Globals](../README.md) › ["ledger"](_ledger_.md)

# External module: "ledger"

## Index

### Functions

* [getAddress](_ledger_.md#const-getaddress)
* [getVersion](_ledger_.md#const-getversion)
* [signOperation](_ledger_.md#const-signoperation)

## Functions

### `Const` getAddress

▸ **getAddress**(`__namedParameters`: object): *Promise‹object›*

*Defined in [ledger.ts:25](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/ledger.ts#L25)*

**Parameters:**

▪`Default value`  **__namedParameters**: *object*=  {}

Name | Type | Default |
------ | ------ | ------ |
`curve` | number | 0 |
`displayConfirm` | boolean | true |
`path` | string | "44'/1729'/0'/0'" |

**Returns:** *Promise‹object›*

The public key and public key hash
```javascript
ledger.getAddress({
  path = "44'/1729'/0'/0'",
  displayConfirm = true,
  curve = 0x00,
}).then(({ address, publicKey }) => console.log(address, publicKey));
```

___

### `Const` getVersion

▸ **getVersion**(): *Promise‹LedgerGetVersion›*

*Defined in [ledger.ts:84](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/ledger.ts#L84)*

**Returns:** *Promise‹LedgerGetVersion›*

The version info
```javascript
ledger.getVersion()
  .then(({ major, minor, patch, bakingApp }) => console.log(major, minor, patch, bakingApp));
```

___

### `Const` signOperation

▸ **signOperation**(`__namedParameters`: object): *Promise‹string›*

*Defined in [ledger.ts:58](https://github.com/AndrewKishino/sotez/blob/8228d6e/src/ledger.ts#L58)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Default |
------ | ------ | ------ |
`curve` | number | 0 |
`path` | string | "44'/1729'/0'/0'" |
`rawTxHex` | string | - |

**Returns:** *Promise‹string›*

The signed operation
```javascript
ledger.signOperation({
  path = "44'/1729'/0'/0'",
  rawTxHex,
  curve = 0x00,
}).then((signature) => console.log(signature));
```