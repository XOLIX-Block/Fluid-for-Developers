# Smart Contract Verification Guide

This guide walks you through verifying smart contract source code on **XolixScan** (`https://scan.xolix.io`).

Verifying your contract is essential for:
- **Transparency**: Users and auditors can read the exact code deployed on-chain.
- **Interactive Explorer Support**: Enables the **"Read Contract"** and **"Write Contract"** tabs on XolixScan.
- **Trust & Compliance**: Essential for token listings, DEX liquidity pools, and audits.

---

## 1. Supported Languages

XolixScan supports source verification for both lanes:
1. **Solidity (`.sol`)**: Standard Single-File or Multi-File / Standard JSON Input.
2. **FluidScript (`.fls`)**: Native capability-based smart contracts.

---

## 2. Verifying via XolixScan Web UI

1. Navigate to your deployed contract address on XolixScan:
   ```
   https://scan.xolix.io/address/0xYourContractAddress#code
   ```
2. Click the **"Verify & Publish"** button.
3. Select the compiler details:
   * **Compiler Type**: `Solidity (Single File)`, `Solidity (Standard JSON)`, or `FluidScript (.fls)`.
   * **Compiler Version**: e.g., `v0.8.24+commit.e11b9ed9`.
   * **Open Source License**: MIT, Apache-2.0, GPL-3.0, etc.
4. Enter the source code:
   * Paste the flattened source code or upload your Standard JSON artifact.
   * If constructor arguments were used, enter the ABI-encoded hex parameters.
5. Click **Verify and Publish**.
6. The verification engine will compile the source code, check the bytecode against the on-chain runtime bytecode, and display a green checkmark (`Verified Contract Source Code`).

---

## 3. Programmatic Verification via API

You can verify contracts from CI/CD pipelines or automated deployment scripts using the XolixScan REST API:

```bash
curl -X POST https://scan.xolix.io/api \
  -H "Content-Type: application/json" \
  -d '{
    "module": "contract",
    "action": "verifysourcecode",
    "contractaddress": "0x1234567890123456789012345678901234567890",
    "sourceCode": "// SPDX-License-Identifier: MIT\npragma solidity ^0.8.24;\ncontract MyToken { ... }",
    "codeformat": "solidity-single-file",
    "contractname": "MyToken",
    "compilerversion": "v0.8.24+commit.e11b9ed9",
    "optimizationUsed": "1",
    "runs": "200",
    "constructorArguements": "00000000000000000000000000000000000000000000000000000000000f4240"
  }'
```

**Response:**
```json
{
  "status": "1",
  "message": "OK",
  "result": "guid-7b98d2-verification-queued"
}
```

Check the status of the verification request:
```bash
curl "https://scan.xolix.io/api?module=contract&action=checkverifystatus&guid=guid-7b98d2-verification-queued"
```

**Result:**
```json
{
  "status": "1",
  "message": "OK",
  "result": "Pass - Verified"
}
```

---

## 4. Hardhat & Foundry Auto-Verification

* **Hardhat**:
  ```bash
  npx hardhat verify --network xolixMainnet 0xContractAddress "constructor_arg_1"
  ```
* **Foundry**:
  ```bash
  forge verify-contract 0xContractAddress src/MyContract.sol:MyContract \
    --verifier-url https://scan.xolix.io/api \
    --chain-id 44990
  ```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
