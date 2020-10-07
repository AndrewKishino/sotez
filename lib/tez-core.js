import XMLHttpRequest from 'xhr2';
export class AbstractTezModule {
    constructor(provider, chain, debugMode = false) {
        /**
         * @description Queries a node given a path and payload
         * @param {string} path The RPC path to query
         * @param {string} payload The payload of the query
         * @param {string} method The request method. Either 'GET' or 'POST'
         * @returns {Promise} The response of the query
         * @example
         * sotez.query(`/chains/main/blocks/head`)
         *  .then(head => console.log(head));
         */
        this.query = (path, payload, method) => {
            if (typeof payload === 'undefined') {
                if (typeof method === 'undefined') {
                    method = 'GET';
                }
                else {
                    payload = {};
                }
            }
            else if (typeof method === 'undefined') {
                method = 'POST';
            }
            return new Promise((resolve, reject) => {
                try {
                    const http = new XMLHttpRequest();
                    // @ts-ignore
                    http.open(method, this.provider + path, true);
                    http.onload = () => {
                        if (this._debugMode) {
                            console.log('Node call:', path, payload);
                        }
                        if (http.status === 200) {
                            if (http.responseText) {
                                let response = JSON.parse(http.responseText);
                                if (this._debugMode) {
                                    console.log('Node response:', path, response);
                                }
                                if (response && typeof response.error !== 'undefined') {
                                    reject(response.error);
                                }
                                else {
                                    if (response && typeof response.ok !== 'undefined')
                                        response = response.ok;
                                    resolve(response);
                                }
                            }
                            else {
                                reject('Empty response returned'); // eslint-disable-line
                            }
                        }
                        else if (http.responseText) {
                            reject(http.responseText);
                        }
                        else {
                            reject(http.statusText);
                        }
                    };
                    http.onerror = () => {
                        reject(http.statusText);
                    };
                    if (method === 'POST') {
                        http.setRequestHeader('Content-Type', 'application/json');
                        http.send(JSON.stringify(payload));
                    }
                    else {
                        http.send();
                    }
                }
                catch (e) {
                    reject(e);
                }
            });
        };
        this._provider = provider;
        this._chain = chain;
        this._debugMode = debugMode;
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
    get debugMode() {
        return this._debugMode;
    }
    set debugMode(value) {
        this._debugMode = value;
    }
    setProvider(provider, chain = this.chain) {
        this._provider = provider;
        this._chain = chain;
    }
}
