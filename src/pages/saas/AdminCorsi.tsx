import React, { useState } from 'react';
import { Plus, X, ChevronDown, ChevronUp, Clock, BookOpen } from 'lucide-react';
import { mockCorsi, mockEnrollments } from '@/data/tutelaiMockData';

type Categoria = 'base' | 'avanzato' | 'specialistico';

interface NewCorso {
  titolo: string;
  descrizione: string;
  durata_minuti: number;
  categoria: Categoria;
  obbligatorio: boolean;
  riferimento_normativo: string;
}

const emptyCorso: NewCorso = {
  titolo: '',
  descrizione: '',
  durata_minuti: 30,
  categoria: 'base',
  obbligatorio: false,
  riferimento_normativo: '',
};

export default function AdminCorsi() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NewCorso>(emptyCorso);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const update = <K extends keyof NewCorso>(field: K, value: NewCorso[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const getEnrollments = (corsoId: string) =>
    mockEnrollments.filter((e) => e.corso_id === corsoId);

  const getCompletions = (corsoId: string) =>
    mockEnrollments.filter((e) => e.corso_id === corsoId && e.stato === 'completato').length;

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-[#1a375b]">Corsi Training</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#1a375b] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" /> Nuovo corso
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Titolo', 'Durata', 'Categoria', 'Obbligatorio', 'Moduli', 'Iscrizioni', 'Completamenti', 'Azioni'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockCorsi.map((corso) => {
                const enrollments = getEnrollments(corso.id);
                const completions = getCompletions(corso.id);
                const isExpanded = expandedId === corso.id;
                return (
                  <React.Fragment key={corso.id}>
                    <tr className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-[#1a375b]">{corso.titolo}</p>
                        <p className="text-xs text-gray-400 mt-0.5 max-w-xs line-clamp-1">{corso.descrizione}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="h-3.5 w-3.5 text-gray-400" />
                          {corso.durata_minuti} min
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${corso.categoria === 'base' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-violet-50 text-violet-700 border-violet-200'}`}>
                          {corso.categoria}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${corso.obbligatorio ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                          {corso.obbligatorio ? 'Si' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 text-center">{corso.moduli.length}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 text-center">{enrollments.length}</td>
                      <td className="px-4 py-3 text-sm text-center">
                        <span className="font-semibold text-emerald-600">{completions}</span>
                        <span className="text-gray-400 text-xs"> / {enrollments.length}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleExpand(corso.id)}
                            className="flex items-center gap-1 text-xs text-[#185FA5] hover:underline font-medium"
                          >
                            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                            {isExpanded ? 'Chiudi' : 'Modifica'}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${corso.id}-expanded`} className="bg-blue-50/30">
                        <td colSpan={8} className="px-6 py-4 border-b border-gray-100">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Dettagli corso</p>
                              <div className="space-y-2">
                                <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
                                  <p className="text-[11px] text-gray-400">Riferimento normativo</p>
                                  <p className="text-sm font-medium text-[#1a375b]">{corso.riferimento_normativo}</p>
                                </div>
                                <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
                                  <p className="text-[11px] text-gray-400">Descrizione</p>
                                  <p className="text-sm text-gray-600">{corso.descrizione}</p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Moduli ({corso.moduli.length})</p>
                              <div className="space-y-1.5">
                                {corso.moduli.map((m) => (
                                  <div key={m.id} className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-gray-200">
                                    <BookOpen className="h-3.5 w-3.5 text-gray-300 shrink-0" />
                                    <span className="text-xs font-medium text-[#1a375b] flex-1">{m.titolo}</span>
                                    <span className="text-[11px] text-gray-400">{m.durata_minuti}min</span>
                                    <span className="text-[11px] text-gray-400 capitalize">{m.tipo}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button className="bg-[#1a375b] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                              Salva modifiche
                            </button>
                            <button onClick={() => setExpandedId(null)} className="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                              Chiudi
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New corso modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 my-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#1a375b]">Nuovo corso</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Titolo</label>
                <input type="text" value={form.titolo} onChange={(e) => update('titolo', e.target.value)} placeholder="Es. Privacy AI per manager" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a375b]/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrizione</label>
                <textarea rows={3} value={form.descrizione} onChange={(e) => update('descrizione', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Durata (minuti)</label>
                  <input type="number" value={form.durata_minuti} onChange={(e) => update('durata_minuti', Number(e.target.value))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoria</label>
                  <select value={form.categoria} onChange={(e) => update('categoria', e.target.value as Categoria)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                    <option value="base">Base</option>
                    <option value="avanzato">Avanzato</option>
                    <option value="specialistico">Specialistico</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Riferimento normativo</label>
                <input type="text" value={form.riferimento_normativo} onChange={(e) => update('riferimento_normativo', e.target.value)} placeholder="Es. Art.4 AI Act" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => update('obbligatorio', !form.obbligatorio)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${form.obbligatorio ? 'bg-[#1a375b]' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.obbligatorio ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
                <span className="text-sm text-gray-700">Obbligatorio per tutti</span>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setForm(emptyCorso); }} className="flex-1 border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Annulla
              </button>
              <button
                onClick={() => { setShowModal(false); setForm(emptyCorso); }}
                disabled={!form.titolo}
                className="flex-1 bg-[#1a375b] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                Crea corso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
