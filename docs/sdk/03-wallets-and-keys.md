# Wallets, Key Derivation & Address Standards

`XolixWallet` is the native signing abstraction for XOLIX. It implements strict cryptographic standards:
- **BIP-39**: 24-word mnemonic seed generation.
- **BIP-44**: Hierarchical deterministic derivation path (`m/44'/60'/0'/0/i`).
- **BIP-350**: Bech32m checksummed address encoding.
- **Quantum-Resistant Stealth Addresses**: One-time disposable recipient addresses (`xol1s...`).

---

## 1. Creating and Restoring Wallets

### A. Generate a New Native Wallet
```typescript
import { XolixWallet, JsonRpcProvider } from '@xolix/sdk';

const provider = new JsonRpcProvider({ url: 'https://rpc.xolix.io' });

// Generates 24-word cryptographically secure mnemonic
const wallet = XolixWallet.createRandom(provider);

console.log('Seed Phrase: ', wallet.mnemonic?.phrase);
console.log('Private Key: ', wallet.privateKey);
```

### B. Restore from Mnemonic Phrase
```typescript
const mnemonic = "abandon abandon abandon ... (24 words)";
const restored = XolixWallet.fromMnemonic(mnemonic, provider);

console.log('Restored Address:', restored.getNativeAddress());
```

### C. Initialize from Raw Private Key
```typescript
const privateKey = "0x0123456789abcdef...";
const directWallet = new XolixWallet(privateKey, provider);
```

---

## 2. Multi-Format Address Derivation

A single `XolixWallet` instance exposes addresses for all supported network contexts:

```typescript
// 1. Native Bech32m Address (Standard for all native transfers)
const nativeAddr = wallet.getNativeAddress();
console.log(nativeAddr); // "xol1q7k50a2g9..."

// 2. Quantum-Resistant Stealth Address (Private transfers)
const stealthAddr = wallet.getStealthAddress();
console.log(stealthAddr); // "xol1sq3f721p..."

// 3. EVM Hex Address (MetaMask & Solidity compatibility)
const evmAddr = wallet.address;
console.log(evmAddr); // "0x4296bA..."
```

---

## 3. Signing Transactions & Messages

### Sign Arbitrary Messages (EIP-191)
```typescript
const signature = await wallet.signMessage("Log in to Xolix DeFi Hub");
console.log('Signature:', signature);
```

### Send Native Coins (XOLT)
```typescript
import { XolixUtils } from '@xolix/sdk';

const tx = await wallet.sendTransaction({
  recipient: 'xol1qrecipient00000000000000000000000000',
  value: XolixUtils.parseXOL('5.5'), // 5.5 XOLT
  resourceLimit: 21000
});

console.log(`Transaction sent! TxHash: ${tx.txHash}`);
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
