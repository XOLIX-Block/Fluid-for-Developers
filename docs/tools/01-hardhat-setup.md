# Hardhat Integration Guide

This guide explains how to configure, compile, test, and deploy Solidity smart contracts to **XOLIX FLUID** using [Hardhat](https://hardhat.org/).

Because XOLIX FLUID provides full EVM equivalence with dual-lane architecture, existing Hardhat projects work out of the box.

---

## 1. Installation

In your Hardhat project directory:

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox dotenv
```

---

## 2. Hardhat Configuration (`hardhat.config.ts`)

Configure `hardhat.config.ts` to support both **XOLIX Mainnet** (`Chain ID: 44990`) and **XOLIX Testnet** (`Chain ID: 44991`):

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000001";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "cancun",
    },
  },
  networks: {
    // Local development node
    xolixLocal: {
      url: "http://127.0.0.1:8545",
      chainId: 44990,
      accounts: [DEPLOYER_PRIVATE_KEY],
    },
    // XOLIX Testnet (Public Developer Sandbox)
    xolixTestnet: {
      url: "https://testnet-rpc.xolix.io",
      chainId: 44991,
      accounts: [DEPLOYER_PRIVATE_KEY],
      gasPrice: 1000000000, // 1 Gwei
    },
    // XOLIX Mainnet (Production Direct Node RPC)
    xolixMainnet: {
      url: "https://rpc.xolix.io",
      chainId: 44990,
      accounts: [DEPLOYER_PRIVATE_KEY],
      gasPrice: 2000000000, // 2 Gwei
    },
  },
  etherscan: {
    apiKey: {
      xolixMainnet: process.env.XOLIXSCAN_API_KEY || "xolix-scan-token",
      xolixTestnet: process.env.XOLIXSCAN_API_KEY || "xolix-scan-token",
    },
    customChains: [
      {
        network: "xolixMainnet",
        chainId: 44990,
        urls: {
          apiURL: "https://scan.xolix.io/api",
          browserURL: "https://scan.xolix.io",
        },
      },
      {
        network: "xolixTestnet",
        chainId: 44991,
        urls: {
          apiURL: "https://scan.xolix.io/api",
          browserURL: "https://scan.xolix.io/testnet",
        },
      },
    ],
  },
};

export default config;
```

---

## 3. Environment Variables (`.env`)

Create a `.env` file in your project root:

```env
# Operator / Deployer Private Key (Keep Secret!)
DEPLOYER_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Optional Explorer Verification Key
XOLIXSCAN_API_KEY=your_xolixscan_api_key
```

> [!WARNING]
> Never commit your `.env` file or private keys to source control. Always add `.env` to `.gitignore`.

---

## 4. Writing & Compiling a Contract

Create `contracts/MyToken.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    constructor(uint256 initialSupply) ERC20("MyToken", "MTK") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
```

Compile with Hardhat:
```bash
npx hardhat compile
```

---

## 5. Deployment Script (`scripts/deploy.ts`)

Create `scripts/deploy.ts`:

```typescript
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with account: ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Account balance: ${ethers.formatEther(balance)} XOLT`);

  const initialSupply = 1_000_000n; // 1,000,000 tokens
  const MyToken = await ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy(initialSupply);

  await token.waitForDeployment();
  const contractAddress = await token.getAddress();

  console.log(`===============================================`);
  console.log(`MyToken deployed successfully to: ${contractAddress}`);
  console.log(`Explorer Link: https://scan.xolix.io/address/${contractAddress}`);
  console.log(`===============================================`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Deploy to Testnet:
```bash
npx hardhat run scripts/deploy.ts --network xolixTestnet
```

Deploy to Mainnet:
```bash
npx hardhat run scripts/deploy.ts --network xolixMainnet
```

---

## 6. Contract Verification on XolixScan

After deployment, verify your contract using the Hardhat Etherscan plugin:

```bash
npx hardhat verify --network xolixTestnet 0xYourContractAddress "1000000"
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
