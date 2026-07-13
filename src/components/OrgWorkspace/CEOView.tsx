import React, { useEffect, useState } from 'react';
import { Target, Users, TrendingUp, ShieldCheck } from 'lucide-react';

export function CEOView() {
  const [data, setData] = useState<any>(null);
  
  useEffect(() => {
    // In a real app we might have a specific CEO dashboard endpoint,
    // here we will just fetch the summary and readiness and mock some metrics
    Promise.all([
      fetch('/api/organization/workspace/summary').then(res => res.json()),
      fetch('/api/organization/workspace/readiness').then(res => res.json()),
      fetch('/api/organization/platform/health').then(res => res.json()),
    ]).then(([summary, readiness, health]) => {
      setData({ summary, readiness, health });
    });
  }, []);

  if (!data) return <div className="text-slate-400 p-8">Loading Executive View...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><Target className="w-5 h-5" /></div>
            <span className="text-slate-400 text-sm font-medium">Org Health Score</span>
          </div>
          <div className="text-3xl font-bold text-white">{data.readiness.score}%</div>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/10 text-green-400 rounded-lg"><ShieldCheck className="w-5 h-5" /></div>
            <span className="text-slate-400 text-sm font-medium">Total Positions</span>
          </div>
          <div className="text-3xl font-bold text-white">{data.summary.position}</div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg"><Users className="w-5 h-5" /></div>
            <span className="text-slate-400 text-sm font-medium">Departments</span>
          </div>
          <div className="text-3xl font-bold text-white">{data.summary.department}</div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-500/10 text-yellow-400 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
            <span className="text-slate-400 text-sm font-medium">Completeness</span>
          </div>
          <div className="text-3xl font-bold text-white">
            {Object.values(data.readiness.readiness).filter(Boolean).length} / 8
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500/10 text-red-400 rounded-lg"><ShieldCheck className="w-5 h-5" /></div>
            <span className="text-slate-400 text-sm font-medium">Integrity Score</span>
          </div>
          <div className="text-3xl font-bold text-white">{data.health.integrityScore}%</div>
        </div>

      </div>
    </div>
  );
}
