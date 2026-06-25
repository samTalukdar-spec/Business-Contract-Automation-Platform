import { useCallback } from 'react';
import { walletsKit, NETWORK_PASSPHRASE } from '@/lib/stellar';
import { useStore } from '@/store/useStore';

export const useWallet = () => {
  const { setAddress, setConnected, isConnected, address } = useStore();

  const connect = useCallback(async () => {
    try {
      const { address } = await walletsKit.connect();
      setAddress(address);
      setConnected(true);
      return address;
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  }, [setAddress, setConnected]);

  const disconnect = useCallback(async () => {
    try {
      await walletsKit.disconnect();
      setAddress(null);
      setConnected(false);
    } catch (error) {
      console.error('Wallet disconnection failed:', error);
    }
  }, [setAddress, setConnected]);

  return {
    connect,
    disconnect,
    isConnected,
    address,
  };
};
