import { useState } from 'react';
import { FileSignature, Send, CheckCircle2, Clock, XCircle, AlertTriangle, Plus, Download, Eye, ChevronRight, User, Mail, RefreshCw } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type SignStatus = 'bozza' | 'inviato' | 'firmato_parziale' | 'firmato' | 'scaduto' | 'rifiutato';
type DocType = 'dpa' | 'nda' | 'informativa' | 'contratto' | 'policy';

interface Signatory {
  id: string;
  nome: string;
  email: string;
  ruolo: string;
  signed: boolean;
  signed_at?: string;
}

interface SignDocument {
  id: string;
  titolo: string;
  tipo: DocType;
  stato: SignStatus;
  created_at: string;
  scadenza: string;
  signatories: Signatory[];
  note?: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_DOCUMENTS: SignDocument[] = [
  {
    id: 'sig-001',
    titolo: 'DPA — OpenAI Inc. (Reg. UE 2016/679 Art. 28)',
    tipo: 'dpa',
    stato: 'firmato',
    created_at: '2025-08-10',
    scadenza: '2026-08-10',
    signatories: [
      { id: 's1', nome: 'Marco Rossi', email: 'marco.rossi@aedix.it', ruolo: 'Legale Rappresentante', signed: true, signed_at: '2025-08-12' },
      { id: 's2', nome: 'OpenAI Legal Dept.', email: 'legal@openai.com', ruolo: 'Fornitore', signed: true, signed_at: '2025-08-15' },
    ],
  },
  {
    id: 'sig-002',
    titolo: 'DPA — HiBob Ltd. (Reg. UE 2016/679 Art. 28)',
    tipo: 'dpa',
    stato: 'inviato',
    created_at: '2026-03-10',
    scadenza: '2026-04-10',
    signatories: [
      { id: 's3', nome: 'Marco Rossi', email: 'marco.rossi@aedix.it', ruolo: 'Legale Rappresentante', signed: true, signed_at: '2026-03-11' },
      { id: 's4', nome: 'HiBob Legal', email: 'legal@hibob.com', ruolo: 'Fornitore', signed: false },
    ],
    note: 'Attesa firma fornitore — sollecito inviato il 20/03/2026',
  },
  {
    id: 'sig-003',
    titolo: 'Informativa Art. 13 GDPR + AI per Dipendenti',
    tipo: 'informativa',
    stato: 'firmato',
    created_at: '2025-07-01',
    scadenza: '2026-07-01',
    signatories: [
      { id: 's5', nome: 'Marco Rossi', email: 'marco.rossi@aedix.it', ruolo: 'Datore di lavoro', signed: true, signed_at: '2025-07-02' },
      { id: 's6', nome: 'Team AEDIX (8 utenti)', email: 'team@aedix.it', ruolo: 'Dipendenti', signed: true, signed_at: '2025-07-10' },
    ],
  },
  {
    id: 'sig-004',
    titolo: 'NDA con Fornitore AI Analytics',
    tipo: 'nda',
    stato: 'scaduto',
    created_at: '2025-01-15',
    scadenza: '2026-01-15',
    signatories: [
      { id: 's7', nome: 'Marco Rossi', email: 'marco.rossi@aedix.it', ruolo: 'AEDIX Srl', signed: true, signed_at: '2025-01-16' },
      { id: 's8', nome: 'Analytics Corp.', email: 'legal@analyticscorp.com', ruolo: 'Fornitore', signed: true, signed_at: '2025-01-20' },
    ],
    note: 'Scaduto il 15/01/2026 — rinnovo necessario',
  },
  {
    id: 'sig-005',
    titolo: 'Clausole AI Act — Contratto Twilio (Art. 25 Reg. 2024/1689)',
    tipo: 'contratto',
    stato: 'bozza',
    created_at: '2026-03-20',
    scadenza: '2026-04-30',
    signatories: [
      { id: 's9', nome: 'Marco Rossi', email: 'marco.rossi@aedix.it', ruolo: 'AEDIX Srl', signed: false },
      { id: 's10', nome: 'Twilio Legal', email: 'legal@twilio.com', ruolo: 'Fornitore', signed: false },
    ],
    note: 'Bozza in revisione legale',
  },
  {
    id: 'sig-006',
    titolo: 'Policy Uso AI Interno — Aggiornamento 2026',
    tipo: 'policy',
    stato: 'firmato_parziale',
    created_at: '2026-03-01',
    scadenza: '2026-04-01',
    signatories: [
      { id: 's11', nome: 'Marco Rossi', email: 'marco.rossi@aedix.it', ruolo: 'CEO', signed: true, signed_at: '2026-03-05' },
      { id: 's12', nome: 'Sofia Ricci', email: 'sofia.ricci@aedix.it', ruolo: 'AI Officer', signed: true, signed_at: '2026-03-06' },
      { id: 's13', nome: 'Luca Verdi', email: 'luca.verdi@aedix.it', ruolo: 'CTO', signed: false },
    ],
    note: 'Manca firma CTO — sollecitare',
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<SignStatus, { label: string; icon: React.ComponentType<{ className?: string }>; badge: string; dot: string }> = {
  bozza:           { label: 'Bozza',           icon: FileSignature, badge: 'bg-gray-100 text-gray-600 border-gray-200',       dot: 'bg-gray-400' },
  inviato:         { label: 'In attesa firma', icon: Clock,          badge: 'bg-blue-50 text-blue-700 border-blue-200',         dot: 'bg-blue-500' },
  firmato_parziale:{ label: 'Firma parziale',  icon: AlertTriangle,  badge: 'bg-amber-50 text-amber-700 border-amber-200',      dot: 'bg-amber-500' },
  firmato:         { label: 'Firmato',         icon: CheckCircle2,   badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  scaduto:         { label: 'Scaduto',         icon: XCircle,        badge: 'bg-red-50 text-red-700 border-red-200',            dot: 'bg-red-500' },
  rifiutato:       { label: 'Rifiutato',       icon: XCircle,        badge: 'bg-red-50 text-red-700 border-red-200',            dot: 'bg-red-500' },
};

const DOC_TYPE_CONFIG: Record<DocType, { label: string; bg: string; text: string }> = {
  dpa:        { label: 'DPA',        bg: 'bg-purple-50', text: 'text-purple-700' },
  nda:        { label: 'NDA',        bg: 'bg-slate-100', text: 'text-slate-700' },
  informativa:{ label: 'Informativa',bg: 'bg-blue-50',   text: 'text-blue-700' },
  contratto:  { label: 'Contratto',  bg: 'bg-indigo-50', text: 'text-indigo-700' },
  policy:     { label: 'Policy',     bg: 'bg-teal-50',   text: 'text-teal-700' },
};

function daysUntil(iso: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [y, m, d] = iso.split('-').map(Number);
  return Math.round((new Date(y, m - 1, d).getTime() - today.getTime()) / 86400000);
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
}

// ─── New document modal ───────────────────────────────────────────────────────

interface NewDocForm {
  titolo: string;
  tipo: DocType;
  email1: string;
  nome1: string;
  ruolo1: string;
  email2: string;
  nome2: string;
  ruolo2: string;
}

const emptyForm: NewDocForm = { titolo: '', tipo: 'dpa', email1: '', nome1: '', ruolo1: '', email2: '', nome2: '', ruolo2: '' };

function NewDocModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<NewDocForm>(emptyForm);
  const [sent, setSent] = useState(false);

  const upd = <K extends keyof NewDocForm>(k: K, v: NewDocForm[K]) => setForm(p => ({ ...p, [k]: v }));

  const handleSend = () => {
    setSent(true);
    setTimeout(onClose, 1800);
  };

  if (sent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-sm w-full mx-4">
          <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
          <p className="text-lg font-bold text-[#1a375b]">Documento inviato!</p>
          <p className="text-sm text-gray-500 mt-1">I firmatari riceveranno una email con il link per firmare.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[#1a375b]">Nuovo documento da firmare</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Titolo documento</label>
            <input value={form.titolo} onChange={e => upd('titolo', e.target.value)} placeholder="Es. DPA con Fornitore XYZ" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a375b]/20" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo documento</label>
            <select value={form.tipo} onChange={e => upd('tipo', e.target.value as DocType)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
              <option value="dpa">DPA (Data Processing Agreement)</option>
              <option value="nda">NDA (Non-Disclosure Agreement)</option>
              <option value="informativa">Informativa Privacy</option>
              <option value="contratto">Contratto</option>
              <option value="policy">Policy interna</option>
            </select>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Firmatario 1</p>
            <div className="grid grid-cols-3 gap-2">
              <input value={form.nome1} onChange={e => upd('nome1', e.target.value)} placeholder="Nome" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
              <input value={form.email1} onChange={e => upd('email1', e.target.value)} placeholder="Email" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
              <input value={form.ruolo1} onChange={e => upd('ruolo1', e.target.value)} placeholder="Ruolo" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Firmatario 2</p>
            <div className="grid grid-cols-3 gap-2">
              <input value={form.nome2} onChange={e => upd('nome2', e.target.value)} placeholder="Nome" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
              <input value={form.email2} onChange={e => upd('email2', e.target.value)} placeholder="Email" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
              <input value={form.ruolo2} onChange={e => upd('ruolo2', e.target.value)} placeholder="Ruolo" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-xs text-blue-700">
            📧 I firmatari riceveranno un'email con link sicuro per la firma elettronica (FEA). La firma ha valenza legale ai sensi del Reg. UE 910/2014 (eIDAS).
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
            Annulla
          </button>
          <button
            onClick={handleSend}
            disabled={!form.titolo || !form.email1}
            className="flex-1 flex items-center justify-center gap-2 bg-[#1a375b] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Send className="h-4 w-4" /> Invia per firma
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AppFirmaDigitale() {
  const [selectedId, setSelectedId] = useState<string | null>('sig-002');
  const [showModal, setShowModal] = useState(false);
  const [filterStato, setFilterStato] = useState<SignStatus | 'tutti'>('tutti');

  const stats = {
    totali: MOCK_DOCUMENTS.length,
    firmati: MOCK_DOCUMENTS.filter(d => d.stato === 'firmato').length,
    attesa: MOCK_DOCUMENTS.filter(d => d.stato === 'inviato' || d.stato === 'firmato_parziale').length,
    urgenti: MOCK_DOCUMENTS.filter(d => d.stato !== 'firmato' && d.stato !== 'rifiutato' && daysUntil(d.scadenza) <= 30 && daysUntil(d.scadenza) >= 0).length,
  };

  const filtered = filterStato === 'tutti' ? MOCK_DOCUMENTS : MOCK_DOCUMENTS.filter(d => d.stato === filterStato);
  const selected = MOCK_DOCUMENTS.find(d => d.id === selectedId);

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1a375b] flex items-center gap-2">
            <FileSignature className="h-6 w-6 text-[#185FA5]" />
            Firma Digitale
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">DPA, NDA, informative e contratti AI — firma elettronica avanzata (FEA)</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#1a375b] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" /> Nuovo documento
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Totali', value: stats.totali, color: 'text-[#1a375b]', bg: 'bg-white' },
          { label: 'Firmati', value: stats.firmati, color: 'text-emerald-600', bg: 'bg-white' },
          { label: 'In attesa', value: stats.attesa, color: 'text-blue-600', bg: 'bg-white' },
          { label: 'Scadenza 30gg', value: stats.urgenti, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(s => (
          <div key={s.label} className={`border border-gray-200 rounded-xl p-4 text-center ${s.bg}`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Main layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5">

        {/* List */}
        <div className="space-y-3">
          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {(['tutti', 'inviato', 'firmato_parziale', 'firmato', 'scaduto', 'bozza'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterStato(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  filterStato === s ? 'bg-[#1a375b] text-white border-[#1a375b]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {s === 'tutti' ? 'Tutti' : STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>

          {/* Document list */}
          <div className="space-y-2">
            {filtered.map(doc => {
              const cfg = STATUS_CONFIG[doc.stato];
              const StatusIcon = cfg.icon;
              const typeCfg = DOC_TYPE_CONFIG[doc.tipo];
              const days = daysUntil(doc.scadenza);
              const isSelected = selectedId === doc.id;

              return (
                <button
                  key={doc.id}
                  onClick={() => setSelectedId(doc.id)}
                  className={`w-full text-left bg-white border rounded-xl p-4 transition-all ${
                    isSelected ? 'border-[#185FA5] ring-2 ring-[#185FA5]/20' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#E6F1FB]' : 'bg-gray-100'}`}>
                      <FileSignature className={`h-5 w-5 ${isSelected ? 'text-[#185FA5]' : 'text-gray-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold text-[#1a375b] leading-snug">{doc.titolo}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 flex items-center gap-1 ${cfg.badge}`}>
                          <StatusIcon className="h-3 w-3" />
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${typeCfg.bg} ${typeCfg.text}`}>{typeCfg.label}</span>
                        <span>Scadenza: {formatDate(doc.scadenza)}</span>
                        {doc.stato !== 'firmato' && doc.stato !== 'rifiutato' && (
                          <span className={`font-medium ${days < 0 ? 'text-red-500' : days <= 30 ? 'text-amber-500' : 'text-gray-400'}`}>
                            {days < 0 ? `${Math.abs(days)}g scaduto` : `tra ${days}g`}
                          </span>
                        )}
                      </div>
                      {/* Progress dots */}
                      <div className="flex items-center gap-1.5 mt-2">
                        {doc.signatories.map(sig => (
                          <div key={sig.id} className="flex items-center gap-1">
                            <div className={`h-4 w-4 rounded-full flex items-center justify-center ${sig.signed ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                              {sig.signed && <CheckCircle2 className="h-3 w-3 text-white" />}
                            </div>
                          </div>
                        ))}
                        <span className="text-[10px] text-gray-400 ml-1">
                          {doc.signatories.filter(s => s.signed).length}/{doc.signatories.length} firme
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 text-gray-300 shrink-0 mt-1 ${isSelected ? 'text-[#185FA5]' : ''}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        {selected ? (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-[#1a375b] leading-snug">{selected.titolo}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${DOC_TYPE_CONFIG[selected.tipo].bg} ${DOC_TYPE_CONFIG[selected.tipo].text}`}>
                      {DOC_TYPE_CONFIG[selected.tipo].label}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${STATUS_CONFIG[selected.stato].badge}`}>
                      {selected.stato === 'firmato' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {STATUS_CONFIG[selected.stato].label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Creato il</p>
                  <p className="text-sm font-medium text-[#1a375b] mt-0.5">{formatDate(selected.created_at)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Scadenza</p>
                  <p className={`text-sm font-medium mt-0.5 ${daysUntil(selected.scadenza) < 0 ? 'text-red-600' : daysUntil(selected.scadenza) <= 30 ? 'text-amber-600' : 'text-[#1a375b]'}`}>
                    {formatDate(selected.scadenza)}
                  </p>
                </div>
              </div>

              {/* Note */}
              {selected.note && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 text-xs text-amber-700">
                  ⚠️ {selected.note}
                </div>
              )}

              {/* Signatories */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Firmatari</p>
                <div className="space-y-2">
                  {selected.signatories.map(sig => (
                    <div key={sig.id} className={`flex items-center gap-3 p-3 rounded-xl border ${sig.signed ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${sig.signed ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                        {sig.signed ? <CheckCircle2 className="h-4 w-4 text-white" /> : <User className="h-4 w-4 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1a375b]">{sig.nome}</p>
                        <p className="text-xs text-gray-400">{sig.email}</p>
                        <p className="text-[10px] text-gray-400">{sig.ruolo}</p>
                      </div>
                      <div className="text-right shrink-0">
                        {sig.signed ? (
                          <div>
                            <span className="text-[10px] font-semibold text-emerald-600">Firmato</span>
                            {sig.signed_at && <p className="text-[10px] text-gray-400">{formatDate(sig.signed_at)}</p>}
                          </div>
                        ) : (
                          <span className="text-[10px] text-amber-600 font-semibold">In attesa</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-5 py-4 border-t border-gray-100 space-y-2">
              {(selected.stato === 'inviato' || selected.stato === 'firmato_parziale') && (
                <button className="w-full flex items-center justify-center gap-2 bg-[#185FA5] hover:bg-[#1a375b] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <RefreshCw className="h-4 w-4" /> Invia sollecito
                </button>
              )}
              {selected.stato === 'bozza' && (
                <button className="w-full flex items-center justify-center gap-2 bg-[#1a375b] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Send className="h-4 w-4" /> Invia per firma
                </button>
              )}
              {selected.stato === 'scaduto' && (
                <button className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <RefreshCw className="h-4 w-4" /> Rinnova documento
                </button>
              )}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Eye className="h-4 w-4" /> Anteprima
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Download className="h-4 w-4" /> Scarica
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Mail className="h-4 w-4" /> Condividi
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center h-64 text-center">
            <FileSignature className="h-10 w-10 text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">Seleziona un documento per vedere i dettagli</p>
          </div>
        )}
      </div>

      {showModal && <NewDocModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
