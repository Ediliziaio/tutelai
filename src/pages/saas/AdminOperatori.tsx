import { useState, useMemo } from 'react';
import {
  UserCog, Users, FolderOpen, Clock, Star, TrendingUp,
  ChevronRight, BarChart3, Target, Award, Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { mockOperatori, mockPratiche, mockTenants } from '@/data/mockDashboardData';
import type { Pratica } from '@/types/auth';

/* ───── extended operator data ───── */
interface OperatoreDettaglio {
  id: string;
  nome: string;
  avatar_iniziali: string;
  email: string;
  ruolo: string;
  pratiche_completate: number;
  pratiche_target: number;
  tempo_medio_giorni: number;
  rating: number;
  stato: 'online' | 'occupato' | 'offline';
  clienti_assegnati: number;
}

const operatoriDettaglio: OperatoreDettaglio[] = [
  { ...mockOperatori[0], email: 'm.rossi@impresaleggera.it', ruolo: 'Senior', stato: 'online', clienti_assegnati: 3 },
  { ...mockOperatori[1], email: 'l.marchetti@impresaleggera.it', ruolo: 'Operatore', stato: 'occupato', clienti_assegnati: 3 },
  { ...mockOperatori[2], email: 'a.verdi@impresaleggera.it', ruolo: 'Operatore', stato: 'online', clienti_assegnati: 1 },
  { ...mockOperatori[3], email: 's.bianchi@impresaleggera.it', ruolo: 'Junior', stato: 'offline', clienti_assegnati: 2 },
];

const statoBadge: Record<string, { label: string; cls: string }> = {
  online: { label: 'Online', cls: 'bg-emerald-100 text-emerald-700' },
  occupato: { label: 'Occupato', cls: 'bg-amber-100 text-amber-700' },
  offline: { label: 'Offline', cls: 'bg-slate-100 text-slate-500' },
};

/* ───── helpers ───── */
const praticheByOp = (opId: string) => mockPratiche.filter((p) => p.operatore_id === opId);
const praticheAttive = (opId: string) => praticheByOp(opId).filter((p) => !['completata', 'annullata'].includes(p.stato));

const AdminOperatori = () => {
  const [selectedOp, setSelectedOp] = useState<string | null>(null);

  /* KPI globali */
  const totaleAttive = mockPratiche.filter((p) => !['completata', 'annullata'].includes(p.stato)).length;
  const completateTotali = mockOperatori.reduce((s, o) => s + o.pratiche_completate, 0);
  const tempoMedio = (mockOperatori.reduce((s, o) => s + o.tempo_medio_giorni, 0) / mockOperatori.length).toFixed(1);
  const ratingMedio = (mockOperatori.reduce((s, o) => s + o.rating, 0) / mockOperatori.length).toFixed(1);

  /* Round-robin: operatore con meno pratiche attive */
  const prossimoAssegnazione = useMemo(() => {
    const sorted = [...operatoriDettaglio]
      .filter((o) => o.stato !== 'offline')
      .sort((a, b) => praticheAttive(a.id).length - praticheAttive(b.id).length);
    return sorted[0];
  }, []);

  const dettaglio = selectedOp ? operatoriDettaglio.find((o) => o.id === selectedOp) : null;
  const dettaglioPratiche = selectedOp ? praticheByOp(selectedOp) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <UserCog className="h-6 w-6 text-violet-500" /> Operatori
          </h1>
          <p className="text-sm text-slate-500 mt-1">Gestione team, workload e performance</p>
        </div>
        {prossimoAssegnazione && (
          <div className="hidden sm:flex items-center gap-2 rounded-xl bg-violet-50 border border-violet-200 px-4 py-2">
            <Zap className="h-4 w-4 text-violet-500" />
            <span className="text-sm text-violet-700">
              Prossima assegnazione → <span className="font-semibold">{prossimoAssegnazione.nome}</span>
            </span>
          </div>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Operatori attivi', value: operatoriDettaglio.filter((o) => o.stato !== 'offline').length, icon: Users, color: 'text-violet-600 bg-violet-50' },
          { label: 'Pratiche attive', value: totaleAttive, icon: FolderOpen, color: 'text-sky-600 bg-sky-50' },
          { label: 'Tempo medio', value: `${tempoMedio} gg`, icon: Clock, color: 'text-amber-600 bg-amber-50' },
          { label: 'Rating medio', value: `${ratingMedio} ★`, icon: Star, color: 'text-emerald-600 bg-emerald-50' },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-slate-200">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', kpi.color)}>
                <kpi.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{kpi.label}</p>
                <p className="text-xl font-bold text-slate-800">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Operator list */}
        <Card className="lg:col-span-1 border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Team</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 p-3 pt-0">
            {operatoriDettaglio.map((op) => {
              const attive = praticheAttive(op.id).length;
              const pct = Math.round((op.pratiche_completate / op.pratiche_target) * 100);
              const badge = statoBadge[op.stato];
              return (
                <button
                  key={op.id}
                  onClick={() => setSelectedOp(op.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all',
                    selectedOp === op.id ? 'bg-violet-50 ring-1 ring-violet-200' : 'hover:bg-slate-50'
                  )}
                >
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-sm font-bold">
                      {op.avatar_iniziali}
                    </div>
                    <span className={cn(
                      'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white',
                      op.stato === 'online' ? 'bg-emerald-500' : op.stato === 'occupato' ? 'bg-amber-500' : 'bg-slate-300'
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{op.nome}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-full', badge.cls)}>{badge.label}</span>
                      <span className="text-xs text-slate-400">{attive} attive</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-slate-700">{pct}%</p>
                    <Progress value={pct} className="h-1.5 w-14 mt-1" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Detail panel */}
        <Card className="lg:col-span-2 border-slate-200">
          {dettaglio ? (
            <>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 text-lg font-bold">
                    {dettaglio.avatar_iniziali}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{dettaglio.nome}</CardTitle>
                    <p className="text-sm text-slate-500">{dettaglio.email} · {dettaglio.ruolo}</p>
                  </div>
                  <Badge className={cn('text-xs', statoBadge[dettaglio.stato].cls)}>
                    {statoBadge[dettaglio.stato].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Mini KPI */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Completate', value: dettaglio.pratiche_completate, icon: Target },
                    { label: 'Attive', value: praticheAttive(dettaglio.id).length, icon: FolderOpen },
                    { label: 'Tempo medio', value: `${dettaglio.tempo_medio_giorni} gg`, icon: Clock },
                    { label: 'Rating', value: `${dettaglio.rating} ★`, icon: Award },
                  ].map((k) => (
                    <div key={k.label} className="rounded-xl bg-slate-50 p-3 text-center">
                      <k.icon className="h-4 w-4 mx-auto text-slate-400 mb-1" />
                      <p className="text-lg font-bold text-slate-800">{k.value}</p>
                      <p className="text-[11px] text-slate-500">{k.label}</p>
                    </div>
                  ))}
                </div>

                {/* Workload bar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-slate-700">Target mensile</span>
                    <span className="text-sm text-slate-500">
                      {dettaglio.pratiche_completate}/{dettaglio.pratiche_target}
                    </span>
                  </div>
                  <Progress
                    value={(dettaglio.pratiche_completate / dettaglio.pratiche_target) * 100}
                    className="h-2.5"
                  />
                </div>

                {/* Tabs: pratiche */}
                <Tabs defaultValue="attive">
                  <TabsList className="bg-slate-100">
                    <TabsTrigger value="attive">Attive ({praticheAttive(dettaglio.id).length})</TabsTrigger>
                    <TabsTrigger value="tutte">Tutte ({dettaglioPratiche.length})</TabsTrigger>
                  </TabsList>
                  <TabsContent value="attive" className="mt-3 space-y-2">
                    <PraticheList pratiche={praticheAttive(dettaglio.id)} />
                  </TabsContent>
                  <TabsContent value="tutte" className="mt-3 space-y-2">
                    <PraticheList pratiche={dettaglioPratiche} />
                  </TabsContent>
                </Tabs>

                {/* Clienti assegnati */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Clienti assegnati ({dettaglio.clienti_assegnati})</h4>
                  <div className="flex flex-wrap gap-2">
                    {mockTenants
                      .filter((t) => t.operatore_assegnato_id === dettaglio.id)
                      .map((t) => (
                        <Badge key={t.id} variant="outline" className="text-xs">
                          {t.ragione_sociale}
                        </Badge>
                      ))}
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center py-20 text-slate-400">
              <BarChart3 className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm">Seleziona un operatore per vedere il dettaglio</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

/* ───── sub-component ───── */
const statoColors: Record<string, string> = {
  bozza: 'bg-slate-100 text-slate-600',
  in_attesa: 'bg-amber-100 text-amber-700',
  in_corso: 'bg-sky-100 text-sky-700',
  in_revisione: 'bg-violet-100 text-violet-700',
  completata: 'bg-emerald-100 text-emerald-700',
  annullata: 'bg-red-100 text-red-600',
  scaduta: 'bg-red-100 text-red-600',
};

const PraticheList = ({ pratiche }: { pratiche: Pratica[] }) => {
  if (pratiche.length === 0) {
    return <p className="text-sm text-slate-400 py-4 text-center">Nessuna pratica</p>;
  }
  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {pratiche.map((p) => {
        const tenant = mockTenants.find((t) => t.id === p.tenant_id);
        return (
          <div key={p.id} className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{p.titolo}</p>
              <p className="text-xs text-slate-400">{p.codice} · {tenant?.ragione_sociale}</p>
            </div>
            <Badge className={cn('text-[10px] shrink-0', statoColors[p.stato])}>
              {p.stato.replace('_', ' ')}
            </Badge>
          </div>
        );
      })}
    </div>
  );
};

export default AdminOperatori;
