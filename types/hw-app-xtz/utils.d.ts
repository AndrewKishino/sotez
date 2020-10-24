/// <reference types="node" />
/**
 * @description Split path utility
 * @param {string} path The ledger path
 * @returns {number[]} Array of path segments
 */
export declare function splitPath(path: string): number[];
export declare const encodePublicKey: (
  publicKey: Buffer,
  curve: number,
) => {
  publicKey: any;
  address: any;
};
