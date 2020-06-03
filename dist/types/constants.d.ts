interface Prefix {
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
interface MagicBytes {
    block: Uint8Array;
    endorsement: Uint8Array;
    generic: Uint8Array;
}
export declare const prefix: Prefix;
export declare const magicBytes: MagicBytes;
export declare const forgeMappings: {
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
            [key: string]: string;
        };
    };
    forgeOpTags: {
        [key: string]: {
            [key: string]: number;
        };
    };
    entrypointMapping: {
        [key: string]: string;
    };
    entrypointMappingReverse: {
        [key: string]: string;
    };
};
export declare const protocols: {
    '001': string;
    '002': string;
    '003': string;
    '004': string;
    '005a': string;
    '005': string;
    '006': string;
};
declare const _default: {
    prefix: Prefix;
    magicBytes: MagicBytes;
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
                [key: string]: string;
            };
        };
        forgeOpTags: {
            [key: string]: {
                [key: string]: number;
            };
        };
        entrypointMapping: {
            [key: string]: string;
        };
        entrypointMappingReverse: {
            [key: string]: string;
        };
    };
    protocols: {
        '001': string;
        '002': string;
        '003': string;
        '004': string;
        '005a': string;
        '005': string;
        '006': string;
    };
};
export default _default;
