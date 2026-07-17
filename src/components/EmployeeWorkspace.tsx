
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Search, Filter, Download, Plus, ChevronRight, CheckCircle2, User, 
  Briefcase, Network, Clock, Calendar, Monitor, Award, BookOpen, Star, 
  Activity, FileText, LayoutList, MoreHorizontal, FileDown, Upload
} from 'lucide-react';
import { cn } from '../lib/utils';
import {
  WorkspaceContainer,
  WorkspaceMain,
  WorkspaceSidebar,
  WorkspaceSidebarHeader,
  WorkspaceSidebarContent,
  WorkspaceHeader,
  WorkspaceTabs,
  WorkspaceContent,
  WorkspaceCard,
  WorkspaceAvatar,
  WorkspaceEmptyState
} from './workspace';

export function EmployeeWorkspace() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const [search, setSearch] = useState('');
  const [showPromoteWizard, setShowPromoteWizard] = useState(false);
  const [showTransferWizard, setShowTransferWizard] = useState(false);
  const [showHireWizard, setShowHireWizard] = useState(false);
  
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/employees');
      const json = await res.json();
      if (json.success) setEmployees(json.data);
    } catch(e) {}
    setLoading(false);
  };

  const filteredEmployees = useMemo(() => {
    if (!search) return employees;
    const lower = search.toLowerCase();
    return employees.filter(e => 
      (e.name || '').toLowerCase().includes(lower) || 
      (e.employeeNumber || e.id || '').toLowerCase().includes(lower)
    );
  }, [employees, search]);

  return (
    <WorkspaceContainer>
      {/* LEFT PANEL: Master List */}
      <WorkspaceSidebar>
        <WorkspaceSidebarHeader>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Employees</h3>
            <button className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search employees..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-600 bg-white hover:bg-slate-50">
              <Filter className="w-3.5 h-3.5" /> Filter
            </button>
            <button className="flex items-center justify-center gap-2 px-3 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-600 bg-white hover:bg-slate-50">
              <Upload className="w-3.5 h-3.5" />
            </button>
            <button className="flex items-center justify-center gap-2 px-3 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-600 bg-white hover:bg-slate-50">
              <FileDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </WorkspaceSidebarHeader>
        
        <WorkspaceSidebarContent>
          {loading ? (
            <div className="p-4 text-center text-slate-500 text-sm">Loading...</div>
          ) : filteredEmployees.length === 0 ? (
            <div className="p-4 text-center text-slate-500 text-sm">No employees found.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredEmployees.map(emp => (
                <button 
                  key={emp.id}
                  onClick={() => setSelectedId(emp.id)}
                  className={cn(
                    "w-full text-left p-4 hover:bg-blue-50/50 transition-colors flex items-center gap-3",
                    selectedId === emp.id ? "bg-blue-50 border-l-2 border-blue-600" : "border-l-2 border-transparent"
                  )}
                >
                  <WorkspaceAvatar src={emp.avatar} name={emp.name || 'U'} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{emp.name}</p>
                    <p className="text-xs text-slate-500 truncate">{emp.position?.name || emp.department?.name || emp.employeeNumber || 'No Position'}</p>
                  </div>
                  {selectedId === emp.id && <ChevronRight className="w-4 h-4 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </WorkspaceSidebarContent>
      </WorkspaceSidebar>

      {/* RIGHT PANEL: Detail Workspace */}
      <WorkspaceMain>
        {selectedId ? (
          <EmployeeWorkspaceDetail employeeId={selectedId} onPromote={() => setShowPromoteWizard(true)} />
        ) : (
          <WorkspaceEmptyState 
            icon={Users} 
            title="Select an employee to view details"
            description="Or create a new employee record" 
          />
        )}
      </WorkspaceMain>
    </WorkspaceContainer>
  );
}

function EmployeeWorkspaceDetail({ employeeId, onPromote }: { employeeId: string, onPromote: () => void }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'General Info', icon: User },
    { id: 'employment', label: 'Employment', icon: Briefcase },
    { id: 'org', label: 'Organization', icon: Network },
    { id: 'contact', label: 'Contact', icon: FileText },
    { id: 'emergency', label: 'Emergency Contact', icon: FileText },
    { id: 'history', label: 'Employment History', icon: Clock },
    { id: 'documents', label: 'Documents', icon: BookOpen },
    { id: 'audit', label: 'Audit Trail', icon: LayoutList },
    { id: 'timeline', label: 'Activity Timeline', icon: Activity },
  ];

  useEffect(() => {
    fetchData();
  }, [employeeId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/employees/${employeeId}/workspace`);
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch(e) {}
    setLoading(false);
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" /></div>;
  }
  
  if (!data) return <div className="flex-1 flex items-center justify-center text-slate-500">Error loading data.</div>;

  return (
    <div className="flex flex-col h-full">
      <WorkspaceHeader
        avatar={<WorkspaceAvatar src={data.avatar} name={data.name || 'U'} size="xl" />}
        title={data.name}
        badges={
          <span className={cn(
            "px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-md",
            data.status === 'Active' ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" : "bg-amber-50 text-amber-700 border border-amber-200/50"
          )}>
            {data.status}
          </span>
        }
        subtitle={
          <>
            <span className="font-medium">{data.employeeNumber || data.id}</span>
            &bull;
            <span>{data.position?.name || 'No Position'}</span>
            &bull;
            <span>{data.department?.name || 'No Department'}</span>
            &bull;
            <span>{data.company?.name || 'No Company'}</span>
          </>
        }
        actions={
          <>
            <button onClick={fetchData} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">Refresh</button>
            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 flex items-center gap-2 border border-slate-200">
               Transfer
            </button>
            <button onClick={onPromote} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
               Promote <ChevronRight className="w-4 h-4" />
            </button>
          </>
        }
      />
      
      <WorkspaceTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <WorkspaceContent>
         {activeTab === 'profile' && (
           <WorkspaceCard title="General Information">
             <div className="grid grid-cols-2 gap-6">
               <div>
                 <p className="text-sm font-medium text-slate-500 mb-1">Full Name</p>
                 <p className="text-slate-900 font-medium">{data.name}</p>
               </div>
               <div>
                 <p className="text-sm font-medium text-slate-500 mb-1">Corporate Email</p>
                 <p className="text-slate-900 font-medium">{data.email}</p>
               </div>
               <div>
                 <p className="text-sm font-medium text-slate-500 mb-1">National Identity Number</p>
                 <p className="text-slate-900 font-medium">{data.nationalIdentityNumber || '-'}</p>
               </div>
               <div>
                 <p className="text-sm font-medium text-slate-500 mb-1">Birth Place & Date</p>
                 <p className="text-slate-900 font-medium">{data.birthPlace || '-'}, {data.birthDate || '-'}</p>
               </div>
             </div>
           </WorkspaceCard>
         )}
         
         {activeTab === 'org' && (
           <WorkspaceCard title="Organization Assignment">
             <div className="grid grid-cols-2 gap-6">
               <div>
                 <p className="text-sm font-medium text-slate-500 mb-1">Company</p>
                 <p className="text-slate-900 font-medium">{data.company?.name || '-'}</p>
               </div>
               <div>
                 <p className="text-sm font-medium text-slate-500 mb-1">Branch</p>
                 <p className="text-slate-900 font-medium">{data.branch?.name || '-'}</p>
               </div>
               <div>
                 <p className="text-sm font-medium text-slate-500 mb-1">Department</p>
                 <p className="text-slate-900 font-medium">{data.department?.name || '-'}</p>
               </div>
               <div>
                 <p className="text-sm font-medium text-slate-500 mb-1">Position</p>
                 <p className="text-slate-900 font-medium">{data.position?.name || '-'}</p>
               </div>
             </div>
           </WorkspaceCard>
         )}

         {['documents', 'timeline', 'audit'].includes(activeTab) && (
           <WorkspaceEmptyState
             icon={LayoutList}
             title={`Placeholder for ${tabs.find(t => t.id === activeTab)?.label}`}
             description="To be implemented in upcoming sprints."
           />
         )}
         
         {!['profile', 'org', 'documents', 'timeline', 'audit'].includes(activeTab) && (
           <WorkspaceCard>
             <div className="text-center text-slate-500">
               Content for {tabs.find(t => t.id === activeTab)?.label}
             </div>
           </WorkspaceCard>
         )}
      </WorkspaceContent>
    </div>
  );
}
