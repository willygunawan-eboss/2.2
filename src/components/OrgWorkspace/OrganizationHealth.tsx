import React, { useEffect, useState } from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

export function OrganizationHealth() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHealth = () => {
    setRefreshing(true);
    fetch('/api/organization/platform/health')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
        setRefreshing(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const refreshCache = () => {
    setRefreshing(true);
    fetch('/api/organization/platform/cache/refresh', { method: 'POST' })
      .then(() => fetchHealth())
      .catch(() => setRefreshing(false));
  };

  if (loading || !data) return <div className="text-slate-500 p-8">Loading Health Data...</div>;

  const scoreColor = data.integrityScore >= 90 ? 'text-green-400' : data.integrityScore >= 60 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-slate-900">Platform Health & Integrity</h2>
        <button 
          onClick={refreshCache}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-200 text-sm transition-colors"
        >
          <RefreshCw className={clsx("w-4 h-4", refreshing && "animate-spin")} />
          Refresh Cache & Validate
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center">
          <div className="text-slate-500 font-medium mb-4">Integrity Score</div>
          <div className={clsx("text-6xl font-bold", scoreColor)}>{data.integrityScore}%</div>
          <div className="mt-4 text-sm text-slate-500 text-center">
            {data.healthy ? 'Organization structure is healthy' : 'Issues detected in structure'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-slate-900 font-medium mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            Dependency Errors ({data.errors.length})
          </h3>
          <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
            {data.errors.length > 0 ? (
              data.errors.map((err: string, i: number) => (
                <div key={i} className="text-sm text-slate-700 p-2 bg-slate-750 rounded border border-red-500/20">
                  {err}
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-sm py-4 text-center">No dependency errors found.</div>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-slate-900 font-medium mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Integrity Warnings ({data.warnings.length})
          </h3>
          <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
            {data.warnings.length > 0 ? (
              data.warnings.map((warn: string, i: number) => (
                <div key={i} className="text-sm text-slate-700 p-2 bg-slate-750 rounded border border-yellow-500/20">
                  {warn}
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-sm py-4 text-center">No structural warnings found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
