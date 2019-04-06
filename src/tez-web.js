// @flow
import XMLHttpRequest from 'xhr2';
import AbstractTezModule from './tez-core';
import forge from './forge';
import utility from './utility';
import ledger from './ledger-web';
import crypto from './crypto';
import { watermark } from './constants';

import type {
  Tez as TezInterface,
  ModuleOptions,
  Head,
  Header,
  Baker,
  Operation,
  OperationObject,
  ConstructedOperation,
  RpcParams,
  AccountParams,
  OperationParams,
  ContractParams,
  ForgedBytes,
  Signed,
  LedgerDefault,
} from './types';

/**
 * Main tez.js Library
*  @class Sotez
 * @param {String} [provider='http://127.0.0.1:8732'] Address of the node
 * @param {String} [chain='main'] Chain Id
 * @param {String} [network='main'] Network ['main', 'zero',]
 * @param {Object} [options={}]
 * @param {Number} [options.defaultFee=1278] The default fee for tranactions
 * @param {Boolean} [options.debugMode=false] Debug mode enablement
 * @param {Boolean} [options.localForge=true] Forge operations locally
 * @param {Boolean} [options.validateLocalForge=false] Validate local forge bytes against remote forged bytes
 * @example
 * import Sotez from 'sotez';
 * const sotez = new Sotez('https://127.0.0.1:8732', 'main', 'main', { defaultFee: 1275 })
 * sotez.transfer({
 *   from: 'tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4',
 *   to: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
 *   amount: '1000000',
 *   keys: {
 *     sk: 'edskRqAF8s2MKKqRMxq53CYYLMnrqvokMyrtmPRFd5H9osc4bFmqKBY119jiiqKQMti2frLAoKGgZSQN3Lc3ybf5sgPUy38e5A',
 *     pk: 'edpkuorcFt2Xbk7avzWChwDo95HVGjDF4FUZpCeXJCtLyN7dtX9oa8',
 *     pkh: 'tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4',
 *   },
 * });
 */
export default class Sotez extends AbstractTezModule implements TezInterface {
  _localForge: boolean;
  _validateLocalForge: boolean;
  _counters: { [string]: number };
  _debugMode: boolean;

  constructor(
    provider: string = 'http://127.0.0.1:8732',
    chain: string = 'main',
    net: string = 'main',
    options: ModuleOptions = {},
  ) {
    super(provider, chain, net, options);
    this._localForge = options.localForge || true;
    this._validateLocalForge = options.validateLocalForge || false;
    this._counters = {};
    this._debugMode = options.debugMode || false;
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

  set counters(counters: { [string]: number }) {
    this._counters = counters;
  }

  get debugMode() {
    return this._debugMode;
  }

  set debugMode(t: boolean): void {
    this._debugMode = t;
  }

  setProvider(provider: string, chain: string = this.chain, network: string = this.network) {
    super.setProvider(provider, chain, network);
    this.provider = provider;
    this.chain = chain;
    this.network = network;
  }

  /**
   * @description Queries a node given a path and payload
   * @param {String} path The RPC path to query
   * @param {String} payload The payload of the query
   * @param {String} method The request method. Either 'GET' or 'POST'
   * @returns {Promise} The response of the query
   * @example
   * sotez.query(`/chains/main/blocks/head`)
   *  .then(head => console.log(head));
   */
  query = (path: string, payload: ?any, method: ?string): Promise<any> => {
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
            console.log('Node call', path, payload);
          }
          if (http.status === 200) {
            if (http.responseText) {
              let response = JSON.parse(http.responseText);
              if (this._debugMode) {
                console.log('Node response', path, payload, response);
              }
              if (typeof response.error !== 'undefined') {
                reject(response.error);
              } else {
                if (typeof response.ok !== 'undefined') response = response.ok;
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
   * @param {Object} [paramObject.keys] The keys for which to originate the account. If using a ledger, this is optional
   * @param {Number} paramObject.amount The amount in tez to transfer for the initial balance
   * @param {Boolean} [paramObject.spendable] Whether the keyholder can spend the balance from the new account
   * @param {Boolean} [paramObject.delegatable] Whether the new account is delegatable
   * @param {String} [paramObject.delegate] The delegate for the new account
   * @param {Number} [paramObject.fee=1278] The fee to set for the transaction
   * @param {Number} [paramObject.gasLimit=10000] The gas limit to set for the transaction
   * @param {Number} [paramObject.storageLimit=257] The storage limit to set for the transaction
   * @param {Object} [ledgerObject={}] The ledger parameters for the operation
   * @param {Boolean} [ledgerObject.useLedger=false] Whether to sign the transaction with a connected ledger device
   * @param {String} [ledgerObject.path=44'/1729'/0'/0'] The ledger path
   * @param {Number} [ledgerObject.curve=0x00] The value which defines the curve (0x00=tz1, 0x01=tz2, 0x02=tz3)
   * @returns {Promise} Object containing the injected operation hash
   */
  account = async ({
    keys,
    amount,
    spendable,
    delegatable,
    delegate,
    fee = this.defaultFee,
    gasLimit = 10000,
    storageLimit = 257,
  }: AccountParams, {
      useLedger = false,
      path = "44'/1729'/0'/0'",
      curve = 0x00,
    }: LedgerDefault = {}): Promise<any> => {
    let publicKeyHash = '';
    if (keys && keys.pkh) {
      publicKeyHash = keys.pkh;
    }

    if (useLedger) {
      const { address } = await ledger.getAddress({
        path,
        curve,
      });
      publicKeyHash = address;
    }

    const params = {};
    if (typeof spendable !== 'undefined') params.spendable = spendable;
    if (typeof delegatable !== 'undefined') params.delegatable = delegatable;
    if (typeof delegate !== 'undefined' && delegate) params.delegate = delegate;

    const managerKey = this.network === 'zero' ? 'managerPubkey' : 'manager_pubkey';

    const operation: Array<Operation> = [{
      kind: 'origination',
      balance: utility.mutez(amount),
      fee,
      gas_limit: gasLimit,
      storage_limit: storageLimit,
      [managerKey]: publicKeyHash,
      ...params,
    }];

    return this.sendOperation({
      from: publicKeyHash,
      operation,
      keys,
    }, { useLedger, path, curve });
  }

  /**
   * @description Get the balance for a contract
   * @param {String} address The contract for which to retrieve the balance
   * @returns {Promise} The balance of the contract
   * @example
   * sotez.getBalance('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
   *   .then(balance => console.log(balance))
   */
  getBalance = (address: string): Promise<string> => (
    this.query(`/chains/${this.chain}/blocks/head/context/contracts/${address}/balance`)
  )

  /**
   * @description Get the delegate for a contract
   * @param {String} address The contract for which to retrieve the delegate
   * @returns {Promise} The delegate of a contract, if any
   * @example
   * sotez.getDelegate('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
   *   .then(delegate => console.log(delegate))
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
   * @param {String} address The contract for which to retrieve the manager
   * @returns {Promise} The manager of a contract
   * @example
   * sotez.getManager('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
   *   .then(({ manager, key }) => console.log(manager, key))
   */
  getManager = (address: string): Promise<{ manager: string, key: string }> => (
    this.query(`/chains/${this.chain}/blocks/head/context/contracts/${address}/manager_key`)
  )

  /**
   * @description Get the counter for an contract
   * @param {String} address The contract for which to retrieve the counter
   * @returns {Promise} The counter of a contract, if any
   * @example
   * sotez.getCounter('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
   *   .then(counter => console.log(counter))
   */
  getCounter = (address: string): Promise<string> => (
    this.query(`/chains/${this.chain}/blocks/head/context/contracts/${address}/counter`)
  )

  /**
   * @description Get the baker information for an address
   * @param {String} address The contract for which to retrieve the baker information
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
   *   ))
   */
  getBaker = (address: string): Promise<Baker> => (
    this.query(`/chains/${this.chain}/blocks/head/context/delegates/${address}`)
  )

  /**
   * @description Get the header of the current head
   * @returns {Promise} The whole block header
   * @example
   * sotez.getHeader().then(header => console.log(header))
   */
  getHeader = (): Promise<Header> => (
    this.query(`/chains/${this.chain}/blocks/head/header`)
  )

  /**
   * @description Get the current head block of the chain
   * @returns {Promise} The current head block
   * @example
   * sotez.getHead().then(head => console.log(head))
   */
  getHead = (): Promise<Head> => this.query(`/chains/${this.chain}/blocks/head`)

  /**
   * @description Get the current head block hash of the chain
   * @returns {Promise} The block's hash, its unique identifier
   * @example
   * sotez.getHeadHash().then(headHash => console.log(headHash))
   */
  getHeadHash = (): Promise<string> => this.query(`/chains/${this.chain}/blocks/head/hash`)

  /**
   * @description Ballots casted so far during a voting period
   * @returns {Promise} Ballots casted so far during a voting period
   * @example
   * sotez.getBallotList().then(ballotList => console.log(ballotList))
   */
  getBallotList = (): Promise<Array<any>> => (
    this.query(`/chains/${this.chain}/blocks/head/votes/ballot_list`)
  )

  /**
   * @description List of proposals with number of supporters
   * @returns {Promise} List of proposals with number of supporters
   * @example
   * sotez.getProposals().then(proposals => {
   *   console.log(proposals[0][0], proposals[0][1])
   *   console.log(proposals[1][0], proposals[1][1])
   * )
   */
  getProposals = (): Promise<Array<any>> => (
    this.query(`/chains/${this.chain}/blocks/head/votes/proposals`)
  )

  /**
   * @description Sum of ballots casted so far during a voting period
   * @returns {Promise} Sum of ballots casted so far during a voting period
   * @example
   * sotez.getBallots().then(({ yay, nay, pass }) => console.log(yay, nay, pass))
   */
  getBallots = (): Promise<{ yay: number, nay: number, pass: number }> => (
    this.query(`/chains/${this.chain}/blocks/head/votes/ballots`)
  )

  /**
   * @description List of delegates with their voting weight, in number of rolls
   * @returns {Promise} The ballots of the current voting period
   * @example
   * sotez.getListings().then(listings => console.log(listings))
   */
  getListings = (): Promise<Array<any>> => (
    this.query(`/chains/${this.chain}/blocks/head/votes/listings`)
  )

  /**
   * @description Current proposal under evaluation
   * @returns {Promise} Current proposal under evaluation
   * @example
   * sotez.getCurrentProposal().then(currentProposal => console.log(currentProposal))
   */
  getCurrentProposal = (): Promise<string> => (
    this.query(`/chains/${this.chain}/blocks/head/votes/current_proposal`)
  )

  /**
   * @description Current period kind
   * @returns {Promise} Current period kind
   * @example
   * sotez.getCurrentPeriod().then(currentPeriod => console.log(currentPeriod))
   */
  getCurrentPeriod = () => (
    this.query(`/chains/${this.chain}/blocks/head/votes/current_period_kind`)
  )

  /**
   * @description Current expected quorum
   * @returns {Promise} Current expected quorum
   * @example
   * sotez.getCurrentQuorum().then(currentQuorum => console.log(currentQuorum))
   */
  getCurrentQuorum = (): Promise<number> => (
    this.query(`/chains/${this.chain}/blocks/head/votes/current_quorum`)
  )

  /**
   * @description Check for the inclusion of an operation in new blocks
   * @param {String} hash The operation hash to check
   * @param {Number} [interval=10] The interval to check new blocks
   * @param {Number} [timeout=180] The time before the operation times out
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
   * @param {String} path The path to query
   * @param {Object} payload The payload of the request
   * @returns {Promise} The response of the rpc call
   */
  call = (path: string, payload: ?OperationObject): Promise<any> => this.query(path, payload)

  /**
   * @description Prepares an operation
   * @param {Object} paramObject The parameters for the operation
   * @param {String} paramObject.from The address sending the operation
   * @param {Object|Array} paramObject.operation The operation to include in the transaction
   * @param {Object|Boolean} [paramObject.keys=false] The keys for which to originate the account
   * @param {Object} [ledgerObject] The ledger parameters for the operation
   * @param {Boolean} [ledgerObject.useLedger=false] Whether to sign the transaction with a connected ledger device
   * @param {String} [ledgerObject.path=44'/1729'/0'/0'] The ledger path
   * @param {Number} [ledgerObject.curve=0x00] The value which defines the curve (0x00=tz1, 0x01=tz2, 0x02=tz3)
   * @returns {Promise} Object containing the prepared operation
   * @example
   * sotez.prepareOperation({
   *   from: 'tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4',
   *   operation: {
   *     kind: 'transaction',
   *     fee: '50000',
   *     gas_limit: '10200',
   *     storage_limit: '0',
   *     amount: '1000',
   *     destination: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
   *   },
   *   keys: {
   *     sk: 'edskRqAF8s2MKKqRMxq53CYYLMnrqvokMyrtmPRFd5H9osc4bFmqKBY119jiiqKQMti2frLAoKGgZSQN3Lc3ybf5sgPUy38e5A',
   *     pk: 'edpkuorcFt2Xbk7avzWChwDo95HVGjDF4FUZpCeXJCtLyN7dtX9oa8',
   *     pkh: 'tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4',
   *   },
   * }).then(({ opbytes, opOb, counter }) => console.log(opbytes, opOb, counter));
   */
  prepareOperation = ({
    from,
    operation,
    keys,
  }: OperationParams, {
    useLedger = false,
    path = "44'/1729'/0'/0'",
    curve = 0x00,
  }: LedgerDefault = {}): Promise<ForgedBytes> => {
    let counter;
    const opOb: OperationObject = {};
    const promises = [];
    let requiresReveal = false;
    let ops = [];
    let head: Header;

    promises.push(this.getHeader());

    if (Array.isArray(operation)) {
      ops = [...operation];
    } else {
      ops = [operation];
    }

    for (let i = 0; i < ops.length; i++) {
      if (['transaction', 'origination', 'delegation'].includes(ops[i].kind)) {
        requiresReveal = true;
        promises.push(this.getCounter(from));
        promises.push(this.getManager(from));
        break;
      }
    }

    return Promise.all(promises).then(async ([header, headCounter, manager]: Array<any>): Promise<ForgedBytes> => {
      head = header;
      if (requiresReveal && (keys || useLedger) && typeof manager.key === 'undefined') {
        let publicKey = keys && keys.pk;

        if (useLedger) {
          ({ publicKey } = await ledger.getAddress({
            path,
            curve,
          }));
        }

        const reveal: Operation = {
          kind: 'reveal',
          fee: this.network === 'zero' ? 100000 : 1269,
          public_key: publicKey,
          source: from,
          gas_limit: 10000,
          storage_limit: 0,
        };

        ops.unshift(reveal);
      }

      counter = parseInt(headCounter, 10);
      if (!this._counters[from] || this._counters[from] < counter) {
        this._counters[from] = counter;
      }

      const constructOps = (cOps: Array<Operation>): Array<ConstructedOperation> => cOps
        .map((op: Operation): string => {
          // $FlowFixMe
          const constructedOp: ConstructedOperation = { ...op };
          if (['proposals', 'ballot', 'transaction', 'origination', 'delegation'].includes(op.kind)) {
            if (typeof op.source === 'undefined') constructedOp.source = from;
          }
          if (['reveal', 'transaction', 'origination', 'delegation'].includes(op.kind)) {
            if (typeof op.amount === 'undefined') {
              constructedOp.amount = '0';
            } else {
              constructedOp.amount = `${op.amount}`;
            }
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
            constructedOp.counter = `${++this._counters[from]}`;
          }
          return JSON.stringify(constructedOp);
        })
        .map((op: string) => JSON.parse(op));

      opOb.branch = head.hash;
      opOb.contents = constructOps(ops);

      let remoteForgedBytes = '';
      if (!this._localForge || this._validateLocalForge) {
        remoteForgedBytes = await this.query(`/chains/${this.chain}/blocks/${head.hash}/helpers/forge/operations`, opOb);
      }

      opOb.protocol = head.protocol;

      if (!this._localForge) {
        return {
          opbytes: remoteForgedBytes,
          opOb,
          counter,
        };
      }

      const fullOp = await forge.forge(head, opOb, counter);

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
   * @param {String} paramObject.from The address sending the operation
   * @param {Object|Array} paramObject.operation The operation to include in the transaction
   * @param {Object|Boolean} [paramObject.keys=false] The keys for which to originate the account
   * @param {Object} [ledgerObject] The ledger parameters for the operation
   * @param {Boolean} [ledgerObject.useLedger=false] Whether to sign the transaction with a connected ledger device
   * @param {String} [ledgerObject.path=44'/1729'/0'/0'] The ledger path
   * @param {Number} [ledgerObject.curve=0x00] The value which defines the curve (0x00=tz1, 0x01=tz2, 0x02=tz3)
   * @returns {Promise} The simulated operation result
   * @example
   * sotez.simulateOperation({
   *   from: 'tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4',
   *   operation: {
   *     kind: 'transaction',
   *     fee: '50000',
   *     gas_limit: '10200',
   *     storage_limit: '0',
   *     amount: '1000',
   *     destination: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
   *   },
   *   keys: {
   *     sk: 'edskRqAF8s2MKKqRMxq53CYYLMnrqvokMyrtmPRFd5H9osc4bFmqKBY119jiiqKQMti2frLAoKGgZSQN3Lc3ybf5sgPUy38e5A',
   *     pk: 'edpkuorcFt2Xbk7avzWChwDo95HVGjDF4FUZpCeXJCtLyN7dtX9oa8',
   *     pkh: 'tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4',
   *   },
   * }).then(result => console.log(result));
   */
  simulateOperation = ({
    from,
    operation,
    keys,
  }: OperationParams, {
    useLedger = false,
    path = "44'/1729'/0'/0'",
    curve = 0x00,
  }: LedgerDefault = {}): Promise<any> => (
    this.prepareOperation({
      from,
      operation,
      keys,
    }, {
      useLedger,
      path,
      curve,
    }).then(fullOp => (
      this.query(`/chains/${this.chain}/blocks/head/helpers/scripts/run_operation`, fullOp.opOb)
    ))
  )

  /**
   * @description Send an operation
   * @param {Object} paramObject The parameters for the operation
   * @param {String} paramObject.from The address sending the operation
   * @param {Object|Array} paramObject.operation The operation to include in the transaction
   * @param {Object|Boolean} [paramObject.keys=false] The keys for which to originate the account
   * @param {Boolean} [paramObject.skipPrevalidation=false] Skip prevalidation before injecting operation
   * @param {Object} [ledgerObject] The ledger parameters for the operation
   * @param {Boolean} [ledgerObject.useLedger=false] Whether to sign the transaction with a connected ledger device
   * @param {String} [ledgerObject.path=44'/1729'/0'/0'] The ledger path
   * @param {Number} [ledgerObject.curve=0x00] The value which defines the curve (0x00=tz1, 0x01=tz2, 0x02=tz3)
   * @returns {Promise} Object containing the injected operation hash
   * @example
   * const keys = {
   *   sk: 'edskRqAF8s2MKKqRMxq53CYYLMnrqvokMyrtmPRFd5H9osc4bFmqKBY119jiiqKQMti2frLAoKGgZSQN3Lc3ybf5sgPUy38e5A',
   *   pk: 'edpkuorcFt2Xbk7avzWChwDo95HVGjDF4FUZpCeXJCtLyN7dtX9oa8',
   *   pkh: 'tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4',
   * };
   *
   * const operation = {
   *   kind: 'transaction',
   *   fee: '50000',
   *   gas_limit: '10200',
   *   storage_limit: '0',
   *   amount: '1000',
   *   destination: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
   * };
   *
   * sotez.sendOperation({
   *   from: 'tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4',
   *   operation,
   *   keys,
   * }).then(result => console.log(result));
   *
   * sotez.sendOperation({
   *   from: 'tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4',
   *   operation: [operation, operation],
   *   keys,
   * }).then(result => console.log(result));
   */
  sendOperation = async ({
    from,
    operation,
    keys,
    skipPrevalidation = false,
  }: OperationParams, {
      useLedger = false,
      path = "44'/1729'/0'/0'",
      curve = 0x00,
    }: LedgerDefault = {}): Promise<any> => {
    const fullOp: ForgedBytes = await this.prepareOperation({
      from,
      operation,
      keys,
    }, {
      useLedger,
      path,
      curve,
    });

    if (useLedger) {
      const signature = await ledger.signOperation({
        path,
        rawTxHex: fullOp.opbytes,
        curve,
      });
      fullOp.opbytes += signature;
    } else if (!keys) {
      fullOp.opbytes += '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      fullOp.opOb.signature = 'edsigtXomBKi5CTRf5cjATJWSyaRvhfYNHqSUGrn4SdbYRcGwQrUGjzEfQDTuqHhuA8b2d8NarZjz8TRf65WkpQmo423BtomS8Q';
    } else {
      const signed: Signed = await crypto.sign(fullOp.opbytes, keys.sk, watermark.generic);
      fullOp.opbytes = signed.sbytes;
      fullOp.opOb.signature = signed.edsig;
    }

    if (skipPrevalidation || useLedger) {
      return this.silentInject(fullOp.opbytes)
        .catch((e) => {
          this._counters[from] = fullOp.counter;
          throw e;
        });
    }

    return this.inject(fullOp.opOb, fullOp.opbytes)
      .catch((e) => {
        this._counters[from] = fullOp.counter;
        throw e;
      });
  }

  /**
   * @description Inject an operation
   * @param {Object} opOb The operation object
   * @param {String} sopbytes The signed operation bytes
   * @returns {Promise} Object containing the injected operation hash
   */
  inject = (opOb: OperationObject, sopbytes: string): Promise<any> => {
    const opResponse = [];
    let errors = [];

    return this.query(`/chains/${this.chain}/blocks/head/helpers/preapply/operations`, [opOb])
      .then((f) => {
        if (!Array.isArray(f)) {
          throw new Error({ error: 'RPC Fail', errors: [] });
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
          throw new Error({ error: 'Operation Failed', errors });
        }
        return this.query('/injection/operation', sopbytes);
      }).then(hash => ({
        hash,
        operations: opResponse,
      }));
  }

  /**
   * @description Inject an operation without prevalidation
   * @param {String} sopbytes The signed operation bytes
   * @returns {Promise} Object containing the injected operation hash
   */
  silentInject = (sopbytes: string): Promise<any> => (
    this.query('/injection/operation', sopbytes).then(hash => ({ hash }))
  )

  /**
   * @description Transfer operation
   * @param {Object} paramObject The parameters for the operation
   * @param {String} paramObject.from The address sending the operation
   * @param {Object} [paramObject.keys] The keys for which to originate the account. If using a ledger, this is optional
   * @param {String} paramObject.to The address of the recipient
   * @param {Number} paramObject.amount The amount in tez to transfer for the initial balance
   * @param {Number} [paramObject.fee=1278] The fee to set for the transaction
   * @param {String} [paramObject.parameter=false] The parameter for the transaction
   * @param {Number} [paramObject.gasLimit=10100] The gas limit to set for the transaction
   * @param {Number} [paramObject.storageLimit=0] The storage limit to set for the transaction
   * @param {Number} [paramObject.mutez=false] Whether the input amount is set to mutez (1/1,000,000 tez)
   * @param {Number} [paramObject.rawParam=false] Whether to accept the object parameter format
   * @param {Object} [ledgerObject] The ledger parameters for the operation
   * @param {Boolean} [ledgerObject.useLedger=false] Whether to sign the transaction with a connected ledger device
   * @param {String} [ledgerObject.path=44'/1729'/0'/0'] The ledger path
   * @param {Number} [ledgerObject.curve=0x00] The value which defines the curve (0x00=tz1, 0x01=tz2, 0x02=tz3)
   * @returns {Promise} Object containing the injected operation hash
   * @example
   * sotez.transfer({
   *   from: 'tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4',
   *   to: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
   *   amount: '1000000',
   *   keys: {
   *     sk: 'edskRqAF8s2MKKqRMxq53CYYLMnrqvokMyrtmPRFd5H9osc4bFmqKBY119jiiqKQMti2frLAoKGgZSQN3Lc3ybf5sgPUy38e5A',
   *     pk: 'edpkuorcFt2Xbk7avzWChwDo95HVGjDF4FUZpCeXJCtLyN7dtX9oa8',
   *     pkh: 'tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4',
   *   },
   *   fee: '1278',
   * }).then(result => console.log(result))
   */
  transfer = ({
    from,
    keys,
    to,
    amount,
    parameter,
    fee = this.defaultFee,
    gasLimit = 10100,
    storageLimit = 0,
    mutez = false,
    rawParam = false,
  }: RpcParams, {
    useLedger = false,
    path = "44'/1729'/0'/0'",
    curve = 0x00,
  }: LedgerDefault = {}): Promise<any> => {
    const operation: Operation = {
      kind: 'transaction',
      fee,
      gas_limit: gasLimit,
      storage_limit: storageLimit,
      amount: mutez ? utility.mutez(amount) : amount,
      destination: to,
    };
    if (parameter) {
      operation.parameters = rawParam ? parameter : utility.sexp2mic(parameter);
    }
    return this.sendOperation({ from, operation: [operation], keys }, { useLedger, path, curve });
  }

  /**
   * @description Activate an account
   * @param {Object} pkh The public key hash of the account
   * @param {String} secret The secret to activate the account
   * @returns {Promise} Object containing the injected operation hash
   * @example
   * sotez.activate(pkh, secret)
   *   .then((activateOperation) => console.log(activateOperation))
   */
  activate = (pkh: string, secret: string): Promise<any> => {
    const operation = {
      kind: 'activate_account',
      pkh,
      secret,
    };
    return this.sendOperation({ from: pkh, operation: [operation] }, { useLedger: false });
  }

  /**
   * @description Originate a new contract
   * @param {Object} paramObject The parameters for the operation
   * @param {Object} [paramObject.keys] The keys for which to originate the account. If using a ledger, this is optional
   * @param {Number} paramObject.amount The amount in tez to transfer for the initial balance
   * @param {String} paramObject.code The code to deploy for the contract
   * @param {String} paramObject.init The initial storage of the contract
   * @param {Boolean} [paramObject.spendable=false] Whether the keyholder can spend the balance from the new account
   * @param {Boolean} [paramObject.delegatable=false] Whether the new account is delegatable
   * @param {String} [paramObject.delegate] The delegate for the new account
   * @param {Number} [paramObject.fee=1278] The fee to set for the transaction
   * @param {Number} [paramObject.gasLimit=10000] The gas limit to set for the transaction
   * @param {Number} [paramObject.storageLimit=257] The storage limit to set for the transaction
   * @param {Object} [ledgerObject] The ledger parameters for the operation
   * @param {Boolean} [ledgerObject.useLedger=false] Whether to sign the transaction with a connected ledger device
   * @param {String} [ledgerObject.path=44'/1729'/0'/0'] The ledger path
   * @param {Number} [ledgerObject.curve=0x00] The value which defines the curve (0x00=tz1, 0x01=tz2, 0x02=tz3)
   * @returns {Promise} Object containing the injected operation hash
   */
  originate = async ({
    keys,
    amount,
    code,
    init,
    spendable = false,
    delegatable = false,
    delegate,
    fee = this.defaultFee,
    gasLimit = 10000,
    storageLimit = 257,
  }: ContractParams, {
      useLedger = false,
      path = "44'/1729'/0'/0'",
      curve = 0x00,
    }: LedgerDefault = {}): Promise<any> => {
    const _code = utility.ml2mic(code);

    const script = {
      code: _code,
      storage: utility.sexp2mic(init),
    };

    let publicKeyHash = keys && keys.pkh;
    if (useLedger) {
      const { address } = await ledger.getAddress({
        path,
        curve,
      });
      publicKeyHash = address;
    }

    const operation: Operation = {
      kind: 'origination',
      fee,
      gas_limit: gasLimit,
      storage_limit: storageLimit,
      balance: utility.mutez(amount),
      spendable,
      delegatable,
      delegate: (typeof delegate !== 'undefined' && delegate ? delegate : publicKeyHash),
      script,
    };

    if (this.network === 'zero') {
      operation.manager_pubkey = publicKeyHash;
    } else {
      operation.managerPubkey = publicKeyHash;
    }

    return this.sendOperation({ from: publicKeyHash, operation: [operation], keys }, { useLedger, path, curve });
  }

  /**
   * @description Set a delegate for an account
   * @param {Object} paramObject The parameters for the operation
   * @param {String} paramObject.from The address sending the operation
   * @param {Object} [paramObject.keys] The keys for which to originate the account. If using a ledger, this is optional
   * @param {String} [paramObject.delegate] The delegate for the new account
   * @param {Number} [paramObject.fee=1278] The fee to set for the transaction
   * @param {Number} [paramObject.gasLimit=10000] The gas limit to set for the transaction
   * @param {Number} [paramObject.storageLimit=0] The storage limit to set for the transaction
   * @param {Object} [ledgerObject] The ledger parameters for the operation
   * @param {Boolean} [ledgerObject.useLedger=false] Whether to sign the transaction with a connected ledger device
   * @param {String} [ledgerObject.path=44'/1729'/0'/0'] The ledger path
   * @param {Number} [ledgerObject.curve=0x00] The value which defines the curve (0x00=tz1, 0x01=tz2, 0x02=tz3)
   * @returns {Promise} Object containing the injected operation hash
   */
  setDelegate = async ({
    from,
    keys,
    delegate,
    fee = this.defaultFee,
    gasLimit = 10000,
    storageLimit = 0,
  }: RpcParams, {
      useLedger = false,
      path = "44'/1729'/0'/0'",
      curve = 0x00,
    }: LedgerDefault = {}): Promise<any> => {
    let publicKeyHash = keys && keys.pkh;

    if (useLedger) {
      const { address } = await ledger.getAddress({
        path,
        curve,
      });
      publicKeyHash = address;
    }

    const operation = {
      kind: 'delegation',
      fee,
      gas_limit: gasLimit,
      storage_limit: storageLimit,
      delegate: (typeof delegate !== 'undefined' ? delegate : publicKeyHash),
    };
    return this.sendOperation({ from, operation: [operation], keys }, { useLedger, path, curve });
  }

  /**
   * @description Register an account as a delegate
   * @param {Object} paramObject The parameters for the operation
   * @param {Object} [paramObject.keys] The keys for which to originate the account. If using a ledger, this is optional
   * @param {Number} [paramObject.fee=1278] The fee to set for the transaction
   * @param {Number} [paramObject.gasLimit=10000] The gas limit to set for the transaction
   * @param {Number} [paramObject.storageLimit=0] The storage limit to set for the transaction
   * @param {Object} [ledgerObject] The ledger parameters for the operation
   * @param {Boolean} [ledgerObject.useLedger=false] Whether to sign the transaction with a connected ledger device
   * @param {String} [ledgerObject.path=44'/1729'/0'/0'] The ledger path
   * @param {Number} [ledgerObject.curve=0x00] The value which defines the curve (0x00=tz1, 0x01=tz2, 0x02=tz3)
   * @returns {Promise} Object containing the injected operation hash
   */
  registerDelegate = async ({
    keys,
    fee = this.defaultFee,
    gasLimit = 10000,
    storageLimit = 0,
  }: RpcParams, {
      useLedger = false,
      path = "44'/1729'/0'/0'",
      curve = 0x00,
    }: LedgerDefault = {}): Promise<any> => {
    let publicKeyHash = keys && keys.pkh;

    if (useLedger) {
      const { address } = await ledger.getAddress({
        path,
        curve,
      });
      publicKeyHash = address;
    }

    const operation = {
      kind: 'delegation',
      fee,
      gas_limit: gasLimit,
      storage_limit: storageLimit,
      delegate: publicKeyHash,
    };
    return this.sendOperation({ from: publicKeyHash, operation: [operation], keys }, { useLedger, path, curve });
  }

  /**
   * @description Typechecks the provided code
   * @param {String} code The code to typecheck
   * @returns {Promise} Typecheck result
   */
  typecheckCode = (code: string): Promise<any> => {
    const _code = utility.ml2mic(code);
    return this.query(`/chains/${this.chain}/blocks/head/helpers/scripts/typecheck_code`, { program: _code, gas: '10000' });
  }

  /**
   * @description Serializes a piece of data to a binary representation
   * @param {String} data
   * @param {String} type
   * @returns {Promise} Serialized data
   */
  packData = (data: string, type: string): Promise<any> => {
    const check = {
      data: utility.sexp2mic(data),
      type: utility.sexp2mic(type),
      gas: '4000000',
    };
    return this.query(`/chains/${this.chain}/blocks/head/helpers/scripts/pack_data`, check);
  }

  /**
   * @description Typechecks data against a type
   * @param {String} data
   * @param {String} type
   * @returns {Promise} Typecheck result
   */
  typecheckData = (data: string, type: string): Promise<any> => {
    const check = {
      data: utility.sexp2mic(data),
      type: utility.sexp2mic(type),
      gas: '4000000',
    };
    return this.query(`/chains/${this.chain}/blocks/head/helpers/scripts/typecheck_data`, check);
  }

  /**
   * @description Runs or traces code against an input and storage
   * @param {String} code Code to run
   * @param {Number} amount Amount to send
   * @param {String} input Input to run though code
   * @param {String} storage State of storage
   * @param {Boolean} [trace=false] Whether to trace
   * @returns {Promise} Run results
   */
  runCode = (code: string, amount: number, input: string, storage: string, trace: boolean = false): Promise<any> => {
    const ep = trace ? 'trace_code' : 'run_code';
    return this.query(`/chains/${this.chain}/blocks/head/helpers/scripts/${ep}`, {
      script: utility.ml2mic(code),
      amount: `${utility.mutez(amount)}`,
      input: utility.sexp2mic(input),
      storage: utility.sexp2mic(storage),
    });
  }
}
