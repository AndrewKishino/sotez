export default class AbstractTezModule {
    _provider: string;
    _chain: string;
    constructor(provider: string, chain: string);
    provider: string;
    chain: string;
    setProvider(provider: string, chain?: string): void;
}
