// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.

import { ethers } from 'ethers';
import { XolixProvider } from './provider.js';
import { XolixUtils, encodeBech32m } from './utils.js';

export class XolixWallet {
  private internalWallet: ethers.BaseWallet;
  public provider?: XolixProvider;
  public readonly address: string; // 0x...
  public readonly nativeAddress: string; // xol1...

  constructor(privateKeyOrWallet: string | ethers.BaseWallet, provider?: XolixProvider) {
    if (typeof privateKeyOrWallet === 'string') {
      const cleanKey = privateKeyOrWallet.startsWith('0x') ? privateKeyOrWallet : '0x' + privateKeyOrWallet;
      this.internalWallet = new ethers.Wallet(cleanKey);
    } else {
      this.internalWallet = privateKeyOrWallet;
    }

    this.provider = provider;
    this.address = this.internalWallet.address;
    this.nativeAddress = XolixUtils.evmToNativeAddress(this.address, 'xol');
  }

  static createRandom(provider?: XolixProvider): XolixWallet {
    const random = ethers.Wallet.createRandom();
    return new XolixWallet(random, provider);
  }

  static fromMnemonic(mnemonic: string, provider?: XolixProvider): XolixWallet {
    const wallet = ethers.Wallet.fromPhrase(mnemonic);
    return new XolixWallet(wallet, provider);
  }

  connect(provider: XolixProvider): XolixWallet {
    return new XolixWallet(this.internalWallet, provider);
  }

  getPrivateKey(): string {
    return this.internalWallet.privateKey;
  }

  getMnemonic(): string | undefined {
    return (this.internalWallet as ethers.HDNodeWallet).mnemonic?.phrase;
  }

  getStealthAddress(): string {
    const hash = ethers.keccak256(ethers.toUtf8Bytes(this.address));
    const bytes = ethers.getBytes(hash).slice(0, 20);
    return encodeBech32m('xol1s', bytes);
  }

  async signMessage(message: string | Uint8Array): Promise<string> {
    return await this.internalWallet.signMessage(message);
  }

  async signTransaction(tx: ethers.TransactionRequest): Promise<string> {
    return await this.internalWallet.signTransaction(tx);
  }

  async sendTransaction(tx: ethers.TransactionRequest): Promise<ethers.TransactionResponse> {
    if (!this.provider) throw new Error("Wallet is not connected to a XolixProvider");
    const connectedWallet = this.internalWallet.connect(this.provider.getEthersProvider());
    return await connectedWallet.sendTransaction(tx);
  }
}
