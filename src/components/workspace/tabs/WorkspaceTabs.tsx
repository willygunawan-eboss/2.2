
import React from 'react';
import { cn } from '../../../lib/utils';
import { LucideIcon } from 'lucide-react';

export interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
}

export interface WorkspaceTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function WorkspaceTabs({ tabs, activeTab, onChange, className }: WorkspaceTabsProps) {
  return (
    <div className={cn("bg-white border-b border-slate-200 px-8 shrink-0 overflow-x-auto", className)}>
      <div className="flex space-x-6">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "py-4 text-sm font-medium flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors",
                activeTab === tab.id 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              )}
            >
              {Icon && <Icon className="w-4 h-4" />}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
