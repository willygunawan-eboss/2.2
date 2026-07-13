import React, { useState } from 'react';
import { Network, Activity, BarChart3, Layout, ShieldAlert } from 'lucide-react';
import { OrganizationSummary } from '../components/OrgWorkspace/OrganizationSummary';
import { OrganizationReadiness } from '../components/OrgWorkspace/OrganizationReadiness';
import { OrganizationInsight } from '../components/OrgWorkspace/OrganizationInsight';
import { OrganizationExplorer } from '../components/OrgWorkspace/OrganizationExplorer';
import { DependencyGraph } from '../components/OrgWorkspace/DependencyGraph';
import { CEOView } from '../components/OrgWorkspace/CEOView';
import { OrganizationHealth } from '../components/OrgWorkspace/OrganizationHealth';

export function OrgWorkspaceView() {
  const [activeTab, setActiveTab] = useState('executive');

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-900">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Network className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Organization Workspace</h1>
            <div className="text-sm text-slate-400">Command Center & Visual Engine</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('executive')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
              activeTab === 'executive' 
                ? 'border-blue-500 text-blue-400 bg-blue-500/5' 
                : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Executive View
            </div>
          </button>
          <button
            onClick={() => setActiveTab('explorer')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
              activeTab === 'explorer' 
                ? 'border-blue-500 text-blue-400 bg-blue-500/5' 
                : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              Explorer & Insights
            </div>
          </button>
          <button
            onClick={() => setActiveTab('health')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${activeTab === 'health' ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800'}`}
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              Health & Integrity
            </div>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'executive' && (
          <div className="space-y-6 fade-in">
            <CEOView />
            <OrganizationSummary />
            <OrganizationReadiness />
          </div>
        )}

        {activeTab === 'explorer' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 fade-in">
            <div className="lg:col-span-2 space-y-6">
              <OrganizationExplorer />
            </div>
            <div className="space-y-6">
              <OrganizationInsight />
              <DependencyGraph />
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="fade-in">
            <OrganizationHealth />
          </div>
        )}

      </div>
    </div>
  );
}
