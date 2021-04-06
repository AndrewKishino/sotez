import { ParameterSchema, Schema, Semantic } from '@taquito/michelson-encoder';
import { BigNumber } from 'bignumber.js';
import { encodeExpr } from './utility';

interface RpcParams {
  to: string;
  source?: string;
  amount: number;
  init?: string;
  fee?: number;
  parameters?: string | Micheline;
  gasLimit?: number;
  storageLimit?: number;
  spendable?: boolean;
  delegatable?: boolean;
  delegate?: string;
  code?: string;
}

type Micheline =
  | {
      entrypoint: string;
      value:
        | {
            prim: string;
            args?: MichelineArray;
            annots?: string[];
          }
        | { bytes: string }
        | { int: string }
        | { string: string }
        | { address: string }
        | { contract: string }
        | { key: string }
        | { key_hash: string }
        | { signature: string }
        | MichelineArray;
    }
  | {
      prim: string;
      args?: MichelineArray;
      annots?: string[];
    }
  | { bytes: string }
  | { int: string }
  | { string: string }
  | { address: string }
  | { contract: string }
  | { key: string }
  | { key_hash: string }
  | { signature: string }
  | MichelineArray;

type MichelineArray = Array<Micheline>;

interface SendParams {
  fee?: number;
  storageLimit?: number;
  gasLimit?: number;
  amount?: number;
}

const DEFAULT_SMART_CONTRACT_METHOD_NAME = 'default';

class InvalidParameterError extends Error {
  name = 'Invalid parameters error';

  message: string;

  constructor(
    public smartContractMethodName: string,
    public sigs: any[],
    public args: any[],
  ) {
    super(
      `${smartContractMethodName} Received ${
        args.length
      } arguments while expecting one of the follow signatures (${JSON.stringify(
        sigs,
      )})`,
    );
  }
}

class BigMapAbstraction {
  constructor(
    private id: BigNumber,
    private schema: Schema,
    private client: any,
  ) {}

  async get(keyToEncode: string): Promise<any> {
    const encoded = this.schema.EncodeBigMapKey(keyToEncode);
    const { packed } = await this.client.packData(encoded.key, encoded.type);
    const encodedExpr = encodeExpr(packed);
    const bigMapValue = await this.client.query(
      `/chains/${
        this.client.chain
      }/blocks/head/context/big_maps/${this.id.toString()}/${encodedExpr}`,
    );
    return this.schema.ExecuteOnBigMapValue(
      bigMapValue,
      smartContractAbstractionSemantic(this.client),
    );
  }
}

const smartContractAbstractionSemantic: (client: any) => Semantic = (
  client: any,
) => ({
  // Provide a specific abstraction for BigMaps
  big_map: (val: Micheline, code: Micheline): any => {
    if (!val || !('int' in val) || val.int === undefined) {
      // Return an empty object in case of missing big map ID
      return {};
    }
    const schema = new Schema(code);
    return new BigMapAbstraction(new BigNumber(val.int), schema, client);
  },
});

/**
 * @description Creates an initialized contract class abstraction
 * @class Contract
 * @param {Object} client Initialized Sotez client
 * @param {string} address Contract address
 * @example
 * const contract = new Contract(sotez, 'KT1MKm4ynxPSzRjw26jPSJbaMFTqTc4dVPdK');
 */
export class Contract {
  methods: { [key: string]: (...args: any[]) => ContractMethod } = {};

  schema: Schema;

  parameterSchema: ParameterSchema;

  entrypoints: any;

  loaded: Promise<boolean>;

  constructor(public client: any, readonly address: string) {
    this.loaded = this._init(address);
  }

  _init = async (address: string): Promise<boolean> => {
    const contractPromises = [];
    contractPromises.push(
      this.client.query(
        `/chains/${this.client.chain}/blocks/head/context/contracts/${this.address}`,
      ),
    );
    contractPromises.push(
      this.client.query(
        `/chains/${this.client.chain}/blocks/head/context/contracts/${this.address}/entrypoints`,
      ),
    );
    const [{ script }, { entrypoints }] = await Promise.all(contractPromises);
    this.schema = Schema.fromRPCResponse({ script });
    this.parameterSchema = ParameterSchema.fromRPCResponse({ script });
    this.entrypoints = entrypoints;
    this._initializeMethods(address, this.parameterSchema, this.entrypoints);
    return true;
  };

  _initializeMethods = (
    address: string,
    parameterSchema: ParameterSchema,
    entrypoints: any,
  ): void => {
    this.methods = {};
    const keys = Object.keys(entrypoints);
    if (parameterSchema.isMultipleEntryPoint) {
      keys.forEach((smartContractMethodName) => {
        const method = (...args: any[]): ContractMethod => {
          const smartContractMethodSchema = new ParameterSchema(
            entrypoints[smartContractMethodName],
          );

          validateArgs(
            args,
            smartContractMethodSchema,
            smartContractMethodName,
          );

          return new ContractMethod(
            this.client,
            address,
            smartContractMethodSchema,
            smartContractMethodName,
            args,
          );
        };
        this.methods[smartContractMethodName] = method;
      });

      // Deal with methods with no annotations which were not discovered by the RPC endpoint
      // Methods with no annotations are discovered using parameter schema
      const anonymousMethods = Object.keys(
        parameterSchema.ExtractSchema(),
      ).filter((key) => Object.keys(entrypoints).indexOf(key) === -1);

      anonymousMethods.forEach((smartContractMethodName) => {
        const method = (...args: any[]): ContractMethod => {
          validateArgs(
            [smartContractMethodName, ...args],
            parameterSchema,
            smartContractMethodName,
          );

          return new ContractMethod(
            this.client,
            address,
            parameterSchema,
            smartContractMethodName,
            args,
            false,
            true,
          );
        };
        this.methods[smartContractMethodName] = method;
      });
    } else {
      const smartContractMethodSchema = parameterSchema;
      const method = (...args: any[]): ContractMethod => {
        validateArgs(args, parameterSchema, DEFAULT_SMART_CONTRACT_METHOD_NAME);

        return new ContractMethod(
          this.client,
          address,
          smartContractMethodSchema,
          DEFAULT_SMART_CONTRACT_METHOD_NAME,
          args,
          false,
        );
      };
      this.methods[DEFAULT_SMART_CONTRACT_METHOD_NAME] = method;
    }
  };

  /**
   * @description Return a friendly representation of the smart contract storage
   * @returns {Promise} The contract storage
   */
  storage = async (): Promise<any> => {
    await this.loaded;
    const contractStorage = await this.client.query(
      `/chains/${this.client.chain}/blocks/head/context/contracts/${this.address}/storage`,
    );
    return this.schema.Execute(
      contractStorage,
      smartContractAbstractionSemantic(this.client),
    );
  };

  /**
   * @description Return the contract balance
   * @returns {Promise<string>} The contract balance
   */
  balance = async (): Promise<string> => {
    await this.loaded;
    return this.client.query(
      `/chains/${this.client.chain}/blocks/head/context/contracts/${this.address}/balance`,
    );
  };
}

const validateArgs = (
  args: any[],
  schema: ParameterSchema,
  name: string,
): void => {
  const sigs = schema.ExtractSignatures();

  if (!sigs.find((x: any[]) => x.length === args.length)) {
    throw new InvalidParameterError(name, sigs, args);
  }
};

/**
 * @description Utility class to send smart contract operation
 */
export class ContractMethod {
  constructor(
    private client: any,
    private address: string,
    private parameterSchema: ParameterSchema,
    private name: string,
    private args: any[],
    private isMultipleEntrypoint = true,
    private isAnonymous = false,
  ) {}

  /**
   * @description Get the schema of the smart contract method
   * @returns {any} The contract schema
   */
  get schema(): any {
    return this.isAnonymous
      ? this.parameterSchema.ExtractSchema()[this.name]
      : this.parameterSchema.ExtractSchema();
  }

  /**
   * @description Send the smart contract operation
   * @param {Partial<SendParams>} params generic operation parameter
   * @returns {Promise} The operation hash of the transfer
   */
  send(params: Partial<SendParams> = {}): Promise<any> {
    return this.client.transfer(this.toTransferParams(params));
  }

  toTransferParams({
    fee,
    gasLimit,
    storageLimit,
    amount = 0,
  }: Partial<SendParams> = {}): RpcParams {
    return {
      to: this.address,
      amount,
      parameters: {
        entrypoint: this.isMultipleEntrypoint
          ? this.name
          : DEFAULT_SMART_CONTRACT_METHOD_NAME,
        value: this.isAnonymous
          ? this.parameterSchema.Encode(this.name, ...this.args)
          : this.parameterSchema.Encode(...this.args),
      },
      ...(fee ? { fee } : {}),
      ...(gasLimit ? { gasLimit } : {}),
      ...(storageLimit ? { storageLimit } : {}),
    };
  }
}
