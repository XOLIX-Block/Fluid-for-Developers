# Tutorial 1: Toolchain & CLI Setup

Welcome to the XOLIX FLUID developer toolchain. This guide will configure your local machine with `@xolix/fluid-cli`, `@xolix/sdk`, and VS Code development tooling.

---

## 1. Prerequisites

- **Node.js**: v18.0.0 or higher
- **NPM**: v9.0.0 or higher
- **VS Code**: Recommended for syntax highlighting

---

## 2. Project Initialization

Create a project workspace and install the official developer CLI and SDK:

```bash
mkdir my-fluid-project && cd my-fluid-project
npm init -y

# Install the official Xolix CLI & SDK
npm install --save-dev @xolix/fluid-cli typescript ts-node
npm install @xolix/sdk ethers
```

---

## 3. Toolchain Configuration (`fluid.config.json`)

Generate or create your toolchain configuration:

```json
{
  "version": "1.0.0",
  "compiler": {
    "target": "XLS_v1",
    "optimizer": {
      "enabled": true,
      "runs": 200
    }
  },
  "networks": {
    "mainnet": {
      "rpcUrl": "https://rpc.xolix.io",
      "chainId": 44990
    },
    "testnet": {
      "rpcUrl": "https://testnet-rpc.xolix.io",
      "chainId": 44991
    }
  },
  "paths": {
    "contracts": "./contracts",
    "artifacts": "./build",
    "tests": "./tests"
  }
}
```

---

## 4. Official CLI Commands

### A. Compile
Compiles `.fls` source files in `./contracts` into XLS bytecode artifacts in `./build`:
```bash
npx fluid compile
```

### B. Test
Runs local test suites and outputs an XCU gas consumption report:
```bash
npx fluid test --gas-report
```

### C. Deploy
Deploys a contract directly from terminal:
```bash
npx fluid deploy --network testnet --contract MyContract
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
