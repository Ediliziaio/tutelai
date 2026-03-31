import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Info, Building2, TrendingUp, Shield, Cpu } from 'lucide-react';
import { StatusBadge } from '@/components/saas/StatusBadge';
import { mockAziende } from '@/data/tutelaiMockData';

const today = new Date().toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const growthData = [
  { month: 'Ott', value: 1 },
  { month: 'Nov', value: 2 },
  { month: 'Dic', value: 3 },
  { month: 'Gen', value: 4 },
  { month: 'Feb', value: 5 },
  { month: 'Mar', value: 6 },
];
const maxGrowth = 6;

function RiskScore({ score }: { score: number | null }) {
  if (score === null) return <span className="text-gray-400 text-sm">—</span>;
  const color = score < 30 ? 'text-emerald-600' : score < 60 ? 'text-amber-600' : 'text-red-600';
  return <span className={`font-bold text-sm ${color}`}>{score}/100</span>;
}

function PlanBadge({ piano }: { piano: string }) {
  const styles: Record<string, string> = {
    starter: 'bg-slate-100 text-slate-600 border-slate-200',
    business: 'bg-blue-50 text-blue-700 border-blue-200',
    enterprise: 'bg-violet-50 text-violet-700 border-violet-200',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${styles[piano] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      {piano}
    </span>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const recentAziende = mockAziende.slice(0, 5);

  const stats = [
    { label: 'Aziende attive', value: '6', sub: '+2 questo mese', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'MRR', value: '€1.438', sub: '+€238 questo mese', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'AI Risk Score medio', value: '38/100', sub: 'Media piattaforma', icon: Shield, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Sistemi AI censiti', value: '43', sub: 'Totale piattaforma', icon: Cpu, color: 'text-violet-600', bg: 'bg-violet-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-[#1a375b]">Dashboard SuperAdmin</h1>
          <p className="text-sm text-gray-500 mt-0.5 capitalize">{today}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{s.label}</p>
                <p className="text-2xl font-bold text-[#1a375b] mt-1">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
              </div>
              <div className={`h-10 w-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Growth + Plan distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-[#1a375b] mb-4">Crescita aziende — ultimi 6 mesi</h2>
          <div className="flex items-end gap-3 h-32">
            {growthData.map((d) => (
              <div key={d.month} className="flex flex-col items-center flex-1 gap-1">
                <span className="text-xs font-semibold text-[#1a375b]">{d.value}</span>
                <div
                  className="w-full rounded-t-md bg-[#1a375b] hover:bg-[#185FA5] transition-colors"
                  style={{ height: `${(d.value / maxGrowth) * 100}%` }}
                />
                <span className="text-xs text-gray-400">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan distribution */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-[#1a375b] mb-4">Distribuzione piani</h2>
          <div className="space-y-3">
            {[
              { label: 'Starter', count: 2, color: 'bg-slate-400', pct: 33 },
              { label: 'Business', count: 3, color: 'bg-[#185FA5]', pct: 50 },
              { label: 'Enterprise', count: 1, color: 'bg-violet-500', pct: 17 },
            ].map((p) => (
              <div key={p.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-gray-700">{p.label}</span>
                  <span className="text-gray-500">{p.count} aziende</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${p.color} rounded-full`} style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
            {[{ l: 'Starter', v: 2 }, { l: 'Business', v: 3 }, { l: 'Enterprise', v: 1 }].map((p) => (
              <div key={p.l}>
                <p className="text-xl font-bold text-[#1a375b]">{p.v}</p>
                <p className="text-[11px] text-gray-400">{p.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent companies */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#1a375b]">Aziende recenti</h2>
          <button onClick={() => navigate('/admin/aziende')} className="text-xs text-[#185FA5] hover:underline font-medium">
            Vedi tutte →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Azienda', 'Settore', 'Piano', 'Stato', 'AI Risk Score', 'Sistemi AI', 'Registrata', ''].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentAziende.map((az) => (
                <tr key={az.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-[#1a375b]">{az.ragione_sociale}</p>
                    <p className="text-xs text-gray-400">{az.partita_iva}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{az.settore}</td>
                  <td className="px-4 py-3"><PlanBadge piano={az.piano} /></td>
                  <td className="px-4 py-3"><StatusBadge status={az.stato as 'attivo' | 'trial' | 'sospeso'} /></td>
                  <td className="px-4 py-3"><RiskScore score={az.ai_risk_score} /></td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-center">{az.sistemi_ai}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{az.created_at}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/admin/aziende/${az.id}`)}
                      className="text-xs text-[#185FA5] hover:underline font-medium"
                    >
                      → Dettaglio
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-[#1a375b] mb-3">Alert piattaforma</h2>
        <div className="space-y-2">
          <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm text-red-700">
              <strong>3 aziende</strong> hanno sistemi AI critici senza disclosure.{' '}
              <button onClick={() => navigate('/admin/aziende')} className="underline font-medium">Visualizza</button>
            </p>
          </div>
          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-700">
              <strong>2 aziende</strong> in trial in scadenza entro 7 giorni.{' '}
              <button onClick={() => navigate('/admin/aziende')} className="underline font-medium">Visualizza</button>
            </p>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
            <p className="text-sm text-blue-700">
              Nuovo aggiornamento normativo pubblicato — <strong>5 aziende impattate</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
