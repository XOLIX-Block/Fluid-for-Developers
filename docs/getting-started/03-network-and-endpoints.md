# Network Environments, Endpoints & RPC Configuration

This document provides the complete, authoritative network configuration and public DNS endpoints for the XOLIX FLUID blockchain ecosystem.

---

## 1. Network Overview & Comparison

| Parameter | Mainnet (`AegisMesh v1.1.0`) | Testnet Sandbox |
| :--- | :--- | :--- |
| **Network Name** | `XOLIXBlock Mainnet` / `XOLIX FLUID` | `XOLIXBlock Testnet Sandbox` |
| **Chain ID (Decimal)** | **`44990`** | **`44991`** |
| **Chain ID (Hex)** | `0xAFBE` | `0xAFBF` |
| **Native Currency** | `XOLT` / `XOL` | `tXOL` |
| **Currency Decimals** | 18 | 18 |
| **Direct Node JSON-RPC** | `https://rpc.xolix.io` | `https://testnet-rpc.xolix.io` |
| **HTTPS RPC Gateway (DApps)** | `https://rpc.xolix.io` / `https://scan.xolix.io/api/rpc` | `https://scan.xolix.io/api/rpc` |
| **Public WebSocket** | `ws://ws.xolix.io` (or `wss://rpc.xolix.io/ws`) | `ws://ws-testnet.xolix.io` |
| **Block Explorer** | `https://scan.xolix.io` | `https://scan.xolix.io/testnet` |
| **Explorer API** | `https://scan.xolix.io/api` | `https://scan.xolix.io/api` |
| **Prometheus Metrics**| `http://rpc.xolix.io:9090/metrics` | `http://testnet-rpc.xolix.io:9090/metrics` |
| **Consensus Protocol**| AegisMesh BFT (Proof of Stake) | AegisMesh BFT (Testnet Validators) |
| **Target Block Time** | 1.0 second | 1.0 second |

---

## 2. Address Prefix Standards (BIP-350 Bech32m)

XOLIX utilizes type-aware Bech32m address encoding to prevent cross-network mistakes and distinguish accounts from contracts:

| Prefix | Type | Example Format | Purpose |
| :--- | :--- | :--- | :--- |
| **`xol1...`** | User Account | `xol1q7k50a2g...` | Native native user wallet address |
| **`xolc1...`**| Smart Contract | `xolc1q9m4e7...` | Deployed native Fluid contract |
| **`xolv1...`**| Validator Node | `xolv1qp0d2...` | Validator consensus and staking node |
| **`xolg1...`**| Governance / DAO | `xolg1q5l2a...` | Protocol governance timelock & treasury |
| **`xols1...`**| System Subroutine | `xols1q000...` | Protocol core system execution address |
| **`xol1s...`**| Stealth Address | `xol1sq3f7...` | Quantum-resistant stealth privacy account |
| **`0x...`** | EVM Hex | `0x4296...` | Standard EVM compatibility address |

---

## 3. Environment Variables Template (`.env`)

Add this template to your dApp or backend `.env` file:

```bash
# Mainnet Direct Node & Gateway Configuration
NEXT_PUBLIC_MAINNET_RPC_URL="https://rpc.xolix.io"
NEXT_PUBLIC_MAINNET_GATEWAY_URL="https://rpc.xolix.io"
NEXT_PUBLIC_MAINNET_WS_URL="ws://ws.xolix.io"
NEXT_PUBLIC_MAINNET_CHAIN_ID=44990
NEXT_PUBLIC_MAINNET_CHAIN_HEX="0xafbe"
NEXT_PUBLIC_MAINNET_EXPLORER="https://scan.xolix.io"

# Testnet Configuration
NEXT_PUBLIC_TESTNET_RPC_URL="https://testnet-rpc.xolix.io"
NEXT_PUBLIC_TESTNET_WS_URL="ws://ws-testnet.xolix.io"
NEXT_PUBLIC_TESTNET_CHAIN_ID=44991
NEXT_PUBLIC_TESTNET_CHAIN_HEX="0xafbf"
NEXT_PUBLIC_TESTNET_EXPLORER="https://scan.xolix.io/testnet"
```

---

## 4. MetaMask / Web3 Network Parameters

To add XOLIX to MetaMask or any EIP-3085 compatible wallet:

```json
{
  "chainId": "0xafbe",
  "chainName": "XOLIX FLUID Mainnet",
  "nativeCurrency": {
    "name": "XOLT",
    "symbol": "XOLT",
    "decimals": 18
  },
  "rpcUrls": ["https://rpc.xolix.io"],
  "blockExplorerUrls": ["https://scan.xolix.io"]
}
```

---

## 5. Public RPC Security & Rate Limits

- **Rate Limits**: Public endpoints allow up to **10 requests per second** per client IP.
- **Payload Cap**: Max JSON-RPC request body is **5 MB**.
- **Batch Requests**: Up to **50 batched calls** per batch array.
- **WebSocket Timeout**: Keep-alive ping required every **60 seconds**.

For enterprise node access, custom rate limit increases, or dedicated validator endpoints, contact developer relations at `devrel@xolix.io`.
