# @xolix/sdk (reference implementation)

TypeScript SDK built on [ethers v6](https://docs.ethers.org/v6/) for the XOLIX FLUID EVM JSON-RPC lane (`https://rpc.xolix.io`, Chain ID 44990; testnet 44991).

## Install and build

```bash
cd sdk
npm install      # installs ethers, typescript, @types/node
npm run build    # emits ./dist
```

Your editor will report `Cannot find module 'ethers'` until `npm install` has been run, because `node_modules` is not committed.

## Modules

| File | Purpose |
| :--- | :--- |
| `src/provider.ts` | `XolixProvider` (chain ID detection, balances, nonce, gas, call, raw tx broadcast) |
| `src/wallet.ts` | `XolixWallet` (random/mnemonic wallets, `0x` and `xol1…` addresses, signing) |
| `src/contract.ts` | `Contract` and `ContractFactory` wrappers |
| `src/token.ts` | ERC-20-style token helper |
| `src/utils.ts` | Bech32m address encoding, unit helpers |
| `src/preflight.ts` | Preflight result evaluation helper |

## Status

This package has not been published to npm and has not been compiled or tested in CI yet. `XolixProvider.simulateTransaction` currently derives its result from `eth_estimateGas` with a fixed placeholder risk score; it is not a real risk engine. The `xol1…` address is a Bech32m encoding of the EVM address bytes and should be checked against the node's address rules before you rely on it.

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
