import { useState } from 'react';
import {
  Building2, CheckCircle2, AlertTriangle, XCircle, Plus,
  ExternalLink, FileText, Shield, Clock, ChevronDown, ChevronUp,
  Search, Download,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type VendorRisk = 'basso' | 'medio' | 'alto' | 'critico';
type VendorStatus = 'conforme' | 'in_revisione' | 'non_conforme' | 'da_verificare';

interface VendorDocument {
  tipo: 'dpa' | 'nda' | 'soc2' | 'iso27001' | 'gdpr_rep' | 'ai_act_cert';
  label: string;
  stato: 'presente' | 'assente' | 'scaduto';
  scadenza?: string;
}

interface Vendor {
  id: string;
  nome: string;
  categoria: string;
  paese: string;
  website: string;
  sistemi_ai: string[];
  rischio: VendorRisk;
  status: VendorStatus;
  data_verifica: string;
  prossima_revisione: string;
  documenti: VendorDocument[];
  note?: string;
  gpai: boolean; // fornisce modelli GPAI (ChatGPT, Claude, etc.)
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const VENDORS: Vendor[] = [
  {
    id: 'v1',
    nome: 'OpenAI Inc.',
    categoria: 'AI Generativa',
    paese: 'USA',
    website: 'openai.com',
    sistemi_ai: ['GPT-4o (API)', 'DALL-E 3'],
    rischio: 'medio',
    status: 'conforme',
    data_verifica: '2025-08-15',
    prossima_revisione: '2026-08-15',
    gpai: true,
    documenti: [
      { tipo: 'dpa', label: 'DPA (Art. 28 GDPR)', stato: 'presente', scadenza: '2026-08-10' },
      { tipo: 'gdpr_rep', label: 'Rappresentante UE', stato: 'presente' },
      { tipo: 'ai_act_cert', label: 'GPAI Compliance Notice', stato: 'presente' },
      { tipo: 'soc2', label: 'SOC 2 Type II', stato: 'presente', scadenza: '2026-06-01' },
    ],
  },
  {
    id: 'v2',
    nome: 'HiBob Ltd.',
    categoria: 'HR Software',
    paese: 'UK',
    website: 'hibob.com',
    sistemi_ai: ['HiBob HR AI (alto rischio)'],
    rischio: 'critico',
    status: 'non_conforme',
    data_verifica: '2026-01-10',
    prossima_revisione: '2026-04-10',
    gpai: false,
    documenti: [
      { tipo: 'dpa', label: 'DPA (Art. 28 GDPR)', stato: 'presente', scadenza: '2026-12-31' },
      { tipo: 'ai_act_cert', label: 'Dichiarazione conformità AI Act', stato: 'assente' },
      { tipo: 'soc2', label: 'SOC 2 Type II', stato: 'presente' },
      { tipo: 'iso27001', label: 'ISO 27001', stato: 'assente' },
    ],
    note: 'Sistema AI alto rischio (Allegato III AI Act). Manca dichiarazione di conformità Art. 47. DPA firma fornitore in attesa.',
  },
  {
    id: 'v3',
    nome: 'Twilio Inc.',
    categoria: 'Comunicazioni',
    paese: 'USA',
    website: 'twilio.com',
    sistemi_ai: ['Voice Agent AI (alto rischio — Art. 50)'],
    rischio: 'alto',
    status: 'in_revisione',
    data_verifica: '2025-11-01',
    prossima_revisione: '2026-05-01',
    gpai: false,
    documenti: [
      { tipo: 'dpa', label: 'DPA (Art. 28 GDPR)', stato: 'presente' },
      { tipo: 'ai_act_cert', label: 'Clausole AI Act (Art. 25)', stato: 'assente' },
      { tipo: 'soc2', label: 'SOC 2 Type II', stato: 'presente' },
    ],
    note: 'Contratto in aggiornamento per inserire clausole AI Act Art. 25. Manca aggiornamento clausole GPAI.',
  },
  {
    id: 'v4',
    nome: 'Tidio Sp. z o.o.',
    categoria: 'Customer Service AI',
    paese: 'Polonia',
    website: 'tidio.com',
    sistemi_ai: ['Tidio Chatbot AI'],
    rischio: 'medio',
    status: 'da_verificare',
    data_verifica: '2025-06-01',
    prossima_revisione: '2026-03-01',
    gpai: false,
    documenti: [
      { tipo: 'dpa', label: 'DPA (Art. 28 GDPR)', stato: 'scaduto', scadenza: '2026-01-01' },
      { tipo: 'ai_act_cert', label: 'Dichiarazione conformità AI Act', stato: 'assente' },
      { tipo: 'soc2', label: 'SOC 2', stato: 'assente' },
    ],
    note: 'Verifica scaduta. DPA scaduto — rinnovare urgentemente. Scheda tecnica sistema AI non ricevuta.',
  },
  {
    id: 'v5',
    nome: 'Anthropic PBC',
    categoria: 'AI Generativa',
    paese: 'USA',
    website: 'anthropic.com',
    sistemi_ai: ['Claude 3.5 (API)'],
    rischio: 'basso',
    status: 'conforme',
    data_verifica: '2025-09-01',
    prossima_revisione: '2026-09-01',
    gpai: true,
    documenti: [
      { tipo: 'dpa', label: 'DPA (Art. 28 GDPR)', stato: 'presente', scadenza: '2026-09-01' },
      { tipo: 'gdpr_rep', label: 'Rappresentante UE', stato: 'presente' },
      { tipo: 'ai_act_cert', label: 'GPAI Compliance Notice', stato: 'presente' },
    ],
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const RISK_CONFIG: Record<VendorRisk, { label: string; badge: string; dot: string }> = {
  basso:   { label: 'Basso',   badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  medio:   { label: 'Medio',   badge: 'bg-amber-50 text-amber-700 border-amber-200',       dot: 'bg-amber-500' },
  alto:    { label: 'Alto',    badge: 'bg-orange-50 text-orange-700 border-orange-200',     dot: 'bg-orange-500' },
  critico: { label: 'Critico', badge: 'bg-red-50 text-red-700 border-red-200',             dot: 'bg-red-500' },
};

const STATUS_CONFIG: Record<VendorStatus, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  conforme:      { label: 'Conforme',      icon: CheckCircle2,  color: 'text-emerald-500' },
  in_revisione:  { label: 'In revisione',  icon: Clock,         color: 'text-amber-500' },
  non_conforme:  { label: 'Non conforme',  icon: XCircle,       color: 'text-red-500' },
  da_verificare: { label: 'Da verificare', icon: AlertTriangle, color: 'text-orange-500' },
};

const DOC_STATUS: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  presente: { icon: CheckCircle2, color: 'text-emerald-500' },
  assente:  { icon: XCircle,      color: 'text-red-400' },
  scaduto:  { icon: AlertTriangle,color: 'text-amber-500' },
};

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
}

function daysUntil(iso: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [y, m, d] = iso.split('-').map(Number);
  return Math.round((new Date(y, m - 1, d).getTime() - today.getTime()) / 86400000);
}

// ─── Vendor card ─────────────────────────────────────────────────────────────

function VendorCard({ vendor, selected, onSelect }: { vendor: Vendor; selected: boolean; onSelect: () => void }) {
  const riskCfg = RISK_CONFIG[vendor.rischio];
  const statusCfg = STATUS_CONFIG[vendor.status];
  const StatusIcon = statusCfg.icon;
  const docScore = Math.round((vendor.documenti.filter(d => d.stato === 'presente').length / vendor.documenti.length) * 100);

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left bg-white border rounded-xl p-4 transition-all ${
        selected ? 'border-[#185FA5] ring-2 ring-[#185FA5]/20' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold text-white ${
          selected ? 'bg-[#185FA5]' : 'bg-[#042C53]'
        }`}>
          {vendor.nome.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <p className="text-sm font-semibold text-[#042C53]">{vendor.nome}</p>
              <p className="text-xs text-gray-400">{vendor.categoria} · {vendor.paese}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {vendor.gpai && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">GPAI</span>
              )}
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${riskCfg.badge}`}>
                {riskCfg.label}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <StatusIcon className={`h-3.5 w-3.5 ${statusCfg.color}`} />
              <span className={`text-[11px] font-medium ${statusCfg.color}`}>{statusCfg.label}</span>
            </div>
            <span className="text-[11px] text-gray-400">Documenti: {docScore}%</span>
            <span className="text-[11px] text-gray-400">Rev. {formatDate(vendor.prossima_revisione)}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AppVendorManagement() {
  const [selectedId, setSelectedId] = useState<string>('v2');
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState<VendorRisk | 'tutti'>('tutti');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newVendorName, setNewVendorName] = useState('');
  const [addedMsg, setAddedMsg] = useState(false);

  const selected = VENDORS.find(v => v.id === selectedId)!;

  const filtered = VENDORS.filter(v => {
    const matchSearch = !search || v.nome.toLowerCase().includes(search.toLowerCase()) || v.categoria.toLowerCase().includes(search.toLowerCase());
    const matchRisk = filterRisk === 'tutti' || v.rischio === filterRisk;
    return matchSearch && matchRisk;
  });

  const stats = {
    totali: VENDORS.length,
    conformi: VENDORS.filter(v => v.status === 'conforme').length,
    critici: VENDORS.filter(v => v.rischio === 'critico' || v.rischio === 'alto').length,
    da_aggiornare: VENDORS.filter(v => v.documenti.some(d => d.stato === 'assente' || d.stato === 'scaduto')).length,
  };

  const handleAddVendor = () => {
    setAddedMsg(true);
    setTimeout(() => { setAddedMsg(false); setShowNewModal(false); setNewVendorName(''); }, 1800);
  };

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#042C53] flex items-center gap-2">
            <Building2 className="h-6 w-6 text-[#185FA5]" />
            Vendor Management
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gestione fornitori AI — DPA, conformità AI Act, rischio terze parti
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
            <Download className="h-4 w-4" /> Esporta
          </button>
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 bg-[#042C53] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4" /> Aggiungi fornitore
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Fornitori AI', value: stats.totali, color: 'text-[#042C53]' },
          { label: 'Conformi', value: stats.conformi, color: 'text-emerald-600' },
          { label: 'Rischio alto/critico', value: stats.critici, color: 'text-red-600' },
          { label: 'Doc. da aggiornare', value: stats.da_aggiornare, color: 'text-amber-600' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Main layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5">

        {/* List */}
        <div className="space-y-3">
          {/* Search + filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cerca fornitore..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#042C53]/20"
              />
            </div>
            {(['tutti', 'basso', 'medio', 'alto', 'critico'] as const).map(r => (
              <button
                key={r}
                onClick={() => setFilterRisk(r)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  filterRisk === r ? 'bg-[#042C53] text-white border-[#042C53]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {r === 'tutti' ? 'Tutti' : RISK_CONFIG[r].label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filtered.map(v => (
              <VendorCard
                key={v.id}
                vendor={v}
                selected={selectedId === v.id}
                onSelect={() => setSelectedId(v.id)}
              />
            ))}
          </div>
        </div>

        {/* Detail */}
        {selected && (
          <div className="bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-xl bg-[#042C53] flex items-center justify-center text-white font-bold shrink-0">
                  {selected.nome.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-[#042C53]">{selected.nome}</h2>
                    {selected.gpai && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">GPAI</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500">{selected.categoria}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-500">{selected.paese}</span>
                    <a href={`https://${selected.website}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#185FA5] hover:underline flex items-center gap-0.5">
                      {selected.website} <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Risk + status */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Rischio</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`h-2 w-2 rounded-full ${RISK_CONFIG[selected.rischio].dot}`} />
                    <span className="text-sm font-semibold text-[#042C53]">{RISK_CONFIG[selected.rischio].label}</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Stato conformità</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {(() => { const Ic = STATUS_CONFIG[selected.status].icon; return <Ic className={`h-4 w-4 ${STATUS_CONFIG[selected.status].color}`} />; })()}
                    <span className={`text-sm font-semibold ${STATUS_CONFIG[selected.status].color}`}>{STATUS_CONFIG[selected.status].label}</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Ultima verifica</p>
                  <p className="text-sm font-medium text-[#042C53] mt-0.5">{formatDate(selected.data_verifica)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Prossima revisione</p>
                  <p className={`text-sm font-medium mt-0.5 ${daysUntil(selected.prossima_revisione) <= 30 ? 'text-amber-600' : 'text-[#042C53]'}`}>
                    {formatDate(selected.prossima_revisione)}
                  </p>
                </div>
              </div>

              {/* Sistemi AI */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Sistemi AI forniti</p>
                <div className="space-y-1">
                  {selected.sistemi_ai.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                      <Shield className="h-3.5 w-3.5 text-gray-300 shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Documenti */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Documenti e certificazioni</p>
                <div className="space-y-1.5">
                  {selected.documenti.map((doc, i) => {
                    const cfg = DOC_STATUS[doc.stato];
                    const StatusIc = cfg.icon;
                    return (
                      <div key={i} className={`flex items-center justify-between px-3 py-2.5 rounded-lg border ${
                        doc.stato === 'presente' ? 'bg-emerald-50 border-emerald-200' :
                        doc.stato === 'scaduto' ? 'bg-amber-50 border-amber-200' :
                        'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          <StatusIc className={`h-4 w-4 shrink-0 ${cfg.color}`} />
                          <span className="text-xs font-medium text-gray-700">{doc.label}</span>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] font-semibold ${
                            doc.stato === 'presente' ? 'text-emerald-600' :
                            doc.stato === 'scaduto' ? 'text-amber-600' :
                            'text-red-600'
                          }`}>
                            {doc.stato === 'presente' ? 'Presente' : doc.stato === 'scaduto' ? 'Scaduto' : 'Assente'}
                          </span>
                          {doc.scadenza && <p className="text-[10px] text-gray-400">{formatDate(doc.scadenza)}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Note */}
              {selected.note && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 text-xs text-amber-800 leading-relaxed">
                  ⚠️ {selected.note}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-5 py-4 border-t border-gray-100 space-y-2">
              {(selected.status === 'non_conforme' || selected.status === 'da_verificare') && (
                <button className="w-full flex items-center justify-center gap-2 bg-[#042C53] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Avvia richiesta documentazione
                </button>
              )}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm transition-colors">
                  <FileText className="h-4 w-4" /> DPA
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm transition-colors">
                  <Shield className="h-4 w-4" /> Valuta rischio
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── New vendor modal ── */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            {addedMsg ? (
              <div className="text-center py-4">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                <p className="text-lg font-bold text-[#042C53]">Fornitore aggiunto!</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-[#042C53]">Aggiungi fornitore AI</h2>
                  <button onClick={() => setShowNewModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome fornitore</label>
                    <input
                      value={newVendorName}
                      onChange={e => setNewVendorName(e.target.value)}
                      placeholder="Es. Microsoft Azure AI"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#042C53]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoria</label>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                      <option>AI Generativa</option>
                      <option>HR Software</option>
                      <option>CRM / Marketing</option>
                      <option>Analisi dati</option>
                      <option>Sicurezza informatica</option>
                      <option>Altro</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Paese</label>
                      <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                        <option>USA</option>
                        <option>UE</option>
                        <option>UK</option>
                        <option>Altro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Rischio stimato</label>
                      <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                        <option value="basso">Basso</option>
                        <option value="medio">Medio</option>
                        <option value="alto">Alto</option>
                        <option value="critico">Critico</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="gpai" className="rounded" />
                    <label htmlFor="gpai" className="text-sm text-gray-700">Fornitore di modelli GPAI (es. LLM)</label>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowNewModal(false)} className="flex-1 border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                    Annulla
                  </button>
                  <button
                    onClick={handleAddVendor}
                    disabled={!newVendorName}
                    className="flex-1 bg-[#042C53] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
                  >
                    Aggiungi
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
