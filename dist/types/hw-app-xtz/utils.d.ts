/// <reference types="node" />
interface Defer<T> {
    promise: Promise<T>;
    resolve: (arg: T) => void;
    reject: (arg: any) => void;
}
export declare function defer<T>(): Defer<T>;
export declare function splitPath(path: string): number[];
export declare function eachSeries<A>(arr: A[], fun: (arg: A) => Promise<any>): Promise<any>;
export declare function foreach<T, A>(arr: T[], callback: (arg1: T, arg2: number) => Promise<A>): Promise<A[]>;
export declare function doIf(condition: boolean, callback: () => any | Promise<any>): Promise<void>;
export declare function asyncWhile<T>(predicate: () => boolean, callback: () => Promise<T>): Promise<T[]>;
export declare const encodePublicKey: (publicKey: Buffer, curve: number) => {
    publicKey: any;
    address: any;
};
export {};
