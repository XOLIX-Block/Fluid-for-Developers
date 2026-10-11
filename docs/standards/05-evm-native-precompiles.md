# EVM Native Precompiles Reference Guide

> [!WARNING]
> **Status note**: Addresses 0x01-0x0a and their names match evm/precompiles.ts. The XCU gas figures and the Solidity interface/ABI-encodings below are illustrative design targets and are not verified against the runtime. Do not rely on them in production without testing on testnet.

Solidity smart contracts deployed on **XOLIX FLUID** can interact with native blockchain consensus, zero-knowledge verification, and cross-standard token bridges through **10 protocol precompiled contracts** mapped to addresses `0x0000000000000000000000000000000000000001` through `0x000000000000000000000000000000000000000a`.

---

## 1. Precompiles Summary Table

| Address | Precompile Name | Gas (XCU) | Description |
| :--- | :--- | :--- | :--- |
| `0x0000000000000000000000000000000000000001` | `PoDIVerify` | 15,000 | Cryptographically verifies Proof of Deterministic Invariants (PoDI) proofs. |
| `0x0000000000000000000000000000000000000002` | `QSC20Bridge` | 8,000 | Native fungible asset bridge converting between ERC-20 and QSC-20 tokens. |
| `0x0000000000000000000000000000000000000003` | `QSC721Bridge` | 10,000 | Native NFT bridge converting between ERC-721 and QSC-721 digital assets. |
| `0x0000000000000000000000000000000000000004` | `QSC1155Bridge` | 12,000 | Native multi-token bridge converting between ERC-1155 and QSC-1155 assets. |
| `0x0000000000000000000000000000000000000005` | `IdentityVerify` | 20,000 | Verifies on-chain ZK compliance and KYC validity without revealing user PII. |
| `0x0000000000000000000000000000000000000006` | `TxSimulation` | 5,000 | Simulates transaction preflight risk scoring and calculates accurate XCU fees. |
| `0x0000000000000000000000000000000000000007` | `CapabilityValidation` | 6,000 | Queries contract capability constraints and upgrade safety policies. |
| `0x0000000000000000000000000000000000000008` | `StateProof` | 18,000 | Verifies cross-contract Merkle state proofs trustlessly. |
| `0x0000000000000000000000000000000000000009` | `GovernanceVoting` | 10,000 | Dispatches on-chain governance votes directly to active XIP proposals. |
| `0x000000000000000000000000000000000000000a` | `NativeAssetBridge` | 7,000 | Bridges EVM assets directly to sovereign FluidScript runtime standards. |

---

## 2. Solidity Interface (`IXolixPrecompiles.sol`)

Import this interface into your Solidity projects to interact with precompiles:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IXolixPrecompiles {
    /// @notice Verifies Proof of Deterministic Invariants (0x01)
    function verifyPoDI(bytes calldata proof, bytes32 stateRoot) external view returns (bool isValid);

    /// @notice Converts ERC-20 to native QSC-20 token (0x02)
    function bridgeToQSC20(address token, address recipient, uint256 amount) external returns (bool success);

    /// @notice Validates ZK KYC/compliance pass without revealing PII (0x05)
    function verifyIdentity(address account, uint8 tier, bytes calldata zkProof) external view returns (bool isCompliant);

    /// @notice Simulates preflight transaction risk (0x06)
    function simulateRisk(address target, bytes calldata data) external view returns (uint16 riskScore, uint32 xcuGas);

    /// @notice Validates contract capability permissions (0x07)
    function validateCapability(address contractAddr, bytes4 selector) external view returns (bool isAuthorized);
}
```

---

## 3. Example: Invoking Precompiles in Solidity

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PrecompileConsumer {
    address constant TX_SIMULATION_PRECOMPILE = address(0x06);
    address constant IDENTITY_PRECOMPILE      = address(0x05);

    /// @notice Simulate risk before executing an external interaction
    function checkTargetSafety(address target, bytes calldata callData) external view returns (bool isSafe) {
        (bool success, bytes memory result) = TX_SIMULATION_PRECOMPILE.staticcall(
            abi.encode(target, callData)
        );
        require(success, "Precompile execution failed");

        (uint16 riskScore, ) = abi.decode(result, (uint16, uint32));
        // Risk score is on a scale of 0 to 1000; reject anything > 500
        return riskScore <= 500;
    }

    /// @notice Verify that a user holds an active ZK compliance pass
    function checkUserCompliance(address user, bytes calldata zkProof) external view returns (bool) {
        (bool success, bytes memory result) = IDENTITY_PRECOMPILE.staticcall(
            abi.encode(user, uint8(1), zkProof)
        );
        require(success, "Identity verification failed");
        return abi.decode(result, (bool));
    }
}
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
