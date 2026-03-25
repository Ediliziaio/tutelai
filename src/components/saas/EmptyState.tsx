import { createElement } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon | React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({
  icon: IconProp = Inbox,
  title,
  description,
  action,
  children,
  className,
}: EmptyStateProps) => {
  const isComponent = typeof IconProp === 'function' || (typeof IconProp === 'object' && IconProp !== null && '$$typeof' in (IconProp as any) && 'render' in (IconProp as any));
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
        {isComponent ? createElement(IconProp as LucideIcon, { className: 'h-8 w-8 text-muted-foreground' }) : IconProp}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>}
      {action || children}
    </div>
  );
};