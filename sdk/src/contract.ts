// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.

import { ethers } from 'ethers';
import { XolixProvider } from './provider.js';
import { XolixWallet } from './wallet.js';

export class Contract {
  public address: string;
  public interface: ethers.Interface;
  private internalContract: ethers.Contract;

  constructor(
    address: string,
    abi: any[] | ethers.Interface,
    runner: XolixProvider | XolixWallet
  ) {
    this.address = address;
    this.interface = Array.isArray(abi) ? new ethers.Interface(abi) : abi;

    const ethersRunner = runner instanceof XolixWallet
      ? (runner.provider ? runner['internalWallet'].connect(runner.provider.getEthersProvider()) : runner['internalWallet'])
      : runner.getEthersProvider();

    this.internalContract = new ethers.Contract(address, this.interface, ethersRunner);

    // Proxy method invocations to the internal contract
    return new Proxy(this, {
      get(target, prop, receiver) {
        if (prop in target) {
          return (target as any)[prop];
        }
        if (typeof (target.internalContract as any)[prop] === 'function') {
          return (...args: any[]) => (target.internalContract as any)[prop](...args);
        }
        return (target.internalContract as any)[prop];
      },
    });
  }

  async read(methodName: string, args: any[] = []): Promise<any> {
    return await (this.internalContract as any)[methodName](...args);
  }

  async write(methodName: string, args: any[] = [], overrides: any = {}): Promise<ethers.TransactionResponse> {
    return await (this.internalContract as any)[methodName](...args, overrides);
  }
}

export class ContractFactory {
  private internalFactory: ethers.ContractFactory;

  constructor(
    abi: any[],
    bytecode: string,
    wallet: XolixWallet
  ) {
    if (!wallet.provider) throw new Error("Wallet must be connected to a XolixProvider to deploy contracts");
    const signer = wallet['internalWallet'].connect(wallet.provider.getEthersProvider());
    this.internalFactory = new ethers.ContractFactory(abi, bytecode, signer);
  }

  async deploy(...args: any[]): Promise<Contract> {
    const deployed = await this.internalFactory.deploy(...args);
    await deployed.waitForDeployment();
    const address = await deployed.getAddress();
    return new Contract(address, this.internalFactory.interface as any, deployed.runner as any);
  }
}
