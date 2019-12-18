export default class AbstractTezModule {
    _provider: string;
    _chain: string;
    constructor(provider: string, chain: string);
    get provider(): string;
    set provider(provider: string);
    get chain(): string;
    set chain(value: string);
    setProvider(provider: string, chain?: string): void;
}
