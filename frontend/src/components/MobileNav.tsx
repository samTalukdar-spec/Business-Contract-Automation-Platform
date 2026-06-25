'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X as CloseIcon, 
  LayoutDashboard, 
  FileText, 
  Activity, 
  History, 
  Settings, 
  PieChart,
  PlusCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: PlusCircle, label: 'New Contract', href: '/contracts/new' },
  { icon: FileText, label: 'My Agreements', href: '/contracts' },
  { icon: Activity, label: 'Activity Feed', href: '/activity' },
  { icon: History, label: 'Transactions', href: '/transactions' },
  { icon: PieChart, label: 'Analytics', href: '/analytics' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        aria-label="Toggle menu"
      >
        {open ? <CloseIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="flex justify-end p-4">
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-white"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col items-center gap-2 px-8 pt-8">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 w-full max-w-xs px-4 py-3 rounded-xl text-lg font-medium transition-all',
                    isActive
                      ? 'bg-orange-500/10 text-orange-500'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
