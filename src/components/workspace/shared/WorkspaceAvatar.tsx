
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
