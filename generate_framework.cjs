const fs = require('fs');
const path = require('path');

function write(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
}

write('src/components/workspace/core/WorkspaceContainer.tsx', `
import React from 'react';
import { cn } from '../../../lib/utils';

export function WorkspaceContainer({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("flex h-[calc(100vh-8rem)] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden", className)}>
      {children}
    </div>
  );
}
`);

write('src/components/workspace/core/WorkspaceMain.tsx', `
import React from 'react';
import { cn } from '../../../lib/utils';

export function WorkspaceMain({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("flex-1 flex flex-col bg-slate-50/30 overflow-hidden relative", className)}>
      {children}
    </div>
  );
}
`);

write('src/components/workspace/sidebar/WorkspaceSidebar.tsx', `
import React from 'react';
import { cn } from '../../../lib/utils';

export function WorkspaceSidebar({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("w-80 border-r border-slate-200 flex flex-col bg-slate-50/50 shrink-0", className)}>
      {children}
    </div>
  );
}

export function WorkspaceSidebarHeader({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("p-4 border-b border-slate-200 bg-white", className)}>
      {children}
    </div>
  );
}

export function WorkspaceSidebarContent({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("flex-1 overflow-y-auto", className)}>
      {children}
    </div>
  );
}
`);

write('src/components/workspace/header/WorkspaceHeader.tsx', `
import React from 'react';
import { cn } from '../../../lib/utils';

export interface WorkspaceHeaderProps {
  avatar?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badges?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function WorkspaceHeader({ avatar, title, subtitle, badges, actions, className }: WorkspaceHeaderProps) {
  return (
    <div className={cn("bg-white border-b border-slate-200 px-8 py-6 shrink-0", className)}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-5">
          {avatar && <div>{avatar}</div>}
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
              {badges}
            </div>
            {subtitle && (
              <div className="text-slate-500 mt-1 flex items-center gap-2">
                {subtitle}
              </div>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
`);

write('src/components/workspace/tabs/WorkspaceTabs.tsx', `
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
`);

write('src/components/workspace/content/WorkspaceContent.tsx', `
import React from 'react';
import { cn } from '../../../lib/utils';

export function WorkspaceContent({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("flex-1 overflow-y-auto p-8", className)}>
      {children}
    </div>
  );
}
`);

write('src/components/workspace/cards/WorkspaceCard.tsx', `
import React from 'react';
import { cn } from '../../../lib/utils';

export function WorkspaceCard({ title, children, className }: { title?: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("bg-white rounded-xl border border-slate-200 p-6 shadow-sm", className)}>
      {title && <h3 className="text-lg font-bold text-slate-900 mb-4">{title}</h3>}
      {children}
    </div>
  );
}
`);

write('src/components/workspace/shared/WorkspaceAvatar.tsx', `
import React from 'react';
import { cn } from '../../../lib/utils';

export interface WorkspaceAvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function WorkspaceAvatar({ src, name, size = 'md', className }: WorkspaceAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-2xl"
  };

  const css = cn(sizeClasses[size], "rounded-full shadow-sm border border-slate-200 shrink-0 flex items-center justify-center font-bold", className);

  if (src) {
    return <img src={src} alt={name} className={cn(css, "object-cover")} />;
  }

  return (
    <div className={cn(css, "bg-blue-100 text-blue-700 border-blue-200")}>
      {(name || 'U').charAt(0).toUpperCase()}
    </div>
  );
}
`);

write('src/components/workspace/empty/WorkspaceEmptyState.tsx', `
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface WorkspaceEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

export function WorkspaceEmptyState({ icon: Icon, title, description, className }: WorkspaceEmptyStateProps) {
  return (
    <div className={cn("flex-1 flex flex-col items-center justify-center text-slate-400 py-12 text-center", className)}>
      <Icon className="w-16 h-16 mb-4 text-slate-200" />
      <p className="text-lg font-medium text-slate-500">{title}</p>
      {description && <p className="text-sm mt-1">{description}</p>}
    </div>
  );
}
`);

write('src/components/workspace/index.ts', `
export * from './core/WorkspaceContainer';
export * from './core/WorkspaceMain';
export * from './sidebar/WorkspaceSidebar';
export * from './header/WorkspaceHeader';
export * from './tabs/WorkspaceTabs';
export * from './content/WorkspaceContent';
export * from './cards/WorkspaceCard';
export * from './shared/WorkspaceAvatar';
export * from './empty/WorkspaceEmptyState';
`);

console.log('Framework files generated successfully.');
