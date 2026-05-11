import React from 'react';
import { cn } from '@/lib/utils';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, className }) {
  return (
    <div className={cn("bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2 tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className="h-12 w-12 rounded-2xl bg-accent flex items-center justify-center shrink-0">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1">
          <span className={cn(
            "text-sm font-semibold",
            trend > 0 ? "text-green-600" : "text-destructive"
          )}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-xs text-muted-foreground">vs. semana anterior</span>
        </div>
      )}
    </div>
  );
}