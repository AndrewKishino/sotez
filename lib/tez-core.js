export class AbstractTezModule {
    constructor(provider, chain) {
        this._provider = provider;
        this._chain = chain;
    }
    get provider() {
        return this._provider;
    }
    set provider(provider) {
        this._provider = provider;
    }
    get chain() {
        return this._chain;
    }
    set chain(value) {
        this._chain = value;
    }
    setProvider(provider, chain = this.chain) {
        this._provider = provider;
        this._chain = chain;
    }
}
