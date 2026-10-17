# Official TypeScript SDK (`@xolix/sdk`) Reference

The **XOLIX TypeScript SDK** (`@xolix/sdk` / `xolix-fluid`) is a browser-isomorphic, fully typed, high-performance library engineered for dApp developers, backend engineers, and node integrators.

---

## 1. Core Modules & Architecture

```text
                               ┌────────────────────────────────┐
                               │           @xolix/sdk           │
                               └───────────────┬────────────────┘
                                               │
             ┌─────────────────┬───────────────┴───────────────┬─────────────────┐
             ▼                 ▼                               ▼                 ▼
     ┌───────────────┐ ┌───────────────┐               ┌───────────────┐ ┌───────────────┐
     │   Providers   │ │    Wallets    │               │   Contracts   │ │     Utils     │
     ├───────────────┤ ├───────────────┤               ├───────────────┤ ├───────────────┤
     │ JsonRpcProv.. │ │ XolixWallet   │               │ XolixContract │ │ Bech32m / BIP │
     │ WebSocketPr.. │ │ HDWallet      │               │ ContractFact..│ │ Unit Conver.. │
     │ Simulation    │ │ BIP-39/BIP-44 │               │ FluidContract.│ │ Signature V.. │
     └───────────────┘ └───────────────┘               └───────────────┘ └───────────────┘
```

### Module Responsibilities

1. **`JsonRpcProvider`**: Connects via HTTPS to Mainnet (`rpc.xolix.io`) or Testnet (`testnet-rpc.xolix.io`). Handles transaction broadcasting, receipt polling, and block events.
2. **`XolixWallet`**: Native key management. Manages 24-word BIP-39 mnemonics, private keys, native Bech32m addresses (`xol1...`), stealth addresses (`xol1s...`), and cryptographic signing.
3. **`XolixContract`**: Object-oriented interface for calling deployed Fluid (`xolc1...`) or EVM (`0x...`) smart contracts. Handles ABI encoding, zero-gas view reads, and state writes.
4. **`ContractFactory`**: Programmatic deployment of compiled `.xls` bytecode or Solidity bytecode.
5. **`FluidContractManager`**: In-memory compilation of `.fls` source code, upgrade simulations, and schema audits.
6. **`XolixUtils`**: Formatting units (`formatXOL`, `parseXOL`), address validation, risk score parsers.

---

## 2. Installation

Install via npm, yarn, or pnpm:

```bash
npm install @xolix/sdk ethers
# or
yarn add @xolix/sdk ethers
# or
pnpm add @xolix/sdk ethers
```

---

## 3. Quick Start Example

```typescript
import { JsonRpcProvider, XolixWallet, XolixContract, XolixUtils } from '@xolix/sdk';

// 1. Connect to network
const provider = new JsonRpcProvider({ url: 'https://rpc.xolix.io' });

// 2. Load wallet
const wallet = new XolixWallet('YOUR_PRIVATE_KEY', provider);
console.log(`Connected address: ${wallet.getNativeAddress()}`);

// 3. Query native balance
const balance = await provider.getBalance(wallet.address);
console.log(`Balance: ${XolixUtils.formatXOL(balance)} XOLT`);
```

---

## 4. Next Guides
- [Installation & Setup Details](./01-installation-and-setup.md)
- [Providers, JSON-RPC & WebSockets](./02-providers-and-rpc.md)
- [Wallets, BIP-39 & Address Formats](./03-wallets-and-keys.md)
- [Contract Interaction (Read/Write)](./04-contract-interaction.md)
- [Programmatic Contract Deployment](./05-contract-deployment.md)
- [Preflight Simulation Engine](./06-preflight-and-simulation.md)
