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
    credit: string;
    consensus_key: string;
    threshold: number;
    owner_keys: string[];
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
interface OperationObject {
    branch?: string;
    contents?: ConstructedOperation[];
    protocol?: string;
    signature?: string;
}
interface ForgedBytes {
    opbytes: string;
    opOb: OperationObject;
    counter: number;
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
/**
 * @description Convert bytes from Int32
 * @param {number} num Number to convert to bytes
 * @returns {Object} The converted number
 */
export declare const toBytesInt32: (num: number) => any;
/**
 * @description Convert hex from Int32
 * @param {number} num Number to convert to hex
 * @returns {string} The converted number
 */
export declare const toBytesInt32Hex: (num: number) => string;
/**
 * @description Convert bytes from Int16
 * @param {number} num Number to convert to bytes
 * @returns {Object} The converted number
 */
export declare const toBytesInt16: (num: number) => any;
/**
 * @description Convert hex from Int16
 * @param {number} num Number to convert to hex
 * @returns {string} The converted number
 */
export declare const toBytesInt16Hex: (num: number) => string;
/**
 * @description Forge boolean
 * @param {boolean} boolArg Boolean value to convert
 * @returns {string} The converted boolean
 */
export declare const bool: (boolArg: boolean) => string;
/**
 * @description Forge script bytes
 * @param {Object} scriptArg Script to forge
 * @param {string} scriptArg.code Script code
 * @param {string} scriptArg.storage Script storage
 * @returns {string} Forged script bytes
 */
export declare const script: (scriptArg: {
    code: Micheline;
    storage: Micheline;
}) => string;
/**
 * @description Forge parameter bytes
 * @param {string} parameter Script to forge
 * @param {string} protocol The current block protocol
 * @returns {string} Forged parameter bytes
 */
export declare const parameters: (parameter: any, protocol: string) => string;
/**
 * @description Forge public key hash bytes
 * @param {string} pkh Public key hash to forge
 * @returns {string} Forged public key hash bytes
 */
export declare const publicKeyHash: (pkh: string) => string;
/**
 * @description Forge address bytes
 * @param {string} addressArg Address to forge
 * @param {string} [protocol=''] Current protocol
 * @returns {string} Forged address bytes
 */
export declare const address: (addressArg: string, protocol?: string) => string;
export declare const bakerHash: (baker: string) => string;
/**
 * @description Forge zarith bytes
 * @param {number} n Zarith to forge
 * @returns {string} Forged zarith bytes
 */
export declare const zarith: (n: string) => string;
/**
 * @description Forge public key bytes
 * @param {number} pk Public key to forge
 * @returns {string} Forged public key bytes
 */
export declare const publicKey: (pk: string) => string;
/**
 * @description Forge operation bytes
 * @param {Object} opArg Operation to forge
 * @param {string} protocol Current protocol
 * @returns {string} Forged operation bytes
 */
export declare const op: (opArg: ConstructedOperation, protocol: string) => string;
/**
 * @description Forge endorsement operation bytes
 * @param {Object} opArg Operation to forge
 * @returns {string} Forged operation bytes
 */
export declare const endorsement: (opArg: ConstructedOperation) => string;
/**
 * @description Forge seed_nonce_revelation operation bytes
 * @param {Object} opArg Operation to forge
 * @returns {string} Forged operation bytes
 */
export declare const seedNonceRevelation: (opArg: ConstructedOperation) => string;
/**
 * @description Forge double_endorsement_evidence operation bytes
 * @returns {string} Forged operation bytes
 */
export declare const doubleEndorsementEvidence: () => string;
/**
 * @description Forge double_baking_evidence operation bytes
 * @returns {string} Forged operation bytes
 */
export declare const doubleBakingEvidence: () => string;
/**
 * @description Forge activate_account operation bytes
 * @param {Object} opArg Operation to forge
 * @returns {string} Forged operation bytes
 */
export declare const activateAccount: (opArg: ConstructedOperation) => string;
/**
 * @description Forge proposals operation bytes
 * @returns {string} Forged operation bytes
 */
export declare const proposals: () => string;
/**
 * @description Forge ballot operation bytes
 * @param {Object} opArg Operation to forge
 * @returns {string} Forged operation bytes
 */
export declare const ballot: (opArg: ConstructedOperation) => string;
/**
 * @description Forge reveal operation bytes
 * @param {Object} opArg Operation to forge
 * @param {string} protocol Current protocol
 * @returns {string} Forged operation bytes
 */
export declare const reveal: (opArg: ConstructedOperation, protocol: string) => string;
/**
 * @description Forge transaction operation bytes
 * @param {Object} opArg Operation to forge
 * @param {string} protocol Current protocol
 * @returns {string} Forged operation bytes
 */
export declare const transaction: (opArg: ConstructedOperation, protocol: string) => string;
/**
 * @description Forge origination operation bytes
 * @param {Object} opArg Operation to forge
 * @param {string} protocol Current protocol
 * @returns {string} Forged operation bytes
 */
export declare const origination: (opArg: ConstructedOperation, protocol: string) => string;
/**
 * @description Forge delegation operation bytes
 * @param {Object} opArg Operation to forge
 * @param {string} protocol Current protocol
 * @returns {string} Forged operation bytes
 */
export declare const delegation: (opArg: ConstructedOperation, protocol: string) => string;
/**
 * @description Forge baker registration operation bytes
 * @param {Object} opArg Operation to forge
 * @param {string} protocol Current protocol
 * @returns {string} Forged operation bytes
 */
export declare const bakerRegistration: (opArg: ConstructedOperation, protocol: string) => string;
/**
 * @description Forge operation bytes
 * @param {Object} opOb The operation object(s)
 * @param {number} counter The current counter for the account
 * @param {string} protocol The current block protocol
 * @returns {string} Forged operation bytes
 * @example
 * forge.forge({
 *   branch: head.hash,
 *   contents: [{
 *     kind: 'transaction',
 *     source: 'tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4',
 *     fee: '50000',
 *     counter: '31204',
 *     gas_limit: '10200',
 *     storage_limit: '0',
 *     amount: '100000000',
 *     destination: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
 *   }],
 * }, 32847).then(({ opbytes, opOb }) => console.log(opbytes, opOb));
 */
export declare const forge: (opOb: OperationObject, counter: number, protocol: string) => Promise<ForgedBytes>;
/**
 * @description Decode raw bytes
 * @param {string} bytes The bytes to decode
 * @returns {Object} Decoded raw bytes
 */
export declare const decodeRawBytes: (bytes: string) => Micheline;
/**
 * @description Encode raw bytes
 * @param {Object} input The value to encode
 * @returns {string} Encoded value as bytes
 */
export declare const encodeRawBytes: (input: Micheline) => string;
declare const _default: {
    address: (addressArg: string, protocol?: string) => string;
    decodeRawBytes: (bytes: string) => Micheline;
    encodeRawBytes: (input: Micheline) => string;
    forge: (opOb: OperationObject, counter: number, protocol: string) => Promise<ForgedBytes>;
    op: (opArg: ConstructedOperation, protocol: string) => string;
    endorsement: (opArg: ConstructedOperation) => string;
    seedNonceRevelation: (opArg: ConstructedOperation) => string;
    doubleEndorsementEvidence: () => string;
    doubleBakingEvidence: () => string;
    activateAccount: (opArg: ConstructedOperation) => string;
    proposals: () => string;
    ballot: (opArg: ConstructedOperation) => string;
    reveal: (opArg: ConstructedOperation, protocol: string) => string;
    transaction: (opArg: ConstructedOperation, protocol: string) => string;
    origination: (opArg: ConstructedOperation, protocol: string) => string;
    delegation: (opArg: ConstructedOperation, protocol: string) => string;
    parameters: (parameter: any, protocol: string) => string;
    publicKey: (pk: string) => string;
    publicKeyHash: (pkh: string) => string;
    zarith: (n: string) => string;
    bool: (boolArg: boolean) => string;
    script: (scriptArg: {
        code: Micheline;
        storage: Micheline;
    }) => string;
    toBytesInt32: (num: number) => any;
    toBytesInt32Hex: (num: number) => string;
};
export default _default;
