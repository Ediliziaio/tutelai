import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, FolderOpen, Receipt, Info, Check, CheckCheck,
  Filter, Search, Trash2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { mockNotifiche, timeAgo } from '@/data/mockDashboardData';
import type { Notifica } from '@/types/auth';

const tipoIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  pratica: FolderOpen,
  fattura: Receipt,
  cliente: Info,
  sistema: Info,
};

const tipoLabels: Record<string, string> = {
  pratica: 'Pratica',
  fattura: 'Fattura',
  cliente: 'Cliente',
  sistema: 'Sistema',
};

const tipoBadgeColor: Record<string, string> = {
  pratica: 'bg-sky-100 text-sky-700',
  fattura: 'bg-emerald-100 text-emerald-700',
  cliente: 'bg-violet-100 text-violet-700',
  sistema: 'bg-slate-100 text-slate-600',
};

interface Props {
  area: 'admin' | 'app';
}

const NotifichePage = ({ area }: Props) => {
  const navigate = useNavigate();
  const userId = area === 'admin' ? 'admin' : 'cliente';

  const [notifiche, setNotifiche] = useState<Notifica[]>(
    mockNotifiche.filter((n) => n.user_id === userId)
  );
  const [search, setSearch] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string | null>(null);
  const [tab, setTab] = useState('tutte');

  const filtered = useMemo(() => {
    let list = [...notifiche];
    if (tab === 'non_lette') list = list.filter((n) => !n.letta);
    if (tab === 'lette') list = list.filter((n) => n.letta);
    if (filtroTipo) list = list.filter((n) => n.tipo === filtroTipo);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (n) => n.titolo.toLowerCase().includes(q) || n.messaggio?.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [notifiche, tab, filtroTipo, search]);

  const nonLette = notifiche.filter((n) => !n.letta).length;

  const segnaTutteLette = () => {
    setNotifiche((prev) => prev.map((n) => ({ ...n, letta: true })));
  };

  const segnaLetta = (id: string) => {
    setNotifiche((prev) => prev.map((n) => (n.id === id ? { ...n, letta: true } : n)));
  };

  const elimina = (id: string) => {
    setNotifiche((prev) => prev.filter((n) => n.id !== id));
  };

  const tipi = useMemo(() => {
    const set = new Set(notifiche.map((n) => n.tipo));
    return Array.from(set);
  }, [notifiche]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Bell className="h-6 w-6 text-sky-500" /> Notifiche
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {nonLette > 0 ? `${nonLette} non lette` : 'Tutto letto!'} · {notifiche.length} totali
          </p>
        </div>
        {nonLette > 0 && (
          <Button variant="outline" size="sm" onClick={segnaTutteLette} className="gap-2">
            <CheckCheck className="h-4 w-4" /> Segna tutte lette
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cerca nelle notifiche..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filtroTipo === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFiltroTipo(null)}
          >
            Tutte
          </Button>
          {tipi.map((tipo) => (
            <Button
              key={tipo}
              variant={filtroTipo === tipo ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFiltroTipo(filtroTipo === tipo ? null : tipo)}
              className="gap-1.5"
            >
              {tipoLabels[tipo] || tipo}
            </Button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-slate-100">
          <TabsTrigger value="tutte">Tutte ({notifiche.length})</TabsTrigger>
          <TabsTrigger value="non_lette">Non lette ({nonLette})</TabsTrigger>
          <TabsTrigger value="lette">Lette ({notifiche.length - nonLette})</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {filtered.length === 0 ? (
            <Card className="border-slate-200">
              <CardContent className="flex flex-col items-center justify-center py-16 text-slate-400">
                <Bell className="h-12 w-12 mb-3 opacity-30" />
                <p className="text-sm font-medium">Nessuna notifica trovata</p>
                <p className="text-xs mt-1">Prova a cambiare i filtri</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {filtered.map((n) => {
                const Icon = tipoIcons[n.tipo] || Info;
                return (
                  <Card
                    key={n.id}
                    className={cn(
                      'border-slate-200 transition-all hover:shadow-sm cursor-pointer',
                      !n.letta && 'border-l-[3px] border-l-sky-500 bg-sky-50/30'
                    )}
                  >
                    <CardContent className="flex items-start gap-3 p-4">
                      {/* Dot */}
                      <div className="mt-1 shrink-0">
                        {!n.letta ? (
                          <span className="flex h-2.5 w-2.5 rounded-full bg-sky-500" />
                        ) : (
                          <span className="flex h-2.5 w-2.5 rounded-full bg-transparent" />
                        )}
                      </div>

                      {/* Icon */}
                      <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', tipoBadgeColor[n.tipo])}>
                        <Icon className="h-4 w-4" />
                      </div>

                      {/* Content */}
                      <div
                        className="flex-1 min-w-0"
                        onClick={() => {
                          segnaLetta(n.id);
                          if (n.link) navigate(n.link);
                        }}
                      >
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className={cn('text-sm truncate', !n.letta ? 'font-semibold text-slate-800' : 'text-slate-700')}>
                            {n.titolo}
                          </p>
                          <Badge className={cn('text-[10px] shrink-0', tipoBadgeColor[n.tipo])}>
                            {tipoLabels[n.tipo]}
                          </Badge>
                        </div>
                        {n.messaggio && (
                          <p className="text-sm text-slate-500 line-clamp-2">{n.messaggio}</p>
                        )}
                        <p className="text-xs text-slate-400 mt-1">{timeAgo(n.created_at)}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        {!n.letta && (
                          <button
                            onClick={(e) => { e.stopPropagation(); segnaLetta(n.id); }}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-sky-600 transition-colors"
                            title="Segna come letta"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); elimina(n.id); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                          title="Elimina"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotifichePage;
