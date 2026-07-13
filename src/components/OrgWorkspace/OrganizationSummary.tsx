import React, { useEffect, useState } from 'react';
import { Building2, MapPin, Layers, Users, Briefcase, Award, FolderTree, Network } from 'lucide-react';

export function OrganizationSummary() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/organization/workspace/summary')
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

  if (loading || !data) return <div className="text-slate-400 p-8">Loading Summary...</div>;

  const items = [
    { label: 'Total Company', value: data.company, icon: <Building2 className="w-5 h-5 text-blue-400" /> },
    { label: 'Total Branch', value: data.branch, icon: <MapPin className="w-5 h-5 text-green-400" /> },
    { label: 'Total Division', value: data.division, icon: <Layers className="w-5 h-5 text-purple-400" /> },
    { label: 'Total Department', value: data.department, icon: <FolderTree className="w-5 h-5 text-yellow-400" /> },
    { label: 'Total Section', value: data.section, icon: <Network className="w-5 h-5 text-pink-400" /> },
    { label: 'Total Team', value: data.team, icon: <Users className="w-5 h-5 text-orange-400" /> },
    { label: 'Total Position', value: data.position, icon: <Briefcase className="w-5 h-5 text-indigo-400" /> },
    { label: 'Total Job Grade', value: data.jobGrade, icon: <Award className="w-5 h-5 text-cyan-400" /> },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item, idx) => (
        <div key={idx} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="text-slate-400 text-sm font-medium">{item.label}</div>
            <div className="p-2 bg-slate-700/50 rounded-lg">{item.icon}</div>
          </div>
          <div className="mt-4 text-3xl font-bold text-slate-100">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
