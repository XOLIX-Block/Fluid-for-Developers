# Foundry / Forge Integration Guide

This guide explains how to compile, test, and deploy smart contracts on **XOLIX FLUID** using [Foundry](https://book.getfoundry.sh/) (`forge` and `cast`).

---

## 1. Project Initialization

Initialize a new Foundry project:

```bash
forge init my-xolix-project
cd my-xolix-project
```

---

## 2. Foundry Configuration (`foundry.toml`)

Edit `foundry.toml` to configure XOLIX RPC endpoints, chain IDs, and gas settings:

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
solc_version = "0.8.24"
optimizer = true
optimizer_runs = 200
evm_version = "cancun"

[rpc_endpoints]
xolix_mainnet = "https://rpc.xolix.io"
xolix_testnet = "https://testnet-rpc.xolix.io"
xolix_local   = "http://127.0.0.1:8545"

[etherscan]
xolix_mainnet = { key = "${XOLIXSCAN_API_KEY}", url = "https://scan.xolix.io/api", chain = 44990 }
xolix_testnet = { key = "${XOLIXSCAN_API_KEY}", url = "https://scan.xolix.io/api", chain = 44991 }
```

---

## 3. Interacting via `cast`

### Check Network Chain ID
```bash
# Query Mainnet (Should return 44990 / 0xafbe)
cast chain-id --rpc-url https://rpc.xolix.io

# Query Testnet (Should return 44991 / 0xafbf)
cast chain-id --rpc-url https://testnet-rpc.xolix.io
```

### Check Account Balance
```bash
cast balance 0x71C...49A --rpc-url https://testnet-rpc.xolix.io
```

### Query Latest Block
```bash
cast block-number --rpc-url https://testnet-rpc.xolix.io
```

---

## 4. Deploying Contracts with `forge create`

Deploy directly from the CLI without writing a deployment script:

```bash
forge create src/MyToken.sol:MyToken \
  --rpc-url xolix_testnet \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --constructor-args "1000000" \
  --verify \
  --verifier-url https://scan.xolix.io/api
```

---

## 5. Deployment Script (`script/Deploy.s.sol`)

For deterministic, multi-contract deployments:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/MyToken.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        MyToken token = new MyToken(1_000_000);
        console.log("MyToken deployed to:", address(token));

        vm.stopBroadcast();
    }
}
```

Run the deployment script:

```bash
# Broadcast to Testnet
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url xolix_testnet \
  --broadcast \
  --verify

# Broadcast to Mainnet
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url xolix_mainnet \
  --broadcast \
  --verify
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
