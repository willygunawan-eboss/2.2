
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
