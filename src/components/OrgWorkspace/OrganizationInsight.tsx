import React, { useEffect, useState } from 'react';
import { AlertTriangle, Info } from 'lucide-react';

export function OrganizationInsight() {
  const [warnings, setWarnings] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/organization/workspace/insight')
      .then(res => res.json())
      .then(d => {
        setWarnings(d);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-slate-500 p-8">Loading Insights...</div>;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-slate-900 font-medium flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          Structural Warnings
        </h3>
        <span className="px-3 py-1 bg-slate-700 text-slate-700 rounded-full text-sm font-medium">
          {warnings.length} Issues Found
        </span>
      </div>

      {warnings.length > 0 ? (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {warnings.map((warn: string, i: number) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-slate-750 border border-slate-200 rounded text-slate-700 text-sm">
              <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>{warn}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 flex flex-col items-center justify-center text-slate-500">
          <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-slate-600" />
          </div>
          <p>No structural warnings found.</p>
          <p className="text-sm">Your organization tree looks healthy.</p>
        </div>
      )}
    </div>
  );
}
