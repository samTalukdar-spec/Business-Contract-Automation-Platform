'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronLeft, 
  FileCheck,
  Send
} from 'lucide-react';
import { ContractService } from '@/services/contractService';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/components/ui/use-toast';

export default function NewContractPage() {
  const [step, setStep] = useState(1);
  const { address } = useWallet();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    provider: '',
    termsHash: 'QmXoyp... (Auto-generated)',
  });

  const [milestones, setMilestones] = useState([
    { id: 1, description: 'Initial Kickoff', amount: '' },
  ]);

  const addMilestone = () => {
    setMilestones([...milestones, { id: milestones.length + 1, description: '', amount: '' }]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!address) {
      toast({ title: 'Error', description: 'Please connect your wallet first.', variant: 'destructive' });
      return;
    }

    try {
      toast({ title: 'Processing', description: 'Deploying contract to Stellar...' });
      await ContractService.createContract(
        address,
        formData.provider,
        formData.title,
        formData.termsHash,
        milestones
      );
      toast({ title: 'Success', description: 'Contract successfully initialized!' });
    } catch (error) {
      toast({ title: 'Failed', description: 'Transaction execution failed.', variant: 'destructive' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
          <Plus className="w-6 h-6 text-orange-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Agreement</h1>
          <p className="text-slate-400">Define your terms and automated payment milestones.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
              step >= s ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-500'
            }`}>
              {s}
            </div>
            {s < 3 && <div className={`w-12 h-1px ${step > s ? 'bg-orange-500' : 'bg-slate-800'}`} />}
          </div>
        ))}
      </div>

      <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-xl">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <CardHeader>
              <CardTitle>General Details</CardTitle>
              <CardDescription>Specify the core agreement information and parties.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Contract Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Design System Development" 
                  className="bg-slate-950 border-slate-800"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="provider">Provider Address (Stellar G...)</Label>
                <Input 
                  id="provider" 
                  placeholder="GD..." 
                  className="bg-slate-950 border-slate-800 font-mono"
                  value={formData.provider}
                  onChange={(e) => setFormData({...formData, provider: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Brief Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Outline the scope of work..." 
                  className="bg-slate-950 border-slate-800 min-h-[100px]"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto bg-slate-800 hover:bg-slate-700" onClick={() => setStep(2)}>
                Next: Milestones
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <CardHeader>
              <CardTitle>Payment Milestones</CardTitle>
              <CardDescription>Break down the contract value into automated payouts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {milestones.map((m, i) => (
                <div key={i} className="flex gap-4 items-end animate-in zoom-in-95 duration-200">
                  <div className="grid gap-2 flex-1">
                    <Label>Description</Label>
                    <Input 
                      placeholder="Milestone description" 
                      className="bg-slate-950 border-slate-800"
                      value={m.description}
                      onChange={(e) => {
                        const newM = [...milestones];
                        newM[i].description = e.target.value;
                        setMilestones(newM);
                      }}
                    />
                  </div>
                  <div className="grid gap-2 w-32">
                    <Label>Amount (XLM)</Label>
                    <Input 
                      placeholder="500" 
                      className="bg-slate-950 border-slate-800"
                      value={m.amount}
                      onChange={(e) => {
                        const newM = [...milestones];
                        newM[i].amount = e.target.value;
                        setMilestones(newM);
                      }}
                    />
                  </div>
                  <Button variant="ghost" size="icon" className="text-slate-500 hover:text-red-400" onClick={() => removeMilestone(i)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full border-dashed border-slate-700 hover:bg-slate-800" onClick={addMilestone}>
                <Plus className="w-4 h-4 mr-2" />
                Add Milestone
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button className="bg-slate-800 hover:bg-slate-700" onClick={() => setStep(3)}>
                Next: Review
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <CardHeader>
              <CardTitle>Review & Deploy</CardTitle>
              <CardDescription>Verify all terms before committing to the blockchain.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Agreement:</span>
                  <span className="font-semibold">{formData.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Total Value:</span>
                  <span className="font-semibold text-orange-500">{milestones.reduce((acc, m) => acc + (Number(m.amount) || 0), 0)} XLM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Terms Hash:</span>
                  <span className="font-mono text-xs opacity-60 text-slate-400">{formData.termsHash}</span>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <h4 className="font-medium">Selected Parties</h4>
                <div className="flex items-center justify-between text-xs font-mono bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-blue-400">Client: {address?.slice(0, 12)}...</span>
                  <span className="text-purple-400">Provider: {formData.provider.slice(0, 12)}...</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(2)}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                className="bg-orange-500 hover:bg-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                onClick={handleSubmit}
              >
                <Send className="w-4 h-4 mr-2" />
                Deploy to Stellar
              </Button>
            </CardFooter>
          </div>
        )}
      </Card>
    </div>
  );
}
