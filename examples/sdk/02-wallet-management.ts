/**
 * 02-wallet-management.ts
 * Demonstrates creating native Xolix wallets, restoring from BIP-39 mnemonics,
 * deriving Bech32m addresses (xol1...), stealth addresses (xol1s...), and signing transactions.
 */
import { JsonRpcProvider, XolixWallet, XolixUtils } from '@xolix/sdk';

const TESTNET_RPC = 'https://testnet-rpc.xolix.io';

async function main() {
  const provider = new JsonRpcProvider({ url: TESTNET_RPC });

  // 1. Generate a brand new cryptographically secure 24-word wallet
  const newWallet = XolixWallet.createRandom(provider);
  console.log('--- Newly Generated Native Wallet ---');
  console.log('Mnemonic Phrase (24 words):', newWallet.mnemonic?.phrase);
  console.log('Private Key:              ', newWallet.privateKey);
  console.log('Native Bech32m Address:   ', newWallet.getNativeAddress()); // e.g. xol1...
  console.log('Stealth Privacy Address:  ', newWallet.getStealthAddress()); // e.g. xol1s...
  console.log('EVM Compatibility Address:', newWallet.address);           // e.g. 0x...

  // 2. Restore an existing wallet from mnemonic
  // (Standard BIP-44 Derivation Path: m/44'/60'/0'/0/0)
  const sampleMnemonic = newWallet.mnemonic?.phrase || '';
  const restoredWallet = XolixWallet.fromMnemonic(sampleMnemonic, provider);
  console.log('\n--- Restored Wallet ---');
  console.log('Matches original?:', restoredWallet.address === newWallet.address);

  // 3. Query native balances (XOLT, GXO, QUSD)
  const balances = await provider.getBalances(restoredWallet.getNativeAddress());
  console.log('\n--- Account Balances ---');
  console.log(`XOLT Balance: ${XolixUtils.formatXOL(balances.xolt || 0n)} XOLT`);
  console.log(`GXO Balance:  ${XolixUtils.formatXOL(balances.gxo || 0n)} GXO`);
  console.log(`QUSD Balance: ${XolixUtils.formatXOL(balances.qusd || 0n)} QUSD`);

  // 4. Sign an arbitrary message with private key
  const message = 'Authenticate to XOLIX FLUID dApp';
  const signature = await restoredWallet.signMessage(message);
  console.log('\n--- Message Signing ---');
  console.log('Signature:', signature);
}

main().catch((err) => {
  console.error('Wallet management error:', err);
});
