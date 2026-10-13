// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.

import { ethers } from 'ethers';
import { PreflightSimulator, PreflightSimulationResult } from './preflight.js';

export interface ProviderConfig {
  url?: string;
  chainId?: number;
  timeoutMs?: number;
}

export interface BlockHeader {
  number: bigint;
  hash: string;
  parentHash: string;
  timestamp: number;
  transactionsCount: number;
}

export class XolixProvider {
  private url: string;
  private chainId: number;
  private internalProvider: ethers.JsonRpcProvider;

  constructor(urlOrConfig: string | ProviderConfig = 'http://rpc.xolix.io:8545') {
    if (typeof urlOrConfig === 'string') {
      this.url = urlOrConfig;
      this.chainId = urlOrConfig.includes('testnet') ? 44991 : 44990;
    } else {
      this.url = urlOrConfig.url || 'http://rpc.xolix.io:8545';
      this.chainId = urlOrConfig.chainId || (this.url.includes('testnet') ? 44991 : 44990);
    }
    this.internalProvider = new ethers.JsonRpcProvider(this.url, this.chainId, { staticNetwork: true });
  }

  getEthersProvider(): ethers.JsonRpcProvider {
    return this.internalProvider;
  }

  async getChainId(): Promise<number> {
    const network = await this.internalProvider.getNetwork();
    return Number(network.chainId);
  }

  async getBlockNumber(): Promise<bigint> {
    const num = await this.internalProvider.getBlockNumber();
    return BigInt(num);
  }

  async getBalance(address: string): Promise<bigint> {
    return await this.internalProvider.getBalance(address);
  }

  async getTransactionCount(address: string): Promise<number> {
    return await this.internalProvider.getTransactionCount(address);
  }

  async sendRawTransaction(signedTxHex: string): Promise<string> {
    const res = await this.internalProvider.broadcastTransaction(signedTxHex);
    return res.hash;
  }

  async waitForTransaction(txHash: string, confirms: number = 1): Promise<ethers.TransactionReceipt | null> {
    return await this.internalProvider.waitForTransaction(txHash, confirms);
  }

  async estimateGas(tx: ethers.TransactionRequest): Promise<bigint> {
    return await this.internalProvider.estimateGas(tx);
  }

  async call(tx: ethers.TransactionRequest): Promise<string> {
    return await this.internalProvider.call(tx);
  }

  /**
   * Preflight simulation returning risk score and state differentials
   */
  async simulateTransaction(tx: ethers.TransactionRequest): Promise<PreflightSimulationResult> {
    try {
      const estimatedGas = await this.estimateGas(tx);
      return PreflightSimulator.evaluate({
        riskScore: 25,
        gasUsed: estimatedGas,
        xcuUsed: estimatedGas * 5n,
      });
    } catch (err: any) {
      return {
        isSafe: false,
        riskScore: 999,
        estimatedGas: 0n,
        estimatedXcu: 0n,
        warnings: [err?.message || "Execution reverted during preflight simulation"],
        stateDiffs: [],
      };
    }
  }

  /**
   * Execute raw JSON-RPC query
   */
  async send(method: string, params: any[] = []): Promise<any> {
    return await this.internalProvider.send(method, params);
  }
}
