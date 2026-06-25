import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../store/useStore';

describe('useStore', () => {
  beforeEach(() => {
    useStore.setState({
      address: null,
      isConnected: false,
      transactions: [],
      contracts: [],
      network: 'testnet',
    });
  });

  it('should set wallet address and connection status', () => {
    const store = useStore.getState();
    store.setAddress('GABCDEF...');
    store.setConnected(true);

    const updated = useStore.getState();
    expect(updated.address).toBe('GABCDEF...');
    expect(updated.isConnected).toBe(true);
  });

  it('should add and update transactions', () => {
    const store = useStore.getState();
    store.addTransaction({
      hash: '0xabc123',
      status: 'pending',
      timestamp: Date.now(),
      description: 'Create Contract',
    });

    let updated = useStore.getState();
    expect(updated.transactions).toHaveLength(1);
    expect(updated.transactions[0].status).toBe('pending');

    store.updateTransaction('0xabc123', 'confirmed');
    updated = useStore.getState();
    expect(updated.transactions[0].status).toBe('confirmed');
  });

  it('should limit transaction history to 50 entries', () => {
    const store = useStore.getState();
    for (let i = 0; i < 60; i++) {
      store.addTransaction({
        hash: `tx_${i}`,
        status: 'confirmed',
        timestamp: Date.now(),
        description: `Transaction ${i}`,
      });
    }
    const updated = useStore.getState();
    expect(updated.transactions).toHaveLength(50);
  });

  it('should switch network', () => {
    const store = useStore.getState();
    store.setNetwork('mainnet');
    expect(useStore.getState().network).toBe('mainnet');
  });

  it('should support simulated contract lifecycle', () => {
    const store = useStore.getState();
    
    // 1. Creation
    const contractId = store.createSimulatedContract({
      title: 'Simulated Project',
      description: 'Audit project',
      termsHash: 'QmHashxyz',
      client: 'G_CLIENT',
      provider: 'G_PROVIDER',
      milestones: [
        { id: 1, description: 'Milestone 1', amount: '1000', is_completed: false },
        { id: 2, description: 'Milestone 2', amount: '2000', is_completed: false }
      ],
      totalAmount: '3000'
    });

    let state = useStore.getState();
    let contract = state.contracts.find(c => c.id === contractId)!;
    expect(contract).toBeDefined();
    expect(contract.state).toBe(0); // Active
    expect(contract.escrowBalance).toBe('0');

    // 2. Signing (only if provider signs)
    store.signSimulatedContract(contractId, 'G_CLIENT'); // should not change state since only provider signs to move to Signed in our simple multisig simulation
    state = useStore.getState();
    contract = state.contracts.find(c => c.id === contractId)!;
    expect(contract.state).toBe(0);

    store.signSimulatedContract(contractId, 'G_PROVIDER'); // provider signs
    state = useStore.getState();
    contract = state.contracts.find(c => c.id === contractId)!;
    expect(contract.state).toBe(1); // Signed

    // 3. Deposit Escrow
    store.depositSimulatedEscrow(contractId, '3000');
    state = useStore.getState();
    contract = state.contracts.find(c => c.id === contractId)!;
    expect(contract.escrowBalance).toBe('3000');

    // 4. Milestone Completion (releases milestone amount)
    store.completeSimulatedMilestone(contractId, 1);
    state = useStore.getState();
    contract = state.contracts.find(c => c.id === contractId)!;
    expect(contract.milestones[0].is_completed).toBe(true);
    expect(contract.escrowBalance).toBe('2000'); // 3000 - 1000 = 2000
    expect(contract.state).toBe(1); // still state 1 (Signed) since milestone 2 is not completed

    // 5. Final Milestone Completion
    store.completeSimulatedMilestone(contractId, 2);
    state = useStore.getState();
    contract = state.contracts.find(c => c.id === contractId)!;
    expect(contract.milestones[1].is_completed).toBe(true);
    expect(contract.escrowBalance).toBe('0'); // 2000 - 2000 = 0
    expect(contract.state).toBe(2); // Completed!
  });
});
