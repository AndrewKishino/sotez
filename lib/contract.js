"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractMethod = exports.Contract = void 0;
var michelson_encoder_1 = require("@taquito/michelson-encoder");
var bignumber_js_1 = require("bignumber.js");
var utility_1 = require("./utility");
var DEFAULT_SMART_CONTRACT_METHOD_NAME = 'default';
var InvalidParameterError = /** @class */ (function (_super) {
    __extends(InvalidParameterError, _super);
    function InvalidParameterError(smartContractMethodName, sigs, args) {
        var _this = _super.call(this, smartContractMethodName + " Received " + args.length + " arguments while expecting one of the follow signatures (" + JSON.stringify(sigs) + ")") || this;
        _this.smartContractMethodName = smartContractMethodName;
        _this.sigs = sigs;
        _this.args = args;
        _this.name = 'Invalid parameters error';
        return _this;
    }
    return InvalidParameterError;
}(Error));
var BigMapAbstraction = /** @class */ (function () {
    function BigMapAbstraction(id, schema, client) {
        this.id = id;
        this.schema = schema;
        this.client = client;
    }
    BigMapAbstraction.prototype.get = function (keyToEncode) {
        return __awaiter(this, void 0, void 0, function () {
            var encoded, packed, encodedExpr, bigMapValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        encoded = this.schema.EncodeBigMapKey(keyToEncode);
                        return [4 /*yield*/, this.client.packData(encoded.key, encoded.type)];
                    case 1:
                        packed = (_a.sent()).packed;
                        encodedExpr = utility_1.encodeExpr(packed);
                        return [4 /*yield*/, this.client.query("/chains/" + this.client.chain + "/blocks/head/context/big_maps/" + this.id.toString() + "/" + encodedExpr)];
                    case 2:
                        bigMapValue = _a.sent();
                        return [2 /*return*/, this.schema.ExecuteOnBigMapValue(bigMapValue, smartContractAbstractionSemantic(this.client))];
                }
            });
        });
    };
    return BigMapAbstraction;
}());
var smartContractAbstractionSemantic = function (client) { return ({
    // Provide a specific abstraction for BigMaps
    big_map: function (val, code) {
        if (!val || !('int' in val) || val.int === undefined) {
            // Return an empty object in case of missing big map ID
            return {};
        }
        var schema = new michelson_encoder_1.Schema(code);
        return new BigMapAbstraction(new bignumber_js_1.BigNumber(val.int), schema, client);
    },
}); };
/**
 * @description Creates an initialized contract class abstraction
 * @class Contract
 * @param {Object} client Initialized Sotez client
 * @param {string} address Contract address
 * @example
 * const contract = new Contract(sotez, 'KT1MKm4ynxPSzRjw26jPSJbaMFTqTc4dVPdK');
 */
var Contract = /** @class */ (function () {
    function Contract(client, address) {
        var _this = this;
        this.client = client;
        this.address = address;
        this.methods = {};
        this._init = function (address) { return __awaiter(_this, void 0, void 0, function () {
            var contractPromises, _a, script, entrypoints;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        contractPromises = [];
                        contractPromises.push(this.client.query("/chains/" + this.client.chain + "/blocks/head/context/contracts/" + this.address));
                        contractPromises.push(this.client.query("/chains/" + this.client.chain + "/blocks/head/context/contracts/" + this.address + "/entrypoints"));
                        return [4 /*yield*/, Promise.all(contractPromises)];
                    case 1:
                        _a = _b.sent(), script = _a[0].script, entrypoints = _a[1].entrypoints;
                        this.schema = michelson_encoder_1.Schema.fromRPCResponse({ script: script });
                        this.parameterSchema = michelson_encoder_1.ParameterSchema.fromRPCResponse({ script: script });
                        this.entrypoints = entrypoints;
                        this._initializeMethods(address, this.parameterSchema, this.entrypoints);
                        return [2 /*return*/, true];
                }
            });
        }); };
        this._initializeMethods = function (address, parameterSchema, entrypoints) {
            _this.methods = {};
            var keys = Object.keys(entrypoints);
            if (parameterSchema.isMultipleEntryPoint) {
                keys.forEach(function (smartContractMethodName) {
                    var method = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        var smartContractMethodSchema = new michelson_encoder_1.ParameterSchema(entrypoints[smartContractMethodName]);
                        validateArgs(args, smartContractMethodSchema, smartContractMethodName);
                        return new ContractMethod(_this.client, address, smartContractMethodSchema, smartContractMethodName, args);
                    };
                    _this.methods[smartContractMethodName] = method;
                });
                // Deal with methods with no annotations which were not discovered by the RPC endpoint
                // Methods with no annotations are discovered using parameter schema
                var anonymousMethods = Object.keys(parameterSchema.ExtractSchema()).filter(function (key) { return Object.keys(entrypoints).indexOf(key) === -1; });
                anonymousMethods.forEach(function (smartContractMethodName) {
                    var method = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        validateArgs(__spreadArrays([smartContractMethodName], args), parameterSchema, smartContractMethodName);
                        return new ContractMethod(_this.client, address, parameterSchema, smartContractMethodName, args, false, true);
                    };
                    _this.methods[smartContractMethodName] = method;
                });
            }
            else {
                var smartContractMethodSchema_1 = parameterSchema;
                var method = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    validateArgs(args, parameterSchema, DEFAULT_SMART_CONTRACT_METHOD_NAME);
                    return new ContractMethod(_this.client, address, smartContractMethodSchema_1, DEFAULT_SMART_CONTRACT_METHOD_NAME, args, false);
                };
                _this.methods[DEFAULT_SMART_CONTRACT_METHOD_NAME] = method;
            }
        };
        /**
         * @description Return a friendly representation of the smart contract storage
         * @returns {Promise} The contract storage
         */
        this.storage = function () { return __awaiter(_this, void 0, void 0, function () {
            var contractStorage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loaded];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.client.query("/chains/" + this.client.chain + "/blocks/head/context/contracts/" + this.address + "/storage")];
                    case 2:
                        contractStorage = _a.sent();
                        return [2 /*return*/, this.schema.Execute(contractStorage, smartContractAbstractionSemantic(this.client))];
                }
            });
        }); };
        /**
         * @description Return the contract balance
         * @returns {Promise<string>} The contract balance
         */
        this.balance = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loaded];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.client.query("/chains/" + this.client.chain + "/blocks/head/context/contracts/" + this.address + "/balance")];
                }
            });
        }); };
        this.loaded = this._init(address);
    }
    return Contract;
}());
exports.Contract = Contract;
var validateArgs = function (args, schema, name) {
    var sigs = schema.ExtractSignatures();
    if (!sigs.find(function (x) { return x.length === args.length; })) {
        throw new InvalidParameterError(name, sigs, args);
    }
};
/**
 * @description Utility class to send smart contract operation
 */
var ContractMethod = /** @class */ (function () {
    function ContractMethod(client, address, parameterSchema, name, args, isMultipleEntrypoint, isAnonymous) {
        if (isMultipleEntrypoint === void 0) { isMultipleEntrypoint = true; }
        if (isAnonymous === void 0) { isAnonymous = false; }
        this.client = client;
        this.address = address;
        this.parameterSchema = parameterSchema;
        this.name = name;
        this.args = args;
        this.isMultipleEntrypoint = isMultipleEntrypoint;
        this.isAnonymous = isAnonymous;
    }
    Object.defineProperty(ContractMethod.prototype, "schema", {
        /**
         * @description Get the schema of the smart contract method
         * @returns {any} The contract schema
         */
        get: function () {
            return this.isAnonymous
                ? this.parameterSchema.ExtractSchema()[this.name]
                : this.parameterSchema.ExtractSchema();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @description Send the smart contract operation
     * @param {Partial<SendParams>} params generic operation parameter
     * @returns {Promise} The operation hash of the transfer
     */
    ContractMethod.prototype.send = function (params) {
        if (params === void 0) { params = {}; }
        return this.client.transfer(this.toTransferParams(params));
    };
    ContractMethod.prototype.toTransferParams = function (_a) {
        var _b, _c;
        var _d = _a === void 0 ? {} : _a, fee = _d.fee, gasLimit = _d.gasLimit, storageLimit = _d.storageLimit, _e = _d.amount, amount = _e === void 0 ? 0 : _e;
        return {
            to: this.address,
            amount: amount,
            fee: fee,
            gasLimit: gasLimit,
            storageLimit: storageLimit,
            parameters: {
                entrypoint: this.isMultipleEntrypoint
                    ? this.name
                    : DEFAULT_SMART_CONTRACT_METHOD_NAME,
                value: this.isAnonymous
                    ? (_b = this.parameterSchema).Encode.apply(_b, __spreadArrays([this.name], this.args)) : (_c = this.parameterSchema).Encode.apply(_c, this.args),
            },
        };
    };
    return ContractMethod;
}());
exports.ContractMethod = ContractMethod;
