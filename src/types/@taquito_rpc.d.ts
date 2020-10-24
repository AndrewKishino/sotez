declare module '@taquito/rpc' {
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
  type MichelsonV1Expression = Micheline;
  type ScriptResponse = {
    code: MichelineArray;
    storage: Micheline;
  };
}
