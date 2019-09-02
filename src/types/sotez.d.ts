// Type definitions for sotez 0.4.5
// Project: https://github.com/AndrewKishino/sotez
// Definitions by: Andrew Kishino <https://github.com/AndrewKishino>

/// <reference types="node" />

export interface Keys {
  pk: string;
  pkh: string;
  sk: string;
  password?: string;
}

export interface Head {
  protocol: string;
  chain_id: string;
  hash: string;
  header: any;
  metadata: any;
  operations: Operation[][];
}

export interface Header {
  protocol: string;
  chain_id: string;
  hash: string;
  level: number;
  proto: number;
  predecessor: string;
  timestamp: string;
  validation_pass: number;
  operations_hash: string;
  fitness: string[];
  context: string;
  priority: number;
  proof_of_work_nonce: string;
  signature: string;
}

export interface Operation {
  kind: string;
  level?: number;
  nonce?: string;
  pkh?: string;
  hash?: string;
  secret?: string;
  source?: string;
  period?: number;
  proposal?: string;
  ballot?: string;
  fee?: number | string;
  counter?: number | string;
  gas_limit?: number | string;
  storage_limit?: number | string;
  parameters?: string;
  balance?: number | string;
  spendable?: boolean;
  delegatable?: boolean;
  delegate?: string;
  amount?: number | string;
  destination?: string;
  public_key?: string;
  script?: { code: string; storage: string };
  manager_pubkey?: string;
  managerPubkey?: string;
}

export interface ConstructedOperation {
  kind: string;
  level: number;
  nonce: string;
  pkh: string;
  hash: string;
  secret: string;
  source: string;
  period: number;
  proposal: string;
  ballot: string;
  fee: string;
  counter: string;
  gas_limit: string;
  storage_limit: string;
  parameters: string;
  balance: string;
  spendable: boolean;
  delegatable: boolean;
  delegate: string;
  amount: string;
  destination: string;
  public_key: string;
  script: { code: string; storage: string };
  manager_pubkey: string;
  managerPubkey: string;
}

export interface OperationObject {
  branch?: string;
  contents?: ConstructedOperation[];
  protocol?: string;
  signature?: string;
}

export interface ForgedBytes {
  opbytes: string;
  opOb: OperationObject;
  counter: number;
}

export interface KeysMnemonicPassphrase {
  mnemonic: string;
  passphrase: string;
  sk: string;
  pk: string;
  pkh: string;
}

export interface Signed {
  bytes: string;
  sig: string;
  prefixSig: string;
  sbytes: string;
}

export interface Baker {
  balance: string;
  frozen_balance: string;
  frozen_balance_by_cycle: {
    cycle: number;
    deposit: string;
    fees: string;
    rewards: string;
  };
  staking_balance: string;
  delegated_contracts: string[];
  delegated_balance: string;
  deactivated: boolean;
  grace_period: number;
}

export interface LedgerGetAddress {
  path?: string;
  displayConfirm?: boolean;
  curve?: number;
}

export interface LedgerSignOperation {
  path?: string;
  rawTxHex: string;
  curve?: number;
}

export interface LedgerGetVersion {
  major: number;
  minor: number;
  patch: number;
  bakingApp: boolean;
}

export interface AccountParams {
  keys: Keys;
  balance: number;
  spendable: boolean;
  delegatable: boolean;
  delegate: string;
  fee: number;
  gasLimit: number;
  storageLimit: number;
}

export interface RpcParams {
  to: string;
  source: string;
  keys: Keys;
  amount: number;
  init: string;
  fee: number;
  parameter: string;
  gasLimit: number;
  storageLimit: number;
  mutez: boolean;
  rawParam: boolean;
  spendable: boolean;
  delegatable: boolean;
  delegate: string;
  code: string;
}

export interface ContractParams {
  keys: Keys;
  to?: string;
  balance: number;
  init: string;
  fee: number;
  gasLimit: number;
  storageLimit: number;
  mutez?: boolean;
  rawParam?: boolean;
  spendable: boolean;
  delegatable: boolean;
  delegate: string;
  code: string;
}

export interface Prefix {
  [key: string]: Uint8Array;
  tz1: Uint8Array;
  tz2: Uint8Array;
  tz3: Uint8Array;
  KT: Uint8Array;

  edpk: Uint8Array;
  edsk2: Uint8Array;
  spsk: Uint8Array;
  p2sk: Uint8Array;

  sppk: Uint8Array;
  p2pk: Uint8Array;

  edesk: Uint8Array;
  edsk: Uint8Array;

  edsig: Uint8Array;
  spsig: Uint8Array;
  p2sig: Uint8Array;
  sig: Uint8Array;

  Net: Uint8Array;
  nce: Uint8Array;
  b: Uint8Array;
  o: Uint8Array;
  Lo: Uint8Array;
  LLo: Uint8Array;
  P: Uint8Array;
  Co: Uint8Array;
  id: Uint8Array;

  TZ: Uint8Array;
}

export interface Watermark {
  block: Uint8Array;
  endorsement: Uint8Array;
  generic: Uint8Array;
}

export interface Utility {
  textEncode: (text: string) => Uint8Array;
  textDecode: (buffer: Uint8Array) => string;
  b582int: (v: string) => string;
  totez: (mutez: number) => number;
  mutez: (tez: number) => string;
  b58cencode: (payload: (string | Uint8Array), prefixArg: Uint8Array) => string;
  b58cdecode: (enc: string, prefixArg: Uint8Array) => Uint8Array;
  buf2hex: (buffer: Buffer) => string;
  hex2buf: (hex: string) => Uint8Array;
  hexNonce: (length: number) => string;
  mergebuf: (b1: Uint8Array, b2: Uint8Array) => Uint8Array;
  sexp2mic: (mi: string) => any;
  mic2arr: (s: any) => any;
  ml2mic: (mi: string) => any;
  ml2tzjson: (mi: string) => any;
  tzjson2arr: (s: any) => any;
  mlraw2json: (mi: string) => any;
  mintotz: (mutez: number) => number;
  tztomin: (tez: number) => string;
}

export interface Crypto {
  extractKeys: (sk: string, password?: string) => Promise<Keys>;
  generateMnemonic: () => string;
  checkAddress: (address: string) => boolean;
  generateKeys: (mnemonic: string, passphrase: string) => Promise<KeysMnemonicPassphrase>;
  sign: (bytes: string, sk: string, watermark: Uint8Array, password?: string) => Promise<Signed>;
}

export interface Ledger {
  getAddress: (arg: LedgerGetAddress) => Promise<{ address: string; publicKey: string }>;
  signOperation: (arg: LedgerSignOperation) => Promise<string>;
  getVersion?: () => Promise<LedgerGetVersion>;
}

export interface Forge {
  forge: (opOb: OperationObject, counter: number, protocol: string) => Promise<ForgedBytes>;
  decodeRawBytes: (bytes: string) => any;
  encodeRawBytes: (input: any) => string;
  toBytesInt32: (num: number) => ArrayBuffer;
  toBytesInt32Hex: (num: number) => string;
  bool: (bool: boolean) => string;
  script: (arg: { code: string; storage: string }) => string;
  parameters: (params: string) => string;
  publicKeyHash: (publicKeyHash: string) => string;
  address: (address: string, protocol?: string) => string;
  zarith: (zarith: string) => string;
  publicKey: (publicKey: string) => string;
  op: (cOp: ConstructedOperation, protocol: string) => string;
  endorsement: (cOp: ConstructedOperation) => string;
  seedNonceRevelation: (cOp: ConstructedOperation) => string;
  doubleEndorsementEvidence: (cOp: ConstructedOperation) => string;
  doubleBakingEvidence: (cOp: ConstructedOperation) => string;
  activateAccount: (cOp: ConstructedOperation) => string;
  proposals: (cOp: ConstructedOperation) => string;
  ballot: (cOp: ConstructedOperation) => string;
  reveal: (cOp: ConstructedOperation, protocol: string) => string;
  transaction: (cOp: ConstructedOperation, protocol: string) => string;
  origination: (cOp: ConstructedOperation, protocol: string) => string;
  delegation: (cOp: ConstructedOperation, protocol: string) => string;
}

export interface OperationParams {
  operation: Operation[];
  source?: string,
  skipPrevalidation?: boolean;
  skipSignature?: boolean;
}

export interface Sotez {
  _defaultFee: number;
  _localForge: boolean;
  _validateLocalForge: boolean;
  _debugMode: boolean;
  _counters: { [key: string]: number };
  key: Key;
  importKey: (key: string, passphrase?: string, email?: string) => Promise<void>;
  importLedger: () => Promise<void>;
  query: (path: string, payload?: any, method?: string) => Promise<any>;
  account: (arg: AccountParams) => Promise<any>;
  getBalance: (address: string) => Promise<string>;
  getDelegate: (address: string) => Promise<string | boolean>;
  getManager: (address: string) => Promise<{ manager: string; key: string }>;
  getCounter: (address: string) => Promise<string>;
  getBaker: (address: string) => Promise<Baker>;
  getHead: () => Promise<Head>;
  getHeader: () => Promise<Header>;
  getHeadHash: () => Promise<string>;
  getBallotList: () => Promise<any[]>;
  getProposals: () => Promise<any[]>;
  getBallots: () => Promise<{ yay: number; nay: number; pass: number }>;
  getListings: () => Promise<any[]>;
  getCurrentProposal: () => Promise<string>;
  getCurrentPeriod: () => Promise<string>;
  getCurrentQuorum: () => Promise<number>;
  awaitOperation: (hash: string, interval: number, timeout: number) => Promise<string>;
  sendOperation: (arg: OperationParams) => Promise<any>;
  prepareOperation: (arg: OperationParams) => Promise<ForgedBytes>;
  call: (path: string, payload?: OperationObject) => Promise<any>;
  simulateOperation: (operation: OperationParams) => Promise<any>;
  silentInject: (sopbytes: string) => Promise<any>;
  inject: (opOb: OperationObject, sopbytes: string) => Promise<any>;
  transfer: (arg: RpcParams) => Promise<any>;
  activate: (pkh: string, secret: string) => Promise<any>;
  originate: (arg: ContractParams) => Promise<any>;
  setDelegate: (arg: RpcParams) => Promise<any>;
  registerDelegate: (arg: RpcParams) => Promise<any>;
  typecheckCode: (code: string) => Promise<any>;
  packData: (data: string, type: string) => Promise<any>;
  typecheckData: (data: string, type: string) => Promise<any>;
  runCode: (code: string, amount: number, input: string, storage: string, trace: boolean) => Promise<any>;
}

export interface TezModuleInterface {
  _provider: string;
  _chain: string;
}

export interface ModuleOptions {
  defaultFee?: number;
  localForge?: boolean;
  validateLocalForge?: boolean;
  debugMode?: boolean;
}

export interface Key {
  _publicKey: Buffer;
  _secretKey?: Buffer;
  _isLedger: boolean;
  _ledgerPath: string;
  _ledgerCurve: number;
  _isSecret: boolean;
  isLedger: boolean;
  ledgerPath: string;
  ledgerCurve: number;
  ready: Promise<void>;
  curve: string;
  initialize: (key: string, passphrase?: string, email?: string, resolve?: any) => Promise<void>;
  publicKey: () => string;
  secretKey: () => string;
  publicKeyHash: () => string;
  sign: (bytes: string, wm: Uint8Array) => Promise<Signed>;
}
