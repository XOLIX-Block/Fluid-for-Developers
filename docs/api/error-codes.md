# RPC & VM Error Codes Reference

This reference catalogs all standard JSON-RPC error codes, EVM runtime revert codes, and native **XHREC (Human-Readable Error Compiler)** error codes returned by the **XOLIX FLUID** nodes.

---

## 1. Standard JSON-RPC 2.0 Error Codes

| Code | Message | Description | Resolution |
| :--- | :--- | :--- | :--- |
| `-32700` | `Parse error` | The node received malformed JSON. | Ensure request payload is valid JSON. |
| `-32600` | `Invalid Request` | The JSON sent is not a valid Request object. | Check `jsonrpc: "2.0"` and required `id` field. |
| `-32601` | `Method not found` | The method does not exist or is disabled. | Check method spelling or verify module availability in node config. |
| `-32602` | `Invalid params` | Invalid method parameters. | Check argument types, hexadecimal encoding, and array structure. |
| `-32603` | `Internal error` | Internal node daemon error. | Review node logs or check hardware resources. |

---

## 2. EIP-1474 & EIP-1193 Client Error Codes

| Code | Message | Cause |
| :--- | :--- | :--- |
| `4001` | `User Rejected Request` | The user denied transaction signature in MetaMask or Xolix Wallet. |
| `4100` | `Unauthorized` | The requested account has not authorized connection to the dApp origin. |
| `4200` | `Unsupported Method` | The requested method is not supported by the connected wallet extension. |
| `4900` | `Disconnected` | The provider is disconnected from all chains. |
| `4901` | `Chain Disconnected` | The provider is disconnected from the specified chain (`44990`/`44991`). |

---

## 3. XHREC Human-Readable VM Error Codes

The **Human-Readable Error Compiler (XHREC)** translates low-level execution reverts into clear, actionable error payloads:

| Error Name | Raw Hex Selector | Cause & Explanation |
| :--- | :--- | :--- |
| `XHREC_CAPABILITY_VIOLATION` | `0xc1a04592` | The caller attempted an action without holding the required capability (e.g. `@owner`). |
| `XHREC_PREFLIGHT_BREACH` | `0x5d9b23f1` | A preflight guard condition failed (e.g. `Risk.require_below_threshold`). |
| `XHREC_REENTRANCY_DETECTED` | `0x1f7481a0` | Nested external call detected violating capability isolation. |
| `XHREC_INSUFFICIENT_FEE` | `0x94821034` | Provided gas or XCU fee is lower than the mandatory protocol minimum. |
| `XHREC_INVALID_NONCE` | `0x75a1820b` | Transaction nonce does not match current account nonce (nonce too low or too high). |
| `XHREC_VELOCITY_BREACH` | `0x3a48e910` | Single-block asset outflow exceeded the 20% Velocity-Circuit Breaker limit. |

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
