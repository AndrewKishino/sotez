import { AbstractTezModule } from './tez-core';
import { Key } from './key';
import { Contract } from './contract';
interface ModuleOptions {
    defaultFee?: number;
    localForge?: boolean;
    validateLocalForge?: boolean;
    debugMode?: boolean;
    useMutez?: boolean;
    dryRunLimiter?: boolean;
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
    header: Header;
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
    entrypoint: string;
    value: {
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
} | {
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
declare type MichelineArray = Array<Micheline>;
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
    parameters?: string | Micheline;
    gasLimit?: number;
    storageLimit?: number;
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
    skipCounter?: boolean;
    skipEstimate?: boolean;
}
interface ContractParams {
    balance: number;
    code: string | Micheline;
    delegatable?: boolean;
    delegate?: string;
    fee?: number;
    gasLimit?: number;
    init: string | Micheline;
    micheline?: boolean;
    spendable?: boolean;
    storageLimit?: number;
}
interface ForgedBytes {
    opbytes: string;
    opOb: OperationObject;
    counter: number;
    chainId: string;
}
/**
 * Main Sotez Library
 *
 * @example
 * import { Sotez } from 'sotez';
 * const sotez = new Sotez('https://127.0.0.1:8732', 'main', { defaultFee: 1275, useMutez: false });
 * await sotez.importKey('edskRv6ZnkLQMVustbYHFPNsABu1Js6pEEWyMUFJQTqEZjVCU2WHh8ckcc7YA4uBzPiJjZCsv3pC1NDdV99AnyLzPjSip4uC3y');
 * sotez.transfer({
 *   to: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
 *   amount: 1000000,
 * });
 */
export declare class Sotez extends AbstractTezModule {
    _localForge: boolean;
    _validateLocalForge: boolean;
    _defaultFee: number;
    _counters: {
        [key: string]: number;
    };
    _useMutez: boolean;
    _dryRunLimiter: boolean;
    key: Key;
    constructor(provider?: string, chain?: string, options?: ModuleOptions);
    get defaultFee(): number;
    set defaultFee(fee: number);
    get localForge(): boolean;
    set localForge(value: boolean);
    get validateLocalForge(): boolean;
    set validateLocalForge(value: boolean);
    get counters(): {
        [key: string]: number;
    };
    set counters(counters: {
        [key: string]: number;
    });
    get debugMode(): boolean;
    set debugMode(t: boolean);
    get useMutez(): boolean;
    set useMutez(t: boolean);
    get dryRunLimiter(): boolean;
    set dryRunLimiter(t: boolean);
    setProvider(provider: string, chain?: string): void;
    /**
     * @description Import a secret key
     * @param {string} key The secret key
     * @param {string} [passphrase] The passphrase of the encrypted key
     * @param {string} [email] The email associated with the fundraiser account
     * @example
     * await sotez.importKey('edskRv6ZnkLQMVustbYHFPNsABu1Js6pEEWyMUFJQTqEZjVCU2WHh8ckcc7YA4uBzPiJjZCsv3pC1NDdV99AnyLzPjSip4uC3y')
     */
    importKey: (key: string, passphrase?: string | undefined, email?: string | undefined) => Promise<void>;
    /**
     * @description Import a ledger public key
     * @param {Object} transport The ledger transport (https://github.com/LedgerHQ/ledgerjs)
     * @param {string} [path="44'/1729'/0'/0'"] The ledger path
     * @param {string} [curve="tz1"] The curve parameter
     * @example
     * import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
     * await sotez.importLedger(TransportNodeHid, "44'/1729'/0'/0'");
     */
    importLedger: (transport: any, path?: string, curve?: string) => Promise<void>;
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
    account: ({ balance, spendable, delegatable, delegate, fee, gasLimit, storageLimit, }: AccountParams) => Promise<any>;
    /**
     * @description Get the balance for a contract
     * @param {string} address The contract for which to retrieve the balance
     * @returns {Promise} The balance of the contract
     * @example
     * sotez.getBalance('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
     *   .then(balance => console.log(balance));
     */
    getBalance: (address: string) => Promise<string>;
    /**
     * @description Get the delegate for a contract
     * @param {string} address The contract for which to retrieve the delegate
     * @returns {Promise} The delegate of a contract, if any
     * @example
     * sotez.getDelegate('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
     *   .then(delegate => console.log(delegate));
     */
    getDelegate: (address: string) => Promise<string>;
    /**
     * @description Get the manager for a contract
     * @param {string} address The contract for which to retrieve the manager
     * @returns {Promise} The manager of a contract
     * @example
     * sotez.getManager('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
     *   .then(({ manager, key }) => console.log(manager, key));
     */
    getManager: (address: string) => Promise<{
        manager: string;
        key: string;
    }>;
    /**
     * @description Get the counter for an contract
     * @param {string} address The contract for which to retrieve the counter
     * @returns {Promise} The counter of a contract, if any
     * @example
     * sotez.getCounter('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
     *   .then(counter => console.log(counter));
     */
    getCounter: (address: string) => Promise<string>;
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
    getBaker: (address: string) => Promise<Baker>;
    /**
     * @description Get the header of the current head
     * @returns {Promise} The whole block header
     * @example
     * sotez.getHeader().then(header => console.log(header));
     */
    getHeader: () => Promise<Header>;
    /**
     * @description Get the metadata of the current head
     * @returns {Promise} The head block metadata
     * @example
     * sotez.getHeadMetadata().then(metadata => console.log(metadata));
     */
    getHeadMetadata: () => Promise<Header>;
    /**
     * @description Get the current head block of the chain
     * @returns {Promise} The current head block
     * @example
     * sotez.getHead().then(head => console.log(head));
     */
    getHead: () => Promise<Head>;
    /**
     * @description Get the current head block hash of the chain
     * @returns {Promise} The block's hash, its unique identifier
     * @example
     * sotez.getHeadHash().then(headHash => console.log(headHash))
     */
    getHeadHash: () => Promise<string>;
    /**
     * @description Ballots casted so far during a voting period
     * @returns {Promise} Ballots casted so far during a voting period
     * @example
     * sotez.getBallotList().then(ballotList => console.log(ballotList));
     */
    getBallotList: () => Promise<any[]>;
    /**
     * @description List of proposals with number of supporters
     * @returns {Promise} List of proposals with number of supporters
     * @example
     * sotez.getProposals().then(proposals => {
     *   console.log(proposals[0][0], proposals[0][1])
     *   console.log(proposals[1][0], proposals[1][1])
     * );
     */
    getProposals: () => Promise<any[]>;
    /**
     * @description Sum of ballots casted so far during a voting period
     * @returns {Promise} Sum of ballots casted so far during a voting period
     * @example
     * sotez.getBallots().then(({ yay, nay, pass }) => console.log(yay, nay, pass));
     */
    getBallots: () => Promise<{
        yay: number;
        nay: number;
        pass: number;
    }>;
    /**
     * @description List of delegates with their voting weight, in number of rolls
     * @returns {Promise} The ballots of the current voting period
     * @example
     * sotez.getListings().then(listings => console.log(listings));
     */
    getListings: () => Promise<any[]>;
    /**
     * @description Current proposal under evaluation
     * @returns {Promise} Current proposal under evaluation
     * @example
     * sotez.getCurrentProposal().then(currentProposal => console.log(currentProposal));
     */
    getCurrentProposal: () => Promise<string>;
    /**
     * @description Current period kind
     * @returns {Promise} Current period kind
     * @example
     * sotez.getCurrentPeriod().then(currentPeriod => console.log(currentPeriod));
     */
    getCurrentPeriod: () => Promise<any>;
    /**
     * @description Current expected quorum
     * @returns {Promise} Current expected quorum
     * @example
     * sotez.getCurrentQuorum().then(currentQuorum => console.log(currentQuorum));
     */
    getCurrentQuorum: () => Promise<number>;
    /**
     * @description Check for the inclusion of an operation in new blocks
     * @param {string} hash The operation hash to check
     * @param {number} [interval=10] The interval to check new blocks (in seconds)
     * @param {number} [timeout=180] The time before the operation times out (in seconds)
     * @returns {Promise} The hash of the block in which the operation was included
     * @example
     * sotez.awaitOperation('ooYf5iK6EdTx3XfBusgDqS6znACTq5469D1zQSDFNrs5KdTuUGi')
     *  .then((hash) => console.log(hash));
     */
    awaitOperation: (hash: string, interval?: number, timeout?: number) => Promise<string>;
    /**
     * @description Prepares an operation
     * @param {Object} paramObject The parameters for the operation
     * @param {string} [paramObject.source] The source address of the operation
     * @param {boolean} paramObject.skipCounter Skip incrementing the counter within sotez
     * @param {boolean} paramObject.skipEstimate Skip the estimator if enabled
     * @param {Object | Array} paramObject.operation The operation to include in the transaction
     * @returns {Promise} Object containing the prepared operation
     * @example
     * sotez.prepareOperation({
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
    prepareOperation: ({ operation, source, skipCounter, skipEstimate, }: OperationParams) => Promise<ForgedBytes>;
    /**
     * @description Simulate an operation
     * @param {Object} paramObject The parameters for the operation
     * @param {Object|Array} paramObject.operation The operation to include in the transaction
     * @param {string} [paramObject.source] The source address of the operation
     * @param {boolean} [paramObject.skipEstimate] The operation to include in the transaction
     * @returns {Promise} The simulated operation result
     * @example
     * sotez.simulateOperation({
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
    simulateOperation: ({ operation, source, skipEstimate, }: OperationParams) => Promise<any>;
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
     *   fee: 1420,
     *   gas_limit: 10600,
     *   storage_limit: 300,
     *   amount: 1000,
     *   destination: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
     * };
     *
     * sotez.sendOperation({ operation }).then(result => console.log(result));
     *
     * sotez.sendOperation({ operation: [operation, operation] }).then(result => console.log(result));
     */
    sendOperation: ({ operation, source, skipPrevalidation, skipSignature, }: OperationParams) => Promise<any>;
    /**
     * @description Inject an operation
     * @param {Object} opOb The operation object
     * @param {string} sopbytes The signed operation bytes
     * @returns {Promise} Object containing the injected operation hash
     */
    inject: (opOb: OperationObject, sopbytes: string) => Promise<any>;
    /**
     * @description Inject an operation without prevalidation
     * @param {string} sopbytes The signed operation bytes
     * @returns {Promise} Object containing the injected operation hash
     */
    silentInject: (sopbytes: string) => Promise<any>;
    /**
     * @description Transfer operation
     * @param {Object|Array} transferParams The parameters for the operation
     * @param {string} transferParams.to The address of the recipient
     * @param {number} transferParams.amount The amount in tez to transfer for the initial balance
     * @param {string} [transferParams.source] The source address of the transfer
     * @param {number} [transferParams.fee=1420] The fee to set for the transaction
     * @param {string} [transferParams.parameters] The parameter for the transaction
     * @param {number} [transferParams.gasLimit=10600] The gas limit to set for the transaction
     * @param {number} [transferParams.storageLimit=300] The storage limit to set for the transaction
     * @returns {Promise} Object containing the injected operation hash
     * @example
     * sotez.transfer({
     *   to: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
     *   amount: 1000000,
     *   fee: 1420,
     * }).then(result => console.log(result));
     */
    transfer: (transferParams: RpcParams | RpcParams[]) => Promise<any>;
    /**
     * @description Activate an account
     * @param {Object} pkh The public key hash of the account
     * @param {string} secret The secret to activate the account
     * @returns {Promise} Object containing the injected operation hash
     * @example
     * sotez.activate(pkh, secret)
     *   .then((activateOperation) => console.log(activateOperation));
     */
    activate: (pkh: string, secret: string) => Promise<any>;
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
    originate: ({ balance, code, init, spendable, delegatable, delegate, fee, gasLimit, storageLimit, }: ContractParams) => Promise<any>;
    /**
     * @description Set a delegate for an account
     * @param {Object} paramObject The parameters for the operation
     * @param {string} [paramObject.delegate] The delegate for the new account
     * @param {number} [paramObject.fee=1420] The fee to set for the transaction
     * @param {number} [paramObject.gasLimit=10600] The gas limit to set for the transaction
     * @param {string} [paramObject.source] The source address of the operation
     * @param {number} [paramObject.storageLimit=0] The storage limit to set for the transaction
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
     * @param {number} [paramObject.fee=1420] The fee to set for the transaction
     * @param {number} [paramObject.gasLimit=10600] The gas limit to set for the transaction
     * @param {number} [paramObject.storageLimit=0] The storage limit to set for the transaction
     * @returns {Promise} Object containing the injected operation hash
     */
    registerDelegate: ({ fee, gasLimit, storageLimit, }?: {
        fee?: number | undefined;
        gasLimit?: number | undefined;
        storageLimit?: number | undefined;
    }) => Promise<any>;
    /**
     * @description Typechecks the provided code
     * @param {string | Micheline} code The code to typecheck
     * @param {number} gas The the gas limit
     * @returns {Promise} Typecheck result
     */
    typecheckCode: (code: string | Micheline, gas?: number) => Promise<any>;
    /**
     * @description Serializes a piece of data to a binary representation
     * @param {string | Micheline} data The data
     * @param {string | Micheline} type The data type
     * @returns {Promise} Serialized data
     */
    packData: (data: string | Micheline, type: string | Micheline) => Promise<any>;
    /**
     * @description Typechecks data against a type
     * @param {string | Micheline} data The data
     * @param {string | Micheline} type The data type
     * @returns {Promise} Typecheck result
     */
    typecheckData: (data: string | Micheline, type: string | Micheline) => Promise<any>;
    /**
     * @description Runs or traces code against an input and storage
     * @param {string | Micheline} code Code to run
     * @param {number} amount Amount in tez to send
     * @param {string | Micheline} input Input to run though code
     * @param {string | Micheline} storage State of storage
     * @param {boolean} [trace=false] Whether to trace
     * @returns {Promise} Run results
     */
    runCode: (code: string | Micheline, amount: number, input: string | Micheline, storage: string | Micheline, trace?: boolean) => Promise<any>;
    /**
     * @description Get the mananger key from the protocol dependent query
     * @param {Object|string} manager The manager key query response
     * @param {string} protocol The protocol of the current block
     * @returns {string} If manager exists, returns the manager key
     */
    getManagerKey: (manager: any, protocol: string) => string | null;
    /**
     * @description Conforms the operation to a specific protocol
     * @param {Object} constructedOp The operation object
     * @param {string} nextProtocol The next protocol of the current block
     * @returns {string} The protocol specific operation
     */
    private _conformOperation;
    /**
     * @description Given operation objects, return the operations with their estimated limits
     * @param {Object|Array} operation The operation object or list of objects
     * @param {string} [source] The source of the operation
     * @returns {Promise} The operations with populated limits
     */
    estimateLimits: (operation: Operation | Operation[], source?: string | undefined) => Promise<Operation[]>;
    /**
     * @description Looks up a contract and returns an initialized contract
     * @param {Object} address The contract address
     * @returns {Promise} An initialized contract class
     * @example
     * // Load contract
     * const contract = await sotez.loadContract('KT1MKm4ynxPSzRjw26jPSJbaMFTqTc4dVPdK');
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
    loadContract: (address: string) => Promise<Contract>;
}
export {};
