import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderOpen, CheckCircle, Coins, TrendingDown, Clock, ChevronRight,
  AlertTriangle, Download, Check, FileText, X, Rocket,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { StatusBadge } from '@/components/saas/StatusBadge';
import {
  mockPratiche, mockFatture, timeAgo, daysUntil,
} from '@/data/mockDashboardData';
import { useCounterAnimation } from '@/hooks/useCounterAnimation';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// ── KPI Card (client version) ──
const colorMap = {
  sky: { bg: 'bg-sky-50', text: 'text-sky-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600' },
  red: { bg: 'bg-red-50', text: 'text-red-500' },
};

interface KPIProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  variazione?: number;
  icon: React.ComponentType<{ className?: string }>;
  colore: keyof typeof colorMap;
  delay: number;
  extra?: React.ReactNode;
}

const KPICard = ({ label, value, prefix = '', suffix = '', variazione, icon: Icon, colore, delay, extra }: KPIProps) => {
  const { ref: visRef, isVisible } = useScrollAnimation(0.3);
  const animatedValue = useCounterAnimation(value, isVisible, 1200);

  return (
    <div
      ref={visRef as unknown as React.Ref<HTMLDivElement>}
      className="bg-white rounded-xl border border-slate-200/80 shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.06)] p-5 opacity-0 animate-[fadeUp_0.4s_ease-out_forwards] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="text-2xl font-bold font-subtitle tracking-tight text-slate-900">
            {prefix}{animatedValue.toLocaleString('it-IT')}{suffix}
          </p>
          {variazione !== undefined && (
            <div className="flex items-center gap-1.5">
              <span className={cn(
                'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold',
                variazione >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
              )}>
                {variazione > 0 ? '↑' : '↓'} {Math.abs(variazione)}%
              </span>
              <span className="text-xs text-slate-400">vs mese scorso</span>
            </div>
          )}
          {extra}
        </div>
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', colorMap[colore].bg)}>
          <Icon className={cn('h-5 w-5', colorMap[colore].text)} />
        </div>
      </div>
    </div>
  );
};

// ── Onboarding Checklist Banner ──
const CHECKLIST_ITEMS = [
  { key: 'account', label: 'Account creato', done: true },
  { key: 'dati', label: 'Dati aziendali', done: true },
  { key: 'logo', label: 'Carica logo aziendale', done: false, link: '/app/impostazioni' },
  { key: 'pratica', label: 'Apri la prima pratica', done: false, link: '/app/pratiche/nuova' },
  { key: 'invita', label: 'Invita un collega', done: false, link: '/app/impostazioni' },
];

const OnboardingChecklist = () => {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(() => localStorage.getItem('il_checklist_dismissed') === '1');
  const completedCount = CHECKLIST_ITEMS.filter(i => i.done).length;
  const total = CHECKLIST_ITEMS.length;
  const percent = Math.round((completedCount / total) * 100);

  if (dismissed || percent === 100) return null;

  return (
    <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 rounded-xl p-5 opacity-0 animate-[fadeUp_0.4s_ease-out_forwards] relative">
      <button
        onClick={() => { setDismissed(true); localStorage.setItem('il_checklist_dismissed', '1'); }}
        className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-center gap-2 mb-3">
        <Rocket className="h-5 w-5 text-sky-500" />
        <h3 className="text-sm font-bold text-slate-800">Completa il setup — {percent}%</h3>
        <span className="text-xs text-slate-500 ml-auto mr-6">{completedCount}/{total} completati</span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/70 mb-4">
        <div className="h-2 rounded-full bg-sky-500 transition-all duration-700" style={{ width: `${percent}%` }} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {CHECKLIST_ITEMS.map((item) => (
          <div
            key={item.key}
            onClick={() => item.link && !item.done && navigate(item.link)}
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
              item.done ? 'text-slate-400' : 'text-slate-700 hover:bg-white/60 cursor-pointer'
            )}
          >
            {item.done ? (
              <Check className="h-4 w-4 text-emerald-500 shrink-0" />
            ) : (
              <span className="h-4 w-4 rounded-full border-2 border-slate-300 shrink-0" />
            )}
            <span className={item.done ? 'line-through' : 'font-medium'}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Main ──
const AppDashboard = () => {
  const navigate = useNavigate();
  const { profile, tenant } = useAuth();
  const [praticaFilter, setPraticaFilter] = useState<'all' | 'in_corso' | 'completata'>('all');

  const tenantId = tenant?.id || 't5'; // mock: Arredo Design Lux
  const myPratiche = mockPratiche.filter((p) => p.tenant_id === tenantId);
  const inCorso = myPratiche.filter((p) => ['in_corso', 'in_attesa'].includes(p.stato)).length;
  const completateMese = myPratiche.filter((p) => p.stato === 'completata').length;
  const crediti = tenant?.crediti_residui ?? 42;
  const creditiTotali = 500;

  const filteredPratiche = myPratiche.filter((p) => {
    if (praticaFilter === 'in_corso') return ['in_corso', 'in_attesa'].includes(p.stato);
    if (praticaFilter === 'completata') return p.stato === 'completata';
    return true;
  }).slice(0, 6);

  const myFatture = mockFatture.filter((f) => f.tenant_id === tenantId).slice(0, 5);

  // Trial check
  const isTrialEnding = tenant?.stato === 'trial' && tenant.trial_ends_at && daysUntil(tenant.trial_ends_at) <= 7;
  const trialDays = tenant?.trial_ends_at ? daysUntil(tenant.trial_ends_at) : 0;
  const isOnboardingIncomplete = !tenant?.onboarding_completato;

  // Scadenze
  const scadenze = [
    ...myPratiche.filter((p) => p.scadenza && !['completata', 'annullata'].includes(p.stato)).map((p) => ({ tipo: 'pratica', titolo: p.titolo, codice: p.codice, data: p.scadenza!, giorni: daysUntil(p.scadenza!) })),
    ...myFatture.filter((f) => ['inviata', 'scaduta'].includes(f.stato)).map((f) => ({ tipo: 'fattura', titolo: `Fattura ${f.numero}`, codice: f.numero, data: f.data_scadenza, giorni: daysUntil(f.data_scadenza) })),
  ].sort((a, b) => a.giorni - b.giorni).slice(0, 5);

  // Servizi attivi mock
  const servizi = [
    { nome: 'Creazione Fatture', attivo: true },
    { nome: 'Pratiche ENEA', attivo: true },
    { nome: 'Call Center', attivo: false },
    { nome: 'Segreteria Virtuale', attivo: false },
  ];

  const creditiUsati = creditiTotali - crediti;
  const creditiData = [
    { name: 'Usati', value: creditiUsati, color: '#0ea5e9' },
    { name: 'Residui', value: crediti, color: '#e2e8f0' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      {isTrialEnding && (
        <div className="flex items-center gap-4 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-5 opacity-0 animate-[fadeUp_0.4s_ease-out_forwards]">
          <Clock className="h-8 w-8 text-amber-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">Il tuo periodo di prova scade tra {trialDays} giorni</p>
            <p className="text-xs text-amber-600 mt-0.5">Attiva un piano per continuare a usare tutti i servizi.</p>
          </div>
          <button className="shrink-0 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors">
            Attiva il piano
          </button>
        </div>
      )}

      {!isTrialEnding && <OnboardingChecklist />}

      {/* ROW 1 — KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard label="Pratiche in Corso" value={inCorso} icon={FolderOpen} colore="sky" delay={0} />
        <KPICard label="Completate (mese)" value={completateMese} variazione={16} icon={CheckCircle} colore="emerald" delay={100} />
        <KPICard
          label="Crediti Residui"
          value={crediti}
          prefix="€ "
          icon={Coins}
          colore={crediti < 10 ? 'red' : crediti < 50 ? 'amber' : 'emerald'}
          delay={200}
          extra={crediti < 50 ? <button className="text-xs text-sky-500 hover:text-sky-600 font-medium mt-1">Ricarica →</button> : undefined}
        />
        <KPICard
          label="Risparmio Stimato"
          value={1260}
          prefix="€ "
          icon={TrendingDown}
          colore="violet"
          delay={300}
          extra={<p className="text-xs text-slate-400 mt-1">vs gestione interna</p>}
        />
      </div>

      {/* ROW 2 — Pratiche + Piano */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Pratiche */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 shadow-sm opacity-0 animate-[fadeUp_0.4s_ease-out_forwards]" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">Le tue pratiche</h3>
            <div className="flex gap-1">
              {(['all', 'in_corso', 'completata'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setPraticaFilter(f)}
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                    praticaFilter === f ? 'bg-sky-100 text-sky-700' : 'text-slate-400 hover:text-slate-600'
                  )}
                >
                  {f === 'all' ? 'Tutte' : f === 'in_corso' ? 'In corso' : 'Completate'}
                </button>
              ))}
            </div>
          </div>
          {filteredPratiche.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <FolderOpen className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">Nessuna pratica ancora</p>
              <button onClick={() => navigate('/app/pratiche/nuova')} className="mt-2 text-xs text-sky-500 hover:text-sky-600 font-semibold">
                Fai la prima richiesta →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filteredPratiche.map((p) => {
                const days = p.scadenza ? daysUntil(p.scadenza) : null;
                return (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/app/pratiche/${p.id}`)}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 cursor-pointer group transition-colors"
                  >
                    <span className={cn(
                      'h-2.5 w-2.5 shrink-0 rounded-full',
                      p.stato === 'in_corso' ? 'bg-sky-500 animate-pulse' :
                      p.stato === 'completata' ? 'bg-emerald-500' :
                      p.stato === 'in_attesa' ? 'bg-amber-500' :
                      p.stato === 'scaduta' ? 'bg-red-500' : 'bg-slate-300'
                    )} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono-accent text-slate-400">{p.codice}</code>
                        <StatusBadge status={p.tipo as any} className="hidden sm:inline-flex" />
                      </div>
                      <p className="text-sm font-medium text-slate-800 truncate">{p.titolo}</p>
                    </div>
                    {days !== null && (
                      <span className={cn('text-xs shrink-0 hidden sm:block', days < 0 ? 'text-red-600 font-bold' : days <= 3 ? 'text-amber-600' : 'text-slate-400')}>
                        {days < 0 ? 'Scaduta' : days === 0 ? 'Oggi' : `${days}gg`}
                      </span>
                    )}
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                );
              })}
              <div className="px-5 py-3">
                <button onClick={() => navigate('/app/pratiche')} className="text-xs text-sky-500 hover:text-sky-600 font-medium">
                  Vedi tutte le pratiche →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Piano & Crediti */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 opacity-0 animate-[fadeUp_0.4s_ease-out_forwards]" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Il tuo piano</h3>
            <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
              tenant?.piano === 'enterprise' ? 'bg-violet-50 text-violet-700' :
              tenant?.piano === 'professionale' ? 'bg-sky-50 text-sky-700' : 'bg-slate-100 text-slate-600'
            )}>
              {tenant?.piano || 'starter'}
            </span>
          </div>

          {/* Mini donut */}
          <div className="flex items-center gap-4 mb-4">
            <div className="h-20 w-20 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={creditiData} dataKey="value" cx="50%" cy="50%" innerRadius={25} outerRadius={35} stroke="none">
                    {creditiData.map((d) => <Cell key={d.name} fill={d.color} />)}
                  </Pie>
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold fill-slate-800">€{crediti}</text>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1">
              <div className="h-2 w-full rounded-full bg-slate-100 mb-1.5">
                <div className="h-2 rounded-full bg-sky-500 transition-all" style={{ width: `${(creditiUsati / creditiTotali) * 100}%` }} />
              </div>
              <p className="text-xs text-slate-500">Usati €{creditiUsati} su €{creditiTotali} disponibili</p>
            </div>
          </div>

          {/* Servizi */}
          <div className="space-y-2 mb-4">
            {servizi.map((s) => (
              <div key={s.nome} className="flex items-center gap-2 text-sm">
                {s.attivo ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <span className="h-4 w-4 rounded-full border border-slate-200" />
                )}
                <span className={s.attivo ? 'text-slate-700' : 'text-slate-400'}>{s.nome}</span>
              </div>
            ))}
            <button className="text-xs text-sky-500 hover:text-sky-600 font-medium mt-1">Attiva più servizi →</button>
          </div>

          <button className="w-full rounded-lg border border-slate-200 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Ricarica crediti
          </button>
        </div>
      </div>

      {/* ROW 3 — Fatture + Scadenze */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Fatture */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 shadow-sm opacity-0 animate-[fadeUp_0.4s_ease-out_forwards]" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">Fatture recenti</h3>
            <button onClick={() => navigate('/app/fatture')} className="text-xs text-sky-500 hover:text-sky-600 font-medium">Vai alle fatture →</button>
          </div>
          {myFatture.length === 0 ? (
            <p className="px-5 py-8 text-sm text-slate-400 text-center">Nessuna fattura ancora</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-50 text-xs text-slate-400">
                    <th className="text-left px-5 py-2.5">Numero</th>
                    <th className="text-left px-3 py-2.5 hidden sm:table-cell">Data</th>
                    <th className="text-right px-3 py-2.5">Importo</th>
                    <th className="text-center px-3 py-2.5">Stato</th>
                    <th className="text-right px-3 py-2.5">Azione</th>
                  </tr>
                </thead>
                <tbody>
                  {myFatture.map((f) => (
                    <tr key={f.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 font-medium text-slate-700">{f.numero}</td>
                      <td className="px-3 py-3 text-slate-500 hidden sm:table-cell">{f.data_emissione}</td>
                      <td className="px-3 py-3 text-right font-semibold text-slate-800">€ {f.totale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</td>
                      <td className="px-3 py-3 text-center"><StatusBadge status={f.stato as any} /></td>
                      <td className="px-3 py-3 text-right">
                        {f.stato === 'pagata' && <Check className="h-4 w-4 text-emerald-500 ml-auto" />}
                        {f.stato === 'inviata' && (
                          <button className="text-xs text-slate-500 hover:text-slate-700 font-medium inline-flex items-center gap-1">
                            <Download className="h-3 w-3" /> PDF
                          </button>
                        )}
                        {f.stato === 'scaduta' && (
                          <button className="text-xs text-amber-600 hover:text-amber-700 font-medium inline-flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> Sollecita
                          </button>
                        )}
                        {f.stato === 'bozza' && (
                          <button className="text-xs text-sky-500 hover:text-sky-600 font-medium">Invia</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Scadenze */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 shadow-sm opacity-0 animate-[fadeUp_0.4s_ease-out_forwards]" style={{ animationDelay: '700ms' }}>
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">Scadenze in arrivo</h3>
          </div>
          {scadenze.length === 0 ? (
            <p className="px-5 py-8 text-sm text-emerald-600 text-center">Nessuna scadenza imminente 🎉</p>
          ) : (
            <div className="divide-y divide-slate-50">
              {scadenze.map((s, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex items-center gap-3 px-5 py-3 border-l-4',
                    s.giorni <= 0 ? 'border-l-red-400 bg-red-50/50' :
                    s.giorni <= 3 ? 'border-l-amber-400 bg-amber-50/30' :
                    'border-l-transparent'
                  )}
                >
                  {s.tipo === 'pratica' ? (
                    <FolderOpen className="h-4 w-4 text-slate-400 shrink-0" />
                  ) : (
                    <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 truncate">{s.titolo}</p>
                    <code className="text-xs font-mono-accent text-slate-400">{s.codice}</code>
                  </div>
                  <span className={cn('text-xs font-semibold shrink-0',
                    s.giorni <= 0 ? 'text-red-600' : s.giorni <= 3 ? 'text-amber-600' : 'text-slate-400'
                  )}>
                    {s.giorni <= 0 ? 'Scaduta' : s.giorni === 0 ? 'Oggi' : `+${s.giorni}gg`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppDashboard;
