
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
