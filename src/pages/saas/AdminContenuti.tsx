import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { mockMonitorAggiornamenti } from '@/data/tutelaiMockData';

type Urgenza = 'critico' | 'attenzione' | 'info';

const urgenzaStyles: Record<string, string> = {
  critico: 'bg-red-50 text-red-700 border-red-200',
  attenzione: 'bg-amber-50 text-amber-700 border-amber-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
};

const fonteOptions = [
  { value: 'garante', label: 'Garante Privacy' },
  { value: 'commissione_ue', label: 'Commissione UE' },
  { value: 'acn', label: 'ACN' },
  { value: 'enisa', label: 'ENISA' },
  { value: 'legge_132', label: 'Legge 132/2025' },
  { value: 'altro', label: 'Altro' },
];

const urgenzaOptions: Urgenza[] = ['critico', 'attenzione', 'info'];

interface NewEntry {
  titolo: string;
  fonte: string;
  urgenza: Urgenza;
  data: string;
  sintesi: string;
  sistemi_impattati: string;
  azioni_suggerite: string;
  scadenza_azione: string;
}

const emptyForm: NewEntry = {
  titolo: '',
  fonte: 'garante',
  urgenza: 'info',
  data: new Date().toISOString().slice(0, 10),
  sintesi: '',
  sistemi_impattati: '',
  azioni_suggerite: '',
  scadenza_azione: '',
};

export default function AdminContenuti() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NewEntry>(emptyForm);

  const update = (field: keyof NewEntry, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // In a real app, would persist to backend
    setShowModal(false);
    setForm(emptyForm);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-[#1a375b]">Contenuti AI Monitor</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#1a375b] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" /> Nuovo aggiornamento
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Titolo', 'Fonte', 'Urgenza', 'Data', 'Sistemi impattati', 'Stato', 'Azioni'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockMonitorAggiornamenti.map((agg) => (
                <tr key={agg.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-[#1a375b] max-w-xs">{agg.titolo}</p>
                    <p className="text-xs text-gray-400 mt-0.5 max-w-xs line-clamp-1">{agg.sintesi}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{agg.fonte_label}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${urgenzaStyles[agg.urgenza] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                      {agg.urgenza}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{agg.data}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-center">{agg.sistemi_impattati.length}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${agg.letto ? 'bg-gray-50 text-gray-500 border-gray-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                      {agg.letto ? 'Letto' : 'Nuovo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-[#185FA5] hover:underline font-medium mr-3">Modifica</button>
                    <button className="text-xs text-red-500 hover:underline font-medium">Elimina</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New content modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-6 my-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#1a375b]">Nuovo aggiornamento</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Titolo *</label>
                <input
                  type="text"
                  value={form.titolo}
                  onChange={(e) => update('titolo', e.target.value)}
                  placeholder="Es. Garante — Nuove linee guida AI"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a375b]/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Fonte *</label>
                  <select
                    value={form.fonte}
                    onChange={(e) => update('fonte', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  >
                    {fonteOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Urgenza *</label>
                  <select
                    value={form.urgenza}
                    onChange={(e) => update('urgenza', e.target.value as Urgenza)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  >
                    {urgenzaOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Data *</label>
                  <input
                    type="date"
                    value={form.data}
                    onChange={(e) => update('data', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Scadenza azione</label>
                  <input
                    type="date"
                    value={form.scadenza_azione}
                    onChange={(e) => update('scadenza_azione', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Sintesi *</label>
                <textarea
                  rows={3}
                  value={form.sintesi}
                  onChange={(e) => update('sintesi', e.target.value)}
                  placeholder="Descrivi brevemente il contenuto dell'aggiornamento normativo..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Sistemi impattati (ID separati da virgola)</label>
                <input
                  type="text"
                  value={form.sistemi_impattati}
                  onChange={(e) => update('sistemi_impattati', e.target.value)}
                  placeholder="ai-001, ai-004"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Azioni suggerite</label>
                <textarea
                  rows={2}
                  value={form.azioni_suggerite}
                  onChange={(e) => update('azioni_suggerite', e.target.value)}
                  placeholder="Es. Genera disclosure per Voice Agent"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setForm(emptyForm); }} className="flex-1 border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Annulla
              </button>
              <button
                onClick={handleSave}
                disabled={!form.titolo || !form.sintesi}
                className="flex-1 bg-[#1a375b] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                Pubblica aggiornamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
