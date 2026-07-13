import React from 'react';
import { ArrowDown, Building2, MapPin, Layers, FolderTree, Network, Users, Briefcase } from 'lucide-react';

export function DependencyGraph() {
  const steps = [
    { label: 'Company', icon: <Building2 className="w-5 h-5" />, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { label: 'Branch', icon: <MapPin className="w-5 h-5" />, color: 'text-green-400 bg-green-500/10 border-green-500/20' },
    { label: 'Division', icon: <Layers className="w-5 h-5" />, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { label: 'Department', icon: <FolderTree className="w-5 h-5" />, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
    { label: 'Section', icon: <Network className="w-5 h-5" />, color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
    { label: 'Team', icon: <Users className="w-5 h-5" />, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
    { label: 'Position', icon: <Briefcase className="w-5 h-5" />, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' }
  ];

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h3 className="text-white font-medium mb-6">Structural Dependency</h3>
      
      <div className="flex flex-col items-center max-w-sm mx-auto">
        {steps.map((step, i) => (
          <React.Fragment key={step.label}>
            <div className={`w-full flex items-center gap-4 p-4 border rounded-xl ${step.color}`}>
              {step.icon}
              <span className="font-medium">{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="py-2">
                <ArrowDown className="w-5 h-5 text-slate-500" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
