import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Globe, Bell, Wallet } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Platform Settings</h1>
        <p className="text-slate-400">Manage your connection preferences and security protocols.</p>
      </div>

      <div className="grid gap-6">
        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              <CardTitle>Network Configuration</CardTitle>
            </div>
            <CardDescription>Select the Stellar network for contract interactions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-950 border border-slate-800">
              <div className="space-y-0.5">
                <Label>Current Network</Label>
                <p className="text-xs text-slate-500">Testnet (SDF Network)</p>
              </div>
              <Button variant="outline" size="sm" className="border-slate-700">Switch to Mainnet</Button>
            </div>
            <div className="grid gap-2">
              <Label>Custom RPC URL</Label>
              <Input placeholder="https://..." className="bg-slate-950 border-slate-800" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <CardTitle>Security & Privacy</CardTitle>
            </div>
            <CardDescription>Manage your automated approval settings and data privacy.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Signature</Label>
                <p className="text-xs text-slate-500">Automatically sign recurring service payments.</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Privacy Mode</Label>
                <p className="text-xs text-slate-500">Hide your balance and transaction history from main view.</p>
              </div>
              <Switch checked />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-500" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Get alerted about milestone completions and payment releases.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Browser Notifications</Label>
                <p className="text-xs text-slate-500">Receive real-time alerts on contract events.</p>
              </div>
              <Switch checked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Digest</Label>
                <p className="text-xs text-slate-500">Weekly summary of agreement activity.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
