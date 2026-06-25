'use client';

import { useState } from 'react';
import { useContracts } from '@/hooks/useContracts';
import { useWallet } from '@/hooks/useWallet';
import { ContractService } from '@/services/contractService';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Coins, 
  ArrowUpRight, 
  ShieldAlert,
  Sparkles,
  Plus,
  CreditCard,
  User,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileCheck
} from 'lucide-react';
import Link from 'next/link';

export default function ContractsPage() {
  const contracts = useContracts();
  const { address, isConnected, connect } = useWallet();
  const { toast } = useToast();
  const activeAddr = address || '';
  
  // UI states
  const [filter, setFilter] = useState<'all' | 'client' | 'provider' | 'active' | 'completed'>('all');
  const [expandedContractId, setExpandedContractId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // contractId_action

  const handleConnect = async () => {
    try {
      await connect();
      toast({ title: 'Wallet Connected', description: 'Accessing your Stellar contract dashboard.' });
    } catch (err) {
      toast({ title: 'Connection Failed', description: 'Failed to connect Freighter/Stellar wallet.', variant: 'destructive' });
    }
  };

  const handleSign = async (contractId: string) => {
    if (!address) return;
    const actionKey = `${contractId}_sign`;
    setActionLoading(actionKey);
    try {
      toast({ title: 'Signing contract...', description: 'Requesting auth signature.' });
      await ContractService.signContract(contractId, address);
      toast({ title: 'Agreement Signed', description: 'You have signed this agreement successfully.' });
    } catch (err) {
      toast({ title: 'Signature Failed', description: 'Signing transaction was rejected.', variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeposit = async (contractId: string, amount: string) => {
    if (!address) return;
    const actionKey = `${contractId}_deposit`;
    setActionLoading(actionKey);
    try {
      toast({ title: 'Depositing to Escrow...', description: `Transferring ${amount} XLM into custody.` });
      await ContractService.depositToEscrow(address, contractId, amount);
      toast({ title: 'Escrow Funded', description: `${amount} XLM is now locked in secure custody.` });
    } catch (err) {
      toast({ title: 'Deposit Failed', description: 'Transfer failed or rejected.', variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCompleteMilestone = async (contractId: string, milestoneId: number, amount: string) => {
    if (!address) return;
    const actionKey = `${contractId}_milestone_${milestoneId}`;
    setActionLoading(actionKey);
    try {
      toast({ title: 'Releasing Funds...', description: `Approving milestone work and transferring ${amount} XLM.` });
      await ContractService.completeMilestone(contractId, milestoneId, address);
      toast({ title: 'Milestone Completed', description: `${amount} XLM released to provider.` });
    } catch (err) {
      toast({ title: 'Approval Failed', description: 'Failed to authorize milestone completion.', variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  // Filter logic
  const filteredContracts = contracts.filter((c) => {
    if (!activeAddr) return false;
    const isUserClient = c.client.toLowerCase() === activeAddr.toLowerCase();
    const isUserProvider = c.provider.toLowerCase() === activeAddr.toLowerCase();

    if (filter === 'client') return isUserClient;
    if (filter === 'provider') return isUserProvider;
    if (filter === 'active') return c.state === 1;
    if (filter === 'completed') return c.state === 2;
    return true;
  });

  const getStatusBadge = (state: number, balance: string, total: string) => {
    if (state === 0) {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Clock className="w-3 h-3" />
          Awaiting Signatures
        </span>
      );
    }
    if (state === 1) {
      const isFunded = BigInt(balance) >= BigInt(total);
      if (isFunded) {
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
            <Coins className="w-3 h-3 text-orange-500" />
            Active & Funded
          </span>
        );
      } else {
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <CreditCard className="w-3 h-3" />
            Awaiting Deposit
          </span>
        );
      }
    }
    if (state === 2) {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" />
          Fully Settled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
        <ShieldAlert className="w-3 h-3" />
        Disputed
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white" id="page-title">My Agreements</h1>
          <p className="text-slate-400">Review lifecycle states, escrow balances, and release milestones.</p>
        </div>
        {isConnected && (
          <Link 
            href="/contracts/new"
            className={cn(
              buttonVariants({ variant: 'default' }),
              "bg-orange-500 hover:bg-orange-600 font-medium rounded-full text-white shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all h-8 gap-1.5 px-2.5"
            )}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Agreement
          </Link>
        )}
      </div>

      {!isConnected ? (
        /* Wallet Connection Prompt */
        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl py-12 text-center max-w-xl mx-auto">
          <CardHeader className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <FileCheck className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Connect Your Wallet</CardTitle>
              <CardDescription className="max-w-sm mt-2 text-slate-400">
                You need a connected Stellar account to review contract milestones and manage automated payouts.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <Button 
              id="connect-wallet-prompt-btn"
              onClick={handleConnect}
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full px-8 shadow-[0_0_20px_rgba(249,115,22,0.4)]"
            >
              Connect Freighter Wallet
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Authenticated Contracts Area */
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-slate-950 border border-slate-800 rounded-xl w-fit">
            {[
              { id: 'all', label: 'All Contracts' },
              { id: 'client', label: 'As Client' },
              { id: 'provider', label: 'As Provider' },
              { id: 'active', label: 'Active/Signed' },
              { id: 'completed', label: 'Settled' }
            ].map((tab) => (
              <button
                key={tab.id}
                id={`filter-${tab.id}`}
                onClick={() => setFilter(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  filter === tab.id 
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Contracts Grid/List */}
          {filteredContracts.length === 0 ? (
            <Card className="bg-slate-900/20 border-slate-800 border-dashed p-12 text-center">
              <CardContent className="flex flex-col items-center gap-4">
                <FileText className="w-12 h-12 text-slate-600" />
                <div>
                  <h3 className="text-lg font-semibold text-white">No contracts found</h3>
                  <p className="text-sm text-slate-500 mt-1">There are no agreements matching the current filter.</p>
                </div>
                <Button variant="outline" className="border-slate-700 mt-2" onClick={() => setFilter('all')}>
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredContracts.map((contract) => {
                const totalMilestones = contract.milestones.length;
                const completedMilestones = contract.milestones.filter(m => m.is_completed).length;
                const progressPercentage = totalMilestones > 0 
                  ? Math.round((completedMilestones / totalMilestones) * 100) 
                  : 0;

                const isUserClient = contract.client.toLowerCase() === activeAddr.toLowerCase();
                const isUserProvider = contract.provider.toLowerCase() === activeAddr.toLowerCase();
                
                const isExpanded = expandedContractId === contract.id;
                
                return (
                  <Card 
                    key={contract.id} 
                    className="bg-slate-900/40 border-slate-800 hover:border-slate-700/80 transition-all overflow-hidden duration-300 relative group"
                  >
                    {/* Decorative card glow */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-2xl group-hover:bg-orange-500/10 transition-all rounded-full pointer-events-none" />

                    <CardHeader className="pb-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-500 bg-slate-950 border border-slate-850 px-2 py-0.5 rounded">
                              ID: #{contract.id}
                            </span>
                            {getStatusBadge(contract.state, contract.escrowBalance, contract.totalAmount)}
                          </div>
                          <CardTitle className="text-xl font-bold text-white mt-2">{contract.title}</CardTitle>
                          <CardDescription className="max-w-2xl text-slate-400">{contract.description}</CardDescription>
                        </div>
                        
                        {/* Summary Metrics */}
                        <div className="flex flex-row md:flex-col items-baseline md:items-end justify-between md:justify-start gap-1 p-3 rounded-xl bg-slate-950 border border-slate-850">
                          <span className="text-[10px] uppercase font-bold text-slate-500">Contract Value</span>
                          <span className="text-xl font-extrabold text-orange-500">{contract.totalAmount} XLM</span>
                          {contract.state === 1 && (
                            <span className="text-[10px] text-slate-400 font-semibold font-mono">
                              Vault: {contract.escrowBalance} / {contract.totalAmount} XLM
                            </span>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-400">Agreement Payout Progress</span>
                          <span className="text-orange-400">{progressPercentage}% ({completedMilestones}/{totalMilestones} Milestones)</span>
                        </div>
                        <div className="h-2 w-full bg-slate-950 border border-slate-850 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(249,115,22,0.4)]" 
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Expandable Milestone Details */}
                      {isExpanded && (
                        <div className="pt-4 border-t border-slate-850 space-y-4 animate-in slide-in-from-top-4 duration-300">
                          <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                            Milestone Schedule
                          </h4>
                          <div className="grid gap-3">
                            {contract.milestones.map((m) => (
                              <div 
                                key={m.id} 
                                className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border text-sm transition-all ${
                                  m.is_completed 
                                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-100' 
                                    : 'bg-slate-950 border-slate-850 text-slate-300'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                    m.is_completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                                  }`}>
                                    {m.id}
                                  </div>
                                  <div>
                                    <p className="font-medium">{m.description}</p>
                                    <p className="text-xs text-slate-500 font-mono mt-0.5">Release Amount: {m.amount} XLM</p>
                                  </div>
                                </div>
                                <div className="mt-3 sm:mt-0 flex items-center gap-2 self-end sm:self-center">
                                  {m.is_completed ? (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                                      <CheckCircle2 className="w-3 h-3" /> Released
                                    </span>
                                  ) : (
                                    <>
                                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                                        <Clock className="w-3 h-3" /> Incomplete
                                      </span>
                                      {/* Only client can release milestones in active state */}
                                      {contract.state === 1 && isUserClient && BigInt(contract.escrowBalance) >= BigInt(m.amount) && (
                                        <Button
                                          id={`release-btn-${contract.id}-${m.id}`}
                                          onClick={() => handleCompleteMilestone(contract.id, m.id, m.amount)}
                                          size="sm"
                                          disabled={actionLoading !== null}
                                          className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg text-xs"
                                        >
                                          {actionLoading === `${contract.id}_milestone_${m.id}` ? 'Releasing...' : 'Approve & Release'}
                                        </Button>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Card Footer Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-850">
                        {/* Meta Roles info */}
                        <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            Client: {isUserClient ? 'You (Client)' : `${contract.client.slice(0, 8)}...`}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            Provider: {isUserProvider ? 'You (Provider)' : `${contract.provider.slice(0, 8)}...`}
                          </span>
                        </div>

                        {/* Control buttons */}
                        <div className="flex gap-2">
                          {/* Sign action for provider */}
                          {contract.state === 0 && isUserProvider && (
                            <Button 
                              id={`sign-btn-${contract.id}`}
                              onClick={() => handleSign(contract.id)}
                              disabled={actionLoading !== null}
                              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:opacity-90"
                            >
                              {actionLoading === `${contract.id}_sign` ? 'Signing...' : 'Sign Agreement'}
                            </Button>
                          )}

                          {/* Funding action for client */}
                          {contract.state === 1 && isUserClient && BigInt(contract.escrowBalance) < BigInt(contract.totalAmount) && (
                            <Button 
                              id={`fund-btn-${contract.id}`}
                              onClick={() => handleDeposit(contract.id, (BigInt(contract.totalAmount) - BigInt(contract.escrowBalance)).toString())}
                              disabled={actionLoading !== null}
                              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg"
                            >
                              {actionLoading === `${contract.id}_deposit` ? 'Funding...' : 'Fund Escrow Vault'}
                            </Button>
                          )}

                          <Button
                            id={`toggle-milestones-${contract.id}`}
                            variant="ghost"
                            onClick={() => setExpandedContractId(isExpanded ? null : contract.id)}
                            className="text-slate-400 hover:text-white"
                          >
                            {isExpanded ? (
                              <>Hide Milestones <ChevronUp className="ml-1 w-4 h-4" /></>
                            ) : (
                              <>Show Milestones <ChevronDown className="ml-1 w-4 h-4" /></>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
