'use client';

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  PlusCircle, 
  UserCheck, 
  CreditCard, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { horizon, CONTRACT_MANAGER_ID } from '@/lib/stellar';
import { useEffect, useState } from 'react';

interface Event {
  id: string;
  type: 'created' | 'signed' | 'paid' | 'completed';
  title: string;
  user: string;
  time: string;
  amount?: string;
}

const mockEvents: Event[] = [
  { id: '1', type: 'created', title: 'Content Agency Contract', user: 'GB...X2', time: '2m ago' },
  { id: '2', type: 'signed', title: 'Q2 Performance Marketing', user: 'GD...Y9', time: '15m ago' },
  { id: '3', type: 'paid', title: 'Initial Kickoff - Dev Project', user: 'System', time: '1h ago', amount: '500 XLM' },
  { id: '4', type: 'completed', title: 'Legal Consultation', user: 'GB...X2', time: '4h ago' },
];

export function ActivityFeed() {
  const [events, setEvents] = useState<Event[]>(mockEvents);

  useEffect(() => {
    // Real-time subscription to Contract Events
    if (CONTRACT_MANAGER_ID === 'CONTRACT_MANAGER_ADDRESS_PLACEHOLDER') return;

    const closeStream = (horizon as any).events()
      .forAccount(CONTRACT_MANAGER_ID)
      .cursor('now')
      .stream({
        onmessage: (event: any) => {
          console.log('Contract Event Received:', event);
          // In a real implementation, we'd parse the XDR event data here
          // and update the events state.
          // setEvents(prev => [parsedEvent, ...prev]);
        },
        onerror: (error: any) => {
          console.error('Event Stream Error:', error);
        }
      });

    return () => closeStream();
  }, []);

  return (
    <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <ArrowUpRight className="w-5 h-5 text-orange-500" />
          Blockchain Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="relative">
          {/* Vertical line connector */}
          <div className="absolute left-8 top-0 bottom-6 w-px bg-slate-800" />
          
          <div className="space-y-6 pb-6">
            {mockEvents.map((event, idx) => (
              <div key={event.id} className="relative pl-14 pr-6 animate-in slide-in-from-left duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className={cn(
                  "absolute left-6 top-0 w-4 h-4 rounded-full border-4 border-slate-950 z-10",
                  event.type === 'created' && 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]',
                  event.type === 'signed' && 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]',
                  event.type === 'paid' && 'bg-orange-500 shadow-[0_0_8_px_rgba(249,115,22,0.5)]',
                  event.type === 'completed' && 'bg-green-500 shadow-[0_0_8_px_rgba(34,197,94,0.5)]',
                )} />
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-100">{event.title}</p>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                    <span>by {event.user}</span>
                    {event.amount && <span className="text-orange-400 font-bold ml-auto">{event.amount}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
