import React, { useEffect, useState } from 'react';
import { 
  Database, Activity, GitBranch, DatabaseBackup, List, 
  ShieldCheck, Building2, Users, User, CreditCard, 
  Briefcase, HelpCircle, Bell, Link, CheckCircle2, 
  AlertTriangle, XCircle, RefreshCcw
} from 'lucide-react';

export function SystemReadinessView() {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = () => {
    setLoading(true);
    fetch('/api/system/health')
      .then(res => res.json())
      .then(data => {
        setHealthData(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  if (loading) {
    return <div className="flex h-full items-center justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
  }

  const components = [
    { key: 'database', name: 'Database', icon: Database },
    { key: 'api', name: 'API Server', icon: Activity },
    { key: 'migration', name: 'Migration', icon: GitBranch },
    { key: 'seeder', name: 'Seeder', icon: DatabaseBackup },
    { key: 'reference', name: 'Reference Engine', icon: List },
    { key: 'rbac', name: 'RBAC', icon: ShieldCheck },
    { key: 'organization', name: 'Organization', icon: Building2 },
    { key: 'hr', name: 'HR', icon: Users },
    { key: 'crm', name: 'CRM', icon: User },
    { key: 'finance', name: 'Finance', icon: CreditCard },
    { key: 'asset', name: 'Asset', icon: Briefcase },
    { key: 'helpdesk', name: 'Helpdesk', icon: HelpCircle },
    { key: 'notification', name: 'Notification', icon: Bell },
    { key: 'integration', name: 'Integration', icon: Link },
  ];

  const getStatusDisplay = (status: string) => {
    switch(status) {
      case 'Pass':
        return <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Pass</div>;
      case 'Warning':
        return <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-bold"><AlertTriangle className="w-3.5 h-3.5" /> Warning</div>;
      case 'Error':
        return <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 text-xs font-bold"><XCircle className="w-3.5 h-3.5" /> Error</div>;
      default:
        return <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 text-xs font-bold">Unknown</div>;
    }
  };

  const statusCounts = {
    pass: Object.values(healthData || {}).filter(s => s === 'Pass').length,
    warning: Object.values(healthData || {}).filter(s => s === 'Warning').length,
    error: Object.values(healthData || {}).filter(s => s === 'Error').length,
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">ERP System Health</h1>
          <p className="text-slate-500 mt-1 text-sm">Real-time system diagnostics and readiness verification.</p>
        </div>
        <button onClick={fetchHealth} className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
          <RefreshCcw className="w-4 h-4" />
          Refresh Status
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex justify-between items-center">
          <div>
            <h3 className="text-emerald-800 font-semibold text-sm mb-1">Passed Checks</h3>
            <p className="text-3xl font-black text-emerald-600">{statusCounts.pass}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex justify-between items-center">
          <div>
            <h3 className="text-amber-800 font-semibold text-sm mb-1">Warnings</h3>
            <p className="text-3xl font-black text-amber-600">{statusCounts.warning}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex justify-between items-center">
          <div>
            <h3 className="text-rose-800 font-semibold text-sm mb-1">Errors</h3>
            <p className="text-3xl font-black text-rose-600">{statusCounts.error}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-800">Verification Report</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="divide-y divide-slate-100">
            {components.slice(0, 7).map((comp) => (
              <div key={comp.key} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded bg-slate-100 text-slate-500`}>
                    <comp.icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-slate-800">{comp.name}</span>
                </div>
                {getStatusDisplay(healthData?.[comp.key] || 'Unknown')}
              </div>
            ))}
          </div>
          <div className="divide-y divide-slate-100">
            {components.slice(7).map((comp) => (
              <div key={comp.key} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded bg-slate-100 text-slate-500`}>
                    <comp.icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-slate-800">{comp.name}</span>
                </div>
                {getStatusDisplay(healthData?.[comp.key] || 'Unknown')}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
