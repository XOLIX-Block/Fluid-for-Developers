# Custom Sovereign Wallet Engineering Guide

> [!WARNING]
> **Status note**: For broadcasting, use the standard eth_sendRawTransaction method on https://rpc.xolix.io. The xol_broadcastRawTransaction call and the native-path derivation shown are illustrative; the shipped wallet derives EVM keys on the standard EVM path.

This manual guides wallet vendors, dApp engineers, and hardware wallet developers on building a sovereign non-custodial wallet for **XOLIX FLUID** from scratch in JavaScript / TypeScript.

---

## 1. Cryptographic Specifications

* **Seed Format**: BIP-39 Mnemonic (12 or 24 words, PBKDF2 with HMAC-SHA512).
* **HD Derivation Paths**:
  * **Native Bech32m Lane**: `m/44'/44990'/0'/0/i` (Mainnet) | `m/44'/44991'/0'/0/i` (Testnet)
  * **EVM Hex Lane**: `m/44'/60'/0'/0/i`
* **Elliptic Curves**:
  * `secp256k1` (standard EVM & Native User signatures)
  * `BLS12-381` / `Ed25519` (Consensus validator signatures)
* **Address Encodings**:
  * `xol1...`: Native Bech32m address (32-byte hash)
  * `0x...`: Standard EVM address (20-byte hash)

---

## 2. Complete Custom Wallet Implementation

Install required cryptographic primitives:
```bash
npm install bip39 @scure/bip32 @noble/curves @noble/hashes bech32
```

`XolixCustomWallet.ts`:

```typescript
// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.

import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { HDKey } from '@scure/bip32';
import { secp256k1 } from '@noble/curves/secp256k1';
import { bech32m } from 'bech32';
import { sha256 } from '@noble/hashes/sha256';

export class XolixCustomWallet {
  private privateKey: Uint8Array;
  public nativeAddress: string; // xol1...
  public evmAddress: string;    // 0x...

  constructor(mnemonic?: string) {
    const validMnemonic = mnemonic || generateMnemonic(256); // 24-word default
    const seed = mnemonicToSeedSync(validMnemonic);
    const rootKey = HDKey.fromMasterSeed(seed);

    // Derive Native Path m/44'/44990'/0'/0/0
    const childKey = rootKey.derive("m/44'/44990'/0'/0/0");
    if (!childKey.privateKey) throw new Error("Failed to derive private key from seed");

    this.privateKey = childKey.privateKey;
    const publicKey = secp256k1.getPublicKey(this.privateKey, true); // 33-byte compressed

    // 1. Calculate Bech32m Native Address (xol1...)
    const pubKeyHash = sha256(publicKey).slice(0, 20);
    const words = bech32m.toWords(pubKeyHash);
    this.nativeAddress = bech32m.encode('xol', words);

    // 2. Calculate EVM Hex Address (0x...)
    this.evmAddress = '0x' + Buffer.from(pubKeyHash).toString('hex');
  }

  /**
   * Signs a native XOLIX transaction with Genesis Replay Shield (XRAS)
   */
  public async signNativeTransaction(tx: {
    to: string;
    amount: string;
    nonce: number;
    chainId: number;
    genesisHash: string;
  }): Promise<{ payload: string; signature: string; publicKey: string }> {
    const payload = JSON.stringify({
      from: this.nativeAddress,
      to: tx.to,
      amount: tx.amount,
      nonce: tx.nonce,
      chainId: tx.chainId,
      genesisHash: tx.genesisHash, // Binds signature to canonical genesis root
    });

    const msgHash = sha256(Buffer.from(payload));
    const signature = secp256k1.sign(msgHash, this.privateKey);

    return {
      payload,
      signature: signature.toCompactHex(),
      publicKey: Buffer.from(secp256k1.getPublicKey(this.privateKey, true)).toString('hex'),
    };
  }
}
```

---

## 3. Broadcasting Native Transactions to RPC

```typescript
async function broadcast(signedTx: { payload: string; signature: string; publicKey: string }) {
  const response = await fetch("https://rpc.xolix.io", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "xol_broadcastRawTransaction",
      params: [signedTx],
      id: 1,
    }),
  });

  const result = await response.json();
  console.log("Transaction broadcasted successfully! Tx Hash:", result.result);
}
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
