// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.

import { ethers } from 'ethers';
import { Contract } from './contract.js';
import { XolixProvider } from './provider.js';
import { XolixWallet } from './wallet.js';

const STANDARD_ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address recipient, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address sender, address recipient, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

export class Token {
  public readonly address: string;
  private contract: Contract;

  constructor(address: string, runner: XolixProvider | XolixWallet) {
    this.address = address;
    this.contract = new Contract(address, STANDARD_ERC20_ABI, runner);
  }

  async getName(): Promise<string> {
    return await this.contract.read("name");
  }

  async getSymbol(): Promise<string> {
    return await this.contract.read("symbol");
  }

  async getDecimals(): Promise<number> {
    return await this.contract.read("decimals");
  }

  async getTotalSupply(): Promise<bigint> {
    return await this.contract.read("totalSupply");
  }

  async getBalance(account: string): Promise<bigint> {
    return await this.contract.read("balanceOf", [account]);
  }

  async transfer(recipient: string, amount: bigint | string): Promise<ethers.TransactionResponse> {
    return await this.contract.write("transfer", [recipient, amount]);
  }

  async approve(spender: string, amount: bigint | string): Promise<ethers.TransactionResponse> {
    return await this.contract.write("approve", [spender, amount]);
  }

  async getAllowance(owner: string, spender: string): Promise<bigint> {
    return await this.contract.read("allowance", [owner, spender]);
  }
}
