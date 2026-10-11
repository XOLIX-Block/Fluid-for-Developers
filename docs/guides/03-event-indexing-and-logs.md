# Event Indexing & Log Filtering Guide

Modern decentralized applications (dApps) rely on indexed blockchain events to power real-time dashboards, transaction feeds, and notification services.

This guide explains how to query historical logs using `eth_getLogs` and listen to live events via WebSockets.

---

## 1. Querying Historical Logs (`eth_getLogs`)

To fetch past events (such as token `Transfer` events):

### Using `curl` & JSON-RPC
```bash
curl -X POST https://rpc.xolix.io \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_getLogs",
    "params": [{
      "fromBlock": "0x1b4",
      "toBlock": "0x1c8",
      "address": "0xYourTokenAddress",
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
      ]
    }],
    "id": 1
  }'
```

> [!NOTE]
> `0xddf252ad...` is the keccak-256 hash of `Transfer(address,address,uint256)`.

---

## 2. Real-Time Event Subscriptions (WebSockets)

For live event listening without polling, connect to the WebSocket endpoint:
* **Mainnet WebSocket**: `wss://ws.xolix.io`
* **Testnet WebSocket**: `wss://testnet-ws.xolix.io`

### TypeScript with Ethers.js
```typescript
import { WebSocketProvider, ethers } from "ethers";

const wsProvider = new WebSocketProvider("wss://ws.xolix.io");

const TRANSFER_EVENT_TOPIC = ethers.id("Transfer(address,address,uint256)");
const TOKEN_ADDRESS = "0xYourTokenAddress";

const filter = {
  address: TOKEN_ADDRESS,
  topics: [TRANSFER_EVENT_TOPIC],
};

wsProvider.on(filter, (log) => {
  const from = ethers.getAddress("0x" + log.topics[1].slice(26));
  const to = ethers.getAddress("0x" + log.topics[2].slice(26));
  const amount = BigInt(log.data);

  console.log(`[EVENT] Transfer Detected!`);
  console.log(`From:   ${from}`);
  console.log(`To:     ${to}`);
  console.log(`Amount: ${ethers.formatUnits(amount, 18)} Tokens`);
  console.log(`TxHash: ${log.transactionHash}`);
});
```

---

## 3. Best Practices for High-Throughput Indexing

1. **Chunk Large Block Queries**: When re-indexing historical data from Genesis, request logs in chunks of 2,000 blocks to prevent RPC timeouts.
2. **Reorg Handling**: Always wait for 2 blocks of confirmation before considering an event finalized in your database, or subscribe to `newHeads` to detect block reorganizations.
3. **Database Idempotency**: Use `(transactionHash, logIndex)` as a composite unique primary key in your relational database to ensure you never insert duplicate records during re-scans.

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
