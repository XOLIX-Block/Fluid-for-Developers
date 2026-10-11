# Remix IDE Integration Guide

This guide explains how to use the browser-based [Remix IDE](https://remix.ethereum.org/) to develop, test, and deploy smart contracts to **XOLIX FLUID**.

---

## 1. Network Setup in Your Browser Wallet

Ensure your Web3 wallet (MetaMask or Xolix Wallet) is connected to XOLIX:

### Mainnet Configuration
* **Network Name**: `XOLIX Mainnet`
* **RPC URL**: `https://rpc.xolix.io`
* **Chain ID**: `44990` (`0xafbe`)
* **Currency Symbol**: `XOLT`
* **Block Explorer URL**: `https://scan.xolix.io`

### Testnet Configuration
* **Network Name**: `XOLIX Testnet`
* **RPC URL**: `https://testnet-rpc.xolix.io`
* **Chain ID**: `44991` (`0xafbf`)
* **Currency Symbol**: `tXOL`
* **Block Explorer URL**: `https://scan.xolix.io/testnet`

---

## 2. Compiling Contracts in Remix

1. Open [https://remix.ethereum.org/](https://remix.ethereum.org/).
2. Create your `.sol` file in the `contracts/` directory.
3. Switch to the **Solidity Compiler** tab on the left sidebar:
   * **Compiler Version**: Select `0.8.24` or higher.
   * **EVM Version**: Select `cancun` (or `default`).
   * **Optimization**: Enable 200 runs.
4. Click **Compile contract**.

---

## 3. Deploying via Injected Provider

1. Switch to the **Deploy & Run Transactions** tab on the left sidebar.
2. Under **ENVIRONMENT**, select **"Injected Provider - MetaMask"** (or Injected Provider).
3. Confirm that the Environment displays:
   ```
   Custom (44990) network  -- for Mainnet
   Custom (44991) network  -- for Testnet
   ```
4. Verify your account address and native token balance.
5. Select your compiled contract from the dropdown.
6. Provide constructor arguments (if required) and click **Deploy**.
7. Confirm the transaction prompt in your wallet extension.

Once confirmed, your contract will appear under **Deployed Contracts** in Remix, and you can interact with all read/write methods directly in the browser UI!

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
