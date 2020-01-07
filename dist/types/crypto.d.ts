interface Keys {
    pk: string;
    pkh: string;
    sk: string;
    password?: string;
}
interface KeysMnemonicPassphrase {
    mnemonic: string;
    passphrase: string;
    sk: string;
    pk: string;
    pkh: string;
}
interface Signed {
    bytes: string;
    sig: string;
    prefixSig: string;
    sbytes: string;
}
declare const _default: {
    extractKeys: (sk: string, password?: string) => Promise<Keys>;
    generateKeys: (mnemonic: string, passphrase: string) => Promise<KeysMnemonicPassphrase>;
    checkAddress: (address: string) => boolean;
    generateMnemonic: () => string;
    sign: (bytes: string, sk: string, wm: Uint8Array, password?: string) => Promise<Signed>;
    verify: (bytes: string, sig: string, pk: string) => Promise<boolean>;
};
export default _default;
