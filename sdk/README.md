# @xolix/sdk (reference implementation)

TypeScript SDK built on [ethers v6](https://docs.ethers.org/v6/) for the XOLIX FLUID EVM JSON-RPC lane (`http://rpc.xolix.io:8545`, Chain ID 44990; testnet 44991).

## Install and build

```bash
cd sdk
npm install      # installs ethers, typescript, @types/node
npm run build    # emits ./dist (ESM & CommonJS type declarations)
```

## Quick Start Example

```typescript
import { XolixProvider, XolixWallet } from '@xolix/sdk';

// Connect to Direct Node RPC
const provider = new XolixProvider('http://rpc.xolix.io:8545');

// Or connect to HTTPS Gateway (for browser dApps)
// const provider = new XolixProvider('https://xolix.web.app/api/xolix/rpc');

const blockNumber = await provider.getBlockNumber();
const network = await provider.getNetwork();
console.log(`Connected to XOLIX Block #${blockNumber} on Chain ID ${network.chainId}`);
```

## Modules

| File | Purpose |
| :--- | :--- |
| `src/provider.ts` | `XolixProvider` (chain ID detection, balances, nonce, gas, call, raw tx broadcast) |
| `src/wallet.ts` | `XolixWallet` (random/mnemonic wallets, `0x` and `xol1…` addresses, signing) |
| `src/contract.ts` | `Contract` and `ContractFactory` wrappers |
| `src/token.ts` | ERC-20 / QSC-20 token helper |
| `src/utils.ts` | Bech32m address encoding, unit helpers |
| `src/preflight.ts` | Preflight result evaluation helper |

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
