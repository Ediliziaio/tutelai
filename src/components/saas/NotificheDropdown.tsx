import { useState } from 'react';
import { Bell, FolderOpen, Receipt, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { mockNotifiche, timeAgo } from '@/data/mockDashboardData';
import { cn } from '@/lib/utils';
import type { Notifica } from '@/types/auth';

const tipoIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  pratica: FolderOpen,
  fattura: Receipt,
  cliente: Info,
  sistema: Info,
};

export const NotificheDropdown = ({ area }: { area: 'admin' | 'app' }) => {
  const navigate = useNavigate();
  const userId = area === 'admin' ? 'admin' : 'cliente';
  const [notifiche, setNotifiche] = useState<Notifica[]>(
    mockNotifiche.filter((n) => n.user_id === userId)
  );

  const nonLette = notifiche.filter((n) => !n.letta).length;

  const segnaTutteLette = () => {
    setNotifiche((prev) => prev.map((n) => ({ ...n, letta: true })));
  };

  const handleClick = (notifica: Notifica) => {
    setNotifiche((prev) =>
      prev.map((n) => (n.id === notifica.id ? { ...n, letta: true } : n))
    );
    if (notifica.link) navigate(notifica.link);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
          <Bell className={cn('h-5 w-5', nonLette > 0 && 'animate-bounce')} style={{ animationIterationCount: 1 }} />
          {nonLette > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {nonLette}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 max-h-96 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <span className="text-sm font-semibold text-slate-800">Notifiche</span>
          {nonLette > 0 && (
            <button onClick={segnaTutteLette} className="text-xs text-sky-500 hover:text-sky-600 font-medium">
              Segna tutte lette
            </button>
          )}
        </div>
        <div className="overflow-y-auto max-h-72">
          {notifiche.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <Bell className="h-8 w-8 mb-2 opacity-40" />
              <p className="text-sm">Tutto in ordine!</p>
            </div>
          ) : (
            notifiche.map((n) => {
              const Icon = tipoIcons[n.tipo] || Info;
              return (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={cn(
                    'flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors',
                    !n.letta && 'bg-sky-50/50'
                  )}
                >
                  {!n.letta && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky-500" />}
                  {n.letta && <span className="mt-1.5 h-2 w-2 shrink-0" />}
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm truncate', !n.letta ? 'font-semibold text-slate-800' : 'text-slate-600')}>
                      {n.titolo}
                    </p>
                    {n.messaggio && <p className="text-xs text-slate-400 truncate">{n.messaggio}</p>}
                    <p className="text-xs text-slate-300 mt-0.5">{timeAgo(n.created_at)}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
        <div className="border-t border-slate-100 px-4 py-2">
          <button className="text-xs text-sky-500 hover:text-sky-600 font-medium w-full text-center">
            Vedi tutte le notifiche →
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
