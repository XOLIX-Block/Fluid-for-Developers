# Running a Local Development Node (Docker & CLI)

While developers can build against the public **XOLIX Testnet** (`https://testnet-rpc.xolix.io`), running a native local sandbox node (`http://127.0.0.1:8545`) provides **instant block mining**, zero latency, and infinite free test balances.

---

## 1. Quick Start with Docker Compose

If you have [Docker](https://www.docker.com/) installed, you can spin up the complete local developer environment with a single command:

```bash
# Clone the protocol core repository
git clone https://github.com/emryvalyn/XOLIX-Block-FLUID-Infrastructure-.git
cd XOLIX-Block-FLUID-Infrastructure-

# Launch the local stack (Node Daemon, NGINX, Redis, Metrics)
docker-compose -f operations/docker-compose.yml up -d
```

### Local Services & Ports

| Service | Port | Endpoint URL | Purpose |
| :--- | :--- | :--- | :--- |
| **HTTP JSON-RPC** | `8545` | `http://127.0.0.1:8545` | Standard EVM & Native RPC calls |
| **WebSocket Stream** | `8546` | `ws://127.0.0.1:8546` | Real-time block & log subscriptions |
| **Prometheus Telemetry** | `9090` | `http://127.0.0.1:9090/metrics` | Node health, mempool size, peer count |
| **P2P Mesh Port** | `30303` | `tcp://127.0.0.1:30303` | Local P2P test networking |

---

## 2. Running Locally via Node.js CLI (Without Docker)

If you prefer running directly on your host machine without Docker:

```bash
git clone https://github.com/emryvalyn/XOLIX-Block-FLUID-Infrastructure-.git
cd XOLIX-Block-FLUID-Infrastructure-

# 1. Install dependencies
npm install

# 2. Build the TypeScript engine
npm run build

# 3. Start local developer node
npm run node:start -- --chainId 44990 --dev
```

You will see the node startup log:
```
============================================================
              XOLIX FLUID CORE NODE DAEMON                  
============================================================
[INFO] Chain ID:          44990 (0xafbe)
[INFO] Mode:              Local Developer Sandbox (DevMining: Instant)
[INFO] JSON-RPC HTTP:     Listening on http://127.0.0.1:8545
[INFO] WebSocket Stream:  Listening on ws://127.0.0.1:8546
[INFO] Telemetry Metrics: Listening on http://127.0.0.1:9090/metrics
[INFO] Pre-funded Dev Account: 0x71C2a8751523B2dD6Fa259eE46b7F57e7939349A (10,000,000 FLUID)
============================================================
```

---

## 3. Testing Your Local Node

Verify your node is online using `curl`:

```bash
# Query Chain ID (Should return 0xafbe)
curl -X POST http://127.0.0.1:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'

# Query Block Number
curl -X POST http://127.0.0.1:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

---

## 4. Connecting Hardhat & Foundry to Local Node

In your Hardhat configuration (`hardhat.config.ts`):
```typescript
networks: {
  localhost: {
    url: "http://127.0.0.1:8545",
    chainId: 44990,
  }
}
```

Deploy instantly:
```bash
npx hardhat run scripts/deploy.ts --network localhost
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
