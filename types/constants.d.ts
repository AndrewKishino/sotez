export declare const prefix: {
    [key: string]: Uint8Array;
};
export declare const magicBytes: {
    block: Uint8Array;
    endorsement: Uint8Array;
    generic: Uint8Array;
};
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
    '007a': string;
    '007': string;
    '008a': string;
    '008': string;
    '009': string;
    '010': string;
    '011': string;
    '012': string;
    '013': string;
};
declare const _default: {
    prefix: {
        [key: string]: Uint8Array;
    };
    magicBytes: {
        block: Uint8Array;
        endorsement: Uint8Array;
        generic: Uint8Array;
    };
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
        '007a': string;
        '007': string;
        '008a': string;
        '008': string;
        '009': string;
        '010': string;
        '011': string;
        '012': string;
        '013': string;
    };
};
export default _default;
