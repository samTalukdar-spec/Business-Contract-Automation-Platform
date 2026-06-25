'use client';

import { ActivityFeed } from '@/components/ActivityFeed';

export default function ActivityPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Activity Feed</h1>
        <p className="text-slate-400">Real-time blockchain events from your contracts and settlements.</p>
      </div>
      <ActivityFeed />
    </div>
  );
}
