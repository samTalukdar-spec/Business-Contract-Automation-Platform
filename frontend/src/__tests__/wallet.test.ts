import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useStore } from '../store/useStore';

// Test the store-level wallet state management
describe('Wallet State Management', () => {
  beforeEach(() => {
    useStore.setState({
      address: null,
      isConnected: false,
    });
  });

  it('should set connected state when wallet connects', () => {
    const store = useStore.getState();
    store.setAddress('GABCDEFGHIJKLMNOPQRSTUVWXYZ234567');
    store.setConnected(true);

    const state = useStore.getState();
    expect(state.isConnected).toBe(true);
    expect(state.address).toBe('GABCDEFGHIJKLMNOPQRSTUVWXYZ234567');
  });

  it('should clear state when wallet disconnects', () => {
    const store = useStore.getState();
    store.setAddress('GABCDEF...');
    store.setConnected(true);

    store.setAddress(null);
    store.setConnected(false);

    const state = useStore.getState();
    expect(state.isConnected).toBe(false);
    expect(state.address).toBeNull();
  });

  it('should handle contract list updates', () => {
    const store = useStore.getState();
    store.setContracts([
      { 
        id: '1', 
        title: 'Test', 
        description: 'Test description',
        termsHash: 'QmHash123',
        client: 'G...', 
        provider: 'G...', 
        state: 0, 
        totalAmount: '100',
        milestones: [],
        escrowBalance: '0'
      },
    ]);

    expect(useStore.getState().contracts).toHaveLength(1);
    expect(useStore.getState().contracts[0].title).toBe('Test');
  });
});
