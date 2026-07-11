import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, Users, FileText, Shield, User, Briefcase, 
  CreditCard, Package, HelpCircle, Bell, Link, CheckCircle2,
  AlertTriangle, ChevronRight, Check
} from 'lucide-react';

interface SetupModule {
  id: string;
  title: string;
  icon: any;
  ready: boolean;
  progress: number;
  dependencies: string[];
  details: Record<string, number>;
  path: string;
}

export function SetupCenterView({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [modules, setModules] = useState<SetupModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/bootstrap/status');
        if (res.ok) {
          const { data } = await res.json();
          const moduleMap = data.modules || {};
          
          setModules([
            {
              id: 'organization',
              title: 'Organization',
              icon: Building2,
              ready: moduleMap.organization?.ready || false,
              progress: moduleMap.organization?.progress || 0,
              dependencies: moduleMap.organization?.dependencies || [],
              details: moduleMap.organization?.details || {},
              path: 'settings'
            },
            {
              id: 'hr',
              title: 'Human Resource',
              icon: Users,
              ready: moduleMap.hr?.ready || false,
              progress: moduleMap.hr?.progress || 0,
              dependencies: moduleMap.hr?.dependencies || [],
              details: moduleMap.hr?.details || {},
              path: 'hr'
            },
            {
              id: 'reference',
              title: 'Reference',
              icon: FileText,
              ready: moduleMap.reference?.ready || false,
              progress: moduleMap.reference?.progress || 0,
              dependencies: moduleMap.reference?.dependencies || [],
              details: moduleMap.reference?.details || {},
              path: 'settings'
            },
            {
              id: 'rbac',
              title: 'RBAC',
              icon: Shield,
              ready: moduleMap.rbac?.ready || false,
              progress: moduleMap.rbac?.progress || 0,
              dependencies: moduleMap.rbac?.dependencies || [],
              details: moduleMap.rbac?.details || {},
              path: 'settings'
            },
            {
              id: 'crm',
              title: 'CRM',
              icon: User,
              ready: moduleMap.crm?.ready || false,
              progress: moduleMap.crm?.progress || 0,
              dependencies: moduleMap.crm?.dependencies || [],
              details: moduleMap.crm?.details || {},
              path: 'crm'
            },
            {
              id: 'asset',
              title: 'Asset',
              icon: Briefcase,
              ready: moduleMap.asset?.ready || false,
              progress: moduleMap.asset?.progress || 0,
              dependencies: moduleMap.asset?.dependencies || [],
              details: moduleMap.asset?.details || {},
              path: 'asset'
            },
            {
              id: 'contract',
              title: 'Contract',
              icon: FileText,
              ready: moduleMap.contract?.ready || false,
              progress: moduleMap.contract?.progress || 0,
              dependencies: moduleMap.contract?.dependencies || [],
              details: moduleMap.contract?.details || {},
              path: 'project'
            },
            {
              id: 'finance',
              title: 'Finance',
              icon: CreditCard,
              ready: moduleMap.finance?.ready || false,
              progress: moduleMap.finance?.progress || 0,
              dependencies: moduleMap.finance?.dependencies || [],
              details: moduleMap.finance?.details || {},
              path: 'finance'
            },
            {
              id: 'inventory',
              title: 'Inventory',
              icon: Package,
              ready: moduleMap.inventory?.ready || false,
              progress: moduleMap.inventory?.progress || 0,
              dependencies: moduleMap.inventory?.dependencies || [],
              details: moduleMap.inventory?.details || {},
              path: 'inventory'
            },
            {
              id: 'helpdesk',
              title: 'Helpdesk',
              icon: HelpCircle,
              ready: moduleMap.helpdesk?.ready || false,
              progress: moduleMap.helpdesk?.progress || 0,
              dependencies: moduleMap.helpdesk?.dependencies || [],
              details: moduleMap.helpdesk?.details || {},
              path: 'helpdesk'
            },
            {
              id: 'notification',
              title: 'Notification',
              icon: Bell,
              ready: moduleMap.notification?.ready || false,
              progress: moduleMap.notification?.progress || 0,
              dependencies: moduleMap.notification?.dependencies || [],
              details: moduleMap.notification?.details || {},
              path: 'settings'
            },
            {
              id: 'integration',
              title: 'Integration',
              icon: Link,
              ready: moduleMap.integration?.ready || false,
              progress: moduleMap.integration?.progress || 0,
              dependencies: moduleMap.integration?.dependencies || [],
              details: moduleMap.integration?.details || {},
              path: 'settings'
            }
          ]);
        }
      } catch (err) {
        console.error("Failed to load setup center status", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  if (loading) {
    return <div className="flex h-full items-center justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
  }

  const handleRunVerification = async () => {
    // We would call a backend endpoint here, but for now we'll just navigate to a verification/health view
    onNavigate('system_health');
  };

  const getSmartResumeStep = () => {
    // Find the first module that has all dependencies met but is not ready
    for (const mod of modules) {
      if (!mod.ready) {
        const depsMet = mod.dependencies.every(depId => {
          const dep = modules.find(m => m.id === depId);
          return dep ? dep.ready : true;
        });
        if (depsMet) return mod;
      }
    }
    return null;
  };

  const resumeModule = getSmartResumeStep();

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">ERP Setup Center</h1>
          <p className="text-slate-500 mt-1 text-sm">Centralized configuration and readiness engine for all enterprise modules.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleRunVerification} className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Run Verification
          </button>
          {resumeModule && (
            <button onClick={() => onNavigate(resumeModule.path)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
              Continue Setup ({resumeModule.title})
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {modules.map(mod => {
          // Check dependencies
          const unmetDeps = mod.dependencies.filter(depId => {
            const dep = modules.find(m => m.id === depId);
            return dep ? !dep.ready : false;
          });
          
          const Icon = mod.icon;
          const isBlocked = unmetDeps.length > 0;

          return (
            <div key={mod.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg flex items-center justify-center ${mod.ready ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{mod.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {mod.ready ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                          <Check className="w-3 h-3" /> Ready
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-slate-500">In Progress ({mod.progress}%)</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Progress Circle */}
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="4"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={mod.ready ? "#10b981" : "#3b82f6"}
                      strokeWidth="4"
                      strokeDasharray={`${mod.progress}, 100`}
                    />
                  </svg>
                </div>
              </div>

              <div className="space-y-4">
                {/* Details Data */}
                {Object.keys(mod.details).length > 0 && (
                  <div className="bg-slate-50 rounded-lg p-3 grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(mod.details).map(([key, count]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-slate-500 capitalize">{key}</span>
                        <span className="font-bold text-slate-900">{count as number}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Dependencies */}
                {mod.dependencies.length > 0 && (
                  <div className="text-xs">
                    <span className="font-semibold text-slate-700 block mb-1">Dependencies:</span>
                    <div className="flex flex-wrap gap-2">
                      {mod.dependencies.map(depId => {
                        const dep = modules.find(m => m.id === depId);
                        const isMet = dep ? dep.ready : true;
                        return (
                          <span key={depId} className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border ${isMet ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                            {isMet ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                            {dep?.title || depId}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => onNavigate(mod.path)}
                  disabled={isBlocked}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isBlocked 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {isBlocked ? 'Blocked by Dependency' : 'Configure Module'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
