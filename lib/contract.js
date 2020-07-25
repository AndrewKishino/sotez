var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* eslint-disable max-classes-per-file */
import { ParameterSchema, Schema } from '@taquito/michelson-encoder';
import { BigNumber } from 'bignumber.js';
import { encodeExpr } from './utility';
const DEFAULT_SMART_CONTRACT_METHOD_NAME = 'default';
class InvalidParameterError extends Error {
    constructor(smartContractMethodName, sigs, args) {
        super(`${smartContractMethodName} Received ${args.length} arguments while expecting one of the follow signatures (${JSON.stringify(sigs)})`);
        this.smartContractMethodName = smartContractMethodName;
        this.sigs = sigs;
        this.args = args;
        this.name = 'Invalid parameters error';
    }
}
class BigMapAbstraction {
    constructor(id, schema, client) {
        this.id = id;
        this.schema = schema;
        this.client = client;
    }
    get(keyToEncode) {
        return __awaiter(this, void 0, void 0, function* () {
            const encoded = this.schema.EncodeBigMapKey(keyToEncode);
            const { packed } = yield this.client.packData(encoded.key, encoded.type);
            const encodedExpr = encodeExpr(packed);
            const bigMapValue = yield this.client.query(`/chains/${this.client.chain}/blocks/head/context/big_maps/${this.id.toString()}/${encodedExpr}`);
            return this.schema.ExecuteOnBigMapValue(bigMapValue, smartContractAbstractionSemantic(this.client));
        });
    }
}
const smartContractAbstractionSemantic = (client) => ({
    // Provide a specific abstraction for BigMaps
    big_map: (val, code) => {
        if (!val || !('int' in val) || val.int === undefined) {
            // Return an empty object in case of missing big map ID
            return {};
        }
        const schema = new Schema(code);
        return new BigMapAbstraction(new BigNumber(val.int), schema, client);
    },
});
/**
 * Creates an initialized contract class abstraction
 * @class Contract
 * @param {Object} client Initialized Sotez client
 * @param {string} address Contract address
 * @example
 * const contract = new Contract(sotez, 'KT1MKm4ynxPSzRjw26jPSJbaMFTqTc4dVPdK');
 */
export class Contract {
    constructor(client, address) {
        this.client = client;
        this.address = address;
        this.methods = {};
        this._init = (address) => __awaiter(this, void 0, void 0, function* () {
            const contractPromises = [];
            contractPromises.push(this.client.query(`/chains/${this.client.chain}/blocks/head/context/contracts/${this.address}`));
            contractPromises.push(this.client.query(`/chains/${this.client.chain}/blocks/head/context/contracts/${this.address}/entrypoints`));
            const [{ script }, { entrypoints }] = yield Promise.all(contractPromises);
            this.schema = Schema.fromRPCResponse({ script });
            this.parameterSchema = ParameterSchema.fromRPCResponse({ script });
            this.entrypoints = entrypoints;
            this._initializeMethods(address, this.parameterSchema, this.entrypoints);
            return true;
        });
        this._initializeMethods = (address, parameterSchema, entrypoints) => {
            this.methods = {};
            const keys = Object.keys(entrypoints);
            if (parameterSchema.isMultipleEntryPoint) {
                keys.forEach((smartContractMethodName) => {
                    const method = (...args) => {
                        const smartContractMethodSchema = new ParameterSchema(entrypoints[smartContractMethodName]);
                        validateArgs(args, smartContractMethodSchema, smartContractMethodName);
                        return new ContractMethod(this.client, address, smartContractMethodSchema, smartContractMethodName, args);
                    };
                    this.methods[smartContractMethodName] = method;
                });
                // Deal with methods with no annotations which were not discovered by the RPC endpoint
                // Methods with no annotations are discovered using parameter schema
                const anonymousMethods = Object.keys(parameterSchema.ExtractSchema()).filter((key) => Object.keys(entrypoints).indexOf(key) === -1);
                anonymousMethods.forEach((smartContractMethodName) => {
                    const method = (...args) => {
                        validateArgs([smartContractMethodName, ...args], parameterSchema, smartContractMethodName);
                        return new ContractMethod(this.client, address, parameterSchema, smartContractMethodName, args, false, true);
                    };
                    this.methods[smartContractMethodName] = method;
                });
            }
            else {
                const smartContractMethodSchema = parameterSchema;
                const method = (...args) => {
                    validateArgs(args, parameterSchema, DEFAULT_SMART_CONTRACT_METHOD_NAME);
                    return new ContractMethod(this.client, address, smartContractMethodSchema, DEFAULT_SMART_CONTRACT_METHOD_NAME, args, false);
                };
                this.methods[DEFAULT_SMART_CONTRACT_METHOD_NAME] = method;
            }
        };
        /**
         * @description Return a friendly representation of the smart contract storage
         */
        this.storage = () => __awaiter(this, void 0, void 0, function* () {
            yield this.loaded;
            const contractStorage = yield this.client.query(`/chains/${this.client.chain}/blocks/head/context/contracts/${this.address}/storage`);
            return this.schema.Execute(contractStorage, smartContractAbstractionSemantic(this.client));
        });
        /**
         * @description Return the contract balance
         */
        this.balance = () => __awaiter(this, void 0, void 0, function* () {
            yield this.loaded;
            return this.client.query(`/chains/${this.client.chain}/blocks/head/context/contracts/${this.address}/balance`);
        });
        this.loaded = this._init(address);
    }
}
const validateArgs = (args, schema, name) => {
    const sigs = schema.ExtractSignatures();
    if (!sigs.find((x) => x.length === args.length)) {
        throw new InvalidParameterError(name, sigs, args);
    }
};
/**
 * @description Utility class to send smart contract operation
 */
export class ContractMethod {
    constructor(client, address, parameterSchema, name, args, isMultipleEntrypoint = true, isAnonymous = false) {
        this.client = client;
        this.address = address;
        this.parameterSchema = parameterSchema;
        this.name = name;
        this.args = args;
        this.isMultipleEntrypoint = isMultipleEntrypoint;
        this.isAnonymous = isAnonymous;
    }
    /**
     * @description Get the schema of the smart contract method
     */
    get schema() {
        return this.isAnonymous
            ? this.parameterSchema.ExtractSchema()[this.name]
            : this.parameterSchema.ExtractSchema();
    }
    /**
     *
     * @description Send the smart contract operation
     * @param Options generic operation parameter
     */
    send(params = {}) {
        return this.client.transfer(this.toTransferParams(params));
    }
    toTransferParams({ fee, gasLimit, storageLimit, amount = 0, } = {}) {
        return {
            to: this.address,
            amount,
            fee,
            gasLimit,
            storageLimit,
            parameters: {
                entrypoint: this.isMultipleEntrypoint
                    ? this.name
                    : DEFAULT_SMART_CONTRACT_METHOD_NAME,
                value: this.isAnonymous
                    ? this.parameterSchema.Encode(this.name, ...this.args)
                    : this.parameterSchema.Encode(...this.args),
            },
        };
    }
}
