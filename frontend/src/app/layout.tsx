import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LexStellar — Decentralized Business Contract Automation',
  description: 'Automate your commercial contracts with self-executing Soroban smart contracts on Stellar. Reduce disputes, eliminate manual billing, and ensure trustless settlements.',
  keywords: ['Stellar', 'Soroban', 'Smart Contracts', 'Business Automation', 'dApp', 'Blockchain'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-50 min-h-screen overflow-x-hidden antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
