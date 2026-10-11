// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.

import { ethers } from 'ethers';

const BECH32M_ALPHABET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';

/**
 * Encodes a byte buffer into a Bech32m checksummed string
 */
export function encodeBech32m(prefix: string, bytes: Uint8Array): string {
  // Convert 8-bit bytes to 5-bit groups
  let val = 0;
  let bits = 0;
  const words: number[] = [];
  for (const b of bytes) {
    val = (val << 8) | b;
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      words.push((val >> bits) & 31);
    }
  }
  if (bits > 0) {
    words.push((val << (5 - bits)) & 31);
  }

  // Calculate Bech32m checksum
  const checksum = createBech32mChecksum(prefix, words);
  const combined = words.concat(checksum);
  return prefix + '1' + combined.map((w) => BECH32M_ALPHABET[w]).join('');
}

function polymod(values: number[]): number {
  let chk = 1;
  const GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
  for (const v of values) {
    const b = chk >> 25;
    chk = ((chk & 0x1ffffff) << 5) ^ v;
    for (let i = 0; i < 5; i++) {
      if ((b >> i) & 1) {
        chk ^= GEN[i];
      }
    }
  }
  return chk;
}

function hrpExpand(hrp: string): number[] {
  const ret: number[] = [];
  for (let i = 0; i < hrp.length; i++) {
    ret.push(hrp.charCodeAt(i) >> 5);
  }
  ret.push(0);
  for (let i = 0; i < hrp.length; i++) {
    ret.push(hrp.charCodeAt(i) & 31);
  }
  return ret;
}

function createBech32mChecksum(hrp: string, data: number[]): number[] {
  const BECH32M_CONST = 0x2bc830a3;
  const values = hrpExpand(hrp).concat(data).concat([0, 0, 0, 0, 0, 0]);
  const mod = polymod(values) ^ BECH32M_CONST;
  const ret: number[] = [];
  for (let i = 0; i < 6; i++) {
    ret.push((mod >> (5 * (5 - i))) & 31);
  }
  return ret;
}

export class XolixUtils {
  /**
   * Translates an EVM 0x address into a native Bech32m xol1... address
   */
  static evmToNativeAddress(evmAddress: string, prefix: string = 'xol'): string {
    const clean = evmAddress.toLowerCase().replace(/^0x/, '');
    const bytes = ethers.getBytes('0x' + clean);
    return encodeBech32m(prefix, bytes);
  }

  /**
   * Converts ether/XOLT unit string to atomic wei BigInt
   */
  static parseUnits(amount: string, decimals: number = 18): bigint {
    return ethers.parseUnits(amount, decimals);
  }

  /**
   * Formats atomic wei BigInt into human readable decimal string
   */
  static formatUnits(amount: bigint | string, decimals: number = 18): string {
    return ethers.formatUnits(amount, decimals);
  }

  /**
   * Computes Keccak256 hash
   */
  static keccak256(data: string | Uint8Array): string {
    return ethers.keccak256(typeof data === 'string' ? ethers.toUtf8Bytes(data) : data);
  }

  /**
   * Validates if string is a valid EVM or Bech32m address
   */
  static isValidAddress(address: string): boolean {
    if (ethers.isAddress(address)) return true;
    if (address.startsWith('xol1') && address.length >= 38) return true;
    return false;
  }
}
