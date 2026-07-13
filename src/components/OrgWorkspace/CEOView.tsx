import React, { useEffect, useState } from 'react';
import { Target, Users, TrendingUp, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export function CEOView() {
  const [data, setData] = useState<any>(null);
  
  useEffect(() => {
    Promise.all([
      fetch('/api/organization/workspace/summary').then(res => res.json()),
      fetch('/api/organization/workspace/readiness').then(res => res.json()),
      fetch('/api/organization/platform/health').then(res => res.json()),
    ]).then(([summary, readiness, health]) => {
      setData({ summary, readiness, health });
    });
  }, []);

  if (!data) return <div className="text-slate-500 p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div></div>;

  const totalOrgUnit = 
    (data.summary.company || 0) + 
    (data.summary.branch || 0) + 
    (data.summary.division || 0) + 
    (data.summary.department || 0) + 
    (data.summary.section || 0) + 
    (data.summary.team || 0);

  const missingConfigs = Object.entries(data.readiness.readiness)
    .filter(([_, isReady]) => !isReady)
    .map(([key]) => key);

  return (
    <div className="space-y-6 fade-in">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Executive Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Target className="w-5 h-5" /></div>
              <span className="text-slate-600 text-sm font-semibold">Health Score</span>
            </div>
            <div className="text-3xl font-black text-slate-900">{data.readiness.score}%</div>
            <div className="text-xs text-slate-500 mt-1">Platform Readiness</div>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><ShieldCheck className="w-5 h-5" /></div>
              <span className="text-slate-600 text-sm font-semibold">Integrity Score</span>
            </div>
            <div className="text-3xl font-black text-slate-900">{data.health.integrityScore}%</div>
            <div className="text-xs text-slate-500 mt-1">Data Health & Validation</div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Users className="w-5 h-5" /></div>
              <span className="text-slate-600 text-sm font-semibold">Total Org Units</span>
            </div>
            <div className="text-3xl font-black text-slate-900">{totalOrgUnit}</div>
            <div className="text-xs text-slate-500 mt-1">Active Structural Nodes</div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><AlertCircle className="w-5 h-5" /></div>
              <span className="text-slate-600 text-sm font-semibold">Pending Config</span>
            </div>
            <div className="text-3xl font-black text-slate-900">{missingConfigs.length}</div>
            <div className="text-xs text-slate-500 mt-1 truncate">
              {missingConfigs.length > 0 ? missingConfigs.join(', ') : 'All models completed'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
