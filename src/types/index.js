// @flow
export type Keys = {
  pk: string,
  pkh: string,
  sk: string,
};

export type Head = {
  protocol: string,
  chain_id: string,
  hash: string,
  header: any,
  metadata: any,
  operations: Array<Array<Operation>>,
};

export type Header = {
  protocol: string,
  chain_id: string,
  hash: string,
  level: number,
  proto: number,
  predecessor: string,
  timestamp: string,
  validation_pass: number,
  operations_hash: string,
  fitness: Array<string>,
  context: string,
  priority: number,
  proof_of_work_nonce: string,
  signature: string,
};

export type Operation = {
  kind?: string,
  level?: number,
  nonce?: string,
  pkh?: string,
  hash?: string,
  secret?: string,
  source?: string,
  period?: number,
  proposal?: string,
  ballot?: string,
  fee?: number | string,
  counter?: number | string,
  gas_limit?: number | string,
  storage_limit?: number | string,
  parameters?: string,
  balance?: number | string,
  spendable?: boolean,
  delegatable?: boolean,
  delegate?: string,
  script?: string,
  amount?: number | string,
  destination?: string,
  public_key?: string,
  script?: { code: string, storage: string },
  managerPubkey?: string,
  manager_pubkey?: string,
};

export type ConstructedOperation = {
  kind: string,
  level: number,
  nonce: string,
  pkh: string,
  hash: string,
  secret: string,
  source: string,
  period: number,
  proposal: string,
  ballot: string,
  fee: string,
  counter: string,
  gas_limit: string,
  storage_limit: string,
  parameters: string,
  balance: string,
  spendable: boolean,
  delegatable: boolean,
  delegate: string,
  script: string,
  amount: string,
  destination: string,
  public_key: string,
  script: { code: string, storage: string },
  managerPubkey: string,
  manager_pubkey: string,
};

export type OperationObject = {
  branch: string,
  contents: Array<ConstructedOperation>,
  protocol: string,
  signature: string,
};

export type ForgedBytes = {
  opbytes: string,
  opOb: OperationObject,
  counter: number,
};

export type KeysMnemonicPassphrase = {|
  mnemonic: string,
  passphrase: string,
  sk: string,
  pk: string,
  pkh: string,
|};

export type Signed = {
  bytes: string,
  sig: string,
  edsig: string,
  sbytes: string,
};

export type Baker = {
  balance: string,
  frozen_balance: string,
  frozen_balance_by_cycle: {
    cycle: number,
    deposit: string,
    fees: string,
    rewards: string,
  },
  staking_balance: string,
  delegated_contracts: Array<string>,
  delegated_balance: string,
  deactivated: boolean,
  grace_period: number,
};

export type LedgerGetAddress = {
  path?: string,
  displayConfirm?: boolean,
  curve?: number,
};

export type LedgerSignOperation = {
  path?: string,
  rawTxHex: string,
  curve?: number,
};

export type LedgerGetVersion = {
  major: string,
  minor: string,
  patch: string,
  bakingApp: boolean,
};

export type LedgerDefault = {
  displayConfirm?: string,
  useLedger?: boolean,
  path?: string,
  curve?: number,
};

export type AccountParams = {
  keys: Keys,
  balance: number,
  spendable: boolean,
  delegatable: boolean,
  delegate: string,
  fee: number,
  gasLimit: number,
  storageLimit: number,
};

export type RpcParams = {
  from: string,
  keys: Keys,
  to: string,
  amount: number,
  init: string,
  fee: number,
  parameter: string,
  gasLimit: number,
  storageLimit: number,
  mutez: boolean,
  rawParam: boolean,
  spendable: boolean,
  delegatable: boolean,
  delegate: string,
  code: string,
};

export type ContractParams = {
  keys: Keys,
  to?: string,
  balance: number,
  init: string,
  fee: number,
  gasLimit: number,
  storageLimit: number,
  mutez?: boolean,
  rawParam?: boolean,
  spendable: boolean,
  delegatable: boolean,
  delegate: string,
  code: string,
};

export type Prefix = {
  tz1: Uint8Array,
  tz2: Uint8Array,
  tz3: Uint8Array,
  KT: Uint8Array,

  edpk: Uint8Array,
  edsk2: Uint8Array,
  spsk: Uint8Array,
  p2sk: Uint8Array,

  sppk: Uint8Array,
  p2pk: Uint8Array,

  edesk: Uint8Array,

  edsk: Uint8Array,
  edsig: Uint8Array,
  spsig1: Uint8Array,
  p2sig: Uint8Array,
  sig: Uint8Array,

  Net: Uint8Array,
  nce: Uint8Array,
  b: Uint8Array,
  o: Uint8Array,
  Lo: Uint8Array,
  LLo: Uint8Array,
  P: Uint8Array,
  Co: Uint8Array,
  id: Uint8Array,

  TZ?: Uint8Array,
};

export type Watermark = {|
  block: Uint8Array,
  endorsement: Uint8Array,
  generic: Uint8Array,
|};

export type Utility = {
  textEncode: string => Uint8Array,
  textDecode: Uint8Array => string,
  b582int: string => string,
  totez: number => number,
  mutez: number => string,
  b58cencode: (string, Uint8Array) => string,
  b58cdecode: (string, Uint8Array) => string,
  buf2hex: (Uint8Array | string) => string,
  hex2buf: string => Uint8Array,
  hexNonce: number => string,
  mergebuf: (Uint8Array, Uint8Array) => Uint8Array,
  sexp2mic: string => *,
  mic2arr: any => *,
  ml2mic: string => *,
  ml2tzjson: string => *,
  tzjson2arr: any => *,
  mlraw2json: string => *,
  mintotz: number => number,
  tztomin: number => string,
};

export type Crypto = {
  extractKeys: string => Promise<Keys>,
  generateMnemonic: () => string,
  checkAddress: string => boolean,
  generateKeys: (string, string) => Promise<KeysMnemonicPassphrase>,
  sign: (string, string, Uint8Array) => Promise<Signed>,
  verify: (string, string, string) => Promise<number>,
};

export type Ledger = {
  getAddress: (LedgerGetAddress) => Promise<{ address: string, publicKey: string }>,
  signOperation: (LedgerSignOperation) => Promise<string>,
  getVersion: () => Promise<LedgerGetVersion>,
};

export type Forge = {
  forge: (Head, OperationObject, number) => Promise<ForgedBytes>,
  decodeRawBytes: string => any,
  encodeRawBytes: any => string,
  toBytesInt32: number => ArrayBuffer,
  toBytesInt32Hex: number => string,
  bool: boolean => string,
  script: ({ code: string, storage: string }) => string,
  parameters: string => string,
  publicKeyHash: string => string,
  address: string => string,
  zarith: string => string,
  publicKey: string => string,
  op: ConstructedOperation => string,
};

export type OperationParams = {
  from: string,
  operation: Array<Operation>,
  keys?: Keys,
  skipPrevalidation?: boolean,
};

export interface Tez {
  _localForge: boolean,
  _validateLocalForge: boolean,
  _counters: { [string]: number },
  _debugMode: boolean,
  query: (string, ?any, ?string) => Promise<any>,
  account: (AccountParams, LedgerDefault) => Promise<any>,
  getBalance: (address: string) => Promise<string>,
  getDelegate: (address: string) => Promise<string | boolean>,
  getManager: (address: string) => Promise<{ manager: string, key: string }>,
  getCounter: (address: string) => Promise<string>,
  getBaker: (address: string) => Promise<Baker>,
  getHead: () => Promise<Head>,
  getHeader: () => Promise<Header>,
  getHeadHash: () => Promise<string>,
  getBallotList: () => Promise<Array<any>>,
  getProposals: () => Promise<Array<any>>,
  getBallots: () => Promise<{ yay: number, nay: number, pass: number }>,
  getListings: () => Promise<Array<any>>,
  getCurrentProposal: () => Promise<string>,
  getCurrentPeriod: () => Promise<string>,
  getCurrentQuorum: () => Promise<number>,
  awaitOperation: (hash: string, interval: number, timeout: number) => Promise<string>,
  sendOperation: (OperationParams, LedgerDefault) => Promise<any>,
  prepareOperation: (OperationParams, LedgerDefault) => Promise<ForgedBytes>,
  call: (string, ?OperationObject) => Promise<any>,
  simulateOperation: (OperationParams, LedgerDefault) => Promise<any>,
  silentInject: (string) => Promise<any>,
  inject: (OperationObject, string) => Promise<any>,
  transfer: (RpcParams, LedgerDefault) => Promise<any>,
  activate: (string, string) => Promise<any>,
  originate: (ContractParams, LedgerDefault) => Promise<any>,
  setDelegate: (RpcParams, LedgerDefault) => Promise<any>,
  registerDelegate: (RpcParams, LedgerDefault) => Promise<any>,
  typecheckCode: (string) => Promise<any>,
  packData: (string, string) => Promise<any>,
  typecheckData: (string, string) => Promise<any>,
  runCode: (string, number, string, string, boolean) => Promise<any>,
}

export interface Contract {
  hash: (string, number) => Promise<any>,
  originate: (ContractParams, LedgerDefault) => Promise<any>,
  storage: (string) => Promise<any>,
  load: (string) => Promise<any>,
  watch: (string, number, (any) => any) => IntervalID,
}

export interface TezModuleInterface {
  _provider: string,
  _network: string,
  _chain: string,
  _defaultFee: number,
}

export type ModuleOptions = {
  defaultFee: number,
  debugMode: boolean,
  localForge: boolean,
  validateLocalForge: boolean,
};
