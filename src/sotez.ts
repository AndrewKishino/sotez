import { AbstractTezModule } from './tez-core';
import { Key } from './key';
import { Contract } from './contract';
import { forge } from './forge';
import { mutez, totez, sexp2mic, ml2mic } from './utility';
import { magicBytes } from './constants';

interface ModuleOptions {
  defaultFee?: number;
  useMutez?: boolean;
  useLimitEstimator?: boolean;
  chainId?: string;
  localForge?: boolean;
  validateLocalForge?: boolean;
  debugMode?: boolean;
}

interface Operation<T> {
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
  fee?: T;
  counter?: T;
  gas_limit?: T;
  storage_limit?: T;
  parameters?: Micheline;
  balance?: T;
  delegate?: string;
  amount?: T;
  destination?: string;
  public_key?: string;
  script?: { code: Micheline; storage: Micheline };
}

interface Block {
  protocol: string;
  chain_id: string;
  hash: string;
  header: Header;
  metadata: any;
  operations: Operation<string>[][];
}

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
}

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
}

interface OperationObject {
  hash?: string;
  branch?: string;
  contents?: Operation<string>[];
  protocol?: string;
  signature?: string;
}

type Micheline =
  | {
      entrypoint: string;
      value:
        | {
            prim: string;
            args?: Micheline[];
            annots?: string[];
          }
        | { bytes: string }
        | { int: string }
        | { string: string }
        | { address: string }
        | { contract: string }
        | { key: string }
        | { key_hash: string }
        | { signature: string }
        | Micheline[];
    }
  | {
      prim: string;
      args?: Micheline[];
      annots?: string[];
    }
  | { bytes: string }
  | { int: string }
  | { string: string }
  | { address: string }
  | { contract: string }
  | { key: string }
  | { key_hash: string }
  | { signature: string }
  | Micheline[];

interface Keys {
  pk: string;
  pkh: string;
  sk: string;
  password?: string;
}

interface RpcParams {
  to: string;
  source?: string;
  keys?: Keys;
  amount: number;
  fee?: number;
  parameters?: string | Micheline;
  gasLimit?: number;
  storageLimit?: number;
  delegate?: string;
  code?: string;
  init?: string;
}

interface OperationParams {
  operation: Operation<string | number> | Operation<string | number>[];
  source?: string;
  skipPrevalidation?: boolean;
  skipSignature?: boolean;
  simulated?: boolean;
}

interface ContractParams {
  balance: number;
  code: string | Micheline;
  delegate?: string;
  fee?: number;
  gasLimit?: number;
  init: string | Micheline;
  micheline?: boolean;
  storageLimit?: number;
}

interface ForgedBytes {
  opbytes: string;
  opOb: OperationObject;
  counter: number;
  chainId: string;
}

interface Signed {
  bytes: string;
  magicBytes: string;
  sig: string;
  prefixSig: string;
  sbytes: string;
}

const DEFAULT_FEE = 10_000;

/**
 * Main Sotez Library
 *
 * @example
 * import { Sotez } from 'sotez';
 * const tezos = new Sotez('https://127.0.0.1:8732', { defaultFee: 1500, useMutez: false, useLimitEstimator: true });
 * await tezos.importKey('edskRv6ZnkLQMVustbYHFPNsABu1Js6pEEWyMUFJQTqEZjVCU2WHh8ckcc7YA4uBzPiJjZCsv3pC1NDdV99AnyLzPjSip4uC3y');
 * const result = await tezos.transfer({
 *   to: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
 *   amount: 10,
 * });
 */
export class Sotez extends AbstractTezModule {
  _defaultFee: number;

  _useMutez: boolean;

  _useLimitEstimator: boolean;

  _localForge: boolean;

  _validateLocalForge: boolean;

  key: Key;

  constructor(provider = 'http://127.0.0.1:8732', options: ModuleOptions = {}) {
    super(provider, options.chainId, options.debugMode);
    this._localForge = options.localForge === false ? false : true; // Default: localForge = true
    this._validateLocalForge =
      options.validateLocalForge === true ? true : false; // Default: validateLocalForge = false
    this._debugMode = options.debugMode === true ? true : false; // Default: debugMode = false
    this._useMutez = options.useMutez === false ? false : true; // Default: useMutez = true
    this._useLimitEstimator = options.useLimitEstimator === true ? true : false; // Default: useLimitEstimator = true
    this._defaultFee =
      options.defaultFee || (this._useMutez ? DEFAULT_FEE : totez(DEFAULT_FEE));
  }

  get defaultFee(): number {
    return this._defaultFee;
  }

  set defaultFee(fee: number) {
    this._defaultFee = fee;
  }

  get localForge(): boolean {
    return this._localForge;
  }

  set localForge(value: boolean) {
    this._localForge = value;
  }

  get validateLocalForge(): boolean {
    return this._validateLocalForge;
  }

  set validateLocalForge(value: boolean) {
    this._validateLocalForge = value;
  }

  get debugMode(): boolean {
    return this._debugMode;
  }

  set debugMode(t: boolean) {
    this._debugMode = t;
  }

  get useMutez(): boolean {
    return this._useMutez;
  }

  set useMutez(t: boolean) {
    this._useMutez = t;
  }

  get useLimitEstimator(): boolean {
    return this._useLimitEstimator;
  }

  set useLimitEstimator(t: boolean) {
    this._useLimitEstimator = t;
  }

  /**
   * @description Import a secret key
   * @param {string} key The secret key
   * @param {string} [passphrase] The passphrase of the encrypted key
   * @param {string} [email] The email associated with the fundraiser account
   * @example
   * await tezos.importKey('edskRv6ZnkLQMVustbYHFPNsABu1Js6pEEWyMUFJQTqEZjVCU2WHh8ckcc7YA4uBzPiJjZCsv3pC1NDdV99AnyLzPjSip4uC3y')
   */
  importKey = async (
    key: string,
    passphrase?: string,
    email?: string,
  ): Promise<void> => {
    this.key = new Key({ key, passphrase, email });
    await this.key.ready;
  };

  /**
   * @description Import a ledger public key
   * @param {object} transport The ledger transport (https://github.com/LedgerHQ/ledgerjs)
   * @param {string} [path="44'/1729'/0'/0'"] The ledger path
   * @param {string} [curve="tz1"] The curve parameter
   * @example
   * import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
   * await tezos.importLedger(TransportNodeHid, "44'/1729'/0'/0'");
   */
  importLedger = async (
    transport: any,
    path = "44'/1729'/0'/0'",
    curve = 'tz1',
  ): Promise<void> => {
    this.key = new Key({
      ledgerPath: path,
      ledgerCurve: curve,
      ledgerTransport: transport,
    });
    await this.key.ready;
  };

  /**
   * @description Get the balance for a contract
   * @param {string} address The contract for which to retrieve the balance
   * @param {string|number} [block='head'] The block to query against
   * @returns {Promise} The balance of the contract
   * @example
   * tezos.getBalance('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
   *   .then(balance => console.log(balance));
   */
  getBalance = (
    address: string,
    block: string | number = 'head',
  ): Promise<string> =>
    this.query(
      `/chains/${this.chain}/blocks/${block}/context/contracts/${address}/balance`,
    );

  /**
   * @description Get the delegate for a contract
   * @param {string} address The contract for which to retrieve the delegate
   * @param {string|number} [block='head'] The block to query against
   * @returns {Promise} The delegate of a contract, if any
   * @example
   * tezos.getDelegate('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
   *   .then(delegate => console.log(delegate));
   */
  getDelegate = (
    address: string,
    block: string | number = 'head',
  ): Promise<string> =>
    this.query(
      `/chains/${this.chain}/blocks/${block}/context/contracts/${address}/delegate`,
    ).then((delegate: string) => {
      if (!delegate) {
        return '';
      }
      return delegate;
    });

  /**
   * @description Get the manager for a contract
   * @param {string} address The contract for which to retrieve the manager
   * @param {string|number} [block='head'] The block to query against
   * @returns {Promise} The manager of a contract
   * @example
   * tezos.getManager('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
   *   .then(({ manager, key }) => console.log(manager, key));
   */
  getManager = (
    address: string,
    block = 'head',
  ): Promise<{ manager: string; key: string }> =>
    this.query(
      `/chains/${this.chain}/blocks/${block}/context/contracts/${address}/manager_key`,
    );

  /**
   * @description Get the counter for an contract
   * @param {string} address The contract for which to retrieve the counter
   * @param {string|number} [block='head'] The block to query against
   * @returns {Promise} The counter of a contract, if any
   * @example
   * tezos.getCounter('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
   *   .then(counter => console.log(counter));
   */
  getCounter = (
    address: string,
    block: string | number = 'head',
  ): Promise<string> =>
    this.query(
      `/chains/${this.chain}/blocks/${block}/context/contracts/${address}/counter`,
    );

  /**
   * @description Get the baker information for an address
   * @param {string} address The contract for which to retrieve the baker information
   * @param {string|number} [block='head'] The block to query against
   * @returns {Promise} The information of the delegate address
   * @example
   * tezos.getBaker('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
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
  getBaker = (
    address: string,
    block: string | number = 'head',
  ): Promise<Baker> =>
    this.query(
      `/chains/${this.chain}/blocks/${block}/context/delegates/${address}`,
    );

  /**
   * @description Get the header of the current head
   * @param {string|number} [block='head'] The block to retrieve the header from
   * @returns {Promise} The whole block header
   * @example
   * tezos.getHeader().then(header => console.log(header));
   */
  getBlockHeader = (block: string | number = 'head'): Promise<Header> =>
    this.query(`/chains/${this.chain}/blocks/${block}/header`);

  /**
   * @description Get the metadata of the current head
   * @param {string|number} [block='head'] The block to retrieve the block metadata from
   * @returns {Promise} The head block metadata
   * @example
   * tezos.getBlockMetadata().then(metadata => console.log(metadata));
   */
  getBlockMetadata = (block: string | number = 'head'): Promise<Header> =>
    this.query(`/chains/${this.chain}/blocks/${block}/metadata`);

  /**
   * @description Get the current head block of the chain
   * @param {string|number} [block='head'] The block to retrieve
   * @returns {Promise} The current head block
   * @example
   * tezos.getHead().then(head => console.log(head));
   */
  getBlock = (block: string | number = 'head'): Promise<Block> =>
    this.query(`/chains/${this.chain}/blocks/${block}`);

  /**
   * @description Get the current head block hash of the chain
   * @param {string|number} [block='head'] The block to retrieve the hash from
   * @returns {Promise} The block's hash, its unique identifier
   * @example
   * tezos.getHeadHash().then(headHash => console.log(headHash))
   */
  getBlockHash = (block: string | number = 'head'): Promise<string> =>
    this.query(`/chains/${this.chain}/blocks/head/${block}`);

  /**
   * @description Ballots casted so far during a voting period
   * @param {string|number} [block='head'] The block to query against
   * @returns {Promise} Ballots casted so far during a voting period
   * @example
   * tezos.getBallotList().then(ballotList => console.log(ballotList));
   */
  getBallotList = (block: string | number = 'head'): Promise<any[]> =>
    this.query(`/chains/${this.chain}/blocks/${block}/votes/ballot_list`);

  /**
   * @description List of proposals with number of supporters
   * @param {string|number} [block='head'] The block to query against
   * @returns {Promise} List of proposals with number of supporters
   * @example
   * tezos.getProposals().then(proposals => {
   *   console.log(proposals[0][0], proposals[0][1])
   *   console.log(proposals[1][0], proposals[1][1])
   * );
   */
  getProposals = (block: string | number = 'head'): Promise<any[]> =>
    this.query(`/chains/${this.chain}/blocks/${block}/votes/proposals`);

  /**
   * @description Sum of ballots casted so far during a voting period
   * @param {string|number} [block='head'] The block to query against
   * @returns {Promise} Sum of ballots casted so far during a voting period
   * @example
   * tezos.getBallots().then(({ yay, nay, pass }) => console.log(yay, nay, pass));
   */
  getBallots = (
    block: string | number = 'head',
  ): Promise<{
    yay: number;
    nay: number;
    pass: number;
  }> => this.query(`/chains/${this.chain}/blocks/${block}/votes/ballots`);

  /**
   * @description List of delegates with their voting weight, in number of rolls
   * @param {string|number} [block='head'] The block to query against
   * @returns {Promise} The ballots of the current voting period
   * @example
   * tezos.getListings().then(listings => console.log(listings));
   */
  getListings = (block: string | number = 'head'): Promise<any[]> =>
    this.query(`/chains/${this.chain}/blocks/${block}/votes/listings`);

  /**
   * @description Current proposal under evaluation
   * @param {string|number} [block='head'] The block to query against
   * @returns {Promise} Current proposal under evaluation
   * @example
   * tezos.getProposal().then(currentProposal => console.log(currentProposal));
   */
  getProposal = (block: string | number = 'head'): Promise<string> =>
    this.query(`/chains/${this.chain}/blocks/${block}/votes/current_proposal`);

  /**
   * @description Current period kind
   * @param {string|number} [block='head'] The block to query against
   * @returns {Promise} Current period kind
   * @example
   * tezos.getProposalPeriod().then(proposalPeriod => console.log(proposalPeriod));
   */
  getProposalPeriod = (block: string | number = 'head') =>
    this.query(
      `/chains/${this.chain}/blocks/${block}/votes/current_period_kind`,
    );

  /**
   * @description Current expected quorum
   * @param {string|number} [block='head'] The block to query against
   * @returns {Promise} Current expected quorum
   * @example
   * tezos.getQuorum().then(quorum => console.log(quorum));
   */
  getQuorum = (block: string | number = 'head'): Promise<number> =>
    this.query(`/chains/${this.chain}/blocks/${block}/votes/current_quorum`);

  /**
   * @description Current pending operations in the mempool
   * @returns {Promise} Pending operations
   * @example
   * tezos.getPendingOperations().then(({ applied }) => console.log(applied));
   */
  getPendingOperations = (): Promise<any> =>
    this.query(`/chains/${this.chain}/mempool/pending_operations`);

  /**
   * @description Check for the inclusion of an operation in new blocks
   * @param {string} hash The operation hash to check
   * @param {number} [interval=10] The interval to check new blocks (in seconds)
   * @param {number} [timeout=180] The time before the operation times out (in seconds)
   * @returns {Promise} The hash of the block in which the operation was included
   * @example
   * tezos.awaitOperation('ooYf5iK6EdTx3XfBusgDqS6znACTq5469D1zQSDFNrs5KdTuUGi')
   *  .then((hash) => console.log(hash));
   */
  awaitOperation = (
    hash: string,
    interval = 5,
    timeout = 180,
  ): Promise<string> => {
    if (!hash) {
      throw new Error('No operation hash provided to awaitOperation');
    }

    if (timeout <= 0) {
      throw new Error('Timeout must be more than 0');
    }

    if (interval <= 0) {
      throw new Error('Interval must be more than 0');
    }

    let timeoutHandle: ReturnType<typeof setTimeout>;
    const hashMap: Record<string, boolean> = {};

    const operationCheck = (operation: Operation<string>): boolean =>
      operation.hash === hash;

    return new Promise((resolve, reject) => {
      const clearTimeoutHandle = setTimeout(() => {
        clearTimeout(timeoutHandle);
        reject(
          new Error(
            `Timed out waiting for operation ${hash} after ${timeout} seconds`,
          ),
        );
      }, timeout * 1000);

      const repeater = (): void => {
        this.getBlock().then((block: Block) => {
          if (!hashMap[block.hash]) {
            hashMap[block.hash] = true;
            for (let i = 3; i >= 0; i--) {
              if (block.operations[i].some(operationCheck)) {
                clearTimeout(clearTimeoutHandle);
                resolve(block.hash);
                return;
              }
            }
          }
          timeoutHandle = setTimeout(repeater, interval * 1000);
        });
      };

      repeater();
    });
  };

  /**
   * @description Prepares an operation
   * @param {object} paramObject The parameters for the operation
   * @param {object | Array} paramObject.operation The operation to include in the transaction
   * @param {string} [paramObject.source] The source address of the operation
   * @param {boolean} [paramObject.simulated] Whether the operation is being prepared for a simulation
   * @returns {Promise} Object containing the prepared operation
   * @example
   * tezos.prepareOperation({
   *   operation: {
   *     kind: 'transaction',
   *     fee: 1420,
   *     gas_limit: 10600,
   *     storage_limit: 300,
   *     amount: 1000,
   *     destination: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
   *   }
   * }).then(({ opbytes, opOb, counter }) => console.log(opbytes, opOb, counter));
   */
  prepareOperation = async ({
    operation,
    source,
    simulated,
  }: OperationParams): Promise<ForgedBytes> => {
    let counter: number;
    const opOb: OperationObject = {};
    const promises: any[] = [];
    let requiresReveal = false;
    let preOps: Operation<string | number>[] = [];
    let head: Header;

    promises.push(this.getBlockHeader());
    promises.push(this.getBlockMetadata());
    promises.push(this.getBlockHeader('head~2'));

    if (Array.isArray(operation)) {
      preOps = [...operation];
    } else {
      preOps = [operation];
    }

    const publicKeyHash = source || (await this.key.publicKeyHash());

    for (let i = 0; i < preOps.length; i++) {
      if (
        ['transaction', 'origination', 'delegation'].includes(preOps[i].kind)
      ) {
        requiresReveal = true;

        promises.push(this.getManager(publicKeyHash));
        promises.push(this.getCounter(publicKeyHash));
        break;
      }
    }

    return Promise.all(promises).then(
      async ([
        header,
        metadata,
        finalHeader,
        manager,
        headCounter,
      ]: any[]): Promise<ForgedBytes> => {
        head = header;

        if (requiresReveal) {
          if (!manager && preOps.every((op) => op.kind !== 'reveal')) {
            preOps.unshift({
              kind: 'reveal',
              fee: this.defaultFee,
              public_key: await this.key.publicKey(),
              source: publicKeyHash,
              gas_limit: 10600,
              storage_limit: 300,
            });
          }
        }

        let ops = preOps;

        if (this.useLimitEstimator && !simulated) {
          ops = await this.estimateLimits(preOps, source);
        }

        counter = parseInt(headCounter, 10);

        const constructOps = (
          cOps: Operation<string | number>[],
        ): Operation<string | number>[] =>
          cOps.map((op: Operation<string | number>) => {
            const constructedOp: Operation<string | number> = {
              ...op,
            };

            if (
              [
                'proposals',
                'ballot',
                'transaction',
                'origination',
                'delegation',
              ].includes(op.kind)
            ) {
              constructedOp.source ||= publicKeyHash;
            }

            if (
              ['reveal', 'transaction', 'origination', 'delegation'].includes(
                op.kind,
              )
            ) {
              const fee = `${op.fee ?? this.defaultFee}`;
              constructedOp.fee = this.useMutez ? fee : mutez(fee);
              constructedOp.gas_limit = `${op.gas_limit ?? 10600}`;
              constructedOp.storage_limit = `${op.storage_limit ?? 257}`;
              constructedOp.counter = `${++counter}`;

              if (typeof op.balance !== 'undefined') {
                constructedOp.balance = this.useMutez
                  ? `${op.balance}`
                  : mutez(op.balance);
              }

              if (typeof op.amount !== 'undefined') {
                constructedOp.amount = this.useMutez
                  ? `${op.amount}`
                  : mutez(op.amount);
              }
            }

            return constructedOp;
          });

        // anchor the operation on a branch which is considered "final" (head~2)
        opOb.branch = finalHeader.hash;
        opOb.contents = constructOps(ops) as Operation<string>[];

        let remoteForgedBytes = '';
        if (!this._localForge || this._validateLocalForge) {
          remoteForgedBytes = await this.query(
            `/chains/${this.chain}/blocks/${head.hash}/helpers/forge/operations`,
            opOb,
          );
        }

        opOb.protocol = metadata.next_protocol as string;

        if (!this._localForge) {
          return {
            opbytes: remoteForgedBytes,
            opOb,
            counter,
            chainId: head.chain_id,
          };
        }

        const fullOp = await forge(opOb, counter, metadata.next_protocol);

        if (this._validateLocalForge) {
          if (fullOp.opbytes === remoteForgedBytes) {
            return {
              ...fullOp,
              counter,
              chainId: head.chain_id,
            };
          }
          throw new Error(
            "Forge validation error - local and remote bytes don't match",
          );
        }

        return {
          ...fullOp,
          counter,
          chainId: head.chain_id,
        };
      },
    );
  };

  /**
   * @description Simulate an operation
   * @param {object} paramObject The parameters for the operation
   * @param {object | Array} paramObject.operation The operation to include in the transaction
   * @param {string} [paramObject.source] The source address of the operation
   * @returns {Promise} The simulated operation result
   * @example
   * tezos.simulateOperation({
   *   operation: {
   *     kind: 'transaction',
   *     fee: 1420,
   *     gas_limit: 10600,
   *     storage_limit: 300,
   *     amount: 1000,
   *     destination: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
   *   },
   * }).then(result => console.log(result));
   */
  simulateOperation = ({ operation, source }: OperationParams): Promise<any> =>
    this.prepareOperation({
      operation,
      source,
      simulated: true,
    }).then((fullOp) => {
      delete fullOp.opOb.protocol;
      fullOp.opOb.signature =
        'edsigtXomBKi5CTRf5cjATJWSyaRvhfYNHqSUGrn4SdbYRcGwQrUGjzEfQDTuqHhuA8b2d8NarZjz8TRf65WkpQmo423BtomS8Q';
      return this.query(
        `/chains/${this.chain}/blocks/head/helpers/scripts/run_operation`,
        {
          chain_id: fullOp.chainId,
          operation: fullOp.opOb,
        },
      );
    });

  /**
   * @description Send an operation
   * @param {object} paramObject The parameters for the operation
   * @param {object | Array} paramObject.operation The operation to include in the transaction
   * @param {string} [paramObject.source] The source address of the operation
   * @param {boolean} [paramObject.skipSignature=false] Use default signature for specific transactions
   * @param {boolean} [paramObject.skipPrevalidation=false] Skip prevalidation before injecting operation
   * @returns {Promise} Object containing the injected operation hash
   * @example
   * const operation = {
   *   kind: 'transaction',
   *   fee: 1420,
   *   gas_limit: 10600,
   *   storage_limit: 300,
   *   amount: 1000,
   *   destination: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
   * };
   *
   * tezos.sendOperation({ operation }).then(result => console.log(result));
   *
   * tezos.sendOperation({ operation: [operation, operation] }).then(result => console.log(result));
   */
  sendOperation = async ({
    operation,
    source,
    skipPrevalidation = false,
    skipSignature = false,
  }: OperationParams): Promise<any> => {
    const fullOp: ForgedBytes = await this.prepareOperation({
      operation,
      source,
    });

    if (skipSignature) {
      fullOp.opbytes +=
        '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      fullOp.opOb.signature =
        'edsigtXomBKi5CTRf5cjATJWSyaRvhfYNHqSUGrn4SdbYRcGwQrUGjzEfQDTuqHhuA8b2d8NarZjz8TRf65WkpQmo423BtomS8Q';
    } else {
      const signed: Signed = await this.key.sign(
        fullOp.opbytes,
        magicBytes.generic,
      );
      fullOp.opbytes = signed.sbytes;
      fullOp.opOb.signature = signed.prefixSig;
    }

    if (skipPrevalidation) {
      return this.silentInject(fullOp.opbytes);
    }

    return this.inject(fullOp.opOb, fullOp.opbytes);
  };

  /**
   * @description Inject an operation
   * @param {object} opOb The operation object
   * @param {string} sopbytes The signed operation bytes
   * @returns {Promise} Object containing the injected operation hash
   */
  inject = (opOb: OperationObject, sopbytes: string): Promise<any> => {
    const opResponse: any[] = [];
    const errors: any[] = [];

    return this.query(
      `/chains/${this.chain}/blocks/head/helpers/preapply/operations`,
      [opOb],
    )
      .then((results) => {
        if (!Array.isArray(results)) {
          throw new Error('RPC Fail');
        }

        results.forEach((result) => {
          result.contents.forEach(
            (content: {
              metadata: { operation_result?: { status: string; errors?: any } };
            }) => {
              opResponse.push(content);

              if (content.metadata.operation_result?.status === 'failed') {
                errors.push(content.metadata.operation_result.errors);
              }
            },
          );
        });

        if (errors.length) {
          throw new Error(
            JSON.stringify({ error: 'Operation Failed', errors }, null, 2),
          );
        }
        return this.query('/injection/operation', sopbytes);
      })
      .then((hash) => ({
        hash,
        operations: opResponse,
      }));
  };

  /**
   * @description Inject an operation without prevalidation
   * @param {string} sopbytes The signed operation bytes
   * @returns {Promise} Object containing the injected operation hash
   */
  silentInject = (sopbytes: string): Promise<any> =>
    this.query('/injection/operation', sopbytes).then((hash) => ({
      hash,
    }));

  /**
   * @description Transfer operation
   * @param {object | Array} transferParams The parameters for the operation
   * @param {string} transferParams.to The address of the recipient
   * @param {number} transferParams.amount The amount in tez to transfer for the initial balance
   * @param {string} [transferParams.source] The source address of the transfer
   * @param {number} [transferParams.fee=10000] The fee to set for the transaction
   * @param {string} [transferParams.parameters] The parameter for the transaction
   * @param {number} [transferParams.gasLimit=10600] The gas limit to set for the transaction
   * @param {number} [transferParams.storageLimit=300] The storage limit to set for the transaction
   * @returns {Promise} Object containing the injected operation hash
   * @example
   * tezos.transfer({
   *   to: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
   *   amount: 1000000,
   *   fee: 1420,
   * }).then(result => console.log(result));
   */
  transfer = async (transferParams: RpcParams | RpcParams[]): Promise<any> => {
    const transfers = Array.isArray(transferParams)
      ? [...transferParams]
      : [transferParams];

    const operations: Operation<string | number>[] = transfers.map(
      ({
        to,
        amount,
        source,
        fee,
        gasLimit,
        storageLimit,
        parameters,
      }): Operation<string | number> => {
        const op: Operation<string | number> = {
          kind: 'transaction',
          destination: to,
          amount,
          fee,
          ...(source ? { source } : {}),
          ...(gasLimit ? { gas_limit: gasLimit } : {}),
          ...(storageLimit ? { storage_limit: storageLimit } : {}),
        };

        if (parameters) {
          if (typeof parameters === 'string') {
            op.parameters = sexp2mic(parameters);
          } else {
            op.parameters = parameters;
          }
        }

        return op;
      },
    );

    return this.sendOperation({
      operation: operations,
    });
  };

  /**
   * @description Activate an account
   * @param {object} pkh The public key hash of the account
   * @param {string} secret The secret to activate the account
   * @returns {Promise} Object containing the injected operation hash
   * @example
   * tezos.activate(pkh, secret)
   *   .then((activateOperation) => console.log(activateOperation));
   */
  activate = (pkh: string, secret: string): Promise<any> => {
    const operation = {
      kind: 'activate_account',
      pkh,
      secret,
    };
    return this.sendOperation({
      operation: [operation],
      source: pkh,
      skipSignature: true,
    });
  };

  /**
   * @description Originate a new contract
   * @param {object} paramObject The parameters for the operation
   * @param {number} paramObject.balance The amount in tez to transfer for the initial balance
   * @param {string | Micheline} paramObject.code The code to deploy for the contract
   * @param {string | Micheline} paramObject.init The initial storage of the contract
   * @param {string} [paramObject.delegate] The delegate for the new account
   * @param {number} [paramObject.fee=10000] The fee to set for the transaction
   * @param {number} [paramObject.gasLimit=10600] The gas limit to set for the transaction
   * @param {number} [paramObject.storageLimit=257] The storage limit to set for the transaction
   * @returns {Promise} Object containing the injected operation hash
   */
  originate = async ({
    balance,
    code,
    init,
    delegate,
    fee = this.defaultFee,
    gasLimit = 10600,
    storageLimit = 257,
  }: ContractParams): Promise<any> => {
    let _code;
    let _init;

    if (typeof code === 'string') {
      _code = ml2mic(code);
    } else {
      _code = code;
    }

    if (typeof init === 'string') {
      _init = sexp2mic(init);
    } else {
      _init = init;
    }

    const script = {
      code: _code,
      storage: _init,
    };

    const operation: Operation<string | number> = {
      kind: 'origination',
      fee,
      balance,
      script,
      ...(gasLimit ? { gas_limit: gasLimit } : {}),
      ...(storageLimit ? { storage_limit: storageLimit } : {}),
    };

    if (delegate) {
      operation.delegate = delegate;
    }

    return this.sendOperation({ operation });
  };

  /**
   * @description Set a delegate for an account
   * @param {object} paramObject The parameters for the operation
   * @param {string} [paramObject.delegate] The delegate for the new account
   * @param {number} [paramObject.fee=10000] The fee to set for the transaction
   * @param {number} [paramObject.gasLimit=10600] The gas limit to set for the transaction
   * @param {string} [paramObject.source] The source address of the operation
   * @param {number} [paramObject.storageLimit=0] The storage limit to set for the transaction
   * @returns {Promise} Object containing the injected operation hash
   */
  setDelegate = async ({
    delegate,
    source,
    fee = this.defaultFee,
    gasLimit = 10600,
    storageLimit = 0,
  }: {
    delegate: string;
    source?: string;
    fee?: number;
    gasLimit?: number;
    storageLimit?: number;
  }): Promise<any> => {
    source ??= await this.key.publicKeyHash();

    const operation: Operation<string | number> = {
      kind: 'delegation',
      source,
      fee,
      delegate,
      ...(gasLimit ? { gas_limit: gasLimit } : {}),
      ...(storageLimit ? { storage_limit: storageLimit } : {}),
    };

    return this.sendOperation({
      operation,
      source,
    });
  };

  /**
   * @description Register an account as a delegate
   * @param {object} paramObject The parameters for the operation
   * @param {number} [paramObject.fee=10000] The fee to set for the transaction
   * @param {number} [paramObject.gasLimit=10600] The gas limit to set for the transaction
   * @param {number} [paramObject.storageLimit=0] The storage limit to set for the transaction
   * @returns {Promise} Object containing the injected operation hash
   */
  registerDelegate = async ({
    fee = this.defaultFee,
    gasLimit = 10600,
    storageLimit = 0,
  }: {
    fee?: number;
    gasLimit?: number;
    storageLimit?: number;
  } = {}): Promise<any> => {
    const operation: Operation<string | number> = {
      kind: 'delegation',
      fee,
      delegate: await this.key.publicKeyHash(),
      ...(gasLimit ? { gas_limit: gasLimit } : {}),
      ...(storageLimit ? { storage_limit: storageLimit } : {}),
    };

    return this.sendOperation({ operation });
  };

  /**
   * @description Typechecks the provided code
   * @param {string | Micheline} code The code to typecheck
   * @param {number} gas The the gas limit
   * @returns {Promise} Typecheck result
   */
  typecheckCode = (code: string | Micheline, gas = 10000): Promise<any> => {
    let _code = code;

    if (typeof code === 'string') {
      _code = ml2mic(code);
    }

    return this.query(
      `/chains/${this.chain}/blocks/head/helpers/scripts/typecheck_code`,
      {
        program: _code,
        gas,
      },
    );
  };

  /**
   * @description Serializes a piece of data to a binary representation
   * @param {string | Micheline} data The data
   * @param {string | Micheline} type The data type
   * @returns {Promise} Serialized data
   */
  packData = (
    data: string | Micheline,
    type: string | Micheline,
  ): Promise<any> => {
    let _data = data;
    let _type = type;

    if (typeof data === 'string') {
      _data = sexp2mic(data);
    }

    if (typeof type === 'string') {
      _type = sexp2mic(type);
    }

    const check = {
      data: _data,
      type: _type,
      gas: '4000000',
    };

    return this.query(
      `/chains/${this.chain}/blocks/head/helpers/scripts/pack_data`,
      check,
    );
  };

  /**
   * @description Typechecks data against a type
   * @param {string | Micheline} data The data
   * @param {string | Micheline} type The data type
   * @returns {Promise} Typecheck result
   */
  typecheckData = (
    data: string | Micheline,
    type: string | Micheline,
  ): Promise<any> => {
    let _data = data;
    let _type = type;

    if (typeof data === 'string') {
      _data = sexp2mic(data);
    }

    if (typeof type === 'string') {
      _type = sexp2mic(type);
    }

    const check = {
      data: _data,
      type: _type,
      gas: '4000000',
    };

    return this.query(
      `/chains/${this.chain}/blocks/head/helpers/scripts/typecheck_data`,
      check,
    );
  };

  /**
   * @description Runs or traces code against an input and storage
   * @param {string | Micheline} code Code to run
   * @param {number} amount Amount in tez to send
   * @param {string | Micheline} input Input to run though code
   * @param {string | Micheline} storage State of storage
   * @param {boolean} [trace=false] Whether to trace
   * @returns {Promise} Run results
   */
  runCode = (
    code: string | Micheline,
    amount: number,
    input: string | Micheline,
    storage: string | Micheline,
    trace = false,
  ): Promise<any> => {
    const ep = trace ? 'trace_code' : 'run_code';

    let _code = code;
    let _input = input;
    let _storage = storage;

    if (typeof code === 'string') {
      _code = sexp2mic(code);
    }

    if (typeof input === 'string') {
      _input = sexp2mic(input);
    }

    if (typeof storage === 'string') {
      _storage = sexp2mic(storage);
    }

    return this.query(
      `/chains/${this.chain}/blocks/head/helpers/scripts/${ep}`,
      {
        script: _code,
        amount: this.useMutez ? `${amount}` : mutez(amount),
        input: _input,
        storage: _storage,
      },
    );
  };

  /**
   * @description Given operation objects, return the operations with their estimated limits
   * @param {object | Array} operation The operation object or list of objects
   * @param {string} [source] The source of the operation
   * @returns {Promise} The operations with populated limits
   */
  estimateLimits = async (
    operation: Operation<string | number> | Operation<string | number>[],
    source?: string,
  ) => {
    const operations = Array.isArray(operation) ? [...operation] : [operation];

    const simulated = operations.map((op) => {
      if (
        ['reveal', 'transaction', 'origination', 'delegation'].includes(op.kind)
      ) {
        return {
          ...op,
          gas_limit: 1040000,
          storage_limit: 60000,
        };
      }

      return op;
    });

    const { contents: simulatedOperations } = await this.simulateOperation({
      operation: simulated,
      source,
    });

    return operations.map((op, index) => {
      const metadata = simulatedOperations[index]?.metadata;

      if (metadata?.operation_result?.status === 'applied') {
        const { consumed_milligas = 0, storage_size = 0 } =
          metadata.operation_result;

        const consumedGas = Math.ceil(parseInt(consumed_milligas, 10) / 1000);
        const storageSize = parseInt(storage_size, 10);

        return {
          gas_limit: consumedGas + 100,
          storage_limit: storageSize ? storageSize + 20 : 0,
          ...op,
        };
      }

      return op;
    });
  };

  /**
   * @description Looks up a contract and returns an initialized contract
   * @param {object} address The contract address
   * @returns {Promise} An initialized contract class
   * @example
   * // Load contract
   * const contract = await tezos.loadContract('KT1MKm4ynxPSzRjw26jPSJbaMFTqTc4dVPdK');
   * // List defined contract methods
   * const { methods } = contract;
   * // Retrieve contract storage
   * const storage = await contract.storage();
   * // Get big map keys
   * await storage.ledger.get('tz1P1n8LvweoarK3DTPSnAHtiGVRujhvR2vk');
   * // Determine method schema
   * await contract.methods.transfer('tz1P1n8LvweoarK3DTPSnAHtiGVRujhvR2vk', 100).schema();
   * // Send contract operation
   * await contract.methods.transfer('tz1P1n8LvweoarK3DTPSnAHtiGVRujhvR2vk', 100).send({
   *   fee: '100000',
   *   gasLimit: '800000',
   *   storageLimit: '60000',
   * });
   */
  loadContract = async (address: string): Promise<Contract> => {
    const contract = new Contract(this, address);
    await contract.loaded;
    return contract;
  };
}
