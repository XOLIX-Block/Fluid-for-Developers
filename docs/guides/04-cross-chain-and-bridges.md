# Cross-Chain Interoperability & XCAP Protocol

This guide describes how cross-chain asset transfers and arbitrary message passing work on **XOLIX FLUID** using the **XCAP (Cross-Chain Asset Protocol)** and the **Questdrium Light-Client Verifier (QLCV)**.

---

## 1. Overview of XCAP Architecture

Rather than relying on vulnerable centralized multisig bridges, XOLIX FLUID implements native cryptographic light-client verification:

```
[Ethereum / Bitcoin Network]
            │
            ▼ (Block Headers & Merkle Proofs)
[Relayers / Off-Chain Keepers]
            │
            ▼
[Questdrium Light-Client Verifier (QLCV)]
   - Validates External Chain State Roots & Headers
            │
            ▼
[XCAP Bridge Smart Contract]
   - Mints or Unlocks Wrapped/Bridged Assets (e.g. wBTC, wETH)
            │
            ▼
[User / DApp on XOLIX FLUID]
```

---

## 2. Supported External Networks

| Network | External Chain ID | Verification Method | Asset Type |
| :--- | :--- | :--- | :--- |
| **Ethereum Mainnet** | `1` | Sync Committee / State Trie Light-Client | ERC-20 / ETH |
| **Bitcoin Mainnet** | `N/A (UTXO)` | SPV (Simplified Payment Verification) Header Proofs | Native BTC |
| **Polygon PoS** | `137` | State Receiver Checkpoint Proofs | Tokens |

---

## 3. Cross-Chain Transfer Payload Structure

When triggering an atomic cross-chain transfer via the SDK:

```typescript
export interface XcapTransferPayload {
  sourceChainId: number;        // e.g. 1 (Ethereum)
  destinationChainId: number;   // 44990 (XOLIX Mainnet)
  assetAddress: string;         // Token contract address
  sender: string;               // Originating sender address
  recipient: string;            // xol1... or 0x... recipient address
  amount: bigint;               // Value in atomic units (wei/sats)
  nonce: bigint;                // Monotonic anti-replay nonce
  proof: {
    blockNumber: bigint;
    blockHash: string;
    stateRoot: string;
    receiptsRoot: string;
    merkleProof: string[];
  };
}
```

---

## 4. Submitting a Cross-Chain Deposit via SDK

```typescript
import { XolixProvider, XolixWallet, Contract } from '@xolix/sdk';

const XCAP_BRIDGE_ABI = [
  "function executeCrossChainClaim(tuple(uint256 sourceChainId, uint256 destinationChainId, address assetAddress, address recipient, uint256 amount, uint256 nonce, bytes proof)) external"
];

async function claimBridgedAsset(claimData: any) {
  const provider = new XolixProvider('https://rpc.xolix.io');
  const wallet = new XolixWallet(process.env.RECIPIENT_PRIVATE_KEY!, provider);
  const bridgeContract = new Contract('0x0000000000000000000000000000000000002001', XCAP_BRIDGE_ABI, wallet);

  console.log('Submitting cryptographic proof to QLCV bridge...');
  const tx = await bridgeContract.executeCrossChainClaim(claimData);
  await tx.wait();
  console.log(`Claim finalized! Tx: ${tx.hash}`);
}
```

---

## 5. Security & Anti-Replay Guarantees

* **Domain Binding**: Every proof binds the destination `chainId: 44990`, preventing cross-chain replay attacks on forks or testnets.
* **Monotonic Nonce Tracking**: The contract records claimed nonces in a bitmap trie, guaranteeing each deposit can be claimed exactly once.
* **Header Finality Delay**: Transfers require a minimum number of block confirmations on the source chain (e.g. 32 slots on Ethereum, 3 blocks on Bitcoin) before acceptance.

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
