/// <reference types="node" />
import AbstractTezModule from './tez-core';
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
    initialize: (key: string, passphrase?: string, email?: string, resolve?: any) => Promise<void>;
    publicKey: () => string;
    secretKey: () => string;
    publicKeyHash: () => string;
    sign: (bytes: string, wm: Uint8Array) => Promise<Signed>;
}
interface ModuleOptions {
    defaultFee?: number;
    localForge?: boolean;
    validateLocalForge?: boolean;
    debugMode?: boolean;
}
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
    script?: {
        code: Micheline;
        storage: Micheline;
    };
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
    branch?: string;
    contents?: ConstructedOperation[];
    protocol?: string;
    signature?: string;
}
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
    script: {
        code: Micheline;
        storage: Micheline;
    };
    manager_pubkey: string;
    managerPubkey: string;
}
declare type Micheline = {
    prim: string;
    args?: MichelineArray;
    annots?: string[];
} | {
    bytes: string;
} | {
    int: string;
} | {
    string: string;
} | {
    address: string;
} | {
    contract: string;
} | {
    key: string;
} | {
    key_hash: string;
} | {
    signature: string;
} | MichelineArray;
interface MichelineArray extends Array<Micheline> {
}
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
    init?: string;
    fee?: number;
    parameter?: string;
    gasLimit?: number;
    storageLimit?: number;
    mutez?: boolean;
    spendable?: boolean;
    delegatable?: boolean;
    delegate?: string;
    code?: string;
}
interface AccountParams {
    balance: number;
    spendable?: boolean;
    delegatable?: boolean;
    delegate?: string;
    fee?: number;
    gasLimit?: number;
    storageLimit?: number;
}
interface OperationParams {
    operation: Operation | Operation[];
    source?: string;
    skipPrevalidation?: boolean;
    skipSignature?: boolean;
}
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
}
interface ForgedBytes {
    opbytes: string;
    opOb: OperationObject;
    counter: number;
}
interface Signed {
    bytes: string;
    sig: string;
    prefixSig: string;
    sbytes: string;
}
/**
 * Main Sotez Library
 * ```javascript
 * import Sotez from 'sotez';
 * const sotez = new Sotez('https://127.0.0.1:8732', 'main', { defaultFee: 1275 })
 * await sotez.importKey('edskRv6ZnkLQMVustbYHFPNsABu1Js6pEEWyMUFJQTqEZjVCU2WHh8ckcc7YA4uBzPiJjZCsv3pC1NDdV99AnyLzPjSip4uC3y');
 * sotez.transfer({
 *   to: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
 *   amount: '1000000',
 * });
 * ```
 */
export default class Sotez extends AbstractTezModule {
    _localForge: boolean;
    _validateLocalForge: boolean;
    _defaultFee: number;
    _debugMode: boolean;
    _counters: {
        [key: string]: number;
    };
    key: KeyInterface;
    constructor(provider?: string, chain?: string, options?: ModuleOptions);
    defaultFee: number;
    localForge: boolean;
    validateLocalForge: boolean;
    counters: {
        [key: string]: number;
    };
    debugMode: boolean;
    setProvider(provider: string, chain?: string): void;
    /**
    * @description Import a secret key
    * @param {String} key The secret key
    * @param {String} [passphrase] The passphrase of the encrypted key
    * @param {String} [email] The email associated with the fundraiser account
    * ```javascript
    * await sotez.importKey('edskRv6ZnkLQMVustbYHFPNsABu1Js6pEEWyMUFJQTqEZjVCU2WHh8ckcc7YA4uBzPiJjZCsv3pC1NDdV99AnyLzPjSip4uC3y');
    * ```
    */
    importKey: (key: string, passphrase?: string | undefined, email?: string | undefined) => Promise<void>;
    /**
     * @description Import a ledger public key
     * @param {String} [path="44'/1729'/0'/0'"] The ledger path
     * @param {Number} [curve=0x00] The curve parameter
     * ```javascript
     * await sotez.importLedger();
     * ```
     */
    importLedger: (path?: string, curve?: number) => Promise<void>;
    /**
     * @description Queries a node given a path and payload
     * @param {String} path The RPC path to query
     * @param {String} payload The payload of the query
     * @param {String} method The request method. Either 'GET' or 'POST'
     * @returns {Promise} The response of the query
     * ```javascript
     * sotez.query(`/chains/main/blocks/head`)
     *  .then(head => console.log(head));
     * ```
     */
    query: (path: string, payload?: any, method?: string | undefined) => Promise<any>;
    /**
     * @description Originate a new account
     * @param {Object} paramObject The parameters for the origination
     * @param {Number} paramObject.balance The amount in tez to transfer for the initial balance
     * @param {Boolean} [paramObject.spendable] Whether the keyholder can spend the balance from the new account
     * @param {Boolean} [paramObject.delegatable] Whether the new account is delegatable
     * @param {String} [paramObject.delegate] The delegate for the new account
     * @param {Number} [paramObject.fee=1420] The fee to set for the transaction
     * @param {Number} [paramObject.gasLimit=10600] The gas limit to set for the transaction
     * @param {Number} [paramObject.storageLimit=257] The storage limit to set for the transaction
     * @returns {Promise} Object containing the injected operation hash
     * ```javascript
     * sotez.account({
     *   balance: 10,
     *   spendable: true,
     *   delegatable: true,
     *   delegate: 'tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4',
     * }).then(res => console.log(res.operations[0].metadata.operation_result.originated_contracts[0]));
     * ```
     */
    account: ({ balance, spendable, delegatable, delegate, fee, gasLimit, storageLimit, }: AccountParams) => Promise<any>;
    /**
     * @description Get the balance for a contract
     * @param {String} address The contract for which to retrieve the balance
     * @returns {Promise} The balance of the contract
     * ```javascript
     * sotez.getBalance('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
     *   .then(balance => console.log(balance));
     * ```
     */
    getBalance: (address: string) => Promise<string>;
    /**
     * @description Get the delegate for a contract
     * @param {String} address The contract for which to retrieve the delegate
     * @returns {Promise} The delegate of a contract, if any
     * ```javascript
     * sotez.getDelegate('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
     *   .then(delegate => console.log(delegate));
     * ```
     */
    getDelegate: (address: string) => Promise<string | boolean>;
    /**
     * @description Get the manager for a contract
     * @param {String} address The contract for which to retrieve the manager
     * @returns {Promise} The manager of a contract
     * ```javascript
     * sotez.getManager('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
     *   .then(({ manager, key }) => console.log(manager, key));
     * ```
     */
    getManager: (address: string) => Promise<{
        manager: string;
        key: string;
    }>;
    /**
     * @description Get the counter for an contract
     * @param {String} address The contract for which to retrieve the counter
     * @returns {Promise} The counter of a contract, if any
     * ```javascript
     * sotez.getCounter('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
     *   .then(counter => console.log(counter));
     * ```
     */
    getCounter: (address: string) => Promise<string>;
    /**
     * @description Get the baker information for an address
     * @param {String} address The contract for which to retrieve the baker information
     * @returns {Promise} The information of the delegate address
     * ```javascript
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
     * ```
     */
    getBaker: (address: string) => Promise<Baker>;
    /**
     * @description Get the header of the current head
     * @returns {Promise} The whole block header
     * ```javascript
     * sotez.getHeader().then(header => console.log(header));
     * ```
     */
    getHeader: () => Promise<Header>;
    /**
     * @description Get the metadata of the current head
     * @returns {Promise} The head block metadata
     * ```javascript
     * sotez.getHeadMetadata().then(metadata => console.log(metadata));
     * ```
     */
    getHeadMetadata: () => Promise<Header>;
    /**
     * @description Get the current head block of the chain
     * @returns {Promise} The current head block
     * ```javascript
     * sotez.getHead().then(head => console.log(head));
     * ```
     */
    getHead: () => Promise<Head>;
    /**
     * @description Get the current head block hash of the chain
     * @returns {Promise} The block's hash, its unique identifier
     * ```javascript
     * sotez.getHeadHash().then(headHash => console.log(headHash))
     * ```
     */
    getHeadHash: () => Promise<string>;
    /**
     * @description Ballots casted so far during a voting period
     * @returns {Promise} Ballots casted so far during a voting period
     * ```javascript
     * sotez.getBallotList().then(ballotList => console.log(ballotList));
     * ```
     */
    getBallotList: () => Promise<any[]>;
    /**
     * @description List of proposals with number of supporters
     * @returns {Promise} List of proposals with number of supporters
     * ```javascript
     * sotez.getProposals().then(proposals => {
     *   console.log(proposals[0][0], proposals[0][1])
     *   console.log(proposals[1][0], proposals[1][1])
     * );
     * ```
     */
    getProposals: () => Promise<any[]>;
    /**
     * @description Sum of ballots casted so far during a voting period
     * @returns {Promise} Sum of ballots casted so far during a voting period
     * ```javascript
     * sotez.getBallots().then(({ yay, nay, pass }) => console.log(yay, nay, pass));
     * ```
     */
    getBallots: () => Promise<{
        yay: number;
        nay: number;
        pass: number;
    }>;
    /**
     * @description List of delegates with their voting weight, in number of rolls
     * @returns {Promise} The ballots of the current voting period
     * ```javascript
     * sotez.getListings().then(listings => console.log(listings));
     * ```
     */
    getListings: () => Promise<any[]>;
    /**
     * @description Current proposal under evaluation
     * @returns {Promise} Current proposal under evaluation
     * ```javascript
     * sotez.getCurrentProposal().then(currentProposal => console.log(currentProposal));
     * ```
     */
    getCurrentProposal: () => Promise<string>;
    /**
     * @description Current period kind
     * @returns {Promise} Current period kind
     * ```javascript
     * sotez.getCurrentPeriod().then(currentPeriod => console.log(currentPeriod));
     * ```
     */
    getCurrentPeriod: () => Promise<any>;
    /**
     * @description Current expected quorum
     * @returns {Promise} Current expected quorum
     * ```javascript
     * sotez.getCurrentQuorum().then(currentQuorum => console.log(currentQuorum));
     * ```
     */
    getCurrentQuorum: () => Promise<number>;
    /**
     * @description Check for the inclusion of an operation in new blocks
     * @param {String} hash The operation hash to check
     * @param {Number} [interval=10] The interval to check new blocks
     * @param {Number} [timeout=180] The time before the operation times out
     * @returns {Promise} The hash of the block in which the operation was included
     * ```javascript
     * sotez.awaitOperation('ooYf5iK6EdTx3XfBusgDqS6znACTq5469D1zQSDFNrs5KdTuUGi')
     *  .then((hash) => console.log(hash));
     * ```
     */
    awaitOperation: (hash: string, interval?: number, timeout?: number) => Promise<string>;
    /**
     * @description Get the current head block hash of the chain
     * @param {String} path The path to query
     * @param {Object} payload The payload of the request
     * @returns {Promise} The response of the rpc call
     */
    call: (path: string, payload?: OperationObject | undefined) => Promise<any>;
    /**
     * @description Prepares an operation
     * @param {Object} paramObject The parameters for the operation
     * @param {Object|Array} paramObject.operation The operation to include in the transaction
     * @returns {Promise} Object containing the prepared operation
     * ```javascript
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
     * ```
     */
    prepareOperation: ({ operation, source }: OperationParams) => Promise<ForgedBytes>;
    /**
     * @description Simulate an operation
     * @param {Object} paramObject The parameters for the operation
     * @param {Object|Array} paramObject.operation The operation to include in the transaction
     * @returns {Promise} The simulated operation result
     * ```javascript
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
     * ```
     */
    simulateOperation: ({ operation, source }: OperationParams) => Promise<any>;
    /**
     * @description Send an operation
     * @param {Object} paramObject The parameters for the operation
     * @param {Object|Array} paramObject.operation The operation to include in the transaction
     * @param {Boolean} [paramObject.skipPrevalidation=false] Skip prevalidation before injecting operation
     * @returns {Promise} Object containing the injected operation hash
     * ```javascript
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
     * ```
     */
    sendOperation: ({ operation, source, skipPrevalidation, skipSignature }: OperationParams) => Promise<any>;
    /**
     * @description Inject an operation
     * @param {Object} opOb The operation object
     * @param {String} sopbytes The signed operation bytes
     * @returns {Promise} Object containing the injected operation hash
     */
    inject: (opOb: OperationObject, sopbytes: string) => Promise<any>;
    /**
     * @description Inject an operation without prevalidation
     * @param {String} sopbytes The signed operation bytes
     * @returns {Promise} Object containing the injected operation hash
     */
    silentInject: (sopbytes: string) => Promise<any>;
    /**
     * @description Transfer operation
     * @param {Object} paramObject The parameters for the operation
     * @param {String} paramObject.to The address of the recipient
     * @param {Number} paramObject.amount The amount in tez to transfer for the initial balance
     * @param {String} [paramObject.source] The source address of the transfer
     * @param {Number} [paramObject.fee=1420] The fee to set for the transaction
     * @param {String} [paramObject.parameter] The parameter for the transaction
     * @param {Number} [paramObject.gasLimit=10600] The gas limit to set for the transaction
     * @param {Number} [paramObject.storageLimit=300] The storage limit to set for the transaction
     * @param {Number} [paramObject.mutez=false] Whether the input amount is set to mutez (1/1,000,000 tez)
     * @returns {Promise} Object containing the injected operation hash
     * ```javascript
     * sotez.transfer({
     *   to: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
     *   amount: '1000000',
     *   fee: '1420',
     * }).then(result => console.log(result));
     * ```
     */
    transfer: ({ to, amount, source, fee, parameter, gasLimit, storageLimit, mutez, }: RpcParams) => Promise<any>;
    /**
     * @description Activate an account
     * @param {Object} pkh The public key hash of the account
     * @param {String} secret The secret to activate the account
     * @returns {Promise} Object containing the injected operation hash
     * ```javascript
     * sotez.activate(pkh, secret)
     *   .then((activateOperation) => console.log(activateOperation));
     * ```
     */
    activate: (pkh: string, secret: string) => Promise<any>;
    /**
     * @description Originate a new contract
     * @param {Object} paramObject The parameters for the operation
     * @param {Number} paramObject.balance The amount in tez to transfer for the initial balance
     * @param {String | Micheline} paramObject.code The code to deploy for the contract
     * @param {String | Micheline} paramObject.init The initial storage of the contract
     * @param {Boolean} [paramObject.spendable=false] Whether the keyholder can spend the balance from the new account
     * @param {Boolean} [paramObject.delegatable=false] Whether the new account is delegatable
     * @param {String} [paramObject.delegate] The delegate for the new account
     * @param {Number} [paramObject.fee=1420] The fee to set for the transaction
     * @param {Number} [paramObject.gasLimit=10600] The gas limit to set for the transaction
     * @param {Number} [paramObject.storageLimit=257] The storage limit to set for the transaction
     * @returns {Promise} Object containing the injected operation hash
     */
    originate: ({ balance, code, init, spendable, delegatable, delegate, fee, gasLimit, storageLimit, }: ContractParams) => Promise<any>;
    /**
     * @description Set a delegate for an account
     * @param {Object} paramObject The parameters for the operation
     * @param {String} [paramObject.delegate] The delegate for the new account
     * @param {Number} [paramObject.fee=1420] The fee to set for the transaction
     * @param {Number} [paramObject.gasLimit=10600] The gas limit to set for the transaction
     * @param {Number} [paramObject.storageLimit=0] The storage limit to set for the transaction
     * @returns {Promise} Object containing the injected operation hash
     */
    setDelegate: ({ delegate, source, fee, gasLimit, storageLimit, }: {
        delegate: string;
        source?: string | undefined;
        fee?: number | undefined;
        gasLimit?: number | undefined;
        storageLimit?: number | undefined;
    }) => Promise<any>;
    /**
     * @description Register an account as a delegate
     * @param {Object} paramObject The parameters for the operation
     * @param {Number} [paramObject.fee=1420] The fee to set for the transaction
     * @param {Number} [paramObject.gasLimit=10600] The gas limit to set for the transaction
     * @param {Number} [paramObject.storageLimit=0] The storage limit to set for the transaction
     * @returns {Promise} Object containing the injected operation hash
     */
    registerDelegate: ({ fee, gasLimit, storageLimit, }?: {
        fee?: number | undefined;
        gasLimit?: number | undefined;
        storageLimit?: number | undefined;
    }) => Promise<any>;
    /**
     * @description Typechecks the provided code
     * @param {String | Micheline} code The code to typecheck
     * @param {Number} gas The the gas limit
     * @returns {Promise} Typecheck result
     */
    typecheckCode: (code: string | {
        prim: string;
        args?: MichelineArray | undefined;
        annots?: string[] | undefined;
    } | {
        bytes: string;
    } | {
        int: string;
    } | {
        string: string;
    } | {
        address: string;
    } | {
        contract: string;
    } | {
        key: string;
    } | {
        key_hash: string;
    } | {
        signature: string;
    } | MichelineArray, gas?: number) => Promise<any>;
    /**
     * @description Serializes a piece of data to a binary representation
     * @param {String | Micheline} data
     * @param {String | Micheline} type
     * @returns {Promise} Serialized data
     */
    packData: (data: string | {
        prim: string;
        args?: MichelineArray | undefined;
        annots?: string[] | undefined;
    } | {
        bytes: string;
    } | {
        int: string;
    } | {
        string: string;
    } | {
        address: string;
    } | {
        contract: string;
    } | {
        key: string;
    } | {
        key_hash: string;
    } | {
        signature: string;
    } | MichelineArray, type: string | {
        prim: string;
        args?: MichelineArray | undefined;
        annots?: string[] | undefined;
    } | {
        bytes: string;
    } | {
        int: string;
    } | {
        string: string;
    } | {
        address: string;
    } | {
        contract: string;
    } | {
        key: string;
    } | {
        key_hash: string;
    } | {
        signature: string;
    } | MichelineArray) => Promise<any>;
    /**
     * @description Typechecks data against a type
     * @param {String | Micheline} data
     * @param {String | Micheline} type
     * @returns {Promise} Typecheck result
     */
    typecheckData: (data: string | {
        prim: string;
        args?: MichelineArray | undefined;
        annots?: string[] | undefined;
    } | {
        bytes: string;
    } | {
        int: string;
    } | {
        string: string;
    } | {
        address: string;
    } | {
        contract: string;
    } | {
        key: string;
    } | {
        key_hash: string;
    } | {
        signature: string;
    } | MichelineArray, type: string | {
        prim: string;
        args?: MichelineArray | undefined;
        annots?: string[] | undefined;
    } | {
        bytes: string;
    } | {
        int: string;
    } | {
        string: string;
    } | {
        address: string;
    } | {
        contract: string;
    } | {
        key: string;
    } | {
        key_hash: string;
    } | {
        signature: string;
    } | MichelineArray) => Promise<any>;
    /**
     * @description Runs or traces code against an input and storage
     * @param {String | Micheline} code Code to run
     * @param {Number} amount Amount in tez to send
     * @param {String | Micheline} input Input to run though code
     * @param {String | Micheline} storage State of storage
     * @param {Boolean} [trace=false] Whether to trace
     * @returns {Promise} Run results
     */
    runCode: (code: string | {
        prim: string;
        args?: MichelineArray | undefined;
        annots?: string[] | undefined;
    } | {
        bytes: string;
    } | {
        int: string;
    } | {
        string: string;
    } | {
        address: string;
    } | {
        contract: string;
    } | {
        key: string;
    } | {
        key_hash: string;
    } | {
        signature: string;
    } | MichelineArray, amount: number, input: string, storage: string, trace?: boolean) => Promise<any>;
}
export {};
