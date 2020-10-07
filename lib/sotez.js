var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AbstractTezModule } from './tez-core';
import { Key } from './key';
import { Contract } from './contract';
import { forge } from './forge';
import { mutez, sexp2mic, ml2mic } from './utility';
import { magicBytes, protocols } from './constants';
/**
 * Main Sotez Library
 * @example
 * import { Sotez } from 'sotez';
 * const sotez = new Sotez('https://127.0.0.1:8732', 'main', { defaultFee: 1275, useMutez: false });
 * await sotez.importKey('edskRv6ZnkLQMVustbYHFPNsABu1Js6pEEWyMUFJQTqEZjVCU2WHh8ckcc7YA4uBzPiJjZCsv3pC1NDdV99AnyLzPjSip4uC3y');
 * sotez.transfer({
 *   to: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
 *   amount: '1000000',
 * });
 */
export class Sotez extends AbstractTezModule {
    constructor(provider = 'http://127.0.0.1:8732', chain = 'main', options = {}) {
        super(provider, chain, options.debugMode);
        /**
         * @description Import a secret key
         * @param {string} key The secret key
         * @param {string} [passphrase] The passphrase of the encrypted key
         * @param {string} [email] The email associated with the fundraiser account
         * @example
         * await sotez.importKey('edskRv6ZnkLQMVustbYHFPNsABu1Js6pEEWyMUFJQTqEZjVCU2WHh8ckcc7YA4uBzPiJjZCsv3pC1NDdV99AnyLzPjSip4uC3y')
         */
        this.importKey = (key, passphrase, email) => __awaiter(this, void 0, void 0, function* () {
            this.key = new Key({ key, passphrase, email });
            yield this.key.ready;
        });
        /**
         * @description Import a ledger public key
         * @param {string} [path="44'/1729'/0'/0'"] The ledger path
         * @param {number} [curve=0x00] The curve parameter
         * @example
         * await sotez.importLedger();
         */
        this.importLedger = (path = "44'/1729'/0'/0'", curve = 0x00) => __awaiter(this, void 0, void 0, function* () {
            this.key = new Key({ ledgerPath: path, ledgerCurve: curve });
            yield this.key.ready;
        });
        /**
         * @description Originate a new account
         * @param {Object} paramObject The parameters for the origination
         * @param {number} paramObject.balance The amount in tez to transfer for the initial balance
         * @param {boolean} [paramObject.spendable] Whether the keyholder can spend the balance from the new account
         * @param {boolean} [paramObject.delegatable] Whether the new account is delegatable
         * @param {string} [paramObject.delegate] The delegate for the new account
         * @param {number} [paramObject.fee=1420] The fee to set for the transaction
         * @param {number} [paramObject.gasLimit=10600] The gas limit to set for the transaction
         * @param {number} [paramObject.storageLimit=257] The storage limit to set for the transaction
         * @returns {Promise} Object containing the injected operation hash
         * @example
         * sotez.account({
         *   balance: 10,
         *   spendable: true,
         *   delegatable: true,
         *   delegate: 'tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4',
         * }).then(res => console.log(res.operations[0].metadata.operation_result.originated_contracts[0]));
         */
        this.account = ({ balance, spendable, delegatable, delegate, fee = this.defaultFee, gasLimit = 10600, storageLimit = 257, }) => __awaiter(this, void 0, void 0, function* () {
            const params = {};
            if (typeof spendable !== 'undefined')
                params.spendable = spendable;
            if (typeof delegatable !== 'undefined')
                params.delegatable = delegatable;
            if (delegate)
                params.delegate = delegate;
            const operation = [
                Object.assign({ kind: 'origination', balance: this.useMutez ? balance : mutez(balance), fee, gas_limit: gasLimit, storage_limit: storageLimit, manager_pubkey: this.key.publicKeyHash() }, params),
            ];
            return this.sendOperation({ operation });
        });
        /**
         * @description Get the balance for a contract
         * @param {string} address The contract for which to retrieve the balance
         * @returns {Promise} The balance of the contract
         * @example
         * sotez.getBalance('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
         *   .then(balance => console.log(balance));
         */
        this.getBalance = (address) => this.query(`/chains/${this.chain}/blocks/head/context/contracts/${address}/balance`);
        /**
         * @description Get the delegate for a contract
         * @param {string} address The contract for which to retrieve the delegate
         * @returns {Promise} The delegate of a contract, if any
         * @example
         * sotez.getDelegate('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
         *   .then(delegate => console.log(delegate));
         */
        this.getDelegate = (address) => this.query(`/chains/${this.chain}/blocks/head/context/contracts/${address}/delegate`).then((delegate) => {
            if (delegate) {
                return delegate;
            }
            return false;
        });
        /**
         * @description Get the manager for a contract
         * @param {string} address The contract for which to retrieve the manager
         * @returns {Promise} The manager of a contract
         * @example
         * sotez.getManager('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
         *   .then(({ manager, key }) => console.log(manager, key));
         */
        this.getManager = (address) => this.query(`/chains/${this.chain}/blocks/head/context/contracts/${address}/manager_key`);
        /**
         * @description Get the counter for an contract
         * @param {string} address The contract for which to retrieve the counter
         * @returns {Promise} The counter of a contract, if any
         * @example
         * sotez.getCounter('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
         *   .then(counter => console.log(counter));
         */
        this.getCounter = (address) => this.query(`/chains/${this.chain}/blocks/head/context/contracts/${address}/counter`);
        /**
         * @description Get the baker information for an address
         * @param {string} address The contract for which to retrieve the baker information
         * @returns {Promise} The information of the delegate address
         * @example
         * sotez.getBaker('tz1fXdNLZ4jrkjtgJWMcfeNpFDK9mbCBsaV4')
         *   .then(({
         *     balance,
         *     frozen_balance,
         *     frozen_balance_by_cycle,
         *     staking_balance,
         *     delegated_contracts,
         *     delegated_balance,
         *     deactivated,
         *     grace_period,
         *   }) => console.log(
         *     balance,
         *     frozen_balance,
         *     frozen_balance_by_cycle,
         *     staking_balance,
         *     delegated_contracts,
         *     delegated_balance,
         *     deactivated,
         *     grace_period,
         *   ));
         */
        this.getBaker = (address) => this.query(`/chains/${this.chain}/blocks/head/context/delegates/${address}`);
        /**
         * @description Get the header of the current head
         * @returns {Promise} The whole block header
         * @example
         * sotez.getHeader().then(header => console.log(header));
         */
        this.getHeader = () => this.query(`/chains/${this.chain}/blocks/head/header`);
        /**
         * @description Get the metadata of the current head
         * @returns {Promise} The head block metadata
         * @example
         * sotez.getHeadMetadata().then(metadata => console.log(metadata));
         */
        this.getHeadMetadata = () => this.query(`/chains/${this.chain}/blocks/head/metadata`);
        /**
         * @description Get the current head block of the chain
         * @returns {Promise} The current head block
         * @example
         * sotez.getHead().then(head => console.log(head));
         */
        this.getHead = () => this.query(`/chains/${this.chain}/blocks/head`);
        /**
         * @description Get the current head block hash of the chain
         * @returns {Promise} The block's hash, its unique identifier
         * @example
         * sotez.getHeadHash().then(headHash => console.log(headHash))
         */
        this.getHeadHash = () => this.query(`/chains/${this.chain}/blocks/head/hash`);
        /**
         * @description Ballots casted so far during a voting period
         * @returns {Promise} Ballots casted so far during a voting period
         * @example
         * sotez.getBallotList().then(ballotList => console.log(ballotList));
         */
        this.getBallotList = () => this.query(`/chains/${this.chain}/blocks/head/votes/ballot_list`);
        /**
         * @description List of proposals with number of supporters
         * @returns {Promise} List of proposals with number of supporters
         * @example
         * sotez.getProposals().then(proposals => {
         *   console.log(proposals[0][0], proposals[0][1])
         *   console.log(proposals[1][0], proposals[1][1])
         * );
         */
        this.getProposals = () => this.query(`/chains/${this.chain}/blocks/head/votes/proposals`);
        /**
         * @description Sum of ballots casted so far during a voting period
         * @returns {Promise} Sum of ballots casted so far during a voting period
         * @example
         * sotez.getBallots().then(({ yay, nay, pass }) => console.log(yay, nay, pass));
         */
        this.getBallots = () => this.query(`/chains/${this.chain}/blocks/head/votes/ballots`);
        /**
         * @description List of delegates with their voting weight, in number of rolls
         * @returns {Promise} The ballots of the current voting period
         * @example
         * sotez.getListings().then(listings => console.log(listings));
         */
        this.getListings = () => this.query(`/chains/${this.chain}/blocks/head/votes/listings`);
        /**
         * @description Current proposal under evaluation
         * @returns {Promise} Current proposal under evaluation
         * @example
         * sotez.getCurrentProposal().then(currentProposal => console.log(currentProposal));
         */
        this.getCurrentProposal = () => this.query(`/chains/${this.chain}/blocks/head/votes/current_proposal`);
        /**
         * @description Current period kind
         * @returns {Promise} Current period kind
         * @example
         * sotez.getCurrentPeriod().then(currentPeriod => console.log(currentPeriod));
         */
        this.getCurrentPeriod = () => this.query(`/chains/${this.chain}/blocks/head/votes/current_period_kind`);
        /**
         * @description Current expected quorum
         * @returns {Promise} Current expected quorum
         * @example
         * sotez.getCurrentQuorum().then(currentQuorum => console.log(currentQuorum));
         */
        this.getCurrentQuorum = () => this.query(`/chains/${this.chain}/blocks/head/votes/current_quorum`);
        /**
         * @description Check for the inclusion of an operation in new blocks
         * @param {string} hash The operation hash to check
         * @param {number} [interval=10] The interval to check new blocks
         * @param {number} [timeout=180] The time before the operation times out
         * @returns {Promise} The hash of the block in which the operation was included
         * @example
         * sotez.awaitOperation('ooYf5iK6EdTx3XfBusgDqS6znACTq5469D1zQSDFNrs5KdTuUGi')
         *  .then((hash) => console.log(hash));
         */
        this.awaitOperation = (hash, interval = 10, timeout = 180) => {
            if (timeout <= 0) {
                throw new Error('Timeout must be more than 0');
            }
            if (interval <= 0) {
                throw new Error('Interval must be more than 0');
            }
            const timeoutAt = Math.ceil(timeout / interval) + 1;
            let count = 0;
            let found = false;
            const operationCheck = (operation) => {
                if (operation.hash === hash) {
                    found = true;
                }
            };
            return new Promise((resolve, reject) => {
                const repeater = () => this.getHead().then((head) => {
                    count++;
                    for (let i = 3; i >= 0; i--) {
                        head.operations[i].forEach(operationCheck);
                    }
                    if (found) {
                        resolve(head.hash);
                    }
                    else if (count >= timeoutAt) {
                        reject(new Error('Timeout'));
                    }
                    else {
                        setTimeout(repeater, interval * 1000);
                    }
                });
                repeater();
            });
        };
        /**
         * @description Queries the rpc endpoint with an optional payload
         * @param {string} path The path to query
         * @param {Object} payload The payload of the request
         * @returns {Promise} The response of the rpc call
         */
        this.call = (path, payload) => this.query(path, payload);
        /**
         * @description Prepares an operation
         * @param {Object} paramObject The parameters for the operation
         * @param {Object | Array} paramObject.operation The operation to include in the transaction
         * @returns {Promise} Object containing the prepared operation
         * @example
         * sotez.prepareOperation({
         *   operation: {
         *     kind: 'transaction',
         *     fee: '1420',
         *     gas_limit: '10600',
         *     storage_limit: '300',
         *     amount: '1000',
         *     destination: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
         *   }
         * }).then(({ opbytes, opOb, counter }) => console.log(opbytes, opOb, counter));
         */
        this.prepareOperation = ({ operation, source, skipCounter = false, }) => {
            let counter;
            const opOb = {};
            const promises = [];
            let requiresReveal = false;
            let ops = [];
            let head;
            promises.push(this.getHeader());
            promises.push(this.getHeadMetadata());
            if (Array.isArray(operation)) {
                ops = [...operation];
            }
            else {
                ops = [operation];
            }
            const publicKeyHash = source || this.key.publicKeyHash();
            for (let i = 0; i < ops.length; i++) {
                if (['transaction', 'origination', 'delegation'].includes(ops[i].kind)) {
                    requiresReveal = true;
                    promises.push(this.getManager(publicKeyHash));
                    promises.push(this.getCounter(publicKeyHash));
                    break;
                }
            }
            return Promise.all(promises).then(([header, metadata, manager, headCounter]) => __awaiter(this, void 0, void 0, function* () {
                head = header;
                if (requiresReveal) {
                    const managerKey = this.getManagerKey(manager, metadata.protocol);
                    if (!managerKey) {
                        const reveal = {
                            kind: 'reveal',
                            fee: 1420,
                            public_key: this.key.publicKey(),
                            source: publicKeyHash,
                            gas_limit: 10600,
                            storage_limit: 300,
                        };
                        ops.unshift(reveal);
                    }
                }
                counter = parseInt(headCounter, 10);
                if (!this._counters[publicKeyHash] ||
                    this._counters[publicKeyHash] < counter) {
                    this._counters[publicKeyHash] = counter;
                }
                const constructOps = (cOps) => {
                    // In case prepareOperation should not increment the counter
                    let opCounter = this._counters[publicKeyHash];
                    return cOps.map((op) => {
                        // @ts-ignore
                        const constructedOp = Object.assign({}, op);
                        if ([
                            'proposals',
                            'ballot',
                            'transaction',
                            'origination',
                            'delegation',
                        ].includes(op.kind)) {
                            if (typeof op.source === 'undefined')
                                constructedOp.source = publicKeyHash;
                        }
                        if (['reveal', 'transaction', 'origination', 'delegation'].includes(op.kind)) {
                            if (typeof op.fee === 'undefined') {
                                constructedOp.fee = '0';
                            }
                            else {
                                constructedOp.fee = `${op.fee}`;
                            }
                            if (typeof op.gas_limit === 'undefined') {
                                constructedOp.gas_limit = '0';
                            }
                            else {
                                constructedOp.gas_limit = `${op.gas_limit}`;
                            }
                            if (typeof op.storage_limit === 'undefined') {
                                constructedOp.storage_limit = '0';
                            }
                            else {
                                constructedOp.storage_limit = `${op.storage_limit}`;
                            }
                            if (typeof op.balance !== 'undefined')
                                constructedOp.balance = `${constructedOp.balance}`;
                            if (typeof op.amount !== 'undefined')
                                constructedOp.amount = `${constructedOp.amount}`;
                            if (!skipCounter) {
                                constructedOp.counter = `${++this._counters[publicKeyHash]}`;
                            }
                            else {
                                constructedOp.counter = `${++opCounter}`;
                            }
                        }
                        return this._conformOperation(constructedOp, metadata.next_protocol);
                    });
                };
                opOb.branch = head.hash;
                opOb.contents = constructOps(ops);
                let remoteForgedBytes = '';
                if (!this._localForge || this._validateLocalForge) {
                    remoteForgedBytes = yield this.query(`/chains/${this.chain}/blocks/${head.hash}/helpers/forge/operations`, opOb);
                }
                opOb.protocol = metadata.next_protocol;
                if (!this._localForge) {
                    return {
                        opbytes: remoteForgedBytes,
                        opOb,
                        counter,
                        chainId: head.chain_id,
                    };
                }
                const fullOp = yield forge(opOb, counter, metadata.next_protocol);
                if (this._validateLocalForge) {
                    if (fullOp.opbytes === remoteForgedBytes) {
                        return Object.assign(Object.assign({}, fullOp), { counter, chainId: head.chain_id });
                    }
                    throw new Error("Forge validation error - local and remote bytes don't match");
                }
                return Object.assign(Object.assign({}, fullOp), { counter, chainId: head.chain_id });
            }));
        };
        /**
         * @description Simulate an operation
         * @param {Object} paramObject The parameters for the operation
         * @param {Object | Array} paramObject.operation The operation to include in the transaction
         * @returns {Promise} The simulated operation result
         * @example
         * sotez.simulateOperation({
         *   operation: {
         *     kind: 'transaction',
         *     fee: '1420',
         *     gas_limit: '10600',
         *     storage_limit: '300',
         *     amount: '1000',
         *     destination: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
         *   },
         * }).then(result => console.log(result));
         */
        this.simulateOperation = ({ operation, source }) => this.prepareOperation({ operation, source, skipCounter: true }).then((fullOp) => {
            delete fullOp.opOb.protocol;
            fullOp.opOb.signature =
                'edsigtXomBKi5CTRf5cjATJWSyaRvhfYNHqSUGrn4SdbYRcGwQrUGjzEfQDTuqHhuA8b2d8NarZjz8TRf65WkpQmo423BtomS8Q';
            return this.query(`/chains/${this.chain}/blocks/head/helpers/scripts/run_operation`, {
                chain_id: fullOp.chainId,
                operation: fullOp.opOb,
            });
        });
        /**
         * @description Send an operation
         * @param {Object} paramObject The parameters for the operation
         * @param {Object|Array} paramObject.operation The operation to include in the transaction
         * @param {string} [paramObject.source] The source address of the operation
         * @param {boolean} [paramObject.skipSignature=false] Use default signature for specific transactions
         * @param {boolean} [paramObject.skipPrevalidation=false] Skip prevalidation before injecting operation
         * @returns {Promise} Object containing the injected operation hash
         * @example
         * const operation = {
         *   kind: 'transaction',
         *   fee: '1420',
         *   gas_limit: '10600',
         *   storage_limit: '300',
         *   amount: '1000',
         *   destination: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
         * };
         *
         * sotez.sendOperation({ operation }).then(result => console.log(result));
         *
         * sotez.sendOperation({ operation: [operation, operation] }).then(result => console.log(result));
         */
        this.sendOperation = ({ operation, source, skipPrevalidation = false, skipSignature = false, }) => __awaiter(this, void 0, void 0, function* () {
            const fullOp = yield this.prepareOperation({
                operation,
                source,
            });
            if (skipSignature) {
                fullOp.opbytes +=
                    '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
                fullOp.opOb.signature =
                    'edsigtXomBKi5CTRf5cjATJWSyaRvhfYNHqSUGrn4SdbYRcGwQrUGjzEfQDTuqHhuA8b2d8NarZjz8TRf65WkpQmo423BtomS8Q';
            }
            else {
                const signed = yield this.key.sign(fullOp.opbytes, magicBytes.generic);
                fullOp.opbytes = signed.sbytes;
                fullOp.opOb.signature = signed.prefixSig;
            }
            const publicKeyHash = source || this.key.publicKeyHash();
            if (skipPrevalidation) {
                return this.silentInject(fullOp.opbytes).catch((e) => {
                    this._counters[publicKeyHash] = fullOp.counter;
                    throw e;
                });
            }
            return this.inject(fullOp.opOb, fullOp.opbytes).catch((e) => {
                this._counters[publicKeyHash] = fullOp.counter;
                throw e;
            });
        });
        /**
         * @description Inject an operation
         * @param {Object} opOb The operation object
         * @param {string} sopbytes The signed operation bytes
         * @returns {Promise} Object containing the injected operation hash
         */
        this.inject = (opOb, sopbytes) => {
            const opResponse = [];
            let errors = [];
            return this.query(`/chains/${this.chain}/blocks/head/helpers/preapply/operations`, [opOb])
                .then((f) => {
                if (!Array.isArray(f)) {
                    throw new Error('RPC Fail');
                }
                for (let i = 0; i < f.length; i++) {
                    for (let j = 0; j < f[i].contents.length; j++) {
                        opResponse.push(f[i].contents[j]);
                        if (typeof f[i].contents[j].metadata.operation_result !==
                            'undefined' &&
                            f[i].contents[j].metadata.operation_result.status === 'failed') {
                            errors = errors.concat(f[i].contents[j].metadata.operation_result.errors);
                        }
                    }
                }
                if (errors.length) {
                    throw new Error(JSON.stringify({ error: 'Operation Failed', errors }, null, 2));
                }
                return this.query('/injection/operation', sopbytes);
            })
                .then((hash) => ({
                hash,
                operations: opResponse,
            }));
        };
        /**
         * @description Inject an operation without prevalidation
         * @param {string} sopbytes The signed operation bytes
         * @returns {Promise} Object containing the injected operation hash
         */
        this.silentInject = (sopbytes) => this.query('/injection/operation', sopbytes).then((hash) => ({
            hash,
        }));
        /**
         * @description Transfer operation
         * @param {Object} paramObject The parameters for the operation
         * @param {string} paramObject.to The address of the recipient
         * @param {number} paramObject.amount The amount in tez to transfer for the initial balance
         * @param {string} [paramObject.source] The source address of the transfer
         * @param {number} [paramObject.fee=1420] The fee to set for the transaction
         * @param {string} [paramObject.parameters] The parameter for the transaction
         * @param {number} [paramObject.gasLimit=10600] The gas limit to set for the transaction
         * @param {number} [paramObject.storageLimit=300] The storage limit to set for the transaction
         * @returns {Promise} Object containing the injected operation hash
         * @example
         * sotez.transfer({
         *   to: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
         *   amount: '1000000',
         *   fee: '1420',
         * }).then(result => console.log(result));
         */
        this.transfer = ({ to, amount, source, fee = this.defaultFee, parameters, gasLimit = 10600, storageLimit = 300, }) => {
            const operation = {
                kind: 'transaction',
                fee,
                gas_limit: gasLimit,
                storage_limit: storageLimit,
                amount: this.useMutez ? amount : mutez(amount),
                destination: to,
            };
            if (parameters) {
                if (typeof parameters === 'string') {
                    operation.parameters = sexp2mic(parameters);
                }
                else {
                    operation.parameters = parameters;
                }
            }
            return this.sendOperation({
                operation: [operation],
                source,
            });
        };
        /**
         * @description Activate an account
         * @param {Object} pkh The public key hash of the account
         * @param {string} secret The secret to activate the account
         * @returns {Promise} Object containing the injected operation hash
         * @example
         * sotez.activate(pkh, secret)
         *   .then((activateOperation) => console.log(activateOperation));
         */
        this.activate = (pkh, secret) => {
            const operation = {
                kind: 'activate_account',
                pkh,
                secret,
            };
            return this.sendOperation({
                operation: [operation],
                source: pkh,
                skipSignature: true,
            });
        };
        /**
         * @description Originate a new contract
         * @param {Object} paramObject The parameters for the operation
         * @param {number} paramObject.balance The amount in tez to transfer for the initial balance
         * @param {string | Micheline} paramObject.code The code to deploy for the contract
         * @param {string | Micheline} paramObject.init The initial storage of the contract
         * @param {boolean} [paramObject.spendable=false] Whether the keyholder can spend the balance from the new account
         * @param {boolean} [paramObject.delegatable=false] Whether the new account is delegatable
         * @param {string} [paramObject.delegate] The delegate for the new account
         * @param {number} [paramObject.fee=1420] The fee to set for the transaction
         * @param {number} [paramObject.gasLimit=10600] The gas limit to set for the transaction
         * @param {number} [paramObject.storageLimit=257] The storage limit to set for the transaction
         * @returns {Promise} Object containing the injected operation hash
         */
        this.originate = ({ balance, code, init, spendable = false, delegatable = false, delegate, fee = this.defaultFee, gasLimit = 10600, storageLimit = 257, }) => __awaiter(this, void 0, void 0, function* () {
            let _code;
            let _init;
            if (typeof code === 'string') {
                _code = ml2mic(code);
            }
            else {
                _code = code;
            }
            if (typeof init === 'string') {
                _init = sexp2mic(init);
            }
            else {
                _init = init;
            }
            const script = {
                code: _code,
                storage: _init,
            };
            const publicKeyHash = this.key.publicKeyHash();
            const operation = {
                kind: 'origination',
                fee,
                gas_limit: gasLimit,
                storage_limit: storageLimit,
                balance: this.useMutez ? balance : mutez(balance),
                manager_pubkey: publicKeyHash,
                spendable,
                delegatable,
                script,
            };
            if (delegate) {
                operation.delegate = delegate;
            }
            return this.sendOperation({ operation: [operation] });
        });
        /**
         * @description Set a delegate for an account
         * @param {Object} paramObject The parameters for the operation
         * @param {string} [paramObject.delegate] The delegate for the new account
         * @param {number} [paramObject.fee=1420] The fee to set for the transaction
         * @param {number} [paramObject.gasLimit=10600] The gas limit to set for the transaction
         * @param {number} [paramObject.storageLimit=0] The storage limit to set for the transaction
         * @returns {Promise} Object containing the injected operation hash
         */
        this.setDelegate = ({ delegate, source = this.key.publicKeyHash(), fee = this.defaultFee, gasLimit = 10600, storageLimit = 0, }) => __awaiter(this, void 0, void 0, function* () {
            const operation = {
                kind: 'delegation',
                source,
                fee,
                gas_limit: gasLimit,
                storage_limit: storageLimit,
                delegate,
            };
            return this.sendOperation({
                operation: [operation],
                source,
            });
        });
        /**
         * @description Register an account as a delegate
         * @param {Object} paramObject The parameters for the operation
         * @param {number} [paramObject.fee=1420] The fee to set for the transaction
         * @param {number} [paramObject.gasLimit=10600] The gas limit to set for the transaction
         * @param {number} [paramObject.storageLimit=0] The storage limit to set for the transaction
         * @returns {Promise} Object containing the injected operation hash
         */
        this.registerDelegate = ({ fee = this.defaultFee, gasLimit = 10600, storageLimit = 0, } = {}) => __awaiter(this, void 0, void 0, function* () {
            const operation = {
                kind: 'delegation',
                fee,
                gas_limit: gasLimit,
                storage_limit: storageLimit,
                delegate: this.key.publicKeyHash(),
            };
            return this.sendOperation({ operation: [operation] });
        });
        /**
         * @description Typechecks the provided code
         * @param {string | Micheline} code The code to typecheck
         * @param {number} gas The the gas limit
         * @returns {Promise} Typecheck result
         */
        this.typecheckCode = (code, gas = 10000) => {
            let _code = code;
            if (typeof code === 'string') {
                _code = ml2mic(code);
            }
            return this.query(`/chains/${this.chain}/blocks/head/helpers/scripts/typecheck_code`, {
                program: _code,
                gas,
            });
        };
        /**
         * @description Serializes a piece of data to a binary representation
         * @param {string | Micheline} data
         * @param {string | Micheline} type
         * @returns {Promise} Serialized data
         */
        this.packData = (data, type) => {
            let _data = data;
            let _type = type;
            if (typeof data === 'string') {
                _data = sexp2mic(data);
            }
            if (typeof type === 'string') {
                _type = sexp2mic(type);
            }
            const check = {
                data: _data,
                type: _type,
                gas: '4000000',
            };
            return this.query(`/chains/${this.chain}/blocks/head/helpers/scripts/pack_data`, check);
        };
        /**
         * @description Typechecks data against a type
         * @param {string | Micheline} data
         * @param {string | Micheline} type
         * @returns {Promise} Typecheck result
         */
        this.typecheckData = (data, type) => {
            let _data = data;
            let _type = type;
            if (typeof data === 'string') {
                _data = sexp2mic(data);
            }
            if (typeof type === 'string') {
                _type = sexp2mic(type);
            }
            const check = {
                data: _data,
                type: _type,
                gas: '4000000',
            };
            return this.query(`/chains/${this.chain}/blocks/head/helpers/scripts/typecheck_data`, check);
        };
        /**
         * @description Runs or traces code against an input and storage
         * @param {string | Micheline} code Code to run
         * @param {number} amount Amount in tez to send
         * @param {string | Micheline} input Input to run though code
         * @param {string | Micheline} storage State of storage
         * @param {boolean} [trace=false] Whether to trace
         * @returns {Promise} Run results
         */
        this.runCode = (code, amount, input, storage, trace = false) => {
            const ep = trace ? 'trace_code' : 'run_code';
            let _code = code;
            let _input = input;
            let _storage = storage;
            if (typeof code === 'string') {
                _code = sexp2mic(code);
            }
            if (typeof input === 'string') {
                _input = sexp2mic(input);
            }
            if (typeof storage === 'string') {
                _storage = sexp2mic(storage);
            }
            return this.query(`/chains/${this.chain}/blocks/head/helpers/scripts/${ep}`, {
                script: _code,
                amount: this.useMutez ? `${amount}` : `${mutez(amount)}`,
                input: _input,
                storage: _storage,
            });
        };
        /**
         * Get the mananger key from the protocol dependent query
         * @param {Object|string} manager The manager key query response
         * @param {string} protocol The protocol of the current block
         * @returns {string} If manager exists, returns the manager key
         */
        this.getManagerKey = (manager, protocol) => {
            if (!manager) {
                return null;
            }
            const protocolMap = {
                [`${protocols['001']}`]: manager.key,
                [`${protocols['002']}`]: manager.key,
                [`${protocols['003']}`]: manager.key,
                [`${protocols['004']}`]: manager.key,
                [`${protocols['005a']}`]: manager,
                [`${protocols['005']}`]: manager,
                [`${protocols['006']}`]: manager,
                [`${protocols['007a']}`]: manager,
                [`${protocols['007']}`]: manager,
            };
            if (!protocolMap[protocol]) {
                throw new Error(`Unrecognized protocol: ${protocol}`);
            }
            return protocolMap[protocol];
        };
        /**
         * Conforms the operation to a specific protocol
         * @param {Object} constructedOp The operation object
         * @param {string} nextProtocol The next protocol of the current block
         * @returns {string} The protocol specific operation
         */
        this._conformOperation = (constructedOp, nextProtocol) => {
            const constructOp001 = (op) => op;
            const constructOp005 = (op) => {
                delete op.manager_pubkey;
                delete op.spendable;
                delete op.delegatable;
                return op;
            };
            const protocolMap = {
                [`${protocols['001']}`]: constructOp001,
                [`${protocols['002']}`]: constructOp001,
                [`${protocols['003']}`]: constructOp001,
                [`${protocols['004']}`]: constructOp001,
                [`${protocols['005a']}`]: constructOp005,
                [`${protocols['005']}`]: constructOp005,
                [`${protocols['006']}`]: constructOp005,
                [`${protocols['007a']}`]: constructOp005,
                [`${protocols['007']}`]: constructOp005,
            };
            return protocolMap[nextProtocol](constructedOp);
        };
        /**
         * Looks up a contract and returns an initialized contract
         * @param {Object} address The contract address
         * @returns {Promise} An initialized contract class
         * @example
         * // Load contract
         * const contract = await sotez.loadContract('KT1MKm4ynxPSzRjw26jPSJbaMFTqTc4dVPdK');
         * // List defined contract methods
         * const { methods } = contract;
         * // Retrieve contract storage
         * const storage = contract.storage();
         * // Get big map keys
         * await storage.ledger.get('tz1P1n8LvweoarK3DTPSnAHtiGVRujhvR2vk');
         * // Determine method schema
         * await contract.methods.transfer('tz1P1n8LvweoarK3DTPSnAHtiGVRujhvR2vk', 100).schema();
         * // Send contract operation
         * await contract.methods.transfer('tz1P1n8LvweoarK3DTPSnAHtiGVRujhvR2vk', 100).send({
         *   fee: '100000',
         *   gasLimit: '800000',
         *   storageLimit: '60000',
         * });
         */
        this.loadContract = (address) => __awaiter(this, void 0, void 0, function* () {
            const contract = new Contract(this, address);
            yield contract.loaded;
            return contract;
        });
        this._defaultFee = options.defaultFee || 1420;
        this._localForge = options.localForge !== false;
        this._validateLocalForge = options.validateLocalForge || false;
        this._debugMode = options.debugMode || false;
        this._useMutez = options.useMutez !== false;
        this._counters = {};
    }
    get defaultFee() {
        return this._defaultFee;
    }
    set defaultFee(fee) {
        this._defaultFee = fee;
    }
    get localForge() {
        return this._localForge;
    }
    set localForge(value) {
        this._localForge = value;
    }
    get validateLocalForge() {
        return this._validateLocalForge;
    }
    set validateLocalForge(value) {
        this._validateLocalForge = value;
    }
    get counters() {
        return this._counters;
    }
    set counters(counters) {
        this._counters = counters;
    }
    get debugMode() {
        return this._debugMode;
    }
    set debugMode(t) {
        this._debugMode = t;
    }
    get useMutez() {
        return this._useMutez;
    }
    set useMutez(t) {
        this._useMutez = t;
    }
    setProvider(provider, chain = this.chain) {
        super.setProvider(provider, chain);
        this.provider = provider;
        this.chain = chain;
    }
}
