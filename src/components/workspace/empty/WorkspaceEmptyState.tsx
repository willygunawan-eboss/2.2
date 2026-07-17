
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
