import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Plus, Search, FileText, Download, MoreHorizontal,
  ArrowRight, FileSignature, Inbox,
} from 'lucide-react';
import { mockDocumenti } from '@/data/tutelaiMockData';
import type { Documento, StatoDocumento, TipoDocumento } from '@/types/saas';

// ─── Config ───────────────────────────────────────────────────────────────────

const STATO_CFG: Record<StatoDocumento, { label: string; badge: string; cardBorder?: string }> = {
  bozza:       { label: 'Bozza',       badge: 'bg-gray-100 text-gray-600 border border-gray-200' },
  in_revisione:{ label: 'In revisione', badge: 'bg-[#FDF3E3] text-[#854F0B] border border-amber-200' },
  approvato:   { label: 'Approvato',   badge: 'bg-[#E6F1FB] text-[#185FA5] border border-blue-200' },
  firmato:     { label: 'Firmato',     badge: 'bg-[#EAF5EE] text-[#1D6B3A] border border-green-200', cardBorder: 'border-t-[3px] border-t-green-500' },
  archiviato:  { label: 'Archiviato', badge: 'bg-slate-100 text-slate-500 border border-slate-200' },
};

const TIPO_LABELS: Record<TipoDocumento, string> = {
  policy_ai_interno: 'Policy uso AI interno',
  regolamento_ai: 'Regolamento AI',
  informativa_lavoratori: 'Informativa lavoratori',
  procedura_breach: 'Procedura breach',
  nomina_ai_officer: 'Nomina AI Officer',
  procedura_dpia: 'Procedura DPIA',
  clausole_cliente: 'Clausole cliente',
  clausole_fornitore: 'Clausole fornitore',
  contratto_saas: 'Contratto SaaS',
  nda_ai: 'NDA AI',
  tc_sito: 'T&C sito',
  addendum_ai: 'Addendum AI',
  registro_trattamenti: 'Registro trattamenti',
  informativa_privacy_ai: 'Informativa privacy AI',
  dpia: 'DPIA',
  nomina_dpo: 'Nomina DPO',
  consenso_ai: 'Consenso AI',
  notifica_breach: 'Notifica breach',
  disclaimer_sito: 'Disclaimer sito',
  script_disclosure: 'Script disclosure',
  etichetta_contenuto: 'Etichetta contenuto',
  informativa_chatbot: 'Informativa chatbot',
  attestato_ai_literacy: 'Attestato AI Literacy',
  registro_corsi: 'Registro corsi',
};

const TABS: { key: StatoDocumento | 'tutti'; label: string }[] = [
  { key: 'tutti', label: 'Tutti' },
  { key: 'bozza', label: 'Bozza' },
  { key: 'in_revisione', label: 'In revisione' },
  { key: 'approvato', label: 'Approvato' },
  { key: 'firmato', label: 'Firmato' },
  { key: 'archiviato', label: 'Archiviato' },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── Card component ───────────────────────────────────────────────────────────

const DocCard = ({ doc }: { doc: Documento }) => {
  const navigate = useNavigate();
  const cfg = STATO_CFG[doc.stato];

  return (
    <div className={`bg-white border border-[#C8C5BC] rounded-xl overflow-hidden flex flex-col hover:shadow-md transition-shadow ${cfg.cardBorder ?? ''}`}>
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#E6F1FB] flex items-center justify-center shrink-0">
            {doc.stato === 'firmato' ? (
              <FileSignature className="h-5 w-5 text-[#185FA5]" />
            ) : (
              <FileText className="h-5 w-5 text-[#185FA5]" />
            )}
          </div>
          <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 transition-colors">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
        <h3 className="font-semibold text-[#1a375b] text-sm mb-1 leading-snug">{doc.titolo}</h3>
        <p className="text-xs text-slate-500 mb-3">{TIPO_LABELS[doc.tipo] ?? doc.tipo}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>{cfg.label}</span>
          <span className="text-xs text-slate-400">v{doc.versione}</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">Aggiornato il {formatDate(doc.updated_at)}</p>
      </div>
      <div className="border-t border-[#C8C5BC] px-4 py-3 flex items-center gap-2 flex-wrap bg-slate-50/50">
        <button
          onClick={() => navigate(`/app/docs/${doc.id}/edit`)}
          className="border border-[#C8C5BC] hover:bg-white text-[#1a375b] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        >
          Visualizza
        </button>
        <button className="border border-[#C8C5BC] hover:bg-white text-[#1a375b] px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors">
          <Download className="h-3.5 w-3.5" /> Esporta .docx
        </button>
        {doc.stato === 'bozza' && (
          <button
            onClick={() => navigate(`/app/docs/${doc.id}/edit`)}
            className="ml-auto bg-[#1a375b] hover:bg-[#185FA5] text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
          >
            Continua <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function AppDocs() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<StatoDocumento | 'tutti'>('tutti');
  const [search, setSearch] = useState('');
  const [filterTipo, setFilterTipo] = useState('');

  const tipoOptions = useMemo(() => {
    const set = new Set(mockDocumenti.map((d) => d.tipo));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    return mockDocumenti.filter((d) => {
      if (activeTab !== 'tutti' && d.stato !== activeTab) return false;
      if (search && !d.titolo.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterTipo && d.tipo !== filterTipo) return false;
      return true;
    });
  }, [activeTab, search, filterTipo]);

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a375b]">Doc Generator</h1>
          <p className="text-sm text-slate-500 mt-0.5">Genera e gestisci documenti di compliance AI</p>
        </div>
        <button
          onClick={() => navigate('/app/docs/new')}
          className="bg-[#1a375b] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Genera nuovo documento
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 border-b border-[#C8C5BC] mb-5 overflow-x-auto pb-px">
        {TABS.map((tab) => {
          const count = tab.key === 'tutti' ? mockDocumenti.length : mockDocumenti.filter((d) => d.stato === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-[#185FA5] text-[#185FA5]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-[#E6F1FB] text-[#185FA5]' : 'bg-slate-100 text-slate-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Search + filter ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cerca documento…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-[#C8C5BC] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#185FA5]/30 focus:border-[#185FA5]"
          />
        </div>
        <select
          value={filterTipo}
          onChange={(e) => setFilterTipo(e.target.value)}
          className="px-3 py-2 border border-[#C8C5BC] rounded-lg text-sm text-[#1a375b] focus:outline-none focus:ring-2 focus:ring-[#185FA5]/30 focus:border-[#185FA5] bg-white"
        >
          <option value="">Tutti i tipi</option>
          {tipoOptions.map((t) => (
            <option key={t} value={t}>{TIPO_LABELS[t as TipoDocumento] ?? t}</option>
          ))}
        </select>
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#C8C5BC] rounded-xl p-16 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Inbox className="h-7 w-7 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Nessun documento trovato</h3>
          <p className="text-sm text-slate-500 mb-5 max-w-xs">
            {mockDocumenti.length === 0
              ? 'Genera il tuo primo documento di compliance AI.'
              : 'Prova a modificare i filtri o la ricerca.'}
          </p>
          <button
            onClick={() => navigate('/app/docs/new')}
            className="bg-[#1a375b] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Genera il tuo primo documento
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => <DocCard key={doc.id} doc={doc} />)}
        </div>
      )}
    </div>
  );
}
