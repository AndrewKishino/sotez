export declare class AbstractTezModule {
    _provider: string;
    _chain: string;
    _debugMode: boolean;
    constructor(provider: string, chain?: string, debugMode?: boolean);
    get provider(): string;
    set provider(provider: string);
    get chain(): string;
    set chain(value: string);
    get debugMode(): boolean;
    set debugMode(value: boolean);
    setProvider(provider: string, chain?: string): void;
    /**
     * @description Queries a node given a path and payload
     * @param {string} path The RPC path to query
     * @param {string} [payload] The payload of the query
     * @param {string} [method] The request method. Either 'GET' or 'POST'
     * @returns {Promise} The response of the query
     * @example
     * sotez.query(`/chains/main/blocks/head`)
     *  .then(head => console.log(head));
     */
    query: (path: string, payload?: any, method?: string) => Promise<any>;
}
