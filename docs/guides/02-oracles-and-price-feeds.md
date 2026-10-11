# Oracles & Price Feeds Guide

Decentralized finance (DeFi) protocols such as lending markets, perpetual exchanges, and collateralized stablecoins (like `QUSD`) require reliable, real-time off-chain price data.

This guide explains how to consume price feeds on **XOLIX FLUID**.

---

## 1. Price Feed Architecture

XOLIX FLUID supports standard **AggregatorV3Interface**-compatible price feeds as well as protocol-native high-frequency oracle push updates:

```
[Decentralized Off-Chain Reporters]
            │
            ▼ (Signed Cryptographic Updates)
[Oracle Registry / Feed Contract]
            │
            ├─► getLatestPrice(asset)
            │
            ▼
[DApp / Lending Market / QUSD Vault]
```

---

## 2. Standard Aggregator Interface

If your smart contract is written in Solidity, you can consume price feeds using the standard interface:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IAggregatorV3 {
    function decimals() external view returns (uint8);
    function description() external view returns (string memory);
    function version() external view returns (uint256);
    function getRoundData(uint80 _roundId) external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
    function latestRoundData() external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
}
```

---

## 3. Safe Price Consumption (Preventing Staleness & Negative Values)

Always follow this security pattern when reading oracle prices to prevent stale or manipulated data:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IAggregatorV3.sol";

contract PriceConsumer {
    IAggregatorV3 internal priceFeed;
    uint256 public constant MAX_STALENESS = 3600; // 1 hour threshold

    constructor(address _feedAddress) {
        priceFeed = IAggregatorV3(_feedAddress);
    }

    function getLatestPrice() public view returns (uint256) {
        (
            uint80 roundId,
            int256 price,
            ,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();

        // 1. Check for valid positive price
        require(price > 0, "Oracle: Invalid non-positive price");

        // 2. Check for staleness
        require(block.timestamp - updatedAt <= MAX_STALENESS, "Oracle: Stale price data");

        // 3. Check for round completeness
        require(answeredInRound >= roundId, "Oracle: Incomplete round data");

        return uint256(price);
    }
}
```

---

## 4. Mainnet & Testnet Oracle Feeds

| Asset Pair | Decimals | Mainnet Address (`44990`) | Testnet Address (`44991`) |
| :--- | :--- | :--- | :--- |
| **XOLT / USD** | 8 | `0x1000000000000000000000000000000000000101` | `0x2000000000000000000000000000000000000101` |
| **BTC / USD** | 8 | `0x1000000000000000000000000000000000000102` | `0x2000000000000000000000000000000000000102` |
| **ETH / USD** | 8 | `0x1000000000000000000000000000000000000103` | `0x2000000000000000000000000000000000000103` |
| **QUSD / USD** | 8 | `0x1000000000000000000000000000000000000104` | `0x2000000000000000000000000000000000000104` |

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
