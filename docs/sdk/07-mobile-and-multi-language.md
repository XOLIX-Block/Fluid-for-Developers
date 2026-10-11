# Mobile & Multi-Language Client Integration Guide

This guide provides tested boilerplate and integration patterns for interacting with **XOLIX FLUID** (`https://rpc.xolix.io`, Chain ID: `44990`) from mobile platforms (**iOS Swift**, **Android Kotlin**, **React Native**) and backend languages (**Python**, **Go**).

---

## 1. Network Constants

* **Chain ID**: `44990` (`0xAFBE` in hex)
* **RPC Endpoint**: `https://rpc.xolix.io`
* **Testnet RPC**: `https://testnet-rpc.xolix.io` (Chain ID: `44991`)
* **WebSocket**: `wss://ws.xolix.io`
* **Native Currency**: `FLUID` (18 Decimals)

---

## 2. iOS (Swift - Web3.swift)

Add `Web3.swift` via Swift Package Manager:

```swift
// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.
import Foundation
import Web3
import BigInt

public class XolixMobileClient {
    private let rpcUrl = "https://rpc.xolix.io"
    private let chainId = 44990
    private var web3: Web3?

    public init() {
        if let url = URL(string: rpcUrl) {
            self.web3 = Web3(rpcURL: url)
        }
    }

    /// Fetch latest block number from XOLIX node
    public func getLatestBlock() async throws -> BigUInt {
        guard let web3 = web3 else { throw NSError(domain: "Xolix", code: -1, userInfo: nil) }
        return try await web3.eth.getBlockNumber()
    }

    /// Query account native balance in Wei
    public func getBalance(address: String) async throws -> BigUInt {
        guard let web3 = web3 else { throw NSError(domain: "Xolix", code: -1, userInfo: nil) }
        let ethAddress = try EthereumAddress(hex: address, eip55: false)
        return try await web3.eth.getBalance(address: ethAddress, block: .latest)
    }
}
```

---

## 3. Android (Kotlin - Web3j)

In your `app/build.gradle`:
```groovy
implementation 'org.web3j:core:4.10.3'
implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.0'
```

Kotlin Implementation:
```kotlin
// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.
package io.xolix.wallet

import org.web3j.protocol.Web3j
import org.web3j.protocol.http.HttpService
import org.web3j.protocol.core.DefaultBlockParameterName
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.math.BigInteger

class XolixAndroidClient(private val rpcUrl: String = "https://rpc.xolix.io") {
    private val web3j: Web3j = Web3j.build(HttpService(rpcUrl))
    val chainId: Long = 44990L

    suspend fun fetchBlockNumber(): Long = withContext(Dispatchers.IO) {
        web3j.ethBlockNumber().send().blockNumber.toLong()
    }

    suspend fun fetchBalance(address: String): BigInteger = withContext(Dispatchers.IO) {
        web3j.ethGetBalance(address, DefaultBlockParameterName.LATEST).send().balance
    }
}
```

---

## 4. React Native (TypeScript)

```typescript
// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.
import { ethers } from 'ethers';

export class XolixReactNativeClient {
  private provider: ethers.JsonRpcProvider;

  constructor() {
    this.provider = new ethers.JsonRpcProvider('https://rpc.xolix.io', 44990);
  }

  async getBlockHeight(): Promise<number> {
    return await this.provider.getBlockNumber();
  }

  async getBalanceInFluid(address: string): Promise<string> {
    const balanceWei = await this.provider.getBalance(address);
    return ethers.formatEther(balanceWei);
  }
}
```

---

## 5. Python (web3.py)

```python
# Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.
from web3 import Web3

# Connect to XOLIX Mainnet
w3 = Web3(Web3.HTTPProvider('https://rpc.xolix.io'))

assert w3.is_connected(), "Failed to connect to XOLIX Node"
assert w3.eth.chain_id == 44990, f"Unexpected chain ID: {w3.eth.chain_id}"

print(f"Connected! Current block height: {w3.eth.block_number}")
balance = w3.eth.get_balance('0x71C2a8751523B2dD6Fa259eE46b7F57e7939349A')
print(f"Balance: {w3.from_wei(balance, 'ether')} FLUID")
```

---

## 6. Go (go-ethereum / ethclient)

```go
// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.
package main

import (
	"context"
	"fmt"
	"log"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

func main() {
	client, err := ethclient.Dial("https://rpc.xolix.io")
	if err != nil {
		log.Fatalf("Failed to connect to XOLIX node: %v", err)
	}

	chainID, err := client.ChainID(context.Background())
	if err != nil {
		log.Fatalf("Failed to query chain ID: %v", err)
	}
	fmt.Printf("Connected to XOLIX Node! Chain ID: %v\n", chainID)

	blockNumber, err := client.BlockNumber(context.Background())
	if err != nil {
		log.Fatalf("Failed to query block number: %v", err)
	}
	fmt.Printf("Current Block Number: %d\n", blockNumber)
}
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
