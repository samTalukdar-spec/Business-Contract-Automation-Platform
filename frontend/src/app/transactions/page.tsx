'use client';

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Hash, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function TransactionsPage() {
  const { transactions } = useStore();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Transaction Center</h1>
        <p className="text-slate-400">Deep-dive into your contract's blockchain lifecycle.</p>
      </div>

      <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">On-Chain History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="border-slate-800">
              <TableRow className="hover:bg-transparent border-slate-800">
                <TableHead className="text-slate-400">Transaction ID</TableHead>
                <TableHead className="text-slate-400">Action</TableHead>
                <TableHead className="text-slate-400">Timestamp</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                // Sample Data for demonstration
                [
                  { id: '3f2b...8e11', action: 'Create Contract', time: '10m ago', status: 'confirmed' },
                  { id: '9a1c...2d45', action: 'Deposit Escrow', time: '1h ago', status: 'confirmed' },
                  { id: '1d4e...a9b2', action: 'Sign Agreement', time: '4h ago', status: 'failed' },
                ].map((tx, i) => (
                  <TableRow key={i} className="border-slate-800 hover:bg-slate-800/30 transition-colors group">
                    <TableCell className="font-mono text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <Hash className="w-3 h-3 text-slate-500" />
                        {tx.id}
                      </div>
                    </TableCell>
                    <TableCell className="text-white font-medium">{tx.action}</TableCell>
                    <TableCell className="text-slate-400 text-xs">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {tx.time}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full w-fit ${
                        tx.status === 'confirmed' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {tx.status === 'confirmed' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {tx.status.toUpperCase()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <a 
                        href={`https://stellar.expert/explorer/testnet/tx/${tx.id}`}
                        target="_blank"
                        className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                transactions.map((tx, i) => (
                  <TableRow key={i} className="border-slate-800 hover:bg-slate-800/30 transition-colors">
                    <TableCell className="font-mono text-xs">{tx.hash.slice(0, 16)}...</TableCell>
                    <TableCell className="text-white">{tx.description}</TableCell>
                    <TableCell className="text-slate-400">{new Date(tx.timestamp).toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        tx.status === 'confirmed' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                      }`}>
                        {tx.status.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <ExternalLink className="w-4 h-4 text-slate-500 hover:text-white cursor-pointer" />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
