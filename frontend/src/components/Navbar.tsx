'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useWallet } from '@/hooks/useWallet';
import { Wallet, LogOut, Bell, Search } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MobileNav } from '@/components/MobileNav';

export function Navbar() {
  const { connect, disconnect, isConnected, address } = useWallet();

  return (
    <header className="h-16 px-4 md:px-6 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        <MobileNav />
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search contracts, transactions..."
            className="w-full bg-slate-900 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
          <Bell className="w-5 h-5" />
        </Button>

        {isConnected ? (
          <DropdownMenu>
            <DropdownMenuTrigger 
              className={cn(
                buttonVariants({ variant: 'outline' }),
                "gap-2 border-slate-700 bg-slate-800 hover:bg-slate-700 rounded-full h-8 px-3 cursor-pointer"
              )}
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="hidden sm:inline">
                {address?.slice(0, 5)}...{address?.slice(-5)}
              </span>
              <Wallet className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-100">
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(address || '')}>
                Copy Address
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-400" onClick={disconnect}>
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            onClick={connect}
            className="bg-orange-500 hover:bg-orange-600 text-white gap-2 shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all active:scale-95"
          >
            <Wallet className="w-4 h-4" />
            <span className="hidden sm:inline">Connect Wallet</span>
            <span className="sm:hidden">Connect</span>
          </Button>
        )}
      </div>
    </header>
  );
}
