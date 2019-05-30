/// <reference types="node" />
declare module "types/index" {
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
        script?: {
            code: string;
            storage: string;
        };
        managerPubkey?: string;
        manager_pubkey?: string;
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
        script: {
            code: string;
            storage: string;
        };
        managerPubkey: string;
        manager_pubkey: string;
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
        edsig: string;
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
        from: string;
        keys: Keys;
        to: string;
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
        spsig1: Uint8Array;
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
        b58cdecode: (enc: string, prefixArg: Uint8Array) => string;
        buf2hex: (buffer: any) => string;
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
        verify: (bytes: string, sig: string, pk: string) => Promise<number>;
    }
    export interface Ledger {
        getAddress: (arg: LedgerGetAddress) => Promise<{
            address: string;
            publicKey: string;
        }>;
        signOperation: (arg: LedgerSignOperation) => Promise<string>;
        getVersion?: () => Promise<LedgerGetVersion>;
    }
    export interface Forge {
        forge: (opOb: OperationObject, counter: number) => Promise<ForgedBytes>;
        decodeRawBytes: (bytes: string) => any;
        encodeRawBytes: (input: any) => string;
        toBytesInt32: (num: number) => ArrayBuffer;
        toBytesInt32Hex: (num: number) => string;
        bool: (bool: boolean) => string;
        script: (arg: {
            code: string;
            storage: string;
        }) => string;
        parameters: (params: string) => string;
        publicKeyHash: (publicKeyHash: string) => string;
        address: (address: string) => string;
        zarith: (zarith: string) => string;
        publicKey: (publicKey: string) => string;
        op: (cOp: ConstructedOperation) => string;
    }
    export interface OperationParams {
        operation: Operation[];
        skipPrevalidation?: boolean;
        skipSignature?: boolean;
    }
    export interface Tez {
        _localForge: boolean;
        _validateLocalForge: boolean;
        _counters: {
            [key: string]: number;
        };
        _debugMode: boolean;
        key: Key;
        importKey: (key: string, passphrase?: string, email?: string) => Promise<void>;
        importLedger: () => Promise<void>;
        query: (path: string, payload?: any, method?: string) => Promise<any>;
        account: (arg: AccountParams) => Promise<any>;
        getBalance: (address: string) => Promise<string>;
        getDelegate: (address: string) => Promise<string | boolean>;
        getManager: (address: string) => Promise<{
            manager: string;
            key: string;
        }>;
        getCounter: (address: string) => Promise<string>;
        getBaker: (address: string) => Promise<Baker>;
        getHead: () => Promise<Head>;
        getHeader: () => Promise<Header>;
        getHeadHash: () => Promise<string>;
        getBallotList: () => Promise<any[]>;
        getProposals: () => Promise<any[]>;
        getBallots: () => Promise<{
            yay: number;
            nay: number;
            pass: number;
        }>;
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
        _network: string;
        _chain: string;
        _defaultFee: number;
    }
    export interface ModuleOptions {
        defaultFee?: number;
        debugMode?: boolean;
        localForge?: boolean;
        validateLocalForge?: boolean;
    }
    export interface Key {
        _publicKey: string;
        _secretKey?: string;
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
        verify: (bytes: string, signature: string) => Promise<boolean>;
    }
}
declare module "constants" {
    import { Prefix, Watermark } from "types/index";
    export const prefix: Prefix;
    export const watermark: Watermark;
    export const forgeMappings: {
        opMapping: {
            [key: string]: string;
        };
        opMappingReverse: {
            [key: string]: string;
        };
        primMapping: {
            [key: string]: string | {
                [key: string]: string | number | boolean;
            };
        };
        primMappingReverse: {
            [key: string]: {
                [key: string]: string | undefined;
            };
        };
        forgeOpTags: {
            [key: string]: number;
        };
    };
    const _default: {
        prefix: Prefix;
        watermark: Watermark;
        forgeMappings: {
            opMapping: {
                [key: string]: string;
            };
            opMappingReverse: {
                [key: string]: string;
            };
            primMapping: {
                [key: string]: string | {
                    [key: string]: string | number | boolean;
                };
            };
            primMappingReverse: {
                [key: string]: {
                    [key: string]: string | undefined;
                };
            };
            forgeOpTags: {
                [key: string]: number;
            };
        };
    };
    export default _default;
}
declare module "utility" {
    import { Utility } from "types/index";
    const utility: Utility;
    export default utility;
}
declare module "crypto" {
    import { Crypto } from "types/index";
    const crypto: Crypto;
    export default crypto;
}
declare module "forge" {
    import { Forge } from "types/index";
    const forge: Forge;
    export default forge;
}
declare module "tez-core" {
    import { TezModuleInterface, ModuleOptions } from "types/index";
    export default class AbstractTezModule implements TezModuleInterface {
        _provider: string;
        _network: string;
        _defaultFee: number;
        _chain: string;
        constructor(provider: string, chain: string, network?: string, options?: ModuleOptions);
        provider: string;
        network: string;
        chain: string;
        defaultFee: number;
        setProvider(provider: string, chain?: string, network?: string): void;
    }
}
declare module "key" {
    import { Key as KeyInterface } from "types/index";
    /**
     * Creates a key object from a base58 encoded key.
     * @class Key
     * @param {String} key A public or secret key in base58 encoding, or a 15 word bip39 english mnemonic string
     * @param {String} passphrase The passphrase used if the key provided is an encrypted private key or a fundraiser key
     * @param {String} email Email used if a fundraiser key is passed
     * @example
     * const key = new Key('edskRv6ZnkLQMVustbYHFPNsABu1Js6pEEWyMUFJQTqEZjVCU2WHh8ckcc7YA4uBzPiJjZCsv3pC1NDdV99AnyLzPjSip4uC3y');
     * await key.ready;
     */
    export default class Key implements KeyInterface {
        _publicKey: string;
        _secretKey?: string;
        _isSecret: boolean;
        _isLedger: boolean;
        _ledgerPath: string;
        _ledgerCurve: number;
        ready: Promise<void>;
        curve: string;
        constructor(key: string, passphrase?: string, email?: string);
        isLedger: boolean;
        ledgerPath: string;
        ledgerCurve: number;
        /**
         * @memberof Key
         * @description Returns the public key
         * @returns {String} The public key associated with the private key
         */
        publicKey: () => string;
        /**
         * @memberof Key
         * @description Returns the secret key
         * @returns {String} The secret key associated with this key, if available
         */
        secretKey: () => string;
        /**
         * @memberof Key
         * @description Returns public key hash for this key
         * @returns {String} The public key hash for this key
         */
        publicKeyHash: () => string;
        initialize: (key: string, passphrase?: string | undefined, email?: string | undefined, ready?: any) => Promise<void>;
        /**
         * @memberof Key
         * @description Sign a raw sequence of bytes
         * @param {String} bytes Sequence of bytes, raw format or hexadecimal notation
         * @param {Uint8Array} watermark The watermark bytes
         * @returns {String} The public key hash for this key
         */
        sign: (bytes: string, watermark: Uint8Array) => Promise<{
            bytes: string;
            sig: string;
            edsig: string;
            sbytes: string;
        }>;
        /**
         * @memberof Key
         * @description Verify signature, throw error if it is not valid
         * @param {String} bytes Sequance of bytes, raw format or hexadecimal notation
         * @param {Uint8Array} signature A signature in base58 encoding
         */
        verify: (bytes: string, signature: string) => any;
    }
}
declare module "hw-app-xtz/utils" {
    interface Defer<T> {
        promise: Promise<T>;
        resolve: (arg: T) => void;
        reject: (arg: any) => void;
    }
    export function defer<T>(): Defer<T>;
    export function splitPath(path: string): number[];
    export function eachSeries<A>(arr: A[], fun: (arg: A) => Promise<any>): Promise<any>;
    export function foreach<T, A>(arr: T[], callback: (arg1: T, arg2: number) => Promise<A>): Promise<A[]>;
    export function doIf(condition: boolean, callback: () => any | Promise<any>): Promise<void>;
    export function asyncWhile<T>(predicate: () => boolean, callback: () => Promise<T>): Promise<T[]>;
    export const encodePublicKey: (publicKey: Buffer, curve: number) => {
        publicKey: any;
        address: any;
    };
}
declare module "hw-app-xtz/Tezos" {
    /**
     * Tezos API
     *
     * @example
     * import Tezos from '@ledgerhq/hw-app-xtz';
     * const tez = new Tezos(transport)
     */
    export default class Tezos {
        transport: any;
        constructor(transport: any);
        /**
         * get Tezos public key and address (key hash) for a given BIP 32 path.
         * @param path a path in BIP 32 format, must begin with 44'/1729'
         * @option boolDisplay optionally enable or not the display
         * @return an object with a publicKey
         * @example
         * tez.getAddress("44'/1729'/0'/0'").then(o => o.address)
         */
        getAddress(path: string, boolDisplay?: boolean, curve?: number): Promise<{
            publicKey: string;
            address: string;
        }>;
        signOperation(path: string, rawTxHex: string, curve?: number): Promise<{
            signature: string;
        }>;
        getVersion(): Promise<{
            major: number;
            minor: number;
            patch: number;
            bakingApp: boolean;
        }>;
    }
}
declare module "web/ledger-web" {
    import { Ledger as LedgerType } from "types/index";
    const ledger: LedgerType;
    export default ledger;
}
declare module "web/tez-web" {
    import AbstractTezModule from "tez-core";
    import { Tez as TezInterface, Key as KeyInterface, ModuleOptions, Head, Header, Baker, OperationObject, RpcParams, AccountParams, OperationParams, ContractParams, ForgedBytes } from "types/index";
    /**
     * Main tez.js Library
     * @class Sotez
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
     * await sotez.importKey('edskRv6ZnkLQMVustbYHFPNsABu1Js6pEEWyMUFJQTqEZjVCU2WHh8ckcc7YA4uBzPiJjZCsv3pC1NDdV99AnyLzPjSip4uC3y');
     * sotez.transfer({
     *   to: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
     *   amount: '1000000',
     * });
     */
    export default class Sotez extends AbstractTezModule implements TezInterface {
        _localForge: boolean;
        _validateLocalForge: boolean;
        _counters: {
            [key: string]: number;
        };
        _debugMode: boolean;
        key: KeyInterface;
        constructor(provider?: string, chain?: string, net?: string, options?: ModuleOptions);
        localForge: boolean;
        validateLocalForge: boolean;
        counters: {
            [key: string]: number;
        };
        debugMode: boolean;
        setProvider(provider: string, chain?: string, network?: string): void;
        /**
        * @description Import a secret key
        * @param {String} key The secret key
        * @param {String} [passphrase] The passphrase of the encrypted key
        * @param {String} [email] The email associated with the fundraiser account
        * @example
        * await sotez.importKey('edskRv6ZnkLQMVustbYHFPNsABu1Js6pEEWyMUFJQTqEZjVCU2WHh8ckcc7YA4uBzPiJjZCsv3pC1NDdV99AnyLzPjSip4uC3y');
        */
        importKey: (key: string, passphrase?: string | undefined, email?: string | undefined) => Promise<void>;
        /**
         * @description Import a ledger public key
         * @param {String} [path="44'/1729'/0'/0'"] The ledger path
         * @param {Number} [curve=0x00] The curve parameter
         * @example
         * await sotez.importLedger();
         */
        importLedger: (path?: string, curve?: number) => Promise<void>;
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
        query: (path: string, payload?: any, method?: string | undefined) => Promise<any>;
        /**
         * @description Originate a new account
         * @param {Object} paramObject The parameters for the origination
         * @param {Number} paramObject.balance The amount in tez to transfer for the initial balance
         * @param {Boolean} [paramObject.spendable] Whether the keyholder can spend the balance from the new account
         * @param {Boolean} [paramObject.delegatable] Whether the new account is delegatable
         * @param {String} [paramObject.delegate] The delegate for the new account
         * @param {Number} [paramObject.fee=1278] The fee to set for the transaction
         * @param {Number} [paramObject.gasLimit=10000] The gas limit to set for the transaction
         * @param {Number} [paramObject.storageLimit=257] The storage limit to set for the transaction
         * @returns {Promise} Object containing the injected operation hash
         * @example
         * sotez.account({
         *   amount: 10,
         *   spendable: true,
         *   delegatable: true,
         *   delegate: 'tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4',
         * }).then(res => console.log(res.operations[0].metadata.operation_result.originated_contracts[0]))
         */
        account: ({ balance, spendable, delegatable, delegate, fee, gasLimit, storageLimit, }: AccountParams) => Promise<any>;
        /**
         * @description Get the balance for a contract
         * @param {String} address The contract for which to retrieve the balance
         * @returns {Promise} The balance of the contract
         * @example
         * sotez.getBalance('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
         *   .then(balance => console.log(balance))
         */
        getBalance: (address: string) => Promise<string>;
        /**
         * @description Get the delegate for a contract
         * @param {String} address The contract for which to retrieve the delegate
         * @returns {Promise} The delegate of a contract, if any
         * @example
         * sotez.getDelegate('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
         *   .then(delegate => console.log(delegate))
         */
        getDelegate: (address: string) => Promise<string | boolean>;
        /**
         * @description Get the manager for a contract
         * @param {String} address The contract for which to retrieve the manager
         * @returns {Promise} The manager of a contract
         * @example
         * sotez.getManager('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
         *   .then(({ manager, key }) => console.log(manager, key))
         */
        getManager: (address: string) => Promise<{
            manager: string;
            key: string;
        }>;
        /**
         * @description Get the counter for an contract
         * @param {String} address The contract for which to retrieve the counter
         * @returns {Promise} The counter of a contract, if any
         * @example
         * sotez.getCounter('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
         *   .then(counter => console.log(counter))
         */
        getCounter: (address: string) => Promise<string>;
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
        getBaker: (address: string) => Promise<Baker>;
        /**
         * @description Get the header of the current head
         * @returns {Promise} The whole block header
         * @example
         * sotez.getHeader().then(header => console.log(header))
         */
        getHeader: () => Promise<Header>;
        /**
         * @description Get the current head block of the chain
         * @returns {Promise} The current head block
         * @example
         * sotez.getHead().then(head => console.log(head))
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
         * sotez.getBallotList().then(ballotList => console.log(ballotList))
         */
        getBallotList: () => Promise<any[]>;
        /**
         * @description List of proposals with number of supporters
         * @returns {Promise} List of proposals with number of supporters
         * @example
         * sotez.getProposals().then(proposals => {
         *   console.log(proposals[0][0], proposals[0][1])
         *   console.log(proposals[1][0], proposals[1][1])
         * )
         */
        getProposals: () => Promise<any[]>;
        /**
         * @description Sum of ballots casted so far during a voting period
         * @returns {Promise} Sum of ballots casted so far during a voting period
         * @example
         * sotez.getBallots().then(({ yay, nay, pass }) => console.log(yay, nay, pass))
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
         * sotez.getListings().then(listings => console.log(listings))
         */
        getListings: () => Promise<any[]>;
        /**
         * @description Current proposal under evaluation
         * @returns {Promise} Current proposal under evaluation
         * @example
         * sotez.getCurrentProposal().then(currentProposal => console.log(currentProposal))
         */
        getCurrentProposal: () => Promise<string>;
        /**
         * @description Current period kind
         * @returns {Promise} Current period kind
         * @example
         * sotez.getCurrentPeriod().then(currentPeriod => console.log(currentPeriod))
         */
        getCurrentPeriod: () => Promise<any>;
        /**
         * @description Current expected quorum
         * @returns {Promise} Current expected quorum
         * @example
         * sotez.getCurrentQuorum().then(currentQuorum => console.log(currentQuorum))
         */
        getCurrentQuorum: () => Promise<number>;
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
         * @example
         * sotez.prepareOperation({
         *   operation: {
         *     kind: 'transaction',
         *     fee: '50000',
         *     gas_limit: '10200',
         *     storage_limit: '0',
         *     amount: '1000',
         *     destination: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
         *   }
         * }).then(({ opbytes, opOb, counter }) => console.log(opbytes, opOb, counter));
         */
        prepareOperation: ({ operation }: OperationParams) => Promise<ForgedBytes>;
        /**
         * @description Simulate an operation
         * @param {Object} paramObject The parameters for the operation
         * @param {Object|Array} paramObject.operation The operation to include in the transaction
         * @returns {Promise} The simulated operation result
         * @example
         * sotez.simulateOperation({
         *   operation: {
         *     kind: 'transaction',
         *     fee: '50000',
         *     gas_limit: '10200',
         *     storage_limit: '0',
         *     amount: '1000',
         *     destination: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
         *   },
         * }).then(result => console.log(result));
         */
        simulateOperation: ({ operation }: OperationParams) => Promise<any>;
        /**
         * @description Send an operation
         * @param {Object} paramObject The parameters for the operation
         * @param {Object|Array} paramObject.operation The operation to include in the transaction
         * @param {Boolean} [paramObject.skipPrevalidation=false] Skip prevalidation before injecting operation
         * @returns {Promise} Object containing the injected operation hash
         * @example
         * const operation = {
         *   kind: 'transaction',
         *   fee: '50000',
         *   gas_limit: '10200',
         *   storage_limit: '0',
         *   amount: '1000',
         *   destination: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
         * };
         *
         * sotez.sendOperation({ operation }).then(result => console.log(result));
         *
         * sotez.sendOperation({ operation: [operation, operation] }).then(result => console.log(result));
         */
        sendOperation: ({ operation, skipPrevalidation, skipSignature }: OperationParams) => Promise<any>;
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
         * @param {Number} [paramObject.fee=1278] The fee to set for the transaction
         * @param {String} [paramObject.parameter=false] The parameter for the transaction
         * @param {Number} [paramObject.gasLimit=10100] The gas limit to set for the transaction
         * @param {Number} [paramObject.storageLimit=0] The storage limit to set for the transaction
         * @param {Number} [paramObject.mutez=false] Whether the input amount is set to mutez (1/1,000,000 tez)
         * @param {Number} [paramObject.rawParam=false] Whether to accept the object parameter format
         * @returns {Promise} Object containing the injected operation hash
         * @example
         * sotez.transfer({
         *   to: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
         *   amount: '1000000',
         *   fee: '1278',
         * }).then(result => console.log(result))
         */
        transfer: ({ to, amount, parameter, fee, gasLimit, storageLimit, mutez, rawParam, }: RpcParams) => Promise<any>;
        /**
         * @description Activate an account
         * @param {Object} pkh The public key hash of the account
         * @param {String} secret The secret to activate the account
         * @returns {Promise} Object containing the injected operation hash
         * @example
         * sotez.activate(pkh, secret)
         *   .then((activateOperation) => console.log(activateOperation))
         */
        activate: (pkh: string, secret: string) => Promise<any>;
        /**
         * @description Originate a new contract
         * @param {Object} paramObject The parameters for the operation
         * @param {Number} paramObject.balance The amount in tez to transfer for the initial balance
         * @param {String} paramObject.code The code to deploy for the contract
         * @param {String} paramObject.init The initial storage of the contract
         * @param {Boolean} [paramObject.spendable=false] Whether the keyholder can spend the balance from the new account
         * @param {Boolean} [paramObject.delegatable=false] Whether the new account is delegatable
         * @param {String} [paramObject.delegate] The delegate for the new account
         * @param {Number} [paramObject.fee=1278] The fee to set for the transaction
         * @param {Number} [paramObject.gasLimit=10000] The gas limit to set for the transaction
         * @param {Number} [paramObject.storageLimit=257] The storage limit to set for the transaction
         * @returns {Promise} Object containing the injected operation hash
         */
        originate: ({ balance, code, init, spendable, delegatable, delegate, fee, gasLimit, storageLimit, }: ContractParams) => Promise<any>;
        /**
         * @description Set a delegate for an account
         * @param {Object} paramObject The parameters for the operation
         * @param {String} [paramObject.delegate] The delegate for the new account
         * @param {Number} [paramObject.fee=1278] The fee to set for the transaction
         * @param {Number} [paramObject.gasLimit=10000] The gas limit to set for the transaction
         * @param {Number} [paramObject.storageLimit=0] The storage limit to set for the transaction
         * @returns {Promise} Object containing the injected operation hash
         */
        setDelegate: ({ delegate, fee, gasLimit, storageLimit, }: RpcParams) => Promise<any>;
        /**
         * @description Register an account as a delegate
         * @param {Object} paramObject The parameters for the operation
         * @param {Number} [paramObject.fee=1278] The fee to set for the transaction
         * @param {Number} [paramObject.gasLimit=10000] The gas limit to set for the transaction
         * @param {Number} [paramObject.storageLimit=0] The storage limit to set for the transaction
         * @returns {Promise} Object containing the injected operation hash
         */
        registerDelegate: ({ fee, gasLimit, storageLimit, }: RpcParams) => Promise<any>;
        /**
         * @description Typechecks the provided code
         * @param {String} code The code to typecheck
         * @returns {Promise} Typecheck result
         */
        typecheckCode: (code: string) => Promise<any>;
        /**
         * @description Serializes a piece of data to a binary representation
         * @param {String} data
         * @param {String} type
         * @returns {Promise} Serialized data
         */
        packData: (data: string, type: string) => Promise<any>;
        /**
         * @description Typechecks data against a type
         * @param {String} data
         * @param {String} type
         * @returns {Promise} Typecheck result
         */
        typecheckData: (data: string, type: string) => Promise<any>;
        /**
         * @description Runs or traces code against an input and storage
         * @param {String} code Code to run
         * @param {Number} amount Amount to send
         * @param {String} input Input to run though code
         * @param {String} storage State of storage
         * @param {Boolean} [trace=false] Whether to trace
         * @returns {Promise} Run results
         */
        runCode: (code: string, amount: number, input: string, storage: string, trace?: boolean) => Promise<any>;
    }
}
declare module "index-web" {
    import Sotez from "web/tez-web";
    export { default as Key } from "key";
    export { default as crypto } from "crypto";
    export { default as forge } from "forge";
    export { default as utility } from "utility";
    export { default as ledger } from "web/ledger-web";
    export { prefix, watermark, forgeMappings } from "constants";
    export default Sotez;
}
declare module "node/ledger" {
    import { Ledger as LedgerType } from "types/index";
    const ledger: LedgerType;
    export default ledger;
}
declare module "node/tez" {
    import AbstractTezModule from "tez-core";
    import { Tez as TezInterface, Key as KeyInterface, ModuleOptions, Head, Header, Baker, OperationObject, RpcParams, AccountParams, OperationParams, ContractParams, ForgedBytes } from "types/index";
    /**
     * Main tez.js Library
     * @class Sotez
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
     * await sotez.importKey('edskRv6ZnkLQMVustbYHFPNsABu1Js6pEEWyMUFJQTqEZjVCU2WHh8ckcc7YA4uBzPiJjZCsv3pC1NDdV99AnyLzPjSip4uC3y');
     * sotez.transfer({
     *   to: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
     *   amount: '1000000',
     * });
     */
    export default class Sotez extends AbstractTezModule implements TezInterface {
        _localForge: boolean;
        _validateLocalForge: boolean;
        _counters: {
            [key: string]: number;
        };
        _debugMode: boolean;
        key: KeyInterface;
        constructor(provider?: string, chain?: string, net?: string, options?: ModuleOptions);
        localForge: boolean;
        validateLocalForge: boolean;
        counters: {
            [key: string]: number;
        };
        debugMode: boolean;
        setProvider(provider: string, chain?: string, network?: string): void;
        /**
        * @description Import a secret key
        * @param {String} key The secret key
        * @param {String} [passphrase] The passphrase of the encrypted key
        * @param {String} [email] The email associated with the fundraiser account
        * @example
        * await sotez.importKey('edskRv6ZnkLQMVustbYHFPNsABu1Js6pEEWyMUFJQTqEZjVCU2WHh8ckcc7YA4uBzPiJjZCsv3pC1NDdV99AnyLzPjSip4uC3y');
        */
        importKey: (key: string, passphrase?: string | undefined, email?: string | undefined) => Promise<void>;
        /**
         * @description Import a ledger public key
         * @param {String} [path="44'/1729'/0'/0'"] The ledger path
         * @param {Number} [curve=0x00] The curve parameter
         * @example
         * await sotez.importLedger();
         */
        importLedger: (path?: string, curve?: number) => Promise<void>;
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
        query: (path: string, payload?: any, method?: string | undefined) => Promise<any>;
        /**
         * @description Originate a new account
         * @param {Object} paramObject The parameters for the origination
         * @param {Number} paramObject.balance The amount in tez to transfer for the initial balance
         * @param {Boolean} [paramObject.spendable] Whether the keyholder can spend the balance from the new account
         * @param {Boolean} [paramObject.delegatable] Whether the new account is delegatable
         * @param {String} [paramObject.delegate] The delegate for the new account
         * @param {Number} [paramObject.fee=1278] The fee to set for the transaction
         * @param {Number} [paramObject.gasLimit=10000] The gas limit to set for the transaction
         * @param {Number} [paramObject.storageLimit=257] The storage limit to set for the transaction
         * @returns {Promise} Object containing the injected operation hash
         * @example
         * sotez.account({
         *   amount: 10,
         *   spendable: true,
         *   delegatable: true,
         *   delegate: 'tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4',
         * }).then(res => console.log(res.operations[0].metadata.operation_result.originated_contracts[0]))
         */
        account: ({ balance, spendable, delegatable, delegate, fee, gasLimit, storageLimit, }: AccountParams) => Promise<any>;
        /**
         * @description Get the balance for a contract
         * @param {String} address The contract for which to retrieve the balance
         * @returns {Promise} The balance of the contract
         * @example
         * sotez.getBalance('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
         *   .then(balance => console.log(balance))
         */
        getBalance: (address: string) => Promise<string>;
        /**
         * @description Get the delegate for a contract
         * @param {String} address The contract for which to retrieve the delegate
         * @returns {Promise} The delegate of a contract, if any
         * @example
         * sotez.getDelegate('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
         *   .then(delegate => console.log(delegate))
         */
        getDelegate: (address: string) => Promise<string | boolean>;
        /**
         * @description Get the manager for a contract
         * @param {String} address The contract for which to retrieve the manager
         * @returns {Promise} The manager of a contract
         * @example
         * sotez.getManager('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
         *   .then(({ manager, key }) => console.log(manager, key))
         */
        getManager: (address: string) => Promise<{
            manager: string;
            key: string;
        }>;
        /**
         * @description Get the counter for an contract
         * @param {String} address The contract for which to retrieve the counter
         * @returns {Promise} The counter of a contract, if any
         * @example
         * sotez.getCounter('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
         *   .then(counter => console.log(counter))
         */
        getCounter: (address: string) => Promise<string>;
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
        getBaker: (address: string) => Promise<Baker>;
        /**
         * @description Get the header of the current head
         * @returns {Promise} The whole block header
         * @example
         * sotez.getHeader().then(header => console.log(header))
         */
        getHeader: () => Promise<Header>;
        /**
         * @description Get the current head block of the chain
         * @returns {Promise} The current head block
         * @example
         * sotez.getHead().then(head => console.log(head))
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
         * sotez.getBallotList().then(ballotList => console.log(ballotList))
         */
        getBallotList: () => Promise<any[]>;
        /**
         * @description List of proposals with number of supporters
         * @returns {Promise} List of proposals with number of supporters
         * @example
         * sotez.getProposals().then(proposals => {
         *   console.log(proposals[0][0], proposals[0][1])
         *   console.log(proposals[1][0], proposals[1][1])
         * )
         */
        getProposals: () => Promise<any[]>;
        /**
         * @description Sum of ballots casted so far during a voting period
         * @returns {Promise} Sum of ballots casted so far during a voting period
         * @example
         * sotez.getBallots().then(({ yay, nay, pass }) => console.log(yay, nay, pass))
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
         * sotez.getListings().then(listings => console.log(listings))
         */
        getListings: () => Promise<any[]>;
        /**
         * @description Current proposal under evaluation
         * @returns {Promise} Current proposal under evaluation
         * @example
         * sotez.getCurrentProposal().then(currentProposal => console.log(currentProposal))
         */
        getCurrentProposal: () => Promise<string>;
        /**
         * @description Current period kind
         * @returns {Promise} Current period kind
         * @example
         * sotez.getCurrentPeriod().then(currentPeriod => console.log(currentPeriod))
         */
        getCurrentPeriod: () => Promise<any>;
        /**
         * @description Current expected quorum
         * @returns {Promise} Current expected quorum
         * @example
         * sotez.getCurrentQuorum().then(currentQuorum => console.log(currentQuorum))
         */
        getCurrentQuorum: () => Promise<number>;
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
         * @example
         * sotez.prepareOperation({
         *   operation: {
         *     kind: 'transaction',
         *     fee: '50000',
         *     gas_limit: '10200',
         *     storage_limit: '0',
         *     amount: '1000',
         *     destination: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
         *   }
         * }).then(({ opbytes, opOb, counter }) => console.log(opbytes, opOb, counter));
         */
        prepareOperation: ({ operation }: OperationParams) => Promise<ForgedBytes>;
        /**
         * @description Simulate an operation
         * @param {Object} paramObject The parameters for the operation
         * @param {Object|Array} paramObject.operation The operation to include in the transaction
         * @returns {Promise} The simulated operation result
         * @example
         * sotez.simulateOperation({
         *   operation: {
         *     kind: 'transaction',
         *     fee: '50000',
         *     gas_limit: '10200',
         *     storage_limit: '0',
         *     amount: '1000',
         *     destination: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
         *   },
         * }).then(result => console.log(result));
         */
        simulateOperation: ({ operation }: OperationParams) => Promise<any>;
        /**
         * @description Send an operation
         * @param {Object} paramObject The parameters for the operation
         * @param {Object|Array} paramObject.operation The operation to include in the transaction
         * @param {Boolean} [paramObject.skipPrevalidation=false] Skip prevalidation before injecting operation
         * @returns {Promise} Object containing the injected operation hash
         * @example
         * const operation = {
         *   kind: 'transaction',
         *   fee: '50000',
         *   gas_limit: '10200',
         *   storage_limit: '0',
         *   amount: '1000',
         *   destination: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
         * };
         *
         * sotez.sendOperation({ operation }).then(result => console.log(result));
         *
         * sotez.sendOperation({ operation: [operation, operation] }).then(result => console.log(result));
         */
        sendOperation: ({ operation, skipPrevalidation, skipSignature }: OperationParams) => Promise<any>;
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
         * @param {Number} [paramObject.fee=1278] The fee to set for the transaction
         * @param {String} [paramObject.parameter=false] The parameter for the transaction
         * @param {Number} [paramObject.gasLimit=10100] The gas limit to set for the transaction
         * @param {Number} [paramObject.storageLimit=0] The storage limit to set for the transaction
         * @param {Number} [paramObject.mutez=false] Whether the input amount is set to mutez (1/1,000,000 tez)
         * @param {Number} [paramObject.rawParam=false] Whether to accept the object parameter format
         * @returns {Promise} Object containing the injected operation hash
         * @example
         * sotez.transfer({
         *   to: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
         *   amount: '1000000',
         *   fee: '1278',
         * }).then(result => console.log(result))
         */
        transfer: ({ to, amount, parameter, fee, gasLimit, storageLimit, mutez, rawParam, }: RpcParams) => Promise<any>;
        /**
         * @description Activate an account
         * @param {Object} pkh The public key hash of the account
         * @param {String} secret The secret to activate the account
         * @returns {Promise} Object containing the injected operation hash
         * @example
         * sotez.activate(pkh, secret)
         *   .then((activateOperation) => console.log(activateOperation))
         */
        activate: (pkh: string, secret: string) => Promise<any>;
        /**
         * @description Originate a new contract
         * @param {Object} paramObject The parameters for the operation
         * @param {Number} paramObject.balance The amount in tez to transfer for the initial balance
         * @param {String} paramObject.code The code to deploy for the contract
         * @param {String} paramObject.init The initial storage of the contract
         * @param {Boolean} [paramObject.spendable=false] Whether the keyholder can spend the balance from the new account
         * @param {Boolean} [paramObject.delegatable=false] Whether the new account is delegatable
         * @param {String} [paramObject.delegate] The delegate for the new account
         * @param {Number} [paramObject.fee=1278] The fee to set for the transaction
         * @param {Number} [paramObject.gasLimit=10000] The gas limit to set for the transaction
         * @param {Number} [paramObject.storageLimit=257] The storage limit to set for the transaction
         * @returns {Promise} Object containing the injected operation hash
         */
        originate: ({ balance, code, init, spendable, delegatable, delegate, fee, gasLimit, storageLimit, }: ContractParams) => Promise<any>;
        /**
         * @description Set a delegate for an account
         * @param {Object} paramObject The parameters for the operation
         * @param {String} [paramObject.delegate] The delegate for the new account
         * @param {Number} [paramObject.fee=1278] The fee to set for the transaction
         * @param {Number} [paramObject.gasLimit=10000] The gas limit to set for the transaction
         * @param {Number} [paramObject.storageLimit=0] The storage limit to set for the transaction
         * @returns {Promise} Object containing the injected operation hash
         */
        setDelegate: ({ delegate, fee, gasLimit, storageLimit, }: RpcParams) => Promise<any>;
        /**
         * @description Register an account as a delegate
         * @param {Object} paramObject The parameters for the operation
         * @param {Number} [paramObject.fee=1278] The fee to set for the transaction
         * @param {Number} [paramObject.gasLimit=10000] The gas limit to set for the transaction
         * @param {Number} [paramObject.storageLimit=0] The storage limit to set for the transaction
         * @returns {Promise} Object containing the injected operation hash
         */
        registerDelegate: ({ fee, gasLimit, storageLimit, }: RpcParams) => Promise<any>;
        /**
         * @description Typechecks the provided code
         * @param {String} code The code to typecheck
         * @returns {Promise} Typecheck result
         */
        typecheckCode: (code: string) => Promise<any>;
        /**
         * @description Serializes a piece of data to a binary representation
         * @param {String} data
         * @param {String} type
         * @returns {Promise} Serialized data
         */
        packData: (data: string, type: string) => Promise<any>;
        /**
         * @description Typechecks data against a type
         * @param {String} data
         * @param {String} type
         * @returns {Promise} Typecheck result
         */
        typecheckData: (data: string, type: string) => Promise<any>;
        /**
         * @description Runs or traces code against an input and storage
         * @param {String} code Code to run
         * @param {Number} amount Amount to send
         * @param {String} input Input to run though code
         * @param {String} storage State of storage
         * @param {Boolean} [trace=false] Whether to trace
         * @returns {Promise} Run results
         */
        runCode: (code: string, amount: number, input: string, storage: string, trace?: boolean) => Promise<any>;
    }
}
declare module "index" {
    import Sotez from "node/tez";
    export { default as Key } from "key";
    export { default as crypto } from "crypto";
    export { default as forge } from "forge";
    export { default as utility } from "utility";
    export { default as ledger } from "node/ledger";
    export { prefix, watermark, forgeMappings } from "constants";
    export default Sotez;
}
