
import React from 'react';
import { cn } from '../../../lib/utils';

export function WorkspaceMain({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("flex-1 flex flex-col bg-slate-50/30 overflow-hidden relative", className)}>
      {children}
    </div>
  );
}
