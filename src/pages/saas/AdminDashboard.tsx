import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, TrendingUp, FolderKanban, Clock, AlertTriangle, ChevronRight, Star,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/saas/StatusBadge';
import { Progress } from '@/components/ui/progress';
import {
  mockTenants, mockPratiche, mockActivities, mockOperatori,
  mockFatturatoMensile, mockPratichePerTipo, timeAgo, daysUntil,
} from '@/data/mockDashboardData';
import { useCounterAnimation } from '@/hooks/useCounterAnimation';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// ── KPI Card ──
const colorMap = {
  sky: { bg: 'bg-sky-50', text: 'text-sky-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600' },
};

interface KPIProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  variazione: number;
  icon: React.ComponentType<{ className?: string }>;
  colore: keyof typeof colorMap;
  delay: number;
}

const KPICard = ({ label, value, prefix = '', suffix = '', variazione, icon: Icon, colore, delay }: KPIProps) => {
  const { ref: visRef, isVisible } = useScrollAnimation(0.3);
  const animatedValue = useCounterAnimation(value, isVisible, 1200);

  return (
    <div
      ref={(el) => { (visRef as React.MutableRefObject<HTMLDivElement | null>).current = el; }}
      className="bg-white rounded-xl border border-slate-200/80 shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.06)] p-5 opacity-0 animate-[fadeUp_0.4s_ease-out_forwards] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="text-2xl font-bold font-subtitle tracking-tight text-slate-900">
            {prefix}{animatedValue.toLocaleString('it-IT')}{suffix}
          </p>
          <div className="flex items-center gap-1.5">
            <span className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold',
              variazione >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
            )}>
              {variazione > 0 ? '↑' : '↓'} {Math.abs(variazione)}%
            </span>
            <span className="text-xs text-slate-400">vs mese scorso</span>
          </div>
        </div>
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', colorMap[colore].bg)}>
          <Icon className={cn('h-5 w-5', colorMap[colore].text)} />
        </div>
      </div>
    </div>
  );
};

// ── Custom Tooltip ──
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 text-white rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.stroke || p.fill }} />
          {p.name}: € {p.value.toLocaleString('it-IT')}
        </p>
      ))}
    </div>
  );
};

// ── Donut Center Label ──
const totalPratiche = mockPratichePerTipo.reduce((a, b) => a + b.count, 0);

// ── Main ──
const AdminDashboard = () => {
  const navigate = useNavigate();

  const urgenti = mockPratiche.filter(
    (p) => (p.priorita === 'urgente' || (p.scadenza && daysUntil(p.scadenza) <= 1)) && !['completata', 'annullata'].includes(p.stato)
  ).slice(0, 5);

  const clientiRecenti = [...mockTenants].sort(
    (a, b) => new Date(b.ultima_attivita).getTime() - new Date(a.ultima_attivita).getTime()
  ).slice(0, 8);

  const pianoColors: Record<string, string> = {
    starter: 'bg-slate-100 text-slate-600',
    professionale: 'bg-sky-50 text-sky-700',
    enterprise: 'bg-violet-50 text-violet-700',
  };

  return (
    <div className="space-y-6">
      {/* ROW 1 — KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard label="Clienti Attivi" value={47} variazione={8.2} icon={Building2} colore="sky" delay={0} />
        <KPICard label="Fatturato del Mese" value={12840} prefix="€ " variazione={15.3} icon={TrendingUp} colore="emerald" delay={100} />
        <KPICard label="Pratiche in Corso" value={23} variazione={-4.1} icon={FolderKanban} colore="amber" delay={200} />
        <KPICard label="Tempo Medio Evasione" value={18} suffix=" gg" variazione={-12} icon={Clock} colore="violet" delay={300} />
      </div>

      {/* ROW 2 — Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Area Chart */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 opacity-0 animate-[fadeUp_0.4s_ease-out_forwards]" style={{ animationDelay: '400ms' }}>
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Fatturato Mensile</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockFatturatoMensile}>
                <defs>
                  <linearGradient id="gradFatturato" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="mese" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="fatturato" name="Fatturato" stroke="#0ea5e9" strokeWidth={2} fill="url(#gradFatturato)" />
                <Area type="monotone" dataKey="target" name="Target" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="6 3" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 opacity-0 animate-[fadeUp_0.4s_ease-out_forwards]" style={{ animationDelay: '500ms' }}>
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Pratiche per Tipo</h3>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockPratichePerTipo}
                  dataKey="count"
                  nameKey="tipo"
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={90}
                  paddingAngle={3}
                  stroke="none"
                >
                  {mockPratichePerTipo.map((entry) => (
                    <Cell key={entry.tipo} fill={entry.colore} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number, name: string) => [`${value} pratiche`, name]} />
                {/* Center text via custom label */}
                <text x="50%" y="48%" textAnchor="middle" className="text-2xl font-bold fill-slate-800">{totalPratiche}</text>
                <text x="50%" y="56%" textAnchor="middle" className="text-xs fill-slate-400">Pratiche totali</text>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {mockPratichePerTipo.map((d) => (
              <div key={d.tipo} className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="h-2 w-2 rounded-full" style={{ background: d.colore }} />
                {d.tipo} <span className="text-slate-400">({d.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 3 — Clients Table + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Clients Table */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 shadow-sm opacity-0 animate-[fadeUp_0.4s_ease-out_forwards]" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">Clienti Recenti</h3>
            <button onClick={() => navigate('/admin/clienti')} className="text-xs text-sky-500 hover:text-sky-600 font-medium">Vedi tutti →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-50 text-xs text-slate-400 font-medium">
                  <th className="text-left px-5 py-2.5">Cliente</th>
                  <th className="text-left px-3 py-2.5 hidden md:table-cell">Piano</th>
                  <th className="text-center px-3 py-2.5 hidden sm:table-cell">Pratiche</th>
                  <th className="text-right px-3 py-2.5 hidden lg:table-cell">Crediti</th>
                  <th className="text-center px-3 py-2.5">Stato</th>
                  <th className="text-right px-3 py-2.5 hidden md:table-cell">Attività</th>
                  <th className="px-3 py-2.5 w-8"></th>
                </tr>
              </thead>
              <tbody>
                {clientiRecenti.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => navigate(`/admin/clienti/${t.id}`)}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer group transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold', pianoColors[t.piano])}>
                          {t.ragione_sociale.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 truncate max-w-[160px]">{t.ragione_sociale}</p>
                          <p className="text-xs text-slate-400">{t.partita_iva}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell">
                      <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize', pianoColors[t.piano])}>
                        {t.piano}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center hidden sm:table-cell">
                      <span className="font-semibold text-slate-700">{t.pratiche_aperte}</span>
                    </td>
                    <td className="px-3 py-3 text-right hidden lg:table-cell">
                      <span className={cn('font-semibold', t.crediti_residui < 10 ? 'text-red-500' : t.crediti_residui < 50 ? 'text-amber-500' : 'text-emerald-600')}>
                        € {t.crediti_residui}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <StatusBadge status={t.stato as any} />
                    </td>
                    <td className="px-3 py-3 text-right hidden md:table-cell">
                      <span className="text-xs text-slate-400">{timeAgo(t.ultima_attivita)}</span>
                    </td>
                    <td className="px-3 py-3">
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 shadow-sm opacity-0 animate-[fadeUp_0.4s_ease-out_forwards]" style={{ animationDelay: '700ms' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">Attività Recenti</h3>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
            {mockActivities.map((a) => {
              const actionColors: Record<string, string> = {
                completata: 'bg-emerald-500',
                registrazione: 'bg-sky-500',
                scaduta: 'bg-amber-500',
                pagamento: 'bg-emerald-500',
                presa_in_carico: 'bg-sky-500',
                commento: 'bg-slate-400',
                caricamento: 'bg-violet-500',
                fattura: 'bg-sky-500',
                aggiornamento: 'bg-amber-500',
              };
              return (
                <div key={a.id} className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                  <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', actionColors[a.azione] || 'bg-slate-400')} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold">{a.user_name}</span>{' '}
                      <span>{a.descrizione_html.split(/<b>|<\/b>/).map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{timeAgo(a.created_at)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ROW 4 — Urgent + Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Urgent Cases */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-red-100 shadow-sm opacity-0 animate-[fadeUp_0.4s_ease-out_forwards]" style={{ animationDelay: '800ms' }}>
          <div className="flex items-center gap-2 px-5 py-4 bg-red-50 rounded-t-xl border-b border-red-100">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <h3 className="text-sm font-semibold text-red-700">Pratiche che richiedono attenzione</h3>
            <span className="ml-auto rounded-full bg-red-500 text-white px-2 py-0.5 text-xs font-bold">{urgenti.length} urgenti</span>
          </div>
          <div className="divide-y divide-slate-50">
            {urgenti.length === 0 ? (
              <p className="px-5 py-8 text-sm text-slate-400 text-center">Nessuna pratica urgente 🎉</p>
            ) : (
              urgenti.map((p) => {
                const days = p.scadenza ? daysUntil(p.scadenza) : null;
                const tenant = mockTenants.find((t) => t.id === p.tenant_id);
                const op = mockOperatori.find((o) => o.id === p.operatore_id);
                return (
                  <div key={p.id} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors">
                    <code className="text-xs font-mono-accent text-slate-400 shrink-0">{p.codice}</code>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{p.titolo}</p>
                      <p className="text-xs text-slate-400">{tenant?.ragione_sociale}</p>
                    </div>
                    <StatusBadge status={p.stato as any} className="hidden sm:inline-flex" />
                    {days !== null && (
                      <span className={cn('text-xs font-semibold shrink-0', days < 0 ? 'text-red-600' : days <= 1 ? 'text-amber-600' : 'text-slate-500')}>
                        {days < 0 ? `Scaduta ${Math.abs(days)}gg fa` : days === 0 ? 'Scade oggi' : `${days}gg`}
                      </span>
                    )}
                    {op ? (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{op.avatar_iniziali}</div>
                    ) : (
                      <span className="text-xs text-red-400 shrink-0">Non assegnata</span>
                    )}
                    <button onClick={() => navigate(`/admin/pratiche`)} className="text-xs text-sky-500 hover:text-sky-600 font-medium shrink-0">
                      Gestisci →
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Team Performance */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/80 shadow-sm opacity-0 animate-[fadeUp_0.4s_ease-out_forwards]" style={{ animationDelay: '900ms' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">Team Performance</h3>
            <span className="text-xs text-slate-400">Questo mese</span>
          </div>
          <div className="divide-y divide-slate-50">
            {mockOperatori.map((op) => (
              <div key={op.id} className="px-5 py-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold">
                    {op.avatar_iniziali}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{op.nome}</p>
                    <p className="text-xs text-slate-400">{op.pratiche_completate} completate · {op.tempo_medio_giorni}gg media</p>
                  </div>
                  <div className="flex items-center gap-0.5 text-xs text-amber-500 shrink-0">
                    <Star className="h-3 w-3 fill-amber-400" />
                    {op.rating}
                  </div>
                </div>
                <Progress value={(op.pratiche_completate / op.pratiche_target) * 100} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
