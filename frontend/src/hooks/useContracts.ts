import { useStore } from '@/store/useStore';

export const useContracts = () => {
  const contracts = useStore((state) => state.contracts);
  const address = useStore((state) => state.address);

  if (!address) return [];

  // Return contracts where the connected wallet is either client or provider
  return contracts.filter(
    (c) => 
      c.client.toLowerCase() === address.toLowerCase() || 
      c.provider.toLowerCase() === address.toLowerCase()
  );
};
