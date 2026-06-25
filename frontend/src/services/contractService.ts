import { 
  Contract, 
  Address, 
  xdr, 
  scValToNative, 
  nativeToScVal,
  TransactionBuilder,
  TimeoutInfinite,
} from 'stellar-sdk';
import { 
  RPC_URL, 
  NETWORK_PASSPHRASE, 
  CONTRACT_MANAGER_ID,
  ESCROW_VAULT_ID,
  horizon,
  walletsKit
} from '@/lib/stellar';
import { useStore } from '@/store/useStore';

export class ContractService {
  static async createContract(
    client: string,
    provider: string,
    title: string,
    termsHash: string,
    milestones: any[]
  ) {
    if (CONTRACT_MANAGER_ID === 'CONTRACT_MANAGER_ADDRESS_PLACEHOLDER') {
      const store = useStore.getState();
      const newContractId = store.createSimulatedContract({
        title,
        description: 'Automated escrow agreement deployed via contract wizard.',
        termsHash,
        client,
        provider,
        milestones: milestones.map((m, idx) => ({
          id: idx + 1,
          description: m.description,
          amount: m.amount.toString(),
          is_completed: false
        })),
        totalAmount: milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0).toString(),
      });

      const txHash = 'tx_' + Math.random().toString(36).substring(2, 15);
      store.addTransaction({
        hash: txHash,
        status: 'confirmed',
        timestamp: Date.now(),
        description: `Created Contract: "${title}"`,
        contract: newContractId,
      });

      return { id: newContractId, hash: txHash };
    }

    const contract = new Contract(CONTRACT_MANAGER_ID);
    
    // Convert milestones to ScVals
    const scMilestones = milestones.map(m => nativeToScVal({
      id: m.id,
      description: m.description,
      amount: BigInt(m.amount),
      is_completed: false
    }));

    const tx = await this.prepareInvoke(
      client,
      contract,
      'create_contract',
      [
        new Address(client).toScVal(),
        new Address(provider).toScVal(),
        nativeToScVal(title),
        nativeToScVal(termsHash),
        xdr.ScVal.scvVec(scMilestones)
      ]
    );

    return this.signAndSubmit(tx);
  }

  static async signContract(contractId: string | number, signer: string) {
    if (CONTRACT_MANAGER_ID === 'CONTRACT_MANAGER_ADDRESS_PLACEHOLDER') {
      const store = useStore.getState();
      const strId = contractId.toString();
      store.signSimulatedContract(strId, signer);
      
      const txHash = 'tx_' + Math.random().toString(36).substring(2, 15);
      store.addTransaction({
        hash: txHash,
        status: 'confirmed',
        timestamp: Date.now(),
        description: `Signed Contract ID: ${strId}`,
        contract: strId,
      });
      return { hash: txHash };
    }

    const contract = new Contract(CONTRACT_MANAGER_ID);
    const tx = await this.prepareInvoke(
      signer,
      contract,
      'sign_contract',
      [
        nativeToScVal(Number(contractId)),
        new Address(signer).toScVal()
      ]
    );
    return this.signAndSubmit(tx);
  }

  static async depositToEscrow(from: string, contractId: string | number, amount: string) {
    if (CONTRACT_MANAGER_ID === 'CONTRACT_MANAGER_ADDRESS_PLACEHOLDER') {
      const store = useStore.getState();
      const strId = contractId.toString();
      store.depositSimulatedEscrow(strId, amount);

      const txHash = 'tx_' + Math.random().toString(36).substring(2, 15);
      store.addTransaction({
        hash: txHash,
        status: 'confirmed',
        timestamp: Date.now(),
        description: `Deposited ${amount} XLM to Escrow for Contract ID: ${strId}`,
        contract: strId,
      });
      return { hash: txHash };
    }

    const contract = new Contract(ESCROW_VAULT_ID);
    const tx = await this.prepareInvoke(
      from,
      contract,
      'deposit',
      [
        new Address(from).toScVal(),
        nativeToScVal(Number(contractId)),
        nativeToScVal(BigInt(amount))
      ]
    );
    return this.signAndSubmit(tx);
  }

  static async completeMilestone(contractId: string | number, milestoneId: number, client: string) {
    if (CONTRACT_MANAGER_ID === 'CONTRACT_MANAGER_ADDRESS_PLACEHOLDER') {
      const store = useStore.getState();
      const strId = contractId.toString();
      store.completeSimulatedMilestone(strId, milestoneId);

      const txHash = 'tx_' + Math.random().toString(36).substring(2, 15);
      store.addTransaction({
        hash: txHash,
        status: 'confirmed',
        timestamp: Date.now(),
        description: `Released Escrow Milestone #${milestoneId} for Contract ID: ${strId}`,
        contract: strId,
      });
      return { hash: txHash };
    }

    const contract = new Contract(CONTRACT_MANAGER_ID);
    const tx = await this.prepareInvoke(
      client,
      contract,
      'complete_milestone',
      [
        nativeToScVal(Number(contractId)),
        nativeToScVal(milestoneId)
      ]
    );
    return this.signAndSubmit(tx);
  }

  private static async prepareInvoke(
    source: string,
    contract: Contract,
    method: string,
    args: xdr.ScVal[]
  ) {
    const account = await horizon.loadAccount(source);
    const operation = contract.call(method, ...args);
    
    const tx = new TransactionBuilder(account, {
      fee: '1000',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
    .addOperation(operation)
    .setTimeout(TimeoutInfinite)
    .build();

    return tx;
  }

  private static async signAndSubmit(tx: any) {
    const signedTx = await walletsKit.signTransaction(tx.toXDR());
    const result = await horizon.submitTransaction(signedTx as any);
    return result;
  }
}
