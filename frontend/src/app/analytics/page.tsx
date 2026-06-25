import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Zap, BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Business Intelligence</h1>
        <p className="text-slate-400">Aggregated insights across your automated contract portfolio.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Volume', value: '45,200', unit: 'XLM', icon: DollarSign },
          { label: 'Network Efficiency', value: '98.2%', unit: 'Uptime', icon: Zap },
          { label: 'Active Partners', value: '24', unit: 'Entities', icon: Users },
          { label: 'Growth', value: '+12.5%', unit: 'MoM', icon: TrendingUp },
        ].map((stat, i) => (
          <Card key={i} className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">{stat.unit}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Payout Distribution</CardTitle>
            <CardDescription>Monthly settlement volume across all active contracts.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-end justify-around gap-2 pt-10">
            {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
              <div key={i} className="group relative flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-orange-500/20 hover:bg-orange-500/40 border-t-2 border-orange-500 rounded-t-sm transition-all duration-500" 
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-800 text-[10px] p-1 rounded transition-opacity">
                    {h * 10}XLM
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 mt-2">M{i+1}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Contract Performance</CardTitle>
            <CardDescription>Average time from creation to final settlement.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { type: 'Service', avg: '14 Days', percent: 65, color: 'bg-blue-500' },
              { type: 'Supplier', avg: '28 Days', percent: 85, color: 'bg-purple-500' },
              { type: 'Freelance', avg: '5 Days', percent: 30, color: 'bg-green-500' },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300 font-medium">{item.type}</span>
                  <span className="text-slate-500">{item.avg} avg</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all duration-1000`} 
                    style={{ width: `${item.percent}%` }} 
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
