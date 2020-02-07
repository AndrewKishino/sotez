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
declare const _default: {
    address: (addressArg: string, protocol?: string) => string;
    decodeRawBytes: (bytes: string) => Micheline;
    encodeRawBytes: (input: Micheline) => string;
    forge: (opOb: OperationObject, counter: number, protocol: string) => Promise<ForgedBytes>;
    op: (opArg: ConstructedOperation, protocol: string) => string;
    endorsement: (opArg: ConstructedOperation) => string;
    seedNonceRevelation: (opArg: ConstructedOperation) => string;
    doubleEndorsementEvidence: (opArg: ConstructedOperation) => string;
    doubleBakingEvidence: (opArg: ConstructedOperation) => string;
    activateAccount: (opArg: ConstructedOperation) => string;
    proposals: (opArg: ConstructedOperation) => string;
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
