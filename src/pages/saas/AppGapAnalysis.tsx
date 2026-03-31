import { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp, Shield, FileText, GraduationCap, Lock, Radio, ClipboardList, Bot, ArrowRight } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type GapStatus = 'conforme' | 'parziale' | 'non_conforme' | 'na';
type Priority = 'critica' | 'alta' | 'media' | 'bassa';

interface GapRequirement {
  id: string;
  label: string;
  status: GapStatus;
  note?: string;
  scadenza?: string; // ISO date
  fonte: string;
}

interface GapArea {
  id: string;
  titolo: string;
  icon: React.ComponentType<{ className?: string }>;
  descrizione: string;
  requirements: GapRequirement[];
}

interface ActionItem {
  id: string;
  titolo: string;
  area: string;
  priorita: Priority;
  scadenza: string;
  responsabile: string;
  fonte: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const GAP_AREAS: GapArea[] = [
  {
    id: 'inventario',
    titolo: 'Inventario Sistemi AI',
    icon: Bot,
    descrizione: 'Censimento e classificazione di tutti i sistemi AI in uso (Art. 6 AI Act — Allegato III).',
    requirements: [
      { id: 'inv-1', label: 'Registro sistemi AI aggiornato', status: 'conforme', fonte: 'Art. 6 Reg. 2024/1689' },
      { id: 'inv-2', label: 'Classificazione rischio completata per tutti i sistemi', status: 'parziale', note: 'HiBob HR AI non classificato', fonte: 'Art. 6 + Allegato III' },
      { id: 'inv-3', label: 'Schede tecniche fornitori disponibili', status: 'parziale', note: 'Mancante per Tidio Chatbot', fonte: 'Art. 13 Reg. 2024/1689' },
      { id: 'inv-4', label: 'Sistemi GPAI identificati e verificati', status: 'conforme', fonte: 'Titolo III Cap.5 Reg. 2024/1689' },
    ],
  },
  {
    id: 'alto_rischio',
    titolo: 'Sistemi Alto Rischio',
    icon: Shield,
    descrizione: 'Obblighi per sistemi AI ad alto rischio: gestione rischi, dati, trasparenza, supervisione umana (Artt. 9-15 AI Act).',
    requirements: [
      { id: 'ar-1', label: 'Sistema di gestione del rischio AI documentato', status: 'non_conforme', note: 'Da implementare per HiBob HR AI', scadenza: '2026-04-15', fonte: 'Art. 9 Reg. 2024/1689' },
      { id: 'ar-2', label: 'DPIA completata per sistemi HR AI', status: 'non_conforme', note: 'Obbligatoria — non avviata', scadenza: '2026-04-15', fonte: 'Art. 10 + Art. 35 GDPR' },
      { id: 'ar-3', label: 'Log e monitoraggio automatico attivi', status: 'parziale', note: 'Solo 2 sistemi su 4 monitorati', fonte: 'Art. 12 Reg. 2024/1689' },
      { id: 'ar-4', label: 'Supervisione umana definita e documentata', status: 'non_conforme', note: 'Procedure non formalizzate', fonte: 'Art. 14 Reg. 2024/1689' },
      { id: 'ar-5', label: 'Accuratezza, robustezza e cybersecurity verificate', status: 'parziale', fonte: 'Art. 15 Reg. 2024/1689' },
    ],
  },
  {
    id: 'trasparenza',
    titolo: 'Trasparenza & Disclosure',
    icon: FileText,
    descrizione: 'Obblighi di trasparenza verso utenti, dipendenti e soggetti interessati (Artt. 4, 50 AI Act — L.132/2025).',
    requirements: [
      { id: 'tr-1', label: 'Disclosure AI attiva su tutti i sistemi interattivi', status: 'parziale', note: 'Voice Agent Twilio: script mancante', scadenza: '2026-05-01', fonte: 'Art. 50 Reg. 2024/1689' },
      { id: 'tr-2', label: 'Informativa AI aggiornata per dipendenti (L.132/2025)', status: 'conforme', fonte: 'Art. 11 L. 132/2025' },
      { id: 'tr-3', label: 'Policy uso AI interno approvata e pubblicata', status: 'conforme', fonte: 'Art. 4 Reg. 2024/1689' },
      { id: 'tr-4', label: 'Informativa Privacy aggiornata con finalità AI', status: 'parziale', note: 'Revisione annuale scaduta', scadenza: '2026-06-01', fonte: 'Art. 13 GDPR + Art. 50 AI Act' },
    ],
  },
  {
    id: 'formazione',
    titolo: 'AI Literacy & Formazione',
    icon: GraduationCap,
    descrizione: 'Obbligo di adeguata competenza AI per tutto il personale che opera con sistemi AI (Art. 4 AI Act).',
    requirements: [
      { id: 'fm-1', label: 'AI Literacy Base completata da tutto il team', status: 'parziale', note: '2 utenti non completati (Marco Bianchi, Luca Verdi)', scadenza: '2026-04-02', fonte: 'Art. 4 Reg. 2024/1689' },
      { id: 'fm-2', label: 'Formazione avanzata per responsabili AI', status: 'non_conforme', note: 'Nessun corso avanzato completato', fonte: 'Art. 4 Reg. 2024/1689' },
      { id: 'fm-3', label: 'Registro formazione aggiornato', status: 'conforme', fonte: 'Art. 4 Reg. 2024/1689' },
      { id: 'fm-4', label: 'Piano formazione annuale approvato', status: 'parziale', note: 'Bozza presente, non approvato formalmente', fonte: 'Art. 4 Reg. 2024/1689' },
    ],
  },
  {
    id: 'gdpr',
    titolo: 'GDPR + AI',
    icon: Lock,
    descrizione: 'Intersezione tra GDPR e AI Act: trattamenti automatizzati, profilazione, diritti interessati.',
    requirements: [
      { id: 'gd-1', label: 'Registro trattamenti ex Art.30 GDPR aggiornato', status: 'non_conforme', note: 'Aggiornamento scaduto (45+ giorni)', scadenza: '2026-04-01', fonte: 'Art. 30 Reg. 2016/679' },
      { id: 'gd-2', label: 'Meccanismo opt-out profilazione AI attivo', status: 'conforme', fonte: 'Art. 22 Reg. 2016/679' },
      { id: 'gd-3', label: 'DPA firmato con tutti i fornitori AI', status: 'parziale', note: 'Mancante con 1 fornitore', fonte: 'Art. 28 Reg. 2016/679' },
      { id: 'gd-4', label: 'Procedura breach notification definita', status: 'conforme', fonte: 'Art. 33 Reg. 2016/679' },
    ],
  },
  {
    id: 'governance',
    titolo: 'Governance & Responsabilità',
    icon: ClipboardList,
    descrizione: 'Struttura organizzativa per la compliance AI: AI Officer, audit interno, responsabilità (L.132/2025 — Art. 17 AI Act).',
    requirements: [
      { id: 'go-1', label: 'AI Officer nominato formalmente', status: 'conforme', fonte: 'Art. 8 L. 132/2025' },
      { id: 'go-2', label: 'Prima relazione AI Officer depositata', status: 'conforme', fonte: 'Art. 8 L. 132/2025' },
      { id: 'go-3', label: 'Audit trail sistema AI attivo e completo', status: 'parziale', note: '1 sistema senza audit log', fonte: 'Art. 12 Reg. 2024/1689' },
      { id: 'go-4', label: 'Procedure di incident response AI definite', status: 'non_conforme', note: 'Da formalizzare', fonte: 'Art. 73 Reg. 2024/1689' },
      { id: 'go-5', label: 'Review contratti fornitori AI (clausole AI Act)', status: 'parziale', note: '2 contratti da aggiornare', fonte: 'Art. 25 Reg. 2024/1689' },
    ],
  },
  {
    id: 'monitor',
    titolo: 'Monitoraggio Continuo',
    icon: Radio,
    descrizione: 'Sorveglianza post-market e monitoraggio prestazioni dei sistemi AI in produzione (Art. 72 AI Act).',
    requirements: [
      { id: 'mo-1', label: 'Piano monitoraggio post-market approvato', status: 'non_conforme', note: 'Assente — obbligatorio per alto rischio', fonte: 'Art. 72 Reg. 2024/1689' },
      { id: 'mo-2', label: 'KPI prestazioni AI definiti e tracciati', status: 'parziale', note: 'Solo 2 sistemi con KPI', fonte: 'Art. 9 Reg. 2024/1689' },
      { id: 'mo-3', label: 'Procedura segnalazione incidenti gravi', status: 'non_conforme', note: 'Da implementare (obbligatoria entro agosto 2026)', scadenza: '2026-08-02', fonte: 'Art. 73 Reg. 2024/1689' },
    ],
  },
];

const ACTION_PLAN: ActionItem[] = [
  { id: 'act-1', titolo: 'Avviare DPIA per HiBob HR AI', area: 'Sistemi Alto Rischio', priorita: 'critica', scadenza: '2026-04-15', responsabile: 'AI Officer', fonte: 'Art. 35 GDPR + Art. 10 AI Act' },
  { id: 'act-2', titolo: 'Aggiornare Registro Trattamenti GDPR', area: 'GDPR + AI', priorita: 'critica', scadenza: '2026-04-01', responsabile: 'DPO', fonte: 'Art. 30 GDPR' },
  { id: 'act-3', titolo: 'Completare AI Literacy — Marco Bianchi e Luca Verdi', area: 'Formazione', priorita: 'alta', scadenza: '2026-04-02', responsabile: 'HR Manager', fonte: 'Art. 4 AI Act' },
  { id: 'act-4', titolo: 'Aggiungere disclosure script a Voice Agent Twilio', area: 'Trasparenza', priorita: 'alta', scadenza: '2026-05-01', responsabile: 'CTO', fonte: 'Art. 50 AI Act' },
  { id: 'act-5', titolo: 'Documentare sistema gestione rischio AI', area: 'Sistemi Alto Rischio', priorita: 'alta', scadenza: '2026-05-15', responsabile: 'AI Officer', fonte: 'Art. 9 AI Act' },
  { id: 'act-6', titolo: 'Formalizzare procedure supervisione umana', area: 'Sistemi Alto Rischio', priorita: 'alta', scadenza: '2026-05-15', responsabile: 'AI Officer', fonte: 'Art. 14 AI Act' },
  { id: 'act-7', titolo: 'Implementare piano monitoraggio post-market', area: 'Monitoraggio', priorita: 'alta', scadenza: '2026-06-30', responsabile: 'CTO', fonte: 'Art. 72 AI Act' },
  { id: 'act-8', titolo: 'Firmare DPA con fornitore AI mancante', area: 'GDPR + AI', priorita: 'media', scadenza: '2026-05-01', responsabile: 'Legal', fonte: 'Art. 28 GDPR' },
  { id: 'act-9', titolo: 'Revisionare contratti fornitori per clausole AI Act', area: 'Governance', priorita: 'media', scadenza: '2026-06-01', responsabile: 'Legal', fonte: 'Art. 25 AI Act' },
  { id: 'act-10', titolo: 'Aggiornare Informativa Privacy con finalità AI', area: 'Trasparenza', priorita: 'media', scadenza: '2026-06-01', responsabile: 'DPO', fonte: 'Art. 13 GDPR' },
  { id: 'act-11', titolo: 'Avviare corso AI avanzato per responsabili', area: 'Formazione', priorita: 'media', scadenza: '2026-07-01', responsabile: 'HR Manager', fonte: 'Art. 4 AI Act' },
  { id: 'act-12', titolo: 'Implementare procedura incident response AI', area: 'Governance', priorita: 'media', scadenza: '2026-07-15', responsabile: 'CTO', fonte: 'Art. 73 AI Act' },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<GapStatus, { label: string; icon: React.ComponentType<{ className?: string }>; badge: string; dot: string }> = {
  conforme:      { label: 'Conforme',       icon: CheckCircle2,   badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',   dot: 'bg-emerald-500' },
  parziale:      { label: 'Parziale',       icon: AlertTriangle,  badge: 'bg-amber-50 text-amber-700 border-amber-200',         dot: 'bg-amber-500' },
  non_conforme:  { label: 'Non conforme',   icon: XCircle,        badge: 'bg-red-50 text-red-700 border-red-200',               dot: 'bg-red-500' },
  na:            { label: 'N/A',            icon: CheckCircle2,   badge: 'bg-gray-50 text-gray-500 border-gray-200',            dot: 'bg-gray-300' },
};

const PRIORITY_CONFIG: Record<Priority, { label: string; badge: string }> = {
  critica: { label: 'Critica', badge: 'bg-red-100 text-red-700 border border-red-200' },
  alta:    { label: 'Alta',    badge: 'bg-orange-100 text-orange-700 border border-orange-200' },
  media:   { label: 'Media',   badge: 'bg-amber-100 text-amber-700 border border-amber-200' },
  bassa:   { label: 'Bassa',   badge: 'bg-gray-100 text-gray-600 border border-gray-200' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreArea(area: GapArea): number {
  const total = area.requirements.filter(r => r.status !== 'na').length;
  if (total === 0) return 100;
  const points = area.requirements.reduce((sum, r) => {
    if (r.status === 'na') return sum;
    if (r.status === 'conforme') return sum + 2;
    if (r.status === 'parziale') return sum + 1;
    return sum;
  }, 0);
  return Math.round((points / (total * 2)) * 100);
}

function globalScore(areas: GapArea[]): number {
  const scores = areas.map(scoreArea);
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function daysUntil(iso: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [y, m, d] = iso.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

function formatDateIT(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const stroke = circ * (1 - score / 100);
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="100" height="100" className="-rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#f3f4f6" strokeWidth="10" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={stroke}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-2xl font-bold text-[#1a375b]">{score}%</span>
      </div>
    </div>
  );
}

function AreaCard({ area, expanded, onToggle }: { area: GapArea; expanded: boolean; onToggle: () => void }) {
  const score = scoreArea(area);
  const Icon = area.icon;
  const counts = {
    conforme:     area.requirements.filter(r => r.status === 'conforme').length,
    parziale:     area.requirements.filter(r => r.status === 'parziale').length,
    non_conforme: area.requirements.filter(r => r.status === 'non_conforme').length,
  };
  const barColor = score >= 75 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gray-50/60 transition-colors text-left"
      >
        <div className="h-9 w-9 rounded-lg bg-[#E6F1FB] flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-[#185FA5]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-sm font-semibold text-[#1a375b]">{area.titolo}</h3>
            <span className={`text-sm font-bold ${score >= 75 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
              {score}%
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
            <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${score}%` }} />
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />{counts.conforme} conformi</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500 inline-block" />{counts.parziale} parziali</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500 inline-block" />{counts.non_conforme} gap</span>
          </div>
        </div>
        <div className="shrink-0 text-gray-400">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-2">
          <p className="text-xs text-gray-500 mb-3">{area.descrizione}</p>
          {area.requirements.map((req) => {
            const cfg = STATUS_CONFIG[req.status];
            const StatusIcon = cfg.icon;
            return (
              <div key={req.id} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                <StatusIcon className={`h-4 w-4 mt-0.5 shrink-0 ${req.status === 'conforme' ? 'text-emerald-500' : req.status === 'parziale' ? 'text-amber-500' : req.status === 'non_conforme' ? 'text-red-500' : 'text-gray-300'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm text-[#1a375b] font-medium leading-snug">{req.label}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${cfg.badge}`}>{cfg.label}</span>
                  </div>
                  {req.note && <p className="text-xs text-gray-500 mt-0.5">{req.note}</p>}
                  <p className="text-[10px] text-gray-400 italic mt-0.5">{req.fonte}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AppGapAnalysis() {
  const [expandedArea, setExpandedArea] = useState<string | null>('alto_rischio');
  const [activeTab, setActiveTab] = useState<'overview' | 'roadmap'>('overview');
  const [filterPriority, setFilterPriority] = useState<Priority | 'tutte'>('tutte');

  const score = globalScore(GAP_AREAS);
  const totalReqs = GAP_AREAS.flatMap(a => a.requirements).filter(r => r.status !== 'na');
  const conformi = totalReqs.filter(r => r.status === 'conforme').length;
  const parziali = totalReqs.filter(r => r.status === 'parziale').length;
  const gap = totalReqs.filter(r => r.status === 'non_conforme').length;

  const filteredActions = filterPriority === 'tutte'
    ? ACTION_PLAN
    : ACTION_PLAN.filter(a => a.priorita === filterPriority);

  const toggleArea = (id: string) => setExpandedArea(prev => prev === id ? null : id);

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a375b]">Gap Analysis & Roadmap</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Stato di conformità AI Act e piano d'azione prioritizzato. Aggiornato al 25 marzo 2026.
        </p>
      </div>

      {/* ── Score summary ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <ScoreRing score={score} />
            <p className="text-xs font-semibold text-gray-500 mt-1">
              {score >= 75 ? 'Buona conformità' : score >= 50 ? 'Conformità parziale' : 'Intervento urgente'}
            </p>
          </div>
          <div className="flex-1 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">{conformi}</div>
              <div className="text-xs text-gray-500 mt-1">Requisiti conformi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">{parziali}</div>
              <div className="text-xs text-gray-500 mt-1">Parzialmente conformi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{gap}</div>
              <div className="text-xs text-gray-500 mt-1">Gap da colmare</div>
            </div>
          </div>
          <div className="hidden sm:block border-l border-gray-100 pl-6 text-center">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Scadenza critica</div>
            <div className="text-sm font-bold text-red-600">02/08/2026</div>
            <div className="text-xs text-gray-500">AI Act — Alto rischio</div>
            <div className="text-xs font-bold text-amber-600 mt-1">
              tra {daysUntil('2026-08-02')} giorni
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-gray-200">
        {(['overview', 'roadmap'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab
                ? 'border-[#185FA5] text-[#185FA5]'
                : 'border-transparent text-gray-500 hover:text-[#1a375b]'
            }`}
          >
            {tab === 'overview' ? 'Analisi per area' : 'Piano d\'azione'}
          </button>
        ))}
      </div>

      {/* ── Overview tab ── */}
      {activeTab === 'overview' && (
        <div className="space-y-3">
          {GAP_AREAS.map((area) => (
            <AreaCard
              key={area.id}
              area={area}
              expanded={expandedArea === area.id}
              onToggle={() => toggleArea(area.id)}
            />
          ))}
        </div>
      )}

      {/* ── Roadmap tab ── */}
      {activeTab === 'roadmap' && (
        <div className="space-y-4">
          {/* Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500">Filtra per priorità:</span>
            {(['tutte', 'critica', 'alta', 'media', 'bassa'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  filterPriority === p
                    ? 'bg-[#1a375b] text-white border-[#1a375b]'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {p === 'tutte' ? 'Tutte' : PRIORITY_CONFIG[p].label}
              </button>
            ))}
          </div>

          {/* Action list */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['#', 'Azione', 'Area', 'Priorità', 'Scadenza', 'Responsabile', 'Fonte'].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredActions.map((action, i) => {
                    const days = daysUntil(action.scadenza);
                    const pCfg = PRIORITY_CONFIG[action.priorita];
                    return (
                      <tr key={action.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                        <td className="px-4 py-3 text-xs text-gray-400 font-mono">{i + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-3.5 w-3.5 text-gray-300 shrink-0" />
                            <span className="text-sm font-medium text-[#1a375b]">{action.titolo}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{action.area}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${pCfg.badge}`}>
                            {pCfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <span className="text-xs font-medium text-[#1a375b]">{formatDateIT(action.scadenza)}</span>
                            <div className={`text-[10px] font-medium ${days < 0 ? 'text-red-500' : days <= 30 ? 'text-amber-500' : 'text-gray-400'}`}>
                              {days < 0 ? `${Math.abs(days)}g scaduto` : `tra ${days}g`}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{action.responsabile}</td>
                        <td className="px-4 py-3 text-[10px] text-gray-400 italic whitespace-nowrap">{action.fonte}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
              {filteredActions.length} azioni — {ACTION_PLAN.filter(a => a.priorita === 'critica').length} critiche da completare entro aprile 2026
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
