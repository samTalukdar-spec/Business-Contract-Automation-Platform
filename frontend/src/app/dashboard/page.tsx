import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  ArrowUpRight, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  PlusCircle
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Enterprise Overview</h1>
        <p className="text-slate-400">Manage your decentralized business agreements and automated settlements.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Active Contracts', value: '12', icon: FileText, color: 'text-blue-500' },
          { label: 'Pending Signatures', value: '3', icon: Clock, color: 'text-orange-500' },
          { label: 'Completed', value: '48', icon: CheckCircle, color: 'text-green-500' },
          { label: 'Settled Value', value: '25.4k XLM', icon: TrendingUp, color: 'text-purple-500' },
        ].map((stat, i) => (
          <Card key={i} className="bg-slate-900/40 border-slate-800 backdrop-blur-sm overflow-hidden group hover:border-slate-700 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-slate-500 mt-1">+2.4% from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Recent Contracts */}
        <Card className="lg:col-span-4 bg-slate-900/40 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Contracts</CardTitle>
                <CardDescription>Latest agreements requiring your attention.</CardDescription>
              </div>
              <Link 
                href="/contracts"
                className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), "h-8 px-3")}
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Marketing Services', client: 'Alpha Corp', amount: '1200 XLM', status: 'Pending' },
                { title: 'Supply Chain Logistics', client: 'Omega Logistics', amount: '4500 XLM', status: 'Active' },
                { title: 'Content Retainer', client: 'Z-Media', amount: '800 XLM', status: 'Signed' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 group hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                      <FileText className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.client}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{item.amount}</p>
                    <p className="text-xs text-orange-500">{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security / System Status */}
        <Card className="lg:col-span-3 bg-slate-900/40 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Network Trust</CardTitle>
            <CardDescription>Real-time security and contract health.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <p className="text-sm font-medium">Soroban Runtime Stable</p>
                <p className="text-xs text-slate-500">All contracts passing automated verification checks.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-500 mt-1" />
              <div>
                <p className="text-sm font-medium">Escrow Audited</p>
                <p className="text-xs text-slate-500">No discrepancies found in contract ledger vs events.</p>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-800">
              <Link 
                href="/contracts/new"
                className={cn(
                  buttonVariants({ variant: 'default' }),
                  "w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold h-9 px-4 py-2"
                )}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Create New Contract
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
