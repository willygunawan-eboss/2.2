import React, { useState } from 'react';
import { Users, UserPlus, Search, RefreshCcw, Download, Layout, ShieldAlert, Activity } from 'lucide-react';
import { EmploymentDirectory } from '../components/EmpWorkspace/EmploymentDirectory.js';
import { HireEmployeeWizard } from '../components/EmpWorkspace/HireEmployeeWizard';
import { TransferEmployeeWizard } from '../components/EmpWorkspace/TransferEmployeeWizard';
import { PromoteEmployeeWizard } from '../components/EmpWorkspace/PromoteEmployeeWizard';


export function EmpWorkspaceView() {
  const [activeTab, setActiveTab] = useState('directory');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isPromoteOpen, setIsPromoteOpen] = useState(false);

  const handleRefresh = () => {
    window.dispatchEvent(new Event('refetch-emp'));
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
        <div className="flex items-center text-sm text-slate-500 mb-2">
          <span>Enterprise Center</span>
          <span className="mx-2">/</span>
          <span className="font-medium text-blue-600">Employment Workspace</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Employment Workspace</h1>
              <div className="text-sm text-slate-500 mt-0.5">Single Source of Truth for Enterprise Workforce</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleRefresh}
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            
            <button 
              onClick={() => setIsTransferOpen(true)}
              className="bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              Transfer Employee
            </button>
            <button 
              onClick={() => setIsPromoteOpen(true)}
              className="bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              Promote Employee
            </button>
            <button 
              onClick={() => setIsCreateOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              New Employment
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${
              activeTab === 'directory' 
                ? 'border-blue-600 text-blue-700 bg-blue-50' 
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              Employment Directory
            </div>
          </button>
          <button
            onClick={() => setActiveTab('health')}
            className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${
              activeTab === 'health' 
                ? 'border-blue-600 text-blue-700 bg-blue-50' 
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              Data Integrity
            </div>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'directory' && (
          <div className="space-y-6 fade-in">
            <EmploymentDirectory />
          </div>
        )}
        
        {activeTab === 'health' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm fade-in flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Activity className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900">Health & Integrity Module</h3>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto">This module will validate employee records against organization constraints and track missing compliance data.</p>
              <div className="mt-6 inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
                Foundation Deployed
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Create Dialog Placeholder */}
      
      {isCreateOpen && (
        <HireEmployeeWizard 
          onClose={() => setIsCreateOpen(false)}
          onSuccess={() => {
            setIsCreateOpen(false);
            handleRefresh();
          }}
        />
      )}
      {isPromoteOpen && (
        <PromoteEmployeeWizard 
          onClose={() => setIsPromoteOpen(false)}
          onSuccess={() => {
            setIsPromoteOpen(false);
            handleRefresh();
          }}
        />
      )}
      {isTransferOpen && (
        <TransferEmployeeWizard 
          onClose={() => setIsTransferOpen(false)}
          onSuccess={() => {
            setIsTransferOpen(false);
            handleRefresh();
          }}
        />
      )}

    </div>
  );
}
