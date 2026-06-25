import { create } from 'zustand';

export interface Transaction {
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
  description: string;
  contract?: string;
}

export interface Milestone {
  id: number;
  description: string;
  amount: string;
  is_completed: boolean;
}

export interface Contract {
  id: string;
  title: string;
  description: string;
  termsHash: string;
  client: string;
  provider: string;
  state: number; // 0 = Active, 1 = Signed, 2 = Completed, 3 = Disputed
  totalAmount: string;
  milestones: Milestone[];
  escrowBalance: string;
}

interface AppState {
  address: string | null;
  isConnected: boolean;
  transactions: Transaction[];
  contracts: Contract[];
  network: 'testnet' | 'mainnet';
  
  setAddress: (address: string | null) => void;
  setConnected: (connected: boolean) => void;
  addTransaction: (tx: Transaction) => void;
  updateTransaction: (hash: string, status: Transaction['status']) => void;
  setContracts: (contracts: Contract[]) => void;
  setNetwork: (network: 'testnet' | 'mainnet') => void;
  
  // Simulation Actions
  createSimulatedContract: (contract: Omit<Contract, 'id' | 'state' | 'escrowBalance'>) => string;
  signSimulatedContract: (contractId: string, signer: string) => void;
  depositSimulatedEscrow: (contractId: string, amount: string) => void;
  completeSimulatedMilestone: (contractId: string, milestoneId: number) => void;
}

// Helper to generate initial mock contracts using a given address or fallback
const getInitialContracts = (userAddr: string | null): Contract[] => {
  const activeUser = userAddr || 'GB_CLIENT_PLACEHOLDER_12345';
  const mockProvider = 'GD_PROVIDER_MOCK_67890';
  const mockClient = 'GB_CLIENT_MOCK_54321';
  
  return [
    {
      id: '1',
      title: 'Decentralized Marketing Campaign',
      description: 'Create social media assets, run influencer outreach, and manage monthly ad spend.',
      termsHash: 'QmXyZ...5a3f9',
      client: mockClient,
      provider: activeUser, // User is the provider/worker
      state: 0, // Active - needs signature!
      totalAmount: '3000',
      escrowBalance: '0',
      milestones: [
        { id: 1, description: 'Social media assets delivery', amount: '1000', is_completed: false },
        { id: 2, description: 'Influencer outreach launch', amount: '2000', is_completed: false },
      ],
    },
    {
      id: '2',
      title: 'Smart Contract Security Audit',
      description: 'Audit the LexStellar manager and vault contracts for vulnerabilities and compile optimization checks.',
      termsHash: 'QmPqR...1b7e4',
      client: activeUser, // User is the client
      provider: mockProvider,
      state: 1, // Signed - ready for Escrow deposit!
      totalAmount: '5000',
      escrowBalance: '0',
      milestones: [
        { id: 1, description: 'Initial code scan & vulnerability report', amount: '2500', is_completed: false },
        { id: 2, description: 'Final validation & verification check', amount: '2500', is_completed: false },
      ],
    },
    {
      id: '3',
      title: 'LexStellar Integration',
      description: 'Integrate the Next.js frontend with Freighter wallet and mock local contract simulator.',
      termsHash: 'QmAud...8s2d9',
      client: activeUser, // User is the client
      provider: mockProvider,
      state: 1, // Signed and Funded
      totalAmount: '4000',
      escrowBalance: '2500', // 1500 released
      milestones: [
        { id: 1, description: 'Architecture review & API draft', amount: '1500', is_completed: true },
        { id: 2, description: 'Frontend integration & testing', amount: '2500', is_completed: false }, // Client can complete this!
      ],
    },
  ];
};

export const useStore = create<AppState>((set) => ({
  address: null,
  isConnected: false,
  transactions: [],
  contracts: getInitialContracts(null),
  network: 'testnet',

  setAddress: (address) => set((state) => {
    // When the address changes, update the mock contracts to use the user's actual address
    // while preserving any custom ones they created.
    const currentContracts = state.contracts;
    const updatedContracts = currentContracts.map((c) => {
      const isMockClient = c.client.includes('GB_CLIENT_PLACEHOLDER') || c.client.includes('GB_CLIENT_MOCK');
      const isMockProvider = c.provider.includes('GD_PROVIDER_MOCK');
      
      let updatedClient = c.client;
      let updatedProvider = c.provider;
      
      if (address) {
        if (c.id === '1') {
          updatedProvider = address; // User is provider
        } else if (c.id === '2' || c.id === '3') {
          updatedClient = address; // User is client
        }
      }
      return { ...c, client: updatedClient, provider: updatedProvider };
    });

    return {
      address,
      contracts: updatedContracts,
    };
  }),

  setConnected: (connected) => set({ isConnected: connected }),

  addTransaction: (tx) => set((state) => ({ 
    transactions: [tx, ...state.transactions].slice(0, 50) 
  })),

  updateTransaction: (hash, status) => set((state) => ({
    transactions: state.transactions.map((tx) => 
      tx.hash === hash ? { ...tx, status } : tx
    )
  })),

  setContracts: (contracts) => set({ contracts }),
  
  setNetwork: (network) => set({ network }),

  // Simulation Actions implementation
  createSimulatedContract: (contractData) => {
    const newId = Math.random().toString(36).substring(2, 9);
    const newContract: Contract = {
      ...contractData,
      id: newId,
      state: 0, // Active
      escrowBalance: '0',
    };
    
    set((state) => ({
      contracts: [...state.contracts, newContract]
    }));
    
    return newId;
  },

  signSimulatedContract: (contractId, signer) => {
    set((state) => ({
      contracts: state.contracts.map((c) => {
        if (c.id !== contractId) return c;
        // In this prototype multisig simulation: if provider signs, contract becomes Signed
        if (signer.toLowerCase() === c.provider.toLowerCase()) {
          return { ...c, state: 1 }; // Signed
        }
        return c;
      })
    }));
  },

  depositSimulatedEscrow: (contractId, amount) => {
    set((state) => ({
      contracts: state.contracts.map((c) => {
        if (c.id !== contractId) return c;
        const currentBalance = BigInt(c.escrowBalance);
        const addedAmount = BigInt(amount);
        return {
          ...c,
          escrowBalance: (currentBalance + addedAmount).toString()
        };
      })
    }));
  },

  completeSimulatedMilestone: (contractId, milestoneId) => {
    set((state) => ({
      contracts: state.contracts.map((c) => {
        if (c.id !== contractId) return c;
        
        let milestoneAmount = '0';
        const updatedMilestones = c.milestones.map((m) => {
          if (m.id === milestoneId) {
            milestoneAmount = m.amount;
            return { ...m, is_completed: true };
          }
          return m;
        });

        const allCompleted = updatedMilestones.every((m) => m.is_completed);
        const newState = allCompleted ? 2 : c.state; // 2 = Completed
        
        // Subtract released milestone amount from escrow vault balance
        const currentEscrow = BigInt(c.escrowBalance);
        const releaseAmt = BigInt(milestoneAmount);
        const newEscrow = currentEscrow >= releaseAmt ? currentEscrow - releaseAmt : BigInt(0);

        return {
          ...c,
          milestones: updatedMilestones,
          state: newState,
          escrowBalance: newEscrow.toString()
        };
      })
    }));
  }
}));
