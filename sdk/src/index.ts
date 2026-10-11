// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.

export { XolixProvider, type ProviderConfig, type BlockHeader } from './provider.js';
export { XolixWallet } from './wallet.js';
export { Contract, ContractFactory } from './contract.js';
export { Token } from './token.js';
export { XolixUtils, encodeBech32m } from './utils.js';
export { PreflightSimulator, type PreflightSimulationResult } from './preflight.js';

// Export ethers utility library for convenience
export { ethers } from 'ethers';
