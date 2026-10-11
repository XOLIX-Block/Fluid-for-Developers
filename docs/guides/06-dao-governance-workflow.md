# DAO Governance: Proposals & Voting

This guide documents the **deployed** `XolixGovernance` contract exactly as it exists in the XolixScan contract sources (`src/contracts/XolixGovernance.sol`). It does not describe features the contract does not have.

---

## 1. Deployed Addresses (Mainnet, Chain ID 44990)

| Contract | Address |
| :--- | :--- |
| Governance token (`GXO`, `GovernanceXolix`) | `0x67f629477Ec16FafcE766169052601CC551bb9f9` |
| DAO Treasury (`DaoTreasury`) | `0x99ACA09Fa6bc30b360A018e5d33c7e0768d0E7b1` |

> [!NOTE]
> The `XolixGovernance` proposal contract is constructed with the governance token address. Confirm its deployed address on [XolixScan](https://scan.xolix.io) before sending transactions.

---

## 2. What the Contract Does Today

```solidity
function createProposal(string title, string description) public;   // caller must hold > 0 governance tokens
function vote(uint proposalId, bool inFavor) public;                // one vote per address, weight = current token balance
function getProposals() public view returns (ProposalView[] memory);
event ProposalCreated(uint id, address indexed proposer, string title);
event Voted(uint indexed proposalId, address indexed voter, bool inFavor, uint weight);
```

Proposal status values: `Pending, Active, Passed, Failed, Executed`.

### Current limitations (important for integrators)

- **No on-chain execution**: proposals are signalling records. There is no calldata/target execution in this contract.
- **No end-of-voting, quorum, or timelock logic** is implemented yet (the source notes these as future functions). Do not assume a voting period, quorum, or timelock.
- **Vote weight uses the live `balanceOf`** at vote time (not a historical snapshot). Tokens can be moved between addresses and re-used, so treat results as non-binding signals until snapshotting is added.
- Protocol-level governance parameters in the node (`governanceQuorumPercent = 67`, `governanceTimelockBlocks = 259200`, `emergencyTimelockBlocks = 21600`) live in `protocol/chainParameters.ts` and are not enforced by this Solidity contract.

---

## 3. Example: Create a Proposal and Vote (ethers v6)

```typescript
import { ethers } from "ethers";

const GOV_ABI = [
  "function createProposal(string title, string description)",
  "function vote(uint256 proposalId, bool inFavor)",
  "function getProposals() view returns (tuple(uint256 id, address proposer, string title, string description, uint256 votesFor, uint256 votesAgainst, uint8 status)[])",
];

const provider = new ethers.JsonRpcProvider("https://rpc.xolix.io", 44990);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
const gov = new ethers.Contract(process.env.GOVERNANCE_ADDRESS!, GOV_ABI, signer);

await (await gov.createProposal("XIP-1: Example", "Description of the proposal")).wait();
await (await gov.vote(0, true)).wait();
console.log(await gov.getProposals());
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
