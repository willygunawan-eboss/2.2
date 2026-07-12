import React, { useState } from 'react';
import { 
  Building2, Users, FileText, Settings, Shield, Activity, 
  Database, Network, Server, Lock, Clock, CalendarDays,
  Briefcase, CheckCircle, Save, ChevronRight
} from 'lucide-react';
import { OrgMasterView } from './OrgMasterView';
import { SystemReadinessView } from './SystemReadinessView';
import { BranchManager } from '../components/BranchManager';
import { DivisionManager } from '../components/DivisionManager';
import { DepartmentManager } from '../components/DepartmentManager';
import SectionManager from '../components/SectionManager';
import TeamManager from '../components/TeamManager';
import { JobGradeManager } from '../components/JobGradeManager';
import { PositionManager } from '../components/PositionManager';

export function SettingsView() {
  const [activeTab, setActiveTab] = useState('company');

  const navGroups = [
    {
      title: 'Organization',
      icon: <Building2 className="w-4 h-4 text-slate-400" />,
      items: [
        { id: 'company', label: 'Company' },
        { id: 'branch', label: 'Branch' },
        { id: 'division', label: 'Division' },
        { id: 'department', label: 'Department' },
        { id: 'section', label: 'Section' },
        { id: 'team', label: 'Team' },
        { id: 'position', label: 'Position' },
        { id: 'job_grade', label: 'Job Grade' }
      ]
    },
    {
      title: 'Human Resources',
      icon: <Users className="w-4 h-4 text-slate-400" />,
      items: [
        { id: 'calendar', label: 'Working Calendar' },
        { id: 'holiday', label: 'Holiday' },
        { id: 'shift', label: 'Shift' },
        { id: 'emp_type', label: 'Employment Type' },
        { id: 'leave_policy', label: 'Leave Policy' },
        { id: 'payroll_policy', label: 'Payroll Policy' }
      ]
    },
    {
      title: 'Workflow',
      icon: <FileText className="w-4 h-4 text-slate-400" />,
      items: [
        { id: 'approval_matrix', label: 'Approval Matrix' },
        { id: 'numbering', label: 'Numbering Rules' },
        { id: 'notification', label: 'Notification' }
      ]
    },
    {
      title: 'Security',
      icon: <Shield className="w-4 h-4 text-slate-400" />,
      items: [
        { id: 'users', label: 'Users' },
        { id: 'roles', label: 'Roles' },
        { id: 'permissions', label: 'Permissions' },
        { id: 'rbac_cache', label: 'RBAC Cache' },
        { id: 'audit_log', label: 'Audit Log' }
      ]
    },
    {
      title: 'Infrastructure',
      icon: <Server className="w-4 h-4 text-slate-400" />,
      items: [
        { id: 'setup_center', label: 'ERP Setup Center' },
        { id: 'api', label: 'API' },
        { id: 'integrations', label: 'Integrations' },
        { id: 'backup', label: 'Backup' },
        { id: 'monitoring', label: 'Monitoring' },
        { id: 'database', label: 'Database' },
        { id: 'ai', label: 'AI Configuration' },
        { id: 'license', label: 'License' }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full mx-auto w-full bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Enterprise Control Center</h1>
            <p className="text-slate-500 mt-1 text-sm">Configure system preferences, security, and master data across all ERP modules.</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </div>
      <div className="flex flex-1 max-w-7xl mx-auto w-full p-8 gap-8 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          {navGroups.map(group => (
            <div key={group.title} className="flex flex-col gap-1">
              <div className="flex items-center gap-2 px-2 pb-1">
                {group.icon}
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{group.title}</span>
              </div>
              {group.items.map(item => (
                <button 
                  key={item.id} 
                  onClick={() => setActiveTab(item.id)} 
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === item.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                >
                  {item.label}
                  {activeTab === item.id && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </div>
          ))}
        </div>
        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          {['branch', 'division', 'department', 'section', 'team', 'position', 'job_grade'].includes(activeTab) ? (
            <div className="flex-1 overflow-hidden">
              {activeTab === 'branch' && <BranchManager />}
              {activeTab === 'division' && <DivisionManager />}
              {activeTab === 'department' && <DepartmentManager />}
              {activeTab === 'section' && <SectionManager />}
              {activeTab === 'team' && <TeamManager />}
              {activeTab === 'position' && <PositionManager />}
              {activeTab === 'job_grade' && <JobGradeManager />}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-8">
              {['company'].includes(activeTab) && <OrgMasterView defaultTab={activeTab} />}
              {activeTab === 'setup_center' && <SystemReadinessView />}
              {!['company', 'branch', 'division', 'department', 'section', 'team', 'position', 'job_grade', 'setup_center'].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                  <Settings className="w-16 h-16 opacity-20" />
                  <h3 className="text-lg font-medium text-slate-900">Module Pending Initialization</h3>
                  <p className="text-sm text-center max-w-sm">The <strong>{navGroups.flatMap(g => g.items).find(i => i.id === activeTab)?.label}</strong> module is slated for upcoming enterprise deployment phases.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
