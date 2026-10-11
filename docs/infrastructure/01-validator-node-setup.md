# Validator Node Setup & Staking Guide

This guide describes validator operation **as implemented in the current XOLIX FLUID codebase**. Where a behaviour is a design target rather than enforced code today, it is labelled as such.

---

## 1. Keys: Generated Locally, Never by a Website

Validator keys are never created or delivered by the explorer or any web service. You generate them on your own machine with the protocol CLI (`cli/index.ts` in the protocol repository):

```bash
git clone https://github.com/emryvalyn/XOLIX-Block-FLUID-Infrastructure-.git
cd XOLIX-Block-FLUID-Infrastructure-
npm install
npm run build

# Creates a keypair: native address, EVM address, stealth address, mnemonic, private key
node dist/cli/index.js wallet:create
```

The validator address is derived from the key as `xolv1` + the EVM address hex (see `node:start` in `cli/index.ts`). Store the private key offline; anyone holding it controls the validator and its stake.

---

## 2. Starting the Node

```bash
npm run node:start
```

`node:start` prompts for a validator private key:

- **No key entered** → the node starts in **read-only observer mode** (syncs, serves RPC, does not produce blocks).
- **Key entered** → the derived `xolv1…` address is checked against `XOLIX_GENESIS_CONFIG.initialValidators`. If it is listed, the node runs the consensus engine as that validator; otherwise it falls back to observer mode.

> [!IMPORTANT]
> **Current admission model**: block production is gated by the genesis validator list in the node code. Staking tokens on-chain does **not yet** automatically add a node to the producer set. Automatic stake-based admission at epoch boundaries is a design goal that is not enforced by the current node implementation. Treat any third-party validator onboarding as coordinated with the XOLIX team until that is shipped.

---

## 3. Staking Parameters (from `protocol/chainParameters.ts`)

| Parameter | Value in protocol code |
| :--- | :--- |
| Target block time | 1 second |
| Max block XCU | 30,000,000 |
| Minimum validator stake | 100,000 XOL (18 decimals) |
| Slashing penalty (double-signing) | 10% of stake |
| Governance quorum | 67% |
| Governance timelock | 259,200 blocks (~72h) |
| Emergency timelock | 21,600 blocks (~6h) |

The explorer's validator guide displays a configurable staking threshold that an administrator can change; query the explorer or protocol for the value currently in force rather than hard-coding one.

---

## 4. Staking Tokens On-Chain

The explorer's `/staking` page stakes tokens into the deployed `StakingRewards` contract:

| Item | Value |
| :--- | :--- |
| Staking contract (Mainnet, 44990) | `0x6902CB8fA7dbf03E1689D6cDCA593e5F39311d6C` |
| Interface | `stake(uint256 amount)`, `withdraw(uint256 amount)`, `balanceOf(address)`, `totalSupply()` |
| Prerequisite | Approve the staking contract to spend the staked token (`approve`) before `stake` |

```typescript
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("https://rpc.xolix.io", 44990);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const STAKING = "0x6902CB8fA7dbf03E1689D6cDCA593e5F39311d6C";
const abi = ["function stake(uint256 amount)", "function balanceOf(address) view returns (uint256)"];
const staking = new ethers.Contract(STAKING, abi, signer);

// Approve the token first (token address: see the staking page / contract), then:
await (await staking.stake(ethers.parseEther("100000"))).wait();
console.log(await staking.balanceOf(signer.address));
```

> [!NOTE]
> This contract records balances and holds tokens. It does not by itself register consensus keys or promote a node into the validator set.

---

## 5. Hardware & Network (recommended)

| | Minimum | Recommended |
| :--- | :--- | :--- |
| CPU | 4 cores | 8 cores |
| RAM | 16 GB | 32 GB |
| Storage | 1 TB NVMe | 2 TB NVMe |
| Network | 100 Mbps | 1 Gbps |
| Open port | 30303 (P2P) | 30303 (P2P) |

Keep RPC (8545/8546) bound to localhost or behind an authenticated reverse proxy on validator machines. The protocol repository also supports external signers (Web3Signer / KMS / Vault) via `consensus/validator/remoteSigner.ts` so the validator key need not sit on the node host.

---

## 6. Never Run Two Instances With One Key

Running the same validator key on two machines can produce conflicting signatures (double-signing), which the protocol penalises (10% stake slash in `consensus/stakingPool.ts`). Use a single active signer or a remote signer with failover that guarantees one active instance.

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
