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
    prim: string;
    args?: MichelineArray;
    annots?: Array<string>;
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
declare const _default: {
    address: (address: string, protocol?: string | undefined) => string;
    decodeRawBytes: (bytes: string) => Micheline;
    encodeRawBytes: (input: Micheline) => string;
    forge: (opOb: OperationObject, counter: number, protocol: string) => Promise<ForgedBytes>;
    op: (op: ConstructedOperation, protocol: string) => string;
    endorsement: (op: ConstructedOperation) => string;
    seedNonceRevelation: (op: ConstructedOperation) => string;
    doubleEndorsementEvidence: (op: ConstructedOperation) => string;
    doubleBakingEvidence: (op: ConstructedOperation) => string;
    activateAccount: (op: ConstructedOperation) => string;
    proposals: (op: ConstructedOperation) => string;
    ballot: (op: ConstructedOperation) => string;
    reveal: (op: ConstructedOperation, protocol: string) => string;
    transaction: (op: ConstructedOperation, protocol: string) => string;
    origination: (op: ConstructedOperation, protocol: string) => string;
    delegation: (op: ConstructedOperation, protocol: string) => string;
    parameters: (parameter: any, protocol: string) => string;
    publicKey: (pk: string) => string;
    publicKeyHash: (pkh: string) => string;
    zarith: (n: string) => string;
    bool: (bool: boolean) => string;
    script: (script: {
        code: Micheline;
        storage: Micheline;
    }) => string;
    toBytesInt32: (num: number) => any;
    toBytesInt32Hex: (num: number) => string;
};
export default _default;
