// @flow
declare type PK = string;
declare type PKH = string;
declare type SK = string;

declare type Keys = {
  pk: PK,
  pkh: PKH,
  sk: SK,
};

declare type Head = {
  protocol: string,
  chain_id: string,
  hash: string,
  header: any,
  metadata: any,
  operations: Array<Array<Operation>>,
};

declare type Header = {
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

declare type Operation = {
  kind?: string,
  level?: number,
  nonce?: string,
  pkh?: PKH,
  hash?: string,
  secret?: string,
  source?: string,
  period?: number,
  proposal?: string,
  ballot?: string,
  fee?: number,
  counter?: number,
  gas_limit?: number,
  storage_limit?: number,
  managerPubkey?: string,
  parameters?: string,
  balance?: number,
  spendable?: boolean,
  delegatable?: boolean,
  delegate?: string,
  script?: string,
  amount?: number,
  destination?: string,
  public_key?: string,
  script?: { code: string, storage: string },
  manager_pubkey?: string,
};

declare type ConstructedOperation = {
  kind: string,
  level: number,
  nonce: string,
  pkh: PKH,
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

declare type OperationObject = {
  branch: string,
  contents: Array<ConstructedOperation>,
  protocol: string,
  signature: string,
};

declare type ForgedBytes = {
  opbytes: string,
  opOb: OperationObject,
  counter: number,
};

declare type KeysMnemonicPassphrase = {|
  mnemonic: string,
  passphrase: string,
  sk: string,
  pk: string,
  pkh: string,
|};

declare type Signed = {
  bytes: string,
  sig: string,
  edsig: string,
  sbytes: string,
};

declare type Baker = {
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

declare type LedgerGetAddress = {
  path?: string,
  displayConfirm?: boolean,
  curve?: number,
};

declare type LedgerSignOperation = {
  path?: string,
  rawTxHex: string,
  curve?: number,
};

declare type LedgerGetVersion = {
  major: string,
  minor: string,
  patch: string,
  bakingApp: boolean,
};

declare type LedgerDefault = {
  useLedger?: boolean,
  path?: string,
  curve?: number,
};

declare type AccountParams = {
  keys: Keys,
  amount: number,
  spendable: boolean,
  delegatable: boolean,
  delegate: string,
  fee: number,
  gasLimit: number,
  storageLimit: number,
};

declare type RpcParams = {
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

declare type ContractParams = {
  keys: Keys,
  to?: string,
  amount: number,
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

declare type Prefix = {
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

declare type Watermark = {|
  block: Uint8Array,
  endorsement: Uint8Array,
  generic: Uint8Array,
|};

declare type Utility = {
  b582int: string => string,
  totez: number => number,
  mutez: number => number,
  b58cencode: (string, Uint8Array) => string,
  b58cdecode: (string, Uint8Array) => string,
  buf2hex: (Uint8Array | string) => string,
  hex2buf: string => Uint8Array,
  hexNonce: number => string,
  mergebuf: (Uint8Array, Uint8Array) => Uint8Array,
  sexp2mic: string => any,
  mic2arr: any => any,
  ml2mic: string => any,
  ml2tzjson: string => any,
  tzjson2arr: any => any,
  mlraw2json: string => any,
  mintotz: number => number,
  tztomin: number => number,
};

declare type Crypto = {
  extractKeys: string => Promise<Keys>,
  generateMnemonic: () => string,
  checkAddress: string => boolean,
  generateKeys: (string, string) => Promise<KeysMnemonicPassphrase>,
  sign: (string, string, Uint8Array) => Promise<Signed>,
  verify: (string, string, string) => Promise<number>,
};

declare type _Node = {
  activeProvider: string,
  debugMode: boolean,
  async: boolean,
  isZeronet: boolean,
  setDebugMode?: boolean => void,
  setProvider?: (string, boolean) => void,
  resetProvider?: () => void,
  query: (string, ?any, ?string) => Promise<any>,
};

declare type Ledger = {
  getAddress: (LedgerGetAddress) => Promise<{ address: string, publicKey: string }>,
  signOperation: (LedgerSignOperation) => Promise<string>,
  getVersion: () => Promise<LedgerGetVersion>,
};

declare type Forge = {
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

declare type Tezos = {
  forge: (Head, OperationObject, number) => Promise<ForgedBytes>,
  decodeRawBytes: string => any,
  encodeRawBytes: any => string,
};

declare type OperationParams = {
  from: string,
  operation: Array<Operation>,
  keys?: Keys,
  skipPrevalidation?: boolean,
};

declare type Rpc = {
  localForge: boolean,
  validateLocalForge: boolean,
  setForgeLocal: boolean => void,
  setLocalForgeValidation: boolean => void,
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
};

declare type Contract = {
  hash: (string, number) => Promise<any>,
  originate: (ContractParams, LedgerDefault) => Promise<any>,
  storage: (string) => Promise<any>,
  load: (string) => Promise<any>,
  watch: (string, number, (any) => any) => IntervalID,
}
