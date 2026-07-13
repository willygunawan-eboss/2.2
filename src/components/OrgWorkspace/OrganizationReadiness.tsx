import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

export function OrganizationReadiness() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/organization/workspace/readiness')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  if (loading || !data) return <div className="text-slate-400 p-8">Loading Readiness...</div>;

  const scoreColor = data.score >= 80 ? 'text-green-400' : data.score >= 50 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-1 bg-slate-800 border border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center">
        <div className="text-slate-400 font-medium mb-4">Organization Score</div>
        <div className={clsx("text-6xl font-bold", scoreColor)}>{data.score}%</div>
        <div className="mt-4 text-sm text-slate-500 text-center">
          Based on structural completeness
        </div>
      </div>
      
      <div className="col-span-1 bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h3 className="text-white font-medium mb-4">Structure Readiness</h3>
        <div className="space-y-3">
          {Object.entries(data.readiness).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-slate-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              {value ? (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-1 bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h3 className="text-white font-medium mb-4">Recommendations</h3>
        {data.recommendations.length > 0 ? (
          <div className="space-y-4">
            {data.recommendations.map((rec: string, i: number) => (
              <div key={i} className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">{rec}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-slate-500">
            <CheckCircle2 className="w-12 h-12 text-green-400 mb-2 opacity-50" />
            <p>Structure is complete</p>
          </div>
        )}
      </div>
    </div>
  );
}
