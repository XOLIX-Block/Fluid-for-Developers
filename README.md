<!-- Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved. -->
# Fluid for Developers: The Complete XOLIX FLUID Developer Hub

Welcome to **Fluid for Developers** — the official documentation, tutorial suite, and architectural reference for building decentralized applications, native wallets, and smart contracts on the **XOLIX FLUID** blockchain.

---

## 🌟 What is XOLIX FLUID?

**XOLIX FLUID** is an enterprise-grade Layer-1 blockchain featuring a **Dual-Lane Execution Engine**:
1. **The Native FLUID Lane (`.fls`)**: High-performance, capability-aware, proxy-free smart contract execution running on the native `XolixVM`.
2. **The EVM Lane (`0x...`)**: 100% Ethereum-compatible execution supporting Solidity, Vyper, Hardhat, Foundry, Wagmi, and Viem out of the box.

---

## 🚀 Quick Reference: Network Parameters

| Parameter | Mainnet (`AegisMesh v1.1.0`) | Testnet Sandbox |
| :--- | :--- | :--- |
| **Network Name** | `XOLIXBlock Mainnet` / `XOLIX FLUID` | `XOLIXBlock Testnet Sandbox` |
| **Chain ID** | **`44990`** (`0xAFBE`) | **`44991`** (`0xAFBF`) |
| **Native Currency** | `XOLT` / `XOL` (18 decimals) | `tXOL` (18 decimals) |
| **Direct Node JSON-RPC** | `https://rpc.xolix.io` | `https://testnet-rpc.xolix.io` |
| **HTTPS RPC Gateway (dApps)** | `https://rpc.xolix.io` / `https://scan.xolix.io/api/rpc` | `https://scan.xolix.io/api/rpc` |
| **Public WebSocket** | `wss://rpc.xolix.io/ws` | `wss://testnet-rpc.xolix.io/ws` |
| **Block Explorer** | [scan.xolix.io](https://scan.xolix.io) | [scan.xolix.io/testnet](https://scan.xolix.io/testnet) |
| **Target Block Time** | 1.0 second (`blockTimeSeconds` in protocol parameters) | 1.0 second |
| **Address Formats** | `xol1...` (User), `xolc1...` (Contract), `0x...` (EVM) | `xol1...` (User), `xolc1...` (Contract), `0x...` (EVM) |

---

## 📚 Complete Documentation Index

### 1. Getting Started
- 📖 [Architecture & Overview](./docs/getting-started/01-overview.md) — The dual-lane model, consensus, and security philosophy.
- ⚡ [Quickstart in 10 Minutes](./docs/getting-started/02-quickstart-in-10-minutes.md) — From zero to your first deployed contract.
- 🌐 [Network Environments & Endpoints](./docs/getting-started/03-network-and-endpoints.md) — Complete public DNS endpoints, chain IDs, and rate limits.
- ⏱️ [Learn Fluid in 30 Minutes](./docs/learn-fluid-in-30-minutes.md) — Fast-track tutorial for Solidity & Web3 developers.

### 2. FluidScript (`.fls`) Language Guide
- 📝 [Syntax, Structure & Lifecycle](./docs/fluidscript/01-syntax-and-structure.md) — Contract anatomy, state persistent, and execution models.
- 🔢 [Type System Reference](./docs/fluidscript/02-type-system.md) — Primitives, checked arithmetic, maps, structs, and arrays.
- 🛡️ [Native Capabilities & Access Control](./docs/fluidscript/03-capabilities-and-permissions.md) — Protocol-level `@owner` and `@governance` decorators.
- 🔄 [Preflight & Atomic Execution Engine](./docs/fluidscript/04-preflight-and-atomic-execution.md) — Two-phase transaction validation.
- 🔗 [Multi-Contract Interactions & Factories](./docs/fluidscript/05-multi-contract-interactions.md) — Interfaces, external calls, and `create`.
- 🚀 [Proxy-Free Upgrades](./docs/fluidscript/06-proxy-free-upgrades.md) — Native logic pointer updates and append-only schemas.
- ⛽ [Gas & XCU Optimization](./docs/fluidscript/07-gas-and-xcu-optimization.md) — Multidimensional XCU gas calculations and savings.

### 3. Official TypeScript SDK (`@xolix/sdk`)
> The [`sdk/`](./sdk) folder provides an ethers-v6-based reference implementation supporting both the EVM JSON-RPC lane (`eth_*`) and native native lane (`xolix_*`), complete with `xol1…` address codecs, preflight simulation, and contract interaction wrappers. Both lanes are natively supported in production by the XOLIX FLUID node (`https://rpc.xolix.io`).
- 💻 [SDK Architecture & Overview](./docs/sdk/overview.md) — Modules, interfaces, and quick-start patterns.
- 📦 [Installation & Setup](./docs/sdk/01-installation-and-setup.md) — Node.js, TypeScript, Next.js, and Vite configuration.
- 🌐 [Providers & Real-Time WebSockets](./docs/sdk/02-providers-and-rpc.md) — `JsonRpcProvider`, `WebSocketProvider`, and event hooks.
- 🔑 [Wallets, BIP-39 & Addresses](./docs/sdk/03-wallets-and-keys.md) — 24-word mnemonics, Bech32m `xol1...`, stealth addresses, and signing.
- 📜 [Smart Contract Interactions](./docs/sdk/04-contract-interaction.md) — Zero-gas view calls (`read`) and state writes (`write`).
- 🏭 [ContractFactory Deployment](./docs/sdk/05-contract-deployment.md) — Programmatic deployment and bytecode execution.
- 🔍 [Preflight Simulation Engine](./docs/sdk/06-preflight-and-simulation.md) — Pre-broadcast risk scoring and XCU estimation.
- 📱 [Mobile & Multi-Language Client SDKs](./docs/sdk/07-mobile-and-multi-language.md) — iOS (Swift), Android (Kotlin), React Native, Python (web3.py), and Go (ethclient).

### 4. DApp & Wallet Integrations
- 🦊 [Browser Wallet Integration](./docs/dapps/01-wallet-integration.md) — EIP-1193, MetaMask, Xolix Wallet, and network switching.
- ⚛️ [React, Wagmi v2 & Viem](./docs/dapps/02-react-and-wagmi.md) — React hooks, custom chain definitions, and UI components.
- 🛠️ [Ethers.js (v5/v6) & Web3.js](./docs/dapps/03-ethers-and-web3.md) — Node.js backends and legacy integration guides.
- 📊 [Transaction Lifecycle & Receipts](./docs/dapps/04-transaction-lifecycle.md) — Mempool states, event subscriptions, and VM error codes.
- 👆 [Biometric Passkeys & WebAuthn](./docs/dapps/05-passkeys-and-webauthn.md) — Seedless FaceID/TouchID onboarding and gas sponsorship via QSC-4900.
- 💼 [Custom Native Wallet Engineering](./docs/dapps/06-custom-wallet-engineering.md) — BIP-39 mnemonic derivation, dual Bech32m/EVM addressing, and XRAS transaction signing.

### 5. Token & Contract Standards
- 🪙 [QSC-20 Fungible Token Standard](./docs/standards/QSC20-fungible-tokens.md) — The standard currency token specification (`QSC20.fls`).
- 🎨 [QSC-721 NFT Standard](./docs/standards/QSC721-nft-standard.md) — Non-fungible tokens, digital assets, and metadata (`QSC721.fls`).
- ⚖️ [QSC-352 Compliance / RWA Standard](./docs/standards/QSC352-compliance-tokens.md) — Regulated assets with on-chain KYC verification (`QSC352.fls`).
- 🏛️ [QSC-4900 Multisig Vault Standard](./docs/standards/QSC4900-multisig-vaults.md) — $M$-of-$N$ threshold governance vault (`QSC4900.fls`).
- 🔒 [Liquidity Pools & Liquidity Locking Guide](./docs/standards/liquidity-locking-guide.md) — How AMM pools work, LP token generation, and on-chain liquidity locking.
- 🔮 [EVM Native Precompiles Reference Table](./docs/standards/05-evm-native-precompiles.md) — 10 native precompiled contracts (0x01 to 0x0a) for PoDI verification, cross-standard bridging, and simulation.

### 6. End-to-End Tutorials
- 🛠️ [Tutorial 1: Toolchain & CLI Setup](./docs/tutorials/01-environment-and-cli.md) — Installing `@xolix/fluid-cli` and configuring IDEs.
- 🚀 [Tutorial 2: Hello World Contract](./docs/tutorials/02-hello-world-contract.md) — Writing, testing, and deploying your first `.fls` contract.
- 🪙 [Tutorial 3: Launching a QSC-20 Token](./docs/tutorials/03-deploying-qsc20-token.md) — Deploying your own token in 5 minutes.
- 🖼️ [Tutorial 4: Building an NFT Collection](./docs/tutorials/04-building-nft-collection.md) — Minting and trading NFTs on XOLIX.
- 📈 [Tutorial 5: Building a DeFi AMM Pool](./docs/tutorials/05-building-defi-dex-amm.md) — Constant-product ($x \cdot y = k$) decentralized exchange.
- 🔄 [Tutorial 6: Safe Proxy-Free Upgrades](./docs/tutorials/06-upgrading-contracts-safely.md) — Simulating and activating V2 contract logic.

### 7. Security & Auditing
- ✅ [25-Point Security Audit Checklist](./docs/security/audit-checklist.md) — Mandatory verification before mainnet launch.
- ⚠️ [Common Pitfalls & Mitigations](./docs/security/common-pitfalls.md) — Reentrancy, overflows, flash-loan vulnerabilities, and MEV.
- 🔍 [BIP-350 Address Validation](./docs/security/address-validation.md) — Checksum verification and format translation.
- 🛡️ [Protocol Security Innovations & Protections](./docs/security/04-protocol-security-innovations.md) — In-depth breakdown of XIF (Intent Firewall), XVCB (Velocity Breaker), R-FLD (Flash-Loan Deflector), and XRAS (Replay Shield).

### 8. Public Explorer & Node APIs
- 🔎 [XolixScan REST API Guide](./docs/api/explorer-api.md) — Blocks, transactions, account history, and contract verification.
- 📡 [JSON-RPC Reference](./docs/api/rpc-reference.md) — Full list of standard and native (`xol_*`) methods.
- 🚰 [Testnet Faucet Guide](./docs/api/faucet-guide.md) — Obtaining free `tXOL` for sandbox development.
- 🛑 [RPC & VM Error Codes Reference](./docs/api/error-codes.md) — Standard JSON-RPC error codes, EVM execution reverts, and XHREC error translations.

### 9. Infrastructure & Node Operations
- 🛡️ [Validator Node Setup & Staking Guide](./docs/infrastructure/01-validator-node-setup.md) — Hardware specs, private key generation, on-chain stake registration, and protocol auto-activation.
- 🕸️ [P2P Mesh & Consensus Architecture](./docs/infrastructure/02-p2p-mesh-and-consensus.md) — AegisMesh P2P gossip, handshake signatures, peer scoring, sybil defense, and fake node prevention.
- ⚡ [Running a Full RPC Node](./docs/infrastructure/03-full-node-and-rpc.md) — Non-validating archival and JSON-RPC node setup with Nginx reverse proxy.

### 10. EVM Developer Tooling
- ☕ [Hardhat Integration Guide](./docs/tools/01-hardhat-setup.md) — Configuring `hardhat.config.ts` for Chain ID 44990/44991, deploy scripts, and Etherscan plugin.
- 🔨 [Foundry / Forge Integration Guide](./docs/tools/02-foundry-setup.md) — `foundry.toml`, `forge create`, `cast` commands, and deployment scripts.
- 🌐 [Remix IDE Integration Guide](./docs/tools/03-remix-ide.md) — Developing and deploying contracts via Injected Provider in your browser.
- 🐳 [Running a Local Development Node](./docs/tools/04-local-node-and-docker.md) — Instant local sandbox mining via Docker Compose or Node.js CLI.
- 🧪 [Smart Contract Testing & Fuzzing Guide](./docs/tools/05-testing-and-fuzzing.md) — Automated unit testing with Hardhat (Chai) and invariant fuzzing with Foundry.

### 11. Production Integration Guides
- 📜 [Smart Contract Verification Guide](./docs/guides/01-contract-verification.md) — Verifying Solidity and FluidScript contracts on XolixScan Explorer.
- 🔮 [Oracles & Price Feeds Guide](./docs/guides/02-oracles-and-price-feeds.md) — Consuming real-time decentralized price feeds and staleness protection.
- 📊 [Event Indexing & Log Filtering Guide](./docs/guides/03-event-indexing-and-logs.md) — `eth_getLogs`, WebSocket event streaming, and building dApp indexers.
- 🌉 [Cross-Chain Interoperability & XCAP Protocol](./docs/guides/04-cross-chain-and-bridges.md) — Native cryptographic light-client verification (QLCV) and cross-chain transfers.
- 🚀 [Token Launch & Liquidity Checklist](./docs/guides/05-token-launch-checklist.md) — End-to-end launch guide, DEX pool setup, LP locking, and safety checks.
- 🏛️ [DAO Governance & Proposal Workflow](./docs/guides/06-dao-governance-workflow.md) — GXO voting tokens, proposal submission, timelocks, and treasury execution.

---

## 💻 Code Example: Writing a Fluid Token in 30 Seconds

```fluid
version 1.0;

contract SimpleCoin {
    state persistent {
        owner: address;
        totalSupply: uint256;
        balances: map<address, uint256>;
    }

    constructor(initialSupply: uint256) {
        state.owner = msg.sender;
        state.totalSupply = initialSupply;
        state.balances[msg.sender] = initialSupply;
    }

    public balanceOf(account: address): uint256 {
        return state.balances[account];
    }

    public transfer(to: address, amount: uint256): bool {
        require(state.balances[msg.sender] >= amount, "Insufficient balance");
        state.balances[msg.sender] = state.balances[msg.sender] - amount;
        state.balances[to] = state.balances[to] + amount;
        return true;
    }

    @owner
    public mint(to: address, amount: uint256) {
        state.totalSupply = state.totalSupply + amount;
        state.balances[to] = state.balances[to] + amount;
    }
}
```

---

## 📂 Repository Layout

```text
Fluid-for-Developers/
├── README.md               # Master Developer Hub (You are here)
├── LICENSE                 # Apache License 2.0
├── glossary.md             # Developer Glossary of Terms
├── roadmap.md              # Public Ecosystem Roadmap
├── docs/                   # Full Documentation Modules
│   ├── getting-started/    # Architecture, quickstarts, network details
│   ├── fluidscript/        # Language specification & syntax
│   ├── sdk/                # Official TypeScript SDK reference
│   ├── dapps/              # Wallet, WebAuthn passkeys, custom wallets
│   ├── standards/          # QSC-20, QSC-721, QSC-352, QSC-4900, Precompiles
│   ├── tutorials/          # Step-by-step guides from zero to production
│   ├── security/           # 25-point audit checklist, innovations (XIF/XVCB)
│   ├── api/                # XolixScan REST API, JSON-RPC & error codes
│   ├── infrastructure/     # Validator node setup, AegisMesh P2P, RPC nodes
│   ├── tools/              # Hardhat, Foundry, Remix, local Docker node, testing
│   └── guides/             # Verification, oracles, logs, XCAP, token launch, DAO
├── sdk/                    # Official @xolix/sdk Source Code (TypeScript)
│   ├── src/                # Provider, Wallet, Contract, Token, Utils, Preflight
│   ├── package.json        # NPM package manifest
│   └── tsconfig.json       # TypeScript build configuration
├── fluid/
│   ├── contracts/          # Standard Fluid contracts (QSC20, QSC721, etc.)
│   └── specification/      # Deep language grammar & execution specs
└── examples/
    ├── hello-world.fls     # Minimal compilable contract
    ├── counter.fls         # Stateful counter example
    ├── escrow.fls          # 2-of-3 decentralized escrow
    ├── staking-rewards.fls # Yield staking pool with time-weighted rewards
    ├── dex-amm-pool.fls    # AMM constant-product liquidity pool
    ├── liquidity-locker.fls# On-chain DEX liquidity locker
    ├── upgradeable-token.fls# Native proxy-free upgradeable token
    └── sdk/                # Runnable TypeScript SDK scripts
        ├── 01-connect-provider.ts
        ├── 02-wallet-management.ts
        ├── 03-deploy-token.ts
        ├── 04-interact-contract.ts
        ├── 05-simulate-preflight.ts
        └── 06-frontend-wallet-hook.tsx
```

---

## 🤝 Community & Contributing

- **GitHub Issues**: Report documentation errata or propose standard extensions via GitHub issues.
- **Developer Discord**: Join our engineering community for active dev support.
- **Grants Program**: Building an innovative dApp on XOLIX? Apply for ecosystem builder grants.

---
// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License").
