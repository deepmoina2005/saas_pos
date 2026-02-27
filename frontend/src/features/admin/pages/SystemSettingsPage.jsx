import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Inline Icons for build stability
const Icons = {
  Settings: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Globe: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  Shield: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Mail: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Save: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
  )
};

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState({
    platformName: 'Antigravity POS',
    supportEmail: 'support@antigravity.io',
    defaultCurrency: 'INR',
    defaultGstRate: '18',
    sessionTimeout: '60',
    maintenanceMode: false
  });

  const handleSave = () => {
     // API call logic would go here
     console.log("Saving settings...", settings);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 font-outfit">Platform Settings</h1>
        <p className="text-slate-500 font-medium">Global configuration for the entire SaaS ecosystem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
           <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
                 <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                       <Icons.Globe className="w-4 h-4 text-sky-500" /> General Configuration
                    </CardTitle>
                    <CardDescription>Core identity and localization rules.</CardDescription>
                 </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Platform Name</label>
                       <Input 
                          value={settings.platformName}
                          onChange={(e) => setSettings({...settings, platformName: e.target.value})}
                          className="h-11 border-slate-200"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Support Email</label>
                       <Input 
                          value={settings.supportEmail}
                          onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                          className="h-11 border-slate-200"
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Default Currency</label>
                       <select 
                          className="w-full h-11 px-3 border border-slate-200 rounded-md text-sm"
                          value={settings.defaultCurrency}
                          onChange={(e) => setSettings({...settings, defaultCurrency: e.target.value})}
                       >
                          <option value="INR">Indian Rupee (INR)</option>
                          <option value="USD">US Dollar (USD)</option>
                          <option value="EUR">Euro (EUR)</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Default Tax Rate (%)</label>
                       <Input 
                          type="number"
                          value={settings.defaultGstRate}
                          onChange={(e) => setSettings({...settings, defaultGstRate: e.target.value})}
                          className="h-11 border-slate-200"
                       />
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                 <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Icons.Shield className="w-4 h-4 text-emerald-500" /> Security & Session
                 </CardTitle>
                 <CardDescription>Enterprise security policies and access control.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                 <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="space-y-1">
                       <p className="text-sm font-bold text-slate-800">Maintenance Mode</p>
                       <p className="text-xs text-slate-500">Block all frontends except super-admin for upgrades.</p>
                    </div>
                    <button 
                       onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                       className={cn(
                          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                          settings.maintenanceMode ? "bg-rose-500" : "bg-slate-300"
                       )}
                    >
                       <span className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                          settings.maintenanceMode ? "translate-x-6" : "translate-x-1"
                       )} />
                    </button>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Session Timeout (Minutes)</label>
                    <Input 
                       type="number"
                       value={settings.sessionTimeout}
                       onChange={(e) => setSettings({...settings, sessionTimeout: e.target.value})}
                       className="h-11 border-slate-200"
                    />
                    <p className="text-[10px] text-slate-400">Users will be logged out automatically after this period of inactivity.</p>
                 </div>
              </CardContent>
           </Card>
        </div>

        <div className="space-y-6">
           <Card className="border-none shadow-xl shadow-slate-200/50 bg-slate-900 text-white p-6">
              <div className="flex items-center gap-3 mb-6">
                 <Icons.Settings className="w-10 h-10 text-indigo-400" />
                 <div>
                    <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest leading-none">Management</p>
                    <p className="text-sm font-black">Sync Platform</p>
                 </div>
              </div>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                 Saving these settings will apply changes globally to all tenant instances. This may cause a brief cache invalidation.
              </p>
              <Button onClick={handleSave} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black h-12 shadow-lg shadow-indigo-600/20">
                 <Icons.Save className="w-4 h-4 mr-2" /> Commit Changes
              </Button>
           </Card>

           <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100">
              <h4 className="text-sm font-black text-indigo-900 mb-2">Platform Status</h4>
              <div className="space-y-3">
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">API Gateway</span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">ACTIVE</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">Database Cluster</span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">ACTIVE</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">CDN Nodes</span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">ACTIVE</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
