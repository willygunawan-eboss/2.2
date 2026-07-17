
import React from 'react';
import { cn } from '../../../lib/utils';

export function WorkspaceContainer({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("flex h-[calc(100vh-8rem)] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden", className)}>
      {children}
    </div>
  );
}
