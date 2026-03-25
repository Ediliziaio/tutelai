import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockPratiche, mockOperatori, daysUntil, timeAgo } from '@/data/mockDashboardData';
import { StatusBadge } from '@/components/saas/StatusBadge';
import { EmptyState } from '@/components/saas/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, Building2, Zap, Phone, Mail, AlertTriangle, HelpCircle, Clock, Calendar, ChevronRight } from 'lucide-react';
import type { TipoPratica, Priorita } from '@/types/auth';

const tipoLabels: Record<TipoPratica, string> = { fattura: 'Fattura', enea: 'ENEA', finanziamento: 'Finanziamento', call_center: 'Call Center', segreteria: 'Segreteria', recupero_crediti: 'Recupero', altro: 'Altro' };
const tipoBadgeColors: Record<TipoPratica, string> = { fattura: 'bg-sky-100 text-sky-700', enea: 'bg-emerald-100 text-emerald-700', finanziamento: 'bg-amber-100 text-amber-700', call_center: 'bg-violet-100 text-violet-700', segreteria: 'bg-pink-100 text-pink-700', recupero_crediti: 'bg-red-100 text-red-700', altro: 'bg-slate-100 text-slate-600' };
const prioritaDots: Record<Priorita, string> = { urgente: 'bg-red-500 animate-pulse', alta: 'bg-amber-500', normale: 'bg-sky-500', bassa: 'bg-slate-400' };

const AppPratiche = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('tutte');

  // Filtro mock: pratiche del tenant t1 (cliente demo)
  const clientPratiche = useMemo(() => mockPratiche.filter(p => p.tenant_id === 't1'), []);

  const filtered = useMemo(() => {
    if (tab === 'tutte') return clientPratiche;
    if (tab === 'in_corso') return clientPratiche.filter(p => ['in_attesa', 'in_corso', 'in_revisione'].includes(p.stato));
    if (tab === 'completate') return clientPratiche.filter(p => p.stato === 'completata');
    return clientPratiche;
  }, [clientPratiche, tab]);

  if (clientPratiche.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold font-subtitle text-slate-900 mb-6">Le mie Pratiche</h1>
        <EmptyState
          icon={FileText}
          title="Nessuna pratica"
          description="Non hai ancora richieste attive. Crea la tua prima richiesta per delegare un'attività al nostro team."
          action={<Button onClick={() => navigate('/app/pratiche/nuova')} className="gap-1.5"><Plus className="h-4 w-4" /> Fai la prima richiesta</Button>}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold font-subtitle text-slate-900">Le mie Pratiche</h1>
        <Button onClick={() => navigate('/app/pratiche/nuova')} className="gap-1.5"><Plus className="h-4 w-4" /> Nuova Richiesta</Button>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mb-4">
        <TabsList>
          <TabsTrigger value="tutte">Tutte ({clientPratiche.length})</TabsTrigger>
          <TabsTrigger value="in_corso">In corso ({clientPratiche.filter(p => ['in_attesa', 'in_corso', 'in_revisione'].includes(p.stato)).length})</TabsTrigger>
          <TabsTrigger value="completate">Completate ({clientPratiche.filter(p => p.stato === 'completata').length})</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-2">
        {filtered.map(p => {
          const op = mockOperatori.find(o => o.id === p.operatore_id);
          const days = p.scadenza ? daysUntil(p.scadenza) : null;
          return (
            <div key={p.id} className="bg-white border rounded-xl p-4 hover:shadow-md hover:border-sky-200 transition-all cursor-pointer flex items-center gap-4" onClick={() => navigate(`/app/pratiche/${p.id}`)}>
              <span className={`h-3 w-3 rounded-full flex-shrink-0 ${prioritaDots[p.priorita]}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-xs text-sky-600">{p.codice}</span>
                  <Badge variant="secondary" className={`text-[10px] ${tipoBadgeColors[p.tipo]}`}>{tipoLabels[p.tipo]}</Badge>
                  <StatusBadge status={p.stato as any} />
                </div>
                <p className="text-sm font-medium text-slate-800 truncate">{p.titolo}</p>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                  {op && <span className="flex items-center gap-1"><span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-[8px] font-bold">{op.avatar_iniziali}</span>{op.nome.split(' ')[0]}</span>}
                  {p.scadenza && (
                    <span className={`flex items-center gap-0.5 ${days !== null && days < 0 ? 'text-red-500' : days !== null && days <= 3 ? 'text-amber-500' : ''}`}>
                      <Calendar className="h-3 w-3" />
                      {new Date(p.scadenza).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}
                    </span>
                  )}
                  <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{timeAgo(p.updated_at)}</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300 flex-shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppPratiche;
