interface LedgerGetAddress {
    path?: string;
    displayConfirm?: boolean;
    curve?: number;
}
interface LedgerSignOperation {
    path?: string;
    rawTxHex: string;
    curve?: number;
    watermark?: Uint8Array;
}
interface LedgerGetVersion {
    major: number;
    minor: number;
    patch: number;
    bakingApp: boolean;
}
declare const _default: {
    getAddress: ({ path, displayConfirm, curve, }?: LedgerGetAddress) => Promise<{
        address: string;
        publicKey: string;
    }>;
    signOperation: ({ path, rawTxHex, curve, watermark, }: LedgerSignOperation) => Promise<string>;
    getVersion: () => Promise<LedgerGetVersion>;
};
export default _default;
