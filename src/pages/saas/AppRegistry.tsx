import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Plus, Upload, Download, Search, ChevronRight, Pencil, MoreHorizontal,
  Bot, AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockAiSystems } from '@/data/tutelaiMockData';
import type { AiSystem, RischioAI, StatoCompliance } from '@/types/saas';

// ─── Badge helpers ───────────────────────────────────────────────────────────

const RISCHIO_CONFIG: Record<RischioAI, { label: string; dot: string; badge: string }> = {
  inaccettabile: { label: 'Inaccettabile', dot: 'bg-red-900', badge: 'bg-red-100 text-red-900 border border-red-200' },
  alto:          { label: 'Alto',          dot: 'bg-red-500',  badge: 'bg-red-50 text-red-700 border border-red-200' },
  limitato:      { label: 'Limitato',      dot: 'bg-amber-400', badge: 'bg-amber-50 text-amber-700 border border-amber-200' },
  minimo:        { label: 'Minimo',        dot: 'bg-green-500', badge: 'bg-green-50 text-green-700 border border-green-200' },
};

const STATO_CONFIG: Record<StatoCompliance, { label: string; badge: string }> = {
  conforme:     { label: 'Conforme',     badge: 'bg-[#EAF5EE] text-[#1D6B3A] border border-green-200' },
  attenzione:   { label: 'Attenzione',   badge: 'bg-[#FDF3E3] text-[#854F0B] border border-amber-200' },
  critico:      { label: 'Critico',      badge: 'bg-[#FDEAEA] text-[#8B1A1A] border border-red-200' },
  non_valutato: { label: 'Non valutato', badge: 'bg-gray-100 text-gray-600 border border-gray-200' },
};

const RischioBadge = ({ rischio }: { rischio: RischioAI }) => {
  const cfg = RISCHIO_CONFIG[rischio];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

const StatoBadge = ({ stato }: { stato: StatoCompliance }) => {
  const cfg = STATO_CONFIG[stato];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.badge}`}>
      {cfg.label}
    </span>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const ALL = 'all';

export default function AppRegistry() {
  const { tenant } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch]       = useState('');
  const [filterRischio, setFilterRischio] = useState<string>(ALL);
  const [filterStato, setFilterStato]     = useState<string>(ALL);
  const [filterCategoria, setFilterCategoria] = useState<string>(ALL);

  const categorie = useMemo(() => {
    const set = new Set(mockAiSystems.map((s) => s.categoria));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return mockAiSystems.filter((s) => {
      if (q && !s.nome.toLowerCase().includes(q) && !s.fornitore.toLowerCase().includes(q)) return false;
      if (filterRischio !== ALL && s.rischio !== filterRischio) return false;
      if (filterStato !== ALL && s.stato_compliance !== filterStato) return false;
      if (filterCategoria !== ALL && s.categoria !== filterCategoria) return false;
      return true;
    });
  }, [search, filterRischio, filterStato, filterCategoria]);

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a375b]">
            AI Registry
            {tenant?.ragione_sociale && (
              <span className="text-slate-400 font-normal"> — {tenant.ragione_sociale}</span>
            )}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Gestisci e monitora tutti i sistemi AI aziendali</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="border border-[#C8C5BC] hover:bg-gray-50 text-[#1a375b] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors">
            <Upload className="h-4 w-4" />
            Importa CSV
          </button>
          <button className="border border-[#C8C5BC] hover:bg-gray-50 text-[#1a375b] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors">
            <Download className="h-4 w-4" />
            Esporta
          </button>
          <button
            onClick={() => navigate('/app/registry/new')}
            className="bg-[#1a375b] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Aggiungi sistema AI
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white border border-[#C8C5BC] rounded-xl p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cerca per nome o fornitore…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-[#C8C5BC] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#185FA5]/30 focus:border-[#185FA5]"
            />
          </div>
          <select
            value={filterRischio}
            onChange={(e) => setFilterRischio(e.target.value)}
            className="px-3 py-2 border border-[#C8C5BC] rounded-lg text-sm text-[#1a375b] focus:outline-none focus:ring-2 focus:ring-[#185FA5]/30 focus:border-[#185FA5] bg-white"
          >
            <option value={ALL}>Tutti i rischi</option>
            <option value="inaccettabile">Inaccettabile</option>
            <option value="alto">Alto</option>
            <option value="limitato">Limitato</option>
            <option value="minimo">Minimo</option>
          </select>
          <select
            value={filterStato}
            onChange={(e) => setFilterStato(e.target.value)}
            className="px-3 py-2 border border-[#C8C5BC] rounded-lg text-sm text-[#1a375b] focus:outline-none focus:ring-2 focus:ring-[#185FA5]/30 focus:border-[#185FA5] bg-white"
          >
            <option value={ALL}>Tutti gli stati</option>
            <option value="conforme">Conforme</option>
            <option value="attenzione">Attenzione</option>
            <option value="critico">Critico</option>
          </select>
          <select
            value={filterCategoria}
            onChange={(e) => setFilterCategoria(e.target.value)}
            className="px-3 py-2 border border-[#C8C5BC] rounded-lg text-sm text-[#1a375b] focus:outline-none focus:ring-2 focus:ring-[#185FA5]/30 focus:border-[#185FA5] bg-white"
          >
            <option value={ALL}>Tutte le categorie</option>
            {categorie.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* ── Counter ── */}
      <p className="text-sm text-slate-500 mb-3">
        Mostrando <strong className="text-slate-700">{filtered.length}</strong> di <strong className="text-slate-700">{mockAiSystems.length}</strong> sistemi
      </p>

      {/* ── Table ── */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#C8C5BC] rounded-xl p-16 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Bot className="h-7 w-7 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-1">Nessun sistema trovato</h3>
          <p className="text-sm text-slate-500 max-w-xs">Prova a modificare i filtri o la ricerca.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#C8C5BC] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-[#C8C5BC] sticky top-0">
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">Nome</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">Fornitore</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap hidden md:table-cell">Categoria</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">Rischio</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">Stato</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((system: AiSystem, idx) => (
                  <tr
                    key={system.id}
                    onClick={() => navigate(`/app/registry/${system.id}`)}
                    className={`border-b border-slate-100 last:border-0 cursor-pointer hover:bg-[#E6F1FB]/40 transition-colors ${idx % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'}`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#1a375b]">{system.nome}</div>
                      {system.problemi.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-red-600 mt-0.5">
                          <AlertCircle className="h-3 w-3" />
                          {system.problemi.length} problema{system.problemi.length > 1 ? 'i' : ''}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{system.fornitore}</td>
                    <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{system.categoria}</td>
                    <td className="px-4 py-3">
                      <RischioBadge rischio={system.rischio} />
                    </td>
                    <td className="px-4 py-3">
                      <StatoBadge stato={system.stato_compliance} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Link
                          to={`/app/registry/${system.id}`}
                          className="p-1.5 rounded-md hover:bg-[#E6F1FB] text-[#185FA5] transition-colors"
                          title="Dettaglio"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/app/registry/${system.id}/edit`}
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
                          title="Modifica"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
                          title="Altro"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
