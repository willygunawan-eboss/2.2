import React, { useState } from 'react';
import { 
  Building2, Users, FileText, Settings, Shield, Activity, 
  Database, Network, Server, Lock, Clock, CalendarDays,
  Briefcase, CheckCircle, Save, ChevronRight, ChevronLeft, LayoutDashboard, Link, Cpu
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
import { SetupCenterView } from './SetupCenterView';

export function SettingsView() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('');

  const controlCenters = [
    {
      id: 'organization',
      title: 'Organization',
      description: 'Configure enterprise structure, hierarchy, and legal entities.',
      icon: <Building2 className="w-6 h-6 text-blue-500" />,
      progress: 100,
      status: 'Configured',
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
      id: 'hr',
      title: 'Human Resources',
      description: 'Manage employment rules, working hours, and leave policies.',
      icon: <Users className="w-6 h-6 text-emerald-500" />,
      progress: 25,
      status: 'Incomplete',
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
      id: 'master_data',
      title: 'Master Data',
      description: 'Global configuration for core ERP master data sets.',
      icon: <Database className="w-6 h-6 text-purple-500" />,
      progress: 0,
      status: 'Pending',
      items: [
        { id: 'banks', label: 'Banks' },
        { id: 'currencies', label: 'Currencies' },
        { id: 'locations', label: 'Locations' },
        { id: 'cost_centers', label: 'Cost Centers' }
      ]
    },
    {
      id: 'workflow',
      title: 'Workflow',
      description: 'Define approval matrices, numbering rules, and notifications.',
      icon: <FileText className="w-6 h-6 text-amber-500" />,
      progress: 60,
      status: 'In Progress',
      items: [
        { id: 'approval_matrix', label: 'Approval Matrix' },
        { id: 'numbering', label: 'Numbering Rules' },
        { id: 'notification', label: 'Notification' }
      ]
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Manage users, roles, permissions, and audit logs.',
      icon: <Shield className="w-6 h-6 text-rose-500" />,
      progress: 80,
      status: 'In Progress',
      items: [
        { id: 'users', label: 'Users' },
        { id: 'roles', label: 'Roles' },
        { id: 'permissions', label: 'Permissions' },
        { id: 'rbac_cache', label: 'RBAC Cache' },
        { id: 'audit_log', label: 'Audit Log' }
      ]
    },
    {
      id: 'infrastructure',
      title: 'Infrastructure',
      description: 'System-wide technical configuration and databases.',
      icon: <Server className="w-6 h-6 text-slate-500" />,
      progress: 100,
      status: 'Configured',
      items: [
        { id: 'setup_center', label: 'ERP Setup Center' },
        { id: 'backup', label: 'Backup & Restore' },
        { id: 'database', label: 'Database Health' },
        { id: 'license', label: 'License' }
      ]
    },
    {
      id: 'integration',
      title: 'Integration',
      description: 'Third-party APIs, webhooks, and external services.',
      icon: <Link className="w-6 h-6 text-indigo-500" />,
      progress: 0,
      status: 'Pending',
      items: [
        { id: 'api_keys', label: 'API Keys' },
        { id: 'webhooks', label: 'Webhooks' },
        { id: 'sso', label: 'SSO Configuration' }
      ]
    },
    {
      id: 'monitoring',
      title: 'Monitoring',
      description: 'System health, performance metrics, and activity tracking.',
      icon: <Activity className="w-6 h-6 text-teal-500" />,
      progress: 50,
      status: 'In Progress',
      items: [
        { id: 'system_health', label: 'System Health' },
        { id: 'performance', label: 'Performance Metrics' },
        { id: 'error_logs', label: 'Error Logs' }
      ]
    },
    {
      id: 'ai',
      title: 'AI',
      description: 'Artificial Intelligence settings and automation rules.',
      icon: <Cpu className="w-6 h-6 text-pink-500" />,
      progress: 0,
      status: 'Pending',
      items: [
        { id: 'ai_models', label: 'AI Models' },
        { id: 'automation', label: 'Automation Rules' },
        { id: 'ai_logs', label: 'AI Activity Logs' }
      ]
    },
    {
      id: 'system',
      title: 'System',
      description: 'Global parameters, branding, and default preferences.',
      icon: <Settings className="w-6 h-6 text-gray-500" />,
      progress: 90,
      status: 'In Progress',
      items: [
        { id: 'general', label: 'General Settings' },
        { id: 'branding', label: 'Branding & Theme' },
        { id: 'localization', label: 'Localization' }
      ]
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    const category = controlCenters.find(c => c.id === categoryId);
    if (category && category.items.length > 0) {
      setActiveCategory(categoryId);
      setActiveTab(category.items[0].id);
    }
  };

  const renderDashboard = () => (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-50 custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900">System Modules</h2>
          <p className="text-sm text-slate-500 mt-1">Select a module to configure its settings and master data.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {controlCenters.map(center => (
            <div 
              key={center.id} 
              onClick={() => handleCategoryClick(center.id)}
              className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                  {center.icon}
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    center.progress === 100 ? 'bg-emerald-100 text-emerald-700' : 
                    center.progress > 0 ? 'bg-amber-100 text-amber-700' : 
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {center.status}
                  </span>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-2">{center.title}</h3>
              <p className="text-sm text-slate-500 flex-1">{center.description}</p>
              
              <div className="mt-6">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500 font-medium">Configuration Progress</span>
                  <span className="text-slate-700 font-bold">{center.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${center.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    style={{ width: `${center.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCategoryView = () => {
    const category = controlCenters.find(c => c.id === activeCategory);
    if (!category) return null;

    return (
      <div className="flex flex-1 max-w-7xl mx-auto w-full p-8 gap-8 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          <button 
            onClick={() => setActiveCategory(null)}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Control Center
          </button>
          
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 px-2 pb-2 mb-2 border-b border-slate-200">
              {category.icon}
              <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">{category.title}</span>
            </div>
            {category.items.map(item => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  activeTab === item.id 
                    ? 'bg-blue-50 text-blue-700 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                }`}
              >
                {item.label}
                {activeTab === item.id && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
          </div>
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
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {['company'].includes(activeTab) && <OrgMasterView defaultTab={activeTab} />}
              {activeTab === 'setup_center' && <SetupCenterView onNavigate={() => {}} />}
              {activeTab === 'system_health' && <SystemReadinessView />}
              {!['company', 'branch', 'division', 'department', 'section', 'team', 'position', 'job_grade', 'setup_center', 'system_health'].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                  <Settings className="w-16 h-16 opacity-20" />
                  <h3 className="text-lg font-medium text-slate-900">Module Pending Initialization</h3>
                  <p className="text-sm text-center max-w-sm">
                    The <strong>{category.items.find(i => i.id === activeTab)?.label}</strong> module is slated for upcoming enterprise deployment phases.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full mx-auto w-full bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-8 py-5 shrink-0">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Enterprise Control Center</h1>
              <p className="text-slate-500 mt-1 text-sm">Configure system preferences, security, and master data across all ERP modules.</p>
            </div>
          </div>
          {activeCategory && (
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Configuration
            </button>
          )}
        </div>
      </div>

      {activeCategory ? renderCategoryView() : renderDashboard()}
    </div>
  );
}
