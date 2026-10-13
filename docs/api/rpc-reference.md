# JSON-RPC Methods Reference

The XOLIX JSON-RPC interface supports both standard Ethereum JSON-RPC methods and XOLIX-native (`xol_*`) protocol extensions.

---

## 1. Supported Endpoints

### Direct Node RPC (Recommended for CLI, SDK, Hardhat, Foundry, Backend)
- **Mainnet Direct Node**: `http://rpc.xolix.io:8545` (Chain ID: `44990`, `0xafbe`)
- **Mainnet WebSocket**: `ws://ws.xolix.io:8546`
- **Testnet Direct Node**: `http://testnet-rpc.xolix.io:8545` (Chain ID: `44991`, `0xafbf`)

### HTTPS RPC Gateway (Browser dApps / Web3 Frontends)
- **Mainnet HTTPS Gateway**: `https://xolix.web.app/api/xolix/rpc` / `https://scan.xolix.io/api/rpc`
- **Testnet HTTPS Gateway**: `https://scan.xolix.io/api/rpc`

---

## 2. Standard Ethereum JSON-RPC Methods

All standard EVM methods work out of the box:

- `eth_chainId`: Returns chain identifier in hex (`0xafbe` or `0xafbf`).
- `eth_blockNumber`: Returns current block height in hex.
- `eth_getBalance`: Returns address balance in wei.
- `eth_getTransactionCount`: Returns account nonce.
- `eth_call`: Executes zero-gas view contract simulation.
- `eth_estimateGas`: Returns estimated gas limit for transaction.
- `eth_sendRawTransaction`: Broadcasts signed transaction to mempool.
- `eth_getTransactionReceipt`: Queries mined receipt and event logs.
- `net_version`: Returns chain ID in decimal string (`44990` or `44991`).

---

## 3. XOLIX-Native Extensions (`xol_*`)

| Method | Parameters | Description |
| :--- | :--- | :--- |
| `xol_getBalances` | `[address]` | Returns portfolio (`xolt`, `gxo`, `qusd`) in a single call. |
| `xol_simulatePreflight` | `[signedRawTx]` | Executes node preflight simulation, returns risk score & invariants. |
| `xol_getXCUEstimate` | `[txPayload]` | Returns multidimensional XCU gas breakdown (`cpu`, `storageRead`, `storageWrite`, `bandwidth`). |
| `xol_getContractCode`| `[address]` | Returns compiled XLS bytecode of native Fluid contract. |
| `xol_simulateUpgrade` | `[address, newBytecode]` | Tests state schema compatibility for upgradeable contracts. |

---

## 4. Example cURL Request

```bash
# Query Direct Node RPC (Chain ID 44990)
curl -X POST "http://rpc.xolix.io:8545" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_blockNumber",
    "params": [],
    "id": 1
  }'

# Or Query via HTTPS Gateway
curl -X POST "https://xolix.web.app/api/xolix/rpc" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_blockNumber",
    "params": [],
    "id": 1
  }'
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x1c2960"
}
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
