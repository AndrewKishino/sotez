import { ParameterSchema, Schema } from '@taquito/michelson-encoder';

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
declare type Micheline =
  | {
      entrypoint: string;
      value:
        | {
            prim: string;
            args?: MichelineArray;
            annots?: string[];
          }
        | {
            bytes: string;
          }
        | {
            int: string;
          }
        | {
            string: string;
          }
        | {
            address: string;
          }
        | {
            contract: string;
          }
        | {
            key: string;
          }
        | {
            key_hash: string;
          }
        | {
            signature: string;
          }
        | MichelineArray;
    }
  | {
      prim: string;
      args?: MichelineArray;
      annots?: string[];
    }
  | {
      bytes: string;
    }
  | {
      int: string;
    }
  | {
      string: string;
    }
  | {
      address: string;
    }
  | {
      contract: string;
    }
  | {
      key: string;
    }
  | {
      key_hash: string;
    }
  | {
      signature: string;
    }
  | MichelineArray;
declare type MichelineArray = Array<Micheline>;
interface SendParams {
  fee?: number;
  storageLimit?: number;
  gasLimit?: number;
  amount?: number;
}
/**
 * @description Creates an initialized contract class abstraction
 * @class Contract
 * @param {Object} client Initialized Sotez client
 * @param {string} address Contract address
 * @example
 * const contract = new Contract(sotez, 'KT1MKm4ynxPSzRjw26jPSJbaMFTqTc4dVPdK');
 */
export declare class Contract {
  client: any;

  readonly address: string;

  methods: {
    [key: string]: (...args: any[]) => ContractMethod;
  };

  schema: Schema;

  parameterSchema: ParameterSchema;

  entrypoints: any;

  loaded: Promise<boolean>;

  constructor(client: any, address: string);
  _init: (address: string) => Promise<boolean>;

  _initializeMethods: (
    address: string,
    parameterSchema: ParameterSchema,
    entrypoints: any,
  ) => void;

  /**
   * @description Return a friendly representation of the smart contract storage
   * @returns {Promise} The contract storage
   */
  storage: () => Promise<any>;

  /**
   * @description Return the contract balance
   * @returns {Promise<string>} The contract balance
   */
  balance: () => Promise<string>;
}
/**
 * @description Utility class to send smart contract operation
 */
export declare class ContractMethod {
  private client;

  private address;

  private parameterSchema;

  private name;

  private args;

  private isMultipleEntrypoint;

  private isAnonymous;
  constructor(
    client: any,
    address: string,
    parameterSchema: ParameterSchema,
    name: string,
    args: any[],
    isMultipleEntrypoint?: boolean,
    isAnonymous?: boolean,
  );
  /**
   * @description Get the schema of the smart contract method
   * @returns {any} The contract schema
   */
  get schema(): any;
  /**
   * @description Send the smart contract operation
   * @param {Partial<SendParams>} params generic operation parameter
   * @returns {Promise} The operation hash of the transfer
   */
  send(params?: Partial<SendParams>): Promise<any>;
  toTransferParams({
    fee,
    gasLimit,
    storageLimit,
    amount,
  }?: Partial<SendParams>): RpcParams;
}
export {};
