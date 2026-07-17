
import React from 'react';
import { cn } from '../../../lib/utils';

export function WorkspaceContent({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("flex-1 overflow-y-auto p-8", className)}>
      {children}
    </div>
  );
}
