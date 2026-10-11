# DAO Governance & Proposal Workflow

This guide explains how decentralized governance, voting proposals, and timelocked treasury disbursements operate on **XOLIX FLUID**.

---

## 1. Governance Architecture

The governance layer is powered by **GovernanceXolix** (`GXO` token standard) and the **DAO Treasury**:

```
[Community Member / Proposer]
            │ (Submits Proposal with >= 100,000 GXO)
            ▼
[GovernanceXolix Contract]
            │ (Voting Period: 7 Days)
            ├─► GXO Holders Cast Signed Votes (For / Against / Abstain)
            │
            ▼ (Quorum Reached: >= 4% of Total Supply)
[Timelock Queue (48 Hours)]
            │ (Grace Period for Auditing)
            ▼
[DAO Treasury Execution]
            │ (Transfers Grants / Updates Protocol Parameters)
            ▼
[Target Smart Contract / Recipient]
```

---

## 2. Proposal Lifecycle

1. **Proposal Creation**:
   * Minimum proposal threshold: **100,000 GXO** tokens held or delegated.
   * Proposer provides target execution contract, value, and encoded calldata.
2. **Voting Delay**:
   * 1 day voting delay after proposal submission before voting begins (snapshot block is recorded).
3. **Voting Period**:
   * Lasts 7 days (~302,400 blocks).
   * Voting power is determined by historical checkpointed balances (`getPastVotes(account, snapshotBlock)`), preventing flash-loan voting manipulation.
4. **Quorum & Succeeded State**:
   * Quorum requires $\ge 4\%$ of the circulating GXO supply to participate.
   * If `For > Against` and quorum is met, the proposal status transitions to `Succeeded`.
5. **Timelock Queue & Execution**:
   * Successful proposals enter a mandatory **48-hour timelock delay**.
   * Anyone can execute the proposal once the timelock expires.

---

## 3. Submitting a Proposal via TypeScript SDK

```typescript
import { XolixProvider, XolixWallet, Contract, ethers } from '@xolix/sdk';

const GOVERNANCE_ABI = [
  "function propose(address[] targets, uint256[] values, bytes[] calldatas, string description) external returns (uint256)"
];

async function submitProposal() {
  const provider = new XolixProvider('https://rpc.xolix.io');
  const wallet = new XolixWallet(process.env.PROPOSER_PRIVATE_KEY!, provider);
  const gov = new Contract('0x0000000000000000000000000000000000001002', GOVERNANCE_ABI, wallet);

  // Example: DAO Grant Proposal to fund developer tooling
  const targetRecipient = "0x71C2a8751523B2dD6Fa259eE46b7F57e7939349A";
  const grantAmount = ethers.parseEther("50000"); // 50,000 FLUID

  const tx = await gov.propose(
    [targetRecipient],
    [grantAmount],
    ["0x"], // Empty calldata for raw native transfer
    "XIP-12: Grant funding for FluidScript Visual Studio Code LSP Extension"
  );

  console.log(`Proposal submitted! Tx: ${tx.hash}`);
  const receipt = await tx.wait();
  console.log('Proposal created successfully on-chain.');
}
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
