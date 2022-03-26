declare module '@taquito/rpc' {
  type Micheline =
    | {
        entrypoint: string;
        value:
          | {
              prim: string;
              args?: Micheline[];
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
          | Micheline[];
      }
    | {
        prim: string;
        args?: Micheline[];
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
    | Micheline[];

  type MichelsonV1Expression = Micheline;
  type MichelsonV1ExpressionExtended = {
    prim: string;
    args?: Micheline[];
    annots?: string[];
  };
  type ScriptResponse = {
    code: Micheline[];
    storage: Micheline;
  };
}
