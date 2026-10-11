# Production Token Launch & Liquidity Checklist

> [!WARNING]
> **Status note**: The checklist is general best practice. Contract names such as dex-amm-pool.fls and liquidity-locker.fls are the example contracts in this repository, not audited production deployments.

This end-to-end checklist prepares founders, projects, and token creators to launch a token safely on **XOLIX FLUID**.

---

## 1. Pre-Deployment Configuration

- [ ] **Choose Your Implementation Standard**:
  * **EVM ERC-20 (`.sol`)**: If targeting standard Web3 tooling and multi-chain portability.
  * **Native QSC-20 (`.fls`)**: If utilizing capability-based security (`@owner`), native preflight checks, or built-in protocol fee policies.
- [ ] **Decimals**: Use standard `18` decimals for fungible currencies.
- [ ] **Initial Supply & Cap**: Ensure the maximum supply cap is immutable or governed by a timelocked DAO multisig (`QSC-4900`).
- [ ] **Fee Policies (Optional)**: If implementing transaction taxes (e.g. 5% burn / 1% treasury like the native coin), ensure taxes cannot be set higher than 10% to prevent honeypot classification.

---

## 2. Testnet Sandbox Verification (`Chain ID: 44991`)

- [ ] **Acquire Testnet Funds**: Request `tXOL` from the testnet faucet at `https://scan.xolix.io/testnet`.
- [ ] **Deploy to Testnet**: Deploy via Hardhat, Foundry, or the `@xolix/sdk`.
- [ ] **Test Basic Transfers**: Send transfers between different user accounts.
- [ ] **Simulate Preflight**: Call `provider.simulateTransaction()` to ensure risk scores remain $< 100$.
- [ ] **Verify Source Code**: Verify source code on `https://scan.xolix.io/testnet` to enable the interactive read/write tabs.

---

## 3. Mainnet Launch (`Chain ID: 44990`)

- [ ] **Deploy from a Cold Wallet / Multisig**: Never deploy mainnet production contracts from a hot private key stored in plaintext. Use a hardware wallet (Ledger) or QSC-4900 threshold vault.
- [ ] **Verify Contract Immediately**: Submit source code to XolixScan via Hardhat or the UI.
- [ ] **Create Initial DEX Liquidity Pool**:
  * Deposit your token and paired asset (e.g. `FLUID` or `QUSD`) into the AMM factory (`dex-amm-pool.fls`).
- [ ] **Lock Liquidity (Mandatory for Community Trust)**:
  * Transfer the resulting LP tokens directly into the `LiquidityLocker` contract (`liquidity-locker.fls`).
  * Set a lock duration (recommended: minimum 6 to 12 months).
  * Share the verifiable locker contract link on your community channels.
- [ ] **Renounce or Transfer Ownership to Governance**: If contract has an `owner` parameter, transfer ownership to a timelock or DAO treasury.

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
