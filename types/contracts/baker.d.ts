export declare const BAKER_LAMBDAS: {
    transferImplicit: (key: string, mutez: number | string) => ({
        prim: string;
        args?: undefined;
    } | {
        prim: string;
        args: ({
            prim: string;
            bytes?: undefined;
        } | {
            bytes: string;
            prim?: undefined;
        })[];
    } | {
        prim: string;
        args: ({
            prim: string;
            int?: undefined;
        } | {
            int: string;
            prim?: undefined;
        })[];
    })[];
};
