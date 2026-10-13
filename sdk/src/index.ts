// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.

export { XolixProvider, type ProviderConfig, type BlockHeader } from './provider.js';
export { XolixWallet } from './wallet.js';
export { Contract, ContractFactory } from './contract.js';
export { Token } from './token.js';
export {
  XolixUtils,
  encodeBech32m,
  XOLIX_MAINNET_CHAIN_ID,
  XOLIX_TESTNET_CHAIN_ID,
  XOLIX_MAINNET_RPC_URL,
  XOLIX_MAINNET_HTTPS_GATEWAY_URL,
  XOLIX_TESTNET_RPC_URL,
  XOLIX_MAINNET_WS_URL,
  XOLIX_EXPLORER_URL,
} from './utils.js';
export { PreflightSimulator, type PreflightSimulationResult } from './preflight.js';

// Export ethers utility library for convenience
export { ethers } from 'ethers';
