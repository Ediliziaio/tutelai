import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  className?: string;
}

export const StatCard = ({ label, value, icon: Icon, trend, className }: StatCardProps) => (
  <div
    className={cn(
      'bg-white rounded-xl border border-slate-200/80 shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.06)] p-6',
      className
    )}
  >
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-2xl font-bold font-subtitle tracking-tight text-slate-900">{value}</p>
        {trend && (
          <div className="flex items-center gap-1 text-xs font-medium">
            {trend.value >= 0 ? (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-red-500" />
            )}
            <span className={trend.value >= 0 ? 'text-emerald-600' : 'text-red-600'}>
              {trend.value > 0 ? '+' : ''}
              {trend.value}%
            </span>
            <span className="text-slate-400">{trend.label}</span>
          </div>
        )}
      </div>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50">
        <Icon className="h-5 w-5 text-sky-600" />
      </div>
    </div>
  </div>
);
