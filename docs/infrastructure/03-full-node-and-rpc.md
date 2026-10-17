# Running a Full RPC Node

This guide explains how developers, exchanges, indexers, and dApps can run their own native **Full RPC Node** on XOLIX FLUID to query state, listen to events, and submit transactions without rate limits.

---

## 1. RPC Node vs Validator Node

| Feature | Full RPC Node | Validator Node |
| :--- | :--- | :--- |
| **Purpose** | Serves JSON-RPC / WebSocket queries | Participates in consensus & signs blocks |
| **Consensus Key** | Not required | Required (holds staked voting power) |
| **Exposed Ports** | `8545` (HTTP), `8546` (WS), `30303` (P2P) | Only `30303` (P2P Mesh) |
| **Slashing Risk** | **Zero** (no stake at risk) | Stake can be slashed if double-signing |
| **Hardware** | 8 CPU, 16 GB RAM, 1 TB SSD | 8 CPU, 32 GB RAM, 2 TB NVMe SSD |

---

## 2. Configuration (`config.toml`)

Create `/var/lib/xolix/rpc-config.toml`:

```toml
[node]
moniker = "Public-RPC-Node-01"
network = "mainnet"
data_dir = "/var/lib/xolix/data"

[p2p]
listen_addr = "0.0.0.0:30303"
max_peers = 100
bootnodes = [
  "enode://xolix-seed1@seed1.xolix.io:30303",
  "enode://xolix-seed2@seed2.xolix.io:30303",
  "enode://xolix-seed3@seed3.xolix.io:30303"
]

[rpc]
enabled = true
http_addr = "127.0.0.1:8545"
ws_addr = "127.0.0.1:8546"
cors_domains = ["*"]
api_modules = ["eth", "net", "web3", "fluid", "txpool"]
max_connections = 5000

[consensus]
validator_mode = false # RPC nodes do not propose or sign blocks
```

---

## 3. Reverse Proxy & SSL Setup (Nginx)

In production, place Nginx in front of your node to terminate SSL and protect against DoS attacks:

```nginx
server {
    listen 80;
    server_name rpc.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name rpc.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/rpc.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/rpc.yourdomain.com/privkey.pem;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=rpc_limit:10m rate=100r/s;
    limit_req zone=rpc_limit burst=20 nodelay;

    # HTTP JSON-RPC
    location / {
        proxy_pass http://127.0.0.1:8545;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 60s;
    }

    # WebSocket Stream
    location /ws {
        proxy_pass http://127.0.0.1:8546;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400s;
    }
}
```

---

## 4. Testing Your Node

Test your local RPC endpoint with `curl`:

```bash
# Check node chain ID
curl -X POST http://127.0.0.1:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'

# Expected response: {"jsonrpc":"2.0","id":1,"result":"0xafbe"} (Mainnet 44990, or "0xafbf" for Testnet 44991)
```

```bash
# Check latest block number
curl -X POST http://127.0.0.1:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

---

## 5. Connecting dApps & SDK

To connect your dApp or script to your own native RPC:

```typescript
import { XolixProvider } from '@xolix/sdk';

// Connect to your private node
const provider = new XolixProvider('https://rpc.yourdomain.com');

const blockNumber = await provider.getBlockNumber();
console.log(`Current block height: ${blockNumber}`);
```
