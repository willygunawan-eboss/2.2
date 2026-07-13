import React, { useState } from 'react';
import { 
  Network, Activity, BarChart3, Layout, ShieldAlert, 
  ChevronRight, RefreshCcw, Search, Plus, Download 
} from 'lucide-react';
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
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
        <div className="flex items-center text-sm text-slate-500 mb-2">
          <span>Enterprise Center</span>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="font-medium text-blue-600">Organization Workspace</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Organization Workspace</h1>
              <div className="text-sm text-slate-500 mt-0.5">Command Center & Visual Engine for Enterprise Structure</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search organization..." 
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
              <RefreshCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Quick Action
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
          <button
            onClick={() => setActiveTab('executive')}
            className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${
              activeTab === 'executive' 
                ? 'border-blue-600 text-blue-700 bg-blue-50' 
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Executive View
            </div>
          </button>
          <button
            onClick={() => setActiveTab('explorer')}
            className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${
              activeTab === 'explorer' 
                ? 'border-blue-600 text-blue-700 bg-blue-50' 
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              Explorer & Insights
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
              Health & Integrity
            </div>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'executive' && (
          <div className="space-y-6 fade-in">
            <CEOView />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <OrganizationSummary />
              <OrganizationReadiness />
            </div>
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
