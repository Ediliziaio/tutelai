import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, Plus, MoreVertical, Pencil, ChevronRight, LogIn } from 'lucide-react';
import { StatusBadge } from '@/components/saas/StatusBadge';
import { mockAziende } from '@/data/tutelaiMockData';
import { useAuth } from '@/contexts/AuthContext';
import type { Tenant } from '@/types/auth';

// Build a full Tenant object from a mockAziende entry for impersonation
function buildTenant(az: typeof mockAziende[number]): Tenant {
  return {
    id: az.id,
    ragione_sociale: az.ragione_sociale,
    partita_iva: az.partita_iva,
    settore: az.settore,
    num_dipendenti: az.num_dipendenti,
    email_principale: `info@${az.ragione_sociale.toLowerCase().replace(/\s+/g, '')}.it`,
    piano: az.piano as Tenant['piano'],
    stato: az.stato as Tenant['stato'],
    created_at: az.created_at,
    onboarding_completato: true,
    ai_risk_score: az.ai_risk_score ?? undefined,
    ai_risk_level: az.ai_risk_score == null ? undefined
      : az.ai_risk_score < 30 ? 'buono'
      : az.ai_risk_score < 60 ? 'attenzione'
      : 'critico',
  };
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

function RiskScore({ score }: { score: number | null }) {
  if (score === null) return <span className="text-gray-400 text-sm">—</span>;
  const color = score < 30 ? 'text-emerald-600' : score < 60 ? 'text-amber-600' : 'text-red-600';
  return <span className={`font-bold text-sm ${color}`}>{score}/100</span>;
}

const ALL = 'all';

export default function AdminAziende() {
  const navigate = useNavigate();
  const { startImpersonation } = useAuth();

  const handleImpersonate = (az: typeof mockAziende[number]) => {
    startImpersonation(buildTenant(az));
    navigate('/app/dashboard');
  };
  const [search, setSearch] = useState('');
  const [filterPiano, setFilterPiano] = useState(ALL);
  const [filterStato, setFilterStato] = useState(ALL);
  const [filterSettore, setFilterSettore] = useState(ALL);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const settori = Array.from(new Set(mockAziende.map((a) => a.settore)));

  const filtered = mockAziende.filter((az) => {
    const matchSearch =
      search === '' ||
      az.ragione_sociale.toLowerCase().includes(search.toLowerCase()) ||
      az.partita_iva.toLowerCase().includes(search.toLowerCase());
    const matchPiano = filterPiano === ALL || az.piano === filterPiano;
    const matchStato = filterStato === ALL || az.stato === filterStato;
    const matchSettore = filterSettore === ALL || az.settore === filterSettore;
    return matchSearch && matchPiano && matchStato && matchSettore;
  });

  const totali = mockAziende.length;
  const attive = mockAziende.filter((a) => a.stato === 'attivo').length;
  const trial = mockAziende.filter((a) => a.stato === 'trial').length;
  const sospese = mockAziende.filter((a) => a.stato === 'sospeso').length;

  const handleExport = () => {
    const rows = [
      ['Ragione Sociale', 'P.IVA', 'Settore', 'Piano', 'Stato', 'AI Risk Score', 'Sistemi AI', 'Utenti', 'Registrata'],
      ...filtered.map((a) => [a.ragione_sociale, a.partita_iva, a.settore, a.piano, a.stato, a.ai_risk_score ?? '', a.sistemi_ai, a.utenti, a.created_at]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'aziende.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6" onClick={() => setOpenMenuId(null)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-[#042C53]">Aziende</h1>
        <button className="flex items-center gap-2 bg-[#042C53] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="h-4 w-4" /> Nuova azienda
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Totali', value: totali, color: 'text-[#042C53]' },
          { label: 'Attive', value: attive, color: 'text-emerald-600' },
          { label: 'Trial', value: trial, color: 'text-amber-600' },
          { label: 'Sospese', value: sospese, color: 'text-slate-500' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca azienda o P.IVA..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#042C53]/20 focus:border-[#042C53]"
            />
          </div>
          <select
            value={filterPiano}
            onChange={(e) => setFilterPiano(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
          >
            <option value={ALL}>Tutti i piani</option>
            <option value="starter">Starter</option>
            <option value="business">Business</option>
            <option value="enterprise">Enterprise</option>
          </select>
          <select
            value={filterStato}
            onChange={(e) => setFilterStato(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
          >
            <option value={ALL}>Tutti gli stati</option>
            <option value="attivo">Attivo</option>
            <option value="trial">Trial</option>
            <option value="sospeso">Sospeso</option>
            <option value="churned">Churned</option>
          </select>
          <select
            value={filterSettore}
            onChange={(e) => setFilterSettore(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
          >
            <option value={ALL}>Tutti i settori</option>
            {settori.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" /> CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Azienda', 'Settore', 'Piano', 'Stato', 'AI Risk Score', 'Sistemi', 'Utenti', 'Registrata', 'Azioni'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-gray-400">Nessuna azienda trovata.</td>
                </tr>
              )}
              {filtered.map((az) => (
                <tr
                  key={az.id}
                  className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors cursor-pointer"
                  onClick={() => navigate(`/admin/aziende/${az.id}`)}
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-[#042C53]">{az.ragione_sociale}</p>
                    <p className="text-xs text-gray-400 font-mono">{az.partita_iva}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{az.settore}</td>
                  <td className="px-4 py-3"><PlanBadge piano={az.piano} /></td>
                  <td className="px-4 py-3"><StatusBadge status={az.stato as 'attivo' | 'trial' | 'sospeso'} /></td>
                  <td className="px-4 py-3"><RiskScore score={az.ai_risk_score} /></td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-center">{az.sistemi_ai}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-center">{az.utenti}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{az.created_at}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1 relative">
                      <button
                        onClick={() => navigate(`/admin/aziende/${az.id}`)}
                        className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-[#042C53]"
                        title="Dettaglio"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-[#042C53]"
                        title="Modifica"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === az.id ? null : az.id); }}
                          className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-[#042C53]"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {openMenuId === az.id && (
                          <div className="absolute right-0 top-8 z-10 w-52 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                            <button
                              onClick={() => handleImpersonate(az)}
                              className="w-full text-left px-4 py-2 text-sm text-[#185FA5] hover:bg-blue-50 flex items-center gap-2 font-medium"
                            >
                              <LogIn className="h-3.5 w-3.5" />
                              Accedi come cliente
                            </button>
                            <div className="border-t border-gray-100 my-1" />
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              {az.stato === 'sospeso' ? 'Riattiva' : 'Sospendi'}
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              Cambia piano
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                              Elimina
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
          Mostrando {filtered.length} di {mockAziende.length} aziende
        </div>
      </div>
    </div>
  );
}
