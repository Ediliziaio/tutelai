import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2,
  Clock, Info, ExternalLink, RefreshCw, Bot, FileText, GraduationCap,
  Calendar, Shield,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockAuditLogs } from '@/data/tutelaiMockData';

// ── helpers ──────────────────────────────────────────────────────────────────

function formatRelativeTime(iso: string): string {
  const now = new Date();
  const date = new Date(iso);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);
  const diffD = Math.floor(diffH / 24);
  if (diffMin < 1) return 'ora';
  if (diffMin < 60) return `${diffMin} min fa`;
  if (diffH < 24) return `${diffH}h fa`;
  if (diffD === 1) return 'ieri';
  return `${diffD}g fa`;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('it-IT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

// ── AI Risk Score Gauge ───────────────────────────────────────────────────────

function RiskGauge({ score }: { score: number }) {
  // semicircle: viewBox 0 0 200 110
  // arc from 180deg to 0deg (left to right)
  const r = 80;
  const cx = 100;
  const cy = 100;
  const circumference = Math.PI * r; // half circle

  // color based on score
  const getColor = (s: number) => {
    if (s <= 33) return '#22A86B';
    if (s <= 66) return '#D97706';
    return '#DC2626';
  };

  const getLevel = (s: number) => {
    if (s <= 33) return { label: 'BASSO', color: '#22A86B', bg: '#EAF5EE', text: '#1D6B3A' };
    if (s <= 66) return { label: 'ATTENZIONE', color: '#D97706', bg: '#FDF3E3', text: '#854F0B' };
    return { label: 'CRITICO', color: '#DC2626', bg: '#FDEAEA', text: '#8B1A1A' };
  };

  const level = getLevel(score);
  const arcColor = getColor(score);
  const filled = (score / 100) * circumference;

  // SVG arc path: start at left (180deg), sweep to right (0deg)
  // (cx - r, cy) → (cx + r, cy) going counterclockwise (sweep=0)
  const startX = cx - r;
  const startY = cy;
  const endX = cx + r;
  const endY = cy;

  // dashoffset: circumference - filled (we draw from left)
  const dashOffset = circumference - filled;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 110" className="w-48 h-28" role="img" aria-label={`AI Risk Score: ${score}/100`}>
        {/* track */}
        <path
          d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* filled arc using stroke-dasharray */}
        <path
          d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`}
          fill="none"
          stroke={arcColor}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        {/* score text */}
        <text x="100" y="88" textAnchor="middle" fontSize="32" fontWeight="700" fill="#042C53" fontFamily="Inter, sans-serif">
          {score}
        </text>
        <text x="100" y="104" textAnchor="middle" fontSize="11" fill="#6B7280" fontFamily="Inter, sans-serif">
          / 100
        </text>
      </svg>
      <span
        className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full mt-1"
        style={{ background: level.bg, color: level.text }}
      >
        {level.label}
      </span>
    </div>
  );
}

// ── Progress Bar ──────────────────────────────────────────────────────────────

function ProgressBar({ value, color = '#185FA5' }: { value: number; color?: string }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
      <div
        className="h-1.5 rounded-full transition-all duration-500"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  main: string;
  sub: React.ReactNode;
  link: string;
}

function StatCard({ icon, title, main, sub, link }: StatCardProps) {
  return (
    <Link to={link} className="block group">
      <div className="bg-white border border-[#C8C5BC] rounded-xl p-5 hover:shadow-md transition-shadow h-full">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-[#185FA5]">{icon}</div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#185FA5] transition-colors" />
        </div>
        <p className="text-xs text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-[#042C53] mb-2">{main}</p>
        <div className="text-xs text-gray-500 space-y-0.5">{sub}</div>
      </div>
    </Link>
  );
}

// ── Priority Action ───────────────────────────────────────────────────────────

interface PriorityAction {
  urgency: 'red' | 'yellow' | 'blue' | 'green';
  text: string;
  actionLabel?: string;
  actionLink?: string;
}

const PRIORITY_ACTIONS: PriorityAction[] = [
  {
    urgency: 'red',
    text: 'Formazione AI Literacy: 2 utenti non hanno ancora completato il corso obbligatorio',
    actionLabel: 'Assegna ora',
    actionLink: '/app/training/team',
  },
  {
    urgency: 'red',
    text: 'Voice Agent Twilio: manca disclosure obbligatoria — scadenza 2 ago 2026',
    actionLabel: 'Risolvi',
    actionLink: '/app/registry/ai-004',
  },
  {
    urgency: 'yellow',
    text: 'Contratto con Fornitore: non include clausole AI',
    actionLabel: 'Genera clausola',
    actionLink: '/app/docs/new',
  },
  {
    urgency: 'blue',
    text: 'Nuova circolare ACN del 15 marzo — impatta il tuo settore',
    actionLabel: 'Leggi',
    actionLink: '/app/monitor/mon-001',
  },
  {
    urgency: 'green',
    text: 'Policy uso AI aggiornata e firmata',
  },
];

const urgencyBorder: Record<PriorityAction['urgency'], string> = {
  red: 'border-l-[#DC2626]',
  yellow: 'border-l-[#D97706]',
  blue: 'border-l-[#185FA5]',
  green: 'border-l-[#22A86B]',
};

const urgencyBg: Record<PriorityAction['urgency'], string> = {
  red: 'bg-[#FDEAEA]',
  yellow: 'bg-[#FDF3E3]',
  blue: 'bg-[#E6F1FB]',
  green: 'bg-[#EAF5EE]',
};

function UrgencyIcon({ urgency }: { urgency: PriorityAction['urgency'] }) {
  if (urgency === 'red') return <AlertTriangle className="w-4 h-4 text-[#DC2626] flex-shrink-0" />;
  if (urgency === 'yellow') return <AlertTriangle className="w-4 h-4 text-[#D97706] flex-shrink-0" />;
  if (urgency === 'blue') return <Info className="w-4 h-4 text-[#185FA5] flex-shrink-0" />;
  return <CheckCircle2 className="w-4 h-4 text-[#22A86B] flex-shrink-0" />;
}

// ── Risk Categories ───────────────────────────────────────────────────────────

const riskCategories = [
  { label: 'Documentazione', score: 45, color: '#D97706' },
  { label: 'Formazione dipendenti', score: 20, color: '#DC2626' },
  { label: 'Contrattualistica', score: 55, color: '#D97706' },
  { label: 'Sistemi AI censiti', score: 80, color: '#22A86B' },
  { label: 'Governance interna', score: 10, color: '#DC2626' },
];

function getCategoryColor(score: number) {
  if (score >= 67) return '#22A86B';
  if (score >= 34) return '#D97706';
  return '#DC2626';
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AppDashboard() {
  const { profile, tenant } = useAuth();
  const [riskExpanded, setRiskExpanded] = useState(false);

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Utente';
  const companyName = tenant?.ragione_sociale ?? '';
  const plan = tenant?.piano ?? 'business';

  const planLabel: Record<string, string> = {
    starter: 'Starter',
    business: 'Business',
    enterprise: 'Enterprise',
  };

  const recentLogs = mockAuditLogs.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ── Header row ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-bold text-[#042C53]">
              Buongiorno, {firstName}
            </h1>
            {companyName && (
              <p className="text-sm text-gray-500 mt-0.5">{companyName}</p>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide bg-[#E6F1FB] text-[#185FA5] px-3 py-1 rounded-full self-start sm:self-auto">
            Piano {planLabel[plan] ?? plan}
          </span>
        </div>

        {/* ── Top section: gauge + stat cards ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* AI Risk Score */}
          <div className="bg-white border border-[#C8C5BC] rounded-xl p-5 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 self-start w-full">
              <Shield className="w-4 h-4 text-[#185FA5]" />
              <span className="text-sm font-semibold text-[#042C53]">AI Risk Score</span>
            </div>
            <RiskGauge score={34} />
            <p className="text-xs text-gray-500 text-center">
              Score calcolato su documentazione, formazione, sistemi e governance
            </p>
            <button className="bg-[#042C53] hover:bg-[#185FA5] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5" />
              Aggiorna score
            </button>
          </div>

          {/* Stat cards grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard
              icon={<Bot className="w-5 h-5" />}
              title="Sistemi AI"
              main="8 totali"
              sub={
                <>
                  <p><span className="inline-block w-2 h-2 rounded-full bg-[#22A86B] mr-1.5" />5 conformi</p>
                  <p><span className="inline-block w-2 h-2 rounded-full bg-[#D97706] mr-1.5" />2 attenzione</p>
                  <p><span className="inline-block w-2 h-2 rounded-full bg-[#DC2626] mr-1.5" />1 critico</p>
                </>
              }
              link="/app/registry"
            />
            <StatCard
              icon={<FileText className="w-5 h-5" />}
              title="Documenti"
              main="12 totali"
              sub={
                <>
                  <p><span className="inline-block w-2 h-2 rounded-full bg-[#22A86B] mr-1.5" />8 firmati</p>
                  <p><span className="inline-block w-2 h-2 rounded-full bg-[#185FA5] mr-1.5" />3 bozza</p>
                  <p><span className="inline-block w-2 h-2 rounded-full bg-[#DC2626] mr-1.5" />1 scaduto</p>
                </>
              }
              link="/app/docs"
            />
            <StatCard
              icon={<GraduationCap className="w-5 h-5" />}
              title="Formazione"
              main="5 utenti"
              sub={
                <>
                  <p><span className="inline-block w-2 h-2 rounded-full bg-[#22A86B] mr-1.5" />3 completato</p>
                  <p><span className="inline-block w-2 h-2 rounded-full bg-[#D97706] mr-1.5" />2 in corso</p>
                  <p><span className="inline-block w-2 h-2 rounded-full bg-gray-300 mr-1.5" />0 non iniziato</p>
                </>
              }
              link="/app/training"
            />
            <StatCard
              icon={<Calendar className="w-5 h-5" />}
              title="Prossima scadenza"
              main="127 giorni"
              sub={
                <>
                  <p className="font-medium text-[#042C53]">2 agosto 2026</p>
                  <p>Trasparenza AI — pubblico</p>
                  <p className="text-[#854F0B]">Art. 50 AI Act</p>
                </>
              }
              link="/app/monitor"
            />
          </div>
        </div>

        {/* ── Bottom section: actions + activity + risk detail ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Azioni prioritarie */}
          <div className="bg-white border border-[#C8C5BC] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-[#042C53] mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#D97706]" />
              Azioni prioritarie
            </h2>
            <div className="space-y-2">
              {PRIORITY_ACTIONS.map((action, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 border-l-4 ${urgencyBorder[action.urgency]} ${urgencyBg[action.urgency]} rounded-r-lg px-3 py-2.5`}
                >
                  <UrgencyIcon urgency={action.urgency} />
                  <p className="text-sm text-gray-700 flex-1 leading-snug">{action.text}</p>
                  {action.actionLabel && action.actionLink && (
                    <Link
                      to={action.actionLink}
                      className="flex-shrink-0 border border-[#C8C5BC] hover:bg-gray-50 text-[#042C53] text-xs font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                    >
                      {action.actionLabel}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right column: activity + risk detail */}
          <div className="space-y-5">

            {/* Attività recente */}
            <div className="bg-white border border-[#C8C5BC] rounded-xl p-5">
              <h2 className="text-sm font-semibold text-[#042C53] mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#185FA5]" />
                Attività recente
              </h2>
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#185FA5] mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 leading-snug">
                        <span className="font-medium">{log.azione}</span>
                        {log.oggetto && (
                          <span className="text-gray-500"> — {log.oggetto}</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {log.utente_nome && <span className="mr-1">{log.utente_nome} ·</span>}
                        <span className="text-[#185FA5]">{log.modulo}</span>
                        <span className="mx-1">·</span>
                        {formatRelativeTime(log.timestamp)}
                      </p>
                    </div>
                    <span className="text-[10px] text-gray-400 flex-shrink-0 mt-0.5">
                      {formatDateTime(log.timestamp).split(',')[1]?.trim()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Risk Score detail */}
            <div className="bg-white border border-[#C8C5BC] rounded-xl p-5">
              <button
                className="w-full flex items-center justify-between"
                onClick={() => setRiskExpanded((v) => !v)}
              >
                <h2 className="text-sm font-semibold text-[#042C53] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#185FA5]" />
                  Dettaglio AI Risk Score per categoria
                </h2>
                {riskExpanded
                  ? <ChevronUp className="w-4 h-4 text-gray-400" />
                  : <ChevronDown className="w-4 h-4 text-gray-400" />
                }
              </button>

              {riskExpanded && (
                <div className="mt-4 space-y-3">
                  {riskCategories.map((cat) => {
                    const color = getCategoryColor(cat.score);
                    return (
                      <div key={cat.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">{cat.label}</span>
                          <span
                            className="text-xs font-bold"
                            style={{ color }}
                          >
                            {cat.score}/100
                          </span>
                        </div>
                        <ProgressBar value={cat.score} color={color} />
                      </div>
                    );
                  })}
                </div>
              )}

              {!riskExpanded && (
                <p className="text-xs text-gray-400 mt-2">
                  Espandi per vedere il dettaglio per area
                </p>
              )}
            </div>

          </div>
        </div>

        {/* ── Quick links footer ── */}
        <div className="flex flex-wrap gap-3 pt-2">
          {[
            { label: 'Registro AI', to: '/app/registry' },
            { label: 'Documenti', to: '/app/docs' },
            { label: 'Formazione', to: '/app/training' },
            { label: 'AI Monitor', to: '/app/monitor' },
            { label: 'GDPR + AI', to: '/app/gdpr' },
            { label: 'Audit Log', to: '/app/audit' },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-1 text-xs text-[#185FA5] hover:text-[#042C53] transition-colors"
            >
              {link.label}
              <ExternalLink className="w-3 h-3" />
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
