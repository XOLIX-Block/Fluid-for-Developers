# Smart Contract Testing & Fuzzing Guide

Writing automated unit and fuzz tests is mandatory before deploying any smart contract to **XOLIX FLUID**.

---

## 1. Hardhat Unit Testing (Chai & Ethers.js)

Create `test/MyToken.test.ts`:

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import { MyToken } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("MyToken Contract Tests", function () {
  let token: MyToken;
  let owner: HardhatEthersSigner;
  let alice: HardhatEthersSigner;
  let bob: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, alice, bob] = await ethers.getSigners();

    const MyTokenFactory = await ethers.getContractFactory("MyToken");
    token = await MyTokenFactory.deploy(1_000_000n);
    await token.waitForDeployment();
  });

  it("should initialize with correct total supply and balance", async function () {
    const ownerBalance = await token.balanceOf(owner.address);
    const expectedSupply = ethers.parseEther("1000000");
    expect(ownerBalance).to.equal(expectedSupply);
  });

  it("should transfer tokens successfully between accounts", async function () {
    const transferAmount = ethers.parseEther("100");
    await token.transfer(alice.address, transferAmount);

    expect(await token.balanceOf(alice.address)).to.equal(transferAmount);
  });

  it("should revert if sender has insufficient balance", async function () {
    const hugeAmount = ethers.parseEther("99999999");
    await expect(
      token.connect(alice).transfer(bob.address, hugeAmount)
    ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
  });
});
```

Run tests:
```bash
npx hardhat test
```

---

## 2. Foundry Property-Based Fuzz Testing

Foundry allows fuzz testing where the test framework generates thousands of random inputs:

Create `test/MyToken.t.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/MyToken.sol";

contract MyTokenTest is Test {
    MyToken public token;
    address public owner = address(this);
    address public alice = address(0x1);
    address public bob   = address(0x2);

    function setUp() public {
        token = new MyToken(1_000_000);
    }

    /// @notice Property: Balance of sender + recipient must be invariant across transfers
    function testFuzz_TransferKeepsTotalConstant(uint256 amount) public {
        uint256 ownerInitial = token.balanceOf(owner);
        // Bound random fuzzed amount within owner balance
        amount = bound(amount, 0, ownerInitial);

        token.transfer(alice, amount);

        assertEq(token.balanceOf(owner) + token.balanceOf(alice), ownerInitial);
    }

    /// @notice Invariant: Total supply must never exceed initial mint
    function test_TotalSupplyInvariant() public view {
        assertEq(token.totalSupply(), 1_000_000 * 10 ** 18);
    }
}
```

Run fuzz tests:
```bash
forge test -vvv
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
