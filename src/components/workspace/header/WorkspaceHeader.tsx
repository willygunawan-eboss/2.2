
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
