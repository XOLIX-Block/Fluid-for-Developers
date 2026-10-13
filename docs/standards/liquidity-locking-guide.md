# Liquidity Pools & Liquidity Locking Guide

A common question for third-party developers launching tokens and DeFi protocols on XOLIX is:
1. **Are liquidity pools real on-chain?**
2. **How does liquidity locking work to protect investors against rug-pulls?**

This guide provides the authoritative technical and practical reference.

---

## 1. Are Liquidity Pools Real On-Chain?

**YES. 100% of liquidity pools and transactions on XOLIX operate directly on-chain.**

When a project creator or user adds liquidity (via `scan.xolix.io/liquidity/add` or directly through the Router contract):
1. **Router Execution**: The transaction interacts with the canonical `UniswapV2Router02` contract on XOLIX.
2. **Pair Creation**: The router queries the Uniswap V2 Factory. If the pool pair does not yet exist, the factory deploys a real, immutable pair contract.
3. **Asset Deposit**: The user's tokens (e.g. `XGEM` and native `XOLT` / `FLUID`) are transferred directly into the pair contract's address.
4. **LP Token Minting**: The pair contract mints standard ERC-20 / QSC-20 **Liquidity Provider (LP) tokens** representing proportional ownership of the pool reserves and deposits them into the creator's wallet.

All trades, price updates, swap fees ($0.3\%$), and reserve queries execute directly against this on-chain pair contract.

---

## 2. How to Lock Liquidity to Protect Investors

When launching a project, locking or burning the initial LP tokens is essential to assure the community that the team cannot withdraw the trading liquidity.

There are two primary methods on XOLIX:

### Method A: Timelock Vault (Recommended for Flexible Timed Locks)
Using the official `LiquidityLocker.fls` or standard EVM timelock:
1. The creator calls `approve(LOCKER_ADDRESS, lpAmount)` on their LP token.
2. The creator calls `lockLiquidity(lpTokenAddress, lpAmount, durationSeconds)` (e.g. 180 days = `15,552,000` seconds).
3. The locker holds the LP tokens in custody until `block.timestamp >= unlockTimestamp`.
4. The locker emits an on-chain verification event that can be displayed on XolixScan as **"Liquidity Locked for X Months"**.

### Method B: Burning LP Tokens Forever (100% Irreversible Lock)
For projects that never intend to withdraw the initial liquidity:
1. Transfer the LP tokens directly to the dead burn address:
   - EVM Lane: `0x000000000000000000000000000000000000dEaD`
   - Native Lane: `xol1q00000000000000000000000000000000000000`
2. Once sent to the dead address, the private key is mathematically non-existent, permanently locking the pool liquidity into the blockchain forever.

---

## 3. Deploying Tokens On-Chain via XolixScan Pages

When developers or users deploy tokens through:
- `scan.xolix.io/master/deploy` (Ecosystem Core Contracts)
- `scan.xolix.io/developers/deploy` (Custom User & Developer Tokens)

**Every single deployment is a real, live on-chain transaction**:
- The contract bytecode and ABI parameters are submitted via the connected Web3 wallet (`eth_sendTransaction`).
- The transaction is included into an AegisMesh consensus block.
- The contract is assigned an immutable address (`0x...` or `xolc1...`) that is permanently indexed by the blockchain and visible to every node in the network.

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
