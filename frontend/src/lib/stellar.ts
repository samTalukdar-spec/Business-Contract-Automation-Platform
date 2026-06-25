import { StellarWalletsKit, Networks } from '@creit.tech/stellar-wallets-kit';
import { Horizon } from 'stellar-sdk';

export const NETWORK_PASSPHRASE = process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015';
export const HORIZON_URL = process.env.NEXT_PUBLIC_HORIZON_URL || 'https://horizon-testnet.stellar.org';
export const RPC_URL = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org';

export const horizon = new Horizon.Server(HORIZON_URL);

export const CONTRACT_MANAGER_ID = process.env.NEXT_PUBLIC_CONTRACT_MANAGER_ID || 'CONTRACT_MANAGER_ADDRESS_PLACEHOLDER';
export const ESCROW_VAULT_ID = process.env.NEXT_PUBLIC_ESCROW_VAULT_ID || 'ESCROW_VAULT_ADDRESS_PLACEHOLDER';
export const TEST_TOKEN_ID = process.env.NEXT_PUBLIC_TOKEN_ID || 'CDLZFC3SYJYDZT7K67VZ75YJBM22KZCHZ3S3YRYZ76TZVAVZ6S6KZCTO'; // Example Testnet SAC

class WalletKitWrapper {
  private initialized = false;

  async connect() {
    // If in simulation mode, return a mock Freighter address
    if (CONTRACT_MANAGER_ID === 'CONTRACT_MANAGER_ADDRESS_PLACEHOLDER') {
      // Simulate wallet connection latency
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { address: 'GD_USER_FREIGHTER_MOCK_12345' };
    }

    // Real wallet kit setup
    if (!this.initialized) {
      const { FreighterModule } = await import('@creit.tech/stellar-wallets-kit/modules/freighter');
      const { AlbedoModule } = await import('@creit.tech/stellar-wallets-kit/modules/albedo');
      const { xBullModule } = await import('@creit.tech/stellar-wallets-kit/modules/xbull');

      StellarWalletsKit.init({
        network: Networks.TESTNET,
        modules: [
          new FreighterModule(),
          new AlbedoModule(),
          new xBullModule()
        ] as any,
      });
      this.initialized = true;
    }

    return StellarWalletsKit.authModal();
  }

  async disconnect() {
    if (CONTRACT_MANAGER_ID === 'CONTRACT_MANAGER_ADDRESS_PLACEHOLDER') {
      return;
    }
    return StellarWalletsKit.disconnect();
  }

  async signTransaction(xdr: string) {
    if (CONTRACT_MANAGER_ID === 'CONTRACT_MANAGER_ADDRESS_PLACEHOLDER') {
      return 'simulated_signature_xdr';
    }
    return StellarWalletsKit.signTransaction(xdr);
  }
}

export const walletsKit = new WalletKitWrapper();
