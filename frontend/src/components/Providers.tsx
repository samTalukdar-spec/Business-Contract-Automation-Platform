'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { ToastProvider } from '@/components/ui/toaster';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 2,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <div className="relative flex min-h-screen">
          {/* Background decorative elements */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-500/10 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
          </div>

          <Sidebar />

          <main className="flex-1 flex flex-col relative z-10 lg:pl-64">
            <Navbar />
            <div className="flex-1 p-4 md:p-6 lg:p-10 max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </ToastProvider>
    </QueryClientProvider>
  );
}
