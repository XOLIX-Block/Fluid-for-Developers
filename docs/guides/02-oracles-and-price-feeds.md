# Oracles & Price Data

This guide documents the **deployed** `PriceOracle` contract (`src/contracts/PriceOracle.sol` in the XolixScan repo) and how to consume it safely.

---

## 1. Deployed Address (Mainnet, Chain ID 44990)

| Contract | Address |
| :--- | :--- |
| `PriceOracle` | `0xA4022e273987aAc608212194aeFB6e80e239DB9F` |

---

## 2. Interface

```solidity
interface IPriceOracle {
    function latestPrice() external view returns (uint256);        // price with 18 decimals
    function lastUpdatedAt() external view returns (uint256);      // unix timestamp of last update
    function getLatestPrice() external view returns (uint256);
    function getLatestRoundData() external view returns (uint256 price, uint256 updatedAt);
}
```

### Trust model (read before integrating)

- The oracle is a **single-owner** contract: the owner calls `setPrice(uint256)`. It is not a decentralized reporter network and it is **not** a Chainlink-style `AggregatorV3Interface` (no `latestRoundData()` tuple, 18 decimals rather than 8).
- Anything that depends on this price inherits the owner's trust assumptions. Add your own sanity bounds and staleness checks.

---

## 3. Safe Consumption Pattern

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IPriceOracle {
    function getLatestRoundData() external view returns (uint256 price, uint256 updatedAt);
}

contract PriceConsumer {
    IPriceOracle public immutable oracle;
    uint256 public constant MAX_STALENESS = 1 hours;

    constructor(address oracleAddress) { oracle = IPriceOracle(oracleAddress); }

    function price() public view returns (uint256) {
        (uint256 p, uint256 updatedAt) = oracle.getLatestRoundData();
        require(p > 0, "Oracle: zero price");
        require(block.timestamp - updatedAt <= MAX_STALENESS, "Oracle: stale price");
        return p; // 18 decimals
    }
}
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
