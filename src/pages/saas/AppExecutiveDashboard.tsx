import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, Shield, AlertTriangle, CheckCircle2,
  FileText, GraduationCap, Clock, Euro, Bot, Users,
  ArrowRight, Calendar, XCircle, BarChart2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────

interface KpiCard {
  label: string;
  value: string | number;
  sub: string;
  trend?: { dir: 'up' | 'down'; label: string; positive: boolean };
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
}

interface AlertItem {
  id: string;
  titolo: string;
  tipo: 'critico' | 'warning' | 'info';
  scadenza: string;
  giorni: number;
  azione: string;
  path: string;
}

interface ComplianceArea {
  nome: string;
  score: number;
  delta: number; // change since last month
}

interface ActivityItem {
  data: string;
  descrizione: string;
  utente: string;
  tipo: 'documento' | 'formazione' | 'sistema' | 'firma';
}

// ─── Static data ──────────────────────────────────────────────────────────────

const ALERTS: AlertItem[] = [
  { id: 'a1', titolo: 'DPIA HiBob HR AI non avviata', tipo: 'critico', scadenza: '15/04/2026', giorni: 21, azione: 'Avvia DPIA', path: '/app/gdpr/dpia/new' },
  { id: 'a2', titolo: 'Registro Trattamenti GDPR scaduto', tipo: 'critico', scadenza: '01/04/2026', giorni: 7, azione: 'Aggiorna', path: '/app/gdpr/register' },
  { id: 'a3', titolo: '2 utenti senza AI Literacy completata', tipo: 'critico', scadenza: '02/04/2026', giorni: 8, azione: 'Sollecita', path: '/app/training/team' },
  { id: 'a4', titolo: 'Voice Agent Twilio: disclosure mancante', tipo: 'warning', scadenza: '01/05/2026', giorni: 37, azione: 'Configura', path: '/app/registry' },
  { id: 'a5', titolo: 'DPA HiBob: firma fornitore in attesa', tipo: 'warning', scadenza: '10/04/2026', giorni: 16, azione: 'Sollecita', path: '/app/firma' },
  { id: 'a6', titolo: 'NDA Fornitore AI Analytics scaduto', tipo: 'warning', scadenza: '15/01/2026', giorni: -69, azione: 'Rinnova', path: '/app/firma' },
];

const COMPLIANCE_AREAS: ComplianceArea[] = [
  { nome: 'Inventario AI', score: 75, delta: +5 },
  { nome: 'Alto Rischio', score: 30, delta: +0 },
  { nome: 'Trasparenza', score: 63, delta: +8 },
  { nome: 'AI Literacy', score: 58, delta: +12 },
  { nome: 'GDPR + AI', score: 55, delta: -3 },
  { nome: 'Governance', score: 60, delta: +2 },
  { nome: 'Monitoraggio', score: 25, delta: +0 },
];

const ACTIVITY: ActivityItem[] = [
  { data: '24/03/2026', descrizione: 'Policy Uso AI aggiornata e firmata da CEO', utente: 'Marco Rossi', tipo: 'firma' },
  { data: '22/03/2026', descrizione: 'Corso AI Literacy completato — Sofia Ricci (100%)', utente: 'Sofia Ricci', tipo: 'formazione' },
  { data: '20/03/2026', descrizione: 'Voice Agent Twilio aggiunto al registro AI', utente: 'Luca Verdi', tipo: 'sistema' },
  { data: '18/03/2026', descrizione: 'Informativa GDPR rivista e caricata', utente: 'Marco Rossi', tipo: 'documento' },
  { data: '15/03/2026', descrizione: 'DPA OpenAI aggiornato e firmato', utente: 'Marco Rossi', tipo: 'firma' },
  { data: '10/03/2026', descrizione: 'HiBob HR AI aggiunto al registro sistemi AI', utente: 'Luca Verdi', tipo: 'sistema' },
];

const ACTIVITY_TYPE_CONFIG = {
  documento:  { dot: 'bg-blue-500',   label: 'Doc' },
  formazione: { dot: 'bg-indigo-500', label: 'Training' },
  sistema:    { dot: 'bg-teal-500',   label: 'Sistema' },
  firma:      { dot: 'bg-purple-500', label: 'Firma' },
};

// ─── Score ring mini ──────────────────────────────────────────────────────────

function MiniRing({ score, size = 48 }: { score: number; size?: number }) {
  const r = (size / 2) - 5;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={5} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
    </svg>
  );
}

// ─── Spark bar (mini bar chart for trend) ────────────────────────────────────

function SparkBar({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {values.map((v, i) => (
        <div
          key={i}
          className={`flex-1 rounded-sm ${color} ${i === values.length - 1 ? 'opacity-100' : 'opacity-40'}`}
          style={{ height: `${(v / max) * 100}%`, minHeight: 2 }}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AppExecutiveDashboard() {
  const { tenant } = useAuth();
  const navigate = useNavigate();
  const [alertFilter, setAlertFilter] = useState<'tutti' | 'critico' | 'warning'>('tutti');

  const globalScore = Math.round(COMPLIANCE_AREAS.reduce((s, a) => s + a.score, 0) / COMPLIANCE_AREAS.length);
  const prevScore = globalScore - 4; // mock: was 4 points lower last month

  const KPI_CARDS: KpiCard[] = [
    {
      label: 'Readiness Score', value: `${globalScore}%`,
      sub: 'Conformità AI Act + GDPR',
      trend: { dir: 'up', label: `+4% vs mese scorso`, positive: true },
      icon: Shield, color: 'text-[#185FA5]', bg: 'bg-[#E6F1FB]',
    },
    {
      label: 'Gap Critici aperti', value: 3,
      sub: 'Richiedono azione immediata',
      trend: { dir: 'down', label: '-1 vs mese scorso', positive: true },
      icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50',
    },
    {
      label: 'Sistemi AI censiti', value: 5,
      sub: '1 non classificato per rischio',
      trend: { dir: 'up', label: '+2 questo mese', positive: true },
      icon: Bot, color: 'text-teal-600', bg: 'bg-teal-50',
    },
    {
      label: 'AI Literacy team', value: '75%',
      sub: '6/8 dipendenti formati',
      trend: { dir: 'up', label: '+2 completati', positive: true },
      icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50',
    },
    {
      label: 'Documenti firmati', value: 4,
      sub: '2 in attesa di firma',
      trend: { dir: 'up', label: '+1 questo mese', positive: true },
      icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50',
    },
    {
      label: 'Giorni a scadenza critica', value: 130,
      sub: 'AI Act alto rischio — 02/08/2026',
      trend: { dir: 'down', label: 'Countdown attivo', positive: false },
      icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50',
    },
  ];

  const filteredAlerts = alertFilter === 'tutti' ? ALERTS : ALERTS.filter(a => a.tipo === alertFilter);
  const criticalCount = ALERTS.filter(a => a.tipo === 'critico').length;
  const warningCount = ALERTS.filter(a => a.tipo === 'warning').length;

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#042C53] flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-[#185FA5]" />
            Executive Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Vista strategica per il management · {tenant?.ragione_sociale ?? 'AEDIX Srl'} · Aggiornato 25 marzo 2026
          </p>
        </div>
        <button
          onClick={() => navigate('/app/report')}
          className="flex items-center gap-2 bg-[#042C53] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <FileText className="h-4 w-4" /> Genera Report PDF
        </button>
      </div>

      {/* ── KPI grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {KPI_CARDS.map((kpi) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.trend?.dir === 'up' ? TrendingUp : TrendingDown;
          return (
            <div key={kpi.label} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className={`h-9 w-9 rounded-lg ${kpi.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
                {kpi.trend && (
                  <div className={`flex items-center gap-1 text-[11px] font-medium ${kpi.trend.positive ? 'text-emerald-600' : 'text-gray-500'}`}>
                    <TrendIcon className="h-3.5 w-3.5" />
                    {kpi.trend.label}
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-[#042C53]">{kpi.value}</div>
              <div className="text-xs font-medium text-gray-500 mt-0.5">{kpi.label}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">{kpi.sub}</div>
            </div>
          );
        })}
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">

        {/* Left column */}
        <div className="space-y-5">

          {/* Compliance score per area */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[#042C53]">Conformità per area</h2>
              <button onClick={() => navigate('/app/gap-analysis')} className="text-xs text-[#185FA5] hover:underline flex items-center gap-1 font-medium">
                Analisi completa <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="space-y-3">
              {COMPLIANCE_AREAS.map(area => {
                const barColor = area.score >= 75 ? 'bg-emerald-500' : area.score >= 50 ? 'bg-amber-500' : 'bg-red-500';
                const scoreColor = area.score >= 75 ? 'text-emerald-600' : area.score >= 50 ? 'text-amber-600' : 'text-red-600';
                return (
                  <div key={area.nome} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 w-28 shrink-0 truncate">{area.nome}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${barColor} rounded-full`} style={{ width: `${area.score}%` }} />
                    </div>
                    <span className={`text-xs font-bold w-8 text-right shrink-0 ${scoreColor}`}>{area.score}%</span>
                    <span className={`text-[10px] font-medium w-10 shrink-0 ${area.delta > 0 ? 'text-emerald-500' : area.delta < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                      {area.delta > 0 ? `+${area.delta}` : area.delta === 0 ? '—' : area.delta}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Global trend */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4">
              <div>
                <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">Score globale</p>
                <div className="flex items-center gap-2 mt-1">
                  <MiniRing score={globalScore} />
                  <div>
                    <span className={`text-xl font-bold ${globalScore >= 75 ? 'text-emerald-600' : globalScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                      {globalScore}%
                    </span>
                    <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5">
                      <TrendingUp className="h-3 w-3" /> +{globalScore - prevScore}% dal mese scorso
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Trend ultimi 6 mesi</p>
                <SparkBar values={[35, 38, 42, 47, 52, globalScore]} color="bg-[#185FA5]" />
              </div>
            </div>
          </div>

          {/* Alert / Priorità */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[#042C53]">Azioni prioritarie</h2>
              <div className="flex items-center gap-2">
                {(['tutti', 'critico', 'warning'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setAlertFilter(f)}
                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium border transition-colors ${
                      alertFilter === f ? 'bg-[#042C53] text-white border-[#042C53]' : 'text-gray-500 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {f === 'tutti' ? `Tutti (${ALERTS.length})` : f === 'critico' ? `Critici (${criticalCount})` : `Warning (${warningCount})`}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              {filteredAlerts.map(alert => (
                <div
                  key={alert.id}
                  className={`flex items-center gap-3 rounded-xl p-3 border ${
                    alert.tipo === 'critico' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
                  }`}
                >
                  {alert.tipo === 'critico'
                    ? <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                    : <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#042C53] truncate">{alert.titolo}</p>
                    <p className={`text-[11px] font-medium ${alert.giorni < 0 ? 'text-red-600' : alert.giorni <= 30 ? 'text-amber-600' : 'text-gray-500'}`}>
                      Scadenza {alert.scadenza} · {alert.giorni < 0 ? `${Math.abs(alert.giorni)}g scaduto` : `tra ${alert.giorni}g`}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(alert.path)}
                    className={`shrink-0 flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                      alert.tipo === 'critico'
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-amber-500 hover:bg-amber-600 text-white'
                    }`}
                  >
                    {alert.azione} <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">

          {/* Countdown scadenza critica */}
          <div className="bg-[#042C53] rounded-xl p-5 text-white text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-1">Scadenza principale AI Act</p>
            <div className="text-5xl font-black text-amber-400 my-2">130</div>
            <p className="text-sm text-blue-200">giorni al 2 agosto 2026</p>
            <p className="text-[11px] text-gray-400 mt-1">Piena conformità sistemi ad alto rischio</p>
            <div className="mt-3 bg-white/10 rounded-lg px-3 py-2 text-xs text-blue-200">
              Sanzione max: <strong className="text-white">€15M o 3% fatturato</strong>
            </div>
          </div>

          {/* Team compliance */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[#042C53]">Team & Formazione</h2>
              <button onClick={() => navigate('/app/training/team')} className="text-xs text-[#185FA5] hover:underline font-medium">Dettaglio →</button>
            </div>
            <div className="space-y-2.5">
              {[
                { nome: 'Marco Rossi', ruolo: 'CEO', literacy: true, avanzato: true },
                { nome: 'Sofia Ricci', ruolo: 'AI Officer', literacy: true, avanzato: false },
                { nome: 'Luca Verdi', ruolo: 'CTO', literacy: false, avanzato: false },
                { nome: 'Anna Ferrari', ruolo: 'HR Manager', literacy: true, avanzato: false },
                { nome: 'Marco Bianchi', ruolo: 'Developer', literacy: false, avanzato: false },
              ].map(u => (
                <div key={u.nome} className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-[#042C53] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {u.nome.split(' ').map(w => w[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#042C53] truncate">{u.nome}</p>
                    <p className="text-[10px] text-gray-400">{u.ruolo}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <span className={`h-5 w-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold ${u.literacy ? 'bg-emerald-500' : 'bg-gray-200'}`} title="AI Literacy Base">
                      {u.literacy ? '✓' : '!'}
                    </span>
                    <span className={`h-5 w-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold ${u.avanzato ? 'bg-indigo-500' : 'bg-gray-100'}`} title="Avanzato">
                      A
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-400 border-t border-gray-100 pt-3">
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-emerald-500 inline-block" /> AI Literacy Base</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-indigo-500 inline-block" /> Corso avanzato</span>
            </div>
          </div>

          {/* Attività recente */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[#042C53]">Attività recente</h2>
              <button onClick={() => navigate('/app/audit')} className="text-xs text-[#185FA5] hover:underline font-medium">Audit trail →</button>
            </div>
            <div className="space-y-3">
              {ACTIVITY.map((act, i) => {
                const cfg = ACTIVITY_TYPE_CONFIG[act.tipo];
                return (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className={`h-2 w-2 rounded-full ${cfg.dot} mt-1.5 shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#042C53] leading-snug">{act.descrizione}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{act.data} · {act.utente}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Accesso rapido</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Gap Analysis', icon: Shield, path: '/app/gap-analysis' },
                { label: 'Calendario', icon: Calendar, path: '/app/calendario' },
                { label: 'AI Advisor', icon: Users, path: '/app/ai-lawyer' },
                { label: 'Report PDF', icon: FileText, path: '/app/report' },
              ].map(link => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.label}
                    onClick={() => navigate(link.path)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-200 hover:border-[#185FA5] hover:bg-[#E6F1FB] transition-colors text-left group"
                  >
                    <Icon className="h-4 w-4 text-gray-400 group-hover:text-[#185FA5]" />
                    <span className="text-xs font-medium text-gray-600 group-hover:text-[#185FA5]">{link.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
