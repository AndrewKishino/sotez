import XMLHttpRequest from 'xhr2';
import AbstractTezModule from './tez-core';
import Key from './key';
import forge from './forge';
import utility from './utility';
import { watermark, protocols } from './constants';

interface KeyInterface {
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
  initialize: (keyParams: { key?: string, passphrase?: string, email?: string }, resolve: any) => Promise<void>;
  publicKey: () => string;
  secretKey: () => string;
  publicKeyHash: () => string;
  sign: (bytes: string, wm: Uint8Array) => Promise<Signed>;
};

interface ModuleOptions {
  defaultFee?: number;
  localForge?: boolean;
  validateLocalForge?: boolean;
  debugMode?: boolean;
};

interface Operation {
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
  parameters?: Micheline;
  balance?: number | string;
  spendable?: boolean;
  delegatable?: boolean;
  delegate?: string;
  amount?: number | string;
  destination?: string;
  public_key?: string;
  script?: { code: Micheline; storage: Micheline };
  manager_pubkey?: string;
  managerPubkey?: string;
}

interface Head {
  protocol: string;
  chain_id: string;
  hash: string;
  header: any;
  metadata: any;
  operations: Operation[][];
};

interface Header {
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
};

interface Baker {
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
};

interface OperationObject {
  branch?: string;
  contents?: ConstructedOperation[];
  protocol?: string;
  signature?: string;
};

interface ConstructedOperation {
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
  script: { code: Micheline; storage: Micheline };
  manager_pubkey: string;
  managerPubkey: string;
};

type Micheline = {
  prim: string,
  args?: MichelineArray,
  annots?: string[]
}
  | { bytes: string }
  | { int: string }
  | { string: string }
  | { address: string }
  | { contract: string }
  | { key: string }
  | { key_hash: string }
  | { signature: string }
  | MichelineArray;

interface MichelineArray extends Array<Micheline> { }

interface Keys {
  pk: string;
  pkh: string;
  sk: string;
  password?: string;
};

interface RpcParams {
  to: string;
  source?: string;
  keys?: Keys;
  amount: number;
  init?: string;
  fee?: number;
  parameters?: string;
  gasLimit?: number;
  storageLimit?: number;
  mutez?: boolean;
  spendable?: boolean;
  delegatable?: boolean;
  delegate?: string;
  code?: string;
};

interface AccountParams {
  balance: number;
  spendable?: boolean;
  delegatable?: boolean;
  delegate?: string;
  fee?: number;
  gasLimit?: number;
  storageLimit?: number;
};

interface OperationParams {
  operation: Operation | Operation[];
  source?: string,
  skipPrevalidation?: boolean;
  skipSignature?: boolean;
};

interface ContractParams {
  balance: number;
  code: string | Micheline;
  delegatable?: boolean;
  delegate?: string;
  fee?: number;
  gasLimit?: number;
  init: string | Micheline;
  mutez?: boolean;
  micheline?: boolean;
  spendable?: boolean;
  storageLimit?: number;
};

interface ForgedBytes {
  opbytes: string;
  opOb: OperationObject;
  counter: number;
};

interface Signed {
  bytes: string;
  sig: string;
  prefixSig: string;
  sbytes: string;
};

/**
 * Main Sotez Library
 * @example
 * import Sotez from 'sotez';
 * const sotez = new Sotez('https://127.0.0.1:8732', 'main', { defaultFee: 1275 })
 * await sotez.importKey('edskRv6ZnkLQMVustbYHFPNsABu1Js6pEEWyMUFJQTqEZjVCU2WHh8ckcc7YA4uBzPiJjZCsv3pC1NDdV99AnyLzPjSip4uC3y');
 * sotez.transfer({
 *   to: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
 *   amount: '1000000',
 * });
 */
export default class Sotez extends AbstractTezModule {
  _localForge: boolean;
  _validateLocalForge: boolean;
  _defaultFee: number;
  _debugMode: boolean;
  _counters: { [key: string]: number };
  key: KeyInterface;

  constructor(
    provider: string = 'http://127.0.0.1:8732',
    chain: string = 'main',
    options: ModuleOptions = {},
  ) {
    super(provider, chain);
    this._defaultFee = options.defaultFee || 1420;
    this._localForge = options.localForge === false ? false : true;
    this._validateLocalForge = options.validateLocalForge || false;
    this._debugMode = options.debugMode || false;
    this._counters = {};
  }

  get defaultFee() {
    return this._defaultFee;
  }

  set defaultFee(fee: number) {
    this._defaultFee = fee;
  }

  get localForge() {
    return this._localForge;
  }

  set localForge(value: boolean) {
    this._localForge = value;
  }

  get validateLocalForge() {
    return this._validateLocalForge;
  }

  set validateLocalForge(value: boolean) {
    this._validateLocalForge = value;
  }

  get counters() {
    return this._counters;
  }

  set counters(counters: { [key: string]: number }) {
    this._counters = counters;
  }

  get debugMode() {
    return this._debugMode;
  }

  set debugMode(t: boolean) {
    this._debugMode = t;
  }

  setProvider(provider: string, chain: string = this.chain) {
    super.setProvider(provider, chain);
    this.provider = provider;
    this.chain = chain;
  }

  /**
  * @description Import a secret key
  * @param {string} key The secret key
  * @param {string} [passphrase] The passphrase of the encrypted key
  * @param {string} [email] The email associated with the fundraiser account
  * @example
  * await sotez.importKey('edskRv6ZnkLQMVustbYHFPNsABu1Js6pEEWyMUFJQTqEZjVCU2WHh8ckcc7YA4uBzPiJjZCsv3pC1NDdV99AnyLzPjSip4uC3y')
  */
  importKey = async (key: string, passphrase?: string, email?: string) => {
    this.key = new Key({ key, passphrase, email });
    await this.key.ready;
  }

  /**
   * @description Import a ledger public key
   * @param {string} [path="44'/1729'/0'/0'"] The ledger path
   * @param {number} [curve=0x00] The curve parameter
   * @example
   * await sotez.importLedger();
   */
  importLedger = async (path: string = "44'/1729'/0'/0'", curve: number = 0x00) => {
    this.key = new Key({ ledgerPath: path, ledgerCurve: curve });
    await this.key.ready;
  }

  /**
   * @description Queries a node given a path and payload
   * @param {string} path The RPC path to query
   * @param {string} payload The payload of the query
   * @param {string} method The request method. Either 'GET' or 'POST'
   * @returns {Promise} The response of the query
   * @example
   * sotez.query(`/chains/main/blocks/head`)
   *  .then(head => console.log(head));
   */
  query = (path: string, payload?: any, method?: string): Promise<any> => {
    if (typeof payload === 'undefined') {
      if (typeof method === 'undefined') {
        method = 'GET';
      } else {
        payload = {};
      }
    } else if (typeof method === 'undefined') {
      method = 'POST';
    }
    return new Promise((resolve, reject) => {
      try {
        const http = new XMLHttpRequest();
        http.open(method, this.provider + path, true);
        http.onload = () => {
          if (this._debugMode) {
            console.log('Node call:', path, payload);
          }
          if (http.status === 200) {
            if (http.responseText) {
              let response = JSON.parse(http.responseText);
              if (this._debugMode) {
                console.log('Node response:', path, response);
              }
              if (response && typeof response.error !== 'undefined') {
                reject(response.error);
              } else {
                if (response && typeof response.ok !== 'undefined') response = response.ok;
                resolve(response);
              }
            } else {
              reject('Empty response returned'); // eslint-disable-line
            }
          } else if (http.responseText) {
            reject(http.responseText);
          } else {
            reject(http.statusText);
          }
        };
        http.onerror = () => {
          reject(http.statusText);
        };
        if (method === 'POST') {
          http.setRequestHeader('Content-Type', 'application/json');
          http.send(JSON.stringify(payload));
        } else {
          http.send();
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * @description Originate a new account
   * @param {Object} paramObject The parameters for the origination
   * @param {number} paramObject.balance The amount in tez to transfer for the initial balance
   * @param {boolean} [paramObject.spendable] Whether the keyholder can spend the balance from the new account
   * @param {boolean} [paramObject.delegatable] Whether the new account is delegatable
   * @param {string} [paramObject.delegate] The delegate for the new account
   * @param {number} [paramObject.fee=1420] The fee to set for the transaction
   * @param {number} [paramObject.gasLimit=10600] The gas limit to set for the transaction
   * @param {number} [paramObject.storageLimit=257] The storage limit to set for the transaction
   * @returns {Promise} Object containing the injected operation hash
   * @example
   * sotez.account({
   *   balance: 10,
   *   spendable: true,
   *   delegatable: true,
   *   delegate: 'tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4',
   * }).then(res => console.log(res.operations[0].metadata.operation_result.originated_contracts[0]));
   */
  account = async ({
    balance,
    spendable,
    delegatable,
    delegate,
    fee = this.defaultFee,
    gasLimit = 10600,
    storageLimit = 257,
  }: AccountParams): Promise<any> => {
    const params: { spendable?: boolean; delegatable?: boolean; delegate?: string } = {};
    if (typeof spendable !== 'undefined') params.spendable = spendable;
    if (typeof delegatable !== 'undefined') params.delegatable = delegatable;
    if (delegate) params.delegate = delegate;

    const operation: Operation[] = [{
      kind: 'origination',
      balance: utility.mutez(balance),
      fee,
      gas_limit: gasLimit,
      storage_limit: storageLimit,
      manager_pubkey: this.key.publicKeyHash(),
      ...params,
    }];

    return this.sendOperation({ operation });
  }

  /**
   * @description Get the balance for a contract
   * @param {string} address The contract for which to retrieve the balance
   * @returns {Promise} The balance of the contract
   * @example
   * sotez.getBalance('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
   *   .then(balance => console.log(balance));
   */
  getBalance = (address: string): Promise<string> => (
    this.query(`/chains/${this.chain}/blocks/head/context/contracts/${address}/balance`)
  )

  /**
   * @description Get the delegate for a contract
   * @param {string} address The contract for which to retrieve the delegate
   * @returns {Promise} The delegate of a contract, if any
   * @example
   * sotez.getDelegate('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
   *   .then(delegate => console.log(delegate));
   */
  getDelegate = (address: string): Promise<string | boolean> => (
    this.query(`/chains/${this.chain}/blocks/head/context/contracts/${address}/delegate`)
      .then((delegate: string) => {
        if (delegate) { return delegate; }
        return false;
      })
  )

  /**
   * @description Get the manager for a contract
   * @param {string} address The contract for which to retrieve the manager
   * @returns {Promise} The manager of a contract
   * @example
   * sotez.getManager('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
   *   .then(({ manager, key }) => console.log(manager, key));
   */
  getManager = (address: string): Promise<{ manager: string; key: string }> => (
    this.query(`/chains/${this.chain}/blocks/head/context/contracts/${address}/manager_key`)
  )

  /**
   * @description Get the counter for an contract
   * @param {string} address The contract for which to retrieve the counter
   * @returns {Promise} The counter of a contract, if any
   * @example
   * sotez.getCounter('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
   *   .then(counter => console.log(counter));
   */
  getCounter = (address: string): Promise<string> => (
    this.query(`/chains/${this.chain}/blocks/head/context/contracts/${address}/counter`)
  )

  /**
   * @description Get the baker information for an address
   * @param {string} address The contract for which to retrieve the baker information
   * @returns {Promise} The information of the delegate address
   * @example
   * sotez.getBaker('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
   *   .then(({
   *     balance,
   *     frozen_balance,
   *     frozen_balance_by_cycle,
   *     staking_balance,
   *     delegated_contracts,
   *     delegated_balance,
   *     deactivated,
   *     grace_period,
   *   }) => console.log(
   *     balance,
   *     frozen_balance,
   *     frozen_balance_by_cycle,
   *     staking_balance,
   *     delegated_contracts,
   *     delegated_balance,
   *     deactivated,
   *     grace_period,
   *   ));
   */
  getBaker = (address: string): Promise<Baker> => (
    this.query(`/chains/${this.chain}/blocks/head/context/delegates/${address}`)
  )

  /**
   * @description Get the header of the current head
   * @returns {Promise} The whole block header
   * @example
   * sotez.getHeader().then(header => console.log(header));
   */
  getHeader = (): Promise<Header> => (
    this.query(`/chains/${this.chain}/blocks/head/header`)
  )

  /**
   * @description Get the metadata of the current head
   * @returns {Promise} The head block metadata
   * @example
   * sotez.getHeadMetadata().then(metadata => console.log(metadata));
   */
  getHeadMetadata = (): Promise<Header> => (
    this.query(`/chains/${this.chain}/blocks/head/metadata`)
  )

  /**
   * @description Get the current head block of the chain
   * @returns {Promise} The current head block
   * @example
   * sotez.getHead().then(head => console.log(head));
   */
  getHead = (): Promise<Head> => this.query(`/chains/${this.chain}/blocks/head`)

  /**
   * @description Get the current head block hash of the chain
   * @returns {Promise} The block's hash, its unique identifier
   * @example
   * sotez.getHeadHash().then(headHash => console.log(headHash))
   */
  getHeadHash = (): Promise<string> => this.query(`/chains/${this.chain}/blocks/head/hash`);

  /**
   * @description Ballots casted so far during a voting period
   * @returns {Promise} Ballots casted so far during a voting period
   * @example
   * sotez.getBallotList().then(ballotList => console.log(ballotList));
   */
  getBallotList = (): Promise<any[]> => (
    this.query(`/chains/${this.chain}/blocks/head/votes/ballot_list`)
  )

  /**
   * @description List of proposals with number of supporters
   * @returns {Promise} List of proposals with number of supporters
   * @example
   * sotez.getProposals().then(proposals => {
   *   console.log(proposals[0][0], proposals[0][1])
   *   console.log(proposals[1][0], proposals[1][1])
   * );
   */
  getProposals = (): Promise<any[]> => (
    this.query(`/chains/${this.chain}/blocks/head/votes/proposals`)
  )

  /**
   * @description Sum of ballots casted so far during a voting period
   * @returns {Promise} Sum of ballots casted so far during a voting period
   * @example
   * sotez.getBallots().then(({ yay, nay, pass }) => console.log(yay, nay, pass));
   */
  getBallots = (): Promise<{ yay: number; nay: number; pass: number }> => (
    this.query(`/chains/${this.chain}/blocks/head/votes/ballots`)
  )

  /**
   * @description List of delegates with their voting weight, in number of rolls
   * @returns {Promise} The ballots of the current voting period
   * @example
   * sotez.getListings().then(listings => console.log(listings));
   */
  getListings = (): Promise<any[]> => (
    this.query(`/chains/${this.chain}/blocks/head/votes/listings`)
  )

  /**
   * @description Current proposal under evaluation
   * @returns {Promise} Current proposal under evaluation
   * @example
   * sotez.getCurrentProposal().then(currentProposal => console.log(currentProposal));
   */
  getCurrentProposal = (): Promise<string> => (
    this.query(`/chains/${this.chain}/blocks/head/votes/current_proposal`)
  )

  /**
   * @description Current period kind
   * @returns {Promise} Current period kind
   * @example
   * sotez.getCurrentPeriod().then(currentPeriod => console.log(currentPeriod));
   */
  getCurrentPeriod = () => (
    this.query(`/chains/${this.chain}/blocks/head/votes/current_period_kind`)
  )

  /**
   * @description Current expected quorum
   * @returns {Promise} Current expected quorum
   * @example
   * sotez.getCurrentQuorum().then(currentQuorum => console.log(currentQuorum));
   */
  getCurrentQuorum = (): Promise<number> => (
    this.query(`/chains/${this.chain}/blocks/head/votes/current_quorum`)
  )

  /**
   * @description Check for the inclusion of an operation in new blocks
   * @param {string} hash The operation hash to check
   * @param {number} [interval=10] The interval to check new blocks
   * @param {number} [timeout=180] The time before the operation times out
   * @returns {Promise} The hash of the block in which the operation was included
   * @example
   * sotez.awaitOperation('ooYf5iK6EdTx3XfBusgDqS6znACTq5469D1zQSDFNrs5KdTuUGi')
   *  .then((hash) => console.log(hash));
   */
  awaitOperation = (hash: string, interval: number = 10, timeout: number = 180): Promise<string> => {
    if (timeout <= 0) {
      throw new Error('Timeout must be more than 0');
    }

    if (interval <= 0) {
      throw new Error('Interval must be more than 0');
    }

    const timeoutAt = Math.ceil(timeout / interval) + 1;
    let count = 0;
    let found = false;

    const operationCheck = (operation: Operation): void => {
      if (operation.hash === hash) {
        found = true;
      }
    };

    return new Promise((resolve, reject) => {
      const repeater = (): Promise<string | void> => (
        this.getHead()
          .then((head: Head) => {
            count++;

            for (let i = 3; i >= 0; i--) {
              head.operations[i].forEach(operationCheck);
            }

            if (found) {
              resolve(head.hash);
            } else if (count >= timeoutAt) {
              reject(new Error('Timeout'));
            } else {
              setTimeout(repeater, interval * 1000);
            }
          })
      );

      repeater();
    });
  }

  /**
   * @description Get the current head block hash of the chain
   * @param {string} path The path to query
   * @param {Object} payload The payload of the request
   * @returns {Promise} The response of the rpc call
   */
  call = (path: string, payload?: OperationObject): Promise<any> => this.query(path, payload)

  /**
   * @description Prepares an operation
   * @param {Object} paramObject The parameters for the operation
   * @param {Object | Array} paramObject.operation The operation to include in the transaction
   * @returns {Promise} Object containing the prepared operation
   * @example
   * sotez.prepareOperation({
   *   operation: {
   *     kind: 'transaction',
   *     fee: '1420',
   *     gas_limit: '10600',
   *     storage_limit: '300',
   *     amount: '1000',
   *     destination: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
   *   }
   * }).then(({ opbytes, opOb, counter }) => console.log(opbytes, opOb, counter));
   */
  prepareOperation = ({ operation, source }: OperationParams): Promise<ForgedBytes> => {
    let counter: number;
    const opOb: OperationObject = {};
    const promises: any[] = [];
    let requiresReveal = false;
    let ops: Operation[] = [];
    let head: Header;

    promises.push(this.getHeader());
    promises.push(this.getHeadMetadata());

    if (Array.isArray(operation)) {
      ops = [...operation];
    } else {
      ops = [operation];
    }

    const publicKeyHash = source || this.key.publicKeyHash();

    for (let i = 0; i < ops.length; i++) {
      if (['transaction', 'origination', 'delegation'].includes(ops[i].kind)) {
        requiresReveal = true;
        promises.push(this.getManager(publicKeyHash));
        promises.push(this.getCounter(publicKeyHash));
        break;
      }
    }

    return Promise.all(promises).then(async ([header, metadata, manager, headCounter]: any[]): Promise<ForgedBytes> => {
      head = header;

      if (requiresReveal) {
        const managerKey = metadata.next_protocol === protocols['005'] ? manager : manager.key;
        if (!managerKey) {
          const reveal: Operation = {
            kind: 'reveal',
            fee: 1420,
            public_key: this.key.publicKey(),
            source: publicKeyHash,
            gas_limit: 10600,
            storage_limit: 300,
          };

          ops.unshift(reveal);
        }

        counter = parseInt(headCounter, 10);
        if (!this._counters[publicKeyHash] || this._counters[publicKeyHash] < counter) {
          this._counters[publicKeyHash] = counter;
        }
      }

      const constructOps = (cOps: Operation[]): ConstructedOperation[] => cOps
        .map((op: Operation) => {
          // @ts-ignore
          const constructedOp: ConstructedOperation = { ...op };
          if (['proposals', 'ballot', 'transaction', 'origination', 'delegation'].includes(op.kind)) {
            if (typeof op.source === 'undefined') constructedOp.source = publicKeyHash;
          }
          if (['reveal', 'transaction', 'origination', 'delegation'].includes(op.kind)) {
            if (typeof op.fee === 'undefined') {
              constructedOp.fee = '0';
            } else {
              constructedOp.fee = `${op.fee}`;
            }
            if (typeof op.gas_limit === 'undefined') {
              constructedOp.gas_limit = '0';
            } else {
              constructedOp.gas_limit = `${op.gas_limit}`;
            }
            if (typeof op.storage_limit === 'undefined') {
              constructedOp.storage_limit = '0';
            } else {
              constructedOp.storage_limit = `${op.storage_limit}`;
            }
            if (typeof op.balance !== 'undefined') constructedOp.balance = `${constructedOp.balance}`;
            if (typeof op.amount !== 'undefined') constructedOp.amount = `${constructedOp.amount}`;
            const opCounter = ++this._counters[publicKeyHash];
            constructedOp.counter = `${opCounter}`;
          }

          if (metadata.next_protocol === protocols['005']) {
            delete constructedOp.manager_pubkey;
            delete constructedOp.spendable;
            delete constructedOp.delegatable;
          }

          return constructedOp;
        });

      opOb.branch = head.hash;
      opOb.contents = constructOps(ops);

      let remoteForgedBytes = '';
      if (!this._localForge || this._validateLocalForge) {
        remoteForgedBytes = await this.query(`/chains/${this.chain}/blocks/${head.hash}/helpers/forge/operations`, opOb);
      }

      opOb.protocol = metadata.next_protocol;

      if (!this._localForge) {
        return {
          opbytes: remoteForgedBytes,
          opOb,
          counter,
        };
      }

      const fullOp = await forge.forge(opOb, counter, metadata.next_protocol);

      if (this._validateLocalForge) {
        if (fullOp.opbytes === remoteForgedBytes) {
          return fullOp;
        }
        throw new Error('Forge validation error - local and remote bytes don\'t match');
      }

      return {
        ...fullOp,
        counter,
      };
    });
  }

  /**
   * @description Simulate an operation
   * @param {Object} paramObject The parameters for the operation
   * @param {Object | Array} paramObject.operation The operation to include in the transaction
   * @returns {Promise} The simulated operation result
   * @example
   * sotez.simulateOperation({
   *   operation: {
   *     kind: 'transaction',
   *     fee: '1420',
   *     gas_limit: '10600',
   *     storage_limit: '300',
   *     amount: '1000',
   *     destination: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
   *   },
   * }).then(result => console.log(result));
   */
  simulateOperation = ({ operation, source }: OperationParams): Promise<any> => (
    this.prepareOperation({ operation, source }).then(fullOp => (
      this.query(`/chains/${this.chain}/blocks/head/helpers/scripts/run_operation`, fullOp.opOb)
    ))
  )

  /**
   * @description Send an operation
   * @param {Object} paramObject The parameters for the operation
   * @param {Object|Array} paramObject.operation The operation to include in the transaction
   * @param {string} [paramObject.source] The source address of the operation
   * @param {boolean} [paramObject.skipSignature=false] Use default signature for specific transactions
   * @param {boolean} [paramObject.skipPrevalidation=false] Skip prevalidation before injecting operation
   * @returns {Promise} Object containing the injected operation hash
   * @example
   * const operation = {
   *   kind: 'transaction',
   *   fee: '1420',
   *   gas_limit: '10600',
   *   storage_limit: '300',
   *   amount: '1000',
   *   destination: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
   * };
   *
   * sotez.sendOperation({ operation }).then(result => console.log(result));
   *
   * sotez.sendOperation({ operation: [operation, operation] }).then(result => console.log(result));
   */
  sendOperation = async ({ operation, source, skipPrevalidation = false, skipSignature = false }: OperationParams): Promise<any> => {
    const fullOp: ForgedBytes = await this.prepareOperation({ operation, source });

    if (skipSignature) {
      fullOp.opbytes += '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      fullOp.opOb.signature = 'edsigtXomBKi5CTRf5cjATJWSyaRvhfYNHqSUGrn4SdbYRcGwQrUGjzEfQDTuqHhuA8b2d8NarZjz8TRf65WkpQmo423BtomS8Q';
    } else {
      const signed: Signed = await this.key.sign(fullOp.opbytes, watermark.generic);
      fullOp.opbytes = signed.sbytes;
      fullOp.opOb.signature = signed.prefixSig;
    }

    const publicKeyHash = source || this.key.publicKeyHash();

    if (skipPrevalidation) {
      return this.silentInject(fullOp.opbytes)
        .catch((e) => {
          this._counters[publicKeyHash] = fullOp.counter;
          throw e;
        });
    }

    return this.inject(fullOp.opOb, fullOp.opbytes)
      .catch((e) => {
        this._counters[publicKeyHash] = fullOp.counter;
        throw e;
      });
  }

  /**
   * @description Inject an operation
   * @param {Object} opOb The operation object
   * @param {string} sopbytes The signed operation bytes
   * @returns {Promise} Object containing the injected operation hash
   */
  inject = (opOb: OperationObject, sopbytes: string): Promise<any> => {
    const opResponse: any[] = [];
    let errors: any[] = [];

    return this.query(`/chains/${this.chain}/blocks/head/helpers/preapply/operations`, [opOb])
      .then((f) => {
        if (!Array.isArray(f)) {
          throw new Error('RPC Fail');
        }
        for (let i = 0; i < f.length; i++) {
          for (let j = 0; j < f[i].contents.length; j++) {
            opResponse.push(f[i].contents[j]);
            if (typeof f[i].contents[j].metadata.operation_result !== 'undefined' && f[i].contents[j].metadata.operation_result.status === 'failed') {
              errors = errors.concat(f[i].contents[j].metadata.operation_result.errors);
            }
          }
        }
        if (errors.length) {
          throw new Error(JSON.stringify({ error: 'Operation Failed', errors }, null, 2));
        }
        return this.query('/injection/operation', sopbytes);
      }).then(hash => ({
        hash,
        operations: opResponse,
      }));
  }

  /**
   * @description Inject an operation without prevalidation
   * @param {string} sopbytes The signed operation bytes
   * @returns {Promise} Object containing the injected operation hash
   */
  silentInject = (sopbytes: string): Promise<any> => (
    this.query('/injection/operation', sopbytes).then(hash => ({ hash }))
  )

  /**
   * @description Transfer operation
   * @param {Object} paramObject The parameters for the operation
   * @param {string} paramObject.to The address of the recipient
   * @param {number} paramObject.amount The amount in tez to transfer for the initial balance
   * @param {string} [paramObject.source] The source address of the transfer
   * @param {number} [paramObject.fee=1420] The fee to set for the transaction
   * @param {string} [paramObject.parameters] The parameter for the transaction
   * @param {number} [paramObject.gasLimit=10600] The gas limit to set for the transaction
   * @param {number} [paramObject.storageLimit=300] The storage limit to set for the transaction
   * @param {number} [paramObject.mutez=false] Whether the input amount is set to mutez (1/1,000,000 tez)
   * @returns {Promise} Object containing the injected operation hash
   * @example
   * sotez.transfer({
   *   to: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
   *   amount: '1000000',
   *   fee: '1420',
   * }).then(result => console.log(result));
   */
  transfer = ({
    to,
    amount,
    source,
    fee = this.defaultFee,
    parameters,
    gasLimit = 10600,
    storageLimit = 300,
    mutez = false,
  }: RpcParams): Promise<any> => {
    const operation: Operation = {
      kind: 'transaction',
      fee,
      gas_limit: gasLimit,
      storage_limit: storageLimit,
      amount: mutez ? utility.mutez(amount) : amount,
      destination: to,
    };
    if (parameters) {
      if (typeof parameters === 'string') {
        operation.parameters = utility.sexp2mic(parameters);
      } else {
        operation.parameters = parameters;
      }
    }
    return this.sendOperation({ operation: [operation], source });
  }

  /**
   * @description Activate an account
   * @param {Object} pkh The public key hash of the account
   * @param {string} secret The secret to activate the account
   * @returns {Promise} Object containing the injected operation hash
   * @example
   * sotez.activate(pkh, secret)
   *   .then((activateOperation) => console.log(activateOperation));
   */
  activate = (pkh: string, secret: string): Promise<any> => {
    const operation = {
      kind: 'activate_account',
      pkh,
      secret,
    };
    return this.sendOperation({ operation: [operation], source: pkh, skipSignature: true });
  }

  /**
   * @description Originate a new contract
   * @param {Object} paramObject The parameters for the operation
   * @param {number} paramObject.balance The amount in tez to transfer for the initial balance
   * @param {string | Micheline} paramObject.code The code to deploy for the contract
   * @param {string | Micheline} paramObject.init The initial storage of the contract
   * @param {boolean} [paramObject.spendable=false] Whether the keyholder can spend the balance from the new account
   * @param {boolean} [paramObject.delegatable=false] Whether the new account is delegatable
   * @param {string} [paramObject.delegate] The delegate for the new account
   * @param {number} [paramObject.fee=1420] The fee to set for the transaction
   * @param {number} [paramObject.gasLimit=10600] The gas limit to set for the transaction
   * @param {number} [paramObject.storageLimit=257] The storage limit to set for the transaction
   * @returns {Promise} Object containing the injected operation hash
   */
  originate = async ({
    balance,
    code,
    init,
    spendable = false,
    delegatable = false,
    delegate,
    fee = this.defaultFee,
    gasLimit = 10600,
    storageLimit = 257,
  }: ContractParams): Promise<any> => {
    let _code;
    let _init;

    if (typeof code === 'string') {
      _code = utility.ml2mic(code);
    } else {
      _code = code;
    }

    if (typeof init === 'string') {
      _init = utility.sexp2mic(init);
    } else {
      _init = init;
    }

    const script = {
      code: _code,
      storage: _init,
    };

    const publicKeyHash = this.key.publicKeyHash();
    const operation: Operation = {
      kind: 'origination',
      fee,
      gas_limit: gasLimit,
      storage_limit: storageLimit,
      balance: utility.mutez(balance),
      manager_pubkey: publicKeyHash,
      spendable,
      delegatable,
      script,
    };

    if (delegate) {
      operation.delegate = delegate;
    }

    return this.sendOperation({ operation: [operation] });
  }

  /**
   * @description Set a delegate for an account
   * @param {Object} paramObject The parameters for the operation
   * @param {string} [paramObject.delegate] The delegate for the new account
   * @param {number} [paramObject.fee=1420] The fee to set for the transaction
   * @param {number} [paramObject.gasLimit=10600] The gas limit to set for the transaction
   * @param {number} [paramObject.storageLimit=0] The storage limit to set for the transaction
   * @returns {Promise} Object containing the injected operation hash
   */
  setDelegate = async ({
    delegate,
    source = this.key.publicKeyHash(),
    fee = this.defaultFee,
    gasLimit = 10600,
    storageLimit = 0,
  }: { delegate: string, source?: string, fee?: number, gasLimit?: number, storageLimit?: number }): Promise<any> => {
    const operation = {
      kind: 'delegation',
      source,
      fee,
      gas_limit: gasLimit,
      storage_limit: storageLimit,
      delegate,
    };
    return this.sendOperation({ operation: [operation], source });
  }

  /**
   * @description Register an account as a delegate
   * @param {Object} paramObject The parameters for the operation
   * @param {number} [paramObject.fee=1420] The fee to set for the transaction
   * @param {number} [paramObject.gasLimit=10600] The gas limit to set for the transaction
   * @param {number} [paramObject.storageLimit=0] The storage limit to set for the transaction
   * @returns {Promise} Object containing the injected operation hash
   */
  registerDelegate = async ({
    fee = this.defaultFee,
    gasLimit = 10600,
    storageLimit = 0,
  }: { fee?: number, gasLimit?: number, storageLimit?: number} = {}): Promise<any> => {
    const operation = {
      kind: 'delegation',
      fee,
      gas_limit: gasLimit,
      storage_limit: storageLimit,
      delegate: this.key.publicKeyHash(),
    };
    return this.sendOperation({ operation: [operation] });
  }

  /**
   * @description Typechecks the provided code
   * @param {string | Micheline} code The code to typecheck
   * @param {number} gas The the gas limit
   * @returns {Promise} Typecheck result
   */
  typecheckCode = (code: string | Micheline, gas: number = 10000): Promise<any> => {
    let _code;

    if (typeof code === 'string') {
      _code = utility.ml2mic(code)
    } else {
      _code = code;
    }

    return this.query(`/chains/${this.chain}/blocks/head/helpers/scripts/typecheck_code`, {
      program: _code,
      gas,
    })
  }

  /**
   * @description Serializes a piece of data to a binary representation
   * @param {string | Micheline} data
   * @param {string | Micheline} type
   * @returns {Promise} Serialized data
   */
  packData = (data: string | Micheline, type: string | Micheline): Promise<any> => {
    let _data;
    let _type;

    if (typeof data === 'string') {
      _data = utility.sexp2mic(data);
    } else {
      _data = data;
    }

    if (typeof type === 'string') {
      _type = utility.sexp2mic(type);
    } else {
      _type = type;
    }

    const check = {
      data: _data,
      type: _type,
      gas: '4000000',
    };

    return this.query(`/chains/${this.chain}/blocks/head/helpers/scripts/pack_data`, check);
  }

  /**
   * @description Typechecks data against a type
   * @param {string | Micheline} data
   * @param {string | Micheline} type
   * @returns {Promise} Typecheck result
   */
  typecheckData = (data: string | Micheline, type: string | Micheline): Promise<any> => {
    let _data;
    let _type;

    if (typeof data === 'string') {
      _data = utility.sexp2mic(data);
    } else {
      _data = data;
    }

    if (typeof type === 'string') {
      _type = utility.sexp2mic(type);
    } else {
      _type = type;
    }

    const check = {
      data: data,
      type: type,
      gas: '4000000',
    };

    return this.query(`/chains/${this.chain}/blocks/head/helpers/scripts/typecheck_data`, check);
  }

  /**
   * @description Runs or traces code against an input and storage
   * @param {string | Micheline} code Code to run
   * @param {number} amount Amount in tez to send
   * @param {string | Micheline} input Input to run though code
   * @param {string | Micheline} storage State of storage
   * @param {boolean} [trace=false] Whether to trace
   * @returns {Promise} Run results
   */
  runCode = (code: string | Micheline, amount: number, input: string, storage: string, trace: boolean = false): Promise<any> => {
    const ep = trace ? 'trace_code' : 'run_code';

    let _code;
    let _input;
    let _storage;

    if (typeof code === 'string') {
      _code = utility.sexp2mic(code);
    } else {
      _code = code;
    }

    if (typeof input === 'string') {
      _input = utility.sexp2mic(input);
    } else {
      _input = input;
    }

    if (typeof storage === 'string') {
      _storage = utility.sexp2mic(storage);
    } else {
      _storage = storage;
    }

    return this.query(`/chains/${this.chain}/blocks/head/helpers/scripts/${ep}`, {
      script: _code,
      amount: `${utility.mutez(amount)}`,
      input: _input,
      storage: _storage,
    });
  }
}
