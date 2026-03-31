import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plus, Sparkles, Download, Pencil, ChevronRight, X, Check,
} from 'lucide-react';
import { mockDataProcessings, mockAiSystems } from '@/data/tutelaiMockData';
import type { DataProcessing, RischioGdpr, StatoDpia, BaseGiuridica } from '@/types/saas';

const RISCHIO_BADGE: Record<RischioGdpr, string> = {
  alto:  'bg-[#FDEAEA] text-[#8B1A1A]',
  medio: 'bg-[#FDF3E3] text-[#854F0B]',
  basso: 'bg-[#EAF5EE] text-[#1D6B3A]',
};

const DPIA_BADGE: Record<StatoDpia, { label: string; cls: string }> = {
  non_richiesta: { label: 'Non richiesta', cls: 'bg-gray-100 text-gray-600' },
  in_corso:      { label: 'In corso',      cls: 'bg-[#FDF3E3] text-[#854F0B]' },
  completata:    { label: 'Completata',    cls: 'bg-[#EAF5EE] text-[#1D6B3A]' },
  da_aggiornare: { label: 'Da aggiornare', cls: 'bg-orange-100 text-orange-700' },
};

const BASE_LABELS: Record<BaseGiuridica, string> = {
  contratto:        'Contratto',
  legittimo:        'Legittimo interesse',
  consenso:         'Consenso',
  obbligo_legale:   'Obbligo legale',
  interesse_vitale: 'Interesse vitale',
  pubblico:         'Interesse pubblico',
};

interface AddForm {
  trattamento: string;
  base_giuridica: BaseGiuridica;
  sistema_ai_id: string;
  rischio: RischioGdpr;
  trasferimento_internazionale: boolean;
}

const EMPTY_FORM: AddForm = {
  trattamento: '',
  base_giuridica: 'contratto',
  sistema_ai_id: '',
  rischio: 'basso',
  trasferimento_internazionale: false,
};

export default function AppGdprRegister() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<DataProcessing[]>(mockDataProcessings);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AddForm>(EMPTY_FORM);
  const [toast, setToast] = useState<string | null>(null);

  function showToastMsg(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleGenerateFromAI() {
    const existingIds = new Set(rows.map((r) => r.sistema_ai_id).filter(Boolean));
    const missing = mockAiSystems.filter((s) => !existingIds.has(s.id));
    if (missing.length === 0) {
      showToastMsg('Tutti i sistemi AI sono già nel registro.');
      return;
    }
    const newRows: DataProcessing[] = missing.map((s) => ({
      id: `dp-gen-${s.id}`,
      tenant_id: 'tenant-aedix',
      trattamento: `Trattamento — ${s.nome}`,
      base_giuridica: 'legittimo' as BaseGiuridica,
      sistema_ai_id: s.id,
      sistema_ai_nome: s.nome,
      rischio: (s.rischio === 'alto' ? 'alto' : s.rischio === 'minimo' ? 'basso' : 'medio') as RischioGdpr,
      stato_dpia: 'non_richiesta' as StatoDpia,
      trasferimento_internazionale: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
    setRows((prev) => [...prev, ...newRows]);
    showToastMsg(`${newRows.length} trattamenti aggiunti da AI Registry.`);
  }

  function handleAdd() {
    if (!form.trattamento.trim()) return;
    const aiSystem = mockAiSystems.find((s) => s.id === form.sistema_ai_id);
    const newRow: DataProcessing = {
      id: `dp-new-${Date.now()}`,
      tenant_id: 'tenant-aedix',
      trattamento: form.trattamento,
      base_giuridica: form.base_giuridica,
      sistema_ai_id: form.sistema_ai_id || undefined,
      sistema_ai_nome: aiSystem?.nome,
      rischio: form.rischio,
      stato_dpia: 'non_richiesta',
      trasferimento_internazionale: form.trasferimento_internazionale,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setRows((prev) => [...prev, newRow]);
    setForm(EMPTY_FORM);
    setShowForm(false);
    showToastMsg('Trattamento aggiunto con successo.');
  }

  return (
    <div className="p-6 space-y-6 bg-[#FAFAF8] min-h-full">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#1a375b] text-white px-5 py-3 rounded-xl shadow-lg text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-green-300" />
          {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/app/gdpr" className="inline-flex items-center gap-1.5 text-sm text-[#185FA5] hover:underline mb-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            GDPR+AI
          </Link>
          <h1 className="text-2xl font-bold text-[#1a375b]">Registro dei Trattamenti — Art. 30 GDPR</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#1a375b] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Aggiungi trattamento
          </button>
          <button
            onClick={handleGenerateFromAI}
            className="border border-[#C8C5BC] hover:bg-gray-50 text-[#1a375b] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#185FA5]" />
            Genera da AI Registry
          </button>
          <button className="border border-[#C8C5BC] hover:bg-gray-50 text-[#1a375b] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Esporta XML/PDF
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white border border-[#185FA5] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#1a375b]">Nuovo trattamento</h3>
            <button onClick={() => setShowForm(false)}>
              <X className="w-4 h-4 text-gray-400 hover:text-gray-700" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Trattamento *</label>
              <input
                value={form.trattamento}
                onChange={(e) => setForm((f) => ({ ...f, trattamento: e.target.value }))}
                placeholder="Es. Gestione candidature con AI"
                className="w-full border border-[#C8C5BC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#185FA5]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Base giuridica</label>
              <select
                value={form.base_giuridica}
                onChange={(e) => setForm((f) => ({ ...f, base_giuridica: e.target.value as BaseGiuridica }))}
                className="w-full border border-[#C8C5BC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#185FA5]"
              >
                {(Object.entries(BASE_LABELS) as [BaseGiuridica, string][]).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Sistema AI</label>
              <select
                value={form.sistema_ai_id}
                onChange={(e) => setForm((f) => ({ ...f, sistema_ai_id: e.target.value }))}
                className="w-full border border-[#C8C5BC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#185FA5]"
              >
                <option value="">— Nessuno —</option>
                {mockAiSystems.map((s) => (
                  <option key={s.id} value={s.id}>{s.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Rischio</label>
              <select
                value={form.rischio}
                onChange={(e) => setForm((f) => ({ ...f, rischio: e.target.value as RischioGdpr }))}
                className="w-full border border-[#C8C5BC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#185FA5]"
              >
                <option value="basso">Basso</option>
                <option value="medio">Medio</option>
                <option value="alto">Alto</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="trasf"
                checked={form.trasferimento_internazionale}
                onChange={(e) => setForm((f) => ({ ...f, trasferimento_internazionale: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="trasf" className="text-sm text-gray-700">Trasferimento internazionale</label>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="bg-[#1a375b] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Aggiungi
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="border border-[#C8C5BC] hover:bg-gray-50 text-[#1a375b] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Annulla
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border border-[#C8C5BC] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-[#C8C5BC]">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Trattamento</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Base giuridica</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Sistema AI</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Rischio</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Stato DPIA</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => {
                const dpia = DPIA_BADGE[row.stato_dpia];
                return (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-[#1a375b]">
                      {row.trattamento}
                      {row.trasferimento_internazionale && (
                        <span className="ml-2 text-xs text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">INT</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{BASE_LABELS[row.base_giuridica]}</td>
                    <td className="px-4 py-3 text-gray-600">{row.sistema_ai_nome ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${RISCHIO_BADGE[row.rischio]}`}>
                        {row.rischio.charAt(0).toUpperCase() + row.rischio.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${dpia.cls}`}>
                        {dpia.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate('/app/gdpr')}
                          className="border border-[#C8C5BC] hover:bg-gray-50 text-[#1a375b] px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                          Dettaglio
                        </button>
                        <button className="border border-[#C8C5BC] hover:bg-gray-50 text-[#1a375b] px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                          Modifica
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
          {rows.length} trattamenti registrati
        </div>
      </div>
    </div>
  );
}
