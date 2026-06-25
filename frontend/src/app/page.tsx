import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Coins, 
  Code2, 
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-24 pb-20 animate-in fade-in duration-1000">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 flex flex-col items-center text-center px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold mb-6 tracking-wide uppercase">
          <Zap className="w-3 h-3" />
          Powered by Soroban Smart Contracts
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
          The Future of Business <br /> Agreements is LexStellar
        </h1>
        <p className="max-w-2xl text-lg text-slate-400 mb-10 leading-relaxed">
          Automate your commercial contracts with self-executing logic on the Stellar network. 
          Reduce disputes, eliminate manual billing, and ensure trustless settlements for global business.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: 'default', size: 'lg' }),
              "bg-orange-500 hover:bg-orange-600 text-white px-8 h-14 text-lg rounded-full shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all transform hover:scale-105 active:scale-95"
            )}
          >
            Launch Platform
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Button size="lg" variant="outline" className="border-slate-800 bg-slate-900/50 hover:bg-slate-800 h-14 px-8 text-lg rounded-full backdrop-blur-sm">
            Read Whitepaper
          </Button>
        </div>
        
        {/* Abstract UI Preview Mock */}
        <div className="mt-20 w-full max-w-5xl aspect-video rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-blue-500/5" />
          <div className="absolute top-0 left-0 right-0 h-12 bg-slate-800/50 border-b border-slate-700/50 flex items-center px-6 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <div className="p-12 flex flex-col items-center justify-center h-full gap-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <FileCheck className="w-8 h-8 text-orange-500" />
            </div>
            <p className="text-slate-500 font-mono text-sm">Waiting for contract initialization...</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8 px-4">
        {[
          { 
            title: 'Immutable Integrity', 
            desc: 'Agreements are etched into the Stellar ledger, providing an unalterable audit trail for auditors and parties.',
            icon: Shield,
            color: 'bg-blue-500/10 text-blue-500'
          },
          { 
            title: 'Instant Settlements', 
            desc: 'Milestone completion triggers automated payment releases via Soroban, ending multi-week billing cycles.',
            icon: Coins,
            color: 'bg-orange-500/10 text-orange-500'
          },
          { 
            title: 'Programmable Logic', 
            desc: 'Define complex business rules, penalties, and workflows that enforce themselves without middlemen.',
            icon: Code2,
            color: 'bg-purple-500/10 text-purple-500'
          }
        ].map((feat, i) => (
          <div key={i} className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group">
            <div className={`w-12 h-12 rounded-2xl ${feat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <feat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">{feat.title}</h3>
            <p className="text-slate-400 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </section>

      {/* Trust Section */}
      <section className="bg-slate-900/40 border-y border-slate-800 py-20 px-4 text-center">
        <h2 className="text-3xl font-bold mb-12">Designed for Enterprise Scalability</h2>
        <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="flex items-center gap-2 text-xl font-bold"><CheckCircle2 className="text-green-500" /> PROVABLE</div>
          <div className="flex items-center gap-2 text-xl font-bold"><CheckCircle2 className="text-blue-500" /> SECURE</div>
          <div className="flex items-center gap-2 text-xl font-bold"><CheckCircle2 className="text-orange-500" /> COMPLIANT</div>
          <div className="flex items-center gap-2 text-xl font-bold"><CheckCircle2 className="text-purple-500" /> AUTOMATED</div>
        </div>
      </section>
    </div>
  );
}
