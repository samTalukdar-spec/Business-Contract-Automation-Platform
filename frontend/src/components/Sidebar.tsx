'use client';

import Link from 'next/link';
import { 
  LayoutDashboard, 
  FileText, 
  Activity, 
  History, 
  Settings, 
  PieChart,
  PlusCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: PlusCircle, label: 'New Contract', href: '/contracts/new' },
  { icon: FileText, label: 'My Agreements', href: '/contracts' },
  { icon: Activity, label: 'Activity Feed', href: '/activity' },
  { icon: History, label: 'Transactions', href: '/transactions' },
  { icon: PieChart, label: 'Analytics', href: '/analytics' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 z-50 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800">
      <div className="flex items-center h-16 px-6 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">LexStellar</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-orange-500/10 text-orange-500" 
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                isActive ? "text-orange-500" : "text-slate-400 group-hover:text-slate-100"
              )} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="px-3 py-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700">
          <h4 className="text-sm font-semibold text-white mb-1">Orange Belt Ready</h4>
          <p className="text-xs text-slate-400">Production-grade contract automation for Stellar.</p>
        </div>
      </div>
    </aside>
  );
}
